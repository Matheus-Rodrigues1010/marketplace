// backend/src/routes/upload.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const auth = require('../middleware/auth');

// Configura o Multer para armazenar o arquivo em memória
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ROTA: POST /api/upload
// Recebe um arquivo de imagem e o envia para o Cloudinary
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo de imagem enviado.' });
    }

    // O Multer nos dá o arquivo como um buffer. O Cloudinary sabe como lidar com isso.
    // Usamos um "stream" para enviar o arquivo para o Cloudinary.
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: 'image', folder: 'marketplace' }, // Salva na pasta 'marketplace'
      (error, result) => {
        if (error) {
          console.error('Erro no upload para o Cloudinary:', error);
          return res.status(500).json({ error: 'Erro ao fazer upload da imagem.' });
        }
        // Retorna a URL segura da imagem que o Cloudinary nos deu
        res.status(201).json({ imageUrl: result.secure_url });
      }
    );

    // Envia o buffer do arquivo para o stream
    uploadStream.end(req.file.buffer);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no Servidor');
  }
});

module.exports = router;