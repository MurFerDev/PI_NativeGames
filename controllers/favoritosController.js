const db = require('../config/db');

const Favoritos = require('../models/favoritosModel');

exports.listar = async (req, res) => {
  try {
    const lista = await Favoritos.listar(req.usuario.id);
    res.json(lista);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar favoritos.' });
  }
};

exports.adicionar = async (req, res) => {
  try {
    await Favoritos.adicionar(req.usuario.id, req.body.id_jogo);
    res.status(201).json({ msg: 'Adicionado aos favoritos.' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao adicionar favorito.' });
  }
};

exports.remover = async (req, res) => {
  try {
    await Favoritos.remover(req.usuario.id, req.params.id_jogo);
    res.json({ msg: 'Removido dos favoritos.' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao remover favorito.' });
  }
};