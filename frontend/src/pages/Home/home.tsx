import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <div className="container">
      <header>
        <h1>Bem-vindo ao Marketplace Manaus</h1>
      </header>
      <main>
        <div className="product-grid">
          {/* Produto 1 */}
          <div className="product-card">
            <img src="https://via.placeholder.com/280x200" alt="Produto 1" />
            <div className="product-content">
              <h3>Produto 1</h3>
              <p>Descrição breve do produto.</p>
              <button>Ver Detalhes</button>
            </div>
          </div>

          {/* Produto 2 */}
          <div className="product-card">
            <img src="https://via.placeholder.com/280x200" alt="Produto 2" />
            <div className="product-content">
              <h3>Produto 2</h3>
              <p>Descrição breve do produto.</p>
              <button>Ver Detalhes</button>
            </div>
          </div>

          {/* Produto 3 */}
          <div className="product-card">
            <img src="https://via.placeholder.com/280x200" alt="Produto 3" />
            <div className="product-content">
              <h3>Produto 3</h3>
              <p>Descrição breve do produto.</p>
              <button>Ver Detalhes</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
