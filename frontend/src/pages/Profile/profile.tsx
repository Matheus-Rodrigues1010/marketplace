import React, { useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// 1. Importar o AuthContext e os estilos
import { AuthContext } from '../../contexts/AuthContext';
import styles from './Profile.module.css';

const Profile = () => {
  // 2. Usar o contexto para pegar o usuário e a função de logout
  const { user, logout, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  // 3. PROTEGER A ROTA: Efeito que roda ao carregar o componente
  useEffect(() => {
    // Se o carregamento inicial ainda não terminou, não faça nada
    if (isLoading) {
      return;
    }
    // Se o carregamento terminou E não há usuário, redirecione para o login
    if (!user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]); // Roda sempre que uma dessas variáveis mudar

  // Função para lidar com o clique no botão de logout
  const handleLogout = () => {
    logout(); // Chama a função de logout do contexto
    // navigate('/'); // O redirecionamento já acontece no useEffect, mas pode ser explícito aqui também
  };

  // 4. Exibir um estado de carregamento enquanto o contexto verifica o usuário
  if (isLoading || !user) {
    return <div className={styles.loading}>Carregando perfil...</div>;
  }
  
  // 5. Se chegamos aqui, temos um usuário! Exiba suas informações.
  return (
    <div className={styles.container}>
      <div className={styles.profileCard}>
        <img
          // Usando um avatar genérico por enquanto
          src={`https://api.pravatar.cc/150?u=${user.email}`}
          alt={`Avatar de ${user.name}`}
          className={styles.avatar}
        />
        <h2 className={styles.name}>{user.name}</h2>
        <p className={styles.email}>{user.email}</p>

        <div className={styles.details}>
          <p className={styles.detailItem}>
            <span>ID do Usuário:</span> {user.id}
          </p>
          <p className={styles.detailItem}>
            <span>Status:</span> Conectado
          </p>
        </div>

        <button onClick={handleLogout} className={styles.logoutButton}>
          Sair (Logout)
        </button>
      </div>
    </div>
  );
};

export default Profile;