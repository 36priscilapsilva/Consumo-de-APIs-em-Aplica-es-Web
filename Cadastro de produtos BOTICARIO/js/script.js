const formulario = document.getElementById('formulario-produto');
const botoesCategorias = document.querySelectorAll('#botoes-categorias button');
const categorias = document.querySelectorAll('.categoria');

const buscarProdutoBtn = document.getElementById('buscar-produto-btn');
const excluirProdutoBtn = document.getElementById('excluir-produto-btn');
const atualizarProdutoBtn = document.getElementById('atualizar-produto-btn');

function mostrarCategoria(categoria) {
    categorias.forEach(cat => {
        cat.classList.remove('ativa');
        if (cat.id === categoria + '-categoria') {
            cat.classList.add('ativa');
        }
    });
}

mostrarCategoria('masculino');

botoesCategorias.forEach(botao => {
    botao.addEventListener('click', () => {
        mostrarCategoria(botao.getAttribute('data-categoria'));
    });
});

formulario.addEventListener('submit', function(evento) {
    evento.preventDefault();

    const nome = document.getElementById('nome-produto').value;
    const descricao = document.getElementById('descricao-produto').value;
    const preco = document.getElementById('preco-produto').value;
    const quantidade = document.getElementById('quantidade-produto').value;
    const categoria = document.getElementById('categoria-produto').value.toLowerCase();

    fetch('https://dummyjson.com/products/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: nome,
            description: descricao,
            price: parseFloat(preco),
            stock: parseInt(quantidade),
            category: categoria
        })
    })
    .then(response => response.json())
    .then(produto => {
        const listaProdutos = document.getElementById(`${categoria}-produtos`);
        if (listaProdutos) {
            const novoProduto = document.createElement('li');
            novoProduto.classList.add('item-produto');
            novoProduto.innerHTML = `<strong>Nome:</strong> ${produto.title}<br>
                                    <strong>Descrição:</strong> ${produto.description}<br>
                                    <strong>Preço:</strong> R$ ${produto.price.toFixed(2)}<br>
                                    <strong>Quantidade em Estoque:</strong> ${produto.stock}`;
            listaProdutos.appendChild(novoProduto);
        } else {
            console.warn(`Categoria ${categoria} não encontrada na interface.`);
        }
        formulario.reset();
    })
    .catch(error => {
        console.error('Erro ao cadastrar o produto:', error);
        alert('Erro ao cadastrar o produto. Tente novamente.');
    });
});

function carregarProdutosDaAPI() {
    const categoriasExistentes = ['masculino', 'feminino', 'infantil', 'cabelos', 'corpo'];

    fetch('https://dummyjson.com/products')
        .then(response => response.json())
        .then(data => {
            data.products.forEach(produto => {
                const categoria = produto.category.toLowerCase();

                if (categoriasExistentes.includes(categoria)) {
                    const novoProduto = document.createElement('li');
                    novoProduto.classList.add('item-produto');
                    novoProduto.innerHTML = `<strong>Nome:</strong> ${produto.title}<br>
                                            <strong>Descrição:</strong> ${produto.description}<br>
                                            <strong>Preço:</strong> R$ ${produto.price.toFixed(2)}<br>
                                            <strong>Quantidade em Estoque:</strong> ${produto.stock}`;

                    const listaProdutos = document.getElementById(`${categoria}-produtos`);
                    listaProdutos.appendChild(novoProduto);
                }
            });
        })
        .catch(error => console.error('Erro ao carregar os produtos da API:', error));
}

function obterProdutoEspecifico(id) {
    fetch(`https://dummyjson.com/products/${id}`)
        .then(response => response.json())
        .then(produto => {
            alert(`Produto ID: ${produto.id}\nNome: ${produto.title}\nDescrição: ${produto.description}\nPreço: R$ ${produto.price.toFixed(2)}\nQuantidade em Estoque: ${produto.stock}`);
        })
        .catch(error => console.error('Erro ao obter produto:', error));
}

function atualizarProduto(id, dadosAtualizados) {
    fetch(`https://dummyjson.com/products/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosAtualizados)
    })
    .then(response => response.json())
    .then(produto => {
        alert(`Produto ID ${id} atualizado:\nNome: ${produto.title}\nPreço: R$ ${produto.price.toFixed(2)}`);
    })
    .catch(error => console.error('Erro ao atualizar produto:', error));
}

function excluirProduto(id) {
    fetch(`https://dummyjson.com/products/${id}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
        alert(`Produto ID ${id} excluído com sucesso!`);
    })
    .catch(error => console.error('Erro ao excluir produto:', error));
}

function buscarProdutos(query) {
    fetch(`https://dummyjson.com/products/search?q=${query}`)
        .then(response => response.json())
        .then(data => {
            let resultado = '';
            data.products.forEach(produto => {
                resultado += `ID: ${produto.id}, Nome: ${produto.title}, Preço: R$ ${produto.price.toFixed(2)}\n`;
            });
            alert(`Resultados da busca:\n${resultado}`);
        })
        .catch(error => console.error('Erro ao buscar produtos:', error));
}

buscarProdutoBtn.addEventListener('click', () => {
    const query = document.getElementById('buscar-produto').value;
    buscarProdutos(query);
});

excluirProdutoBtn.addEventListener('click', () => {
    const id = document.getElementById('produto-id').value;
    if (id) {
        excluirProduto(id);
    } else {
        alert('Por favor, insira o ID do produto para excluir.');
    }
});

atualizarProdutoBtn.addEventListener('click', () => {
    const id = document.getElementById('produto-id').value;
    const novoNome = document.getElementById('novo-nome-produto').value;
    const novoPreco = document.getElementById('novo-preco-produto').value;

    if (id && (novoNome || novoPreco)) {
        const dadosAtualizados = {};
        if (novoNome) dadosAtualizados.title = novoNome;
        if (novoPreco) dadosAtualizados.price = parseFloat(novoPreco);

        atualizarProduto(id, dadosAtualizados);
    } else {
        alert('Por favor, insira o ID do produto e o novo nome ou preço para atualizar.');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    carregarProdutosDaAPI();
});