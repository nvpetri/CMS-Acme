async function getFilmes() {
    const url = 'http://localhost:8080/v2/acmefilmes/filmes'

    const response = await fetch(url)

    const filmes = await response.json()

    console.log(filmes)

    return filmes.filmes
}

function formatarData(data_lancamento) {
    const dataObj = new Date(data_lancamento)
    const dia = String(dataObj.getDate()).padStart(2, '0')
    const mes = String(dataObj.getMonth() + 1).padStart(2, '0')
    const ano = dataObj.getFullYear()
    return `${ano}/${mes}/${dia}`
}

function formatarValorUnitario(valor_unitario) {
    return parseFloat(valor_unitario).toFixed(2)
}

async function popularTabelaFilmes() {
    const filmes = await getFilmes()

    const tabelaBody = document.querySelector('.table tbody')

    filmes.forEach((filme) => {
        const newRow = tabelaBody.insertRow()
        const id = newRow.insertCell(0)
        const titulo = newRow.insertCell(1)
        const dataLancamento = newRow.insertCell(2)
        const valor = newRow.insertCell(3)
        const editar = newRow.insertCell(4)
        const excluir = newRow.insertCell(5)
        const imgEditar = document.createElement('img')
        const imgExcluir = document.createElement('img')

        imgEditar.src = '../img/editar.png'
        imgEditar.id = `editar_${filme.id}`
        imgExcluir.src = '../img/lixeira.png'
        imgExcluir.id = `excluir_${filme.id}`
        imgEditar.style.cursor = 'pointer'
        imgExcluir.style.cursor = 'pointer'

        id.innerHTML = filme.id
        titulo.innerHTML = filme.nome
        dataLancamento.innerHTML = formatarData(filme.data_lancamento)
        valor.innerHTML = `R$ ${formatarValorUnitario(filme.valor_unitario)}`
        editar.appendChild(imgEditar)
        excluir.appendChild(imgExcluir)

        imgEditar.addEventListener('click', () => abrirModalEdicao(filme))
        imgExcluir.addEventListener('click', () => excluirFilme(filme.id))
    })
}

function abrirModalEdicao(filme) {
    const modalEdicao = new bootstrap.Modal(document.getElementById('modalEdicaoFilme'))

    document.getElementById('filmeId').value = filme.id
    document.getElementById('tituloEditar').value = filme.nome
    document.getElementById('sinopseEditar').value = filme.sinopse
    document.getElementById('data_lancamentoEditar').value = formatarData(filme.data_lancamento)
    document.getElementById('duracaoEditar').value = formatarTempo(filme.duracao)
    document.getElementById('foto_capaEditar').value = filme.foto_capa
    document.getElementById('valor_unitarioEditar').value = filme.valor_unitario

    modalEdicao.show()
}

function formatarTempo(tempo) {
    return tempo + ':00'
}

async function atualizarFilme(event) {
    event.preventDefault()
    const form = event.currentTarget

    const formData = new FormData(form)
    const filmeAtualizado = {}
    formData.forEach((value, key) => {
        filmeAtualizado[key] = value
    })

    const sucesso = await putFilme(filmeAtualizado)
    if (sucesso) {
        const modalEdicao = bootstrap.Modal.getInstance(document.getElementById('modalEdicaoFilme'))
        modalEdicao.hide()
        location.reload()
    } else {
        console.error('Erro ao atualizar o filme')
    }
}

async function getClassificacoes() {
    const url = 'http://localhost:8080/v2/acmefilmes/classificacao'
    const response = await fetch(url)

    const classificacao = await response.json()
    return classificacao.classificacao
}
preencherOpcoesClassificacaoEditar()
async function preencherOpcoesClassificacaoEditar() {
    const classificacoes = await getClassificacoes()
    
    const selectClassificacao = document.getElementById('classificacao')
    selectClassificacao.innerHTML = '' // Limpa quaisquer opções anteriores

    classificacoes.forEach(classificacao => {
        const option = document.createElement('option')
        option.value = classificacao.id
        option.textContent = classificacao.nome
        selectClassificacao.appendChild(option)
    })
}

document.addEventListener('DOMContentLoaded', () => {
    popularTabelaFilmes()

    const btnSalvar = document.getElementById('btnSalvar')
    if (btnSalvar) {
        
        btnSalvar.addEventListener('click', salvarNovoFilme)
    } else {
        console.error('Elemento com ID btnSalvar não encontrado.')
    }

    const formEditarFilme = document.getElementById('formEditarFilme')
    if (formEditarFilme) {
        formEditarFilme.addEventListener('submit', atualizarFilme)
    } else {
        console.error('Elemento com ID formEditarFilme não encontrado.')
    }
})

async function postFilme (filme) {
    const url = 'http://localhost:8080/v2/acmefilmes/filme'
    const options = {
        method: 'POST',
        headers: {
            'Content-type':'application/json'
        },
        body: JSON.stringify(filme),
    }

    const response = await fetch (url, options)

    return response.ok

}

async function salvarNovoFilme() {
    
    const form = document.getElementById('formNovoFilme')
    const formData = new FormData(form)
    const novoFilme = {}
    formData.forEach((value, key) => {
        novoFilme[key] = value
    })

    console.log('Novo filme:', novoFilme)

    novoFilme['data_lancamento'] = formatarData(novoFilme['data_lancamento'])
    novoFilme['duracao'] = formatarTempo(novoFilme['duracao'])

    const sucesso = await postFilme(novoFilme)
    if (sucesso) {
        console.log('Filme adicionado com sucesso!')
        location.reload()
    } else {
        console.error('Erro ao salvar o filme')
    }
}

async function excluirFilme(id) {
    const modalConfirmacao = new bootstrap.Modal(document.getElementById('modalConfirmacaoExclusao'))
    modalConfirmacao.show()

    const btnConfirmarExclusao = document.getElementById('btnConfirmarExclusao')
    btnConfirmarExclusao.addEventListener('click', async() => {
        modalConfirmacao.hide()

        const sucesso = await deleteFilme(id)

        console.log(sucesso)

        location.reload()

    })
}

async function deleteFilme(id) {
    const url = `http://localhost:8080/v2/acmefilmes/deleteFilme/${id}`

    const response = await fetch(url, {
        method: 'DELETE'
    })

    const filmes = await response.json()

    return filmes.filmes
}

async function putFilme(filme) {
    const url = `http://localhost:8080/v2/acmefilmes/atualizarfilme/${filme.id}`
    const options = {
        method: 'PUT',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(filme),
    }

    const response = await fetch(url, options)

    return response.ok

}