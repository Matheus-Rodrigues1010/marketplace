import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import apiUrl from '../../apiConfig';
import { toast } from 'react-toastify';
import { AuthContext } from '../../contexts/AuthContext';
import { ServiceContext, Category } from '../../contexts/ServiceContext';
import Modal from '../../components/Modal/Modal';
import styles from './CreateService.module.css';

const availableCategories: Category[] = ['Habilidades', 'Companhia', 'Aulas', 'Bem-Estar'];

const CreateService = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  const { user, isLoading: isAuthLoading } = useContext(AuthContext);
  const { addService, updateService } = useContext(ServiceContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [category, setCategory] = useState<Category>(availableCategories[0]);
  const [formError, setFormError] = useState('');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    const fetchServiceToEdit = async () => {
      if (isEditMode) {
        try {
          setIsLoadingData(true);
          const res = await axios.get(`${apiUrl}/services/${id}`);
          const serviceToEdit = res.data;
          
          if (serviceToEdit) {
            setTitle(serviceToEdit.title);
            setDescription(serviceToEdit.description);
            setPrice(String(serviceToEdit.price));
            setCategory(serviceToEdit.category);
            setImagePreview(serviceToEdit.image_url);
          } else {
            throw new Error('Serviço não encontrado na API');
          }
        } catch (err) {
          toast.error('Serviço não encontrado!');
          navigate('/profile');
        } finally {
          setIsLoadingData(false);
        }
      } else {
        setIsLoadingData(false);
      }
    };

    fetchServiceToEdit();
  }, [id, isEditMode, navigate]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!title || !description || !price || !category) {
      setFormError('Todos os campos são obrigatórios.');
      return;
    }
    if (!isEditMode && !imageFile) {
      setFormError('A imagem do serviço é obrigatória.');
      return;
    }
    setIsConfirmModalOpen(true);
  };

  const handleConfirmSubmit = async () => {
    if (!user) return;
    setIsUploading(true);
    let finalImageUrl = imagePreview;

    try {
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        const res = await axios.post(`${apiUrl}/upload`, formData);
        finalImageUrl = res.data.imageUrl;
      }

      if (isEditMode) {
        await updateService(Number(id), { title, description, price: Number(price), category, imageUrl: finalImageUrl, seller: { name: user.name } });
        toast.success('Serviço atualizado com sucesso!');
        navigate('/profile');
      } else {
        await addService({ title, description, price: Number(price) }, user.name, category, finalImageUrl);
        toast.success('Serviço publicado com sucesso!');
        navigate('/services');
      }
    } catch (err) {
      console.error("Erro no processo de submissão:", err);
      toast.error("Ocorreu um erro. Tente novamente.");
    } finally {
      setIsUploading(false);
      setIsConfirmModalOpen(false);
    }
  };

  if (isAuthLoading || isLoadingData) {
    return <div className={styles.loadingContainer}><p>Carregando...</p></div>;
  }
  if (!user) {
    return <div className={styles.loadingContainer}><p>Verificando autorização...</p></div>;
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.formContainer}>
          <h1 className={styles.title}>{isEditMode ? 'Editar Serviço' : 'Criar um Novo Serviço'}</h1>
          <form onSubmit={handleSubmit} className={styles.form}>
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
            {imagePreview && (
              <div className={styles.imagePreviewContainer}>
                <img src={imagePreview} alt="Pré-visualização" className={styles.imagePreview} />
              </div>
            )}
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
              {isEditMode ? 'Revisar Alterações' : 'Revisar e Publicar'}
            </button>
          </form>
        </div>
      </div>

      <Modal isOpen={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)} title={isEditMode ? 'Confirmar Alterações' : 'Revisar seu Serviço'}>
        <div className={styles.modalBodyContent}>
          <p>Por favor, confirme os detalhes do seu serviço.</p>
          <div className={styles.summary}>
            {imagePreview && <img src={imagePreview} alt="Pré-visualização" className={styles.summaryImage} />}
            <div className={styles.summaryDetails}>
              <h4>{title || "Seu título aqui"}</h4>
              <p><strong>Categoria:</strong> {category}</p>
              <p><strong>Preço:</strong> {Number(price || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
            </div>
          </div>
          <div className={styles.modalActions}>
            <button onClick={() => setIsConfirmModalOpen(false)} className={styles.cancelButton} disabled={isUploading}>
              Voltar e Editar
            </button>
            <button onClick={handleConfirmSubmit} className={styles.confirmSubmitButton} disabled={isUploading}>
              {isUploading ? 'Enviando...' : (isEditMode ? 'Confirmar e Salvar' : 'Publicar Serviço')}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CreateService;