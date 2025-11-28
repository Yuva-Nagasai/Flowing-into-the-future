import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Careers from '../components/Careers';
import HiringProcess from '../components/HiringProcess';

const CareersPage = () => {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-[#030b1f]' : 'bg-white'}`}>
      <Header />
      <main className="flex-1 pt-24 lg:pt-32">
        <section className={`relative ${theme === 'dark' ? 'bg-[#030b1f]' : 'bg-white'}`}>
          <div className="container mx-auto px-6 py-8 lg:py-12">
            {/* Main Content Section */}
            <div className="mb-8 lg:mb-12">
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                {/* Left: Heading */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  className="flex-1"
                >
                  <h1
                    className={`text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold leading-tight ${
                      theme === 'dark' ? 'text-white' : 'text-black'
                    }`}
                    style={{ fontFamily: 'Orbitron, sans-serif' }}
                  >
                    Become a part of{' '}
                    <span className={theme === 'dark' ? 'text-electric-green' : 'text-accent-red'}>
                      NanoFlows AI Software Technologies
                    </span>
                  </h1>
                </motion.div>

                {/* Right: Body Text with Vertical Divider */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="flex-1 flex items-start gap-6 lg:gap-8"
                >
                  {/* Vertical Divider */}
                  <div
                    className={`w-0.5 h-full min-h-[120px] ${
                      theme === 'dark' ? 'bg-electric-blue/40' : 'bg-accent-red/60'
                    }`}
                  />
                  
                  {/* Body Text */}
                  <p
                    className={`text-xs sm:text-sm lg:text-base font-exo leading-relaxed ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    At NanoFlows AI Software Technologies, we welcome curious builders ready to move the digital world forward. Strategists, designers, engineers, and marketers thrive here when they crave real-world impact, continuous learning, and a collaborative culture.
                  </p>
                </motion.div>
              </div>
            </div>

            {/* Large Image Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="w-full"
            >
              <img
                src="/nanoflows-image.png"
                alt="NanoFlows Team Collaboration"
                className="w-full h-auto rounded-2xl lg:rounded-3xl object-cover shadow-lg"
                style={{ maxHeight: '600px' }}
              />
            </motion.div>
          </div>
        </section>

        <Careers />
        <HiringProcess />
      </main>
      <Footer />
    </div>
  );
};

export default CareersPage;

