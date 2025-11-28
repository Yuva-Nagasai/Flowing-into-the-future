import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, Package, CheckCircle, Truck, MapPin } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../hooks/useAuth';

interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productImage?: string;
  price: string;
  quantity: number;
  total: string;
}

interface ShippingAddress {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface Order {
  id: number;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod?: string;
  subtotal: string;
  tax: string;
  shipping: string;
  discount: string;
  total: string;
  shippingAddress: ShippingAddress;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

const statusSteps = ['pending', 'processing', 'shipped', 'delivered'];

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isSuccess = searchParams.get('success') === 'true';
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const { data: order, isLoading } = useQuery<Order>({
    queryKey: ['order', id],
    queryFn: async () => {
      const response = await api.get(`/orders/${id}`);
      return response.data.data;
    },
    enabled: isAuthenticated && !!id
  });

  const cancelMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post(`/orders/${id}/cancel`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', id] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    }
  });

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-32 mb-8" />
          <div className="card p-6 space-y-4">
            <div className="h-6 bg-gray-200 rounded w-48" />
            <div className="h-4 bg-gray-200 rounded w-64" />
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
        <Link to="/orders" className="text-brand-accent hover:underline">
          Back to Orders
        </Link>
      </div>
    );
  }

  const currentStep = statusSteps.indexOf(order.status);

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/orders" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8">
        <ChevronLeft className="w-4 h-4 mr-1" />
        Back to Orders
      </Link>

      {isSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center text-green-700">
          <CheckCircle className="w-5 h-5 mr-2" />
          Order placed successfully! Thank you for your purchase.
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Order #{order.orderNumber}</h1>
          <p className="text-gray-600">
            Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
        {['pending', 'processing'].includes(order.status) && (
          <button
            onClick={() => cancelMutation.mutate()}
            disabled={cancelMutation.isPending}
            className="btn-secondary text-red-600 border-red-300 hover:bg-red-50"
          >
            {cancelMutation.isPending ? 'Cancelling...' : 'Cancel Order'}
          </button>
        )}
      </div>

      {order.status !== 'cancelled' && order.status !== 'refunded' && (
        <div className="card p-6 mb-8">
          <h2 className="font-semibold mb-6">Order Status</h2>
          <div className="flex items-center justify-between relative">
            {statusSteps.map((step, index) => (
              <div key={step} className="flex flex-col items-center z-10">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    index <= currentStep
                      ? 'bg-brand-accent text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {index === 0 && <Package className="w-5 h-5" />}
                  {index === 1 && <Package className="w-5 h-5" />}
                  {index === 2 && <Truck className="w-5 h-5" />}
                  {index === 3 && <CheckCircle className="w-5 h-5" />}
                </div>
                <span className={`text-sm mt-2 capitalize ${
                  index <= currentStep ? 'text-brand-accent font-medium' : 'text-gray-500'
                }`}>
                  {step}
                </span>
              </div>
            ))}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-0">
              <div
                className="h-full bg-brand-accent transition-all"
                style={{ width: `${(currentStep / (statusSteps.length - 1)) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="card p-6">
            <h2 className="font-semibold mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    {item.productImage ? (
                      <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        N/A
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.productName}</h3>
                    <p className="text-sm text-gray-600">
                      ${parseFloat(item.price).toFixed(2)} x {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${parseFloat(item.total).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="card p-6">
            <h2 className="font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>${parseFloat(order.subtotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span>${parseFloat(order.tax).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>{parseFloat(order.shipping) === 0 ? 'Free' : `$${parseFloat(order.shipping).toFixed(2)}`}</span>
              </div>
              {parseFloat(order.discount) > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-${parseFloat(order.discount).toFixed(2)}</span>
                </div>
              )}
            </div>
            <div className="border-t mt-4 pt-4">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${parseFloat(order.total).toFixed(2)}</span>
              </div>
            </div>
            <div className="mt-4 text-sm">
              <p className="text-gray-600">Payment Method: {order.paymentMethod || 'N/A'}</p>
              <p className="text-gray-600">Payment Status: {order.paymentStatus}</p>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="font-semibold mb-4 flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              Shipping Address
            </h2>
            <div className="text-sm space-y-1">
              <p className="font-medium">{order.shippingAddress.name}</p>
              <p>{order.shippingAddress.address}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
              </p>
              <p>{order.shippingAddress.country}</p>
              <p className="text-gray-600 mt-2">{order.shippingAddress.phone}</p>
              <p className="text-gray-600">{order.shippingAddress.email}</p>
            </div>
          </div>

          {order.notes && (
            <div className="card p-6">
              <h2 className="font-semibold mb-4">Order Notes</h2>
              <p className="text-sm text-gray-600">{order.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
