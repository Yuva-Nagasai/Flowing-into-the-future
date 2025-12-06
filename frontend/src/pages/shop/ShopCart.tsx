import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useShopAuth } from '../../contexts/ShopAuthContext';
import ShopNav from '../../components/shop/ShopNav';
import Footer from '../../components/Footer';

export default function ShopCart() {
  const { theme } = useTheme();
  const { cart, cartTotal, updateCartItem, removeFromCart, clearCart } = useShopAuth();
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-950' : 'bg-gray-50'}`}>
        <ShopNav />
        
        <div className="container mx-auto px-4 lg:px-6 py-16">
          <div
            className={`max-w-md mx-auto text-center py-16 rounded-2xl ${
              theme === 'dark'
                ? 'bg-gradient-to-br from-electric-blue/15 to-electric-green/15 border border-electric-blue/30'
                : 'bg-gradient-to-br from-accent-red/10 to-accent-blue/10 border border-accent-red/30'
            }`}
          >
            <ShoppingCart
              className={`w-20 h-20 mx-auto mb-6 ${
                theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
              }`}
            />
            <h2
              className={`text-2xl font-bold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
            >
              Your Cart is Empty
            </h2>
            <p
              className={`mb-8 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              Looks like you haven't added anything to your cart yet.
            </p>
            <Link
              to="/shop/products"
              className={`relative group overflow-hidden inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-electric-blue to-electric-green text-black'
                  : 'bg-gradient-to-r from-accent-red to-accent-blue text-white'
              }`}
            >
              <span className="relative z-10 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                Start Shopping
              </span>
              <div
                className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-electric-green to-electric-blue'
                    : 'bg-gradient-to-r from-accent-blue to-accent-red'
                }`}
              />
            </Link>
          </div>
        </div>

        <Footer variant="shop" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-950' : 'bg-gray-50'}`}>
      <ShopNav />
      
      <div className="container mx-auto px-4 lg:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className={`text-3xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Shopping Cart ({cartCount} items)
          </h1>
          <button
            onClick={clearCart}
            className={`text-sm font-medium ${
              theme === 'dark' ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-700'
            }`}
          >
            Clear Cart
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex gap-4 p-4 rounded-2xl ${
                  theme === 'dark'
                    ? 'bg-slate-800 border border-slate-700'
                    : 'bg-white border border-gray-200'
                }`}
              >
                <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden">
                  {item.product?.thumbnail || item.product?.images?.[0] ? (
                    <img
                      src={item.product.thumbnail || item.product.images[0]}
                      alt={item.product?.name || 'Product'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center text-3xl ${
                      theme === 'dark' ? 'bg-slate-700' : 'bg-gray-100'
                    }`}>
                      📦
                    </div>
                  )}
                </div>
                
                <div className="flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Link
                        to={`/shop/products/${item.product?.slug || ''}`}
                        className={`font-semibold hover:underline ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        {item.product?.name || 'Unknown Product'}
                      </Link>
                      <p className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {typeof item.product?.category === 'object' ? item.product?.category?.name : item.product?.category || ''}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        theme === 'dark'
                          ? 'hover:bg-slate-700 text-gray-400 hover:text-red-400'
                          : 'hover:bg-gray-100 text-gray-500 hover:text-red-500'
                      }`}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="mt-auto flex items-center justify-between">
                    <div className={`flex items-center border rounded-lg ${
                      theme === 'dark' ? 'border-slate-600' : 'border-gray-300'
                    }`}>
                      <button
                        onClick={() => updateCartItem(item.id, item.quantity - 1)}
                        className={`p-2 transition-colors ${
                          theme === 'dark'
                            ? 'hover:bg-slate-700 text-gray-400'
                            : 'hover:bg-gray-100 text-gray-600'
                        }`}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className={`px-4 font-medium ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartItem(item.id, item.quantity + 1)}
                        className={`p-2 transition-colors ${
                          theme === 'dark'
                            ? 'hover:bg-slate-700 text-gray-400'
                            : 'hover:bg-gray-100 text-gray-600'
                        }`}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <span className={`text-lg font-bold ${
                      theme === 'dark' ? 'text-electric-green' : 'text-accent-blue'
                    }`}>
                      ${(parseFloat(item.product?.price || '0') * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className={`sticky top-24 rounded-2xl p-6 ${
              theme === 'dark'
                ? 'bg-slate-800 border border-slate-700'
                : 'bg-white border border-gray-200'
            }`}>
              <h2 className={`text-xl font-bold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Order Summary
              </h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                    Subtotal ({cartCount} items)
                  </span>
                  <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                    Delivery
                  </span>
                  <span className="text-green-500">
                    Instant Access
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                    Tax (estimated)
                  </span>
                  <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                    ${(cartTotal * 0.08).toFixed(2)}
                  </span>
                </div>
              </div>
              
              <div className={`border-t pt-4 mb-6 ${
                theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
              }`}>
                <div className="flex justify-between">
                  <span className={`text-lg font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Total
                  </span>
                  <span className={`text-lg font-bold ${
                    theme === 'dark' ? 'text-electric-green' : 'text-accent-blue'
                  }`}>
                    ${(cartTotal + cartTotal * 0.08).toFixed(2)}
                  </span>
                </div>
              </div>
              
              <Link
                to="/shop/checkout"
                className={`flex items-center justify-center gap-2 w-full px-6 py-4 rounded-xl font-semibold transition-all ${
                  theme === 'dark'
                    ? 'bg-electric-green text-slate-900 hover:bg-electric-green/90'
                    : 'bg-accent-blue text-white hover:bg-accent-blue/90'
                }`}
              >
                Proceed to Checkout
                <ArrowRight className="w-5 h-5" />
              </Link>
              
              <Link
                to="/shop/products"
                className={`flex items-center justify-center gap-2 w-full mt-3 px-6 py-3 rounded-xl font-medium transition-colors ${
                  theme === 'dark'
                    ? 'text-gray-300 hover:text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Continue Shopping
              </Link>
              
              <p className={`text-center text-sm mt-4 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                All digital products include instant download access
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer variant="shop" />
    </div>
  );
}
