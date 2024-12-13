import { Component } from '@angular/core';
import { Pokemon } from 'src/app/sharedModule/services/pokemon.model';
import { PokemonService } from 'src/app/sharedModule/services/pokemon.service';

@Component({
  selector: 'app-pokemon-card',
  templateUrl: './pokemon-card.component.html',
  styleUrls: ['./pokemon-card.component.scss']
})

export class PokemonCardComponent {
  
  currentPokemon: any;
  showShiny: boolean = false;

  constructor(
    public pokemonService: PokemonService,
  ) { }

  ngOnInit() {
    this.pokemonService.currentPokemon$.subscribe(pokemon => {
      this.currentPokemon = pokemon;
    })
  }

  switchSprite() {
    this.pokemonService.setShowShiny(!this.pokemonService.getShowShiny());
  }

}
