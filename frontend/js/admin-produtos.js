const API_ADMIN_PRODUTOS = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', () => {
    carregarProdutosAdmin();

    document.getElementById('formProduto').addEventListener('submit', salvarProduto);

    document.getElementById('botaoCancelarEdicao').addEventListener('click', limparFormularioProduto);

    document.getElementById('listaAdminProdutos').addEventListener('click', (evento) => {
        const botao = evento.target.closest('button');

        if (!botao) return;

        const id = botao.dataset.id;

        if (botao.classList.contains('botao-editar-produto')) {
            editarProduto(id);
        }

        if (botao.classList.contains('botao-excluir-produto')) {
            excluirProduto(id);
        }
    });
});

async function carregarProdutosAdmin() {
    const lista = document.getElementById('listaAdminProdutos');

    try {
        const resposta = await fetch(`${API_ADMIN_PRODUTOS}/api/produtos`);
        const produtos = await resposta.json();

        if (!resposta.ok) {
            throw new Error('Não foi possível consultar os produtos.');
        }

        exibirProdutosAdmin(produtos);

    } catch (erro) {
        console.error(erro);
        lista.textContent = 'Erro ao carregar os produtos.';
    }
}

function exibirProdutosAdmin(produtos) {
    const lista = document.getElementById('listaAdminProdutos');

    lista.innerHTML = '';

    if (produtos.length === 0) {
        lista.textContent = 'Nenhum produto cadastrado.';
        return;
    }

    produtos.forEach(produto => {
        const cartao = document.createElement('article');
        cartao.className = 'admin-produto';

        const nome = document.createElement('h4');
        nome.textContent = produto.nome;

        const categoria = document.createElement('p');
        categoria.textContent = `Categoria: ${produto.categoria}`;

        const marca = document.createElement('p');
        marca.textContent = `Marca: ${produto.marca}`;

        const modelo = document.createElement('p');
        modelo.textContent = `Modelo: ${produto.modelo}`;

        const preco = document.createElement('p');
        preco.textContent = `Preço: ${Number(produto.preco).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        })}`;

        const estoque = document.createElement('p');
        estoque.textContent = `Estoque: ${produto.estoque} unidades`;

        const acoes = document.createElement('div');
        acoes.className = 'admin-acoes-produto';

        const botaoEditar = document.createElement('button');
        botaoEditar.type = 'button';
        botaoEditar.textContent = 'Editar';
        botaoEditar.className = 'botao-editar-produto';
        botaoEditar.dataset.id = produto.id;

        const botaoExcluir = document.createElement('button');
        botaoExcluir.type = 'button';
        botaoExcluir.textContent = 'Excluir';
        botaoExcluir.className = 'botao-excluir-produto';
        botaoExcluir.dataset.id = produto.id;

        acoes.appendChild(botaoEditar);
        acoes.appendChild(botaoExcluir);

        cartao.appendChild(nome);
        cartao.appendChild(categoria);
        cartao.appendChild(marca);
        cartao.appendChild(modelo);
        cartao.appendChild(preco);
        cartao.appendChild(estoque);
        cartao.appendChild(acoes);

        lista.appendChild(cartao);
    });
}

async function salvarProduto(evento) {
    evento.preventDefault();

    const token = localStorage.getItem('token');
    const id = document.getElementById('produtoId').value;

    const produto = {
        nome: document.getElementById('nomeProduto').value.trim(),
        categoria: document.getElementById('categoriaProduto').value,
        marca: document.getElementById('marcaProduto').value.trim(),
        modelo: document.getElementById('modeloProduto').value.trim(),
        compatibilidade: document.getElementById('compatibilidadeProduto').value.trim(),
        preco: Number(document.getElementById('precoProduto').value),
        estoque: Number(document.getElementById('estoqueProduto').value),
        imagem: document.getElementById('imagemProduto').value.trim(),
        descricao: document.getElementById('descricaoProduto').value.trim()
    };

    const mensagem = document.getElementById('mensagemProduto');
    const metodo = id ? 'PUT' : 'POST';
    const endereco = id
        ? `${API_ADMIN_PRODUTOS}/api/admin/produtos/${id}`
        : `${API_ADMIN_PRODUTOS}/api/admin/produtos`;

    try {
        const resposta = await fetch(endereco, {
            method: metodo,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(produto)
        });

        const resultado = await resposta.json();

        if (resposta.status === 401 || resposta.status === 403) {
            throw new Error(resultado.mensagem || 'Acesso não autorizado.');
        }

        if (!resposta.ok) {
            throw new Error(resultado.mensagem || 'Erro ao salvar produto.');
        }

        mensagem.textContent = resultado.mensagem;
        mensagem.style.color = 'green';

        limparFormularioProduto();
        await carregarProdutosAdmin();

    } catch (erro) {
        console.error(erro);
        mensagem.textContent = erro.message;
        mensagem.style.color = 'red';
    }
}

async function editarProduto(id) {
    try {
        const resposta = await fetch(`${API_ADMIN_PRODUTOS}/api/produtos`);
        const produtos = await resposta.json();

        const produto = produtos.find(item => item.id === id);

        if (!produto) {
            alert('Produto não encontrado.');
            return;
        }

        document.getElementById('produtoId').value = produto.id;
        document.getElementById('nomeProduto').value = produto.nome;
        document.getElementById('categoriaProduto').value = produto.categoria;
        document.getElementById('marcaProduto').value = produto.marca;
        document.getElementById('modeloProduto').value = produto.modelo;
        document.getElementById('compatibilidadeProduto').value = produto.compatibilidade || '';
        document.getElementById('precoProduto').value = produto.preco;
        document.getElementById('estoqueProduto').value = produto.estoque;
        document.getElementById('imagemProduto').value = produto.imagem || '';
        document.getElementById('descricaoProduto').value = produto.descricao || '';

        document.getElementById('tituloFormularioProduto').textContent = 'Editar produto';
        document.getElementById('botaoSalvarProduto').textContent = 'Salvar alterações';
        document.getElementById('botaoCancelarEdicao').hidden = false;

        document.getElementById('gerenciarProdutos').scrollIntoView({
            behavior: 'smooth'
        });

    } catch (erro) {
        console.error(erro);
        alert('Não foi possível carregar os dados do produto.');
    }
}

async function excluirProduto(id) {
    const confirmar = confirm('Tem certeza de que deseja excluir este produto?');

    if (!confirmar) return;

    const token = localStorage.getItem('token');

    try {
        const resposta = await fetch(
            `${API_ADMIN_PRODUTOS}/api/admin/produtos/${id}`,
            {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        const resultado = await resposta.json();

        if (!resposta.ok) {
            throw new Error(resultado.mensagem || 'Erro ao excluir produto.');
        }

        alert(resultado.mensagem);
        await carregarProdutosAdmin();

    } catch (erro) {
        console.error(erro);
        alert(erro.message);
    }
}

function limparFormularioProduto() {
    document.getElementById('formProduto').reset();
    document.getElementById('produtoId').value = '';

    document.getElementById('tituloFormularioProduto').textContent = 'Cadastrar novo produto';
    document.getElementById('botaoSalvarProduto').textContent = 'Cadastrar produto';
    document.getElementById('botaoCancelarEdicao').hidden = true;

    document.getElementById('mensagemProduto').textContent = '';
}