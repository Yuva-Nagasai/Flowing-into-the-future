import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { coursesAPI, purchasesAPI, progressAPI } from '../../utils/api';
import { useTheme } from '../../context/ThemeContext';
import { 
  FiArrowLeft, FiUsers, FiSearch, FiMail, FiClock,
  FiTrendingUp, FiAward, FiFileText, FiBook, FiCheckCircle, FiAlertCircle
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap } from 'lucide-react';

const AdminStudentManagement = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await coursesAPI.getAllAdmin();
      if (response.data && response.data.courses) {
        setCourses(response.data.courses);
      } else {
        setCourses([]);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Failed to load courses. Please try again.');
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async (courseId) => {
    setStudentsLoading(true);
    setError(null);
    try {
      const response = await purchasesAPI.getStudentsByCourse(courseId);
      console.log('Students response:', response.data);
      
      if (response.data && response.data.students) {
        const studentsWithProgress = await Promise.all(
          response.data.students.map(async (student) => {
            if (!student.progress || student.progress.progress_percentage === undefined) {
              try {
                const progressResponse = await progressAPI.getAllProgress();
                const studentProgress = progressResponse.data.courses?.find(
                  p => p.user_id === student.user_id && p.course_id === courseId
                );
                
                if (studentProgress) {
                  return {
                    ...student,
                    progress: {
                      completed_lessons: studentProgress.completed_lessons || 0,
                      total_lessons: studentProgress.total_lessons || 0,
                      progress_percentage: studentProgress.progress_percentage || 0
                    }
                  };
                }
              } catch (progressError) {
                console.error('Error fetching progress:', progressError);
              }
              
              return {
                ...student,
                progress: {
                  completed_lessons: 0,
                  total_lessons: 0,
                  progress_percentage: 0
                }
              };
            }
            return student;
          })
        );
        
        setStudents(studentsWithProgress);
      } else {
        setStudents([]);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      setError('Failed to load students. Please try again.');
      setStudents([]);
    } finally {
      setStudentsLoading(false);
    }
  };

  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    setSearchQuery('');
    fetchStudents(course.id);
  };

  const filteredStudents = students.filter(student => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      student.user_name?.toLowerCase().includes(query) ||
      student.user_email?.toLowerCase().includes(query) ||
      student.course_title?.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className={`h-12 w-12 animate-spin rounded-full border-4 mx-auto mb-4 ${
            theme === 'dark' ? 'border-electric-blue/20 border-t-electric-blue' : 'border-accent-red/20 border-t-accent-red'
          }`} />
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'}`}>
      {/* Gradient Background Effects */}
      <div className={`fixed inset-0 pointer-events-none ${
        theme === 'dark' 
          ? 'bg-[radial-gradient(circle_at_top_right,_rgba(0,240,255,0.15),transparent_50%),radial-gradient(circle_at_bottom_left,_rgba(0,232,129,0.10),transparent_60%)]'
          : 'bg-[radial-gradient(circle_at_top,_rgba(235,50,50,0.20),rgba(255,255,255,0.8)_50%)]'
      }`} />

      {/* Header */}
      <header className={`sticky top-0 z-50 border-b backdrop-blur-xl ${
        theme === 'dark' 
          ? 'border-electric-blue/20 bg-dark-card/90 shadow-lg shadow-black/20' 
          : 'border-gray-200/50 bg-white/90 shadow-md shadow-gray-200/20'
      }`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/academy/admin"
                className={`p-2 rounded-lg transition-all ${
                  theme === 'dark' ? 'text-gray-400 hover:bg-gray-800 hover:text-electric-blue' : 'text-gray-600 hover:bg-gray-100 hover:text-accent-red'
                }`}
              >
                <FiArrowLeft size={20} />
              </Link>
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg ${
                theme === 'dark'
                  ? 'from-electric-blue to-electric-green shadow-electric-blue/30'
                  : 'from-accent-red to-accent-blue shadow-accent-red/30'
              }`}>
                <FiUsers className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className={`text-xs font-bold uppercase tracking-[0.2em] ${
                  theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                }`}>
                  NanoFlows Academy
                </p>
                <h1 className={`text-xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                  Student Management
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-xl border-2 ${
              theme === 'dark' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-red-100 text-red-700 border-red-300'
            }`}
          >
            {error}
          </motion.div>
        )}

        {/* Course Selection */}
        {!selectedCourse ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl border-2 p-8 shadow-xl ${
              theme === 'dark' ? 'bg-dark-card border-gray-700' : 'bg-white border-gray-200'
            }`}
          >
            {courses.length === 0 ? (
              <div className="text-center py-16">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  <FiBook className={`mx-auto mb-4 ${
                    theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                  }`} size={64} />
                </motion.div>
                <p className={`text-xl font-bold mb-2 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                  No courses available
                </p>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                }`}>
                  Create courses to start managing students
                </p>
              </div>
            ) : (
              <>
                <h2 className={`text-2xl font-bold mb-6 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                  Select a Course
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map((course, index) => (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleCourseSelect(course)}
                      className={`relative overflow-hidden rounded-xl border-2 p-6 cursor-pointer transition-all shadow-lg ${
                        theme === 'dark'
                          ? 'bg-dark-lighter border-gray-700 hover:border-electric-blue hover:shadow-electric-blue/20'
                          : 'bg-gray-50 border-gray-200 hover:border-accent-red hover:shadow-accent-red/20'
                      }`}
                    >
                      <div className={`absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl ${
                        theme === 'dark' ? 'bg-electric-blue/20' : 'bg-accent-red/20'
                      }`} />
                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className={`font-bold text-lg flex-1 ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                            {course.title}
                          </h3>
                          {course.published && (
                            <span className={`px-2 py-1 rounded-lg text-xs font-semibold ml-2 ${
                              theme === 'dark' ? 'bg-electric-green/20 text-electric-green border border-electric-green/30' : 'bg-green-100 text-green-700 border border-green-300'
                            }`}>
                              Published
                            </span>
                          )}
                        </div>
                        <p className={`text-sm mb-4 ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {course.category}
                        </p>
                        <div className="flex items-center gap-2">
                          <FiUsers className={theme === 'dark' ? 'text-electric-blue' : 'text-accent-red'} size={16} />
                          <span className={`text-xs font-semibold ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            Click to view students
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        ) : (
          <>
            {/* Course Header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-6 rounded-2xl border-2 p-6 shadow-xl ${
                theme === 'dark' ? 'bg-dark-card border-gray-700' : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => {
                      setSelectedCourse(null);
                      setStudents([]);
                      setSearchQuery('');
                    }}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                      theme === 'dark'
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    <FiArrowLeft size={14} className="inline mr-2" />
                    Back to Courses
                  </button>
                  <div>
                    <h2 className={`font-bold text-xl ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                      {selectedCourse.title}
                    </h2>
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {students.length} enrolled {students.length === 1 ? 'student' : 'students'}
                    </p>
                  </div>
                </div>
                <div className="relative w-full sm:w-auto">
                  <FiSearch className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                  }`} size={18} />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search students..."
                    className={`pl-10 pr-4 py-3 rounded-xl border-2 text-sm w-full sm:w-64 transition-all ${
                      theme === 'dark'
                        ? 'bg-dark-lighter border-gray-700 text-white placeholder:text-gray-500 focus:border-electric-blue focus:ring-2 focus:ring-electric-blue/20'
                        : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-accent-red focus:ring-2 focus:ring-accent-red/20'
                    }`}
                  />
                </div>
              </div>
            </motion.div>

            {/* Students List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-2xl border-2 p-6 shadow-xl ${
                theme === 'dark' ? 'bg-dark-card border-gray-700' : 'bg-white border-gray-200'
              }`}
            >
              {studentsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className={`h-8 w-8 animate-spin rounded-full border-4 ${
                    theme === 'dark' ? 'border-electric-blue/20 border-t-electric-blue' : 'border-accent-red/20 border-t-accent-red'
                  }`} />
                </div>
              ) : filteredStudents.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className={`border-b-2 ${
                        theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                      }`}>
                        <th className={`text-left py-4 px-4 text-xs font-bold uppercase tracking-wider ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          Student
                        </th>
                        <th className={`text-center py-4 px-4 text-xs font-bold uppercase tracking-wider ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          Progress
                        </th>
                        <th className={`text-center py-4 px-4 text-xs font-bold uppercase tracking-wider ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          Enrolled
                        </th>
                        <th className={`text-right py-4 px-4 text-xs font-bold uppercase tracking-wider ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence>
                        {filteredStudents.map((student, index) => {
                          const progress = student.progress || { progress_percentage: 0, completed_lessons: 0, total_lessons: 0 };
                          const progressPercent = progress.progress_percentage || 0;
                          
                          return (
                            <motion.tr
                              key={student.purchase_id || student.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              transition={{ delay: index * 0.05 }}
                              className={`border-b transition-colors ${
                                theme === 'dark' ? 'border-gray-800 hover:bg-gray-800/50' : 'border-gray-100 hover:bg-gray-50'
                              }`}
                            >
                              <td className="py-4 px-4">
                                <div>
                                  <p className={`font-semibold ${
                                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                                  }`}>
                                    {student.user_name || 'Unknown User'}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <FiMail className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} size={14} />
                                    <p className={`text-xs ${
                                      theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                                    }`}>
                                      {student.user_email || 'N/A'}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-4 text-center">
                                <div className="flex flex-col items-center gap-2">
                                  <span className={`text-sm font-bold ${
                                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                                  }`}>
                                    {progressPercent}%
                                  </span>
                                  <div className={`h-2 w-32 overflow-hidden rounded-full ${
                                    theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
                                  }`}>
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{ width: `${Math.min(progressPercent, 100)}%` }}
                                      transition={{ duration: 0.5, delay: index * 0.05 }}
                                      className={`h-full rounded-full bg-gradient-to-r ${
                                        theme === 'dark'
                                          ? 'from-electric-blue to-electric-green'
                                          : 'from-accent-red to-accent-blue'
                                      }`}
                                    />
                                  </div>
                                  <p className={`text-xs ${
                                    theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                                  }`}>
                                    {progress.completed_lessons || 0} / {progress.total_lessons || 0} lessons
                                  </p>
                                </div>
                              </td>
                              <td className="py-4 px-4 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <FiClock className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} size={14} />
                                  <p className={`text-sm ${
                                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                  }`}>
                                    {student.purchased_at 
                                      ? new Date(student.purchased_at).toLocaleDateString()
                                      : 'N/A'}
                                  </p>
                                </div>
                              </td>
                              <td className="py-4 px-4 text-right">
                                <p className={`font-bold ${
                                  theme === 'dark' ? 'text-electric-green' : 'text-green-600'
                                }`}>
                                  ₹{student.amount || 0}
                                </p>
                              </td>
                            </motion.tr>
                          );
                        })}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-16">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  >
                    <FiUsers className={`mx-auto mb-4 ${
                      theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                    }`} size={64} />
                  </motion.div>
                  <p className={`text-xl font-bold mb-2 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                    {searchQuery ? 'No students found' : 'No students enrolled yet'}
                  </p>
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                  }`}>
                    {searchQuery ? 'Try a different search term' : 'Students will appear here once they enroll in this course'}
                  </p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminStudentManagement;
