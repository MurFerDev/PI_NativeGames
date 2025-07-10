const express = require('express');
const router = express.Router();
const favoritosController = require('../controllers/favoritosController');

router.post('/', favoritosController.adicionar);
router.delete('/:id', favoritosController.remover);
router.get('/', favoritosController.listar);

module.exports = router;