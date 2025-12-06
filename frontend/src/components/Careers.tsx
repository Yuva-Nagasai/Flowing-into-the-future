import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { jobsAPI } from '../utils/api';
import { Briefcase, MapPin, Clock, ArrowRight, X, Send } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
}

const fallbackJobs: Job[] = [
  {
    id: 'senior-ai-product-manager',
    title: 'Senior AI Product Manager',
    department: 'Product',
    location: 'Remote, Global',
    type: 'Full-time',
    description:
      'Own the roadmap for our adaptive learning copilot, partner with engineering and pedagogy teams, and ship features that serve 1M+ monthly learners.',
    requirements: [
      '7+ years in product or program management',
      'Expertise launching AI/ML powered experiences',
      'Comfort leading cross-functional discovery workshops'
    ]
  },
  {
    id: 'principal-frontend-engineer',
    title: 'Principal Frontend Engineer',
    department: 'Engineering',
    location: 'Austin, TX or Remote (US)',
    type: 'Hybrid',
    description:
      'Architect the design system, mentor React engineers, and optimize our Vite + Tailwind stack for sub-second learning experiences.',
    requirements: [
      'Deep React/TypeScript knowledge with performance tuning stories',
      'Experience shipping design systems at scale',
      'Passion for DX tooling and automated testing'
    ]
  },
  {
    id: 'learning-strategist-emea',
    title: 'Learning Strategist, EMEA',
    department: 'Learning Experience',
    location: 'London, UK',
    type: 'Full-time',
    description:
      'Translate enterprise upskilling goals into measurable learning journeys, and support customer pilots across Europe.',
    requirements: [
      'Background in instructional design or L&D consulting',
      'Comfort facilitating executive workshops',
      'Strong data storytelling and stakeholder alignment skills'
    ]
  }
];

const Careers = () => {
  const { theme } = useTheme();
  const [jobOpenings, setJobOpenings] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    coverLetter: ''
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await jobsAPI.getAll({ active: 'true' });
      const jobs = response.data.jobs;
      setJobOpenings(jobs && jobs.length > 0 ? jobs : fallbackJobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      // Fallback to sample listings if API fails
      setJobOpenings(fallbackJobs);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenApplication = (jobId: string) => {
    setSelectedJob(jobId);
    setFormData({ name: '', email: '', phone: '', coverLetter: '' });
    setResumeFile(null);
    setIsSubmitted(false);
  };

  const handleCloseApplication = () => {
    setSelectedJob(null);
    setIsSubmitting(false);
    setIsSubmitted(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setTimeout(() => {
        handleCloseApplication();
      }, 2000);
    }, 1500);
  };


  return (
    <section
      id="careers"
      className={`relative pt-4 md:pt-6 pb-20 overflow-hidden scroll-mt-24 lg:scroll-mt-32 ${
        theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'
      }`}
    >
      <div className={`absolute inset-0 ${theme === 'dark' ? 'gradient-mesh' : 'gradient-mesh-light'}`} />
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2
            className={`text-4xl md:text-5xl font-bold mb-4 font-orbitron ${
              theme === 'dark' ? 'text-white' : 'text-black'
            }`}
          >
            Join Our{' '}
            <span className={theme === 'dark' ? 'text-electric-green' : 'text-accent-red'}>
              Team
            </span>
          </h2>
          <p
            className={`text-lg font-exo max-w-2xl mx-auto ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-800'
            }`}
          >
            Be part of a mission to revolutionize education and empower learners worldwide.
            Explore exciting opportunities to grow your career with NanoFlows.
          </p>
        </motion.div>

        {loading ? (
          <div className={`flex items-center justify-center py-20 rounded-xl border-2 ${
            theme === 'dark'
              ? 'bg-dark-lighter border-gray-700'
              : 'bg-white border-gray-200'
          }`}>
            <div className={`text-lg ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
            }`}>Loading job openings...</div>
          </div>
        ) : jobOpenings.length === 0 ? (
          <div className={`text-center py-20 rounded-xl border-2 ${
            theme === 'dark'
              ? 'bg-dark-lighter border-gray-700'
              : 'bg-white border-gray-200'
          }`}>
            <Briefcase className={`h-16 w-16 mx-auto mb-4 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-900'
            }`} />
            <h3 className={`text-2xl font-bold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>No Open Positions</h3>
            <p className={`text-base ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
            }`}>
              We're not currently hiring, but check back soon for new opportunities!
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobOpenings.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`group relative flex flex-col h-full rounded-2xl p-6 transition-all duration-300 hover:scale-105 ${
                theme === 'dark'
                  ? 'bg-dark-bg/50 border border-electric-blue/20 hover:border-electric-blue/50 hover:glow-blue'
                  : 'bg-gray-50/80 shadow-lg hover:shadow-2xl hover:glow-red'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`p-3 rounded-xl transition-transform duration-300 group-hover:scale-110 ${
                    theme === 'dark'
                      ? 'bg-electric-blue/20 text-electric-blue group-hover:bg-electric-blue group-hover:text-black'
                      : 'bg-accent-red/20 text-accent-red group-hover:bg-accent-red group-hover:text-white'
                  }`}
                >
                  <Briefcase size={24} />
                </div>
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    theme === 'dark'
                      ? 'bg-electric-green/20 text-electric-green'
                      : 'bg-accent-blue/20 text-accent-blue'
                  }`}
                >
                  {job.department}
                </span>
              </div>

              <h3
                className={`text-xl font-bold mb-3 font-orbitron ${
                  theme === 'dark' ? 'text-white' : 'text-black'
                }`}
              >
                {job.title}
              </h3>

              <div className="flex flex-wrap gap-3 mb-4">
                <div className={`flex items-center gap-1 text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                  <MapPin size={16} />
                  <span>{job.location}</span>
                </div>
                <div className={`flex items-center gap-1 text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                  <Clock size={16} />
                  <span>{job.type}</span>
                </div>
              </div>

              <p className={`text-sm font-exo mb-4 leading-relaxed flex-grow ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>
                {job.description}
              </p>

              <div className="mb-4 flex-grow">
                <p className={`text-xs font-semibold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                  Requirements:
                </p>
                <ul className="space-y-1">
                  {job.requirements.map((req, idx) => (
                    <li
                      key={idx}
                      className={`text-xs font-exo flex items-center gap-2 ${
                        theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          theme === 'dark' ? 'bg-electric-green' : 'bg-accent-blue'
                        }`}
                      />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handleOpenApplication(job.id)}
                className={`group/btn flex items-center justify-center gap-2 w-full py-3 px-4 rounded-lg font-exo font-semibold text-sm transition-colors duration-300 ${
                  theme === 'dark'
                    ? 'bg-dark-lighter text-electric-blue border border-electric-blue/30 hover:bg-electric-blue hover:text-black'
                    : 'bg-white text-accent-red border border-accent-red/30 hover:bg-accent-red hover:text-white'
                }`}
              >
                Apply Now
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover/btn:translate-x-1"
                />
              </button>
            </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Application Modal */}
      <AnimatePresence>
        {selectedJob !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseApplication}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`relative w-full max-w-2xl rounded-2xl p-8 ${
                theme === 'dark'
                  ? 'bg-dark-card border border-electric-blue/30'
                  : 'bg-white shadow-2xl'
              }`}
            >
              <button
                onClick={handleCloseApplication}
                className={`absolute top-4 right-4 p-2 rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'hover:bg-electric-blue/20 text-gray-300 hover:text-white'
                    : 'hover:bg-gray-100 text-gray-800 hover:text-gray-900'
                }`}
              >
                <X size={24} />
              </button>

              <h3
                className={`text-2xl md:text-3xl font-bold font-orbitron mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-black'
                }`}
              >
                Apply for{' '}
                <span className={theme === 'dark' ? 'text-electric-green' : 'text-accent-red'}>
                  {jobOpenings.find(job => job.id === selectedJob)?.title || ''}
                </span>
              </h3>

              <p className={`text-sm font-exo mb-6 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                Complete the application form below and we'll get back to you soon.
              </p>

              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className={`text-5xl mb-4`}>✅</div>
                  <h4 className={`text-2xl font-bold font-orbitron mb-2 ${theme === 'dark' ? 'text-electric-green' : 'text-green-600'}`}>
                    Application Submitted!
                  </h4>
                  <p className={`font-exo ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>
                    Thank you for your interest. We'll review your application and get back to you soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="name"
                        className={`block font-exo font-semibold mb-2 ${
                          theme === 'dark' ? 'text-white' : 'text-black'
                        }`}
                      >
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-4 py-2.5 rounded-lg font-exo focus:outline-none transition-all duration-300 ${
                          theme === 'dark'
                            ? 'bg-dark-lighter text-white border border-electric-blue/20 focus:border-electric-blue'
                            : 'bg-gray-50 text-black border border-gray-300 focus:border-accent-red'
                        }`}
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className={`block font-exo font-semibold mb-2 ${
                          theme === 'dark' ? 'text-white' : 'text-black'
                        }`}
                      >
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-4 py-2.5 rounded-lg font-exo focus:outline-none transition-all duration-300 ${
                          theme === 'dark'
                            ? 'bg-dark-lighter text-white border border-electric-blue/20 focus:border-electric-blue'
                            : 'bg-gray-50 text-black border border-gray-300 focus:border-accent-red'
                        }`}
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className={`block font-exo font-semibold mb-2 ${
                        theme === 'dark' ? 'text-white' : 'text-black'
                      }`}
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2.5 rounded-lg font-exo focus:outline-none transition-all duration-300 ${
                        theme === 'dark'
                          ? 'bg-dark-bg text-white border border-electric-blue/20 focus:border-electric-blue'
                          : 'bg-gray-50 text-black border border-gray-300 focus:border-accent-red'
                      }`}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="resume"
                      className={`block font-exo font-semibold mb-2 ${
                        theme === 'dark' ? 'text-white' : 'text-black'
                      }`}
                    >
                      Upload Resume/CV *
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        id="resume"
                        name="resume"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        required
                        className="hidden"
                      />
                      <label
                        htmlFor="resume"
                        className={`flex items-center justify-center w-full px-4 py-2.5 rounded-lg font-exo cursor-pointer transition-all duration-300 ${
                          theme === 'dark'
                            ? 'bg-dark-lighter text-white border border-electric-blue/20 hover:border-electric-blue'
                            : 'bg-gray-50 text-black border border-gray-300 hover:border-accent-red'
                        }`}
                      >
                        {resumeFile ? (
                          <span className={`text-sm ${theme === 'dark' ? 'text-electric-green' : 'text-accent-red'}`}>
                            {resumeFile.name}
                          </span>
                        ) : (
                          <span className={`text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                            Click to upload (PDF, DOC, DOCX)
                          </span>
                        )}
                      </label>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="coverLetter"
                      className={`block font-exo font-semibold mb-2 ${
                        theme === 'dark' ? 'text-white' : 'text-black'
                      }`}
                    >
                      Why you're interested
                    </label>
                    <textarea
                      id="coverLetter"
                      name="coverLetter"
                      value={formData.coverLetter}
                      onChange={handleInputChange}
                      rows={3}
                      className={`w-full px-4 py-2.5 rounded-lg font-exo focus:outline-none transition-all duration-300 resize-none ${
                        theme === 'dark'
                          ? 'bg-dark-lighter text-white border border-electric-blue/20 focus:border-electric-blue'
                          : 'bg-gray-50 text-black border border-gray-300 focus:border-accent-red'
                      }`}
                      placeholder="Tell us why you're excited about this role..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3 rounded-lg font-exo font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                      theme === 'dark'
                        ? 'bg-electric-green text-black hover:glow-green hover:scale-105'
                        : 'bg-accent-red text-white hover:glow-red hover:scale-105'
                    } ${isSubmitting && 'opacity-75 cursor-not-allowed'}`}
                  >
                    {isSubmitting ? (
                      <span>Submitting...</span>
                    ) : (
                      <>
                        <span>Submit Application</span>
                        <Send size={20} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Careers;
