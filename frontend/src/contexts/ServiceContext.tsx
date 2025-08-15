import React, { createContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';
import apiUrl from '../apiConfig';
import { toast } from 'react-toastify';

// Tipos e Interfaces
export type Category = 'Companhia' | 'Habilidades' | 'Aulas' | 'Bem-Estar';

export interface IService {
  id: number;
  title: string;
  description: string;
  price: number;
  seller: { name: string; };
  seller_id?: number;
  image_url: string; // Mantemos o padrão do backend
  category: Category;
}

interface IServiceContext {
  services: IService[];
  loading: boolean;
  addService: (serviceData: any, sellerName: string, category: Category, imageUrl: string | null) => Promise<void>;
  deleteService: (serviceId: number) => Promise<void>;
  updateService: (serviceId: number, updatedData: any) => Promise<void>;
}

export const ServiceContext = createContext<IServiceContext>({
  services: [],
  loading: true,
  addService: async () => {},
  deleteService: async () => {},
  updateService: async () => {},
});

// --- DADOS DE EXEMPLO (FALLBACK) ---
// Mantemos esta lista aqui para o caso de a API não retornar nada.
const initialServices: IService[] = [
    { id: 1, title: '1h de caminhada no parque', description: 'Uma hora de caminhada relaxante...', price: 50, seller: { name: 'Carlos' }, image_url: '/images/caminhada.jpg', category: 'Bem-Estar' },
    { id: 2, title: 'Retrato a lápis', description: 'Faço um retrato realista...', price: 120, seller: { name: 'Juliana' }, image_url: '/images/retrato.jpg', category: 'Habilidades' },
    { id: 3, title: 'Meia hora de conversa empática', description: 'Um ombro amigo para desabafar...', price: 30, seller: { name: 'Beatriz' }, image_url: '/images/conversa.jpg', category: 'Companhia' },
    { id: 4, title: 'Aula de violão para iniciantes', description: 'Aprenda os primeiros acordes...', price: 75, seller: { name: 'Ricardo' }, image_url: '/images/violao.jpeg', category: 'Aulas' },
    { id: 5, title: 'Consultoria de organização de armário', description: 'Ajudo você a organizar seu guarda-roupa...', price: 150, seller: { name: 'Mariana' }, image_url: '/images/armario.jpg', category: 'Habilidades' },
    { id: 6, title: 'Companhia para um café', description: 'Ofereço uma companhia agradável...', price: 40, seller: { name: 'Lucas' }, image_url: '/images/cafe.jpeg', category: 'Companhia' },
    { id: 7, title: 'Sessão de meditação guiada online', description: 'Uma sessão de 30 minutos de meditação...', price: 60, seller: { name: 'Sofia' }, image_url: '/images/meditacao.jpg', category: 'Bem-Estar' }
];

interface ServiceProviderProps {
  children: ReactNode;
}

export const ServiceProvider: React.FC<ServiceProviderProps> = ({ children }) => {
  const [services, setServices] = useState<IService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${apiUrl}/services`);
        
        // LÓGICA DE FALLBACK: Se a API retornar um array vazio, usamos os dados fixos.
        if (res.data && res.data.length > 0) {
          // O backend não nos dá o nome do vendedor, então precisamos adaptar.
          // Em uma aplicação real, o backend faria um JOIN para incluir o nome do vendedor.
          const adaptedServices = res.data.map((service: any) => ({
            ...service,
            seller: { name: `Vendedor #${service.seller_id}` } // Placeholder
          }));
          setServices(adaptedServices);
        } else {
          setServices(initialServices); // Usa os dados fixos como fallback
        }
      } catch (err) {
        console.error("Erro ao buscar serviços, usando dados de fallback:", err);
        setServices(initialServices); // Usa os dados fixos se a API falhar
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  // --- FUNÇÕES CONECTADAS À API ---
  const addService = async (serviceData: any, sellerName: string, category: Category, imageUrl: string | null) => {
    // Renomeia imageUrl para image_url para corresponder ao backend
    const body = { ...serviceData, category, imageUrl: imageUrl };
    try {
      const res = await axios.post(`${apiUrl}/services`, body);
      const newServiceFromAPI = { ...res.data, seller: { name: sellerName } };
      setServices(prev => [...prev.filter(s => s.id > 7), newServiceFromAPI]); // Remove os dados fixos e adiciona o novo
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Erro ao criar serviço.");
      throw err;
    }
  };

  const deleteService = async (serviceId: number) => {
    try {
      await axios.delete(`${apiUrl}/services/${serviceId}`);
      setServices(prev => prev.filter(service => service.id !== serviceId));
      toast.info("Serviço excluído com sucesso.");
    } catch (err: any) {
      toast.error(err.response?.data?.msg || "Erro ao excluir serviço.");
      throw err;
    }
  };

  const updateService = async (serviceId: number, updatedData: any) => {
    // Renomeia imageUrl para image_url
    const body = { ...updatedData, imageUrl: updatedData.imageUrl };
    try {
      const res = await axios.put(`${apiUrl}/services/${serviceId}`, body);
      const updatedServiceFromAPI = { ...res.data, seller: { name: updatedData.seller?.name || "Vendedor" }};
      setServices(prev => prev.map(service => service.id === serviceId ? updatedServiceFromAPI : service));
    } catch (err: any) {
      toast.error(err.response?.data?.msg || "Erro ao atualizar serviço.");
      throw err;
    }
  };

  const contextValue = { services, loading, addService, deleteService, updateService };

  return (
    <ServiceContext.Provider value={contextValue}>
      {children}
    </ServiceContext.Provider>
  );
};