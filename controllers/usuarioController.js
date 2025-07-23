const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'chave_padrao_secreta';

// Registrar novo usuário
exports.register = async (req, res) => {
  const { nome, email, senha, apelido_usuario, tipo_usuario = 'registrado' } = req.body;

  if (!nome || !email || !senha || !apelido_usuario) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  try {
    // Verificar se email já existe
    db.query('SELECT * FROM tb_usuarios WHERE email_usuario = ?', [email], async (err, results) => {
      if (err) return res.status(500).json({ error: 'Erro no servidor.' });
      if (results.length > 0) return res.status(409).json({ error: 'E-mail já cadastrado.' });

      const hashedPassword = await bcrypt.hash(senha, 10);
      db.query(
        'INSERT INTO usuarios (nome_usuario, email_usuario, senha_usuario, apelido_usuario, tipo_usuario) VALUES (?, ?, ?, ?, ?)',
        [nome, email, hashedPassword, apelido_usuario, tipo_usuario],
        (err, result) => {
          if (err) return res.status(500).json({ error: 'Erro ao cadastrar usuário.' });
          res.status(201).json({ message: 'Usuário registrado com sucesso!', userId: result.insertId });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// Login do usuário
exports.login = (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
  }

  db.query('SELECT * FROM tb_usuarios WHERE email_usuario = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Erro ao buscar usuário.' });
    if (results.length === 0) return res.status(401).json({ error: 'Usuário não encontrado.' });

    const usuario = results[0];
    const match = await bcrypt.compare(senha, usuario.senha);
    if (!match) return res.status(401).json({ error: 'Senha incorreta.' });

    const token = jwt.sign(
      {
        ID_usuario: usuario.ID_usuario,
        nome_usuario: usuario.nome_usuario,
        email_usuario: usuario.email_usuario,
        apelido_usuario: usuario.apelido_usuario,
        tipo_usuario: usuario.tipo_usuario
      },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.status(200).json({
      message: 'Login bem-sucedido',
      token,
      usuario: {
        ID_usuario: usuario.ID_usuario,
        nome_usuario: usuario.nome_usuario,
        apelido_usuario: usuario.apelido_usuario,
        tipo_usuario: usuario.tipo_usuario,
        email_usuario: usuario.email_usuario
      }
    });
  });
};

// Editar perfil do usuário
exports.editar = async (req, res) => {
  const { nome, senha, apelido_usuario } = req.body;
  const usuarioId = req.usuario.ID_usuario;

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

    valores.push(usuarioId);

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