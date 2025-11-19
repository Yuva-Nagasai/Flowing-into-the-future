import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { coursesAPI, modulesAPI, quizzesAPI, assignmentsAPI, uploadAPI, videosAPI } from '../../utils/api';
import { useTheme } from '../../context/ThemeContext';
import { 
  FiArrowLeft, FiPlus, FiTrash2, FiEdit, FiChevronDown, FiChevronUp,
  FiFileText, FiVideo, FiCheckCircle, FiX, FiSave, FiUpload, FiBookOpen, FiAward
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from '../../components/Modal';
import ConfirmModal from '../../components/ConfirmModal';

const AdminCourseContentManagement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState(new Set());
  const [activeTab, setActiveTab] = useState('modules');
  
  // Module form
  const [moduleForm, setModuleForm] = useState({ title: '', description: '', order_index: 0 });
  const [moduleModalOpen, setModuleModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState(null);
  
  // Lesson form
  const [lessonForm, setLessonForm] = useState({
    title: '', description: '', video_url: '', video_duration: '0:00',
    content_type: 'video', order_index: 0, pdf_url: ''
  });
  const [lessonModalOpen, setLessonModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  
  // Quiz form
  const [quizForm, setQuizForm] = useState({
    question: '', options: ['', ''], correct_answer: 0, points: 1, order_index: 0
  });
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [selectedModuleForQuiz, setSelectedModuleForQuiz] = useState(null);
  
  // Assignment form
  const [assignmentForm, setAssignmentForm] = useState({
    title: '', description: '', due_date: '', max_points: 100
  });
  const [assignmentModalOpen, setAssignmentModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [selectedModuleForAssignment, setSelectedModuleForAssignment] = useState(null);
  
  // Resource form
  const [resourceForm, setResourceForm] = useState({
    title: '', file_url: '', file_type: 'pdf'
  });
  const [resourceModalOpen, setResourceModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [selectedModuleForResource, setSelectedModuleForResource] = useState(null);
  const [uploadingResource, setUploadingResource] = useState(false);
  
  const [deleteModal, setDeleteModal] = useState({ open: false, type: '', id: null });
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchCourseContent();
  }, [id]);

  const fetchCourseContent = async () => {
    setLoading(true);
    try {
      const response = await coursesAPI.getDetailsAdmin(id);
      setCourse(response.data.course);
      const modulesData = response.data.modules || [];
      
      // Fetch resources, quizzes, and assignments for each module
      const modulesWithContent = await Promise.all(
        modulesData.map(async (module) => {
          try {
            const [resourcesRes, quizzesRes, assignmentsRes] = await Promise.all([
              videosAPI.getResourcesByModule(module.id).catch((err) => {
                console.error(`Error fetching resources for module ${module.id}:`, err);
                return { data: { resources: [] } };
              }),
              quizzesAPI.getByModule(module.id).catch((err) => {
                console.error(`Error fetching quizzes for module ${module.id}:`, err);
                return { data: { quizzes: [] } };
              }),
              assignmentsAPI.getByModule(module.id).catch((err) => {
                console.error(`Error fetching assignments for module ${module.id}:`, err);
                return { data: { assignments: [] } };
              })
            ]);
            
            // Handle response structure - check if data is nested or direct
            const resources = Array.isArray(resourcesRes?.data?.resources) 
              ? resourcesRes.data.resources 
              : Array.isArray(resourcesRes?.data) 
                ? resourcesRes.data 
                : [];
            
            const quizzes = Array.isArray(quizzesRes?.data?.quizzes) 
              ? quizzesRes.data.quizzes 
              : Array.isArray(quizzesRes?.data) 
                ? quizzesRes.data 
                : [];
            
            const assignments = Array.isArray(assignmentsRes?.data?.assignments) 
              ? assignmentsRes.data.assignments 
              : Array.isArray(assignmentsRes?.data) 
                ? assignmentsRes.data 
                : [];
            
            console.log(`Module ${module.title} (${module.id}):`, {
              resourcesCount: resources.length,
              quizzesCount: quizzes.length,
              assignmentsCount: assignments.length,
              resourcesResponse: resourcesRes?.data,
              quizzesResponse: quizzesRes?.data,
              assignmentsResponse: assignmentsRes?.data,
              resources: resources,
              quizzes: quizzes,
              assignments: assignments
            });
            
            return {
              ...module,
              resources: Array.isArray(resources) ? resources : [],
              quizzes: Array.isArray(quizzes) ? quizzes : [],
              assignments: Array.isArray(assignments) ? assignments : []
            };
          } catch (error) {
            console.error(`Error fetching content for module ${module.id}:`, error);
            return {
              ...module,
              resources: [],
              quizzes: [],
              assignments: []
            };
          }
        })
      );
      
      setModules(modulesWithContent);
      // Expand first module by default
      if (modulesWithContent.length > 0) {
        setExpandedModules(new Set([modulesWithContent[0].id]));
      }
    } catch (error) {
      console.error('Error fetching course content:', error);
      alert('Error loading course content');
    } finally {
      setLoading(false);
    }
  };

  const toggleModule = (moduleId) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  // Module handlers
  const openModuleModal = (module = null) => {
    if (module) {
      setEditingModule(module);
      setModuleForm({
        title: module.title || '',
        description: module.description || '',
        order_index: module.order_index || 0
      });
    } else {
      setEditingModule(null);
      setModuleForm({ title: '', description: '', order_index: modules.length });
    }
    setModuleModalOpen(true);
  };

  const saveModule = async () => {
    try {
      if (editingModule) {
        await modulesAPI.updateModule(editingModule.id, { ...moduleForm, course_id: id });
        setSuccessMessage('Module updated successfully!');
      } else {
        await modulesAPI.createModule({ ...moduleForm, course_id: id });
        setSuccessMessage('Module created successfully!');
      }
      setModuleModalOpen(false);
      fetchCourseContent();
    } catch (error) {
      alert(error.response?.data?.error || 'Error saving module');
    }
  };

  const deleteModule = async () => {
    try {
      await modulesAPI.deleteModule(deleteModal.id);
      setSuccessMessage('Module deleted successfully!');
      setDeleteModal({ open: false, type: '', id: null });
      fetchCourseContent();
    } catch (error) {
      alert('Error deleting module');
    }
  };

  // Lesson handlers
  const openLessonModal = (lesson = null, moduleId = null) => {
    if (lesson) {
      setEditingLesson(lesson);
      setLessonForm({
        title: lesson.title || '',
        description: lesson.description || '',
        video_url: lesson.video_url || '',
        video_duration: lesson.video_duration || '0:00',
        content_type: lesson.content_type || 'video',
        order_index: lesson.order_index || 0,
        pdf_url: lesson.pdf_url || ''
      });
      setSelectedModuleId(lesson.module_id);
    } else {
      setEditingLesson(null);
      setLessonForm({
        title: '', description: '', video_url: '', video_duration: '0:00',
        content_type: 'video', order_index: 0, pdf_url: ''
      });
      setSelectedModuleId(moduleId);
    }
    setLessonModalOpen(true);
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploadingVideo(true);
    try {
      const response = await uploadAPI.uploadVideo(file);
      setLessonForm({ ...lessonForm, video_url: response.data.url });
      setSuccessMessage('Video uploaded successfully!');
    } catch (error) {
      alert('Error uploading video');
    } finally {
      setUploadingVideo(false);
    }
  };

  const saveLesson = async () => {
    if (!selectedModuleId) {
      alert('Please select a module');
      return;
    }
    try {
      if (editingLesson) {
        await modulesAPI.updateLesson(editingLesson.id, { ...lessonForm, module_id: selectedModuleId, course_id: id });
        setSuccessMessage('Lesson updated successfully!');
      } else {
        await modulesAPI.createLesson({ ...lessonForm, module_id: selectedModuleId, course_id: id });
        setSuccessMessage('Lesson created successfully!');
      }
      setLessonModalOpen(false);
      fetchCourseContent();
    } catch (error) {
      alert(error.response?.data?.error || 'Error saving lesson');
    }
  };

  const deleteLesson = async () => {
    try {
      await modulesAPI.deleteLesson(deleteModal.id);
      setSuccessMessage('Lesson deleted successfully!');
      setDeleteModal({ open: false, type: '', id: null });
      fetchCourseContent();
    } catch (error) {
      alert('Error deleting lesson');
    }
  };

  // Quiz handlers (module-level)
  const openQuizModal = (quiz = null, moduleId = null) => {
    if (quiz) {
      setEditingQuiz(quiz);
      setQuizForm({
        question: quiz.question || '',
        options: quiz.options || ['', ''],
        correct_answer: quiz.correct_answer || 0,
        points: quiz.points || 1,
        order_index: quiz.order_index || 0
      });
      setSelectedModuleForQuiz(quiz.module_id);
    } else {
      setEditingQuiz(null);
      setQuizForm({
        question: '', options: ['', ''], correct_answer: 0, points: 1, order_index: 0
      });
      setSelectedModuleForQuiz(moduleId);
    }
    setQuizModalOpen(true);
  };

  const addQuizOption = () => {
    setQuizForm({ ...quizForm, options: [...quizForm.options, ''] });
  };

  const removeQuizOption = (index) => {
    const newOptions = quizForm.options.filter((_, i) => i !== index);
    setQuizForm({ ...quizForm, options: newOptions });
  };

  const updateQuizOption = (index, value) => {
    const newOptions = [...quizForm.options];
    newOptions[index] = value;
    setQuizForm({ ...quizForm, options: newOptions });
  };

  const saveQuiz = async () => {
    if (!selectedModuleForQuiz) {
      alert('Please select a module');
      return;
    }
    if (quizForm.options.length < 2) {
      alert('Please add at least 2 options');
      return;
    }
    if (quizForm.options.some(opt => !opt.trim())) {
      alert('Please fill all options');
      return;
    }
    try {
      if (editingQuiz) {
        await quizzesAPI.update(editingQuiz.id, { ...quizForm, module_id: selectedModuleForQuiz, course_id: id });
        setSuccessMessage('Quiz updated successfully!');
      } else {
        await quizzesAPI.create({ ...quizForm, module_id: selectedModuleForQuiz, course_id: id });
        setSuccessMessage('Quiz created successfully!');
      }
      setQuizModalOpen(false);
      fetchCourseContent();
    } catch (error) {
      alert(error.response?.data?.error || 'Error saving quiz');
    }
  };

  const deleteQuiz = async () => {
    try {
      await quizzesAPI.delete(deleteModal.id);
      setSuccessMessage('Quiz deleted successfully!');
      setDeleteModal({ open: false, type: '', id: null });
      fetchCourseContent();
    } catch (error) {
      alert('Error deleting quiz');
    }
  };

  // Assignment handlers (module-level)
  const openAssignmentModal = (assignment = null, moduleId = null) => {
    if (assignment) {
      setEditingAssignment(assignment);
      setAssignmentForm({
        title: assignment.title || '',
        description: assignment.description || '',
        due_date: assignment.due_date ? assignment.due_date.split('T')[0] : '',
        max_points: assignment.max_points || 100
      });
      setSelectedModuleForAssignment(assignment.module_id);
    } else {
      setEditingAssignment(null);
      setAssignmentForm({ title: '', description: '', due_date: '', max_points: 100 });
      setSelectedModuleForAssignment(moduleId);
    }
    setAssignmentModalOpen(true);
  };

  const saveAssignment = async () => {
    if (!selectedModuleForAssignment) {
      alert('Please select a module');
      return;
    }
    try {
      if (editingAssignment) {
        await assignmentsAPI.update(editingAssignment.id, { ...assignmentForm, module_id: selectedModuleForAssignment, course_id: id });
        setSuccessMessage('Assignment updated successfully!');
      } else {
        await assignmentsAPI.create({ ...assignmentForm, module_id: selectedModuleForAssignment, course_id: id });
        setSuccessMessage('Assignment created successfully!');
      }
      setAssignmentModalOpen(false);
      fetchCourseContent();
    } catch (error) {
      alert(error.response?.data?.error || 'Error saving assignment');
    }
  };

  const deleteAssignment = async () => {
    try {
      await assignmentsAPI.delete(deleteModal.id);
      setSuccessMessage('Assignment deleted successfully!');
      setDeleteModal({ open: false, type: '', id: null });
      fetchCourseContent();
    } catch (error) {
      alert('Error deleting assignment');
    }
  };

  // Resource handlers
  const openResourceModal = (resource = null, moduleId = null) => {
    if (resource) {
      setEditingResource(resource);
      setResourceForm({
        title: resource.title || '',
        file_url: resource.file_url || '',
        file_type: resource.file_type || 'pdf'
      });
      setSelectedModuleForResource(resource.module_id);
    } else {
      setEditingResource(null);
      setResourceForm({ title: '', file_url: '', file_type: 'pdf' });
      setSelectedModuleForResource(moduleId);
    }
    setResourceModalOpen(true);
  };

  const handleResourceUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploadingResource(true);
    try {
      const response = await uploadAPI.uploadResource(file);
      setResourceForm({ 
        ...resourceForm, 
        file_url: response.data.url || response.data.fileUrl,
        file_type: response.data.file_type || 'pdf'
      });
      alert('Resource uploaded successfully!');
    } catch (error) {
      alert('Error uploading resource: ' + (error.response?.data?.error || error.message));
    } finally {
      setUploadingResource(false);
    }
  };

  const saveResource = async () => {
    if (!selectedModuleForResource) {
      alert('Please select a module');
      return;
    }
    if (!resourceForm.title || !resourceForm.file_url) {
      alert('Please fill in resource title and file URL or upload a file');
      return;
    }
    try {
      if (editingResource) {
        // Update resource (if update endpoint exists, otherwise just create new)
        await videosAPI.addResource({ 
          ...resourceForm, 
          module_id: selectedModuleForResource, 
          course_id: id 
        });
        setSuccessMessage('Resource updated successfully!');
      } else {
        await videosAPI.addResource({ 
          ...resourceForm, 
          module_id: selectedModuleForResource, 
          course_id: id 
        });
        setSuccessMessage('Resource created successfully!');
      }
      setResourceModalOpen(false);
      fetchCourseContent();
    } catch (error) {
      alert(error.response?.data?.error || 'Error saving resource');
    }
  };

  const deleteResource = async () => {
    try {
      await videosAPI.deleteResource(deleteModal.id);
      setSuccessMessage('Resource deleted successfully!');
      setDeleteModal({ open: false, type: '', id: null });
      fetchCourseContent();
    } catch (error) {
      alert('Error deleting resource');
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className={`h-12 w-12 animate-spin rounded-full border-4 mx-auto mb-4 ${
            theme === 'dark' ? 'border-electric-blue/20 border-t-electric-blue' : 'border-accent-red/20 border-t-accent-red'
          }`} />
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Loading course content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className={`mb-6 rounded-2xl border-2 p-6 ${
          theme === 'dark' ? 'bg-dark-card border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Link
                to="/academy/admin"
                className={`p-2 rounded-lg transition-all ${
                  theme === 'dark' ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FiArrowLeft size={20} />
              </Link>
              <div>
                <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {course?.title || 'Course Content'}
                </h1>
                <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Manage modules, lessons, quizzes, and assignments
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                course?.published
                  ? theme === 'dark' ? 'bg-electric-green/20 text-electric-green' : 'bg-green-100 text-green-700'
                  : theme === 'dark' ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-600'
              }`}>
                {course?.published ? 'Published' : 'Draft'}
              </span>
              <Link
                to={`/academy/admin/edit-course/${id}`}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  theme === 'dark'
                    ? 'bg-electric-blue text-black hover:bg-electric-green'
                    : 'bg-accent-red text-white hover:bg-accent-blue'
                }`}
              >
                Edit Course
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-dark-lighter' : 'bg-gray-50'}`}>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Modules</p>
              <p className={`text-xl font-bold mt-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {modules.length}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-dark-lighter' : 'bg-gray-50'}`}>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Lessons</p>
              <p className={`text-xl font-bold mt-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {modules.reduce((sum, m) => sum + (m.lessons?.length || 0), 0)}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-dark-lighter' : 'bg-gray-50'}`}>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Quizzes</p>
              <p className={`text-xl font-bold mt-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {modules.reduce((sum, m) => 
                  sum + (Array.isArray(m.quizzes) ? m.quizzes.length : 0), 0
                )}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-dark-lighter' : 'bg-gray-50'}`}>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Assignments</p>
              <p className={`text-xl font-bold mt-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {modules.reduce((sum, m) => 
                  sum + (Array.isArray(m.assignments) ? m.assignments.length : 0), 0
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className={`mb-4 p-4 rounded-lg ${
            theme === 'dark' ? 'bg-electric-green/20 text-electric-green' : 'bg-green-100 text-green-700'
          }`}>
            {successMessage}
            <button
              onClick={() => setSuccessMessage('')}
              className="float-right"
            >
              <FiX size={18} />
            </button>
          </div>
        )}

        {/* Modules List */}
        <div className="space-y-4">
          {modules.map((module) => (
            <div
              key={module.id}
              className={`rounded-2xl border-2 overflow-hidden ${
                theme === 'dark' ? 'bg-dark-card border-gray-700' : 'bg-white border-gray-200'
              }`}
            >
              {/* Module Header */}
              <div
                className={`p-4 cursor-pointer flex items-center justify-between ${
                  theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
                }`}
                onClick={() => toggleModule(module.id)}
              >
                <div className="flex items-center gap-3 flex-1">
                  {expandedModules.has(module.id) ? (
                    <FiChevronDown className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} />
                  ) : (
                    <FiChevronUp className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} />
                  )}
                  <div className="flex-1">
                    <h3 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {module.title}
                    </h3>
                    {module.description && (
                      <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {module.description}
                      </p>
                    )}
                    <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                      {module.lessons?.length || 0} lessons
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openModuleModal(module);
                    }}
                    className={`p-2 rounded-lg transition-all ${
                      theme === 'dark'
                        ? 'text-electric-blue hover:bg-gray-800'
                        : 'text-accent-red hover:bg-gray-100'
                    }`}
                  >
                    <FiEdit size={18} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteModal({ open: true, type: 'module', id: module.id });
                    }}
                    className={`p-2 rounded-lg transition-all ${
                      theme === 'dark' ? 'text-red-400 hover:bg-gray-800' : 'text-red-500 hover:bg-gray-100'
                    }`}
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Module Content */}
              <AnimatePresence>
                {expandedModules.has(module.id) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className={`border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}
                  >
                    <div className="p-4 space-y-3">
                      {/* Module Actions: Add Lesson, Quiz, Assignment, Resources */}
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <button
                          onClick={() => openLessonModal(null, module.id)}
                          className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                            theme === 'dark'
                              ? 'bg-electric-green text-black hover:bg-electric-blue'
                              : 'bg-accent-red text-white hover:bg-accent-blue'
                          }`}
                        >
                          <FiPlus size={18} />
                          Add Lesson
                        </button>
                        <button
                          onClick={() => openQuizModal(null, module.id)}
                          className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                            theme === 'dark'
                              ? 'bg-blue-500 text-white hover:bg-blue-600'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          <FiPlus size={18} />
                          Add Quiz
                        </button>
                        <button
                          onClick={() => openAssignmentModal(null, module.id)}
                          className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                            theme === 'dark'
                              ? 'bg-orange-500 text-white hover:bg-orange-600'
                              : 'bg-orange-600 text-white hover:bg-orange-700'
                          }`}
                        >
                          <FiPlus size={18} />
                          Add Assignment
                        </button>
                        <button
                          onClick={() => openResourceModal(null, module.id)}
                          className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                            theme === 'dark'
                              ? 'bg-purple-500 text-white hover:bg-purple-600'
                              : 'bg-purple-600 text-white hover:bg-purple-700'
                          }`}
                        >
                          <FiFileText size={18} />
                          Downloadable Resources
                        </button>
                      </div>

                      {/* Module Content Summary */}
                      <div className={`grid grid-cols-3 gap-2 mb-4 p-3 rounded-lg ${
                        theme === 'dark' ? 'bg-dark-card border border-gray-700' : 'bg-gray-50 border border-gray-200'
                      }`}>
                        <div className="text-center">
                          <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Quizzes</p>
                          <p className={`text-lg font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                            {Array.isArray(module.quizzes) ? module.quizzes.length : 0}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Assignments</p>
                          <p className={`text-lg font-bold ${theme === 'dark' ? 'text-orange-400' : 'text-orange-600'}`}>
                            {Array.isArray(module.assignments) ? module.assignments.length : 0}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Resources</p>
                          <p className={`text-lg font-bold ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>
                            {Array.isArray(module.resources) ? module.resources.length : 0}
                          </p>
                        </div>
                      </div>

                      {/* Display Module Quizzes */}
                      {module.quizzes && module.quizzes.length > 0 && (
                        <div className="space-y-2">
                          <h4 className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            Module Quizzes ({module.quizzes.length})
                          </h4>
                          {module.quizzes.map(quiz => (
                            <div
                              key={quiz.id}
                              className={`flex items-center justify-between p-2 rounded-lg ${
                                theme === 'dark' ? 'bg-dark-card border border-gray-700' : 'bg-white border border-gray-200'
                              }`}
                            >
                              <div className="flex items-center gap-2 flex-1">
                                <FiBookOpen className={theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} />
                                <div className="flex-1 min-w-0">
                                  <p className={`text-sm font-medium truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                    {quiz.question}
                                  </p>
                                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {quiz.points} points
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => openQuizModal(quiz, module.id)}
                                  className={`p-1.5 rounded transition-all ${
                                    theme === 'dark' ? 'text-blue-400 hover:bg-gray-800' : 'text-blue-600 hover:bg-gray-100'
                                  }`}
                                >
                                  <FiEdit size={16} />
                                </button>
                                <button
                                  onClick={() => setDeleteModal({ open: true, type: 'quiz', id: quiz.id })}
                                  className={`p-1.5 rounded transition-all ${
                                    theme === 'dark' ? 'text-red-400 hover:bg-gray-800' : 'text-red-500 hover:bg-gray-100'
                                  }`}
                                >
                                  <FiTrash2 size={16} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Display Module Assignments */}
                      {module.assignments && module.assignments.length > 0 && (
                        <div className="space-y-2">
                          <h4 className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            Module Assignments ({module.assignments.length})
                          </h4>
                          {module.assignments.map(assignment => (
                            <div
                              key={assignment.id}
                              className={`flex items-center justify-between p-2 rounded-lg ${
                                theme === 'dark' ? 'bg-dark-card border border-gray-700' : 'bg-white border border-gray-200'
                              }`}
                            >
                              <div className="flex items-center gap-2 flex-1">
                                <FiAward className={theme === 'dark' ? 'text-orange-400' : 'text-orange-600'} />
                                <div className="flex-1 min-w-0">
                                  <p className={`text-sm font-medium truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                    {assignment.title}
                                  </p>
                                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {assignment.max_points} points
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => openAssignmentModal(assignment, module.id)}
                                  className={`p-1.5 rounded transition-all ${
                                    theme === 'dark' ? 'text-orange-400 hover:bg-gray-800' : 'text-orange-600 hover:bg-gray-100'
                                  }`}
                                >
                                  <FiEdit size={16} />
                                </button>
                                <button
                                  onClick={() => setDeleteModal({ open: true, type: 'assignment', id: assignment.id })}
                                  className={`p-1.5 rounded transition-all ${
                                    theme === 'dark' ? 'text-red-400 hover:bg-gray-800' : 'text-red-500 hover:bg-gray-100'
                                  }`}
                                >
                                  <FiTrash2 size={16} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Display Module Resources */}
                      {module.resources && module.resources.length > 0 && (
                        <div className="space-y-2">
                          <h4 className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            Module Resources ({module.resources.length})
                          </h4>
                          {module.resources.map(resource => (
                            <div
                              key={resource.id}
                              className={`flex items-center justify-between p-2 rounded-lg ${
                                theme === 'dark' ? 'bg-dark-card border border-gray-700' : 'bg-white border border-gray-200'
                              }`}
                            >
                              <div className="flex items-center gap-2 flex-1">
                                <FiFileText className={theme === 'dark' ? 'text-electric-green' : 'text-accent-red'} />
                                <div className="flex-1 min-w-0">
                                  <p className={`text-sm font-medium truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                    {resource.title}
                                  </p>
                                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {resource.file_type.toUpperCase()}
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() => setDeleteModal({ open: true, type: 'resource', id: resource.id })}
                                className={`p-1.5 rounded transition-all ${
                                  theme === 'dark' ? 'text-red-400 hover:bg-gray-800' : 'text-red-500 hover:bg-gray-100'
                                }`}
                              >
                                <FiTrash2 size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Lessons */}
                      {module.lessons?.map((lesson) => (
                        <div
                          key={lesson.id}
                          className={`p-4 rounded-lg border-2 ${
                            theme === 'dark' ? 'bg-dark-lighter border-gray-700' : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                {lesson.content_type === 'video' ? (
                                  <FiVideo className={theme === 'dark' ? 'text-electric-blue' : 'text-accent-red'} />
                                ) : (
                                  <FiFileText className={theme === 'dark' ? 'text-electric-blue' : 'text-accent-red'} />
                                )}
                                <h4 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                  {lesson.title}
                                </h4>
                                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                                  theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                                }`}>
                                  {lesson.content_type}
                                </span>
                              </div>
                              {lesson.description && (
                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                  {lesson.description}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openLessonModal(lesson)}
                                className={`p-2 rounded-lg transition-all ${
                                  theme === 'dark'
                                    ? 'text-electric-blue hover:bg-gray-800'
                                    : 'text-accent-red hover:bg-gray-100'
                                }`}
                              >
                                <FiEdit size={16} />
                              </button>
                              <button
                                onClick={() => setDeleteModal({ open: true, type: 'lesson', id: lesson.id })}
                                className={`p-2 rounded-lg transition-all ${
                                  theme === 'dark' ? 'text-red-400 hover:bg-gray-800' : 'text-red-500 hover:bg-gray-100'
                                }`}
                              >
                                <FiTrash2 size={16} />
                              </button>
                            </div>
                          </div>

                        </div>
                      ))}

                      {(!module.lessons || module.lessons.length === 0) && (
                        <p className={`text-center py-4 text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                          No lessons yet. Click "Add Lesson" to create one.
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}

          {/* Add Module Button */}
          <button
            onClick={() => openModuleModal()}
            className={`w-full p-4 rounded-2xl border-2 border-dashed transition-all ${
              theme === 'dark'
                ? 'border-gray-700 text-gray-400 hover:border-electric-green hover:text-electric-green'
                : 'border-gray-300 text-gray-600 hover:border-accent-red hover:text-accent-red'
            }`}
          >
            <FiPlus size={20} className="inline mr-2" />
            Add New Module
          </button>
        </div>
      </div>

      {/* Module Modal */}
      <Modal
        isOpen={moduleModalOpen}
        onClose={() => setModuleModalOpen(false)}
        title={editingModule ? 'Edit Module' : 'Create Module'}
      >
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Title *
            </label>
            <input
              type="text"
              value={moduleForm.title}
              onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })}
              className={`w-full px-4 py-2 rounded-lg border-2 ${
                theme === 'dark'
                  ? 'bg-dark-lighter border-gray-700 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              placeholder="Module title"
            />
          </div>
          <div>
            <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Description
            </label>
            <textarea
              value={moduleForm.description}
              onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })}
              rows={3}
              className={`w-full px-4 py-2 rounded-lg border-2 ${
                theme === 'dark'
                  ? 'bg-dark-lighter border-gray-700 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              placeholder="Module description"
            />
          </div>
          <div>
            <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Order Index
            </label>
            <input
              type="number"
              value={moduleForm.order_index}
              onChange={(e) => setModuleForm({ ...moduleForm, order_index: parseInt(e.target.value) || 0 })}
              className={`w-full px-4 py-2 rounded-lg border-2 ${
                theme === 'dark'
                  ? 'bg-dark-lighter border-gray-700 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setModuleModalOpen(false)}
              className={`px-4 py-2 rounded-lg font-semibold ${
                theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Cancel
            </button>
            <button
              onClick={saveModule}
              className={`px-4 py-2 rounded-lg font-semibold ${
                theme === 'dark'
                  ? 'bg-electric-green text-black hover:bg-electric-blue'
                  : 'bg-accent-red text-white hover:bg-accent-blue'
              }`}
            >
              <FiSave size={18} className="inline mr-2" />
              Save
            </button>
          </div>
        </div>
      </Modal>

      {/* Lesson Modal */}
      <Modal
        isOpen={lessonModalOpen}
        onClose={() => setLessonModalOpen(false)}
        title={editingLesson ? 'Edit Lesson' : 'Create Lesson'}
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Title *
            </label>
            <input
              type="text"
              value={lessonForm.title}
              onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
              className={`w-full px-4 py-2 rounded-lg border-2 ${
                theme === 'dark'
                  ? 'bg-dark-lighter border-gray-700 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              placeholder="Lesson title"
            />
          </div>
          <div>
            <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Content Type
            </label>
            <select
              value={lessonForm.content_type}
              onChange={(e) => setLessonForm({ ...lessonForm, content_type: e.target.value })}
              className={`w-full px-4 py-2 rounded-lg border-2 ${
                theme === 'dark'
                  ? 'bg-dark-lighter border-gray-700 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="video">Video</option>
              <option value="text">Text</option>
              <option value="quiz">Quiz</option>
              <option value="assignment">Assignment</option>
            </select>
          </div>
          {lessonForm.content_type === 'video' && (
            <>
              <div>
                <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Video URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={lessonForm.video_url}
                    onChange={(e) => setLessonForm({ ...lessonForm, video_url: e.target.value })}
                    className={`flex-1 px-4 py-2 rounded-lg border-2 ${
                      theme === 'dark'
                        ? 'bg-dark-lighter border-gray-700 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="Video URL or upload file"
                  />
                  <label className={`px-4 py-2 rounded-lg font-semibold cursor-pointer transition-all ${
                    theme === 'dark'
                      ? 'bg-electric-blue text-black hover:bg-electric-green'
                      : 'bg-accent-red text-white hover:bg-accent-blue'
                  } ${uploadingVideo ? 'opacity-50' : ''}`}>
                    <FiUpload size={18} className="inline mr-2" />
                    {uploadingVideo ? 'Uploading...' : 'Upload'}
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      className="hidden"
                      disabled={uploadingVideo}
                    />
                  </label>
                </div>
              </div>
              <div>
                <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Duration (e.g., 10:30)
                </label>
                <input
                  type="text"
                  value={lessonForm.video_duration}
                  onChange={(e) => setLessonForm({ ...lessonForm, video_duration: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border-2 ${
                    theme === 'dark'
                      ? 'bg-dark-lighter border-gray-700 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="0:00"
                />
              </div>
            </>
          )}
          <div>
            <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Description
            </label>
            <textarea
              value={lessonForm.description}
              onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })}
              rows={3}
              className={`w-full px-4 py-2 rounded-lg border-2 ${
                theme === 'dark'
                  ? 'bg-dark-lighter border-gray-700 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              placeholder="Lesson description"
            />
          </div>
          <div>
            <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Order Index
            </label>
            <input
              type="number"
              value={lessonForm.order_index}
              onChange={(e) => setLessonForm({ ...lessonForm, order_index: parseInt(e.target.value) || 0 })}
              className={`w-full px-4 py-2 rounded-lg border-2 ${
                theme === 'dark'
                  ? 'bg-dark-lighter border-gray-700 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setLessonModalOpen(false)}
              className={`px-4 py-2 rounded-lg font-semibold ${
                theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Cancel
            </button>
            <button
              onClick={saveLesson}
              className={`px-4 py-2 rounded-lg font-semibold ${
                theme === 'dark'
                  ? 'bg-electric-green text-black hover:bg-electric-blue'
                  : 'bg-accent-red text-white hover:bg-accent-blue'
              }`}
            >
              <FiSave size={18} className="inline mr-2" />
              Save
            </button>
          </div>
        </div>
      </Modal>

      {/* Quiz Modal */}
      <Modal
        isOpen={quizModalOpen}
        onClose={() => setQuizModalOpen(false)}
        title={editingQuiz ? 'Edit Quiz' : 'Create Quiz'}
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Question *
            </label>
            <textarea
              value={quizForm.question}
              onChange={(e) => setQuizForm({ ...quizForm, question: e.target.value })}
              rows={2}
              className={`w-full px-4 py-2 rounded-lg border-2 ${
                theme === 'dark'
                  ? 'bg-dark-lighter border-gray-700 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              placeholder="Enter question"
            />
          </div>
          <div>
            <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Options * (at least 2)
            </label>
            {quizForm.options.map((option, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => updateQuizOption(index, e.target.value)}
                  className={`flex-1 px-4 py-2 rounded-lg border-2 ${
                    theme === 'dark'
                      ? 'bg-dark-lighter border-gray-700 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder={`Option ${index + 1}`}
                />
                {quizForm.options.length > 2 && (
                  <button
                    onClick={() => removeQuizOption(index)}
                    className={`p-2 rounded-lg ${
                      theme === 'dark' ? 'text-red-400 hover:bg-gray-800' : 'text-red-500 hover:bg-gray-100'
                    }`}
                  >
                    <FiX size={18} />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={addQuizOption}
              className={`mt-2 px-3 py-1.5 rounded-lg text-sm font-semibold ${
                theme === 'dark'
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <FiPlus size={14} className="inline mr-1" />
              Add Option
            </button>
          </div>
          <div>
            <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Correct Answer (Option Index) *
            </label>
            <select
              value={quizForm.correct_answer}
              onChange={(e) => setQuizForm({ ...quizForm, correct_answer: parseInt(e.target.value) })}
              className={`w-full px-4 py-2 rounded-lg border-2 ${
                theme === 'dark'
                  ? 'bg-dark-lighter border-gray-700 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              {quizForm.options.map((_, index) => (
                <option key={index} value={index}>
                  Option {index + 1}: {quizForm.options[index] || '(empty)'}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Points
            </label>
            <input
              type="number"
              value={quizForm.points}
              onChange={(e) => setQuizForm({ ...quizForm, points: parseInt(e.target.value) || 1 })}
              className={`w-full px-4 py-2 rounded-lg border-2 ${
                theme === 'dark'
                  ? 'bg-dark-lighter border-gray-700 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              min="1"
            />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setQuizModalOpen(false)}
              className={`px-4 py-2 rounded-lg font-semibold ${
                theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Cancel
            </button>
            <button
              onClick={saveQuiz}
              className={`px-4 py-2 rounded-lg font-semibold ${
                theme === 'dark'
                  ? 'bg-electric-green text-black hover:bg-electric-blue'
                  : 'bg-accent-red text-white hover:bg-accent-blue'
              }`}
            >
              <FiSave size={18} className="inline mr-2" />
              Save
            </button>
          </div>
        </div>
      </Modal>

      {/* Assignment Modal */}
      <Modal
        isOpen={assignmentModalOpen}
        onClose={() => setAssignmentModalOpen(false)}
        title={editingAssignment ? 'Edit Assignment' : 'Create Assignment'}
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Title *
            </label>
            <input
              type="text"
              value={assignmentForm.title}
              onChange={(e) => setAssignmentForm({ ...assignmentForm, title: e.target.value })}
              className={`w-full px-4 py-2 rounded-lg border-2 ${
                theme === 'dark'
                  ? 'bg-dark-lighter border-gray-700 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              placeholder="Assignment title"
            />
          </div>
          <div>
            <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Description *
            </label>
            <textarea
              value={assignmentForm.description}
              onChange={(e) => setAssignmentForm({ ...assignmentForm, description: e.target.value })}
              rows={4}
              className={`w-full px-4 py-2 rounded-lg border-2 ${
                theme === 'dark'
                  ? 'bg-dark-lighter border-gray-700 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              placeholder="Assignment description and instructions"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Due Date
              </label>
              <input
                type="date"
                value={assignmentForm.due_date}
                onChange={(e) => setAssignmentForm({ ...assignmentForm, due_date: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg border-2 ${
                  theme === 'dark'
                    ? 'bg-dark-lighter border-gray-700 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
            <div>
              <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Max Points
              </label>
              <input
                type="number"
                value={assignmentForm.max_points}
                onChange={(e) => setAssignmentForm({ ...assignmentForm, max_points: parseInt(e.target.value) || 100 })}
                className={`w-full px-4 py-2 rounded-lg border-2 ${
                  theme === 'dark'
                    ? 'bg-dark-lighter border-gray-700 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                min="1"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setAssignmentModalOpen(false)}
              className={`px-4 py-2 rounded-lg font-semibold ${
                theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Cancel
            </button>
            <button
              onClick={saveAssignment}
              className={`px-4 py-2 rounded-lg font-semibold ${
                theme === 'dark'
                  ? 'bg-electric-green text-black hover:bg-electric-blue'
                  : 'bg-accent-red text-white hover:bg-accent-blue'
              }`}
            >
              <FiSave size={18} className="inline mr-2" />
              Save
            </button>
          </div>
        </div>
      </Modal>

      {/* Resource Modal */}
      <Modal
        isOpen={resourceModalOpen}
        onClose={() => setResourceModalOpen(false)}
        title={editingResource ? 'Edit Resource' : 'Add Downloadable Resource'}
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Resource Title *
            </label>
            <input
              type="text"
              value={resourceForm.title}
              onChange={(e) => setResourceForm({ ...resourceForm, title: e.target.value })}
              className={`w-full px-4 py-2 rounded-lg border-2 ${
                theme === 'dark'
                  ? 'bg-dark-lighter border-gray-700 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              placeholder="e.g., Course Notes, Study Guide, etc."
            />
          </div>
          <div>
            <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              File Type
            </label>
            <select
              value={resourceForm.file_type}
              onChange={(e) => setResourceForm({ ...resourceForm, file_type: e.target.value })}
              className={`w-full px-4 py-2 rounded-lg border-2 ${
                theme === 'dark'
                  ? 'bg-dark-lighter border-gray-700 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="pdf">PDF</option>
              <option value="doc">DOC/DOCX</option>
              <option value="zip">ZIP/RAR</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              File URL or Upload File *
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={resourceForm.file_url}
                onChange={(e) => setResourceForm({ ...resourceForm, file_url: e.target.value })}
                className={`flex-1 px-4 py-2 rounded-lg border-2 ${
                  theme === 'dark'
                    ? 'bg-dark-lighter border-gray-700 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="Enter file URL (Google Drive, Dropbox, etc.) or upload file"
              />
              <label className={`px-4 py-2 rounded-lg font-semibold cursor-pointer transition-all flex items-center gap-2 ${
                theme === 'dark'
                  ? 'bg-purple-500 hover:bg-purple-600 text-white'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              } ${uploadingResource ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <FiUpload size={18} />
                {uploadingResource ? 'Uploading...' : 'Upload'}
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.zip,.rar,.7z,.txt,.xls,.xlsx"
                  onChange={handleResourceUpload}
                  className="hidden"
                  disabled={uploadingResource}
                />
              </label>
            </div>
            <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              You can either paste a file URL (from Google Drive, Dropbox, etc.) or upload a file from your computer
            </p>
            {resourceForm.file_url && (
              <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                ✓ {resourceForm.file_url.startsWith('http') ? 'URL set' : 'File uploaded'}
              </p>
            )}
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setResourceModalOpen(false)}
              className={`px-4 py-2 rounded-lg font-semibold ${
                theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Cancel
            </button>
            <button
              onClick={saveResource}
              className={`px-4 py-2 rounded-lg font-semibold ${
                theme === 'dark'
                  ? 'bg-electric-green text-black hover:bg-electric-blue'
                  : 'bg-accent-red text-white hover:bg-accent-blue'
              }`}
            >
              <FiSave size={18} className="inline mr-2" />
              Save
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, type: '', id: null })}
        onConfirm={() => {
          if (deleteModal.type === 'module') deleteModule();
          else if (deleteModal.type === 'lesson') deleteLesson();
          else if (deleteModal.type === 'quiz') deleteQuiz();
          else if (deleteModal.type === 'assignment') deleteAssignment();
          else if (deleteModal.type === 'resource') deleteResource();
        }}
        title={`Delete ${deleteModal.type}`}
        message={`Are you sure you want to delete this ${deleteModal.type}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
};

export default AdminCourseContentManagement;

