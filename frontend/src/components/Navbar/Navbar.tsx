import React, { useContext } from 'react';
// Usaremos NavLink em vez de Link para obter o estilo de "link ativo"
import { Link, NavLink } from 'react-router-dom';

// Importando nosso contexto e estilos
import { AuthContext } from '../../contexts/AuthContext';
import styles from './Navbar.module.css';

const Navbar = () => {
  // Conectando ao contexto para saber se há um usuário e para usar a função de logout
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className={styles.navbar}>
      {/* Logo que sempre leva para a Home */}
      <Link to="/" className={styles.logo}>
        Marketplace
      </Link>

      {/* Container para os links de navegação */}
      <div className={styles.navLinks}>
        {/* Links que aparecem para todos */}
        <NavLink 
          to="/" 
          className={({ isActive }) => isActive ? styles.active : styles.navLink}
        >
          Home
        </NavLink>
        <NavLink 
          to="/services" 
          className={({ isActive }) => isActive ? styles.active : styles.navLink}
        >
          Serviços
        </NavLink>

        {/* --- Lógica Condicional --- */}
        {user ? (
          // Se houver um usuário logado:
          <>
            <NavLink 
              to="/profile" 
              className={({ isActive }) => isActive ? styles.active : styles.navLink}
            >
              Perfil
            </NavLink>
            <button onClick={logout} className={styles.logoutButton}>
              Sair
            </button>
          </>
        ) : (
          // Se NÃO houver um usuário logado:
          <>
            <NavLink 
              to="/login" 
              className={({ isActive }) => isActive ? styles.active : styles.navLink}
            >
              Login
            </NavLink>
            <Link to="/register" className={styles.ctaButton}>
              Cadastre-se
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;