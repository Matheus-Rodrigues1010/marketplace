import React from 'react';
import { Link } from 'react-router-dom';

// Importe o seu arquivo de CSS Module
import styles from './Home.module.css';

export default function Home() {
  return (
    // Em vez de strings, usamos o objeto 'styles' para acessar as classes
    <div className={styles.container}>
      {/* 1. Hero Section */}
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>
          Seu Tempo, Suas Habilidades, Seu Valor.
        </h1>
        <p className={styles.heroSubtitle}>
          Conectamos pessoas que precisam de ajuda com quem pode oferecer. Venda uma hora do seu tempo, uma habilidade única ou uma experiência inesquecível.
        </p>
        <div className={styles.buttonContainer}>
          {/* Combinamos duas classes para o botão: a base e a de cor */}
          <Link 
            to="/services" 
            className={`${styles.ctaButton} ${styles.primaryButton}`}
          >
            Explore Serviços Agora
          </Link>
          <Link 
            to="/register" 
            className={`${styles.ctaButton} ${styles.secondaryButton}`}
          >
            Quero Vender Meu Tempo
          </Link>
        </div>
        <p className={styles.loginLinkContainer}>
          Já tem uma conta?{' '}
          <Link to="/login" className={styles.loginLink}>
            Faça Login
          </Link>
        </p>
      </section>

      {/* 2. Seção "Como Funciona" */}
      <section className={styles.howItWorks}>
        <h2 className={styles.sectionTitle}>É simples, rápido e humano.</h2>
        <div className={styles.featuresGrid}>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>🔍</div>
            <h3 className={styles.featureTitle}>Encontre o que Precisa</h3>
            <p className={styles.featureText}>Navegue por dezenas de serviços únicos, de uma caminhada no parque a uma aula de violão.</p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>🤝</div>
            <h3 className={styles.featureTitle}>Contrate com Segurança</h3>
            <p className={styles.featureText}>Converse com o vendedor, agende o melhor horário e pague com segurança pela nossa plataforma.</p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>❤️</div>
            <h3 className={styles.featureTitle}>Compartilhe e Ganhe</h3>
            <p className={styles.featureText}>Tem um talento ou tempo livre? Crie seu anúncio e comece a ganhar dinheiro fazendo o que gosta.</p>
          </div>
        </div>
      </section>

      {/* Você pode continuar o resto das seções seguindo o mesmo padrão */}
    </div>
  );
}