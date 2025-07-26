const Log = require('../models/LogAcaoModel');

exports.listarTodos = async (req, res) => {
  try {
    const logs = await Log.todos();
    res.json(logs);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar logs.' });
  }
};

exports.listarDoUsuario = async (req, res) => {
  try {
    const logs = await Log.porUsuario(req.usuario.ID_usuario);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar logs pessoais.' });
  }
};