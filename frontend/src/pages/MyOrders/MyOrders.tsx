import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { OrderContext } from '../../contexts/OrderContext';
import styles from './MyOrders.module.css';

const MyOrders = () => {
  const { user, isLoading: isAuthLoading } = useContext(AuthContext);
  const { orders } = useContext(OrderContext);
  const navigate = useNavigate();

  // Proteção de rota
  useEffect(() => {
    if (isAuthLoading) return;
    if (!user) {
      navigate('/login');
    }
  }, [user, isAuthLoading, navigate]);

  // Filtrar os pedidos para este usuário
  const userOrders = user 
    ? orders.filter(order => order.buyerId === user.id) 
    : [];

  if (isAuthLoading || !user) {
    return (
      <div className={styles.loadingScreen}>
        Carregando seus pedidos...
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <h1 className={styles.title}>Meus Pedidos</h1>
        <p className={styles.subtitle}>Aqui está o histórico de todos os serviços que você contratou.</p>
      </header>

      <div className={styles.ordersList}>
        {userOrders.length > 0 ? (
          userOrders.map(order => (
            <div key={order.orderId} className={styles.orderCard}>
              <img src={order.service.imageUrl} alt={order.service.title} className={styles.serviceImage} />
              <div className={styles.serviceInfo}>
                <h3 className={styles.serviceTitle}>{order.service.title}</h3>
                <p className={styles.seller}>Vendido por: {order.service.seller.name}</p>
                <p className={styles.date}>
                  Contratado em: {new Date(order.orderDate).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div className={styles.priceInfo}>
                <p className={styles.priceLabel}>Valor pago</p>
                <p className={styles.price}>
                  {order.service.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className={styles.emptyMessage}>Você ainda não contratou nenhum serviço.</p>
        )}
      </div>
    </div>
  );
};

export default MyOrders;