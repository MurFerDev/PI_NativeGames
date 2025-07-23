const db = require('../config/db');

module.exports = {
  estatisticasPorUsuario: (id_usuario) => {
    const sql = `
      SELECT j.nome_jogo AS jogo, j.imagem, e.vitorias, e.derrotas, e.partidas_jogadas
      FROM tb_estatisticas_usuarios e
      INNER JOIN tb_jogos j ON e.ID_jogo = j.ID_jogo
      WHERE e.ID_usuario = ?
    `;
    return db.promise().execute(sql, [id_usuario]);
  }
};