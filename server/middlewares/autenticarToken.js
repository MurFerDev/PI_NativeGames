const jwt = require('jsonwebtoken');
require('dotenv').config();

function autenticarToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: 'Token de autenticação não fornecido.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, usuario) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido ou expirado.' });
    }

    req.usuario = usuario;
    next();
  });
}

module.exports = autenticarToken;