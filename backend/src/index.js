require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');

const userRoutes = require('./routes/users');
const serviceRoutes = require('./routes/services');
const orderRoutes = require('./routes/orders');

const app = express();

// --- CONFIGURAÇÃO DO CORS ---
// Lista de domínios que têm permissão para acessar sua API
const whitelist = [
  'http://localhost:5173', // Seu frontend em desenvolvimento
  'https://marketplace-ashen-delta.vercel.app' // SEU FRONTEND EM PRODUÇÃO (SUBSTITUA SE FOR DIFERENTE)
];

const corsOptions = {
  origin: function (origin, callback) {
    // Permite requisições sem 'origin' (como apps mobile ou Postman)
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Não permitido pelo CORS'));
    }
  }
};

app.use(cors(corsOptions)); // Usa as opções de CORS configuradas
// --- FIM DA CONFIGURAÇÃO DO CORS ---


app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json({ message: 'API do Marketplace está funcionando!' });
});

app.use('/api/users', userRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/orders', orderRoutes);

app.listen(PORT, async () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  try {
    await db.query('SELECT NOW()');
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
  } catch (err) {
    console.error('Falha ao conectar ao banco de dados.');
  }
});