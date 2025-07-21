const Jogo = require('../models/jogoModel');

exports.listarTodos = async (req, res) => {
  try {
    const jogos = await Jogo.todos();
    res.json(jogos);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar jogos.' });
  }
};

exports.obterPorId = async (req, res) => {
  try {
    const jogo = await Jogo.porId(req.params.id);
    if (!jogo) return res.status(404).json({ erro: 'Jogo não encontrado.' });
    res.json(jogo);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao obter jogo.' });
  }
};

exports.criar = async (req, res) => {
  try {
    const novo = await Jogo.criar(req.body);
    res.status(201).json(novo);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao criar jogo.' });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const atualizado = await Jogo.atualizar(req.params.id, req.body);
    res.json(atualizado);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar jogo.' });
  }
};

exports.excluir = async (req, res) => {
  try {
    await Jogo.excluir(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao excluir jogo.' });
  }
};