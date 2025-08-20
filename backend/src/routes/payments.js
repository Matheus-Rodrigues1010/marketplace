const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const auth = require('../middleware/auth');
const db = require('../db');

// Rota de Onboarding de Vendedor (sem alterações)
router.post('/create-connected-account', auth, async (req, res) => { /* ... seu código existente ... */ });

// Rota de Dashboard Link (sem alterações)
router.get('/seller-dashboard-link', auth, async (req, res) => { /* ... seu código existente ... */ });

// --- NOVA ROTA: Criar uma Sessão de Checkout da Stripe ---
// ROTA: POST /api/payments/create-checkout-session
router.post('/create-checkout-session', auth, async (req, res) => {
  const { serviceId } = req.body;
  const buyerId = req.user.id;

  try {
    const serviceResult = await db.query(
      `SELECT s.price, s.title, u.stripe_account_id 
       FROM services s 
       JOIN users u ON s.seller_id = u.id 
       WHERE s.id = $1`, 
      [serviceId]
    );
    
    if (serviceResult.rows.length === 0) {
      return res.status(404).json({ error: 'Serviço não encontrado.' });
    }
    const service = serviceResult.rows[0];
    const sellerStripeAccountId = service.stripe_account_id;

    if (!sellerStripeAccountId) {
      return res.status(400).json({ error: 'Este vendedor ainda não está apto a receber pagamentos.' });
    }

    // Cria a sessão de checkout na Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'brl', // Moeda brasileira
          product_data: {
            name: service.title,
          },
          unit_amount: Math.round(service.price * 100), // Preço em centavos
        },
        quantity: 1,
      }],
      mode: 'payment',
      // Define a comissão da sua plataforma (ex: 10%) e para quem o resto vai
      payment_intent_data: {
        application_fee_amount: Math.round(service.price * 100 * 0.10), // Sua comissão de 10%
        transfer_data: {
          destination: sellerStripeAccountId, // O ID da conta do vendedor
        },
      },
      // URLs para redirecionar o usuário após o checkout
      success_url: `${process.env.FRONTEND_URL}/my-orders?payment_success=true`,
      cancel_url: `${process.env.FRONTEND_URL}/services`,
    });
    
    // Retorna o ID da sessão para o frontend
    res.json({ id: session.id });

  } catch (err) {
    console.error('Erro ao criar sessão de checkout:', err);
    res.status(500).send('Erro no servidor');
  }
});

module.exports = router;