import { route } from '../../routes/indexRoutes.js';
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

router.get('/login', async (req, res) => {
    try {
        const usuario = await getUsuario();
        if (usuario) {
            // Se o usuário já estiver logado, redireciona para o hub
            return res.redirect('/hub');
        }
        res.render('login', { layout: 'main' });
    } catch (err) {
        console.error('Erro ao obter usuário:', err);
        res.status(500).send('Erro interno do servidor.');
    }
});

router.get('/logout', (req, res) => {
    // Limpa o token e os dados do usuário do localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');

    // Redireciona para a página de login
    res.redirect('/auth/login');
});

module.exports = { router, post, getUsuario, logout };
// Exporta o router para ser usado no app.js