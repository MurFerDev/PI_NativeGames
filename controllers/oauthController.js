const db = require('../database/db');

exports.loginGoogle = (req, res) => {
  res.status(200).json({ message: 'Login com Google simulado' });
};

exports.loginFacebook = (req, res) => {
  res.status(200).json({ message: 'Login com Facebook simulado' });
};