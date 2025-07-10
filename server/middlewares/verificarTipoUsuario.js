module.exports = function verificarTipoUsuario(tiposPermitidos = []) {
  return function (req, res, next) {
    if (!req.usuario || !tiposPermitidos.includes(req.usuario.tipo_usuario)) {
      return res.status(403).json({ error: 'Acesso não autorizado para este tipo de usuário.' });
    }
    next();
  };
};