const express = require('express');
const router = express.Router();

const produtoController = require('../controladores/produtoController');

router.get('/', produtoController.listarProdutos);

module.exports = router;