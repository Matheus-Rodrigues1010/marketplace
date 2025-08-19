import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import apiUrl from '../../apiConfig';
import { AuthContext } from '../../contexts/AuthContext';
import { ServiceContext, IService } from '../../contexts/ServiceContext';
import { toast } from 'react-toastify';
import Modal from '../../components/Modal/Modal';
import styles from './Profile.module.css';

interface ISale {
  order_id: number;
  order_date: string;
  price_at_purchase: string;
  service_title: string;
  buyer_name: string;
  buyer_email: string;
}

const Profile = () => {
  const { user, logout, isLoading: isAuthLoading, token, setUser: setAuthUser } = useContext(AuthContext);
  const { services, deleteService, loading: servicesLoading } = useContext(ServiceContext);
  const navigate = useNavigate();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<IService | null>(null);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [fullName, setFullName] = useState(user?.name || '');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar_url || null);
  const [isUploading, setIsUploading] = useState(false);
  const [sales, setSales] = useState<ISale[]>([]);
  const [isLoadingSales, setIsLoadingSales] = useState(true);
  const [isProcessingStripe, setIsProcessingStripe] = useState(false);

  useEffect(() => {
    if (isAuthLoading) return;
    if (!user) {
      navigate('/login');
    } else {
        setFullName(user.name);
        setAvatarPreview(user.avatar_url || null);
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
    if (user) { fetchSales(); }
  }, [token, user]);

  const openDeleteModal = (service: IService) => { setServiceToDelete(service); setIsDeleteModalOpen(true); };
  const closeDeleteModal = () => { setIsDeleteModalOpen(false); setServiceToDelete(null); };
  const confirmDeleteService = async () => {
    if (serviceToDelete) {
      try {
        await deleteService(serviceToDelete.id);
        toast.info(`Serviço "${serviceToDelete.title}" foi excluído.`);
        closeDeleteModal();
      } catch (err) { closeDeleteModal(); }
    }
  };
  const handleLogout = () => { logout(); };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setAvatarFile(file); setAvatarPreview(URL.createObjectURL(file)); }
  };

  const handleProfileUpdate = async () => {
    if (!user) return;
    setIsUploading(true);
    let finalAvatarUrl = avatarPreview;
    try {
      if (avatarFile) {
        const formData = new FormData();
        formData.append('image', avatarFile);
        const res = await axios.post(`${apiUrl}/upload`, formData);
        finalAvatarUrl = res.data.imageUrl;
      }
      const body = { fullName, avatarUrl: finalAvatarUrl };
      const res = await axios.put(`${apiUrl}/users/profile`, body);
      const updatedUserPayload = { ...user, name: res.data.name, avatar_url: res.data.avatar_url, stripe_account_id: res.data.stripe_account_id };
      setAuthUser(updatedUserPayload);
      toast.success('Perfil atualizado com sucesso!');
      setIsEditProfileModalOpen(false);
    } catch (err) {
      toast.error('Erro ao atualizar o perfil.');
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleBecomeSeller = async () => {
    setIsProcessingStripe(true);
    try {
      const res = await axios.post(`${apiUrl}/payments/create-connected-account`);
      window.location.href = res.data.url;
    } catch (err) {
      toast.error("Não foi possível iniciar o cadastro de vendedor. Tente novamente.");
      console.error("Erro ao criar conta Stripe:", err);
    } finally {
      setIsProcessingStripe(false);
    }
  };

  const handleManageAccount = async () => {
    setIsProcessingStripe(true);
    try {
      const res = await axios.get(`${apiUrl}/payments/seller-dashboard-link`);
      window.location.href = res.data.url;
    } catch (err) {
      toast.error("Não foi possível acessar o painel. Tente novamente.");
    } finally {
      setIsProcessingStripe(false);
    }
  };

  const userServices = user ? services.filter(service => service.seller_id === user.id) : [];

  if (isAuthLoading || !user || servicesLoading) {
    return <div className={styles.loading}>Carregando perfil...</div>;
  }
  
  const renderSellerStatus = () => {
    if (!user.stripe_account_id) {
      return (
        <div className={styles.statusNotVerified}>
          <p>Para começar a vender, configure sua conta de pagamentos.</p>
          <button onClick={handleBecomeSeller} className={styles.becomeSellerButton} disabled={isProcessingStripe}>
            {isProcessingStripe ? 'Aguarde...' : 'Tornar-se um Vendedor'}
          </button>
        </div>
      );
    }

    if (user.stripe_account_id && !user.stripe_account_status?.details_submitted) {
      return (
        <div className={styles.statusNeedsAttention}>
          <p>⚠️ Sua conta de vendedor está quase pronta! Conclua seu cadastro na Stripe para poder receber saques.</p>
          <button onClick={handleManageAccount} className={styles.becomeSellerButton} disabled={isProcessingStripe}>
            {isProcessingStripe ? 'Aguarde...' : 'Concluir Cadastro'}
          </button>
        </div>
      );
    }
    
    if (user.stripe_account_id && user.stripe_account_status?.payouts_enabled) {
      return (
        <div className={styles.statusVerified}>
          <p>✅ Sua conta de vendedor está ativa e pronta para receber pagamentos e saques.</p>
           <button onClick={handleManageAccount} className={styles.manageAccountButton} disabled={isProcessingStripe}>
            {isProcessingStripe ? 'Aguarde...' : 'Gerenciar Conta'}
          </button>
        </div>
      );
    }
    
    return (
        <div className={styles.statusNeedsAttention}>
          <p>ℹ️ A Stripe está analisando suas informações. Você já pode receber pagamentos.</p>
           <button onClick={handleManageAccount} className={styles.manageAccountButton} disabled={isProcessingStripe}>
            {isProcessingStripe ? 'Aguarde...' : 'Ver Status'}
          </button>
        </div>
    );
  };


  return (
    <>
      <div className={styles.container}>
        <div className={styles.profileCard}>
          <img src={user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=3b82f6&color=fff&size=128`} alt={`Avatar de ${user.name}`} className={styles.avatar} />
          <h2 className={styles.name}>{user.name}</h2>
          <p className={styles.email}>{user.email}</p>
          <div className={styles.profileActions}>
            <button onClick={() => setIsEditProfileModalOpen(true)} className={styles.editProfileButton}>Editar Perfil</button>
            <button onClick={handleLogout} className={styles.logoutButton}>Sair</button>
          </div>
        </div>

        <div className={styles.sellerSection}>
          <h3 className={styles.sectionTitle}>Status de Vendedor</h3>
          {renderSellerStatus()}
        </div>

        <div className={styles.servicesSection}>
          <h3 className={styles.sectionTitle}>Meus Serviços Publicados</h3>
          {userServices.length > 0 ? ( <ul className={styles.serviceList}>{userServices.map(service => ( <li key={service.id} className={styles.serviceItem}><span className={styles.serviceTitle}>{service.title}</span><div className={styles.serviceActions}><Link to={`/edit-service/${service.id}`} className={styles.editButton}>Editar</Link><button onClick={() => openDeleteModal(service)} className={styles.deleteButton}>Excluir</button></div></li>))}</ul> ) : ( <p className={styles.noServicesText}>Você ainda não publicou nenhum serviço.</p> )}
        </div>

        <div className={styles.salesSection}>
          <h3 className={styles.sectionTitle}>Vendas Realizadas</h3>
          {isLoadingSales ? ( <p className={styles.loadingText}>Carregando vendas...</p> ) : sales.length > 0 ? ( <ul className={styles.salesList}>{sales.map(sale => ( <li key={sale.order_id} className={styles.saleItem}><div className={styles.saleInfo}><span className={styles.saleServiceTitle}>{sale.service_title}</span><span className={styles.saleDate}>Vendido em: {new Date(sale.order_date).toLocaleDateString('pt-BR')}</span></div><div className={styles.buyerInfo}><span className={styles.buyerName}>{sale.buyer_name}</span><a href={`mailto:${sale.buyer_email}`} className={styles.buyerEmail}>{sale.buyer_email}</a></div></li>))}</ul> ) : ( <p className={styles.noServicesText}>Você ainda não realizou nenhuma venda.</p> )}
        </div>
      </div>
      
      <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal} title="Confirmar Exclusão">
        <div className={styles.modalBodyContent}>
          <p>Você tem certeza de que deseja excluir o serviço <strong> "{serviceToDelete?.title}"</strong>?</p>
          <p className={styles.warningText}>Esta ação não pode ser desfeita.</p>
          <div className={styles.modalActions}>
            <button onClick={closeDeleteModal} className={styles.cancelButton}>Cancelar</button>
            <button onClick={confirmDeleteService} className={styles.confirmDeleteButton}>Sim, Excluir</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isEditProfileModalOpen} onClose={() => setIsEditProfileModalOpen(false)} title="Editar Perfil">
        <div className={styles.modalBodyContent}>
          <div className={styles.formGroup}>
            <label htmlFor="fullName" className={styles.label}>Nome Completo</label>
            <input id="fullName" type="text" className={styles.input} value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="avatar" className={styles.label}>Foto de Perfil</label>
            <input id="avatar" type="file" accept="image/png, image/jpeg" className={styles.fileInput} onChange={handleAvatarChange} />
          </div>
          {avatarPreview && ( <div className={styles.avatarPreviewContainer}><img src={avatarPreview} alt="Pré-visualização do avatar" className={styles.avatarPreview} /></div> )}
          <div className={styles.modalActions}>
            <button onClick={() => setIsEditProfileModalOpen(false)} className={styles.cancelButton} disabled={isUploading}>Cancelar</button>
            <button onClick={handleProfileUpdate} className={styles.confirmSubmitButton} disabled={isUploading}>{isUploading ? 'Salvando...' : 'Salvar Alterações'}</button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Profile;