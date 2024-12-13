import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, forkJoin, map, of } from 'rxjs';
import { Ability, Move, Pokemon, Stat } from './pokemon.model';
import { defaultPokemon } from 'src/app/mockData/DefaultPokemon';

@Injectable({
  providedIn: 'root'
})

export class PokemonService {

  private currentPokemonSubject = new BehaviorSubject<Pokemon | null>(null);
  currentPokemon$ = this.currentPokemonSubject.asObservable();
  preferredLanguage: string = 'en';

  smogonBaseUrl = 'https://www.smogon.com/dex/sv/abilities/';

  constructor(
    private httpClient: HttpClient,
  ) {
    this.setCurrentPokemon(defaultPokemon);
  }

  getPokemonDetails(pokemonSpecies: string) {
    let baseUrl = "https://pokeapi.co/api/v2/pokemon/";
    let finalUrl = baseUrl + pokemonSpecies;

    let response: Observable<any> = this.httpClient.get<any>(finalUrl);

    return response;
  }

  buildPokemon(pokemonSpecies: string) {
    let responsePokemon: Pokemon = { ...defaultPokemon };

    this.getPokemonDetails(pokemonSpecies).subscribe({
      next: response => {
        responsePokemon.id = response.id;
        responsePokemon.name = response.name;

        let abilityObservables = response.abilities.map((element: { ability: { name: string, url: string }, is_hidden: boolean, slot: number }) => {
          return this.getAbilityDescription(element.ability.name).pipe(
            map((description: string) => ({
              name: element.ability.name,
              pokeApiUrl: element.ability.url,
              smogonUrl: this.smogonBaseUrl + element.ability.name,
              isHidden: element.is_hidden,
              slot: element.slot,
              description: description
            }))
          );
        });

        forkJoin(abilityObservables).subscribe({
          next: (abilities: any) => {
            responsePokemon.abilities = abilities;

            console.log(response.moves);
            responsePokemon.moves = response.moves.map((element: { move: { name: string, url: string } }) => ({
              name: element.move.name,
              url: element.move.url
            }))

            console.log(response.stats);
            responsePokemon.stats = response.stats.map((element: { base_stat: number, effort: number, stat: { name: string, url: string } }) => ({
              name: element.stat.name,
              value: element.base_stat
            }))

            console.log(response.types);
            responsePokemon.types = response.types.map((element: { slot: number; type: { name: string; url: string } }) =>
              element.type.name
            )


            // Official Art
            responsePokemon.normalSprite = response.sprites?.other?.['official-artwork'].front_default;
            responsePokemon.shinySprite = response.sprites?.other?.['official-artwork'].front_shiny;

            // Pokemon Home
            // responsePokemon.normalSprite = response.sprites.other.home.front_default;
            // responsePokemon.shinySprite = response.sprites.other.home.front_shiny;

            // Pokemon Showdown
            // responsePokemon.normalSprite = response.sprites?.other?.showdown.front_default;
            // responsePokemon.shinySprite = response.sprites?.other?.showdown.front_shiny;

            this.setCurrentPokemon(responsePokemon);
          },
          error: err => {
            console.error('An error occurred: ' + err);
          },
          complete: () => {

          }
        })


      },
      error: err => {
        console.error('Error fetching data: ', err);
      },
      complete: () => {        
        console.log("Data retrieved successfully");
      }
    });
  }

  getAbilityDescription(abilityName: string): Observable<string> {
    let baseUrl = "https://pokeapi.co/api/v2/ability/";
    let finalUrl = baseUrl + abilityName;
  
    return this.httpClient.get<any>(finalUrl).pipe(
      map(response => {
        let effectEntry;

        for (let i = (response.flavor_text_entries.length-1); i >= 0; i--) {
          let abilityEntry = response.flavor_text_entries[i];

          if (abilityEntry.language.name === this.preferredLanguage) {
            effectEntry = abilityEntry.flavor_text;
            console.log("Found match: " + abilityEntry);
            break;
          }
        }

        if (!effectEntry) {
          return 'No description available';
        }

        let effectSubstrings: string[] = effectEntry.trim().split(/\.(?=\s|$)/);
        return effectSubstrings[0] ? effectSubstrings[0].trim() : 'No description available';
      }),
      catchError(err => {
        console.error('Error fetching ability description:', err);
        return of('Error fetching description'); 
      })
    );
  }

  validateCurrentPokemon(): Pokemon {
    let currentPokemon = this.currentPokemonSubject.getValue();

    if (!currentPokemon) {
      throw new Error("No current Pokemon available");
    }

    return currentPokemon;
  }

  resetPokemonProperties() {
    let currentPokemon = this.validateCurrentPokemon();
    let updatedPokemon: Pokemon = { ...currentPokemon }

    updatedPokemon.abilities = [];
    updatedPokemon.moves = [];
    updatedPokemon.stats = [];
    updatedPokemon.types = [];

    this.currentPokemonSubject.next(updatedPokemon);
  }

  setCurrentPokemon(pokemon: Pokemon): void {
    this.currentPokemonSubject.next(pokemon);
  }

  getCurrentPokemon(): Pokemon {
    let currentPokemon = this.validateCurrentPokemon();

    return currentPokemon;
  }

  setCurrentPokemonId(id: string) {
    let currentPokemon = this.validateCurrentPokemon();
    currentPokemon.id = id;

    this.currentPokemonSubject.next(currentPokemon);
  }

  getCurrentPokemonId(): string {
    let currentPokemon = this.validateCurrentPokemon();

    return currentPokemon.id;
  }

  setCurrentPokemonName(name: string): void {
    let currentPokemon = this.validateCurrentPokemon();
    currentPokemon.name = name;

    this.currentPokemonSubject.next(currentPokemon);
  }

  getCurrentPokemonName(): string {
    let currentPokemon = this.validateCurrentPokemon();

    return currentPokemon.name;
  }

  setCurrentPokemonAbilities(abilities: Ability[]): void {
    let currentPokemon = this.validateCurrentPokemon();
    currentPokemon.abilities = abilities;

    this.currentPokemonSubject.next(currentPokemon);
  }

  getCurrentPokemonAbilities(): Ability[] {
    let currentPokemon = this.validateCurrentPokemon();

    return currentPokemon.abilities;
  }

  setCurrentPokemonMoves(moves: Move[]): void {
    let currentPokemon = this.validateCurrentPokemon();
    currentPokemon.moves = moves;

    this.currentPokemonSubject.next(currentPokemon);
  }

  getCurrentPokemonMoves(): Move[] {
    let currentPokemon = this.validateCurrentPokemon();

    return currentPokemon.moves;
  }

  setCurrentPokemonStats(stats: Stat[]): void {
    let currentPokemon = this.validateCurrentPokemon();
    currentPokemon.stats = stats;

    this.currentPokemonSubject.next(currentPokemon);
  }

  getCurrentPokemonStats(): Stat[] {
    let currentPokemon = this.validateCurrentPokemon();

    return currentPokemon.stats;
  }

  setCurrentPokemonTypes(types: string[]): void {
    let currentPokemon = this.validateCurrentPokemon();
    currentPokemon.types = types;

    this.currentPokemonSubject.next(currentPokemon);
  }

  getCurrentPokemonTypes(): string[] {
    let currentPokemon = this.validateCurrentPokemon();

    return currentPokemon.types;
  }

  setCurrentPokemonNormalSprite(sprite: Blob): void {
    let currentPokemon = this.validateCurrentPokemon();
    currentPokemon.normalSprite = sprite;

    this.currentPokemonSubject.next(currentPokemon);
  }

  getCurrentPokemonNormalSprite(): Blob {
    let currentPokemon = this.validateCurrentPokemon();

    return currentPokemon.normalSprite;
  }

  setCurrentPokemonShinySprite(sprite: Blob): void {
    let currentPokemon = this.validateCurrentPokemon();
    currentPokemon.shinySprite = sprite;

    this.currentPokemonSubject.next(currentPokemon);
  }

  getCurrentPokemonShinySprite(): Blob {
    let currentPokemon = this.validateCurrentPokemon();

    return currentPokemon.shinySprite;
  }

  setShowShiny(bool: boolean): void {
    let currentPokemon = this.validateCurrentPokemon();
    currentPokemon.showShiny = bool;

    this.currentPokemonSubject.next(currentPokemon);
  }

  getShowShiny(): boolean {
    let currentPokemon = this.validateCurrentPokemon();

    return currentPokemon.showShiny;
  }
}
