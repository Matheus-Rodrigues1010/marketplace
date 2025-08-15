import React, { createContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';
import apiUrl from '../apiConfig';
import { toast } from 'react-toastify';

// Tipos e Interfaces
export type Category = 'Companhia' | 'Habilidades' | 'Aulas' | 'Bem-Estar';

// Usaremos 'imageUrl' como padrão em todo o frontend
export interface IService {
  id: number;
  title: string;
  description: string;
  price: number;
  seller: { name: string; };
  imageUrl: string; // PADRÃO DO FRONTEND
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

// --- DADOS DE EXEMPLO (FALLBACK) COM A CHAVE 'imageUrl' CORRIGIDA ---
const initialServices: IService[] = [
    { id: 1, title: '1h de caminhada no parque', description: 'Uma hora de caminhada relaxante...', price: 50, seller: { name: 'Carlos' }, imageUrl: '/images/caminhada.jpg', category: 'Bem-Estar' },
    { id: 2, title: 'Retrato a lápis', description: 'Faço um retrato realista...', price: 120, seller: { name: 'Juliana' }, imageUrl: '/images/retrato.jpg', category: 'Habilidades' },
    { id: 3, title: 'Meia hora de conversa empática', description: 'Um ombro amigo para desabafar...', price: 30, seller: { name: 'Beatriz' }, imageUrl: '/images/conversa.jpg', category: 'Companhia' },
    { id: 4, title: 'Aula de violão para iniciantes', description: 'Aprenda os primeiros acordes...', price: 75, seller: { name: 'Ricardo' }, imageUrl: '/images/violao.jpeg', category: 'Aulas' },
    { id: 5, title: 'Consultoria de organização de armário', description: 'Ajudo você a organizar seu guarda-roupa...', price: 150, seller: { name: 'Mariana' }, imageUrl: '/images/armario.jpg', category: 'Habilidades' },
    { id: 6, title: 'Companhia para um café', description: 'Ofereço uma companhia agradável...', price: 40, seller: { name: 'Lucas' }, imageUrl: '/images/cafe.jpeg', category: 'Companhia' },
    { id: 7, title: 'Sessão de meditação guiada online', description: 'Uma sessão de 30 minutos de meditação...', price: 60, seller: { name: 'Sofia' }, imageUrl: '/images/meditacao.jpg', category: 'Bem-Estar' }
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
        
        if (res.data && res.data.length > 0) {
          // ADAPTAÇÃO: Converte a resposta do backend para o formato do frontend
          const adaptedServices = res.data.map((service: any) => ({
            ...service,
            imageUrl: service.image_url, // Converte 'image_url' para 'imageUrl'
            seller: { name: `Vendedor #${service.seller_id}` }
          }));
          setServices(adaptedServices);
        } else {
          setServices(initialServices);
        }
      } catch (err) {
        console.error("Erro ao buscar serviços, usando dados de fallback:", err);
        setServices(initialServices);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  // --- FUNÇÕES CONECTADAS À API ---
  const addService = async (serviceData: any, sellerName: string, category: Category, imageUrl: string | null) => {
    const body = { ...serviceData, category, imageUrl: imageUrl };
    try {
      const res = await axios.post(`${apiUrl}/services`, body);
      // Adapta a resposta da API antes de adicionar ao estado
      const newServiceFromAPI = { ...res.data, imageUrl: res.data.image_url, seller: { name: sellerName } };
      setServices(prev => [...prev.filter(s => s.id > 7), newServiceFromAPI]);
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
    const body = { ...updatedData, imageUrl: updatedData.imageUrl };
    try {
      const res = await axios.put(`${apiUrl}/services/${serviceId}`, body);
      // Adapta a resposta da API antes de atualizar o estado
      const updatedServiceFromAPI = { ...res.data, imageUrl: res.data.image_url, seller: { name: updatedData.seller?.name || "Vendedor" }};
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