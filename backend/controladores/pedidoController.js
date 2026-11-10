const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const caminhoPedidos = path.join(__dirname, '..', 'dados', 'pedidos.json');
const caminhoProdutos = path.join(__dirname, '..', 'dados', 'produtos.json');

function lerArquivo(caminho) {
    return JSON.parse(fs.readFileSync(caminho, 'utf8'));
}

function salvarArquivo(caminho, dados) {
    fs.writeFileSync(caminho, JSON.stringify(dados, null, 4), 'utf8');
}

// CRIAR PEDIDO
function criarPedido(req, res) {
    try {
        const { itens, dadosEntrega, formaPagamento } = req.body;

        if (!Array.isArray(itens) || itens.length === 0) {
            return res.status(400).json({
                mensagem: 'O carrinho está vazio.'
            });
        }

        if (
            !dadosEntrega ||
            !dadosEntrega.cep ||
            !dadosEntrega.endereco ||
            !dadosEntrega.numero ||
            !dadosEntrega.bairro ||
            !dadosEntrega.cidade
        ) {
            return res.status(400).json({
                mensagem: 'Preencha todos os dados de entrega.'
            });
        }

        const formasPermitidas = ['Pix', 'Cartão de crédito', 'Boleto'];

        if (!formasPermitidas.includes(formaPagamento)) {
            return res.status(400).json({
                mensagem: 'Selecione uma forma de pagamento válida.'
            });
        }

        const pedidos = lerArquivo(caminhoPedidos);
        const produtos = lerArquivo(caminhoProdutos);

        let valorTotal = 0;
        const itensPedido = [];

        // Validar produtos e estoque
        for (const item of itens) {
            const produto = produtos.find(
                p => p.id === Number(item.id)
            );

            const quantidade = Number(item.quantidade);

            if (!produto) {
                return res.status(404).json({
                    mensagem: `Produto ${item.id} não encontrado.`
                });
            }

            if (!Number.isInteger(quantidade) || quantidade <= 0) {
                return res.status(400).json({
                    mensagem: 'Quantidade de produto inválida.'
                });
            }

            if (produto.estoque < quantidade) {
                return res.status(400).json({
                    mensagem: `Estoque insuficiente para ${produto.nome}.`
                });
            }

            const subtotal = produto.preco * quantidade;

            valorTotal += subtotal;

            itensPedido.push({
                produtoId: produto.id,
                nome: produto.nome,
                quantidade,
                precoUnitario: produto.preco,
                subtotal
            });
        }

        // Baixar estoque
        for (const item of itensPedido) {
            const produto = produtos.find(
                p => p.id === item.produtoId
            );

            produto.estoque -= item.quantidade;
        }

        const novoPedido = {
            id: crypto.randomUUID(),
            usuarioId: req.usuario.id,
            itens: itensPedido,

            dadosEntrega: {
                cep: dadosEntrega.cep.trim(),
                endereco: dadosEntrega.endereco.trim(),
                numero: dadosEntrega.numero.trim(),
                bairro: dadosEntrega.bairro.trim(),
                cidade: dadosEntrega.cidade.trim()
            },

            formaPagamento,
            valorTotal: Number(valorTotal.toFixed(2)),
            status: 'Aguardando pagamento',
            criadoEm: new Date().toISOString()
        };

        pedidos.push(novoPedido);

        salvarArquivo(caminhoProdutos, produtos);
        salvarArquivo(caminhoPedidos, pedidos);

        res.status(201).json({
            mensagem: 'Pedido realizado com sucesso!',
            pedido: novoPedido
        });

    } catch (erro) {
        console.error('Erro ao criar pedido:', erro);

        res.status(500).json({
            mensagem: 'Erro ao registrar o pedido.'
        });
    }
}

// LISTAR PEDIDOS DO CLIENTE AUTENTICADO
function listarMeusPedidos(req, res) {
    try {
        const pedidos = lerArquivo(caminhoPedidos);

        const meusPedidos = pedidos.filter(
            pedido => pedido.usuarioId === req.usuario.id
        );

        res.json(meusPedidos);

    } catch (erro) {
        console.error('Erro ao listar pedidos:', erro);

        res.status(500).json({
            mensagem: 'Erro ao consultar seus pedidos.'
        });
    }
}

module.exports = {
    criarPedido,
    listarMeusPedidos
};