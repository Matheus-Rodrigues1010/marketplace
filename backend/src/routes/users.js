const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // 1. Importar a biblioteca JWT
const db = require('../db');

// --- ROTA DE CADASTRO (sem alterações) ---
router.post('/register', async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password) {
    return res.status(400).json({ error: 'Por favor, forneça todos os campos.' });
  }
  try {
    const userExists = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(409).json({ error: 'Este e-mail já está em uso.' });
    }
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const newUser = await db.query(
      'INSERT INTO users (full_name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, email, full_name',
      [fullName, email, passwordHash]
    );
    res.status(201).json({
      message: 'Usuário registrado com sucesso!',
      user: newUser.rows[0],
    });
  } catch (err) {
    console.error('Erro no registro do usuário:', err);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});


// --- NOVA ROTA DE LOGIN ---
// ROTA: POST /api/users/login
// DESCRIÇÃO: Autentica um usuário e retorna um token JWT
router.post('/login', async (req, res) => {
  // 1. Extrair os dados do corpo da requisição
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Por favor, forneça e-mail e senha.' });
  }

  try {
    // 2. Encontrar o usuário no banco de dados pelo e-mail
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    // Se o usuário não for encontrado...
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas.' }); // 401 Unauthorized
    }

    // 3. Comparar a senha fornecida com o hash salvo no banco
    const isPasswordCorrect = await bcrypt.compare(password, user.password_hash);

    // Se a senha estiver incorreta...
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    // 4. Gerar o Token JWT
    // O 'payload' são as informações que queremos guardar dentro do token
    const payload = {
      user: {
        id: user.id,
        email: user.email,
        name: user.full_name
      },
    };

    // Assinamos o token com um segredo (que virá do .env) e definimos uma expiração
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' }, // O token expira em 7 dias
      (err, token) => {
        if (err) throw err;
        // 5. Retornar o token e os dados do usuário para o frontend
        res.json({
          token,
          user: payload.user,
        });
      }
    );

  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});


module.exports = router;