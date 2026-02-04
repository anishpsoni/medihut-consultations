import { create } from 'zustand';
import { User } from '@/types';
import supabase from '@/lib/supabase';
import apiClient from '@/lib/api';

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

  setUser: (user) => set({ user }),
  
  setAccessToken: (token) => {
    set({ accessToken: token });
    if (token) {
      localStorage.setItem('access_token', token);
    } else {
      localStorage.removeItem('access_token');
    }
  },

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    if (data.session) {
      get().setAccessToken(data.session.access_token);
      
      // Fetch user profile
      const response = await apiClient.get('/auth/me');
      set({ user: response.data.profile });
    }
  },

  signUp: async (email, password, fullName, role) => {
    const response = await apiClient.post('/auth/signup', {
      email,
      password,
      fullName,
      role,
    });

    if (response.data.session) {
      get().setAccessToken(response.data.session.access_token);
      set({ user: response.data.profile });
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    get().setAccessToken(null);
    set({ user: null });
    localStorage.removeItem('user');
  },

  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        get().setAccessToken(session.access_token);
        
        // Fetch user profile
        const response = await apiClient.get('/auth/me');
        set({ user: response.data.profile, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Initialize auth error:', error);
      set({ isLoading: false });
    }
  },
}));
