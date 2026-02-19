
import { User, RiderLevel } from '../types';

const STORAGE_KEY = 'motoengine_users';
const SESSION_KEY = 'motoengine_current_session';

const getRiderLevel = (reputation: number, role: string): RiderLevel => {
  if (role === 'moderator') return 'Модератор';
  if (reputation > 500) return 'Гуру';
  if (reputation > 200) return 'Эксперт';
  if (reputation > 50) return 'Механик';
  return 'Новичок';
};

const getUsers = (): any[] => {
  const usersJson = localStorage.getItem(STORAGE_KEY);
  return usersJson ? JSON.parse(usersJson) : [];
};

const saveUsers = (users: any[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

export const authService = {
  register: async (email: string, password: string, name: string): Promise<User> => {
    await new Promise(r => setTimeout(r, 800));
    const users = getUsers();
    if (users.find(u => u.email === email)) throw new Error('Пользователь с таким email уже существует');

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      createdAt: new Date().toISOString(),
      favorites: [],
      following: [],
      savedComparisons: [],
      role: users.length === 0 ? 'moderator' : 'user',
      reputation: 0,
      reportsCount: 0,
      level: 'Новичок',
      settings: { notifications: true, experienceLevel: 'Новичок' }
    };

    users.push({ ...newUser, password });
    saveUsers(users);
    localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
    return newUser;
  },

  login: async (email: string, password: string): Promise<User> => {
    await new Promise(r => setTimeout(r, 600));
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) throw new Error('Неверный email или пароль');
    const { password: _, ...userData } = user;
    localStorage.setItem(SESSION_KEY, JSON.stringify(userData));
    return userData as User;
  },

  logout: () => localStorage.removeItem(SESSION_KEY),
  getCurrentUser: (): User | null => {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  },

  getUserById: (id: string): User | null => {
    const users = getUsers();
    const user = users.find(u => u.id === id);
    if (!user) return null;
    const { password: _, ...userData } = user;
    return userData as User;
  },

  updateProfile: (userId: string, updates: Partial<User>) => {
    const users = getUsers();
    const idx = users.findIndex(u => u.id === userId);
    if (idx === -1) return;
    users[idx] = { ...users[idx], ...updates };
    users[idx].level = getRiderLevel(users[idx].reputation, users[idx].role);
    saveUsers(users);
    const session = JSON.parse(localStorage.getItem(SESSION_KEY) || '{}');
    if (session.id === userId) localStorage.setItem(SESSION_KEY, JSON.stringify(users[idx]));
  },

  toggleFollow: (currentUserId: string, targetUserId: string) => {
    const users = getUsers();
    const userIdx = users.findIndex(u => u.id === currentUserId);
    if (userIdx === -1) return [];
    
    const following = users[userIdx].following || [];
    const isFollowing = following.includes(targetUserId);
    
    if (isFollowing) users[userIdx].following = following.filter((id: string) => id !== targetUserId);
    else users[userIdx].following = [...following, targetUserId];
    
    saveUsers(users);
    const session = JSON.parse(localStorage.getItem(SESSION_KEY) || '{}');
    session.following = users[userIdx].following;
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return users[userIdx].following;
  }
};
