import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { coursesAPI, purchasesAPI, modulesAPI } from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  FiPlay, FiDownload, FiCheckCircle, FiArrowLeft, FiUser, FiClock, 
  FiBook, FiStar, FiChevronDown, FiChevronUp, FiVideo, FiFileText,
  FiAward, FiShoppingCart, FiTrendingUp, FiX, FiUsers, FiTarget, 
  FiLayers, FiGlobe, FiMail, FiLinkedin
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../../components/SEO';

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

  // Mock data for demo (ideally this would come from the backend)
  const learningOutcomes = [
    'Master the fundamentals and advanced concepts',
    'Build real-world projects from scratch',
    'Learn industry best practices and techniques',
    'Get hands-on experience with modern tools'
  ];

  const requirements = [
    'Basic computer skills',
    'A computer with internet connection',
    'Willingness to learn and practice',
    'No prior experience required'
  ];

  const faqs = [
    {
      question: 'How long do I have access to the course?',
      answer: 'You get lifetime access to the course content, including all future updates.'
    },
    {
      question: 'Can I get a refund if I\'m not satisfied?',
      answer: 'Yes! We offer a 30-day money-back guarantee. Contact support for assistance.'
    },
    {
      question: 'Do I get a certificate upon completion?',
      answer: 'Yes, you will receive a certificate of completion once you finish all course modules.'
    },
    {
      question: 'Is this course suitable for beginners?',
      answer: 'Absolutely! This course is designed for learners at all levels, from beginners to advanced.'
    }
  ];

  const reviews = [
    {
      id: 1,
      name: 'Sarah Johnson',
      rating: 5,
      comment: 'Excellent course! The instructor explains concepts very clearly and the hands-on projects were incredibly helpful.',
      date: '2 weeks ago'
    },
    {
      id: 2,
      name: 'Michael Chen',
      rating: 5,
      comment: 'Best investment I\'ve made in my education. The content is up-to-date and practical.',
      date: '1 month ago'
    },
    {
      id: 3,
      name: 'Emily Davis',
      rating: 4,
      comment: 'Great course overall. Would love to see more advanced examples in future updates.',
      date: '3 weeks ago'
    }
  ];

  const [expandedFAQ, setExpandedFAQ] = useState(null);

  return (
    <>
      <SEO
        title={course ? `${course.title} | NanoFlows Academy` : 'Course Details | NanoFlows Academy'}
        description={course ? course.description || `Learn ${course.title} with comprehensive course content and expert instruction.` : 'Explore course details and enroll in comprehensive learning programs.'}
        keywords={course ? `${course.title}, course, online course, ${course.category || ''}, e-learning` : 'course details, online courses, e-learning'}
      />
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

      {/* Hero Section with Video Preview */}
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
          {/* Course Title & Category */}
          <div className="mb-8">
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
            <p className={`text-lg leading-relaxed max-w-3xl ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {course.description}
            </p>
            
            {/* Course Stats Row */}
            <div className="flex items-center gap-6 mt-6 flex-wrap">
              <div className="flex items-center gap-2">
                <FiUser size={18} className={theme === 'dark' ? 'text-electric-green' : 'text-accent-red'} />
                <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {course.instructor_name || 'Expert Instructor'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FiUsers size={18} className={theme === 'dark' ? 'text-electric-blue' : 'text-accent-blue'} />
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  2,450+ students
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FiStar size={18} className="text-yellow-500" />
                <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  4.8 (320 reviews)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FiClock size={18} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} />
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Self-paced
                </span>
              </div>
            </div>
          </div>

          {/* Main Content with Sidebar Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Content - Video & Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Course Preview Video */}
              {course.promotional_video && (
                <div className={`rounded-2xl overflow-hidden border-2 shadow-2xl ${
                  theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <div className="w-full aspect-video bg-black relative">
                    <iframe
                      src={getEmbedUrl(course.promotional_video)}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title="Course Preview"
                      style={{ border: 'none' }}
                    />
                  </div>
                </div>
              )}

              {/* Learning Outcomes Section */}
              <div className={`rounded-2xl border-2 p-6 ${
                theme === 'dark'
                  ? 'bg-dark-card border-gray-700'
                  : 'bg-white border-gray-200'
              }`}>
                <h2 className={`text-2xl font-bold mb-4 flex items-center gap-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                  <FiTarget className={theme === 'dark' ? 'text-electric-green' : 'text-accent-red'} />
                  What You'll Learn
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {learningOutcomes.map((outcome, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <FiCheckCircle className={`mt-1 flex-shrink-0 ${
                        theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                      }`} size={18} />
                      <p className={`text-sm ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {outcome}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Requirements Section */}
              <div className={`rounded-2xl border-2 p-6 ${
                theme === 'dark'
                  ? 'bg-dark-card border-gray-700'
                  : 'bg-white border-gray-200'
              }`}>
                <h2 className={`text-2xl font-bold mb-4 flex items-center gap-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                  <FiLayers className={theme === 'dark' ? 'text-electric-blue' : 'text-accent-blue'} />
                  Requirements
                </h2>
                <ul className="space-y-2">
                  {requirements.map((req, idx) => (
                    <li key={idx} className={`flex items-start gap-3 text-sm ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      <span className={`text-sm font-bold ${
                        theme === 'dark' ? 'text-electric-blue' : 'text-accent-blue'
                      }`}>•</span>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Sidebar - Sticky Purchase Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className={`rounded-2xl border-2 p-6 shadow-xl ${
                  theme === 'dark'
                    ? 'bg-dark-card border-gray-700'
                    : 'bg-white border-gray-200'
                }`}>
                  {/* Price */}
                  <div className="mb-6">
                    {course.free ? (
                      <>
                        <div className={`text-4xl font-bold mb-2 ${
                          theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                        }`}>Free</div>
                        <p className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>No payment required</p>
                      </>
                    ) : (
                      <>
                        <div className={`text-4xl font-bold mb-2 ${
                          theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                        }`}>₹{course.price}</div>
                        <p className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>One-time payment • Lifetime access</p>
                      </>
                    )}
                  </div>

                  {/* CTA Button */}
                  {isPurchased ? (
                    <div className="space-y-3">
                      <div className={`flex items-center gap-2 px-4 py-3 rounded-xl ${
                        theme === 'dark'
                          ? 'bg-electric-green/20 text-electric-green border border-electric-green/30'
                          : 'bg-green-100 text-green-700 border border-green-300'
                      }`}>
                        <FiCheckCircle size={20} />
                        <span className="font-semibold">Already Enrolled</span>
                      </div>
                      <button
                        onClick={() => navigate(`/academy/course/${id}/learn`)}
                        className={`block w-full py-3.5 px-6 rounded-xl font-bold text-white text-center transition-all hover:scale-105 shadow-lg ${
                          theme === 'dark'
                            ? 'bg-electric-green hover:bg-electric-blue shadow-electric-green/40'
                            : 'bg-accent-red hover:bg-accent-blue shadow-accent-red/40'
                        }`}
                      >
                        Continue Learning →
                      </button>
                    </div>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handlePurchase}
                      disabled={purchasing}
                      className={`w-full py-3.5 px-6 rounded-xl font-bold text-white transition-all shadow-lg disabled:opacity-50 mb-4 ${
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

                  {/* Course Includes */}
                  <div className="pt-6 border-t border-gray-700">
                    <h3 className={`font-bold mb-4 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>This course includes:</h3>
                    <ul className="space-y-3">
                      {[
                        { icon: FiVideo, text: `${getTotalLessons()} HD video lessons` },
                        { icon: FiDownload, text: 'Downloadable resources' },
                        { icon: FiAward, text: 'Certificate of completion' },
                        { icon: FiGlobe, text: 'Access on mobile & desktop' },
                        { icon: FiClock, text: 'Lifetime access' }
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-center gap-3">
                          <item.icon size={18} className={theme === 'dark' ? 'text-electric-blue' : 'text-accent-blue'} />
                          <span className={`text-sm ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          }`}>{item.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
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

      {/* Curriculum Section */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className={`text-3xl font-bold mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
            Course{' '}
            <span className={theme === 'dark' ? 'text-electric-green' : 'text-accent-red'}>
              Curriculum
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

      {/* Instructor Card Section */}
      <section className={`mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 ${
        theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'
      }`}>
        <div className={`rounded-2xl border-2 p-8 ${
          theme === 'dark'
            ? 'bg-dark-card border-gray-700'
            : 'bg-white border-gray-200'
        }`}>
          <h2 className={`text-3xl font-bold mb-6 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
            Your{' '}
            <span className={theme === 'dark' ? 'text-electric-green' : 'text-accent-red'}>
              Instructor
            </span>
          </h2>
          
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Instructor Avatar */}
            <div className="flex-shrink-0">
              <div className={`w-32 h-32 rounded-full overflow-hidden border-4 ${
                theme === 'dark' ? 'border-electric-green/30' : 'border-accent-red/30'
              }`}>
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400"
                  alt={course.instructor_name || 'Instructor'}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Instructor Info */}
            <div className="flex-1">
              <h3 className={`text-2xl font-bold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {course.instructor_name || 'Expert Instructor'}
              </h3>
              <p className={`text-sm mb-4 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Senior Developer & Educator
              </p>
              <p className={`text-sm mb-6 leading-relaxed ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                With over 10 years of industry experience, I've worked with Fortune 500 companies 
                and startups alike. My passion is teaching and helping students master complex 
                concepts through practical, hands-on learning. I've trained over 50,000 students 
                worldwide and I'm excited to help you on your learning journey!
              </p>

              {/* Instructor Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { icon: FiUsers, label: 'Students', value: '50,000+' },
                  { icon: FiBook, label: 'Courses', value: '12' },
                  { icon: FiStar, label: 'Rating', value: '4.9' }
                ].map((stat, idx) => (
                  <div key={idx} className={`p-4 rounded-xl border ${
                    theme === 'dark'
                      ? 'bg-dark-lighter border-gray-700'
                      : 'bg-gray-50 border-gray-200'
                  }`}>
                    <stat.icon size={20} className={`mb-2 ${
                      theme === 'dark' ? 'text-electric-blue' : 'text-accent-blue'
                    }`} />
                    <div className={`text-lg font-bold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>{stat.value}</div>
                    <div className={`text-xs ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-3">
                <a
                  href="#"
                  className={`p-2 rounded-lg transition-all ${
                    theme === 'dark'
                      ? 'bg-dark-lighter hover:bg-electric-blue/20 text-gray-400 hover:text-electric-blue'
                      : 'bg-gray-100 hover:bg-accent-blue/20 text-gray-600 hover:text-accent-blue'
                  }`}
                >
                  <FiLinkedin size={20} />
                </a>
                <a
                  href="#"
                  className={`p-2 rounded-lg transition-all ${
                    theme === 'dark'
                      ? 'bg-dark-lighter hover:bg-electric-blue/20 text-gray-400 hover:text-electric-blue'
                      : 'bg-gray-100 hover:bg-accent-blue/20 text-gray-600 hover:text-accent-blue'
                  }`}
                >
                  <FiGlobe size={20} />
                </a>
                <a
                  href="mailto:instructor@example.com"
                  className={`p-2 rounded-lg transition-all ${
                    theme === 'dark'
                      ? 'bg-dark-lighter hover:bg-electric-blue/20 text-gray-400 hover:text-electric-blue'
                      : 'bg-gray-100 hover:bg-accent-blue/20 text-gray-600 hover:text-accent-blue'
                  }`}
                >
                  <FiMail size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className={`text-3xl font-bold mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
            Student{' '}
            <span className={theme === 'dark' ? 'text-electric-green' : 'text-accent-red'}>
              Reviews
            </span>
          </h2>
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <FiStar size={24} className="text-yellow-500 fill-yellow-500" />
              <span className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>4.8</span>
            </div>
            <span className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Based on 320 reviews
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-xl border-2 p-6 ${
                theme === 'dark'
                  ? 'bg-dark-card border-gray-700'
                  : 'bg-white border-gray-200'
              }`}
            >
              {/* Stars */}
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, idx) => (
                  <FiStar
                    key={idx}
                    size={16}
                    className={idx < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'}
                  />
                ))}
              </div>

              {/* Comment */}
              <p className={`text-sm mb-4 leading-relaxed ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                "{review.comment}"
              </p>

              {/* Author */}
              <div className="flex items-center justify-between">
                <div>
                  <p className={`font-semibold text-sm ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {review.name}
                  </p>
                  <p className={`text-xs ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                  }`}>
                    {review.date}
                  </p>
                </div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                  theme === 'dark'
                    ? 'bg-electric-blue/20 text-electric-blue'
                    : 'bg-accent-blue/20 text-accent-blue'
                }`}>
                  {review.name.charAt(0)}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQs Section */}
      <section className={`mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 ${
        theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'
      }`}>
        <div className="mb-8">
          <h2 className={`text-3xl font-bold mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
            Frequently Asked{' '}
            <span className={theme === 'dark' ? 'text-electric-green' : 'text-accent-red'}>
              Questions
            </span>
          </h2>
        </div>

        <div className="space-y-4 max-w-3xl">
          {faqs.map((faq, idx) => {
            const isExpanded = expandedFAQ === idx;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`rounded-xl border-2 overflow-hidden ${
                  theme === 'dark'
                    ? 'bg-dark-card border-gray-700'
                    : 'bg-white border-gray-200'
                }`}
              >
                <button
                  onClick={() => setExpandedFAQ(isExpanded ? null : idx)}
                  className={`w-full flex items-center justify-between p-5 text-left transition-all ${
                    theme === 'dark'
                      ? 'hover:bg-dark-lighter'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <span className={`font-semibold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {faq.question}
                  </span>
                  {isExpanded ? (
                    <FiChevronUp className={theme === 'dark' ? 'text-electric-green' : 'text-accent-red'} size={20} />
                  ) : (
                    <FiChevronDown className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} size={20} />
                  )}
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`border-t ${
                        theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                      }`}
                    >
                      <div className="p-5">
                        <p className={`text-sm leading-relaxed ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </section>
      </div>
    </>
  );
};

export default CourseDetails;
