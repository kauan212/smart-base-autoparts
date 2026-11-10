const API_URL = '/api/artigos';

let paginaAtual = 1;
let totalPaginas = 1;
let buscaAtual = '';

const listaArtigos = document.getElementById('listaArtigos');
const mensagem = document.getElementById('mensagem');
const campoBusca = document.getElementById('campoBusca');
const btnPesquisar = document.getElementById('btnPesquisar');
const totalArtigos = document.getElementById('totalArtigos');
const informacaoPagina = document.getElementById('informacaoPagina');
const paginaAnterior = document.getElementById('paginaAnterior');
const proximaPagina = document.getElementById('proximaPagina');

// CARREGAR ARTIGOS
async function carregarArtigos() {
    mensagem.style.display = 'block';
    mensagem.textContent = 'Carregando artigos...';
    listaArtigos.innerHTML = '';

    try {
        const parametros = new URLSearchParams({
            pagina: paginaAtual,
            limite: 9
        });

        if (buscaAtual.trim()) {
            parametros.append('busca', buscaAtual.trim());
        }

        const resposta = await fetch(`${API_URL}?${parametros}`);

        if (!resposta.ok) {
            throw new Error('Não foi possível consultar os artigos.');
        }

        const dados = await resposta.json();

        totalPaginas = Math.max(1, dados.totalPaginas || 1);

        totalArtigos.textContent =
            `${dados.total} artigo(s) disponível(is)`;

        informacaoPagina.textContent =
            `Página ${paginaAtual} de ${totalPaginas}`;

        paginaAnterior.disabled = paginaAtual <= 1;
        proximaPagina.disabled = paginaAtual >= totalPaginas;

        if (!dados.artigos || dados.artigos.length === 0) {
            mensagem.textContent = 'Nenhum artigo encontrado.';
            return;
        }

        mensagem.style.display = 'none';

        dados.artigos.forEach(artigo => {
            listaArtigos.appendChild(criarCartao(artigo));
        });

    } catch (erro) {
        console.error('Erro ao carregar artigos:', erro);

        mensagem.textContent =
            'Não foi possível carregar os artigos. Verifique se o servidor está funcionando.';

        totalArtigos.textContent = 'Falha na consulta';
    }
}

// CRIAR CARTÃO DE ARTIGO
function criarCartao(artigo) {
    const cartao = document.createElement('article');
    cartao.className = 'cartao-artigo';

    const categoria = artigo.categoria?.nome || 'Sem categoria';

    const resumo = artigo.resumo ||
        (artigo.conteudo || '').substring(0, 140);

    const autor = artigo.autor?.nome || 'Autor não informado';

    const tags = (artigo.tags || [])
        .map(item => item.tag?.nome)
        .filter(Boolean);

    cartao.innerHTML = `
        <span class="cartao-categoria">${escaparHTML(categoria)}</span>

        <h3>${escaparHTML(artigo.titulo)}</h3>

        <p>${escaparHTML(resumo)}</p>

        <div class="cartao-tags">
            ${tags.slice(0, 4).map(tag =>
                `<span>${escaparHTML(tag)}</span>`
            ).join('')}
        </div>

        <div class="cartao-rodape">
            <span>${escaparHTML(autor)}</span>
            <span>Consultar artigo →</span>
        </div>
    `;

    cartao.addEventListener('click', () => {
        abrirArtigo(artigo.id);
    });

    return cartao;
}

// ABRIR DETALHES DO ARTIGO
async function abrirArtigo(id) {
    try {
        const resposta = await fetch(`${API_URL}/${id}`);

        if (!resposta.ok) {
            throw new Error('Não foi possível abrir o artigo.');
        }

        const artigo = await resposta.json();

        exibirDetalhes(artigo);

    } catch (erro) {
        console.error(erro);
        alert('Não foi possível carregar os detalhes do artigo.');
    }
}

// EXIBIR DETALHES
function exibirDetalhes(artigo) {
    let modal = document.getElementById('modalArtigo');

    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modalArtigo';
        modal.className = 'modal-artigo';

        document.body.appendChild(modal);
    }

    const tags = (artigo.tags || [])
        .map(item => item.tag?.nome)
        .filter(Boolean);

    modal.innerHTML = `
        <div class="modal-conteudo">
            <button class="modal-fechar" id="fecharModal">Fechar</button>

            <span class="cartao-categoria">
                ${escaparHTML(artigo.categoria?.nome || 'Sem categoria')}
            </span>

            <h2>${escaparHTML(artigo.titulo)}</h2>

            <p class="modal-resumo">
                ${escaparHTML(artigo.resumo || '')}
            </p>

            <div class="modal-informacoes">
                <span>Autor: ${escaparHTML(artigo.autor?.nome || 'Não informado')}</span>
                <span>Produto: ${escaparHTML(artigo.produto?.nome || 'Não vinculado')}</span>
            </div>

            <div class="modal-texto">
                ${escaparHTML(artigo.conteudo || '').replace(/\n/g, '<br>')}
            </div>

            <div class="cartao-tags">
                ${tags.map(tag =>
                    `<span>${escaparHTML(tag)}</span>`
                ).join('')}
            </div>
        </div>
    `;

    modal.style.display = 'flex';

    document.getElementById('fecharModal').addEventListener('click', fecharModal);

    modal.addEventListener('click', function(evento) {
        if (evento.target === modal) {
            fecharModal();
        }
    });
}

function fecharModal() {
    const modal = document.getElementById('modalArtigo');

    if (modal) {
        modal.style.display = 'none';
    }
}

// PROTEÇÃO CONTRA HTML INJETADO
function escaparHTML(valor) {
    return String(valor ?? '').replace(/[&<>"']/g, caractere => {
        const entidades = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        };

        return entidades[caractere];
    });
}

// PESQUISAR
function pesquisar() {
    buscaAtual = campoBusca.value.trim();
    paginaAtual = 1;
    carregarArtigos();
}

btnPesquisar.addEventListener('click', pesquisar);

campoBusca.addEventListener('keydown', evento => {
    if (evento.key === 'Enter') {
        pesquisar();
    }
});

// PAGINAÇÃO
paginaAnterior.addEventListener('click', () => {
    if (paginaAtual > 1) {
        paginaAtual--;
        carregarArtigos();
    }
});

proximaPagina.addEventListener('click', () => {
    if (paginaAtual < totalPaginas) {
        paginaAtual++;
        carregarArtigos();
    }
});

// CARREGAMENTO INICIAL
carregarArtigos();
