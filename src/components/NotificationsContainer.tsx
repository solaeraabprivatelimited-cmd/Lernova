/**
 * Notifications Container Component
 * Displays toast notifications from the global Zustand store
 * Renders at root level for app-wide notification support
 */

import React, { useEffect } from 'react';
import { useNotifications } from '@/store/useAppStore';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

/**
 * Individual toast notification component
 */
const Toast: React.FC<{
  toast: Toast;
  onClose: (id: string) => void;
}> = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast.duration) return;
    const timer = setTimeout(() => onClose(toast.id), toast.duration);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast.id, toast.duration]); // intentionally omit onClose — stable enough via id

  const bgColor = {
    success: 'bg-green-50 dark:bg-green-950',
    error: 'bg-red-50 dark:bg-red-950',
    warning: 'bg-amber-50 dark:bg-amber-950',
    info: 'bg-blue-50 dark:bg-blue-950',
  }[toast.type];

  const borderColor = {
    success: 'border-green-200 dark:border-green-800',
    error: 'border-red-200 dark:border-red-800',
    warning: 'border-amber-200 dark:border-amber-800',
    info: 'border-blue-200 dark:border-blue-800',
  }[toast.type];

  const textColor = {
    success: 'text-green-800 dark:text-green-200',
    error: 'text-red-800 dark:text-red-200',
    warning: 'text-amber-800 dark:text-amber-200',
    info: 'text-blue-800 dark:text-blue-200',
  }[toast.type];

  const IconComponent = {
    success: CheckCircle2,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  }[toast.type];

  return (
    <div
      className={`${bgColor} ${borderColor} border rounded-lg shadow-lg p-4 flex items-start gap-3 max-w-md animate-in slide-in-from-top fade-in duration-300`}
      role="alert"
      aria-live="polite"
      aria-label={`${toast.type} notification`}
    >
      <IconComponent className={`${textColor} w-5 h-5 flex-shrink-0 mt-0.5`} />
      <p className={`${textColor} text-sm font-medium flex-1`}>{toast.message}</p>
      <button
        onClick={() => onClose(toast.id)}
        className={`${textColor} hover:opacity-70 transition-opacity flex-shrink-0`}
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

/**
 * Notifications Container - renders all active toasts
 * Place this at the root level of your app (in App.tsx)
 */
export const NotificationsContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotifications();

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div
      className="fixed top-5 right-5 z-[60] flex flex-col gap-3 pointer-events-none"
      role="region"
      aria-label="Notifications"
    >
      {notifications.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast
            toast={toast}
            onClose={() => removeNotification(toast.id)}
          />
        </div>
      ))}
    </div>
  );
};
