import React, { useEffect, useRef, useState } from "react";
import { notifications as notificationsApi } from "@/app/lib/api";

interface NotificationsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onReadAll?: () => void;
}

interface LiveNotification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  category: string;
}

function sectionAccent(category: string, isDark: boolean) {
  if (category === "Withdraw Notifications") {
    return {
      dot: "bg-[#22c55e]",
      cardBg: isDark ? "#1a3d2a" : "#f0fff4",
      cardHovBg: isDark ? "#1f4a2f" : "#e8ffe6",
    };
  }

  if (category === "System and Platform Alerts") {
    return {
      dot: "bg-[#F77F00]",
      cardBg: isDark ? "#3d2a1a" : "#fff8f0",
      cardHovBg: isDark ? "#4a3a1f" : "#fff3e6",
    };
  }

  return {
    dot: "bg-[#003566]",
    cardBg: isDark ? "#1a2d3d" : "#f0f7ff",
    cardHovBg: isDark ? "#1f3a4a" : "#e8f3ff",
  };
}

export function NotificationsPopup({ isOpen, onClose, onReadAll }: NotificationsPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);
  const [viewAll, setViewAll] = useState(false);
  const [apiNotifs, setApiNotifs] = useState<LiveNotification[]>([]);
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    notificationsApi
      .list()
      .then((data) => setApiNotifs(data ?? []))
      .catch(() => setApiNotifs([]));

    let unsubscribe: (() => void) | undefined;
    notificationsApi
      .subscribe((data) => setApiNotifs(data ?? []))
      .then((cleanup) => { unsubscribe = cleanup; })
      .catch(() => {});

    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClickOutside);
      unsubscribe?.();
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) setViewAll(false);
  }, [isOpen]);

  if (!isOpen) return null;

  const grouped = apiNotifs.reduce<Record<string, LiveNotification[]>>((acc, notif) => {
    const key = notif.category || "Notifications";
    if (!acc[key]) acc[key] = [];
    acc[key].push(notif);
    return acc;
  }, {});

  const sectionOrder = [
    "Session Updates",
    "Withdraw Notifications",
    "System and Platform Alerts",
  ];

  const orderedSections = [
    ...sectionOrder.filter((key) => grouped[key]?.length),
    ...Object.keys(grouped).filter((key) => !sectionOrder.includes(key)),
  ];

  const hasAny = apiNotifs.length > 0;

  const markRead = async (id: string) => {
    try {
      await notificationsApi.markRead(id);
      setApiNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    } catch {}
  };

  const markAllRead = async () => {
    try {
      await Promise.all(
        apiNotifs.filter(n => !n.read).map(n => notificationsApi.markRead(n.id))
      );
      setApiNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
      onReadAll?.();
    } catch {}
  };

  const unreadCount = apiNotifs.filter(n => !n.read).length;

  return (
    <div
      ref={popupRef}
      className="fixed right-3 top-[76px] md:right-6 md:top-[84px] w-[min(420px,calc(100vw-1.5rem))] z-50 bg-white dark:bg-[#1a1a2e] rounded-[20px] border border-black/5 dark:border-white/10 shadow-[0px_20px_60px_rgba(0,0,0,0.18)] p-5 md:p-8 flex flex-col gap-6 items-start overflow-hidden max-h-[min(80vh,560px)] overflow-y-auto overscroll-contain"
    >
      <div className="flex items-center justify-between w-full gap-3">
        <p className="font-['Poppins'] font-medium text-[16px] text-black dark:text-white">Notifications</p>
        <div className="flex items-center gap-3">
          {hasAny && unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllRead}
              style={{ color: isDark ? '#ffd700' : '#f77f00' }}
              className="font-['Poppins'] text-[12px] font-semibold cursor-pointer hover:opacity-80 transition-opacity shrink-0 !bg-transparent border-none p-0"
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = isDark ? '#ffed4e' : '#e63946';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = isDark ? '#ffd700' : '#f77f00';
              }}
            >
              Read All
            </button>
          )}
          {hasAny && apiNotifs.length > 3 && (
            <button
              type="button"
              onClick={() => setViewAll((prev) => !prev)}
              style={{ color: isDark ? '#ffd700' : '#f77f00' }}
              className="font-['Poppins'] text-[12px] font-semibold cursor-pointer hover:opacity-80 transition-opacity shrink-0 !bg-transparent border-none p-0"
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = isDark ? '#ffed4e' : '#e63946';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = isDark ? '#ffd700' : '#f77f00';
              }}
            >
              {viewAll ? "View Less" : "View All"}
            </button>
          )}
        </div>
      </div>

      {!hasAny ? (
        <div className="flex flex-col gap-2 items-start w-full">
          <p className="font-['Poppins'] text-[13px] text-black/70 dark:text-white/70">No notifications yet.</p>
          <p className="font-['Poppins'] text-[11px] text-black/45 dark:text-white/50">Session updates and alerts will appear here.</p>
        </div>
      ) : (
        orderedSections.map((section) => {
          const items = grouped[section] ?? [];
          const visibleItems = viewAll ? items : items.slice(0, 3);

          return (
            <div key={section} className="flex flex-col gap-3 items-start w-full">
              <p className="font-['Poppins'] text-[12px] text-black/70 dark:text-white/70">{section}</p>
              {visibleItems.map((notif) => {
                const accent = sectionAccent(section, isDark);

                return (
                  <button
                    key={notif.id}
                    type="button"
                    onClick={() => markRead(notif.id)}
                    style={{
                      backgroundColor: notif.read ? (isDark ? '#242d45' : '#ffffff') : accent.cardBg,
                    }}
                    className={`w-full text-left flex gap-3 p-3 rounded-[12px] transition-colors`}
                    onMouseEnter={(e) => {
                      if (!notif.read) {
                        (e.currentTarget as HTMLElement).style.backgroundColor = accent.cardHovBg;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!notif.read) {
                        (e.currentTarget as HTMLElement).style.backgroundColor = accent.cardBg;
                      }
                    }}
                  >
                    <div className={`shrink-0 size-[8px] mt-1.5 rounded-full ${accent.dot}`} style={{ opacity: notif.read ? 0 : 1 }} />
                    <div className="flex-1 min-w-0">
                      <p className="font-['Poppins'] font-medium text-[13px] text-black dark:text-white break-words">{notif.title}</p>
                      <p className="font-['Poppins'] text-[11px] text-black/60 dark:text-white/60 break-words">{notif.message}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          );
        })
      )}
    </div>
  );
}
