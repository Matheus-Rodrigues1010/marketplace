import React from "react";
import "./ProductDetails.css";

const ProductDetails = () => {
  return (
    <div className="product-details-container">
      {/* Seção de Imagem do Produto */}
      <div className="product-image">
        <img src="https://via.placeholder.com/500" alt="Produto" />
      </div>

      {/* Seção de Informações do Produto */}
      <div className="product-info">
        <h1>Nome do Produto</h1>
        <p>
          Descrição detalhada do produto, destacando suas características,
          benefícios e outras informações relevantes que possam auxiliar o
          cliente na decisão de compra.
        </p>
        <div className="product-price">R$ 199,99</div>
        <button className="add-to-cart-button">Adicionar ao Carrinho</button>
      </div>

      {/* Seção de Avaliações */}
      <div className="product-reviews">
        <h2>Avaliações dos Clientes</h2>
        <div className="review">
          <h3>Cliente 1</h3>
          <p>
            Ótimo produto! Atendeu todas as minhas expectativas e chegou antes
            do prazo.
          </p>
        </div>
        <div className="review">
          <h3>Cliente 2</h3>
          <p>
            Produto de excelente qualidade. Recomendo a todos que estão
            interessados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
    