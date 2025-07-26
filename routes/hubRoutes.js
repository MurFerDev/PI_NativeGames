const express = require('express');
const router = express.Router();
const hubController = require('../controllers/hubController');
const autenticarToken = require('../server/middlewares/autenticarToken');
const verificarTipoUsuario = require('../server/middlewares/verificarTipoUsuario');

// Estatísticas do usuário autenticado (usuário ou admin)
router.get('/dados', autenticarToken, hubController.estatisticasUsuario);

// Estatísticas globais do hub (apenas admin)
// router.get('/globais', autenticarToken, verificarTipoUsuario(['admin']), hubController.estatisticasGlobais);

module.exports = router;