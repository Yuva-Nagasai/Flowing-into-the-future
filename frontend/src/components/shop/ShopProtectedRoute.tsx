import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useShopAuth } from '../../contexts/ShopAuthContext';
import { Loader2 } from 'lucide-react';

interface ShopProtectedRouteProps {
  children: ReactNode;
  adminOnly?: boolean;
}

export default function ShopProtectedRoute({ children, adminOnly = false }: ShopProtectedRouteProps) {
  const { isAuthenticated, isAdmin, loading } = useShopAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Loader2 className="w-8 h-8 animate-spin text-electric-green" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/shop/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/shop" replace />;
  }

  return <>{children}</>;
}
