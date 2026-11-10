const API_URL_DETALHES = 'http://localhost:3000';

async function carregarDetalhesProduto() {
    const areaDetalhes = document.getElementById('detalhesProduto');

    const parametros = new URLSearchParams(window.location.search);
    const idProduto = parametros.get('id');

    if (!idProduto) {
        areaDetalhes.innerHTML = '<p>Produto não identificado.</p>';
        return;
    }

    try {
        const resposta = await fetch(`${API_URL_DETALHES}/api/produtos`);

        if (!resposta.ok) {
            throw new Error('Erro ao buscar produtos.');
        }

        const produtos = await resposta.json();

        const produto = produtos.find(
            item => String(item.id) === String(idProduto)
        );

        if (!produto) {
            areaDetalhes.innerHTML = '<p>Produto não encontrado.</p>';
            return;
        }

        exibirDetalhesProduto(produto);

    } catch (erro) {
        console.error('Erro:', erro);
        areaDetalhes.innerHTML = '<p>Não foi possível carregar os detalhes do produto.</p>';
    }
}

function exibirDetalhesProduto(produto) {
    const areaDetalhes = document.getElementById('detalhesProduto');

    areaDetalhes.innerHTML = '';

    const conteudo = document.createElement('div');
    conteudo.className = 'detalhes-produto';

    const imagem = document.createElement('div');
    imagem.className = 'detalhes-imagem';

    if (produto.imagem) {
        const img = document.createElement('img');
        img.src = produto.imagem;
        img.alt = produto.nome;
        imagem.appendChild(img);
    } else {
        imagem.textContent = 'AUTOPARTS';
    }

    const informacoes = document.createElement('div');
    informacoes.className = 'detalhes-informacoes';

    const categoria = document.createElement('span');
    categoria.className = 'detalhes-categoria';
    categoria.textContent = produto.categoria;

    const nome = document.createElement('h2');
    nome.textContent = produto.nome;

    const descricao = document.createElement('p');
    descricao.className = 'detalhes-descricao';
    descricao.textContent = produto.descricao || 'Descrição não informada.';

    const marca = document.createElement('p');
    marca.textContent = `Marca: ${produto.marca || 'Não informada'}`;

    const modelo = document.createElement('p');
    modelo.textContent = `Modelo: ${produto.modelo || 'Não informado'}`;

    const compatibilidade = document.createElement('p');
    compatibilidade.textContent = `Compatibilidade: ${produto.compatibilidade || 'Não informada'}`;

    const preco = document.createElement('div');
    preco.className = 'detalhes-preco';
    preco.textContent = Number(produto.preco).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });

    const estoque = document.createElement('p');
    estoque.className = 'detalhes-estoque';
    estoque.textContent = produto.estoque > 0
        ? `${produto.estoque} unidade(s) disponíveis`
        : 'Produto indisponível';

    const botao = document.createElement('button');
    botao.textContent = 'Adicionar ao carrinho';
    botao.disabled = produto.estoque <= 0;

    botao.addEventListener('click', () => {
        adicionarCarrinho(produto.id);
    });

    informacoes.appendChild(categoria);
    informacoes.appendChild(nome);
    informacoes.appendChild(descricao);
    informacoes.appendChild(marca);
    informacoes.appendChild(modelo);
    informacoes.appendChild(compatibilidade);
    informacoes.appendChild(preco);
    informacoes.appendChild(estoque);
    informacoes.appendChild(botao);

    conteudo.appendChild(imagem);
    conteudo.appendChild(informacoes);

    areaDetalhes.appendChild(conteudo);
}

document.addEventListener('DOMContentLoaded', carregarDetalhesProduto);