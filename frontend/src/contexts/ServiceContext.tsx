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

interface IServiceContext {
  services: IService[];
  addService: (
    newService: Omit<IService, 'id' | 'seller' | 'imageUrl' | 'category'>,
    sellerName: string,
    category: Category,
    imageUrl?: string | null
  ) => void;
  deleteService: (serviceId: number) => void;
  updateService: (serviceId: number, updatedData: Partial<Omit<IService, 'id' | 'seller'>>) => void;
}

export const ServiceContext = createContext<IServiceContext>({
  services: [],
  addService: () => {},
  deleteService: () => {},
  updateService: () => {},
});

// --- LISTA DE DADOS MAPEADA EXATAMENTE PARA SEUS ARQUIVOS ---
const initialServices: IService[] = [
    { 
      id: 1, 
      title: '1h de caminhada no parque', 
      description: 'Uma hora de caminhada relaxante para conversar e aproveitar a natureza.', 
      price: 50, 
      seller: { name: 'Carlos' }, 
      imageUrl: '/images/caminhada.jpg', // Corresponde a caminhada.jpg
      category: 'Bem-Estar' 
    },
    { 
      id: 2, 
      title: 'Retrato a lápis', 
      description: 'Faço um retrato realista seu ou de quem você ama em grafite.', 
      price: 120, 
      seller: { name: 'Juliana' }, 
      imageUrl: '/images/retrato.jpg', // Corresponde a retrato.jpg
      category: 'Habilidades' 
    },
    { 
      id: 3, 
      title: 'Meia hora de conversa empática', 
      description: 'Um ombro amigo para desabafar, organizar as ideias ou simplesmente ter uma conversa leve.', 
      price: 30, 
      seller: { name: 'Beatriz' }, 
      imageUrl: '/images/conversa.jpg', // Corresponde a conversa.jpg
      category: 'Companhia' 
    },
    { 
      id: 4, 
      title: 'Aula de violão para iniciantes', 
      description: 'Aprenda os primeiros acordes e suas primeiras músicas no violão.', 
      price: 75, 
      seller: { name: 'Ricardo' }, 
      imageUrl: '/images/violao.jpeg', // Corresponde a violao.jpeg
      category: 'Aulas' 
    },
    {
      id: 5,
      title: 'Consultoria de organização de armário',
      description: 'Ajudo você a organizar seu guarda-roupa, otimizando espaços.',
      price: 150,
      seller: { name: 'Mariana' },
      imageUrl: '/images/armario.jpg', // Corresponde a armario.jpg
      category: 'Habilidades'
    },
    {
      id: 6,
      title: 'Companhia para um café',
      description: 'Ofereço uma companhia agradável para um momento relaxante.',
      price: 40,
      seller: { name: 'Lucas' },
      imageUrl: '/images/cafe.jpeg', // Corresponde a cafe.jpeg
      category: 'Companhia'
    },
    {
      id: 7,
      title: 'Sessão de meditação guiada online',
      description: 'Uma sessão de 30 minutos de meditação guiada para aliviar o estresse.',
      price: 60,
      seller: { name: 'Sofia' },
      imageUrl: '/images/meditacao.jpg', // Corresponde a meditacao.jpg
      category: 'Bem-Estar'
    }
];

interface ServiceProviderProps {
  children: ReactNode;
}

export const ServiceProvider: React.FC<ServiceProviderProps> = ({ children }) => {
  const [services, setServices] = useState<IService[]>(initialServices);

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
      imageUrl: imageUrlParam || '/images/caminhada.jpg', // Fallback para novos serviços
      category: category,
    };
    setServices((prevServices) => [...prevServices, newService]);
  };

  const deleteService = (serviceId: number) => {
    setServices((prevServices) => 
      prevServices.filter((service) => service.id !== serviceId)
    );
  };

  const updateService = (serviceId: number, updatedData: Partial<Omit<IService, 'id' | 'seller'>>) => {
    setServices((prevServices) =>
      prevServices.map((service) => {
        if (service.id === serviceId) {
          return { ...service, ...updatedData };
        }
        return service;
      })
    );
  };

  const contextValue = {
    services,
    addService,
    deleteService,
    updateService,
  };

  return (
    <ServiceContext.Provider value={contextValue}>
      {children}
    </ServiceContext.Provider>
  );
};