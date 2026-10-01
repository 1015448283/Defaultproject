import { create } from 'zustand';
import { supabase } from '../services/supabase';

interface AuthState {
  user: any | null;
  token: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  loading: true,
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    set({ user: data.user, token: data.session?.access_token });
    return data;
  },
  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, token: null });
  },
  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      set({ user: session?.user ?? null, token: session?.access_token ?? null, loading: false });
    } catch {
      set({ user: null, token: null, loading: false });
    }

    supabase.auth.onAuthStateChange((_event, session) => {
      set({ user: session?.user ?? null, token: session?.access_token ?? null, loading: false });
    });
  },
}));

interface UIState {
  sidebarOpen: boolean;
  theme: string;
  toggleSidebar: () => void;
  setTheme: (theme: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  theme: 'light',
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setTheme: (theme) => set({ theme }),
}));
