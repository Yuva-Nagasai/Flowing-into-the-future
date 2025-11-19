import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Check, X, Minus, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const WebsiteComparison = () => {
  const { theme } = useTheme();

  const StatusIcon = ({ status }: { status: string }) => {
    if (status === 'supported') {
      return (
        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500/20">
          <Check className="w-4 h-4 text-green-500" />
        </div>
      );
    } else if (status === 'not-supported') {
      return (
        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-red-500/20">
          <X className="w-4 h-4 text-red-500" />
        </div>
      );
    } else {
      return (
        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-yellow-500/20">
          <Minus className="w-4 h-4 text-yellow-500" />
        </div>
      );
    }
  };

  const comparisonData = [
    {
      category: 'Website Development',
      features: [
        {
          name: 'Custom responsive design',
          sekeltech: { status: 'supported', text: 'Fully responsive across all devices' },
          others: { status: 'limited', text: 'Basic responsive templates only' }
        },
        {
          name: 'Advanced SEO optimization',
          sekeltech: { status: 'supported', text: 'Built-in SEO best practices' },
          others: { status: 'limited', text: 'Basic SEO setup' }
        },
        {
          name: 'Performance optimization',
          sekeltech: { status: 'supported', text: 'Page speed optimization included' },
          others: { status: 'not-supported', text: 'Additional cost for optimization' }
        },
        {
          name: 'Content Management System',
          sekeltech: { status: 'supported', text: 'Custom CMS included' },
          others: { status: 'limited', text: 'Dependent on third-party CMS' }
        },
        {
          name: 'E-commerce integration',
          sekeltech: { status: 'supported', text: 'Full e-commerce capabilities' },
          others: { status: 'limited', text: 'Basic shopping cart only' }
        },
        {
          name: 'Multi-language support',
          sekeltech: { status: 'supported', text: 'Unlimited languages supported' },
          others: { status: 'limited', text: 'Limited language options' }
        }
      ]
    },
    {
      category: 'Website Features',
      features: [
        {
          name: 'Advanced analytics integration',
          sekeltech: { status: 'supported', text: 'Google Analytics, GA4, custom tracking' },
          others: { status: 'limited', text: 'Basic analytics only' }
        },
        {
          name: 'Social media integration',
          sekeltech: { status: 'supported', text: 'All major platforms integrated' },
          others: { status: 'limited', text: 'Limited social integrations' }
        },
        {
          name: 'Payment gateway integration',
          sekeltech: { status: 'supported', text: 'Multiple payment options' },
          others: { status: 'limited', text: 'Single payment method' }
        },
        {
          name: 'Security features',
          sekeltech: { status: 'supported', text: 'SSL, firewall, security monitoring' },
          others: { status: 'limited', text: 'Basic SSL only' }
        },
        {
          name: 'Backup & recovery',
          sekeltech: { status: 'supported', text: 'Automated daily backups' },
          others: { status: 'not-supported', text: 'Manual backup required' }
        },
        {
          name: '24/7 technical support',
          sekeltech: { status: 'supported', text: 'Round-the-clock support included' },
          others: { status: 'limited', text: 'Business hours support only' }
        }
      ]
    },
    {
      category: 'Website Maintenance',
      features: [
        {
          name: 'Regular updates & maintenance',
          sekeltech: { status: 'supported', text: 'Monthly updates included' },
          others: { status: 'limited', text: 'Updates charged separately' }
        },
        {
          name: 'Content updates',
          sekeltech: { status: 'supported', text: 'Unlimited content updates' },
          others: { status: 'limited', text: 'Limited updates per month' }
        },
        {
          name: 'Performance monitoring',
          sekeltech: { status: 'supported', text: 'Real-time performance tracking' },
          others: { status: 'not-supported', text: 'Not included' }
        },
        {
          name: 'Security patches',
          sekeltech: { status: 'supported', text: 'Automatic security updates' },
          others: { status: 'limited', text: 'Manual security updates' }
        },
        {
          name: 'Uptime guarantee',
          sekeltech: { status: 'supported', text: '99.9% uptime SLA' },
          others: { status: 'limited', text: 'No uptime guarantee' }
        },
        {
          name: 'Hosting & domain management',
          sekeltech: { status: 'supported', text: 'Full hosting management included' },
          others: { status: 'limited', text: 'Basic hosting only' }
        }
      ]
    }
  ];

  return (
    <section
      id="website-comparison"
      className={`py-16 md:py-24 relative overflow-hidden ${theme === 'dark' ? 'bg-dark-bg' : 'bg-gradient-to-b from-gray-50 to-white'}`}
    >
      {/* Animated Background Elements */}
      <div className={`absolute inset-0 ${theme === 'dark' ? 'gradient-mesh' : 'gradient-mesh-light'}`} />
      <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-20 ${
        theme === 'dark' ? 'bg-electric-blue' : 'bg-accent-red'
      }`} />
      <div className={`absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-20 ${
        theme === 'dark' ? 'bg-electric-green' : 'bg-accent-blue'
      }`} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 md:mb-12"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className={`w-6 h-6 ${theme === 'dark' ? 'text-electric-green' : 'text-accent-red'}`} />
            <span className={`text-sm font-exo font-semibold uppercase tracking-wider ${
              theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
            }`}>
              Comparison
            </span>
          </div>
          <h2 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-orbitron font-bold mb-3 ${
            theme === 'dark' ? 'text-white' : 'text-black'
          }`}>
            Bring it on! Ready to{' '}
            <span className={theme === 'dark' ? 'text-electric-green' : 'text-accent-red'}>
              conquer
            </span>
          </h2>
          <h3 className={`text-2xl sm:text-3xl md:text-4xl font-orbitron font-bold mb-4 ${
            theme === 'dark' ? 'text-electric-blue' : 'text-accent-red'
          }`}>
            Nano Flows VS Other Website Development Services
          </h3>
          <p className={`text-base sm:text-lg font-exo max-w-3xl mx-auto leading-relaxed ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            What makes Nano Flows apart from other typical web development agencies and website service providers in the market.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className={`${theme === 'dark' ? 'bg-dark-card' : 'bg-white'} rounded-3xl p-4 sm:p-6 md:p-8 lg:p-10 shadow-2xl ${
            theme === 'dark' ? 'border border-electric-blue/20' : 'border border-gray-200'
          } w-full max-w-[80%] mx-auto`}
        >
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className={`p-4 md:p-6 text-left font-orbitron font-bold text-sm md:text-base border ${
                    theme === 'dark' 
                      ? 'bg-gradient-to-r from-electric-blue to-electric-green text-black border-gray-700' 
                      : 'bg-gradient-to-r from-accent-red to-accent-blue text-white border-gray-300'
                  } rounded-tl-xl`}>
                    Feature
                  </th>
                  <th className={`p-4 md:p-6 text-left font-orbitron font-bold text-sm md:text-base border ${
                    theme === 'dark' 
                      ? 'bg-gradient-to-r from-electric-blue to-electric-green text-black border-gray-700' 
                      : 'bg-gradient-to-r from-accent-red to-accent-blue text-white border-gray-300'
                  }`}>
                  Nano Flows
                  </th>
                  <th className={`p-4 md:p-6 text-left font-orbitron font-bold text-sm md:text-base border ${
                    theme === 'dark' 
                      ? 'bg-gray-700/80 text-white border-gray-600' 
                      : 'bg-gray-300 text-black border-gray-400'
                  } rounded-tr-xl`}>
                    Others
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((category, catIndex) => (
                  <React.Fragment key={catIndex}>
                    <tr>
                      <td
                        colSpan={3}
                        className={`p-4 md:p-5 font-orbitron font-bold text-base md:text-lg border ${
                          theme === 'dark' 
                            ? 'bg-dark-lighter text-electric-green border-gray-700' 
                            : 'bg-gradient-to-r from-gray-100 to-gray-50 text-accent-red border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-1 h-6 rounded-full ${
                            theme === 'dark' ? 'bg-electric-green' : 'bg-accent-red'
                          }`} />
                          {category.category}
                        </div>
                      </td>
                    </tr>
                    {category.features.map((feature, featIndex) => (
                      <motion.tr
                        key={featIndex}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: featIndex * 0.05 }}
                        className={`border-b ${
                          theme === 'dark' 
                            ? 'border-gray-700 hover:bg-dark-lighter/50' 
                            : 'border-gray-200 hover:bg-gray-50'
                        } transition-all duration-300`}
                      >
                        <td className={`p-4 md:p-5 font-exo font-medium text-sm md:text-base border-r ${
                          theme === 'dark' ? 'text-gray-200 border-gray-700' : 'text-gray-800 border-gray-300'
                        }`}>
                          {feature.name}
                        </td>
                        <td className={`p-4 md:p-5 border-r ${
                          theme === 'dark' 
                            ? 'bg-dark-lighter/50 border-gray-700' 
                            : 'bg-green-50/50 border-gray-300'
                        }`}>
                          <div className="flex items-center gap-3">
                            <StatusIcon status={feature.sekeltech.status} />
                            <span className={`font-exo text-xs md:text-sm leading-relaxed ${
                              theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                            }`}>
                              {feature.sekeltech.text}
                            </span>
                          </div>
                        </td>
                        <td className={`p-4 md:p-5 ${
                          theme === 'dark' 
                            ? 'bg-dark-lighter/30' 
                            : 'bg-red-50/30'
                        }`}>
                          <div className="flex items-center gap-3">
                            <StatusIcon status={feature.others.status} />
                            <span className={`font-exo text-xs md:text-sm leading-relaxed ${
                              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                              {feature.others.text}
                            </span>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-6">
            {comparisonData.map((category, catIndex) => (
              <motion.div
                key={catIndex}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: catIndex * 0.1 }}
                className={`rounded-2xl overflow-hidden ${
                  theme === 'dark' ? 'bg-dark-lighter border border-electric-blue/20' : 'bg-gray-50 border border-gray-200'
                }`}
              >
                <div className={`p-4 font-orbitron font-bold text-lg ${
                  theme === 'dark' 
                    ? 'bg-gradient-to-r from-electric-blue/20 to-electric-green/20 text-electric-green' 
                    : 'bg-gradient-to-r from-accent-red/20 to-accent-blue/20 text-accent-red'
                }`}>
                  <div className="flex items-center gap-2">
                    <div className={`w-1 h-6 rounded-full ${
                      theme === 'dark' ? 'bg-electric-green' : 'bg-accent-red'
                    }`} />
                    {category.category}
                  </div>
                </div>
                <div className="p-4 space-y-4">
                  {category.features.map((feature, featIndex) => (
                    <motion.div
                      key={featIndex}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: featIndex * 0.05 }}
                      className={`p-4 rounded-xl ${
                        theme === 'dark' ? 'bg-dark-card' : 'bg-white'
                      } shadow-md`}
                    >
                      <h4 className={`font-exo font-semibold text-sm mb-3 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {feature.name}
                      </h4>
                      <div className="space-y-3">
                        <div className={`flex items-start gap-3 p-3 rounded-lg ${
                          theme === 'dark' ? 'bg-dark-lighter/50' : 'bg-green-50'
                        }`}>
                          <div className="mt-0.5">
                            <StatusIcon status={feature.sekeltech.status} />
                          </div>
                          <div className="flex-1">
                            <p className={`text-xs font-exo font-semibold mb-1 ${
                              theme === 'dark' ? 'text-electric-green' : 'text-green-700'
                            }`}>
                              Nano Flows
                            </p>
                            <p className={`text-xs font-exo leading-relaxed ${
                              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                              {feature.sekeltech.text}
                            </p>
                          </div>
                        </div>
                        <div className={`flex items-start gap-3 p-3 rounded-lg ${
                          theme === 'dark' ? 'bg-dark-lighter/30' : 'bg-red-50'
                        }`}>
                          <div className="mt-0.5">
                            <StatusIcon status={feature.others.status} />
                          </div>
                          <div className="flex-1">
                            <p className={`text-xs font-exo font-semibold mb-1 ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              Others
                            </p>
                            <p className={`text-xs font-exo leading-relaxed ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              {feature.others.text}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Footer Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className={`mt-8 md:mt-10 p-6 md:p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 ${
              theme === 'dark' 
                ? 'bg-gradient-to-r from-dark-lighter to-dark-card border border-electric-blue/30' 
                : 'bg-gradient-to-r from-gray-100 to-gray-50 border border-accent-red/30'
            } shadow-lg`}
          >
            <p className={`font-exo font-bold text-base md:text-lg text-center md:text-left ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Website without all these.
            </p>
            <ArrowRight className={`w-6 h-6 md:w-8 md:h-8 flex-shrink-0 transform transition-transform hover:translate-x-2 ${
              theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
            }`} />
            <p className={`font-exo font-bold text-base md:text-lg text-center md:text-right ${
              theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
            }`}>
              If you don&apos;t have all these you don&apos;t truly have a professional website.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default WebsiteComparison;

