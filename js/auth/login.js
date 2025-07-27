import {
    post,
    getUsuario,
    logout
} from './js/utils/api.js';

document.querySelector('#loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.querySelector('#email').value;
    const senha = document.querySelector('#password').value;

    const data = { email, senha };

    try {
        const resposta = await post('/api/usuarios/login', data);

        if (resposta.token) {
            // Armazena token e dados do usuário
            localStorage.setItem('token', resposta.token);
            localStorage.setItem('usuario', JSON.stringify(resposta.usuario));

            // Redireciona com base no tipo do usuário
            if (resposta.usuario.tipo_usuario === 'admin') {
                window.location.href = '/dashboard';
            } else {
                window.location.href = '/hub';
            }
        } else {
            alert('Falha no login. Verifique suas credenciais.');
        }

    } catch (err) {
        console.error('Erro ao fazer login:', err);
        alert('Erro ao se conectar com o servidor.');
    }
});