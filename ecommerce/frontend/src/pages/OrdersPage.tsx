import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Package, ChevronRight, Eye } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../hooks/useAuth';

interface OrderItem {
  id: number;
  productName: string;
  productImage?: string;
  price: string;
  quantity: number;
  total: string;
}

interface Order {
  id: number;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  total: string;
  createdAt: string;
  items: OrderItem[];
}

interface OrdersResponse {
  items: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-800'
};

export default function OrdersPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const { data, isLoading } = useQuery<OrdersResponse>({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await api.get('/orders');
      return response.data.data;
    },
    enabled: isAuthenticated
  });

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="flex justify-between mb-4">
                <div className="h-4 bg-gray-200 rounded w-32" />
                <div className="h-4 bg-gray-200 rounded w-20" />
              </div>
              <div className="h-4 bg-gray-200 rounded w-48" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-4">No Orders Yet</h1>
        <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
        <Link to="/products" className="btn-primary">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      <div className="space-y-4">
        {data.items.map((order) => (
          <Link key={order.id} to={`/orders/${order.id}`} className="card p-6 block hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="font-medium">Order #{order.orderNumber}</span>
                <p className="text-sm text-gray-600">
                  {new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-xs px-2 py-1 rounded-full ${statusColors[order.status]}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {order.items.slice(0, 3).map((item, index) => (
                    <div
                      key={item.id}
                      className="w-12 h-12 bg-gray-100 rounded-lg border-2 border-white overflow-hidden"
                      style={{ zIndex: 3 - index }}
                    >
                      {item.productImage ? (
                        <img src={item.productImage} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          N/A
                        </div>
                      )}
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <div className="w-12 h-12 bg-gray-200 rounded-lg border-2 border-white flex items-center justify-center text-sm text-gray-600">
                      +{order.items.length - 3}
                    </div>
                  )}
                </div>
                <span className="text-sm text-gray-600">
                  {order.items.length} item{order.items.length > 1 ? 's' : ''}
                </span>
              </div>
              <div className="text-right">
                <p className="font-bold">${parseFloat(order.total).toFixed(2)}</p>
                <p className="text-xs text-gray-500">
                  Payment: {order.paymentStatus}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
