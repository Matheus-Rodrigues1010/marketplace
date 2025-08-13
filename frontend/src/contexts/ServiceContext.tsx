import React, { createContext, useState, ReactNode } from 'react';

// Tipos e Interfaces (sem alterações)
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

// --- ATUALIZAÇÃO PRINCIPAL AQUI ---
// Lista de serviços iniciais expandida e com a imagem corrigida
const initialServices: IService[] = [
    { 
      id: 1, 
      title: '1h de caminhada no parque', 
      description: 'Uma hora de caminhada relaxante para conversar, desabafar ou simplesmente aproveitar a natureza. O ritmo é seu!', 
      price: 50, 
      seller: { name: 'Carlos' }, 
      imageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=500&q=80', 
      category: 'Bem-Estar' 
    },
    { 
      id: 2, 
      title: 'Retrato a lápis', 
      description: 'Faço um retrato realista seu ou de quem você ama em grafite sobre papel Canson A4. Envio digitalizado em alta resolução.', 
      price: 120, 
      seller: { name: 'Juliana' }, 
      // URL da imagem corrigida para uma que funciona
      imageUrl: 'https://images.unsplash.com/photo-1596756187295-a548e08a0df7?w=500&q=80', 
      category: 'Habilidades' 
    },
    { 
      id: 3, 
      title: 'Meia hora de conversa empática', 
      description: 'Um ombro amigo para desabafar, organizar as ideias ou simplesmente ter uma conversa leve. Total sigilo e empatia.', 
      price: 30, 
      seller: { name: 'Beatriz' }, 
      imageUrl: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=500&q=80', 
      category: 'Companhia' 
    },
    { 
      id: 4, 
      title: 'Aula de violão para iniciantes', 
      description: 'Aprenda os primeiros acordes e suas primeiras músicas no violão. Aula focada na prática e na diversão.', 
      price: 75, 
      seller: { name: 'Ricardo' }, 
      imageUrl: 'https://images.unsplash.com/photo-1550291652-6ea9114a47b1?w=500&q=80', 
      category: 'Aulas' 
    },
    // --- NOVOS SERVIÇOS ADICIONADOS ---
    {
      id: 5,
      title: 'Consultoria de organização de armário',
      description: 'Ajudo você a organizar seu guarda-roupa, otimizando espaços e facilitando a escolha das suas roupas no dia a dia.',
      price: 150,
      seller: { name: 'Mariana' },
      imageUrl: 'https://images.unsplash.com/photo-1590482424227-24831206c137?w=500&q=80',
      category: 'Habilidades'
    },
    {
      id: 6,
      title: 'Companhia para um café',
      description: 'Quer conhecer um café novo ou apenas ter uma boa conversa? Ofereço uma companhia agradável para um momento relaxante.',
      price: 40,
      seller: { name: 'Lucas' },
      imageUrl: 'https://images.unsplash.com/photo-1511920183353-3c9c6b71f209?w=500&q=80',
      category: 'Companhia'
    },
    {
      id: 7,
      title: 'Sessão de meditação guiada online',
      description: 'Uma sessão de 30 minutos de meditação guiada por vídeo-chamada para aliviar o estresse e a ansiedade.',
      price: 60,
      seller: { name: 'Sofia' },
      imageUrl: 'https://images.unsplash.com/photo-1601779143934-2a1491a13a28?w=500&q=80',
      category: 'Bem-Estar'
    }
];

// O resto do arquivo (ServiceProvider, funções addService, deleteService, updateService) continua exatamente o mesmo.
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
      imageUrl: imageUrlParam || `https://source.unsplash.com/random/500x500?sig=${Date.now()}`,
      category: category,
    };
    setServices(prevServices => [...prevServices, newService]);
  };

  const deleteService = (serviceId: number) => {
    setServices(prevServices => 
      prevServices.filter(service => service.id !== serviceId)
    );
  };

  const updateService = (serviceId: number, updatedData: Partial<Omit<IService, 'id' | 'seller'>>) => {
    setServices(prevServices =>
      prevServices.map(service => {
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