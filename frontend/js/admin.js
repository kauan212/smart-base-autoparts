document.addEventListener('DOMContentLoaded', () => {
    verificarAcessoAdmin();

    const botaoSair = document.getElementById('botaoSairAdmin');

    botaoSair.addEventListener('click', (evento) => {
        evento.preventDefault();

        localStorage.removeItem('token');
        localStorage.removeItem('usuario');

        window.location.href = 'login.html';
    });
});

function verificarAcessoAdmin() {
    const token = localStorage.getItem('token');
    const usuarioSalvo = localStorage.getItem('usuario');

    if (!token || !usuarioSalvo) {
        alert('Faça login para acessar o painel administrativo.');
        window.location.href = 'login.html';
        return;
    }

    try {
        const usuario = JSON.parse(usuarioSalvo);

        if (usuario.tipo !== 'admin') {
            alert('Acesso permitido somente para administradores.');
            window.location.href = 'index.html';
        }
    } catch (erro) {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');

        alert('Não foi possível validar seu acesso. Faça login novamente.');
        window.location.href = 'login.html';
    }
}