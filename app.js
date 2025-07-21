require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const exphbs = require('express-handlebars');

// Conexão com banco de dados
const db = require('./config/db');

// Rotas
const usuarioRoutes = require('./routes/usuarioRoutes');
const jogoRoutes = require('./routes/jogoRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Inicializa app
const app = express();

// Configurações Express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Pasta pública
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));

// View engine: Handlebars
app.engine('handlebars', exphbs.engine({
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views', 'layouts'),
  partialsDir: path.join(__dirname, 'views', 'partials'),
  helpers: {
    ifEquals: (arg1, arg2, options) => (arg1 === arg2 ? options.fn(this) : options.inverse(this)),
    formatData: (data) => new Date(data).toLocaleDateString('pt-BR')
  }
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Rotas públicas e protegidas
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/jogos', jogoRoutes);
app.use('/api/admin', adminRoutes);

// Rotas de interface web
app.get('/', (req, res) => {
  res.render('home', { title: 'Plataforma Native Games' });
});

app.get('/hub', (req, res) => {
  res.render('hub', { title: 'Área do Usuário' });
});

app.get('/dashboard', (req, res) => {
  res.render('admin/dashboard', { title: 'Painel Administrativo' });
});

app.get('/logs', (req, res) => {
  res.render('admin/logs', { title: 'Logs do Sistema' });
});

app.get('/usuarios', (req, res) => {
  res.render('admin/usuarios', { title: 'Gerenciar Usuários' });
});

// Middleware 404
app.use((req, res) => {
  res.status(404).render('404', { title: 'Página não encontrada' });
});

// Inicia servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});