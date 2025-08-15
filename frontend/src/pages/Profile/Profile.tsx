import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import apiUrl from '../../apiConfig';
import { AuthContext } from '../../contexts/AuthContext';
import { ServiceContext, IService } from '../../contexts/ServiceContext';
import { toast } from 'react-toastify';
import Modal from '../../components/Modal/Modal';
import styles from './Profile.module.css';

// Interface para os dados de uma venda que virão da API
interface ISale {
  order_id: number;
  order_date: string;
  price_at_purchase: string;
  service_title: string;
  buyer_name: string;
  buyer_email: string;
}

const Profile = () => {
  // Conexão com os contextos
  const { user, logout, isLoading: isAuthLoading, token } = useContext(AuthContext);
  const { services, deleteService } = useContext(ServiceContext);
  const navigate = useNavigate();

  // Estados para o modal de exclusão
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<IService | null>(null);

  // Estado para as vendas do usuário
  const [sales, setSales] = useState<ISale[]>([]);
  const [isLoadingSales, setIsLoadingSales] = useState(true);

  // Efeito para proteção de rota
  useEffect(() => {
    if (isAuthLoading) return;
    if (!user) {
      navigate('/login');
    }
  }, [user, isAuthLoading, navigate]);

  // Efeito para buscar as vendas do usuário
  useEffect(() => {
    const fetchSales = async () => {
      if (token) {
        try {
          setIsLoadingSales(true);
          const res = await axios.get(`${apiUrl}/orders/my-sales`);
          setSales(res.data);
        } catch (err) {
          console.error("Erro ao buscar vendas:", err);
          toast.error("Não foi possível carregar suas vendas.");
        } finally {
          setIsLoadingSales(false);
        }
      }
    };

    // Só busca as vendas se o usuário estiver carregado
    if (user) {
        fetchSales();
    }
  }, [token, user]); // Depende do token e do usuário

  // Lógica do modal e de exclusão
  const openDeleteModal = (service: IService) => {
    setServiceToDelete(service);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsModalOpen(false);
    setServiceToDelete(null);
  };

  const confirmDeleteService = () => {
    if (serviceToDelete) {
      deleteService(serviceToDelete.id);
      toast.info(`Serviço "${serviceToDelete.title}" foi excluído.`);
      closeDeleteModal();
    }
  };

  const handleLogout = () => {
    logout();
  };

  // Filtra os serviços para mostrar apenas os do usuário logado
  const userServices = user 
    ? services.filter(service => service.seller.name === user.name) 
    : [];

  if (isAuthLoading || !user) {
    return <div className={styles.loading}>Carregando perfil...</div>;
  }

  return (
    <>
      <div className={styles.container}>
        {/* Card Principal do Perfil */}
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

        {/* Seção "Meus Serviços Publicados" */}
        <div className={styles.servicesSection}>
          <h3 className={styles.sectionTitle}>Meus Serviços Publicados</h3>
          {userServices.length > 0 ? (
            <ul className={styles.serviceList}>
              {userServices.map(service => (
                <li key={service.id} className={styles.serviceItem}>
                  <span className={styles.serviceTitle}>{service.title}</span>
                  <div className={styles.serviceActions}>
                    <Link to={`/edit-service/${service.id}`} className={styles.editButton}>
                      Editar
                    </Link>
                    <button 
                      onClick={() => openDeleteModal(service)} 
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

        {/* Seção "Vendas Realizadas" */}
        <div className={styles.salesSection}>
          <h3 className={styles.sectionTitle}>Vendas Realizadas</h3>
          {isLoadingSales ? (
            <p className={styles.loadingText}>Carregando vendas...</p>
          ) : sales.length > 0 ? (
            <ul className={styles.salesList}>
              {sales.map(sale => (
                <li key={sale.order_id} className={styles.saleItem}>
                  <div className={styles.saleInfo}>
                    <span className={styles.saleServiceTitle}>{sale.service_title}</span>
                    <span className={styles.saleDate}>
                      Vendido em: {new Date(sale.order_date).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <div className={styles.buyerInfo}>
                    <span className={styles.buyerName}>{sale.buyer_name}</span>
                    <a href={`mailto:${sale.buyer_email}`} className={styles.buyerEmail}>{sale.buyer_email}</a>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.noServicesText}>Você ainda não realizou nenhuma venda.</p>
          )}
        </div>
      </div>
      
      {/* Modal de Confirmação de Exclusão */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={closeDeleteModal} 
        title="Confirmar Exclusão"
      >
        <div className={styles.modalBodyContent}>
          <p>
            Você tem certeza de que deseja excluir o serviço 
            <strong> "{serviceToDelete?.title}"</strong>?
          </p>
          <p className={styles.warningText}>Esta ação não pode ser desfeita.</p>
          <div className={styles.modalActions}>
            <button onClick={closeDeleteModal} className={styles.cancelButton}>
              Cancelar
            </button>
            <button onClick={confirmDeleteService} className={styles.confirmDeleteButton}>
              Sim, Excluir
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Profile;