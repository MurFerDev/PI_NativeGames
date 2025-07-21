const express = require('express');
const router = express.Router();
const logController = require('../controllers/logController');
const autenticarToken = require('../middlewares/autenticarToken');
const verificarTipoUsuario = require('../middlewares/verificarTipoUsuario');

// Logs de admin
router.get('/', autenticarToken, verificarTipoUsuario(['admin']), logController.listarTodos);

// Logs do próprio usuário
router.get('/meus', autenticarToken, logController.listarDoUsuario);

module.exports = router;