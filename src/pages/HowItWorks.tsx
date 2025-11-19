import { useTheme } from '../context/ThemeContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ArrowRight, HelpCircle, MapPin, Database, TrendingUp } from 'lucide-react';
import { motion, Variants } from 'framer-motion';

const challenges = [
  {
    id: 1,
    question: 'We generate plenty of leads monthly, but lack visibility on their outcomes. How do we gain insights and optimise our efforts?',
    solution: 'To gain insights and optimise your efforts with generated leads, you need a solution that offers robust analytics and tracking capabilities. This will allow you to monitor the outcomes of your leads and adjust your strategies accordingly.',
    features: ['Data Integration', 'Data Activation', 'Security & Compliance'],
    cta: 'Explore our Data Platform',
    platform: 'Data Platform'
  },
  {
    id: 2,
    question: 'Our current method of demand generation through leads is not working out due to high TAT and Junk Data.',
    solution: 'To address the challenges with high turnaround time (TAT) and junk data in your traditional demand generation methods, you need a solution that can streamline lead generation and data quality.',
    features: [],
    cta: 'Explore our Discovery Platform',
    platform: 'Discovery Platform'
  },
  {
    id: 3,
    question: 'While the volume targets are getting achieved, we are facing issues with lead quality & CPL.',
    solution: 'To address the issues with lead quality and Cost Per Lead (CPL) while achieving volume targets, you need a solution that can improve lead targeting and qualification processes. By refining your targeting criteria and qualifying leads more effectively, you can improve lead quality and reduce CPL, ultimately enhancing the overall performance of your demand generation efforts.',
    features: [],
    cta: 'Explore our Demand Generation Platform',
    platform: 'Demand Generation Platform'
  },
  {
    id: 4,
    question: 'The challenge is acquiring and maintaining accurate location data for effective marketing and lead generation. Seamless integration with marketing systems is crucial for targeted success.',
    solution: 'To address the challenge of obtaining and maintaining accurate location data, consider implementing a robust location data management system. This system should streamline the integration of marketing systems with location data, ensuring that each store\'s information is accurate and up-to-date. Additionally, regular audits and updates to the location data can help maintain its accuracy over time.',
    features: [],
    cta: 'Explore our Data Platform',
    platform: 'Data Platform'
  }
];

const howItWorksServices = [
  {
    id: 1,
    title: 'Hyperlocal Discovery Automation',
    icon: MapPin,
    description: 'Empower your brand with organic lead generation, leveraging real-time reporting for genuine leads and increased foot traffic. Our modules, including store management, store locator, dealer website, product catalogue & more to generate high-intent buying leads.',
    additionalContent: [
      'Real-time store locator with GPS integration for accurate location-based searches',
      'Automated multi-language support for global market reach',
      'Advanced analytics dashboard tracking visitor behavior and conversion rates',
      'Seamless integration with CRM systems for lead management',
      'Mobile-responsive design ensuring optimal user experience across all devices',
      'Custom branding options to maintain your brand identity throughout the platform'
    ],
    image: '/image1.png',
    cta: 'Explore Discovery',
    layout: 'left'
  },
  {
    id: 2,
    title: 'Customer Data Platform',
    icon: Database,
    description: 'Seamlessly access, integrate, consolidate, and deploy leads, dealer, inventory & customer data to propel your brand into a new era of discovery and engagement. Engage with your current customers for leads, dealers & customer data. Multi-channel, real-time, rich data - all in one place.',
    additionalContent: [
      'Unified customer profiles aggregating data from multiple touchpoints',
      'Real-time data synchronization across all integrated platforms',
      'Advanced segmentation tools for targeted marketing campaigns',
      'Data privacy compliance with GDPR, CCPA, and other regulations',
      'Custom API integrations with your existing business systems',
      'Predictive analytics for customer behavior forecasting and insights'
    ],
    image: '/image2.png',
    cta: 'Explore CDP',
    layout: 'right'
  },
  {
    id: 3,
    title: 'Retail Demand Generation',
    icon: TrendingUp,
    description: 'Through data, we generate data-driven insights, empowering businesses with valuable information for strategic retail demand generation. Modules like Google Ad campaign, Meta Ad campaign, market scanner & retargeting, store & more, and more to enhance engagement and conversion. Personalized communication based on customer interactions.',
    additionalContent: [
      'AI-powered campaign optimization for maximum ROI and conversion rates',
      'Cross-platform advertising management (Google, Meta, LinkedIn, and more)',
      'Dynamic retargeting campaigns based on user behavior and preferences',
      'A/B testing capabilities for continuous campaign improvement',
      'Real-time performance monitoring with actionable insights',
      'Automated budget allocation and bid management for optimal ad spend'
    ],
    image: '/image3.png',
    cta: 'Get Started',
    layout: 'left'
  }
];

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const featureItemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

const HowItWorks = () => {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'}`}>
      <Header />
      <div className="pt-20">
        <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-center mb-16 lg:mb-20"
          >
            <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-orbitron font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-black'
            }`}>
              How It <span className={theme === 'dark' ? 'text-electric-green' : 'text-accent-red'}>Works</span>
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className={`text-base sm:text-lg lg:text-xl font-exo max-w-3xl mx-auto ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Discover how we solve your business challenges with innovative solutions
            </motion.p>
          </motion.div>

          {/* How It Works Services Section */}
          <div className="mb-16 lg:mb-24 space-y-16 lg:space-y-24">
            {howItWorksServices.map((service, index) => {
              const Icon = service.icon;
              const isReversed = service.layout === 'right';
              
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className={`flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-8 lg:gap-12 xl:gap-16 items-center`}
                >
                  {/* Image Section */}
                  <motion.div 
                    className="w-full lg:w-1/2 flex justify-center"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className={`rounded-2xl overflow-hidden w-full max-w-md lg:max-w-none lg:w-[85%] relative group ${
                      theme === 'dark' ? 'bg-dark-card' : 'bg-white'
                    } shadow-xl`}>
                      <motion.div
                        className="absolute inset-0 z-10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{
                          background: theme === 'dark' 
                            ? 'linear-gradient(135deg, rgba(0,240,255,0.1) 0%, rgba(0,232,129,0.1) 100%)'
                            : 'linear-gradient(135deg, rgba(235,50,50,0.05) 0%, rgba(0,123,255,0.05) 100%)',
                          boxShadow: theme === 'dark'
                            ? '0 0 40px rgba(0,240,255,0.3)'
                            : '0 0 40px rgba(235,50,50,0.2)'
                        }}
                      />
                      <motion.img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-auto object-cover relative z-0"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      />
                    </div>
                  </motion.div>

                  {/* Content Section */}
                  <motion.div 
                    className="w-full lg:w-1/2 px-4 sm:px-0"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                  >
                    <motion.div
                      variants={itemVariants}
                      whileHover={{ 
                        scale: 1.05,
                        rotate: [0, -5, 5, 0],
                        transition: { duration: 0.5 }
                      }}
                      className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 ${
                        theme === 'dark'
                          ? 'bg-electric-blue/20 text-electric-blue shadow-[0_0_20px_rgba(0,240,255,0.3)]'
                          : 'bg-accent-red/20 text-accent-red shadow-[0_0_20px_rgba(235,50,50,0.2)]'
                      }`}
                    >
                      <Icon size={36} />
                    </motion.div>
                    
                    <motion.h2
                      variants={itemVariants}
                      className={`text-2xl sm:text-3xl lg:text-4xl font-orbitron font-bold mb-4 ${
                        theme === 'dark' ? 'text-white' : 'text-black'
                      }`}
                    >
                      {service.title}
                    </motion.h2>
                    
                    <motion.p
                      variants={itemVariants}
                      className={`text-sm sm:text-base lg:text-lg font-exo leading-relaxed mb-6 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      {service.description}
                    </motion.p>
                    
                    {/* Additional Website Features */}
                    {service.additionalContent && (
                      <motion.div variants={itemVariants} className="mb-6">
                        <h4 className={`text-sm sm:text-base font-orbitron font-semibold mb-4 ${
                          theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                        }`}>
                          Key Website Features:
                        </h4>
                        <motion.ul 
                          className="space-y-3"
                          variants={containerVariants}
                        >
                          {service.additionalContent.map((item, idx) => (
                            <motion.li
                              key={idx}
                              variants={featureItemVariants}
                              whileHover={{ x: 5 }}
                              className="flex items-start gap-3"
                            >
                              <motion.div
                                animate={{
                                  scale: [1, 1.2, 1],
                                  boxShadow: theme === 'dark'
                                    ? ['0 0 0px rgba(0,232,129,0)', '0 0 10px rgba(0,232,129,0.6)', '0 0 0px rgba(0,232,129,0)']
                                    : ['0 0 0px rgba(235,50,50,0)', '0 0 10px rgba(235,50,50,0.6)', '0 0 0px rgba(235,50,50,0)']
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  delay: idx * 0.2
                                }}
                                className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                                  theme === 'dark' ? 'bg-electric-green' : 'bg-accent-red'
                                }`}
                              />
                              <span className={`text-xs sm:text-sm lg:text-base font-exo ${
                                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                              }`}>
                                {item}
                              </span>
                            </motion.li>
                          ))}
                        </motion.ul>
                      </motion.div>
                    )}
                    
                    <motion.button
                      variants={itemVariants}
                      whileHover={{ 
                        scale: 1.05,
                        boxShadow: theme === 'dark'
                          ? '0 10px 30px rgba(0,232,129,0.4)'
                          : '0 10px 30px rgba(235,50,50,0.4)'
                      }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-6 sm:px-8 py-3 rounded-lg font-exo font-semibold transition-all duration-300 ${
                        theme === 'dark'
                          ? 'bg-electric-green text-black shadow-[0_4px_15px_rgba(0,232,129,0.4)]'
                          : 'bg-accent-red text-white shadow-[0_4px_15px_rgba(235,50,50,0.4)]'
                      }`}
                    >
                      {service.cta} <ArrowRight className="inline ml-2" size={20} />
                    </motion.button>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>

          {/* Challenges Q/A Section */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 lg:mb-24"
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className={`text-3xl sm:text-4xl lg:text-5xl font-orbitron font-bold mb-10 text-center ${
                theme === 'dark' ? 'text-white' : 'text-black'
              }`}
            >
              Challenges Q/A
            </motion.h2>
            <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {challenges.map((challenge, index) => (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                  whileHover={{ 
                    y: -5,
                    boxShadow: theme === 'dark'
                      ? '0 20px 40px rgba(0,240,255,0.2)'
                      : '0 20px 40px rgba(235,50,50,0.15)',
                    transition: { duration: 0.3 }
                  }}
                  className={`${theme === 'dark' ? 'bg-dark-card' : 'bg-white'} rounded-2xl p-6 lg:p-8 shadow-lg transition-shadow duration-300`}
                >
                  <div className="flex items-start space-x-4 mb-5">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                        theme === 'dark'
                          ? 'bg-electric-blue/20 text-electric-blue shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                          : 'bg-accent-red/20 text-accent-red shadow-[0_0_15px_rgba(235,50,50,0.2)]'
                      }`}
                    >
                      <HelpCircle size={26} />
                    </motion.div>
                    <div className="flex-1">
                      <h3 className={`text-base sm:text-lg lg:text-xl font-orbitron font-bold mb-3 ${
                        theme === 'dark' ? 'text-white' : 'text-black'
                      }`}>
                        {challenge.question}
                      </h3>
                    </div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className={`border-t ${
                      theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                    } pt-5 mb-5`}
                  >
                    <h4 className={`text-base sm:text-lg font-orbitron font-bold mb-3 ${
                      theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                    }`}>
                      Solution
                    </h4>
                    <p className={`font-exo mb-4 text-sm sm:text-base ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {challenge.solution}
                    </p>
                  </motion.div>

                  {challenge.features.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 }}
                      className="mb-5"
                    >
                      <h5 className={`text-sm font-orbitron font-semibold mb-3 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Key Features:
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {challenge.features.map((feature, idx) => (
                          <motion.span
                            key={idx}
                            initial={{ opacity: 0, scale: 0 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 + idx * 0.1 }}
                            className={`px-3 py-1.5 rounded-full text-xs font-exo ${
                              theme === 'dark'
                                ? 'bg-electric-blue/20 text-electric-blue'
                                : 'bg-accent-red/20 text-accent-red'
                            }`}
                          >
                            {feature}
                          </motion.span>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  <motion.a
                    href={`/services#${challenge.platform.toLowerCase().replace(/\s+/g, '-')}`}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className={`inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg font-exo font-semibold transition-all duration-300 ${
                      theme === 'dark'
                        ? 'text-electric-blue hover:text-electric-green hover:bg-electric-blue/10'
                        : 'text-accent-red hover:text-accent-blue hover:bg-accent-red/10'
                    }`}
                  >
                    <span>{challenge.cta}</span>
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight size={18} />
                    </motion.div>
                  </motion.a>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Process Flow Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className={`${theme === 'dark' ? 'bg-dark-card' : 'bg-white'} rounded-2xl p-8 lg:p-12 shadow-lg`}
          >
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className={`text-3xl sm:text-4xl lg:text-5xl font-orbitron font-bold mb-12 text-center ${
                theme === 'dark' ? 'text-white' : 'text-black'
              }`}
            >
              Our Process
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
              {[
                {
                  step: '01',
                  title: 'Discovery',
                  description: 'We analyze your business challenges and requirements to understand your unique needs.'
                },
                {
                  step: '02',
                  title: 'Strategy',
                  description: 'Our team develops a customized strategy tailored to your business goals and objectives.'
                },
                {
                  step: '03',
                  title: 'Implementation',
                  description: 'We deploy our solutions with seamless integration and minimal disruption to your operations.'
                },
                {
                  step: '04',
                  title: 'Optimization',
                  description: 'Continuous monitoring and optimization ensure maximum performance and ROI for your business.'
                }
              ].map((process, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
                  whileHover={{ 
                    y: -10,
                    transition: { duration: 0.3 }
                  }}
                  className="text-center"
                >
                  <motion.div
                    whileHover={{ 
                      scale: 1.1,
                      rotate: [0, -10, 10, 0],
                      transition: { duration: 0.5 }
                    }}
                    animate={{
                      boxShadow: theme === 'dark'
                        ? [
                            '0 0 0px rgba(0,240,255,0)',
                            '0 0 20px rgba(0,240,255,0.4)',
                            '0 0 0px rgba(0,240,255,0)'
                          ]
                        : [
                            '0 0 0px rgba(235,50,50,0)',
                            '0 0 20px rgba(235,50,50,0.3)',
                            '0 0 0px rgba(235,50,50,0)'
                          ]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: index * 0.5
                    }}
                    className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
                      theme === 'dark'
                        ? 'bg-electric-blue/20 text-electric-blue'
                        : 'bg-accent-red/20 text-accent-red'
                    }`}
                  >
                    <span className="font-orbitron font-bold text-2xl">{process.step}</span>
                  </motion.div>
                  <motion.h3
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className={`text-xl sm:text-2xl font-orbitron font-bold mb-3 ${
                      theme === 'dark' ? 'text-white' : 'text-black'
                    }`}
                  >
                    {process.title}
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className={`font-exo text-sm sm:text-base ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    {process.description}
                  </motion.p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HowItWorks;
