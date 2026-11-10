const express = require('express');
const cors = require('cors');
const path = require('path');

const produtoRotas = require('./rotas/produtoRotas');
const usuarioRotas = require('./rotas/usuarioRotas');
const pedidoRotas = require('./rotas/pedidoRotas');
const adminRotas = require('./rotas/adminRotas');

const app = express();
const PORTA = 3000;

// Configurações
app.use(cors());
app.use(express.json());

// Disponibilizar o frontend
const caminhoFrontend = path.join(__dirname, '..', 'frontend');
app.use(express.static(caminhoFrontend));

// Rota inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(caminhoFrontend, 'index.html'));
});

// Status do servidor
app.get('/api/status', (req, res) => {
    res.json({
        status: 'online',
        mensagem: 'Servidor conectado com sucesso!'
    });
});

// Rotas da aplicação
app.use('/api/produtos', produtoRotas);
app.use('/api/usuarios', usuarioRotas);
app.use('/api/pedidos', pedidoRotas);
app.use('/api/admin', adminRotas);

// Inicialização
app.listen(PORTA, () => {
    console.log('====================================');
    console.log('       AUTOPARTS - SERVIDOR');
    console.log('====================================');
    console.log(`Servidor rodando na porta ${PORTA}`);
    console.log(`Loja: http://localhost:${PORTA}`);
    console.log('====================================');
});