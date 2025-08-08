import React, { useState, useEffect } from 'react';
import ServiceCard from './ServiceCard/ServiceCard'; // Ajuste o caminho se necessário

// --- MELHORIA 1: Definir uma interface para o nosso serviço ---
// Este é o "contrato" que diz ao TypeScript como é um objeto de serviço.
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

// Simulação de dados (agora seguindo a interface IService)
const mockServices: IService[] = [
  { id: 1, title: '1h de caminhada no parque', description: 'Uma hora de caminhada relaxante para conversar e exercitar.', price: 50, seller: { name: 'Carlos' }, imageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=500' },
  { id: 2, title: 'Retrato a lápis', description: 'Faço um retrato seu ou de quem você ama em grafite.', price: 120, seller: { name: 'Juliana' }, imageUrl: 'https://images.unsplash.com/photo-1582732971593-35a095a82358?w=500' },
  { id: 3, title: 'Meia hora de conversa', description: 'Um ombro amigo para desabafar ou trocar ideias.', price: 30, seller: { name: 'Beatriz' }, imageUrl: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=500' },
];

export default function Services() {
  // --- MELHORIA 2: Tipar o estado com a nossa interface ---
  // Avisamos ao useState que ele vai guardar um array de IService.
  const [services, setServices] = useState<IService[]>([]); 
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      // Agora o TypeScript sabe que mockServices é compatível com IService[]
      setServices(mockServices); 
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="bg-blue-500 text-white p-4 rounded mb-6">
        <h1 className="text-3xl font-bold">Serviços disponíveis</h1>
        <p>Clique em um serviço para ver mais detalhes e contratar.</p>
      </header>
      <main>
        {isLoading ? (
          <div className="text-center text-gray-500">Carregando serviços...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* O TypeScript agora sabe que 'service' é do tipo IService e tem a propriedade 'id' */}
            {services.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}