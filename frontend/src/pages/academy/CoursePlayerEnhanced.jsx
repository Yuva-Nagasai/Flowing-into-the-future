import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { coursesAPI, purchasesAPI, modulesAPI, progressAPI, notesAPI, quizzesAPI, assignmentsAPI, uploadAPI, videosAPI } from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  FiArrowLeft, FiDownload, FiCheckCircle, FiBookOpen, FiMessageSquare, 
  FiFileText, FiChevronRight, FiChevronDown, FiPlus, FiX, FiClock, FiPlay,
  FiAward, FiVideo, FiUpload
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../../components/SEO';

const CoursePlayerEnhanced = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [currentModule, setCurrentModule] = useState(null); // Track current module
  const [activeTab, setActiveTab] = useState('content'); // 'content', 'quiz', 'assignment', 'notes', 'resources'
  const [expandedModules, setExpandedModules] = useState({});
  const [progress, setProgress] = useState({ progress: [], stats: {} });
  const [notes, setNotes] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [resources, setResources] = useState([]); // Module-level resources
  const [quizAnswers, setQuizAnswers] = useState({}); // { quizId: selectedAnswer }
  const [quizResults, setQuizResults] = useState({}); // { quizId: { is_correct, score } }
  const [assignmentSubmissions, setAssignmentSubmissions] = useState({}); // { assignmentId: { submission_text, submission_file_url, file } }
  const [uploadingFiles, setUploadingFiles] = useState({}); // { assignmentId: true/false }
  const [loading, setLoading] = useState(true);
  const [noteContent, setNoteContent] = useState('');
  const [showNoteForm, setShowNoteForm] = useState(false);

  useEffect(() => {
    checkAccess();
  }, [id]);

  useEffect(() => {
    if (currentLesson) {
      fetchLessonData();
    }
  }, [currentLesson, currentModule]);

  const checkAccess = async () => {
    try {
      const purchaseResponse = await purchasesAPI.checkPurchase(id);
      
      if (!purchaseResponse.data.purchased) {
        navigate(`/academy/course/${id}`);
        return;
      }

      const [courseRes, modulesRes, progressRes] = await Promise.all([
        coursesAPI.getById(id),
        modulesAPI.getByCourse(id),
        progressAPI.getCourseProgress(id)
      ]);

      setCourse(courseRes.data.course);
      setModules(modulesRes.data.modules);
      setProgress(progressRes.data);

      // Set first lesson and module as current
      if (modulesRes.data.modules.length > 0) {
        const firstModule = modulesRes.data.modules[0];
        setCurrentModule(firstModule);
        if (firstModule.lessons && firstModule.lessons.length > 0) {
          setCurrentLesson(firstModule.lessons[0]);
          setExpandedModules({ [firstModule.id]: true });
        }
      }
    } catch (error) {
      console.error('Error:', error);
      navigate('/academy/dashboard?tab=courses');
    } finally {
      setLoading(false);
    }
  };

  const fetchLessonData = async () => {
    if (!currentLesson) return;

    try {
      // Find the module for current lesson and update currentModule
      const lessonModule = modules.find(m => 
        m.lessons?.some(l => l.id === currentLesson.id)
      );
      
      if (lessonModule && lessonModule.id !== currentModule?.id) {
        setCurrentModule(lessonModule);
      }

      const moduleToUse = lessonModule || currentModule;
      
      // Fetch module-level content (quizzes, assignments, resources) and lesson-level content (notes)
      const [notesRes, quizzesRes, assignmentsRes, resourcesRes] = await Promise.all([
        notesAPI.getLessonNotes(currentLesson.id),
        moduleToUse ? quizzesAPI.getByModule(moduleToUse.id).catch(() => ({ data: { quizzes: [] } })) : Promise.resolve({ data: { quizzes: [] } }),
        moduleToUse ? assignmentsAPI.getByModule(moduleToUse.id).catch(() => ({ data: { assignments: [] } })) : Promise.resolve({ data: { assignments: [] } }),
        moduleToUse ? videosAPI.getResourcesByModule(moduleToUse.id).catch(() => ({ data: { resources: [] } })) : Promise.resolve({ data: { resources: [] } })
      ]);

      setNotes(notesRes.data.notes || []);
      
      // Parse quiz options if they're JSON strings
      const quizzesData = (quizzesRes.data.quizzes || []).map(quiz => {
        let options = quiz.options || [];
        if (typeof options === 'string') {
          try {
            options = JSON.parse(options);
          } catch (e) {
            console.error('Error parsing quiz options:', e, quiz);
            options = [];
          }
        }
        return {
          ...quiz,
          options: Array.isArray(options) ? options : []
        };
      });
      setQuizzes(quizzesData);
      
      const assignmentsData = assignmentsRes.data.assignments || [];
      setAssignments(assignmentsData);
      
      const resourcesData = resourcesRes.data.resources || [];
      setResources(resourcesData);
      
      // Switch to content tab if current tab is not available for this module
      if (activeTab === 'quiz' && quizzesData.length === 0) {
        setActiveTab('content');
      }
      if (activeTab === 'assignment' && assignmentsData.length === 0) {
        setActiveTab('content');
      }
      if (activeTab === 'resources' && resourcesData.length === 0) {
        setActiveTab('content');
      }
      
      // Debug logging
      console.log('Fetched lesson data:', {
        lessonId: currentLesson.id,
        lessonTitle: currentLesson.title,
        moduleId: moduleToUse?.id,
        moduleTitle: moduleToUse?.title,
        contentType: currentLesson.content_type,
        quizzesCount: quizzesData.length,
        quizzes: quizzesData,
        assignmentsCount: assignmentsData.length,
        resourcesCount: resourcesData.length,
        resources: resourcesData
      });
      
      // Ensure resources array is valid
      if (!Array.isArray(resourcesData)) {
        console.warn('Resources data is not an array:', resourcesData);
        setResources([]);
      }
    } catch (error) {
      console.error('Error fetching lesson data:', error);
    }
  };

  const handleLessonClick = (lesson) => {
    setCurrentLesson(lesson);
    setActiveTab('content');
    
    // Find and set the module for this lesson
    const lessonModule = modules.find(m => 
      m.lessons?.some(l => l.id === lesson.id)
    );
    if (lessonModule) {
      setCurrentModule(lessonModule);
    }
    
    // Reset quiz and assignment state when switching lessons
    setQuizAnswers({});
    setQuizResults({});
    setAssignmentSubmissions({});
    setUploadingFiles({});
  };

  const toggleModule = (moduleId) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const handleVideoProgress = async (videoProgress) => {
    if (!currentLesson) return;

    try {
      // Mark as completed if progress is 100% or more
      const isCompleted = videoProgress >= 100;
      
      await progressAPI.update({
        course_id: id,
        lesson_id: currentLesson.id,
        completed: isCompleted,
        completion_percentage: Math.min(100, videoProgress),
        last_position: videoProgress * (currentLesson.video_duration || 0)
      });

      // Refresh progress to update the progress bar
      const progressRes = await progressAPI.getCourseProgress(id);
      setProgress(progressRes.data);
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const handleSaveNote = async () => {
    if (!noteContent.trim() || !currentLesson) return;

    try {
      await notesAPI.save({
        course_id: id,
        lesson_id: currentLesson.id,
        content: noteContent,
        timestamp: 0 // Can be enhanced with video timestamp
      });

      setNoteContent('');
      setShowNoteForm(false);
      fetchLessonData();
    } catch (error) {
      console.error('Error saving note:', error);
      alert('Failed to save note');
    }
  };


  const handleQuizSubmit = async (quizId) => {
    if (!currentLesson || quizAnswers[quizId] === undefined) {
      alert('Please select an answer');
      return;
    }

    try {
      const response = await quizzesAPI.submitAttempt({
        quiz_id: quizId,
        lesson_id: currentLesson.id,
        course_id: id,
        selected_answer: quizAnswers[quizId]
      });

      setQuizResults(prev => ({
        ...prev,
        [quizId]: {
          is_correct: response.data.is_correct,
          score: response.data.score
        }
      }));

      // Update progress if quiz is completed
      if (response.data.is_correct) {
        await progressAPI.update({
          course_id: id,
          lesson_id: currentLesson.id,
          completion_percentage: 100,
          completed: true
        });
        const progressRes = await progressAPI.getCourseProgress(id);
        setProgress(progressRes.data);
      }

      alert(response.data.is_correct ? 'Correct! 🎉' : 'Incorrect. Try again!');
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Failed to submit quiz');
    }
  };

  const handleFileSelect = async (e, assignmentId) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      alert('File size must be less than 50MB');
      return;
    }

    // Update state with selected file
    setAssignmentSubmissions(prev => ({
      ...prev,
      [assignmentId]: {
        ...prev[assignmentId],
        file: file
      }
    }));
  };

  const handleAssignmentSubmit = async (assignmentId) => {
    if (!currentLesson) return;

    const submission = assignmentSubmissions[assignmentId];
    if (!submission || (!submission.submission_text?.trim() && !submission.file && !submission.submission_file_url)) {
      alert('Please provide your submission (text or file)');
      return;
    }

    try {
      setUploadingFiles(prev => ({ ...prev, [assignmentId]: true }));

      let fileUrl = submission.submission_file_url;

      // Upload file if a new file is selected
      if (submission.file) {
        try {
          const uploadResponse = await uploadAPI.uploadStudentFile(submission.file);
          fileUrl = uploadResponse.data.fileUrl || uploadResponse.data.url;
          
          // Update state with uploaded file URL
          setAssignmentSubmissions(prev => ({
            ...prev,
            [assignmentId]: {
              ...prev[assignmentId],
              submission_file_url: fileUrl,
              file: null // Clear file after upload
            }
          }));
        } catch (uploadError) {
          console.error('Error uploading file:', uploadError);
          alert('Failed to upload file. Please try again.');
          setUploadingFiles(prev => ({ ...prev, [assignmentId]: false }));
          return;
        }
      }

      // Submit assignment
      await assignmentsAPI.submit({
        assignment_id: assignmentId,
        lesson_id: currentLesson.id,
        course_id: id,
        submission_text: submission.submission_text || null,
        submission_file_url: fileUrl || null
      });

      alert('Assignment submitted successfully!');
      
      // Clear submission state
      setAssignmentSubmissions(prev => ({
        ...prev,
        [assignmentId]: {
          submission_text: '',
          submission_file_url: null,
          file: null
        }
      }));
      
      fetchLessonData();
    } catch (error) {
      console.error('Error submitting assignment:', error);
      alert(error.response?.data?.error || 'Failed to submit assignment');
    } finally {
      setUploadingFiles(prev => ({ ...prev, [assignmentId]: false }));
    }
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
    
    if (url.includes('drive.google.com')) {
      const fileId = url.match(/[-\w]{25,}/);
      if (fileId) {
        return `https://drive.google.com/file/d/${fileId[0]}/preview`;
      }
    }
    
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      let videoId;
      if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1].split('?')[0];
      } else {
        const urlParams = new URLSearchParams(new URL(url).search);
        videoId = urlParams.get('v');
      }
      return `https://www.youtube.com/embed/${videoId}`;
    }
    
    return url;
  };

  const isLessonCompleted = (lessonId) => {
    return progress.progress.some(p => p.lesson_id === lessonId && p.completed);
  };

  const getProgressForLesson = (lessonId) => {
    const lessonProgress = progress.progress.find(p => p.lesson_id === lessonId);
    return lessonProgress?.completion_percentage || 0;
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'}`}>
        <div className={`text-xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Loading course...</div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={course ? `Learning: ${course.title} | NanoFlows Academy` : 'Course Player | NanoFlows Academy'}
        description={course ? `Learn ${course.title} with interactive video lessons, quizzes, and assignments.` : 'Access your course content and continue learning.'}
        keywords={course ? `${course.title}, course player, online learning, video lessons, interactive course` : 'course player, online learning, video lessons'}
      />
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'}`}>
        {/* Header */}
      <header className={`sticky top-0 z-50 border-b backdrop-blur-md ${
        theme === 'dark' 
          ? 'border-gray-800/50 bg-dark-card/90' 
          : 'border-gray-200/50 bg-white/90'
      }`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              to="/academy/dashboard"
              className={`transition-colors ${
                theme === 'dark' ? 'text-gray-400 hover:text-electric-green' : 'text-gray-600 hover:text-accent-red'
              }`}
            >
              <FiArrowLeft size={24} />
            </Link>
            <div className="flex-1">
              <h1 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {course?.title}
              </h1>
              {progress.stats && (
                <div className="flex items-center gap-2 mt-1">
                  <div className={`w-32 h-2 rounded-full overflow-hidden ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
                  }`}>
                    <div 
                      className={`h-full transition-all ${
                        theme === 'dark' 
                          ? 'bg-gradient-to-r from-electric-blue to-electric-green'
                          : 'bg-gradient-to-r from-accent-red to-accent-blue'
                      }`}
                      style={{ width: `${progress.stats.progress_percentage || 0}%` }}
                    />
                  </div>
                  <span className={`text-xs font-semibold ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {progress.stats.progress_percentage || 0}% Complete
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row h-[calc(100vh-73px)]">
        {/* Video Player Section */}
        <div className="lg:w-2/3 flex flex-col">
          {/* Video */}
          <div className="flex-1 bg-black flex items-center justify-center relative">
            {currentLesson?.video_url ? (
              currentLesson.video_url.includes('/uploads/') ? (
                // Local uploaded video - use HTML5 video player
                <div className="w-full aspect-video">
                  <video
                    src={getEmbedUrl(currentLesson.video_url)}
                    className="w-full h-full"
                    controls
                    controlsList="nodownload"
                    onTimeUpdate={(e) => {
                      // Track video progress
                      if (e.target.duration) {
                        const progress = (e.target.currentTime / e.target.duration) * 100;
                        // Only update every 5% to avoid too many API calls
                        if (progress % 5 < 0.1 || progress >= 99) {
                          handleVideoProgress(progress);
                        }
                      }
                    }}
                    onEnded={() => {
                      // Mark video as completed when it ends
                      handleVideoProgress(100);
                    }}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              ) : (
                // External video (YouTube, Google Drive) - use iframe
                <div className="w-full aspect-video">
                  <iframe
                    src={getEmbedUrl(currentLesson.video_url)}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                    allowFullScreen
                    title={currentLesson.title}
                  />
                </div>
              )
            ) : (
              <div className={`text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                <FiPlay size={64} className="mx-auto mb-4 opacity-50" />
                <p className="text-xl">
                  {currentLesson?.content_type === 'quiz' ? 'Quiz Lesson' :
                   currentLesson?.content_type === 'assignment' ? 'Assignment Lesson' :
                   currentLesson?.content_type === 'text' ? 'Text Lesson' :
                   'No content available'}
                </p>
                {currentLesson?.content_type === 'text' && (
                  <div className={`mt-4 p-6 max-w-2xl mx-auto text-left ${
                    theme === 'dark' ? 'bg-dark-card text-gray-300' : 'bg-white text-gray-900'
                  } rounded-lg`}>
                    {currentLesson.description}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Lesson Info & Tabs */}
          <div className={`border-t ${
            theme === 'dark' ? 'border-gray-800 bg-dark-card' : 'border-gray-200 bg-white'
          }`}>
            <div className="container mx-auto px-4 py-4">
              <h2 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {currentLesson?.title}
              </h2>
              
              {/* Tabs */}
              <div className="flex gap-2 border-b mb-4 overflow-x-auto" style={{
                borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
              }}>
                {['content', 'quiz', 'assignment', 'notes', 'resources'].map(tab => {
                  // Show quiz/assignment/resources tabs only if there's content
                  if (tab === 'quiz' && quizzes.length === 0) return null;
                  if (tab === 'assignment' && assignments.length === 0) return null;
                  if (tab === 'resources' && resources.length === 0) return null;
                  
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 font-semibold capitalize transition-all whitespace-nowrap ${
                        activeTab === tab
                          ? theme === 'dark'
                            ? 'text-electric-green border-b-2 border-electric-green'
                            : 'text-accent-red border-b-2 border-accent-red'
                          : theme === 'dark'
                            ? 'text-gray-400 hover:text-white'
                            : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {tab === 'quiz' && quizzes.length > 0 ? `Quiz (${quizzes.length})` : 
                       tab === 'assignment' && assignments.length > 0 ? `Assignment (${assignments.length})` :
                       tab === 'resources' && resources.length > 0 ? `Resources (${resources.length})` :
                       tab}
                    </button>
                  );
                })}
              </div>

              {/* Tab Content */}
              <div className="min-h-[200px] max-h-[300px] overflow-y-auto">
                {activeTab === 'content' && (
                  <div className="space-y-6">
                    {currentLesson?.description && (
                      <div className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        {currentLesson.description}
                      </div>
                    )}
                    {!currentLesson?.description && (
                      <div className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        <p>No additional content for this lesson.</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'quiz' && (
                  <div className="space-y-4">
                    {quizzes.length > 0 ? (
                      quizzes.map((quiz) => {
                        // Ensure options is an array
                        const quizOptions = Array.isArray(quiz.options) 
                          ? quiz.options 
                          : (typeof quiz.options === 'string' ? JSON.parse(quiz.options) : []);
                        
                        const result = quizResults[quiz.id];
                        return (
                          <div
                            key={quiz.id}
                            className={`p-4 rounded-lg border-2 ${
                              theme === 'dark' ? 'bg-dark-lighter border-gray-700' : 'bg-gray-50 border-gray-200'
                            }`}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                {quiz.question}
                              </p>
                              {result && (
                                <span className={`px-3 py-1 rounded-lg text-sm font-bold ${
                                  result.is_correct
                                    ? theme === 'dark'
                                      ? 'bg-electric-green/20 text-electric-green border border-electric-green/30'
                                      : 'bg-green-100 text-green-700 border border-green-300'
                                    : theme === 'dark'
                                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                      : 'bg-red-100 text-red-700 border border-red-300'
                                }`}>
                                  {result.is_correct ? '✓ Correct' : '✗ Incorrect'}
                                </span>
                              )}
                            </div>
                            <div className="space-y-2 mb-4">
                              {quizOptions.map((option, index) => (
                                <label
                                  key={index}
                                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                                    quizAnswers[quiz.id] === index
                                      ? theme === 'dark'
                                        ? 'bg-electric-blue/20 border-2 border-electric-blue'
                                        : 'bg-accent-blue/20 border-2 border-accent-blue'
                                      : theme === 'dark'
                                        ? 'bg-dark-card border-2 border-gray-700 hover:border-gray-600'
                                        : 'bg-white border-2 border-gray-200 hover:border-gray-300'
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    name={`quiz-${quiz.id}`}
                                    value={index}
                                    checked={quizAnswers[quiz.id] === index}
                                    onChange={() => setQuizAnswers(prev => ({ ...prev, [quiz.id]: index }))}
                                    disabled={!!result}
                                    className="w-4 h-4"
                                  />
                                  <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                                    {option}
                                  </span>
                                </label>
                              ))}
                            </div>
                            {!result ? (
                              <button
                                onClick={() => handleQuizSubmit(quiz.id)}
                                disabled={quizAnswers[quiz.id] === undefined}
                                className={`w-full py-2 rounded-lg font-semibold transition-all ${
                                  quizAnswers[quiz.id] === undefined
                                    ? 'opacity-50 cursor-not-allowed'
                                    : ''
                                } ${
                                  theme === 'dark'
                                    ? 'bg-electric-green text-black hover:bg-electric-blue'
                                    : 'bg-accent-red text-white hover:bg-accent-blue'
                                }`}
                              >
                                Submit Answer
                              </button>
                            ) : (
                              <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                Score: {result.score} / {quiz.points} points
                              </div>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <div className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        <p>No quizzes available for this lesson.</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'assignment' && (
                  <div className="space-y-4">
                    {assignments.length > 0 ? (
                      assignments.map((assignment) => {
                        const submission = assignmentSubmissions[assignment.id] || {};
                        const isUploading = uploadingFiles[assignment.id];
                        return (
                          <div
                            key={assignment.id}
                            className={`p-4 rounded-lg border-2 ${
                              theme === 'dark' ? 'bg-dark-lighter border-gray-700' : 'bg-gray-50 border-gray-200'
                            }`}
                          >
                            <h4 className={`font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                              {assignment.title}
                            </h4>
                            <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                              {assignment.description}
                            </p>
                            {assignment.due_date && (
                              <p className={`text-xs mb-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                                Due: {new Date(assignment.due_date).toLocaleDateString()}
                              </p>
                            )}
                            <div className="space-y-3">
                              <textarea
                                value={submission.submission_text || ''}
                                onChange={(e) => setAssignmentSubmissions(prev => ({
                                  ...prev,
                                  [assignment.id]: {
                                    ...prev[assignment.id],
                                    submission_text: e.target.value
                                  }
                                }))}
                                placeholder="Write your submission here (optional if uploading a file)..."
                                className={`w-full p-3 rounded-lg resize-none ${
                                  theme === 'dark'
                                    ? 'bg-dark-card text-white border-gray-700'
                                    : 'bg-white text-gray-900 border-gray-300'
                                } border`}
                                rows={6}
                              />
                              
                              {/* File Upload Section */}
                              <div className="space-y-2">
                                <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                  Upload File (Optional)
                                </label>
                                <div className="flex items-center gap-3">
                                  <label
                                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed cursor-pointer transition-all ${
                                      isUploading
                                        ? 'opacity-50 cursor-not-allowed'
                                        : theme === 'dark'
                                          ? 'border-gray-600 hover:border-gray-500 bg-dark-card'
                                          : 'border-gray-300 hover:border-gray-400 bg-gray-50'
                                    }`}
                                  >
                                    <FiUpload className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} />
                                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                      {submission.file ? submission.file.name : 'Choose file from phone or laptop'}
                                    </span>
                                    <input
                                      type="file"
                                      className="hidden"
                                      onChange={(e) => handleFileSelect(e, assignment.id)}
                                      disabled={isUploading}
                                      accept=".pdf,.doc,.docx,.txt,.zip,.rar,.jpg,.jpeg,.png"
                                    />
                                  </label>
                                  {submission.file && (
                                    <button
                                      onClick={() => {
                                        setAssignmentSubmissions(prev => ({
                                          ...prev,
                                          [assignment.id]: {
                                            ...prev[assignment.id],
                                            file: null,
                                            submission_file_url: null
                                          }
                                        }));
                                      }}
                                      className={`p-2 rounded-lg ${theme === 'dark' ? 'text-red-400 hover:bg-gray-800' : 'text-red-500 hover:bg-gray-100'}`}
                                    >
                                      <FiX size={18} />
                                    </button>
                                  )}
                                </div>
                                {submission.file && (
                                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                                    Selected: {submission.file.name} ({(submission.file.size / 1024 / 1024).toFixed(2)} MB)
                                  </p>
                                )}
                                {submission.submission_file_url && !submission.file && (
                                  <p className={`text-xs ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                                    ✓ File uploaded: {submission.submission_file_url.split('/').pop()}
                                  </p>
                                )}
                              </div>

                              <button
                                onClick={() => handleAssignmentSubmit(assignment.id)}
                                disabled={isUploading || (!submission.submission_text?.trim() && !submission.file && !submission.submission_file_url)}
                                className={`w-full py-2 rounded-lg font-semibold transition-all ${
                                  isUploading || (!submission.submission_text?.trim() && !submission.file && !submission.submission_file_url)
                                    ? 'opacity-50 cursor-not-allowed'
                                    : ''
                                } ${
                                  theme === 'dark'
                                    ? 'bg-electric-green text-black hover:bg-electric-blue'
                                    : 'bg-accent-red text-white hover:bg-accent-blue'
                                }`}
                              >
                                {isUploading ? 'Uploading...' : 'Submit Assignment'}
                              </button>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        <p>No assignments available for this lesson.</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'notes' && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Your Notes ({notes.length})
                      </h3>
                      <button
                        onClick={() => setShowNoteForm(!showNoteForm)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                          theme === 'dark'
                            ? 'bg-electric-green text-black hover:bg-electric-blue'
                            : 'bg-accent-red text-white hover:bg-accent-blue'
                        }`}
                      >
                        <FiPlus /> Add Note
                      </button>
                    </div>

                    {showNoteForm && (
                      <div className={`mb-4 p-4 rounded-lg ${
                        theme === 'dark' ? 'bg-dark-lighter border border-gray-700' : 'bg-gray-50 border border-gray-200'
                      }`}>
                        <textarea
                          value={noteContent}
                          onChange={(e) => setNoteContent(e.target.value)}
                          placeholder="Write your note here..."
                          className={`w-full p-3 rounded-lg resize-none ${
                            theme === 'dark'
                              ? 'bg-dark-card text-white border-gray-700'
                              : 'bg-white text-gray-900 border-gray-300'
                          } border`}
                          rows={4}
                        />
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={handleSaveNote}
                            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                              theme === 'dark'
                                ? 'bg-electric-green text-black hover:bg-electric-blue'
                                : 'bg-accent-red text-white hover:bg-accent-blue'
                            }`}
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setShowNoteForm(false);
                              setNoteContent('');
                            }}
                            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                              theme === 'dark'
                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="space-y-3">
                      {notes.map(note => (
                        <div
                          key={note.id}
                          className={`p-4 rounded-lg ${
                            theme === 'dark' ? 'bg-dark-lighter border border-gray-700' : 'bg-gray-50 border border-gray-200'
                          }`}
                        >
                          <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            {note.content}
                          </p>
                          <div className={`text-xs mt-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                            {new Date(note.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                      {notes.length === 0 && (
                        <p className={`text-center py-8 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                          No notes yet. Add your first note!
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'resources' && (
                  <div>
                    <h3 className={`font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Downloadable Resources ({resources.length})
                    </h3>
                    {resources.length > 0 ? (
                      <div className="space-y-3">
                        {resources.map(resource => (
                          <div
                            key={resource.id}
                            className={`p-4 rounded-lg border-2 ${
                              theme === 'dark' ? 'bg-dark-lighter border-gray-700' : 'bg-gray-50 border-gray-200'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 flex-1">
                                <FiFileText className={`text-2xl ${
                                  theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                                }`} />
                                <div className="flex-1">
                                  <h4 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                    {resource.title}
                                  </h4>
                                  <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {resource.file_type.toUpperCase()} • {new Date(resource.created_at).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <a
                                href={(() => {
                                  const API_BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3001';
                                  if (!resource.file_url) return '#';
                                  if (resource.file_url.startsWith('http')) return resource.file_url;
                                  // Use backend URL for /uploads path (backend serves static files at /uploads/)
                                  if (resource.file_url.startsWith('/uploads/')) {
                                    return `${API_BASE_URL}${resource.file_url}`;
                                  }
                                  if (resource.file_url.startsWith('/')) {
                                    return `${API_BASE_URL}${resource.file_url}`;
                                  }
                                  // Fallback
                                  return `${API_BASE_URL}/api${resource.file_url}`;
                                })()}
                                target="_blank"
                                rel="noopener noreferrer"
                                download={resource.file_type !== 'pdf' ? resource.file_url?.split('/').pop() : undefined}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                                  theme === 'dark'
                                    ? 'bg-electric-green text-black hover:bg-electric-blue'
                                    : 'bg-accent-red text-white hover:bg-accent-blue'
                                }`}
                              >
                                <FiDownload size={18} />
                                {resource.file_type === 'pdf' ? 'Download PDF' : 'Download'}
                              </a>
                            </div>
                            {resource.file_type === 'pdf' && resource.file_url && (
                              <div className="mt-4">
                                <iframe
                                  src={(() => {
                                    const API_BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3001';
                                    if (resource.file_url.startsWith('http')) return resource.file_url;
                                    // Use backend URL for /uploads path (backend serves static files at /uploads/)
                                    if (resource.file_url.startsWith('/uploads/')) {
                                      return `${API_BASE_URL}${resource.file_url}`;
                                    }
                                    if (resource.file_url.startsWith('/')) {
                                      return `${API_BASE_URL}${resource.file_url}`;
                                    }
                                    // Fallback
                                    return `${API_BASE_URL}/api${resource.file_url}`;
                                  })()}
                                  className="w-full h-96 rounded-lg border"
                                  title={resource.title}
                                  allow="fullscreen"
                                  allowFullScreen
                                  onError={(e) => {
                                    console.error('Error loading PDF:', e);
                                    e.target.style.display = 'none';
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        <p>No resources available for this module.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Modules & Lessons */}
        <div className={`lg:w-1/3 border-l overflow-y-auto ${
          theme === 'dark' ? 'border-gray-800 bg-dark-card' : 'border-gray-200 bg-white'
        }`}>
          <div className="p-4">
            <h2 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Course Content
            </h2>

            <div className="space-y-2">
              {modules.map(module => (
                <div key={module.id}>
                  <button
                    onClick={() => toggleModule(module.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                      theme === 'dark'
                        ? 'bg-dark-lighter hover:bg-gray-800 text-white'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-900'
                    }`}
                  >
                    <span className="font-semibold">{module.title}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {module.lesson_count} lessons
                      </span>
                      {expandedModules[module.id] ? (
                        <FiChevronDown />
                      ) : (
                        <FiChevronRight />
                      )}
                    </div>
                  </button>

                  <AnimatePresence>
                    {expandedModules[module.id] && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pl-4 mt-2 space-y-1">
                          {module.lessons?.map(lesson => {
                            const completed = isLessonCompleted(lesson.id);
                            const lessonProgress = getProgressForLesson(lesson.id);
                            
                            return (
                              <button
                                key={lesson.id}
                                onClick={() => handleLessonClick(lesson)}
                                className={`w-full text-left p-3 rounded-lg transition-all ${
                                  currentLesson?.id === lesson.id
                                    ? theme === 'dark'
                                      ? 'bg-electric-green text-black'
                                      : 'bg-accent-red text-white'
                                    : theme === 'dark'
                                      ? 'bg-dark-lighter hover:bg-gray-800 text-gray-300'
                                      : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  <div className="flex-shrink-0 mt-1">
                                    {completed ? (
                                      <FiCheckCircle className={
                                        currentLesson?.id === lesson.id
                                          ? 'text-black'
                                          : theme === 'dark'
                                            ? 'text-electric-green'
                                            : 'text-accent-red'
                                      } />
                                    ) : (
                                      (() => {
                                        const Icon = lesson.content_type === 'quiz' ? FiBookOpen :
                                                    lesson.content_type === 'assignment' ? FiAward :
                                                    lesson.content_type === 'text' ? FiFileText :
                                                    FiVideo;
                                        return (
                                          <Icon className={
                                            currentLesson?.id === lesson.id
                                              ? 'text-black'
                                              : theme === 'dark'
                                                ? 'text-gray-500'
                                                : 'text-gray-400'
                                          } />
                                        );
                                      })()
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium">{lesson.title}</span>
                                      {lesson.content_type && lesson.content_type !== 'video' && (
                                        <span className={`px-1.5 py-0.5 rounded text-xs font-semibold ${
                                          theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                                        }`}>
                                          {lesson.content_type}
                                        </span>
                                      )}
                                    </div>
                                    <div className={`text-xs mt-1 flex items-center gap-2 ${
                                      theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                                    }`}>
                                      {lesson.video_duration && (
                                        <>
                                          <FiClock size={12} />
                                          {lesson.video_duration}
                                        </>
                                      )}
                                      {lessonProgress > 0 && lessonProgress < 100 && (
                                        <span>{lessonProgress}% watched</span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default CoursePlayerEnhanced;

