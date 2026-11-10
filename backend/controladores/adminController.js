const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const caminhoProdutos = path.join(__dirname, '..', 'dados', 'produtos.json');
const caminhoPedidos = path.join(__dirname, '..', 'dados', 'pedidos.json');
const caminhoUsuarios = path.join(__dirname, '..', 'dados', 'usuarios.json');

function lerArquivo(caminho) {
    const dados = fs.readFileSync(caminho, 'utf8');
    return JSON.parse(dados);
}

function salvarArquivo(caminho, dados) {
    fs.writeFileSync(caminho, JSON.stringify(dados, null, 4), 'utf8');
}

// Listar todos os pedidos com dados dos clientes
function listarTodosPedidos(req, res) {
    try {
        const pedidos = lerArquivo(caminhoPedidos);
        const usuarios = lerArquivo(caminhoUsuarios);

        const pedidosComClientes = pedidos.map(pedido => {
            const cliente = usuarios.find(
                usuario => usuario.id === pedido.usuarioId
            );

            return {
                ...pedido,
                cliente: cliente ? {
                    nome: cliente.nome,
                    email: cliente.email,
                    telefone: cliente.telefone
                } : {
                    nome: 'Cliente não encontrado',
                    email: 'Não informado',
                    telefone: 'Não informado'
                }
            };
        });

        res.json(pedidosComClientes);

    } catch (erro) {
        console.error('Erro ao listar pedidos:', erro);
        res.status(500).json({
            mensagem: 'Erro ao consultar os pedidos.'
        });
    }
}

// Alterar status de um pedido
function atualizarStatusPedido(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const statusPermitidos = [
            'Aguardando pagamento',
            'Pagamento aprovado',
            'Em preparação',
            'Enviado',
            'Entregue',
            'Cancelado'
        ];

        if (!statusPermitidos.includes(status)) {
            return res.status(400).json({
                mensagem: 'Status informado inválido.'
            });
        }

        const pedidos = lerArquivo(caminhoPedidos);
        const indice = pedidos.findIndex(pedido => pedido.id === id);

        if (indice === -1) {
            return res.status(404).json({
                mensagem: 'Pedido não encontrado.'
            });
        }

        pedidos[indice].status = status;
        salvarArquivo(caminhoPedidos, pedidos);

        res.json({
            mensagem: 'Status do pedido atualizado com sucesso.',
            pedido: pedidos[indice]
        });

    } catch (erro) {
        console.error('Erro ao atualizar pedido:', erro);
        res.status(500).json({
            mensagem: 'Erro ao atualizar o status do pedido.'
        });
    }
}

// Cadastrar produto
function cadastrarProduto(req, res) {
    try {
        const {
            nome,
            categoria,
            marca,
            modelo,
            compatibilidade,
            preco,
            estoque,
            imagem,
            descricao
        } = req.body;

        if (!nome || !categoria || !marca || !modelo) {
            return res.status(400).json({
                mensagem: 'Preencha nome, categoria, marca e modelo.'
            });
        }

        const valorPreco = Number(preco);
        const quantidadeEstoque = Number(estoque);

        if (!Number.isFinite(valorPreco) || valorPreco <= 0) {
            return res.status(400).json({
                mensagem: 'Informe um preço válido.'
            });
        }

        if (!Number.isInteger(quantidadeEstoque) || quantidadeEstoque < 0) {
            return res.status(400).json({
                mensagem: 'Informe uma quantidade de estoque válida.'
            });
        }

        const produtos = lerArquivo(caminhoProdutos);

        const novoProduto = {
            id: crypto.randomUUID(),
            nome,
            categoria,
            marca,
            modelo,
            compatibilidade: compatibilidade || '',
            preco: valorPreco,
            estoque: quantidadeEstoque,
            imagem: imagem || '',
            descricao: descricao || ''
        };

        produtos.push(novoProduto);
        salvarArquivo(caminhoProdutos, produtos);

        res.status(201).json({
            mensagem: 'Produto cadastrado com sucesso.',
            produto: novoProduto
        });

    } catch (erro) {
        console.error('Erro ao cadastrar produto:', erro);
        res.status(500).json({
            mensagem: 'Erro ao cadastrar produto.'
        });
    }
}

// Editar produto
function atualizarProduto(req, res) {
    try {
        const { id } = req.params;
        const dados = req.body;

        const produtos = lerArquivo(caminhoProdutos);
        const indice = produtos.findIndex(produto => produto.id === id);

        if (indice === -1) {
            return res.status(404).json({
                mensagem: 'Produto não encontrado.'
            });
        }

        const produtoAtualizado = {
            ...produtos[indice],
            ...dados,
            id: produtos[indice].id,
            preco: Number(dados.preco ?? produtos[indice].preco),
            estoque: Number(dados.estoque ?? produtos[indice].estoque)
        };

        if (!produtoAtualizado.nome || !produtoAtualizado.categoria ||
            !produtoAtualizado.marca || !produtoAtualizado.modelo) {
            return res.status(400).json({
                mensagem: 'Preencha os campos obrigatórios do produto.'
            });
        }

        if (!Number.isFinite(produtoAtualizado.preco) || produtoAtualizado.preco <= 0) {
            return res.status(400).json({
                mensagem: 'Informe um preço válido.'
            });
        }

        if (!Number.isInteger(produtoAtualizado.estoque) || produtoAtualizado.estoque < 0) {
            return res.status(400).json({
                mensagem: 'Informe uma quantidade de estoque válida.'
            });
        }

        produtos[indice] = produtoAtualizado;
        salvarArquivo(caminhoProdutos, produtos);

        res.json({
            mensagem: 'Produto atualizado com sucesso.',
            produto: produtoAtualizado
        });

    } catch (erro) {
        console.error('Erro ao atualizar produto:', erro);
        res.status(500).json({
            mensagem: 'Erro ao atualizar produto.'
        });
    }
}

// Excluir produto
function excluirProduto(req, res) {
    try {
        const { id } = req.params;

        const produtos = lerArquivo(caminhoProdutos);
        const indice = produtos.findIndex(produto => produto.id === id);

        if (indice === -1) {
            return res.status(404).json({
                mensagem: 'Produto não encontrado.'
            });
        }

        const produtoExcluido = produtos.splice(indice, 1)[0];
        salvarArquivo(caminhoProdutos, produtos);

        res.json({
            mensagem: 'Produto excluído com sucesso.',
            produto: produtoExcluido
        });

    } catch (erro) {
        console.error('Erro ao excluir produto:', erro);
        res.status(500).json({
            mensagem: 'Erro ao excluir produto.'
        });
    }
}

module.exports = {
    listarTodosPedidos,
    atualizarStatusPedido,
    cadastrarProduto,
    atualizarProduto,
    excluirProduto
};