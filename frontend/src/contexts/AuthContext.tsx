import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import apiUrl from '../apiConfig';

// Função para configurar o token JWT nos cabeçalhos padrão do axios
// Isso garante que cada requisição futura já envie o token.
const setAuthToken = (token: string | null) => {
  if (token) {
    axios.defaults.headers.common['x-auth-token'] = token;
  } else {
    delete axios.defaults.headers.common['x-auth-token'];
  }
};

// Interfaces (sem alterações)
interface IUser {
  id: number;
  name: string;
  email: string;
}

interface IAuthContext {
  user: IUser | null;
  isLoading: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (fullName: string, email: string, password: string) => Promise<void>;
}

export const AuthContext = createContext<IAuthContext>({
  user: null,
  isLoading: true,
  token: null,
  login: async () => {},
  logout: () => {},
  register: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Efeito para carregar o usuário se um token existir no localStorage
  useEffect(() => {
    const tokenFromStorage = localStorage.getItem('token');
    if (tokenFromStorage) {
      try {
        const decoded = JSON.parse(atob(tokenFromStorage.split('.')[1]));
        // Verifica se o token não expirou
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem('token');
        } else {
          setToken(tokenFromStorage);
          setAuthToken(tokenFromStorage);
          setUser(decoded.user);
        }
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
    setIsLoading(false);
  }, []);

  // Função de LOGIN conectada à API
  const login = async (email: string, password: string) => {
    const config = { headers: { 'Content-Type': 'application/json' } };
    const body = JSON.stringify({ email, password });

    try {
      const res = await axios.post(`${apiUrl}/users/login`, body, config);
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      setAuthToken(res.data.token);
    } catch (err: any) {
      logout();
      throw new Error(err.response?.data?.error || 'Erro ao fazer login');
    }
  };

  // Função de REGISTRO conectada à API
  const register = async (fullName: string, email: string, password: string) => {
    const config = { headers: { 'Content-Type': 'application/json' } };
    const body = JSON.stringify({ fullName, email, password });

    try {
      // Não precisamos do retorno aqui, apenas de sucesso ou erro
      await axios.post(`${apiUrl}/users/register`, body, config);
    } catch (err: any) {
      throw new Error(err.response?.data?.error || 'Erro ao registrar');
    }
  };

  // Função de LOGOUT (limpa tudo)
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setAuthToken(null);
  };

  const contextValue = { user, isLoading, token, login, logout, register };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};