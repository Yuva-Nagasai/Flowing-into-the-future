import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { aboutAPI, uploadAPI } from '../../utils/api';
import { useTheme } from '../../context/ThemeContext';
import { FiEdit, FiTrash2, FiSearch, FiArrowLeft, FiPlus, FiSave, FiX, FiUpload } from 'react-icons/fi';
import { Target, Users, Rocket, TrendingUp, Handshake, Sun, Moon, FileText, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from '../../components/Modal';

const AdminAboutManagement = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingSection, setEditingSection] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState({ type: null, index: null });
  const fileInputRefs = useRef({});
  const [formData, setFormData] = useState({
    section_type: '',
    title: '',
    content: '',
    icon_name: '',
    order_index: 0,
    active: true,
    images: [],
    team_members: [],
    company_logos: []
  });
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const sectionTypes = [
    { value: 'mission', label: 'Our Mission', icon: Target },
    { value: 'team', label: 'Our Team', icon: Users },
    { value: 'vision', label: 'Our Vision', icon: Rocket },
    { value: 'growth', label: 'Our Growth', icon: TrendingUp },
    { value: 'clients', label: 'Our Clients', icon: Handshake }
  ];

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const response = await aboutAPI.getAllAdmin();
      setSections(response.data.sections || []);
    } catch (error) {
      console.error('Error fetching sections:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (section) => {
    setEditingSection(section);
    setFormData({
      section_type: section.section_type,
      title: section.title,
      content: section.content,
      icon_name: section.icon_name || '',
      order_index: section.order_index || 0,
      active: section.active !== undefined ? section.active : true,
      images: section.images || [],
      team_members: section.team_members || [],
      company_logos: section.company_logos || []
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      // Normalize data before sending - ensure arrays are always present for relevant section types
      const dataToSend = { ...formData };
      
      // Ensure images array is present for mission, vision, growth sections
      if (['mission', 'vision', 'growth'].includes(formData.section_type)) {
        dataToSend.images = formData.images || [];
      }
      
      // Ensure team_members array is present for team section
      if (formData.section_type === 'team') {
        dataToSend.team_members = formData.team_members || [];
      }
      
      // Ensure company_logos array is present for clients section
      if (formData.section_type === 'clients') {
        dataToSend.company_logos = formData.company_logos || [];
      }
      
      await aboutAPI.upsert(dataToSend);
      setEditingSection(null);
      setShowModal(false);
      setFormData({
        section_type: '',
        title: '',
        content: '',
        icon_name: '',
        order_index: 0,
        active: true,
        images: [],
        team_members: [],
        company_logos: []
      });
      fetchSections();
      alert('Section saved successfully!');
    } catch (error) {
      console.error('Error saving section:', error);
      alert('Error saving section');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this section?')) return;

    try {
      await aboutAPI.delete(id);
      fetchSections();
      alert('Section deleted successfully!');
    } catch (error) {
      console.error('Error deleting section:', error);
      alert('Error deleting section');
    }
  };

  const addImage = () => {
    setFormData({
      ...formData,
      images: [...formData.images, { image_url: '', title: '', description: '' }]
    });
  };

  const updateImage = (index, field, value) => {
    const newImages = [...formData.images];
    newImages[index] = { ...newImages[index], [field]: value };
    setFormData({ ...formData, images: newImages });
  };

  const removeImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index)
    });
  };

  const addTeamMember = () => {
    setFormData({
      ...formData,
      team_members: [...formData.team_members, { name: '', role: '', image_url: '', portfolio_url: '#' }]
    });
  };

  const updateTeamMember = (index, field, value) => {
    const newMembers = [...formData.team_members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setFormData({ ...formData, team_members: newMembers });
  };

  const removeTeamMember = (index) => {
    setFormData({
      ...formData,
      team_members: formData.team_members.filter((_, i) => i !== index)
    });
  };

  const addCompanyLogo = () => {
    setFormData({
      ...formData,
      company_logos: [...formData.company_logos, { company_name: '', logo_url: '', industry: '', icon_name: '' }]
    });
  };

  const updateCompanyLogo = (index, field, value) => {
    const newLogos = [...formData.company_logos];
    newLogos[index] = { ...newLogos[index], [field]: value };
    setFormData({ ...formData, company_logos: newLogos });
  };

  const removeCompanyLogo = (index) => {
    setFormData({
      ...formData,
      company_logos: formData.company_logos.filter((_, i) => i !== index)
    });
  };

  const handleFileUpload = async (file, type, index) => {
    if (!file) return;

    setUploadingIndex({ type, index });
    try {
      const response = await uploadAPI.uploadImage(file);
      // The server returns /uploads/filename, we need to construct the full URL
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const imageUrl = response.data.url.startsWith('http') 
        ? response.data.url 
        : `${baseUrl}${response.data.url}`;
      
      if (type === 'image') {
        updateImage(index, 'image_url', imageUrl);
      } else if (type === 'team') {
        updateTeamMember(index, 'image_url', imageUrl);
      } else if (type === 'logo') {
        updateCompanyLogo(index, 'logo_url', imageUrl);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error uploading image. Please try again.');
    } finally {
      setUploadingIndex({ type: null, index: null });
    }
  };

  const handleFileSelect = (e, type, index) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file, type, index);
    }
    // Reset input
    e.target.value = '';
  };

  const filteredSections = sections.filter(section => {
    const sectionType = sectionTypes.find(st => st.value === section.section_type);
    const sectionLabel = sectionType ? sectionType.label : '';
    return section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           section.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
           sectionLabel.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getSectionIcon = (type) => {
    const sectionType = sectionTypes.find(st => st.value === type);
    return sectionType ? sectionType.icon : FileText;
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'}`}>
      {/* Gradient Background Effects */}
      <div className={`fixed inset-0 pointer-events-none ${
        theme === 'dark' 
          ? 'bg-[radial-gradient(circle_at_top_right,_rgba(0,240,255,0.15),transparent_50%),radial-gradient(circle_at_bottom_left,_rgba(0,232,129,0.10),transparent_60%)]'
          : 'bg-[radial-gradient(circle_at_top,_rgba(235,50,50,0.20),rgba(255,255,255,0.8)_50%)]'
      }`} />
      <header className={`sticky top-0 z-50 border-b backdrop-blur-xl ${
        theme === 'dark' ? 'border-electric-blue/20 bg-dark-card/90 shadow-lg shadow-black/20' : 'border-gray-200/50 bg-white/90 shadow-md shadow-gray-200/20'
      }`}>
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg ${
                theme === 'dark'
                  ? 'from-electric-blue to-electric-green shadow-electric-blue/40'
                  : 'from-accent-red to-accent-blue shadow-accent-red/40'
              }`}>
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className={`text-xs font-bold uppercase tracking-[0.25em] ${
                  theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                }`}>
                  NanoFlows Academy
                </p>
                <h1 className={`text-xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                  About Sections Management
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-xl transition-all ${
                  theme === 'dark'
                    ? 'bg-dark-lighter hover:bg-gray-800 text-electric-blue'
                    : 'bg-gray-100 hover:bg-gray-200 text-accent-red'
                }`}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to="/academy/admin"
                  className={`inline-flex items-center gap-0 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 border-2 ${
                    theme === 'dark'
                      ? 'bg-transparent border-electric-blue/50 text-electric-blue hover:bg-electric-blue hover:text-black hover:border-electric-blue hover:shadow-lg hover:shadow-electric-blue/30'
                      : 'bg-transparent border-accent-red/50 text-accent-red hover:bg-accent-red hover:text-white hover:border-accent-red hover:shadow-lg hover:shadow-accent-red/30'
                  }`}
                >
                  <FiArrowLeft size={18} />
                  <span className="ml-1">Back</span>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className={`text-2xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
              Manage About Sections
            </h2>
            <p className={`text-sm mt-1 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-900'
            }`}>
              Edit content for Mission, Team, Vision, Growth, and Clients sections
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className={`relative flex-1 sm:flex-initial ${
              theme === 'dark' ? 'bg-dark-lighter' : 'bg-white'
            } rounded-xl border ${
              theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
            }`}>
              <FiSearch className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-800'
              }`} size={18} />
              <input
                type="text"
                placeholder="Search sections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full sm:w-64 pl-10 pr-4 py-2.5 rounded-xl bg-transparent border-0 focus:outline-none ${
                  theme === 'dark' ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'
                }`}
              />
            </div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <button
                onClick={() => {
                  setEditingSection(null);
                  setShowModal(true);
                  setFormData({
                    section_type: '',
                    title: '',
                    content: '',
                    icon_name: '',
                    order_index: 0,
                    active: true,
                    images: [],
                    team_members: [],
                    company_logos: []
                  });
                }}
                className={`inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold transition-all shadow-lg ${
                  theme === 'dark'
                    ? 'bg-electric-green text-black hover:bg-electric-blue shadow-electric-green/20'
                    : 'bg-accent-red text-white hover:bg-accent-blue shadow-accent-red/20'
                }`}
              >
                <FiPlus size={18} />
                Create New Section
              </button>
            </motion.div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className={`inline-block animate-spin rounded-full h-12 w-12 border-4 border-t-transparent ${
              theme === 'dark' ? 'border-electric-blue' : 'border-accent-red'
            }`}></div>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredSections.length === 0 ? (
              <div className={`text-center py-20 rounded-2xl ${
                theme === 'dark' ? 'bg-dark-card' : 'bg-white'
              }`}>
                <p className={`text-lg ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-900'
                }`}>
                  No sections found. Create your first section!
                </p>
              </div>
            ) : (
              filteredSections.map((section) => {
                const Icon = getSectionIcon(section.section_type);
                return (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`rounded-2xl p-6 border transition-all ${
                      theme === 'dark'
                        ? 'bg-dark-card border-gray-800 hover:border-electric-blue/50'
                        : 'bg-white border-gray-200 hover:border-accent-red/50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${
                          theme === 'dark' ? 'bg-electric-blue/20' : 'bg-accent-red/20'
                        }`}>
                          <Icon className={`${
                            theme === 'dark' ? 'text-electric-blue' : 'text-accent-red'
                          }`} size={24} />
                        </div>
                        <div>
                          <h3 className={`text-xl font-bold ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                            {section.title}
                          </h3>
                          <p className={`text-sm ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-900'
                          }`}>
                            {section.section_type.charAt(0).toUpperCase() + section.section_type.slice(1)} Section
                            {section.active ? ' • Active' : ' • Inactive'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(section)}
                          className={`p-2 rounded-lg transition-all ${
                            theme === 'dark'
                              ? 'bg-dark-lighter hover:bg-electric-blue/20 text-electric-blue'
                              : 'bg-gray-100 hover:bg-accent-red/20 text-accent-red'
                          }`}
                        >
                          <FiEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(section.id)}
                          className={`p-2 rounded-lg transition-all ${
                            theme === 'dark'
                              ? 'bg-dark-lighter hover:bg-red-500/20 text-red-400'
                              : 'bg-gray-100 hover:bg-red-500/20 text-red-600'
                          }`}
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </div>
                    <p className={`text-sm mb-4 line-clamp-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-800'
                    }`}>
                      {section.content}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {section.images && section.images.length > 0 && (
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          theme === 'dark' ? 'bg-electric-blue/20 text-electric-blue' : 'bg-accent-red/20 text-accent-red'
                        }`}>
                          {section.images.length} Images
                        </span>
                      )}
                      {section.team_members && section.team_members.length > 0 && (
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          theme === 'dark' ? 'bg-electric-blue/20 text-electric-blue' : 'bg-accent-red/20 text-accent-red'
                        }`}>
                          {section.team_members.length} Team Members
                        </span>
                      )}
                      {section.company_logos && section.company_logos.length > 0 && (
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          theme === 'dark' ? 'bg-electric-blue/20 text-electric-blue' : 'bg-accent-red/20 text-accent-red'
                        }`}>
                          {section.company_logos.length} Company Logos
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        )}

        {/* Create/Edit Modal */}
        <AnimatePresence>
          {showModal && (
            <Modal
              isOpen={showModal}
              onClose={() => {
                setEditingSection(null);
                setShowModal(false);
                setFormData({
                  section_type: '',
                  title: '',
                  content: '',
                  icon_name: '',
                  order_index: 0,
                  active: true,
                  images: [],
                  team_members: [],
                  company_logos: []
                });
              }}
              title={editingSection ? 'Edit Section' : 'Create Section'}
            >
              <div className="space-y-6">
                {/* Section Type */}
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Section Type
                  </label>
                  <select
                    value={formData.section_type}
                    onChange={(e) => setFormData({ ...formData, section_type: e.target.value })}
                    disabled={!!editingSection}
                    className={`w-full px-4 py-2.5 rounded-xl border ${
                      theme === 'dark'
                        ? 'bg-dark-lighter border-gray-800 text-white'
                        : 'bg-white border-gray-200 text-gray-900'
                    } focus:outline-none focus:ring-2 ${
                      theme === 'dark' ? 'focus:ring-electric-blue' : 'focus:ring-accent-red'
                    }`}
                  >
                    <option value="">Select section type</option>
                    {sectionTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Title */}
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-xl border ${
                      theme === 'dark'
                        ? 'bg-dark-lighter border-gray-800 text-white'
                        : 'bg-white border-gray-200 text-gray-900'
                    } focus:outline-none focus:ring-2 ${
                      theme === 'dark' ? 'focus:ring-electric-blue' : 'focus:ring-accent-red'
                    }`}
                    placeholder="Section title"
                  />
                </div>

                {/* Content */}
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Content
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={6}
                    className={`w-full px-4 py-2.5 rounded-xl border ${
                      theme === 'dark'
                        ? 'bg-dark-lighter border-gray-800 text-white'
                        : 'bg-white border-gray-200 text-gray-900'
                    } focus:outline-none focus:ring-2 ${
                      theme === 'dark' ? 'focus:ring-electric-blue' : 'focus:ring-accent-red'
                    }`}
                    placeholder="Section content description"
                  />
                </div>

                {/* Images Section */}
                {formData.section_type && formData.section_type !== 'team' && formData.section_type !== 'clients' && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className={`block text-sm font-semibold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        Images
                      </label>
                      <button
                        onClick={addImage}
                        className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${
                          theme === 'dark'
                            ? 'bg-electric-blue/20 text-electric-blue hover:bg-electric-blue/30'
                            : 'bg-accent-red/20 text-accent-red hover:bg-accent-red/30'
                        }`}
                      >
                        <FiPlus size={16} className="inline mr-1" />
                        Add Image
                      </button>
                    </div>
                    {formData.images.map((image, index) => (
                      <div key={index} className={`mb-3 p-4 rounded-xl border ${
                        theme === 'dark' ? 'bg-dark-lighter border-gray-800' : 'bg-gray-50 border-gray-200'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-sm font-semibold ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            Image {index + 1}
                          </span>
                          <button
                            onClick={() => removeImage(index)}
                            className={`p-1 rounded text-red-500 hover:bg-red-500/20`}
                          >
                            <FiX size={16} />
                          </button>
                        </div>
                        <div className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={image.image_url || image.url || ''}
                            onChange={(e) => updateImage(index, 'image_url', e.target.value)}
                            placeholder="Image URL"
                            className={`flex-1 px-3 py-2 rounded-lg border ${
                              theme === 'dark'
                                ? 'bg-dark-card border-gray-800 text-white'
                                : 'bg-white border-gray-200 text-gray-900'
                            }`}
                          />
                          <input
                            type="file"
                            accept="image/*"
                            ref={(el) => {
                              if (el) fileInputRefs.current[`image-${index}`] = el;
                            }}
                            onChange={(e) => handleFileSelect(e, 'image', index)}
                            className="hidden"
                            id={`image-upload-${index}`}
                          />
                          <label
                            htmlFor={`image-upload-${index}`}
                            className={`px-4 py-2 rounded-lg cursor-pointer transition-all flex items-center gap-2 ${
                              uploadingIndex.type === 'image' && uploadingIndex.index === index
                                ? 'opacity-50 cursor-not-allowed'
                                : theme === 'dark'
                                ? 'bg-electric-blue/20 text-electric-blue hover:bg-electric-blue/30'
                                : 'bg-accent-red/20 text-accent-red hover:bg-accent-red/30'
                            }`}
                          >
                            {uploadingIndex.type === 'image' && uploadingIndex.index === index ? (
                              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <FiUpload size={16} />
                            )}
                            Upload
                          </label>
                        </div>
                        {image.image_url && (
                          <img
                            src={image.image_url || image.url}
                            alt={image.title || 'Preview'}
                            className="w-full h-32 object-cover rounded-lg mb-2"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        )}
                        <input
                          type="text"
                          value={image.title || ''}
                          onChange={(e) => updateImage(index, 'title', e.target.value)}
                          placeholder="Title"
                          className={`w-full mb-2 px-3 py-2 rounded-lg border ${
                            theme === 'dark'
                              ? 'bg-dark-card border-gray-800 text-white'
                              : 'bg-white border-gray-200 text-gray-900'
                          }`}
                        />
                        <input
                          type="text"
                          value={image.description || ''}
                          onChange={(e) => updateImage(index, 'description', e.target.value)}
                          placeholder="Description"
                          className={`w-full px-3 py-2 rounded-lg border ${
                            theme === 'dark'
                              ? 'bg-dark-card border-gray-800 text-white'
                              : 'bg-white border-gray-200 text-gray-900'
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Team Members Section */}
                {formData.section_type === 'team' && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className={`block text-sm font-semibold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        Team Members
                      </label>
                      <button
                        onClick={addTeamMember}
                        className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${
                          theme === 'dark'
                            ? 'bg-electric-blue/20 text-electric-blue hover:bg-electric-blue/30'
                            : 'bg-accent-red/20 text-accent-red hover:bg-accent-red/30'
                        }`}
                      >
                        <FiPlus size={16} className="inline mr-1" />
                        Add Member
                      </button>
                    </div>
                    {formData.team_members.map((member, index) => (
                      <div key={index} className={`mb-3 p-4 rounded-xl border ${
                        theme === 'dark' ? 'bg-dark-lighter border-gray-800' : 'bg-gray-50 border-gray-200'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-sm font-semibold ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            Member {index + 1}
                          </span>
                          <button
                            onClick={() => removeTeamMember(index)}
                            className={`p-1 rounded text-red-500 hover:bg-red-500/20`}
                          >
                            <FiX size={16} />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={member.name || ''}
                          onChange={(e) => updateTeamMember(index, 'name', e.target.value)}
                          placeholder="Name"
                          className={`w-full mb-2 px-3 py-2 rounded-lg border ${
                            theme === 'dark'
                              ? 'bg-dark-card border-gray-800 text-white'
                              : 'bg-white border-gray-200 text-gray-900'
                          }`}
                        />
                        <input
                          type="text"
                          value={member.role || ''}
                          onChange={(e) => updateTeamMember(index, 'role', e.target.value)}
                          placeholder="Role"
                          className={`w-full mb-2 px-3 py-2 rounded-lg border ${
                            theme === 'dark'
                              ? 'bg-dark-card border-gray-800 text-white'
                              : 'bg-white border-gray-200 text-gray-900'
                          }`}
                        />
                        <div className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={member.image_url || member.url || ''}
                            onChange={(e) => updateTeamMember(index, 'image_url', e.target.value)}
                            placeholder="Image URL"
                            className={`flex-1 px-3 py-2 rounded-lg border ${
                              theme === 'dark'
                                ? 'bg-dark-card border-gray-800 text-white'
                                : 'bg-white border-gray-200 text-gray-900'
                            }`}
                          />
                          <input
                            type="file"
                            accept="image/*"
                            ref={(el) => {
                              if (el) fileInputRefs.current[`team-${index}`] = el;
                            }}
                            onChange={(e) => handleFileSelect(e, 'team', index)}
                            className="hidden"
                            id={`team-upload-${index}`}
                          />
                          <label
                            htmlFor={`team-upload-${index}`}
                            className={`px-4 py-2 rounded-lg cursor-pointer transition-all flex items-center gap-2 ${
                              uploadingIndex.type === 'team' && uploadingIndex.index === index
                                ? 'opacity-50 cursor-not-allowed'
                                : theme === 'dark'
                                ? 'bg-electric-blue/20 text-electric-blue hover:bg-electric-blue/30'
                                : 'bg-accent-red/20 text-accent-red hover:bg-accent-red/30'
                            }`}
                          >
                            {uploadingIndex.type === 'team' && uploadingIndex.index === index ? (
                              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <FiUpload size={16} />
                            )}
                            Upload
                          </label>
                        </div>
                        {member.image_url && (
                          <img
                            src={member.image_url || member.url}
                            alt={member.name || 'Preview'}
                            className="w-full h-32 object-cover rounded-lg mb-2"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        )}
                        <input
                          type="text"
                          value={member.portfolio_url || member.portfolio || ''}
                          onChange={(e) => updateTeamMember(index, 'portfolio_url', e.target.value)}
                          placeholder="Portfolio URL"
                          className={`w-full px-3 py-2 rounded-lg border ${
                            theme === 'dark'
                              ? 'bg-dark-card border-gray-800 text-white'
                              : 'bg-white border-gray-200 text-gray-900'
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Company Logos Section */}
                {formData.section_type === 'clients' && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className={`block text-sm font-semibold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        Company Logos
                      </label>
                      <button
                        onClick={addCompanyLogo}
                        className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${
                          theme === 'dark'
                            ? 'bg-electric-blue/20 text-electric-blue hover:bg-electric-blue/30'
                            : 'bg-accent-red/20 text-accent-red hover:bg-accent-red/30'
                        }`}
                      >
                        <FiPlus size={16} className="inline mr-1" />
                        Add Logo
                      </button>
                    </div>
                    {formData.company_logos.map((logo, index) => (
                      <div key={index} className={`mb-3 p-4 rounded-xl border ${
                        theme === 'dark' ? 'bg-dark-lighter border-gray-800' : 'bg-gray-50 border-gray-200'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-sm font-semibold ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            Logo {index + 1}
                          </span>
                          <button
                            onClick={() => removeCompanyLogo(index)}
                            className={`p-1 rounded text-red-500 hover:bg-red-500/20`}
                          >
                            <FiX size={16} />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={logo.company_name || logo.name || ''}
                          onChange={(e) => updateCompanyLogo(index, 'company_name', e.target.value)}
                          placeholder="Company Name"
                          className={`w-full mb-2 px-3 py-2 rounded-lg border ${
                            theme === 'dark'
                              ? 'bg-dark-card border-gray-800 text-white'
                              : 'bg-white border-gray-200 text-gray-900'
                          }`}
                        />
                        <div className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={logo.logo_url || logo.logo || ''}
                            onChange={(e) => updateCompanyLogo(index, 'logo_url', e.target.value)}
                            placeholder="Logo URL"
                            className={`flex-1 px-3 py-2 rounded-lg border ${
                              theme === 'dark'
                                ? 'bg-dark-card border-gray-800 text-white'
                                : 'bg-white border-gray-200 text-gray-900'
                            }`}
                          />
                          <input
                            type="file"
                            accept="image/*"
                            ref={(el) => {
                              if (el) fileInputRefs.current[`logo-${index}`] = el;
                            }}
                            onChange={(e) => handleFileSelect(e, 'logo', index)}
                            className="hidden"
                            id={`logo-upload-${index}`}
                          />
                          <label
                            htmlFor={`logo-upload-${index}`}
                            className={`px-4 py-2 rounded-lg cursor-pointer transition-all flex items-center gap-2 ${
                              uploadingIndex.type === 'logo' && uploadingIndex.index === index
                                ? 'opacity-50 cursor-not-allowed'
                                : theme === 'dark'
                                ? 'bg-electric-blue/20 text-electric-blue hover:bg-electric-blue/30'
                                : 'bg-accent-red/20 text-accent-red hover:bg-accent-red/30'
                            }`}
                          >
                            {uploadingIndex.type === 'logo' && uploadingIndex.index === index ? (
                              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <FiUpload size={16} />
                            )}
                            Upload
                          </label>
                        </div>
                        {logo.logo_url && (
                          <img
                            src={logo.logo_url || logo.logo}
                            alt={logo.company_name || logo.name || 'Preview'}
                            className="w-full h-20 object-contain rounded-lg mb-2 bg-gray-100 dark:bg-gray-800 p-2"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        )}
                        <input
                          type="text"
                          value={logo.industry || ''}
                          onChange={(e) => updateCompanyLogo(index, 'industry', e.target.value)}
                          placeholder="Industry"
                          className={`w-full px-3 py-2 rounded-lg border ${
                            theme === 'dark'
                              ? 'bg-dark-card border-gray-800 text-white'
                              : 'bg-white border-gray-200 text-gray-900'
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Active Toggle */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="w-5 h-5 rounded"
                  />
                  <label className={`text-sm font-semibold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Active (visible on website)
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1"
                  >
                    <button
                      onClick={handleSave}
                      className={`w-full inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold transition-all shadow-lg ${
                        theme === 'dark'
                          ? 'bg-electric-green text-black hover:bg-electric-blue shadow-electric-green/20'
                          : 'bg-accent-red text-white hover:bg-accent-blue shadow-accent-red/20'
                      }`}
                    >
                      <FiSave size={18} />
                      Save Section
                    </button>
                  </motion.div>
                  <button
                    onClick={() => {
                      setEditingSection(null);
                      setShowModal(false);
                      setFormData({
                        section_type: '',
                        title: '',
                        content: '',
                        icon_name: '',
                        order_index: 0,
                        active: true,
                        images: [],
                        team_members: [],
                        company_logos: []
                      });
                    }}
                    className={`px-6 py-3 rounded-xl font-semibold border-2 transition-all ${
                      theme === 'dark'
                        ? 'border-gray-700 text-gray-300 hover:bg-gray-800'
                        : 'border-gray-300 text-gray-800 hover:bg-gray-100'
                    }`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </Modal>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AdminAboutManagement;

