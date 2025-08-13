import React, { useContext, useState } from 'react';
import { ServiceContext } from '../../contexts/ServiceContext';
import ServiceCard from './ServiceCard';
import styles from './Services.module.css';

// Lista de categorias (sem alterações)
const categories = ['Todos', 'Companhia', 'Habilidades', 'Aulas', 'Bem-Estar'];

export default function Services() {
  const { services } = useContext(ServiceContext);
  
  // Estados para os filtros
  const [activeFilter, setActiveFilter] = useState('Todos');
  // 1. NOVO ESTADO para o termo de busca
  const [searchTerm, setSearchTerm] = useState('');

  // 2. LÓGICA DE FILTRAGEM ATUALIZADA
  const filteredServices = services
    // Primeiro, filtra pela categoria selecionada
    .filter(service => {
      if (activeFilter === 'Todos') return true;
      return service.category === activeFilter;
    })
    // Em seguida, filtra o resultado pelo termo de busca
    .filter(service => {
      // Converte tanto o título/descrição quanto o termo de busca para minúsculas para uma busca "case-insensitive"
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      const lowerCaseTitle = service.title.toLowerCase();
      const lowerCaseDescription = service.description.toLowerCase();
      
      // Retorna true se o termo de busca estiver no título OU na descrição
      return lowerCaseTitle.includes(lowerCaseSearchTerm) || lowerCaseDescription.includes(lowerCaseSearchTerm);
    });

  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <h1 className={styles.title}>Serviços disponíveis</h1>
        <p className={styles.subtitle}>Encontre exatamente o que você precisa.</p>
        
        {/* 3. ADICIONAR a barra de pesquisa ao cabeçalho */}
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Buscar por palavra-chave..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>
      
      {/* Botões de filtro de categoria (sem alterações) */}
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
            {filteredServices.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <div className={styles.emptyMessage}>
            {/* Mensagem dinâmica se não houver resultados */}
            <p>Nenhum serviço encontrado para sua busca.</p>
          </div>
        )}
      </main>
    </div>
  );
}
