import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Search, Filter, ChevronDown, Eye, Truck, CheckCircle, XCircle, Clock, MoreHorizontal, DollarSign, Users, TrendingUp } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { useShopAuth } from '../../../contexts/ShopAuthContext';
import ShopNav from '../../../components/shop/ShopNav';
import SEOHead from '../../../components/shop/SEOHead';
import shopApi from '../../../utils/shopApi';
import type { Order } from '../../../types/shop';

export default function ShopAdminOrders() {
  const { theme } = useTheme();
  const { isAuthenticated, isAdmin } = useShopAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate('/shop/login');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchOrders();
    }
  }, [isAdmin, page, statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params: { page: number; limit: number; status?: string } = { page, limit: 20 };
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      const res = await shopApi.getAdminOrders(params);
      if (res.success && res.data) {
        setOrders(res.data);
        if (res.pagination) {
          setTotalPages(res.pagination.totalPages);
        }
      }
    } catch (error) {
      console.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    setUpdating(true);
    try {
      const res = await shopApi.updateOrderStatus(orderId, newStatus);
      if (res.success) {
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        ));
        setShowStatusModal(false);
        setSelectedOrder(null);
      }
    } catch (error) {
      console.error('Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return CheckCircle;
      case 'shipped': return Truck;
      case 'processing': return Clock;
      case 'cancelled': return XCircle;
      default: return Package;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-500/20 text-green-500';
      case 'shipped': return 'bg-blue-500/20 text-blue-500';
      case 'processing': return 'bg-yellow-500/20 text-yellow-500';
      case 'pending': return 'bg-gray-500/20 text-gray-500';
      case 'cancelled': return 'bg-red-500/20 text-red-500';
      default: return 'bg-gray-500/20 text-gray-500';
    }
  };

  const filteredOrders = orders.filter(order => {
    if (!searchQuery) return true;
    return order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const statusOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  const statusUpdateOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  const stats = {
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    totalRevenue: orders.reduce((sum, o) => sum + parseFloat(o.total), 0),
  };

  if (!isAdmin) return null;

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-950' : 'bg-gray-50'}`}>
      <SEOHead title="Manage Orders" description="Admin order management" />
      <ShopNav />

      <div className="container mx-auto px-4 lg:px-6 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className={`text-3xl font-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Order Management
            </h1>
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              View and manage customer orders
            </p>
          </div>
          <Link
            to="/shop/admin"
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all ${
              theme === 'dark'
                ? 'bg-slate-800 text-gray-300 hover:bg-slate-700 border border-slate-700'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm'
            }`}
          >
            Back to Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { label: 'Total Orders', value: stats.totalOrders, icon: Package, color: 'from-blue-500 to-cyan-500' },
            { label: 'Pending Orders', value: stats.pendingOrders, icon: Clock, color: 'from-yellow-500 to-orange-500' },
            { label: 'Total Revenue', value: `$${stats.totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'from-green-500 to-emerald-500' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-6 rounded-2xl ${
                theme === 'dark' ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {stat.value}
                  </p>
                  <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                    {stat.label}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className={`p-6 rounded-2xl ${
          theme === 'dark' ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
        }`}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="text"
                placeholder="Search by order number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                  theme === 'dark'
                    ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:ring-electric-blue/20'
                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:ring-accent-blue/20'
                }`}
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className={`px-4 py-2 rounded-xl border transition-all focus:outline-none ${
                    theme === 'dark'
                      ? 'bg-slate-700 border-slate-600 text-white'
                      : 'bg-gray-50 border-gray-200 text-gray-900'
                  }`}
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className={`h-20 rounded-xl animate-pulse ${
                  theme === 'dark' ? 'bg-slate-700' : 'bg-gray-100'
                }`} />
              ))}
            </div>
          ) : filteredOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`text-left text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    <th className="pb-4 font-medium">Order</th>
                    <th className="pb-4 font-medium">Date</th>
                    <th className="pb-4 font-medium">Items</th>
                    <th className="pb-4 font-medium">Total</th>
                    <th className="pb-4 font-medium">Status</th>
                    <th className="pb-4 font-medium">Payment</th>
                    <th className="pb-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => {
                    const StatusIcon = getStatusIcon(order.status);
                    return (
                      <tr key={order.id} className={`border-t ${
                        theme === 'dark' ? 'border-slate-700' : 'border-gray-100'
                      }`}>
                        <td className="py-4">
                          <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            #{order.orderNumber}
                          </p>
                          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            {order.shippingAddress?.name || 'N/A'}
                          </p>
                        </td>
                        <td className={`py-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className={`py-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                          {order.items?.length || 0} items
                        </td>
                        <td className={`py-4 font-medium ${theme === 'dark' ? 'text-electric-green' : 'text-accent-blue'}`}>
                          ${parseFloat(order.total).toFixed(2)}
                        </td>
                        <td className="py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                            <StatusIcon className="w-3.5 h-3.5" />
                            {order.status}
                          </span>
                        </td>
                        <td className="py-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${
                            order.paymentStatus === 'completed' ? 'bg-green-500/20 text-green-500' :
                            order.paymentStatus === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                            'bg-red-500/20 text-red-500'
                          }`}>
                            {order.paymentStatus}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              to={`/shop/orders/${order.orderNumber}`}
                              className={`p-2 rounded-lg transition-colors ${
                                theme === 'dark' ? 'hover:bg-slate-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                              }`}
                              title="View Order"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowStatusModal(true);
                              }}
                              className={`p-2 rounded-lg transition-colors ${
                                theme === 'dark' ? 'hover:bg-slate-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                              }`}
                              title="Update Status"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className={`w-16 h-16 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
              <h3 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                No Orders Found
              </h3>
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                {searchQuery ? 'Try adjusting your search query' : 'Orders will appear here when customers place them'}
              </p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className={`px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 ${
                  theme === 'dark'
                    ? 'bg-slate-700 text-white hover:bg-slate-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Previous
              </button>
              <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className={`px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 ${
                  theme === 'dark'
                    ? 'bg-slate-700 text-white hover:bg-slate-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {showStatusModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`w-full max-w-md p-6 rounded-2xl ${
              theme === 'dark' ? 'bg-slate-800 border border-slate-700' : 'bg-white'
            }`}
          >
            <h3 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Update Order Status
            </h3>
            <p className={`mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Order #{selectedOrder.orderNumber}
            </p>
            <div className="space-y-2 mb-6">
              {statusUpdateOptions.map(status => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(selectedOrder.id, status)}
                  disabled={updating || selectedOrder.status === status}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    selectedOrder.status === status
                      ? theme === 'dark'
                        ? 'bg-electric-green/20 text-electric-green border border-electric-green/30'
                        : 'bg-accent-blue/20 text-accent-blue border border-accent-blue/30'
                      : theme === 'dark'
                        ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {(() => {
                    const Icon = getStatusIcon(status);
                    return <Icon className="w-5 h-5" />;
                  })()}
                  <span className="capitalize">{status}</span>
                  {selectedOrder.status === status && (
                    <span className="ml-auto text-sm">Current</span>
                  )}
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                setShowStatusModal(false);
                setSelectedOrder(null);
              }}
              className={`w-full px-4 py-3 rounded-xl font-medium transition-all ${
                theme === 'dark'
                  ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Cancel
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
