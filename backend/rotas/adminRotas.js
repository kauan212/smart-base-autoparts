const express = require('express');
const router = express.Router();

const adminController = require('../controladores/adminController');
const autenticacao = require('../middlewares/autenticacao');

// Todas as rotas exigem autenticação e perfil de administrador
router.use(autenticacao.verificarAutenticacao);
router.use(autenticacao.verificarAdministrador);

// Gerenciamento de produtos
router.post('/produtos', adminController.cadastrarProduto);
router.put('/produtos/:id', adminController.atualizarProduto);
router.delete('/produtos/:id', adminController.excluirProduto);

// Gerenciamento de pedidos
router.get('/pedidos', adminController.listarTodosPedidos);
router.put('/pedidos/:id/status', adminController.atualizarStatusPedido);

module.exports = router;