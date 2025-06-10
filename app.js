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
    password: '@MySQL_$3n4c#',
    database: 'db_native_games'
})

app.get('/usuarios', (req, res) => {;
    let sql = 'SELECT * FROM tb_usuarios';
    conexao.query(sql, function(erro, usuarios_qs) {
        if (erro) {
            console.error('Erro ao consultar usuarios:', erro);
            res.status(500).send('Erro ao consultar usuarios');
            return;
        }
        res.render('tb_usuarios', {usuario: usuarios_qs});
    });
}
);

app.listen(8080);