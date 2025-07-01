
import { getUsuario, logout, getAutenticado, postAutenticado } from '../js/utils/api.js';

// 	Lista todos os usuários
const admin = getUsuario();
if (!admin || admin.tipo_usuario !== 'admin') {
  alert('Acesso restrito. Adminstradores apenas.');
  logout();
  window.location.href = '/';
} else {
  document.getElementById('adminNome').textContent = admin.nome_usuario;
}

document.getElementById('logoutBtn').addEventListener('click', logout);

async function carregarUsuarios() {
  try {
    const res = await getAutenticado('http://localhost:3306/api/admin/usuarios');
    const tbody = document.getElementById('tabelaUsuarios');
    tbody.innerHTML = '';

    res.usuarios.forEach(usuario => {
      const tr = document.createElement('tr');

      tr.innerHTML = `
        <td>${usuario.ID_usuario}</td>
        <td>${usuario.nome_usuario}</td>
        <td>${usuario.email_usuario}</td>
        <td>${usuario.apelido_usuario || '-'}</td>
        <td>
          <select class="form-control form-control-sm" data-id="${usuario.ID_usuario}">
            <option value="comum" ${usuario.tipo_usuario === 'comum' ? 'selected' : ''}>Comum</option>
            <option value="registrado" ${usuario.tipo_usuario === 'registrado' ? 'selected' : ''}Registrado</option>
            <option value="premium" ${usuario.tipo_usuario === 'premium' ? 'selected' : ''}>Premium</option>
            <option value="parceiro" ${usuario.tipo_usuario === 'parceiro' ? 'selected' : ''}>Parceiro</option>
            <option value="gametester" ${usuario.tipo_usuario === 'gametester' ? 'selected' : ''}>Game Tester</option>
            <option value="moderador" ${usuario.tipo_usuario === 'moderador' ? 'selected' : ''}>Moderador</option>
            <option value="admin" ${usuario.tipo_usuario === 'admin' ? 'selected' : ''}>Admin</option>
          </select>
        </td>
        <td>
          <button class="btn btn-sm btn-danger" data-del="${usuario.ID_usuario}">Excluir</button>
          <a class="btn btn-sm btn-primary ml-2" href="/usuario/hub.html?id=${usuario.ID_usuario}" target="_blank">Hub</a>
        </td>
      `;

      tbody.appendChild(tr);
    });

    adicionarListeners();
  } catch (err) {
    console.error(err);
    alert('Erro ao carregar usuários.');
  }
}

function adicionarListeners() {
  // Excluir usuário por ID
  document.querySelectorAll('[data-del]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-del');
      if (confirm('Tem certeza que deseja excluir este usuário?')) {
        try {
          await fetch(`http://localhost:3306/api/admin/usuarios/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          alert('Usuário excluído com sucesso.');
          carregarUsuarios();
        } catch (e) {
          alert('Erro ao excluir.');
        }
      }
    });
  });

  // Permite atualizar o tipo do usuário (admin/comum)
  document.querySelectorAll('select[data-id]').forEach(select => {
    select.addEventListener('change', async () => {
      const id = select.getAttribute('data-id');
      const novoTipo = select.value;
      try {
        await postAutenticado(`http://localhost:3306/api/admin/usuarios/tipo`, { ID_usuario: id, tipo_usuario: novoTipo });
        alert('Tipo de usuário atualizado!');
      } catch (e) {
        alert('Erro ao atualizar tipo.');
      }
    });
  });
}

carregarUsuarios();
