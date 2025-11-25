import { Filter } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface FilterSidebarProps {
  categories: string[];
  levels: string[];
  selectedCategory: string;
  selectedLevel: string;
  priceFilter: string;
  onCategoryChange: (category: string) => void;
  onLevelChange: (level: string) => void;
  onPriceFilterChange: (filter: string) => void;
}

const FilterSidebar = ({
  categories,
  levels,
  selectedCategory,
  selectedLevel,
  priceFilter,
  onCategoryChange,
  onLevelChange,
  onPriceFilterChange
}: FilterSidebarProps) => {
  const { theme } = useTheme();

  const priceOptions = [
    { value: 'all', label: 'All Prices' },
    { value: 'free', label: 'Free Only' },
    { value: 'paid', label: 'Paid Only' },
    { value: 'low-high', label: 'Price: Low to High' },
    { value: 'high-low', label: 'Price: High to Low' }
  ];

  return (
    <div className={`rounded-2xl border-2 p-6 ${
      theme === 'dark'
        ? 'bg-dark-card border-gray-800'
        : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center gap-2 mb-6">
        <Filter className={`w-5 h-5 ${
          theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
        }`} />
        <h3 className={`font-bold text-lg ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Filters
        </h3>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <label className={`block text-sm font-semibold mb-3 ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Category
        </label>
        <div className="space-y-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category === 'All' ? '' : category)}
              className={`w-full text-left px-4 py-2.5 rounded-lg transition-all font-medium ${
                (selectedCategory === category || (!selectedCategory && category === 'All'))
                  ? theme === 'dark'
                    ? 'bg-electric-blue/20 text-electric-blue border-2 border-electric-blue/50'
                    : 'bg-accent-blue/10 text-accent-blue border-2 border-accent-blue/50'
                  : theme === 'dark'
                    ? 'text-gray-400 hover:bg-dark-lighter hover:text-white border-2 border-transparent'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-2 border-transparent'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Level Filter */}
      <div className="mb-6">
        <label className={`block text-sm font-semibold mb-3 ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Level
        </label>
        <div className="space-y-2">
          {levels.map((level) => (
            <button
              key={level}
              onClick={() => onLevelChange(level === 'All' ? '' : level)}
              className={`w-full text-left px-4 py-2.5 rounded-lg transition-all font-medium ${
                (selectedLevel === level || (!selectedLevel && level === 'All'))
                  ? theme === 'dark'
                    ? 'bg-electric-green/20 text-electric-green border-2 border-electric-green/50'
                    : 'bg-accent-red/10 text-accent-red border-2 border-accent-red/50'
                  : theme === 'dark'
                    ? 'text-gray-400 hover:bg-dark-lighter hover:text-white border-2 border-transparent'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-2 border-transparent'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div>
        <label className={`block text-sm font-semibold mb-3 ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Price
        </label>
        <div className="space-y-2">
          {priceOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onPriceFilterChange(option.value)}
              className={`w-full text-left px-4 py-2.5 rounded-lg transition-all font-medium ${
                priceFilter === option.value
                  ? theme === 'dark'
                    ? 'bg-electric-blue/20 text-electric-blue border-2 border-electric-blue/50'
                    : 'bg-accent-blue/10 text-accent-blue border-2 border-accent-blue/50'
                  : theme === 'dark'
                    ? 'text-gray-400 hover:bg-dark-lighter hover:text-white border-2 border-transparent'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-2 border-transparent'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
