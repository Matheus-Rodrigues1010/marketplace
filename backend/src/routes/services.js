const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// ROTA: GET /api/services
// DESCRIÇÃO: Lista todos os serviços ativos, incluindo o nome do vendedor.
router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT 
         s.id, s.title, s.description, s.price, s.category, s.image_url, s.created_at, s.seller_id,
         u.full_name AS seller_name 
       FROM services s
       JOIN users u ON s.seller_id = u.id
       WHERE s.is_active = true 
       ORDER BY s.created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error("Erro ao buscar serviços:", err.message);
    res.status(500).send('Erro no Servidor');
  }
});

// ROTA: GET /api/services/:id
// DESCRIÇÃO: Busca um serviço específico pelo seu ID.
router.get('/:id', async (req, res) => {
  try {
    const serviceId = req.params.id;
    const { rows } = await db.query(
      `SELECT 
         s.id, s.title, s.description, s.price, s.category, s.image_url, s.created_at, s.seller_id,
         u.full_name AS seller_name 
       FROM services s
       JOIN users u ON s.seller_id = u.id
       WHERE s.id = $1 AND s.is_active = true`,
      [serviceId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ msg: 'Serviço não encontrado.' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Erro ao buscar detalhe do serviço:", err.message);
    res.status(500).send('Erro no Servidor');
  }
});

// ROTA: POST /api/services
// DESCRIÇÃO: Cria um novo serviço (requer autenticação).
router.post('/', auth, async (req, res) => {
  const { title, description, price, category, imageUrl } = req.body;
  const sellerId = req.user.id;
  if (!title || !description || !price || !category || !imageUrl) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }
  try {
    const { rows } = await db.query(
      'INSERT INTO services (seller_id, title, description, price, category, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [sellerId, title, description, price, category, imageUrl]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("Erro ao criar serviço:", err.message);
    res.status(500).send('Erro no Servidor');
  }
});

// ROTA: PUT /api/services/:id
// DESCRIÇÃO: Atualiza um serviço existente (requer autenticação e propriedade).
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, price, category, imageUrl } = req.body;
    const serviceId = req.params.id;
    const userId = req.user.id;

    const serviceResult = await db.query('SELECT seller_id FROM services WHERE id = $1', [serviceId]);

    if (serviceResult.rows.length === 0) {
      return res.status(404).json({ msg: 'Serviço não encontrado.' });
    }

    // CORREÇÃO: Compara os valores após convertê-los para o mesmo tipo para garantir consistência.
    if (String(serviceResult.rows[0].seller_id) !== String(userId)) {
      return res.status(401).json({ msg: 'Não autorizado. Você não é o dono deste serviço.' });
    }

    const { rows } = await db.query(
      `UPDATE services SET title = $1, description = $2, price = $3, category = $4, image_url = $5, updated_at = NOW() WHERE id = $6 RETURNING *`,
      [title, description, price, category, imageUrl, serviceId]
    );
    
    res.json(rows[0]);
  } catch (err) {
    console.error("Erro ao atualizar serviço:", err.message);
    res.status(500).send('Erro no Servidor');
  }
});

// ROTA: DELETE /api/services/:id
// DESCRIÇÃO: Exclui um serviço (requer autenticação e propriedade).
router.delete('/:id', auth, async (req, res) => {
  try {
    const serviceId = req.params.id;
    const userId = req.user.id;

    const serviceResult = await db.query('SELECT seller_id FROM services WHERE id = $1', [serviceId]);

    if (serviceResult.rows.length === 0) {
      return res.status(404).json({ msg: 'Serviço não encontrado.' });
    }

    // CORREÇÃO: Compara os valores após convertê-los para o mesmo tipo.
    if (String(serviceResult.rows[0].seller_id) !== String(userId)) {
      return res.status(401).json({ msg: 'Não autorizado. Você não é o dono deste serviço.' });
    }
    
    await db.query('DELETE FROM services WHERE id = $1', [serviceId]);
    res.json({ msg: 'Serviço excluído com sucesso.' });
  } catch (err) {
    console.error("Erro ao excluir serviço:", err.message);
    res.status(500).send('Erro no Servidor');
  }
});

module.exports = router;