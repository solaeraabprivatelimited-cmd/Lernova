import React, { useState, useRef, useEffect } from "react";
import svgPaths from "@/imports/svg-5uyq6vimux";
import svgPathsMentor from "@/imports/svg-dnsb7o7d3u";
import svgPathsSystem from "@/imports/svg-cmbk1wuz0q";
import { notifications as notificationsApi } from "@/app/lib/api";

/* ══════════════════════════════════════════════
   Notification types
   ══════════════════════════════════════════════ */

interface ReminderNotification {
  id: string;
  type: "reminder";
  title: string;
  line1: string;
  line2: string;
}

interface StudyPlanNotification {
  id: string;
  type: "study-plan";
  title: string;
  line1: string;
  line2: string;
}

interface MentorSessionReminder {
  id: string;
  type: "mentor-session-reminder";
  mentorName: string;
  time: string;
}

interface MentorSessionRescheduled {
  id: string;
  type: "mentor-session-rescheduled";
  mentorName: string;
  newDateTime: string;
}

interface MentorSessionBooked {
  id: string;
  type: "mentor-session-booked";
  mentorName: string;
  dateTime: string;
}

type MentorNotification =
  | MentorSessionReminder
  | MentorSessionRescheduled
  | MentorSessionBooked;

type GeneralNotification = ReminderNotification | StudyPlanNotification;

interface SystemAlertNotification {
  id: string;
  type: "server-maintenance" | "new-feature";
  title: string;
  description: string;
}

/* ══════════════════════════════════════════════
   Mock data
   ══════════════════════════════════════════════ */

const mockGeneralNotifications: GeneralNotification[] = [
  {
    id: "n1",
    type: "reminder",
    title: "Reminder",
    line1: "Maths Study Session",
    line2: "10PM",
  },
  {
    id: "n2",
    type: "study-plan",
    title: "Study Plan",
    line1: "Advanced Physics",
    line2: "9:00 AM  -  11:00AM",
  },
];

const mockMentorNotifications: MentorNotification[] = [
  {
    id: "m1",
    type: "mentor-session-reminder",
    mentorName: "Ravi Kumar",
    time: "5:00PM - 6:00Pm",
  },
  {
    id: "m2",
    type: "mentor-session-rescheduled",
    mentorName: "Ravi Kumar",
    newDateTime: "18-10-2025  |  9:00PM - 10:00PM",
  },
  {
    id: "m3",
    type: "mentor-session-booked",
    mentorName: "Ravi Kumar",
    dateTime: "18-10-2025  |  9:00PM - 10:00PM",
  },
];

const mockSystemAlerts: SystemAlertNotification[] = [
  {
    id: "s1",
    type: "server-maintenance",
    title: "Server Maintenance",
    description:
      "Scheduled server maintenance is ongoing. Some features may be temporarily unavailable.",
  },
  {
    id: "s2",
    type: "new-feature",
    title: "New Feature Release",
    description:
      "A new update is available! Check out the latest features and improvements.",
  },
];

/* ══════════════════════════════════════════════
   Icons — General notifications
   ══════════════════════════════════════════════ */

function ReminderIcon() {
  return (
    <div className="shrink-0 size-[44px]">
      <svg className="block size-full" fill="none" viewBox="0 0 44 44">
        <rect fill="#FFD60A" height="44" rx="5" width="44" />
        <path d={svgPaths.p9048700} fill="white" />
      </svg>
    </div>
  );
}

function StudyPlanIcon() {
  return (
    <div className="bg-[#1ca4b3] shrink-0 size-[44px] rounded-[5px] flex flex-col items-center justify-center overflow-hidden">
      <div className="h-[14px] w-[12px] relative">
        <div className="absolute inset-[-5.36%_-6.25%_-5.33%_-6.25%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.5002 15.4998">
            <path d={svgPaths.p32c303f0} stroke="white" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p2b26e580} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.pa20fe80} stroke="white" strokeLinecap="round" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   Icons — Mentor session notifications
   ══════════════════════════════════════════════ */

function SessionReminderIcon() {
  return (
    <div className="shrink-0 size-[44px]">
      <svg className="block size-full" fill="none" viewBox="0 0 44 44">
        <rect fill="#8A38F5" height="44" rx="5" width="44" />
        <path d={svgPathsMentor.p9048700} fill="white" />
      </svg>
    </div>
  );
}

function SessionRescheduledIcon() {
  return (
    <div className="bg-[#dc2626] shrink-0 size-[44px] rounded-[5px] flex flex-col items-center justify-center overflow-hidden py-px">
      <div className="size-[24px]">
        <svg className="block size-full" fill="none" viewBox="0 0 24 24">
          <path d={svgPathsMentor.p39f39c00} fill="white" />
        </svg>
      </div>
    </div>
  );
}

function SessionBookedIcon() {
  return (
    <div className="bg-[#34b161] shrink-0 size-[44px] rounded-[5px] flex flex-col items-center justify-center overflow-hidden py-px">
      <div className="size-[24px]">
        <svg className="block size-full" fill="none" viewBox="0 0 24 24">
          <path clipRule="evenodd" d={svgPathsMentor.p31927700} fill="white" fillRule="evenodd" />
        </svg>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   Icons — System alerts
   ══════════════════════════════════════════════ */

function ServerMaintenanceIcon() {
  return (
    <div className="bg-[#f77f00] shrink-0 size-[44px] rounded-[5px] flex flex-col items-center justify-center overflow-hidden py-px">
      <div className="size-[24px]">
        <svg className="block size-full" fill="none" viewBox="0 0 24 24">
          <path clipRule="evenodd" d={svgPathsSystem.p326a720} fill="white" fillRule="evenodd" />
        </svg>
      </div>
    </div>
  );
}

function NewFeatureIcon() {
  return (
    <div className="bg-[#3451b1] shrink-0 size-[44px] rounded-[5px] flex flex-col items-center justify-center overflow-hidden py-px">
      <div className="size-[24px]">
        <svg className="block size-full" fill="none" viewBox="0 0 24 24">
          <path d={svgPathsSystem.p1d676580} fill="white" />
        </svg>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   Notification rows — General
   ══════════════════════════════════════════════ */

function GeneralNotificationRow({ item }: { item: GeneralNotification }) {
  return (
    <div className="flex gap-[10px] items-center w-full">
      {item.type === "reminder" ? <ReminderIcon /> : <StudyPlanIcon />}
      <div className="flex flex-col items-start justify-center">
        <p className="font-['Poppins'] text-[14px] text-black">{item.title}</p>
        <div className="font-['Poppins'] text-[12px] text-black/70 whitespace-nowrap">
          <p className="mb-0">{item.line1}</p>
          <p>{item.line2}</p>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   Notification rows — Mentor sessions
   ══════════════════════════════════════════════ */

function MentorSessionReminderRow({ item }: { item: MentorSessionReminder }) {
  return (
    <div className="flex flex-col items-end w-full">
      <div className="flex gap-[10px] items-start w-full">
        <SessionReminderIcon />
        <div className="flex flex-col gap-[16px] items-start justify-center flex-1">
          {/* Info */}
          <div className="font-['Poppins'] flex flex-col items-start justify-center">
            <p className="text-[14px] text-black">Session Reminder</p>
            <p className="text-[12px] text-black/70">Your Session Starts in 10 Minutes</p>
            <p className="text-[12px] text-black/70">
              <span className="text-black">Mentor Name:</span>
              <span className="text-black/90">{` `}</span>
              <span>{item.mentorName}</span>
            </p>
            <p className="text-[12px] text-black/70">
              <span className="text-black">Time:</span>
              <span>{` ${item.time}`}</span>
            </p>
          </div>
          {/* Join Session Button */}
          <button
            type="button"
            className="bg-[#8a38f5] w-full h-[30px] rounded-[20px] flex items-center justify-center cursor-pointer hover:bg-[#7a2ee5] transition-colors"
          >
            <span className="font-['Poppins'] text-[12px] text-white">Join Session</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function MentorSessionRescheduledRow({ item }: { item: MentorSessionRescheduled }) {
  return (
    <div className="flex gap-[10px] items-center w-full">
      <SessionRescheduledIcon />
      <div className="font-['Poppins'] flex flex-col items-start justify-center">
        <p className="text-[14px] text-black">Session Rescheduled</p>
        <p className="text-[12px] text-black/70">
          <span className="text-black">Mentor Name:</span>
          <span className="text-black/90">{` `}</span>
          <span>{item.mentorName}</span>
        </p>
        <div className="text-[12px] text-black/70 whitespace-nowrap">
          <p className="mb-0">New Date and Time:</p>
          <p>{item.newDateTime}</p>
        </div>
      </div>
    </div>
  );
}

function MentorSessionBookedRow({ item }: { item: MentorSessionBooked }) {
  return (
    <div className="flex gap-[10px] items-center w-full">
      <SessionBookedIcon />
      <div className="font-['Poppins'] flex flex-col items-start justify-center">
        <p className="text-[14px] text-black">Session Booked</p>
        <p className="text-[12px] text-black/70">
          <span className="text-black">Mentor Name:</span>
          <span className="text-black/90">{` `}</span>
          <span>{item.mentorName}</span>
        </p>
        <p className="text-[12px] text-black/70">{item.dateTime}</p>
      </div>
    </div>
  );
}

function MentorNotificationRow({ item }: { item: MentorNotification }) {
  switch (item.type) {
    case "mentor-session-reminder":
      return <MentorSessionReminderRow item={item} />;
    case "mentor-session-rescheduled":
      return <MentorSessionRescheduledRow item={item} />;
    case "mentor-session-booked":
      return <MentorSessionBookedRow item={item} />;
  }
}

/* ══════════════════════════════════════════════
   Notification rows — System alerts
   ══════════════════════════════════════════════ */

function SystemAlertNotificationRow({ item }: { item: SystemAlertNotification }) {
  return (
    <div className="flex gap-[10px] items-center w-full">
      {item.type === "server-maintenance" ? <ServerMaintenanceIcon /> : <NewFeatureIcon />}
      <div className="flex flex-col flex-1 min-w-0 items-start justify-center">
        <p className="font-['Poppins'] text-[14px] text-black">{item.title}</p>
        <p className="font-['Poppins'] text-[12px] text-black/70 whitespace-pre-wrap w-full">
          {item.description}
        </p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   Grouping helpers
   ══════════════════════════════════════════════ */

function groupGeneralByType(items: GeneralNotification[]) {
  const reminders = items.filter((i) => i.type === "reminder");
  const studyPlans = items.filter((i) => i.type === "study-plan");
  return { reminders, studyPlans };
}

/* ══════════════════════════════════════════════
   Main popup component
   ══════════════════════════════════════════════ */

interface NotificationsPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationsPopup({ isOpen, onClose }: NotificationsPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);
  const [viewAll, setViewAll] = useState(false);
  const [apiNotifs, setApiNotifs] = useState<any[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    // Load real notifications from API
    notificationsApi.list().then((data) => setApiNotifs(data)).catch(console.log);

    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const timer = setTimeout(() => { document.addEventListener("mousedown", handleClickOutside); }, 0);
    return () => { clearTimeout(timer); document.removeEventListener("mousedown", handleClickOutside); };
  }, [isOpen, onClose]);

  useEffect(() => { if (!isOpen) setViewAll(false); }, [isOpen]);

  if (!isOpen) return null;

  // Group API notifications by category
  const sessionNotifs = apiNotifs.filter((n) => n.category === "Session Updates");
  const systemNotifs = apiNotifs.filter((n) => n.category === "System and Platform Alerts");
  const withdrawNotifs = apiNotifs.filter((n) => n.category === "Withdraw Notifications");
  const otherNotifs = apiNotifs.filter((n) => !["Session Updates","System and Platform Alerts","Withdraw Notifications"].includes(n.category));
  const hasAny = apiNotifs.length > 0 || mockGeneralNotifications.length > 0 || mockMentorNotifications.length > 0 || mockSystemAlerts.length > 0;

  const { reminders, studyPlans } = groupGeneralByType(mockGeneralNotifications);

  const markRead = async (id: string) => {
    try { await notificationsApi.markRead(id); setApiNotifs((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n)); } catch {}
  };

  return (
    <div
      ref={popupRef}
      className="absolute top-full right-0 mt-2 w-[360px] z-50 bg-white rounded-[20px] shadow-[0px_4px_50px_5px_rgba(0,0,0,0.1)] p-[32px] flex flex-col gap-[24px] items-start overflow-hidden max-h-[80vh] overflow-y-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <p className="font-['Poppins'] font-medium text-[16px] text-black">
          Notifications
        </p>
        {hasAny && (
          <button
            type="button"
            onClick={() => setViewAll((prev) => !prev)}
            className="font-['Poppins'] text-[12px] text-black/70 underline cursor-pointer hover:text-black/90 transition-colors"
          >
            {viewAll ? "View Less" : "View All"}
          </button>
        )}
      </div>

      {/* Content */}
      {!hasAny ? (
        <div className="flex flex-col gap-[16px] items-start w-full">
          <p className="font-['Poppins'] text-[12px] text-black/70">No available Notifications</p>
        </div>
      ) : (
        <>
          {/* Live Session Updates from API */}
          {sessionNotifs.length > 0 && (
            <div className="flex flex-col gap-[12px] items-start w-full">
              <p className="font-['Poppins'] text-[12px] text-black/70">Session Updates</p>
              {sessionNotifs.slice(0, viewAll ? undefined : 3).map((n) => (
                <button key={n.id} type="button" onClick={() => markRead(n.id)}
                  className={`w-full text-left flex gap-3 p-3 rounded-[12px] transition-colors ${n.read ? 'bg-white' : 'bg-[#f0f7ff]'} hover:bg-[#e8f3ff]`}>
                  <div className="shrink-0 size-[8px] mt-1.5 rounded-full bg-[#003566]" style={{ opacity: n.read ? 0 : 1 }} />
                  <div className="flex-1">
                    <p className="font-['Poppins'] font-medium text-[13px] text-black">{n.title}</p>
                    <p className="font-['Poppins'] text-[11px] text-black/60">{n.message}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Reminder Notifications — always visible */}
          {reminders.length > 0 && (
            <div className="flex flex-col gap-[16px] items-start w-full">
              <p className="font-['Poppins'] text-[12px] text-black/70">Reminder Notifications</p>
              {reminders.map((item) => (
                <GeneralNotificationRow key={item.id} item={item} />
              ))}
            </div>
          )}

          {/* Study Plan Notifications — visible when expanded */}
          {viewAll && studyPlans.length > 0 && (
            <div className="flex flex-col gap-[16px] items-start w-full">
              <p className="font-['Poppins'] text-[12px] text-black/70">Study Plan Notifications</p>
              {studyPlans.map((item) => (
                <GeneralNotificationRow key={item.id} item={item} />
              ))}
            </div>
          )}

          {/* Human-Mentor Session Updates — visible when expanded */}
          {viewAll && mockMentorNotifications.length > 0 && (
            <div className="flex flex-col gap-[16px] items-start w-full">
              <p className="font-['Poppins'] text-[12px] text-black/70">Human-Mentor Session Updates</p>
              {mockMentorNotifications.map((item) => (
                <MentorNotificationRow key={item.id} item={item} />
              ))}
            </div>
          )}

          {/* System Alerts – Live from API */}
          {viewAll && systemNotifs.length > 0 && (
            <div className="flex flex-col gap-[12px] items-start w-full">
              <p className="font-['Poppins'] text-[12px] text-black/70">System and Platform Alerts</p>
              {systemNotifs.map((n) => (
                <button key={n.id} type="button" onClick={() => markRead(n.id)}
                  className={`w-full text-left flex gap-3 p-3 rounded-[12px] transition-colors ${n.read ? 'bg-white' : 'bg-[#fff8f0]'} hover:bg-[#fff3e6]`}>
                  <div className="shrink-0 size-[8px] mt-1.5 rounded-full bg-[#F77F00]" style={{ opacity: n.read ? 0 : 1 }} />
                  <div className="flex-1">
                    <p className="font-['Poppins'] font-medium text-[13px] text-black">{n.title}</p>
                    <p className="font-['Poppins'] text-[11px] text-black/60">{n.message}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Static System Alerts Fallback */}
          {viewAll && mockSystemAlerts.length > 0 && (
            <div className="flex flex-col gap-[16px] items-start w-full">
              <p className="font-['Poppins'] text-[12px] text-black/70">Platform Alerts</p>
              {mockSystemAlerts.map((item) => (
                <SystemAlertNotificationRow key={item.id} item={item} />
              ))}
            </div>
          )}

          {/* Withdraw Notifications from API */}
          {viewAll && withdrawNotifs.length > 0 && (
            <div className="flex flex-col gap-[12px] items-start w-full">
              <p className="font-['Poppins'] text-[12px] text-black/70">Withdraw Notifications</p>
              {withdrawNotifs.map((n) => (
                <button key={n.id} type="button" onClick={() => markRead(n.id)}
                  className={`w-full text-left flex gap-3 p-3 rounded-[12px] transition-colors ${n.read ? 'bg-white' : 'bg-[#f0fff4]'} hover:bg-[#e8ffe6]`}>
                  <div className="shrink-0 size-[8px] mt-1.5 rounded-full bg-[#22c55e]" style={{ opacity: n.read ? 0 : 1 }} />
                  <div className="flex-1">
                    <p className="font-['Poppins'] font-medium text-[13px] text-black">{n.title}</p>
                    <p className="font-['Poppins'] text-[11px] text-black/60">{n.message}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}