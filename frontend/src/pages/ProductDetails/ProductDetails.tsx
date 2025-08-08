import React, { useState, useEffect } from 'react';
// --- MELHORIA 1: Importar o hook useParams para ler a URL ---
import { useParams, Link } from 'react-router-dom';

// Como esta página também lida com serviços, precisamos da mesma interface.
// Em um projeto maior, esta interface estaria em um arquivo compartilhado (ex: src/types/index.ts)
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

// E também precisamos da mesma lista de dados para simular a "busca" no banco de dados.
const mockServices: IService[] = [
  { id: 1, title: '1h de caminhada no parque', description: 'Uma hora de caminhada relaxante para conversar e exercitar o corpo e a mente. O ritmo é definido por você.', price: 50, seller: { name: 'Carlos' }, imageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=500' },
  { id: 2, title: 'Retrato a lápis', description: 'Faço um retrato realista seu ou de quem você ama em grafite sobre papel Canson A4. Envio digitalizado em alta resolução.', price: 120, seller: { name: 'Juliana' }, imageUrl: 'https://images.unsplash.com/photo-1582732971593-35a095a82358?w=500' },
  { id: 3, title: 'Meia hora de conversa', description: 'Um ombro amigo para desabafar, organizar as ideias ou simplesmente ter uma conversa leve. Total sigilo e empatia.', price: 30, seller: { name: 'Beatriz' }, imageUrl: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=500' },
];

export default function ProductDetails() {
  // --- MELHORIA 2: Capturar o parâmetro 'id' da URL ---
  // O nome 'id' deve corresponder ao que você definiu na rota: <Route path="/productdetails/:id" ... />
  const { id } = useParams<{ id: string }>();

  // --- MELHORIA 3: Estado para o serviço, carregamento e erro ---
  const [service, setService] = useState<IService | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    // Simula uma chamada de API para buscar os detalhes do serviço
    setTimeout(() => {
      // useParams retorna o ID como string, então precisamos convertê-lo para número
      const foundService = mockServices.find(s => s.id === Number(id));

      if (foundService) {
        setService(foundService);
      } else {
        setError("Oops! Não encontramos o serviço que você está procurando.");
      }
      setIsLoading(false);
    }, 500); // Meio segundo de delay para simular a rede
  }, [id]); // O efeito roda novamente se o ID na URL mudar

  // --- MELHORIA 4: Lógica de Interatividade do Botão ---
  const handleHireClick = () => {
    alert(`Preparando agendamento para: ${service?.title}`);
    // No futuro, isso levaria para a rota de checkout/pagamento
    // navigate(`/checkout/${service.id}`);
  };

  // --- MELHORIA 5: Renderização Condicional ---
  if (isLoading) {
    return <div className="text-center mt-20">Carregando detalhes do serviço...</div>;
  }

  if (error) {
    return (
      <div className="text-center mt-20 text-red-500">
        <p>{error}</p>
        <Link to="/services" className="text-blue-500 hover:underline mt-4 block">
          Voltar para a lista de serviços
        </Link>
      </div>
    );
  }

  // Se não está carregando e não há erro, mas o serviço não foi encontrado
  if (!service) {
    return <div>Serviço não encontrado.</div>;
  }

  // --- MELHORIA 6: Renderização com Dados Dinâmicos ---
  return (
    <div className="max-w-4xl mx-auto p-4 my-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-8 rounded-lg shadow-lg">
        {/* Seção de Imagem */}
        <div>
          <img src={service.imageUrl} alt={service.title} className="w-full h-auto object-cover rounded-lg" />
        </div>

        {/* Seção de Informações */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{service.title}</h1>
            <p className="text-gray-500 mb-4">Oferecido por: {service.seller.name}</p>
            <p className="text-gray-700 mb-6">{service.description}</p>
          </div>
          <div className="mt-auto">
            <div className="text-4xl font-bold text-blue-600 mb-6">
              {service.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
            <button onClick={handleHireClick} className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300">
              Contratar Serviço
            </button>
          </div>
        </div>
      </div>

      {/* Seção de Avaliações (ainda estática, como próximo passo) */}
      <div className="mt-10 bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Avaliações dos Clientes</h2>
        {/* No futuro, as avaliações também viriam da API e seriam mapeadas aqui */}
        <div className="border-t pt-4">
          <h3 className="font-semibold">Cliente 1</h3>
          <p className="text-gray-600">Ótimo! Atendeu todas as minhas expectativas.</p>
        </div>
      </div>
    </div>
  );
};