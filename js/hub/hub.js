import {
  getUsuario,
  getAutenticado,
  putAutenticado,
  logout
} from '../utils/api.js';

document.querySelector('#nickname').textContent = usuario.apelido_usuario || usuario.nome_usuario || 'Usuário';

const usuario = getUsuario();

if (!usuario) {
  alert('Você precisa estar logado para acessar esta página.');
  logout();
}

const urlParams = new URLSearchParams(window.location.search);
const idParam = urlParams.get('id');
const url = idParam && usuario.tipo_usuario === 'admin' ? `/api/hub/dados?id=${idParam}` : `/api/hub/dados`;

// Buscar dados do hub
async function carregarHub() {
  try {
    const data = await getAutenticado('/api/hub/dados');

    const container = document.querySelector('#jogosFavoritos');
    container.innerHTML = '';

    data.jogos.forEach(jogo => {
      const card = document.createElement('div');
      card.className = 'col-md-4 game-card';
      card.innerHTML = `
          <h5>${jogo.jogo}</h5>
          <img src="${jogo.imagem}" alt="${jogo.jogo}" class="img-fluid mb-2 rounded">
          <p class="stats">Vitórias: ${jogo.vitorias || 0}</p>
          <p class="stats">Derrotas: ${jogo.derrotas || 0}</p>
          <p class="stats">Total de Partidas: ${jogo.partidas || 0}</p>
        `;
      container.appendChild(card);
    });
  } catch (error) {
    console.error('Erro ao carregar hub:', error);
    alert('Erro ao carregar informações do usuário.');
  }
}

carregarHub();

// Atualizar perfil
document.querySelector('#editForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const novoNome = document.querySelector('#nomeInput').value;
  const novaSenha = document.querySelector('#senhaInput').value;

  if (!novoNome && !novaSenha) {
    alert('Preencha ao menos um campo.');
    return;
  }

  try {
    const response = await putAutenticado('/api/usuarios/editar', {
      nome: novoNome,
      senha: novaSenha
    });

    alert('Perfil atualizado com sucesso!');

    if (novoNome) {
      localStorage.setItem('usuario', JSON.stringify({ ...usuario, nome_usuario: novoNome }));
    }

    location.reload();
  } catch (err) {
    console.error(err);
    alert('Erro ao atualizar perfil.');
  }
});

// Logout
document.querySelector('.logout-btn').addEventListener('click', logout);
