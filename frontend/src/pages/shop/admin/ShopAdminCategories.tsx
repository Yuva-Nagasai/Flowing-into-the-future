import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, Plus, Loader2 } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { useShopAuth } from '../../../contexts/ShopAuthContext';
import ShopNav from '../../../components/shop/ShopNav';
import SEOHead from '../../../components/shop/SEOHead';
import AdminTable from '../../../components/shop/AdminTable';
import AdminDialog, { ConfirmDialog } from '../../../components/shop/AdminDialog';
import shopApi from '../../../utils/shopApi';
import type { Category } from '../../../types/shop';

export default function ShopAdminCategories() {
  const { theme } = useTheme();
  const { isAdmin } = useShopAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    isActive: true,
    sortOrder: '0',
  });

  useEffect(() => {
    if (!isAdmin) navigate('/shop/login');
  }, [isAdmin, navigate]);

  useEffect(() => {
    if (isAdmin) fetchCategories();
  }, [isAdmin]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await shopApi.getAdminCategories();
      if (res.success && res.data) setCategories(res.data);
    } catch (error) {
      console.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      image: category.image || '',
      isActive: category.isActive,
      sortOrder: category.sortOrder.toString(),
    });
    setDialogOpen(true);
  };

  const handleDelete = (category: Category) => {
    setDeletingCategory(category);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingCategory) return;
    try {
      await shopApi.deleteCategory(deletingCategory.id);
      await fetchCategories();
    } catch (error) {
      console.error('Failed to delete category');
    } finally {
      setDeleteDialogOpen(false);
      setDeletingCategory(null);
    }
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const data = {
        name: formData.name,
        description: formData.description || undefined,
        image: formData.image || undefined,
        isActive: formData.isActive,
        sortOrder: parseInt(formData.sortOrder) || 0,
      };
      if (editingCategory) {
        await shopApi.updateCategory(editingCategory.id, data);
      } else {
        await shopApi.createCategory(data);
      }
      await fetchCategories();
      closeDialog();
    } catch (error) {
      console.error('Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingCategory(null);
    setFormData({ name: '', description: '', image: '', isActive: true, sortOrder: '0' });
  };

  const columns = [
    {
      key: 'name',
      label: 'Category',
      render: (cat: Category) => (
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${theme === 'dark' ? 'bg-slate-700' : 'bg-gray-100'}`}>
            {cat.image ? (
              <img src={cat.image} alt="" className="w-full h-full object-cover rounded-lg" />
            ) : (
              <Layers className="w-5 h-5 text-gray-400" />
            )}
          </div>
          <div>
            <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{cat.name}</p>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{cat.slug}</p>
          </div>
        </div>
      ),
    },
    { key: 'sortOrder', label: 'Order', sortable: true },
    {
      key: 'isActive',
      label: 'Status',
      render: (cat: Category) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${cat.isActive ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-500'}`}>
          {cat.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
  ];

  if (!isAdmin) return null;

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-950' : 'bg-gray-50'}`}>
      <SEOHead title="Manage Categories" description="Admin category management" />
      <ShopNav />
      <div className="container mx-auto px-4 lg:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-3xl font-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Categories</h1>
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Manage product categories</p>
          </div>
          <button onClick={() => setDialogOpen(true)} className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium ${theme === 'dark' ? 'bg-electric-green text-slate-900' : 'bg-accent-blue text-white'}`}>
            <Plus className="w-5 h-5" />Add Category
          </button>
        </div>
        <AdminTable data={categories} columns={columns} loading={loading} onEdit={handleEdit} onDelete={handleDelete} emptyMessage="No categories found" />
      </div>

      <AdminDialog isOpen={dialogOpen} onClose={closeDialog} title={editingCategory ? 'Edit Category' : 'Add Category'} size="md"
        footer={
          <div className="flex justify-end gap-3">
            <button onClick={closeDialog} className={`px-4 py-2 rounded-lg font-medium ${theme === 'dark' ? 'bg-slate-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>Cancel</button>
            <button onClick={handleSubmit} disabled={saving || !formData.name} className={`px-4 py-2 rounded-lg font-medium disabled:opacity-50 ${theme === 'dark' ? 'bg-electric-green text-slate-900' : 'bg-accent-blue text-white'}`}>
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : editingCategory ? 'Update' : 'Create'}
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Name *</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`} />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Description</label>
            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className={`w-full px-4 py-2 rounded-lg border resize-none ${theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`} />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Image URL</label>
            <input type="text" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`} />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Sort Order</label>
            <input type="number" value={formData.sortOrder} onChange={(e) => setFormData({ ...formData, sortOrder: e.target.value })} className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`} />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="rounded" />
            <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Active</span>
          </label>
        </div>
      </AdminDialog>

      <ConfirmDialog isOpen={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} onConfirm={confirmDelete} title="Delete Category" description={`Are you sure you want to delete "${deletingCategory?.name}"?`} confirmText="Delete" variant="danger" />
    </div>
  );
}
