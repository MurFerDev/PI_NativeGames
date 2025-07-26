const fs = require('fs');
const path = require('path');
const mysql = require('mysql2');
require('dotenv').config();

const sql = fs.readFileSync(path.join(__dirname, 'setup.sql'), 'utf8');

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  multipleStatements: true
});

connection.connect(err => {
  if (err) {
    console.error('Erro ao conectar no MySQL:', err);
    return;
  }

  console.log('✅ Conectado ao MySQL');

  connection.query(sql, (err, results) => {
    if (err) {
      console.error('❌ Erro ao executar script SQL:', err.message);
    } else {
      console.log('✅ Script SQL executado com sucesso!');
    }
    connection.end();
  });
});