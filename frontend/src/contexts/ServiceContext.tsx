import React, { createContext, useState, ReactNode } from 'react';

// Tipos e Interfaces
export type Category = 'Companhia' | 'Habilidades' | 'Aulas' | 'Bem-Estar';

export interface IService {
  id: number;
  title: string;
  description: string;
  price: number;
  seller: {
    name: string;
  };
  imageUrl: string;
  category: Category;
}

// 1. ATUALIZAR a interface do contexto para incluir a função updateService
interface IServiceContext {
  services: IService[];
  addService: (
    newService: Omit<IService, 'id' | 'seller' | 'imageUrl' | 'category'>,
    sellerName: string,
    category: Category,
    imageUrl?: string | null
  ) => void;
  deleteService: (serviceId: number) => void;
  updateService: (serviceId: number, updatedData: Partial<Omit<IService, 'id' | 'seller'>>) => void; // <-- NOVA FUNÇÃO
}

// Criando o contexto com o novo valor padrão
export const ServiceContext = createContext<IServiceContext>({
  services: [],
  addService: () => {},
  deleteService: () => {},
  updateService: () => {}, // <-- VALOR PADRÃO
});

// Dados Iniciais
const initialServices: IService[] = [
    { id: 1, title: '1h de caminhada no parque', description: 'Uma hora de caminhada relaxante para conversar e exercitar.', price: 50, seller: { name: 'Carlos' }, imageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=500', category: 'Bem-Estar' },
    { id: 2, title: 'Retrato a lápis', description: 'Faço um retrato seu ou de quem você ama em grafite.', price: 120, seller: { name: 'Juliana' }, imageUrl: 'https://images.unsplash.com/photo-1582732971593-35a095a82358?w=500', category: 'Habilidades' },
    { id: 3, title: 'Meia hora de conversa', description: 'Um ombro amigo para desabafar ou trocar ideias.', price: 30, seller: { name: 'Beatriz' }, imageUrl: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=500', category: 'Companhia' },
    { id: 4, title: 'Aula de violão para iniciantes', description: 'Aprenda os primeiros acordes e músicas no violão.', price: 75, seller: { name: 'Ricardo' }, imageUrl: 'https://images.unsplash.com/photo-1550291652-6ea9114a47b1?w=500', category: 'Aulas' },
];

interface ServiceProviderProps {
  children: ReactNode;
}

export const ServiceProvider: React.FC<ServiceProviderProps> = ({ children }) => {
  const [services, setServices] = useState<IService[]>(initialServices);

  // Função addService (sem alterações)
  const addService = (
    serviceData: Omit<IService, 'id' | 'seller' | 'imageUrl' | 'category'>,
    sellerName: string,
    category: Category,
    imageUrlParam?: string | null
  ) => {
    const newService: IService = {
      ...serviceData,
      id: Date.now(),
      seller: { name: sellerName },
      imageUrl: imageUrlParam || `https://source.unsplash.com/random/500x500?sig=${Date.now()}`,
      category: category,
    };
    setServices(prevServices => [...prevServices, newService]);
  };

  // Função deleteService (sem alterações)
  const deleteService = (serviceId: number) => {
    setServices(prevServices => 
      prevServices.filter(service => service.id !== serviceId)
    );
  };

  // 2. IMPLEMENTAR a função updateService
  const updateService = (serviceId: number, updatedData: Partial<Omit<IService, 'id' | 'seller'>>) => {
    setServices(prevServices =>
      prevServices.map(service => {
        // Se o ID do serviço na lista for o mesmo que queremos atualizar...
        if (service.id === serviceId) {
          // ...retorna um novo objeto combinando o serviço antigo com os novos dados.
          return { ...service, ...updatedData };
        }
        // Senão, retorna o serviço como ele estava.
        return service;
      })
    );
  };


  // 3. ADICIONAR a nova função ao valor do contexto
  const contextValue = {
    services,
    addService,
    deleteService,
    updateService, // <-- ADICIONADO AQUI
  };

  return (
    <ServiceContext.Provider value={contextValue}>
      {children}
    </ServiceContext.Provider>
  );
};