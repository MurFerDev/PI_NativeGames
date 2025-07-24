const express = require('express');
const router = express.Router();
const jogoController = require('../controllers/jogoController');
const autenticarToken = require('./server/middlewares/autenticarToken');
const verificarTipoUsuario = require('./server/middlewares/verificarTipoUsuario');

// Públicos
router.get('/', jogoController.listarTodos);
router.get('/:ID', jogoController.obterPorId);

// Admin
router.post('/', autenticarToken, verificarTipoUsuario(['admin']), jogoController.criar);
router.put('/:ID', autenticarToken, verificarTipoUsuario(['admin']), jogoController.atualizar);
router.delete('/:ID', autenticarToken, verificarTipoUsuario(['admin']), jogoController.excluir);

module.exports = router;