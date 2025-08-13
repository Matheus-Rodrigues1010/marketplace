import React, { createContext, useState, ReactNode } from 'react';
// Importamos a interface IService para poder reutilizá-la
import { IService } from './ServiceContext'; 

// --- 1. Definindo os Tipos ---

// Um pedido é o serviço em si, mais a informação de quem comprou e quando.
export interface IOrder {
  orderId: number; // ID único para o pedido
  service: IService; // O serviço que foi comprado
  buyerId: number; // ID do usuário que comprou
  orderDate: string; // Data da compra
}

// O que nosso contexto de pedidos vai fornecer
interface IOrderContext {
  orders: IOrder[];
  addOrder: (service: IService, buyerId: number) => void;
}

// --- 2. Criando o Contexto ---
export const OrderContext = createContext<IOrderContext>({
  orders: [],
  addOrder: () => {},
});

// --- 3. Criando o Provedor ---

interface OrderProviderProps {
  children: ReactNode;
}

export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
  // O estado que vai guardar a lista de todos os pedidos. Começa vazio.
  const [orders, setOrders] = useState<IOrder[]>([]);

  // A função para adicionar um novo pedido (simular uma compra)
  const addOrder = (service: IService, buyerId: number) => {
    const newOrder: IOrder = {
      orderId: Date.now(), // ID único para o pedido
      service: service, // O objeto completo do serviço
      buyerId: buyerId,
      orderDate: new Date().toISOString(), // Data atual no formato padrão
    };

    // Adicionamos o novo pedido à lista de pedidos existentes
    setOrders(prevOrders => [...prevOrders, newOrder]);
  };

  const contextValue = {
    orders,
    addOrder,
  };

  return (
    <OrderContext.Provider value={contextValue}>
      {children}
    </OrderContext.Provider>
  );
};