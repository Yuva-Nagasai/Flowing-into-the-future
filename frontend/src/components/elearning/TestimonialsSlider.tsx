import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  image: string;
  rating: number;
  text: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Priya Sharma',
    role: 'Full Stack Developer',
    company: 'Tech Innovations Ltd',
    image: 'https://i.pravatar.cc/150?img=1',
    rating: 5,
    text: 'NanoFlows Academy transformed my career. The courses are practical, engaging, and taught by industry experts. I landed my dream job within 3 months of completing the Full Stack Developer program!'
  },
  {
    id: 2,
    name: 'Arjun Patel',
    role: 'Data Scientist',
    company: 'Analytics Pro',
    image: 'https://i.pravatar.cc/150?img=12',
    rating: 5,
    text: 'The AI & ML courses are exceptional. The hands-on projects and real-world applications helped me transition from a business analyst to a data scientist. Highly recommended!'
  },
  {
    id: 3,
    name: 'Sarah Johnson',
    role: 'UX Designer',
    company: 'Design Studios Inc',
    image: 'https://i.pravatar.cc/150?img=5',
    rating: 5,
    text: 'Amazing learning platform! The instructors are knowledgeable, the content is up-to-date, and the community support is fantastic. Best investment in my professional development.'
  },
  {
    id: 4,
    name: 'Rahul Kumar',
    role: 'DevOps Engineer',
    company: 'Cloud Systems',
    image: 'https://i.pravatar.cc/150?img=13',
    rating: 5,
    text: 'The DevOps courses gave me the skills and confidence I needed to advance in my career. The practical labs and real-world scenarios made learning engaging and effective.'
  },
  {
    id: 5,
    name: 'Emily Chen',
    role: 'Mobile Developer',
    company: 'App Creators',
    image: 'https://i.pravatar.cc/150?img=9',
    rating: 5,
    text: 'Outstanding course quality and excellent support. The mobile development track is comprehensive and covers everything from basics to advanced concepts. Worth every penny!'
  }
];

const TestimonialsSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const { theme } = useTheme();

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrevious = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <section className={`py-20 ${
      theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'
    }`}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              What Our{' '}
              <span className={`bg-gradient-to-r ${
                theme === 'dark'
                  ? 'from-electric-green to-electric-blue'
                  : 'from-accent-red to-accent-blue'
              } bg-clip-text text-transparent`}>
                Students Say
              </span>
            </h2>
            <p className={`text-lg ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Join thousands of successful learners who transformed their careers
            </p>
          </motion.div>
        </div>

        <div className="relative max-w-5xl mx-auto">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: 'spring', stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              className={`p-8 md:p-12 rounded-3xl border-2 ${
                theme === 'dark'
                  ? 'bg-slate-900/80 border-slate-700/70 backdrop-blur-sm'
                  : 'bg-gradient-to-br from-accent-red/10 to-accent-blue/10 border-accent-red/30 backdrop-blur-sm'
              } shadow-2xl`}
            >
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-shrink-0">
                  <div className="relative">
                    <img
                      src={testimonials[currentIndex].image}
                      alt={testimonials[currentIndex].name}
                      className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-electric-blue/30"
                    />
                    <div className={`absolute -top-2 -right-2 p-2 rounded-full ${
                      theme === 'dark'
                        ? 'bg-electric-green'
                        : 'bg-accent-red'
                    }`}>
                      <Quote className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>

                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-1 mb-4">
                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          theme === 'dark'
                            ? 'fill-electric-green text-electric-green'
                            : 'fill-accent-red text-accent-red'
                        }`}
                      />
                    ))}
                  </div>

                  <p className={`text-lg md:text-xl mb-6 leading-relaxed ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    "{testimonials[currentIndex].text}"
                  </p>

                  <div>
                    <h4 className={`text-xl font-bold mb-1 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {testimonials[currentIndex].name}
                    </h4>
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-electric-blue' : 'text-accent-blue'
                    }`}>
                      {testimonials[currentIndex].role}
                    </p>
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                    }`}>
                      {testimonials[currentIndex].company}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-center mt-8">
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > currentIndex ? 1 : -1);
                    setCurrentIndex(index);
                  }}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? theme === 'dark'
                        ? 'w-8 bg-electric-green'
                        : 'w-8 bg-accent-red'
                      : 'w-2 bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSlider;
