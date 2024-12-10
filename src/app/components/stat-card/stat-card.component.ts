import { Component } from '@angular/core';
import { Pokemon } from 'src/app/sharedModule/services/pokemon.model';
import { PokemonService } from 'src/app/sharedModule/services/pokemon.service';
import { typeColors } from 'src/app/sharedModule/utils/type-colors';

@Component({
  selector: 'app-stat-card',
  templateUrl: './stat-card.component.html',
  styleUrls: ['./stat-card.component.scss']
})

export class StatCardComponent {
  
  currentPokemon!: Pokemon;
  showMoves: boolean = false;
  maxChartValue: number = 285;
  statNames: string[] = ['HP','Attack','Defense','Sp. Atk','Sp. Def','Speed'];

  statColors = new Map<string, string>([
    ["red", "#F34444"],
    ["orange", "#FF7F0F"],
    ["yellow", "#FFDD57"],
    ["light-green", "#A0E515"],
    ["dark-green", "#23CD5E"],
    ["blue", "#00C2B8"]
  ]);

  statValues = new Map<string, number>([
    ["red", 30],
    ["orange", 60],
    ["yellow", 90],
    ["light-green", 120],
    ["dark-green", 150],
  ]);

  constructor(
    private pokemonService: PokemonService,
  ) { }

  ngOnInit() {
    this.currentPokemon = this.pokemonService.getCurrentPokemon();
  }
  
  toggleMoves() {
    this.showMoves = !this.showMoves;
  }

  getTypeColor(pokemonType: string) {
    return typeColors[pokemonType.toLowerCase()] || '#FFFFFF';
  }

  calculateStatBarLength(statValue: number) {
    return ((100 * statValue / this.maxChartValue).toString() + '%');
  }

  calculateStatBarColor(statValue: number) {
    if (statValue < this.statValues.get("red")!) {
      return this.statColors.get("red");
    } 
    else if (statValue < this.statValues.get("orange")!) {
      return this.statColors.get("orange");
    } 
    else if (statValue < this.statValues.get("yellow")!) {
      return this.statColors.get("yellow");
    } 
    else if (statValue < this.statValues.get("light-green")!) {
      return this.statColors.get("light-green");
    } 
    else if (statValue < this.statValues.get("dark-green")!) {
      return this.statColors.get("dark-green");
    } 
    else {
      return this.statColors.get("blue");
    }
  }

}
