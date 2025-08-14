require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');

// Importar as rotas
const userRoutes = require('./routes/users');
const serviceRoutes = require('./routes/services');
const orderRoutes = require('./routes/orders'); // 1. Importar as rotas de pedidos

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Rota de teste
app.get('/', (req, res) => {
  res.json({ message: 'API do Marketplace está funcionando!' });
});

// Usar as rotas
app.use('/api/users', userRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/orders', orderRoutes); // 2. Usar as rotas de pedidos

app.listen(PORT, async () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  try {
    await db.query('SELECT NOW()');
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
  } catch (err) {
    console.error('Falha ao conectar ao banco de dados.');
  }
});