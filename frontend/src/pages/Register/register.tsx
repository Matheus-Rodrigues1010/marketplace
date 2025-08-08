import React from "react";
import "./Register.css";

const Register = () => {
  return (
    <div className="register-container">
      <h2>Cadastre-se</h2>
      <form>
        <input type="text" placeholder="Nome Completo" required />
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Senha" required />
        <input type="password" placeholder="Confirme a Senha" required />
        <button type="submit">Registrar</button>
      </form>
      <div className="additional-links">
        <p>
          Já tem uma conta? <a href="/login">Entrar</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
