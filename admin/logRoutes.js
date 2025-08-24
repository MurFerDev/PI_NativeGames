const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const logController = require('../controllers/logController');
const autenticarToken = require('../server/middlewares/autenticarToken');
const verificarTipoUsuario = require('../server/middlewares/verificarTipoUsuario');

// Logs de admin
router.use(autenticarToken, adminController.verificarAdmin);
router.get('/', autenticarToken, verificarTipoUsuario(['admin']), logController.listarTodos);

module.exports = router;