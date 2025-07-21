const express = require('express');
const router = express.Router();
const favoritosController = require('../controllers/favoritosController');
const autenticarToken = require('../middlewares/autenticarToken');

// Favoritar e listar
router.get('/', autenticarToken, favoritosController.listar);
router.post('/', autenticarToken, favoritosController.adicionar);
router.delete('/:ID_jogo', autenticarToken, favoritosController.remover);

module.exports = router;