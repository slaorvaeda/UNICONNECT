import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { User, Role } from '../types';
import { API_BASE_URL } from '../config';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  role: Role | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(async (email: string, password: string): Promise<void> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 401 || response.status === 404) {
          throw new Error('Invalid email or password. Password is: 123456');
        }
        throw new Error(`Server error: ${response.status}`);
      }

      const userData = await response.json();
      // Translate backend fields if required, e.g. student_id to studentId to keep TS interface clean
      const mappedUser: User = {
        id: String(userData.id),
        name: userData.name,
        email: userData.email,
        role: userData.role as Role,
        studentId: userData.student_id,
        department: userData.department,
        year: userData.year,
      };

      setUser(mappedUser);
    } catch (error: any) {
      clearTimeout(timeoutId);
      console.error('Login error:', error);
      if (error.name === 'AbortError' || error.message?.includes('aborted')) {
        throw new Error(`Request Timeout! Backend at ${API_BASE_URL} is unreachable. Please verify server is running and IP matches.`);
      }
      throw error;
    }
  }, []);

  const logout = useCallback(() => setUser(null), []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        role: user?.role ?? null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

