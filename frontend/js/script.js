const API_URL = 'http://localhost:3000';

async function carregarDestaques() {
    const lista = document.getElementById('listaDestaques');

    if (!lista) return;

    try {
        const resposta = await fetch(`${API_URL}/api/produtos`);

        if (!resposta.ok) {
            throw new Error('Erro ao buscar produtos.');
        }

        const produtos = await resposta.json();

        lista.innerHTML = '';

        const destaques = produtos.slice(0, 4);

        if (destaques.length === 0) {
            lista.innerHTML = '<p>Nenhum produto cadastrado.</p>';
            return;
        }

        destaques.forEach(produto => {
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

            const preco = document.createElement('div');
            preco.className = 'produto-preco';
            preco.textContent = Number(produto.preco).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });

            const botao = document.createElement('button');
            botao.textContent = 'Adicionar ao carrinho';
            botao.disabled = produto.estoque <= 0;
            botao.addEventListener('click', () => adicionarCarrinho(produto.id));

            informacoes.appendChild(nome);
            informacoes.appendChild(marca);
            informacoes.appendChild(preco);
            informacoes.appendChild(botao);

            card.appendChild(imagem);
            card.appendChild(informacoes);

            lista.appendChild(card);
        });

    } catch (erro) {
        console.error('Erro:', erro);
        lista.innerHTML = '<p>Não foi possível carregar os produtos. Verifique se o servidor está funcionando.</p>';
    }
}

function pesquisarProdutos() {
    const campo = document.getElementById('campoPesquisa');
    const pesquisa = campo.value.trim();

    if (pesquisa !== '') {
        window.location.href = `produtos.html?pesquisa=${encodeURIComponent(pesquisa)}`;
    }
}

const botaoPesquisa = document.getElementById('botaoPesquisa');
const campoPesquisa = document.getElementById('campoPesquisa');

if (botaoPesquisa && campoPesquisa) {
    botaoPesquisa.addEventListener('click', pesquisarProdutos);

    campoPesquisa.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            pesquisarProdutos();
        }
    });
}

function obterCarrinho() {
    return JSON.parse(localStorage.getItem('carrinho')) || [];
}

function atualizarQuantidadeCarrinho() {
    const carrinho = obterCarrinho();

    const quantidade = carrinho.reduce(
        (total, item) => total + item.quantidade,
        0
    );

    const elemento = document.getElementById('quantidadeCarrinho');

    if (elemento) {
        elemento.textContent = quantidade;
    }
}

function adicionarCarrinho(id) {
    let carrinho = obterCarrinho();

    const produtoExistente = carrinho.find(item => item.id === id);

    if (produtoExistente) {
        produtoExistente.quantidade++;
    } else {
        carrinho.push({
            id: id,
            quantidade: 1
        });
    }

    localStorage.setItem('carrinho', JSON.stringify(carrinho));

    atualizarQuantidadeCarrinho();

    alert('Produto adicionado ao carrinho!');
}

function atualizarAcoesUsuario() {
    const acoes = document.getElementById('acoesUsuario');

    if (!acoes) return;

    const token = localStorage.getItem('token');
    const usuarioSalvo = localStorage.getItem('usuario');

    if (!token || !usuarioSalvo) return;

    try {
        const usuario = JSON.parse(usuarioSalvo);

        acoes.innerHTML = '';

        const nome = document.createElement('span');
        nome.textContent = `Olá, ${usuario.nome.split(' ')[0]}`;

        if (usuario.tipo === 'admin') {
            const linkAdmin = document.createElement('a');
            linkAdmin.href = 'admin.html';
            linkAdmin.textContent = 'Painel administrativo';

            acoes.appendChild(linkAdmin);
        } else {
            const linkPedidos = document.createElement('a');
            linkPedidos.href = 'meus-pedidos.html';
            linkPedidos.textContent = 'Meus pedidos';

            acoes.appendChild(linkPedidos);
        }

        const linkCarrinho = document.createElement('a');
        linkCarrinho.href = 'carrinho.html';
        linkCarrinho.className = 'carrinho';
        linkCarrinho.innerHTML = 'Carrinho <span id="quantidadeCarrinho">0</span>';

        const botaoSair = document.createElement('a');
        botaoSair.href = '#';
        botaoSair.textContent = 'Sair';

        botaoSair.addEventListener('click', (evento) => {
            evento.preventDefault();

            localStorage.removeItem('token');
            localStorage.removeItem('usuario');

            window.location.href = 'index.html';
        });

        acoes.insertBefore(nome, acoes.firstChild);
        acoes.appendChild(linkCarrinho);
        acoes.appendChild(botaoSair);

    } catch (erro) {
        console.error('Erro ao identificar usuário:', erro);

        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
    }
}
document.addEventListener('DOMContentLoaded', () => {
    atualizarAcoesUsuario();
    atualizarQuantidadeCarrinho();
    carregarDestaques();
});