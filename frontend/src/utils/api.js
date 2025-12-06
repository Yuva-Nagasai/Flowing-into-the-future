import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('academy_token'); // academy-specific auth token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  signup: (name, email, password, role = 'student') => api.post('/auth/signup', { name, email, password, role })
};

export const coursesAPI = {
  getAll: (params) => api.get('/courses', { params }),
  getById: (id) => api.get(`/courses/${id}`),
  getAllAdmin: () => api.get('/courses/admin/all'),
  getDetailsAdmin: (id) => api.get(`/courses/admin/${id}`),
  create: (data) => api.post('/courses', data),
  update: (id, data) => api.put(`/courses/${id}`, data),
  delete: (id) => api.delete(`/courses/${id}`)
};

export const videosAPI = {
  add: (data) => api.post('/videos', data),
  update: (id, data) => api.put(`/videos/${id}`, data),
  delete: (id) => api.delete(`/videos/${id}`),
  addResource: (data) => api.post('/videos/resources', data),
  deleteResource: (id) => api.delete(`/videos/resources/${id}`),
  getResourcesByModule: (moduleId) => api.get(`/videos/resources/module/${moduleId}`)
};

export const purchasesAPI = {
  create: (data) => api.post('/purchases', data),
  getUserPurchases: () => api.get('/purchases/my-purchases'),
  checkPurchase: (courseId) => api.get(`/purchases/check/${courseId}`),
  getAllPurchases: () => api.get('/purchases/all'),
  getStudentsByCourse: (courseId) => api.get(`/purchases/course/${courseId}/students`)
};

export const paymentsAPI = {
  createOrder: (data) => api.post('/payments/create-order', data),
  verifyPayment: (data) => api.post('/payments/verify', data),
  enrollFree: (data) => api.post('/payments/enroll-free', data),
  getHistory: () => api.get('/payments/history')
};

export const jobsAPI = {
  getAll: (params) => api.get('/jobs', { params }),
  getById: (id) => api.get(`/jobs/${id}`),
  getAllAdmin: () => api.get('/jobs/admin/all'),
  create: (data) => api.post('/jobs', data),
  update: (id, data) => api.put(`/jobs/${id}`, data),
  delete: (id) => api.delete(`/jobs/${id}`)
};

export const aiToolsAPI = {
  getAll: (params) => api.get('/ai-tools', { params }),
  getById: (id) => api.get(`/ai-tools/${id}`),
  getAllAdmin: () => api.get('/ai-tools/admin/all'),
  create: (data) => api.post('/ai-tools', data),
  update: (id, data) => api.put(`/ai-tools/${id}`, data),
  delete: (id) => api.delete(`/ai-tools/${id}`)
};

export const aboutAPI = {
  getAll: () => api.get('/about'),
  getByType: (type) => api.get(`/about/type/${type}`),
  getAllAdmin: () => api.get('/about/admin/all'),
  upsert: (data) => api.post('/about', data),
  update: (id, data) => api.put(`/about/${id}`, data),
  delete: (id) => api.delete(`/about/${id}`)
};

export const uploadAPI = {
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'image');
    return api.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  uploadVideo: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/upload/video', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  uploadThumbnail: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/upload/thumbnail', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  uploadResource: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'resource');
    return api.post('/upload/resource', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  uploadStudentFile: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/upload/student-file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  getFileUrl: (filename) => {
    // Returns the protected file URL that requires authentication
    return `${API_URL}/files/serve/${filename}`;
  }
};

export const modulesAPI = {
  getByCourse: (courseId) => api.get(`/modules/course/${courseId}`),
  createModule: (data) => api.post('/modules/module', data),
  updateModule: (id, data) => api.put(`/modules/module/${id}`, data),
  deleteModule: (id) => api.delete(`/modules/module/${id}`),
  createLesson: (data) => api.post('/modules/lesson', data),
  updateLesson: (id, data) => api.put(`/modules/lesson/${id}`, data),
  deleteLesson: (id) => api.delete(`/modules/lesson/${id}`)
};

export const progressAPI = {
  update: (data) => api.post('/progress', data),
  getCourseProgress: (courseId) => api.get(`/progress/course/${courseId}`),
  getUserProgress: () => api.get('/progress/user'),
  getAllProgress: () => api.get('/progress/all')
};

export const certificatesAPI = {
  generate: (courseId) => api.post(`/certificates/course/${courseId}`),
  getUserCertificates: () => api.get('/certificates/user'),
  getById: (id) => api.get(`/certificates/${id}`)
};

export const notesAPI = {
  save: (data) => api.post('/notes', data),
  getLessonNotes: (lessonId) => api.get(`/notes/lesson/${lessonId}`),
  getCourseNotes: (courseId) => api.get(`/notes/course/${courseId}`),
  delete: (id) => api.delete(`/notes/${id}`)
};

export const discussionsAPI = {
  create: (data) => api.post('/discussions', data),
  getAll: (params) => api.get('/discussions', { params }),
  getById: (id) => api.get(`/discussions/${id}`),
  createReply: (discussionId, content) => api.post(`/discussions/${discussionId}/reply`, { content }),
  delete: (id) => api.delete(`/discussions/${id}`)
};

export const quizzesAPI = {
  getByCourse: (courseId) => api.get(`/quizzes/course/${courseId}`),
  getByLesson: (lessonId) => api.get(`/quizzes/lesson/${lessonId}`),
  getByModule: (moduleId) => api.get(`/quizzes/module/${moduleId}`),
  create: (data) => api.post('/quizzes', data),
  update: (id, data) => api.put(`/quizzes/${id}`, data),
  delete: (id) => api.delete(`/quizzes/${id}`),
  submitAttempt: (data) => api.post('/quizzes/attempt', data),
  getScores: (params) => api.get('/quizzes/scores', { params }),
  getScoresByCourse: (courseId) => api.get(`/quizzes/course/${courseId}/scores`)
};

export const assignmentsAPI = {
  getByCourse: (courseId) => api.get(`/assignments/course/${courseId}`),
  getByLesson: (lessonId) => api.get(`/assignments/lesson/${lessonId}`),
  getByModule: (moduleId) => api.get(`/assignments/module/${moduleId}`),
  create: (data) => api.post('/assignments', data),
  update: (id, data) => api.put(`/assignments/${id}`, data),
  delete: (id) => api.delete(`/assignments/${id}`),
  submit: (data) => api.post('/assignments/submit', data),
  grade: (id, data) => api.put(`/assignments/submission/${id}/grade`, data),
  getSubmissions: (params) => api.get('/assignments/submissions', { params }),
  getSubmissionsByCourse: (courseId) => api.get(`/assignments/course/${courseId}/submissions`)
};

export const notificationsAPI = {
  getAllAdmin: () => api.get('/notifications/admin/all')
};

export const heroSlidesAPI = {
  getAll: () => api.get('/hero-slides'),
  create: (data) => api.post('/hero-slides', data),
  update: (id, data) => api.put(`/hero-slides/${id}`, data),
  delete: (id) => api.delete(`/hero-slides/${id}`)
};

export default api;
