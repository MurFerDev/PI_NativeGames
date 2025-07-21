const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const autenticarToken = require('../middlewares/autenticarToken');
const verificarTipoUsuario = require('../middlewares/verificarTipoUsuario');

// Registro e login
router.post('/register', usuarioController.registrar);
router.post('/login', usuarioController.login);

// Perfil
router.get('/me', autenticarToken, usuarioController.perfil);
router.put('/editar', autenticarToken, usuarioController.editar);
router.post('/logout', autenticarToken, usuarioController.logout);

// Admin acessa qualquer usuário
router.get('/:ID', autenticarToken, verificarTipoUsuario(['admin']), usuarioController.perfilPorId);

// Gerenciar usuários (admin)
router.get('/', autenticarToken, verificarTipoUsuario(['admin']), usuarioController.listarUsuarios);
router.delete('/:ID', autenticarToken, verificarTipoUsuario(['admin']), usuarioController.removerUsuario);
router.patch('/:ID', autenticarToken, verificarTipoUsuario(['admin']), usuarioController.atualizarTipoUsuario);

module.exports = router;