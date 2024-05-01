async function getFilmes() {
    const url = 'http://localhost:8080/v2/acmefilmes/filmes'

    const response = await fetch(url)

    const filmes = await response.json()

    return filmes.filmes
}

function formatarData(data_lancamento) {
    const dataObj = new Date(data_lancamento)
    const dia = String(dataObj.getDate()).padStart(2, '0')
    const mes = String(dataObj.getMonth() + 1).padStart(2, '0')
    const ano = dataObj.getFullYear()
    return `${dia}/${mes}/${ano}`
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

        imgEditar.addEventListener('click', () => abrirModal(filme.id))
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

async function salvarNovoFilme() {
    console.log('Função salvarNovoFilme() chamada.')
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
        if (sucesso) {
            console.log('Filme excluído com sucesso!')
            location.reload()
        } else {
            console.error('Erro ao excluir o filme', error)
        }
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