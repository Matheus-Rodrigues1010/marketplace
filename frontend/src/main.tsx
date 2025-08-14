import React from 'react';
import ReactDOM from 'react-dom/client';
// 1. Caminho corrigido para o index.css, assumindo que ele está em src/
import '../src/styles/index.css'; 
// 2. Adicionada a extensão .jsx (ou .tsx se você renomeou o arquivo App)
import App from './App.tsx';

// 3. Adicionado o '!' para satisfazer o TypeScript
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);