import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import shopApi from '../utils/shopApi';
import type { User, CartItem, WishlistItem } from '../types/shop';

interface ShopAuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  cart: CartItem[];
  cartTotal: number;
  wishlist: WishlistItem[];
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: { email: string; password: string; name: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  refreshCart: () => Promise<void>;
  refreshWishlist: () => Promise<void>;
  addToCart: (productId: number, quantity?: number) => Promise<{ success: boolean; error?: string }>;
  updateCartItem: (id: number, quantity: number) => Promise<{ success: boolean; error?: string }>;
  removeFromCart: (id: number) => Promise<{ success: boolean; error?: string }>;
  clearCart: () => Promise<{ success: boolean; error?: string }>;
  addToWishlist: (productId: number) => Promise<{ success: boolean; error?: string }>;
  removeFromWishlist: (productId: number) => Promise<{ success: boolean; error?: string }>;
  isInWishlist: (productId: number) => boolean;
}

const ShopAuthContext = createContext<ShopAuthContextType | undefined>(undefined);

export function ShopAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  const refreshUser = useCallback(async () => {
    try {
      if (shopApi.getToken()) {
        const res = await shopApi.getMe();
        if (res.success && res.data) {
          setUser(res.data);
        } else {
          setUser(null);
          shopApi.setToken(null);
        }
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  }, []);

  const refreshCart = useCallback(async () => {
    if (!shopApi.getToken()) {
      setCart([]);
      setCartTotal(0);
      return;
    }
    try {
      const res = await shopApi.getCart();
      if (res.success && res.data) {
        setCart(res.data.items);
        setCartTotal(res.data.total);
      }
    } catch {
      setCart([]);
      setCartTotal(0);
    }
  }, []);

  const refreshWishlist = useCallback(async () => {
    if (!shopApi.getToken()) {
      setWishlist([]);
      return;
    }
    try {
      const res = await shopApi.getWishlist();
      if (res.success && res.data) {
        setWishlist(res.data);
      }
    } catch {
      setWishlist([]);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await refreshUser();
      await Promise.all([refreshCart(), refreshWishlist()]);
      setLoading(false);
    };
    init();
  }, [refreshUser, refreshCart, refreshWishlist]);

  const login = async (email: string, password: string) => {
    try {
      const res = await shopApi.login(email, password);
      if (res.success && res.user) {
        setUser(res.user);
        await Promise.all([refreshCart(), refreshWishlist()]);
        return { success: true };
      }
      return { success: false, error: res.error || 'Login failed' };
    } catch {
      return { success: false, error: 'Login failed' };
    }
  };

  const register = async (data: { email: string; password: string; name: string }) => {
    try {
      const res = await shopApi.register(data);
      if (res.success && res.user) {
        setUser(res.user);
        return { success: true };
      }
      return { success: false, error: res.error || 'Registration failed' };
    } catch {
      return { success: false, error: 'Registration failed' };
    }
  };

  const logout = async () => {
    await shopApi.logout();
    setUser(null);
    setCart([]);
    setCartTotal(0);
    setWishlist([]);
  };

  const addToCart = async (productId: number, quantity = 1) => {
    try {
      const res = await shopApi.addToCart(productId, quantity);
      if (res.success) {
        await refreshCart();
        return { success: true };
      }
      return { success: false, error: res.error || 'Failed to add to cart' };
    } catch {
      return { success: false, error: 'Failed to add to cart' };
    }
  };

  const updateCartItem = async (id: number, quantity: number) => {
    try {
      const res = await shopApi.updateCartItem(id, quantity);
      if (res.success) {
        await refreshCart();
        return { success: true };
      }
      return { success: false, error: res.error || 'Failed to update cart' };
    } catch {
      return { success: false, error: 'Failed to update cart' };
    }
  };

  const removeFromCart = async (id: number) => {
    try {
      const res = await shopApi.removeFromCart(id);
      if (res.success) {
        await refreshCart();
        return { success: true };
      }
      return { success: false, error: res.error || 'Failed to remove from cart' };
    } catch {
      return { success: false, error: 'Failed to remove from cart' };
    }
  };

  const clearCart = async () => {
    try {
      const res = await shopApi.clearCart();
      if (res.success) {
        setCart([]);
        setCartTotal(0);
        return { success: true };
      }
      return { success: false, error: res.error || 'Failed to clear cart' };
    } catch {
      return { success: false, error: 'Failed to clear cart' };
    }
  };

  const addToWishlist = async (productId: number) => {
    try {
      const res = await shopApi.addToWishlist(productId);
      if (res.success) {
        await refreshWishlist();
        return { success: true };
      }
      return { success: false, error: res.error || 'Failed to add to wishlist' };
    } catch {
      return { success: false, error: 'Failed to add to wishlist' };
    }
  };

  const removeFromWishlist = async (productId: number) => {
    try {
      const res = await shopApi.removeFromWishlist(productId);
      if (res.success) {
        await refreshWishlist();
        return { success: true };
      }
      return { success: false, error: res.error || 'Failed to remove from wishlist' };
    } catch {
      return { success: false, error: 'Failed to remove from wishlist' };
    }
  };

  const isInWishlist = (productId: number) => {
    return wishlist.some((item) => item.productId === productId);
  };

  return (
    <ShopAuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        loading,
        cart,
        cartTotal,
        wishlist,
        login,
        register,
        logout,
        refreshUser,
        refreshCart,
        refreshWishlist,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
      }}
    >
      {children}
    </ShopAuthContext.Provider>
  );
}

export function useShopAuth() {
  const context = useContext(ShopAuthContext);
  if (!context) {
    throw new Error('useShopAuth must be used within a ShopAuthProvider');
  }
  return context;
}
