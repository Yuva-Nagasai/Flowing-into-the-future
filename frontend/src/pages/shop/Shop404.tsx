import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Home, ArrowLeft } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import ShopNav from '../../components/shop/ShopNav';
import Footer from '../../components/Footer';
import SEOHead from '../../components/shop/SEOHead';

export default function Shop404() {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-950' : 'bg-gray-50'}`}>
      <SEOHead title="Page Not Found" description="The page you're looking for doesn't exist" />
      <ShopNav />

      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-lg mx-auto text-center"
          >
            <div className={`text-9xl font-bold mb-4 ${
              theme === 'dark'
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-electric-blue to-electric-green'
                : 'text-transparent bg-clip-text bg-gradient-to-r from-accent-red to-accent-blue'
            }`}>
              404
            </div>

            <ShoppingBag className={`w-24 h-24 mx-auto mb-6 ${
              theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
            }`} />

            <h1 className={`text-3xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Oops! Page Not Found
            </h1>

            <p className={`text-lg mb-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              The page you're looking for doesn't exist or has been moved.
              Let's get you back on track!
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/shop"
                className={`relative group overflow-hidden inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-electric-blue to-electric-green text-slate-900 hover:shadow-lg'
                    : 'bg-gradient-to-r from-accent-red to-accent-blue text-white hover:shadow-lg'
                }`}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  Back to Digital Hub
                </span>
                <div
                  className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
                    theme === 'dark'
                      ? 'bg-gradient-to-r from-electric-green to-electric-blue'
                      : 'bg-gradient-to-r from-accent-blue to-accent-red'
                  }`}
                />
              </Link>
              <button
                onClick={() => window.history.back()}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all border ${
                  theme === 'dark'
                    ? 'border-slate-600 text-white hover:bg-slate-800'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <ArrowLeft className="w-5 h-5" />
                Go Back
              </button>
            </div>

            <div className={`mt-12 p-6 rounded-2xl ${
              theme === 'dark' ? 'bg-slate-800/50' : 'bg-gray-100'
            }`}>
              <h2 className={`font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Popular Pages
              </h2>
              <div className="flex flex-wrap justify-center gap-3">
                {[
                  { label: 'Products', href: '/shop/products' },
                  { label: 'Categories', href: '/shop/categories' },
                  { label: 'Deals', href: '/shop/deals' },
                  { label: 'Contact', href: '/shop/contact' },
                ].map((link) => (
                  <Link
                    key={link.label}
                    to={link.href}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      theme === 'dark'
                        ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                        : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer variant="shop" />
    </div>
  );
}
