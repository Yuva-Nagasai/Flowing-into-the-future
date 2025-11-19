import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { coursesAPI, purchasesAPI, modulesAPI } from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  FiPlay, FiDownload, FiCheckCircle, FiArrowLeft, FiUser, FiClock, 
  FiBook, FiStar, FiChevronDown, FiChevronUp, FiVideo, FiFileText,
  FiAward, FiShoppingCart, FiTrendingUp, FiX
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [isPurchased, setIsPurchased] = useState(false);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [expandedModules, setExpandedModules] = useState({});
  const [selectedLesson, setSelectedLesson] = useState(null);
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourseDetails();
    checkPurchaseStatus();
  }, [id]);

  const fetchCourseDetails = async () => {
    try {
      const [courseRes, modulesRes] = await Promise.all([
        coursesAPI.getById(id),
        modulesAPI.getByCourse(id).catch(() => ({ data: { modules: [] } }))
      ]);
      setCourse(courseRes.data.course);
      setModules(modulesRes.data.modules || []);
    } catch (error) {
      console.error('Error fetching course:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkPurchaseStatus = async () => {
    try {
      const response = await purchasesAPI.checkPurchase(id);
      setIsPurchased(response.data.purchased);
    } catch (error) {
      console.error('Error checking purchase:', error);
    }
  };

  const handlePurchase = async () => {
    // If course is free, enroll directly
    if (course?.free) {
      try {
        const { paymentsAPI } = await import('../../utils/api');
        await paymentsAPI.enrollFree({ course_id: id });
        // Refresh purchase status
        checkPurchaseStatus();
        navigate(`/academy/course/${id}/learn`);
      } catch (error) {
        console.error('Free enrollment error:', error);
        alert(error.response?.data?.error || 'Error enrolling in free course');
      }
    } else {
      navigate(`/academy/checkout/${id}`);
    }
  };

  const toggleModule = (moduleId) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const getLessonTypeIcon = (lessonType) => {
    switch (lessonType) {
      case 'video': return FiVideo;
      case 'pdf': return FiFileText;
      case 'quiz': return FiBook;
      case 'assignment': return FiAward;
      default: return FiFileText;
    }
  };

  const getTotalLessons = () => {
    return modules.reduce((total, module) => total + (module.lessons?.length || 0), 0);
  };

  const getEmbedUrl = (url) => {
    if (!url) return '';
    
    // Handle local uploaded videos (from /uploads/)
    if (url.includes('/uploads/')) {
      const filename = url.split('/uploads/')[1];
      // Use the protected video serving endpoint
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      return `${API_URL}/videos/serve/${filename}`;
    }
    
    // Handle Google Drive URLs
    if (url.includes('drive.google.com')) {
      let fileId = null;
      
      // Try to extract file ID from different Google Drive URL formats
      // Format 1: https://drive.google.com/file/d/FILE_ID/view
      const match1 = url.match(/\/d\/([-\w]{25,})/);
      if (match1) {
        fileId = match1[1];
      }
      
      // Format 2: https://drive.google.com/open?id=FILE_ID
      if (!fileId) {
        const match2 = url.match(/[?&]id=([-\w]{25,})/);
        if (match2) {
          fileId = match2[1];
        }
      }
      
      // Format 3: https://drive.google.com/uc?id=FILE_ID
      if (!fileId) {
        const match3 = url.match(/\/uc\?id=([-\w]{25,})/);
        if (match3) {
          fileId = match3[1];
        }
      }
      
      // Format 4: Generic pattern match
      if (!fileId) {
        const match4 = url.match(/([-\w]{25,})/);
        if (match4 && match4[1].length >= 25) {
          fileId = match4[1];
        }
      }
      
      if (fileId) {
        // Use the embed format that works in iframes
        // Note: Google Drive file must be shared with "Anyone with the link" and set to "Viewer" for embedding to work
        // Try the embed format first
        return `https://drive.google.com/file/d/${fileId}/preview`;
      }
    }
    
    // Handle YouTube URLs
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      let videoId;
      if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1].split('?')[0];
      } else {
        try {
          const urlParams = new URLSearchParams(new URL(url).search);
          videoId = urlParams.get('v');
        } catch (e) {
          // If URL parsing fails, try regex
          const match = url.match(/[?&]v=([^&]+)/);
          videoId = match ? match[1] : null;
        }
      }
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }
    
    // Return original URL if no conversion needed
    return url;
  };

  const handleLessonClick = (lesson) => {
    if (!isPurchased) {
      // If not purchased, show purchase prompt or redirect to checkout
      handlePurchase();
      return;
    }
    
    // Only allow video lessons to play inline
    if (lesson.lesson_type === 'video' && lesson.video_url) {
      setSelectedLesson(lesson);
      // Scroll to video player
      setTimeout(() => {
        document.getElementById('video-player-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else if (lesson.lesson_type === 'video') {
      // If it's a video but no URL, redirect to player
      navigate(`/academy/player/${id}`);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
        theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'
      }`}>
        <div className={`text-xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Loading course details...
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
        theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'
      }`}>
        <div className={`text-xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Course not found
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'
    }`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 border-b backdrop-blur-xl ${
        theme === 'dark' ? 'border-gray-800 bg-dark-card/80' : 'border-gray-200 bg-white/80'
      }`}>
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link
              to="/academy/dashboard?tab=courses"
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                theme === 'dark'
                  ? 'hover:bg-dark-lighter text-gray-300 hover:text-white'
                  : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'
              }`}
            >
              <FiArrowLeft size={18} />
              <span className="font-semibold">Back to Courses</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className={`relative overflow-hidden border-b-2 ${
        theme === 'dark' ? 'border-gray-800 bg-dark-lighter' : 'border-gray-200 bg-white'
      }`}>
        <div className={`absolute -right-20 -top-20 h-64 w-64 rounded-full blur-3xl ${
          theme === 'dark' ? 'bg-electric-blue/10' : 'bg-accent-red/10'
        }`} />
        <div className={`absolute -bottom-10 -left-10 h-48 w-48 rounded-full blur-2xl ${
          theme === 'dark' ? 'bg-electric-green/10' : 'bg-accent-blue/10'
        }`} />
        
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Course Image */}
            <div className="relative">
              <div className={`rounded-2xl overflow-hidden border-2 shadow-2xl ${
                theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <img
                  src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3'}
                  alt={course.title}
                  className="w-full h-auto object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3';
                  }}
                />
              </div>
              {course.promotional_video && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-2xl group ${
                    theme === 'dark' ? 'hover:bg-black/60' : 'hover:bg-black/70'
                  }`}
                  onClick={() => {
                    window.open(course.promotional_video, '_blank');
                  }}
                >
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
                    theme === 'dark'
                      ? 'bg-electric-green text-black'
                      : 'bg-accent-red text-white'
                  } shadow-2xl group-hover:scale-110 transition-transform`}>
                    <FiPlay size={32} className="ml-1" />
                  </div>
                </motion.button>
              )}
            </div>

            {/* Course Info */}
            <div className="space-y-6">
              <div>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-[0.2em] mb-4 ${
                  theme === 'dark'
                    ? 'border-electric-blue/30 bg-electric-blue/10 text-electric-blue'
                    : 'border-accent-red/30 bg-accent-red/10 text-accent-red'
                }`}>
                  <FiBook size={14} />
                  {course.category}
                </div>
                <h1 className={`text-4xl lg:text-5xl font-bold leading-tight mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                  {course.title}
                </h1>
                <p className={`text-lg leading-relaxed ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {course.description}
                </p>
              </div>

              {/* Course Stats */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { 
                    icon: FiUser, 
                    label: 'Instructor', 
                    value: course.instructor_name || 'Expert Instructor',
                    highlight: true
                  },
                  { icon: FiBook, label: 'Lessons', value: getTotalLessons() },
                  { icon: FiClock, label: 'Duration', value: 'Self-paced' }
                ].map((stat, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`p-4 rounded-xl border-2 ${
                      theme === 'dark'
                        ? 'bg-dark-card border-gray-700'
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className={`flex items-center justify-center h-10 w-10 mx-auto mb-2 rounded-full ${
                      stat.highlight
                        ? theme === 'dark'
                          ? 'bg-electric-green/20 text-electric-green'
                          : 'bg-accent-red/20 text-accent-red'
                        : theme === 'dark'
                          ? 'bg-electric-blue/20 text-electric-blue'
                          : 'bg-accent-blue/20 text-accent-blue'
                    }`}>
                      <stat.icon size={20} />
                    </div>
                    <p className={`text-xs text-center mb-1 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>{stat.label}</p>
                    <p className={`text-sm font-bold text-center ${
                      stat.highlight
                        ? theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                        : theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>{stat.value}</p>
                  </motion.div>
                ))}
              </div>

              {/* Price & CTA */}
              <div className={`rounded-2xl border-2 p-6 shadow-xl ${
                theme === 'dark'
                  ? 'bg-dark-card border-gray-700'
                  : 'bg-white border-gray-200'
              }`}>
                <div className="flex items-baseline gap-2 mb-6">
                  {course.free ? (
                    <>
                      <span className={`text-4xl font-bold ${
                        theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                      }`}>Free</span>
                      <span className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>no payment required</span>
                    </>
                  ) : (
                    <>
                      <span className={`text-4xl font-bold ${
                        theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                      }`}>₹{course.price}</span>
                      <span className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>one-time payment</span>
                    </>
                  )}
                </div>
                
                {isPurchased ? (
                  <div className="space-y-3">
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
                      theme === 'dark'
                        ? 'bg-electric-green/20 text-electric-green border border-electric-green/30'
                        : 'bg-green-100 text-green-700 border border-green-300'
                    }`}>
                      <FiCheckCircle size={20} />
                      <span className="font-semibold">Already Enrolled</span>
                    </div>
                    <button
                      onClick={() => {
                        // Auto-select first video lesson if available
                        const firstVideoLesson = modules
                          .flatMap(m => m.lessons || [])
                          .find(l => l.lesson_type === 'video' && l.video_url);
                        if (firstVideoLesson) {
                          setSelectedLesson(firstVideoLesson);
                          setTimeout(() => {
                            document.getElementById('video-player-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }, 100);
                        } else {
                          navigate(`/academy/course/${id}/learn`);
                        }
                      }}
                      className={`block w-full py-3.5 px-6 rounded-xl font-bold text-white text-center transition-all hover:scale-105 shadow-lg ${
                        theme === 'dark'
                          ? 'bg-electric-green hover:bg-electric-blue shadow-electric-green/40'
                          : 'bg-accent-red hover:bg-accent-blue shadow-accent-red/40'
                      }`}
                    >
                      Start Learning →
                    </button>
                  </div>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handlePurchase}
                    disabled={purchasing}
                    className={`w-full py-3.5 px-6 rounded-xl font-bold text-white transition-all shadow-lg disabled:opacity-50 ${
                      theme === 'dark'
                        ? 'bg-electric-green hover:bg-electric-blue shadow-electric-green/40'
                        : 'bg-accent-red hover:bg-accent-blue shadow-accent-red/40'
                    }`}
                  >
                    {purchasing ? (
                      <span className="flex items-center justify-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        >
                          <FiTrendingUp size={18} />
                        </motion.div>
                        Processing...
                      </span>
                    ) : course.free ? (
                      <span className="flex items-center justify-center gap-2">
                        <FiCheckCircle size={18} />
                        Enroll Free
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <FiShoppingCart size={18} />
                        Buy Now
                      </span>
                    )}
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Player Section (Inline) */}
      {isPurchased && selectedLesson && selectedLesson.lesson_type === 'video' && selectedLesson.video_url && (
        <section id="video-player-section" className={`border-t-2 ${
          theme === 'dark' ? 'border-gray-800 bg-dark-lighter' : 'border-gray-200 bg-white'
        }`}>
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex-1">
                <h2 className={`text-2xl font-bold mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                  {selectedLesson.title}
                </h2>
                <div className="flex items-center gap-4 flex-wrap">
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {modules.find(m => m.lessons?.some(l => l.id === selectedLesson.id))?.title || 'Course Video'}
                  </p>
                  {course.instructor_name && (
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
                      theme === 'dark'
                        ? 'bg-electric-blue/20 border border-electric-blue/30'
                        : 'bg-accent-blue/20 border border-accent-blue/30'
                    }`}>
                      <FiUser size={14} className={theme === 'dark' ? 'text-electric-blue' : 'text-accent-blue'} />
                      <span className={`text-sm font-semibold ${
                        theme === 'dark' ? 'text-electric-blue' : 'text-accent-blue'
                      }`}>
                        {course.instructor_name}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => setSelectedLesson(null)}
                className={`p-2 rounded-xl transition-all ${
                  theme === 'dark'
                    ? 'hover:bg-gray-800 text-gray-400 hover:text-white'
                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                }`}
              >
                <FiX size={24} />
              </button>
            </div>
              <div className={`rounded-2xl overflow-hidden border-2 shadow-2xl ${
                theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <div className="w-full aspect-video bg-black relative">
                  {selectedLesson.video_url?.includes('/uploads/') ? (
                    // Local uploaded video - use HTML5 video player
                    <video
                      src={getEmbedUrl(selectedLesson.video_url)}
                      className="w-full h-full"
                      controls
                      controlsList="nodownload"
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    // External video (YouTube, Google Drive) - use iframe
                    <>
                      <iframe
                        src={getEmbedUrl(selectedLesson.video_url)}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={selectedLesson.title}
                        style={{ border: 'none' }}
                        frameBorder="0"
                        loading="lazy"
                      />
                      {selectedLesson.video_url?.includes('drive.google.com') && (
                        <div className={`absolute bottom-4 left-4 right-4 p-3 rounded-lg text-sm ${
                          theme === 'dark' ? 'bg-yellow-900/80 text-yellow-200' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          <p className="font-semibold mb-1">⚠️ Google Drive Embedding Note:</p>
                          <p>If the video redirects, ensure the Google Drive file is shared with "Anyone with the link" and set to "Viewer" permission.</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
          </div>
        </section>
      )}

      {/* Syllabus Section */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className={`text-3xl font-bold mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
            Course{' '}
            <span className={theme === 'dark' ? 'text-electric-green' : 'text-accent-red'}>
              Syllabus
            </span>
          </h2>
          <p className={`text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {modules.length} modules • {getTotalLessons()} lessons
          </p>
        </div>

        {modules.length === 0 ? (
          <div className={`text-center py-12 rounded-2xl border-2 ${
            theme === 'dark'
              ? 'bg-dark-card border-gray-700 text-gray-400'
              : 'bg-white border-gray-200 text-gray-600'
          }`}>
            <FiBook size={48} className="mx-auto mb-4 opacity-50" />
            <p>Course content is being prepared. Check back soon!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {modules.map((module, moduleIdx) => {
              const isExpanded = expandedModules[module.id];
              const LessonIcon = getLessonTypeIcon('video');
              
              return (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: moduleIdx * 0.1 }}
                  className={`rounded-xl border-2 overflow-hidden ${
                    theme === 'dark'
                      ? 'bg-dark-card border-gray-700'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <button
                    onClick={() => toggleModule(module.id)}
                    className={`w-full flex items-center justify-between p-5 text-left transition-all ${
                      theme === 'dark'
                        ? 'hover:bg-dark-lighter'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        theme === 'dark'
                          ? 'bg-electric-blue/20 text-electric-blue'
                          : 'bg-accent-blue/20 text-accent-blue'
                      }`}>
                        {moduleIdx + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className={`text-lg font-bold mb-1 ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {module.title}
                        </h3>
                        <p className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {module.lessons?.length || 0} lessons
                        </p>
                      </div>
                    </div>
                    {isExpanded ? (
                      <FiChevronUp className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} size={20} />
                    ) : (
                      <FiChevronDown className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} size={20} />
                    )}
                  </button>

                  <AnimatePresence>
                    {isExpanded && module.lessons && module.lessons.length > 0 && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`border-t ${
                          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                        }`}
                      >
                        <div className="p-4 space-y-2">
                          {module.lessons.map((lesson, lessonIdx) => {
                            const Icon = getLessonTypeIcon(lesson.lesson_type);
                            const isSelected = selectedLesson?.id === lesson.id;
                            return (
                              <div
                                key={lesson.id}
                                onClick={() => handleLessonClick(lesson)}
                                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                                  isSelected
                                    ? theme === 'dark'
                                      ? 'bg-electric-green/20 border-2 border-electric-green/50'
                                      : 'bg-accent-red/20 border-2 border-accent-red/50'
                                    : theme === 'dark'
                                      ? 'bg-dark-lighter hover:bg-gray-800 border-2 border-transparent'
                                      : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                                }`}
                              >
                                <div className={`p-2 rounded-lg ${
                                  isSelected
                                    ? theme === 'dark'
                                      ? 'bg-electric-green text-black'
                                      : 'bg-accent-red text-white'
                                    : theme === 'dark'
                                      ? 'bg-electric-green/20 text-electric-green'
                                      : 'bg-accent-red/20 text-accent-red'
                                }`}>
                                  <Icon size={16} />
                                </div>
                                <div className="flex-1">
                                  <p className={`text-sm font-semibold mb-1 ${
                                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                                  }`}>
                                    {lesson.title}
                                  </p>
                                  <div className="flex items-center gap-3 flex-wrap">
                                    <p className={`text-xs ${
                                      theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                                    }`}>
                                      {lesson.lesson_type?.toUpperCase() || 'LESSON'}
                                    </p>
                                    {course.instructor_name && (
                                      <>
                                        <span className={`text-xs ${
                                          theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                                        }`}>•</span>
                                        <div className="flex items-center gap-1.5">
                                          <FiUser size={12} className={theme === 'dark' ? 'text-gray-500' : 'text-gray-500'} />
                                          <span className={`text-xs ${
                                            theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                                          }`}>
                                            {course.instructor_name}
                                          </span>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  {lesson.duration && (
                                    <span className={`text-xs ${
                                      theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                                    }`}>
                                      {lesson.duration}
                                    </span>
                                  )}
                                  {lesson.lesson_type === 'video' && (
                                    <FiPlay className={`${
                                      isSelected
                                        ? theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                                        : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                    }`} size={16} />
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default CourseDetails;
