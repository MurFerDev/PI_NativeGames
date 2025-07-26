const db = require('../database/db');

class EstatisticaModel {
  static async findByUsuario(fk_usuario) {
    const [rows] = await db.promise().execute(
      'SELECT * FROM tb_estatisticas_usuarios WHERE fk_usuario = ?', [fk_usuario]
    );
    return rows;
  }

  static async create(estatistica) {
    const { fk_usuario, fk_jogo, partidas_jogadas, vitorias, derrotas } = estatistica;
    const [result] = await db.promise().execute(
      'INSERT INTO tb_estatisticas_usuarios (fk_usuario, fk_jogo, partidas_jogadas, vitorias, derrotas) VALUES (?, ?, ?, ?)',
      [fk_usuario, fk_jogo, partidas_jogadas, vitorias, derrotas]
    );
    return result.insertId;
  }
}

module.exports = EstatisticaModel;