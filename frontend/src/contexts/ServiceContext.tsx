import React, { createContext, useState, ReactNode } from 'react';

// --- 1. ATUALIZAR a interface IService para incluir 'category' ---
export interface IService {
  id: number;
  title: string;
  description: string;
  price: number;
  seller: {
    name: string;
  };
  imageUrl: string;
  category: 'Companhia' | 'Habilidades' | 'Aulas' | 'Bem-Estar'; // Categorias predefinidas
}

interface IServiceContext {
  services: IService[];
  addService: (
    newService: Omit<IService, 'id' | 'seller' | 'imageUrl'>,
    sellerName: string,
    imageUrl?: string | null
  ) => void;
}

export const ServiceContext = createContext<IServiceContext>({
  services: [],
  addService: () => {},
});

// --- 2. ATUALIZAR a lista initialServices com as novas categorias ---
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

  // AVISO: Esta função precisa ser atualizada para lidar com a categoria.
  // Faremos isso no próximo passo, após o filtro funcionar.
  const addService = (
    serviceData: Omit<IService, 'id' | 'seller' | 'imageUrl'>,
    sellerName: string,
    imageUrlParam?: string | null
  ) => {
    const newService: IService = {
      ...serviceData,
      id: Date.now(),
      seller: { name: sellerName },
      imageUrl: imageUrlParam || `https://source.unsplash.com/random/500x500?sig=${Date.now()}`,
      // Por enquanto, novos serviços são adicionados sem categoria. Vamos consertar isso.
      category: 'Habilidades', // Categoria padrão temporária
    };

    setServices(prevServices => [...prevServices, newService]);
  };

  const contextValue = {
    services,
    addService,
  };

  return (
    <ServiceContext.Provider value={contextValue}>
      {children}
    </ServiceContext.Provider>
  );
};