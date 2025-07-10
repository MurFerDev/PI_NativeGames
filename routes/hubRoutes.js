const express = require('express');
const router = express.Router();
const hubController = require('../controllers/hubController');

router.get('/dados', hubController.getDadosHub);

module.exports = router;