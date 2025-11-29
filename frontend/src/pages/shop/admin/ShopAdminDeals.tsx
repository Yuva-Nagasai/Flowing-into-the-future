import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag, Plus, Loader2 } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { useShopAuth } from '../../../contexts/ShopAuthContext';
import ShopNav from '../../../components/shop/ShopNav';
import SEOHead from '../../../components/shop/SEOHead';
import AdminTable from '../../../components/shop/AdminTable';
import AdminDialog, { ConfirmDialog } from '../../../components/shop/AdminDialog';
import shopApi from '../../../utils/shopApi';
import type { Deal } from '../../../types/shop';

export default function ShopAdminDeals() {
  const { theme } = useTheme();
  const { isAdmin } = useShopAuth();
  const navigate = useNavigate();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [deletingDeal, setDeletingDeal] = useState<Deal | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    startDate: '',
    endDate: '',
    bannerImage: '',
    isActive: true,
    priority: '0',
  });

  useEffect(() => {
    if (!isAdmin) navigate('/shop/login');
  }, [isAdmin, navigate]);

  useEffect(() => {
    if (isAdmin) fetchDeals();
  }, [isAdmin]);

  const fetchDeals = async () => {
    setLoading(true);
    try {
      const res = await shopApi.getAdminDeals();
      if (res.success && res.data) setDeals(res.data);
    } catch (error) {
      console.error('Failed to fetch deals');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (deal: Deal) => {
    setEditingDeal(deal);
    setFormData({
      title: deal.title,
      description: deal.description || '',
      discountType: deal.discountType,
      discountValue: deal.discountValue,
      startDate: deal.startDate.slice(0, 16),
      endDate: deal.endDate.slice(0, 16),
      bannerImage: deal.bannerImage || '',
      isActive: deal.isActive,
      priority: deal.priority.toString(),
    });
    setDialogOpen(true);
  };

  const handleDelete = (deal: Deal) => {
    setDeletingDeal(deal);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingDeal) return;
    try {
      await shopApi.deleteDeal(deletingDeal.id);
      await fetchDeals();
    } catch (error) {
      console.error('Failed to delete deal');
    } finally {
      setDeleteDialogOpen(false);
      setDeletingDeal(null);
    }
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const data = {
        title: formData.title,
        description: formData.description || undefined,
        discountType: formData.discountType,
        discountValue: formData.discountValue,
        startDate: formData.startDate,
        endDate: formData.endDate,
        bannerImage: formData.bannerImage || undefined,
        isActive: formData.isActive,
        priority: parseInt(formData.priority) || 0,
      };
      if (editingDeal) {
        await shopApi.updateDeal(editingDeal.id, data);
      } else {
        await shopApi.createDeal(data);
      }
      await fetchDeals();
      closeDialog();
    } catch (error) {
      console.error('Failed to save deal');
    } finally {
      setSaving(false);
    }
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingDeal(null);
    setFormData({ title: '', description: '', discountType: 'percentage', discountValue: '', startDate: '', endDate: '', bannerImage: '', isActive: true, priority: '0' });
  };

  const columns = [
    {
      key: 'title',
      label: 'Deal',
      render: (deal: Deal) => (
        <div>
          <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{deal.title}</p>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            {deal.discountType === 'percentage' ? `${deal.discountValue}% off` : `$${deal.discountValue} off`}
          </p>
        </div>
      ),
    },
    {
      key: 'endDate',
      label: 'Ends',
      render: (deal: Deal) => new Date(deal.endDate).toLocaleDateString(),
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (deal: Deal) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${deal.isActive ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-500'}`}>
          {deal.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
  ];

  if (!isAdmin) return null;

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-950' : 'bg-gray-50'}`}>
      <SEOHead title="Manage Deals" description="Admin deals management" />
      <ShopNav />
      <div className="container mx-auto px-4 lg:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-3xl font-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Deals</h1>
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Manage promotional deals</p>
          </div>
          <button onClick={() => setDialogOpen(true)} className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium ${theme === 'dark' ? 'bg-electric-green text-slate-900' : 'bg-accent-blue text-white'}`}>
            <Plus className="w-5 h-5" />Add Deal
          </button>
        </div>
        <AdminTable data={deals} columns={columns} loading={loading} onEdit={handleEdit} onDelete={handleDelete} emptyMessage="No deals found" />
      </div>

      <AdminDialog isOpen={dialogOpen} onClose={closeDialog} title={editingDeal ? 'Edit Deal' : 'Add Deal'} size="md"
        footer={
          <div className="flex justify-end gap-3">
            <button onClick={closeDialog} className={`px-4 py-2 rounded-lg font-medium ${theme === 'dark' ? 'bg-slate-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>Cancel</button>
            <button onClick={handleSubmit} disabled={saving || !formData.title || !formData.discountValue} className={`px-4 py-2 rounded-lg font-medium disabled:opacity-50 ${theme === 'dark' ? 'bg-electric-green text-slate-900' : 'bg-accent-blue text-white'}`}>
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : editingDeal ? 'Update' : 'Create'}
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Title *</label>
            <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`} />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Description</label>
            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className={`w-full px-4 py-2 rounded-lg border resize-none ${theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Discount Type</label>
              <select value={formData.discountType} onChange={(e) => setFormData({ ...formData, discountType: e.target.value })} className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}>
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Discount Value *</label>
              <input type="number" value={formData.discountValue} onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })} className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Start Date</label>
              <input type="datetime-local" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`} />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>End Date</label>
              <input type="datetime-local" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`} />
            </div>
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Banner Image URL</label>
            <input type="text" value={formData.bannerImage} onChange={(e) => setFormData({ ...formData, bannerImage: e.target.value })} className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`} />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="rounded" />
            <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Active</span>
          </label>
        </div>
      </AdminDialog>

      <ConfirmDialog isOpen={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} onConfirm={confirmDelete} title="Delete Deal" description={`Are you sure you want to delete "${deletingDeal?.title}"?`} confirmText="Delete" variant="danger" />
    </div>
  );
}
