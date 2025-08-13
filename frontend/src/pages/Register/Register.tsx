import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// 1. Importar os estilos
import styles from './Register.module.css'; 

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setIsLoading(true);

    try {
      console.log("Registrando usuário:", { fullName, email });
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      
      alert("Cadastro realizado com sucesso! Você será redirecionado para o login.");
      navigate("/login");

    } catch (err) {
      setError("Ocorreu um erro ao tentar realizar o cadastro. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Aplicar as classes de estilo no JSX
  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h2 className={styles.title}>Cadastre-se</h2>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <input type="text" placeholder="Nome Completo" required className={styles.input}
            value={fullName} onChange={(e) => setFullName(e.target.value)} disabled={isLoading} />
          
          <input type="email" placeholder="Email" required className={styles.input}
            value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} />
          
          <input type="password" placeholder="Senha" required className={styles.input}
            value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} />
            
          <input type="password" placeholder="Confirme a Senha" required className={styles.input}
            value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={isLoading} />
          
          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.button} disabled={isLoading}>
            {isLoading ? "Registrando..." : "Registrar"}
          </button>
        </form>

        <div className={styles.links}>
          <p>
            Já tem uma conta?{" "}
            <Link to="/login" className={styles.link}>
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
