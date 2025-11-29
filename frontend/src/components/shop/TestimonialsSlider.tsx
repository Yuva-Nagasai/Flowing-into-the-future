import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import shopApi from '../../utils/shopApi';
import type { Testimonial } from '../../types/shop';

interface TestimonialsSliderProps {
  testimonials?: Testimonial[];
  autoPlay?: boolean;
  interval?: number;
}

export default function TestimonialsSlider({ testimonials: propTestimonials, autoPlay = true, interval = 6000 }: TestimonialsSliderProps) {
  const { theme } = useTheme();
  const [testimonials, setTestimonials] = useState<Testimonial[]>(propTestimonials || []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(!propTestimonials);

  useEffect(() => {
    if (!propTestimonials) {
      const fetchTestimonials = async () => {
        try {
          const res = await shopApi.getTestimonials();
          if (res.success && res.data) {
            setTestimonials(res.data);
          }
        } catch (error) {
          console.error('Failed to fetch testimonials');
        } finally {
          setLoading(false);
        }
      };
      fetchTestimonials();
    }
  }, [propTestimonials]);

  useEffect(() => {
    if (!autoPlay || testimonials.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval, testimonials.length]);

  const goPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  if (loading) {
    return (
      <div className={`p-8 rounded-2xl animate-pulse ${theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100'}`}>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gray-300 dark:bg-slate-700" />
          <div className="space-y-2">
            <div className="h-4 w-32 rounded bg-gray-300 dark:bg-slate-700" />
            <div className="h-3 w-24 rounded bg-gray-300 dark:bg-slate-700" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-4 w-full rounded bg-gray-300 dark:bg-slate-700" />
          <div className="h-4 w-3/4 rounded bg-gray-300 dark:bg-slate-700" />
        </div>
      </div>
    );
  }

  if (testimonials.length === 0) return null;

  const current = testimonials[currentIndex];

  return (
    <div className={`relative overflow-hidden rounded-2xl ${
      theme === 'dark' ? 'bg-slate-800/50' : 'bg-gray-50'
    }`}>
      <div className={`absolute top-4 right-4 ${theme === 'dark' ? 'text-electric-blue/30' : 'text-accent-blue/20'}`}>
        <Quote className="w-16 h-16" />
      </div>

      <div className="p-8 md:p-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-4 mb-6">
              {current.avatar ? (
                <img
                  src={current.avatar}
                  alt={current.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold ${
                  theme === 'dark'
                    ? 'bg-gradient-to-br from-electric-blue to-electric-green text-slate-900'
                    : 'bg-gradient-to-br from-accent-red to-accent-blue text-white'
                }`}>
                  {current.name.charAt(0)}
                </div>
              )}
              <div>
                <h4 className={`font-semibold text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {current.name}
                </h4>
                {(current.role || current.company) && (
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {current.role}{current.role && current.company ? ' at ' : ''}{current.company}
                  </p>
                )}
                <div className="flex items-center gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < current.rating
                          ? 'text-yellow-400 fill-yellow-400'
                          : theme === 'dark' ? 'text-gray-600' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <blockquote className={`text-lg md:text-xl italic ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              "{current.content}"
            </blockquote>
          </motion.div>
        </AnimatePresence>

        {testimonials.length > 1 && (
          <div className="flex items-center justify-between mt-8">
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === currentIndex
                      ? theme === 'dark' ? 'bg-electric-green w-6' : 'bg-accent-blue w-6'
                      : theme === 'dark' ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={goPrev}
                className={`p-2 rounded-full transition-colors ${
                  theme === 'dark'
                    ? 'bg-slate-700 text-white hover:bg-slate-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={goNext}
                className={`p-2 rounded-full transition-colors ${
                  theme === 'dark'
                    ? 'bg-slate-700 text-white hover:bg-slate-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
