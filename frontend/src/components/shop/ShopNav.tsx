import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, ShoppingCart, User, LogOut, Search, Settings, Heart } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useShopAuth } from '../../contexts/ShopAuthContext';
import TopFeatureNav from '../TopFeatureNav';

const ShopNav = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, cart, isAdmin, logout } = useShopAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showTopBar, setShowTopBar] = useState(true);

  const cartCount = cart.reduce((total, item) => total + (item.quantity || 1), 0);

  const navLinks = [
    { name: 'Home', path: '/shop' },
    { name: 'Products', path: '/shop/products' },
    { name: 'Categories', path: '/shop/categories' },
    { name: 'Deals', path: '/shop/deals' },
    { name: 'About', path: '/shop/about' },
    { name: 'Contact', path: '/shop/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/shop');
    setMobileMenuOpen(false);
  };

  const topBarHeight = 68;

  useEffect(() => {
    const handleScroll = () => {
      const nearTop = window.scrollY <= 24;
      setShowTopBar(nearTop);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50">
        <div
          className={`transition-[max-height,opacity] duration-500 ease-in-out ${
            showTopBar ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
          }`}
        >
          <TopFeatureNav />
        </div>
        <div
          className={`transition-all duration-300 ${
            theme === 'dark'
              ? 'bg-dark-card/95 border-b border-gray-800/50'
              : 'bg-white/95 border-b border-gray-200/50'
          } backdrop-blur-lg shadow-lg`}
        >
          <nav className="container mx-auto px-6">
            <div className="flex items-center justify-between h-16">
              <Link to="/shop" className="flex items-center gap-4 group">
                <img
                  src="/NanoFlows-LOGO-removebg-preview.png"
                  alt="NanoFlows logo"
                  className="h-16 w-18 object-contain"
                />
                <div className="leading-tight">
                  <h1
                    className={`text-lg font-bold uppercase tracking-wide bg-clip-text text-transparent ${
                      theme === 'dark'
                        ? 'bg-gradient-to-r from-electric-green via-electric-blue to-electric-green'
                        : 'bg-gradient-to-r from-accent-red via-accent-blue to-accent-red'
                    }`}
                  >
                    Digital Hub
                  </h1>
                </div>
              </Link>

              <div className="hidden lg:flex items-center gap-6 flex-1 justify-center">
                <div className="flex items-center gap-8 lg:gap-10">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`font-exo font-medium transition-all duration-300 ${
                        isActive(link.path)
                          ? theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                          : theme === 'dark'
                            ? 'text-white hover:text-electric-green'
                            : 'text-black hover:text-accent-red'
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
                
                <form onSubmit={handleSearch} className="relative">
                  <div className={`flex items-center px-3 py-1.5 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-dark-lighter border-gray-700'
                      : 'bg-gray-100 border-gray-200'
                  }`}>
                    <Search className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`ml-2 bg-transparent border-none outline-none text-sm w-32 ${
                        theme === 'dark' ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'
                      }`}
                    />
                  </div>
                </form>
              </div>

              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleTheme}
                  className={`p-2 rounded-lg transition-all ${
                    theme === 'dark'
                      ? 'bg-dark-lighter text-yellow-400 hover:bg-gray-700'
                      : 'bg-gray-100 text-blue-600 hover:bg-gray-200'
                  }`}
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </motion.button>

                {user && (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      to="/shop/wishlist"
                      className={`p-2 rounded-lg transition-all flex items-center ${
                        theme === 'dark'
                          ? 'bg-dark-lighter text-gray-300 hover:bg-gray-700'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <Heart className="w-4 h-4" />
                    </Link>
                  </motion.div>
                )}

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/shop/cart"
                    className={`relative p-2 rounded-lg transition-all flex items-center ${
                      theme === 'dark'
                        ? 'bg-dark-lighter text-gray-300 hover:bg-gray-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {cartCount > 0 && (
                      <span className={`absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center text-xs font-bold rounded-full ${
                        theme === 'dark' ? 'bg-electric-green text-slate-900' : 'bg-accent-red text-white'
                      }`}>
                        {cartCount > 9 ? '9+' : cartCount}
                      </span>
                    )}
                  </Link>
                </motion.div>

                {user ? (
                  <>
                    {isAdmin && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/shop/admin')}
                        className={`hidden lg:flex items-center gap-1 px-3 py-2 rounded-md font-exo font-medium transition-all duration-300 ${
                          theme === 'dark'
                            ? 'bg-electric-green/20 text-electric-green hover:bg-electric-green/30'
                            : 'bg-accent-blue/10 text-accent-blue hover:bg-accent-blue/20'
                        }`}
                      >
                        <Settings className="w-4 h-4" />
                        Admin
                      </motion.button>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate('/shop/account')}
                      className={`hidden lg:flex items-center gap-2 px-4 py-2 rounded-md font-exo font-medium transition-all duration-300 border ${
                        theme === 'dark'
                          ? 'border-electric-blue text-electric-blue hover:bg-electric-blue/10'
                          : 'border-accent-blue text-accent-blue hover:bg-accent-blue/10'
                      }`}
                    >
                      <User className="w-4 h-4" />
                      {user.name}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleLogout}
                      className={`hidden lg:flex items-center gap-2 px-4 py-2 rounded-md font-exo font-medium transition-all duration-300 ${
                        theme === 'dark'
                          ? 'bg-gradient-to-r from-electric-green to-electric-blue text-dark-bg hover:shadow-lg hover:shadow-electric-green/30'
                          : 'bg-gradient-to-r from-accent-red to-accent-blue text-white hover:shadow-lg hover:shadow-accent-red/30'
                      }`}
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </motion.button>
                  </>
                ) : (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate('/shop/login')}
                      className={`hidden lg:block px-4 py-2 rounded-md font-exo font-medium transition-all duration-300 border ${
                        theme === 'dark'
                          ? 'border-electric-blue text-electric-blue hover:bg-electric-blue/10'
                          : 'border-accent-blue text-accent-blue hover:bg-accent-blue/10'
                      }`}
                    >
                      Login
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate('/shop/register')}
                      className={`hidden lg:block px-4 py-2 rounded-md font-exo font-medium transition-all duration-300 ${
                        theme === 'dark'
                          ? 'bg-gradient-to-r from-electric-green to-electric-blue text-dark-bg hover:shadow-lg hover:shadow-electric-green/30'
                          : 'bg-gradient-to-r from-accent-red to-accent-blue text-white hover:shadow-lg hover:shadow-accent-red/30'
                      }`}
                    >
                      Sign Up
                    </motion.button>
                  </>
                )}

                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className={`lg:hidden flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
                    theme === 'dark'
                      ? 'bg-dark-lighter hover:bg-gray-700 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  }`}
                >
                  {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
                </button>
              </div>
            </div>
          </nav>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`lg:hidden border-t ${
                theme === 'dark'
                  ? 'border-gray-800 bg-dark-card'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <div className="container mx-auto px-4 py-4">
                <form onSubmit={handleSearch} className={`flex items-center px-3 py-2 rounded-lg border mb-4 ${
                  theme === 'dark'
                    ? 'bg-dark-lighter border-gray-700'
                    : 'bg-gray-100 border-gray-200'
                }`}>
                  <Search className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`ml-2 bg-transparent border-none outline-none text-sm flex-1 ${
                      theme === 'dark' ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'
                    }`}
                  />
                </form>

                <div className="space-y-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block px-4 py-3 rounded-xl font-exo font-medium transition-all duration-300 ${
                        isActive(link.path)
                          ? theme === 'dark' ? 'text-electric-green bg-dark-lighter' : 'text-accent-red bg-gray-100'
                          : theme === 'dark'
                            ? 'text-white hover:bg-dark-lighter hover:text-electric-green'
                            : 'text-black hover:bg-gray-100 hover:text-accent-red'
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}

                  <div className={`pt-2 mt-2 border-t space-y-2 ${
                    theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
                  }`}>
                    {user ? (
                      <>
                        {isAdmin && (
                          <Link
                            to="/shop/admin"
                            onClick={() => setMobileMenuOpen(false)}
                            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-exo font-medium transition-all duration-300 ${
                              theme === 'dark'
                                ? 'text-electric-green hover:bg-dark-lighter'
                                : 'text-accent-blue hover:bg-gray-100'
                            }`}
                          >
                            <Settings className="w-5 h-5" />
                            Admin Dashboard
                          </Link>
                        )}
                        <Link
                          to="/shop/wishlist"
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center gap-2 px-4 py-3 rounded-xl font-exo font-medium transition-all duration-300 ${
                            theme === 'dark'
                              ? 'text-white hover:bg-dark-lighter hover:text-electric-green'
                              : 'text-black hover:bg-gray-100 hover:text-accent-red'
                          }`}
                        >
                          <Heart className="w-5 h-5" />
                          My Wishlist
                        </Link>
                        <Link
                          to="/shop/account"
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center gap-2 px-4 py-3 rounded-xl font-exo font-medium transition-all duration-300 ${
                            theme === 'dark'
                              ? 'text-white hover:bg-dark-lighter hover:text-electric-green'
                              : 'text-black hover:bg-gray-100 hover:text-accent-red'
                          }`}
                        >
                          <User className="w-5 h-5" />
                          My Account
                        </Link>
                        <Link
                          to="/shop/orders"
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center gap-2 px-4 py-3 rounded-xl font-exo font-medium transition-all duration-300 ${
                            theme === 'dark'
                              ? 'text-white hover:bg-dark-lighter hover:text-electric-green'
                              : 'text-black hover:bg-gray-100 hover:text-accent-red'
                          }`}
                        >
                          <ShoppingCart className="w-5 h-5" />
                          My Orders
                        </Link>
                        <button
                          onClick={handleLogout}
                          className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-exo font-medium transition-all duration-300 ${
                            theme === 'dark'
                              ? 'bg-gradient-to-r from-electric-green to-electric-blue text-dark-bg'
                              : 'bg-gradient-to-r from-accent-red to-accent-blue text-white'
                          }`}
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setMobileMenuOpen(false);
                            navigate('/shop/login');
                          }}
                          className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-exo font-medium transition-all duration-300 border ${
                            theme === 'dark'
                              ? 'border-electric-blue text-electric-blue hover:bg-electric-blue/10'
                              : 'border-accent-blue text-accent-blue hover:bg-accent-blue/10'
                          }`}
                        >
                          Login
                        </button>
                        <button
                          onClick={() => {
                            setMobileMenuOpen(false);
                            navigate('/shop/register');
                          }}
                          className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-exo font-medium transition-all duration-300 ${
                            theme === 'dark'
                              ? 'bg-gradient-to-r from-electric-green to-electric-blue text-dark-bg'
                              : 'bg-gradient-to-r from-accent-red to-accent-blue text-white'
                          }`}
                        >
                          Sign Up
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <div
        className="w-full"
        style={{
          height: showTopBar
            ? `${topBarHeight + 64}px`
            : '64px',
        }}
      />
    </>
  );
};

export default ShopNav;
