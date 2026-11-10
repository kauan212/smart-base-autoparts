const API_ADMIN_PEDIDOS = 'http://localhost:3000';
let pedidosAdmin = [];

// ATUALIZAR RESUMO DOS PEDIDOS
function atualizarResumoPedidosAdmin(pedidos) {

    const total = pedidos.length;

    const aguardando = pedidos.filter(
        pedido => pedido.status === 'Aguardando pagamento'
    ).length;

    const preparacao = pedidos.filter(
        pedido => pedido.status === 'Em preparação'
    ).length;

    const enviados = pedidos.filter(
        pedido => pedido.status === 'Enviado'
    ).length;

    const entregues = pedidos.filter(
        pedido => pedido.status === 'Entregue'
    ).length;

    document.getElementById('totalPedidos').textContent = total;

    document.getElementById('pedidosAguardando').textContent = aguardando;

    document.getElementById('pedidosPreparacao').textContent = preparacao;

    document.getElementById('pedidosEnviados').textContent = enviados;

    document.getElementById('pedidosEntregues').textContent = entregues;
}

const STATUS_PEDIDOS = [
    'Aguardando pagamento',
    'Pagamento aprovado',
    'Em preparação',
    'Enviado',
    'Entregue',
    'Cancelado'
];

document.addEventListener('DOMContentLoaded', () => {
    carregarPedidosAdmin();
});

async function carregarPedidosAdmin() {
    const lista = document.getElementById('listaAdminPedidos');
    const token = localStorage.getItem('token');

    try {
        const resposta = await fetch(`${API_ADMIN_PEDIDOS}/api/admin/pedidos`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const pedidos = await resposta.json();

        if (!resposta.ok) {
            throw new Error(pedidos.mensagem || 'Erro ao consultar pedidos.');
        }

        pedidosAdmin = pedidos;

// Atualizar indicadores do painel
atualizarResumoPedidosAdmin(pedidosAdmin);

// Exibir pedidos
exibirPedidosAdmin(pedidosAdmin);

    } catch (erro) {
        console.error(erro);
        lista.textContent = erro.message;
    }
}

function criarInformacao(rotulo, valor) {
    const paragrafo = document.createElement('p');
    paragrafo.textContent = `${rotulo}: ${valor || 'Não informado'}`;
    return paragrafo;
}

function exibirPedidosAdmin(pedidos) {
    const lista = document.getElementById('listaAdminPedidos');

    lista.innerHTML = '';

    if (pedidos.length === 0) {
    lista.textContent = pedidosAdmin.length === 0
        ? 'Nenhum pedido realizado até o momento.'
        : 'Nenhum pedido encontrado com os filtros selecionados.';
    return;
}

    pedidos.forEach(pedido => {
        const cartao = document.createElement('article');
        cartao.className = 'admin-pedido';

        const titulo = document.createElement('h3');
        titulo.textContent = `Pedido #${pedido.id}`;

        const data = document.createElement('p');
        data.textContent = `Data: ${pedido.criadoEm
            ? new Date(pedido.criadoEm).toLocaleString('pt-BR')
            : 'Não informada'}`;

        // Dados do cliente
        const secaoCliente = document.createElement('div');
        secaoCliente.className = 'admin-pedido-cliente';

        const tituloCliente = document.createElement('h4');
        tituloCliente.textContent = 'Dados do cliente';

        secaoCliente.appendChild(tituloCliente);
        secaoCliente.appendChild(
            criarInformacao('Nome', pedido.cliente?.nome)
        );
        secaoCliente.appendChild(
            criarInformacao('E-mail', pedido.cliente?.email)
        );
        secaoCliente.appendChild(
            criarInformacao('Telefone', pedido.cliente?.telefone)
        );

        // Endereço de entrega
        const entrega = pedido.dadosEntrega || {};

        const secaoEntrega = document.createElement('div');
        secaoEntrega.className = 'admin-pedido-entrega';

        const tituloEntrega = document.createElement('h4');
        tituloEntrega.textContent = 'Endereço de entrega';

        secaoEntrega.appendChild(tituloEntrega);
        secaoEntrega.appendChild(
            criarInformacao('CEP', entrega.cep)
        );
        secaoEntrega.appendChild(
            criarInformacao('Endereço', entrega.endereco)
        );
        secaoEntrega.appendChild(
            criarInformacao('Número', entrega.numero)
        );
        secaoEntrega.appendChild(
            criarInformacao('Bairro', entrega.bairro)
        );
        secaoEntrega.appendChild(
            criarInformacao('Cidade', entrega.cidade)
        );

        // Valor e pagamento
        const resumoFinanceiro = document.createElement('div');
resumoFinanceiro.className = 'admin-pedido-resumo';

const tituloFinanceiro = document.createElement('h4');
tituloFinanceiro.textContent = 'Resumo financeiro';

const valor = document.createElement('p');
valor.textContent = `Total do pedido: ${Number(pedido.valorTotal || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
})}`;

resumoFinanceiro.appendChild(tituloFinanceiro);
resumoFinanceiro.appendChild(valor);

        const pagamento = document.createElement('p');
        pagamento.textContent = `Pagamento: ${pedido.formaPagamento || 'Não informado'}`;

        // Produtos
        const itens = document.createElement('div');
        itens.className = 'admin-pedido-itens';

        const tituloItens = document.createElement('h4');
        tituloItens.textContent = 'Produtos:';
        itens.appendChild(tituloItens);

        (pedido.itens || []).forEach(item => {

    const cartaoProduto = document.createElement('div');
    cartaoProduto.className = 'admin-pedido-produto';

    const nomeProduto = document.createElement('h5');
    nomeProduto.textContent = item.nome || 'Produto';

    const quantidade = document.createElement('p');
    quantidade.textContent = `Quantidade: ${item.quantidade}`;

    const precoUnitario = document.createElement('p');
    precoUnitario.textContent = `Preço unitário: ${Number(item.precoUnitario || 0).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    })}`;

    const subtotal = document.createElement('p');
    subtotal.className = 'admin-pedido-produto-subtotal';
    subtotal.textContent = `Subtotal: ${Number(item.subtotal || 0).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    })}`;

    cartaoProduto.appendChild(nomeProduto);
    cartaoProduto.appendChild(quantidade);
    cartaoProduto.appendChild(precoUnitario);
    cartaoProduto.appendChild(subtotal);

    itens.appendChild(cartaoProduto);
});

        // Status
        const areaStatus = document.createElement('div');
        areaStatus.className = 'admin-pedido-status';

        const label = document.createElement('label');
        label.textContent = 'Status do pedido:';

        const seletor = document.createElement('select');
seletor.dataset.id = pedido.id;

function aplicarCorStatus(status) {
    seletor.className = '';

    const classesStatus = {
        'Aguardando pagamento': 'status-aguardando',
        'Pagamento aprovado': 'status-aprovado',
        'Em preparação': 'status-preparacao',
        'Enviado': 'status-enviado',
        'Entregue': 'status-entregue',
        'Cancelado': 'status-cancelado'
    };

    seletor.classList.add(classesStatus[status] || '');
}

STATUS_PEDIDOS.forEach(status => {
    const opcao = document.createElement('option');
    opcao.value = status;
    opcao.textContent = status;

    if (pedido.status === status) {
        opcao.selected = true;
    }

    seletor.appendChild(opcao);
});

aplicarCorStatus(pedido.status);

seletor.addEventListener('change', () => {
    aplicarCorStatus(seletor.value);
    atualizarStatusAdmin(pedido.id, seletor.value, seletor);
});

areaStatus.appendChild(label);
areaStatus.appendChild(seletor);

        // Montagem do cartão
        cartao.appendChild(titulo);
        cartao.appendChild(data);
        cartao.appendChild(secaoCliente);
        cartao.appendChild(secaoEntrega);
        resumoFinanceiro.appendChild(pagamento);
        cartao.appendChild(resumoFinanceiro);
        cartao.appendChild(itens);
        cartao.appendChild(areaStatus);

        lista.appendChild(cartao);
    });
}

async function atualizarStatusAdmin(id, status, seletor) {
    const token = localStorage.getItem('token');

    seletor.disabled = true;

    try {
        const resposta = await fetch(
            `${API_ADMIN_PEDIDOS}/api/admin/pedidos/${id}/status`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            }
        );

        const resultado = await resposta.json();

        if (!resposta.ok) {
            throw new Error(resultado.mensagem || 'Erro ao atualizar status.');
        }

        alert('Status do pedido atualizado com sucesso!');

    } catch (erro) {
        console.error(erro);
        alert(erro.message);
        carregarPedidosAdmin();

    } finally {
        seletor.disabled = false;
    }
}

// FILTRAR E PESQUISAR PEDIDOS
// FILTRAR, PESQUISAR E ORDENAR PEDIDOS
function filtrarPedidosAdmin() {
    const filtroStatus = document.getElementById('filtroStatusPedido').value;

    const busca = document.getElementById('buscaPedido').value
        .trim()
        .toLowerCase();

    const ordenacao = document.getElementById('ordenarPedidos').value;

    let pedidosFiltrados = pedidosAdmin.filter(pedido => {

        const statusCorresponde =
            !filtroStatus || pedido.status === filtroStatus;

        const nomeCliente = pedido.cliente?.nome || '';
        const numeroPedido = pedido.id || '';

        const buscaCorresponde =
            nomeCliente.toLowerCase().includes(busca) ||
            numeroPedido.toLowerCase().includes(busca);

        return statusCorresponde && buscaCorresponde;
    });

    // ORDENAR POR DATA
    pedidosFiltrados.sort((a, b) => {
        const dataA = new Date(a.criadoEm);
        const dataB = new Date(b.criadoEm);

        if (ordenacao === 'antigos') {
            return dataA - dataB;
        }

        return dataB - dataA;
    });

    exibirPedidosAdmin(pedidosFiltrados);
}

// EVENTOS DOS FILTROS
document.getElementById('filtroStatusPedido')
    .addEventListener('change', filtrarPedidosAdmin);

document.getElementById('buscaPedido')
    .addEventListener('input', filtrarPedidosAdmin);

document.getElementById('ordenarPedidos')
    .addEventListener('change', filtrarPedidosAdmin);