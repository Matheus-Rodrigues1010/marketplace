
import React, { useContext, useEffect } from 'react';
// 1. Importar o Link para poder navegar
import { useNavigate, Link } from 'react-router-dom';

import { AuthContext } from '../../contexts/AuthContext';
import { ServiceContext } from '../../contexts/ServiceContext';
import styles from './Profile.module.css';

const Profile = () => {
  const { user, logout, isLoading: isAuthLoading } = useContext(AuthContext);
  const { services, deleteService } = useContext(ServiceContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthLoading) return;
    if (!user) {
      navigate('/login');
    }
  }, [user, isAuthLoading, navigate]);

  const handleLogout = () => {
    logout();
  };
  
  const handleDeleteService = (serviceId: number) => {
    if (window.confirm('Tem certeza de que deseja excluir este serviço? Esta ação não pode ser desfeita.')) {
      deleteService(serviceId);
    }
  };

  const userServices = user 
    ? services.filter(service => service.seller.name === user.name) 
    : [];

  if (isAuthLoading || !user) {
    return <div className={styles.loading}>Carregando perfil...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.profileCard}>
        <img
          src={`https://api.pravatar.cc/150?u=${user.email}`}
          alt={`Avatar de ${user.name}`}
          className={styles.avatar}
        />
        <h2 className={styles.name}>{user.name}</h2>
        <p className={styles.email}>{user.email}</p>
        <button onClick={handleLogout} className={styles.logoutButton}>
          Sair (Logout)
        </button>
      </div>

      <div className={styles.servicesSection}>
        <h3 className={styles.sectionTitle}>Meus Serviços Publicados</h3>
        {userServices.length > 0 ? (
          <ul className={styles.serviceList}>
            {userServices.map(service => (
              <li key={service.id} className={styles.serviceItem}>
                <span className={styles.serviceTitle}>{service.title}</span>
                <div className={styles.serviceActions}>
                  {/* 2. ADICIONAR o Link para a rota de edição */}
                  <Link 
                    to={`/edit-service/${service.id}`} 
                    className={styles.editButton}
                  >
                    Editar
                  </Link>
                  <button 
                    onClick={() => handleDeleteService(service.id)} 
                    className={styles.deleteButton}
                  >
                    Excluir
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.noServicesText}>Você ainda não publicou nenhum serviço.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;