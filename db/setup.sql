CREATE DATABASE native_games_DB;

USE native_games_DB;

CREATE TABLE tb_jogos (
    ID_jogo INT AUTO_INCREMENT PRIMARY KEY,
    nome_jogo VARCHAR(100) NOT NULL,
    descricao_jogo TEXT,
    regiao_jogo VARCHAR(100),
    epoca_jogo VARCHAR(100),
    latitude_jogo VARCHAR(45),
    longitude_jogo VARCHAR(45),
    url_jogo VARCHAR(255),
    url_textura_jogo VARCHAR(255)
);

/* Inserção de dados dos jogos */
INSERT INTO tb_jogos(nome_jogo, descricao_jogo, regiao_jogo)
VALUES ('Adugo - Jogo da Onça', 'Jogo de tabuleiro onde a onça tenta capturar os cachorros, e os cachorros tentam cercar a onça.', 'Brasil');
INSERT INTO tb_jogos(nome_jogo, descricao_jogo)
VALUES ('Dou Shou Qi', 'Tradicional jogo de tabuleiro chines, conhecido como batalha dos animais ou jogo da selva.');

CREATE TABLE tb_usuarios (
ID_usuario INT AUTO_INCREMENT PRIMARY KEY,
nome_usuario VARCHAR(45) NOT NULL,
apelido_usuario VARCHAR(20),
email_usuario VARCHAR(100) NOT NULL,
senha_usuario VARCHAR(100) NOT NULL,
telefone_usuario VARCHAR(20),
tipo_usuario ENUM('comum', 'registrado', 'premium', 'parceiro', 'gametester', 'moderador', 'dev', 'admin') NOT NULL DEFAULT 'comum',
criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

/* ADIÇÃO DE USUÁRIOS PARA TESTES */DBINSERT INTO tb_usuarios(nome_usuario, email_usuario, senha_usuario, telefone_usuario, tipo_usuario)
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

CREATE TABLE tb_favoritos (
ID_favorito INT AUTO_INCREMENT PRIMARY KEY,
fk_jogo INT NOT NULL,
fk_usuario INT NOT NULL,
CONSTRAINT fk_usuario FOREIGN KEY (fk_usuario) REFERENCES tb_usuarios(ID_usuario) ON DELETE CASCADE,
CONSTRAINT fk_jogo FOREIGN KEY (fk_jogo) REFERENCES tb_jogos(ID_jogo) ON DELETE CASCADE
);

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

/* Criando uma Tabela de Log de acesso dos usuários.
Essa tabela registra cada tentativa de login (sucesso ou falha) */
CREATE TABLE IF NOT EXISTS tb_log_acesso_usuarios (
  ID_log_acesso_de_usuario INT AUTO_INCREMENT PRIMARY KEY,
  fk_usuario INT,
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
  acoes TEXT NOT NULL,
  rotas_afetadas VARCHAR(255),
  metodo_http VARCHAR(10),
  data_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (fk_usuario) REFERENCES tb_usuarios(ID_usuario) ON DELETE CASCADE
);

/* Criação de índices auxiliares para consultas frequentes em tabelas com FK */
CREATE INDEX idx_email_usuario ON tb_usuarios(email_usuario);
CREATE INDEX idx_jogo_favorito_usuario ON tb_favoritos(fk_usuario, fk_jogo);
