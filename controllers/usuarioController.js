const db = require('../database/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const usuarioModel = require('../models/usuarioModel');
const JWT_SECRET = process.env.JWT_SECRET;

exports.realizarLogin = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const [rows] = await usuarioModel.buscarPorEmail(email);
    const usuario = rows[0];

    if (!usuario) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    const senhaConfere = await bcrypt.compare(senha, usuario.senha_usuario);
    if (!senhaConfere) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    const token = jwt.sign(
      { id: usuario.ID_usuario, tipo: usuario.tipo_usuario },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    delete usuario.senha_usuario;

    res.json({ token, usuario });

  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).json({ error: 'Erro interno ao realizar login' });
  }
};


// Verificar se o usuário está autenticado
exports.autenticarUsuario = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido.' });
  }
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Token inválido.' });
    }
    req.usuario = decoded;
    next();
  });
};


// Registrar novo usuário
exports.registrar = async (req, res) => {
  const { nome, email, senha, apelido_usuario, tipo_usuario = 'registrado' } = req.body;

  if (!nome || !email || !senha || !apelido_usuario) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  try {
    // Verificar se email já existe
    const [results] = await db.promise().execute(
      'SELECT * FROM tb_usuarios WHERE email_usuario = ?', [email]
    );
    if (results.length > 0) {
      return res.status(409).json({ error: 'E-mail já cadastrado.' });
    }

    const hashedPassword = await bcrypt.hash(senha, 10);
    const [insertResult] = await db.promise().execute(
      'INSERT INTO tb_usuarios (nome_usuario, email_usuario, senha_usuario, apelido_usuario, tipo_usuario) VALUES (?, ?, ?, ?, ?)',
      [nome, email, hashedPassword, apelido_usuario, tipo_usuario]
    );

    res.status(201).json({ message: 'Usuário registrado com sucesso!', ID_usuario: insertResult.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};


// Perfil do usuário autenticado
exports.perfil = async (req, res) => {
  try {
    // req.usuario deve ser preenchido pelo middleware autenticarToken
    if (!req.usuario || !req.usuario.ID_usuario) {
      return res.status(401).json({ error: 'Usuário não autenticado.' });
    }

    const [rows] = await db.promise().execute(
      'SELECT ID_usuario, nome_usuario, apelido_usuario, email_usuario, tipo_usuario, status_usuario FROM tb_usuarios WHERE ID_usuario = ?',
      [req.usuario.ID_usuario]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar perfil do usuário.' });
  }
};

// Editar perfil do usuário
exports.editar = async (req, res) => {
  const { nome, senha, apelido_usuario } = req.body;
  const ID_usuario = req.usuario.ID_usuario;

  if (!nome && !senha && !apelido_usuario) {
    return res.status(400).json({ error: 'Informe ao menos um campo para atualização.' });
  }

  try {
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
    if (senha) {
      const hashedPassword = await bcrypt.hash(senha, 10);
      campos.push('senha_usuario = ?');
      valores.push(hashedPassword);
    }

    valores.push(ID_usuario);

    const sql = `UPDATE tb_usuarios SET ${campos.join(', ')} WHERE ID_usuario = ?`;
    db.query(sql, valores, (err, res) => {
      if (err) {
        console.error('Erro ao atualizar usuário:', err);
        return res.status(500).json({ error: 'Erro ao atualizar o perfil.' });
      }
      res.status(200).json({ message: 'Perfil atualizado com sucesso.' });
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// Logout do usuário
exports.logout = (req, res) => {
  // Se estiver usando sessões:
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao encerrar a sessão.' });
      }
      res.clearCookie('connect.sid');
      return res.status(200).json({ message: 'Logout realizado com sucesso.' });
    });
  } else {
    // Se estiver usando apenas JWT (frontend remove o token)
    return res.status(200).json({ message: 'Logout realizado com sucesso.' });
  }
};

// Buscar perfil de usuário por ID (admin)
exports.perfilPorId = async (req, res) => {
  const { ID } = req.params;
  try {
    const [rows] = await db.promise().execute(
      'SELECT ID_usuario, nome_usuario, apelido_usuario, email_usuario, tipo_usuario, status_usuario FROM tb_usuarios WHERE ID_usuario = ?',
      [ID]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuário.' });
  }
};

// Listar todos os usuários (admin)
exports.listarUsuarios = async (req, res) => {
  try {
    const [rows] = await db.promise().execute(
      'SELECT ID_usuario, nome_usuario, apelido_usuario, email_usuario, tipo_usuario, status_usuario FROM tb_usuarios'
    );
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar usuários.' });
  }
};

// Remover usuário (admin)
exports.removerUsuario = async (req, res) => {
  const { ID } = req.params;
  try {
    const [result] = await db.promise().execute(
      'DELETE FROM tb_usuarios WHERE ID_usuario = ?',
      [ID]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    res.status(200).json({ message: 'Usuário removido com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover usuário.' });
  }
};

// Atualizar tipo de usuário (admin)
exports.atualizarTipoUsuario = async (req, res) => {
  const { ID } = req.params;
  const { tipo_usuario } = req.body;
  if (!tipo_usuario) {
    return res.status(400).json({ error: 'O campo tipo_usuario é obrigatório.' });
  }
  try {
    const [result] = await db.promise().execute(
      'UPDATE tb_usuarios SET tipo_usuario = ? WHERE ID_usuario = ?',
      [tipo_usuario, ID]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    res.status(200).json({ message: 'Tipo de usuário atualizado com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar tipo de usuário.' });
  }
};