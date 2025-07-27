require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const exphbs = require('express-handlebars');
const helmet = require('helmet');
const methodOverride = require('method-override');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const cors = require('cors');


// Middlewares globais
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(helmet());
app.use(cors());

// Configuração do Handlebars
app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Rotas principais
app.use('/', require('./routes/indexRoutes'));
app.use('/jogos', require('./routes/jogoRoutes'));
app.use('/auth', require('./routes/oauthRoutes'));
app.use('/usuarios', require('./routes/usuarioRoutes'));
app.use('/hub', require('./routes/hubRoutes'));
app.use('/favoritos', require('./routes/favoritosRoutes'));
app.use('/admin', require('./admin/adminRoutes'));
app.use('/logs', require('./routes/logRoutes'));


// Página não encontrada
app.use((req, res) => {
  res.status(404).render('404', { layout: 'main', mensagem: 'Página não encontrada' });
});

// Middleware de erro global
app.use((err, req, res, next) => {
  console.error('Erro interno:', err.stack);
  res.status(500).render('500', { layout: 'main', mensagem: 'Erro interno do servidor' });
});

// Servidor
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
