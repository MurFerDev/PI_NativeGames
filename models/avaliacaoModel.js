const db = require('../database/db');

class AvaliacaoModel {
  static async findByJogo(fk_jogo) {
    const [rows] = await db.promise().execute(
      'SELECT * FROM tb_avaliacoes WHERE fk_jogo = ?', [fk_jogo]
    );
    return rows;
  }

  static async create(avaliacao) {
    const { fk_jogo, fk_usuario, nota } = avaliacao;
    const [result] = await db.promise().execute(
      'INSERT INTO tb_avaliacoes (fk_jogo, fk_usuario, nota) VALUES (?, ?, ?)',
      [fk_jogo, fk_usuario, nota]
    );
    return result.insertId;
  }
}

module.exports = AvaliacaoModel;