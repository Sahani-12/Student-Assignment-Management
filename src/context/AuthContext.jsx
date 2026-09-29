import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [token, setToken] = useState(() => authService.getToken());

  const login = useCallback(async (email, password) => {
    const result = await authService.login(email, password);
    if (result.ok) {
      setUser(result.user);
      setToken(result.token);
    }
    return result;
  }, []);

  const register = useCallback(
    async (name, email, password, role = 'student') => {
      const result = await authService.register({
        name,
        email,
        password,
        role,
      });
      if (result.ok) {
        setUser(result.user);
        setToken(result.token);
      }
      return result;
    },
    []
  );

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setToken(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      login,
      register,
      logout,
      isAuthenticated: Boolean(user),
      isProfessor: user?.role === 'professor' || user?.role === 'admin',
      isStudent: user?.role === 'student',
    }),
    [user, token, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
