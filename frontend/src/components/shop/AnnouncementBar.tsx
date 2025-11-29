import { useState, useEffect } from 'react';
import { X, Megaphone, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import shopApi from '../../utils/shopApi';
import type { Announcement } from '../../types/shop';

export default function AnnouncementBar() {
  const { theme } = useTheme();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await shopApi.getAnnouncements();
        if (res.success && res.data) {
          setAnnouncements(res.data);
        }
      } catch (error) {
        console.error('Failed to fetch announcements');
      }
    };
    fetchAnnouncements();
  }, []);

  useEffect(() => {
    if (announcements.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [announcements.length]);

  if (dismissed || announcements.length === 0) return null;

  const current = announcements[currentIndex];
  const typeColors: Record<string, string> = {
    info: theme === 'dark' ? 'bg-electric-blue/20 border-electric-blue/30' : 'bg-accent-blue/10 border-accent-blue/30',
    warning: 'bg-yellow-500/20 border-yellow-500/30',
    success: theme === 'dark' ? 'bg-electric-green/20 border-electric-green/30' : 'bg-green-500/10 border-green-500/30',
    promo: theme === 'dark' ? 'bg-purple-500/20 border-purple-500/30' : 'bg-purple-500/10 border-purple-500/30',
  };

  return (
    <div className={`relative border-b ${typeColors[current.type] || typeColors.info}`}>
      <div className="container mx-auto px-4 py-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex items-center justify-center gap-3 text-sm"
          >
            <Megaphone className={`w-4 h-4 flex-shrink-0 ${theme === 'dark' ? 'text-electric-green' : 'text-accent-blue'}`} />
            <span className={theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}>
              <strong className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>{current.title}:</strong>{' '}
              {current.content}
            </span>
            {current.targetUrl && (
              <Link
                to={current.targetUrl}
                className={`inline-flex items-center gap-1 font-medium ${
                  theme === 'dark' ? 'text-electric-green hover:text-electric-green/80' : 'text-accent-blue hover:text-accent-blue/80'
                }`}
              >
                Learn More
                <ArrowRight className="w-3 h-3" />
              </Link>
            )}
          </motion.div>
        </AnimatePresence>
        <button
          onClick={() => setDismissed(true)}
          className={`absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full transition-colors ${
            theme === 'dark' ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-200 text-gray-500'
          }`}
          aria-label="Dismiss announcement"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      {announcements.length > 1 && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-1 pb-0.5">
          {announcements.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                i === currentIndex
                  ? theme === 'dark' ? 'bg-electric-green' : 'bg-accent-blue'
                  : theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'
              }`}
              aria-label={`Go to announcement ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
