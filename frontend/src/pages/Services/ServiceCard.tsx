import React from 'react';
import { Link } from 'react-router-dom';
import styles from './ServiceCard.module.css'; // Importe o CSS do card

// Definindo os tipos aqui para o componente ser autossuficiente
interface IService {
  id: number;
  title: string;
  price: number;
  seller: {
    name: string;
  };
  imageUrl: string;
}

interface ServiceCardProps {
  service: IService;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const { id, title, price, seller, imageUrl } = service;

  return (
    <Link to={`/productdetails/${id}`} className={styles.card}>
      <img className={styles.cardImage} src={imageUrl} alt={title} />
      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{title}</h3>
        <p className={styles.cardSeller}>Oferecido por: {seller.name}</p>
        <div className={styles.cardPrice}>
          {price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </div>
      </div>
    </Link>
  );
};

export default ServiceCard;