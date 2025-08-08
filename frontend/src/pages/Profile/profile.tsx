import React from "react";
import "./Profile.css";

const Profile = () => {
  return (
    <div className="profile-container">
      <div className="user-info">
        <img src="user-avatar.jpg" alt="Avatar do Usuário" />
        <h2>Nome do Usuário</h2>
      </div>
      <div className="user-details">
        <p>Email: usuario@example.com</p>
        <p>Data de Cadastro: 01/01/2025</p>
        {/* Adicione mais detalhes conforme necessário */}
      </div>
      <button className="edit-profile-button">Editar Perfil</button>
    </div>
  );
};

export default Profile;
