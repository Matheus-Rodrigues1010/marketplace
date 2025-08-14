// backend/src/middleware/auth.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function (req, res, next) {
  // 1. Pegar o token do cabeçalho da requisição
  const token = req.header('x-auth-token');

  // 2. Verificar se o token não existe
  if (!token) {
    return res.status(401).json({ msg: 'Nenhum token, autorização negada.' });
  }

  // 3. Verificar se o token é válido
  try {
    // Decodifica o token usando o mesmo segredo
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Adiciona o payload do usuário (que guardamos no token) ao objeto da requisição
    req.user = decoded.user;
    
    // Chama a próxima função (a lógica da rota)
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token inválido.' });
  }
};