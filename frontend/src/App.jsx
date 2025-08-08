import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Profile from './pages/Profile/Profile';
import Services from './pages/Services/services';
import ProductDetails from './pages/ProductDetails/ProductDetails';

export default function App() {
  return (
    <Router>
      <div className="App">
        {/* Defina as rotas do aplicativo */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/services" element={<Services />} />
          <Route path="/productdetails/:id" element={<ProductDetails />} />
          {/* Caso o usuário acesse uma rota inexistente */}
          <Route path="*" element={<div className="text-center mt-20 text-2xl font-bold">Página não encontrada</div>} />
        </Routes>
      </div>
    </Router>
  );
}
