import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { useCart } from './CartContext';

interface Order {
  id: string;
  items: {
    id: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPING' | 'COMPLETED' | 'CANCELLED';
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    zone: string;
  };
  paymentMethod: string;
  deliveryFee: number;
  createdAt: string;
  updatedAt: string;
}

interface OrderContextType {
  orders: Order[];
  createOrder: (orderData: any) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: string) => Promise<void>;
  getOrderById: (orderId: string) => Order | undefined;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { clearCart } = useCart();

  // Charger les commandes au démarrage
  useEffect(() => {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (error) {
        console.error('Error loading orders:', error);
      }
    }
  }, []);

  // Sauvegarder les commandes à chaque modification
  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  const createOrder = async (orderData: any): Promise<Order> => {
    try {
      const orderId = Math.floor(1000 + Math.random() * 9000).toString();
      const now = new Date().toISOString();

      const newOrder: Order = {
        ...orderData,
        id: orderId,
        status: 'PENDING',
        createdAt: now,
        updatedAt: now
      };

      setOrders(prev => [newOrder, ...prev]);
      clearCart();

      toast({
        title: "Commande confirmée",
        description: `Commande #${orderId} créée avec succès`
      });

      navigate('/order-confirmation', { 
        state: { order: newOrder },
        replace: true 
      });

      return newOrder;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de créer la commande"
      });
      throw error;
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      setOrders(prev => prev.map(order => 
        order.id === orderId 
          ? { 
              ...order, 
              status: status as Order['status'],
              updatedAt: new Date().toISOString()
            } 
          : order
      ));

      toast({
        title: "Statut mis à jour",
        description: `La commande #${orderId} a été mise à jour`
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut"
      });
      throw error;
    }
  };

  const getOrderById = (orderId: string) => {
    return orders.find(order => order.id === orderId);
  };

  return (
    <OrderContext.Provider value={{
      orders,
      createOrder,
      updateOrderStatus,
      getOrderById
    }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
}