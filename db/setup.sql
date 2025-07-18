CREATE DATABASE IF NOT EXISTS native_games_DB
    DEFAULT CHARACTER SET = 'utf8mb4';

USE native_games_DB;

CREATE TABLE tb_jogos (
    ID_jogo INT AUTO_INCREMENT PRIMARY KEY,
    nome_jogo VARCHAR(100) NOT NULL,
    descricao_jogo TEXT,
    regiao_jogo VARCHAR(100),
    epoca_jogo VARCHAR(100),
    latitude_jogo DECIMAL(9,6),
    longitude_jogo DECIMAL(9,6),
    url_jogo VARCHAR(255),
    url_thumbnail_jogo VARCHAR(255)
);

/* Inserção de dados dos jogos */
INSERT INTO tb_jogos(nome_jogo, descricao_jogo, regiao_jogo, url_jogo, url_thumbnail_jogo)
VALUES ('Adugo - Jogo da Onça', 'Jogo de tabuleiro onde a onça tenta capturar os cachorros, e os cachorros tentam cercar a onça.', 'Brasil', 'adugo', 'adugo.png');
INSERT INTO tb_jogos(nome_jogo, descricao_jogo, regiao_jogo, url_jogo, url_thumbnail_jogo)
VALUES ('Dou Shou Qi', 'Tradicional jogo de tabuleiro chines, conhecido como batalha dos animais ou jogo da selva.', 'China', 'doushouqi', 'doushouqi.png');
INSERT INTO tb_jogos(nome_jogo, descricao_jogo, regiao_jogo, epoca_jogo, url_jogo, url_thumbnail_jogo)
VALUES ('Senet', 'Jogo egípcio antigo, considerado um dos jogos de tabuleiro mais antigos do mundo. É jogado em um tabuleiro retangular com 30 casas dispostas em três fileiras de dez casas cada.', 'Egito', '3100 a.C..', 'senet', 'senet.png'); 
INSERT INTO tb_jogos(nome_jogo, descricao_jogo, regiao_jogo, epoca_jogo, url_jogo, url_thumbnail_jogo)
VALUES ('Mancala', 'Jogo de tabuleiro tradicional africano, onde os jogadores movem sementes ou pedras entre buracos em um tabuleiro.', 'África', '2000 a.C.', 'mancala', 'mancala.png');
INSERT INTO tb_jogos(nome_jogo, descricao_jogo, regiao_jogo, epoca_jogo, url_jogo, url_thumbnail_jogo)
VALUES ('Bagha-Chall', 'Jogo de tabuleiro tradicional do Nepal, onde um jogador controla uma onça e o outro controla cinco cabras, tentando capturar ou escapar.', 'Nepal', 'Século 19', 'baghachall' ,'baghachall.png');
INSERT INTO tb_jogos(nome_jogo, descricao_jogo, regiao_jogo, epoca_jogo, url_jogo, url_thumbnail_jogo)
VALUES ('Chaturanga', 'Antigo jogo indiano que é considerado o precursor do xadrez moderno, jogado em um tabuleiro 8x8 com peças representando infantaria, cavalaria, elefantes e carros de guerra.', 'Índia', 'Século 6', 'chaturanga', 'chaturanga.png');
INSERT INTO tb_jogos(nome_jogo, descricao_jogo, regiao_jogo, epoca_jogo, url_jogo, url_thumbnail_jogo)
VALUES ('Tafl', 'Jogo de tabuleiro nórdico antigo, onde um rei e seus guardas tentam escapar de um exército invasor, jogado em um tabuleiro quadrado com peças de diferentes formas.', 'Escandinávia', 'Século 8', 'tafl', 'tafl.png');

/* Criação da tabela de CATEGORIAS dos jogos */
CREATE TABLE tb_categorias ( 
  ID_categoria INT AUTO_INCREMENT PRIMARY KEY,
  nome_categoria VARCHAR(50) UNIQUE NOT NULL
);

/* Tabela de associação entre jogos e categorias */
CREATE TABLE tb_jogos_categorias ( 
  fk_jogo INT NOT NULL,
  fk_categoria INT NOT NULL,
  PRIMARY KEY (fk_jogo, fk_categoria),
  FOREIGN KEY (fk_jogo) REFERENCES tb_jogos(ID_jogo) ON DELETE CASCADE,
  FOREIGN KEY (fk_categoria) REFERENCES tb_categorias(ID_categoria) ON DELETE CASCADE
);

/* Criação da tabela de USUÁRIOS */
CREATE TABLE tb_usuarios ( 
ID_usuario INT AUTO_INCREMENT PRIMARY KEY,
nome_usuario VARCHAR(45) NOT NULL,
apelido_usuario VARCHAR(20),
email_usuario VARCHAR(100) NOT NULL,
senha_usuario CHAR(60) NOT NULL,
telefone_usuario VARCHAR(20),
data_nascimento DATE,
genero_usuario ENUM('masculino', 'feminino', 'outro', 'não definido') DEFAULT 'não definido',
status_usuario ENUM('ativo', 'inativo', 'bloqueado', 'banido') NOT NULL DEFAULT 'ativo',
ultimo_acesso DATETIME DEFAULT CURRENT_TIMESTAMP,
tipo_usuario ENUM('comum', 'registrado', 'premium', 'parceiro', 'gametester', 'moderador', 'dev', 'admin') NOT NULL DEFAULT 'comum',
criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

/* ADIÇÃO DE USUÁRIOS PARA TESTES */
INSERT INTO tb_usuarios(nome_usuario, email_usuario, senha_usuario, telefone_usuario, tipo_usuario)
VALUES ('Sara Paiva', 'vsara9951@gmail.com', 'usuariohoots', '11911045825', 'admin');
INSERT INTO tb_usuarios(nome_usuario, email_usuario, senha_usuario, telefone_usuario, tipo_usuario)
VALUES ('Murilo Ferreira', 'murferdev@gmail.com', 'Us3r@dm1n#', '11969677747', 'admin');
INSERT INTO tb_usuarios(nome_usuario, email_usuario, senha_usuario, telefone_usuario, tipo_usuario)
VALUES ('Yasmin Leite de Araújo', 'yasminleitedearaujo@gmail.com', 'senac123', '11937254422', 'premium');
INSERT INTO tb_usuarios(nome_usuario, email_usuario, senha_usuario, telefone_usuario, tipo_usuario)
VALUES ('Guilherme Buzo', 'buzoguilherme5@gmail.com', 'senac123', '11932680793', 'premium');
INSERT INTO tb_usuarios(nome_usuario, email_usuario, senha_usuario, telefone_usuario, tipo_usuario)
VALUES ('Rodrigo Antonio Junior', 'rodrigoantonio506@gmail.com', 'senac123', '11932881446', 'premium');
INSERT INTO tb_usuarios(nome_usuario, email_usuario, senha_usuario, telefone_usuario, tipo_usuario)
VALUES ('Rodrigo Bocchi', 'bocchirodrigo2014@gmail.com', 'senac123', '11974898898', 'premium');
INSERT INTO tb_usuarios(nome_usuario, email_usuario, senha_usuario, telefone_usuario, tipo_usuario)
VALUES ('Marcos Souza', 'mhsouz@outlook.com', 'senac123', '11948081107', 'premium');
INSERT INTO tb_usuarios(nome_usuario, email_usuario, senha_usuario, telefone_usuario, tipo_usuario)
VALUES ('Leonardo Rocco', 'leeo.rocco@gmail.com', 'senac123', '1174879654', 'admin');
INSERT INTO tb_usuarios(nome_usuario, email_usuario, senha_usuario, telefone_usuario, tipo_usuario)
VALUES ('Edson Medeiros', 'e.pezutijr@gmail.com', 'senac123', '11958211700', 'premium');
INSERT INTO tb_usuarios(nome_usuario, email_usuario, senha_usuario, telefone_usuario, tipo_usuario)
VALUES ('Kátia R L Pezuti', 'katiarleite@gmail.com', 'senac123', '11958312222', 'premium');

/* Criação da tabelas de ESTATÍSTICAS do usuário */
CREATE TABLE tb_estatisticas_usuarios(
ID_estatisticas_usuario INT AUTO_INCREMENT PRIMARY KEY,
partidas_jogadas INT,
vitorias INT,
derrotas INT,
fk_usuario INT NOT NULL,
fk_jogo INT NOT NULL,
FOREIGN KEY (fk_jogo) REFERENCES tb_jogos(ID_jogo),
FOREIGN KEY (fk_usuario) REFERENCES tb_usuarios(ID_usuario)
);

CREATE TABLE tb_favoritos (
ID_favorito INT AUTO_INCREMENT PRIMARY KEY,
fk_jogo INT NOT NULL,
fk_usuario INT NOT NULL,
CONSTRAINT fk_fav_usuario FOREIGN KEY (fk_usuario) REFERENCES tb_usuarios(ID_usuario) ON DELETE CASCADE,
CONSTRAINT fk_fav_jogo FOREIGN KEY (fk_jogo) REFERENCES tb_jogos(ID_jogo) ON DELETE CASCADE
);

/* Tabela de comentários dos jogos */
CREATE TABLE tb_comentarios ( 
  ID_comentario INT AUTO_INCREMENT PRIMARY KEY,
  fk_usuario INT NOT NULL,
  fk_jogo INT NOT NULL,
  texto TEXT NOT NULL,
  criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (fk_usuario) REFERENCES tb_usuarios(ID_usuario) ON DELETE CASCADE,
  FOREIGN KEY (fk_jogo) REFERENCES tb_jogos(ID_jogo) ON DELETE CASCADE
);

/* Avaliações dos jogos pelos usuários */
CREATE TABLE tb_avaliacoes (
  ID_avaliacao INT AUTO_INCREMENT PRIMARY KEY,
  fk_usuario INT NOT NULL,
  fk_jogo INT NOT NULL,
  nota TINYINT NOT NULL CHECK (nota BETWEEN 1 AND 5),
  criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (fk_usuario, fk_jogo),
  FOREIGN KEY (fk_usuario) REFERENCES tb_usuarios(ID_usuario) ON DELETE CASCADE,
  FOREIGN KEY (fk_jogo) REFERENCES tb_jogos(ID_jogo) ON DELETE CASCADE
);

/* Criando uma Tabela de Log de acesso dos usuários.
Essa tabela registra cada tentativa de login (sucesso ou falha) */
CREATE TABLE IF NOT EXISTS tb_log_acesso_usuarios (
  ID_log_acesso_de_usuario INT AUTO_INCREMENT PRIMARY KEY,
  fk_usuario INT,
  fk_jogo INT,
  email_tentado VARCHAR(255),
  status_acesso ENUM('successo', 'falha') NOT NULL,
  ip_origem VARCHAR(45),
  browser TEXT,
  data_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (fk_usuario) REFERENCES tb_usuarios(ID_usuario) ON DELETE SET NULL
);

/* Criando uma Tabela de Log de registro de ações dos usuários.
Essa tabela registra ações dentro do sistema (edição, jogo favorito…) */
CREATE TABLE IF NOT EXISTS tb_log_acoes_usuarios (
  ID_log_acao_de_usuario INT AUTO_INCREMENT PRIMARY KEY,
  fk_usuario INT NOT NULL,
  fj_jogo INT,
  acao ENUM('login', 'logout', 'cadastro', 'edicao_perfil', 'adicionar_favorito', 'remover_favorito', 'jogar', 'avaliar_jogo', 'comentar_jogo', 'reportar_bug', 'alterar_senha') NOT NULL,
  descricao_acao TEXT,
  rota_afetada VARCHAR(255),
  metodo_http VARCHAR(10),
  data_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (fk_usuario) REFERENCES tb_usuarios(ID_usuario) ON DELETE CASCADE
);

/* Criação de índices auxiliares para consultas frequentes em tabelas com FK */
CREATE UNIQUE INDEX idx_email_usuario ON tb_usuarios(email_usuario);
CREATE UNIQUE INDEX idx_nome_jogo ON tb_jogos(nome_jogo);
CREATE UNIQUE INDEX idx_jogo_favorito_usuario ON tb_favoritos(fk_usuario, fk_jogo);
