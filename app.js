require('dotenv').config();

// Importação de módulos necessários
const express = require('express');
const app = express();
const { engine } = require('express-handlebars');
const mysql = require('mysql2');
const path = require('path');

// Configuração da conexão com o banco de dados MySQL
const conexao = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '@MySQL_$3n4c#',
    database: process.env.DB_NAME || 'native_games_DB'
});

conexao.connect(function (erro) {
    if (erro) {
        console.error('Erro ao conectar ao banco de dados:', erro);
        process.exit(1);
    } else {
        console.log('Conexão com o banco de dados estabelecida com sucesso!');
    }
});

// Configuração do middleware para servir arquivos estáticos
app.use(express.static(__dirname + '/static')); // Pasta para arquivos estáticos
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist')); // Pasta para o Bootstrap
app.use(express.urlencoded({ extended: true })); // Middleware para analisar dados de formulários
// Configuração do Handlebars como motor de visualização
app.engine('handlebars', engine({
    defaultLayout: 'main',
    helpers: {
        ifCond: function (v1, operator, v2, options) {
            switch (operator) {
                case '==':
                    return (v1 == v2) ? options.fn(this) : options.inverse(this);
                case '===':
                    return (v1 === v2) ? options.fn(this) : options.inverse(this);
                case '!=':
                    return (v1 != v2) ? options.fn(this) : options.inverse(this);
                case '<':
                    return (v1 < v2) ? options.fn(this) : options.inverse(this);
                case '>':
                    return (v1 > v2) ? options.fn(this) : options.inverse(this);
                default:
                    return options.inverse(this);
            }
        }
    }
}));

app.set('view engine', 'handlebars');
app.set('views', './views');

// Rota para consultar usuários
app.get('/', (req, res) => {
    res.render('index', { titulo: 'Página inicial' });
});

// Rota para a página "Login"
app.get('/login', (req, res) => {
    res.render('login', { titulo: 'Login' });
});

// Rota para a página "Cadastro"
app.get('/registrar', (req, res) => {
    res.render('registrar', { titulo: 'Cadastro de Usuário' });
});

// Rota para a página "Sobre"
app.get('/sobre', (req, res) => {
    res.render('sobre', { titulo: 'Sobre o Projeto' });
});

// Rota para a página "Contato"
app.get('/contato', (req, res) => {
    res.render('contato', { titulo: 'Fale Conosco' });
});

// Rota para a página Adugo
app.get('/adugo', (req, res) => {
    res.render('adugo', { titulo: 'Adugo (Brasil)' });
});

// Rota para o dashboard
app.get('/dashboard', (req, res) => {
    const sql = `
    SELECT j.nome_jogo, COUNT(l.ID_log_acesso_de_usuario) AS total
    FROM tb_log_acesso_usuarios l
        JOIN tb_jogos j ON j.ID_jogo = l.fk_jogo
        GROUP BY j.nome_jogo
    `;
    conexao.query(sql, function (erro, resultados) {
        if (erro) {
            console.error('Erro ao consultar dashboard:', erro);
            res.status(500).send('Erro ao consultar dashboard');
            return;
        }
        res.render('dashboard', { titulo: 'Dashboard', dados: resultados });
    });
});

// Rota para consultar usuários
app.get('/admin/usuarios', (req, res) => {
    ;
    let sql = 'SELECT * FROM tb_usuarios';
    conexao.query(sql, function (erro, usuarios_qs) {
        if (erro) {
            console.error('Erro ao consultar usuarios:', erro);
            res.status(500).send('Erro ao consultar usuarios');
            return;
        }
        res.render('usuarios', { usuarios: usuarios_qs });
    });
});

// Rota para consultar detalhes de um usuário
app.get('/admin/usuarios/detalhes/:id', (req, res) => {
    const id_usuario = req.params.id;
    const sql = 'SELECT * FROM tb_usuarios WHERE ID_usuario = ?';
    conexao.query(sql, [id_usuario], function (erro, resultados) {
        if (erro) {
            console.error('Erro ao consultar detalhes do usuário:', erro);
            res.status(500).send('Erro ao consultar detalhes do usuário');
            return;
        }
        if (resultados.length === 0) {
            res.status(404).send('Usuário não encontrado');
            return;
        }
        res.render('detalhes_usuario', { titulo: 'Detalhes do Usuário', usuario: resultados[0], formAction: `/admin/usuarios/detalhes/${id_usuario}` });
    });
});

// Rota para exibir o formulário de edição de usuário
app.get('/admin/usuarios/detalhes/:id/editar', (req, res) => {
    const id_usuario = req.params.id;
    const sql = 'SELECT * FROM tb_usuarios WHERE ID_usuario = ?';
    conexao.query(sql, [id_usuario], function (erro, resultados) {
        if (erro) {
            console.error('Erro ao consultar detalhes do usuário:', erro);
            res.status(500).send('Erro ao consultar detalhes do usuário');
            return;
        }
        if (resultados.length === 0) {
            res.status(404).send('Usuário não encontrado');
            return;
        }
        res.render('editar_usuario', { titulo: 'Editar Usuário', usuario: resultados[0], formAction: `/admin/usuarios/detalhes/${id_usuario}/editar` });
    });
});

// Rota para processar o formulário de edição de usuário
app.post('/admin/usuarios/detalhes/:id/editar', (req, res) => {
    const id_usuario = req.params.id;
    const { nome_usuario, email_usuario, senha_usuario, telefone_usuario, data_nascimento, genero_usuario, status_usuario, tipo_usuario } = req.body;
    const sql = `
        UPDATE tb_usuarios 
        SET nome_usuario = ?, email_usuario = ?, senha_usuario = ?, telefone_usuario = ?, data_nascimento = ?, genero_usuario = ?, status_usuario = ?, tipo_usuario = ?
        WHERE ID_usuario = ?
    `;
    conexao.query(sql, [nome_usuario, email_usuario, senha_usuario, telefone_usuario, data_nascimento, genero_usuario, status_usuario, tipo_usuario, id_usuario], function (erro) {
        if (erro) {
            console.error('Erro ao atualizar usuário:', erro);
            res.status(500).send('Erro ao atualizar usuário');
            return;
        }
        console.log('Usuário atualizado com sucesso!');
        res.redirect('/admin/usuarios');
    });
});

// Rota para adicionar um novo usuário
app.get('/admin/usuarios/adicionar', (req, res) => {
    res.render('adicionar_usuario', { titulo: 'Adicionar Usuário', editar_usuario: false, formAction: '/admin/usuarios/adicionar' });
});

// Rota para processar o formulário de adição de usuário
app.post('/admin/usuarios/adicionar', (req, res) => {
    const { nome_usuario, email_usuario, senha_usuario, tipo_usuario } = req.body;
    const sql = 'INSERT INTO tb_usuarios (nome_usuario, email_usuario, senha_usuario, tipo_usuario) VALUES (?, ?, ?, ?)';
    conexao.query(sql, [nome_usuario, email_usuario, senha_usuario, tipo_usuario], function (erro) {
        if (erro) {
            console.error('Erro ao inserir usuário:', erro);
            res.status(500).send('Erro ao inserir usuário');
            return;
        }
        console.log('Usuário inserido com sucesso!');
        res.redirect('/admin/usuarios');
    });
});

// Rota para excluir um usuário
app.post('/admin/usuarios/excluir/:id', (req, res) => {
    const id_usuario = req.params.id;
    const sql = 'DELETE FROM tb_usuarios WHERE ID_usuario = ?';
    conexao.query(sql, [id_usuario], function (erro) {
        if (erro) {
            console.error('Erro ao excluir usuário:', erro);
            res.status(500).send('Erro ao excluir usuário');
            return;
        }
        console.log('Usuário excluído com sucesso!');
        res.redirect('/admin/usuarios');
    });
});

// Rota para exibir o formulário depesquisa de usuarios
app.get('/admin/usuarios/pesquisar-form', (req, res) => {
    res.render('pesquisar'); // esta é a página com o <form>
});

// Rota para processar a pesquisa
app.get('/admin/usuarios/pesquisar', (req, res) => {
    const termo = req.query.pesquisar_usuario;
    console.log('Termo recebido para pesquisa:', termo);

    if (!termo) {
        return res.redirect('/admin/usuarios/pesquisar-form');
    }

    const sql = `
        SELECT * FROM tb_usuarios 
        WHERE nome_usuario LIKE ? OR email_usuario LIKE ? OR apelido_usuario LIKE ?
    `;
    const termoPesquisa = `%${termo}%`;
    conexao.query(sql, [termoPesquisa, termoPesquisa, termoPesquisa], function (erro, usuarios_qs) {
        if (erro) {
            console.error('Erro ao pesquisar usuários:', erro);
            return res.status(500).send('Erro ao pesquisar usuários');
        }
        res.render('pesquisar', { usuarios: usuarios_qs });
    });
});

// Rota para consultar logs de acesso
app.get('/admin/logs', (req, res) => {
    const sql = `
        SELECT l.ID_log_acesso_de_usuario, u.nome_usuario, j.nome_jogo, l.email_tentado, l.status_acesso, l.ip_origem, l.data_hora
        FROM tb_log_acesso_usuarios l
        JOIN tb_usuarios u ON u.ID_usuario = l.fk_usuario
        JOIN tb_jogos j ON j.ID_jogo = l.fk_jogo
        ORDER BY l.data_hora DESC
    `;
    conexao.query(sql, function (erro, logs_qs) {
        if (erro) {
            console.error('Erro ao consultar logs:', erro);
            res.status(500).send('Erro ao consultar logs');
            return;
        }
        res.render('logs', { titulo: 'Logs de Acesso', logs: logs_qs });
    });
});

// Rota para consultar jogos
app.get('/jogos', (req, res) => {
    const sql = 'SELECT * FROM tb_jogos';
    conexao.query(sql, function (erro, jogos_qs) {
        if (erro) {
            console.error('Erro ao consultar jogos:', erro);
            res.status(500).send('Erro ao consultar jogos');
            return;
        }
        res.render('jogos', { jogos: jogos_qs });
    });
});

// Rota para efetuar logout
app.post('/logout', (req, res) => {
    const sql = 'UPDATE tb_usuarios SET status_usuario = "offline" WHERE ID_usuario = ?';
    const id_usuario = req.body.id_usuario; // Supondo que o ID do usuário esteja sendo enviado no corpo da requisição
    conexao.query(sql, [id_usuario], function (erro) {
        if (erro) {
            console.error('Erro ao atualizar status do usuário:', erro);
            res.status(500).send('Erro ao atualizar status do usuário');
            return;
        }
        console.log('Status do usuário atualizado para offline com sucesso!');
    });
    conexao.end(function (erro) {
        if (erro) {
            console.error('Erro ao encerrar a conexão com o banco de dados:', erro);
            res.status(500).send('Erro ao encerrar a conexão com o banco de dados');
            return;
        } else {
            console.log('Conexão com o banco de dados encerrada com sucesso!');
            console.log('Usuário deslogado');
        }
        res.redirect('/'); // Redireciona para a página inicial após o logout
    });
});

app.listen(8080); // Inicia o servidor na porta 8080

module.exports = app.js; // Exporta o app para testes ou outros usos