const LogAcessoModel = require('../models/LogAcessoModel');

// Listar todos os logs de acesso
exports.listarTodos = async (req, res) => {
  try {
    const logs = await LogAcessoModel.findAll();
    res.json(logs);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar logs.' });
  }
};

// Listar logs do usuário autenticado
exports.listarDoUsuario = async (req, res) => {
  try {
    if (!req.usuario || !req.usuario.ID_usuario) {
      return res.status(401).json({ erro: 'Usuário não autenticado.' });
    }
    const logs = await LogAcessoModel.findByUsuario(req.usuario.ID_usuario);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar logs pessoais.' });
  }
};