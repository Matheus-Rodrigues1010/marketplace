// src/apiConfig.ts

// Usamos 'import.meta.env.DEV' que é a forma moderna do Vite 
// para verificar se estamos em ambiente de desenvolvimento.
const apiUrl: string = import.meta.env.DEV
  ? 'http://localhost:3001/api' // URL para desenvolvimento local
  : 'https://marketplace-api-cd30.onrender.com/'; // <-- SUBSTITUA PELA SUA URL DA VERCEL

export default apiUrl;