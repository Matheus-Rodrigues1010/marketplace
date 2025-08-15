import React, { createContext, useState, ReactNode } from 'react';
import axios from 'axios';
import apiUrl from '../apiConfig';
import { toast } from 'react-toastify';
import { IService } from './ServiceContext'; 

// Interface para um Pedido
export interface IOrder {
  orderId: number;
  service: IService;
  buyerId: number;
  orderDate: string;
}

// Interface do Contexto
interface IOrderContext {
  orders: IOrder[]; // Manteremos a lista para a página /my-orders
  loading: boolean;
  fetchOrders: () => Promise<void>; // Função para buscar os pedidos
  addOrder: (service: IService, buyerId: number) => Promise<void>;
}

export const OrderContext = createContext<IOrderContext>({
  orders: [],
  loading: false,
  fetchOrders: async () => {},
  addOrder: async () => {},
});

interface OrderProviderProps {
  children: ReactNode;
}

export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(false);

  // Função para buscar os pedidos do usuário logado
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${apiUrl}/orders/my-orders`);
      setOrders(res.data);
    } catch (err) {
      console.error("Erro ao buscar pedidos:", err);
      toast.error("Não foi possível carregar seus pedidos.");
    } finally {
      setLoading(false);
    }
  };

  // Função para criar um novo pedido (contratar serviço)
  const addOrder = async (service: IService, buyerId: number) => {
    const body = { serviceId: service.id };
    try {
      // Faz a chamada POST para a API
      await axios.post(`${apiUrl}/orders`, body);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Erro ao contratar serviço.");
      throw err; // Lança o erro para o componente poder lidar com ele
    }
  };

  const contextValue = {
    orders,
    loading,
    fetchOrders,
    addOrder,
  };

  return (
    <OrderContext.Provider value={contextValue}>
      {children}
    </OrderContext.Provider>
  );
};