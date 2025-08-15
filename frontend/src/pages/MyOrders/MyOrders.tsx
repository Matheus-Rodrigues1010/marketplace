import React, { useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { OrderContext } from '../../contexts/OrderContext';
import styles from './MyOrders.module.css';

const MyOrders = () => {
  const { user, isLoading: isAuthLoading } = useContext(AuthContext);
  const { orders, loading: ordersLoading, fetchOrders } = useContext(OrderContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthLoading) return;
    if (!user) {
      navigate('/login');
    } else {
      fetchOrders();
    }
  }, [user, isAuthLoading, navigate, fetchOrders]);

  if (isAuthLoading || ordersLoading) {
    return <div className={styles.loadingScreen}>Carregando seus pedidos...</div>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <h1 className={styles.title}>Meus Pedidos</h1>
        <p className={styles.subtitle}>Aqui está o histórico de todos os serviços que você contratou.</p>
      </header>
      <div className={styles.ordersList}>
        {orders.length > 0 ? (
          orders.map((order) => (
            <div key={order.order_id} className={styles.orderCard}>
              <img src={order.service_image_url} alt={order.service_title} className={styles.serviceImage} />
              <div className={styles.serviceInfo}>
                <h3 className={styles.serviceTitle}>{order.service_title}</h3>
                <p className={styles.seller}>Vendido por: {order.seller_name}</p>
                <p className={styles.date}>
                  {/* --- CORREÇÃO APLICADA AQUI --- */}
                  Contratado em: {new Date(order.order_date).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div className={styles.priceInfo}>
                <p className={styles.priceLabel}>Valor pago</p>
                <p className={styles.price}>{Number(order.price_at_purchase).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
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