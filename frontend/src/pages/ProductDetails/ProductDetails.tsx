import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ServiceContext } from '../../contexts/ServiceContext';
// 1. Importar os estilos
import styles from './ProductDetails.module.css';

// A interface IService pode ser movida para um arquivo compartilhado no futuro
interface IService {
  id: number;
  title: string;
  description: string;
  price: number;
  seller: {
    name: string;
  };
  imageUrl: string;
}

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { services } = useContext(ServiceContext);

  const [service, setService] = useState<IService | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Lógica para encontrar o serviço (sem alterações)
    const foundService = services.find(s => s.id === Number(id));

    // Usamos um pequeno timeout para dar tempo da lista do contexto carregar
    setTimeout(() => {
        if (foundService) {
            setService(foundService);
        } else {
            setError("Oops! Não encontramos o serviço que você está procurando.");
        }
        setIsLoading(false);
    }, 50); // Delay mínimo
    
  }, [id, services]);

  const handleHireClick = () => {
    alert(`Preparando agendamento para: ${service?.title}`);
  };

  // 2. Aplicar as classes de estilo para os estados de carregamento e erro
  if (isLoading) {
    return <div className={styles.feedbackScreen}>Carregando detalhes do serviço...</div>;
  }

  if (error) {
    return (
      <div className={styles.feedbackScreen}>
        <p className={styles.errorText}>{error}</p>
        <Link to="/services" className={styles.backLink}>
          Voltar para a lista de serviços
        </Link>
      </div>
    );
  }

  if (!service) {
    // Este caso agora é menos provável, mas é uma boa prática mantê-lo
    return <div className={styles.feedbackScreen}>Serviço não encontrado.</div>;
  }

  // 3. Aplicar as classes de estilo no JSX principal
  return (
    <div className={styles.pageContainer}>
      <div className={styles.detailsCard}>
        <div className={styles.imageContainer}>
          <img src={service.imageUrl} alt={service.title} />
        </div>
        <div className={styles.infoContainer}>
          <h1 className={styles.title}>{service.title}</h1>
          <p className={styles.seller}>Oferecido por: {service.seller.name}</p>
          <p className={styles.description}>{service.description}</p>
          <div className={styles.price}>
            {service.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </div>
          <button onClick={handleHireClick} className={styles.hireButton}>
            Contratar Serviço
          </button>
        </div>
      </div>

      <div className={styles.reviewsContainer}>
        <h2 className={styles.reviewsTitle}>Avaliações dos Clientes</h2>
        <div className={styles.reviewItem}>
          <h3 className={styles.reviewAuthor}>Cliente 1</h3>
          <p className={styles.reviewText}>Ótimo! Atendeu todas as minhas expectativas.</p>
        </div>
        <div className={styles.reviewItem}>
          <h3 className={styles.reviewAuthor}>Cliente 2</h3>
          <p className={styles.reviewText}>Excelente qualidade. Recomendo a todos!</p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;