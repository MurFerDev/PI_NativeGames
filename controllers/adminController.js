const db = require('../database/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Middleware para verificar se o usuário é admin
exports.verificarAdmin = (req, res, next) => {
  if (!req.usuario || req.usuario.tipo_usuario !== 'admin') {
    return res.status(403).json({ error: 'Acesso restrito a administradores.' });
  }
  next();
};

// Dashboard: totais de usuários, jogos e acessos hoje
exports.getDashboardData = async (req, res) => {
  try {
    const [[{ totalUsuarios }]] = await db.promise().query('SELECT COUNT(*) AS totalUsuarios FROM tb_usuarios');
    const [[{ totalJogos }]] = await db.promise().query('SELECT COUNT(*) AS totalJogos FROM tb_jogos');
    const [[{ totalAcessosHoje }]] = await db.promise().query('SELECT COUNT(*) AS totalAcessosHoje FROM tb_log_acesso_usuarios WHERE DATE(data_acesso) = CURDATE()');
    res.status(200).json({
      totalUsuarios,
      totalJogos,
      acessosHoje: totalAcessosHoje
    });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar dados da dashboard.' });
  }
};

// Listar últimos 100 logs de acesso
exports.getLogs = async (req, res) => {
  try {
    const [results] = await db.promise().query('SELECT * FROM tb_log_acesso_usuarios ORDER BY data_acesso DESC LIMIT 100');
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar logs.' });
  }
};

// Listar todos os usuários
exports.listarUsuarios = async (req, res) => {
  try {
    const [results] = await db.promise().query(
      'SELECT ID_usuario, nome_usuario, email_usuario, apelido_usuario, tipo_usuario, status_usuario FROM tb_usuarios'
    );
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar usuários.' });
  }
};

// Registrar novo usuário pelo Administrador
exports.registrarUsuarioAdmin = async (req, res) => {
  const {
    nome_usuario,
    email_usuario,
    senha,
    apelido_usuario,
    telefone_usuario,
    data_nascimento,
    genero_usuario = 'não definido',
    status_usuario = 'ativo',
    tipo_usuario = 'registrado'
  } = req.body;

  // Validação básica
  if (!nome_usuario || !email_usuario || !senha || !apelido_usuario) {
    return res.status(400).json({ error: 'Nome, e-mail, senha e apelido são obrigatórios.' });
  }

  try {
    // Verificar se email já existe
    const [results] = await db.promise().execute(
      'SELECT * FROM tb_usuarios WHERE email_usuario = ?', [email_usuario]
    );
    if (results.length > 0) {
      return res.status(409).json({ error: 'E-mail já cadastrado.' });
    }

    const hashedPassword = await bcrypt.hash(senha, 10);

    const [insertResult] = await db.promise().execute(
      `INSERT INTO tb_usuarios 
        (nome_usuario, email_usuario, senha_usuario, apelido_usuario, telefone_usuario, data_nascimento, genero_usuario, status_usuario, tipo_usuario) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nome_usuario,
        email_usuario,
        hashedPassword,
        apelido_usuario,
        telefone_usuario || null,
        data_nascimento || null,
        genero_usuario,
        status_usuario,
        tipo_usuario
      ]
    );

    res.status(201).json({ message: 'Usuário registrado com sucesso!', ID_usuario: insertResult.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// Atualizar usuário (nome, apelido, tipo, status)
exports.atualizarUsuario = async (req, res) => {
  const id = req.params.id;
  const { nome, apelido_usuario, tipo_usuario, status_usuario } = req.body;

  const campos = [];
  const valores = [];

  if (nome) {
    campos.push('nome_usuario = ?');
    valores.push(nome);
  }
  if (apelido_usuario) {
    campos.push('apelido_usuario = ?');
    valores.push(apelido_usuario);
  }
  if (tipo_usuario) {
    campos.push('tipo_usuario = ?');
    valores.push(tipo_usuario);
  }
  if (status_usuario) {
    campos.push('status_usuario = ?');
    valores.push(status_usuario);
  }

  if (campos.length === 0) {
    return res.status(400).json({ error: 'Nenhum campo fornecido para atualizar.' });
  }

  valores.push(id);

  try {
    const [result] = await db.promise().query(
      `UPDATE tb_usuarios SET ${campos.join(', ')} WHERE ID_usuario = ?`,
      valores
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    res.status(200).json({ message: 'Usuário atualizado com sucesso.' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar usuário.' });
  }
};

// Remover usuário
exports.removerUsuario = async (req, res) => {
  const id = req.params.id;
  try {
    const [result] = await db.promise().query(
      'DELETE FROM tb_usuarios WHERE ID_usuario = ?',
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    res.status(200).json({ message: 'Usuário removido com sucesso.' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao remover usuário.' });
  }
};