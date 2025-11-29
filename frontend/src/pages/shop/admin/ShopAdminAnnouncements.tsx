import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Megaphone, Plus, Loader2 } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { useShopAuth } from '../../../contexts/ShopAuthContext';
import ShopNav from '../../../components/shop/ShopNav';
import SEOHead from '../../../components/shop/SEOHead';
import AdminTable from '../../../components/shop/AdminTable';
import AdminDialog, { ConfirmDialog } from '../../../components/shop/AdminDialog';
import shopApi from '../../../utils/shopApi';
import type { Announcement } from '../../../types/shop';

export default function ShopAdminAnnouncements() {
  const { theme } = useTheme();
  const { isAdmin } = useShopAuth();
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [deleting, setDeleting] = useState<Announcement | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'info',
    targetUrl: '',
    isActive: true,
    priority: '0',
  });

  useEffect(() => {
    if (!isAdmin) navigate('/shop/login');
  }, [isAdmin, navigate]);

  useEffect(() => {
    if (isAdmin) fetchAnnouncements();
  }, [isAdmin]);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await shopApi.getAdminAnnouncements();
      if (res.success && res.data) setAnnouncements(res.data);
    } catch (error) {
      console.error('Failed to fetch announcements');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: Announcement) => {
    setEditing(item);
    setFormData({
      title: item.title,
      content: item.content,
      type: item.type,
      targetUrl: item.targetUrl || '',
      isActive: item.isActive,
      priority: item.priority.toString(),
    });
    setDialogOpen(true);
  };

  const handleDelete = (item: Announcement) => {
    setDeleting(item);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      await shopApi.deleteAnnouncement(deleting.id);
      await fetchAnnouncements();
    } catch (error) {
      console.error('Failed to delete');
    } finally {
      setDeleteDialogOpen(false);
      setDeleting(null);
    }
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const data = {
        title: formData.title,
        content: formData.content,
        type: formData.type,
        targetUrl: formData.targetUrl || undefined,
        isActive: formData.isActive,
        priority: parseInt(formData.priority) || 0,
      };
      if (editing) {
        await shopApi.updateAnnouncement(editing.id, data);
      } else {
        await shopApi.createAnnouncement(data);
      }
      await fetchAnnouncements();
      closeDialog();
    } catch (error) {
      console.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditing(null);
    setFormData({ title: '', content: '', type: 'info', targetUrl: '', isActive: true, priority: '0' });
  };

  const typeColors: Record<string, string> = {
    info: 'bg-blue-500/20 text-blue-500',
    warning: 'bg-yellow-500/20 text-yellow-500',
    success: 'bg-green-500/20 text-green-500',
    promo: 'bg-purple-500/20 text-purple-500',
  };

  const columns = [
    {
      key: 'title',
      label: 'Announcement',
      render: (item: Announcement) => (
        <div>
          <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{item.title}</p>
          <p className={`text-sm truncate max-w-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{item.content}</p>
        </div>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      render: (item: Announcement) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${typeColors[item.type] || typeColors.info}`}>{item.type}</span>
      ),
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (item: Announcement) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.isActive ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-500'}`}>
          {item.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
  ];

  if (!isAdmin) return null;

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-950' : 'bg-gray-50'}`}>
      <SEOHead title="Manage Announcements" description="Admin announcements management" />
      <ShopNav />
      <div className="container mx-auto px-4 lg:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-3xl font-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Announcements</h1>
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Manage site announcements</p>
          </div>
          <button onClick={() => setDialogOpen(true)} className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium ${theme === 'dark' ? 'bg-electric-green text-slate-900' : 'bg-accent-blue text-white'}`}>
            <Plus className="w-5 h-5" />Add Announcement
          </button>
        </div>
        <AdminTable data={announcements} columns={columns} loading={loading} onEdit={handleEdit} onDelete={handleDelete} emptyMessage="No announcements found" />
      </div>

      <AdminDialog isOpen={dialogOpen} onClose={closeDialog} title={editing ? 'Edit Announcement' : 'Add Announcement'} size="md"
        footer={
          <div className="flex justify-end gap-3">
            <button onClick={closeDialog} className={`px-4 py-2 rounded-lg font-medium ${theme === 'dark' ? 'bg-slate-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>Cancel</button>
            <button onClick={handleSubmit} disabled={saving || !formData.title || !formData.content} className={`px-4 py-2 rounded-lg font-medium disabled:opacity-50 ${theme === 'dark' ? 'bg-electric-green text-slate-900' : 'bg-accent-blue text-white'}`}>
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : editing ? 'Update' : 'Create'}
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
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Content *</label>
            <textarea value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} rows={3} className={`w-full px-4 py-2 rounded-lg border resize-none ${theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Type</label>
              <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}>
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="success">Success</option>
                <option value="promo">Promo</option>
              </select>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Priority</label>
              <input type="number" value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })} className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`} />
            </div>
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Target URL</label>
            <input type="text" value={formData.targetUrl} onChange={(e) => setFormData({ ...formData, targetUrl: e.target.value })} className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`} />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="rounded" />
            <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Active</span>
          </label>
        </div>
      </AdminDialog>

      <ConfirmDialog isOpen={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} onConfirm={confirmDelete} title="Delete Announcement" description={`Are you sure you want to delete "${deleting?.title}"?`} confirmText="Delete" variant="danger" />
    </div>
  );
}
