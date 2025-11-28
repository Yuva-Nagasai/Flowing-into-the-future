import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';
import api from '../../utils/api';

interface OrderItem {
  id: number;
  productName: string;
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
  shippingAddress: {
    name: string;
    email: string;
  };
}

const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'refunded', label: 'Refunded' }
];

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-800'
};

export default function AdminOrders() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const response = await api.get('/orders?limit=50');
      return response.data.data;
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: number; status: string }) => {
      await api.put(`/orders/${orderId}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    }
  });

  if (isLoading) {
    return <div className="animate-pulse h-64 bg-gray-100 rounded-lg" />;
  }

  const orders: Order[] = data?.items || [];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">All Orders</h2>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Order</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Customer</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Items</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Total</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Date</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <span className="font-medium">#{order.orderNumber}</span>
                </td>
                <td className="px-4 py-3">
                  <div>
                    <p className="text-sm font-medium">{order.shippingAddress.name}</p>
                    <p className="text-xs text-gray-500">{order.shippingAddress.email}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">{order.items.length} items</td>
                <td className="px-4 py-3 text-sm font-medium">${parseFloat(order.total).toFixed(2)}</td>
                <td className="px-4 py-3">
                  <select
                    value={order.status}
                    onChange={(e) => updateStatusMutation.mutate({ orderId: order.id, status: e.target.value })}
                    className={`text-xs px-2 py-1 rounded-full border-0 ${statusColors[order.status]} cursor-pointer`}
                  >
                    {statusOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    to={`/orders/${order.id}`}
                    className="p-2 text-gray-600 hover:text-brand-accent inline-block"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <div className="p-8 text-center text-gray-600">
            No orders yet.
          </div>
        )}
      </div>
    </div>
  );
}
