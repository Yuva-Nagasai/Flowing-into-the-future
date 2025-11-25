import { ArrowUpDown } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface SortingBarProps {
  totalCourses: number;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

const SortingBar = ({ totalCourses, sortBy, onSortChange }: SortingBarProps) => {
  const { theme } = useTheme();

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' }
  ];

  return (
    <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border-2 ${
      theme === 'dark'
        ? 'bg-dark-card border-gray-800'
        : 'bg-white border-gray-200'
    }`}>
      {/* Results Count */}
      <div className="flex items-center gap-2">
        <span className={`text-sm font-medium ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Showing
        </span>
        <span className={`text-lg font-bold ${
          theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
        }`}>
          {totalCourses}
        </span>
        <span className={`text-sm font-medium ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {totalCourses === 1 ? 'course' : 'courses'}
        </span>
      </div>

      {/* Sort Dropdown */}
      <div className="flex items-center gap-3">
        <ArrowUpDown className={`w-5 h-5 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`} />
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className={`px-4 py-2 rounded-lg border-2 font-medium transition-all cursor-pointer ${
            theme === 'dark'
              ? 'bg-dark-lighter border-gray-700 text-white hover:border-electric-blue focus:border-electric-blue'
              : 'bg-gray-50 border-gray-300 text-gray-900 hover:border-accent-blue focus:border-accent-blue'
          } focus:outline-none focus:ring-2 ${
            theme === 'dark' ? 'focus:ring-electric-blue/30' : 'focus:ring-accent-blue/30'
          }`}
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SortingBar;
