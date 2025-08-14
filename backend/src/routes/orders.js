const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// --- ROTA PROTEGIDA: Criar um novo pedido ---
// ROTA: POST /api/orders
router.post('/', auth, async (req, res) => {
  const { serviceId } = req.body;
  const buyerId = req.user.id; // ID do comprador vem do token

  if (!serviceId) {
    return res.status(400).json({ error: 'O ID do serviço é obrigatório.' });
  }

  try {
    // 1. Buscar o serviço no banco para verificar se ele existe e pegar o preço
    const serviceResult = await db.query('SELECT * FROM services WHERE id = $1', [serviceId]);
    const service = serviceResult.rows[0];

    if (!service) {
      return res.status(404).json({ error: 'Serviço não encontrado.' });
    }

    // 2. Impedir que o vendedor compre o próprio serviço
    if (service.seller_id === buyerId) {
      return res.status(403).json({ error: 'Você não pode comprar seu próprio serviço.' });
    }

    // 3. Inserir o novo pedido no banco de dados
    const { rows } = await db.query(
      'INSERT INTO orders (service_id, buyer_id, price_at_purchase, order_status) VALUES ($1, $2, $3, $4) RETURNING *',
      [serviceId, buyerId, service.price, 'completed'] // Salva o preço atual do serviço
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no Servidor');
  }
});


// --- ROTA PROTEGIDA: Listar pedidos de um usuário ---
// ROTA: GET /api/orders/my-orders
router.get('/my-orders', auth, async (req, res) => {
  const buyerId = req.user.id; // ID do usuário logado

  try {
    // Vamos fazer um JOIN para buscar os dados do pedido E os dados do serviço relacionado
    const { rows } = await db.query(
      `SELECT
         o.id AS order_id,
         o.created_at AS order_date,
         o.price_at_purchase,
         s.title AS service_title,
         s.image_url AS service_image_url,
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


module.exports = router;