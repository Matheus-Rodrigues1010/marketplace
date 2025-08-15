import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
// Importamos os dois contextos necessários
import { ServiceContext } from '../../contexts/ServiceContext';
import { AuthContext } from '../../contexts/AuthContext';
import { OrderContext } from '../../contexts/OrderContext';
import { toast } from 'react-toastify';
import styles from './ProductDetails.module.css';
import { IService } from '../../contexts/ServiceContext';

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  // Pegamos a lista de serviços E o estado de carregamento do ServiceContext
  const { services, loading: servicesLoading } = useContext(ServiceContext);
  const { user } = useContext(AuthContext);
  const { addOrder } = useContext(OrderContext);

  const [service, setService] = useState<IService | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // SÓ EXECUTE a lógica de busca SE o carregamento dos serviços tiver terminado.
    if (!servicesLoading) {
      const foundService = services.find(s => s.id === Number(id));
      
      if (foundService) {
        setService(foundService);
      } else {
        setError("Oops! Não encontramos o serviço que você está procurando.");
      }
    }
  }, [id, services, servicesLoading]); // Adicionamos 'servicesLoading' às dependências

  const handleHireClick = () => { /* ... sua lógica existente ... */ };

  // Mostra uma tela de carregamento ENQUANTO o ServiceContext busca os dados.
  if (servicesLoading) {
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
    // Se não está carregando e não há erro, mas o serviço é nulo, mostra erro também
    return (
        <div className={styles.feedbackScreen}>
            <p className={styles.errorText}>Serviço não encontrado.</p>
            <Link to="/services" className={styles.backLink}>Voltar para a lista de serviços</Link>
        </div>
    );
  }

  // O JSX para exibir os detalhes (sem alterações)
  return (
    <div className={styles.pageContainer}>
      {/* ... seu JSX existente para exibir os detalhes do serviço ... */}
    </div>
  );
};

export default ProductDetails;