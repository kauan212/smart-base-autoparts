const API_CARRINHO = 'http://localhost:3000';

let produtosDisponiveis = [];

function obterItensCarrinho() {
    return JSON.parse(localStorage.getItem('carrinho')) || [];
}

function salvarItensCarrinho(carrinho) {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

function formatarMoeda(valor) {
    return Number(valor).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

async function carregarCarrinho() {
    try {
        const resposta = await fetch(`${API_CARRINHO}/api/produtos`);

        if (!resposta.ok) {
            throw new Error('Erro ao consultar produtos.');
        }

        produtosDisponiveis = await resposta.json();

        exibirCarrinho();

    } catch (erro) {
        console.error('Erro:', erro);

        document.getElementById('listaCarrinho').innerHTML =
            '<p>Não foi possível carregar o carrinho. Verifique se o servidor está funcionando.</p>';
    }
}

function exibirCarrinho() {
    const lista = document.getElementById('listaCarrinho');
    const carrinho = obterItensCarrinho();

    lista.innerHTML = '';

    if (carrinho.length === 0) {
        lista.innerHTML = `
            <div class="carrinho-vazio">
                <h3>Seu carrinho está vazio.</h3>
                <p>Adicione produtos para continuar sua compra.</p>
                <a href="produtos.html">Explorar produtos</a>
            </div>
        `;

        atualizarResumo(0);
        return;
    }

    let subtotal = 0;

    carrinho.forEach(item => {
        const produto = produtosDisponiveis.find(
            p => p.id === item.id
        );

        if (!produto) return;

        const quantidade = item.quantidade;
        const totalProduto = produto.preco * quantidade;

        subtotal += totalProduto;

        const card = document.createElement('div');
        card.className = 'item-carrinho';

        const imagem = document.createElement('div');
        imagem.className = 'imagem-carrinho';

        if (produto.imagem) {
            const img = document.createElement('img');
            img.src = produto.imagem;
            img.alt = produto.nome;
            imagem.appendChild(img);
        } else {
            imagem.textContent = 'AUTO';
        }

        const informacoes = document.createElement('div');
        informacoes.className = 'informacoes-carrinho';

        const nome = document.createElement('h3');
        nome.textContent = produto.nome;

        const marca = document.createElement('p');
        marca.textContent = produto.marca;

        const preco = document.createElement('strong');
        preco.textContent = formatarMoeda(produto.preco);

        const controles = document.createElement('div');
        controles.className = 'controles-quantidade';

        const botaoMenos = document.createElement('button');
        botaoMenos.textContent = '-';
        botaoMenos.disabled = quantidade <= 1;

        botaoMenos.addEventListener('click', () => {
            alterarQuantidade(produto.id, -1);
        });

        const quantidadeTexto = document.createElement('span');
        quantidadeTexto.textContent = quantidade;

        const botaoMais = document.createElement('button');
        botaoMais.textContent = '+';
        botaoMais.disabled = quantidade >= produto.estoque;

        botaoMais.addEventListener('click', () => {
            alterarQuantidade(produto.id, 1);
        });

        controles.appendChild(botaoMenos);
        controles.appendChild(quantidadeTexto);
        controles.appendChild(botaoMais);

        const remover = document.createElement('button');
        remover.className = 'remover-item';
        remover.textContent = 'Remover produto';

        remover.addEventListener('click', () => {
            removerProduto(produto.id);
        });

        informacoes.appendChild(nome);
        informacoes.appendChild(marca);
        informacoes.appendChild(preco);
        informacoes.appendChild(controles);
        informacoes.appendChild(remover);

        const total = document.createElement('strong');
        total.className = 'total-item';
        total.textContent = formatarMoeda(totalProduto);

        card.appendChild(imagem);
        card.appendChild(informacoes);
        card.appendChild(total);

        lista.appendChild(card);
    });

    atualizarResumo(subtotal);
}

function alterarQuantidade(id, alteracao) {
    const carrinho = obterItensCarrinho();

    const item = carrinho.find(produto => produto.id === id);

    const produto = produtosDisponiveis.find(
        produto => produto.id === id
    );

    if (!item || !produto) return;

    const novaQuantidade = item.quantidade + alteracao;

    if (novaQuantidade < 1) return;

    if (novaQuantidade > produto.estoque) {
        alert('Quantidade maior que o estoque disponível.');
        return;
    }

    item.quantidade = novaQuantidade;

    salvarItensCarrinho(carrinho);

    exibirCarrinho();
    atualizarQuantidadeCarrinho();
}

function removerProduto(id) {
    const carrinho = obterItensCarrinho();

    const novoCarrinho = carrinho.filter(
        item => item.id !== id
    );

    salvarItensCarrinho(novoCarrinho);

    exibirCarrinho();
    atualizarQuantidadeCarrinho();
}

function atualizarResumo(subtotal) {
    document.getElementById('subtotalCarrinho').textContent =
        formatarMoeda(subtotal);

    document.getElementById('totalCarrinho').textContent =
        formatarMoeda(subtotal);
}

document.getElementById('botaoFinalizar').addEventListener('click', () => {
    const token = localStorage.getItem('token');

    if (token) {
        window.location.href = 'checkout.html';
    } else {
        window.location.href = 'login.html';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    atualizarQuantidadeCarrinho();
    carregarCarrinho();
});