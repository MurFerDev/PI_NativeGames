import {
  getAutenticado, logout, getUsuario
} from './js/utils/api.js';

const verificacaoDiv = document.querySelector('#verificacao-acesso');
const conteudoDiv = document.querySelector('#conteudo-principal');

document.querySelector('#logoutBtn').addEventListener('click', () => {
  logout();
});

// Verifica permissão de administrador
const usuario = getUsuario();
if (!usuario || usuario.tipo_usuario !== 'admin') {
  alert('Acesso restrito: apenas administradores podem visualizar os logs.');
  logout();
  window.location.href = '../index'; // Redirecionamento para a home
} else {
  // Exibe o conteúdo principal após verificação
  verificacaoDiv.style.display = 'none';
  conteudoDiv.style.display = 'block';
  carregarLogs();
}

async function carregarLogs() {
  try {
    // Ajuste as URLs conforme seu backend
    const acessos = await getAutenticado('/api/logs/acessos');
    const acoes = await getAutenticado('/api/logs/acoes');

    const tbodyAcessos = document.querySelector('#tabelaAcessos');
    tbodyAcessos.innerHTML = '';
    (acessos.logs || acessos).forEach(log => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${log.ID_log_acesso_usuario}</td>
        <td>${log.fk_usuario || '-'}</td>
        <td>${log.email_tentado}</td>
        <td>${log.status_acesso}</td>
        <td>${log.ip_origem}</td>
        <td>${log.browser ? log.browser.slice(0, 50) : ''}</td>
        <td>${new Date(log.data_acesso || log.data_hora).toLocaleString()}</td>
      `;
      tbodyAcessos.appendChild(tr);
    });

    const tbodyAcoes = document.querySelector('#tabelaAcoes');
    tbodyAcoes.innerHTML = '';
    (acoes.logs || acoes).forEach(log => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${log.ID_log_acao_usuario}</td>
        <td>${log.fk_usuario}</td>
        <td>${log.acao}</td>
        <td>${log.rota_afetada}</td>
        <td>${log.metodo_http}</td>
        <td>${new Date(log.data_hora).toLocaleString()}</td>
      `;
      tbodyAcoes.appendChild(tr);
    });
  } catch (err) {
    alert('Acesso negado ou erro ao carregar logs.');
    logout();
    window.location.href = '../index';
  }
}