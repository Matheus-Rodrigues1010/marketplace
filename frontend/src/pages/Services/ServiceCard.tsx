
import React from 'react';
import { Link } from 'react-router-dom';
import { IService } from '../../contexts/ServiceContext';
import styles from './ServiceCard.module.css';

interface ServiceCardProps {
  service: IService;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const { id, title, price, seller, imageUrl } = service;

  return (
    <Link to={`/productdetails/${id}`} className={styles.card}>
      <img 
        className={styles.cardImage} 
        src={imageUrl} 
        alt={title} 
      />
      
      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{title}</h3>
        <p className={styles.cardSeller}>Oferecido por: {seller.name}</p>
        <div className={styles.cardPrice}>
          {/* CORREÇÃO APLICADA AQUI */}
          {/* Garantimos que o preço seja tratado como número e formatado */}
          {Number(price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </div>
      </div>
    </Link>
  );
};

export default ServiceCard;