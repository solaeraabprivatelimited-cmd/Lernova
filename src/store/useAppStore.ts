import { create } from 'zustand';

interface AppState {
  // Network
  isOnline: boolean;
  setOnline: (v: boolean) => void;

  // Global loading/error
  globalError: string | null;
  setGlobalError: (msg: string | null) => void;

  // App-level loading (e.g. session restore)
  isAppLoading: boolean;
  setAppLoading: (v: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isOnline: navigator.onLine,
  setOnline: (v) => set({ isOnline: v }),

  globalError: null,
  setGlobalError: (msg) => set({ globalError: msg }),

  isAppLoading: false,
  setAppLoading: (v) => set({ isAppLoading: v }),
}));
