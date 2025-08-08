import React, { useContext } from 'react';
import { ServiceContext } from '../../contexts/ServiceContext';
import ServiceCard from './ServiceCard'; // Verifique o caminho
import styles from './services.module.css'; // Importe o CSS da página

export default function Services() {
  const { services } = useContext(ServiceContext);
  
  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <h1 className={styles.title}>Serviços disponíveis</h1>
        <p className={styles.subtitle}>Clique em um serviço para ver mais detalhes e contratar.</p>
      </header>
      <main>
        {services.length > 0 ? (
          <div className={styles.servicesGrid}>
            {services.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <div className={styles.emptyMessage}>
            <p>Ainda não há serviços disponíveis. Seja o primeiro a criar um!</p>
          </div>
        )}
      </main>
    </div>
  );
}