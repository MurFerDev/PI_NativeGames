const express = require('express');
const router = express.Router();
const hubController = require('../controllers/hubController');
const autenticarToken = require('../middlewares/autenticarToken');
const verificarTipoUsuario = require('../middlewares/verificarTipoUsuario');

// Estatísticas do hub (usuário ou admin)
router.get('/dados', autenticarToken, hubController.estatisticasUsuario);

module.exports = router;