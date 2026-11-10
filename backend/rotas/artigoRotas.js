const express = require('express');

const router = express.Router();

const {
    listarArtigos,
    buscarArtigo,
    criarArtigo
} = require('../controladores/artigoController');

const {
    listarOpcoesArtigo
} = require('../controladores/artigoOpcoesController');

router.get('/opcoes', listarOpcoesArtigo);
router.get('/', listarArtigos);
router.get('/:id', buscarArtigo);
router.post('/', criarArtigo);

module.exports = router;
