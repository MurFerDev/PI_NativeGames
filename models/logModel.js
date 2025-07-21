const db = require('../database/db');

module.exports = {
  registrar: (id_usuario, acao, rota, metodo) => {
    const sql = `
      INSERT INTO tb_log_acao_usuarios (ID_usuario, acao, rota_afetada, metodo_http, data_acesso)
      VALUES (?, ?, ?, ?, NOW())
    `;
    return db.promise().execute(sql, [id_usuario, acao, rota, metodo]);
  },

  listarTodos: () => {
    const sql = `
      SELECT l.*, u.apelido_usuario, u.tipo_usuario 
      FROM tb_log_acao_usuarios l
      LEFT JOIN tb_usuarios u ON u.ID_usuario = l.ID_usuario
      ORDER BY l.data_hora DESC
    `;
    return db.promise().execute(sql);
  },

  listarPorUsuario: (id_usuario) => {
    const sql = `SELECT * FROM tb_log_acao_usuarios WHERE ID_usuario = ? ORDER BY data_hora DESC`;
    return db.promise().execute(sql, [id_usuario]);
  }
};