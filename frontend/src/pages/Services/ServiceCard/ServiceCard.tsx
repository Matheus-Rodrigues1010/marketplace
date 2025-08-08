// src/components/ServiceCard.tsx

import React from 'react';
import { Link } from 'react-router-dom';

// Reutilizamos a mesma interface para garantir consistência
interface IService {
  id: number;
  title: string;
  price: number;
  seller: {
    name: string;
  };
  imageUrl: string;
}

// Definimos o tipo das props que o componente espera receber
interface ServiceCardProps {
  service: IService;
}

// Tipamos as props do componente
const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const { id, title, price, seller, imageUrl } = service;

  return (
    <Link to={`/productdetails/${id}`} className="block bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <img className="w-full h-48 object-cover" src={imageUrl} alt={title} />
      
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-2">Oferecido por: {seller.name}</p>
        <div className="text-xl font-bold text-blue-600">
          {price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </div>
      </div>
    </Link>
  );
};

export default ServiceCard;