import React from 'react';
import { Link } from 'react-router-dom';
// Importar a interface IService é uma boa prática para garantir a consistência
import { IService } from '../../contexts/ServiceContext';
import styles from './ServiceCard.module.css';

interface ServiceCardProps {
  service: IService;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  // Desestruturamos as propriedades para garantir que estamos usando os nomes corretos
  const { id, title, price, seller, imageUrl } = service;

  return (
    <Link to={`/productdetails/${id}`} className={styles.card}>
      {/* A LINHA MAIS IMPORTANTE: Verifique se a tag img está exatamente assim */}
      <img 
        className={styles.cardImage} 
        src={imageUrl} 
        alt={title} 
        // Adicionar um tratamento de erro de imagem pode nos dar pistas
        onError={(e) => { 
          console.error(`Erro ao carregar imagem: ${imageUrl}`);
          // Opcional: substituir por uma imagem padrão em caso de erro
          // (e.currentTarget as HTMLImageElement).src = "https://via.placeholder.com/500"; 
        }}
      />
      
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