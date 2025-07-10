const express = require('express');
const router = express.Router();
const oauthController = require('../controllers/oauthController');

router.post('/google', oauthController.loginGoogle);
router.post('/facebook', oauthController.loginFacebook);

module.exports = router;