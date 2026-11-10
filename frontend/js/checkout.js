const API_CHECKOUT = 'http://localhost:3000';

let produtosCheckout = [];

function obterCarrinhoCheckout() {
    return JSON.parse(localStorage.getItem('carrinho')) || [];
}

function formatarValorCheckout(valor) {
    return Number(valor).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

async function carregarCheckout() {
    const token = localStorage.getItem('token');
    const usuarioSalvo = localStorage.getItem('usuario');
    const carrinho = obterCarrinhoCheckout();

    if (!token || !usuarioSalvo) {
        alert('Faça login para finalizar sua compra.');
        window.location.href = 'login.html';
        return;
    }

    if (carrinho.length === 0) {
        alert('Seu carrinho está vazio.');
        window.location.href = 'produtos.html';
        return;
    }

    try {
        const resposta = await fetch(`${API_CHECKOUT}/api/produtos`);

        if (!resposta.ok) {
            throw new Error('Erro ao carregar produtos.');
        }

        produtosCheckout = await resposta.json();

        const usuario = JSON.parse(usuarioSalvo);

        document.getElementById('nome').value = usuario.nome || '';

        exibirResumoCheckout();

    } catch (erro) {
        console.error('Erro ao carregar checkout:', erro);
        document.getElementById('mensagemCheckout').textContent =
            'Não foi possível carregar o resumo da compra.';
    }
}

function exibirResumoCheckout() {
    const carrinho = obterCarrinhoCheckout();
    const resumo = document.getElementById('resumoItensCheckout');

    resumo.innerHTML = '';

    let total = 0;

    carrinho.forEach(item => {
        const produto = produtosCheckout.find(
            p => Number(p.id) === Number(item.id)
        );

        if (!produto) {
            return;
        }

        const subtotal = produto.preco * item.quantidade;
        total += subtotal;

        const linha = document.createElement('div');
        linha.className = 'linha-resumo';

        const nome = document.createElement('span');
        nome.textContent = `${produto.nome} (x${item.quantidade})`;

        const valor = document.createElement('strong');
        valor.textContent = formatarValorCheckout(subtotal);

        linha.appendChild(nome);
        linha.appendChild(valor);

        resumo.appendChild(linha);
    });

    document.getElementById('subtotalCheckout').textContent =
        formatarValorCheckout(total);

    document.getElementById('totalCheckout').textContent =
        formatarValorCheckout(total);
}

document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('formCheckout');

    carregarCheckout();

    formulario.addEventListener('submit', async (evento) => {
        evento.preventDefault();

        const mensagem = document.getElementById('mensagemCheckout');
        const token = localStorage.getItem('token');
        const carrinho = obterCarrinhoCheckout();

        if (!token) {
            alert('Sua sessão expirou. Faça login novamente.');
            window.location.href = 'login.html';
            return;
        }

        const dadosEntrega = {
            cep: document.getElementById('cep').value.trim(),
            endereco: document.getElementById('endereco').value.trim(),
            numero: document.getElementById('numero').value.trim(),
            bairro: document.getElementById('bairro').value.trim(),
            cidade: document.getElementById('cidade').value.trim()
        };

        const formaPagamento = document.getElementById('pagamento').value;

        try {
            const resposta = await fetch(`${API_CHECKOUT}/api/pedidos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    itens: carrinho,
                    dadosEntrega,
                    formaPagamento
                })
            });

            const dados = await resposta.json();

            if (!resposta.ok) {
                mensagem.textContent = dados.mensagem || 'Não foi possível finalizar o pedido.';
                return;
            }

            localStorage.removeItem('carrinho');
            atualizarQuantidadeCarrinho();

            mensagem.style.color = 'green';
            mensagem.textContent = `Pedido realizado com sucesso! Número: ${dados.pedido.id}`;

            formulario.reset();

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);

        } catch (erro) {
            console.error('Erro ao finalizar pedido:', erro);
            mensagem.textContent = 'Não foi possível conectar ao servidor.';
        }
    });
});