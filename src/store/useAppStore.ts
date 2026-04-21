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

// Derived hooks for easier access to specific domains
export const useNetwork = () =>
  useAppStore((state) => ({
    isOnline: state.isOnline,
    setOnline: state.setOnline,
  }));

export const useAppStatus = () =>
  useAppStore((state) => ({
    globalError: state.globalError,
    setGlobalError: state.setGlobalError,
    isAppLoading: state.isAppLoading,
    setAppLoading: state.setAppLoading,
  }));

export const useNotifications = () =>
  useAppStore((state) => ({
    notifications: state.notifications,
    addNotification: state.addNotification,
    removeNotification: state.removeNotification,
  }));
