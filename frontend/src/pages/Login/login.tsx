import React from "react";
import "./Login.css";

const Login = () => {
  return (
    <div className="login-container">
      <h2>Entrar</h2>
      <form>
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Senha" required />
        <button type="submit">Login</button>
      </form>
      <div className="additional-links">
        <p>
          <a href="/forgot-password">Esqueceu a senha?</a>
        </p>
        <p>
          Não tem uma conta? <a href="/register">Cadastre-se</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
