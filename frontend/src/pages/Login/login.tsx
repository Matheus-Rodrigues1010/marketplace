import React, { useState } from "react";
import "./Login.css"
// --- MELHORIA 1: Importar hooks e componentes necessários ---
import { Link, useNavigate } from "react-router-dom";

// Usei classes do Tailwind CSS para manter a consistência.
const Login = () => {
  // --- MELHORIA 2: Gerenciamento de Estado ---
  // Estado para cada campo do formulário
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Estado para feedback ao usuário
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Hook para navegar o usuário após o login
  const navigate = useNavigate();

  // --- MELHORIA 3: Lógica de Submissão ---
  const handleSubmit = async (e) => {
    // Previne o recarregamento padrão da página
    e.preventDefault(); 
    
    // Limpa erros antigos e inicia o estado de carregamento
    setError("");
    setIsLoading(true);

    try {
      // --- SIMULAÇÃO DE API ---
      // Aqui você faria a chamada para sua API de autenticação.
      // Estou simulando uma espera de 1 segundo.
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Lógica de validação (exemplo simples)
      if (email === "usuario@example.com" && password === "senha123") {
        console.log("Login bem-sucedido!");
        // Em um app real, você salvaria o token de autenticação aqui.
        navigate("/profile"); // Redireciona para o perfil
      } else {
        throw new Error("Credenciais inválidas. Tente novamente.");
      }
    } catch (err) {
      // Define a mensagem de erro para ser exibida na tela
      setError(err.message);
    } finally {
      // Garante que o estado de carregamento seja desativado, mesmo se der erro
      setIsLoading(false);
    }
  };

  return (
    // Container principal com Tailwind CSS
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Entrar</h2>
        
        {/* Formulário com o handler de submissão */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              placeholder="Email"
              required
              className="w-full px-4 py-2 border rounded-md"
              // --- MELHORIA 4: Conectar input ao estado (Controlled Component) ---
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading} // Desabilita durante o carregamento
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Senha"
              required
              className="w-full px-4 py-2 border rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          {/* --- MELHORIA 5: Feedback de Erro --- */}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
              disabled={isLoading} // Desabilita o botão durante o carregamento
            >
              {/* Muda o texto do botão durante o carregamento */}
              {isLoading ? "Entrando..." : "Login"}
            </button>
          </div>
        </form>

        <div className="text-sm text-center text-gray-600">
          {/* --- MELHORIA 6: Usar <Link> para navegação --- */}
          <Link to="/forgot-password" className="font-medium text-blue-500 hover:underline">
            Esqueceu a senha?
          </Link>
          <p className="mt-2">
            Não tem uma conta?{" "}
            <Link to="/register" className="font-medium text-blue-500 hover:underline">
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;