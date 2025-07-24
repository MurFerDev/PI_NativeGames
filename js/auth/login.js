
import {
  post,
  getUsuario,
  logout
} from './js/utils/api.js';

document.querySelector('#loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.querySelector('#email').value;
    const senha = document.querySelector('#password').value;

    try {
        const response = await post('/api/usuarios/login', data);

        const data = await response.json();

        if (resposta.token) {

            // Armazena o token no localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('usuario', JSON.stringify(data.usuario));

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

    registrarAcao(id_usuario, 'Login realizado com sucesso', '/api/usuario/login', 'POST');
});