import { useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { FiCheckCircle, FiArrowRight, FiDownload } from 'react-icons/fi';
import { motion } from 'framer-motion';
import SEO from '../../components/SEO';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const courseId = searchParams.get('course_id');
  const orderId = searchParams.get('order_id');

  return (
    <>
      <SEO
        title="Payment Successful | NanoFlows Academy"
        description="Your payment was successful. Access your course and start learning immediately."
        keywords="payment success, course enrollment, payment confirmed, academy payment"
      />
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-xl border-2 p-8 text-center ${
            theme === 'dark' ? 'bg-dark-card border-gray-700' : 'bg-white border-gray-200'
          }`}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
              theme === 'dark' ? 'bg-electric-green/20' : 'bg-green-100'
            }`}
          >
            <FiCheckCircle className={theme === 'dark' ? 'text-electric-green' : 'text-green-600'} size={48} />
          </motion.div>

          <h1 className={`text-3xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Payment Successful!
          </h1>
          
          <p className={`text-lg mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Thank you for your purchase. You now have access to the course.
          </p>

          {orderId && (
            <p className={`text-sm mb-6 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
              Order ID: <span className="font-mono">{orderId}</span>
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {courseId && (
              <Link
                to={`/academy/player/${courseId}`}
                className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${
                  theme === 'dark'
                    ? 'bg-electric-green text-black hover:bg-electric-blue hover:shadow-lg hover:shadow-electric-green/50'
                    : 'bg-accent-red text-white hover:bg-accent-blue hover:shadow-lg hover:shadow-accent-red/50'
                }`}
              >
                Start Learning
                <FiArrowRight />
              </Link>
            )}
            <Link
              to="/academy/dashboard"
              className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold transition-all border-2 ${
                theme === 'dark'
                  ? 'border-gray-700 text-gray-300 hover:bg-gray-800'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
            >
              Go to Dashboard
            </Link>
          </div>
        </motion.div>
      </div>
      </div>
    </>
  );
};

export default PaymentSuccess;

