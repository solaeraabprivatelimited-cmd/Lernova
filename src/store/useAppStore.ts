import { create } from 'zustand';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

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

  // Notifications
  notifications: Notification[];
  addNotification: (type: 'success' | 'error' | 'warning' | 'info', message: string, duration?: number) => void;
  removeNotification: (id: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isOnline: navigator.onLine,
  setOnline: (v) => set({ isOnline: v }),

  globalError: null,
  setGlobalError: (msg) => set({ globalError: msg }),

  isAppLoading: false,
  setAppLoading: (v) => set({ isAppLoading: v }),

  notifications: [],
  addNotification: (type, message, duration = 5000) =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        {
          id: `${Date.now()}-${Math.random()}`,
          type,
          message,
          duration,
        },
      ],
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
}));

// Derived hooks — select primitives individually, never return new objects
export const useNetwork = () => ({
  isOnline: useAppStore((s) => s.isOnline),
  setOnline: useAppStore((s) => s.setOnline),
});

export const useAppStatus = () => ({
  globalError: useAppStore((s) => s.globalError),
  setGlobalError: useAppStore((s) => s.setGlobalError),
  isAppLoading: useAppStore((s) => s.isAppLoading),
  setAppLoading: useAppStore((s) => s.setAppLoading),
});

export const useNotifications = () => ({
  notifications: useAppStore((s) => s.notifications),
  addNotification: useAppStore((s) => s.addNotification),
  removeNotification: useAppStore((s) => s.removeNotification),
});
