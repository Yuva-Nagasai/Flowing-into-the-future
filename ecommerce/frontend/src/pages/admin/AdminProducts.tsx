import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Link, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { Plus, Edit, Trash2, ChevronLeft } from 'lucide-react';
import api from '../../utils/api';

interface Product {
  id: number;
  name: string;
  slug: string;
  price: string;
  category: string;
  stock: number;
  featured: boolean;
  active: boolean;
  thumbnail?: string;
}

const categories = [
  { value: 'electronics', label: 'Electronics' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'home', label: 'Home' },
  { value: 'books', label: 'Books' },
  { value: 'sports', label: 'Sports' },
  { value: 'beauty', label: 'Beauty' },
  { value: 'toys', label: 'Toys' },
  { value: 'food', label: 'Food' },
  { value: 'other', label: 'Other' }
];

function ProductList() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const response = await api.get('/products?limit=50');
      return response.data.data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    }
  });

  if (isLoading) {
    return <div className="animate-pulse h-64 bg-gray-100 rounded-lg" />;
  }

  const products: Product[] = data?.items || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">All Products</h2>
        <Link to="/admin/products/new" className="btn-primary flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Link>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Product</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Category</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Price</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Stock</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden mr-3">
                      {product.thumbnail ? (
                        <img src={product.thumbnail} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">N/A</div>
                      )}
                    </div>
                    <span className="font-medium">{product.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm capitalize">{product.category}</td>
                <td className="px-4 py-3 text-sm">${parseFloat(product.price).toFixed(2)}</td>
                <td className="px-4 py-3 text-sm">{product.stock}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    product.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {product.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    to={`/admin/products/${product.id}/edit`}
                    className="p-2 text-gray-600 hover:text-brand-accent inline-block"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this product?')) {
                        deleteMutation.mutate(product.id);
                      }
                    }}
                    className="p-2 text-gray-600 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <div className="p-8 text-center text-gray-600">
            No products yet. Add your first product!
          </div>
        )}
      </div>
    </div>
  );
}

function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    shortDescription: '',
    price: '',
    comparePrice: '',
    category: 'electronics',
    stock: '0',
    sku: '',
    featured: false,
    active: true,
    thumbnail: '',
    images: [] as string[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const { isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const response = await api.get(`/products/${id}`);
      const product = response.data.data;
      setFormData({
        name: product.name,
        description: product.description,
        shortDescription: product.shortDescription || '',
        price: product.price,
        comparePrice: product.comparePrice || '',
        category: product.category,
        stock: product.stock.toString(),
        sku: product.sku || '',
        featured: product.featured,
        active: product.active,
        thumbnail: product.thumbnail || '',
        images: product.images || []
      });
      return product;
    },
    enabled: isEditing
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        comparePrice: formData.comparePrice ? parseFloat(formData.comparePrice) : null,
        stock: parseInt(formData.stock)
      };

      if (isEditing) {
        await api.put(`/products/${id}`, payload);
      } else {
        await api.post('/products', payload);
      }

      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      navigate('/admin/products');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      setError(error.response?.data?.error || 'Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEditing && isLoading) {
    return <div className="animate-pulse h-64 bg-gray-100 rounded-lg" />;
  }

  return (
    <div>
      <Link to="/admin/products" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
        <ChevronLeft className="w-4 h-4 mr-1" />
        Back to Products
      </Link>

      <h2 className="text-xl font-semibold mb-6">{isEditing ? 'Edit Product' : 'Add New Product'}</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card p-6 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="input"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
          <input
            type="text"
            value={formData.shortDescription}
            onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
            className="input"
            maxLength={500}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            rows={5}
            className="input"
          />
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Compare Price ($)</label>
            <input
              type="number"
              step="0.01"
              value={formData.comparePrice}
              onChange={(e) => setFormData({ ...formData, comparePrice: e.target.value })}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
            <input
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              required
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
            <input
              type="text"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              className="input"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail URL</label>
          <input
            type="url"
            value={formData.thumbnail}
            onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
            className="input"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className="flex gap-6">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-4 h-4 text-brand-accent rounded"
            />
            <span className="text-sm">Featured Product</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="w-4 h-4 text-brand-accent rounded"
            />
            <span className="text-sm">Active (Visible to customers)</span>
          </label>
        </div>

        <div className="flex gap-4">
          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {isSubmitting ? 'Saving...' : (isEditing ? 'Update Product' : 'Create Product')}
          </button>
          <Link to="/admin/products" className="btn-secondary">Cancel</Link>
        </div>
      </form>
    </div>
  );
}

export default function AdminProducts() {
  return (
    <Routes>
      <Route path="/" element={<ProductList />} />
      <Route path="/new" element={<ProductForm />} />
      <Route path="/:id/edit" element={<ProductForm />} />
    </Routes>
  );
}
