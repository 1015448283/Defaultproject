import { create } from 'zustand';

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
    const { data, error } = await (await import('../services/supabase')).supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    set({ user: data.user, token: data.session?.access_token });
    return data;
  },
  signOut: async () => {
    await (await import('../services/supabase')).supabase.auth.signOut();
    set({ user: null, token: null });
  },
  initialize: async () => {
    const { data: { session } } = await (await import('../services/supabase')).supabase.auth.getSession();
    set({ user: session?.user ?? null, loading: false });
    (await import('../services/supabase')).supabase.auth.onAuthStateChange((_event, session) => {
      set({ user: session?.user ?? null });
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
