import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';

interface WishlistItem {
  id: number;
  productId: number;
  createdAt: string;
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

export default function WishlistPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const queryClient = useQueryClient();

  const { data: wishlist, isLoading } = useQuery<WishlistItem[]>({
    queryKey: ['wishlist'],
    queryFn: async () => {
      const response = await api.get('/wishlist');
      return response.data.data;
    },
    enabled: isAuthenticated
  });

  const removeMutation = useMutation({
    mutationFn: async (productId: number) => {
      const response = await api.delete(`/wishlist/${productId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    }
  });

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="aspect-square bg-gray-200" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-5 bg-gray-200 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-4">Your Wishlist is Empty</h1>
        <p className="text-gray-600 mb-6">Save items you love for later</p>
        <Link to="/products" className="btn-primary">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Wishlist ({wishlist.length} items)</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {wishlist.map((item) => {
          const price = parseFloat(item.product?.price || '0');
          const comparePrice = item.product?.comparePrice ? parseFloat(item.product.comparePrice) : null;

          return (
            <div key={item.id} className="card group">
              <Link to={`/products/${item.product?.slug}`} className="block relative aspect-square bg-gray-100">
                {item.product?.thumbnail ? (
                  <img
                    src={item.product.thumbnail}
                    alt={item.product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </Link>

              <div className="p-4">
                <Link to={`/products/${item.product?.slug}`} className="font-medium hover:text-brand-accent line-clamp-2">
                  {item.product?.name}
                </Link>
                
                <div className="mt-2 flex items-center space-x-2">
                  <span className="font-bold text-lg">${price.toFixed(2)}</span>
                  {comparePrice && (
                    <span className="text-sm text-gray-400 line-through">${comparePrice.toFixed(2)}</span>
                  )}
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => {
                      addToCart({ productId: item.productId });
                      removeMutation.mutate(item.productId);
                    }}
                    disabled={item.product?.stock === 0}
                    className="btn-primary flex-1 text-sm py-2 flex items-center justify-center"
                  >
                    <ShoppingCart className="w-4 h-4 mr-1" />
                    Add
                  </button>
                  <button
                    onClick={() => removeMutation.mutate(item.productId)}
                    disabled={removeMutation.isPending}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {item.product?.stock === 0 && (
                  <p className="text-red-500 text-sm mt-2">Out of Stock</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
