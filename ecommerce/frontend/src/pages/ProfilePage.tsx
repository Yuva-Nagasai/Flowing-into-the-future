import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Package, Heart, Settings, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, updateProfile, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      await updateProfile(formData);
      setSuccess('Profile updated successfully');
      setIsEditing(false);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      setError(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>

      <div className="grid md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <div className="card p-6">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-10 h-10 text-gray-500" />
              </div>
              <h2 className="font-semibold">{user?.name}</h2>
              <p className="text-sm text-gray-600">{user?.email}</p>
              {user?.role === 'admin' && (
                <span className="inline-block mt-2 text-xs bg-brand-accent text-white px-2 py-1 rounded">
                  Admin
                </span>
              )}
            </div>

            <nav className="space-y-2">
              <Link
                to="/profile"
                className="flex items-center px-4 py-2 text-brand-accent bg-brand-light rounded-lg"
              >
                <Settings className="w-4 h-4 mr-3" />
                Account Settings
              </Link>
              <Link
                to="/orders"
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <Package className="w-4 h-4 mr-3" />
                My Orders
              </Link>
              <Link
                to="/wishlist"
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <Heart className="w-4 h-4 mr-3" />
                Wishlist
              </Link>
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <Settings className="w-4 h-4 mr-3" />
                  Admin Dashboard
                </Link>
              )}
            </nav>

            <button
              onClick={handleLogout}
              className="w-full mt-6 btn-secondary"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="md:col-span-3">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Profile Information</h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-brand-accent hover:underline text-sm"
                >
                  Edit
                </button>
              )}
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700 text-sm">
                <AlertCircle className="w-4 h-4 mr-2" />
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center text-green-700 text-sm">
                <CheckCircle className="w-4 h-4 mr-2" />
                {success}
              </div>
            )}

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={user?.email}
                    disabled
                    className="input bg-gray-100"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="input"
                  />
                </div>

                <div className="flex gap-4">
                  <button type="submit" disabled={isLoading} className="btn-primary">
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({ name: user?.name || '', phone: user?.phone || '' });
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500">Full Name</label>
                  <p className="font-medium">{user?.name}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Email</label>
                  <p className="font-medium">{user?.email}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Phone</label>
                  <p className="font-medium">{user?.phone || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Account Type</label>
                  <p className="font-medium capitalize">{user?.role}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
