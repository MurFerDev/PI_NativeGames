const db = require('../database/db');

class ComentarioModel {
  static async findByJogo(fk_jogo) {
    const [rows] = await db.promise().execute(
      'SELECT * FROM tb_comentarios WHERE fk_jogo = ?', [fk_jogo]
    );
    return rows;
  }

  static async create(comentario) {
    const { fk_jogo, fk_usuario, texto_comentario } = comentario;
    const [result] = await db.promise().execute(
      'INSERT INTO tb_comentarios (fk_jogo, fk_usuario, texto_comentario) VALUES (?, ?, ?)',
      [fk_jogo, fk_usuario, texto_comentario]
    );
    return result.insertId;
  }
}

module.exports = ComentarioModel;