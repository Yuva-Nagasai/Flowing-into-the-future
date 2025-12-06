import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const { theme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const displayImages = images.length > 0 ? images : [''];

  const goTo = (index: number) => {
    setCurrentIndex(index);
  };

  const goPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
  };

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % displayImages.length);
  };

  return (
    <div className="space-y-4">
      <div className={`relative aspect-square rounded-2xl overflow-hidden ${
        theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100'
      }`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full"
          >
            {displayImages[currentIndex] ? (
              <img
                src={displayImages[currentIndex]}
                alt={`${productName} - Image ${currentIndex + 1}`}
                className="w-full h-full object-cover cursor-zoom-in"
                onClick={() => setIsZoomed(true)}
              />
            ) : (
              <div className={`w-full h-full flex items-center justify-center text-9xl ${
                theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'
              }`}>
                📦
              </div>
            )}
          </motion.div>
        </AnimatePresence>

      </div>

      {displayImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {displayImages.map((image, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                i === currentIndex
                  ? theme === 'dark'
                    ? 'border-electric-green shadow-lg shadow-electric-green/25'
                    : 'border-accent-blue shadow-lg shadow-accent-blue/25'
                  : theme === 'dark'
                    ? 'border-slate-700 hover:border-slate-600'
                    : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {image ? (
                <img
                  src={image}
                  alt={`${productName} - Thumbnail ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className={`w-full h-full flex items-center justify-center text-2xl ${
                  theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'
                }`}>
                  📦
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {isZoomed && displayImages[currentIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={() => setIsZoomed(false)}
          >
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              aria-label="Close zoom"
            >
              <X className="w-6 h-6" />
            </button>

            {displayImages.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); goPrev(); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); goNext(); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}

            <motion.img
              key={currentIndex}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={displayImages[currentIndex]}
              alt={`${productName} - Full size`}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {displayImages.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); goTo(i); }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === currentIndex ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/75'
                  }`}
                  aria-label={`Go to image ${i + 1}`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
