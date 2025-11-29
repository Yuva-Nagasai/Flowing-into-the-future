import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Package, Users, ShoppingCart, DollarSign, TrendingUp, BarChart3,
  ArrowUpRight, ArrowDownRight, Eye, Plus, Layers, Tag, Megaphone
} from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { useShopAuth } from '../../../contexts/ShopAuthContext';
import ShopNav from '../../../components/shop/ShopNav';
import SEOHead from '../../../components/shop/SEOHead';
import shopApi from '../../../utils/shopApi';
import type { DashboardStats, Order, Product } from '../../../types/shop';

export default function ShopAdminDashboard() {
  const { theme } = useTheme();
  const { isAuthenticated, isAdmin } = useShopAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate('/shop/login');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchDashboard();
    }
  }, [isAdmin]);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await shopApi.getAdminDashboard();
      if (res.success && res.data) {
        setStats(res.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Total Revenue', value: `$${stats?.totalRevenue?.toFixed(2) || '0.00'}`, icon: DollarSign, color: 'from-green-500 to-emerald-500', change: '+12%' },
    { label: 'Total Orders', value: stats?.totalOrders || 0, icon: ShoppingCart, color: 'from-blue-500 to-cyan-500', change: '+8%' },
    { label: 'Products', value: stats?.totalProducts || 0, icon: Package, color: 'from-purple-500 to-violet-500', change: '+5' },
    { label: 'Customers', value: stats?.totalUsers || 0, icon: Users, color: 'from-orange-500 to-amber-500', change: '+15' },
  ];

  const quickActions = [
    { label: 'Add Product', href: '/shop/admin/products?action=new', icon: Package },
    { label: 'Add Category', href: '/shop/admin/categories?action=new', icon: Layers },
    { label: 'Create Deal', href: '/shop/admin/deals?action=new', icon: Tag },
    { label: 'New Announcement', href: '/shop/admin/announcements?action=new', icon: Megaphone },
  ];

  const adminNav = [
    { label: 'Products', href: '/shop/admin/products', icon: Package },
    { label: 'Categories', href: '/shop/admin/categories', icon: Layers },
    { label: 'Orders', href: '/shop/admin/orders', icon: ShoppingCart },
    { label: 'Deals', href: '/shop/admin/deals', icon: Tag },
    { label: 'Announcements', href: '/shop/admin/announcements', icon: Megaphone },
    { label: 'Testimonials', href: '/shop/admin/testimonials', icon: Users },
    { label: 'Newsletter', href: '/shop/admin/newsletter', icon: Users },
    { label: 'Reviews', href: '/shop/admin/reviews', icon: Users },
    { label: 'Product Requests', href: '/shop/admin/product-requests', icon: Package },
  ];

  if (!isAdmin) return null;

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-950' : 'bg-gray-50'}`}>
      <SEOHead title="Admin Dashboard" description="Shop administration dashboard" />
      <ShopNav />

      <div className="container mx-auto px-4 lg:px-6 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className={`text-3xl font-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Admin Dashboard
            </h1>
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              Manage your shop, products, and orders
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                to={action.href}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                  theme === 'dark'
                    ? 'bg-slate-800 text-gray-300 hover:bg-slate-700 border border-slate-700'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm'
                }`}
              >
                <Plus className="w-4 h-4" />
                {action.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-6 rounded-2xl ${
                theme === 'dark' ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'
                }`}>
                  {stat.change.startsWith('+') ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  {stat.change}
                </div>
              </div>
              <p className={`text-2xl font-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {loading ? '...' : stat.value}
              </p>
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className={`lg:col-span-2 p-6 rounded-2xl ${
            theme === 'dark' ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Login Analytics
              </h2>
              <BarChart3 className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
            </div>

            {stats?.loginAnalytics && stats.loginAnalytics.length > 0 ? (
              <div className="h-64 flex items-end gap-2">
                {stats.loginAnalytics.slice(-14).map((day, i) => {
                  const maxCount = Math.max(...stats.loginAnalytics.map(d => d.count));
                  const height = maxCount > 0 ? (day.count / maxCount) * 100 : 0;
                  return (
                    <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
                      <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {day.count}
                      </span>
                      <div
                        className={`w-full rounded-t-lg transition-all ${
                          theme === 'dark'
                            ? 'bg-gradient-to-t from-electric-blue to-electric-green'
                            : 'bg-gradient-to-t from-accent-red to-accent-blue'
                        }`}
                        style={{ height: `${Math.max(height, 5)}%` }}
                      />
                      <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                        {new Date(day.date).getDate()}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className={`h-64 flex items-center justify-center ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              }`}>
                No login data available
              </div>
            )}
          </div>

          <div className={`p-6 rounded-2xl ${
            theme === 'dark' ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
          }`}>
            <h2 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Quick Navigation
            </h2>
            <nav className="space-y-2">
              {adminNav.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    theme === 'dark'
                      ? 'text-gray-300 hover:bg-slate-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className={`p-6 rounded-2xl ${
            theme === 'dark' ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Recent Orders
              </h2>
              <Link
                to="/shop/admin/orders"
                className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-electric-green' : 'text-accent-blue'
                }`}
              >
                View All
              </Link>
            </div>

            {stats?.recentOrders && stats.recentOrders.length > 0 ? (
              <div className="space-y-3">
                {stats.recentOrders.slice(0, 5).map((order) => (
                  <div
                    key={order.id}
                    className={`flex items-center justify-between p-3 rounded-xl ${
                      theme === 'dark' ? 'bg-slate-700/50' : 'bg-gray-50'
                    }`}
                  >
                    <div>
                      <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        #{order.orderNumber}
                      </p>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`font-medium ${
                      theme === 'dark' ? 'text-electric-green' : 'text-accent-blue'
                    }`}>
                      ${parseFloat(order.total).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                No recent orders
              </p>
            )}
          </div>

          <div className={`p-6 rounded-2xl ${
            theme === 'dark' ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Top Products
              </h2>
              <Link
                to="/shop/admin/products"
                className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-electric-green' : 'text-accent-blue'
                }`}
              >
                View All
              </Link>
            </div>

            {stats?.topProducts && stats.topProducts.length > 0 ? (
              <div className="space-y-3">
                {stats.topProducts.slice(0, 5).map((product) => (
                  <div
                    key={product.id}
                    className={`flex items-center gap-3 p-3 rounded-xl ${
                      theme === 'dark' ? 'bg-slate-700/50' : 'bg-gray-50'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      theme === 'dark' ? 'bg-slate-600' : 'bg-gray-200'
                    }`}>
                      {product.thumbnail ? (
                        <img src={product.thumbnail} alt="" className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <Package className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {product.name}
                      </p>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        ${parseFloat(product.price).toFixed(2)}
                      </p>
                    </div>
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {product.totalReviews} sales
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                No product data available
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
