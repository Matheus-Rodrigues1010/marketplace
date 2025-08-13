import React, { useContext, useState } from 'react';
import { ServiceContext } from '../../contexts/ServiceContext';
import ServiceCard from './ServiceCard';
import styles from './services.module.css';

// Definir as categorias disponíveis para os filtros
const categories = ['Todos', 'Companhia', 'Habilidades', 'Aulas', 'Bem-Estar'];

export default function Services() {
  const { services } = useContext(ServiceContext);
  const [activeFilter, setActiveFilter] = useState('Todos');

  // Lógica de filtragem: recalcula a lista a ser exibida
  const filteredServices = activeFilter === 'Todos'
    ? services
    : services.filter(service => service.category === activeFilter);

  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <h1 className={styles.title}>Serviços disponíveis</h1>
        <p className={styles.subtitle}>Encontre exatamente o que você precisa.</p>
      </header>
      
      {/* Interface para os botões de filtro */}
      <div className={styles.filterContainer}>
        {categories.map(category => (
          <button
            key={category}
            className={`${styles.filterButton} ${activeFilter === category ? styles.activeFilter : ''}`}
            onClick={() => setActiveFilter(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <main>
        {filteredServices.length > 0 ? (
          <div className={styles.servicesGrid}>
            {/* Mapeia a lista FILTRADA */}
            {filteredServices.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <div className={styles.emptyMessage}>
            <p>Nenhum serviço encontrado para a categoria "{activeFilter}".</p>
          </div>
        )}
      </main>
    </div>
  );
}