const db = require('../database/db');
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
        'INSERT INTO tb_usuarios (nome_usuario, email_usuario, senha_usuario, apelido_usuario, tipo_usuario) VALUES (?, ?, ?, ?, ?)',
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
    const match = await bcrypt.compare(senha, usuario.senha_usuario);
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

// controllers/adminController.js
// const db = require('../database/db.js');

// exports.getDashboardData = (req, res) => {
//   const sql = `
//     SELECT COUNT(*) AS totalUsuarios FROM tb_usuarios;
//     SELECT COUNT(*) AS totalJogos FROM tb_jogos;
//     SELECT COUNT(*) AS totalAcessosHoje FROM tb_log_acesso_usuarios WHERE DATE(data_acesso) = CURDATE();
//   `;

//   db.query(sql, [1, 2, 3], (err, results) => {
//     if (err) return res.status(500).json({ error: 'Erro ao buscar dados da dashboard.' });
//     res.status(200).json({
//       totalUsuarios: results[0][0].totalUsuarios,
//       totalJogos: results[1][0].totalJogos,
//       acessosHoje: results[2][0].totalAcessosHoje
//     });
//   });
// };

exports.getLogs = (req, res) => {
  db.query('SELECT * FROM tb_log_acesso_usuarios ORDER BY data_acesso DESC LIMIT 100', (err, results) => {
    if (err) return res.status(500).json({ error: 'Erro ao buscar logs.' });
    res.status(200).json(results);
  });
};

exports.listarUsuarios = (req, res) => {
  db.query('SELECT ID_usuario, nome_usuario, email_usuario, apelido_usuario, tipo_usuario, status_usuario FROM tb_usuarios', (err, results) => {
    if (err) return res.status(500).json({ error: 'Erro ao buscar usuários.' });
    res.status(200).json(results);
  });
};

exports.atualizarUsuario = (req, res) => {
  const id = req.params.id;
  const { nome, apelido_usuario, tipo_usuario, status } = req.body;

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
  if (status) {
    campos.push('status_usuario = ?');
    valores.push(status);
  }

  if (campos.length === 0) {
    return res.status(400).json({ error: 'Nenhum campo fornecido para atualizar.' });
  }

  valores.push(id);
  const sql = `UPDATE tb_usuarios SET ${campos.join(', ')} WHERE ID_usuario = ?`;
  db.query(sql, valores, (err, res) => {
    if (err) return res.status(500).json({ error: 'Erro ao atualizar usuário.' });
    res.status(200).json({ message: 'Usuário atualizado com sucesso.' });
  });
};

exports.removerUsuario = (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM tb_usuarios WHERE ID_usuario = ?', [id], (err, res) => {
    if (err) return res.status(500).json({ error: 'Erro ao remover usuário.' });
    res.status(200).json({ message: 'Usuário removido com sucesso.' });
  });
};