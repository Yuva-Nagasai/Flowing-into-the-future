import { useState, useEffect, useCallback } from 'react';
import api, { setAuthToken, setUser, getUser, logout as logoutFn } from '../utils/api';

interface User {
  id: number;
  email: string;
  name: string;
  role: 'user' | 'admin';
  phone?: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: getUser(),
    isLoading: true,
    isAuthenticated: !!getUser()
  });

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('ecommerce_token');
    if (!token) {
      setState({ user: null, isLoading: false, isAuthenticated: false });
      return;
    }

    try {
      const response = await api.get('/auth/me');
      const user = response.data.data;
      setUser(user);
      setState({ user, isLoading: false, isAuthenticated: true });
    } catch {
      logoutFn();
      setState({ user: null, isLoading: false, isAuthenticated: false });
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    const { user, token } = response.data.data;
    setAuthToken(token);
    setUser(user);
    setState({ user, isLoading: false, isAuthenticated: true });
    return user;
  };

  const register = async (name: string, email: string, password: string, phone?: string) => {
    const response = await api.post('/auth/register', { name, email, password, phone });
    const { user, token } = response.data.data;
    setAuthToken(token);
    setUser(user);
    setState({ user, isLoading: false, isAuthenticated: true });
    return user;
  };

  const logout = () => {
    logoutFn();
    setState({ user: null, isLoading: false, isAuthenticated: false });
  };

  const updateProfile = async (data: Partial<User>) => {
    const response = await api.put('/auth/profile', data);
    const user = response.data.data;
    setUser(user);
    setState(prev => ({ ...prev, user }));
    return user;
  };

  return {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    checkAuth
  };
}
