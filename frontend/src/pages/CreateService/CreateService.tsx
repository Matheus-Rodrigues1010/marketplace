import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// 1. Importar AMBOS os contextos
import { AuthContext } from '../../contexts/AuthContext';
import { ServiceContext } from '../../contexts/ServiceContext';
import styles from './CreateService.module.css';

const CreateService = () => {
  // Pegamos o que precisamos de cada contexto
  const { user, isLoading: isAuthLoading } = useContext(AuthContext);
  const { addService } = useContext(ServiceContext); // 2. Pegamos a função addService

  const navigate = useNavigate();

  // Estados locais do formulário (sem alterações)
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [formError, setFormError] = useState('');

  // Lógica de proteção da rota (sem alterações)
  useEffect(() => {
    if (isAuthLoading) return;
    if (!user) {
      navigate('/login');
    }
  }, [user, isAuthLoading, navigate]);

  // 3. ATUALIZAR a função handleSubmit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!title || !description || !price) {
      setFormError('Todos os campos são obrigatórios.');
      return;
    }
    if (isNaN(Number(price)) || Number(price) <= 0) {
      setFormError('O preço deve ser um número positivo.');
      return;
    }

    if (!user) {
      setFormError('Erro: usuário não encontrado. Por favor, faça login novamente.');
      return;
    }

    // A CHAMADA CRÍTICA: Chamamos a função do CONTEXTO para adicionar o serviço.
    addService(
      { title, description, price: Number(price) },
      user.name
    );

    alert('Serviço criado com sucesso!');

    // 4. Redirecionar o usuário para a página de serviços para ver o resultado
    navigate('/services');
  };

  // Renomeei 'isLoading' para 'isAuthLoading' para evitar conflito de nomes
  if (isAuthLoading || !user) {
    return (
      <div className={styles.loadingContainer}>
        <p>Verificando autorização...</p>
      </div>
    );
  }

  // O JSX do formulário continua exatamente o mesmo
  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h1 className={styles.title}>Criar um Novo Serviço</h1>
        <p className={styles.subtitle}>
          Preencha o formulário abaixo para oferecer seu tempo e suas habilidades.
        </p>
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* ... todo o JSX do formulário está correto e continua aqui ... */}
          <div className={styles.formGroup}>
            <label htmlFor="title" className={styles.label}>Título do Serviço</label>
            <input
              type="text"
              id="title"
              className={styles.input}
              placeholder="Ex: 1h de conversa amigável"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="description" className={styles.label}>Descrição Detalhada</label>
            <textarea
              id="description"
              className={styles.textarea}
              placeholder="Descreva o que você oferece, o que está incluso, etc."
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="price" className={styles.label}>Preço (R$)</label>
            <input
              type="number"
              id="price"
              className={styles.input}
              placeholder="Ex: 50.00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          {formError && <p className={styles.error}>{formError}</p>}
          <button type="submit" className={styles.submitButton}>
            Publicar Serviço
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateService;