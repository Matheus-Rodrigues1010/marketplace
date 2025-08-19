require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');

// Importação de todas as rotas
const userRoutes = require('./routes/users');
const serviceRoutes = require('./routes/services');
const orderRoutes = require('./routes/orders');
const uploadRoutes = require('./routes/upload');
const paymentRoutes = require('./routes/payments'); // Importa a rota de pagamentos

const app = express();

// Configuração do CORS
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
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Rota de Teste
app.get('/', (req, res) => {
  res.json({ message: 'API do Marketplace está funcionando!' });
});

// Uso de todas as rotas
app.use('/api/users', userRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/payments', paymentRoutes); // Diz ao Express para usar a rota de pagamentos

app.listen(PORT, async () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  try {
    await db.query('SELECT NOW()');
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
  } catch (err) {
    console.error('Falha ao conectar ao banco de dados.');
  }
});