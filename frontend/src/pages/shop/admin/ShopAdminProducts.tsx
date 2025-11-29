import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Plus, Loader2 } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { useShopAuth } from '../../../contexts/ShopAuthContext';
import ShopNav from '../../../components/shop/ShopNav';
import SEOHead from '../../../components/shop/SEOHead';
import AdminTable from '../../../components/shop/AdminTable';
import AdminDialog, { ConfirmDialog } from '../../../components/shop/AdminDialog';
import FileUpload from '../../../components/shop/FileUpload';
import shopApi from '../../../utils/shopApi';
import type { Product, Category } from '../../../types/shop';

export default function ShopAdminProducts() {
  const { theme } = useTheme();
  const { isAdmin } = useShopAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    shortDescription: '',
    price: '',
    comparePrice: '',
    categoryId: '',
    stock: '',
    sku: '',
    featured: false,
    isActive: true,
    tags: '',
  });
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/shop/login');
    }
  }, [isAdmin, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchProducts();
      fetchCategories();
    }
  }, [isAdmin, page]);

  useEffect(() => {
    if (searchParams.get('action') === 'new') {
      setDialogOpen(true);
    }
  }, [searchParams]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await shopApi.getAdminProducts({ page, limit: 20 });
      if (res.success) {
        setProducts(res.data);
        setTotal(res.pagination.total);
      }
    } catch (error) {
      console.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await shopApi.getAdminCategories();
      if (res.success && res.data) {
        setCategories(res.data);
      }
    } catch (error) {
      console.error('Failed to fetch categories');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      shortDescription: product.shortDescription || '',
      price: product.price,
      comparePrice: product.comparePrice || '',
      categoryId: product.categoryId?.toString() || '',
      stock: product.stock.toString(),
      sku: product.sku || '',
      featured: product.featured,
      isActive: product.isActive,
      tags: product.tags.join(', '),
    });
    setImages(product.images);
    setDialogOpen(true);
  };

  const handleDelete = (product: Product) => {
    setDeletingProduct(product);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingProduct) return;
    try {
      await shopApi.deleteProduct(deletingProduct.id);
      await fetchProducts();
    } catch (error) {
      console.error('Failed to delete product');
    } finally {
      setDeleteDialogOpen(false);
      setDeletingProduct(null);
    }
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('shortDescription', formData.shortDescription);
      data.append('price', formData.price);
      if (formData.comparePrice) data.append('comparePrice', formData.comparePrice);
      if (formData.categoryId) data.append('categoryId', formData.categoryId);
      data.append('stock', formData.stock);
      if (formData.sku) data.append('sku', formData.sku);
      data.append('featured', formData.featured.toString());
      data.append('isActive', formData.isActive.toString());
      data.append('tags', formData.tags);
      data.append('images', JSON.stringify(images));

      if (editingProduct) {
        await shopApi.updateProduct(editingProduct.id, data);
      } else {
        await shopApi.createProduct(data);
      }
      await fetchProducts();
      closeDialog();
    } catch (error) {
      console.error('Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      shortDescription: '',
      price: '',
      comparePrice: '',
      categoryId: '',
      stock: '',
      sku: '',
      featured: false,
      isActive: true,
      tags: '',
    });
    setImages([]);
  };

  const columns = [
    {
      key: 'name',
      label: 'Product',
      render: (product: Product) => (
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
            theme === 'dark' ? 'bg-slate-700' : 'bg-gray-100'
          }`}>
            {product.thumbnail ? (
              <img src={product.thumbnail} alt="" className="w-full h-full object-cover rounded-lg" />
            ) : (
              <Package className="w-5 h-5 text-gray-400" />
            )}
          </div>
          <div>
            <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {product.name}
            </p>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              {product.category?.name || 'No category'}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'price',
      label: 'Price',
      render: (product: Product) => (
        <span className={`font-medium ${theme === 'dark' ? 'text-electric-green' : 'text-accent-blue'}`}>
          ${parseFloat(product.price).toFixed(2)}
        </span>
      ),
    },
    {
      key: 'stock',
      label: 'Stock',
      render: (product: Product) => (
        <span className={product.stock > 10 ? 'text-green-500' : product.stock > 0 ? 'text-orange-500' : 'text-red-500'}>
          {product.stock}
        </span>
      ),
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (product: Product) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          product.isActive ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-500'
        }`}>
          {product.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
  ];

  if (!isAdmin) return null;

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-950' : 'bg-gray-50'}`}>
      <SEOHead title="Manage Products" description="Admin product management" />
      <ShopNav />

      <div className="container mx-auto px-4 lg:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-3xl font-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Products
            </h1>
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              Manage your product catalog
            </p>
          </div>
          <button
            onClick={() => setDialogOpen(true)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
              theme === 'dark'
                ? 'bg-electric-green text-slate-900 hover:bg-electric-green/90'
                : 'bg-accent-blue text-white hover:bg-accent-blue/90'
            }`}
          >
            <Plus className="w-5 h-5" />
            Add Product
          </button>
        </div>

        <AdminTable
          data={products}
          columns={columns}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          emptyMessage="No products found"
          pagination={{
            page,
            limit: 20,
            total,
            onPageChange: setPage,
          }}
        />
      </div>

      <AdminDialog
        isOpen={dialogOpen}
        onClose={closeDialog}
        title={editingProduct ? 'Edit Product' : 'Add Product'}
        size="lg"
        footer={
          <div className="flex justify-end gap-3">
            <button
              onClick={closeDialog}
              className={`px-4 py-2 rounded-lg font-medium ${
                theme === 'dark'
                  ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving || !formData.name || !formData.price}
              className={`px-4 py-2 rounded-lg font-medium disabled:opacity-50 ${
                theme === 'dark'
                  ? 'bg-electric-green text-slate-900 hover:bg-electric-green/90'
                  : 'bg-accent-blue text-white hover:bg-accent-blue/90'
              }`}
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : editingProduct ? 'Update' : 'Create'}
            </button>
          </div>
        }
      >
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Product Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-4 py-2 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-slate-700 border-slate-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Price *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-slate-700 border-slate-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Compare Price
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.comparePrice}
                onChange={(e) => setFormData({ ...formData, comparePrice: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-slate-700 border-slate-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Category
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-slate-700 border-slate-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Stock
              </label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-slate-700 border-slate-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Short Description
            </label>
            <input
              type="text"
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              className={`w-full px-4 py-2 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-slate-700 border-slate-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className={`w-full px-4 py-2 rounded-lg border resize-none ${
                theme === 'dark'
                  ? 'bg-slate-700 border-slate-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Images
            </label>
            <FileUpload
              onUpload={(urls) => setImages([...images, ...urls])}
              existingFiles={images}
              onRemove={(url) => setImages(images.filter((img) => img !== url))}
              multiple
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                SKU
              </label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-slate-700 border-slate-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-slate-700 border-slate-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="rounded"
              />
              <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Featured</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="rounded"
              />
              <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Active</span>
            </label>
          </div>
        </div>
      </AdminDialog>

      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Product"
        description={`Are you sure you want to delete "${deletingProduct?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}
