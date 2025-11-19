import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { coursesAPI, purchasesAPI } from '../../utils/api';
import { FiArrowLeft, FiDownload, FiCheckCircle } from 'react-icons/fi';

const CoursePlayer = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [videos, setVideos] = useState([]);
  const [resources, setResources] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [isPurchased, setIsPurchased] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAccess();
  }, [id]);

  const checkAccess = async () => {
    try {
      const purchaseResponse = await purchasesAPI.checkPurchase(id);
      
      if (!purchaseResponse.data.purchased) {
        navigate(`/academy/course/${id}`);
        return;
      }

      setIsPurchased(true);
      const response = await coursesAPI.getById(id);
      setCourse(response.data.course);
      setVideos(response.data.videos);
      setResources(response.data.resources);
      
      if (response.data.videos.length > 0) {
        setCurrentVideo(response.data.videos[0]);
      }
    } catch (error) {
      console.error('Error:', error);
      navigate('/academy/dashboard?tab=courses');
    } finally {
      setLoading(false);
    }
  };

  const getEmbedUrl = (url) => {
    if (!url) return '';
    
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
              to="/academy/dashboard"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FiArrowLeft size={24} />
            </Link>
            <h1 className="text-xl font-bold text-white">{course?.title}</h1>
          </div>
        </div>
      </nav>

      <div className="flex flex-col lg:flex-row h-[calc(100vh-73px)]">
        <div className="lg:w-2/3 bg-black flex items-center justify-center">
          {currentVideo ? (
            <div className="w-full aspect-video">
              <iframe
                src={getEmbedUrl(currentVideo.video_url)}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={currentVideo.title}
              />
            </div>
          ) : (
            <div className="text-gray-400 text-xl">No video selected</div>
          )}
        </div>

        <div className="lg:w-1/3 bg-gray-800 overflow-y-auto">
          <div className="p-6">
            <h2 className="text-xl font-bold text-white mb-4">Course Content</h2>
            
            <div className="space-y-2 mb-8">
              {videos.map((video, index) => (
                <button
                  key={video.id}
                  onClick={() => setCurrentVideo(video)}
                  className={`w-full text-left p-4 rounded-lg transition-all ${
                    currentVideo?.id === video.id
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      {currentVideo?.id === video.id ? (
                        <FiCheckCircle className="text-white mt-1" />
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-gray-500 flex items-center justify-center text-xs mt-1">
                          {index + 1}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{video.title}</div>
                      {video.description && (
                        <div className="text-sm opacity-80 mt-1">{video.description}</div>
                      )}
                      <div className="text-sm opacity-60 mt-1">{video.duration}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {resources.length > 0 && (
              <>
                <h2 className="text-xl font-bold text-white mb-4">Resources</h2>
                <div className="space-y-2">
                  {resources.map(resource => (
                    <a
                      key={resource.id}
                      href={resource.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-white"
                    >
                      <div>
                        <div className="font-semibold">{resource.title}</div>
                        <div className="text-sm text-gray-400">{resource.file_type.toUpperCase()}</div>
                      </div>
                      <FiDownload className="text-gray-400" />
                    </a>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePlayer;
