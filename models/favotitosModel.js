const db = require('../config/db');

module.exports = {
  listarFavoritosDoUsuario: (id_usuario) => {
    const sql = `
      SELECT f.*, j.nome_jogo, j.descricao_jogo, j.origem_jogo
      FROM tb_favoritos f
      INNER JOIN tb_jogos j ON f.ID_jogo = j.ID_jogo
      WHERE f.ID_usuario = ?
    `;
    return db.promise().execute(sql, [id_usuario]);
  },

  adicionarFavorito: (id_usuario, id_jogo) => {
    const sql = `INSERT INTO tb_favoritos (ID_usuario, ID_jogo) VALUES (?, ?)`;
    return db.promise().execute(sql, [id_usuario, id_jogo]);
  },

  removerFavorito: (id_usuario, id_jogo) => {
    const sql = `DELETE FROM tb_favoritos WHERE ID_usuario = ? AND ID_jogo = ?`;
    return db.promise().execute(sql, [id_usuario, id_jogo]);
  }
};