import router from '../../routes/indexRoutes.js';
import {
  post
} from './js/utils/api.js';

router.get('/register', (req, res) => {
  res.render('register', { layout: 'main' });
});

document.querySelector('#registerForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const nome = document.querySelector('#nome').value;
  const email = document.querySelector('#email').value;
  const senha = document.querySelector('#password').value;
  const apelido_usuario = document.querySelector('#apelido').value;

  if (!nome || !email || !senha) {
    alert('Preencha todos os campos.');
    return;
  }

  try {
    const response = await post('/api/usuarios/register', {
      nome,
      email,
      senha,
      apelido_usuario
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error || 'Erro no cadastro.');
      return;
    }

    alert('Cadastro realizado com sucesso! Faça login para continuar.');
    window.location.href = '/login';
  } catch (err) {
    console.error('Erro ao registrar usuário:', err);
    alert('Erro ao se conectar com o servidor.');
  }

  registrarAcao(result.insertId, 'Usuário cadastrado', '/api/usuario/registrar', 'POST');
});