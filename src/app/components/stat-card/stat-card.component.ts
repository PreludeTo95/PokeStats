import { Component } from '@angular/core';
import { Pokemon } from 'src/app/sharedModule/services/pokemon.model';
import { PokemonService } from 'src/app/sharedModule/services/pokemon.service';

@Component({
  selector: 'app-stat-card',
  templateUrl: './stat-card.component.html',
  styleUrls: ['./stat-card.component.scss']
})

export class StatCardComponent {
  
  currentPokemon!: Pokemon;
  showMoves: boolean = false;

  constructor(
    private pokemonService: PokemonService,
  ) { }

  ngOnInit() {
    this.currentPokemon = this.pokemonService.getCurrentPokemon();
  }
  
  toggleMoves() {
    this.showMoves = !this.showMoves;
  }
}
