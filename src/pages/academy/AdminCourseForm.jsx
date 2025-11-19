import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { coursesAPI, videosAPI, uploadAPI } from '../../utils/api';
import { useTheme } from '../../context/ThemeContext';
import { FiArrowLeft, FiPlus, FiTrash2, FiSave, FiFileText, FiUpload, FiImage, FiX } from 'react-icons/fi';
import { motion } from 'framer-motion';

const AdminCourseForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    short_description: '',
    price: '',
    category: '',
    thumbnail: '',
    promotional_video: '',
    instructor_name: '',
    published: false,
    free: false
  });

  const [videos, setVideos] = useState([]);
  const [newVideo, setNewVideo] = useState({
    title: '',
    description: '',
    video_url: '',
    duration: '0:00',
    order_index: 0
  });

  const [resources, setResources] = useState([]);
  const [newResource, setNewResource] = useState({
    title: '',
    file_url: '',
    file_type: 'pdf'
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingResource, setUploadingResource] = useState(false);

  const categories = ['Web Development', 'Backend Development', 'Data Science', 'Mobile Development', 'DevOps', 'AI & ML'];

  useEffect(() => {
    if (isEdit) {
      fetchCourse();
    }
  }, [id]);

  const fetchCourse = async () => {
    setLoading(true);
    try {
      const response = await coursesAPI.getById(id);
      setFormData({
        title: response.data.course.title,
        description: response.data.course.description,
        short_description: response.data.course.short_description || '',
        price: response.data.course.price,
        category: response.data.course.category,
        instructor_name: response.data.course.instructor_name || '',
        thumbnail: response.data.course.thumbnail || '',
        promotional_video: response.data.course.promotional_video || '',
        published: response.data.course.published,
        free: response.data.course.free || false
      });
      setVideos(response.data.videos || []);
      setResources(response.data.resources || []);
      // Set thumbnail preview if thumbnail exists
      if (response.data.course.thumbnail) {
        setThumbnailPreview(response.data.course.thumbnail);
      }
    } catch (error) {
      console.error('Error fetching course:', error);
      alert('Error loading course');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Ensure instructor_name is always included in the payload
      // Send the exact value from formData, even if it's an empty string
      const submitData = {
        ...formData,
        instructor_name: formData.instructor_name || '' // Always send a string, never null/undefined
      };
      
      console.log('=== COURSE UPDATE DEBUG ===');
      console.log('Full formData:', formData);
      console.log('Instructor name from formData:', formData.instructor_name);
      console.log('Instructor name type:', typeof formData.instructor_name);
      console.log('SubmitData instructor_name:', submitData.instructor_name);
      console.log('SubmitData instructor_name type:', typeof submitData.instructor_name);
      console.log('Full submitData:', JSON.stringify(submitData, null, 2));
      
      if (isEdit) {
        const response = await coursesAPI.update(id, submitData);
        console.log('Update response:', response.data); // Debug log
        const message = formData.published 
          ? 'Course updated and published successfully! It is now visible to students.'
          : 'Course updated successfully! (Currently unpublished - students cannot see it)';
        alert(message);
        // Refresh the course data to show updated instructor name
        fetchCourse();
      } else {
        const response = await coursesAPI.create(submitData);
        const message = response.data.note || 
          (formData.published 
            ? 'Course created and published successfully! It is now visible to students.'
            : 'Course created successfully! (Currently unpublished - check "Publish course" to make it visible)');
        alert(message);
        navigate(`/academy/admin/edit-course/${response.data.course.id}`);
      }
    } catch (error) {
      console.error('Error saving course:', error);
      alert(error.response?.data?.error || 'Error saving course');
    } finally {
      setSaving(false);
    }
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploadingVideo(true);
    try {
      const response = await uploadAPI.uploadVideo(file);
      setNewVideo({ ...newVideo, video_url: response.data.url });
      alert('Video uploaded successfully!');
    } catch (error) {
      alert('Error uploading video: ' + (error.response?.data?.error || error.message));
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleAddVideo = async () => {
    if (!newVideo.title || !newVideo.video_url) {
      alert('Please fill in video title and URL or upload a video file');
      return;
    }

    if (!id) {
      alert('Please save the course first before adding videos');
      return;
    }

    try {
      const response = await videosAPI.add({
        course_id: id, // Keep as string/UUID, don't parse
        ...newVideo
      });
      setNewVideo({ title: '', description: '', video_url: '', duration: '0:00', order_index: videos.length });
      fetchCourse();
      alert('Video added successfully!');
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Error adding video';
      const suggestion = error.response?.data?.suggestion;
      alert(`${errorMessage}${suggestion ? '\n\n' + suggestion : ''}`);
      console.error('Error adding video:', error);
    }
  };

  const handleDeleteVideo = async (videoId) => {
    if (!confirm('Delete this video?')) return;

    try {
      await videosAPI.delete(videoId);
      fetchCourse();
    } catch (error) {
      alert('Error deleting video');
    }
  };

  const handleResourceUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploadingResource(true);
    try {
      const response = await uploadAPI.uploadResource(file);
      setNewResource({ 
        ...newResource, 
        file_url: response.data.url,
        file_type: response.data.file_type || 'pdf'
      });
      alert('Resource uploaded successfully!');
    } catch (error) {
      alert('Error uploading resource: ' + (error.response?.data?.error || error.message));
    } finally {
      setUploadingResource(false);
    }
  };

  const handleAddResource = async () => {
    if (!newResource.title || !newResource.file_url) {
      alert('Please fill in resource title and URL or upload a file');
      return;
    }

    if (!id) {
      alert('Please save the course first before adding resources');
      return;
    }

    try {
      const response = await videosAPI.addResource({
        course_id: id, // Keep as string/UUID, don't parse
        ...newResource
      });
      setNewResource({ title: '', file_url: '', file_type: 'pdf' });
      fetchCourse();
      alert('Resource added successfully!');
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Error adding resource';
      const suggestion = error.response?.data?.suggestion;
      alert(`${errorMessage}${suggestion ? '\n\n' + suggestion : ''}`);
      console.error('Error adding resource:', error);
    }
  };

  const handleDeleteResource = async (resourceId) => {
    if (!confirm('Delete this resource?')) return;

    try {
      await videosAPI.deleteResource(resourceId);
      fetchCourse();
    } catch (error) {
      alert('Error deleting resource');
    }
  };

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setUploadingThumbnail(true);
    try {
      const response = await uploadAPI.uploadThumbnail(file);
      
      // Get full URL (if local, prepend API URL)
      let imageUrl = response.data.url;
      if (imageUrl.startsWith('/uploads/')) {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        imageUrl = `${apiUrl}${imageUrl}`;
      }
      
      setFormData({ ...formData, thumbnail: imageUrl });
      setThumbnailPreview(imageUrl);
      alert('Thumbnail uploaded successfully!');
    } catch (error) {
      console.error('Error uploading thumbnail:', error);
      alert(error.response?.data?.error || 'Error uploading thumbnail. Please try again.');
    } finally {
      setUploadingThumbnail(false);
      // Reset file input
      e.target.value = '';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              to="/academy/admin"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FiArrowLeft size={24} />
            </Link>
            <h1 className="text-xl font-bold text-white">
              {isEdit ? 'Edit Course' : 'Create New Course'}
            </h1>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Course Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-gray-300 mb-2 font-medium">Course Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                placeholder="e.g., Complete React Development Course"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-300 mb-2 font-medium">Short Description</label>
              <textarea
                value={formData.short_description}
                onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                rows="2"
                placeholder="Brief description (100-200 characters) - shown in course listings..."
                maxLength={200}
              />
              <p className="mt-1 text-xs text-gray-400">
                {formData.short_description.length}/200 characters
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-300 mb-2 font-medium">Full Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                rows="4"
                placeholder="Detailed description - describe what students will learn..."
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2 font-medium">Price (₹)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => {
                  const price = e.target.value;
                  setFormData({ 
                    ...formData, 
                    price: price,
                    // Auto-set free to true if price is 0 or empty
                    free: price === '' || parseFloat(price) === 0 ? true : formData.free
                  });
                }}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                placeholder="2999"
                required={!formData.free}
                disabled={formData.free}
              />
              {formData.free && (
                <p className="mt-1 text-xs text-emerald-400">
                  Course is free - price is not required
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-300 mb-2 font-medium">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                required
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-300 mb-2 font-medium">Instructor Name</label>
              <input
                type="text"
                value={formData.instructor_name}
                onChange={(e) => setFormData({ ...formData, instructor_name: e.target.value })}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                placeholder="e.g., John Doe, Dr. Jane Smith"
              />
              <p className="mt-1 text-xs text-gray-400">
                This name will be displayed to students for all course videos
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-300 mb-2 font-medium">Course Thumbnail</label>
              
              {/* Image Preview */}
              {(formData.thumbnail || thumbnailPreview) && (
                <div className="mb-4 relative">
                  <img
                    src={thumbnailPreview || formData.thumbnail}
                    alt="Thumbnail preview"
                    className="w-full h-48 object-cover rounded-lg border-2 border-gray-600"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      if (e.target.nextSibling) {
                        e.target.nextSibling.style.display = 'flex';
                      }
                    }}
                  />
                  <div className="hidden w-full h-48 items-center justify-center bg-gray-800 rounded-lg border-2 border-gray-600 border-dashed">
                    <div className="text-center">
                      <FiImage className="mx-auto text-gray-500 mb-2" size={32} />
                      <p className="text-gray-400 text-sm">Image failed to load</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, thumbnail: '' });
                      setThumbnailPreview('');
                    }}
                    className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 rounded-full text-white"
                    title="Remove image"
                  >
                    <FiX size={16} />
                  </button>
                </div>
              )}

              {/* Upload Option */}
              <div className="flex gap-3 mb-3">
                <label className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed cursor-pointer transition-all ${
                  theme === 'dark'
                    ? 'border-gray-600 hover:border-electric-green bg-gray-800 hover:bg-gray-700'
                    : 'border-gray-300 hover:border-accent-red bg-gray-50 hover:bg-gray-100'
                } ${uploadingThumbnail ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                    disabled={uploadingThumbnail}
                    className="hidden"
                  />
                  {uploadingThumbnail ? (
                    <>
                      <div className={`h-5 w-5 animate-spin rounded-full border-2 ${
                        theme === 'dark' ? 'border-electric-green/20 border-t-electric-green' : 'border-accent-red/20 border-t-accent-red'
                      }`} />
                      <span className="text-sm font-medium">Uploading...</span>
                    </>
                  ) : (
                    <>
                      <FiUpload size={18} />
                      <span className="text-sm font-medium">Upload Image</span>
                    </>
                  )}
                </label>
              </div>

              {/* URL Input */}
              <div className="relative">
                <input
                  type="url"
                  value={formData.thumbnail}
                  onChange={(e) => {
                    setFormData({ ...formData, thumbnail: e.target.value });
                    if (e.target.value) {
                      setThumbnailPreview(e.target.value);
                    }
                  }}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                  placeholder="Or paste image URL here (e.g., https://images.unsplash.com/...)"
                />
                <p className="mt-1 text-xs text-gray-400">
                  Upload an image file or paste a direct image URL
                </p>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-300 mb-2 font-medium">Promotional Video URL (optional)</label>
              <input
                type="url"
                value={formData.promotional_video}
                onChange={(e) => setFormData({ ...formData, promotional_video: e.target.value })}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                placeholder="https://youtube.com/... or Google Drive link"
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-gray-300 mb-4">
                <input
                  type="checkbox"
                  checked={formData.free}
                  onChange={(e) => {
                    const isFree = e.target.checked;
                    setFormData({ 
                      ...formData, 
                      free: isFree,
                      // If marking as free, set price to 0
                      price: isFree ? '0' : formData.price
                    });
                  }}
                  className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-emerald-500 focus:ring-emerald-500"
                />
                <span className="font-medium">Free Course (users can access without purchase)</span>
              </label>
              <p className="text-xs text-gray-400 mb-4 ml-7">
                If checked, students can enroll and access this course without payment
              </p>
              <label className="flex items-center gap-2 text-gray-300">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-emerald-500 focus:ring-emerald-500"
                />
                <span className="font-medium">Publish course (make visible to students)</span>
              </label>
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <button
                type="submit"
                disabled={saving}
                className={`inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                  theme === 'dark'
                    ? 'bg-electric-green text-black hover:bg-electric-blue shadow-electric-green/20'
                    : 'bg-accent-red text-white hover:bg-accent-blue shadow-accent-red/20'
                }`}
              >
                <FiSave size={18} />
                {saving ? 'Saving...' : (isEdit ? 'Update Course' : 'Create Course')}
              </button>
            </motion.div>
            {isEdit && (
              <Link
                to={`/academy/admin/course/${id}/content`}
                className={`inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold transition-all shadow-lg ${
                  theme === 'dark'
                    ? 'bg-electric-blue text-black hover:bg-electric-green shadow-electric-blue/20'
                    : 'bg-accent-blue text-white hover:bg-accent-red shadow-accent-blue/20'
                }`}
              >
                <FiFileText size={18} />
                Manage Content
              </Link>
            )}
            <Link
              to="/academy/admin"
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                theme === 'dark'
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              Cancel
            </Link>
          </div>
        </form>

      </div>
    </div>
  );
};

export default AdminCourseForm;
