import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import apiUrl from '../../apiConfig';
import { AuthContext } from '../../contexts/AuthContext';
import { OrderContext } from '../../contexts/OrderContext';
import { toast } from 'react-toastify';
import styles from './ProductDetails.module.css';
import { IService } from '../../contexts/ServiceContext';

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { user } = useContext(AuthContext);
  const { addOrder } = useContext(OrderContext);

  const [service, setService] = useState<IService | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        setLoading(true);
        // FAZ A CHAMADA PARA A NOVA ROTA DE API
        const res = await axios.get(`${apiUrl}/services/${id}`);
        
        // Adapta a resposta da API para o formato do frontend
        const serviceData = {
          ...res.data,
          imageUrl: res.data.image_url,
          seller: { name: res.data.seller_name }
        };

        setService(serviceData);

      } catch (err) {
        console.error("Erro ao buscar detalhes do serviço:", err);
        setError("Oops! Não encontramos o serviço que você está procurando.");
      } finally {
        setLoading(false);
      }
    };
    
    // Só busca se o ID existir
    if (id) {
      fetchServiceDetails();
    }
  }, [id]); // Roda sempre que o ID na URL mudar

  const handleHireClick = () => { /* ... sua lógica existente ... */ };

  if (loading) {
    return <div className={styles.feedbackScreen}>Carregando...</div>;
  }

  if (error || !service) {
    return (
      <div className={styles.feedbackScreen}>
        <p className={styles.errorText}>{error || "Serviço não encontrado."}</p>
        <Link to="/services" className={styles.backLink}>Voltar para a lista de serviços</Link>
      </div>
    );
  }

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
        {/* ... */}
      </div>
    </div>
  );
};

export default ProductDetails;