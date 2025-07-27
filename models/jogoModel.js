const db = require('../database/db');

module.exports = {
  listarTodos: () => {
    const sql = `SELECT ID_jogo, nome_jogo, descricao_jogo, regiao_jogo, epoca_jogo FROM tb_jogos`;
    return db.promise().execute(sql);
  },

  obterPorId: (id) => {
    const sql = `SELECT * FROM tb_jogos WHERE ID_jogo = ?`;
    return db.promise().execute(sql, [id]);
  },

  criar: (data) => {
    const sql = `
      INSERT INTO tb_jogos (nome_jogo, descricao_jogo, regiao_jogo, epoca_jogo)
      VALUES (?, ?, ?, ?)
    `;
    return db.promise().execute(sql, [
      data.nome_jogo,
      data.descricao,
      data.regiao_jogo,
      data.epoca_jogo
    ]);
  },

  atualizar: (id, campos) => {
    const sets = Object.keys(campos).map(c => `${c} = ?`).join(', ');
    const valores = [...Object.values(campos), id];
    const sql = `UPDATE tb_jogos SET ${sets} WHERE ID_jogo = ?`;
    return db.promise().execute(sql, valores);
  },

  excluir: (id) => {
    const sql = `DELETE FROM tb_jogos WHERE ID_jogo = ?`;
    return db.promise().execute(sql, [id]);
  }
};