import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ServiceProvider } from './contexts/ServiceContext';

// 1. Importar o container de toasts e o CSS da biblioteca
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Profile from './pages/Profile/Profile';
import Services from './pages/Services/services';
import ProductDetails from './pages/ProductDetails/ProductDetails';
import CreateService from './pages/CreateService/CreateService';

export default function App() {
  return (
    <AuthProvider>
      <ServiceProvider>
        <Router>
          <Navbar />
          <main>
            <Routes>
              {/* ... suas rotas ... */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/services" element={<Services />} />
              <Route path="/productdetails/:id" element={<ProductDetails />} />
              <Route path="/create-service" element={<CreateService />} />
              <Route path="/edit-service/:id" element={<CreateService />} />
              <Route path="*" element={<div className="text-center mt-20 text-2xl font-bold">Página não encontrada</div>} />
            </Routes>
          </main>

          {/* 2. Adicionar o ToastContainer no final */}
          {/* Ele vai "flutuar" sobre a aplicação */}
          <ToastContainer
            position="bottom-right" // Posição na tela
            autoClose={4000} // Fecha automaticamente após 4 segundos
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark" // Tema escuro para combinar com nosso site
          />
        </Router>
      </ServiceProvider>
    </AuthProvider>
  );
}