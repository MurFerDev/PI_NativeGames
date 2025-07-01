// middleware/auth.middleware.js - Middleware para verificar token JWT

const jwt = require('jsonwebtoken');
const jwtSecret = process.env.SECKEY_JWT;
require('dotenv').config();

function autenticarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Token não fornecido' });

  jwt.verify(token, jwtSecret, (err, usuario) => {
    if (err) return res.status(403).json({ error: 'Token inválido ou expirado' });
    req.usuario = usuario;
    next();
  });
};

module.exports = autenticarToken;