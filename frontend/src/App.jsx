import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ServiceProvider } from './contexts/ServiceContext';
import { OrderProvider } from './contexts/OrderContext';

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
// 1. Importar a nova página
import MyOrders from './pages/MyOrders/MyOrders';

export default function App() {
  return (
    <AuthProvider>
      <ServiceProvider>
        <OrderProvider>
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
                
                {/* 2. Adicionar a nova rota */}
                <Route path="/my-orders" element={<MyOrders />} />

                <Route path="*" element={<div className="text-center mt-20 text-2xl font-bold">Página não encontrada</div>} />
              </Routes>
            </main>
            <ToastContainer theme="dark" position="bottom-right" autoClose={4000} />
          </Router>
        </OrderProvider>
      </ServiceProvider>
    </AuthProvider>
  );
}