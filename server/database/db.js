
// config/db.js - Configuração de conexão com o banco de dados MySQL

const mysql = require('mysql2');
require('dotenv').config();

// Configuração da conexão com o banco de dados MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Conexão com o banco de dados
conexao.connect(function(erro) {
    if (erro) {
        console.error('Erro ao conectar ao banco de dados:', erro);
        return;
    }
    console.log('Conexão com o banco de dados estabelecida com sucesso!');
});

module.exports = db;