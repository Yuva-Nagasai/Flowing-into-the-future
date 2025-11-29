import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Check, X } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { useShopAuth } from '../../../contexts/ShopAuthContext';
import ShopNav from '../../../components/shop/ShopNav';
import SEOHead from '../../../components/shop/SEOHead';
import AdminTable from '../../../components/shop/AdminTable';
import { ConfirmDialog } from '../../../components/shop/AdminDialog';
import shopApi from '../../../utils/shopApi';
import type { Review } from '../../../types/shop';

export default function ShopAdminReviews() {
  const { theme } = useTheme();
  const { isAdmin } = useShopAuth();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState<Review | null>(null);

  useEffect(() => {
    if (!isAdmin) navigate('/shop/login');
  }, [isAdmin, navigate]);

  useEffect(() => {
    if (isAdmin) fetchReviews();
  }, [isAdmin, page, filter]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 20 };
      if (filter === 'pending') params.approved = false;
      if (filter === 'approved') params.approved = true;
      const res = await shopApi.getAdminReviews(params);
      if (res.success) {
        setReviews(res.data);
        setTotal(res.pagination.total);
      }
    } catch (error) {
      console.error('Failed to fetch');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (review: Review) => {
    try {
      await shopApi.approveReview(review.id);
      await fetchReviews();
    } catch (error) {
      console.error('Failed to approve');
    }
  };

  const handleReject = (review: Review) => {
    setDeleting(review);
    setDeleteDialogOpen(true);
  };

  const confirmReject = async () => {
    if (!deleting) return;
    try {
      await shopApi.rejectReview(deleting.id);
      await fetchReviews();
    } catch (error) {
      console.error('Failed to reject');
    } finally {
      setDeleteDialogOpen(false);
      setDeleting(null);
    }
  };

  const columns = [
    {
      key: 'productId',
      label: 'Product',
      render: (item: Review) => (
        <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Product #{item.productId}</span>
      ),
    },
    {
      key: 'rating',
      label: 'Rating',
      render: (item: Review) => (
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-4 h-4 ${i < item.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
          ))}
        </div>
      ),
    },
    {
      key: 'comment',
      label: 'Comment',
      render: (item: Review) => (
        <div className="max-w-xs">
          {item.title && <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{item.title}</p>}
          <p className={`text-sm truncate ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{item.comment}</p>
        </div>
      ),
    },
    {
      key: 'isApproved',
      label: 'Status',
      render: (item: Review) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.isApproved ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
          {item.isApproved ? 'Approved' : 'Pending'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (item: Review) => (
        <div className="flex items-center gap-2">
          {!item.isApproved && (
            <button
              onClick={() => handleApprove(item)}
              className="p-1 rounded-lg bg-green-500/20 text-green-500 hover:bg-green-500/30 transition-colors"
              title="Approve"
            >
              <Check className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => handleReject(item)}
            className="p-1 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500/30 transition-colors"
            title="Reject"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  if (!isAdmin) return null;

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-950' : 'bg-gray-50'}`}>
      <SEOHead title="Review Moderation" description="Admin review moderation" />
      <ShopNav />
      <div className="container mx-auto px-4 lg:px-6 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className={`text-3xl font-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Reviews</h1>
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Moderate customer reviews</p>
          </div>
          <div className="flex gap-2">
            {(['all', 'pending', 'approved'] as const).map((f) => (
              <button
                key={f}
                onClick={() => { setFilter(f); setPage(1); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                  filter === f
                    ? theme === 'dark' ? 'bg-electric-green text-slate-900' : 'bg-accent-blue text-white'
                    : theme === 'dark' ? 'bg-slate-800 text-gray-300 hover:bg-slate-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <AdminTable
          data={reviews}
          columns={columns}
          loading={loading}
          actions={false}
          emptyMessage="No reviews found"
          pagination={{ page, limit: 20, total, onPageChange: setPage }}
        />
      </div>

      <ConfirmDialog isOpen={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} onConfirm={confirmReject} title="Reject Review" description="Are you sure you want to reject and delete this review?" confirmText="Reject" variant="danger" />
    </div>
  );
}
