const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const autenticarToken = require('../server/middlewares/autenticarToken');
const verificarTipoUsuario = require('../server/middlewares/verificarTipoUsuario');

// Registro e login
router.post('/registrar', usuarioController.registrar);
router.post('/login', usuarioController.realizarLogin);

// Perfil
router.get('/hub', autenticarToken, usuarioController.perfil);
router.put('/editar', autenticarToken, usuarioController.editar);
router.post('/logout', autenticarToken, usuarioController.logout);
router.get('favoritos', autenticarToken, usuarioController.favoritos);
router.post('/favoritos', autenticarToken, usuarioController.adicionarFavorito);
router.delete('/favoritos/:ID', autenticarToken, usuarioController.removerFavorito);

// Admin acessa qualquer usuário
router.get('/:ID', autenticarToken, verificarTipoUsuario(['admin']), usuarioController.perfilPorId);

// Gerenciar usuários (admin)
router.get('/', autenticarToken, verificarTipoUsuario(['admin']), usuarioController.listarUsuarios);
router.delete('/:ID', autenticarToken, verificarTipoUsuario(['admin']), usuarioController.removerUsuario);
router.patch('/:ID', autenticarToken, verificarTipoUsuario(['admin']), usuarioController.atualizarTipoUsuario);

module.exports = router;