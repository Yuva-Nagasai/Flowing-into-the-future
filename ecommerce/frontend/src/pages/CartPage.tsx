import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';

export default function CartPage() {
  const { cart, isLoading, updateQuantity, removeItem, isUpdating, isRemoving } = useCart();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-4">Please Login</h1>
        <p className="text-gray-600 mb-6">You need to login to view your cart</p>
        <Link to="/login" className="btn-primary">Login</Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card p-6 flex gap-6">
              <div className="w-24 h-24 bg-gray-200 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-4 bg-gray-200 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-6">Looks like you haven't added any products yet</p>
        <Link to="/products" className="btn-primary">Start Shopping</Link>
      </div>
    );
  }

  const tax = cart.subtotal * 0.1;
  const shipping = cart.subtotal > 100 ? 0 : 10;
  const total = cart.subtotal + tax + shipping;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart ({cart.itemCount} items)</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => {
            const price = parseFloat(item.product?.price || '0');
            const itemTotal = price * item.quantity;

            return (
              <div key={item.id} className="card p-6 flex gap-6">
                <Link to={`/products/${item.product?.slug}`} className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {item.product?.thumbnail ? (
                    <img src={item.product.thumbnail} alt={item.product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                      No Image
                    </div>
                  )}
                </Link>

                <div className="flex-1">
                  <Link to={`/products/${item.product?.slug}`} className="font-medium hover:text-brand-accent">
                    {item.product?.name}
                  </Link>
                  <p className="text-gray-600 text-sm mt-1">${price.toFixed(2)} each</p>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => updateQuantity({ itemId: item.id, quantity: item.quantity - 1 })}
                        disabled={isUpdating || item.quantity <= 1}
                        className="p-2 hover:bg-gray-100 rounded-l-lg disabled:opacity-50"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 py-1 font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity({ itemId: item.id, quantity: item.quantity + 1 })}
                        disabled={isUpdating || item.quantity >= (item.product?.stock || 0)}
                        className="p-2 hover:bg-gray-100 rounded-r-lg disabled:opacity-50"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-bold">${itemTotal.toFixed(2)}</span>
                      <button
                        onClick={() => removeItem(item.id)}
                        disabled={isRemoving}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            <div className="space-y-3 text-sm">
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
              {cart.subtotal < 100 && (
                <p className="text-xs text-gray-500">
                  Add ${(100 - cart.subtotal).toFixed(2)} more for free shipping
                </p>
              )}
            </div>

            <div className="border-t mt-4 pt-4">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <Link to="/checkout" className="btn-primary w-full mt-6 text-center block">
              Proceed to Checkout
            </Link>

            <Link to="/products" className="block text-center mt-4 text-brand-accent hover:underline">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
