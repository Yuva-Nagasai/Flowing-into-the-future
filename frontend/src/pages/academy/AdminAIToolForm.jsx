import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { aiToolsAPI } from '../../utils/api';
import { useTheme } from '../../context/ThemeContext';
import { FiSave, FiX, FiPlus, FiTrash2 } from 'react-icons/fi';

const AdminAIToolForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    color: 'from-blue-500 to-cyan-500',
    features: [''],
    pricing_type: 'free',
    url: '',
    active: true
  });

  const categories = [
    { id: 'text', label: 'Text & Writing' },
    { id: 'image', label: 'Image Generation' },
    { id: 'code', label: 'Code Assistant' },
    { id: 'audio', label: 'Audio & Voice' },
    { id: 'video', label: 'Video Creation' },
    { id: 'analysis', label: 'Data Analysis' },
    { id: 'translation', label: 'Translation' }
  ];

  const colorOptions = [
    'from-blue-500 to-cyan-500',
    'from-purple-500 to-pink-500',
    'from-orange-500 to-red-500',
    'from-green-500 to-emerald-500',
    'from-indigo-500 to-blue-500',
    'from-pink-500 to-rose-500',
    'from-yellow-500 to-orange-500',
    'from-teal-500 to-cyan-500',
    'from-violet-500 to-purple-500',
    'from-blue-500 to-indigo-500',
    'from-green-500 to-teal-500',
    'from-cyan-500 to-blue-500'
  ];

  useEffect(() => {
    if (id) {
      fetchTool();
    }
  }, [id]);

  const fetchTool = async () => {
    try {
      const response = await aiToolsAPI.getById(id);
      const tool = response.data.tool;
      setFormData({
        name: tool.name || '',
        description: tool.description || '',
        category: tool.category || '',
        color: tool.color || 'from-blue-500 to-cyan-500',
        features: tool.features && tool.features.length > 0 ? tool.features : [''],
        pricing_type: tool.pricing_type || 'free',
        url: tool.url || '',
        active: tool.active !== undefined ? tool.active : true
      });
    } catch (error) {
      console.error('Error fetching tool:', error);
      alert('Error loading tool details');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData(prev => ({
      ...prev,
      features: newFeatures
    }));
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const removeFeature = (index) => {
    if (formData.features.length > 1) {
      const newFeatures = formData.features.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        features: newFeatures
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const features = formData.features.filter(f => f.trim() !== '');
      
      if (features.length === 0) {
        alert('Please add at least one feature');
        setLoading(false);
        return;
      }

      if (!formData.url || !formData.url.trim()) {
        alert('Please provide a URL');
        setLoading(false);
        return;
      }

      const data = {
        ...formData,
        features
      };

      if (id) {
        await aiToolsAPI.update(id, data);
      } else {
        await aiToolsAPI.create(data);
      }

      navigate('/academy/admin/ai-tools');
    } catch (error) {
      console.error('Error saving tool:', error);
      alert('Error saving tool. Please try again.');
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
                onClick={() => navigate('/academy/admin/ai-tools')}
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
                {id ? 'Edit AI Tool' : 'Create New AI Tool'}
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
            <h2 className={`text-2xl font-bold mb-6 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Tool Details</h2>

            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-semibold mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-800'
                }`}>
                  Tool Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., AI Text Generator"
                  className={`w-full px-4 py-2.5 rounded-lg border-2 transition focus:outline-none focus:ring-2 ${
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
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  placeholder="Describe what this AI tool does..."
                  className={`w-full px-4 py-2.5 rounded-lg border-2 transition focus:outline-none focus:ring-2 resize-none ${
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
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-2.5 rounded-lg border-2 transition focus:outline-none focus:ring-2 ${
                      theme === 'dark'
                        ? 'bg-dark-card border-gray-700 text-white focus:border-electric-blue focus:ring-electric-blue/20'
                        : 'bg-white border-gray-300 text-gray-900 focus:border-accent-red focus:ring-accent-red/20'
                    }`}
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-semibold mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-800'
                  }`}>
                    Pricing Type *
                  </label>
                  <select
                    name="pricing_type"
                    value={formData.pricing_type}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-2.5 rounded-lg border-2 transition focus:outline-none focus:ring-2 ${
                      theme === 'dark'
                        ? 'bg-dark-card border-gray-700 text-white focus:border-electric-blue focus:ring-electric-blue/20'
                        : 'bg-white border-gray-300 text-gray-900 focus:border-accent-red focus:ring-accent-red/20'
                    }`}
                  >
                    <option value="free">Free</option>
                    <option value="paid">Paid</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-800'
                }`}>
                  Tool URL/Link *
                </label>
                <input
                  type="url"
                  name="url"
                  value={formData.url}
                  onChange={handleInputChange}
                  required
                  placeholder="https://example.com or https://drive.google.com/..."
                  className={`w-full px-4 py-2.5 rounded-lg border-2 transition focus:outline-none focus:ring-2 ${
                    theme === 'dark'
                      ? 'bg-dark-card border-gray-700 text-white placeholder:text-gray-500 focus:border-electric-blue focus:ring-electric-blue/20'
                      : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-accent-red focus:ring-accent-red/20'
                  }`}
                />
                <p className={`text-xs mt-1 ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                }`}>
                  Can be a website link, Google Drive link, or any accessible URL
                </p>
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-800'
                }`}>
                  Gradient Color *
                </label>
                <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, color }))}
                      className={`h-12 rounded-lg border-2 transition ${
                        formData.color === color
                          ? theme === 'dark'
                            ? 'border-electric-blue ring-2 ring-electric-blue/50'
                            : 'border-accent-red ring-2 ring-accent-red/50'
                          : theme === 'dark'
                            ? 'border-gray-700 hover:border-gray-600'
                            : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className={`w-full h-full rounded-lg bg-gradient-to-br ${color}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-800'
                }`}>
                  Features *
                </label>
                <div className="space-y-2">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                        placeholder={`Feature ${index + 1}`}
                        className={`flex-1 px-4 py-2.5 rounded-lg border-2 transition focus:outline-none focus:ring-2 ${
                          theme === 'dark'
                            ? 'bg-dark-card border-gray-700 text-white placeholder:text-gray-500 focus:border-electric-blue focus:ring-electric-blue/20'
                            : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-accent-red focus:ring-accent-red/20'
                        }`}
                      />
                      {formData.features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
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
                    onClick={addFeature}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition ${
                      theme === 'dark'
                        ? 'border-gray-700 text-gray-300 hover:border-electric-blue hover:bg-electric-blue/10'
                        : 'border-gray-300 text-gray-800 hover:border-accent-red hover:bg-accent-red/10'
                    }`}
                  >
                    <FiPlus size={18} />
                    Add Feature
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
                  Active (Show on AI tools page)
                </label>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/academy/admin/ai-tools')}
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
              {loading ? 'Saving...' : id ? 'Update Tool' : 'Create Tool'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AdminAIToolForm;

