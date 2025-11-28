import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { ShoppingCart, Heart, Star, Minus, Plus, ChevronLeft } from 'lucide-react';
import api from '../utils/api';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';

interface Review {
  id: number;
  rating: number;
  title?: string;
  comment: string;
  verified: boolean;
  createdAt: string;
  userName: string;
}

interface ProductWithReviews {
  id: number;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: string;
  comparePrice?: string;
  category: string;
  images: string[];
  thumbnail?: string;
  stock: number;
  sku?: string;
  featured: boolean;
  reviews: Review[];
  averageRating: number;
  reviewCount: number;
}

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart, isAddingToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const { data: product, isLoading, error } = useQuery<ProductWithReviews>({
    queryKey: ['product', slug],
    queryFn: async () => {
      const response = await api.get(`/products/${slug}`);
      return response.data.data;
    }
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-24 mb-8" />
          <div className="grid md:grid-cols-2 gap-12">
            <div className="aspect-square bg-gray-200 rounded-xl" />
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/4" />
              <div className="h-10 bg-gray-200 rounded w-1/3" />
              <div className="h-24 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <Link to="/products" className="text-brand-accent hover:underline">
          Back to Products
        </Link>
      </div>
    );
  }

  const price = parseFloat(product.price);
  const comparePrice = product.comparePrice ? parseFloat(product.comparePrice) : null;
  const discount = comparePrice ? Math.round(((comparePrice - price) / comparePrice) * 100) : 0;

  const allImages = product.images.length > 0 ? product.images : (product.thumbnail ? [product.thumbnail] : []);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      window.location.href = '/ecommerce/login';
      return;
    }
    addToCart({ productId: product.id, quantity });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/products" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8">
        <ChevronLeft className="w-4 h-4 mr-1" />
        Back to Products
      </Link>

      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-4">
            {allImages.length > 0 ? (
              <img
                src={allImages[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
          </div>
          
          {allImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {allImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 ${
                    selectedImage === index ? 'border-brand-accent' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">{product.category}</p>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.round(product.averageRating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-gray-600">
              {product.averageRating.toFixed(1)} ({product.reviewCount} reviews)
            </span>
          </div>

          <div className="flex items-center space-x-4 mb-6">
            <span className="text-3xl font-bold">${price.toFixed(2)}</span>
            {comparePrice && (
              <>
                <span className="text-xl text-gray-400 line-through">${comparePrice.toFixed(2)}</span>
                <span className="bg-red-100 text-red-600 text-sm px-2 py-1 rounded">
                  Save {discount}%
                </span>
              </>
            )}
          </div>

          {product.shortDescription && (
            <p className="text-gray-600 mb-6">{product.shortDescription}</p>
          )}

          {product.stock > 0 ? (
            <p className="text-green-600 mb-4">
              In Stock ({product.stock} available)
            </p>
          ) : (
            <p className="text-red-600 mb-4">Out of Stock</p>
          )}

          {product.sku && (
            <p className="text-sm text-gray-500 mb-6">SKU: {product.sku}</p>
          )}

          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 hover:bg-gray-100 rounded-l-lg"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 py-2 font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="p-3 hover:bg-gray-100 rounded-r-lg"
                disabled={quantity >= product.stock}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart || product.stock === 0}
              className="btn-primary flex-1 flex items-center justify-center"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              {isAddingToCart ? 'Adding...' : 'Add to Cart'}
            </button>
            
            <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Heart className="w-5 h-5" />
            </button>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4">Description</h3>
            <div className="text-gray-600 prose max-w-none" dangerouslySetInnerHTML={{ __html: product.description }} />
          </div>
        </div>
      </div>

      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-8">Customer Reviews</h2>
        
        {product.reviews.length > 0 ? (
          <div className="space-y-6">
            {product.reviews.map((review) => (
              <div key={review.id} className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{review.userName}</span>
                      {review.verified && (
                        <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded">
                          Verified Purchase
                        </span>
                      )}
                    </div>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {review.title && <h4 className="font-medium mb-2">{review.title}</h4>}
                <p className="text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
        )}
      </section>
    </div>
  );
}
