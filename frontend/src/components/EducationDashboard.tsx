import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import {
  ArrowLeft,
  Search,
  BookOpen,
  Clock,
  Star,
  TrendingUp,
  Award,
  Library,
  Grid3x3,
  List,
  Moon,
  Sun,
  Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Course {
  id: number;
  title: string;
  instructor: string;
  rating: number;
  students: number;
  duration: string;
  progress?: number;
  price: string;
  thumbnail: string;
  category: string;
  level: string;
  lastUpdated?: string;
}

const EducationDashboard = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState('my-learning');
  const [selectedCategory, setSelectedCategory] = useState('all courses');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const categories = [
    'All Courses',
    'AI & Machine Learning',
    'Web Development',
    'Data Science',
    'Business',
    'Design',
    'Marketing'
  ];

  const myCourses: Course[] = [
    {
      id: 1,
      title: 'Complete AI & Machine Learning Bootcamp 2025',
      instructor: 'Dr. Sarah Johnson',
      rating: 4.8,
      students: 45230,
      duration: '42 hours',
      progress: 65,
      price: '₹6,999',
      thumbnail: '/nanoflows-image.png',
      category: 'AI & Machine Learning',
      level: 'Intermediate',
      lastUpdated: '2 days ago'
    },
    {
      id: 2,
      title: 'Advanced React & TypeScript Development',
      instructor: 'Michael Chen',
      rating: 4.9,
      students: 38421,
      duration: '35 hours',
      progress: 42,
      price: '₹5,999',
      thumbnail: '/nanoflows-image.png',
      category: 'Web Development',
      level: 'Advanced',
      lastUpdated: '1 week ago'
    },
    {
      id: 3,
      title: 'Data Science with Python - Complete Guide',
      instructor: 'Emily Rodriguez',
      rating: 4.7,
      students: 52100,
      duration: '50 hours',
      progress: 28,
      price: '₹7,499',
      thumbnail: '/nanoflows-image.png',
      category: 'Data Science',
      level: 'Beginner',
      lastUpdated: '3 days ago'
    }
  ];

  const featuredCourses: Course[] = [
    {
      id: 4,
      title: 'Deep Learning Specialization',
      instructor: 'Prof. Andrew Ng',
      rating: 4.9,
      students: 120000,
      duration: '60 hours',
      price: '₹9,999',
      thumbnail: '/nanoflows-image.png',
      category: 'AI & Machine Learning',
      level: 'Advanced'
    },
    {
      id: 5,
      title: 'Full Stack Web Development Masterclass',
      instructor: 'John Smith',
      rating: 4.8,
      students: 89000,
      duration: '55 hours',
      price: '₹7,999',
      thumbnail: '/nanoflows-image.png',
      category: 'Web Development',
      level: 'Intermediate'
    },
    {
      id: 6,
      title: 'UX/UI Design Principles & Figma',
      instructor: 'Lisa Anderson',
      rating: 4.7,
      students: 67000,
      duration: '28 hours',
      price: '₹5,499',
      thumbnail: '/nanoflows-image.png',
      category: 'Design',
      level: 'Beginner'
    },
    {
      id: 7,
      title: 'Digital Marketing Mastery 2025',
      instructor: 'Rachel Green',
      rating: 4.6,
      students: 55000,
      duration: '32 hours',
      price: '₹4,999',
      thumbnail: '/nanoflows-image.png',
      category: 'Marketing',
      level: 'Beginner'
    },
    {
      id: 8,
      title: 'Business Analytics & Intelligence',
      instructor: 'David Wilson',
      rating: 4.8,
      students: 42000,
      duration: '38 hours',
      price: '₹6,499',
      thumbnail: '/nanoflows-image.png',
      category: 'Business',
      level: 'Intermediate'
    }
  ];

  const allCourses = [...myCourses, ...featuredCourses];

  const filteredCourses = allCourses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayedCourses = selectedCategory === 'all courses'
    ? featuredCourses
    : featuredCourses.filter(course => 
        course.category.toLowerCase() === selectedCategory.toLowerCase()
      );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCourseClick = (course: Course) => {
    alert(`Opening: ${course.title}\n\nInstructor: ${course.instructor}\nPrice: ${course.price}\nDuration: ${course.duration}\n\nThis would navigate to the course details page.`);
  };

  const handleEnrollClick = (course: Course, e: React.MouseEvent) => {
    e.stopPropagation();
    alert(`Enrolling in: ${course.title}\n\nPrice: ${course.price}\n\nThis would open the enrollment/payment page.`);
  };

  const CourseCard = ({ course, showProgress = false }: { course: Course; showProgress?: boolean }) => (
    <motion.div
      whileHover={{ y: -5 }}
      onClick={() => handleCourseClick(course)}
      className={`rounded-lg overflow-hidden border cursor-pointer transition-all ${
        theme === 'dark'
          ? 'bg-dark-lighter border-gray-700 hover:border-electric-blue'
          : 'bg-white border-gray-200 hover:border-accent-blue hover:shadow-lg'
      }`}
    >
      <div className="relative">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-40 object-cover"
        />
        <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-semibold ${
          theme === 'dark' ? 'bg-electric-green text-black' : 'bg-accent-red text-white'
        }`}>
          {course.level}
        </div>
        {showProgress && (
          <div className="absolute bottom-2 left-2 right-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                alert(`Continuing: ${course.title}\n\nYou're ${course.progress}% complete!`);
              }}
              className={`w-full py-2 px-4 rounded font-semibold flex items-center justify-center gap-2 ${
                theme === 'dark' ? 'bg-electric-blue text-black' : 'bg-accent-red text-white'
              }`}
            >
              <Play className="w-4 h-4" />
              Continue Learning
            </button>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className={`font-semibold text-base mb-2 line-clamp-2 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          {course.title}
        </h3>
        
        <p className={`text-sm mb-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
          {course.instructor}
        </p>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {course.rating}
            </span>
          </div>
          <span className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
            ({course.students.toLocaleString()} students)
          </span>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1 text-sm">
            <Clock className="w-4 h-4" />
            <span className={theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}>
              {course.duration}
            </span>
          </div>
          <span className={`font-bold text-lg ${theme === 'dark' ? 'text-electric-green' : 'text-accent-red'}`}>
            {course.price}
          </span>
        </div>

        {showProgress && course.progress !== undefined && (
          <div className="mt-3">
            <div className="flex justify-between text-sm mb-1">
              <span className={theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}>
                Progress
              </span>
              <span className={theme === 'dark' ? 'text-electric-blue' : 'text-accent-red'}>
                {course.progress}%
              </span>
            </div>
            <div className={`w-full h-2 rounded-full overflow-hidden ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
            }`}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${course.progress}%` }}
                transition={{ duration: 1, delay: 0.2 }}
                className={`h-full ${theme === 'dark' ? 'bg-electric-blue' : 'bg-accent-red'}`}
              />
            </div>
          </div>
        )}

        {!showProgress && (
          <button
            onClick={(e) => handleEnrollClick(course, e)}
            className={`w-full mt-2 py-2 px-4 rounded font-semibold transition-all ${
              theme === 'dark'
                ? 'bg-electric-green text-black hover:bg-electric-blue'
                : 'bg-accent-red text-white hover:bg-red-700'
            }`}
          >
            Enroll Now
          </button>
        )}

        {showProgress && course.lastUpdated && (
          <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
            Last accessed: {course.lastUpdated}
          </p>
        )}
      </div>
    </motion.div>
  );

  const ListCourseCard = ({ course, showProgress = false }: { course: Course; showProgress?: boolean }) => (
    <motion.div
      whileHover={{ x: 5 }}
      onClick={() => handleCourseClick(course)}
      className={`rounded-lg overflow-hidden border cursor-pointer transition-all flex gap-4 p-4 ${
        theme === 'dark'
          ? 'bg-dark-lighter border-gray-700 hover:border-electric-blue'
          : 'bg-white border-gray-200 hover:border-accent-blue hover:shadow-lg'
      }`}
    >
      <img
        src={course.thumbnail}
        alt={course.title}
        className="w-40 h-28 object-cover rounded flex-shrink-0"
      />
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-2">
          <h3 className={`font-semibold text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {course.title}
          </h3>
          <span className={`font-bold text-lg ml-4 flex-shrink-0 ${
            theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
          }`}>
            {course.price}
          </span>
        </div>
        
        <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
          {course.instructor}
        </p>

        <div className="flex items-center gap-4 mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {course.rating}
            </span>
            <span className={`text-xs ml-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
              ({course.students.toLocaleString()})
            </span>
          </div>
          
          <div className="flex items-center gap-1 text-sm">
            <Clock className="w-4 h-4" />
            <span className={theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}>
              {course.duration}
            </span>
          </div>

          <span className={`px-2 py-1 rounded text-xs font-semibold ${
            theme === 'dark' ? 'bg-electric-green text-black' : 'bg-accent-red text-white'
          }`}>
            {course.level}
          </span>
        </div>

        {showProgress && course.progress !== undefined ? (
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className={`w-full h-2 rounded-full overflow-hidden ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
              }`}>
                <div
                  style={{ width: `${course.progress}%` }}
                  className={`h-full ${theme === 'dark' ? 'bg-electric-blue' : 'bg-accent-red'}`}
                />
              </div>
            </div>
            <span className={`text-sm font-semibold ${
              theme === 'dark' ? 'text-electric-blue' : 'text-accent-red'
            }`}>
              {course.progress}%
            </span>
          </div>
        ) : (
          <button
            onClick={(e) => handleEnrollClick(course, e)}
            className={`px-6 py-2 rounded font-semibold transition-all ${
              theme === 'dark'
                ? 'bg-electric-green text-black hover:bg-electric-blue'
                : 'bg-accent-red text-white hover:bg-red-700'
            }`}
          >
            Enroll Now
          </button>
        )}
      </div>
    </motion.div>
  );

  interface StatCardProps {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: string;
    color: string;
    onClick?: () => void;
  }

  const StatCard = ({ icon: Icon, label, value, color, onClick }: StatCardProps) => (
    <motion.div
      whileHover={{ scale: 1.05 }}
      onClick={onClick}
      className={`rounded-lg p-6 cursor-pointer transition-all ${
        theme === 'dark' ? 'bg-dark-lighter border border-gray-700 hover:border-electric-blue' : 'bg-white border border-gray-200 hover:shadow-lg'
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
            {label}
          </p>
          <p className={`text-2xl font-bold mt-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {value}
          </p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'}`}>
      <div className={`border-b ${theme === 'dark' ? 'bg-dark-card border-gray-800' : 'bg-white border-gray-200'}`}>
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-6 lg:gap-8 min-w-0 flex-1">
              <h1 className={`text-lg sm:text-xl lg:text-2xl font-bold font-orbitron truncate ${
                theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
              }`}>
                Nano Flows Academy
              </h1>
              
              <nav className="hidden md:flex items-center gap-4 lg:gap-6">
  <button
    onClick={() => setActiveTab('my-learning')}
    className={`flex items-center gap-2 font-semibold transition-colors ${
      activeTab === 'my-learning'
        ? theme === 'dark'
          ? 'text-electric-blue'
          : 'text-accent-red'
        : theme === 'dark'
          ? 'text-gray-400 hover:text-white'
          : 'text-gray-800 hover:text-gray-900'
    }`}
  >
    <BookOpen className="w-5 h-5" />
    My Learning
  </button>

  <button
    onClick={() => setActiveTab('browse')}
    className={`flex items-center gap-2 font-semibold transition-colors ${
      activeTab === 'browse'
        ? theme === 'dark'
          ? 'text-electric-blue'
          : 'text-accent-red'
        : theme === 'dark'
          ? 'text-gray-400 hover:text-white'
          : 'text-gray-800 hover:text-gray-900'
    }`}
  >
    <Library className="w-5 h-5" />
    Browse
  </button>
</nav>

            </div>

            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-shrink-0">
              <div className="relative hidden lg:block" ref={searchRef}>
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-900'
                }`} />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearchDropdown(e.target.value.length > 0);
                  }}
                  onFocus={() => searchQuery.length > 0 && setShowSearchDropdown(true)}
                  className={`pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 w-64 xl:w-80 ${
                    theme === 'dark'
                      ? 'bg-dark-lighter border-gray-700 text-white focus:ring-electric-blue'
                      : 'bg-white border-gray-300 text-gray-900 focus:ring-accent-blue'
                  }`}
                />
                
                <AnimatePresence>
                  {showSearchDropdown && filteredCourses.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`absolute top-full mt-2 w-full rounded-lg border shadow-lg max-h-96 overflow-y-auto z-50 ${
                        theme === 'dark'
                          ? 'bg-dark-card border-gray-700'
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      {filteredCourses.slice(0, 5).map((course) => (
                        <div
                          key={course.id}
                          onClick={() => {
                            handleCourseClick(course);
                            setShowSearchDropdown(false);
                            setSearchQuery('');
                          }}
                          className={`p-3 cursor-pointer flex items-start gap-3 border-b last:border-b-0 transition-colors ${
                            theme === 'dark'
                              ? 'border-gray-700 hover:bg-dark-lighter'
                              : 'border-gray-100 hover:bg-gray-50'
                          }`}
                        >
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-16 h-12 object-cover rounded flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className={`font-semibold text-sm line-clamp-1 ${
                              theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}>
                              {course.title}
                            </h4>
                            <p className={`text-xs ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                              {course.instructor}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs">{course.rating}</span>
                              </div>
                              <span className={`text-xs font-semibold ${
                                theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                              }`}>
                                {course.price}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-all ${
                  theme === 'dark'
                    ? 'bg-dark-lighter hover:bg-gray-700 text-electric-blue'
                    : 'bg-gray-100 hover:bg-gray-200 text-accent-red'
                }`}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

             <button
  onClick={() => navigate(-1)}
  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
    theme === 'dark'
      ? 'bg-electric-green text-black hover:bg-electric-blue'
      : 'bg-accent-red text-white hover:bg-red-700'
  }`}
>
  <ArrowLeft className="w-5 h-5" />
  <span className="hidden sm:inline">Back to Home</span>
  <span className="sm:hidden inline">Back</span>
</button>

            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
        {activeTab === 'my-learning' && (
          <div className="space-y-8">
            <div>
              <h2 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                My Learning Dashboard
              </h2>
              <p className={`text-lg ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                Continue your learning journey
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <StatCard
                icon={BookOpen}
                label="Courses Enrolled"
                value="3"
                color="bg-blue-500"
                onClick={() => alert('Viewing all enrolled courses')}
              />
              <StatCard
                icon={Clock}
                label="Learning Hours"
                value="127"
                color="bg-green-500"
                onClick={() => alert('Total learning time across all courses')}
              />
              <StatCard
                icon={Award}
                label="Certificates"
                value="2"
                color="bg-purple-500"
                onClick={() => alert('View your earned certificates')}
              />
              <StatCard
                icon={TrendingUp}
                label="Average Progress"
                value="45%"
                color="bg-orange-500"
                onClick={() => alert('Your average progress across all courses')}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Continue Learning
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveView('grid')}
                    className={`p-2 rounded transition-all ${
                      activeView === 'grid'
                        ? theme === 'dark' ? 'bg-electric-blue text-black' : 'bg-accent-red text-white'
                        : theme === 'dark' ? 'bg-dark-lighter text-gray-200 hover:bg-gray-700' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                  >
                    <Grid3x3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setActiveView('list')}
                    className={`p-2 rounded transition-all ${
                      activeView === 'list'
                        ? theme === 'dark' ? 'bg-electric-blue text-black' : 'bg-accent-red text-white'
                        : theme === 'dark' ? 'bg-dark-lighter text-gray-200 hover:bg-gray-700' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {activeView === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {myCourses.map((course) => (
                    <CourseCard key={course.id} course={course} showProgress />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {myCourses.map((course) => (
                    <ListCourseCard key={course.id} course={course} showProgress />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'browse' && (
          <div className="space-y-8">
            <div>
              <h2 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Explore Courses
              </h2>
              <p className={`text-lg ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                Discover new skills and expand your knowledge
              </p>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category.toLowerCase())}
                  className={`px-6 py-2 rounded-full font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === category.toLowerCase()
                      ? theme === 'dark'
                        ? 'bg-electric-blue text-black'
                        : 'bg-accent-red text-white'
                      : theme === 'dark'
                        ? 'bg-dark-lighter text-gray-400 hover:bg-gray-700'
                        : 'bg-white text-gray-800 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div>
              <h3 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {selectedCategory === 'all courses' ? 'Featured Courses' : selectedCategory}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </div>

            <div className={`rounded-lg p-8 text-center ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-electric-blue/20 to-electric-green/20 border border-electric-blue/30'
                : 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200'
            }`}>
              <TrendingUp className={`w-12 h-12 mx-auto mb-4 ${
                theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
              }`} />
              <h3 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Start Your Learning Journey Today
              </h3>
              <p className={`text-lg mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>
                Join thousands of students and unlock your potential
              </p>
              <button
                onClick={() => {
                  setActiveTab('browse');
                  setSelectedCategory('all courses');
                }}
                className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                  theme === 'dark'
                    ? 'bg-electric-green text-black hover:bg-electric-blue'
                    : 'bg-accent-red text-white hover:bg-accent-blue'
                }`}
              >
                Browse All Courses
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EducationDashboard;
