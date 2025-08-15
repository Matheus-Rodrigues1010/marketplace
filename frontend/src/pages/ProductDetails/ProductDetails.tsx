import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ServiceContext } from '../../contexts/ServiceContext';
import { AuthContext } from '../../contexts/AuthContext';
import { OrderContext } from '../../contexts/OrderContext';
import { toast } from 'react-toastify';
import styles from './ProductDetails.module.css';
import { IService } from '../../contexts/ServiceContext';

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Pegamos a lista de serviços E o estado de carregamento do ServiceContext
  const { services, loading: servicesLoading } = useContext(ServiceContext);
  const { user } = useContext(AuthContext);
  const { addOrder } = useContext(OrderContext);

  const [service, setService] = useState<IService | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // SÓ EXECUTE a lógica de busca SE o carregamento inicial dos serviços tiver terminado.
    if (!servicesLoading) {
      const foundService = services.find(s => s.id === Number(id));
      
      if (foundService) {
        setService(foundService);
        setError(null); // Limpa qualquer erro anterior se encontrar o serviço
      } else {
        // Se, após o carregamento, o serviço não for encontrado, defina o erro.
        setError("Oops! Não encontramos o serviço que você está procurando.");
      }
    }
  }, [id, services, servicesLoading]); // Roda quando o id, a lista ou o estado de loading mudam

  const handleHireClick = () => {
    if (!user) {
      toast.error('Você precisa estar logado para contratar um serviço.');
      navigate('/login');
      return;
    }
    if (!service) {
      toast.error('Serviço não encontrado.');
      return;
    }
    if (user.name === service.seller.name) {
      toast.warn('Você não pode contratar seu próprio serviço.');
      return;
    }

    addOrder(service, user.id);
    toast.success(`'${service.title}' contratado com sucesso!`);
    navigate('/my-orders');
  };

  // Mostra uma tela de carregamento ENQUANTO o ServiceContext busca os dados.
  if (servicesLoading) {
    return <div className={styles.feedbackScreen}>Carregando detalhes do serviço...</div>;
  }

  // Se houver um erro (após o carregamento), mostra a mensagem de erro.
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

  // Se não está carregando, não há erro, mas o serviço ainda é nulo.
  if (!service) {
    return (
        <div className={styles.feedbackScreen}>
            <p className={styles.errorText}>Serviço não encontrado.</p>
            <Link to="/services" className={styles.backLink}>Voltar para a lista de serviços</Link>
        </div>
    );
  }

  // Se tudo estiver certo, renderiza a página de detalhes.
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
            {Number(service.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
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