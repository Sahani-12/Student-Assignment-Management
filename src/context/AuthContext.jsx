import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import {
  getCurrentUser,
  getUsers,
  removeCurrentUser,
  setCurrentUser,
} from '../utils/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getCurrentUser());

  const login = useCallback((email, password) => {
    const users = getUsers();
    const match = users.find(
      (u) =>
        u.email.toLowerCase() === email.trim().toLowerCase() &&
        u.password === password
    );
    if (!match) {
      return { ok: false, error: 'Invalid email or password.' };
    }
    const sessionUser = {
      id: match.id,
      name: match.name,
      email: match.email,
      role: match.role,
    };
    setCurrentUser(sessionUser);
    setUser(sessionUser);
    return { ok: true, user: sessionUser };
  }, []);

  const logout = useCallback(() => {
    removeCurrentUser();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      isAuthenticated: Boolean(user),
    }),
    [user, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
