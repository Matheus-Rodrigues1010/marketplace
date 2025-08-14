import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';

const Home = () => {
  return (
    <div className={styles.container}>
      {/* Seção Principal (Hero) */}
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>
          Seu Tempo, Suas Habilidades, Seu Valor.
        </h1>
        <p className={styles.heroSubtitle}>
          Uma nova forma de conectar pessoas. Venda uma hora do seu tempo, uma habilidade única ou uma experiência inesquecível.
        </p>
        <Link 
          to="/services" 
          className={`${styles.ctaButton} ${styles.primaryButton}`}
        >
          Explore os Serviços
        </Link>
      </section>

      {/* Seção de Informações da Versão Beta */}
      <section className={styles.betaInfo}>
        <h2 className={styles.betaTitle}>Bem-vindo à Versão Beta!</h2>
        <p className={styles.betaText}>
          Este é um protótipo funcional para demonstrar a ideia. Sinta-se à vontade para explorar, criar serviços e simular contratações. Seu feedback é muito valioso!
        </p>
        <div className={styles.demoCredentials}>
          <p>Para testar, use as credenciais abaixo ou crie sua própria conta.</p>
          <div className={styles.credentialsBox}>
            <p><strong>Email:</strong> <span>usuario@example.com</span></p>
            <p><strong>Senha:</strong> <span>senha123</span></p>
          </div>
        </div>
      </section>

      {/* Seção "Como Funciona" Dividida */}
      <section className={styles.howItWorks}>
        <div className={styles.column}>
          <h3 className={styles.columnTitle}>Para Vendedores</h3>
          <p>Transforme seu tempo e talento em renda. Crie um anúncio, defina seu preço e conecte-se com pessoas que precisam do que você oferece. É simples, flexível e gratificante.</p>
        </div>
        <div className={styles.column}>
          <h3 className={styles.columnTitle}>Para Compradores</h3>
          <p>Encontre ajuda, companhia ou aprenda algo novo. Contrate pessoas para tarefas do dia a dia, para ter uma conversa interessante ou para te ensinar uma nova habilidade.</p>
        </div>
      </section>

      {/* Seção Final de Chamada para Ação */}
      <section className={styles.finalCta}>
        <h2 className={styles.sectionTitle}>Pronto para Começar?</h2>
        <div className={styles.buttonContainer}>
          <Link to="/services" className={styles.ctaButton}>Ver todos os serviços</Link>
          <Link to="/register" className={`${styles.ctaButton} ${styles.secondaryButton}`}>Quero vender meu tempo</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} Marketplace. Versão Beta.</p>
      </footer>
    </div>
  );
};

export default Home;