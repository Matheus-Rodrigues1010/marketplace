const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const auth = require('../middleware/auth');

// Configura o Multer para usar armazenamento em memória (sem mudanças aqui)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ROTA: POST /api/upload
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo de imagem enviado.' });
    }

    // Convertendo o buffer do arquivo para uma string base64, que é uma forma robusta de fazer o upload
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;

    // Fazendo o upload para o Cloudinary usando a string dataURI
    const result = await cloudinary.uploader.upload(dataURI, {
      resource_type: 'image',
      folder: 'marketplace', // Opcional: salva na pasta 'marketplace' no Cloudinary
    });

    // Retorna a URL segura da imagem que o Cloudinary nos deu
    res.status(201).json({ imageUrl: result.secure_url });

  } catch (err) {
    // Log do erro detalhado no servidor para depuração
    console.error('ERRO NO UPLOAD:', err);
    res.status(500).json({ error: 'Erro interno ao processar o upload da imagem.' });
  }
});

module.exports = router;