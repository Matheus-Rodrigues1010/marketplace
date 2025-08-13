import React, { useContext, useEffect, useState } from 'react'; // 1. Adicionar useState
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { ServiceContext, IService } from '../../contexts/ServiceContext'; // Importar IService
import { toast } from 'react-toastify';
// 2. Importar nosso novo componente Modal
import Modal from '../../components/Modal/Modal';
import styles from './Profile.module.css';

const Profile = () => {
  const { user, logout, isLoading: isAuthLoading } = useContext(AuthContext);
  const { services, deleteService } = useContext(ServiceContext);
  const navigate = useNavigate();

  // 3. NOVOS ESTADOS para controlar o modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Guarda o serviço que o usuário pretende excluir
  const [serviceToDelete, setServiceToDelete] = useState<IService | null>(null);

  useEffect(() => {
    if (isAuthLoading) return;
    if (!user) { navigate('/login'); }
  }, [user, isAuthLoading, navigate]);

  const handleLogout = () => { logout(); };

  // 4. ATUALIZAR a lógica de exclusão
  const openDeleteModal = (service: IService) => {
    setServiceToDelete(service); // Guarda qual serviço será excluído
    setIsModalOpen(true); // Abre o modal
  };

  const closeDeleteModal = () => {
    setIsModalOpen(false); // Fecha o modal
    setServiceToDelete(null); // Limpa o serviço selecionado
  };

  const confirmDeleteService = () => {
    if (serviceToDelete) {
      deleteService(serviceToDelete.id);
      toast.info(`Serviço "${serviceToDelete.title}" foi excluído.`);
      closeDeleteModal(); // Fecha o modal após a exclusão
    }
  };

  const userServices = user 
    ? services.filter(service => service.seller.name === user.name) 
    : [];

  if (isAuthLoading || !user) {
    return <div className={styles.loading}>Carregando perfil...</div>;
  }

  return (
    <> {/* 5. Usar um Fragment para permitir que o Modal seja um irmão */}
      <div className={styles.container}>
        <div className={styles.profileCard}>
          <img src={`https://api.pravatar.cc/150?u=${user.email}`} alt={`Avatar de ${user.name}`} className={styles.avatar} />
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
                    {/* O botão agora abre o modal em vez de chamar window.confirm */}
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
      </div>

      {/* 6. RENDERIZAR o componente Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={closeDeleteModal} 
        title="Confirmar Exclusão"
      >
        {/* Este é o 'children' do nosso modal */}
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
