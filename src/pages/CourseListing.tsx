import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import ELearningNav from '../components/elearning/ELearningNav';
import FilterSidebar from '../components/elearning/FilterSidebar';
import SortingBar from '../components/elearning/SortingBar';
import CourseCard from '../components/elearning/CourseCard';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface Course {
  id: number;
  title: string;
  description: string;
  category: string;
  level: string;
  duration: number;
  price: number;
  instructor: string;
  thumbnail_url?: string;
  rating?: number;
  students_enrolled?: number;
  is_published: boolean;
}

const CourseListing = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 12; // 3 rows x 4 columns
  const { theme } = useTheme();
  const navigate = useNavigate();

  const categories = [
    'All',
    'Web Development',
    'Backend Development',
    'Data Science',
    'Mobile Development',
    'DevOps',
    'AI & ML',
    'Database',
    'Cloud Computing',
    'Cybersecurity',
    'UI/UX Design',
    'IoT',
    'Blockchain'
  ];

  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/courses`);
      setCourses(response.data.courses.filter((course: Course) => course.is_published));
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle price filter changes (update both filter and sort)
  const handlePriceFilterChange = (filter: string) => {
    setPriceFilter(filter);
    // If price sorting options are selected, update the sort as well
    if (filter === 'low-high') {
      setSortBy('price-low');
    } else if (filter === 'high-low') {
      setSortBy('price-high');
    }
  };

  // Filter courses
  const filteredCourses = courses.filter((course) => {
    const courseTitle = (course.title ?? '').toLowerCase();
    const courseDescription = (course.description ?? '').toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = courseTitle.includes(searchLower) || courseDescription.includes(searchLower);
    const matchesCategory = !selectedCategory || course.category === selectedCategory;
    const matchesLevel = !selectedLevel || course.level === selectedLevel;
    
    let matchesPrice = true;
    if (priceFilter === 'free') {
      matchesPrice = course.price === 0;
    } else if (priceFilter === 'paid') {
      matchesPrice = course.price > 0;
    }
    // For sorting options (low-high, high-low), show all courses
    
    return matchesSearch && matchesCategory && matchesLevel && matchesPrice;
  });

  // Sort courses
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return b.id - a.id;
      case 'popular':
        return (b.students_enrolled || 0) - (a.students_enrolled || 0);
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'price-low':
      case 'low-high':
        return a.price - b.price;
      case 'price-high':
      case 'high-low':
        return b.price - a.price;
      default:
        return 0;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedCourses.length / coursesPerPage);
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = sortedCourses.slice(indexOfFirstCourse, indexOfLastCourse);

  const handleCourseClick = (courseId: number) => {
    navigate(`/academy/login?redirect=/academy/course/${courseId}`);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'
    }`}>
      <ELearningNav onSearch={setSearchTerm} searchTerm={searchTerm} />

      {/* Hero Banner */}
      <section className={`pt-32 pb-12 ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-dark-card via-dark-bg to-dark-card'
          : 'bg-gradient-to-br from-white via-gray-50 to-white'
      }`}>
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Explore All{' '}
              <span className={`bg-gradient-to-r ${
                theme === 'dark'
                  ? 'from-electric-green to-electric-blue'
                  : 'from-accent-red to-accent-blue'
              } bg-clip-text text-transparent`}>
                Courses
              </span>
            </h1>
            <p className={`text-lg ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Master new skills with our comprehensive collection of courses
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className="lg:w-1/4">
              <div className="sticky top-24">
                <FilterSidebar
                  categories={categories}
                  levels={levels}
                  selectedCategory={selectedCategory}
                  selectedLevel={selectedLevel}
                  priceFilter={priceFilter}
                  onCategoryChange={setSelectedCategory}
                  onLevelChange={setSelectedLevel}
                  onPriceFilterChange={handlePriceFilterChange}
                />
              </div>
            </aside>

            {/* Course Grid */}
            <main className="lg:w-3/4">
              {/* Sorting Bar */}
              <div className="mb-6">
                <SortingBar
                  totalCourses={sortedCourses.length}
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                />
              </div>

              {/* Courses Grid */}
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className={`rounded-2xl animate-pulse ${
                        theme === 'dark' ? 'bg-dark-card' : 'bg-white'
                      }`}
                    >
                      <div className={`h-48 rounded-t-2xl ${
                        theme === 'dark' ? 'bg-dark-lighter' : 'bg-gray-200'
                      }`}></div>
                      <div className="p-4 space-y-3">
                        <div className={`h-4 rounded ${
                          theme === 'dark' ? 'bg-dark-lighter' : 'bg-gray-200'
                        }`}></div>
                        <div className={`h-4 rounded w-2/3 ${
                          theme === 'dark' ? 'bg-dark-lighter' : 'bg-gray-200'
                        }`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : currentCourses.length === 0 ? (
                <div className={`text-center py-20 rounded-2xl border-2 ${
                  theme === 'dark'
                    ? 'bg-dark-card border-gray-800'
                    : 'bg-white border-gray-200'
                }`}>
                  <p className={`text-xl ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    No courses found. Try adjusting your filters.
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                    {currentCourses.map((course) => (
                      <CourseCard
                        key={course.id}
                        id={course.id}
                        title={course.title}
                        description={course.description}
                        category={course.category}
                        level={course.level}
                        duration={course.duration}
                        price={course.price}
                        instructor={course.instructor}
                        thumbnailUrl={course.thumbnail_url}
                        rating={course.rating}
                        studentsEnrolled={course.students_enrolled}
                        onClick={handleCourseClick}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-lg transition-all ${
                          currentPage === 1
                            ? theme === 'dark'
                              ? 'bg-dark-lighter text-gray-600 cursor-not-allowed'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : theme === 'dark'
                              ? 'bg-dark-card border-2 border-gray-800 text-white hover:border-electric-blue'
                              : 'bg-white border-2 border-gray-200 text-gray-900 hover:border-accent-blue'
                        }`}
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </motion.button>

                      {[...Array(totalPages)].map((_, index) => {
                        const pageNumber = index + 1;
                        if (
                          pageNumber === 1 ||
                          pageNumber === totalPages ||
                          (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                        ) {
                          return (
                            <motion.button
                              key={pageNumber}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handlePageChange(pageNumber)}
                              className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                                currentPage === pageNumber
                                  ? theme === 'dark'
                                    ? 'bg-gradient-to-r from-electric-green to-electric-blue text-dark-bg'
                                    : 'bg-gradient-to-r from-accent-red to-accent-blue text-white'
                                  : theme === 'dark'
                                    ? 'bg-dark-card border-2 border-gray-800 text-white hover:border-electric-blue'
                                    : 'bg-white border-2 border-gray-200 text-gray-900 hover:border-accent-blue'
                              }`}
                            >
                              {pageNumber}
                            </motion.button>
                          );
                        } else if (
                          pageNumber === currentPage - 2 ||
                          pageNumber === currentPage + 2
                        ) {
                          return (
                            <span
                              key={pageNumber}
                              className={`px-2 ${
                                theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                              }`}
                            >
                              ...
                            </span>
                          );
                        }
                        return null;
                      })}

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-lg transition-all ${
                          currentPage === totalPages
                            ? theme === 'dark'
                              ? 'bg-dark-lighter text-gray-600 cursor-not-allowed'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : theme === 'dark'
                              ? 'bg-dark-card border-2 border-gray-800 text-white hover:border-electric-blue'
                              : 'bg-white border-2 border-gray-200 text-gray-900 hover:border-accent-blue'
                        }`}
                      >
                        <ChevronRight className="w-5 h-5" />
                      </motion.button>
                    </div>
                  )}
                </>
              )}
            </main>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-8 mt-12 border-t ${
        theme === 'dark' ? 'bg-dark-card border-gray-800' : 'bg-white border-gray-200'
      }`}>
        <div className="container mx-auto px-4 lg:px-8">
          <p className={`text-center text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            © 2025 NanoFlows Academy. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default CourseListing;
