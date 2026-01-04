import { create } from 'zustand';
import { MOCK_FILMS, MOCK_SERIES, MOCK_USER } from '@/data/mockData';
import { Film, Series, User } from '@/types';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  login: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false, // Start false to see Landing Page
  user: null,
  login: () => set({ isAuthenticated: true, user: MOCK_USER }),
  logout: () => set({ isAuthenticated: false, user: null }),
}));

interface ContentState {
  films: Film[];
  series: Series[];
  featured: Film;
}

export const useContentStore = create<ContentState>(() => ({
  films: MOCK_FILMS,
  series: MOCK_SERIES,
  featured: MOCK_FILMS[0], // Oppenheimer par défaut
}));