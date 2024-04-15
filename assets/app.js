'use strict'

import { popularTabelaFilmes } from './filmes.js'

function getChoice() {

    let functionSelected = sessionStorage.getItem('userChoice')
    console.log(functionSelected)

    switch (functionSelected) {
        case 'filme':
            popularTabelaFilmes
            break;

        default:
            break;
    }
}

getChoice()