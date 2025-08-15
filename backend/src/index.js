require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');

// Importar as rotas existentes
const userRoutes = require('./routes/users');
const serviceRoutes = require('./routes/services');
const orderRoutes = require('./routes/orders');
// 1. Importar a nova rota de upload
const uploadRoutes = require('./routes/upload');

const app = express();

// --- CONFIGURAÇÃO DO CORS ---
const whitelist = [
  'http://localhost:5173',
  'https://marketplace-ashen-delta.vercel.app' // Verifique se esta é sua URL correta
];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Não permitido pelo CORS'));
    }
  }
};
app.use(cors(corsOptions));
// --- FIM DA CONFIGURAÇÃO DO CORS ---

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json({ message: 'API do Marketplace está funcionando!' });
});

// Usar as rotas
app.use('/api/users', userRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/orders', orderRoutes);
// 2. Usar a nova rota de upload
app.use('/api/upload', uploadRoutes);

app.listen(PORT, async () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  try {
    await db.query('SELECT NOW()');
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
  } catch (err) {
    console.error('Falha ao conectar ao banco de dados.');
  }
});