const db = require('../database/db.js');

exports.adicionar = (req, res) => {
  res.status(200).json({ message: 'Jogo adicionado aos favoritos' });
};

exports.remover = (req, res) => {
  res.status(200).json({ message: 'Jogo removido dos favoritos' });
};

exports.listar = (req, res) => {
  res.status(200).json([{ id: 1, nome: 'Adugo' }, { id: 2, nome: 'Senet' }]);
};