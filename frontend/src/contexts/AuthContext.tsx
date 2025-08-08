import React, { createContext, useState, ReactNode } from 'react';

// --- 1. Definindo os Tipos (O Contrato) ---

// O formato do nosso objeto de usuário
interface IUser {
  id: number;
  name: string;
  email: string;
}

// O que nosso contexto vai fornecer para os componentes
interface IAuthContext {
  user: IUser | null; // O usuário pode estar logado (IUser) ou não (null)
  isLoading: boolean; // Para sabermos se uma operação de login está em andamento
  login: (email: string, password: string) => Promise<void>; // Função para fazer login
  logout: () => void; // Função para fazer logout
}

// --- 2. Criando o Contexto ---

// Criamos o contexto com um valor padrão. 
// Isso evita erros caso um componente tente usar o contexto sem um Provedor.
export const AuthContext = createContext<IAuthContext>({
  user: null,
  isLoading: false,
  login: async () => {},
  logout: () => {},
});


// --- 3. Criando o Provedor (O Componente "Mágico") ---

// Este componente vai "prover" o contexto para toda a aplicação.
// Ele precisa de 'children' para poder envolver outros componentes.
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // O estado que vai guardar as informações do usuário
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // A função de login que os componentes vão chamar
  const login = async (email: string, password: string) => {
    setIsLoading(true);

    // SIMULAÇÃO DE API: Mantemos a mesma lógica por enquanto
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simula a espera da rede

      if (email === 'usuario@example.com' && password === 'senha123') {
        const loggedInUser: IUser = {
          id: 1,
          name: 'Ana Silva',
          email: 'usuario@example.com',
        };
        setUser(loggedInUser); // ATUALIZA O ESTADO GLOBAL!
      } else {
        // Lança um erro que será pego no componente de Login
        throw new Error('Credenciais inválidas.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // A função de logout
  const logout = () => {
    setUser(null); // Simplesmente limpa o estado do usuário
  };

  // O valor que será compartilhado com todos os componentes filhos
  const contextValue = {
    user,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};