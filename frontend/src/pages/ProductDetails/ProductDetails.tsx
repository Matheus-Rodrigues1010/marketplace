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
        const res = await axios.get(`${apiUrl}/services/${id}`);
        const serviceData = { ...res.data, imageUrl: res.data.image_url, seller: { name: res.data.seller_name } };
        setService(serviceData);
      } catch (err) {
        setError("Oops! Não encontramos o serviço que você está procurando.");
      } finally {
        setLoading(false);
      }
    };
    if (id) { fetchServiceDetails(); }
  }, [id]);

  const handleHireClick = async () => {
    if (!user) { toast.error('Você precisa estar logado para contratar um serviço.'); navigate('/login'); return; }
    if (!service) { toast.error('Serviço não encontrado.'); return; }
    if (user.id === service.seller_id) { toast.warn('Você não pode contratar seu próprio serviço.'); return; }

    try {
      await addOrder(service, user.id);
      toast.success(`'${service.title}' contratado com sucesso!`);
      navigate('/my-orders');
    } catch (err) {
      console.error("Falha ao processar a contratação no componente:", err);
    }
  };

  if (loading) { return <div className={styles.feedbackScreen}>Carregando...</div>; }
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
        <div className={styles.imageContainer}><img src={service.imageUrl} alt={service.title} /></div>
        <div className={styles.infoContainer}>
          <h1 className={styles.title}>{service.title}</h1>
          <p className={styles.seller}>Oferecido por: {service.seller.name}</p>
          <p className={styles.description}>{service.description}</p>
          <div className={styles.price}>{Number(service.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
          <button onClick={handleHireClick} className={styles.hireButton}>Contratar Serviço</button>
        </div>
      </div>
      <div className={styles.reviewsContainer}>
        <h2 className={styles.reviewsTitle}>Avaliações dos Clientes</h2>
        <div className={styles.reviewItem}><h3 className={styles.reviewAuthor}>Cliente 1</h3><p className={styles.reviewText}>Ótimo! Atendeu todas as minhas expectativas.</p></div>
      </div>
    </div>
  );
};

export default ProductDetails;