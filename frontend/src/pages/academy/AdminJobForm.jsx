import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { jobsAPI } from '../../utils/api';
import { useTheme } from '../../context/ThemeContext';
import { FiSave, FiX, FiPlus, FiTrash2 } from 'react-icons/fi';
import { motion } from 'framer-motion';

const AdminJobForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    type: '',
    description: '',
    requirements: [''],
    active: true
  });

  const departments = [
    'Engineering',
    'AI Engineer',
    'Design',
    'Education',
    'Infrastructure',
    'Marketing',
    'Customer Success',
    'Sales',
    'Operations',
    'Product',
    'HR'
  ];

  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'];

  useEffect(() => {
    if (id) {
      fetchJob();
    }
  }, [id]);

  const fetchJob = async () => {
    try {
      const response = await jobsAPI.getById(id);
      const job = response.data.job;
      setFormData({
        title: job.title || '',
        department: job.department || '',
        location: job.location || '',
        type: job.type || '',
        description: job.description || '',
        requirements: job.requirements && job.requirements.length > 0 ? job.requirements : [''],
        active: job.active !== undefined ? job.active : true
      });
    } catch (error) {
      console.error('Error fetching job:', error);
      alert('Error loading job details');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRequirementChange = (index, value) => {
    const newRequirements = [...formData.requirements];
    newRequirements[index] = value;
    setFormData(prev => ({
      ...prev,
      requirements: newRequirements
    }));
  };

  const addRequirement = () => {
    setFormData(prev => ({
      ...prev,
      requirements: [...prev.requirements, '']
    }));
  };

  const removeRequirement = (index) => {
    if (formData.requirements.length > 1) {
      const newRequirements = formData.requirements.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        requirements: newRequirements
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const requirements = formData.requirements.filter(req => req.trim() !== '');
      
      if (requirements.length === 0) {
        alert('Please add at least one requirement');
        setLoading(false);
        return;
      }

      const data = {
        ...formData,
        requirements
      };

      if (id) {
        await jobsAPI.update(id, data);
      } else {
        await jobsAPI.create(data);
      }

      navigate('/academy/admin/jobs');
    } catch (error) {
      console.error('Error saving job:', error);
      alert('Error saving job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'}`}>
      <header className={`sticky top-0 z-50 border-b backdrop-blur-xl ${
        theme === 'dark' ? 'border-gray-800 bg-dark-card' : 'border-gray-200 bg-white'
      }`}>
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/academy/admin/jobs')}
                className={`p-2 rounded-xl transition-all ${
                  theme === 'dark'
                    ? 'hover:bg-gray-800 text-gray-300'
                    : 'hover:bg-gray-100 text-gray-800'
                }`}
              >
                <FiX size={20} />
              </button>
              <h1 className={`text-xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                {id ? 'Edit Job Posting' : 'Create New Job Posting'}
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className={`rounded-xl border-2 p-6 shadow-xl ${
            theme === 'dark'
              ? 'bg-dark-lighter border-gray-700'
              : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                Job Details
              </h2>
              {!id && (
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl ${
                  theme === 'dark'
                    ? 'bg-electric-green/20 text-electric-green border border-electric-green/30'
                    : 'bg-accent-red/20 text-accent-red border border-accent-red/30'
                }`}>
                  <FiPlus size={16} />
                  <span className="text-sm font-semibold">Create New Job Posting</span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-semibold mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-800'
                }`}>
                  Job Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Full Stack Developer"
                  className={`w-full px-4 py-2.5 rounded-lg border-2 transition focus:outline-none focus:ring-2 ${
                    theme === 'dark'
                      ? 'bg-dark-card border-gray-700 text-white placeholder:text-gray-500 focus:border-electric-blue focus:ring-electric-blue/20'
                      : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-accent-red focus:ring-accent-red/20'
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-800'
                  }`}>
                    Department/Category *
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-2.5 rounded-lg border-2 transition focus:outline-none focus:ring-2 ${
                      theme === 'dark'
                        ? 'bg-dark-card border-gray-700 text-white focus:border-electric-blue focus:ring-electric-blue/20'
                        : 'bg-white border-gray-300 text-gray-900 focus:border-accent-red focus:ring-accent-red/20'
                    }`}
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-semibold mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-800'
                  }`}>
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Remote, Hybrid, New York"
                    className={`w-full px-4 py-2.5 rounded-lg border-2 transition focus:outline-none focus:ring-2 ${
                      theme === 'dark'
                        ? 'bg-dark-card border-gray-700 text-white placeholder:text-gray-500 focus:border-electric-blue focus:ring-electric-blue/20'
                        : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-accent-red focus:ring-accent-red/20'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-800'
                }`}>
                  Job Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-2.5 rounded-lg border-2 transition focus:outline-none focus:ring-2 ${
                    theme === 'dark'
                      ? 'bg-dark-card border-gray-700 text-white focus:border-electric-blue focus:ring-electric-blue/20'
                      : 'bg-white border-gray-300 text-gray-900 focus:border-accent-red focus:ring-accent-red/20'
                  }`}
                >
                  <option value="">Select Type</option>
                  {jobTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-800'
                }`}>
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  placeholder="Describe the role, responsibilities, and what makes it exciting..."
                  className={`w-full px-4 py-2.5 rounded-lg border-2 transition focus:outline-none focus:ring-2 resize-none ${
                    theme === 'dark'
                      ? 'bg-dark-card border-gray-700 text-white placeholder:text-gray-500 focus:border-electric-blue focus:ring-electric-blue/20'
                      : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-accent-red focus:ring-accent-red/20'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-800'
                }`}>
                  Requirements *
                </label>
                <div className="space-y-2">
                  {formData.requirements.map((req, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={req}
                        onChange={(e) => handleRequirementChange(index, e.target.value)}
                        placeholder={`Requirement ${index + 1}`}
                        className={`flex-1 px-4 py-2.5 rounded-lg border-2 transition focus:outline-none focus:ring-2 ${
                          theme === 'dark'
                            ? 'bg-dark-card border-gray-700 text-white placeholder:text-gray-500 focus:border-electric-blue focus:ring-electric-blue/20'
                            : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-accent-red focus:ring-accent-red/20'
                        }`}
                      />
                      {formData.requirements.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeRequirement(index)}
                          className={`p-2 rounded-lg transition ${
                            theme === 'dark'
                              ? 'text-red-400 hover:bg-red-500/10'
                              : 'text-red-500 hover:bg-red-50'
                          }`}
                        >
                          <FiTrash2 size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addRequirement}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition ${
                      theme === 'dark'
                        ? 'border-gray-700 text-gray-300 hover:border-electric-blue hover:bg-electric-blue/10'
                        : 'border-gray-300 text-gray-600 hover:border-accent-red hover:bg-accent-red/10'
                    }`}
                  >
                    <FiPlus size={18} />
                    Add Requirement
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active}
                  onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                  className={`w-5 h-5 rounded border-2 ${
                    theme === 'dark'
                      ? 'border-gray-700 bg-dark-card text-electric-blue'
                      : 'border-gray-300 bg-white text-accent-red'
                  }`}
                />
                <label htmlFor="active" className={`text-sm font-semibold ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-800'
                }`}>
                  Active (Show on careers page)
                </label>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/academy/admin/jobs')}
              className={`px-6 py-3 rounded-xl border-2 font-semibold transition ${
                theme === 'dark'
                  ? 'border-gray-700 text-gray-300 hover:border-gray-600 hover:bg-gray-800'
                  : 'border-gray-200 text-gray-800 hover:border-gray-300 hover:bg-gray-100'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-3 rounded-xl font-semibold text-white transition flex items-center gap-2 ${
                theme === 'dark'
                  ? 'bg-electric-green hover:bg-electric-blue'
                  : 'bg-accent-red hover:bg-accent-blue'
              } ${loading && 'opacity-75 cursor-not-allowed'}`}
            >
              <FiSave size={18} />
              {loading ? 'Saving...' : id ? 'Update Job' : 'Create Job'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AdminJobForm;

