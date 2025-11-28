import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface CategoryCardProps {
  name: string;
  icon: LucideIcon;
  courseCount: number;
  onClick: () => void;
}

const CategoryCard = ({ name, icon: Icon, courseCount, onClick }: CategoryCardProps) => {
  const { theme } = useTheme();

  return (
    <motion.button
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`p-6 rounded-2xl border-2 transition-all text-left ${
        theme === 'dark'
          ? 'bg-dark-card border-gray-800 hover:border-electric-blue/50 hover:shadow-xl hover:shadow-electric-blue/10'
          : 'bg-white border-gray-200 hover:border-accent-blue/50 hover:shadow-xl hover:shadow-accent-blue/10'
      }`}
    >
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-electric-blue/20 to-electric-green/20'
          : 'bg-gradient-to-br from-accent-red/10 to-accent-blue/10'
      }`}>
        <Icon className={`w-7 h-7 ${
          theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
        }`} />
      </div>
      <h3 className={`text-lg font-bold mb-2 ${
        theme === 'dark' ? 'text-white' : 'text-gray-900'
      }`}>
        {name}
      </h3>
      <p className={`text-sm ${
        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
      }`}>
        {courseCount} {courseCount === 1 ? 'course' : 'courses'}
      </p>
    </motion.button>
  );
};

export default CategoryCard;
