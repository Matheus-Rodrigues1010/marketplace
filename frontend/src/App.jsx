import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
// 1. Importe o novo ServiceProvider
import { ServiceProvider } from './contexts/ServiceContext';

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
      {/* 2. Envolva o Router com o ServiceProvider */}
      <ServiceProvider>
        <Router>
          <Navbar />
          <main>
            <Routes>
              {/* Nenhuma mudança nas rotas */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/services" element={<Services />} />
              <Route path="/productdetails/:id" element={<ProductDetails />} />
              <Route path="/create-service" element={<CreateService />} />
              <Route path="*" element={<div className="text-center mt-20 text-2xl font-bold">Página não encontrada</div>} />
            </Routes>
          </main>
        </Router>
      </ServiceProvider>
    </AuthProvider>
  );
}