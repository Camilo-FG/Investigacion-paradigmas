import { createContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { User } from '../../shared/contracts/types';
import { login as loginApi } from './login/loginApi';
import { register as registerApi } from './register/registerApi';
import { adminRegister as adminRegisterApi } from './adminRegister/adminRegisterApi';
import { logout as logoutApi } from './logout/logoutApi';
import { getMe } from '../users/getMe/getMeApi';
import { tokenUtils } from '../../shared/auth/token';
import apiClient from '../../shared/api/client';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  adminRegister: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const me = await getMe();
      setUser(me);
    } catch {
      setUser(null);
      tokenUtils.clearTokens();
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      const token = tokenUtils.getAccessToken();
      if (token && !tokenUtils.isTokenExpired(token)) {
        await refreshUser();
      } else {
        tokenUtils.clearTokens();
      }
      setLoading(false);
    };
    init();
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    const data = await loginApi({ email, password });
    tokenUtils.setTokens(data.accessToken, data.refreshToken);
    apiClient.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`;
    await refreshUser();
  };

  const register = async (email: string, password: string) => {
    await registerApi({ email, password });
  };

  const adminRegister = async (email: string, password: string) => {
    await adminRegisterApi({ email, password });
  };

  const logout = async () => {
    try {
      await logoutApi();
    } finally {
      tokenUtils.clearTokens();
      delete apiClient.defaults.headers.common.Authorization;
      setUser(null);
    }
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'Admin';

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, isAdmin, loading, login, register, adminRegister, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}
