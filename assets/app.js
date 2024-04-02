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

async function popularTabela() {
    const filmes = await getFilmes()

    const tabelaBody = document.querySelector('.table tbody')

    filmes.forEach((filme, index) => {
        const newRow = tabelaBody.insertRow()
        const id = newRow.insertCell(0)
        const titulo = newRow.insertCell(1)
        const dataLancamento = newRow.insertCell(2)
        const valor = newRow.insertCell(3)
        const editar = newRow.insertCell(4)
        const excluir = newRow.insertCell(5)

        id.innerHTML = filme.id
        titulo.innerHTML = filme.nome
        dataLancamento.innerHTML = formatarData(filme.data_lancamento)
        valor.innerHTML = formatarValorUnitario(filme.valor_unitario)


    })
}

popularTabela()