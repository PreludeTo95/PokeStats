export interface Pokemon {
    id: string;
    name: string;
    abilities: Ability[];
    moves: Move[];
    stats: Stat[];
    types: string[];
    normalSprite: any;
    shinySprite: any;
}

export interface Ability {
    name: string;
    pokeApiUrl: string;
    smogonUrl: String;
    isHidden: boolean;
    slot: number;
}

export interface Move {
    name: string;
    url: string;
}

export interface Stat {
    name: string;
    value: number;
}

export enum statName {
    'HP',
    'Attack',
    'Defense',
    'Sp. Attack',
    'Sp. Defense',
    'Speed'
}

export enum Type {
    'Normal',
    'Fire',
    'Water',
    'Electric',
    'Grass',
    'Ice',
    'Fighting',
    'Poison',
    'Ground',
    'Flying',
    'Psychic',
    'Bug',
    'Rock',
    'Ghost',
    'Dragon',
    'Dark',
    'Steel',
    'Fairy'
}