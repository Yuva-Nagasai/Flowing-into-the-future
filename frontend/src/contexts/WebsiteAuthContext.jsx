import { createContext, useContext, useEffect, useState } from 'react';

const WebsiteAuthContext = createContext(null);

const TOKEN_KEY = 'website_token';
const USER_KEY = 'website_user';

export const useWebsiteAuth = () => {
  const ctx = useContext(WebsiteAuthContext);
  if (!ctx) throw new Error('useWebsiteAuth must be used within WebsiteAuthProvider');
  return ctx;
};

export const WebsiteAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok || !data.token) {
        return { success: false, error: data.error || 'Login failed' };
      }
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      setUser(data.user);
      return { success: true, user: data.user };
    } catch {
      return { success: false, error: 'Login failed' };
    }
  };

  const signup = async (name, email, password) => {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (!res.ok || !data.token) {
        return { success: false, error: data.error || 'Signup failed' };
      }
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      setUser(data.user);
      return { success: true, user: data.user };
    } catch {
      return { success: false, error: 'Signup failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  };

  return (
    <WebsiteAuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </WebsiteAuthContext.Provider>
  );
};

