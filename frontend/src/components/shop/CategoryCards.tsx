import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Folder } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import type { Category } from '../../types/shop';

interface CategoryCardsProps {
  categories: Category[];
  loading?: boolean;
  showAll?: boolean;
}

const categoryIcons: Record<string, string> = {
  electronics: '📱',
  clothing: '👕',
  home: '🏠',
  books: '📚',
  sports: '⚽',
  beauty: '💄',
  toys: '🧸',
  food: '🍔',
  health: '💊',
  automotive: '🚗',
  garden: '🌱',
  office: '💼',
};

const categoryColors: Record<string, string> = {
  electronics: 'from-blue-500 to-cyan-500',
  clothing: 'from-pink-500 to-rose-500',
  home: 'from-amber-500 to-orange-500',
  books: 'from-green-500 to-emerald-500',
  sports: 'from-purple-500 to-violet-500',
  beauty: 'from-rose-500 to-pink-500',
  toys: 'from-yellow-500 to-amber-500',
  food: 'from-red-500 to-orange-500',
  health: 'from-teal-500 to-green-500',
  automotive: 'from-slate-500 to-gray-500',
  garden: 'from-lime-500 to-green-500',
  office: 'from-indigo-500 to-blue-500',
};

export default function CategoryCards({ categories, loading = false, showAll = false }: CategoryCardsProps) {
  const { theme } = useTheme();

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`p-6 rounded-2xl animate-pulse ${
              theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100'
            }`}
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-300 dark:bg-slate-700" />
            <div className="h-4 rounded bg-gray-300 dark:bg-slate-700" />
          </div>
        ))}
      </div>
    );
  }

  const displayCategories = showAll ? categories : categories.slice(0, 6);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {displayCategories.map((category, index) => {
          const icon = categoryIcons[category.slug] || '📦';
          const color = categoryColors[category.slug] || 'from-gray-500 to-slate-500';

          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                to={`/shop/category/${category.slug}`}
                className={`block p-6 rounded-2xl text-center transition-all hover:scale-105 ${
                  theme === 'dark'
                    ? 'bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-electric-blue/50'
                    : 'bg-white hover:bg-gray-50 border border-gray-200 shadow-sm hover:shadow-lg'
                }`}
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-3xl`}>
                  {category.image ? (
                    <img src={category.image} alt={category.name} className="w-10 h-10 object-contain" />
                  ) : (
                    icon
                  )}
                </div>
                <h3 className={`font-medium mb-1 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {category.name}
                </h3>
                {category.description && (
                  <p className={`text-xs line-clamp-1 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {category.description}
                  </p>
                )}
              </Link>
            </motion.div>
          );
        })}
      </div>

      {!showAll && categories.length > 6 && (
        <div className="text-center">
          <Link
            to="/shop/categories"
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              theme === 'dark'
                ? 'bg-slate-800 text-white hover:bg-slate-700 border border-slate-700'
                : 'bg-white text-gray-900 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <Folder className="w-5 h-5" />
            View All Categories ({categories.length})
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {categories.length === 0 && !loading && (
        <div className={`text-center py-12 rounded-2xl ${
          theme === 'dark' ? 'bg-slate-800/50' : 'bg-gray-100'
        }`}>
          <Folder className={`w-12 h-12 mx-auto mb-3 ${
            theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
          }`} />
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
            No categories available
          </p>
        </div>
      )}
    </div>
  );
}
