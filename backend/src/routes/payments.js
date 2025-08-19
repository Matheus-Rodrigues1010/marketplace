// backend/src/routes/payments.js
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
    // Cria uma conta "Express" na Stripe. É a mais recomendada para marketplaces.
    const account = await stripe.accounts.create({
      type: 'express',
      email: req.user.email, // Pré-preenche o e-mail
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });

    // Salva o ID da conta Stripe no nosso banco de dados, associado ao usuário
    await db.query(
      'UPDATE users SET stripe_account_id = $1 WHERE id = $2',
      [account.id, userId]
    );

    // Cria um link de onboarding para o usuário completar o cadastro
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.FRONTEND_URL}/profile`, // Para onde voltar se o link expirar
      return_url: `${process.env.FRONTEND_URL}/profile`, // Para onde voltar após completar
      type: 'account_onboarding',
    });
    
    // Retorna a URL do link de onboarding para o frontend
    res.json({ url: accountLink.url });

  } catch (err) {
    console.error('Erro ao criar conta na Stripe:', err);
    res.status(500).send('Erro no servidor');
  }
});

module.exports = router;