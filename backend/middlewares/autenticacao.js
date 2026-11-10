const jwt = require('jsonwebtoken');

const CHAVE_JWT = process.env.JWT_SECRET || 'chave-temporaria-autoparts-2026';

function verificarAutenticacao(req, res, next) {
    const cabecalho = req.headers.authorization;

    if (!cabecalho) {
        return res.status(401).json({
            mensagem: 'Acesso não autorizado. Faça login.'
        });
    }

    const partes = cabecalho.split(' ');

    if (partes.length !== 2 || partes[0] !== 'Bearer') {
        return res.status(401).json({
            mensagem: 'Formato de autenticação inválido.'
        });
    }

    const token = partes[1];

    try {
        const dadosUsuario = jwt.verify(token, CHAVE_JWT);
        req.usuario = dadosUsuario;
        next();
    } catch (erro) {
        return res.status(401).json({
            mensagem: 'Token inválido ou expirado. Faça login novamente.'
        });
    }
}

function verificarAdministrador(req, res, next) {
    if (!req.usuario || req.usuario.tipo !== 'admin') {
        return res.status(403).json({
            mensagem: 'Acesso permitido somente para administradores.'
        });
    }

    next();
}

module.exports = {
    verificarAutenticacao,
    verificarAdministrador
};