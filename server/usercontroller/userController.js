// Rota para edição de perfil
app.put('/api/usuario/editar', autenticarToken, async (req, res) => {
    const { nome, senha } = req.body;
    const usuarioId = req.ID_usuario;
  
    if (!nome && !senha) {
      return res.status(400).json({ error: 'Informe pelo menos um campo para atualizar.' });
    }
  
    try {
      const campos = [];
      const valores = [];
  
      if (nome) {
        campos.push('nome = ?');
        valores.push(nome);
      }
  
      if (senha) {
        const hashedPassword = await bcrypt.hash(senha, 10);
        campos.push('senha = ?');
        valores.push(hashedPassword);
      }
  
      valores.push(usuarioId);
  
      const sql = `UPDATE tb_usuarios SET ${campos.join(', ')} WHERE id = ?`;
      db.query(sql, valores, (err, res) => {
        if (err) {
          console.error('Erro ao atualizar usuário:', err);
          return res.status(500).json({ error: 'Erro ao atualizar perfil.' });
        }
  
        res.status(200).json({ message: 'Perfil atualizado com sucesso.' });
      });
    } catch (error) {
      console.error('Erro no servidor:', error);
      res.status(500).json({ error: 'Erro interno do servidor.' });
    }

    registrarAcao(req.ID_usuario, 'Atualizou nome ou senha', '/api/usuario/editar', 'PUT');
  });
  
  // Adicionar jogo aos favoritos
  app.post('/api/favoritos', autenticarToken, (req, res) => {
    const usuarioId = req.ID_usuario;
    const { jogo_id } = req.body;
  
    if (!jogo_id) {
      return res.status(400).json({ error: 'ID do jogo é obrigatório.' });
    }
  
    const insert = 'INSERT INTO tb_favoritos ID_usuario, ID_jogo) VALUES (?, ?)';
    db.query(insert, [usuarioId, jogo_id], (err, res) => {
      if (err) {
        console.error('Erro ao adicionar favorito:', err);
        return res.status(500).json({ error: 'Erro ao adicionar favorito.' });
      }
      res.status(200).json({ message: 'Jogo adicionado aos favoritos com sucesso!' });
    });
  });
  
  // Remover jogo dos favoritos
  app.delete('/api/favoritos/:ID_jogo', autenticarToken, (req, res) => {
    const usuarioId = req.ID_usuario;
    const jogoId = req.params.ID_jogo;
  
    const del = 'DELETE FROM tb_favoritos WHERE ID_usuario = ? AND ID_jogo = ?';
    db.query(del, [usuarioId, jogoId], (err, res) => {
      if (err) {
        console.error('Erro ao remover favorito:', err);
        return res.status(500).json({ error: 'Erro ao remover favorito.' });
      }
      res.status(200).json({ message: 'Jogo removido dos favoritos com sucesso!' });
    });
  });