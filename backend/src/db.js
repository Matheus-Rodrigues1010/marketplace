// backend/src/db.js

const { Pool } = require('pg');
require('dotenv').config();

// Criamos uma nova "pool" de conexões.
// Uma pool é mais eficiente do que criar uma nova conexão para cada requisição.
// Ela pega a DATABASE_URL diretamente das nossas variáveis de ambiente.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Exportamos um objeto com um método 'query'.
// Isso nos permite usar a pool em outros arquivos de forma limpa.
// Ex: db.query('SELECT * FROM users')
module.exports = {
  query: (text, params) => pool.query(text, params),
};