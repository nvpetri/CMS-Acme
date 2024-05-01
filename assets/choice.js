'use strict'

const btnFilmes = document.getElementById('filme')
const btnCategoria = document.getElementById('classificacao')

btnFilmes.addEventListener('click', () => {
    window.location.href = '../pages/homeFilmes.html'
})

btnCategoria.addEventListener('click', () => {
    window.location.href = '../pages/homeCategoria.html'
})