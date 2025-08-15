const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// --- ROTA PROTEGIDA: Criar um novo pedido ---
// POST /api/orders
router.post('/', auth, async (req, res) => {
  const { serviceId } = req.body;
  const buyerId = req.user.id;

  if (!serviceId) {
    return res.status(400).json({ error: 'O ID do serviço é obrigatório.' });
  }

  try {
    const serviceResult = await db.query('SELECT * FROM services WHERE id = $1', [serviceId]);
    const service = serviceResult.rows[0];

    if (!service) {
      return res.status(404).json({ error: 'Serviço não encontrado.' });
    }

    if (service.seller_id === buyerId) {
      return res.status(403).json({ error: 'Você não pode comprar seu próprio serviço.' });
    }

    const { rows } = await db.query(
      'INSERT INTO orders (service_id, buyer_id, price_at_purchase, order_status) VALUES ($1, $2, $3, $4) RETURNING *',
      [serviceId, buyerId, service.price, 'completed']
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no Servidor');
  }
});


// --- ROTA PROTEGIDA: Listar pedidos de um COMPRADOR ---
// GET /api/orders/my-orders
router.get('/my-orders', auth, async (req, res) => {
  const buyerId = req.user.id;

  try {
    const { rows } = await db.query(
      `SELECT
         o.id AS order_id, o.created_at AS order_date, o.price_at_purchase,
         s.title AS service_title, s.image_url AS service_image_url,
         u.full_name AS seller_name
       FROM orders o
       JOIN services s ON o.service_id = s.id
       JOIN users u ON s.seller_id = u.id
       WHERE o.buyer_id = $1
       ORDER BY o.created_at DESC`,
      [buyerId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no Servidor');
  }
});


// --- NOVA ROTA PROTEGIDA: Listar vendas de um VENDEDOR ---
// ROTA: GET /api/orders/my-sales
router.get('/my-sales', auth, async (req, res) => {
    const sellerId = req.user.id; // ID do vendedor logado vem do token
  
    try {
      // Consulta SQL que une as tabelas orders, services, e users (para os dados do comprador)
      const { rows } = await db.query(
        `SELECT
           o.id AS order_id,
           o.created_at AS order_date,
           o.price_at_purchase,
           s.title AS service_title,
           buyer.full_name AS buyer_name,
           buyer.email AS buyer_email
         FROM orders o
         JOIN services s ON o.service_id = s.id
         JOIN users seller ON s.seller_id = seller.id
         JOIN users buyer ON o.buyer_id = buyer.id
         WHERE s.seller_id = $1
         ORDER BY o.created_at DESC`,
        [sellerId]
      );
  
      res.json(rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Erro no Servidor');
    }
  });


module.exports = router;