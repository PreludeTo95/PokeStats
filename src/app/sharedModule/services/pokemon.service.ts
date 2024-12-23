import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ability, Move, Pokemon, Stat, statName, Type } from './pokemon.model';

@Injectable({
  providedIn: 'root'
})

export class PokemonService {

  defaultPokemon: Pokemon = {
    id: '',
    name: '',
    abilities: [{
        name: '',
        url: '',
        isHidden: false,
        slot: 1
    }],
    moves: [{
        name: '',
        url: ''
    }],
    stats: [{
        name: statName[0],
        value: 0
    },{
        name: statName[1],
        value: 0
    },{
        name: statName[2],
        value: 0
    },{
        name: statName[3],
        value: 0
    },{
        name: statName[4],
        value: 0
    },{
        name: statName[5],
        value: 0
    }],
    types: [
        '', 
        ''
    ],
    normalSprite: undefined,
    shinySprite: undefined,
  }

  currentPokemon: Pokemon = {...this.defaultPokemon};

  constructor(
    private httpClient: HttpClient
  ) { }

  ngOnInit() {
    
  }

  getPokemonDetails(pokemonSpecies: string) {
    let baseUrl = "https://pokeapi.co/api/v2/pokemon/";
    let finalUrl = baseUrl + pokemonSpecies;

    let response: Observable<any> = this.httpClient.get<any>(finalUrl);

    return response;
  }

  buildPokemon(pokemonSpecies: string) {
    this.getPokemonDetails(pokemonSpecies).subscribe({
      next: response => {
        this.currentPokemon.id = response.id;
        this.currentPokemon.name = response.name;

        this.currentPokemon.abilities.length = 0;
        let tempAbility: Ability = {name:'', url:'', isHidden:false, slot:1};
        response.abilities.forEach((element: { ability: { name: string; url: string; }; is_hidden: boolean; slot: number; }) => {
          tempAbility.name = element.ability.name
          tempAbility.url = element.ability.url,
          tempAbility.isHidden = element.is_hidden,
          tempAbility.slot = element.slot

          this.currentPokemon.abilities.push({...tempAbility});
        });

        this.currentPokemon.moves.length = 0;
        let tempMove: Move = {name: '', url: ''};
        response.moves.forEach((element: { move: { name: any; url: any; }; }) => {
          tempMove.name = element.move.name;
          tempMove.url = element.move.url;
          
          this.currentPokemon.moves.push({...tempMove});
        });
        
        this.currentPokemon.stats.length = 0;
        let tempStat: Stat = {name: '', value: 0};
        response.stats.forEach((element: { stat: { name: any; }; base_stat: any; }) => {
          tempStat.name = element.stat.name;
          tempStat.value = element.base_stat
          
          this.currentPokemon.stats.push({...tempStat});
        });

        this.currentPokemon.types.length = 0;
        response.types.forEach((element: { type: { name: string; }; }) => {
          this.currentPokemon.types.push(element.type.name);
        });

        this.currentPokemon.normalSprite = response.sprites?.other?.['official-artwork'].front_default;
        this.currentPokemon.shinySprite = response.sprites?.other?.['official-artwork'].front_shiny;

        // this.currentPokemon.normalSprite = response.sprites.other.home.front_default;
        // this.currentPokemon.shinySprite = response.sprites.other.home.front_shiny;
      },
      error: err => {
        console.error('Error fetching data: ', err);
      },
      complete: () => {
        console.log("Data retrieved successfully");
      }
    });
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

  getDefaultPokemon(): Pokemon {
    return this.defaultPokemon;
  }
}
