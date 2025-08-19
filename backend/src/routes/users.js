const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const auth = require('../middleware/auth');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// ROTA: POST /api/users/register
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

// ROTA: POST /api/users/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Por favor, forneça e-mail e senha.' });
  }
  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }
    const payload = {
      user: {
        id: user.id,
        email: user.email,
        name: user.full_name,
        avatar_url: user.avatar_url,
        stripe_account_id: user.stripe_account_id
      },
    };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
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

// ROTA: GET /api/users/me

router.get('/me', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { rows } = await db.query(/* ... sua query existente ... */);
    if (rows.length === 0) { /* ... */ }

    let stripeAccountStatus = null;
    // Se o usuário tem uma conta Stripe, buscamos o status dela
    if (rows[0].stripe_account_id) {
      const account = await stripe.accounts.retrieve(rows[0].stripe_account_id);
      stripeAccountStatus = {
        details_submitted: account.details_submitted, // O usuário já enviou os dados?
        payouts_enabled: account.payouts_enabled,   // Ele pode receber saques?
      };
    }
    
    const userPayload = {
        id: rows[0].id,
        name: rows[0].full_name,
        email: rows[0].email,
        avatar_url: rows[0].avatar_url,
        stripe_account_id: rows[0].stripe_account_id,
        stripe_account_status: stripeAccountStatus // <-- NOVO DADO
    }
    res.json(userPayload);
  } catch (err) { /* ... */ }
});


// ROTA: PUT /api/users/profile
router.put('/profile', auth, async (req, res) => {
  const userId = req.user.id;
  const { fullName, avatarUrl } = req.body;
  if (!fullName && !avatarUrl) {
    return res.status(400).json({ error: 'Forneça um nome ou uma URL de avatar para atualizar.' });
  }
  try {
    const currentUser = await db.query('SELECT full_name, avatar_url FROM users WHERE id = $1', [userId]);
    if(currentUser.rows.length === 0) {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    const newFullName = fullName || currentUser.rows[0].full_name;
    const newAvatarUrl = avatarUrl || currentUser.rows[0].avatar_url;
    const { rows } = await db.query(
      'UPDATE users SET full_name = $1, avatar_url = $2 WHERE id = $3 RETURNING id, email, full_name, avatar_url, stripe_account_id',
      [newFullName, newAvatarUrl, userId]
    );
    const updatedUserPayload = {
      id: rows[0].id,
      name: rows[0].full_name,
      email: rows[0].email,
      avatar_url: rows[0].avatar_url,
      stripe_account_id: rows[0].stripe_account_id
    };
    res.json(updatedUserPayload);
  } catch (err) {
    console.error("Erro ao atualizar perfil:", err.message);
    res.status(500).send('Erro no Servidor');
  }
});

module.exports = router;