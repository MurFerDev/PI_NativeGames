const express = require('express');
const router = express.Router();
const logController = require('../controllers/logController');
const autenticarToken = require('../server/middlewares/autenticarToken');
const verificarTipoUsuario = require('../server/middlewares/verificarTipoUsuario');

// Logs de admin
router.use(autenticarToken, adminController.verificarAdmin);
router.get('/', autenticarToken, verificarTipoUsuario(['admin']), logController.listarTodos);

module.exports = router;