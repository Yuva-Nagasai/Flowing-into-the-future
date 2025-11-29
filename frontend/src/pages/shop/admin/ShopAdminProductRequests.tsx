import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquare, Clock, CheckCircle, XCircle, Eye, Edit2, Save } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { useShopAuth } from '../../../contexts/ShopAuthContext';
import ShopNav from '../../../components/shop/ShopNav';
import SEOHead from '../../../components/shop/SEOHead';
import AdminTable from '../../../components/shop/AdminTable';
import shopApi from '../../../utils/shopApi';
import type { ProductRequest } from '../../../types/shop';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  reviewing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  completed: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
};

const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'reviewing', label: 'Reviewing' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'completed', label: 'Completed' },
];

export default function ShopAdminProductRequests() {
  const { theme } = useTheme();
  const { isAdmin } = useShopAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState<ProductRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState<string>('all');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ status: '', adminNotes: '' });
  const [viewRequest, setViewRequest] = useState<ProductRequest | null>(null);

  useEffect(() => {
    if (!isAdmin) navigate('/shop/login');
  }, [isAdmin, navigate]);

  useEffect(() => {
    if (isAdmin) fetchRequests();
  }, [isAdmin, page, filter]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 20 };
      if (filter !== 'all') params.status = filter;
      const res = await shopApi.getAdminProductRequests(params);
      if (res.success) {
        setRequests(res.data);
        setTotal(res.pagination?.total || res.data.length);
      }
    } catch (error) {
      console.error('Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (request: ProductRequest) => {
    setEditingId(request.id);
    setEditForm({
      status: request.status,
      adminNotes: request.adminNotes || '',
    });
  };

  const handleSave = async () => {
    if (!editingId) return;
    try {
      await shopApi.updateProductRequest(editingId, editForm);
      await fetchRequests();
      setEditingId(null);
    } catch (error) {
      console.error('Failed to update');
    }
  };

  const handleView = (request: ProductRequest) => {
    setViewRequest(request);
  };

  const columns = [
    { key: 'id', label: 'ID', width: '60px' },
    { key: 'name', label: 'Customer', width: '150px' },
    { key: 'productName', label: 'Product Requested', width: '200px' },
    { key: 'category', label: 'Category', width: '120px' },
    { key: 'budget', label: 'Budget', width: '100px' },
    { key: 'status', label: 'Status', width: '120px' },
    { key: 'createdAt', label: 'Date', width: '120px' },
    { key: 'actions', label: 'Actions', width: '120px' },
  ];

  const renderCell = (request: ProductRequest, key: string) => {
    switch (key) {
      case 'name':
        return (
          <div>
            <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {request.name}
            </p>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              {request.email}
            </p>
          </div>
        );
      case 'productName':
        return (
          <p className={`truncate ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            {request.productName}
          </p>
        );
      case 'category':
        return request.category || '-';
      case 'budget':
        return request.budget || '-';
      case 'status':
        return editingId === request.id ? (
          <select
            value={editForm.status}
            onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
            className={`px-2 py-1 rounded text-sm ${
              theme === 'dark' ? 'bg-slate-700 text-white' : 'bg-gray-100'
            }`}
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[request.status] || statusColors.pending}`}>
            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
          </span>
        );
      case 'createdAt':
        return new Date(request.createdAt).toLocaleDateString();
      case 'actions':
        return (
          <div className="flex items-center gap-2">
            {editingId === request.id ? (
              <button
                onClick={handleSave}
                className="p-1.5 rounded-lg bg-green-500 text-white hover:bg-green-600"
              >
                <Save className="w-4 h-4" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => handleView(request)}
                  className={`p-1.5 rounded-lg ${
                    theme === 'dark' ? 'hover:bg-slate-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleEdit(request)}
                  className={`p-1.5 rounded-lg ${
                    theme === 'dark' ? 'hover:bg-slate-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        );
      default:
        return request[key as keyof ProductRequest]?.toString() || '-';
    }
  };

  const statsCards = [
    { label: 'Total Requests', value: total, icon: MessageSquare, color: 'from-blue-500 to-cyan-500' },
    { label: 'Pending', value: requests.filter(r => r.status === 'pending').length, icon: Clock, color: 'from-yellow-500 to-amber-500' },
    { label: 'Approved', value: requests.filter(r => r.status === 'approved').length, icon: CheckCircle, color: 'from-green-500 to-emerald-500' },
    { label: 'Rejected', value: requests.filter(r => r.status === 'rejected').length, icon: XCircle, color: 'from-red-500 to-rose-500' },
  ];

  if (!isAdmin) return null;

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-950' : 'bg-gray-50'}`}>
      <SEOHead title="Product Requests" description="Manage customer product requests" />
      <ShopNav />

      <div className="container mx-auto px-4 lg:px-6 py-8">
        <div className="mb-8">
          <h1 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Product Requests
          </h1>
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
            View and manage customer product requests
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statsCards.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-xl ${
                theme === 'dark' ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
              }`}
            >
              <div className={`inline-flex p-2 rounded-lg bg-gradient-to-r ${stat.color} mb-3`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {stat.value}
              </p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {['all', ...statusOptions.map(s => s.value)].map((status) => (
            <button
              key={status}
              onClick={() => { setFilter(status); setPage(1); }}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                filter === status
                  ? theme === 'dark'
                    ? 'bg-electric-green text-black'
                    : 'bg-accent-blue text-white'
                  : theme === 'dark'
                    ? 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        <AdminTable
          columns={columns}
          data={requests}
          renderCell={renderCell}
          loading={loading}
          emptyMessage="No product requests found"
          pagination={{
            page,
            totalPages: Math.ceil(total / 20),
            onPageChange: setPage,
          }}
        />
      </div>

      {viewRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`w-full max-w-lg rounded-2xl p-6 ${
              theme === 'dark' ? 'bg-slate-800' : 'bg-white'
            }`}
          >
            <h3 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Request Details
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Customer</label>
                <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {viewRequest.name} ({viewRequest.email})
                </p>
              </div>
              
              <div>
                <label className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Product Requested</label>
                <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {viewRequest.productName}
                </p>
              </div>

              {viewRequest.description && (
                <div>
                  <label className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Description</label>
                  <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                    {viewRequest.description}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Category</label>
                  <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                    {viewRequest.category || 'Not specified'}
                  </p>
                </div>
                <div>
                  <label className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Budget</label>
                  <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                    {viewRequest.budget || 'Not specified'}
                  </p>
                </div>
              </div>

              <div>
                <label className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Status</label>
                <p className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusColors[viewRequest.status]}`}>
                  {viewRequest.status}
                </p>
              </div>

              {viewRequest.adminNotes && (
                <div>
                  <label className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Admin Notes</label>
                  <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                    {viewRequest.adminNotes}
                  </p>
                </div>
              )}

              <div>
                <label className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Submitted</label>
                <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                  {new Date(viewRequest.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => { handleEdit(viewRequest); setViewRequest(null); }}
                className={`px-4 py-2 rounded-xl font-medium ${
                  theme === 'dark'
                    ? 'bg-slate-700 text-white hover:bg-slate-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Edit
              </button>
              <button
                onClick={() => setViewRequest(null)}
                className={`px-4 py-2 rounded-xl font-medium ${
                  theme === 'dark'
                    ? 'bg-electric-green text-black'
                    : 'bg-accent-blue text-white'
                }`}
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
