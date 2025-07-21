const db = require('../database/db');

module.exports = {
  cadastrar: (userData) => {
    const sql = `
      INSERT INTO tb_usuarios (nome_usuario, email_usuario, senha_usuario, apelido_usuario, tipo_usuario, status_usuario)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    return db.promise().execute(sql, [
      userData.nome,
      userData.email,
      userData.senha,
      userData.apelido_usuario,
      userData.tipo_usuario,
      userData.status || 'ativo'
    ]);
  },

  buscarPorEmail: (email) => {
    const sql = `SELECT * FROM tb_usuarios WHERE email_usuario = ?`;
    return db.promise().execute(sql, [email]);
  },

  buscarPorId: (id) => {
    const sql = `SELECT ID_usuario, nome_usuario, email_usuario, apelido_usuario, tipo_usuario, status_usuario FROM tb_usuarios WHERE ID_usuario = ?`;
    return db.promise().execute(sql, [id]);
  },

  atualizar: (id, campos) => {
    const sets = Object.keys(campos).map(c => `${c} = ?`).join(', ');
    const valores = [...Object.values(campos), id];
    const sql = `UPDATE tb_usuarios SET ${sets} WHERE ID_usuario = ?`;
    return db.promise().execute(sql, valores);
  },

  remover: (id) => {
    const sql = `DELETE FROM tb_usuarios WHERE ID_usuario = ?`;
    return db.promise().execute(sql, [id]);
  }
};