const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const auth = require('../middleware/auth');
const db = require('../db');

// ROTA: POST /api/payments/create-connected-account
// DESCRIÇÃO: Cria uma conta conectada na Stripe para um vendedor
router.post('/create-connected-account', auth, async (req, res) => {
  const userId = req.user.id;

  try {
    const userResult = await db.query('SELECT email, stripe_account_id FROM users WHERE id = $1', [userId]);
    if (userResult.rows.length === 0) {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    if (userResult.rows[0].stripe_account_id) {
        return res.status(400).json({ error: 'Este usuário já é um vendedor.' });
    }

    const account = await stripe.accounts.create({
      type: 'express',
      email: userResult.rows[0].email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });

    await db.query(
      'UPDATE users SET stripe_account_id = $1 WHERE id = $2',
      [account.id, userId]
    );

    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.FRONTEND_URL}/profile`,
      return_url: `${process.env.FRONTEND_URL}/profile`,
      type: 'account_onboarding',
    });
    
    res.json({ url: accountLink.url });

  } catch (err) {
    console.error('Erro ao criar conta na Stripe:', err);
    res.status(500).send('Erro no servidor');
  }
});

// ROTA: GET /api/payments/seller-dashboard-link
// DESCRIÇÃO: Cria um link de login para o dashboard do vendedor
router.get('/seller-dashboard-link', auth, async (req, res) => {
  const userId = req.user.id;
  try {
    const userResult = await db.query('SELECT stripe_account_id FROM users WHERE id = $1', [userId]);
    const stripeAccountId = userResult.rows[0]?.stripe_account_id;

    if (!stripeAccountId) {
      return res.status(400).json({ error: 'Este usuário não é um vendedor.' });
    }
    
    const loginLink = await stripe.accounts.createLoginLink(stripeAccountId);
    
    res.json({ url: loginLink.url });

  } catch (err) {
    console.error("Erro ao criar link para o dashboard:", err.message);
    res.status(500).send('Erro no Servidor');
  }
});

module.exports = router;