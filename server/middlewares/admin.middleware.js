function verificarAdmin(req, res, next) {
  if (req.usuario?.tipo_usuario !== 'admin') {
    return res.status(403).json({ error: 'Acesso permitido apenas para administradores.' });
  }
  next();
}

module.exports = verificarAdmin;