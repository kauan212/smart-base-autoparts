const fs = require('fs');
const path = require('path');

const caminhoProdutos = path.join(__dirname, '..', 'dados', 'produtos.json');

function listarProdutos(req, res) {
    try {
        const dados = fs.readFileSync(caminhoProdutos, 'utf8');
        const produtos = JSON.parse(dados);

        res.json(produtos);
    } catch (erro) {
        console.error('Erro ao listar produtos:', erro);

        res.status(500).json({
            mensagem: 'Erro ao consultar os produtos.'
        });
    }
}

module.exports = {
    listarProdutos
};