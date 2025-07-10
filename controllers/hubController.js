const db = require('../database/db.js');

exports.getDadosHub = (req, res) => {
  res.status(200).json({ jogos: [], conquistas: [], estatisticas: {} });
};