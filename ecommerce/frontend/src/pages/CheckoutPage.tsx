import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CreditCard, Truck, AlertCircle } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, isLoading: cartLoading } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    paymentMethod: 'card',
    notes: ''
  });

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Please Login</h1>
        <p className="text-gray-600 mb-6">You need to login to checkout</p>
        <Link to="/login" className="btn-primary">Login</Link>
      </div>
    );
  }

  if (cartLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8" />
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="h-12 bg-gray-200 rounded" />
              <div className="h-12 bg-gray-200 rounded" />
              <div className="h-12 bg-gray-200 rounded" />
            </div>
            <div className="h-64 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
        <Link to="/products" className="btn-primary">Start Shopping</Link>
      </div>
    );
  }

  const tax = cart.subtotal * 0.1;
  const shipping = cart.subtotal > 100 ? 0 : 10;
  const total = cart.subtotal + tax + shipping;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await api.post('/orders', {
        shippingAddress: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country
        },
        paymentMethod: formData.paymentMethod,
        notes: formData.notes
      });

      const order = response.data.data;
      navigate(`/orders/${order.id}?success=true`);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      setError(error.response?.data?.error || 'Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <Truck className="w-5 h-5 mr-2" />
                Shipping Address
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <select name="country" value={formData.country} onChange={handleChange} className="input">
                    <option>United States</option>
                    <option>Canada</option>
                    <option>United Kingdom</option>
                    <option>Australia</option>
                    <option>India</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="input"
                    placeholder="Street address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    required
                    className="input"
                  />
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Payment Method
              </h2>
              
              <div className="space-y-3">
                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={handleChange}
                    className="w-4 h-4 text-brand-accent"
                  />
                  <span className="ml-3">Credit/Debit Card</span>
                </label>
                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleChange}
                    className="w-4 h-4 text-brand-accent"
                  />
                  <span className="ml-3">Cash on Delivery</span>
                </label>
              </div>
            </div>

            <div className="card p-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Order Notes (Optional)</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="input"
                placeholder="Any special instructions for delivery..."
              />
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.product?.name} x {item.quantity}
                    </span>
                    <span>${(parseFloat(item.product?.price || '0') * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${cart.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (10%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
              </div>

              <div className="border-t mt-4 pt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full mt-6"
              >
                {isSubmitting ? 'Placing Order...' : 'Place Order'}
              </button>

              <Link to="/cart" className="block text-center mt-4 text-gray-600 hover:text-gray-900">
                Back to Cart
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
