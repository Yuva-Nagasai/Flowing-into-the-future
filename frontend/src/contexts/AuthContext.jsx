import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const TOKEN_KEY = 'academy_token';
  const USER_KEY = 'academy_user';

  useEffect(() => {
    // Backward compatibility: read old keys if present
    const legacyToken = localStorage.getItem('token');
    const legacyUser = localStorage.getItem('user');
    const token = localStorage.getItem(TOKEN_KEY) || legacyToken;
    const storedUser = localStorage.getItem(USER_KEY) || legacyUser;
    
    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        // migrate to new keys
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_KEY, storedUser);
        if (legacyToken) localStorage.removeItem('token');
        if (legacyUser) localStorage.removeItem('user');
      } catch (error) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      const { token, user: userData } = response.data;
      
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      setUser(userData);
      
      return { success: true, user: userData };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Login failed' };
    }
  };

  const signup = async (name, email, password, role = 'student') => {
    try {
      const response = await authAPI.signup(name, email, password, role);
      const { token, user: userData } = response.data;
      
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      setUser(userData);
      
      return { success: true, user: userData };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Signup failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem('token'); // legacy clean-up
    localStorage.removeItem('user');  // legacy clean-up
    setUser(null);
  };

  const isAdmin = () => user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
