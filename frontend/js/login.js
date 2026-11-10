const API_LOGIN = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('formLogin');
    const mensagem = document.getElementById('mensagemLogin');

    formulario.addEventListener('submit', async (evento) => {
        evento.preventDefault();

        const email = document.getElementById('email').value.trim();
        const senha = document.getElementById('senha').value;

        mensagem.textContent = '';

        try {
            const resposta = await fetch(`${API_LOGIN}/api/usuarios/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    senha
                })
            });

            const dados = await resposta.json();

            if (!resposta.ok) {
                mensagem.textContent = dados.mensagem || 'Não foi possível entrar.';
                return;
            }

            // Salvar autenticação no navegador
            localStorage.setItem('token', dados.token);
            localStorage.setItem('usuario', JSON.stringify(dados.usuario));

            mensagem.textContent = `Bem-vindo, ${dados.usuario.nome}!`;
            mensagem.style.color = 'green';

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);

        } catch (erro) {
            console.error('Erro no login:', erro);
            mensagem.textContent = 'Não foi possível conectar ao servidor.';
        }
    });
});