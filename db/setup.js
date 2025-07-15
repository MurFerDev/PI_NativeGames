const fs = require('fs');
const path = require('path');
const mysql = require('mysql2');

const sql = fs.readFileSync(path.join(__dirname, 'setup.sql'), 'utf8');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'senac', 
  multipleStatements: true 
});

connection.connect(err => {
  if (err) {
    console.error('Erro ao conectar no MySQL:', err.message);
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