import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import apiUrl from '../../apiConfig';
import { AuthContext } from '../../contexts/AuthContext';
import { ServiceContext, IService } from '../../contexts/ServiceContext';
import { toast } from 'react-toastify';
import Modal from '../../components/Modal/Modal';
// --- A CORREÇÃO ESTÁ AQUI ---
import styles from './Profile.module.css'; // Importa o arquivo CSS correto

interface ISale {
  order_id: number;
  order_date: string;
  price_at_purchase: string;
  service_title: string;
  buyer_name: string;
  buyer_email: string;
}

const Profile = () => {
  const { user, logout, isLoading: isAuthLoading, token } = useContext(AuthContext);
  const { services, deleteService, loading: servicesLoading } = useContext(ServiceContext);
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<IService | null>(null);
  const [sales, setSales] = useState<ISale[]>([]);
  const [isLoadingSales, setIsLoadingSales] = useState(true);

  useEffect(() => {
    if (isAuthLoading) return;
    if (!user) {
      navigate('/login');
    }
  }, [user, isAuthLoading, navigate]);

  useEffect(() => {
    const fetchSales = async () => {
      if (token) {
        try {
          setIsLoadingSales(true);
          const res = await axios.get(`${apiUrl}/orders/my-sales`);
          setSales(res.data);
        } catch (err) {
          toast.error("Não foi possível carregar suas vendas.");
        } finally {
          setIsLoadingSales(false);
        }
      }
    };
    if (user) {
      fetchSales();
    }
  }, [token, user]);

  const openDeleteModal = (service: IService) => {
    setServiceToDelete(service);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsModalOpen(false);
    setServiceToDelete(null);
  };

  const confirmDeleteService = async () => {
    if (serviceToDelete) {
      try {
        await deleteService(serviceToDelete.id);
        toast.info(`Serviço "${serviceToDelete.title}" foi excluído.`);
        closeDeleteModal();
      } catch (err) {
        closeDeleteModal();
      }
    }
  };

  const handleLogout = () => {
    logout();
  };

  const userServices = user 
    ? services.filter(service => service.seller_id === user.id) 
    : [];

  if (isAuthLoading || !user || servicesLoading) {
    return <div className={styles.loading}>Carregando perfil...</div>;
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.profileCard}>
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=3b82f6&color=fff&size=128`}
            alt={`Avatar de ${user.name}`}
            className={styles.avatar}
          />
          <h2 className={styles.name}>{user.name}</h2>
          <p className={styles.email}>{user.email}</p>
          <button onClick={handleLogout} className={styles.logoutButton}>Sair (Logout)</button>
        </div>

        <div className={styles.servicesSection}>
          <h3 className={styles.sectionTitle}>Meus Serviços Publicados</h3>
          {userServices.length > 0 ? (
            <ul className={styles.serviceList}>
              {userServices.map(service => (
                <li key={service.id} className={styles.serviceItem}>
                  <span className={styles.serviceTitle}>{service.title}</span>
                  <div className={styles.serviceActions}>
                    <Link to={`/edit-service/${service.id}`} className={styles.editButton}>Editar</Link>
                    <button onClick={() => openDeleteModal(service)} className={styles.deleteButton}>Excluir</button>
                  </div>
                </li>
              ))}
            </ul>
          ) : ( <p className={styles.noServicesText}>Você ainda não publicou nenhum serviço.</p> )}
        </div>

        <div className={styles.salesSection}>
          <h3 className={styles.sectionTitle}>Vendas Realizadas</h3>
          {isLoadingSales ? ( <p className={styles.loadingText}>Carregando vendas...</p> ) : sales.length > 0 ? (
            <ul className={styles.salesList}>
              {sales.map(sale => (
                <li key={sale.order_id} className={styles.saleItem}>
                  <div className={styles.saleInfo}>
                    <span className={styles.saleServiceTitle}>{sale.service_title}</span>
                    <span className={styles.saleDate}>Vendido em: {new Date(sale.order_date).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className={styles.buyerInfo}>
                    <span className={styles.buyerName}>{sale.buyer_name}</span>
                    <a href={`mailto:${sale.buyer_email}`} className={styles.buyerEmail}>{sale.buyer_email}</a>
                  </div>
                </li>
              ))}
            </ul>
          ) : ( <p className={styles.noServicesText}>Você ainda não realizou nenhuma venda.</p> )}
        </div>
      </div>
      
      <Modal isOpen={isModalOpen} onClose={closeDeleteModal} title="Confirmar Exclusão">
        <div className={styles.modalBodyContent}>
          <p>Você tem certeza de que deseja excluir o serviço <strong> "{serviceToDelete?.title}"</strong>?</p>
          <p className={styles.warningText}>Esta ação não pode ser desfeita.</p>
          <div className={styles.modalActions}>
            <button onClick={closeDeleteModal} className={styles.cancelButton}>Cancelar</button>
            <button onClick={confirmDeleteService} className={styles.confirmDeleteButton}>Sim, Excluir</button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Profile;