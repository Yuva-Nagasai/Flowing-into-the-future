import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, CreditCard } from 'lucide-react';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';

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

const categories = [
  { name: 'Electronics', slug: 'electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400' },
  { name: 'Clothing', slug: 'clothing', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400' },
  { name: 'Home', slug: 'home', image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400' },
  { name: 'Sports', slug: 'sports', image: 'https://images.unsplash.com/photo-1461896836934- voices-outdoor?w=400' }
];

export default function HomePage() {
  const { data: featuredProducts, isLoading } = useQuery<Product[]>({
    queryKey: ['featured-products'],
    queryFn: async () => {
      const response = await api.get('/products/featured?limit=8');
      return response.data.data;
    }
  });

  return (
    <div>
      <section className="relative bg-gradient-to-r from-gray-900 to-gray-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Discover Premium Products at <span className="text-brand-accent">Unbeatable Prices</span>
            </h1>
            <p className="text-lg text-gray-300 mb-8">
              Shop the latest trends in electronics, fashion, home decor, and more. 
              Quality products, fast shipping, and exceptional service.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products" className="btn-primary inline-flex items-center">
                Shop Now <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link to="/products?featured=true" className="btn-outline bg-transparent border-white text-white hover:bg-white hover:text-gray-900">
                View Featured
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-brand-light rounded-lg">
                <Truck className="w-6 h-6 text-brand-accent" />
              </div>
              <div>
                <h3 className="font-semibold">Free Shipping</h3>
                <p className="text-sm text-gray-600">On orders over $100</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-brand-light rounded-lg">
                <Shield className="w-6 h-6 text-brand-accent" />
              </div>
              <div>
                <h3 className="font-semibold">Secure Payments</h3>
                <p className="text-sm text-gray-600">100% protected checkout</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-brand-light rounded-lg">
                <CreditCard className="w-6 h-6 text-brand-accent" />
              </div>
              <div>
                <h3 className="font-semibold">Easy Returns</h3>
                <p className="text-sm text-gray-600">30-day return policy</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Shop by Category</h2>
            <Link to="/products" className="text-brand-accent hover:underline flex items-center">
              View All <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link
                key={category.slug}
                to={`/products?category=${category.slug}`}
                className="group relative aspect-square rounded-xl overflow-hidden"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-white font-semibold text-lg">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Featured Products</h2>
            <Link to="/products?featured=true" className="text-brand-accent hover:underline flex items-center">
              View All <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="aspect-square bg-gray-200" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-5 bg-gray-200 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : featuredProducts && featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No featured products available yet.</p>
              <Link to="/products" className="text-brand-accent hover:underline mt-2 inline-block">
                Browse all products
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-brand-accent text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">
            Get exclusive offers, new arrivals, and updates delivered straight to your inbox.
          </p>
          <form className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button type="submit" className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
