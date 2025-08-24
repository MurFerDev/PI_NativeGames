const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const autenticarToken = require('../server/middlewares/autenticarToken');

// Middlewares globais
router.use(autenticarToken); 
router.use(adminController.verificarAdmin); 

// Rotas de administração
router.get('/dashboard', adminController.getDashboardData);
router.get('/logs', adminController.getLogs);

// Usuários
router.get('/usuarios', adminController.listarUsuarios);
router.post('/usuarios', adminController.registrarUsuarioAdmin);
router.put('/usuarios/:ID', adminController.atualizarUsuario);
router.delete('/usuarios/:ID', adminController.removerUsuario);

// Jogos
//router.post('/cadastro', adminController.cadastrarJogo);
//router.put('/editar/:ID', adminController.editarJogo);
//router.delete('/excluir/:ID', adminController.excluirJogo);

module.exports = router;
