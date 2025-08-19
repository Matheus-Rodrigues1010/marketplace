import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import apiUrl from '../apiConfig';

const setAuthToken = (token: string | null) => {
  if (token) {
    axios.defaults.headers.common['x-auth-token'] = token;
  } else {
    delete axios.defaults.headers.common['x-auth-token'];
  }
};

// --- A CORREÇÃO ESTÁ AQUI ---
// Adicionamos a propriedade opcional 'stripe_account_id' à interface do usuário.
interface IUser {
  id: number;
  name: string;
  email: string;
  avatar_url?: string;
  stripe_account_id?: string; // Propriedade para o ID da conta Stripe
}

interface IAuthContext {
  user: IUser | null;
  isLoading: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (fullName: string, email: string, password: string) => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
}

export const AuthContext = createContext<IAuthContext>({
  user: null,
  isLoading: true,
  token: null,
  login: async () => {},
  logout: () => {},
  register: async () => {},
  setUser: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadUser = async () => {
      const tokenFromStorage = localStorage.getItem('token');
      if (tokenFromStorage) {
        setAuthToken(tokenFromStorage);
        try {
          const res = await axios.get(`${apiUrl}/users/me`);
          setUser(res.data);
          setToken(tokenFromStorage);
        } catch (error) {
          localStorage.removeItem('token');
          setAuthToken(null);
        }
      }
      setIsLoading(false);
    };
    loadUser();
  }, []);

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

  const register = async (fullName: string, email: string, password: string) => {
    const config = { headers: { 'Content-Type': 'application/json' } };
    const body = JSON.stringify({ fullName, email, password });
    try {
      await axios.post(`${apiUrl}/users/register`, body, config);
    } catch (err: any) {
      throw new Error(err.response?.data?.error || 'Erro ao registrar');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setAuthToken(null);
  };

  const contextValue = { user, isLoading, token, login, logout, register, setUser };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};