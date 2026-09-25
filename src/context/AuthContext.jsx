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

  const register = useCallback((name, email, password, role = 'student') => {
    const users = getUsers();
    const normalizedEmail = email.trim().toLowerCase();
    const exists = users.some(
      (u) => u.email.toLowerCase() === normalizedEmail
    );
    if (exists) {
      return { ok: false, error: 'An account with this email address already exists.' };
    }

    const newId = `${role}-${Date.now()}`;
    const newUser = {
      id: newId,
      name: name.trim(),
      email: normalizedEmail,
      password,
      role,
    };

    const updatedUsers = [...users, newUser];
    localStorage.setItem('assignmenthub_users', JSON.stringify(updatedUsers));

    const sessionUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
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
      register,
      logout,
      isAuthenticated: Boolean(user),
    }),
    [user, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
