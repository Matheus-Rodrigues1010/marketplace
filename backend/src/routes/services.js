const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// --- ROTA PÚBLICA: Listar todos os serviços (COM NOME DO VENDEDOR) ---
// ROTA: GET /api/services
router.get('/', async (req, res) => {
  try {
    // ATUALIZAÇÃO: Adicionamos um JOIN com a tabela 'users' para buscar o nome do vendedor
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
    console.error(err.message);
    res.status(500).send('Erro no Servidor');
  }
});

// --- ROTA PROTEGIDA: Criar um novo serviço ---
// ROTA: POST /api/services
router.post('/', auth, async (req, res) => {
  // A chave no frontend é 'imageUrl', mas no banco é 'image_url'
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

// --- ROTA PROTEGIDA: Atualizar um serviço ---
// ROTA: PUT /api/services/:id
// ROTA: PUT /api/services/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, price, category, imageUrl } = req.body;
    const serviceId = req.params.id;
    const userId = req.user.id;

    // 1. PRIMEIRO, busca o serviço no banco de dados para ter suas informações.
    const serviceResult = await db.query('SELECT * FROM services WHERE id = $1', [serviceId]);

    // 2. AGORA, verifica se o serviço foi encontrado.
    if (serviceResult.rows.length === 0) {
      return res.status(404).json({ msg: 'Serviço não encontrado.' });
    }

    // 3. E ENTÃO, verifica se o usuário logado é o dono do serviço.
    // Usamos parseInt para garantir que estamos comparando dois números.
    if (serviceResult.rows[0].seller_id !== parseInt(userId, 10)) {
      return res.status(401).json({ msg: 'Não autorizado. Você não é o dono deste serviço.' });
    }

    // 4. Se tudo estiver certo, atualiza o serviço no banco de dados.
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


router.get('/:id', async (req, res) => {
  try {
    const serviceId = req.params.id;
    // Fazemos o JOIN para também pegar o nome do vendedor
    const { rows } = await db.query(
      `SELECT 
         s.id, s.title, s.description, s.price, s.category, s.image_url, s.created_at,
         u.full_name AS seller_name 
       FROM services s
       JOIN users u ON s.seller_id = u.id
       WHERE s.id = $1 AND s.is_active = true`,
      [serviceId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ msg: 'Serviço não encontrado.' });
    }

    res.json(rows[0]); // Retorna o único serviço encontrado
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no Servidor');
  }
});


// --- ROTA PROTEGIDA: Excluir um serviço ---
// ROTA: DELETE /api/services/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const serviceId = req.params.id;
    const userId = req.user.id;

    const service = await db.query('SELECT * FROM services WHERE id = $1', [serviceId]);
    if (service.rows.length === 0) {
      return res.status(404).json({ msg: 'Serviço não encontrado.' });
    }
    if (service.rows[0].seller_id !== userId) {
      return res.status(401).json({ msg: 'Não autorizado. Você não é o dono deste serviço.' });
    }
    
    await db.query('DELETE FROM services WHERE id = $1', [serviceId]);

    res.json({ msg: 'Serviço excluído com sucesso.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no Servidor');
  }
});

module.exports = router;