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
  imageUrl: string;
  category: Category;
  seller_id?: number;
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
          const adaptedServices = res.data.map((service: any) => ({
            ...service,
            imageUrl: service.image_url,
            seller: { name: service.seller_name }
          }));
          setServices(adaptedServices);
        } else {
          setServices([]);
        }
      } catch (err) {
        console.error("Erro ao buscar serviços:", err);
        toast.error("Não foi possível carregar os serviços.");
        setServices([]);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const addService = async (serviceData: any, sellerName: string, category: Category, imageUrl: string | null) => {
    const body = { ...serviceData, category, imageUrl };
    try {
      const res = await axios.post(`${apiUrl}/services`, body);
      const newServiceFromAPI = { ...res.data, imageUrl: res.data.image_url, seller: { name: sellerName } };
      setServices(prev => [...prev, newServiceFromAPI]);
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
      // Na resposta do UPDATE, o backend não faz o JOIN, então usamos o nome que já temos
      const updatedServiceFromAPI = { ...res.data, imageUrl: res.data.image_url, seller: { name: updatedData.seller.name }};
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