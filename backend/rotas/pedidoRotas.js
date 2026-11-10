const express = require('express');
const router = express.Router();

const pedidoController = require('../controladores/pedidoController');
const autenticacao = require('../middlewares/autenticacao');

// Criar um pedido (somente usuário autenticado)
router.post('/', autenticacao.verificarAutenticacao, pedidoController.criarPedido);

// Listar pedidos do cliente autenticado
router.get('/meus-pedidos', autenticacao.verificarAutenticacao, pedidoController.listarMeusPedidos);

module.exports = router;