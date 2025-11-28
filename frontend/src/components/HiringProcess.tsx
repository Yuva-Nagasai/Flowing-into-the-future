import { motion } from 'framer-motion';
import { ClipboardCheck, FileSearch, Users, Briefcase, Handshake } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const steps = [
  {
    title: 'Share Your Talent Needs',
    description: 'Outline the roles, capabilities, delivery model, and timelines you want to cover.',
    icon: ClipboardCheck
  },
  {
    title: 'Review Curated Shortlists',
    description: 'We send handpicked specialists—engineering, product, design, ops—matched to your goals.',
    icon: FileSearch
  },
  {
    title: 'Interview & Assess',
    description: 'Host collaborative interviews, workshops, or trial sprints to evaluate skills and chemistry.',
    icon: Users
  },
  {
    title: 'Align Engagement Model',
    description: 'Lock in dedicated pods, KPIs, SLAs, and security guardrails for a seamless partnership.',
    icon: Briefcase
  },
  {
    title: 'Launch & Scale',
    description: 'Kick off with structured onboarding, success rituals, and continuous velocity checkpoints.',
    icon: Handshake
  }
];

const HiringProcess = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <section className={`relative py-16 sm:py-20 ${isDark ? 'bg-dark-bg' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p
            className={`text-xs tracking-[0.5em] uppercase font-semibold mb-4 ${
              isDark ? 'text-electric-green' : 'text-accent-blue'
            }`}
          >
            Hiring Journey
          </p>
          <h2
            className={`text-3xl sm:text-4xl font-orbitron font-bold mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            How to Hire Dedicated Teams with NanoFlows
          </h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className={`${
            isDark ? 'bg-dark-card' : 'bg-white'
          } rounded-2xl p-8 lg:p-12 shadow-lg`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                whileHover={{
                  y: -10,
                  transition: { duration: 0.3 }
                }}
                className="text-center"
              >
                <motion.div
                  whileHover={{
                    scale: 1.08,
                    rotate: [0, -6, 6, 0],
                    transition: { duration: 0.5 }
                  }}
                  animate={{
                    boxShadow: isDark
                      ? [
                          '0 0 0px rgba(0,240,255,0)',
                          '0 0 20px rgba(0,240,255,0.35)',
                          '0 0 0px rgba(0,240,255,0)'
                        ]
                      : [
                          '0 0 0px rgba(235,50,50,0)',
                          '0 0 20px rgba(235,50,50,0.25)',
                          '0 0 0px rgba(235,50,50,0)'
                        ]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: index * 0.4
                  }}
                  className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border ${
                    isDark
                      ? 'bg-electric-blue/10 text-electric-blue border-electric-blue/40'
                      : 'bg-accent-red/10 text-accent-red border-accent-red/40'
                  }`}
                >
                  <Icon size={32} strokeWidth={1.5} />
                </motion.div>
                <motion.h4
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className={`text-lg sm:text-xl font-orbitron font-bold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {step.title}
                </motion.h4>
              </motion.div>
            );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HiringProcess;

