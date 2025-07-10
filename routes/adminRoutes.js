const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const autenticarToken = require('../middleware/autenticarToken'); // você deve ter criado isso
const verificarAdmin = adminController.verificarAdmin;

router.use(autenticarToken);          // valida token
router.use(verificarAdmin);           // valida tipo admin

router.get('/dashboard', adminController.getDashboardData);
router.get('/logs', adminController.getLogs);
router.get('/usuarios', adminController.listarUsuarios);
router.put('/usuarios/:id', adminController.atualizarUsuario);
router.delete('/usuarios/:id', adminController.removerUsuario);

module.exports = router;