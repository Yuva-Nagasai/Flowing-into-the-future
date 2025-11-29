import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Trash2 } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { useShopAuth } from '../../../contexts/ShopAuthContext';
import ShopNav from '../../../components/shop/ShopNav';
import SEOHead from '../../../components/shop/SEOHead';
import AdminTable from '../../../components/shop/AdminTable';
import { ConfirmDialog } from '../../../components/shop/AdminDialog';
import shopApi from '../../../utils/shopApi';
import type { NewsletterSubscriber } from '../../../types/shop';

export default function ShopAdminNewsletter() {
  const { theme } = useTheme();
  const { isAdmin } = useShopAuth();
  const navigate = useNavigate();
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState<NewsletterSubscriber | null>(null);

  useEffect(() => {
    if (!isAdmin) navigate('/shop/login');
  }, [isAdmin, navigate]);

  useEffect(() => {
    if (isAdmin) fetchSubscribers();
  }, [isAdmin, page]);

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const res = await shopApi.getAdminNewsletterSubscribers({ page, limit: 20 });
      if (res.success) {
        setSubscribers(res.data);
        setTotal(res.pagination.total);
      }
    } catch (error) {
      console.error('Failed to fetch');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (item: NewsletterSubscriber) => {
    setDeleting(item);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      await shopApi.deleteNewsletterSubscriber(deleting.id);
      await fetchSubscribers();
    } catch (error) {
      console.error('Failed to delete');
    } finally {
      setDeleteDialogOpen(false);
      setDeleting(null);
    }
  };

  const columns = [
    {
      key: 'email',
      label: 'Email',
      render: (item: NewsletterSubscriber) => (
        <div className="flex items-center gap-3">
          <Mail className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
          <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{item.email}</span>
        </div>
      ),
    },
    {
      key: 'name',
      label: 'Name',
      render: (item: NewsletterSubscriber) => item.name || '-',
    },
    {
      key: 'subscribedAt',
      label: 'Subscribed',
      render: (item: NewsletterSubscriber) => new Date(item.subscribedAt).toLocaleDateString(),
    },
    {
      key: 'source',
      label: 'Source',
      render: (item: NewsletterSubscriber) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${theme === 'dark' ? 'bg-slate-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
          {item.source || 'website'}
        </span>
      ),
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (item: NewsletterSubscriber) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.isActive ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
          {item.isActive ? 'Active' : 'Unsubscribed'}
        </span>
      ),
    },
  ];

  if (!isAdmin) return null;

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-950' : 'bg-gray-50'}`}>
      <SEOHead title="Newsletter Subscribers" description="Admin newsletter management" />
      <ShopNav />
      <div className="container mx-auto px-4 lg:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-3xl font-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Newsletter</h1>
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Manage newsletter subscribers ({total} total)</p>
          </div>
        </div>
        <AdminTable
          data={subscribers}
          columns={columns}
          loading={loading}
          onDelete={handleDelete}
          actions
          emptyMessage="No subscribers found"
          pagination={{ page, limit: 20, total, onPageChange: setPage }}
        />
      </div>

      <ConfirmDialog isOpen={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} onConfirm={confirmDelete} title="Remove Subscriber" description={`Are you sure you want to remove "${deleting?.email}" from the newsletter?`} confirmText="Remove" variant="danger" />
    </div>
  );
}
