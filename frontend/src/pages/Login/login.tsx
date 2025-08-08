import React, { useState, useContext } from 'react'; // 1. Importar useContext
import { Link, useNavigate } from 'react-router-dom';

// 2. Importar o nosso AuthContext
import { AuthContext } from '../../contexts/AuthContext'; 

// Importando o CSS Module (se você o criou para esta página)
// Se não, pode remover esta linha e usar Tailwind ou outro método.
import styles from './Login.module.css';

const Login = () => {
  // Estados locais para os campos do formulário e para erros
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // 3. Usar o Contexto!
  // Pegamos a função 'login' e o estado 'isLoading' diretamente do AuthContext.
  const { login, isLoading } = useContext(AuthContext);

  const navigate = useNavigate();

  // 4. Simplificar a função handleSubmit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Limpa erros antigos

    try {
      // Chama a função 'login' do CONTEXTO. 
      // A lógica de "usuario@example.com" agora está centralizada no AuthContext.
      await login(email, password);
      
      // Se a função 'login' não der erro, o login foi bem-sucedido.
      navigate('/profile'); // Redireciona o usuário para o perfil

    } catch (err: any) {
      // Se a função 'login' do contexto lançar um erro, nós o capturamos aqui.
      setError(err.message);
    }
  };

  // O JSX continua praticamente o mesmo, mas agora 'isLoading' vem do contexto global.
  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h2 className={styles.title}>Entrar</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="email"
            placeholder="Email"
            required
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
          <input
            type="password"
            placeholder="Senha"
            required
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
          
          {error && <p className={styles.error}>{error}</p>}

          <button
            type="submit"
            className={styles.button}
            disabled={isLoading}
          >
            {isLoading ? "Entrando..." : "Login"}
          </button>
        </form>
        <div className={styles.links}>
          <p>
            Não tem uma conta?{' '}
            <Link to="/register" className={styles.link}>
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;