import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Sun, Moon, ShoppingCart, User, LogOut, Search, Settings, Heart } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useShopAuth } from '../../contexts/ShopAuthContext';
import TopFeatureNav from '../TopFeatureNav';

const ShopNav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, cart, isAdmin, logout } = useShopAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const cartCount = cart.reduce((total, item) => total + (item.quantity || 1), 0);

  const navLinks = [
    { name: 'Home', path: '/shop' },
    { name: 'Products', path: '/shop/products' },
    { name: 'Categories', path: '/shop/categories' },
    { name: 'Deals', path: '/shop/deals' },
    { name: 'About', path: '/shop/about' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowSearch(false);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/shop');
    setIsMenuOpen(false);
  };

  return (
    <>
      <TopFeatureNav />
      <nav className={`sticky top-0 z-40 ${
        theme === 'dark' 
          ? 'bg-slate-900/95 border-slate-700' 
          : 'bg-white/95 border-gray-200'
      } backdrop-blur-md border-b shadow-sm`}>
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-16">
            <Link to="/shop" className="flex items-center gap-2">
              <span className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-electric-green' : 'text-accent-blue'
              }`}>
                Digital Hub
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`font-medium transition-colors ${
                    isActive(link.path)
                      ? theme === 'dark' ? 'text-electric-green' : 'text-accent-blue'
                      : theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              <form onSubmit={handleSearch} className="hidden lg:flex items-center">
                <div className={`flex items-center rounded-lg border ${
                  theme === 'dark' 
                    ? 'bg-slate-800 border-slate-600' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className={`w-48 px-3 py-2 text-sm bg-transparent focus:outline-none ${
                      theme === 'dark' ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'
                    }`}
                  />
                  <button
                    type="submit"
                    className={`p-2 rounded-r-lg transition-colors ${
                      theme === 'dark' 
                        ? 'hover:bg-slate-700 text-gray-300' 
                        : 'hover:bg-gray-100 text-gray-600'
                    }`}
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </div>
              </form>

              <button
                onClick={() => setShowSearch(!showSearch)}
                className={`lg:hidden p-2 rounded-lg transition-colors ${
                  theme === 'dark' 
                    ? 'hover:bg-slate-800 text-gray-300' 
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <Search className="w-5 h-5" />
              </button>

              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors ${
                  theme === 'dark' 
                    ? 'hover:bg-slate-800 text-gray-300' 
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {user && (
                <Link
                  to="/shop/wishlist"
                  className={`relative p-2 rounded-lg transition-colors ${
                    theme === 'dark' 
                      ? 'hover:bg-slate-800 text-gray-300' 
                      : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  <Heart className="w-5 h-5" />
                </Link>
              )}

              <Link
                to="/shop/cart"
                className={`relative p-2 rounded-lg transition-colors ${
                  theme === 'dark' 
                    ? 'hover:bg-slate-800 text-gray-300' 
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className={`absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs font-bold rounded-full ${
                    theme === 'dark' ? 'bg-electric-green text-slate-900' : 'bg-accent-red text-white'
                  }`}>
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>

              {user ? (
                <div className="hidden md:flex items-center gap-3">
                  {isAdmin && (
                    <Link
                      to="/shop/admin"
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                        theme === 'dark' 
                          ? 'bg-electric-green/20 text-electric-green hover:bg-electric-green/30' 
                          : 'bg-accent-blue/10 text-accent-blue hover:bg-accent-blue/20'
                      }`}
                    >
                      <Settings className="w-4 h-4" />
                      <span className="text-sm font-medium">Admin</span>
                    </Link>
                  )}
                  <Link
                    to="/shop/account"
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                      theme === 'dark' 
                        ? 'hover:bg-slate-800 text-gray-300' 
                        : 'hover:bg-gray-100 text-gray-600'
                    }`}
                  >
                    <User className="w-5 h-5" />
                    <span className="text-sm font-medium">{user.name}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className={`p-2 rounded-lg transition-colors ${
                      theme === 'dark' 
                        ? 'hover:bg-slate-800 text-gray-300' 
                        : 'hover:bg-gray-100 text-gray-600'
                    }`}
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/shop/login"
                  className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    theme === 'dark'
                      ? 'bg-electric-green text-slate-900 hover:bg-electric-green/90'
                      : 'bg-accent-blue text-white hover:bg-accent-blue/90'
                  }`}
                >
                  <User className="w-4 h-4" />
                  Sign In
                </Link>
              )}

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`md:hidden p-2 rounded-lg transition-colors ${
                  theme === 'dark' 
                    ? 'hover:bg-slate-800 text-gray-300' 
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {showSearch && (
            <div className={`lg:hidden py-3 border-t ${
              theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
            }`}>
              <form onSubmit={handleSearch} className="flex items-center gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  autoFocus
                  className={`flex-1 px-4 py-2 rounded-lg border ${
                    theme === 'dark' 
                      ? 'bg-slate-800 border-slate-600 text-white placeholder-gray-400' 
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'
                  } focus:outline-none focus:ring-2 ${
                    theme === 'dark' ? 'focus:ring-electric-green/50' : 'focus:ring-accent-blue/50'
                  }`}
                />
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    theme === 'dark'
                      ? 'bg-electric-green text-slate-900 hover:bg-electric-green/90'
                      : 'bg-accent-blue text-white hover:bg-accent-blue/90'
                  }`}
                >
                  Search
                </button>
              </form>
            </div>
          )}

          {isMenuOpen && (
            <div className={`md:hidden py-4 border-t ${
              theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
            }`}>
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block py-3 font-medium ${
                    isActive(link.path)
                      ? theme === 'dark' ? 'text-electric-green' : 'text-accent-blue'
                      : theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              
              <div className={`mt-4 pt-4 border-t ${
                theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
              }`}>
                {user ? (
                  <>
                    {isAdmin && (
                      <Link
                        to="/shop/admin"
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center gap-2 py-3 ${
                          theme === 'dark' ? 'text-electric-green' : 'text-accent-blue'
                        }`}
                      >
                        <Settings className="w-5 h-5" />
                        Admin Dashboard
                      </Link>
                    )}
                    <Link
                      to="/shop/wishlist"
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center gap-2 py-3 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}
                    >
                      <Heart className="w-5 h-5" />
                      My Wishlist
                    </Link>
                    <Link
                      to="/shop/account"
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center gap-2 py-3 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}
                    >
                      <User className="w-5 h-5" />
                      My Account
                    </Link>
                    <Link
                      to="/shop/orders"
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center gap-2 py-3 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}
                    >
                      My Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className={`flex items-center gap-2 py-3 w-full text-left ${
                        theme === 'dark' ? 'text-red-400' : 'text-red-600'
                      }`}
                    >
                      <LogOut className="w-5 h-5" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    to="/shop/login"
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center justify-center gap-2 py-3 rounded-lg font-medium ${
                      theme === 'dark'
                        ? 'bg-electric-green text-slate-900'
                        : 'bg-accent-blue text-white'
                    }`}
                  >
                    <User className="w-5 h-5" />
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default ShopNav;
