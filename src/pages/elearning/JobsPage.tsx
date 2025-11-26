import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  DollarSign,
  Building2,
  Users,
  ArrowRight,
  Search,
  Filter,
  ExternalLink,
  Bookmark,
  GraduationCap
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import ELearningNav from '../../components/elearning/ELearningNav';
import { jobsAPI } from '../../utils/api';

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  salary_range: string;
  description: string;
  requirements: string;
  benefits: string;
  apply_link: string;
  is_active: boolean;
  created_at: string;
}

const sampleJobs: Job[] = [
  {
    id: 1,
    title: 'Senior Full Stack Developer',
    company: 'TechCorp Inc.',
    location: 'Remote',
    type: 'Full-time',
    salary_range: '$120,000 - $180,000',
    description: 'Join our team to build cutting-edge web applications using React, Node.js, and cloud technologies.',
    requirements: 'Bachelor degree, 5+ years experience, React, Node.js, AWS',
    benefits: 'Health insurance, 401k, flexible hours, remote work',
    apply_link: '#',
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Data Scientist',
    company: 'AI Labs',
    location: 'San Francisco',
    type: 'Full-time',
    salary_range: '$150,000 - $200,000',
    description: 'Work on machine learning models and data analytics for Fortune 500 clients.',
    requirements: 'MS/PhD in CS or related field, Python, TensorFlow, statistics',
    benefits: 'Stock options, unlimited PTO, learning budget',
    apply_link: '#',
    is_active: true,
    created_at: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 3,
    title: 'Frontend Developer Intern',
    company: 'StartupXYZ',
    location: 'New York',
    type: 'Internship',
    salary_range: '$25/hour',
    description: 'Learn and grow with our team building modern React applications.',
    requirements: 'Currently enrolled in CS program, React basics, eager to learn',
    benefits: 'Mentorship, career growth, possible full-time offer',
    apply_link: '#',
    is_active: true,
    created_at: new Date(Date.now() - 172800000).toISOString()
  }
];

const JobsPage = () => {
  const { theme } = useTheme();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');

  const jobTypes = ['all', 'Full-time', 'Part-time', 'Contract', 'Remote', 'Internship'];
  const locations = ['all', 'Remote', 'New York', 'San Francisco', 'London', 'Berlin', 'Singapore'];

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await jobsAPI.getAll({});
      const fetchedJobs = response.data.jobs || [];
      setJobs(fetchedJobs.length > 0 ? fetchedJobs : sampleJobs);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setJobs(sampleJobs);
      setError('Unable to load job listings from server. Showing sample opportunities.');
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = 
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || job.type === selectedType;
    const matchesLocation = selectedLocation === 'all' || job.location?.includes(selectedLocation);
    return matchesSearch && matchesType && matchesLocation;
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'
    }`}>
      <ELearningNav />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className={`absolute inset-0 ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-dark-bg via-dark-card to-dark-bg'
            : 'bg-gradient-to-br from-white via-gray-50 to-white'
        }`} />
        <div className="absolute top-20 right-10 w-80 h-80 bg-electric-blue/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-electric-green/20 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6 ${
              theme === 'dark'
                ? 'bg-electric-green/20 text-electric-green'
                : 'bg-accent-red/10 text-accent-red'
            }`}>
              <Briefcase className="w-4 h-4" />
              Career Opportunities
            </span>

            <h1 className={`text-5xl md:text-6xl font-bold mb-6 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Find Your Dream{' '}
              <span className={theme === 'dark' ? 'text-electric-green' : 'text-accent-red'}>
                Tech Job
              </span>
            </h1>

            <p className={`text-xl mb-10 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Discover exciting career opportunities from top tech companies. 
              Apply your newly learned skills and take your career to the next level.
            </p>

            {/* Search Bar */}
            <div className={`max-w-2xl mx-auto p-2 rounded-2xl ${
              theme === 'dark' ? 'bg-dark-card' : 'bg-white'
            } shadow-2xl`}>
              <div className="flex flex-col md:flex-row gap-2">
                <div className="flex-1 relative">
                  <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                  }`} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search jobs, companies, or keywords..."
                    className={`w-full pl-12 pr-4 py-4 rounded-xl border-0 focus:outline-none focus:ring-2 ${
                      theme === 'dark'
                        ? 'bg-dark-lighter text-white placeholder-gray-500 focus:ring-electric-blue/30'
                        : 'bg-gray-50 text-gray-900 placeholder-gray-400 focus:ring-accent-blue/30'
                    }`}
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 ${
                    theme === 'dark'
                      ? 'bg-gradient-to-r from-electric-green to-electric-blue text-dark-bg'
                      : 'bg-gradient-to-r from-accent-red to-accent-blue text-white'
                  }`}
                >
                  <Search className="w-5 h-5" />
                  Search
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className={`py-8 ${theme === 'dark' ? 'bg-dark-card' : 'bg-white'}`}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: jobs.length || '50+', label: 'Open Positions', icon: Briefcase },
              { value: '100+', label: 'Partner Companies', icon: Building2 },
              { value: '5,000+', label: 'Placed Students', icon: Users },
              { value: '95%', label: 'Placement Rate', icon: GraduationCap }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <stat.icon className={`w-8 h-8 mx-auto mb-2 ${
                  theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                }`} />
                <div className={`text-2xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {stat.value}
                </div>
                <div className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Jobs Listing */}
      <section className={`py-16 ${theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-1/4">
              <div className={`sticky top-24 p-6 rounded-2xl ${
                theme === 'dark' ? 'bg-dark-card border border-gray-800' : 'bg-white border border-gray-200'
              }`}>
                <div className="flex items-center gap-2 mb-6">
                  <Filter className={`w-5 h-5 ${
                    theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                  }`} />
                  <h3 className={`font-bold text-lg ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Filters
                  </h3>
                </div>

                {/* Job Type Filter */}
                <div className="mb-6">
                  <label className={`block text-sm font-medium mb-3 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Job Type
                  </label>
                  <div className="space-y-2">
                    {jobTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => setSelectedType(type)}
                        className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all ${
                          selectedType === type
                            ? theme === 'dark'
                              ? 'bg-electric-blue/20 text-electric-blue border border-electric-blue/30'
                              : 'bg-accent-blue/10 text-accent-blue border border-accent-blue/30'
                            : theme === 'dark'
                              ? 'text-gray-400 hover:bg-dark-lighter hover:text-white'
                              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                      >
                        {type === 'all' ? 'All Types' : type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Location Filter */}
                <div>
                  <label className={`block text-sm font-medium mb-3 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Location
                  </label>
                  <div className="space-y-2">
                    {locations.map((location) => (
                      <button
                        key={location}
                        onClick={() => setSelectedLocation(location)}
                        className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all ${
                          selectedLocation === location
                            ? theme === 'dark'
                              ? 'bg-electric-green/20 text-electric-green border border-electric-green/30'
                              : 'bg-accent-red/10 text-accent-red border border-accent-red/30'
                            : theme === 'dark'
                              ? 'text-gray-400 hover:bg-dark-lighter hover:text-white'
                              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                      >
                        {location === 'all' ? 'All Locations' : location}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Jobs List */}
            <div className="lg:w-3/4">
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-2xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Available Positions
                </h2>
                <span className={`px-4 py-2 rounded-lg text-sm ${
                  theme === 'dark' ? 'bg-dark-card text-gray-400' : 'bg-white text-gray-600'
                }`}>
                  <span className={`font-semibold ${
                    theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                  }`}>
                    {filteredJobs.length}
                  </span>
                  {' '}jobs found
                </span>
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`p-6 rounded-2xl animate-pulse ${
                        theme === 'dark' ? 'bg-dark-card' : 'bg-white'
                      }`}
                    >
                      <div className={`h-6 rounded w-1/3 mb-4 ${
                        theme === 'dark' ? 'bg-dark-lighter' : 'bg-gray-200'
                      }`} />
                      <div className={`h-4 rounded w-1/4 mb-2 ${
                        theme === 'dark' ? 'bg-dark-lighter' : 'bg-gray-200'
                      }`} />
                      <div className={`h-4 rounded w-full ${
                        theme === 'dark' ? 'bg-dark-lighter' : 'bg-gray-200'
                      }`} />
                    </div>
                  ))}
                </div>
              ) : filteredJobs.length > 0 ? (
                <div className="space-y-4">
                  {filteredJobs.map((job, idx) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ y: -5 }}
                      className={`p-6 rounded-2xl border-2 transition-all ${
                        theme === 'dark'
                          ? 'bg-dark-card border-gray-800 hover:border-electric-blue'
                          : 'bg-white border-gray-200 hover:border-accent-blue'
                      } shadow-lg hover:shadow-xl`}
                    >
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-4">
                            <div className={`flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center ${
                              theme === 'dark'
                                ? 'bg-electric-blue/20 text-electric-blue'
                                : 'bg-accent-blue/10 text-accent-blue'
                            }`}>
                              <Building2 className="w-7 h-7" />
                            </div>
                            <div>
                              <h3 className={`text-xl font-bold mb-1 ${
                                theme === 'dark' ? 'text-white' : 'text-gray-900'
                              }`}>
                                {job.title}
                              </h3>
                              <p className={`text-sm font-medium ${
                                theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                              }`}>
                                {job.company}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-3 mt-4">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${
                              theme === 'dark'
                                ? 'bg-dark-lighter text-gray-300'
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              <MapPin className="w-3.5 h-3.5" />
                              {job.location}
                            </span>
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${
                              theme === 'dark'
                                ? 'bg-dark-lighter text-gray-300'
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              <Clock className="w-3.5 h-3.5" />
                              {job.type}
                            </span>
                            {job.salary_range && (
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${
                                theme === 'dark'
                                  ? 'bg-electric-green/20 text-electric-green'
                                  : 'bg-accent-red/10 text-accent-red'
                              }`}>
                                <DollarSign className="w-3.5 h-3.5" />
                                {job.salary_range}
                              </span>
                            )}
                          </div>

                          <p className={`mt-4 text-sm line-clamp-2 ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {job.description}
                          </p>
                        </div>

                        <div className="flex md:flex-col gap-2">
                          <motion.a
                            href={job.apply_link || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`flex-1 md:flex-none px-6 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 ${
                              theme === 'dark'
                                ? 'bg-gradient-to-r from-electric-green to-electric-blue text-dark-bg'
                                : 'bg-gradient-to-r from-accent-red to-accent-blue text-white'
                            }`}
                          >
                            Apply Now
                            <ExternalLink className="w-4 h-4" />
                          </motion.a>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`flex-1 md:flex-none px-6 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 border-2 ${
                              theme === 'dark'
                                ? 'border-gray-700 text-gray-300 hover:border-electric-blue hover:text-electric-blue'
                                : 'border-gray-300 text-gray-700 hover:border-accent-blue hover:text-accent-blue'
                            }`}
                          >
                            <Bookmark className="w-4 h-4" />
                            Save
                          </motion.button>
                        </div>
                      </div>

                      <div className={`mt-4 pt-4 border-t flex items-center justify-between ${
                        theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
                      }`}>
                        <span className={`text-xs ${
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                        }`}>
                          Posted {formatDate(job.created_at)}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className={`text-center py-16 rounded-2xl ${
                  theme === 'dark' ? 'bg-dark-card' : 'bg-white'
                }`}>
                  <Briefcase className={`w-16 h-16 mx-auto mb-4 ${
                    theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                  }`} />
                  <h3 className={`text-xl font-bold mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    No jobs found
                  </h3>
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-16 ${theme === 'dark' ? 'bg-dark-card' : 'bg-white'}`}>
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`text-center p-12 rounded-3xl ${
              theme === 'dark'
                ? 'bg-gradient-to-br from-electric-blue/20 to-electric-green/20'
                : 'bg-gradient-to-br from-accent-red/10 to-accent-blue/10'
            }`}
          >
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Not Ready to Apply Yet?
            </h2>
            <p className={`text-lg mb-8 max-w-2xl mx-auto ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Upskill with our industry-relevant courses and become job-ready. 
              Learn from experts and build a portfolio that stands out.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/elearning'}
              className={`px-8 py-4 rounded-xl font-bold flex items-center gap-2 mx-auto ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-electric-green to-electric-blue text-dark-bg'
                  : 'bg-gradient-to-r from-accent-red to-accent-blue text-white'
              }`}
            >
              Explore Courses
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-8 border-t ${
        theme === 'dark' ? 'bg-dark-bg border-gray-800' : 'bg-gray-50 border-gray-200'
      }`}>
        <div className="container mx-auto px-4 lg:px-8">
          <p className={`text-center text-sm ${
            theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
          }`}>
            © 2024 NanoFlows Academy. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default JobsPage;
