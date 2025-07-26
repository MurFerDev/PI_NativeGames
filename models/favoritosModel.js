const db = require('../database/db');

class FavoritoModel {
  // Listar favoritos de um usuário, trazendo dados do jogo
  static async listarFavoritosDoUsuario(id_usuario) {
    const sql = `
      SELECT f.*, j.nome_jogo, j.descricao_jogo, j.origem_jogo
      FROM tb_favoritos f
      INNER JOIN tb_jogos j ON f.ID_jogo = j.ID_jogo
      WHERE f.ID_usuario = ?
    `;
    const [rows] = await db.promise().execute(sql, [id_usuario]);
    return rows;
  }

  // Adicionar favorito
  static async adicionarFavorito(id_usuario, id_jogo) {
    const sql = `INSERT INTO tb_favoritos (ID_usuario, ID_jogo) VALUES (?, ?)`;
    const [result] = await db.promise().execute(sql, [id_usuario, id_jogo]);
    return result.insertId;
  }

  // Remover favorito
  static async removerFavorito(id_usuario, id_jogo) {
    const sql = `DELETE FROM tb_favoritos WHERE ID_usuario = ? AND ID_jogo = ?`;
    const [result] = await db.promise().execute(sql, [id_usuario, id_jogo]);
    return result.affectedRows;
  }

  // Buscar favoritos por usuário (apenas IDs)
  static async findByUsuario(id_usuario) {
    const [rows] = await db.promise().execute(
      'SELECT * FROM tb_favoritos WHERE ID_usuario = ?', [id_usuario]
    );
    return rows;
  }

  // Criar favorito (usando objeto)
  static async create(favorito) {
    const { ID_usuario, ID_jogo } = favorito;
    const [result] = await db.promise().execute(
      'INSERT INTO tb_favoritos (ID_usuario, ID_jogo) VALUES (?, ?)',
      [ID_usuario, ID_jogo]
    );
    return result.insertId;
  }
}

module.exports = FavoritoModel;