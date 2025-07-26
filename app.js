// app.js (Refatorado)
require('dotenv').config();
const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();

// Importar conexão com o banco (executa e verifica automaticamente)
const db = require('./database/db');

// Middlewares globais
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || '$3nac@Native_Games',
  resave: false,
  saveUninitialized: false
}));

// Configuração do Handlebars
app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Rotas principais
app.use('/', require('./routes/indexRoutes'));
app.use('/usuarios', require('./routes/usuarioRoutes'));
app.use('/admin', require('./routes/adminRoutes'));
app.use('/jogos', require('./routes/jogoRoutes'));
app.use('/logs', require('./routes/logRoutes'));

// Página não encontrada
app.use((req, res) => {
  res.status(404).render('404', { layout: 'main', mensagem: 'Página não encontrada' });
});

// Middleware de erro global
app.use((err, req, res, next) => {
  console.error('❌ Erro interno:', err.stack);
  res.status(500).render('500', { layout: 'main', mensagem: 'Erro interno do servidor' });
});

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
