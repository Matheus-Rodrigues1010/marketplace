/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html", // Adiciona o arquivo HTML raiz do Vite
    "./src/**/*.{js,ts,jsx,tsx}", // Escaneia todos os arquivos React na pasta src
  ],
  theme: {
    extend: {}, // Aqui você pode adicionar customizações no futuro
  },
  plugins: [],
};
