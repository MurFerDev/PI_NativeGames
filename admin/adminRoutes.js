const express = require('express');
const router = express.router();
const adminController = require('../controllers/adminController');
const autenticarToken = require('../server/middlewares/autenticarToken');

router.use(autenticarToken); // valida token
router.use(adminController.verificarAdmin); // valida tipo admin

router.get('/dashboard', adminController.getDashboardData);
router.get('/logs', adminController.getLogs);
router.get('/usuarios', adminController.listarUsuarios);
router.put('/usuarios/:id', adminController.atualizarUsuario);
router.post('/usuarios', adminController.registrarUsuarioAdmin);
router.delete('/usuarios/:id', adminController.removerUsuario);
router.post('cadastro', adminController.cadastrarJogo);
router.put('/editar/:id', adminController.editarJogo);
router.delete('/excluir/:id', adminController.excluirJogo);

module.exports = router;