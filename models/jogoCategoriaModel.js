const db = require('../database/db');

class JogoCategoriaModel {
  static async findByJogo(ID_jogo) {
    const [rows] = await db.promise().execute(
      'SELECT * FROM tb_jogos_categorias WHERE fk_jogo = ?', [ID_jogo]
    );
    return rows;
  }

  static async create(jogoCategoria) {
    const { fk_jogo, fk_categoria } = jogoCategoria;
    const [result] = await db.promise().execute(
      'INSERT INTO tb_jogos_categorias (fk_jogo, fk_categoria) VALUES (?, ?)',
      [fk_jogo, fk_categoria]
    );
    return result.insertId;
  }
}

module.exports = JogoCategoriaModel;