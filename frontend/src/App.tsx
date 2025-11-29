import { useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
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
import CareersPage from './pages/CareersPage';
import ContactPage from './pages/ContactPage';

import Login from './pages/academy/Login';
import Signup from './pages/academy/Signup';
import PlatformSelection from './pages/academy/PlatformSelection';
import ExploreCourses from './pages/academy/ExploreCourses';
import CourseDetails from './pages/academy/CourseDetails';
import UserDashboard from './pages/academy/UserDashboard';
import CoursePlayer from './pages/academy/CoursePlayer';
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
import ELearningLanding from './pages/ELearningLanding';
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
import { ShopProvider } from './contexts/ShopContext';
import ShopHome from './pages/shop/ShopHome';
import ShopProducts from './pages/shop/ShopProducts';
import ShopCart from './pages/shop/ShopCart';

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

    const hiddenPrefixes = ['/academy', '/elearning', '/aitools', '/shop'];
    return !hiddenPrefixes.some((prefix) => location.pathname.startsWith(prefix));
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
              </PageTransition>
            }
          />

          {/* Services Page Route */}
          <Route
            path="/services"
            element={
              <PageTransition>
                <ServicesPage />
              </PageTransition>
            }
          />

          {/* How it Works Page Route */}
          <Route
            path="/how-it-works"
            element={
              <PageTransition>
                <HowItWorks />
              </PageTransition>
            }
          />

          <Route
            path="/careers"
            element={
              <PageTransition>
                <CareersPage />
              </PageTransition>
            }
          />
          <Route
            path="/contact"
            element={
              <PageTransition>
                <ContactPage />
              </PageTransition>
            }
          />

          <Route
            path="/industries/:slug"
            element={
              <PageTransition>
                <IndustryDetail />
              </PageTransition>
            }
          />


          {/* ✅ Education Dashboard Route */}
          <Route
            path="/educationdashboard"
            element={
              <PageTransition>
                <div className="relative min-h-screen flex flex-col bg-white dark:bg-dark-bg transition-colors duration-300 w-full max-w-full overflow-x-hidden">
                  <EducationDashboard />
                </div>
              </PageTransition>
            }
          />

          {/* ✅ E-Learning Landing Route */}
          <Route
            path="/elearning"
            element={
              <PageTransition>
                <ELearningHome />
              </PageTransition>
            }
          />

          {/* E-Learning About Page */}
          <Route
            path="/elearning/about"
            element={
              <PageTransition>
                <ELearningAboutPage />
              </PageTransition>
            }
          />

          {/* E-Learning Courses Page */}
          <Route
            path="/elearning/courses"
            element={
              <PageTransition>
                <JobsPage />
              </PageTransition>
            }
          />

          {/* E-Learning Contact Page */}
          <Route
            path="/elearning/contact"
            element={
              <PageTransition>
                <ELearningContactPage />
              </PageTransition>
            }
          />

          {/* E-Learning Masterclass Page */}
          <Route
            path="/elearning/masterclass"
            element={
              <PageTransition>
                <MasterclassPage />
              </PageTransition>
            }
          />

          {/* E-Learning Mahakumbh Page */}
          <Route
            path="/elearning/mahakumbh"
            element={
              <PageTransition>
                <MahakumbhPage />
              </PageTransition>
            }
          />

          {/* E-Learning Freebies Page */}
          <Route
            path="/elearning/freebies"
            element={
              <PageTransition>
                <FreebiesPage />
              </PageTransition>
            }
          />

          {/* E-Learning Blog Page */}
          <Route
            path="/elearning/blog"
            element={
              <PageTransition>
                <BlogPage />
              </PageTransition>
            }
          />

          {/* E-Learning Internship Page */}
          <Route
            path="/elearning/internship"
            element={
              <PageTransition>
                <InternshipPage />
              </PageTransition>
            }
          />

          {/* E-Learning Certificate Page */}
          <Route
            path="/elearning/certificate"
            element={
              <PageTransition>
                <CertificatePage />
              </PageTransition>
            }
          />

          {/* E-Learning Events Page */}
          <Route
            path="/elearning/events"
            element={
              <PageTransition>
                <EventsPage />
              </PageTransition>
            }
          />

          {/* ✅ Course Listing Page Route */}
          <Route
            path="/courses"
            element={
              <PageTransition>
                <CourseListing />
              </PageTransition>
            }
          />

          {/* ✅ AI Tools Platform Routes */}
          <Route
            path="/ai-tools"
            element={
              <PageTransition>
                <AIToolsHome />
              </PageTransition>
            }
          />
          <Route
            path="/ai-tools/explore"
            element={
              <PageTransition>
                <AIToolsExplore />
              </PageTransition>
            }
          />
          <Route
            path="/ai-tools/tool/:id"
            element={
              <PageTransition>
                <AIToolDetail />
              </PageTransition>
            }
          />
          <Route
            path="/ai-tools/about"
            element={
              <PageTransition>
                <AIToolsAbout />
              </PageTransition>
            }
          />

          {/* ✅ Academy Routes */}
          <Route path="/academy/login" element={<Login />} />
          <Route path="/academy/signup" element={<Signup />} />
          <Route
            path="/academy/platform-selection"
            element={
              <ProtectedRoute>
                <PlatformSelection />
              </ProtectedRoute>
            }
          />
          <Route
            path="/academy/courses"
            element={
              <ProtectedRoute>
                <ExploreCourses />
              </ProtectedRoute>
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
                <AISolutions />
              </PageTransition>
            }
          />
          <Route
            path="/products/cloud-platform"
            element={
              <PageTransition>
                <CloudPlatform />
              </PageTransition>
            }
          />
          <Route
            path="/products/analytics-tools"
            element={
              <PageTransition>
                <AnalyticsTools />
              </PageTransition>
            }
          />
          <Route
            path="/products/mobile-apps"
            element={
              <PageTransition>
                <MobileApps />
              </PageTransition>
            }
          />
          <Route
            path="/products/api-services"
            element={
              <PageTransition>
                <APIServices />
              </PageTransition>
            }
          />
          <Route
            path="/products/get-discovery"
            element={
              <PageTransition>
                <GetDiscovery />
              </PageTransition>
            }
          />
          <Route
            path="/products/unified-data-platform"
            element={
              <PageTransition>
                <UnifiedDataPlatform />
              </PageTransition>
            }
          />
          <Route
            path="/products/demand-generation"
            element={
              <PageTransition>
                <DemandGeneration />
              </PageTransition>
            }
          />
          <Route
            path="/products/:category/:item"
            element={
              <PageTransition>
                <ProductItemDetail />
              </PageTransition>
            }
          />

          {/* Shop Routes */}
          <Route
            path="/shop"
            element={
              <ShopProvider>
                <ShopHome />
              </ShopProvider>
            }
          />
          <Route
            path="/shop/products"
            element={
              <ShopProvider>
                <ShopProducts />
              </ShopProvider>
            }
          />
          <Route
            path="/shop/products/:slug"
            element={
              <ShopProvider>
                <ShopProducts />
              </ShopProvider>
            }
          />
          <Route
            path="/shop/cart"
            element={
              <ShopProvider>
                <ShopCart />
              </ShopProvider>
            }
          />
          <Route
            path="/shop/categories"
            element={
              <ShopProvider>
                <ShopProducts />
              </ShopProvider>
            }
          />

          {/* Legal Pages */}
          <Route
            path="/legal/privacy-policy"
            element={
              <PageTransition>
                <PrivacyPolicy />
              </PageTransition>
            }
          />
          <Route
            path="/legal/terms-of-service"
            element={
              <PageTransition>
                <TermsOfService />
              </PageTransition>
            }
          />
          <Route
            path="/legal/cookie-policy"
            element={
              <PageTransition>
                <CookiePolicy />
              </PageTransition>
            }
          />
          <Route
            path="/legal/security"
            element={
              <PageTransition>
                <Security />
              </PageTransition>
            }
          />
          <Route
            path="/legal/compliance"
            element={
              <PageTransition>
                <Compliance />
              </PageTransition>
            }
          />
        </Routes>
      </AnimatePresence>
      <AIChat />
      {showFloatingContact && <FloatingContactWidget />}
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AnimatedRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
