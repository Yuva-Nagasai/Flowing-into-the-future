import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

type AIToolsUser = {
  id: string;
  name: string;
  email: string;
  role?: string;
};

type AuthResult = {
  success: boolean;
  user?: AIToolsUser;
  error?: string;
};

type AIToolsAuthContextValue = {
  user: AIToolsUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  signup: (name: string, email: string, password: string) => Promise<AuthResult>;
  logout: () => void;
};

const STORAGE_TOKEN_KEY = 'ai_tools_token';
const STORAGE_USER_KEY = 'ai_tools_user';
const API_URL = import.meta.env.VITE_API_URL || '/api';

const AIToolsAuthContext = createContext<AIToolsAuthContextValue | undefined>(undefined);

export const useAIToolsAuth = () => {
  const ctx = useContext(AIToolsAuthContext);
  if (!ctx) {
    throw new Error('useAIToolsAuth must be used within AIToolsAuthProvider');
  }
  return ctx;
};

export function AIToolsAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AIToolsUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(STORAGE_TOKEN_KEY);
    const storedUser = localStorage.getItem(STORAGE_USER_KEY);

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem(STORAGE_TOKEN_KEY);
        localStorage.removeItem(STORAGE_USER_KEY);
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (!response.ok || !data.token) {
        return { success: false, error: data.error || 'Login failed' };
      }

      localStorage.setItem(STORAGE_TOKEN_KEY, data.token);
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(data.user));
      setUser(data.user);
      return { success: true, user: data.user };
    } catch {
      return { success: false, error: 'Login failed' };
    }
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string): Promise<AuthResult> => {
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();
      if (!response.ok || !data.token) {
        return { success: false, error: data.error || 'Signup failed' };
      }

      localStorage.setItem(STORAGE_TOKEN_KEY, data.token);
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(data.user));
      setUser(data.user);
      return { success: true, user: data.user };
    } catch {
      return { success: false, error: 'Signup failed' };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_TOKEN_KEY);
    localStorage.removeItem(STORAGE_USER_KEY);
    setUser(null);
  }, []);

  return (
    <AIToolsAuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AIToolsAuthContext.Provider>
  );
}

