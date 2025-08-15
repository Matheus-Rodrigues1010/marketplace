import React, { createContext, useState, ReactNode, useCallback } from 'react';
import axios from 'axios';
import apiUrl from '../apiConfig';
import { toast } from 'react-toastify';
import { IService } from './ServiceContext'; 

// Interface para um Pedido (conforme a resposta da API)
export interface IOrder {
  order_id: number;
  service_title: string;
  seller_name: string;
  price_at_purchase: string;
  order_date: string;
  service_image_url: string;
}

// Interface do Contexto
interface IOrderContext {
  orders: IOrder[];
  loading: boolean;
  fetchOrders: () => Promise<void>;
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

  // Usamos useCallback para memorizar a função e evitar o loop infinito.
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${apiUrl}/orders/my-orders`);
      setOrders(res.data);
    } catch (err) {
      console.error("Erro ao buscar pedidos:", err);
      // Não mostramos toast aqui para não poluir a tela se houver um loop
    } finally {
      setLoading(false);
    }
  }, []); // Array de dependências vazio significa que a função nunca será recriada

  const addOrder = async (service: IService, buyerId: number) => {
    const body = { serviceId: service.id };
    try {
      await axios.post(`${apiUrl}/orders`, body);
    } catch (err: any) {
      console.error("Erro detalhado ao criar pedido:", err.response || err);
      toast.error(err.response?.data?.error || "Erro ao contratar serviço.");
      throw err;
    }
  };

  const contextValue = { orders, loading, fetchOrders, addOrder };

  return (
    <OrderContext.Provider value={contextValue}>
      {children}
    </OrderContext.Provider>
  );
};