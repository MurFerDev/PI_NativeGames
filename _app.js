// app.js - Estrutura principal com rotas externas e Handlebars

const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

// Configurações iniciais
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Configuração do Handlebars
app.engine('handlebars', exphbs.engine({
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views', 'layouts'),
  partialsDir: path.join(__dirname, 'views', 'partials')
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Rotas externas
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const favoritosRoutes = require('./routes/favoritosRoutes');
const oauthRoutes = require('./routes/oauthRoutes');
const hubRoutes = require('./routes/hubRoutes');

// Definindo uso das rotas
app.use('/api/usuarios', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/favoritos', favoritosRoutes);
app.use('/api/oauth', oauthRoutes);
app.use('/api/hub', hubRoutes);

// Rotas de renderização
app.get('/', (req, res) => res.render('home', { title: 'Native Games' }));
app.get('/login', (req, res) => res.render('login', { title: 'Login' }));
app.get('/register', (req, res) => res.render('register', { title: 'Cadastro' }));
app.get('/hub', (req, res) => res.render('hub', { title: 'Hub do Usuário' }));
app.get('/dashboard', (req, res) => res.render('admin-dashboard', { title: 'Painel Administrativo' }));
app.get('/logs', (req, res) => res.render('logs', { title: 'Logs do Sistema' }));
app.get('/usuarios', (req, res) => res.render('usuarios', { title: 'Gerenciar Usuários' }));

// Middleware de erro 404
app.use((req, res) => {
  res.status(404).render('404', { title: 'Página não encontrada' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
