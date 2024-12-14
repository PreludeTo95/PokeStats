import { Component } from '@angular/core';
import { PokemonService } from './sharedModule/services/pokemon.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  
  title: string = 'PokeStats';
  totalNumberOfPokemon: number;

  constructor(
      private pokemonService: PokemonService,
    ) { 
      this.totalNumberOfPokemon = this.pokemonService.totalNumberOfPokemon;
    }

  nextPokemon() {
    let currentId: number = parseInt(this.pokemonService.getCurrentPokemonId());

    if (!currentId) {
      this.pokemonService.buildPokemon('1');
    }
    
    if (!(currentId == this.totalNumberOfPokemon)) {
      let nextId = (currentId + 1).toString();
      this.pokemonService.buildPokemon(nextId);
    } else {
      console.log('No more entries!');
    }
    
  }

  previousPokemon() {
    let currentId: number = parseInt(this.pokemonService.getCurrentPokemonId());

    if (!currentId) {
      this.pokemonService.buildPokemon('1');
    }
    
    if (!(currentId == 1)) {
      let nextId = (currentId - 1).toString();
      this.pokemonService.buildPokemon(nextId);
    } else {
      console.log('No more entries!');
    }
  }

}
