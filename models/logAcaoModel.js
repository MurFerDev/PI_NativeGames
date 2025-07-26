const db = require('../database/db');

class LogAcaoModel {
  // Registrar log de ação do usuário
  static async registrar({ fk_usuario, fk_jogo = null, acao, rota_afetada, metodo_http }) {
    const sql = `
      INSERT INTO tb_log_acao_usuarios 
        (fk_usuario, fk_jogo, acao, rota_afetada, metodo_http) 
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await db.promise().execute(sql, [
      fk_usuario,
      fk_jogo,
      acao,
      rota_afetada,
      metodo_http
    ]);
    return result.insertId;
  }

  // Listar todos os logs com dados do usuário
  static async listarTodos() {
    const sql = `
      SELECT l.*, u.apelido_usuario, u.tipo_usuario 
      FROM tb_log_acao_usuarios l
      LEFT JOIN tb_usuarios u ON u.ID_usuario = l.fk_usuario
      ORDER BY l.data_acao DESC
    `;
    const [rows] = await db.promise().execute(sql);
    return rows;
  }

  // Listar logs por usuário
  static async listarPorUsuario(fk_usuario) {
    const sql = `
      SELECT l.*, u.apelido_usuario, u.tipo_usuario 
      FROM tb_log_acao_usuarios l
      LEFT JOIN tb_usuarios u ON u.ID_usuario = l.fk_usuario
      WHERE l.fk_usuario = ?
      ORDER BY l.data_acao DESC
    `;
    const [rows] = await db.promise().execute(sql, [fk_usuario]);
    return rows;
  }
}

module.exports = LogAcaoModel;