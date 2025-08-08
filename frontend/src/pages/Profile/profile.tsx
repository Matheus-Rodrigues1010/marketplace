import React, { useState } from "react";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState({
    name: "User da Silva",
    email: "user.silva@example.com",
    avatarUrl: "https://i.pravatar.cc/150", // Um site que gera avatares aleatórios
    joinDate: "2025-08-07T10:00:00Z",
  });

  // --- MELHORIA 2: Adicionando Interatividade ---
  const handleEditClick = () => {
    // Por enquanto, apenas um alerta.
    // No futuro, isso pode abrir um modal de edição ou navegar para a página /edit-profile.
    alert("Funcionalidade de edição a ser implementada!");
  };

  // --- MELHORIA 3: Lidando com a ausência de dados ---
  if (!user) {
    return <div className="text-center mt-10">Carregando perfil...</div>;
  }

  return (
    // Utilizando Tailwind CSS para consistência com suas outras rotas.
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl my-8 p-8">
      <div className="flex flex-col items-center">
        {/* Usando o avatar dinâmico */}
        <img
          className="h-24 w-24 rounded-full object-cover"
          src={user.avatarUrl}
          alt={`Avatar de ${user.name}`}
        />
        {/* Usando o nome dinâmico */}
        <h2 className="text-2xl font-bold mt-4">{user.name}</h2>
      </div>

      <div className="mt-6">
        <p className="text-gray-600">
          <span className="font-semibold">Email:</span> {user.email}
        </p>
        <p className="text-gray-600 mt-2">
          <span className="font-semibold">Membro desde:</span>{" "}
          {new Date(user.joinDate).toLocaleDateString("pt-BR")}
        </p>
        {/* Você pode adicionar mais campos do usuário aqui, como biografia, etc. */}
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={handleEditClick}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Editar Perfil
        </button>
      </div>
    </div>
  );
};

export default Profile;