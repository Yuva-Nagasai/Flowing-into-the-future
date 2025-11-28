import { useQuery } from '@tanstack/react-query';
import { Link, Routes, Route, useNavigate } from 'react-router-dom';
import { Package, ShoppingCart, Users, DollarSign, TrendingUp, Plus } from 'lucide-react';
import api from '../../utils/api';
import { useAuth } from '../../hooks/useAuth';
import AdminProducts from './AdminProducts';
import AdminOrders from './AdminOrders';

interface Stats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
}

function DashboardHome() {
  const { data: stats, isLoading } = useQuery<Stats>({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [productsRes, ordersRes] = await Promise.all([
        api.get('/products?limit=1'),
        api.get('/orders?limit=1')
      ]);

      return {
        totalProducts: productsRes.data.data.total || 0,
        totalOrders: ordersRes.data.data.total || 0,
        totalRevenue: 0,
        pendingOrders: 0
      };
    }
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
            <div className="h-8 bg-gray-200 rounded w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Products</p>
              <p className="text-2xl font-bold">{stats?.totalProducts || 0}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold">{stats?.totalOrders || 0}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Revenue</p>
              <p className="text-2xl font-bold">$0</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Orders</p>
              <p className="text-2xl font-bold">{stats?.pendingOrders || 0}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Quick Actions</h2>
          </div>
          <div className="space-y-3">
            <Link
              to="/admin/products/new"
              className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
            >
              <Plus className="w-5 h-5 mr-3 text-brand-accent" />
              Add New Product
            </Link>
            <Link
              to="/admin/orders"
              className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
            >
              <ShoppingCart className="w-5 h-5 mr-3 text-brand-accent" />
              View All Orders
            </Link>
            <Link
              to="/admin/products"
              className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
            >
              <Package className="w-5 h-5 mr-3 text-brand-accent" />
              Manage Products
            </Link>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-4">Getting Started</h2>
          <div className="space-y-3 text-sm text-gray-600">
            <p>Welcome to your admin dashboard! Here you can:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Add and manage products</li>
              <li>View and process orders</li>
              <li>Track sales and revenue</li>
              <li>Manage customer information</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    navigate('/');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </div>

      <div className="flex gap-4 mb-8 border-b">
        <Link
          to="/admin"
          className="px-4 py-2 text-gray-600 hover:text-gray-900 border-b-2 border-transparent hover:border-brand-accent"
        >
          Overview
        </Link>
        <Link
          to="/admin/products"
          className="px-4 py-2 text-gray-600 hover:text-gray-900 border-b-2 border-transparent hover:border-brand-accent"
        >
          Products
        </Link>
        <Link
          to="/admin/orders"
          className="px-4 py-2 text-gray-600 hover:text-gray-900 border-b-2 border-transparent hover:border-brand-accent"
        >
          Orders
        </Link>
      </div>

      <Routes>
        <Route path="/" element={<DashboardHome />} />
        <Route path="/products/*" element={<AdminProducts />} />
        <Route path="/orders/*" element={<AdminOrders />} />
      </Routes>
    </div>
  );
}
