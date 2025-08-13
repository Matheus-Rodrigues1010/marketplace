import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// 1. Importar o 'toast'
import { toast } from 'react-toastify';
import { AuthContext } from '../../contexts/AuthContext';
import { ServiceContext, Category } from '../../contexts/ServiceContext';
import styles from './CreateService.module.css';

// ... (availableCategories e o resto do componente até o handleSubmit)

const availableCategories: Category[] = ['Habilidades', 'Companhia', 'Aulas', 'Bem-Estar'];

const CreateService = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  const { user, isLoading: isAuthLoading } = useContext(AuthContext);
  const { services, addService, updateService } = useContext(ServiceContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [category, setCategory] = useState<Category>(availableCategories[0]);
  const [formError, setFormError] = useState('');

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
        toast.error('Serviço não encontrado!'); // Usando toast para erro
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!title || !description || !price || !category) {
      setFormError('Todos os campos são obrigatórios.');
      return;
    }
    if (!user) { return; }

    if (isEditMode) {
      updateService(Number(id), {
        title, description, price: Number(price), category,
        imageUrl: imagePreview || '', 
      });
      // 2. Substituir alert por toast.success
      toast.success('Serviço atualizado com sucesso!');
      navigate('/profile');

    } else {
      if (!imageFile) {
        setFormError('A imagem é obrigatória para criar um novo serviço.');
        return;
      }
      addService(
        { title, description, price: Number(price) },
        user.name,
        category,
        imagePreview
      );
      // 3. Substituir alert por toast.success
      toast.success('Serviço criado com sucesso!');
      navigate('/services');
    }
  };

  if (isAuthLoading || !user) {
    return <div className={styles.loadingContainer}>...</div>;
  }

  // O JSX do formulário continua o mesmo
  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h1 className={styles.title}>{isEditMode ? 'Editar Serviço' : 'Criar um Novo Serviço'}</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* ... todo o JSX do formulário ... */}
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
            {isEditMode ? 'Salvar Alterações' : 'Publicar Serviço'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateService;