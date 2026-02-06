import { create } from 'zustand';
import { User } from '@/types';
import { api } from '@/services/api';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string, role: string) => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  isLoading: true,

  setUser: (user) => {
    set({ user });
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  },

  setAccessToken: (token) => {
    set({ accessToken: token });
    if (token) {
      localStorage.setItem('access_token', token);
    } else {
      localStorage.removeItem('access_token');
    }
  },

  signIn: async (email, password) => {
    try {
      const response = await api.signIn({ email, password });

      if (response.session) {
        get().setAccessToken(response.session.access_token);
        get().setUser(response.profile);
      }
    } catch (error) {
      console.error("Signin failed", error);
      throw error;
    }
  },

  signUp: async (email, password, fullName, role) => {
    try {
      const response = await api.signUp({ email, password, fullName, role });

      if (response.session) {
        get().setAccessToken(response.session.access_token);
        get().setUser(response.profile);
      }
    } catch (error) {
      console.error("Signup failed", error);
      throw error;
    }
  },

  signOut: async () => {
    await api.signOut();
    get().setAccessToken(null);
    get().setUser(null);
  },

  initialize: async () => {
    const token = localStorage.getItem('access_token');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({ accessToken: token, user, isLoading: false });
      } catch (e) {
        console.error("Failed to parse user from local storage", e);
        set({ accessToken: token, isLoading: false });
      }
    } else {
      set({ accessToken: token || null, isLoading: false });
    }
  },
}));
