// Importação de módulos necessários
const express = require('express');
const app = express();
const {engine} = require ('express-handlebars');

const mysql = require('mysql2');

// Configuração do middleware para servir arquivos estáticos
app.use('/static', express.static(__dirname + '/static')); // Pasta para arquivos estáticos
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist')); // Pasta para o Bootstrap
// Configuração do Handlebars como motor de visualização
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');
// Configuração da conexão com o banco de dados MySQL
const conexao = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'senac',
    database: 'native_games_DB'
})

// Conexão com o banco de dados
conexao.connect(function(erro) {
    if (erro) {
        console.error('Erro ao conectar ao banco de dados:', erro);
        return;
    }
    console.log('Conexão com o banco de dados estabelecida com sucesso!');
});

// Rota para consultar usuários
app.get('/', (req, res) => {
    res.render('index', {titulo: 'Página inicial'});
});

// Rota para a página "Login"
app.get('/login', (req, res) => {
    res.render('login', {titulo: 'Login'});
});

// Rota para a página "Cadastro"
app.get('/registrar', (req, res) => {
    res.render('registrar', {titulo: 'Cadastro de Usuário'});
});

// Rota para a página "Sobre"
app.get('/sobre', (req, res) => { 
    res.render('sobre', {titulo: 'Sobre o Projeto'});
});

// Rota para a página "Contato"
app.get('/contato', (req, res) => {
    res.render('contato', {titulo: 'Fale Conosco'});
});

// Rota para consultar usuários
app.get('/usuarios', (req, res) => {; 
    let sql = 'SELECT * FROM tb_usuarios';
    conexao.query(sql, function(erro, usuarios_qs) {
        if (erro) {
            console.error('Erro ao consultar usuarios:', erro);
            res.status(500).send('Erro ao consultar usuarios');
            return;
        }
        res.render('usuarios', {usuarios: usuarios_qs});
    });
});

app.get('/adugo', (req, res) => {
    res.render('adugo', {titulo: 'Adugo (Brasil)'});
});

app.listen(8080);