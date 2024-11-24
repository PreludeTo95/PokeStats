import { Component } from '@angular/core';
import { PokemonService } from 'src/app/sharedModule/services/pokemon.service';
import { faMagnifyingGlass, faDice } from '@fortawesome/free-solid-svg-icons';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})

export class SearchBarComponent {
  faMagnifyingGlass = faMagnifyingGlass;
  faDice = faDice;
  
  error: string = '';
  totalNumberOfPokemon: number = 1025;
  letPokemonList: any;
  pokemonListUrl: string = 'https://pokeapi.co/api/v2/pokemon?limit=9999'
  pokemonList: {name: string, pokedexNumber: string}[] = [];
  pokemonSpecies: string = '';
  dropdownSuggestions: {name: string, pokedexNumber: string}[] = [];
  noResults: boolean = false;

  searchForm = new FormGroup({
    pokemonSpecies: new FormControl(''),
  });

  constructor(
    private pokemonService: PokemonService,
    private httpClient: HttpClient,
  ) { }

  ngOnInit() {
    let tempPokemon = {
      name: '',
      pokedexNumber: ''
    };

    this.getListOfAllPokemon().subscribe({
      next: value => {
        value.results.forEach((element: { name: string; url: string; }) => {
          tempPokemon.name = element.name;
          tempPokemon.pokedexNumber = this.parsePokedexNumber(element.url);
          
          this.pokemonList.push({...tempPokemon});
        });
      },
      error: err => {
        console.error('Observable emitted an error: ' + err);
      },
      complete: () => {
        console.log(this.pokemonList);
      }
    });
  }

  parsePokedexNumber(url: string) {
    let stringArray = url.split('/');
    //console.log(stringArray[(stringArray.length as number) - 2]);
    return stringArray[(stringArray.length as number) - 2];
  }

  getListOfAllPokemon() {
    return this.httpClient.get<any>(this.pokemonListUrl);
  }
  
  getPokemonDetails() {
    this.pokemonService.buildPokemon(this.pokemonSpecies);
  }

  getRandomPokemon() {
    this.pokemonService.buildPokemon(String(Math.floor(Math.random() * (this.totalNumberOfPokemon - 1) + 1)));
  }

  suggestPokemon() {
    this.pokemonSpecies = (this.searchForm.get('pokemonSpecies')?.value as string).toLowerCase();
    let searchMatch: boolean = false;
    this.dropdownSuggestions = [];

    if (this.pokemonSpecies.length >= 2) {
      
      for (let i = 0; i < this.pokemonList.length; i++) {
        searchMatch = false;

        for (let j = 0; j < this.pokemonSpecies.length; j++) {
          if (this.pokemonList[i].name.charAt(j) == this.pokemonSpecies.charAt(j)) {
            searchMatch = true;
          } else {
            searchMatch = false;
            break;
          }
        }

        if (searchMatch == true) {
          this.dropdownSuggestions.push(this.pokemonList[i]);

          if (this.dropdownSuggestions.length > 4) {
            break;
          }
        }
      }

      if (this.dropdownSuggestions.length == 0) {
        this.noResults = true;
      } else {
        this.noResults = false;
      }
    }
  }

  dropdownClick(pokemonSpecies: string) {
    this.pokemonSpecies = pokemonSpecies;
    this.dropdownSuggestions = [];
    this.searchForm.get('pokemonSpecies')?.setValue('');

    this.getPokemonDetails();
  }


}
