const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const readline = require('readline');

const caminhoUsuarios = path.join(__dirname, 'dados', 'usuarios.json');

const terminal = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function perguntar(texto) {
    return new Promise(resolve => {
        terminal.question(texto, resposta => resolve(resposta.trim()));
    });
}

async function criarAdministrador() {
    try {
        const dados = fs.readFileSync(caminhoUsuarios, 'utf8');
        const usuarios = JSON.parse(dados);

        const nome = await perguntar('Nome do administrador: ');
        const email = (await perguntar('E-mail do administrador: ')).toLowerCase();
        const senha = await perguntar('Senha do administrador: ');

        if (!nome || !email || senha.length < 6) {
            console.log('Preencha todos os campos. A senha deve ter pelo menos 6 caracteres.');
            return;
        }

        const usuarioExistente = usuarios.find(usuario =>
            usuario.email.toLowerCase() === email
        );

        if (usuarioExistente) {
            console.log('Já existe um usuário cadastrado com esse e-mail.');
            return;
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const novoAdministrador = {
            id: crypto.randomUUID(),
            nome,
            cpf: '',
            telefone: '',
            email,
            senha: senhaCriptografada,
            tipo: 'admin',
            criadoEm: new Date().toISOString()
        };

        usuarios.push(novoAdministrador);

        fs.writeFileSync(
            caminhoUsuarios,
            JSON.stringify(usuarios, null, 4),
            'utf8'
        );

        console.log('\nAdministrador criado com sucesso!');
        console.log('Agora você pode entrar pela página de login.');

    } catch (erro) {
        console.error('Erro ao criar administrador:', erro);
    } finally {
        terminal.close();
    }
}

criarAdministrador();