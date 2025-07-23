import {
  getAutenticado,  logout
} from '../utils/api.js';

document.querySelector('#logoutBtn').addEventListener('click', logout);


// Alimentação da Dashboard do painel Administrativo

async function carregarDashboard() {
    try {
        const res = await getAutenticado('/api/admin/dashboard');

        document.querySelector('#totalJogos').textContent = res.totalJogos[0].total;
        document.querySelector('#totalUsuarios').textContent = res.totalUsuarios[0].total;
        document.querySelector('#totalAcessos').textContent = res.totalAcessos[0].total;

        // Gráficos

        // Acessos por Jogo
        new Chart(document.querySelector('#graficoJogos'), {
            type: 'bar',
            data: {
                labels: res.acessosJogo.map(j => j.nome_jogo),
                datasets: [{
                    label: 'Acessos por Jogo',
                    data: res.acessosJogo.map(j => j.total),
                    backgroundColor: '#ffc107'
                }]
            }
        });


        // Horários
        new Chart(document.querySelector('#graficoHoras'), {
            type: 'bar',
            data: {
                labels: res.horarios.map(h => `${h.hora}:00`),
                datasets: [{
                    label: 'Acessos por Hora',
                    data: res.horarios.map(h => h.total),
                    backgroundColor: '#007bff'
                }]
            }
        });

        // Localidades (simulação via faixa IP)
        new Chart(document.querySelector('#graficoLocalidades'), {
            type: 'doughnut',
            data: {
                labels: res.locais.map(l => `IP: ${l.faixa_ip}.*`),
                datasets: [{
                    data: res.locais.map(l => l.total),
                    backgroundColor: ['#17a2b8', '#ffc107', '#28a745', '#dc3545', '#6c757d', '#6610f2']
                }]
            }
        });

        // Dispositivos/Navegadores
        new Chart(document.querySelector('#graficoDispositivos'), {
            type: 'pie',
            data: {
                labels: res.navegadores.map(n => n.navegador),
                datasets: [{
                    data: res.navegadores.map(n => n.total),
                    backgroundColor: ['#f0ad4e', '#5bc0de', '#5cb85c', '#d9534f', '#343a40']
                }]
            }
        });
    } catch (err) {
        console.error('Erro ao carregar dashboard:', err);
        alert('Erro ao carregar estatísticas.');
    }
}

document.querySelector('#logoutBtn').addEventListener('click', logout);

carregarDashboard();

// Variáveis para a Dashboard do painel administrativo
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const autenticarToken = require('../middleware/autenticarToken');
const verificarAdmin = require('../middleware/adminMiddleware');

// Dashboard do painel administrativo
router.get('/dashboard', autenticarToken, verificarAdmin, (req, res) => {
    const consultas = {
        totalJogos: 'SELECT COUNT(*) AS total FROM tb_jogos',
        totalUsuarios: 'SELECT COUNT(*) AS total FROM tb_usuarios',
        totalAcessos: 'SELECT COUNT(*) AS total FROM tb_log_acesso_usuarios',
        horarios: `
      SELECT HOUR(data_hora) AS hora, COUNT(*) AS total
      FROM tb_log_acesso_ususarios
      GROUP BY HOUR(data_hora)
    `,
        locais: `
      SELECT SUBSTRING_INDEX(ip_origem, '.', 1) AS faixa_ip, COUNT(*) AS total
      FROM tb_log_acesso_usuarios
      GROUP BY faixa_ip
        ORDER BY total DESC
      LIMIT 6
    `,
        acessosJogo: `
    `,
        navegadores: `
      SELECT
        CASE
          WHEN navegador LIKE '%Chrome%' THEN 'Chrome'
          WHEN navegador LIKE '%Firefox%' THEN 'Firefox'
          WHEN navegador LIKE '%Safari%' THEN 'Safari'
          WHEN navegador LIKE '%Edg%' THEN 'Edge'
          ELSE 'Outros'
        END AS navegador,
        COUNT(*) AS total
      FROM tb_log_acesso_usuarios
      WHERE navegador IS NOT NULL
      GROUP BY navegador
        ORDER BY total DESC
    `
    };

    const results = {};
    let pendentes = Object.keys(consultas).length;

    Object.entries(consultas).forEach(([key, sql]) => {
        db.query(sql, (err, data) => {
            if (err) return res.status(500).json({ error: `Erro na consulta ${key}` });
            results[key] = data;
            if (--pendentes === 0) res.json(results);
        });
    });
});

module.exports = router;