import { Pokemon, statName, Type } from "../sharedModule/services/pokemon.model";

export const defaultPokemon: Pokemon = {
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
        Type[0], 
        Type[1]
    ],
    normalSprite: undefined,
    shinySprite: undefined,
}