import {
  getCurrentUser,
  getUsers,
  removeCurrentUser,
  saveUsers,
  setCurrentUser,
} from '../utils/storage';

export const authService = {
  login: async (email, password) => {
    // Simulate brief network latency for realism
    await new Promise((res) => setTimeout(res, 150));
    const users = getUsers();
    const cleanEmail = email.trim().toLowerCase();
    const match = users.find(
      (u) =>
        (u.email.toLowerCase() === cleanEmail ||
          u.alternateEmail?.toLowerCase() === cleanEmail) &&
        u.password === password
    );

    if (!match) {
      return { ok: false, error: 'Invalid email or password.' };
    }

    const normalizedRole =
      match.role === 'admin' ? 'professor' : match.role;

    const sessionUser = {
      id: match.id,
      name: match.name,
      email: match.email,
      role: normalizedRole,
      department: match.department,
      rollNo: match.rollNo,
      semester: match.semester,
      title: match.title,
    };

    setCurrentUser(sessionUser);
    return { ok: true, user: sessionUser };
  },

  register: async ({ name, email, password, role = 'student' }) => {
    await new Promise((res) => setTimeout(res, 150));
    const users = getUsers();
    const normalizedEmail = email.trim().toLowerCase();

    const exists = users.some(
      (u) =>
        u.email.toLowerCase() === normalizedEmail ||
        u.alternateEmail?.toLowerCase() === normalizedEmail
    );

    if (exists) {
      return {
        ok: false,
        error: 'An account with this email address already exists.',
      };
    }

    const normalizedRole = role === 'admin' ? 'professor' : role;
    const newId = `${normalizedRole}-${Date.now()}`;
    const newUser = {
      id: newId,
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: normalizedRole,
      department:
        normalizedRole === 'professor'
          ? 'Computer Science'
          : 'Information Technology',
    };

    const updatedUsers = [...users, newUser];
    saveUsers(updatedUsers);

    const sessionUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      department: newUser.department,
    };

    setCurrentUser(sessionUser);
    return { ok: true, user: sessionUser };
  },

  logout: () => {
    removeCurrentUser();
  },

  getCurrentUser: () => {
    return getCurrentUser();
  },
};
