import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X, Heart, Package, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { cart } = useCart();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-brand-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <span className="font-bold text-xl text-gray-900">NanoShop</span>
          </Link>

          <div className="hidden md:flex items-center flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="w-full relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </form>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/products" className="text-gray-600 hover:text-gray-900">
              Products
            </Link>
            
            {isAuthenticated && (
              <Link to="/wishlist" className="text-gray-600 hover:text-gray-900">
                <Heart className="w-5 h-5" />
              </Link>
            )}
            
            <Link to="/cart" className="relative text-gray-600 hover:text-gray-900">
              <ShoppingCart className="w-5 h-5" />
              {cart && cart.itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-accent text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cart.itemCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                >
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="hidden lg:block">{user?.name}</span>
                </button>
                
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2">
                    <Link
                      to="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </Link>
                    <Link
                      to="/orders"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50"
                    >
                      <Package className="w-4 h-4 mr-2" />
                      Orders
                    </Link>
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50"
                      >
                        <Package className="w-4 h-4 mr-2" />
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-50"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn-primary">
                Login
              </Link>
            )}
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-600"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </form>
            
            <div className="space-y-2">
              <Link
                to="/products"
                onClick={() => setIsMenuOpen(false)}
                className="block py-2 text-gray-600"
              >
                Products
              </Link>
              <Link
                to="/cart"
                onClick={() => setIsMenuOpen(false)}
                className="block py-2 text-gray-600"
              >
                Cart {cart && cart.itemCount > 0 && `(${cart.itemCount})`}
              </Link>
              {isAuthenticated ? (
                <>
                  <Link
                    to="/orders"
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-2 text-gray-600"
                  >
                    Orders
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-2 text-gray-600"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block py-2 text-gray-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block py-2 text-brand-accent font-medium"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
