import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, SlidersHorizontal, Grid, LayoutGrid, ChevronDown } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import ShopNav from '../../components/shop/ShopNav';
import Footer from '../../components/Footer';
import SEOHead from '../../components/shop/SEOHead';
import ProductGrid from '../../components/shop/ProductGrid';
import shopApi from '../../utils/shopApi';
import type { Category, Product } from '../../types/shop';

export default function ShopCategoryProducts() {
  const { slug } = useParams<{ slug: string }>();
  const { theme } = useTheme();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [gridCols, setGridCols] = useState<3 | 4>(4);

  useEffect(() => {
    if (slug) {
      fetchCategory();
    }
  }, [slug, page, sortBy, sortOrder]);

  const fetchCategory = async () => {
    setLoading(true);
    try {
      const res = await shopApi.getCategory(slug!, page, 20);
      if (res.success && res.data) {
        setCategory(res.data.category);
        setProducts(res.data.products);
      }
    } catch (error) {
      console.error('Failed to fetch category');
    } finally {
      setLoading(false);
    }
  };

  const sortOptions = [
    { label: 'Newest', value: 'createdAt-desc' },
    { label: 'Oldest', value: 'createdAt-asc' },
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
    { label: 'Name: A-Z', value: 'name-asc' },
    { label: 'Name: Z-A', value: 'name-desc' },
  ];

  const handleSortChange = (value: string) => {
    const [field, order] = value.split('-');
    setSortBy(field);
    setSortOrder(order as 'asc' | 'desc');
    setPage(1);
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-950' : 'bg-gray-50'}`}>
      <SEOHead
        title={category?.name || 'Category'}
        description={category?.description || `Browse products in ${category?.name || 'this category'}`}
        ogImage={category?.image}
      />
      <ShopNav />

      <div className="container mx-auto px-4 lg:px-6 py-4">
        <nav className="flex items-center gap-2 text-sm">
          <Link to="/shop" className={theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}>
            Shop
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <Link to="/shop/categories" className={theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}>
            Categories
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>{category?.name}</span>
        </nav>
      </div>

      <section className="py-8">
        <div className="container mx-auto px-4 lg:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className={`text-3xl md:text-4xl font-bold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {category?.name}
            </h1>
            {category?.description && (
              <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                {category.description}
              </p>
            )}
          </motion.div>

          <div className={`flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 pb-4 border-b ${
            theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
          }`}>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                  theme === 'dark'
                    ? 'border-slate-600 text-gray-300 hover:bg-slate-800'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </button>
              <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                {products.length} products
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setGridCols(3)}
                  className={`p-2 rounded-lg transition-colors ${
                    gridCols === 3
                      ? theme === 'dark' ? 'bg-slate-700 text-white' : 'bg-gray-200 text-gray-900'
                      : theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setGridCols(4)}
                  className={`p-2 rounded-lg transition-colors ${
                    gridCols === 4
                      ? theme === 'dark' ? 'bg-slate-700 text-white' : 'bg-gray-200 text-gray-900'
                      : theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <LayoutGrid className="w-5 h-5" />
                </button>
              </div>

              <div className="relative">
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className={`appearance-none pl-4 pr-10 py-2 rounded-lg border cursor-pointer ${
                    theme === 'dark'
                      ? 'bg-slate-800 border-slate-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`} />
              </div>
            </div>
          </div>

          <ProductGrid products={products} loading={loading} columns={gridCols} />
        </div>
      </section>

      <Footer variant="shop" />
    </div>
  );
}
