import React from 'react';
import { Link } from 'react-router-dom';
// 1. Importar o arquivo de estilos
import styles from './ServiceCard.module.css'; 

// Importar a interface de um local compartilhado seria o ideal, mas vamos defini-la aqui para garantir.
import { IService } from '../../contexts/ServiceContext';

interface ServiceCardProps {
  service: IService;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const { id, title, price, seller, imageUrl } = service;

  // 2. Aplicar as classes de estilo no JSX
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