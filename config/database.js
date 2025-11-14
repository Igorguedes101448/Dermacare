const mysql = require('mysql2/promise');
require('dotenv').config();

// Pool de conexões para melhor performance
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'clinica_dermacare',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Testar conexão
pool.getConnection()
    .then(connection => {
        console.log('✅ Base de dados MySQL conectada com sucesso!');
        connection.release();
    })
    .catch(err => {
        console.error('❌ Erro ao conectar à base de dados:', err.message);
    });

module.exports = pool;
