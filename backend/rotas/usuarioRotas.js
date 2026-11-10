const express = require('express');
const router = express.Router();

const usuarioController = require('../controladores/usuarioController');

// Cadastro de cliente
router.post('/cadastro', usuarioController.cadastrarUsuario);

// Login de cliente
router.post('/login', usuarioController.realizarLogin);

module.exports = router;