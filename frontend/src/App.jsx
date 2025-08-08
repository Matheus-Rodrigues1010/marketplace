import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar/Navbar';

// Importação das suas páginas
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Profile from './pages/Profile/Profile';
import Services from './pages/Services/services';
import ProductDetails from './pages/ProductDetails/ProductDetails';

// A linha que importava 'App.css' não é mais necessária se você limpou o arquivo
// ou se vai deletá-lo.

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />

        {/* --- MUDANÇA PRINCIPAL AQUI --- */}
        {/* A classe 'App' foi removida da tag 'main' */}
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/services" element={<Services />} />
            <Route path="/productdetails/:id" element={<ProductDetails />} />
            <Route path="*" element={<div className="text-center mt-20 text-2xl font-bold">Página não encontrada</div>} />
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
}