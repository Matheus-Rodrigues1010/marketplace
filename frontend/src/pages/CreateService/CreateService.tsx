import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { ServiceContext } from '../../contexts/ServiceContext';
import styles from './CreateService.module.css';

const CreateService = () => {
  const { user, isLoading: isAuthLoading } = useContext(AuthContext);
  const { addService } = useContext(ServiceContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formError, setFormError] = useState('');

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

    if (!title || !description || !price || !imageFile) {
      setFormError('Todos os campos, incluindo a imagem, são obrigatórios.');
      return;
    }
    if (isNaN(Number(price)) || Number(price) <= 0) {
      setFormError('O preço deve ser um número positivo.');
      return;
    }
    if (!user) {
      setFormError('Erro: usuário não encontrado.');
      return;
    }

    const servicePayload = { title, description, price: Number(price) };
    const sellerName = user.name;
    const imageUrl = imagePreview;

    // LOG DE DEPURAÇÃO 1
    console.log('[CreateService] PRESTES A CHAMAR addService com:', servicePayload, sellerName, imageUrl);

    addService(servicePayload, sellerName, imageUrl);

    alert('Serviço criado com sucesso!');
    navigate('/services');
  };

  if (isAuthLoading || !user) {
    return (
      <div className={styles.loadingContainer}>
        <p>Verificando autorização...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h1 className={styles.title}>Criar um Novo Serviço</h1>
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
            <label htmlFor="price" className={styles.label}>Preço (R$)</label>
            <input id="price" type="number" className={styles.input} value={price} onChange={(e) => setPrice(e.target.value)} />
          </div>
          {formError && <p className={styles.error}>{formError}</p>}
          <button type="submit" className={styles.submitButton}>Publicar Serviço</button>
        </form>
      </div>
    </div>
  );
};

export default CreateService;