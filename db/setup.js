const fs = require('fs');
const path = require('path');
const db = require('../database/db');
require('dotenv').config();

async function setupDatabase() {
  try {
    const sqlScript = fs.readFileSync(path.join(__dirname, 'setup.sql'), 'utf8');
    await db.query(sqlScript);
    console.log('✅ Banco de dados inicializado com sucesso.');
  } catch (err) {
    console.error('❌ Erro ao executar o script de setup.sql:', err);
  }
}

setupDatabase();