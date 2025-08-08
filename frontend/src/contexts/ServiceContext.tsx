import React, { createContext, useState, ReactNode } from 'react';

// --- 1. Definindo os Tipos ---

// Reutilizamos a interface IService que já definimos antes.
// O ideal seria tê-la em um arquivo de tipos compartilhado, mas por enquanto isso funciona.
interface IService {
  id: number;
  title: string;
  description: string;
  price: number;
  seller: {
    name: string;
  };
  imageUrl: string;
}

// O que nosso contexto de serviços vai fornecer
interface IServiceContext {
  services: IService[];
  addService: (newService: Omit<IService, 'id' | 'seller' | 'imageUrl'>, sellerName: string) => void;
}

// --- 2. Criando o Contexto ---

export const ServiceContext = createContext<IServiceContext>({
  services: [],
  addService: () => {},
});

// --- 3. Dados Iniciais (Mock) ---
// Trazemos a lista mock para dentro do contexto, pois ele será o dono desses dados.
const initialServices: IService[] = [
  { id: 1, title: '1h de caminhada no parque', description: 'Uma hora de caminhada relaxante para conversar e exercitar.', price: 50, seller: { name: 'Carlos' }, imageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=500' },
  { id: 2, title: 'Retrato a lápis', description: 'Faço um retrato seu ou de quem você ama em grafite.', price: 120, seller: { name: 'Juliana' }, imageUrl: 'https://images.unsplash.com/photo-1582732971593-35a095a82358?w=500' },
  { id: 3, title: 'Meia hora de conversa', description: 'Um ombro amigo para desabafar ou trocar ideias.', price: 30, seller: { name: 'Beatriz' }, imageUrl: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=500' },
];

// --- 4. Criando o Provedor ---

interface ServiceProviderProps {
  children: ReactNode;
}

export const ServiceProvider: React.FC<ServiceProviderProps> = ({ children }) => {
  // O estado que vai guardar a lista de todos os serviços.
  // Começamos com a lista inicial.
  const [services, setServices] = useState<IService[]>(initialServices);

  // A função para adicionar um novo serviço
  const addService = (serviceData: Omit<IService, 'id' | 'seller' | 'imageUrl'>, sellerName: string) => {
    // Criamos o objeto de serviço completo
    const newService: IService = {
      ...serviceData,
      id: services.length + 1, // Simples forma de gerar um novo ID
      seller: { name: sellerName },
      imageUrl: `https://source.unsplash.com/random/500x500?sig=${Math.random()}`, // Imagem aleatória para o novo serviço
    };

    // Atualizamos o estado, adicionando o novo serviço à lista existente
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