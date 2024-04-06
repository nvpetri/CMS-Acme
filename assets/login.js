'use strict'

const mail = document.getElementById('user-mail')
const pass = document.getElementById('user-pass')
const button = document.getElementById('btn-login')

function validarUsuario() {
    if (mail.value == 'nicolas' && pass.value == '1234') {
        window.location.href = './pages/home.html'
    }
}

button.addEventListener('click', validarUsuario)