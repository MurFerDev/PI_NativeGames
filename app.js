const express = require('express');
const app = express();
const {engine} = require ('express-handlebars');

const mysql = require('mysql2');

app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'));

app.engine('hanclebars', engine())
;
app.set('view engine', 'handlebars');
app.set('views', './views');

const conexao = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '@MySQL_$3n4c#',
    database: 'DB_Native_Games'
})

app.get('/', (req, res) => {
    res.send('');
});

app.listen(8080);