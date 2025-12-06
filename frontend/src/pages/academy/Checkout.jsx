import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { coursesAPI, paymentsAPI } from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { FiArrowLeft, FiLock, FiCreditCard, FiCheckCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';
import SEO from '../../components/SEO';

// Load Razorpay script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve();
    script.onerror = () => resolve(); // Resolve anyway to prevent blocking
    document.body.appendChild(script);
  });
};

const Checkout = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  useEffect(() => {
    loadRazorpayScript().then(() => setRazorpayLoaded(true));
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const response = await coursesAPI.getById(id);
      const courseData = response.data.course;
      setCourse(courseData);
      
      // If course is free, enroll directly without payment
      if (courseData.free) {
        handleFreeEnrollment();
      }
    } catch (error) {
      console.error('Error fetching course:', error);
      navigate('/academy/dashboard?tab=courses');
    } finally {
      setLoading(false);
    }
  };

  const handleFreeEnrollment = async () => {
    setProcessing(true);
    try {
      // Create free purchase
      const response = await paymentsAPI.enrollFree({ course_id: id });
      navigate(`/academy/payment/success?course_id=${id}&free=true`);
    } catch (error) {
      console.error('Free enrollment error:', error);
      alert(error.response?.data?.error || 'Error enrolling in free course');
      setProcessing(false);
    }
  };

  const handlePayment = async () => {
    if (!razorpayLoaded || !window.Razorpay) {
      alert('Payment gateway is loading. Please wait a moment and try again.');
      return;
    }

    setProcessing(true);
    try {
      // Create order on backend
      const orderResponse = await paymentsAPI.createOrder({
        course_id: id,
        amount: course.price
      });

      const order = orderResponse.data.order;
      const razorpayOrder = orderResponse.data.razorpay_order;

      // Initialize Razorpay checkout
      const options = {
        key: razorpayOrder.key_id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'NanoFlows Academy',
        description: course.title,
        order_id: razorpayOrder.id,
        handler: async function (response) {
          // Verify payment on backend
          try {
            await paymentsAPI.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              course_id: id
            });

            // Redirect to success page
            navigate(`/academy/payment/success?course_id=${id}&order_id=${response.razorpay_order_id}`);
          } catch (error) {
            console.error('Payment verification failed:', error);
            navigate(`/academy/payment/failed?error=${encodeURIComponent(error.response?.data?.error || 'Payment verification failed')}`);
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: ''
        },
        theme: {
          color: theme === 'dark' ? '#00E881' : '#EB3232'
        },
        modal: {
          ondismiss: function() {
            setProcessing(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', function (response) {
        navigate(`/academy/payment/failed?error=${encodeURIComponent(response.error.description || 'Payment failed')}`);
      });

      razorpay.open();
      setProcessing(false);
    } catch (error) {
      console.error('Error initiating payment:', error);
      alert(error.response?.data?.error || 'Failed to initiate payment');
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'}`}>
        <div className={`text-xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Loading checkout...</div>
      </div>
    );
  }

  if (!course) {
    return null;
  }

  return (
    <>
      <SEO
        title={course ? `Checkout: ${course.title} | NanoFlows Academy` : 'Checkout | NanoFlows Academy'}
        description="Complete your course purchase securely. Choose your payment method and start learning."
        keywords="checkout, course purchase, payment, enroll, academy checkout"
      />
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'}`}>
        {/* Header */}
        <header className={`sticky top-0 z-50 border-b backdrop-blur-md ${
        theme === 'dark' 
          ? 'border-gray-800/50 bg-dark-card/90' 
          : 'border-gray-200/50 bg-white/90'
      }`}>
        <div className="container mx-auto px-4 py-4">
          <Link
            to="/academy/dashboard?tab=courses"
            className={`inline-flex items-center gap-2 transition-colors ${
              theme === 'dark' ? 'text-gray-400 hover:text-electric-green' : 'text-gray-600 hover:text-accent-red'
            }`}
          >
            <FiArrowLeft /> Back to Courses
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course Summary */}
          <div className="lg:col-span-2">
            <div className={`rounded-xl border-2 p-6 mb-6 ${
              theme === 'dark' ? 'bg-dark-card border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <h2 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Course Summary
              </h2>
              <div className="flex gap-4">
                <img
                  src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3'}
                  alt={course.title}
                  className="w-32 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {course.title}
                  </h3>
                  <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {course.category}
                  </p>
                  <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Instructor: {course.instructor_name}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Security */}
            <div className={`rounded-xl border-2 p-6 ${
              theme === 'dark' ? 'bg-dark-card border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <div className="flex items-start gap-3">
                <FiLock className={`mt-1 ${theme === 'dark' ? 'text-electric-green' : 'text-accent-red'}`} size={24} />
                <div>
                  <h3 className={`font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Secure Payment
                  </h3>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Your payment is secured by Razorpay. We never store your payment details.
                  </p>
                  <div className="flex items-center gap-2 mt-4">
                    <FiCheckCircle className={theme === 'dark' ? 'text-electric-green' : 'text-green-600'} />
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      SSL Encrypted
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className={`rounded-xl border-2 p-6 sticky top-24 ${
              theme === 'dark' ? 'bg-dark-card border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <h2 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Order Summary
              </h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Price</span>
                  <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    ₹{course.price}
                  </span>
                </div>
                <div className={`border-t pt-3 flex justify-between items-center ${
                  theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Total
                  </span>
                  <span className={`text-2xl font-bold ${
                    theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                  }`}>
                    ₹{course.price}
                  </span>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={processing || !razorpayLoaded}
                className={`w-full py-4 rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                  processing || !razorpayLoaded
                    ? 'opacity-50 cursor-not-allowed'
                    : theme === 'dark'
                      ? 'bg-electric-green text-black hover:bg-electric-blue hover:shadow-lg hover:shadow-electric-green/50'
                      : 'bg-accent-red text-white hover:bg-accent-blue hover:shadow-lg hover:shadow-accent-red/50'
                }`}
              >
                {processing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <FiCreditCard />
                    Pay ₹{course.price}
                  </>
                )}
              </button>

              {!razorpayLoaded && (
                <p className={`text-xs text-center mt-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                  Loading payment gateway...
                </p>
              )}

              <p className={`text-xs text-center mt-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                By completing this purchase, you agree to our Terms of Service
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default Checkout;

