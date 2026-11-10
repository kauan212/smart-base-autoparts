const API_MEUS_PEDIDOS = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', () => {
    carregarMeusPedidos();
});

async function carregarMeusPedidos() {
    const lista = document.getElementById('listaPedidos');
    const token = localStorage.getItem('token');

    if (!token) {
        alert('Faça login para consultar seus pedidos.');
        window.location.href = 'login.html';
        return;
    }

    try {
        const resposta = await fetch(`${API_MEUS_PEDIDOS}/api/pedidos/meus-pedidos`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (resposta.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('usuario');

            alert('Sua sessão expirou. Faça login novamente.');
            window.location.href = 'login.html';
            return;
        }

        const pedidos = await resposta.json();

        if (!resposta.ok) {
            throw new Error(pedidos.mensagem || 'Erro ao consultar pedidos.');
        }

        exibirMeusPedidos(pedidos);

    } catch (erro) {
        console.error('Erro ao carregar pedidos:', erro);
        lista.textContent = 'Não foi possível carregar seus pedidos.';
    }
}

function exibirMeusPedidos(pedidos) {
    const lista = document.getElementById('listaPedidos');

    lista.innerHTML = '';

    if (pedidos.length === 0) {
        const mensagem = document.createElement('p');
        mensagem.textContent = 'Você ainda não realizou nenhuma compra.';

        lista.appendChild(mensagem);
        return;
    }

    pedidos.slice().reverse().forEach(pedido => {
        const cartao = document.createElement('article');
        cartao.className = 'cartao-pedido';

        const titulo = document.createElement('h2');
        titulo.textContent = `Pedido: ${pedido.id}`;

        const data = document.createElement('p');
        data.textContent = `Data: ${new Date(pedido.criadoEm).toLocaleString('pt-BR')}`;

        const status = document.createElement('p');
        status.textContent = `Status: ${pedido.status}`;

        const pagamento = document.createElement('p');
        pagamento.textContent = `Pagamento: ${pedido.formaPagamento}`;

        const total = document.createElement('p');
        total.textContent = `Total: ${Number(pedido.valorTotal).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        })}`;

        const subtitulo = document.createElement('h3');
        subtitulo.textContent = 'Produtos:';

        const listaProdutos = document.createElement('ul');

        pedido.itens.forEach(item => {
            const produto = document.createElement('li');

            produto.textContent =
                `${item.nome} — Quantidade: ${item.quantidade} — ` +
                `${Number(item.subtotal).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                })}`;

            listaProdutos.appendChild(produto);
        });

        cartao.appendChild(titulo);
        cartao.appendChild(data);
        cartao.appendChild(status);
        cartao.appendChild(pagamento);
        cartao.appendChild(total);
        cartao.appendChild(subtitulo);
        cartao.appendChild(listaProdutos);

        lista.appendChild(cartao);
    });
}