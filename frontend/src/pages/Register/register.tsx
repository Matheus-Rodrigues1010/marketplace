import React, { useState } from "react";
// Importando os hooks e componentes necessários
import { Link, useNavigate } from "react-router-dom";

// Utilizando Tailwind CSS para consistência visual
const Register = () => {
  // --- MELHORIA 1: Estado para cada campo do formulário ---
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Estado para feedback (erro e carregamento)
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  // --- MELHORIA 2: Lógica de Submissão e Validação ---
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previne o recarregamento da página
    setError(""); // Limpa erros anteriores

    // --- MELHORIA 3: Validação de Senha ---
    // Etapa crucial antes de enviar os dados
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return; // Interrompe a execução da função
    }

    setIsLoading(true);

    try {
      // --- SIMULAÇÃO DE CHAMADA DE API PARA REGISTRO ---
      console.log("Registrando usuário:", { fullName, email });
      // Simula o tempo de resposta da rede
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      
      // Se a "API" responder com sucesso:
      // Idealmente, você mostraria uma mensagem de sucesso antes de navegar.
      alert("Cadastro realizado com sucesso! Você será redirecionado para o login.");
      navigate("/login"); // Redireciona para a página de login

    } catch (err) {
      // Em um caso real, o erro poderia vir da API (ex: email já cadastrado)
      setError("Ocorreu um erro ao tentar realizar o cadastro. Tente novamente.");
    } finally {
      setIsLoading(false); // Garante que o loading seja desativado
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Cadastre-se</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* --- MELHORIA 4: Inputs controlados --- */}
          <input type="text" placeholder="Nome Completo" required className="w-full px-4 py-2 border rounded-md"
            value={fullName} onChange={(e) => setFullName(e.target.value)} disabled={isLoading} />
          
          <input type="email" placeholder="Email" required className="w-full px-4 py-2 border rounded-md"
            value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} />
          
          <input type="password" placeholder="Senha" required className="w-full px-4 py-2 border rounded-md"
            value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} />
            
          <input type="password" placeholder="Confirme a Senha" required className="w-full px-4 py-2 border rounded-md"
            value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={isLoading} />
          
          {/* --- MELHORIA 5: Feedback de Erro --- */}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button type="submit" className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
            disabled={isLoading}>
            {isLoading ? "Registrando..." : "Registrar"}
          </button>
        </form>

        <div className="text-sm text-center text-gray-600">
          <p>
            Já tem uma conta?{" "}
            {/* --- MELHORIA 6: Navegação correta com <Link> --- */}
            <Link to="/login" className="font-medium text-blue-500 hover:underline">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;