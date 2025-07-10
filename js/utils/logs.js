import {
  getAutenticado, logout
} from '../utils/api.js';

const verificacaoDiv = document.querySelector('#verificacao-acesso');
const conteudoDiv = document.querySelector('#conteudo-principal');

document.querySelector('#logoutBtn').addEventListener('click', () => {
    logout();
});
/*
// Verifica permissão de administrador
const usuario = getUsuario();
if (!usuario || usuario.tipo_usuario !== 'admin') {
    alert('Acesso restrito: apenas administradores podem visualizar os logs.');
    logout();
    window.location.href = '../index.html'; // Redirecionamento para a home
} else {
    // Exibe o conteúdo principal após verificação
    verificacaoDiv.style.display = 'none';
    conteudoDiv.style.display = 'block';
    carregarLogs();
}
*/
const db = require('/server/database/db.js');

function registrarAcao(usuarioId, acao, rota, metodo) {
  const sql = `
    INSERT INTO tb_log_acoes_usuarios (fk_usuario, acao, rota_afetada, metodo_http)
    VALUES (?, ?, ?, ?)
  `;
  db.query(sql, [usuarioId, acao, rota, metodo], (err) => {
    if (err) console.error('Erro ao registrar ação de usuário:', err);
  });
}

module.exports = registrarAcao;

async function carregarLogs() {
  try {
    const acessos = await getAutenticado('http://localhost:3306/api/logs/acessos');
    const acoes = await getAutenticado('http://localhost:3306/api/logs/acoes');

    const tbodyAcessos = document.querySelector('#tabelaAcessos');
    tbodyAcessos.innerHTML = '';
    acessos.logs.forEach(log => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${log.ID_log_acesso_de_usuario}</td>
        <td>${log.fk_usuario || '-'}</td>
        <td>${log.email_tentado}</td>
        <td>${log.status_acesso}</td>
        <td>${log.ip_origem}</td>
        <td>${log.browser.slice(0, 50)}</td>
        <td>${new Date(log.data_hora).toLocaleString()}</td>
      `;
      tbodyAcessos.appendChild(tr);
    });

    const tbodyAcoes = document.querySelector('#tabelaAcoes');
    tbodyAcoes.innerHTML = '';
    acoes.logs.forEach(log => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${log.ID_log_acao_de_usuario}</td>
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
  }
}

carregarLogs();