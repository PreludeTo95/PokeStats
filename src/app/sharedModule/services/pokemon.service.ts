import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ability, Move, Pokemon, Stat } from './pokemon.model';

@Injectable({
  providedIn: 'root'
})

export class PokemonService {

  defaultPokemon: Pokemon = {
    id: '',
    name: '',
    abilities: [],
    moves: [],
    stats: [],
    types: [],
    normalSprite: undefined,
    shinySprite: undefined,
    showShiny: false,
  }

  currentPokemon: Pokemon = {...this.defaultPokemon};
  smogonBaseUrl = 'https://www.smogon.com/dex/sv/abilities/';

  constructor(
    private httpClient: HttpClient
  ) { }

  getPokemonDetails(pokemonSpecies: string) {
    let baseUrl = "https://pokeapi.co/api/v2/pokemon/";
    let finalUrl = baseUrl + pokemonSpecies;

    let response: Observable<any> = this.httpClient.get<any>(finalUrl);

    return response;
  }

  buildPokemon(pokemonSpecies: string) {
    
    
    this.getPokemonDetails(pokemonSpecies).subscribe({
      next: response => {
        this.resetPokemonProperties();

        this.setCurrentPokemonId(response.id);
        this.setCurrentPokemonName(response.name);
        
        this.setCurrentPokemonAbilities(
          response.abilities.map((element: {ability: {name: string, url: string}, is_hidden: boolean, slot: number}) => ({
            name: element.ability.name,
            pokeApiUrl: element.ability.url,
            smogonUrl: this.smogonBaseUrl + element.ability.name,
            isHidden: element.is_hidden,
            slot: element.slot,
            description: this.getAbilityDescription(element.ability.name)
          }))
        );

        this.setCurrentPokemonMoves(
          response.moves.map((element: { move: { name: string, url: string } }) => ({
            name: element.move.name,
            url: element.move.url
          }))
        );

        this.setCurrentPokemonStats(
          response.stats.map((element: { base_stat: number, effort: number, stat: { name: string, url: string } }) => ({
            name: element.stat.name,
            value: element.base_stat
          }))
        );

        this.setCurrentPokemonTypes(
          response.types.map((element: { slot: number; type: { name: string; url: string } }) => 
            element.type.name
          )
        );

        // Official Art
        this.setCurrentPokemonNormalSprite(response.sprites?.other?.['official-artwork'].front_default);
        this.setCurrentPokemonShinySprite(response.sprites?.other?.['official-artwork'].front_shiny);

        // Pokemon Home
        // this.setCurrentPokemonNormalSprite(response.sprites.other.home.front_default);
        // this.setCurrentPokemonShinySprite(response.sprites.other.home.front_shiny);

        // Pokemon Showdown
        // this.setCurrentPokemonNormalSprite(response.sprites?.other?.showdown.front_default);
        // this.setCurrentPokemonShinySprite(response.sprites?.other?.showdown.front_shiny);
      },
      error: err => {
        console.error('Error fetching data: ', err);
      },
      complete: () => {
        console.log("Data retrieved successfully");
      }
    });
  }

  getAbilityDescription(abilityName: string) {
    let baseUrl = "https://pokeapi.co/api/v2/ability/";
    let finalUrl = baseUrl + abilityName;
    let abilityDescription: string;

    this.httpClient.get<any>(finalUrl).subscribe({
      next: response => {
        abilityDescription = response.flavor_text_entries[response.flavor_text_entries.length - 1].flavor_text;
      },
      error: err => {
        console.error('An error occurred: ' + err);
      },
      complete: () => {
        console.log(abilityDescription);
        return abilityDescription;
      }
    });
  }

  resetPokemonProperties() {
    this.currentPokemon.abilities = [];
    this.currentPokemon.moves = [];
    this.currentPokemon.stats = [];
    this.currentPokemon.types = [];
  }

  setCurrentPokemon(pokemon: Pokemon): void {
    this.currentPokemon = pokemon;
  }
  
  getCurrentPokemon(): Pokemon {
    return this.currentPokemon;
  }

  setCurrentPokemonId(id: string) {
    this.currentPokemon.id = id;
  }

  getCurrentPokemonId(): string {
    return this.currentPokemon.id;
  }

  setCurrentPokemonName(name: string): void {
    this.currentPokemon.name = name;
  }

  getCurrentPokemonName(): string {
    return this.currentPokemon.name;
  }

  setCurrentPokemonAbilities(abilities: Ability[]): void {
    this.currentPokemon.abilities = abilities;
  }

  getCurrentPokemonAbilities(): Ability[] {
    return this.currentPokemon.abilities;
  }

  setCurrentPokemonMoves(moves: Move[]): void {
    this.currentPokemon.moves = moves;
  }

  getCurrentPokemonMoves(): Move[] {
    return this.currentPokemon.moves;
  }

  setCurrentPokemonStats(stats: Stat[]): void {
    this.currentPokemon.stats = stats;
  }

  getCurrentPokemonStats(): Stat[] {
    return this.currentPokemon.stats;
  }

  setCurrentPokemonTypes(types: string[]): void {
    this.currentPokemon.types = types;
  }

  getCurrentPokemonTypes(): string[] {
    return this.currentPokemon.types;
  }

  setCurrentPokemonNormalSprite(sprite: Blob): void {
    this.currentPokemon.normalSprite = sprite;
  }

  getCurrentPokemonNormalSprite(): Blob {
    return this.currentPokemon.normalSprite;
  }

  setCurrentPokemonShinySprite(sprite: Blob): void {
    this.currentPokemon.shinySprite = sprite;
  }

  getCurrentPokemonShinySprite(): Blob {
    return this.currentPokemon.shinySprite;
  }

  setShowShiny(bool: boolean): void {
    this.currentPokemon.showShiny = bool;
  }

  getShowShiny(): boolean {
    return this.currentPokemon.showShiny;
  }

  getDefaultPokemon(): Pokemon {
    return this.defaultPokemon;
  }
}
