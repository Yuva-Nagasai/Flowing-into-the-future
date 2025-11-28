import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';

interface CartItem {
  id: number;
  quantity: number;
  productId: number;
  product: {
    id: number;
    name: string;
    slug: string;
    price: string;
    comparePrice?: string;
    thumbnail?: string;
    stock: number;
  };
}

interface CartData {
  items: CartItem[];
  subtotal: number;
  itemCount: number;
}

export function useCart() {
  const queryClient = useQueryClient();

  const { data: cart, isLoading } = useQuery<CartData>({
    queryKey: ['cart'],
    queryFn: async () => {
      const response = await api.get('/cart');
      return response.data.data;
    },
    staleTime: 1000 * 60
  });

  const addToCartMutation = useMutation({
    mutationFn: async ({ productId, quantity = 1 }: { productId: number; quantity?: number }) => {
      const response = await api.post('/cart/add', { productId, quantity });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    }
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: number; quantity: number }) => {
      const response = await api.put(`/cart/${itemId}`, { quantity });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    }
  });

  const removeItemMutation = useMutation({
    mutationFn: async (itemId: number) => {
      const response = await api.delete(`/cart/${itemId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    }
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      const response = await api.delete('/cart');
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    }
  });

  return {
    cart,
    isLoading,
    addToCart: addToCartMutation.mutate,
    updateQuantity: updateQuantityMutation.mutate,
    removeItem: removeItemMutation.mutate,
    clearCart: clearCartMutation.mutate,
    isAddingToCart: addToCartMutation.isPending,
    isUpdating: updateQuantityMutation.isPending,
    isRemoving: removeItemMutation.isPending
  };
}
