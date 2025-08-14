import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';

const Home = () => {
  return (
    <div className={styles.container}>
      {/* Seção Hero */}
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>
          Seu Tempo, Suas Habilidades, Seu Valor.
        </h1>
        <p className={styles.heroSubtitle}>
          Uma nova forma de conectar pessoas. Venda uma hora do seu tempo, uma habilidade única ou uma experiência inesquecível.
        </p>
      </section>

      {/* Seção de Inscrição Beta */}
      <section className={styles.signupSection}>
        <h2 className={styles.signupTitle}>Garanta seu Acesso à Versão Oficial!</h2>
        <p className={styles.signupText}>
          Estamos trabalhando na versão completa com mais funcionalidades e segurança. Deixe seu e-mail abaixo para ser o primeiro a saber do lançamento e garantir sua vaga.
        </p>
        <div className={styles.formEmbedContainer}>
          <iframe 
            src="https://docs.google.com/forms/d/e/1FAIpQLSd9mzMlZTq8EEc5TJzO5AQVGhffORmiS6bFzkjura9jYyxL-w/viewform?embedded=true" 
            width="100%" 
            height="350"
            
            /* --- CORREÇÃO APLICADA AQUI --- */
            frameBorder={0} // 'frameborder' virou 'frameBorder' (camelCase) e o valor é numérico
            marginHeight={0} // Valor numérico, sem aspas
            marginWidth={0} // Valor numérico, sem aspas
          >
            Carregando…
          </iframe>
        </div>
      </section>

      {/* Seção de Exploração da Versão de Testes */}
      <section className={styles.betaInfo}>
        <h2 className={styles.betaTitle}>Enquanto Isso, Explore a Versão de Testes</h2>
        <p className={styles.betaText}>
          Este protótipo é totalmente funcional. Para facilitar, use as credenciais abaixo ou crie sua própria conta de teste.
        </p>
        <div className={styles.demoCredentials}>
          <div className={styles.credentialsBox}>
            <p><strong>Email:</strong> <span>usuario@example.com</span></p>
            <p><strong>Senha:</strong> <span>senha123</span></p>
          </div>
          <Link to="/login" className={styles.loginButton}>
            Entrar com Usuário de Teste
          </Link>
        </div>
      </section>
      
      {/* Seção "Como Funciona" */}
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

      {/* Seção Final CTA */}
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