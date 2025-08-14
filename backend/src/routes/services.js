const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// --- ROTA PÚBLICA: Listar todos os serviços ---
// GET /api/services
router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM services WHERE is_active = true ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no Servidor');
  }
});

// --- ROTA PROTEGIDA: Criar um novo serviço ---
// POST /api/services
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
    console.error(err.message);
    res.status(500).send('Erro no Servidor');
  }
});

// --- NOVA ROTA PROTEGIDA: Atualizar um serviço ---
// ROTA: PUT /api/services/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, price, category, imageUrl } = req.body;
    const serviceId = req.params.id;
    const userId = req.user.id;

    // 1. Verificar se o serviço existe e se pertence ao usuário logado
    const service = await db.query('SELECT * FROM services WHERE id = $1', [serviceId]);
    if (service.rows.length === 0) {
      return res.status(404).json({ msg: 'Serviço não encontrado.' });
    }
    if (service.rows[0].seller_id !== userId) {
      return res.status(401).json({ msg: 'Não autorizado. Você não é o dono deste serviço.' });
    }

    // 2. Atualizar o serviço no banco de dados
    const { rows } = await db.query(
      `UPDATE services 
       SET title = $1, description = $2, price = $3, category = $4, image_url = $5, updated_at = NOW() 
       WHERE id = $6 RETURNING *`,
      [title, description, price, category, imageUrl, serviceId]
    );
    
    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no Servidor');
  }
});


// --- NOVA ROTA PROTEGIDA: Excluir um serviço ---
// ROTA: DELETE /api/services/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const serviceId = req.params.id;
    const userId = req.user.id;

    // 1. Verificar se o serviço existe e se pertence ao usuário logado
    const service = await db.query('SELECT * FROM services WHERE id = $1', [serviceId]);
    if (service.rows.length === 0) {
      return res.status(404).json({ msg: 'Serviço não encontrado.' });
    }
    if (service.rows[0].seller_id !== userId) {
      return res.status(401).json({ msg: 'Não autorizado. Você não é o dono deste serviço.' });
    }
    
    // 2. Excluir o serviço do banco de dados
    await db.query('DELETE FROM services WHERE id = $1', [serviceId]);

    res.json({ msg: 'Serviço excluído com sucesso.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no Servidor');
  }
});

module.exports = router;