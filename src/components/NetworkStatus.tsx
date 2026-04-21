import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';

/** Registers online/offline listeners and syncs to global store */
export function NetworkWatcher() {
  const setOnline = useAppStore((s) => s.setOnline);

  useEffect(() => {
    const onOnline = () => setOnline(true);
    const onOffline = () => setOnline(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, [setOnline]);

  return null;
}

/** Banner shown when user is offline */
export function OfflineBanner() {
  const isOnline = useAppStore((s) => s.isOnline);
  if (isOnline) return null;

  return (
    <div
      role="alert"
      className="fixed inset-x-0 top-0 z-[9999] flex items-center justify-center gap-2 bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground"
    >
      <span>⚠️</span>
      <span>You are offline — some features may be unavailable.</span>
    </div>
  );
}
