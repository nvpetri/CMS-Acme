async function getCategorias() {
    const url = 'http://localhost:8080/v2/acmefilmes/classificacao'

    const response = await fetch(url)

    const classificacao = await response.json()



    return classificacao.classificacao
}

async function popularTabelaCategorias() {
    const classificacao = await getCategorias()

    console.log(classificacao)

    const tabelaBody = document.querySelector('.table tbody')

    classificacao.forEach((classificacao) => {
        const newRow = tabelaBody.insertRow()
        const id = newRow.insertCell(0)
        const nome = newRow.insertCell(1)
        const sigla = newRow.insertCell(2)
        const descricao = newRow.insertCell(3)
        const editar = newRow.insertCell(4)
        const excluir = newRow.insertCell(5)
        const imgEditar = document.createElement('img')
        const imgExcluir = document.createElement('img')

        imgEditar.src = '../img/editar.png'
        imgEditar.id = `editar_${classificacao.id}`
        imgExcluir.src = '../img/lixeira.png'
        imgExcluir.id = `excluir_${classificacao.id}`
        imgEditar.style.cursor = 'pointer'
        imgExcluir.style.cursor = 'pointer'

        id.innerHTML = classificacao.id
        nome.innerHTML = classificacao.nome
        sigla.innerHTML = classificacao.sigla
        descricao.innerHTML = classificacao.descricao
        editar.appendChild(imgEditar)
        excluir.appendChild(imgExcluir)


    })
}

popularTabelaCategorias()