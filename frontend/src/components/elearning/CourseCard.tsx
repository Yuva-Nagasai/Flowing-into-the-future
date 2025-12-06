import { motion } from 'framer-motion';
import { Clock, BarChart, Star, PlayCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface CourseCardProps {
  id: number;
  title: string;
  description: string;
  category: string;
  level: string;
  duration: number;
  price: number;
  instructor: string;
  thumbnailUrl?: string;
  rating?: number;
  studentsEnrolled?: number;
  onClick: (id: number) => void;
}

const CourseCard = ({
  id,
  title,
  description,
  category,
  level,
  duration,
  price,
  instructor,
  thumbnailUrl,
  rating = 4.5,
  studentsEnrolled = 0,
  onClick
}: CourseCardProps) => {
  const { theme } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      onClick={() => onClick(id)}
      className={`group cursor-pointer rounded-2xl border-2 overflow-hidden transition-all flex flex-col h-full ${
        theme === 'dark'
          ? 'bg-dark-card border-gray-800 hover:border-electric-blue/50 hover:shadow-2xl hover:shadow-electric-blue/10'
          : 'bg-white border-gray-200 hover:border-accent-blue/50 hover:shadow-2xl hover:shadow-accent-blue/10'
      }`}
    >
      {/* Thumbnail */}
      <div className="relative overflow-hidden">
        <div className={`aspect-video ${
          theme === 'dark' ? 'bg-dark-lighter' : 'bg-gray-200'
        } flex items-center justify-center`}>
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <PlayCircle className="w-16 h-16 text-gray-400" />
          )}
        </div>
        <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm ${
          theme === 'dark'
            ? 'bg-electric-green/90 text-dark-bg'
            : 'bg-accent-red/90 text-white'
        }`}>
          {level}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="mb-2">
          <span className={`text-sm font-semibold ${
            theme === 'dark' ? 'text-electric-blue' : 'text-accent-blue'
          }`}>
            {category}
          </span>
        </div>

        <h3 className={`text-xl font-bold mb-2 line-clamp-2 min-h-[3.5rem] ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          {title}
        </h3>

        <p className={`text-sm mb-3 line-clamp-2 min-h-[2.5rem] flex-shrink-0 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {description}
        </p>

        <div className={`flex items-center gap-2 mb-4 text-sm flex-shrink-0 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          <span className="font-medium">{instructor}</span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-4 flex-shrink-0">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < Math.floor(rating)
                  ? theme === 'dark'
                    ? 'fill-electric-green text-electric-green'
                    : 'fill-accent-red text-accent-red'
                  : 'text-gray-300'
              }`}
            />
          ))}
          <span className={`ml-1 text-sm font-semibold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {rating.toFixed(1)}
          </span>
        </div>

        {/* Meta Info */}
        <div className={`flex items-center justify-between pt-4 border-t mt-auto ${
          theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {duration}h
              </span>
            </div>
            <div className="flex items-center gap-1">
              <BarChart className="w-4 h-4 text-gray-400" />
              <span className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {studentsEnrolled}
              </span>
            </div>
          </div>

          <div className={`text-xl font-bold ${
            theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
          }`}>
            {price === 0 ? 'Free' : `₹${price}`}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCard;
