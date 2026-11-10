const API_URL_PRODUTOS = 'http://localhost:3000';

let todosProdutos = [];

async function carregarProdutos() {
    const lista = document.getElementById('listaProdutos');

    try {
        const resposta = await fetch(`${API_URL_PRODUTOS}/api/produtos`);

        if (!resposta.ok) {
            throw new Error('Erro ao buscar produtos.');
        }

        todosProdutos = await resposta.json();

        const parametros = new URLSearchParams(window.location.search);
        const pesquisaInicial = parametros.get('pesquisa') || '';
        const categoriaInicial = parametros.get('categoria') || '';

        document.getElementById('campoPesquisa').value = pesquisaInicial;
        document.getElementById('filtroCategoria').value = categoriaInicial;

        aplicarFiltros();

    } catch (erro) {
        console.error('Erro:', erro);
        lista.innerHTML = '<p>Não foi possível carregar os produtos. Verifique se o servidor está funcionando.</p>';
    }
}

function aplicarFiltros() {
    const pesquisa = document.getElementById('campoPesquisa').value
        .trim()
        .toLowerCase();

    const categoria = document.getElementById('filtroCategoria').value;
    const ordenacao = document.getElementById('filtroOrdenacao').value;

    let produtosFiltrados = todosProdutos.filter(produto => {
        const textoPesquisa = [
            produto.nome,
            produto.marca,
            produto.modelo,
            produto.compatibilidade,
            produto.categoria
        ].join(' ').toLowerCase();

        const correspondePesquisa = textoPesquisa.includes(pesquisa);
        const correspondeCategoria = !categoria || produto.categoria === categoria;

        return correspondePesquisa && correspondeCategoria;
    });

    if (ordenacao === 'menor-preco') {
        produtosFiltrados.sort((a, b) => a.preco - b.preco);
    }

    if (ordenacao === 'maior-preco') {
        produtosFiltrados.sort((a, b) => b.preco - a.preco);
    }

    if (ordenacao === 'nome') {
        produtosFiltrados.sort((a, b) => a.nome.localeCompare(b.nome));
    }

    exibirProdutos(produtosFiltrados);
}

function exibirProdutos(produtos) {
    const lista = document.getElementById('listaProdutos');
    const total = document.getElementById('totalProdutos');

    lista.innerHTML = '';
    total.textContent = `${produtos.length} produto(s) encontrado(s)`;

    if (produtos.length === 0) {
        lista.innerHTML = '<p>Nenhum produto encontrado.</p>';
        return;
    }

    produtos.forEach(produto => {
        const card = document.createElement('div');
        card.className = 'produto-card';

        const imagem = document.createElement('div');
        imagem.className = 'produto-imagem';

        if (produto.imagem) {
            const img = document.createElement('img');
            img.src = produto.imagem;
            img.alt = produto.nome;
            imagem.appendChild(img);
        } else {
            imagem.textContent = 'AUTOPARTS';
        }

        const informacoes = document.createElement('div');
        informacoes.className = 'produto-info';

        const nome = document.createElement('h3');
        nome.textContent = produto.nome;

        const marca = document.createElement('p');
        marca.textContent = produto.marca || 'Marca não informada';

        const compatibilidade = document.createElement('p');
        compatibilidade.textContent = `Aplicação: ${produto.compatibilidade}`;

        const preco = document.createElement('div');
        preco.className = 'produto-preco';
        preco.textContent = Number(produto.preco).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });

        const estoque = document.createElement('p');
        estoque.textContent = produto.estoque > 0
            ? `${produto.estoque} unidade(s) em estoque`
            : 'Produto indisponível';

        const botao = document.createElement('button');
        botao.textContent = 'Adicionar ao carrinho';
        botao.disabled = produto.estoque <= 0;
        botao.addEventListener('click', () => adicionarCarrinho(produto.id));

        const linkDetalhes = document.createElement('a');
        linkDetalhes.href = `produto.html?id=${produto.id}`;
        linkDetalhes.className = 'botao-detalhes';
        linkDetalhes.textContent = 'Ver detalhes';

        informacoes.appendChild(nome);
        informacoes.appendChild(marca);
        informacoes.appendChild(compatibilidade);
        informacoes.appendChild(preco);
        informacoes.appendChild(estoque);
        informacoes.appendChild(linkDetalhes);
        informacoes.appendChild(botao);

        card.appendChild(imagem);
        card.appendChild(informacoes);

        lista.appendChild(card);
    });
}

document.getElementById('campoPesquisa').addEventListener('input', aplicarFiltros);
document.getElementById('botaoPesquisa').addEventListener('click', aplicarFiltros);
document.getElementById('filtroCategoria').addEventListener('change', aplicarFiltros);
document.getElementById('filtroOrdenacao').addEventListener('change', aplicarFiltros);

document.addEventListener('DOMContentLoaded', carregarProdutos);