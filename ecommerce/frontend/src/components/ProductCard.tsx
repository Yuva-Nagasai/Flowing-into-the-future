import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';
import { useState } from 'react';

interface Product {
  id: number;
  name: string;
  slug: string;
  price: string;
  comparePrice?: string;
  thumbnail?: string;
  category: string;
  stock: number;
  featured: boolean;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, isAddingToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const price = parseFloat(product.price);
  const comparePrice = product.comparePrice ? parseFloat(product.comparePrice) : null;
  const discount = comparePrice ? Math.round(((comparePrice - price) / comparePrice) * 100) : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      window.location.href = '/ecommerce/login';
      return;
    }
    addToCart({ productId: product.id });
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      window.location.href = '/ecommerce/login';
      return;
    }
    try {
      if (isWishlisted) {
        await api.delete(`/wishlist/${product.id}`);
        setIsWishlisted(false);
      } else {
        await api.post('/wishlist/add', { productId: product.id });
        setIsWishlisted(true);
      }
    } catch (error) {
      console.error('Wishlist error:', error);
    }
  };

  return (
    <Link to={`/products/${product.slug}`} className="card group">
      <div className="relative aspect-square bg-gray-100">
        {product.thumbnail ? (
          <img
            src={product.thumbnail}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
        
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            -{discount}%
          </span>
        )}
        
        {product.featured && (
          <span className="absolute top-2 right-2 bg-brand-accent text-white text-xs px-2 py-1 rounded">
            Featured
          </span>
        )}
        
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex space-x-2">
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart || product.stock === 0}
              className="p-3 bg-white rounded-full shadow-lg hover:bg-brand-accent hover:text-white transition-colors disabled:opacity-50"
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
            <button
              onClick={handleWishlist}
              className={`p-3 bg-white rounded-full shadow-lg hover:bg-red-500 hover:text-white transition-colors ${isWishlisted ? 'text-red-500' : ''}`}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
          {product.category}
        </p>
        <h3 className="font-medium text-gray-900 group-hover:text-brand-accent transition-colors line-clamp-2">
          {product.name}
        </h3>
        <div className="mt-2 flex items-center space-x-2">
          <span className="font-bold text-lg text-gray-900">
            ${price.toFixed(2)}
          </span>
          {comparePrice && (
            <span className="text-sm text-gray-400 line-through">
              ${comparePrice.toFixed(2)}
            </span>
          )}
        </div>
        {product.stock === 0 && (
          <p className="text-red-500 text-sm mt-1">Out of Stock</p>
        )}
      </div>
    </Link>
  );
}
