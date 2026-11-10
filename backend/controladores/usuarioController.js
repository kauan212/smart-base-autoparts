const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const caminhoUsuarios = path.join(__dirname, '..', 'dados', 'usuarios.json');

const CHAVE_JWT = process.env.JWT_SECRET || 'chave-temporaria-autoparts-2026';

function lerUsuarios() {
    const dados = fs.readFileSync(caminhoUsuarios, 'utf8');
    return JSON.parse(dados);
}

function salvarUsuarios(usuarios) {
    fs.writeFileSync(
        caminhoUsuarios,
        JSON.stringify(usuarios, null, 4),
        'utf8'
    );
}

// CADASTRO DE CLIENTE
async function cadastrarUsuario(req, res) {
    try {
        const { nome, cpf, telefone, email, senha } = req.body;

        if (!nome || !cpf || !telefone || !email || !senha) {
            return res.status(400).json({
                mensagem: 'Preencha todos os campos.'
            });
        }

        if (senha.length < 6) {
            return res.status(400).json({
                mensagem: 'A senha deve ter pelo menos 6 caracteres.'
            });
        }

        const cpfLimpo = cpf.replace(/\D/g, '');
        const emailLimpo = email.trim().toLowerCase();

        if (cpfLimpo.length !== 11) {
            return res.status(400).json({
                mensagem: 'Informe um CPF com 11 números.'
            });
        }

        const usuarios = lerUsuarios();

        const usuarioExistente = usuarios.find(usuario =>
            usuario.cpf === cpfLimpo ||
            usuario.email === emailLimpo
        );

        if (usuarioExistente) {
            return res.status(409).json({
                mensagem: 'Este CPF ou e-mail já está cadastrado.'
            });
        }

        const senhaHash = await bcrypt.hash(senha, 10);

        const novoUsuario = {
            id: crypto.randomUUID(),
            nome: nome.trim(),
            cpf: cpfLimpo,
            telefone: telefone.trim(),
            email: emailLimpo,
            senha: senhaHash,
            tipo: 'cliente',
            criadoEm: new Date().toISOString()
        };

        usuarios.push(novoUsuario);
        salvarUsuarios(usuarios);

        res.status(201).json({
            mensagem: 'Cadastro realizado com sucesso!'
        });

    } catch (erro) {
        console.error('Erro no cadastro:', erro);

        res.status(500).json({
            mensagem: 'Erro ao realizar cadastro.'
        });
    }
}

// LOGIN DE CLIENTE
async function realizarLogin(req, res) {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({
                mensagem: 'Informe o e-mail e a senha.'
            });
        }

        const usuarios = lerUsuarios();

        const emailLimpo = email.trim().toLowerCase();

        const usuario = usuarios.find(
            usuario => usuario.email === emailLimpo
        );

        if (!usuario) {
            return res.status(401).json({
                mensagem: 'E-mail ou senha incorretos.'
            });
        }

        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

        if (!senhaCorreta) {
            return res.status(401).json({
                mensagem: 'E-mail ou senha incorretos.'
            });
        }

        const token = jwt.sign(
            {
                id: usuario.id,
                tipo: usuario.tipo
            },
            CHAVE_JWT,
            { expiresIn: '8h' }
        );

        res.json({
            mensagem: 'Login realizado com sucesso!',
            token,
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                tipo: usuario.tipo
            }
        });

    } catch (erro) {
        console.error('Erro no login:', erro);

        res.status(500).json({
            mensagem: 'Erro ao realizar login.'
        });
    }
}

module.exports = {
    cadastrarUsuario,
    realizarLogin
};