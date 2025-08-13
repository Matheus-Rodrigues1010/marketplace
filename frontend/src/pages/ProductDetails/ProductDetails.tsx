import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; // 1. Adicionar useNavigate
// 2. Importar TODOS os contextos necessários
import { ServiceContext } from '../../contexts/ServiceContext';
import { AuthContext } from '../../contexts/AuthContext';
import { OrderContext } from '../../contexts/OrderContext';

import { toast } from 'react-toastify';
import styles from './ProductDetails.module.css';
import { IService } from '../../contexts/ServiceContext'; // Reutilizando o tipo

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // 3. Conectar aos três contextos
  const { services } = useContext(ServiceContext);
  const { user } = useContext(AuthContext); // Precisamos saber quem é o comprador
  const { addOrder } = useContext(OrderContext); // Precisamos da função para adicionar o pedido

  const [service, setService] = useState<IService | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const foundService = services.find(s => s.id === Number(id));
    // A lógica para encontrar o serviço continua a mesma
    setTimeout(() => {
        if (foundService) {
            setService(foundService);
        }
        setIsLoading(false);
    }, 50);
  }, [id, services]);

  // 4. ATUALIZAR a função handleHireClick
  const handleHireClick = () => {
    // Verificação de segurança: o usuário está logado? O serviço existe?
    if (!user) {
      toast.error('Você precisa estar logado para contratar um serviço.');
      navigate('/login'); // Redireciona para o login
      return;
    }
    if (!service) {
      toast.error('Serviço não encontrado.');
      return;
    }
    // Lógica para impedir que o usuário compre o próprio serviço
    if (user.name === service.seller.name) {
      toast.warn('Você não pode contratar seu próprio serviço.');
      return;
    }

    // Chama a função do OrderContext para criar o pedido
    addOrder(service, user.id);
    
    toast.success(`'${service.title}' contratado com sucesso!`);
    
    // Redireciona o usuário para uma futura página de "Meus Pedidos"
    // Por enquanto, vamos para a home. No próximo passo, criaremos essa página.
    navigate('/'); 
  };

  if (isLoading) {
    return <div className={styles.feedbackScreen}>Carregando detalhes do serviço...</div>;
  }

  // Se, após carregar, não encontrou o serviço (URL inválida)
  if (!service) {
    return (
      <div className={styles.feedbackScreen}>
        <p className={styles.errorText}>Oops! Não encontramos o serviço que você está procurando.</p>
        <Link to="/services" className={styles.backLink}>
          Voltar para a lista de serviços
        </Link>
      </div>
    );
  }

  // O JSX do componente continua o mesmo, apenas o botão agora é funcional
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
      {/* ... seção de avaliações ... */}
      <div className={styles.reviewsContainer}>
        <h2 className={styles.reviewsTitle}>Avaliações dos Clientes</h2>
        <div className={styles.reviewItem}>
          <h3 className={styles.reviewAuthor}>Cliente 1</h3>
          <p className={styles.reviewText}>Ótimo! Atendeu todas as minhas expectativas.</p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;