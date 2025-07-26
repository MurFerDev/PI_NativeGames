const db = require('../database/db');

exports.getDadosHub = (req, res) => {
  res.status(200).json({ jogos: [], conquistas: [], estatisticas: {} });
};

const Hub = require('../models/hubModel');

exports.estatisticasUsuario = async (req, res) => {
  try {
    const id = req.usuario.tipo_usuario === 'admin' && req.query.ID_usuario ? req.query.ID_usuario : req.usuario.ID_usuario;
    const dados = await Hub.estatisticas(id);
    res.json(dados);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar estatísticas do hub.' });
  }
};
