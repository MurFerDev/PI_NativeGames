const express = require('express');
const router = express.Router();
const jogoController = require('../controllers/jogoController');
const autenticarToken = require('../server/middlewares/autenticarToken');
const verificarTipoUsuario = require('../server/middlewares/verificarTipoUsuario');

// Públicos
router.get('/', jogoController.listarTodos);
router.get('/:ID', jogoController.obterPorId);

// Admin
router.post('/', autenticarToken, verificarTipoUsuario(['admin']), jogoController.criar);
router.put('/:ID', autenticarToken, verificarTipoUsuario(['admin']), jogoController.atualizar);
router.delete('/:ID', autenticarToken, verificarTipoUsuario(['admin']), jogoController.excluir);

// Página para exibir todos os jogos (Opção 1)
router.get('/jogos', async (req, res) => {
  try {
    const [jogos] = await db.promise().query('SELECT * FROM tb_jogos');
    res.render('jogos', { layout: 'main', jogos });
  } catch (error) {
    console.error('Erro ao carregar jogos:', error);
    res.render('jogos', { layout: 'main', jogos: [], error: 'Erro ao carregar jogos.' });
  }
});

// Jogos
router.get('/adugo', (req, res) => {
  res.render('adugo', { layout: 'main' });
});
router.get('/doushouqi', (req, res) => {
  res.render('doushouqi', { layout: 'main' });
});
router.get('/senet', (req, res) => {
  res.render('senet', { layout: 'main' });
});
router.get('/mancala', (req, res) => {
  res.render('mancala', { layout: 'main' });
});
router.get('/agha-chal', (req, res) => {
  res.render('bagha-chal', { layout: 'main' });
});
router.get('/chaturanga', (req, res) => {
  res.render('chaturanga', { layout: 'main' });
});
router.get('/tafl', (req, res) => {
  res.render('tafl', { layout: 'main' });
});

module.exports = router;