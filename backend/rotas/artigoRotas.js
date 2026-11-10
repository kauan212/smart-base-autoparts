const express = require('express');

const router = express.Router();

const {
    listarArtigos,
    buscarArtigo,
    criarArtigo
} = require('../controladores/artigoController');

// Listar e pesquisar artigos
router.get('/', listarArtigos);

// Buscar artigo específico
router.get('/:id', buscarArtigo);

// Cadastrar artigo
router.post('/', criarArtigo);

module.exports = router;