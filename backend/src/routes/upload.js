const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const auth = require('../middleware/auth');

// LOG DE DEPURAÇÃO:
// Este log será impresso nos logs do Render toda vez que uma requisição chegar a esta rota.
// Ele nos dirá se a variável de ambiente está sendo lida corretamente pelo processo.
console.log(
  'Verificando variáveis de ambiente no arquivo upload.js:', 
  {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? 'Encontrada' : 'NÃO ENCONTRADA',
    api_key: process.env.CLOUDINARY_API_KEY ? 'Encontrada' : 'NÃO ENCONTRADA',
    api_secret: process.env.CLOUDINARY_API_SECRET ? 'Encontrada' : 'NÃO ENCONTRADA'
  }
);


// Configura o Multer para usar armazenamento em memória
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ROTA: POST /api/upload
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo de imagem enviado.' });
    }

    // Convertendo o buffer do arquivo para uma string base64
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;

    // Fazendo o upload para o Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      resource_type: 'image',
      folder: 'marketplace',
    });

    // Retorna a URL segura da imagem
    res.status(201).json({ imageUrl: result.secure_url });

  } catch (err) {
    // Log do erro detalhado no servidor para depuração
    console.error('ERRO NO UPLOAD:', err);
    res.status(500).json({ error: 'Erro interno ao processar o upload da imagem.' });
  }
});

module.exports = router;