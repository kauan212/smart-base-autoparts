const API_CADASTRO = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('formCadastro');
    const mensagem = document.getElementById('mensagemCadastro');

    formulario.addEventListener('submit', async (evento) => {
        evento.preventDefault();

        const nome = document.getElementById('nome').value.trim();
        const cpf = document.getElementById('cpf').value.trim();
        const telefone = document.getElementById('telefone').value.trim();
        const email = document.getElementById('email').value.trim();
        const senha = document.getElementById('senha').value;
        const confirmarSenha = document.getElementById('confirmarSenha').value;

        mensagem.textContent = '';

        if (senha !== confirmarSenha) {
            mensagem.textContent = 'As senhas não coincidem.';
            return;
        }

        try {
            const resposta = await fetch(`${API_CADASTRO}/api/usuarios/cadastro`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nome,
                    cpf,
                    telefone,
                    email,
                    senha
                })
            });

            const dados = await resposta.json();

            if (!resposta.ok) {
                mensagem.textContent = dados.mensagem || 'Não foi possível realizar o cadastro.';
                return;
            }

            mensagem.textContent = dados.mensagem;
            mensagem.style.color = 'green';

            formulario.reset();

            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);

        } catch (erro) {
            console.error('Erro ao cadastrar:', erro);
            mensagem.textContent = 'Não foi possível conectar ao servidor.';
        }
    });
});