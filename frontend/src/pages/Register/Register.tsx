import React, { useState, useContext } from 'react'; // Adicionar useContext
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
// Importar o AuthContext
import { AuthContext } from '../../contexts/AuthContext';
import styles from './Register.module.css'; 

const Register = () => {
  // Conectar ao contexto para obter a função 'register'
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }

    setIsLoading(true);
    try {
      // Chamar a função 'register' do contexto, que fala com a API
      await register(fullName, email, password);
      
      toast.success("Cadastro realizado com sucesso! Por favor, faça o login.");
      navigate("/login");

    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

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