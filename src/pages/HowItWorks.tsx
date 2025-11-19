import React from 'react';
import { useTheme } from '../context/ThemeContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ArrowRight, HelpCircle, MapPin, Database, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

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
    layout: 'left' // image on left, text on right
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
    layout: 'right' // image on right, text on left
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
    layout: 'left' // image on left, text on right
  }
];

const HowItWorks = () => {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'}`}>
      <Header />
      <div className="pt-20">
        <div className="container mx-auto px-6 py-18">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className={`text-4xl md:text-5xl font-orbitron font-bold mb-3 ${
              theme === 'dark' ? 'text-white' : 'text-black'
            }`}>
              How It <span className={theme === 'dark' ? 'text-electric-green' : 'text-accent-red'}>Works</span>
            </h1>
            <p className={`text-base md:text-lg font-exo max-w-3xl mx-auto ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Discover how we solve your business challenges with innovative solutions
            </p>
          </div>

          {/* How It Works Services Section */}
          <div className="mb-12 space-y-12 md:space-y-16">
            {howItWorksServices.map((service, index) => {
              const Icon = service.icon;
              const isReversed = service.layout === 'right';
              
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className={`flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-6 lg:gap-10 items-center`}
                >
                  {/* Image Section */}
                  <div className="w-full lg:w-1/2 flex justify-center">
                    <div className={`rounded-2xl overflow-hidden w-[75%] ${
                      theme === 'dark' ? 'bg-dark-card' : 'bg-white'
                    } shadow-xl`}>
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="w-full lg:w-1/2">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${
                      theme === 'dark'
                        ? 'bg-electric-blue/20 text-electric-blue'
                        : 'bg-accent-red/20 text-accent-red'
                    }`}>
                      <Icon size={32} />
                    </div>
                    <h2 className={`text-2xl md:text-3xl font-orbitron font-bold mb-3 ${
                      theme === 'dark' ? 'text-white' : 'text-black'
                    }`}>
                      {service.title}
                    </h2>
                    <p className={`text-sm md:text-base font-exo leading-relaxed mb-4 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {service.description}
                    </p>
                    
                    {/* Additional Website Features */}
                    {service.additionalContent && (
                      <div className="mb-5">
                        <h4 className={`text-sm font-orbitron font-semibold mb-3 ${
                          theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                        }`}>
                          Key Website Features:
                        </h4>
                        <ul className="space-y-2">
                          {service.additionalContent.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${
                                theme === 'dark' ? 'bg-electric-green' : 'bg-accent-red'
                              }`} />
                              <span className={`text-xs md:text-sm font-exo ${
                                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                              }`}>
                                {item}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <button className={`px-6 py-2.5 rounded-lg font-exo font-semibold transition-all duration-300 hover:scale-105 ${
                      theme === 'dark'
                        ? 'bg-electric-green text-black hover:glow-green'
                        : 'bg-accent-red text-white hover:glow-red'
                    }`}>
                      {service.cta} <ArrowRight className="inline ml-2" size={20} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Challenges Q/A Section */}
          <div className="mb-12">
            <h2 className={`text-2xl md:text-3xl font-orbitron font-bold mb-6 ${
              theme === 'dark' ? 'text-white' : 'text-black'
            }`}>
              Challenges Q/A
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {challenges.map((challenge, index) => (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`${theme === 'dark' ? 'bg-dark-card' : 'bg-white'} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300`}
                >
                  <div className="flex items-start space-x-4 mb-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      theme === 'dark'
                        ? 'bg-electric-blue/20 text-electric-blue'
                        : 'bg-accent-red/20 text-accent-red'
                    }`}>
                      <HelpCircle size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-lg md:text-xl font-orbitron font-bold mb-3 ${
                        theme === 'dark' ? 'text-white' : 'text-black'
                      }`}>
                        {challenge.question}
                      </h3>
                    </div>
                  </div>

                  <div className={`border-t ${
                    theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                  } pt-4 mb-4`}>
                    <h4 className={`text-base font-orbitron font-bold mb-2 ${
                      theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                    }`}>
                      Solution
                    </h4>
                    <p className={`font-exo mb-4 text-sm md:text-base ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {challenge.solution}
                    </p>
                  </div>

                  {challenge.features.length > 0 && (
                    <div className="mb-4">
                      <h5 className={`text-sm font-orbitron font-semibold mb-2 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Key Features:
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {challenge.features.map((feature, idx) => (
                          <span
                            key={idx}
                            className={`px-3 py-1 rounded-full text-xs font-exo ${
                              theme === 'dark'
                                ? 'bg-electric-blue/20 text-electric-blue'
                                : 'bg-accent-red/20 text-accent-red'
                            }`}
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <a
                    href={`/services#${challenge.platform.toLowerCase().replace(/\s+/g, '-')}`}
                    className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg font-exo font-semibold transition-all duration-300 hover:scale-105 ${
                      theme === 'dark'
                        ? 'text-electric-blue hover:text-electric-green'
                        : 'text-accent-red hover:text-accent-blue'
                    }`}
                  >
                    <span>{challenge.cta}</span>
                    <ArrowRight size={16} />
                  </a>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Process Flow Section */}
          <div className={`${theme === 'dark' ? 'bg-dark-card' : 'bg-white'} rounded-2xl p-8 shadow-lg`}>
            <h2 className={`text-3xl font-orbitron font-bold mb-8 text-center ${
              theme === 'dark' ? 'text-white' : 'text-black'
            }`}>
              Our Process
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
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
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                    theme === 'dark'
                      ? 'bg-electric-blue/20 text-electric-blue'
                      : 'bg-accent-red/20 text-accent-red'
                  }`}>
                    <span className="font-orbitron font-bold text-2xl">{process.step}</span>
                  </div>
                  <h3 className={`text-xl font-orbitron font-bold mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-black'
                  }`}>
                    {process.title}
                  </h3>
                  <p className={`font-exo text-sm ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {process.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HowItWorks;

