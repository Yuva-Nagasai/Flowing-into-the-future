import { useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { WebsiteAuthProvider } from './contexts/WebsiteAuthContext';
import { AIToolsAuthProvider } from './contexts/AIToolsAuthContext';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import WebsiteComparison from './components/WebsiteComparison';
import Features from './components/Features';
import CaseStudy from './components/CaseStudy';
import Careers from './components/Careers';
import Footer from './components/Footer';
import AIChat from './components/AIChat';
import SocialMediaBar from './components/SocialMediaBar';
import FloatingContactWidget from './components/FloatingContactWidget';
import EducationDashboard from './components/EducationDashboard';
import { PageTransition } from './components/animations';
import SEO from './components/SEO';
import CareersPage from './pages/CareersPage';
import ContactPage from './pages/ContactPage';

import Login from './pages/academy/Login';
import Signup from './pages/academy/Signup';
import WebsiteLogin from './pages/WebsiteLogin';
import WebsiteSignup from './pages/WebsiteSignup';
import CourseDetails from './pages/academy/CourseDetails';
import UserDashboard from './pages/academy/UserDashboard';
import CoursePlayerEnhanced from './pages/academy/CoursePlayerEnhanced';
import Profile from './pages/academy/Profile';
import Checkout from './pages/academy/Checkout';
import PaymentSuccess from './pages/academy/PaymentSuccess';
import PaymentFailed from './pages/academy/PaymentFailed';
import AdminDashboard from './pages/academy/AdminDashboard';
import AdminCourseForm from './pages/academy/AdminCourseForm';
import AdminCourseContentManagement from './pages/academy/AdminCourseContentManagement';
import AdminStudentManagement from './pages/academy/AdminStudentManagement';
import AdminPaymentManagement from './pages/academy/AdminPaymentManagement';
import AdminCertificateManagement from './pages/academy/AdminCertificateManagement';
import AdminNotificationManagement from './pages/academy/AdminNotificationManagement';
import AdminJobsManagement from './pages/academy/AdminJobsManagement';
import AdminJobForm from './pages/academy/AdminJobForm';
import AdminAIToolsManagement from './pages/academy/AdminAIToolsManagement';
import AdminAboutManagement from './pages/academy/AdminAboutManagement';
import AdminHeroSlides from './pages/academy/AdminHeroSlides';
import AdminAIToolForm from './pages/academy/AdminAIToolForm';
import ProtectedRoute from './components/academy/ProtectedRoute';
import AISolutions from './pages/products/AISolutions';
import CloudPlatform from './pages/products/CloudPlatform';
import AnalyticsTools from './pages/products/AnalyticsTools';
import MobileApps from './pages/products/MobileApps';
import APIServices from './pages/products/APIServices';
import GetDiscovery from './pages/products/GetDiscovery';
import UnifiedDataPlatform from './pages/products/UnifiedDataPlatform';
import DemandGeneration from './pages/products/DemandGeneration';
import ProductItemDetail from './pages/products/ProductItemDetail';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import TermsOfService from './pages/legal/TermsOfService';
import CookiePolicy from './pages/legal/CookiePolicy';
import Security from './pages/legal/Security';
import Compliance from './pages/legal/Compliance';
import ServicesPage from './pages/ServicesPage';
import HowItWorks from './pages/HowItWorks';
import IndustryDetail from './pages/industries/IndustryDetail';
import CourseListing from './pages/CourseListing';
import ELearningHome from './pages/elearning/ELearningHome';
import ELearningAboutPage from './pages/elearning/AboutPage';
import JobsPage from './pages/elearning/JobsPage';
import ELearningContactPage from './pages/elearning/ContactPage';
import MasterclassPage from './pages/elearning/MasterclassPage';
import MahakumbhPage from './pages/elearning/MahakumbhPage';
import FreebiesPage from './pages/elearning/FreebiesPage';
import BlogPage from './pages/elearning/BlogPage';
import InternshipPage from './pages/elearning/InternshipPage';
import CertificatePage from './pages/elearning/CertificatePage';
import EventsPage from './pages/elearning/EventsPage';
import AIToolsHome from './pages/aitools/AIToolsHome';
import AIToolsExplore from './pages/aitools/AIToolsExplore';
import AIToolDetail from './pages/aitools/AIToolDetail';
import AIToolsAbout from './pages/aitools/AIToolsAbout';
import AIToolsBlog from './pages/aitools/AIToolsBlog';
import AIToolsContact from './pages/aitools/AIToolsContact';
import AIToolsLogin from './pages/aitools/AIToolsLogin';
import AIToolsSignup from './pages/aitools/AIToolsSignup';
import ShopLayout from './components/shop/ShopLayout';
import ShopProtectedRoute from './components/shop/ShopProtectedRoute';
import ShopHome from './pages/shop/ShopHome';
import ShopProducts from './pages/shop/ShopProducts';
import ShopProductDetail from './pages/shop/ShopProductDetail';
import ShopCart from './pages/shop/ShopCart';
import ShopCheckout from './pages/shop/ShopCheckout';
import ShopLogin from './pages/shop/ShopLogin';
import ShopRegister from './pages/shop/ShopRegister';
import ShopForgotPassword from './pages/shop/ShopForgotPassword';
import ShopResetPassword from './pages/shop/ShopResetPassword';
import ShopAccount from './pages/shop/ShopAccount';
import ShopOrders from './pages/shop/ShopOrders';
import ShopOrderDetail from './pages/shop/ShopOrderDetail';
import ShopOrderSuccess from './pages/shop/ShopOrderSuccess';
import ShopCategories from './pages/shop/ShopCategories';
import ShopCategoryProducts from './pages/shop/ShopCategoryProducts';
import ShopDeals from './pages/shop/ShopDeals';
import ShopAbout from './pages/shop/ShopAbout';
import ShopContact from './pages/shop/ShopContact';
import Shop404 from './pages/shop/Shop404';
import ShopAdminDashboard from './pages/shop/admin/ShopAdminDashboard';
import ShopAdminProducts from './pages/shop/admin/ShopAdminProducts';
import ShopAdminCategories from './pages/shop/admin/ShopAdminCategories';
import ShopAdminOrders from './pages/shop/admin/ShopAdminOrders';
import ShopAdminReviews from './pages/shop/admin/ShopAdminReviews';
import ShopAdminDeals from './pages/shop/admin/ShopAdminDeals';
import ShopAdminAnnouncements from './pages/shop/admin/ShopAdminAnnouncements';
import ShopAdminTestimonials from './pages/shop/admin/ShopAdminTestimonials';
import ShopAdminNewsletter from './pages/shop/admin/ShopAdminNewsletter';
import ShopAdminProductRequests from './pages/shop/admin/ShopAdminProductRequests';
import ShopWishlist from './pages/shop/ShopWishlist';
import ShopBlog from './pages/shop/ShopBlog';

function AnimatedRoutes() {
  const location = useLocation();

  // Scroll to top on route change (for non-anchor pages)
  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [location.pathname, location.hash]);

  const showFloatingContact = useMemo(() => {
    // Hide floating contact on home, contact pages, Academy, e-learning, AI tools, and shop sections
    const hiddenExactPaths = ['/', '/contact', '/elearning/contact'];
    if (hiddenExactPaths.includes(location.pathname)) return false;

    const hiddenPrefixes = ['/academy', '/elearning', '/aitools', '/ai-tools', '/shop'];
    if (hiddenPrefixes.some((prefix) => location.pathname.startsWith(prefix))) return false;

    // Hide on all login and signup pages
    const loginSignupPaths = ['/login', '/signup', '/academy/login', '/academy/signup', '/ai-tools/login', '/ai-tools/signup', '/shop/login', '/shop/register'];
    if (loginSignupPaths.includes(location.pathname)) return false;

    return true;
  }, [location.pathname]);

  const showAIChat = useMemo(() => {
    // Hide AI Chat on all login and signup pages
    const loginSignupPaths = ['/login', '/signup', '/academy/login', '/academy/signup', '/ai-tools/login', '/ai-tools/signup', '/shop/login', '/shop/register'];
    return !loginSignupPaths.includes(location.pathname);
  }, [location.pathname]);

  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* ✅ Main Home Page Route */}
          <Route
            path="/"
            element={
              <PageTransition>
                <>
                  <SEO
                    title="Home | NanoFlows - Futuristic AI Solutions & Digital Hub"
                    description="Transform your business with cutting-edge AI solutions, automation tools, and digital services. Explore Academy courses, AI Tools platform, and digital products."
                    keywords="AI solutions, automation, digital transformation, machine learning, business automation, AI tools, e-learning, digital products"
                  />
                  <div className="relative min-h-screen flex flex-col bg-white dark:bg-dark-bg transition-colors duration-300 w-full max-w-full overflow-x-hidden">
                    <Header />
                    <div className="pt-24 lg:pt-32">
                      <SocialMediaBar />
                      <Hero />
                      <About />
                      <WebsiteComparison />
                      <Features />
                      <CaseStudy />
                      <Careers />
                      <Footer />
                    </div>
                  </div>
                </>
              </PageTransition>
            }
          />

          {/* Website Auth - separate from Academy */}
          <Route
            path="/login"
            element={
              <PageTransition>
                <>
                  <SEO
                    title="Sign In | NanoFlows"
                    description="Sign in to your NanoFlows account to access Academy courses, AI Tools platform, and digital products."
                    keywords="login, sign in, account, authentication"
                  />
                  <WebsiteLogin />
                </>
              </PageTransition>
            }
          />
          <Route
            path="/signup"
            element={
              <PageTransition>
                <>
                  <SEO
                    title="Sign Up | NanoFlows"
                    description="Create your NanoFlows account to access Academy courses, AI Tools platform, and digital products."
                    keywords="sign up, register, create account, signup"
                  />
                  <WebsiteSignup />
                </>
              </PageTransition>
            }
          />

          {/* Services Page Route */}
          <Route
            path="/services"
            element={
              <PageTransition>
                <>
                  <SEO
                    title="Services | NanoFlows"
                    description="Comprehensive AI solutions, automation services, and digital transformation consulting for your business."
                    keywords="AI services, automation, consulting, digital transformation, business solutions"
                  />
                  <ServicesPage />
                </>
              </PageTransition>
            }
          />

          {/* How it Works Page Route */}
          <Route
            path="/how-it-works"
            element={
              <PageTransition>
                <>
                  <SEO
                    title="How It Works | NanoFlows"
                    description="Learn how NanoFlows helps businesses transform with AI solutions and automation tools."
                    keywords="how it works, process, methodology, business transformation"
                  />
                  <HowItWorks />
                </>
              </PageTransition>
            }
          />

          <Route
            path="/careers"
            element={
              <PageTransition>
                <>
                  <SEO
                    title="Careers | NanoFlows"
                    description="Join the NanoFlows team and build the future of AI and automation. Explore career opportunities."
                    keywords="careers, jobs, employment, hiring, opportunities"
                  />
                  <CareersPage />
                </>
              </PageTransition>
            }
          />
          <Route
            path="/contact"
            element={
              <PageTransition>
                <>
                  <SEO
                    title="Contact Us | NanoFlows"
                    description="Get in touch with NanoFlows. Contact our team for inquiries, support, or partnership opportunities."
                    keywords="contact, support, inquiry, help, get in touch"
                  />
                  <ContactPage />
                </>
              </PageTransition>
            }
          />

          <Route
            path="/industries/:slug"
            element={
              <PageTransition>
                <>
                  <SEO
                    title="Industry Solutions | NanoFlows"
                    description="Industry-specific AI solutions and automation tools tailored to your business needs."
                    keywords="industry solutions, sector-specific, business automation"
                  />
                  <IndustryDetail />
                </>
              </PageTransition>
            }
          />


          {/* ✅ Education Dashboard Route */}
          <Route
            path="/educationdashboard"
            element={
              <PageTransition>
                <>
                  <SEO
                    title="Education Dashboard | NanoFlows"
                    description="Access your learning dashboard and track your progress across courses and certifications."
                    keywords="education dashboard, learning, courses, progress"
                  />
                  <div className="relative min-h-screen flex flex-col bg-white dark:bg-dark-bg transition-colors duration-300 w-full max-w-full overflow-x-hidden">
                    <EducationDashboard />
                  </div>
                </>
              </PageTransition>
            }
          />

          {/* ✅ E-Learning Landing Route */}
          <Route
            path="/elearning"
            element={
              <PageTransition>
                <>
                  <SEO
                    title="E-Learning Platform | NanoFlows Academy"
                    description="Explore comprehensive e-learning courses, certifications, and training programs on NanoFlows Academy."
                    keywords="e-learning, online courses, training, education, learning platform"
                  />
                  <ELearningHome />
                </>
              </PageTransition>
            }
          />

          {/* E-Learning Login Redirect */}
          <Route
            path="/elearning/login"
            element={<Navigate to="/academy/login" replace />}
          />

          {/* E-Learning About Page */}
          <Route
            path="/elearning/about"
            element={
              <PageTransition>
                <>
                  <SEO
                    title="About | NanoFlows Academy"
                    description="Learn about NanoFlows Academy - your gateway to professional development and skill enhancement."
                    keywords="about academy, e-learning, education platform"
                  />
                  <ELearningAboutPage />
                </>
              </PageTransition>
            }
          />

          {/* E-Learning Courses Page */}
          <Route
            path="/elearning/courses"
            element={
              <PageTransition>
                <>
                  <SEO
                    title="Courses | NanoFlows Academy"
                    description="Browse our comprehensive catalog of online courses and training programs."
                    keywords="courses, online courses, training programs, education"
                  />
                  <JobsPage />
                </>
              </PageTransition>
            }
          />

          {/* E-Learning Contact Page */}
          <Route
            path="/elearning/contact"
            element={
              <PageTransition>
                <>
                  <SEO
                    title="Contact | NanoFlows Academy"
                    description="Get in touch with NanoFlows Academy for course inquiries and support."
                    keywords="contact academy, support, inquiry"
                  />
                  <ELearningContactPage />
                </>
              </PageTransition>
            }
          />

          {/* E-Learning Masterclass Page */}
          <Route
            path="/elearning/masterclass"
            element={
              <PageTransition>
                <>
                  <SEO
                    title="Masterclass | NanoFlows Academy"
                    description="Join expert-led masterclasses and advanced training sessions."
                    keywords="masterclass, advanced training, expert courses"
                  />
                  <MasterclassPage />
                </>
              </PageTransition>
            }
          />

          {/* E-Learning Mahakumbh Page */}
          <Route
            path="/elearning/mahakumbh"
            element={
              <PageTransition>
                <>
                  <SEO
                    title="Mahakumbh | NanoFlows Academy"
                    description="Explore Mahakumbh learning programs and special training initiatives."
                    keywords="mahakumbh, special programs, training initiatives"
                  />
                  <MahakumbhPage />
                </>
              </PageTransition>
            }
          />

          {/* E-Learning Freebies Page */}
          <Route
            path="/elearning/freebies"
            element={
              <PageTransition>
                <>
                  <SEO
                    title="Free Resources | NanoFlows Academy"
                    description="Access free learning resources, templates, and educational materials."
                    keywords="free resources, free courses, learning materials"
                  />
                  <FreebiesPage />
                </>
              </PageTransition>
            }
          />

          {/* E-Learning Blog Page */}
          <Route
            path="/elearning/blog"
            element={
              <PageTransition>
                <>
                  <SEO
                    title="Blog | NanoFlows Academy"
                    description="Read articles, tips, and insights about learning, technology, and professional development."
                    keywords="blog, articles, learning tips, education blog"
                  />
                  <BlogPage />
                </>
              </PageTransition>
            }
          />

          {/* E-Learning Internship Page */}
          <Route
            path="/elearning/internship"
            element={
              <PageTransition>
                <>
                  <SEO
                    title="Internship Programs | NanoFlows Academy"
                    description="Apply for internship opportunities and gain hands-on experience."
                    keywords="internship, internships, career opportunities, work experience"
                  />
                  <InternshipPage />
                </>
              </PageTransition>
            }
          />

          {/* E-Learning Certificate Page */}
          <Route
            path="/elearning/certificate"
            element={
              <PageTransition>
                <>
                  <SEO
                    title="Certificates | NanoFlows Academy"
                    description="Earn industry-recognized certificates and validate your skills."
                    keywords="certificates, certifications, credentials, skill validation"
                  />
                  <CertificatePage />
                </>
              </PageTransition>
            }
          />

          {/* E-Learning Events Page */}
          <Route
            path="/elearning/events"
            element={
              <PageTransition>
                <>
                  <SEO
                    title="Events | NanoFlows Academy"
                    description="Join webinars, workshops, and educational events."
                    keywords="events, webinars, workshops, educational events"
                  />
                  <EventsPage />
                </>
              </PageTransition>
            }
          />

          {/* ✅ Course Listing Page Route */}
          <Route
            path="/courses"
            element={
              <PageTransition>
                <>
                  <SEO
                    title="Courses | NanoFlows"
                    description="Browse all available courses and training programs on NanoFlows Academy."
                    keywords="courses, course listing, training programs, online courses"
                  />
                  <CourseListing />
                </>
              </PageTransition>
            }
          />

          {/* ✅ AI Tools Platform Routes */}
          <Route
            path="/ai-tools"
            element={
              <PageTransition>
                <>
                  <SEO
                    title="AI Tools Platform | NanoFlows"
                    description="Discover powerful AI tools and automation solutions to enhance your workflow and productivity."
                    keywords="AI tools, automation tools, productivity tools, AI platform"
                  />
                  <div className="relative min-h-screen flex flex-col w-full max-w-full overflow-x-hidden">
                    <AIToolsHome />
                  </div>
                </>
              </PageTransition>
            }
          />
          <Route
            path="/ai-tools/explore"
            element={
              <PageTransition>
                <>
                  <SEO
                    title="Explore AI Tools | NanoFlows"
                    description="Browse our comprehensive collection of AI tools and automation solutions."
                    keywords="explore AI tools, AI tools catalog, automation solutions"
                  />
                  <div className="relative min-h-screen flex flex-col w-full max-w-full overflow-x-hidden">
                    <AIToolsExplore />
                  </div>
                </>
              </PageTransition>
            }
          />
          <Route
            path="/ai-tools/tool/:id"
            element={
              <PageTransition>
                <>
                  <SEO
                    title="AI Tool Details | NanoFlows"
                    description="Learn more about this AI tool and how it can help improve your workflow."
                    keywords="AI tool, tool details, automation tool"
                  />
                  <div className="relative min-h-screen flex flex-col w-full max-w-full overflow-x-hidden">
                    <AIToolDetail />
                  </div>
                </>
              </PageTransition>
            }
          />
          <Route
            path="/ai-tools/about"
            element={
              <PageTransition>
                <>
                  <SEO
                    title="About AI Tools | NanoFlows"
                    description="Learn about NanoFlows AI Tools platform and our mission to democratize AI."
                    keywords="about AI tools, AI platform, automation platform"
                  />
                  <div className="relative min-h-screen flex flex-col w-full max-w-full overflow-x-hidden">
                    <AIToolsAbout />
                  </div>
                </>
              </PageTransition>
            }
          />
          <Route
            path="/ai-tools/blog"
            element={
              <PageTransition>
                <>
                  <SEO
                    title="AI Tools Blog | NanoFlows"
                    description="Read articles, tutorials, and insights about AI tools and automation."
                    keywords="AI tools blog, automation blog, AI articles"
                  />
                  <div className="relative min-h-screen flex flex-col w-full max-w-full overflow-x-hidden">
                    <AIToolsBlog />
                  </div>
                </>
              </PageTransition>
            }
          />
          <Route
            path="/ai-tools/contact"
            element={
              <PageTransition>
                <>
                  <SEO
                    title="Contact AI Tools | NanoFlows"
                    description="Get in touch with the AI Tools team for support and inquiries."
                    keywords="contact AI tools, AI tools support"
                  />
                  <div className="relative min-h-screen flex flex-col w-full max-w-full overflow-x-hidden">
                    <AIToolsContact />
                  </div>
                </>
              </PageTransition>
            }
          />
          <Route
            path="/ai-tools/login"
            element={
              <PageTransition>
                <>
                  <SEO
                    title="Sign In | NanoFlows AI Tools"
                    description="Sign in to NanoFlows AI Tools to access powerful AI automation solutions and tools."
                    keywords="AI tools login, sign in, e-learning login"
                  />
                  <AIToolsLogin />
                </>
              </PageTransition>
            }
          />
          <Route
            path="/ai-tools/signup"
            element={
              <PageTransition>
                <>
                  <SEO
                    title="Sign Up | NanoFlows AI Tools"
                    description="Create your NanoFlows AI Tools account to start learning and earning certificates."
                    keywords="AI tools signup, register, create account"
                  />
                  <AIToolsSignup />
                </>
              </PageTransition>
            }
          />

          {/* ✅ Academy Routes */}
          <Route 
            path="/academy/login" 
            element={
              <>
                <SEO
                  title="Sign In | NanoFlows Academy"
                  description="Sign in to NanoFlows Academy to access courses, certificates, and learning resources."
                  keywords="academy login, sign in, e-learning login"
                />
                <Login />
              </>
            } 
          />
          <Route 
            path="/academy/signup" 
            element={
              <>
                <SEO
                  title="Sign Up | NanoFlows Academy"
                  description="Create your NanoFlows Academy account to start learning and earning certificates."
                  keywords="academy signup, register, create account"
                />
                <Signup />
              </>
            } 
          />
          <Route
            path="/academy/course/:id/learn"
            element={
              <ProtectedRoute>
                <CoursePlayerEnhanced />
              </ProtectedRoute>
            }
          />
          <Route
            path="/academy/course/:id"
            element={
              <ProtectedRoute>
                <CourseDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/academy/dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/academy/player/:id"
            element={
              <ProtectedRoute>
                <CoursePlayerEnhanced />
              </ProtectedRoute>
            }
          />
          <Route
            path="/academy/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/academy/checkout/:id"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/academy/payment/success"
            element={
              <ProtectedRoute>
                <PaymentSuccess />
              </ProtectedRoute>
            }
          />
          <Route
            path="/academy/payment/failed"
            element={
              <ProtectedRoute>
                <PaymentFailed />
              </ProtectedRoute>
            }
          />
          <Route
            path="/academy/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/academy/admin/create-course"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminCourseForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/academy/admin/edit-course/:id"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminCourseForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/academy/admin/course/:id/content"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminCourseContentManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/academy/admin/students"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminStudentManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/academy/admin/payments"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminPaymentManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/academy/admin/certificates"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminCertificateManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/academy/admin/notifications"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminNotificationManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/academy/admin/jobs"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminJobsManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/academy/admin/jobs/create"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminJobForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/academy/admin/jobs/edit/:id"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminJobForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/academy/admin/ai-tools"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminAIToolsManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/academy/admin/about"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminAboutManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/academy/admin/ai-tools/create"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminAIToolForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/academy/admin/ai-tools/edit/:id"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminAIToolForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/academy/admin/hero-slides"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminHeroSlides />
              </ProtectedRoute>
            }
          />

          {/* Product Pages */}
          <Route
            path="/products/ai-solutions"
            element={
              <PageTransition>
                <>
                  <SEO
                    title="AI Solutions | NanoFlows Products"
                    description="Comprehensive AI solutions for businesses - machine learning, automation, and intelligent systems."
                    keywords="AI solutions, machine learning, AI products, business AI"
                  />
                  <AISolutions />
                </>
              </PageTransition>
            }
          />
          <Route
            path="/products/cloud-platform"
            element={
              <PageTransition>
                <>
                  <SEO
                    title="Cloud Platform | NanoFlows Products"
                    description="Scalable cloud infrastructure and platform solutions for modern businesses."
                    keywords="cloud platform, cloud infrastructure, cloud solutions"
                  />
                  <CloudPlatform />
                </>
              </PageTransition>
            }
          />
          <Route
            path="/products/analytics-tools"
            element={
              <PageTransition>
                <>
                  <SEO
                    title="Analytics Tools | NanoFlows Products"
                    description="Advanced analytics and data visualization tools to drive data-driven decisions."
                    keywords="analytics tools, data analytics, business intelligence, data visualization"
                  />
                  <AnalyticsTools />
                </>
              </PageTransition>
            }
          />
          <Route
            path="/products/mobile-apps"
            element={
              <PageTransition>
                <>
                  <SEO
                    title="Mobile Apps | NanoFlows Products"
                    description="Custom mobile application development and mobile solutions for iOS and Android."
                    keywords="mobile apps, mobile development, iOS, Android, app development"
                  />
                  <MobileApps />
                </>
              </PageTransition>
            }
          />
          <Route
            path="/products/api-services"
            element={
              <PageTransition>
                <>
                  <SEO
                    title="API Services | NanoFlows Products"
                    description="Robust API development and integration services for seamless system connectivity."
                    keywords="API services, API development, API integration, REST APIs"
                  />
                  <APIServices />
                </>
              </PageTransition>
            }
          />
          <Route
            path="/products/get-discovery"
            element={
              <PageTransition>
                <>
                  <SEO
                    title="Get Discovery | NanoFlows Products"
                    description="Discovery and exploration tools to help businesses find the right solutions."
                    keywords="discovery tools, business discovery, solution finder"
                  />
                  <GetDiscovery />
                </>
              </PageTransition>
            }
          />
          <Route
            path="/products/unified-data-platform"
            element={
              <PageTransition>
                <>
                  <SEO
                    title="Unified Data Platform | NanoFlows Products"
                    description="Integrated data platform for unified data management and analytics across your organization."
                    keywords="data platform, unified data, data management, data integration"
                  />
                  <UnifiedDataPlatform />
                </>
              </PageTransition>
            }
          />
          <Route
            path="/products/demand-generation"
            element={
              <PageTransition>
                <>
                  <SEO
                    title="Demand Generation | NanoFlows Products"
                    description="AI-powered demand generation and lead generation solutions to grow your business."
                    keywords="demand generation, lead generation, marketing automation, sales enablement"
                  />
                  <DemandGeneration />
                </>
              </PageTransition>
            }
          />
          <Route
            path="/products/:category/:item"
            element={
              <PageTransition>
                <>
                  <SEO
                    title="Product Details | NanoFlows"
                    description="Learn more about this NanoFlows product and how it can benefit your business."
                    keywords="product details, product information, solutions"
                  />
                  <ProductItemDetail />
                </>
              </PageTransition>
            }
          />

          {/* Shop Routes - Single ShopAuthProvider wrapping all routes */}
          <Route path="/shop" element={<ShopLayout />}>
            <Route index element={<ShopHome />} />
            <Route path="products" element={<ShopProducts />} />
            <Route path="products/:slug" element={<ShopProductDetail />} />
            <Route path="cart" element={<ShopCart />} />
            <Route path="categories" element={<ShopCategories />} />
            <Route path="categories/:slug" element={<ShopCategoryProducts />} />
            <Route path="deals" element={<ShopDeals />} />
            <Route path="about" element={<ShopAbout />} />
            <Route path="blog" element={<ShopBlog />} />
            <Route path="contact" element={<ShopContact />} />
            <Route path="login" element={<ShopLogin />} />
            <Route path="register" element={<ShopRegister />} />
            <Route path="forgot-password" element={<ShopForgotPassword />} />
            <Route path="reset-password" element={<ShopResetPassword />} />
            <Route path="order-success" element={<ShopOrderSuccess />} />
            <Route path="checkout" element={<ShopProtectedRoute><ShopCheckout /></ShopProtectedRoute>} />
            <Route path="account" element={<ShopProtectedRoute><ShopAccount /></ShopProtectedRoute>} />
            <Route path="orders" element={<ShopProtectedRoute><ShopOrders /></ShopProtectedRoute>} />
            <Route path="orders/:orderNumber" element={<ShopProtectedRoute><ShopOrderDetail /></ShopProtectedRoute>} />
            <Route path="account/orders/:orderNumber" element={<ShopProtectedRoute><ShopOrderDetail /></ShopProtectedRoute>} />
            <Route path="admin" element={<ShopProtectedRoute adminOnly><ShopAdminDashboard /></ShopProtectedRoute>} />
            <Route path="admin/products" element={<ShopProtectedRoute adminOnly><ShopAdminProducts /></ShopProtectedRoute>} />
            <Route path="admin/categories" element={<ShopProtectedRoute adminOnly><ShopAdminCategories /></ShopProtectedRoute>} />
            <Route path="admin/orders" element={<ShopProtectedRoute adminOnly><ShopAdminOrders /></ShopProtectedRoute>} />
            <Route path="admin/reviews" element={<ShopProtectedRoute adminOnly><ShopAdminReviews /></ShopProtectedRoute>} />
            <Route path="admin/deals" element={<ShopProtectedRoute adminOnly><ShopAdminDeals /></ShopProtectedRoute>} />
            <Route path="admin/announcements" element={<ShopProtectedRoute adminOnly><ShopAdminAnnouncements /></ShopProtectedRoute>} />
            <Route path="admin/testimonials" element={<ShopProtectedRoute adminOnly><ShopAdminTestimonials /></ShopProtectedRoute>} />
            <Route path="admin/newsletter" element={<ShopProtectedRoute adminOnly><ShopAdminNewsletter /></ShopProtectedRoute>} />
            <Route path="admin/product-requests" element={<ShopProtectedRoute adminOnly><ShopAdminProductRequests /></ShopProtectedRoute>} />
            <Route path="wishlist" element={<ShopProtectedRoute><ShopWishlist /></ShopProtectedRoute>} />
            <Route path="*" element={<Shop404 />} />
          </Route>

          {/* Legal Pages */}
          <Route
            path="/legal/privacy-policy"
            element={
              <PageTransition>
                <>
                  <SEO
                    title="Privacy Policy | NanoFlows"
                    description="NanoFlows privacy policy - how we collect, use, and protect your personal information."
                    keywords="privacy policy, data protection, privacy"
                  />
                  <PrivacyPolicy />
                </>
              </PageTransition>
            }
          />
          <Route
            path="/legal/terms-of-service"
            element={
              <PageTransition>
                <>
                  <SEO
                    title="Terms of Service | NanoFlows"
                    description="NanoFlows terms of service and user agreement."
                    keywords="terms of service, terms and conditions, user agreement"
                  />
                  <TermsOfService />
                </>
              </PageTransition>
            }
          />
          <Route
            path="/legal/cookie-policy"
            element={
              <PageTransition>
                <>
                  <SEO
                    title="Cookie Policy | NanoFlows"
                    description="NanoFlows cookie policy - how we use cookies and tracking technologies."
                    keywords="cookie policy, cookies, tracking"
                  />
                  <CookiePolicy />
                </>
              </PageTransition>
            }
          />
          <Route
            path="/legal/security"
            element={
              <PageTransition>
                <>
                  <SEO
                    title="Security | NanoFlows"
                    description="Learn about NanoFlows security measures and data protection practices."
                    keywords="security, data security, cybersecurity, protection"
                  />
                  <Security />
                </>
              </PageTransition>
            }
          />
          <Route
            path="/legal/compliance"
            element={
              <PageTransition>
                <>
                  <SEO
                    title="Compliance | NanoFlows"
                    description="NanoFlows compliance with industry standards and regulations."
                    keywords="compliance, regulations, standards, certifications"
                  />
                  <Compliance />
                </>
              </PageTransition>
            }
          />
        </Routes>
      </AnimatePresence>
      {showAIChat && <AIChat />}
      {showFloatingContact && <FloatingContactWidget />}
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <WebsiteAuthProvider>
        <AuthProvider>
          <AIToolsAuthProvider>
            <Router>
              <AnimatedRoutes />
            </Router>
          </AIToolsAuthProvider>
        </AuthProvider>
      </WebsiteAuthProvider>
    </ThemeProvider>
  );
}

export default App;
