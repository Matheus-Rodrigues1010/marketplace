import React, { createContext, useState, useEffect, ReactNode } from 'react';

// --- Nenhuma mudança nos tipos ---
interface IUser {
  id: number;
  name: string;
  email: string;
}

interface IAuthContext {
  user: IUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<IAuthContext>({
  user: null,
  isLoading: false,
  login: async () => {},
  logout: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  // --- MUDANÇA 1: Começar como 'true' para dar tempo de verificar o localStorage ---
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // --- MUDANÇA 2: Novo useEffect para carregar o usuário do localStorage ao iniciar ---
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        // Se encontrarmos um usuário, o colocamos no estado
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        localStorage.removeItem('user');
      }
    }
    // Independente de encontrar um usuário ou não, terminamos o carregamento inicial.
    setIsLoading(false);
  }, []); // O array vazio [] garante que isso rode apenas uma vez, no início.

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (email === 'usuario@example.com' && password === 'senha123') {
        const loggedInUser: IUser = {
          id: 1,
          name: 'Ana Silva',
          email: 'usuario@example.com',
        };
        setUser(loggedInUser);
        // --- MUDANÇA 3: Salvar o usuário no localStorage ---
        localStorage.setItem('user', JSON.stringify(loggedInUser));
      } else {
        throw new Error('Credenciais inválidas.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    // --- MUDANÇA 4: Remover o usuário do localStorage ---
    localStorage.removeItem('user');
  };

  const contextValue = { user, isLoading, login, logout };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};