import React, { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.logo}>
        Marketplace
      </Link>

      <div className={styles.navLinks}>
        {/* Links públicos */}
        <NavLink to="/" className={({ isActive }) => isActive ? styles.active : styles.navLink}>Home</NavLink>
        <NavLink to="/services" className={({ isActive }) => isActive ? styles.active : styles.navLink}>Serviços</NavLink>

        {user ? (
          // Links para usuário logado
          <>
            <NavLink to="/create-service" className={({ isActive }) => isActive ? styles.active : styles.navLink}>Criar Serviço</NavLink>
            {/* NOVO LINK PARA "MEUS PEDIDOS" */}
            <NavLink to="/my-orders" className={({ isActive }) => isActive ? styles.active : styles.navLink}>Meus Pedidos</NavLink>
            <NavLink to="/profile" className={({ isActive }) => isActive ? styles.active : styles.navLink}>Perfil</NavLink>
            <button onClick={logout} className={styles.logoutButton}>Sair</button>
          </>
        ) : (
          // Links para visitante
          <>
            <NavLink to="/login" className={({ isActive }) => isActive ? styles.active : styles.navLink}>Login</NavLink>
            <Link to="/register" className={styles.ctaButton}>Cadastre-se</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;