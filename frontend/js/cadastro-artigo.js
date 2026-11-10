const API_URL = '/api/artigos';

const formulario = document.getElementById('formArtigo');
const campoAutor = document.getElementById('autorId');
const campoCategoria = document.getElementById('categoriaId');
const campoProduto = document.getElementById('produtoId');
const mensagem = document.getElementById('mensagemCadastro');
const botaoSalvar = document.getElementById('btnSalvar');

// CARREGAR AUTORES, CATEGORIAS E PRODUTOS
async function carregarOpcoes() {
    try {
        const resposta = await fetch(`${API_URL}/opcoes`);

        if (!resposta.ok) {
            throw new Error('Erro ao consultar as opções.');
        }

        const dados = await resposta.json();

        preencherSelect(campoAutor, dados.autores, 'Selecione o autor');
        preencherSelect(campoCategoria, dados.categorias, 'Selecione a categoria');

        preencherSelect(
            campoProduto,
            dados.produtos,
            'Nenhum produto vinculado',
            true
        );

    } catch (erro) {
        console.error('Erro ao carregar opções:', erro);

        mostrarMensagem(
            'Não foi possível carregar autores, categorias e produtos. Verifique o servidor.',
            'erro'
        );
    }
}

// PREENCHER LISTAS
function preencherSelect(campo, itens, textoInicial, produto = false) {
    campo.innerHTML = '';

    const opcaoInicial = document.createElement('option');
    opcaoInicial.value = '';
    opcaoInicial.textContent = textoInicial;

    campo.appendChild(opcaoInicial);

    itens.forEach(item => {
        const opcao = document.createElement('option');

        opcao.value = item.id;

        if (produto) {
            opcao.textContent = `${item.nome} (${item.codigo})`;
        } else {
            opcao.textContent = item.nome;
        }

        campo.appendChild(opcao);
    });
}

// EXIBIR MENSAGEM
function mostrarMensagem(texto, tipo) {
    mensagem.textContent = texto;
    mensagem.className = `mensagem-cadastro ${tipo}`;
    mensagem.style.display = 'block';
}

// CADASTRAR ARTIGO
formulario.addEventListener('submit', async evento => {
    evento.preventDefault();

    const dados = {
        titulo: document.getElementById('titulo').value.trim(),
        resumo: document.getElementById('resumo').value.trim(),
        conteudo: document.getElementById('conteudo').value.trim(),
        autorId: Number(campoAutor.value),
        categoriaId: Number(campoCategoria.value),
        produtoId: campoProduto.value
            ? Number(campoProduto.value)
            : null,
        tags: document.getElementById('tags').value
            .split(',')
            .map(tag => tag.trim())
            .filter(Boolean)
    };

    if (!dados.titulo || !dados.conteudo ||
        !dados.autorId || !dados.categoriaId) {
        mostrarMensagem(
            'Preencha o título, conteúdo, autor e categoria.',
            'erro'
        );
        return;
    }

    botaoSalvar.disabled = true;
    botaoSalvar.textContent = 'Cadastrando...';

    mensagem.className = 'mensagem-cadastro';
    mensagem.style.display = 'none';

    try {
        const resposta = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });

        const resultado = await resposta.json();

        if (!resposta.ok) {
            throw new Error(
                resultado.mensagem || 'Não foi possível cadastrar o artigo.'
            );
        }

        mostrarMensagem(
            `Artigo "${resultado.artigo.titulo}" cadastrado com sucesso! ID: ${resultado.artigo.id}`,
            'sucesso'
        );

        formulario.reset();

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

    } catch (erro) {
        console.error('Erro ao cadastrar artigo:', erro);

        mostrarMensagem(
            erro.message || 'Ocorreu um erro ao cadastrar o artigo.',
            'erro'
        );

    } finally {
        botaoSalvar.disabled = false;
        botaoSalvar.textContent = 'Cadastrar artigo';
    }
});

// INICIALIZAÇÃO
carregarOpcoes();
