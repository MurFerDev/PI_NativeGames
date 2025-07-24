const db = require('../database/db');
const Log = require('../models/logModel');

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
    const logs = await Log.porUsuario(req.usuario.id);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar logs pessoais.' });
  }
};