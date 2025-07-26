// database/db.js
const mysql = require('mysql2/promise');
require('dotenv').config();

// Criação do pool de conexões com suporte a async/await
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'native_games_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

//Testar a conexão ao iniciar
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Conectado ao banco de dados MySQL com sucesso!');
    connection.release();
  } catch (error) {
    console.error('❌ Erro ao conectar ao banco de dados:', error.message);
    process.exit(1);
  }
});

module.exports = pool;


// const mysql = require('mysql2');
// require('dotenv').config();

// const db = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
// });

// db.connect((err) => {
//   if (err) console.error('Erro ao conectar DB:', err);
//   else console.log('DB conectado com sucesso!');
// });

// module.exports = db;