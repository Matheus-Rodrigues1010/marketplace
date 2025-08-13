import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../contexts/AuthContext';
import { ServiceContext, Category } from '../../contexts/ServiceContext';
// 1. Importar nosso componente Modal
import Modal from '../../components/Modal/Modal';
import styles from './CreateService.module.css';

const availableCategories: Category[] = ['Habilidades', 'Companhia', 'Aulas', 'Bem-Estar'];

const CreateService = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  const { user, isLoading: isAuthLoading } = useContext(AuthContext);
  const { services, addService, updateService } = useContext(ServiceContext);
  const navigate = useNavigate();

  // Estados do formulário
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [category, setCategory] = useState<Category>(availableCategories[0]);
  const [formError, setFormError] = useState('');

  // 2. NOVO ESTADO para controlar o modal de confirmação
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // ... useEffects (sem alterações) ...
  useEffect(() => {
    if (isEditMode && services.length > 0) {
      const serviceToEdit = services.find(service => service.id === Number(id));
      if (serviceToEdit) {
        setTitle(serviceToEdit.title);
        setDescription(serviceToEdit.description);
        setPrice(String(serviceToEdit.price));
        setCategory(serviceToEdit.category);
        setImagePreview(serviceToEdit.imageUrl);
      } else {
        toast.error('Serviço não encontrado!');
        navigate('/profile');
      }
    }
  }, [id, isEditMode, services, navigate]);

  useEffect(() => {
    if (isAuthLoading) return;
    if (!user) { navigate('/login'); }
  }, [user, isAuthLoading, navigate]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // 3. ATUALIZAR handleSubmit: agora ele apenas abre o modal
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!title || !description || !price || !category || (!isEditMode && !imageFile)) {
      setFormError('Todos os campos são obrigatórios.');
      return;
    }
    
    // Abre o modal de confirmação em vez de submeter diretamente
    setIsConfirmModalOpen(true);
  };

  // 4. NOVA FUNÇÃO: a lógica de criação/edição foi movida para cá
  const handleConfirmSubmit = () => {
    if (!user) { return; }

    if (isEditMode) {
      updateService(Number(id), { title, description, price: Number(price), category, imageUrl: imagePreview || '' });
      toast.success('Serviço atualizado com sucesso!');
      navigate('/profile');
    } else {
      addService({ title, description, price: Number(price) }, user.name, category, imagePreview);
      toast.success('Serviço publicado com sucesso!');
      navigate('/services');
    }
    // Fecha o modal após a ação
    setIsConfirmModalOpen(false);
  };


  if (isAuthLoading || !user) { /* ... */ }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.formContainer}>
          <h1 className={styles.title}>{isEditMode ? 'Editar Serviço' : 'Criar um Novo Serviço'}</h1>
          <form onSubmit={handleSubmit} className={styles.form}>
            {/* O formulário continua o mesmo */}
            <div className={styles.formGroup}>
              <label htmlFor="title" className={styles.label}>Título do Serviço</label>
              <input id="title" type="text" className={styles.input} value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="description" className={styles.label}>Descrição Detalhada</label>
              <textarea id="description" className={styles.textarea} rows={5} value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="image" className={styles.label}>Imagem do Serviço</label>
              <input type="file" id="image" accept="image/png, image/jpeg" className={styles.fileInput} onChange={handleImageChange} />
            </div>
            {imagePreview && <div className={styles.imagePreviewContainer}><img src={imagePreview} alt="Pré-visualização" className={styles.imagePreview} /></div>}
            <div className={styles.formGroup}>
              <label htmlFor="category" className={styles.label}>Categoria</label>
              <select id="category" className={styles.select} value={category} onChange={(e) => setCategory(e.target.value as Category)}>
                {availableCategories.map(cat => (<option key={cat} value={cat}>{cat}</option>))}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="price" className={styles.label}>Preço (R$)</label>
              <input id="price" type="number" className={styles.input} value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
            {formError && <p className={styles.error}>{formError}</p>}
            <button type="submit" className={styles.submitButton}>
              {isEditMode ? 'Salvar Alterações' : 'Revisar e Publicar'}
            </button>
          </form>
        </div>
      </div>

      {/* 5. RENDERIZAR o modal de confirmação */}
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title={isEditMode ? 'Confirmar Alterações' : 'Revisar seu Serviço'}
      >
        <div className={styles.modalBodyContent}>
          <p>Por favor, confirme os detalhes do seu serviço antes de publicar.</p>
          <div className={styles.summary}>
            {imagePreview && <img src={imagePreview} alt="Pré-visualização" className={styles.summaryImage} />}
            <div className={styles.summaryDetails}>
              <h4>{title || "Seu título aqui"}</h4>
              <p><strong>Categoria:</strong> {category}</p>
              <p><strong>Preço:</strong> {Number(price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
            </div>
          </div>
          <div className={styles.modalActions}>
            <button onClick={() => setIsConfirmModalOpen(false)} className={styles.cancelButton}>
              Voltar e Editar
            </button>
            <button onClick={handleConfirmSubmit} className={styles.confirmSubmitButton}>
              {isEditMode ? 'Confirmar e Salvar' : 'Publicar Serviço'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CreateService;