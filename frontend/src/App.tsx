import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ServiceProvider } from './contexts/ServiceContext';
import { OrderProvider } from './contexts/OrderContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Profile from './pages/Profile/Profile';
import Services from './pages/Services/Services';
import ProductDetails from './pages/ProductDetails/ProductDetails';
import CreateService from './pages/CreateService/CreateService';
import MyOrders from './pages/MyOrders/MyOrders';

// Carrega a Stripe com sua chave publicável do .env.local
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function App() {
  return (
    <AuthProvider>
      <ServiceProvider>
        <OrderProvider>
          <Elements stripe={stripePromise}>
            <Router>
              <Navbar />
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/productdetails/:id" element={<ProductDetails />} />
                  <Route path="/create-service" element={<CreateService />} />
                  <Route path="/edit-service/:id" element={<CreateService />} />
                  <Route path="/my-orders" element={<MyOrders />} />
                  <Route path="*" element={<div className="text-center mt-20 text-2xl font-bold">Página não encontrada</div>} />
                </Routes>
              </main>
              <ToastContainer theme="dark" position="bottom-right" autoClose={4000} />
            </Router>
          </Elements>
        </OrderProvider>
      </ServiceProvider>
    </AuthProvider>
  );
}