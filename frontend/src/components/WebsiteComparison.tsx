import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Check, X, Minus, ArrowRight, Sparkles, Star, Trophy, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const WebsiteComparison = () => {
  const { theme } = useTheme();

  const StatusIcon = ({ status }: { status: string }) => {
    if (status === 'supported') {
      return (
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-emerald-500/30 to-green-500/30 ring-2 ring-emerald-500/50' 
            : 'bg-gradient-to-br from-emerald-100 to-green-100 ring-2 ring-emerald-500/30'
        } backdrop-blur-sm shadow-lg transition-all duration-300 hover:scale-110`}>
          <Check className={`w-5 h-5 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'} stroke-[3]`} />
        </div>
      );
    } else if (status === 'not-supported') {
      return (
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-red-500/30 to-rose-500/30 ring-2 ring-red-500/50' 
            : 'bg-gradient-to-br from-red-100 to-rose-100 ring-2 ring-red-500/30'
        } backdrop-blur-sm shadow-lg transition-all duration-300 hover:scale-110`}>
          <X className={`w-5 h-5 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'} stroke-[3]`} />
        </div>
      );
    } else {
      return (
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-amber-500/30 to-yellow-500/30 ring-2 ring-amber-500/50' 
            : 'bg-gradient-to-br from-amber-100 to-yellow-100 ring-2 ring-amber-500/30'
        } backdrop-blur-sm shadow-lg transition-all duration-300 hover:scale-110`}>
          <Minus className={`w-5 h-5 ${theme === 'dark' ? 'text-amber-400' : 'text-amber-600'} stroke-[3]`} />
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
                  <th className={`p-6 text-left font-orbitron font-bold text-base relative overflow-hidden ${
                    theme === 'dark' 
                      ? 'bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 text-white' 
                      : 'bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 text-gray-900'
                  } rounded-tl-2xl border-b-2 ${theme === 'dark' ? 'border-electric-blue/50' : 'border-accent-red/50'}`}>
                    <div className="relative z-10 flex items-center gap-2">
                      <Star className={`w-5 h-5 ${theme === 'dark' ? 'text-electric-blue' : 'text-accent-red'}`} />
                      Feature
                    </div>
                  </th>
                  <th className={`p-6 text-center font-orbitron font-bold text-base relative overflow-hidden ${
                    theme === 'dark' 
                      ? 'bg-gradient-to-br from-electric-blue via-electric-green to-electric-blue text-slate-900' 
                      : 'bg-gradient-to-br from-accent-red via-rose-500 to-accent-red text-white'
                  } border-b-4 ${theme === 'dark' ? 'border-electric-green' : 'border-rose-600'} shadow-2xl`}>
                    <div className="relative z-10">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <Trophy className={`w-6 h-6 ${theme === 'dark' ? 'text-slate-900' : 'text-white'} animate-pulse`} />
                        <span className="text-lg">Nano Flows</span>
                        <Trophy className={`w-6 h-6 ${theme === 'dark' ? 'text-slate-900' : 'text-white'} animate-pulse`} />
                      </div>
                      <div className={`text-xs font-exo font-medium ${theme === 'dark' ? 'text-slate-800' : 'text-rose-100'}`}>
                        Premium Excellence
                      </div>
                    </div>
                    <div className={`absolute inset-0 ${
                      theme === 'dark' 
                        ? 'bg-gradient-to-r from-electric-blue/0 via-white/10 to-electric-blue/0' 
                        : 'bg-gradient-to-r from-white/0 via-white/20 to-white/0'
                    } animate-pulse`} />
                  </th>
                  <th className={`p-6 text-left font-orbitron font-bold text-base relative overflow-hidden ${
                    theme === 'dark' 
                      ? 'bg-gradient-to-br from-slate-700 via-slate-600 to-slate-700 text-gray-300' 
                      : 'bg-gradient-to-br from-gray-300 via-gray-200 to-gray-300 text-gray-700'
                  } rounded-tr-2xl border-b-2 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-400'}`}>
                    <div className="relative z-10">
                      Other Services
                    </div>
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
                        className={`border-b group ${
                          theme === 'dark' 
                            ? 'border-gray-700/50 hover:bg-slate-800/30' 
                            : 'border-gray-200 hover:bg-gray-50'
                        } transition-all duration-300`}
                      >
                        <td className={`p-5 font-exo font-semibold text-sm border-r ${
                          theme === 'dark' ? 'text-gray-100 border-gray-700/50' : 'text-gray-900 border-gray-300'
                        }`}>
                          <div className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${
                              theme === 'dark' ? 'bg-electric-blue' : 'bg-accent-red'
                            } group-hover:scale-150 transition-transform duration-300`} />
                            {feature.name}
                          </div>
                        </td>
                        <td className={`p-5 border-r relative ${
                          theme === 'dark' 
                            ? 'bg-gradient-to-r from-electric-blue/5 via-electric-green/5 to-electric-blue/5 border-electric-blue/20' 
                            : 'bg-gradient-to-r from-emerald-50/50 via-green-50 to-emerald-50/50 border-emerald-200'
                        } group-hover:shadow-lg transition-all duration-300`}>
                          <div className={`absolute inset-y-0 left-0 w-1 ${
                            theme === 'dark' ? 'bg-electric-green' : 'bg-emerald-500'
                          } opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                          <div className="flex items-center gap-4">
                            <StatusIcon status={feature.sekeltech.status} />
                            <span className={`font-exo text-sm font-medium leading-relaxed ${
                              theme === 'dark' ? 'text-gray-100' : 'text-gray-800'
                            }`}>
                              {feature.sekeltech.text}
                            </span>
                          </div>
                        </td>
                        <td className={`p-5 ${
                          theme === 'dark' 
                            ? 'bg-slate-900/20' 
                            : 'bg-gray-50/50'
                        }`}>
                          <div className="flex items-center gap-4">
                            <StatusIcon status={feature.others.status} />
                            <span className={`font-exo text-sm leading-relaxed ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
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
                className={`rounded-2xl overflow-hidden shadow-xl ${
                  theme === 'dark' ? 'bg-slate-800 border-2 border-electric-blue/30' : 'bg-white border-2 border-gray-200'
                }`}
              >
                <div className={`p-5 font-orbitron font-bold text-base relative overflow-hidden ${
                  theme === 'dark' 
                    ? 'bg-gradient-to-r from-electric-blue via-electric-green to-electric-blue text-slate-900' 
                    : 'bg-gradient-to-r from-accent-red via-rose-500 to-accent-red text-white'
                }`}>
                  <div className="relative z-10 flex items-center gap-3">
                    <Star className="w-5 h-5" />
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
                        theme === 'dark' ? 'bg-slate-900 border border-electric-blue/20' : 'bg-gray-50 border border-gray-200'
                      } shadow-lg hover:shadow-xl transition-all duration-300`}
                    >
                      <h4 className={`font-exo font-bold text-sm mb-4 flex items-center gap-2 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          theme === 'dark' ? 'bg-electric-green' : 'bg-accent-red'
                        }`} />
                        {feature.name}
                      </h4>
                      <div className="space-y-3">
                        <div className={`flex items-start gap-3 p-4 rounded-lg relative overflow-hidden ${
                          theme === 'dark' 
                            ? 'bg-gradient-to-r from-electric-blue/10 via-electric-green/10 to-electric-blue/10 border border-electric-green/30' 
                            : 'bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-50 border border-emerald-300'
                        }`}>
                          <div className={`absolute inset-y-0 left-0 w-1 ${
                            theme === 'dark' ? 'bg-electric-green' : 'bg-emerald-500'
                          }`} />
                          <div className="mt-0.5">
                            <StatusIcon status={feature.sekeltech.status} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Trophy className={`w-4 h-4 ${theme === 'dark' ? 'text-electric-green' : 'text-emerald-600'}`} />
                              <p className={`text-xs font-exo font-bold ${
                                theme === 'dark' ? 'text-electric-green' : 'text-emerald-700'
                              }`}>
                                Nano Flows
                              </p>
                            </div>
                            <p className={`text-xs font-exo leading-relaxed ${
                              theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                            }`}>
                              {feature.sekeltech.text}
                            </p>
                          </div>
                        </div>
                        <div className={`flex items-start gap-3 p-4 rounded-lg ${
                          theme === 'dark' ? 'bg-slate-800/50 border border-gray-700/50' : 'bg-gray-100 border border-gray-300'
                        }`}>
                          <div className="mt-0.5">
                            <StatusIcon status={feature.others.status} />
                          </div>
                          <div className="flex-1">
                            <p className={`text-xs font-exo font-semibold mb-1 ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              Other Services
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

          {/* Professional CTA Cards */}
          <div className="mt-10 space-y-6">
            {/* Warning Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={`relative overflow-hidden rounded-2xl p-8 ${
                theme === 'dark' 
                  ? 'bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 border-2 border-red-500/30' 
                  : 'bg-gradient-to-br from-red-50 via-rose-50 to-red-50 border-2 border-red-300'
              } shadow-2xl group hover:scale-[1.01] transition-all duration-300`}
            >
              <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20 ${
                theme === 'dark' ? 'bg-red-500' : 'bg-red-400'
              } group-hover:opacity-30 transition-opacity duration-500`} />
              
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${
                    theme === 'dark' 
                      ? 'bg-red-500/20 ring-2 ring-red-500/50' 
                      : 'bg-red-100 ring-2 ring-red-400/50'
                  } backdrop-blur-sm`}>
                    <X className={`w-8 h-8 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`} />
                  </div>
                  <div>
                    <h4 className={`font-orbitron font-bold text-xl mb-2 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      Missing These Features?
                    </h4>
                    <p className={`font-exo text-base leading-relaxed ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      A website without these essential features is just a digital placeholder,
                      <span className={`font-bold ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>
                        {' '}not a professional business asset.
                      </span>
                    </p>
                  </div>
                </div>
                <ArrowRight className={`w-8 h-8 flex-shrink-0 ${
                  theme === 'dark' ? 'text-red-400' : 'text-red-600'
                } transform group-hover:translate-x-2 transition-transform duration-300`} />
              </div>
            </motion.div>

            {/* Success Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className={`relative overflow-hidden rounded-2xl p-8 ${
                theme === 'dark' 
                  ? 'bg-gradient-to-br from-electric-blue/10 via-electric-green/10 to-electric-blue/10 border-2 border-electric-green/40' 
                  : 'bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-50 border-2 border-emerald-400'
              } shadow-2xl group hover:scale-[1.01] transition-all duration-300`}
            >
              <div className={`absolute top-0 left-0 w-64 h-64 rounded-full blur-3xl opacity-20 ${
                theme === 'dark' ? 'bg-electric-green' : 'bg-emerald-400'
              } group-hover:opacity-30 transition-opacity duration-500`} />
              
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`p-3 rounded-xl ${
                      theme === 'dark' 
                        ? 'bg-electric-green/20 ring-2 ring-electric-green/50' 
                        : 'bg-emerald-100 ring-2 ring-emerald-500/50'
                    } backdrop-blur-sm`}>
                      <Trophy className={`w-8 h-8 ${theme === 'dark' ? 'text-electric-green' : 'text-emerald-600'}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-orbitron font-bold text-xl mb-2 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        Get the Nano Flows Advantage
                      </h4>
                      <p className={`font-exo text-base leading-relaxed mb-4 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Experience true digital excellence with all premium features included.
                        Transform your online presence into a
                        <span className={`font-bold ${theme === 'dark' ? 'text-electric-green' : 'text-emerald-600'}`}>
                          {' '}powerful business growth engine.
                        </span>
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                          theme === 'dark' ? 'bg-slate-800/50' : 'bg-white'
                        } backdrop-blur-sm`}>
                          <Zap className={`w-4 h-4 ${theme === 'dark' ? 'text-electric-green' : 'text-emerald-600'}`} />
                          <span className={`font-exo text-sm font-medium ${
                            theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                          }`}>
                            All Features Included
                          </span>
                        </div>
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                          theme === 'dark' ? 'bg-slate-800/50' : 'bg-white'
                        } backdrop-blur-sm`}>
                          <Star className={`w-4 h-4 ${theme === 'dark' ? 'text-electric-green' : 'text-emerald-600'}`} />
                          <span className={`font-exo text-sm font-medium ${
                            theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                          }`}>
                            Premium Support
                          </span>
                        </div>
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                          theme === 'dark' ? 'bg-slate-800/50' : 'bg-white'
                        } backdrop-blur-sm`}>
                          <Trophy className={`w-4 h-4 ${theme === 'dark' ? 'text-electric-green' : 'text-emerald-600'}`} />
                          <span className={`font-exo text-sm font-medium ${
                            theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                          }`}>
                            Proven Results
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <a
                    href="/#contact"
                    className={`px-8 py-4 rounded-xl font-orbitron font-bold text-base flex items-center gap-3 shadow-2xl transform hover:scale-105 transition-all duration-300 ${
                      theme === 'dark'
                        ? 'bg-gradient-to-r from-electric-blue to-electric-green text-slate-900 hover:shadow-electric-green/50'
                        : 'bg-gradient-to-r from-accent-red to-rose-500 text-white hover:shadow-red-500/50'
                    }`}
                  >
                    Get Started Today
                    <ArrowRight className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WebsiteComparison;

