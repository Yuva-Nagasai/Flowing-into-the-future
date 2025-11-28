import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import { Filter, X } from 'lucide-react';
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

interface ProductsResponse {
  items: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'home', label: 'Home' },
  { value: 'books', label: 'Books' },
  { value: 'sports', label: 'Sports' },
  { value: 'beauty', label: 'Beauty' },
  { value: 'toys', label: 'Toys' },
  { value: 'food', label: 'Food' },
  { value: 'other', label: 'Other' }
];

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name_asc', label: 'Name: A-Z' },
  { value: 'name_desc', label: 'Name: Z-A' }
];

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const category = searchParams.get('category') || 'all';
  const search = searchParams.get('search') || '';
  const featured = searchParams.get('featured') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = parseInt(searchParams.get('page') || '1');

  const { data, isLoading } = useQuery<ProductsResponse>({
    queryKey: ['products', category, search, featured, sort, page],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (category && category !== 'all') params.append('category', category);
      if (search) params.append('search', search);
      if (featured) params.append('featured', featured);
      params.append('sort', sort);
      params.append('page', page.toString());
      params.append('limit', '12');

      const response = await api.get(`/products?${params}`);
      return response.data.data;
    }
  });

  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'all') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.delete('page');
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const hasActiveFilters = category !== 'all' || search || featured;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          {data && (
            <p className="text-gray-600 mt-1">{data.total} products found</p>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden btn-secondary flex items-center"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-64 flex-shrink-0`}>
          <div className="card p-6 sticky top-20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Filters</h3>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="text-sm text-brand-accent hover:underline">
                  Clear all
                </button>
              )}
            </div>

            {search && (
              <div className="mb-4 flex items-center justify-between bg-gray-100 px-3 py-2 rounded-lg">
                <span className="text-sm">Search: "{search}"</span>
                <button onClick={() => updateFilter('search', '')} className="text-gray-500 hover:text-gray-700">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => updateFilter('category', e.target.value)}
                className="input"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sort}
                onChange={(e) => updateFilter('sort', e.target.value)}
                className="input"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured === 'true'}
                  onChange={(e) => updateFilter('featured', e.target.checked ? 'true' : '')}
                  className="w-4 h-4 text-brand-accent rounded focus:ring-brand-accent"
                />
                <span className="text-sm">Featured Only</span>
              </label>
            </div>
          </div>
        </aside>

        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(12)].map((_, i) => (
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
          ) : data && data.items.length > 0 ? (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                {data.items.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {data.totalPages > 1 && (
                <div className="flex justify-center mt-8 space-x-2">
                  {[...Array(data.totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => updateFilter('page', (i + 1).toString())}
                      className={`w-10 h-10 rounded-lg ${
                        data.page === i + 1
                          ? 'bg-brand-accent text-white'
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No products found</p>
              <button onClick={clearFilters} className="text-brand-accent hover:underline mt-2">
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
