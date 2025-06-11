const express = require('express');
const app = express();
const {engine} = require ('express-handlebars');

const mysql = require('mysql2');

app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'));

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

const conexao = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'senac',
    database: 'native_games_DB'
})

app.get('/', (req, res) => {;
    res.render('index')
});

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
}
);

app.listen(8080);