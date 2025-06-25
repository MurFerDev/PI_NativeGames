import { postAutenticado } from '../utils/api.js';


document.querySelector('#registerForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const nome = document.querySelector('#nome').value;
  const email = document.querySelector('#email').value;
  const senha = document.querySelector('#password').value;

  if (!nome || !email || !senha) {
    alert('Preencha todos os campos.');
    return;
  }

  try {
    const response = await fetch('http://localhost:3306/api/registrar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, senha })
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