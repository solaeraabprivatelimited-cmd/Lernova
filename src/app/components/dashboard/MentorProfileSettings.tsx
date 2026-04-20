import React, { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { getCurrentUser, getSupabaseClient, paymentMethods, withdrawals, profile as profileApi, isGoogleOAuthUser, auth } from '@/app/lib/api';
import { validateUpiId, validateBankAccount } from '@/utils/payment-validation';
import svgPaths from "../../../imports/svg-xt2w7tivwg";
import svgPathsHistory from "../../../imports/svg-w70tgomgpc";
import svgPathsPerf from "../../../imports/svg-nif9w3w5t2";
import svgPathsEarn from "../../../imports/svg-wjiqd8pg2b";
import svgPathsPayment from "../../../imports/svg-2drinyowas";
import svgPathsModal from "../../../imports/svg-01ihyd8lbh";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import imgEllipse1 from "figma:asset/1d3b37310d86db33d00fb05038f712cfa0e01556.png";
import imgEllipse2 from "figma:asset/7555d1476bf159a36ae5e44c6435462ac17e5229.png";

// Dark mode hook
function useDarkMode() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    checkDark();
    
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return isDark;
}

interface MentorProfileSettingsProps {
  onBack: () => void;
}

type ProfileSubNav =
  | "basic"
  | "session-history"
  | "performance"
  | "earning"
  | "payment"
  | "withdrawal"
  | "notifications"
  | "security";

/* ── SVG icons ── */

function IconProfile({ active }: { active?: boolean }) {
  return (
    <svg className="shrink-0 size-[24px] text-[rgba(0,0,0,0.6)] dark:text-slate-400" fill="none" viewBox="0 0 18 18">
      <path d={svgPaths.p36395980} stroke={active ? "#003566" : "currentColor"} strokeLinejoin="round" strokeWidth="2" />
      <path d={svgPaths.p372d2a00} stroke={active ? "#003566" : "currentColor"} strokeWidth="2" />
    </svg>
  );
}

function IconHistory() {
  return (
    <svg className="shrink-0 size-[24px] text-[rgba(0,0,0,0.6)] dark:text-slate-400" fill="currentColor" viewBox="0 0 24 24">
      <path d={svgPaths.p111e9c0} />
    </svg>
  );
}

function IconStats() {
  return (
    <svg className="shrink-0 size-[20px] text-[rgba(0,0,0,0.6)] dark:text-slate-400" fill="none" viewBox="0 0 20.5714 12">
      <path d="M13.8571 1H19.5714V6.71429" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <path d={svgPaths.p25d06e00} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

function IconEarning() {
  return (
    <svg className="shrink-0 size-[19px] text-[rgba(0,0,0,0.6)] dark:text-slate-400" fill="none" viewBox="0 0 19 18.2074">
      <path d={svgPaths.p36ee6380} fill="currentColor" />
    </svg>
  );
}

function IconCard() {
  return (
    <svg className="shrink-0 size-[20px] text-[rgba(0,0,0,0.6)] dark:text-slate-400" fill="none" viewBox="0 0 20 20">
      <path d={svgPaths.p2068a280} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d={svgPaths.p18f7d00} stroke="currentColor" strokeLinejoin="round" strokeWidth="1.875" />
    </svg>
  );
}

function IconWithdrawal() {
  return (
    <svg className="shrink-0 size-[24px] text-[rgba(0,0,0,0.6)] dark:text-slate-400" fill="none" viewBox="0 0 21.5 19.5">
      <path d={svgPaths.p392a47c0} stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
      <path d={svgPaths.peb17a80} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      <path d={svgPaths.p2cd66780} stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  );
}

function IconBell() {
  return (
    <svg className="shrink-0 size-[24px] text-[rgba(0,0,0,0.6)] dark:text-slate-400" fill="none" viewBox="0 0 24 24">
      <path d={svgPaths.p13baf700} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.017" />
    </svg>
  );
}

function IconLock() {
  return (
    <svg className="shrink-0 size-[24px] text-black dark:text-white" fill="none" viewBox="0 0 24 24">
      <path clipRule="evenodd" d={svgPaths.p33a04860} fill="currentColor" fillRule="evenodd" />
    </svg>
  );
}

function IconSecurity() {
  return (
    <svg className="shrink-0 size-[24px] text-[rgba(0,0,0,0.6)] dark:text-slate-400" fill="none" viewBox="0 0 24 24">
      <path d="M12 2L3 6.5V11.4C3 17.8 12 23 12 23S21 17.8 21 11.4V6.5L12 2Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <path d="M9 12l3 3 6-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

function IconEye({ show, onClick }: { show: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="shrink-0 size-[24px] overflow-hidden relative cursor-pointer">
      <svg className="absolute block size-full text-[rgba(0,0,0,0.7)] dark:text-slate-400" fill="none" viewBox="0 0 21.0844 20">
        <path d={svgPaths.p4dca300} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </svg>
      {!show && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[18px] h-[1.5px] bg-black/70 dark:bg-white/70 rotate-45" />
        </div>
      )}
    </button>
  );
}

function IconEdit() {
  return (
    <svg className="shrink-0 size-[24px] text-black dark:text-white" fill="none" viewBox="0 0 20.5 21">
      <path d={svgPaths.p2e0ed500} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <path d={svgPaths.p2780a180} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

function IconEditPen() {
  return (
    <svg className="shrink-0 size-[24px] text-black dark:text-white" fill="none" viewBox="0 0 19 19">
      <path d={svgPaths.p21391480} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <path d={svgPaths.p19aa5300} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

function IconEmail() {
  return (
    <svg className="shrink-0 size-[24px] text-black dark:text-white" fill="none" viewBox="0 0 24 24">
      <path d={svgPaths.p629a600} fill="currentColor" />
    </svg>
  );
}

function IconBrain() {
  return (
    <svg className="shrink-0 size-[24px] text-black dark:text-white" fill="none" viewBox="0 0 24 24">
      <path d={svgPaths.p53a5500} fill="currentColor" />
    </svg>
  );
}

function IconGrad() {
  return (
    <svg className="shrink-0 size-[18px] text-black dark:text-white" fill="none" viewBox="0 0 19.4118 15.4118">
      <path d={svgPaths.peeffb80} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.412" />
      <path d={svgPaths.p26571700} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.412" />
    </svg>
  );
}

function IconPlus({ white }: { white?: boolean }) {
  return (
    <svg className="shrink-0 size-[24px]" fill="none" viewBox="0 0 24 24">
      <path d={svgPaths.p7fcb800} fill={white ? "white" : "black"} />
    </svg>
  );
}

function IconDelete() {
  return (
    <svg className="shrink-0 size-[24px]" fill="none" viewBox="0 0 24 24">
      <path d={svgPaths.p252a400} fill="#FF5E5E" />
    </svg>
  );
}

function IconPdf() {
  return (
    <svg className="shrink-0 size-[50px]" fill="none" viewBox="0 0 50 50">
      <g opacity="0.5">
        <path clipRule="evenodd" d={svgPaths.p22096740} fill="#C0C0C0" fillRule="evenodd" />
      </g>
      <path d={svgPaths.p26170200} fill="#C0C0C0" />
      <path d={svgPaths.p31c7ad80} fill="#C0C0C0" />
      <path d={svgPaths.p37478680} fill="#C0C0C0" />
    </svg>
  );
}

function IconDeleteSmall() {
  return (
    <svg className="shrink-0 size-[15px]" fill="none" viewBox="0 0 15 15">
      <path d={svgPaths.p1f40e780} stroke="#003566" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  );
}

function IconUserFocus() {
  return (
    <svg className="shrink-0 size-[18px]" fill="none" viewBox="0 0 18 18">
      <g clipPath="url(#clip-profile-focus)">
        <path d={svgPaths.p3c53dd00} stroke="white" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <defs>
        <clipPath id="clip-profile-focus">
          <rect fill="white" height="18" width="18" />
        </clipPath>
      </defs>
    </svg>
  );
}

/* ── Sub-nav item ── */

function SubNavItem({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    checkDark();
    
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const bgStyle = active 
    ? { background: 'linear-gradient(135deg, #003566, #0967bd)', color: 'white' }
    : { 
        backgroundColor: isDark ? '#2b3139' : '#f0f7ff',
        color: isDark ? 'white' : 'rgba(0,0,0,0.6)'
      };
  
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex gap-[6px] h-[42px] items-center px-[16px] rounded-[10px] w-full text-left transition-colors font-['Poppins'] hover:opacity-80"
      style={bgStyle}
    >
      {icon}
      <span className="text-[14px] leading-normal">
        {label}
      </span>
    </button>
  );
}

/* ── Input field ── */

function InputField({
  label,
  icon,
  value,
  onChange,
  readOnly,
  placeholder,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange?: (v: string) => void;
  readOnly?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-[10px] items-start w-full">
      <p className="font-['Poppins'] text-[14px] md:text-[16px] text-black dark:text-white leading-normal">{label}</p>
      <div className="relative h-[39px] rounded-[10px] w-full border border-[rgba(0,0,0,0.4)] dark:border-[#3a3f47] flex items-center gap-[10px] px-[10px] bg-white dark:bg-[#2b3139]">
        {icon}
        <input
          type="text"
          readOnly={readOnly}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange?.(e.target.value)}
          className="flex-1 bg-transparent font-['Poppins'] text-[13px] md:text-[14px] text-[rgba(0,0,0,0.8)] dark:text-white outline-none placeholder:text-[rgba(0,0,0,0.4)] dark:placeholder:text-slate-500"
        />
      </div>
    </div>
  );
}

/* ── Password field ── */

function PasswordField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col gap-[10px] items-start w-full">
      <p className="font-['Poppins'] text-[14px] md:text-[16px] text-black dark:text-white leading-normal">{label}</p>
      <div className="relative rounded-[10px] w-full border border-[rgba(0,0,0,0.4)] dark:border-[#3a3f47] flex items-center justify-between px-[10px] py-[8px] bg-white dark:bg-[#2b3139]">
        <div className="flex gap-[5px] items-center">
          <IconLock />
          <span className="font-['Poppins'] text-[13px] md:text-[14px] text-[rgba(0,0,0,0.8)] dark:text-slate-300">
            {show ? value || "password" : "●●●●●●●●●●●●"}
          </span>
        </div>
        <IconEye show={show} onClick={() => setShow((v) => !v)} />
      </div>
    </div>
  );
}

/* ── Grade dropdown ── */

function GradeDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const isDark = useDarkMode();
  const [open, setOpen] = useState(false);
  const grades = [
    "0-2 years",
    "2-5 years",
    "5-10 years",
    "10-15 years",
    "15+ years",
  ];
  
  const btnStyle = {
    backgroundColor: isDark ? '#2b3139' : 'white',
    borderColor: isDark ? '#3a3f47' : 'rgba(0,0,0,0.7)',
    color: isDark ? 'white' : 'black'
  };

  return (
    <div className="flex flex-col gap-[10px] items-start w-full relative">
      <p className="font-['Poppins'] text-[16px] text-black dark:text-white leading-normal">Grade / Level</p>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="h-[39px] w-full rounded-[10px] border flex items-center justify-between px-[10px] hover:opacity-80 transition-colors font-['Poppins']"
        style={btnStyle}
      >
        <div className="flex items-center gap-[10px]">
          <IconGrad />
          <span className="font-medium text-[14px]">{value}</span>
        </div>
        <svg className="shrink-0 size-[24px]" fill="none" viewBox="0 0 24 24">
          <path d="M7 10L12 15L17 10" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </svg>
      </button>
      {open && (
        <div className="absolute top-[80px] left-0 w-full rounded-[10px] shadow-[0px_4px_20px_rgba(0,0,0,0.12)] dark:shadow-[0px_4px_20px_rgba(0,0,0,0.4)] z-10 py-1" style={{ backgroundColor: isDark ? '#2b3139' : 'white' }}>
          {grades.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => { onChange(g); setOpen(false); }}
              className={`w-full px-4 py-2 text-left font-['Poppins'] text-[14px] transition-colors ${g === value ? "font-medium" : ""}`}
              style={{
                backgroundColor: isDark && g !== value ? 'transparent' : 'transparent',
                color: isDark ? (g === value ? '#60a5fa' : 'white') : (g === value ? '#003566' : 'black')
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = isDark ? '#3a3f47' : '#f0f7ff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              {g}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Coming Soon panel ── */

function ComingSoonPanel({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-[400px] w-full">
      <div className="flex flex-col items-center gap-4">
        <div className="size-[64px] rounded-full bg-[#e9f5ff] dark:bg-[#003566]/20 flex items-center justify-center">
          <svg className="size-[32px]" fill="none" viewBox="0 0 24 24">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#003566" strokeWidth="2" />
            <path d="M12 8V12M12 16H12.01" stroke="#003566" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <p className="font-['Poppins'] font-medium text-[20px] text-[#003566] dark:text-blue-400">{label}</p>
        <p className="font-['Poppins'] text-[14px] text-[rgba(0,0,0,0.5)] dark:text-slate-400">This section is coming soon.</p>
      </div>
    </div>
  );
}

/* ── Session History ── */

type SessionStatus = "Completed" | "Cancelled" | "Upcoming";
type FilterTab = "All" | SessionStatus;

interface Session {
  id: string;
  student: string;
  initials: string;
  avatarColor: string;
  subject: string;
  date: string;
  time: string;
  duration: string;
  status: SessionStatus;
  rating: number | null;
}

const SESSION_DATA: Session[] = [
  { id: "s1", student: "Arjun Sharma",   initials: "AS", avatarColor: "#c9e5ff", subject: "Mathematics", date: "Feb 18, 2026", time: "4:00 PM",  duration: "60 min", status: "Completed", rating: 5 },
  { id: "s2", student: "Priya Patel",    initials: "PP", avatarColor: "#fde8d8", subject: "Physics",     date: "Feb 17, 2026", time: "6:30 PM",  duration: "45 min", status: "Completed", rating: 4 },
  { id: "s3", student: "Meera Iyer",     initials: "MI", avatarColor: "#d8f5e8", subject: "Chemistry",   date: "Feb 16, 2026", time: "3:00 PM",  duration: "60 min", status: "Cancelled", rating: null },
  { id: "s4", student: "Rahul Singh",    initials: "RS", avatarColor: "#e8d8ff", subject: "Mathematics", date: "Feb 14, 2026", time: "5:00 PM",  duration: "90 min", status: "Completed", rating: 5 },
  { id: "s5", student: "Ananya Gupta",   initials: "AG", avatarColor: "#ffecd8", subject: "Biology",     date: "Feb 12, 2026", time: "2:00 PM",  duration: "60 min", status: "Completed", rating: 3 },
  { id: "s6", student: "Vikram Nair",    initials: "VN", avatarColor: "#d8eeff", subject: "Mathematics", date: "Feb 10, 2026", time: "7:00 PM",  duration: "45 min", status: "Cancelled", rating: null },
  { id: "s7", student: "Sneha Reddy",    initials: "SR", avatarColor: "#fff4d8", subject: "Physics",     date: "Feb 08, 2026", time: "11:00 AM", duration: "60 min", status: "Completed", rating: 4 },
  { id: "s8", student: "Karan Mehta",    initials: "KM", avatarColor: "#ffd8e4", subject: "Chemistry",   date: "Feb 06, 2026", time: "5:30 PM",  duration: "90 min", status: "Completed", rating: 5 },
  { id: "s9", student: "Divya Krishnan", initials: "DK", avatarColor: "#d8ffe8", subject: "Biology",     date: "Feb 04, 2026", time: "3:30 PM",  duration: "45 min", status: "Upcoming",  rating: null },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-[2px]">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg key={star} className="size-[14px]" fill={star <= rating ? "#F77F00" : "none"} viewBox="0 0 24 24">
          <path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            stroke="#F77F00"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: SessionStatus }) {
  const styles: Record<SessionStatus, string> = {
    Completed: "bg-[#d8f5e8] dark:bg-[#1a7a45]/20 text-[#1a7a45] dark:text-[#4ade80]",
    Cancelled:  "bg-[#fde8e8] dark:bg-[#cc3636]/20 text-[#cc3636] dark:text-[#ff8080]",
    Upcoming:   "bg-[#e9f5ff] dark:bg-[#003566]/20 text-[#003566] dark:text-blue-400",
  };
  return (
    <span className={`inline-flex items-center px-[10px] py-[4px] rounded-[20px] font-['Poppins'] text-[11px] md:text-[12px] ${styles[status]}`}>
      {status}
    </span>
  );
}

function SessionHistoryView() {
  const currentUser = getCurrentUser();
  const [filter, setFilter] = useState<FilterTab>("All");
  const [search, setSearch] = useState("");
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!currentUser?.id) {
      setSessions([]);
      setIsLoading(false);
      return;
    }

    const loadSessions = async () => {
      try {
        setIsLoading(true);
        const supabase = getSupabaseClient();

        // Fetch mentor's sessions from both tables in parallel
        const [sessionsResult, bookingsResult] = await Promise.all([
          supabase
            .from('mentor_sessions')
            .select('id, student_id, topic, scheduled_at, duration_mins, status')
            .eq('mentor_id', currentUser.id)
            .order('scheduled_at', { ascending: false }),
          supabase
            .from('mentor_bookings')
            .select('id, student_id, mentor_subject, selected_date_time, duration, status')
            .eq('mentor_id', currentUser.id)
            .order('created_at', { ascending: false }),
        ]);

        const sessionsData = sessionsResult.data ?? [];
        const bookingsData = bookingsResult.data ?? [];

        if (sessionsData.length === 0 && bookingsData.length === 0) {
          setSessions([]);
          return;
        }

        // Collect all student IDs from both sources
        const studentIds = [...new Set([
          ...sessionsData.map((s: any) => s.student_id),
          ...bookingsData.map((b: any) => b.student_id),
        ].filter(Boolean))];

        // Fetch student names from users table (correct FK target)
        const usersMap: Record<string, string> = {};
        if (studentIds.length > 0) {
          const { data: usersData } = await supabase
            .from('users')
            .select('id, name')
            .in('id', studentIds);
          (usersData ?? []).forEach((u: any) => { usersMap[u.id] = u.name ?? 'Student'; });
        }

        // Fetch ratings for completed sessions
        const sessionIds = sessionsData.map((s: any) => s.id);
        const ratingsMap: Record<string, number> = {};
        if (sessionIds.length > 0) {
          const { data: ratingsData } = await supabase
            .from('session_ratings')
            .select('session_id, rating')
            .in('session_id', sessionIds);
          (ratingsData ?? []).forEach((r: any) => { ratingsMap[r.session_id] = r.rating; });
        }

        const AVATAR_COLORS = ['#c9e5ff', '#fde8d8', '#e8d8ff', '#ffecd8', '#fff4d8', '#d8f5e8', '#d8eeff'];
        const colorFor = (id: string) => AVATAR_COLORS[id.charCodeAt(0) % AVATAR_COLORS.length];

        const mapStatus = (s: string): SessionStatus => {
          if (s === 'completed') return 'Completed';
          if (s === 'cancelled') return 'Cancelled';
          return 'Upcoming';
        };

        const fromSessions: Session[] = sessionsData.map((s: any) => {
          const name = usersMap[s.student_id] ?? 'Student';
          const initials = name.split(' ').slice(0, 2).map((n: string) => n[0]).join('').toUpperCase();
          const d = new Date(s.scheduled_at);
          const durationMins = s.duration_mins || 0;
          return {
            id: s.id,
            student: name,
            initials,
            avatarColor: colorFor(s.student_id ?? s.id),
            subject: s.topic || 'General',
            date: d.toLocaleDateString('en-IN', { month: 'short', day: '2-digit', year: 'numeric' }),
            time: d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
            duration: durationMins >= 60
              ? `${Math.floor(durationMins / 60)}h${durationMins % 60 ? ` ${durationMins % 60}m` : ''}`
              : `${durationMins}m`,
            status: mapStatus(s.status),
            rating: ratingsMap[s.id] ?? null,
          };
        });

        const fromBookings: Session[] = bookingsData
          .filter((b: any) => !sessionsData.some((s: any) => s.id === b.id))
          .map((b: any) => {
            const name = usersMap[b.student_id] ?? 'Student';
            const initials = name.split(' ').slice(0, 2).map((n: string) => n[0]).join('').toUpperCase();
            const d = new Date(b.selected_date_time);
            const durationMins = Math.round((parseFloat(String(b.duration).replace(/[^\d.]/g, '')) || 1) * 60);
            return {
              id: b.id,
              student: name,
              initials,
              avatarColor: colorFor(b.student_id ?? b.id),
              subject: b.mentor_subject || 'General',
              date: isNaN(d.getTime()) ? b.selected_date_time : d.toLocaleDateString('en-IN', { month: 'short', day: '2-digit', year: 'numeric' }),
              time: isNaN(d.getTime()) ? '' : d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
              duration: durationMins >= 60
                ? `${Math.floor(durationMins / 60)}h${durationMins % 60 ? ` ${durationMins % 60}m` : ''}`
                : `${durationMins}m`,
              status: mapStatus(b.status),
              rating: null,
            };
          });

        setSessions([...fromSessions, ...fromBookings]);
      } catch (err) {
        console.error('Failed to load sessions:', err);
        setSessions([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadSessions();
  }, [currentUser?.id]);

  const filtered = sessions.filter((s) => {
    const matchFilter = filter === "All" || s.status === filter;
    const matchSearch =
      search.trim() === "" ||
      s.student.toLowerCase().includes(search.toLowerCase()) ||
      s.subject.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const totalCompleted = sessions.filter((s) => s.status === "Completed").length;
  const totalCancelled = sessions.filter((s) => s.status === "Cancelled").length;
  const totalHoursNum = sessions
    .filter((s) => s.status === "Completed")
    .reduce((acc, s) => {
      const h = s.duration.match(/(\d+)h/);
      const m = s.duration.match(/(\d+)m/);
      return acc + (h ? parseInt(h[1]) : 0) + (m ? parseInt(m[1]) / 60 : 0);
    }, 0);
  const totalHoursDisplay = totalHoursNum >= 1 ? `${Math.round(totalHoursNum)}h` : `${Math.round(totalHoursNum * 60)}m`;

  const tabs: FilterTab[] = ["All", "Completed", "Cancelled", "Upcoming"];

  return (
    <div className="p-10">
      {/* Page header */}
      <div className="mb-[32px]">
        <div className="flex items-center gap-[10px] mb-[4px]">
          <svg className="size-[28px]" fill="none" viewBox="0 0 24 24">
            <path d={svgPathsHistory.p111e9c0} fill="#003566" />
          </svg>
          <p className="font-['Poppins'] font-medium text-[40px] text-black dark:text-white leading-normal">Session History</p>
        </div>
        <p className="font-['Poppins'] text-[14px] text-[rgba(0,0,0,0.6)] dark:text-slate-400 leading-normal ml-[38px]">Your complete session history</p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="size-10 animate-spin rounded-full border-[3px] border-[#c9e5ff] border-t-[#003566]" />
          <p className="font-['Poppins'] text-[14px] text-[rgba(0,0,0,0.5)] dark:text-slate-400">Loading sessions...</p>
        </div>
      ) : (
        <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[16px] mb-[28px]">
        {[
          { label: "Total Sessions", value: sessions.length, color: "#003566", bg: "#e9f5ff" },
          { label: "Completed",      value: totalCompleted,       color: "#1a7a45", bg: "#d8f5e8" },
          { label: "Cancelled",      value: totalCancelled,       color: "#cc3636", bg: "#fde8e8" },
          { label: "Total Hours",    value: totalHoursDisplay,   color: "#F77F00", bg: "#fff4d8" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white dark:bg-slate-800 rounded-[20px] px-[24px] py-[20px] flex flex-col gap-[4px] shadow-[0px_2px_12px_rgba(0,0,0,0.06)] dark:shadow-[0px_2px_12px_rgba(0,0,0,0.3)]"
          >
            <p className="font-['Poppins'] font-medium text-[28px] leading-normal" style={{ color: stat.color }}>
              {stat.value}
            </p>
            <p className="font-['Poppins'] text-[13px] text-[rgba(0,0,0,0.5)] dark:text-slate-400 leading-normal">{stat.label}</p>
            <div className="h-[3px] rounded-full mt-[8px]" style={{ backgroundColor: stat.color, opacity: 0.25 }} />
          </div>
        ))}
      </div>

      {/* Filter + Search bar */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-[20px] gap-[16px]">
        {/* Filter tabs */}
        <div className="flex items-center bg-white dark:bg-slate-800 rounded-[20px] p-[4px] shadow-[0px_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0px_2px_8px_rgba(0,0,0,0.3)]">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`px-[16px] py-[8px] rounded-[16px] font-['Poppins'] text-[13px] transition-colors ${
                filter === tab
                  ? "bg-[#003566] text-white"
                  : "text-[rgba(0,0,0,0.5)] dark:text-slate-400 hover:text-black dark:hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-[260px]">
          <svg
            className="absolute left-[12px] top-1/2 -translate-y-1/2 size-[16px] text-[rgba(0,0,0,0.4)] dark:text-slate-500"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
            <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Search student or subject…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-[40px] pl-[36px] pr-[16px] rounded-[20px] border border-[rgba(0,0,0,0.12)] dark:border-slate-600 bg-white dark:bg-slate-800 font-['Poppins'] text-[13px] text-black dark:text-white outline-none w-full placeholder:text-[rgba(0,0,0,0.35)] dark:placeholder:text-slate-500 focus:border-[#003566] dark:focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-[20px] overflow-hidden shadow-[0px_2px_12px_rgba(0,0,0,0.06)] dark:shadow-[0px_2px_12px_rgba(0,0,0,0.3)]">
        {/* Table header */}
        <div className="hidden md:grid grid-cols-[2fr_1.2fr_1.4fr_0.8fr_1fr_1fr] gap-[0] bg-[#003566] dark:bg-[#1a1f2e] px-[24px] py-[14px]">
          {["Student", "Subject", "Date & Time", "Duration", "Status", "Rating"].map((col) => (
            <p key={col} className="font-['Poppins'] font-medium text-[13px] text-white/90 dark:text-slate-200 leading-normal">
              {col}
            </p>
          ))}
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-[60px] gap-[10px]">
            <svg className="size-[40px] text-[rgba(0,0,0,0.2)]" fill="none" viewBox="0 0 24 24">
              <path d={svgPathsHistory.p111e9c0} fill="currentColor" />
            </svg>
            <p className="font-['Poppins'] text-[14px] text-[rgba(0,0,0,0.4)]">No sessions found</p>
          </div>
        ) : (
          filtered.map((session, idx) => (
            <div
              key={session.id}
              className={`hidden md:grid grid-cols-[2fr_1.2fr_1.4fr_0.8fr_1fr_1fr] gap-[0] px-[24px] py-[16px] items-center border-b border-[rgba(0,0,0,0.05)] dark:border-slate-700 last:border-0 transition-colors hover:bg-[rgba(233,245,255,0.4)] dark:hover:bg-slate-700/50 ${
                idx % 2 === 0 ? "bg-white dark:bg-slate-800" : "bg-[rgba(233,245,255,0.15)] dark:bg-slate-700/30"
              }`}
            >
              {/* Student */}
              <div className="flex items-center gap-[10px]">
                <div
                  className="size-[36px] rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: session.avatarColor }}
                >
                  <span className="font-['Poppins'] font-medium text-[11px] text-[#003566]">{session.initials}</span>
                </div>
                <span className="font-['Poppins'] text-[14px] text-black dark:text-white leading-normal">{session.student}</span>
              </div>

              {/* Subject */}
              <span className="font-['Poppins'] text-[13px] text-[rgba(0,0,0,0.7)] dark:text-slate-400 leading-normal">{session.subject}</span>

              {/* Date & Time */}
              <div className="flex flex-col gap-[2px]">
                <span className="font-['Poppins'] text-[13px] text-black dark:text-white leading-normal">{session.date}</span>
                <span className="font-['Poppins'] text-[12px] text-[rgba(0,0,0,0.45)] dark:text-slate-500 leading-normal">{session.time}</span>
              </div>

              {/* Duration */}
              <span className="font-['Poppins'] text-[13px] text-[rgba(0,0,0,0.7)] dark:text-slate-400 leading-normal">{session.duration}</span>

              {/* Status */}
              <StatusBadge status={session.status} />

              {/* Rating */}
              <div>
                {session.rating !== null ? (
                  <StarRating rating={session.rating} />
                ) : (
                  <span className="font-['Poppins'] text-[12px] text-[rgba(0,0,0,0.3)]">—</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Row count */}
      <p className="font-['Poppins'] text-[12px] text-[rgba(0,0,0,0.4)] mt-[12px] text-right">
        Showing {filtered.length} of {sessions.length} sessions
      </p>
        </>
      )}
    </div>
  );
}

/* ── Performance Stats ── */

function PerformanceStatsView() {
  const currentUser = getCurrentUser();
  const [period, setPeriod] = useState<"Weekly" | "Monthly">("Weekly");
  const [periodOpen, setPeriodOpen] = useState(false);
  const [stats, setStats] = useState({ studentsTaught: 0, sessionsCompleted: 0, avgRating: null as number | null });
  const [chartData, setChartData] = useState<any[]>([]);
  const [upcomingCount, setUpcomingCount] = useState(0);

  useEffect(() => {
    if (!currentUser?.id) return;

    const loadPerformanceData = async () => {
      try {
        const supabase = getSupabaseClient();
        const now = new Date();

        const [completedResult, upcomingResult, ratingsResult] = await Promise.all([
          supabase
            .from('mentor_sessions')
            .select('id, student_id, duration_mins, scheduled_at')
            .eq('mentor_id', currentUser.id)
            .eq('status', 'completed'),
          supabase
            .from('mentor_sessions')
            .select('id', { count: 'exact', head: true })
            .eq('mentor_id', currentUser.id)
            .in('status', ['pending', 'confirmed'])
            .gte('scheduled_at', now.toISOString()),
          supabase
            .from('session_ratings')
            .select('rating')
            .eq('mentor_id', currentUser.id),
        ]);

        const sessionsData = completedResult.data ?? [];
        const uniqueStudents = new Set(sessionsData.map((s: any) => s.student_id)).size;

        // Real avg rating from session_ratings table
        const ratingRows = ratingsResult.data ?? [];
        const avgRating = ratingRows.length > 0
          ? Math.round((ratingRows.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) / ratingRows.length) * 10) / 10
          : null;

        // Build chart — index by date string to avoid day-of-week mismatch bug
        const dateMap = new Map<string, number>();
        const labels: string[] = [];

        if (period === "Weekly") {
          for (let i = 6; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            const key = d.toISOString().slice(0, 10);
            const dayLabels = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
            labels.push(dayLabels[d.getDay()]);
            dateMap.set(key, 0);
          }
          sessionsData.forEach((s: any) => {
            const key = new Date(s.scheduled_at).toISOString().slice(0, 10);
            if (dateMap.has(key)) dateMap.set(key, (dateMap.get(key) ?? 0) + Math.round((s.duration_mins || 60) / 60));
          });
        } else {
          const weeks = ['W1','W2','W3','W4'];
          weeks.forEach(w => dateMap.set(w, 0));
          labels.push(...weeks);
          sessionsData.forEach((s: any) => {
            const day = new Date(s.scheduled_at).getDate();
            const wk = `W${Math.min(4, Math.ceil(day / 7))}`;
            dateMap.set(wk, (dateMap.get(wk) ?? 0) + Math.round((s.duration_mins || 60) / 60));
          });
        }

        const chartPoints = labels.map(label => ({
          day: label,
          hours: dateMap.get(period === "Weekly"
            ? [...dateMap.keys()][labels.indexOf(label)]
            : label) ?? 0,
        }));

        setStats({ studentsTaught: uniqueStudents, sessionsCompleted: sessionsData.length, avgRating });
        setUpcomingCount(upcomingResult.count ?? 0);
        setChartData(chartPoints);
      } catch (err) {
        console.error("Failed to load performance data:", err);
      }
    };

    loadPerformanceData();
  }, [currentUser?.id, period]);

  const maxHours = Math.max(4, ...chartData.map(d => d.hours));
  const maxY = Math.ceil(maxHours / 2) * 2 || 4;

  return (
    <div className="p-10">
      {/* Header */}
      <div className="mb-[32px]">
        <div className="flex items-center gap-[10px] mb-[4px]">
          <svg className="size-[22px]" fill="none" viewBox="0 0 20.5714 12">
            <path d="M13.8571 1H19.5714V6.71429" stroke="#003566" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            <path d={svgPathsPerf.p25d06e00} stroke="#003566" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
          <p className="font-['Poppins'] font-medium text-[40px] text-black leading-normal">Performance Stats</p>
        </div>
        <p className="font-['Poppins'] text-[14px] text-[rgba(0,0,0,0.6)] leading-normal ml-[32px]">Track your progress</p>
      </div>

      {/* Main layout: Chart left, cards right */}
      <div className="flex gap-[24px] items-start">

        {/* ── Hours Taught chart card ── */}
        <div className="bg-white dark:bg-slate-800 rounded-[20px] shadow-[0px_4px_50px_5px_rgba(0,0,0,0.08)] dark:shadow-[0px_4px_50px_5px_rgba(0,0,0,0.3)] p-[24px] flex flex-col gap-[8px] flex-1 min-w-0">
          {/* Chart header */}
          <div className="flex items-center justify-between pb-[8px]">
            <p className="font-['Poppins'] font-semibold text-[20px] text-black dark:text-white">Hours Taught</p>
            {/* Period dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setPeriodOpen((v) => !v)}
                className="flex items-center gap-[4px] hover:opacity-70 transition-opacity"
              >
                <span className="font-['Poppins'] text-[14px] text-[#454545] dark:text-slate-300">{period}</span>
                <svg className="size-[14px]" fill="none" viewBox="0 0 8 4.5">
                  <path d="M0.5 0.5L4 4L7.5 0.5" stroke="#7D7D7D" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {periodOpen && (
                <div className="absolute right-0 top-[24px] bg-white dark:bg-slate-800 rounded-[10px] shadow-[0px_4px_20px_rgba(0,0,0,0.12)] dark:shadow-[0px_4px_20px_rgba(0,0,0,0.3)] z-10 py-1 w-[100px]">
                  {(["Weekly", "Monthly"] as const).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => { setPeriod(opt); setPeriodOpen(false); }}
                      className={`w-full px-4 py-2 text-left font-['Poppins'] text-[13px] hover:bg-[#f0f7ff] dark:hover:bg-slate-700 transition-colors ${opt === period ? "text-[#003566] dark:text-blue-400 font-medium" : "text-black dark:text-slate-300"}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recharts Area chart */}
          <div className="h-[180px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="perfGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C9E5FF" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#C9E5FF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#F1F1F1" strokeDasharray="0" vertical={false} />
                <XAxis
                  dataKey="day"
                  tick={{ fontFamily: "Poppins", fontSize: 10, fill: "#7d7d7d" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, maxY]}
                  tick={{ fontFamily: "Poppins", fontSize: 10, fill: "#7d7d7d" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{ borderRadius: 10, fontFamily: "Poppins", fontSize: 12 }}
                  itemStyle={{ color: "#003566" }}
                  cursor={{ stroke: "#003566", strokeWidth: 1, strokeDasharray: "4 4" }}
                />
                <Area
                  type="monotone"
                  dataKey="hours"
                  stroke="#003566"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  fill="url(#perfGrad)"
                  dot={false}
                  activeDot={{ r: 4, fill: "#003566" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Right: 3 stat cards ── */}
        <div className="flex flex-col gap-[10px] w-[340px] shrink-0">

          {/* Row 1: Students Taught + Sessions Completed */}
          <div className="flex gap-[10px]">

            {/* Students Taught */}
            <div className="bg-white dark:bg-slate-800 flex-1 rounded-[16px] shadow-[0px_4px_50px_5px_rgba(0,0,0,0.08)] dark:shadow-[0px_4px_50px_5px_rgba(0,0,0,0.3)] p-[16px] flex flex-col gap-[10px]">
              <div className="flex items-center gap-[6px]">
                {/* Fire gradient icon */}
                <div className="size-[32px] rounded-[20px] flex items-center justify-center shrink-0"
                  style={{ background: "linear-gradient(to bottom, #fab522, #f98018)" }}>
                  <svg className="size-[16px]" fill="none" viewBox="0 0 16 16">
                    <path d={svgPathsPerf.p2473d7f0} fill="white" />
                  </svg>
                </div>
                <p className="font-['Poppins'] font-semibold text-[14px] text-black dark:text-white">Students Taught</p>
              </div>
              <div>
                <p className="font-['Poppins'] font-medium text-[24px] text-black dark:text-white">{stats.studentsTaught}</p>
                <p className="font-['Poppins'] text-[12px] text-[#f98118]">Keep it going</p>
              </div>
            </div>

            {/* Sessions Completed */}
            <div className="bg-white dark:bg-slate-800 flex-1 rounded-[16px] shadow-[0px_4px_50px_5px_rgba(0,0,0,0.08)] dark:shadow-[0px_4px_50px_5px_rgba(0,0,0,0.3)] p-[16px] flex flex-col gap-[10px]">
              <div className="flex items-center gap-[6px]">
                {/* Purple people icon */}
                <div className="size-[32px] rounded-full bg-[#AD5FF8] flex items-center justify-center shrink-0">
                  <svg className="size-[18px]" fill="none" viewBox="0 0 32 32">
                    <path d={svgPathsPerf.p3f34aa80} fill="white" />
                  </svg>
                </div>
                <p className="font-['Poppins'] font-semibold text-[14px] text-black dark:text-white">Sessions Completed</p>
              </div>
              <div>
                <p className="font-['Poppins'] font-medium text-[24px] text-black dark:text-white">{stats.sessionsCompleted}</p>
                <p className="font-['Poppins'] text-[12px] text-[#ac5cf8]">{upcomingCount} upcoming</p>
              </div>
            </div>
          </div>

          {/* Avg. Session Rating */}
          <div className="bg-white dark:bg-slate-800 rounded-[16px] shadow-[0px_4px_50px_5px_rgba(0,0,0,0.08)] dark:shadow-[0px_4px_50px_5px_rgba(0,0,0,0.3)] p-[16px] flex flex-col gap-[10px]">
            <div className="flex items-center gap-[6px]">
              {/* Pink star icon */}
              <div className="size-[32px] rounded-[20px] bg-[#f85fa1] flex items-center justify-center shrink-0">
                <svg className="size-[20px]" fill="none" viewBox="0 0 24 24">
                  <path d={svgPathsPerf.p3dd4d300} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
              <p className="font-['Poppins'] font-semibold text-[16px] text-black dark:text-white">Avg. Session Rating</p>
            </div>
            <div>
              <div className="flex items-center gap-[6px]">
                <p className="font-['Poppins'] font-medium text-[24px] text-black dark:text-white">{stats.avgRating ?? '--'}</p>
                <svg className="size-[21px]" fill="none" viewBox="0 0 21 21">
                  <path d={svgPathsPerf.p17837100} fill="#F77F00" stroke="#F77F00" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
              <p className="font-['Poppins'] text-[12px] text-[#ac5cf8]">Keep going</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

/* ── Earning Stats ── */

const EARN_WEEKLY_DATA = [
  { day: "MON", amount: 0 },
  { day: "TUE", amount: 0  },
  { day: "WED", amount: 0 },
  { day: "THU", amount: 0 },
  { day: "FRI", amount: 0  },
  { day: "SAT", amount: 0 },
  { day: "SUN", amount: 0 },
];

const EARN_MONTHLY_DATA = [
  { day: "W1", amount: 0  },
  { day: "W2", amount: 0 },
  { day: "W3", amount: 0  },
  { day: "W4", amount: 0 },
];

type PayStatus = "Paid" | "Pending";

interface EarningRow {
  id: string;
  student: string;
  initials: string;
  avatarColor: string;
  subject: string;
  date: string;
  duration: string;
  amount: string;
  status: PayStatus;
}

const EARNING_ROWS: EarningRow[] = [
  { id: "e1", student: "Arjun Sharma",   initials: "AS", avatarColor: "#c9e5ff", subject: "Mathematics", date: "Feb 18, 2026", duration: "60 min", amount: "₹800",   status: "Paid"    },
  { id: "e2", student: "Priya Patel",    initials: "PP", avatarColor: "#fde8d8", subject: "Physics",     date: "Feb 17, 2026", duration: "45 min", amount: "₹600",   status: "Paid"    },
  { id: "e3", student: "Rahul Singh",    initials: "RS", avatarColor: "#e8d8ff", subject: "Mathematics", date: "Feb 14, 2026", duration: "90 min", amount: "₹1,200", status: "Paid"    },
  { id: "e4", student: "Ananya Gupta",   initials: "AG", avatarColor: "#ffecd8", subject: "Biology",     date: "Feb 12, 2026", duration: "60 min", amount: "₹800",   status: "Paid"    },
  { id: "e5", student: "Sneha Reddy",    initials: "SR", avatarColor: "#fff4d8", subject: "Physics",     date: "Feb 08, 2026", duration: "60 min", amount: "₹800",   status: "Paid"    },
  { id: "e6", student: "Karan Mehta",    initials: "KM", avatarColor: "#ffd8e4", subject: "Chemistry",   date: "Feb 06, 2026", duration: "90 min", amount: "₹1,200", status: "Paid"    },
  { id: "e7", student: "Divya Krishnan", initials: "DK", avatarColor: "#d8ffe8", subject: "Biology",     date: "Feb 04, 2026", duration: "45 min", amount: "₹1,000", status: "Pending" },
  { id: "e8", student: "Meera Iyer",     initials: "MI", avatarColor: "#d8f5e8", subject: "Chemistry",   date: "Feb 02, 2026", duration: "60 min", amount: "₹1,100", status: "Pending" },
  { id: "e9", student: "Vikram Nair",    initials: "VN", avatarColor: "#d8eeff", subject: "Mathematics", date: "Feb 01, 2026", duration: "60 min", amount: "₹900",   status: "Pending" },
];

function PayBadge({ status }: { status: PayStatus }) {
  return (
    <span className={`inline-flex items-center px-[10px] py-[4px] rounded-[20px] font-['Poppins'] text-[12px] ${
      status === "Paid" ? "bg-[#d8f5e8] text-[#1a7a45]" : "bg-[#fff4d8] text-[#c07a00]"
    }`}>
      {status}
    </span>
  );
}

function EarningStatsView() {
  const currentUser = getCurrentUser();
  const [period, setPeriod] = useState<"Weekly" | "Monthly">("Weekly");
  const [periodOpen, setPeriodOpen] = useState(false);
  const [payFilter, setPayFilter] = useState<"All" | PayStatus>("All");
  const [search, setSearch] = useState("");
  const [earnings, setEarnings] = useState({ totalEarnings: 0, pendingPayouts: 0, sessionsCompleted: 0 });
  const [chartData, setChartData] = useState<any[]>([]);
  const [earningRows, setEarningRows] = useState<EarningRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!currentUser?.id) {
      setIsLoading(false);
      return;
    }

    const loadEarningData = async () => {
      try {
        setIsLoading(true);
        const supabase = getSupabaseClient();
        const now = new Date();

        // Fetch payments + related sessions in parallel
        const [paymentsResult, bookingsResult] = await Promise.all([
          supabase
            .from('payments')
            .select('id, student_id, amount, status, created_at, session_id')
            .eq('mentor_id', currentUser.id)
            .order('created_at', { ascending: false }),
          supabase
            .from('mentor_bookings')
            .select('id, student_id, booking_price, status, created_at, duration, mentor_subject')
            .eq('mentor_id', currentUser.id)
            .order('created_at', { ascending: false }),
        ]);

        const paymentsData = paymentsResult.data ?? [];
        const bookingsData = bookingsResult.data ?? [];

        // Collect session IDs to fetch durations
        const sessionIds = paymentsData.map((p: any) => p.session_id).filter(Boolean);
        const sessionsMap: Record<string, number> = {};
        if (sessionIds.length > 0) {
          const { data: sessData } = await supabase
            .from('mentor_sessions')
            .select('id, duration_mins')
            .in('id', sessionIds);
          (sessData ?? []).forEach((s: any) => { sessionsMap[s.id] = s.duration_mins; });
        }

        // Collect all student IDs and fetch from users table
        const studentIds = [...new Set([
          ...paymentsData.map((p: any) => p.student_id),
          ...bookingsData.map((b: any) => b.student_id),
        ].filter(Boolean))];
        const usersMap: Record<string, string> = {};
        if (studentIds.length > 0) {
          const { data: usersData } = await supabase
            .from('users')
            .select('id, name')
            .in('id', studentIds);
          (usersData ?? []).forEach((u: any) => { usersMap[u.id] = u.name ?? 'Student'; });
        }

        const AVATAR_COLORS = ['#c9e5ff', '#fde8d8', '#e8d8ff', '#ffecd8', '#fff4d8'];
        const colorFor = (id: string) => AVATAR_COLORS[id.charCodeAt(0) % AVATAR_COLORS.length];

        // Build rows from payments (primary source)
        const fromPayments: EarningRow[] = paymentsData.map((p: any) => {
          const name = usersMap[p.student_id] ?? 'Student';
          const initials = name.split(' ').slice(0, 2).map((n: string) => n[0]).join('').toUpperCase();
          const durationMins = sessionsMap[p.session_id] ?? 60;
          const durationStr = durationMins >= 60
            ? `${Math.floor(durationMins / 60)}h${durationMins % 60 ? ` ${durationMins % 60}m` : ''}`
            : `${durationMins}m`;
          const d = new Date(p.created_at);
          return {
            id: p.id,
            student: name,
            initials,
            avatarColor: colorFor(p.student_id ?? p.id),
            subject: 'Session',
            date: d.toLocaleDateString('en-IN', { month: 'short', day: '2-digit', year: 'numeric' }),
            duration: durationStr,
            amount: `₹${Math.round((p.amount || 0) / 100).toLocaleString('en-IN')}`,
            status: p.status === 'completed' ? 'Paid' : 'Pending' as PayStatus,
          };
        });

        // Supplement with bookings if no payments exist
        const fromBookings: EarningRow[] = paymentsData.length === 0
          ? bookingsData.map((b: any) => {
              const name = usersMap[b.student_id] ?? 'Student';
              const initials = name.split(' ').slice(0, 2).map((n: string) => n[0]).join('').toUpperCase();
              const durationMins = Math.round((parseFloat(String(b.duration).replace(/[^\d.]/g, '')) || 1) * 60);
              const durationStr = durationMins >= 60
                ? `${Math.floor(durationMins / 60)}h${durationMins % 60 ? ` ${durationMins % 60}m` : ''}`
                : `${durationMins}m`;
              const d = new Date(b.created_at);
              return {
                id: b.id,
                student: name,
                initials,
                avatarColor: colorFor(b.student_id ?? b.id),
                subject: b.mentor_subject || 'Session',
                date: d.toLocaleDateString('en-IN', { month: 'short', day: '2-digit', year: 'numeric' }),
                duration: durationStr,
                amount: `₹${Math.round(b.booking_price || 0).toLocaleString('en-IN')}`,
                status: b.status === 'cancelled' ? 'Pending' : 'Paid' as PayStatus,
              };
            })
          : [];

        const allRows = [...fromPayments, ...fromBookings];

        // Stats
        const completed = allRows.filter(r => r.status === 'Paid');
        const pending = allRows.filter(r => r.status === 'Pending');
        const totalEarnings = paymentsData
          .filter((p: any) => p.status === 'completed')
          .reduce((sum: number, p: any) => sum + Math.round((p.amount || 0) / 100), 0)
          || bookingsData
            .filter((b: any) => b.status !== 'cancelled')
            .reduce((sum: number, b: any) => sum + Math.round(b.booking_price || 0), 0);
        const pendingPayouts = paymentsData
          .filter((p: any) => p.status !== 'completed')
          .reduce((sum: number, p: any) => sum + Math.round((p.amount || 0) / 100), 0);

        // Build chart indexed by date string (fixes day-of-week bug)
        const dateMap = new Map<string, number>();
        const labels: string[] = [];
        const sourceData = paymentsData.length > 0 ? paymentsData : bookingsData;
        const amountKey = paymentsData.length > 0 ? 'amount' : 'booking_price';
        const divisor = paymentsData.length > 0 ? 100 : 1;

        if (period === "Weekly") {
          for (let i = 6; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            const key = d.toISOString().slice(0, 10);
            const dayLabels = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
            labels.push(dayLabels[d.getDay()]);
            dateMap.set(key, 0);
          }
          const keys = [...dateMap.keys()];
          sourceData.forEach((row: any) => {
            if (row.status === 'cancelled') return;
            const key = new Date(row.created_at).toISOString().slice(0, 10);
            const idx = keys.indexOf(key);
            if (idx >= 0) dateMap.set(key, (dateMap.get(key) ?? 0) + Math.round((row[amountKey] || 0) / divisor));
          });
        } else {
          const weeks = ['W1','W2','W3','W4'];
          weeks.forEach(w => dateMap.set(w, 0));
          labels.push(...weeks);
          sourceData.forEach((row: any) => {
            if (row.status === 'cancelled') return;
            const day = new Date(row.created_at).getDate();
            const wk = `W${Math.min(4, Math.ceil(day / 7))}`;
            dateMap.set(wk, (dateMap.get(wk) ?? 0) + Math.round((row[amountKey] || 0) / divisor));
          });
        }

        const chartPoints = labels.map((label, i) => ({
          day: label,
          amount: dateMap.get(period === "Weekly" ? [...dateMap.keys()][i] : label) ?? 0,
        }));

        setEarnings({ totalEarnings, pendingPayouts, sessionsCompleted: completed.length });
        setEarningRows(allRows);
        setChartData(chartPoints);
      } catch (err) {
        console.error('Failed to load earning data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadEarningData();
  }, [currentUser?.id, period]);

  const maxAmount = Math.max(1000, ...chartData.map(d => d.amount));
  const maxY = Math.ceil(maxAmount / 1000) * 1000;
  const yFmt = (v: number) => v === 0 ? "0" : `${v / 1000}K`;

  const filtered = earningRows.filter((r) => {
    const matchPay = payFilter === "All" || r.status === payFilter;
    const matchSearch =
      search.trim() === "" ||
      r.student.toLowerCase().includes(search.toLowerCase()) ||
      r.subject.toLowerCase().includes(search.toLowerCase());
    return matchPay && matchSearch;
  });

  return (
    <div className="p-10">
      {/* Header */}
      <div className="mb-[32px]">
        <div className="flex items-center gap-[10px] mb-[4px]">
          <svg className="size-[22px]" fill="none" viewBox="0 0 19 18.2074">
            <path d={svgPathsEarn.p36ee6380} fill="#003566" />
          </svg>
          <p className="font-['Poppins'] font-medium text-[40px] text-black leading-normal">Earning Stats</p>
        </div>
        <p className="font-['Poppins'] text-[14px] text-[rgba(0,0,0,0.6)] leading-normal ml-[32px]">Track your earning progress</p>
      </div>

      {/* Top row: Chart + 3 cards */}
      <div className="flex gap-[24px] items-start mb-[28px]">

        {/* ── Earning Trends chart ── */}
        <div className="bg-white dark:bg-slate-800 rounded-[20px] shadow-[0px_4px_50px_5px_rgba(0,0,0,0.08)] dark:shadow-[0px_4px_50px_5px_rgba(0,0,0,0.3)] p-[24px] flex flex-col gap-[8px] flex-1 min-w-0">
          <div className="flex items-center justify-between pb-[8px]">
            <p className="font-['Poppins'] font-semibold text-[20px] text-black dark:text-white">Earning Trends</p>
            <div className="relative">
              <button
                type="button"
                onClick={() => setPeriodOpen((v) => !v)}
                className="flex items-center gap-[4px] hover:opacity-70 transition-opacity"
              >
                <span className="font-['Poppins'] text-[14px] text-[#454545] dark:text-slate-300">{period}</span>
                <svg className="size-[14px]" fill="none" viewBox="0 0 8 4.5">
                  <path d="M0.5 0.5L4 4L7.5 0.5" stroke="#7D7D7D" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {periodOpen && (
                <div className="absolute right-0 top-[24px] bg-white dark:bg-slate-800 rounded-[10px] shadow-[0px_4px_20px_rgba(0,0,0,0.12)] dark:shadow-[0px_4px_20px_rgba(0,0,0,0.3)] z-10 py-1 w-[100px]">
                  {(["Weekly", "Monthly"] as const).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => { setPeriod(opt); setPeriodOpen(false); }}
                      className={`w-full px-4 py-2 text-left font-['Poppins'] text-[13px] hover:bg-[#f0f7ff] dark:hover:bg-slate-700 transition-colors ${opt === period ? "text-[#003566] dark:text-blue-400 font-medium" : "text-black dark:text-slate-300"}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="h-[180px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
                <defs>
                  <linearGradient id="earnGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#C9E5FF" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#C9E5FF" stopOpacity={0}    />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#F1F1F1" strokeDasharray="0" vertical={false} />
                <XAxis dataKey="day" tick={{ fontFamily: "Poppins", fontSize: 10, fill: "#7d7d7d" }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, maxY]} tickFormatter={yFmt} tick={{ fontFamily: "Poppins", fontSize: 10, fill: "#7d7d7d" }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(v: number) => [`₹${v.toLocaleString("en-IN")}`, "Earned"]}
                  contentStyle={{ borderRadius: 10, fontFamily: "Poppins", fontSize: 12 }}
                  itemStyle={{ color: "#003566" }}
                  cursor={{ stroke: "#003566", strokeWidth: 1, strokeDasharray: "4 4" }}
                />
                <Area type="monotone" dataKey="amount" stroke="#003566" strokeWidth={1.5} strokeDasharray="4 4" fill="url(#earnGrad)" dot={false} activeDot={{ r: 4, fill: "#003566" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── 3 stat cards ── */}
        <div className="flex flex-col gap-[10px] w-[340px] shrink-0">

          {/* Row 1: Total Earnings + Pending Payouts */}
          <div className="flex gap-[10px]">

            {/* Total Earnings */}
            <div className="bg-white dark:bg-slate-800 flex-1 rounded-[16px] shadow-[0px_4px_50px_5px_rgba(0,0,0,0.08)] dark:shadow-[0px_4px_50px_5px_rgba(0,0,0,0.3)] p-[16px] flex flex-col gap-[10px]">
              <div className="flex items-center gap-[6px]">
                <div className="size-[32px] rounded-[20px] flex items-center justify-center shrink-0"
                  style={{ background: "linear-gradient(to bottom, #fab522, #f98018)" }}>
                  <svg className="size-[16px]" fill="none" viewBox="0 0 16 16">
                    <path d={svgPathsEarn.p2473d7f0} fill="white" />
                  </svg>
                </div>
                <p className="font-['Poppins'] font-semibold text-[14px] text-black dark:text-white">Total Earnings</p>
              </div>
              <div>
                <p className="font-['Poppins'] font-medium text-[22px] text-black dark:text-white">₹{earnings.totalEarnings.toLocaleString("en-IN")}</p>
                <p className="font-['Poppins'] text-[11px] text-[#f98118]">Your total earnings so far!</p>
              </div>
            </div>

            {/* Pending Payouts */}
            <div className="bg-white dark:bg-slate-800 flex-1 rounded-[16px] shadow-[0px_4px_50px_5px_rgba(0,0,0,0.08)] dark:shadow-[0px_4px_50px_5px_rgba(0,0,0,0.3)] p-[16px] flex flex-col gap-[10px]">
              <div className="flex items-center gap-[6px]">
                <div className="size-[32px] rounded-[20px] bg-[#ad5ff8] flex items-center justify-center shrink-0">
                  <svg className="size-[16px]" fill="none" viewBox="0 0 16 18.0006">
                    <path d={svgPathsEarn.p125b7c00} fill="white" />
                    <path d={svgPathsEarn.p31e1b9b0} fill="white" />
                    <path d={svgPathsEarn.p23139900} fill="white" />
                    <path d={svgPathsEarn.p25fe700}  fill="white" />
                  </svg>
                </div>
                <p className="font-['Poppins'] font-semibold text-[13px] text-black dark:text-white">Pending Payouts</p>
              </div>
              <div>
                <p className="font-['Poppins'] font-medium text-[22px] text-black dark:text-white">₹{earnings.pendingPayouts.toLocaleString("en-IN")}</p>
                <p className="font-['Poppins'] text-[11px] text-[#ac5cf8]">Amount Awaiting Withdrawal</p>
              </div>
            </div>
          </div>

          {/* Sessions Completed */}
          <div className="bg-white dark:bg-slate-800 rounded-[16px] shadow-[0px_4px_50px_5px_rgba(0,0,0,0.08)] dark:shadow-[0px_4px_50px_5px_rgba(0,0,0,0.3)] p-[16px] flex flex-col gap-[10px]">
            <div className="flex items-center gap-[6px]">
              <div className="size-[32px] rounded-[20px] bg-[#f85fa1] flex items-center justify-center shrink-0">
                <svg className="size-[20px]" fill="none" viewBox="0 0 24 24">
                  <path d={svgPathsEarn.p16a0cd00} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </div>
              <p className="font-['Poppins'] font-semibold text-[16px] text-black dark:text-white">Sessions Completed</p>
            </div>
            <div>
              <p className="font-['Poppins'] font-medium text-[24px] text-black dark:text-white">{earnings.sessionsCompleted}</p>
              <p className="font-['Poppins'] text-[12px] text-[#ac5cf8]">Keep mentoring</p>
            </div>
          </div>
        </div>
      </div>

      {/* Earnings History */}
      <div className="flex items-center justify-between mb-[16px] gap-[16px]">
        <p className="font-['Poppins'] font-medium text-[20px] text-black dark:text-white">Earnings History</p>
        <div className="flex items-center gap-[12px]">
          {/* Filter tabs */}
          <div className="flex items-center bg-white dark:bg-slate-800 rounded-[20px] p-[4px] shadow-[0px_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0px_2px_8px_rgba(0,0,0,0.3)]">
            {(["All", "Paid", "Pending"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setPayFilter(tab)}
                className={`px-[16px] py-[7px] rounded-[16px] font-['Poppins'] text-[13px] transition-colors ${
                  payFilter === tab ? "bg-[#003566] text-white" : "text-[rgba(0,0,0,0.5)] dark:text-slate-400 hover:text-black dark:hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          {/* Search */}
          <div className="relative">
            <svg className="absolute left-[12px] top-1/2 -translate-y-1/2 size-[14px] text-[rgba(0,0,0,0.4)] dark:text-slate-500" fill="none" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
              <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Search…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-[38px] pl-[32px] pr-[14px] rounded-[20px] border border-[rgba(0,0,0,0.12)] dark:border-slate-600 bg-white dark:bg-slate-800 font-['Poppins'] text-[13px] text-black dark:text-white outline-none w-[200px] placeholder:text-[rgba(0,0,0,0.35)] dark:placeholder:text-slate-500 focus:border-[#003566] dark:focus:border-blue-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-[20px] overflow-hidden shadow-[0px_2px_12px_rgba(0,0,0,0.06)] dark:shadow-[0px_2px_12px_rgba(0,0,0,0.3)]">
        {/* Header */}
        <div className="grid grid-cols-[2fr_1.2fr_1.2fr_0.8fr_0.8fr_0.8fr] bg-[#003566] dark:bg-slate-900 px-[24px] py-[14px]">
          {["Student", "Subject", "Date", "Duration", "Amount", "Status"].map((col) => (
            <p key={col} className="font-['Poppins'] font-medium text-[13px] text-white/90 dark:text-slate-200">{col}</p>
          ))}
        </div>
        {/* Rows */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-[50px] gap-[10px]">
            <p className="font-['Poppins'] text-[14px] text-[rgba(0,0,0,0.4)] dark:text-slate-500">No earnings found</p>
          </div>
        ) : (
          filtered.map((row, idx) => (
            <div
              key={row.id}
              className={`grid grid-cols-[2fr_1.2fr_1.2fr_0.8fr_0.8fr_0.8fr] px-[24px] py-[15px] items-center border-b border-[rgba(0,0,0,0.05)] dark:border-slate-700 last:border-0 hover:bg-[rgba(233,245,255,0.4)] dark:hover:bg-slate-700/50 transition-colors ${
                idx % 2 === 0 ? "bg-white dark:bg-slate-800" : "bg-[rgba(233,245,255,0.15)] dark:bg-slate-700/30"
              }`}
            >
              {/* Student */}
              <div className="flex items-center gap-[10px]">
                <div className="size-[34px] rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: row.avatarColor }}>
                  <span className="font-['Poppins'] font-medium text-[11px] text-[#003566]">{row.initials}</span>
                </div>
                <span className="font-['Poppins'] text-[13px] text-black dark:text-white">{row.student}</span>
              </div>
              {/* Subject */}
              <span className="font-['Poppins'] text-[13px] text-[rgba(0,0,0,0.7)] dark:text-slate-400">{row.subject}</span>
              {/* Date */}
              <span className="font-['Poppins'] text-[13px] text-black dark:text-white">{row.date}</span>
              {/* Duration */}
              <span className="font-['Poppins'] text-[13px] text-[rgba(0,0,0,0.7)] dark:text-slate-400">{row.duration}</span>
              {/* Amount */}
              <span className="font-['Poppins'] font-medium text-[13px] text-[#003566] dark:text-blue-400">{row.amount}</span>
              {/* Status */}
              <PayBadge status={row.status} />
            </div>
          ))
        )}
      </div>

      <p className="font-['Poppins'] text-[12px] text-[rgba(0,0,0,0.4)] mt-[12px] text-right">
        Showing {filtered.length} of {earningRows.length} transactions
      </p>
    </div>
  );
}

/* ── Payment Modes ── */

type PaymentMethod = {
  id: string;
  type: "upi" | "bank";
  name: string;
  detail: string;
  primary: boolean;
  upiId?: string;
  holderName?: string;
  accountNumber?: string;
  bankName?: string;
  ifscCode?: string;
};

type PayModalState =
  | null
  | "select-type"
  | "add-upi"
  | "edit-upi"
  | "add-bank"
  | "edit-bank";

function UpiIconBadge({ size = 46 }: { size?: number }) {
  return (
    <div className="flex items-center justify-center rounded-[20px] shrink-0"
      style={{ width: size, height: size, background: "rgba(248,95,161,0.2)" }}>
      <svg style={{ width: size * 0.5, height: size * 0.5 }} fill="none" viewBox="0 0 14 20">
        <path d={svgPathsPayment.pfc58d00} stroke="#F85FA1" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        <path d="M6 15.75H8" stroke="#F85FA1" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

function BankIconBadge({ size = 46 }: { size?: number }) {
  return (
    <div className="flex items-center justify-center rounded-[20px] shrink-0"
      style={{ width: size, height: size, background: "rgba(138,56,245,0.2)" }}>
      <svg style={{ width: size * 0.55, height: size * 0.55 }} fill="none" viewBox="0 0 24 24">
        <path d={svgPathsPayment.p24ed1f00} stroke="#8A38F5" strokeLinecap="round" strokeLinejoin="round" />
        <path d={svgPathsPayment.p22ec8d00} stroke="#8A38F5" strokeLinejoin="round" strokeWidth="1.875" />
      </svg>
    </div>
  );
}

function UpiIconModal() {
  return (
    <div className="flex items-center justify-center rounded-[23px] shrink-0"
      style={{ width: 53, height: 53, background: "rgba(248,95,161,0.2)" }}>
      <svg className="size-[28px]" fill="none" viewBox="0 0 16.1304 23.0435">
        <path d={svgPathsModal.p3674de00} stroke="#F85FA1" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.72826" />
        <path d="M6.91195 18.1481H9.2163" stroke="#F85FA1" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.72826" />
      </svg>
    </div>
  );
}

function BankIconModal() {
  return (
    <div className="flex items-center justify-center rounded-[23px] shrink-0"
      style={{ width: 53, height: 53, background: "rgba(138,56,245,0.2)" }}>
      <svg className="size-[28px]" fill="none" viewBox="0 0 27.6522 27.6522">
        <path d={svgPathsModal.p3d90b700} stroke="#8A38F5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.15217" />
        <path d={svgPathsModal.pd0f5dc0} stroke="#8A38F5" strokeLinejoin="round" strokeWidth="2.16033" />
      </svg>
    </div>
  );
}

function ModalCloseBtn({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className="relative shrink-0 size-[36px] hover:opacity-70 transition-opacity overflow-clip">
      <svg className="absolute block size-full" fill="none" viewBox="0 0 30.125 30.125">
        <path d={svgPathsModal.pbf6e7f0} stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        <path d={svgPathsModal.p361eb80} stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </svg>
    </button>
  );
}

function PayFormInput({ label, value, onChange, placeholder, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string;
}) {
  return (
    <div className="flex flex-col gap-[6px] items-start w-full">
      <p className="font-['Poppins'] font-medium text-[14px] text-black">{label}</p>
      <div className="h-[39px] rounded-[10px] w-full border border-[rgba(0,0,0,0.4)] flex items-center px-[10px]">
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent font-['Poppins'] text-[14px] text-[rgba(0,0,0,0.8)] outline-none placeholder:text-[rgba(0,0,0,0.4)]" />
      </div>
    </div>
  );
}

function PaymentModesView() {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [payModal, setPayModal] = useState<PayModalState>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [upiId, setUpiId] = useState("");
  const [holderName, setHolderName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [confirmAccNum, setConfirmAccNum] = useState("");
  const [bkName, setBkName] = useState("");
  const [ifscCode, setIfscCode] = useState("");

  // Load payment methods on mount
  useEffect(() => {
    loadPaymentMethods();
  }, []);

  async function loadPaymentMethods() {
    try {
      setIsLoading(true);
      const methods = await paymentMethods.getAll();
      
      const mappedMethods: PaymentMethod[] = methods.map(m => ({
        id: m.id,
        type: m.type as 'upi' | 'bank',
        name: m.type === 'upi' ? 'UPI' : m.bankName || 'Bank Account',
        detail: m.type === 'upi' 
          ? m.upiId 
          : `****${m.accountNumber.slice(-4)}  •  ${m.ifscCode}`,
        primary: m.isPrimary,
        upiId: m.upiId,
        holderName: m.holderName,
        accountNumber: m.accountNumber,
        bankName: m.bankName,
        ifscCode: m.ifscCode,
      }));
      
      setMethods(mappedMethods);
    } catch (error: any) {
      console.error('Failed to load payment methods:', error);
      toast.error('Failed to load payment methods');
    } finally {
      setIsLoading(false);
    }
  }

  function closeModal() { setPayModal(null); setEditingId(null); }

  function openAddUpi() { setUpiId(""); setPayModal("add-upi"); }
  function openEditUpi(m: PaymentMethod) { setEditingId(m.id); setUpiId(m.upiId ?? ""); setPayModal("edit-upi"); }
  function openAddBank() {
    setHolderName(""); setAccountNumber(""); setConfirmAccNum(""); setBkName(""); setIfscCode("");
    setPayModal("add-bank");
  }
  function openEditBank(m: PaymentMethod) {
    setEditingId(m.id);
    setHolderName(m.holderName ?? ""); setAccountNumber(m.accountNumber ?? "");
    setConfirmAccNum(m.accountNumber ?? ""); setBkName(m.bankName ?? ""); setIfscCode(m.ifscCode ?? "");
    setPayModal("edit-bank");
  }

  async function handleAddUpi() {
    // Validate UPI ID
    const upiValidation = validateUpiId(upiId);
    if (!upiValidation.valid) {
      toast.error(upiValidation.error || 'Invalid UPI ID');
      return;
    }

    try {
      setIsSaving(true);
      const created = await paymentMethods.create({
        type: 'upi',
        upiId: upiId.trim(),
        holderName: 'UPI Account',
      });

      setMethods(prev => [...prev, {
        id: created.id,
        type: created.type as 'upi' | 'bank',
        name: 'UPI',
        detail: created.upiId,
        primary: prev.length === 0,
        upiId: created.upiId,
      }]);

      toast.success('UPI ID added successfully');
      closeModal();
    } catch (error: any) {
      console.error('Failed to add UPI:', error);
      toast.error(error?.message || 'Failed to add UPI ID');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSaveUpi() {
    // Validate UPI ID
    const upiValidation = validateUpiId(upiId);
    if (!upiValidation.valid) {
      toast.error(upiValidation.error || 'Invalid UPI ID');
      return;
    }

    try {
      setIsSaving(true);
      await paymentMethods.update(editingId!, {
        upiId: upiId.trim(),
      });

      setMethods(prev => prev.map(m => m.id === editingId 
        ? { ...m, detail: upiId.trim(), upiId: upiId.trim() } 
        : m
      ));

      toast.success('UPI ID updated successfully');
      closeModal();
    } catch (error: any) {
      console.error('Failed to update UPI:', error);
      toast.error(error?.message || 'Failed to update UPI ID');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleAddBank() {
    // Validate bank details
    const validation = validateBankAccount({
      holderName,
      accountNumber,
      confirmAccountNumber: confirmAccNum,
      bankName: bkName,
      ifscCode,
    });

    if (!validation.valid) {
      toast.error(validation.error || 'Invalid bank details');
      return;
    }

    try {
      setIsSaving(true);
      const created = await paymentMethods.create({
        type: 'bank',
        bankName: bkName.trim(),
        accountNumber: accountNumber.trim(),
        ifscCode: ifscCode.trim(),
        holderName: holderName.trim(),
      });

      const masked = `****${accountNumber.slice(-4)}`;
      setMethods(prev => [...prev, {
        id: created.id,
        type: created.type as 'upi' | 'bank',
        name: created.bankName || bkName.trim(),
        detail: `${masked}  •  ${ifscCode.trim()}`,
        primary: prev.length === 0,
        holderName: holderName.trim(),
        accountNumber: accountNumber.trim(),
        bankName: bkName.trim(),
        ifscCode: ifscCode.trim(),
      }]);

      toast.success('Bank account added successfully');
      closeModal();
    } catch (error: any) {
      console.error('Failed to add bank account:', error);
      toast.error(error?.message || 'Failed to add bank account');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSaveBank() {
    // Validate bank details
    const validation = validateBankAccount({
      holderName,
      accountNumber,
      confirmAccountNumber: confirmAccNum,
      bankName: bkName,
      ifscCode,
    });

    if (!validation.valid) {
      toast.error(validation.error || 'Invalid bank details');
      return;
    }

    try {
      setIsSaving(true);
      await paymentMethods.update(editingId!, {
        bankName: bkName.trim(),
        accountNumber: accountNumber.trim(),
        ifscCode: ifscCode.trim(),
        holderName: holderName.trim(),
      });

      const masked = `****${accountNumber.slice(-4)}`;
      setMethods(prev => prev.map(m => m.id === editingId
        ? {
          ...m,
          name: bkName.trim(),
          detail: `${masked}  •  ${ifscCode.trim()}`,
          holderName: holderName.trim(),
          accountNumber: accountNumber.trim(),
          bankName: bkName.trim(),
          ifscCode: ifscCode.trim(),
        }
        : m
      ));

      toast.success('Bank account updated successfully');
      closeModal();
    } catch (error: any) {
      console.error('Failed to update bank account:', error);
      toast.error(error?.message || 'Failed to update bank account');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await paymentMethods.delete(id);

      setMethods(prev => {
        const wasPrimary = prev.find(m => m.id === id)?.primary ?? false;
        const next = prev.filter(m => m.id !== id);
        if (wasPrimary && next.length > 0) next[0] = { ...next[0], primary: true };
        return next;
      });

      toast.success('Payment method deleted');
    } catch (error: any) {
      console.error('Failed to delete payment method:', error);
      toast.error(error?.message || 'Failed to delete payment method');
    }
  }

  async function handleSetPrimary(id: string) {
    try {
      await paymentMethods.setPrimary(id);

      setMethods(prev => prev.map(m => ({ ...m, primary: m.id === id })));

      toast.success('Primary payment method updated');
    } catch (error: any) {
      console.error('Failed to set primary method:', error);
      toast.error(error?.message || 'Failed to set primary payment method');
    }
  }

  return (
    <div className="p-10 bg-white dark:bg-[#0f0f1e] min-h-screen">
      {/* Header */}
      <div className="mb-[32px]">
        <div className="flex items-center gap-[10px] mb-[4px]">
          <svg className="size-[22px]" fill="none" viewBox="0 0 20 20">
            <path d={svgPathsPayment.p2068a280} stroke="#003566" strokeLinecap="round" strokeLinejoin="round" />
            <path d={svgPathsPayment.p18f7d00} stroke="#003566" strokeLinejoin="round" strokeWidth="1.875" />
          </svg>
          <p className="font-['Poppins'] font-medium text-[40px] text-black dark:text-white leading-normal">Payment Modes</p>
        </div>
        <p className="font-['Poppins'] text-[14px] text-[rgba(0,0,0,0.6)] dark:text-slate-400 leading-normal ml-[32px]">Manage how you receive your earnings.</p>
      </div>

      {isLoading && (
        <p className="font-['Poppins'] text-[16px] text-[rgba(0,0,0,0.6)] dark:text-slate-400 text-center mb-[16px]">
          Loading payment methods...
        </p>
      )}

      {!isLoading && methods.length === 0 && (
        <p className="font-['Poppins'] text-[16px] text-[rgba(0,0,0,0.6)] dark:text-slate-400 text-center mb-[16px]">
          No payment methods found. Please add a payment method
        </p>
      )}

      <div className="flex flex-col gap-[16px]">
        {methods.map(m => (
          <div key={m.id}
            className="bg-white dark:bg-slate-800 flex h-[124px] items-center justify-between overflow-clip p-[16px] rounded-[16px] shadow-[0px_4px_50px_5px_rgba(0,0,0,0.1)] dark:shadow-[0px_4px_50px_5px_rgba(0,0,0,0.3)]">
            <button type="button"
              onClick={() => m.type === "upi" ? openEditUpi(m) : openEditBank(m)}
              className="flex items-center gap-[10px] hover:opacity-80 transition-opacity text-left">
              {m.type === "upi" ? <UpiIconBadge size={46} /> : <BankIconBadge size={46} />}
              <div className="flex flex-col gap-[4px]">
                <div className="flex items-center gap-[8px]">
                  <p className="font-['Poppins'] font-medium text-[24px] text-black dark:text-white leading-normal">{m.name}</p>
                  {m.primary && (
                    <span className="inline-flex items-center justify-center h-[17px] px-[10px] rounded-[20px] bg-[rgba(52,177,97,0.2)]">
                      <span className="font-['Poppins'] text-[10px] text-[#34b161]">Primary</span>
                    </span>
                  )}
                </div>
                <p className="font-['Poppins'] text-[12px] text-[rgba(0,0,0,0.6)] dark:text-slate-400">{m.detail}</p>
              </div>
            </button>
            <div className="flex items-center gap-[42px]">
              {!m.primary && (
                <button type="button" onClick={() => handleSetPrimary(m.id)} disabled={isSaving}
                  className="font-['Poppins'] font-medium text-[14px] text-[#0788ff] hover:opacity-70 transition-opacity whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed">
                  Set as Primary
                </button>
              )}
              <button type="button" onClick={() => handleDelete(m.id)} disabled={isSaving}
                className="shrink-0 size-[24px] hover:opacity-70 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
                <svg className="block size-full" fill="none" viewBox="0 0 24 24">
                  <path d={svgPathsPayment.p252a400} fill="#FF5E5E" />
                </svg>
              </button>
            </div>
          </div>
        ))}

        {/* Add New */}
        <button type="button" onClick={() => setPayModal("select-type")} disabled={isLoading || isSaving}
          className="bg-white dark:bg-slate-800 flex gap-[10px] h-[124px] items-center justify-center overflow-clip p-[16px] rounded-[16px] shadow-[0px_4px_50px_5px_rgba(0,0,0,0.1)] dark:shadow-[0px_4px_50px_5px_rgba(0,0,0,0.3)] w-full hover:bg-[#f8fbff] dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          <div className="size-[46px] rounded-[20px] bg-[#c9e5ff] dark:bg-[#003566] flex items-center justify-center shrink-0">
            <svg className="size-[24px]" fill="none" viewBox="0 0 24 24">
              <path d={svgPathsPayment.p155fb3f0} fill="#003566" className="dark:hidden" />
              <path d={svgPathsPayment.p155fb3f0} fill="white" className="hidden dark:block" />
            </svg>
          </div>
          <p className="font-['Poppins'] font-medium text-[16px] text-[#003566] dark:text-white">{isSaving ? 'Saving...' : 'Add New Payment Method'}</p>
        </button>
      </div>

      {/* ── Modals ── */}
      {payModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6"
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>

          {/* Select Type */}
          {payModal === "select-type" && (
            <div className="bg-white dark:bg-slate-800 rounded-[20px] shadow-[0px_4px_50px_5px_rgba(0,0,0,0.1)] dark:shadow-[0px_4px_50px_5px_rgba(0,0,0,0.3)] p-[32px] flex flex-col gap-[24px] w-[660px] max-w-full md:w-[660px]">
              <div className="flex items-center justify-between">
                <p className="font-['Poppins'] font-medium text-[32px] text-black dark:text-white">Add New Payment Method</p>
                <ModalCloseBtn onClick={closeModal} />
              </div>
              <div className="flex flex-col md:flex-row gap-[32px]">
                {/* UPI */}
                <div className="bg-white dark:bg-slate-700 flex flex-col gap-[16px] items-center justify-center p-[32px] rounded-[20px] shadow-[0px_4px_50px_0px_rgba(0,0,0,0.1)] dark:shadow-[0px_4px_50px_0px_rgba(0,0,0,0.3)] flex-1">
                  <UpiIconModal />
                  <div className="flex flex-col items-center gap-[2px]">
                    <p className="font-['Poppins'] font-medium text-[24px] text-black dark:text-white">UPI</p>
                    <p className="font-['Poppins'] text-[12px] text-[rgba(0,0,0,0.6)] dark:text-slate-400 text-center">Quick and instant payments via UPI ID</p>
                  </div>
                  <button type="button" onClick={openAddUpi} className="flex items-center gap-[6px] hover:opacity-70 transition-opacity">
                    <p className="font-['Poppins'] font-medium text-[14px] text-[#f85fa1]">Select</p>
                    <svg className="size-[22px] rotate-90" fill="none" viewBox="0 0 22 22">
                      <path clipRule="evenodd" d={svgPathsModal.p16746080} fill="#F85FA1" fillRule="evenodd" />
                    </svg>
                  </button>
                </div>
                {/* Bank */}
                <div className="bg-white dark:bg-slate-700 flex flex-col gap-[16px] items-center justify-center p-[32px] rounded-[20px] shadow-[0px_4px_50px_0px_rgba(0,0,0,0.1)] dark:shadow-[0px_4px_50px_0px_rgba(0,0,0,0.3)] flex-1">
                  <BankIconModal />
                  <div className="flex flex-col items-center gap-[2px]">
                    <p className="font-['Poppins'] font-medium text-[24px] text-black dark:text-white">Bank Account</p>
                    <p className="font-['Poppins'] text-[12px] text-[rgba(0,0,0,0.6)] dark:text-slate-400 text-center">Direct bank transfer to your account</p>
                  </div>
                  <button type="button" onClick={openAddBank} className="flex items-center gap-[6px] hover:opacity-70 transition-opacity">
                    <p className="font-['Poppins'] font-medium text-[14px] text-[#8a38f5]">Select</p>
                    <svg className="size-[22px] rotate-90" fill="none" viewBox="0 0 22 22">
                      <path clipRule="evenodd" d={svgPathsModal.p16746080} fill="#8A38F5" fillRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Add UPI */}
          {payModal === "add-upi" && (
            <div className="bg-white dark:bg-slate-800 rounded-[20px] shadow-[0px_4px_50px_5px_rgba(0,0,0,0.1)] dark:shadow-[0px_4px_50px_5px_rgba(0,0,0,0.3)] p-[32px] flex flex-col gap-[24px] w-[700px] max-w-full md:w-[700px]">
              <div className="flex items-center justify-between">
                <div>
                  <button type="button" onClick={() => setPayModal("select-type")}
                    className="font-['Poppins'] text-[14px] text-[rgba(0,0,0,0.6)] dark:text-slate-400 hover:text-black dark:hover:text-white transition-colors">{"< Back"}</button>
                  <p className="font-['Poppins'] font-medium text-[32px] text-black dark:text-white">Add UPI</p>
                </div>
                <ModalCloseBtn onClick={closeModal} />
              </div>
              <div className="bg-white dark:bg-slate-700 flex flex-col gap-[16px] items-start p-[32px] rounded-[20px] shadow-[0px_4px_50px_0px_rgba(0,0,0,0.1)] dark:shadow-[0px_4px_50px_0px_rgba(0,0,0,0.3)] w-full">
                <UpiIconModal />
                <PayFormInput label="UPI ID" value={upiId} onChange={setUpiId} placeholder="yourname@upi" />
                <div className="flex gap-[16px] items-center justify-end w-full">
                  <button type="button" onClick={closeModal} disabled={isSaving}
                    className="bg-[#e4e4e4] dark:bg-slate-600 h-[42px] px-[24px] rounded-[20px] font-['Poppins'] font-medium text-[12px] text-[rgba(0,0,0,0.6)] dark:text-slate-300 hover:bg-[#d4d4d4] dark:hover:bg-slate-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Cancel</button>
                  <button type="button" onClick={handleAddUpi} disabled={isSaving}
                    className="bg-[#f96faa] h-[42px] px-[24px] rounded-[20px] font-['Poppins'] font-medium text-[12px] text-white hover:bg-[#f055a0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">{isSaving ? 'Saving...' : 'Add UPI'}</button>
                </div>
              </div>
            </div>
          )}

          {/* Edit UPI */}
          {payModal === "edit-upi" && (
            <div className="bg-white dark:bg-slate-800 rounded-[20px] shadow-[0px_4px_50px_5px_rgba(0,0,0,0.1)] dark:shadow-[0px_4px_50px_5px_rgba(0,0,0,0.3)] p-[32px] flex flex-col gap-[24px] w-[700px] max-w-full md:w-[700px]">
              <div className="flex items-center justify-between">
                <p className="font-['Poppins'] font-medium text-[32px] text-black dark:text-white">Edit UPI</p>
                <ModalCloseBtn onClick={closeModal} />
              </div>
              <div className="bg-white dark:bg-slate-700 flex flex-col gap-[16px] items-start p-[32px] rounded-[20px] shadow-[0px_4px_50px_0px_rgba(0,0,0,0.1)] dark:shadow-[0px_4px_50px_0px_rgba(0,0,0,0.3)] w-full">
                <UpiIconModal />
                <PayFormInput label="UPI ID" value={upiId} onChange={setUpiId} placeholder="yourname@upi" />
                <div className="flex gap-[16px] items-center justify-end w-full">
                  <button type="button" onClick={closeModal} disabled={isSaving}
                    className="bg-[#e4e4e4] dark:bg-slate-600 h-[42px] px-[24px] rounded-[20px] font-['Poppins'] font-medium text-[12px] text-[rgba(0,0,0,0.6)] dark:text-slate-300 hover:bg-[#d4d4d4] dark:hover:bg-slate-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Cancel</button>
                  <button type="button" onClick={handleSaveUpi} disabled={isSaving}
                    className="bg-[#f96faa] h-[42px] px-[24px] rounded-[20px] font-['Poppins'] font-medium text-[12px] text-white hover:bg-[#f055a0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">{isSaving ? 'Saving...' : 'Save'}</button>
                </div>
              </div>
            </div>
          )}

          {/* Add Bank */}
          {payModal === "add-bank" && (
            <div className="bg-white dark:bg-slate-800 rounded-[20px] shadow-[0px_4px_50px_5px_rgba(0,0,0,0.1)] dark:shadow-[0px_4px_50px_5px_rgba(0,0,0,0.3)] p-[32px] flex flex-col gap-[24px] w-[700px] max-w-full md:w-[700px] max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between">
                <div>
                  <button type="button" onClick={() => setPayModal("select-type")} disabled={isSaving}
                    className="font-['Poppins'] text-[14px] text-[rgba(0,0,0,0.6)] dark:text-slate-400 hover:text-black dark:hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed">{"< Back"}</button>
                  <p className="font-['Poppins'] font-medium text-[32px] text-black dark:text-white">Add Bank Account</p>
                </div>
                <ModalCloseBtn onClick={closeModal} />
              </div>
              <div className="bg-white dark:bg-slate-700 flex flex-col gap-[16px] items-start p-[32px] rounded-[20px] shadow-[0px_4px_50px_0px_rgba(0,0,0,0.1)] dark:shadow-[0px_4px_50px_0px_rgba(0,0,0,0.3)] w-full">
                <BankIconModal />
                <PayFormInput label="Account Holder Name" value={holderName} onChange={setHolderName} placeholder="Enter full name as per bank records" />
                <PayFormInput label="Account Number" value={accountNumber} onChange={setAccountNumber} placeholder="Enter account number" type="password" />
                <PayFormInput label="Confirm Account Number" value={confirmAccNum} onChange={setConfirmAccNum} placeholder="Re-Enter account number" type="password" />
                <PayFormInput label="Bank Name" value={bkName} onChange={setBkName} placeholder="Enter Bank Name" />
                <PayFormInput label="IFSC Code" value={ifscCode} onChange={setIfscCode} placeholder="Enter Bank IFSC Code" />
                <div className="flex gap-[16px] items-center justify-end w-full">
                  <button type="button" onClick={closeModal} disabled={isSaving}
                    className="bg-[#e4e4e4] dark:bg-slate-600 h-[42px] px-[24px] rounded-[20px] font-['Poppins'] font-medium text-[12px] text-[rgba(0,0,0,0.6)] dark:text-slate-300 hover:bg-[#d4d4d4] dark:hover:bg-slate-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Cancel</button>
                  <button type="button" onClick={handleAddBank} disabled={isSaving}
                    className="bg-[#8a38f5] h-[42px] px-[24px] rounded-[20px] font-['Poppins'] font-medium text-[12px] text-white hover:bg-[#7a2ee5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">{isSaving ? 'Saving...' : 'Add Bank Account'}</button>
                </div>
              </div>
            </div>
          )}

          {/* Edit Bank */}
          {payModal === "edit-bank" && (
            <div className="bg-white dark:bg-slate-800 rounded-[20px] shadow-[0px_4px_50px_5px_rgba(0,0,0,0.1)] dark:shadow-[0px_4px_50px_5px_rgba(0,0,0,0.3)] p-[32px] flex flex-col gap-[24px] w-[700px] max-w-full md:w-[700px] max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between">
                <p className="font-['Poppins'] font-medium text-[32px] text-black dark:text-white">Edit Bank Account</p>
                <ModalCloseBtn onClick={closeModal} />
              </div>
              <div className="bg-white dark:bg-slate-700 flex flex-col gap-[16px] items-start p-[32px] rounded-[20px] shadow-[0px_4px_50px_0px_rgba(0,0,0,0.1)] dark:shadow-[0px_4px_50px_0px_rgba(0,0,0,0.3)] w-full">
                <BankIconModal />
                <PayFormInput label="Account Holder Name" value={holderName} onChange={setHolderName} placeholder="Enter full name as per bank records" />
                <PayFormInput label="Account Number" value={accountNumber} onChange={setAccountNumber} placeholder="Enter account number" />
                <PayFormInput label="Confirm Account Number" value={confirmAccNum} onChange={setConfirmAccNum} placeholder="Re-Enter account number" />
                <PayFormInput label="Bank Name" value={bkName} onChange={setBkName} placeholder="Enter Bank Name" />
                <PayFormInput label="IFSC Code" value={ifscCode} onChange={setIfscCode} placeholder="Enter Bank IFSC Code" />
                <div className="flex gap-[16px] items-center justify-end w-full">
                  <button type="button" onClick={closeModal} disabled={isSaving}
                    className="bg-[#e4e4e4] dark:bg-slate-600 h-[42px] px-[24px] rounded-[20px] font-['Poppins'] font-medium text-[12px] text-[rgba(0,0,0,0.6)] dark:text-slate-300 hover:bg-[#d4d4d4] dark:hover:bg-slate-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Cancel</button>
                  <button type="button" onClick={handleSaveBank} disabled={isSaving}
                    className="bg-[#8a38f5] h-[42px] px-[24px] rounded-[20px] font-['Poppins'] font-medium text-[12px] text-white hover:bg-[#7a2ee5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">{isSaving ? 'Saving...' : 'Save'}</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Withdrawal ── */

type WithdrawalStatus = "Completed" | "Processing" | "Failed";

interface WithdrawalRow {
  id: string;
  date: string;
  amount: string;
  method: string;
  status: WithdrawalStatus;
}

function WithdrawalBadge({ status }: { status: WithdrawalStatus }) {
  const style: Record<WithdrawalStatus, string> = {
    Completed:  "bg-[#d8f5e8] text-[#1a7a45]",
    Processing: "bg-[#fff0e0] text-[#c07a00]",
    Failed:     "bg-[#fde8e8] text-[#cc3636]",
  };
  return (
    <span className={`inline-flex items-center px-[14px] py-[5px] rounded-[20px] font-['Poppins'] text-[12px] ${style[status]}`}>
      {status}
    </span>
  );
}

function WithdrawalView() {
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState("0");
  const [selMethod, setSelMethod] = useState<string | null>(null);
  const [history, setHistory] = useState<WithdrawalRow[]>([]);
  const [balance, setBalance] = useState(0);
  const [wError, setWError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethodsList, setPaymentMethodsList] = useState<any[]>([]);
  const [stats, setStats] = useState({ thisMonth: 0, pending: 0, completed: 0 });

  // Load all data on mount
  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setIsLoading(true);
      const [balanceData, historyData, statsData, methodsData] = await Promise.all([
        withdrawals.getBalance(),
        withdrawals.getHistory(),
        withdrawals.getStats(),
        paymentMethods.getAll(),
      ]);

      setBalance(balanceData.balance);
      setStats(statsData);
      setPaymentMethodsList(methodsData);

      // Set first method as selected if available
      if (methodsData.length > 0) {
        setSelMethod(methodsData[0].id);
      }

      // Map history to display format
      const mappedHistory: WithdrawalRow[] = historyData.map(h => {
        const date = new Date(h.requestedAt);
        const dd = String(date.getDate()).padStart(2, '0');
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const yy = String(date.getFullYear()).slice(-2);
        
        return {
          id: h.id,
          date: `${dd}-${mm}-${yy}`,
          amount: `₹${h.amount.toLocaleString('en-IN')}/-`,
          method: h.method?.upiId || h.method?.bankName || 'Unknown',
          status: h.status.charAt(0).toUpperCase() + h.status.slice(1) as WithdrawalStatus,
        };
      });

      setHistory(mappedHistory);
    } catch (error: any) {
      console.error('Failed to load withdrawal data:', error);
      toast.error('Failed to load withdrawal data');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleConfirm() {
    const amt = parseInt(amount, 10);
    
    if (isNaN(amt) || amt < 500) {
      setWError("Minimum withdrawal is ₹500.");
      return;
    }
    if (amt > balance) {
      setWError("Amount exceeds available balance.");
      return;
    }
    if (!selMethod) {
      setWError("Please select a payment method.");
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await withdrawals.request({
        paymentMethodId: selMethod,
        amount: amt,
      });

      // Add to history
      const today = new Date();
      const dd = String(today.getDate()).padStart(2, '0');
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const yy = String(today.getFullYear()).slice(-2);
      
      const methodLabel = paymentMethodsList.find(m => m.id === selMethod)?.name || 'Payment Method';
      
      const newRow: WithdrawalRow = {
        id: result.id,
        date: `${dd}-${mm}-${yy}`,
        amount: `₹${amt.toLocaleString('en-IN')}/-`,
        method: methodLabel,
        status: 'Processing',
      };

      setHistory(prev => [newRow, ...prev]);
      setBalance(prev => prev - amt);
      setAmount('0');
      setWError('');
      setShowModal(false);

      toast.success('Withdrawal request submitted successfully');
      
      // Reload balance and stats
      loadData();
    } catch (error: any) {
      console.error('Failed to submit withdrawal:', error);
      setWError(error?.message || 'Failed to submit withdrawal request');
      toast.error(error?.message || 'Failed to submit withdrawal');
    } finally {
      setIsSubmitting(false);
    }
  }

  function openModal() {
    setAmount('0');
    setWError('');
    if (paymentMethodsList.length > 0) {
      setSelMethod(paymentMethodsList[0].id);
    }
    setShowModal(true);
  }

  if (isLoading) {
    return (
      <div className="p-10 bg-white dark:bg-[#0f0f1e] min-h-screen">
        <p className="font-['Poppins'] text-[16px] text-[rgba(0,0,0,0.6)] dark:text-slate-400">Loading withdrawal data...</p>
      </div>
    );
  }

  return (
    <div className="p-10 bg-white dark:bg-[#0f0f1e] min-h-screen">
      {/* Header */}
      <div className="mb-[32px]">
        <div className="flex items-center gap-[10px] mb-[4px]">
          <svg className="size-[22px]" fill="none" viewBox="0 0 21.5 19.5">
            <path d={svgPathsPayment.p392a47c0} stroke="#003566" strokeLinecap="round" strokeWidth="1.5" />
            <path d={svgPathsPayment.peb17a80}  stroke="#003566" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPathsPayment.p2cd66780} stroke="#003566" strokeLinecap="round" strokeWidth="1.5" />
          </svg>
          <p className="font-['Poppins'] font-medium text-[40px] text-black dark:text-white leading-normal">Withdrawal</p>
        </div>
        <p className="font-['Poppins'] text-[14px] text-[rgba(0,0,0,0.6)] dark:text-slate-400 ml-[32px]">Transfer your funds securely</p>
      </div>

      {/* Available Balance card */}
      <div className="bg-white dark:bg-slate-800 flex flex-col md:flex-row items-center justify-between p-[16px] rounded-[16px] shadow-[0px_4px_50px_5px_rgba(0,0,0,0.1)] dark:shadow-[0px_4px_50px_5px_rgba(0,0,0,0.3)] mb-[20px]">
        <div className="flex flex-col gap-[2px] mb-4 md:mb-0">
          <p className="font-['Poppins'] text-[12px] text-[rgba(0,0,0,0.6)] dark:text-slate-400">Available Balance</p>
          <p className="font-['Poppins'] font-medium text-[32px] text-black dark:text-white tracking-[-0.2px]">
            ₹{balance.toLocaleString("en-IN")}
          </p>
          <p className="font-['Poppins'] text-[12px] text-[rgba(0,0,0,0.6)] dark:text-slate-400">Earnings ready for withdrawal</p>
        </div>
        <div className="flex flex-col items-end gap-[6px]">
          <p className="font-['Poppins'] text-[12px] text-[rgba(0,0,0,0.6)] dark:text-slate-400">Minimum withdrawal ₹500</p>
          <button type="button" onClick={openModal} disabled={paymentMethodsList.length === 0}
            className="bg-[#003566] h-[42px] w-[155px] rounded-[20px] font-['Poppins'] text-[14px] text-white hover:bg-[#002a52] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title={paymentMethodsList.length === 0 ? "Add a payment method first" : ""}>
            {paymentMethodsList.length === 0 ? 'Add Method' : 'Withdraw'}
          </button>
        </div>
      </div>

      {/* Two stat cards */}
      <div className="flex flex-col md:flex-row gap-[32px] mb-[28px]">
        <div className="bg-white dark:bg-slate-800 flex-1 h-[116px] rounded-[16px] shadow-[0px_4px_50px_5px_rgba(0,0,0,0.1)] dark:shadow-[0px_4px_50px_5px_rgba(0,0,0,0.3)] p-[16px] flex flex-col gap-[2px]">
          <p className="font-['Poppins'] text-[12px] text-[rgba(0,0,0,0.6)] dark:text-slate-400">This Month</p>
          <p className="font-['Poppins'] font-medium text-[24px] text-black dark:text-white tracking-[-0.2px]">₹{stats.thisMonth.toLocaleString('en-IN')}</p>
          <p className="font-['Poppins'] text-[12px] text-[rgba(0,0,0,0.6)] dark:text-slate-400">Income generated this month</p>
        </div>
        <div className="bg-white dark:bg-slate-800 flex-1 rounded-[16px] shadow-[0px_4px_50px_5px_rgba(0,0,0,0.1)] dark:shadow-[0px_4px_50px_5px_rgba(0,0,0,0.3)] p-[16px] flex flex-col gap-[2px]">
          <p className="font-['Poppins'] text-[12px] text-[rgba(0,0,0,0.6)] dark:text-slate-400">Pending Payouts</p>
          <p className="font-['Poppins'] font-medium text-[32px] text-black dark:text-white tracking-[-0.2px]">₹{stats.pending.toLocaleString('en-IN')}</p>
          <p className="font-['Poppins'] text-[12px] text-[rgba(0,0,0,0.6)] dark:text-slate-400">Amount awaiting processing</p>
        </div>
      </div>

      {/* Recent Withdrawals */}
      <p className="font-['Poppins'] font-medium text-[20px] text-black dark:text-white mb-[16px]">Recent Withdrawals</p>
      {history.length === 0 ? (
        <p className="font-['Poppins'] text-[14px] text-[rgba(0,0,0,0.6)] dark:text-slate-400">No withdrawal history found.</p>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-[20px] overflow-hidden shadow-[0px_2px_12px_rgba(0,0,0,0.06)] dark:shadow-[0px_2px_12px_rgba(0,0,0,0.3)]">
          <div className="hidden md:grid grid-cols-4 bg-[#c9e5ff] dark:bg-slate-700 px-[24px] py-[16px]">
            {["Date", "Amount", "Method", "Status"].map(col => (
              <p key={col} className="font-['Poppins'] text-[14px] text-black dark:text-white">{col}</p>
            ))}
          </div>
          {history.map((row, idx) => (
            <div key={row.id}
              className={`grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-0 px-[24px] py-[16px] md:py-[16px] md:items-center border-b border-[rgba(0,0,0,0.05)] dark:border-slate-700 last:border-0 hover:bg-[rgba(233,245,255,0.3)] dark:hover:bg-slate-700 transition-colors ${
                idx % 2 === 0 ? "bg-white dark:bg-slate-800" : "bg-[rgba(233,245,255,0.15)] dark:bg-slate-700/30"
              }`}>
              <div className="md:hidden font-['Poppins'] text-[11px] text-[rgba(0,0,0,0.5)] dark:text-slate-500">Date</div>
              <span className="font-['Poppins'] text-[14px] text-black dark:text-white">{row.date}</span>
              <div className="md:hidden font-['Poppins'] text-[11px] text-[rgba(0,0,0,0.5)] dark:text-slate-500">Amount</div>
              <span className="font-['Poppins'] text-[14px] text-black dark:text-white">{row.amount}</span>
              <div className="md:hidden font-['Poppins'] text-[11px] text-[rgba(0,0,0,0.5)] dark:text-slate-500">Method</div>
              <span className="font-['Poppins'] text-[14px] text-black dark:text-white">{row.method}</span>
              <div className="md:hidden font-['Poppins'] text-[11px] text-[rgba(0,0,0,0.5)] dark:text-slate-500">Status</div>
              <WithdrawalBadge status={row.status} />
            </div>
          ))}
        </div>
      )}

      {/* Withdraw Funds Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6"
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className="bg-white dark:bg-slate-800 rounded-[20px] shadow-[0px_4px_50px_5px_rgba(0,0,0,0.1)] dark:shadow-[0px_4px_50px_5px_rgba(0,0,0,0.3)] p-[32px] w-full max-w-[500px] md:w-[500px] flex flex-col gap-[20px]">

            <div className="flex items-start justify-between">
              <div>
                <p className="font-['Poppins'] font-medium text-[28px] text-black dark:text-white">Withdraw Funds</p>
                <p className="font-['Poppins'] text-[14px] text-[rgba(0,0,0,0.6)] dark:text-slate-400">Enter amount and choose a payout method</p>
              </div>
              <ModalCloseBtn onClick={() => setShowModal(false)} />
            </div>

            {/* Amount field */}
            <div className="flex flex-col gap-[6px]">
              <p className="font-['Poppins'] font-medium text-[14px] text-black dark:text-white">Amount (₹)</p>
              <input
                type="number" min="500" max={balance} value={amount}
                onChange={(e) => { setAmount(e.target.value); setWError(""); }}
                className="w-full h-[42px] border border-[rgba(0,0,0,0.3)] dark:border-slate-600 rounded-[10px] px-[12px] font-['Poppins'] text-[14px] text-black dark:text-white bg-white dark:bg-slate-700 outline-none focus:border-[#003566] dark:focus:border-blue-500 transition-colors placeholder:text-[rgba(0,0,0,0.4)] dark:placeholder:text-slate-400"
              />
              <p className="font-['Poppins'] text-[12px] text-[rgba(0,0,0,0.5)] dark:text-slate-500">Minimum withdrawal ₹500</p>
              {wError && <p className="font-['Poppins'] text-[12px] text-[#cc3636]">{wError}</p>}
            </div>

            {/* Payout method */}
            <div className="flex flex-col gap-[10px]">
              <p className="font-['Poppins'] font-medium text-[14px] text-black dark:text-white">Payout Method</p>
              {paymentMethodsList.length === 0 ? (
                <p className="font-['Poppins'] text-[14px] text-[rgba(0,0,0,0.6)] dark:text-slate-400">Please add a payment method in Payment Modes to proceed.</p>
              ) : (
                <div className="flex gap-[12px] flex-wrap">
                  {paymentMethodsList.map(m => (
                    <button key={m.id} type="button" onClick={() => setSelMethod(m.id)} disabled={isSubmitting}
                      className={`flex-1 min-w-[200px] flex items-center gap-[10px] p-[14px] rounded-[10px] border-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                        selMethod === m.id ? "bg-[#c9e5ff] dark:bg-slate-700 border-[#003566] dark:border-blue-500" : "bg-white dark:bg-slate-700 border-[rgba(0,0,0,0.15)] dark:border-slate-600 hover:border-[rgba(0,0,0,0.3)] dark:hover:border-slate-500"
                      }`}>
                      <div className={`size-[18px] rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                        selMethod === m.id ? "border-[#003566] dark:border-blue-500" : "border-[rgba(0,0,0,0.3)] dark:border-slate-500"
                      }`}>
                        {selMethod === m.id && <div className="size-[8px] rounded-full bg-[#003566] dark:bg-blue-500" />}
                      </div>
                      <div className="text-left">
                        <p className="font-['Poppins'] font-medium text-[14px] text-black dark:text-white leading-tight">{m.name}</p>
                        <p className="font-['Poppins'] text-[11px] text-[rgba(0,0,0,0.6)] dark:text-slate-400">{m.type === 'upi' ? m.upiId : `${m.bankName} ****${m.accountNumber.slice(-4)}`}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-[12px] justify-end">
              <button type="button" onClick={() => setShowModal(false)} disabled={isSubmitting}
                className="bg-[#e4e4e4] dark:bg-slate-600 h-[42px] px-[24px] rounded-[20px] font-['Poppins'] text-[14px] text-[rgba(0,0,0,0.6)] dark:text-slate-300 hover:bg-[#d4d4d4] dark:hover:bg-slate-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                Cancel
              </button>
              <button type="button" onClick={handleConfirm} disabled={isSubmitting || paymentMethodsList.length === 0 || !selMethod}
                className="bg-[#003566] h-[42px] px-[24px] rounded-[20px] font-['Poppins'] text-[14px] text-white hover:bg-[#002a52] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {isSubmitting ? 'Processing...' : 'Confirm Withdrawal'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Notifications ── */

const NOTIF_SETTINGS = [
  {
    key: "sessionAlerts",
    label: "Session Alerts",
    desc: "Receive notifications for new bookings, cancellations, and upcoming session reminders.",
    defaultOn: true,
  },
  {
    key: "sessionFeedback",
    label: "Session Feedback",
    desc: "Get notified when a student submits feedback or ratings after your session.",
    defaultOn: false,
  },
  {
    key: "earningsWithdraw",
    label: "Earnings & Withdrawals",
    desc: "Receive updates on completed payouts and withdrawal requests.",
    defaultOn: false,
  },
  {
    key: "systemUpdates",
    label: "System & Platform Updates",
    desc: "Stay informed about new features, announcements, and platform maintenance.",
    defaultOn: false,
  },
] as const;

type NotifKey = (typeof NOTIF_SETTINGS)[number]["key"];

function NotifToggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-checked={on}
      role="switch"
      onClick={onClick}
      className={`relative h-[28px] w-[52px] shrink-0 rounded-full transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#003566] ${
        on ? 'bg-[#003566] dark:bg-blue-500' : 'bg-[#d1d5db] dark:bg-slate-600'
      }`}
    >
      <span
        className={`absolute top-[3px] left-[3px] size-[22px] rounded-full bg-white shadow-sm transition-transform duration-200 ${
          on ? 'translate-x-[24px]' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

function NotificationsView({ 
  enabled, 
  onToggle, 
  onSave, 
  isSaving 
}: { 
  enabled: Record<NotifKey, boolean>; 
  onToggle: (key: NotifKey) => void; 
  onSave: () => Promise<void>; 
  isSaving: boolean;
}) {
  return (
    <div className="p-10 bg-white dark:bg-[#0f0f1e] min-h-screen">
      {/* Header */}
      <div className="mb-[32px]">
        <div className="flex items-center gap-[10px] mb-[4px]">
          <svg className="size-[22px]" fill="none" viewBox="0 0 19.3505 21.5167">
            <path
              d={svgPathsPayment.p13baf700}
              stroke="#003566"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
          <p className="font-['Poppins'] font-medium text-[40px] text-black dark:text-white leading-normal">
            Notifications
          </p>
        </div>
        <p className="font-['Poppins'] text-[14px] text-[rgba(0,0,0,0.6)] dark:text-slate-400 ml-[32px]">
          Manage which alerts you want to receive
        </p>
      </div>

      {/* Toggle rows */}
      <div className="flex flex-col gap-[16px] mb-6 bg-white dark:bg-slate-800 p-6 rounded-[20px] shadow-sm dark:shadow-lg">
        {NOTIF_SETTINGS.map((item) => (
          <div key={item.key} className="flex flex-col gap-[4px] pb-6 border-b border-[rgba(0,0,0,0.1)] dark:border-slate-700 last:pb-0 last:border-0">
            <div className="flex items-center justify-between">
              <p className="font-['Poppins'] text-[18px] text-black dark:text-white leading-[20px]">
                {item.label}
              </p>
              <NotifToggle on={enabled[item.key]} onClick={() => onToggle(item.key)} />
            </div>
            <p className="font-['Poppins'] text-[16px] text-[rgba(0,0,0,0.6)] dark:text-slate-400 leading-[20px]">
              {item.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Save button */}
      <button 
        onClick={onSave}
        disabled={isSaving}
        className="bg-[#003566] h-[42px] px-[24px] rounded-[20px] font-['Poppins'] text-[14px] text-white hover:bg-[#002a52] transition-colors disabled:opacity-60 flex items-center gap-2">
        {isSaving ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Saving...
          </>
        ) : (
          "Save Preferences"
        )}
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Delete Account Modal for Security
// ─────────────────────────────────────────────────────────────────────────────

function DeleteAccountModalMentor({ onConfirm, onCancel, isDeleting }: {
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}) {
  const [confirmText, setConfirmText] = useState("");
  const canDelete = confirmText === "DELETE";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={(e) => { if (e.target === e.currentTarget && !isDeleting) onCancel(); }}>
      <div className="bg-white dark:bg-[#22272f] rounded-[20px] shadow-2xl w-full max-w-[440px] p-6 flex flex-col gap-5">
        {/* Icon + title */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-14 h-14 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
            <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24">
              <path d="M3 6H21M8 6V4C8 2.9 8.9 2 10 2H14C15.1 2 16 2.9 16 4V6M19 6V20C19 21.1 18.1 22 17 22H7C5.9 22 5 21.1 5 20V6H19ZM10 11V17M14 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <h3 className="text-[18px] font-bold text-[#1e293b] dark:text-white">Delete Account</h3>
            <p className="text-[12px] text-[#94a3b8] dark:text-slate-400 mt-1 leading-relaxed">
              This will permanently delete your account and all associated data including sessions, earnings, payment info, and all other data. This action cannot be undone.
            </p>
          </div>
        </div>

        {/* Confirmation input */}
        <div className="flex flex-col gap-2">
          <label className="text-[12px] font-bold text-red-600">Type DELETE to confirm</label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="DELETE"
            disabled={isDeleting}
            className="w-full h-[44px] border-2 border-[#e2e8f0] dark:border-[#3a3f47] rounded-[12px] px-4 text-[13px] outline-none focus:border-red-600 transition-all text-[#1e293b] dark:text-white placeholder:text-[#c1c7ce] dark:placeholder:text-slate-600 bg-white dark:bg-[#2b3139] disabled:opacity-60 font-mono tracking-widest"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 h-[44px] rounded-[12px] text-[13px] font-bold border border-[#e2e8f0] dark:border-[#3a3f47] text-[#5a7089] dark:text-slate-400 hover:bg-[#f8f9fc] dark:hover:bg-[#2b3139] transition-colors disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={!canDelete || isDeleting}
            className="flex-1 h-[44px] rounded-[12px] text-[13px] font-bold text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isDeleting ? (
              <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Deleting...</>
            ) : (
              <>Delete Account</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function SecurityView({ onAccountDeleted }: { onAccountDeleted?: () => void }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDeleteAccount() {
    setIsDeleting(true);
    try {
      await auth.deleteOwnAccount();
      toast.success("Account deleted successfully");
      onAccountDeleted?.();
      window.location.href = '/login';
    } catch (err: any) {
      setIsDeleting(false);
      toast.error(err.message || "Failed to delete account");
    }
  }

  return (
    <div className="p-10 bg-white dark:bg-[#0f0f1e] min-h-screen">
      {/* Header */}
      <div className="mb-[32px]">
        <div className="flex items-center gap-[10px] mb-[4px]">
          <IconSecurity />
          <p className="font-['Poppins'] font-medium text-[40px] text-black dark:text-white leading-normal">
            Account Security
          </p>
        </div>
        <p className="font-['Poppins'] text-[14px] text-[rgba(0,0,0,0.6)] dark:text-slate-400 ml-[32px]">
          Manage your account security settings
        </p>
      </div>

      {/* Delete Account Section */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-[20px] shadow-sm dark:shadow-lg border border-[#edf0f4] dark:border-[#3a3f47]">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="font-['Poppins'] font-semibold text-[18px] text-black dark:text-white mb-1">
              Delete Account
            </p>
            <p className="font-['Poppins'] text-[14px] text-[rgba(0,0,0,0.6)] dark:text-slate-400">
              Permanently remove your account and all associated data
            </p>
          </div>
          <button 
            onClick={() => setShowDeleteModal(true)}
            className="text-[14px] font-bold text-red-600 border border-red-600 px-6 py-2 rounded-[12px] hover:bg-red-50 dark:hover:bg-[#2b3139] transition-colors flex items-center gap-2 whitespace-nowrap w-full md:w-auto justify-center"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
              <path d="M3 6H21M8 6V4C8 2.9 8.9 2 10 2H14C15.1 2 16 2.9 16 4V6M19 6V20C19 21.1 18.1 22 17 22H7C5.9 22 5 21.1 5 20V6H19ZM10 11V17M14 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Delete
          </button>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <DeleteAccountModalMentor 
          onConfirm={handleDeleteAccount} 
          onCancel={() => setShowDeleteModal(false)}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}

export function MentorProfileSettings({ onBack }: MentorProfileSettingsProps) {
  const [activeNav, setActiveNav] = useState<ProfileSubNav>("basic");
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Get current user
  const currentUser = getCurrentUser();
  
  // Dark mode
  const isDark = useDarkMode();

  /* ── Form state ── */
  const [fullName,   setFullName]   = useState("");
  const [email,      setEmail]      = useState("");
  const [grade,      setGrade]      = useState("5-10 years");
  const [expertise,  setExpertise]  = useState("");
  const [languages,  setLanguages]  = useState<string[]>([]);
  const [newLang,    setNewLang]    = useState("");
  const [bio,        setBio]        = useState("");
  const [isSaving,   setIsSaving]   = useState(false);
  const [isLoading,  setIsLoading]  = useState(true);
  const [error,      setError]      = useState("");
  const [saved,      setSaved]      = useState(false);

  /* ── Password state ── */
  const [currentPw,  setCurrentPw]  = useState("");
  const [newPw,      setNewPw]      = useState("");
  const [confirmPw,  setConfirmPw]  = useState("");
  const [pwSaved,    setPwSaved]    = useState(false);
  const [isGoogleAuth, setIsGoogleAuth] = useState(false);

  /* ── Documents ── */
  const [docs, setDocs] = useState<{ id: string; name: string; size: string }[]>([]);
  const maxDocs = 3;
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ── Avatar ── */
  const [avatarSrc, setAvatarSrc] = useState(imgEllipse2);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  /* ── Notifications ── */
  const [notifEnabled, setNotifEnabled] = useState<Record<NotifKey, boolean>>(
    () => Object.fromEntries(NOTIF_SETTINGS.map((s) => [s.key, s.defaultOn])) as Record<NotifKey, boolean>
  );
  const [notifSaving, setNotifSaving] = useState(false);

  // Check if user is Google OAuth authenticated (run once on mount)
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const isGoogle = await isGoogleOAuthUser();
        if (mounted) {
          setIsGoogleAuth(isGoogle);
        }
      } catch (err) {
        console.error('[MentorProfileSettings] Error detecting Google OAuth:', err);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []); // Empty dependency - run only once on mount

  // Load mentor profile from database
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        if (!mounted) return;
        setIsLoading(true);

        if (!currentUser) {
          if (mounted) setEmail("");
          return;
        }

        const supabase = getSupabaseClient();
        const { data: prof } = await supabase
          .from('profiles')
          .select('name, bio, avatar_url, mentor_grade, expertise, languages, mentor_documents, notification_preferences')
          .eq('id', currentUser.id)
          .maybeSingle();

        if (!mounted) return;

        setFullName(prof?.name || currentUser.name || "");
        setEmail(currentUser.email || "");
        setBio(prof?.bio || "");
        setGrade(prof?.mentor_grade || "5-10 years");
        setExpertise(prof?.expertise || "");
        setLanguages(Array.isArray(prof?.languages) ? prof.languages : []);
        setDocs(Array.isArray(prof?.mentor_documents) ? prof.mentor_documents : []);
        if (prof?.avatar_url) setAvatarSrc(prof.avatar_url);

        // Load saved notification preferences
        if (prof?.notification_preferences && typeof prof.notification_preferences === 'object') {
          setNotifEnabled(prev => ({ ...prev, ...prof.notification_preferences }));
        }
      } catch {
        // Silently handle profile load errors
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, [currentUser?.id]);

  // Save basic information
  async function handleSaveBasicInfo() {
    setError("");
    if (!fullName.trim()) {
      setError("Full name is required");
      return;
    }

    setIsSaving(true);
    try {
      const supabase = getSupabaseClient();
      if (!currentUser) {
        toast.error("Not authenticated");
        return;
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          name: fullName.trim(),
          bio: bio.trim(),
          mentor_grade: grade,
          expertise: expertise.trim(),
          languages,
          mentor_documents: docs,
          avatar_url: avatarSrc,
        })
        .eq('id', currentUser.id);

      if (updateError) {
        toast.error('Failed to save profile: ' + updateError.message);
        return;
      }

      toast.success('Profile saved!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  }

  // Save notification preferences
  async function handleSaveNotifications() {
    try {
      setNotifSaving(true);
      const supabase = getSupabaseClient();
      if (!currentUser) {
        toast.error("Not authenticated");
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .upsert(
          { id: currentUser.id, notification_preferences: notifEnabled },
          { onConflict: 'id' },
        );

      if (error) {
        toast.error('Failed to save preferences: ' + error.message);
        return;
      }

      toast.success('Notification preferences saved!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save preferences');
    } finally {
      setNotifSaving(false);
    }
  }

  function handleDeleteLanguage(lang: string) {
    setLanguages((prev) => prev.filter((l) => l !== lang));
  }

  function handleAddLanguage() {
    const trimmed = newLang.trim();
    if (trimmed && !languages.includes(trimmed)) {
      setLanguages((prev) => [...prev, trimmed]);
    }
    setNewLang("");
  }

  function handleDeleteDoc(id: string) {
    setDocs((prev) => prev.filter((d) => d.id !== id));
  }

  function handleAddDoc(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || docs.length >= maxDocs) return;
    const sizeMB = Math.round(file.size / 1024 / 1024) || 1;
    setDocs((prev) => [
      ...prev,
      { id: `d${Date.now()}`, name: file.name, size: `${sizeMB}MB` },
    ]);
    e.target.value = "";
  }

  function handleSavePassword() {
    setPwSaved(true);
    setTimeout(() => setPwSaved(false), 2000);
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;
    
    try {
      const url = URL.createObjectURL(file);
      setAvatarSrc(url);
      
      // Save to database
      const supabase = getSupabaseClient();
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: url, updated_at: new Date().toISOString() })
        .eq('id', currentUser.id);
      
      if (error) {
        console.error('Failed to save avatar:', error);
        toast.error('Failed to save avatar');
      } else {
        toast.success('Avatar updated successfully');
      }
    } catch (err) {
      console.error('Avatar upload error:', err);
      toast.error('Failed to upload avatar');
    }
    e.target.value = "";
  }

  function HamburgerIcon({ open }: { open: boolean }) {
    return (
      <svg className="size-[24px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        {open ? (
          <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <>
            <path d="M3 7h18" strokeWidth="2" strokeLinecap="round" />
            <path d="M3 12h18" strokeWidth="2" strokeLinecap="round" />
            <path d="M3 17h18" strokeWidth="2" strokeLinecap="round" />
          </>
        )}
      </svg>
    );
  }

  const navItems: { key: ProfileSubNav; label: string; icon: React.ReactNode }[] = [
    { key: "basic",           label: "Basic Information",  icon: <IconProfile active={activeNav === "basic"} /> },
    { key: "session-history", label: "Session History",    icon: <IconHistory /> },
    { key: "performance",     label: "Performance Stats",  icon: <IconStats /> },
    { key: "earning",         label: "Earning Stats",      icon: <IconEarning /> },
    { key: "payment",         label: "Payment Modes",      icon: <IconCard /> },
    { key: "withdrawal",      label: "Withdrawal",         icon: <IconWithdrawal /> },
    { key: "notifications",   label: "Notifications",      icon: <IconBell /> },
    { key: "security",        label: "Account Security",   icon: <IconSecurity /> },
  ];

  return (
    <div className="flex flex-col md:flex-row h-full w-full overflow-hidden">

      {/* ── Mobile Hamburger Menu ── */}
      <div 
        className="md:hidden fixed top-0 left-0 right-0 z-50 border-b"
        style={{
          backgroundColor: '#1a1a1a',
          borderColor: '#333333'
        }}
      >
        <div className="flex items-center justify-between px-[16px] py-[16px]">
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-[#9ca3af] hover:text-white transition-colors"
          >
            <HamburgerIcon open={menuOpen} />
          </button>
          <div className="flex items-center gap-[8px]">
            <img
              src={avatarSrc}
              alt={fullName || "Mentor"}
              className="size-[32px] rounded-full object-cover"
            />
            <span className="font-['Poppins'] text-[13px] text-white truncate max-w-[120px]">{fullName || "Mentor"}</span>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="text-[12px] text-[#9ca3af] hover:text-white transition-colors"
          >
            Exit
          </button>
        </div>
      </div>

      {/* ── Mobile Menu Drawer ── */}
      {menuOpen && (
        <>
          {/* Backdrop */}
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 40,
              backgroundColor: 'rgba(0,0,0,0.4)',
              top: '68px'
            }}
            onClick={() => setMenuOpen(false)}
          />
          {/* Drawer menu */}
          <div 
            style={{
              position: 'fixed',
              top: '68px',
              left: 0,
              right: 0,
              zIndex: 40,
              maxHeight: 'calc(100vh - 68px)',
              overflowY: 'auto',
              backgroundColor: isDark ? '#0f0f1e' : '#ffffff',
              borderBottom: `1px solid ${isDark ? '#333333' : '#edf0f4'}`,
              display: 'block'
            }}
          >
            {/* Dashboard back button */}
            <div 
              style={{
                padding: '16px',
                backgroundColor: isDark ? '#1a1a1a' : '#f8fafc',
                borderBottom: `1px solid ${isDark ? '#333333' : '#edf0f4'}`
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onBack();
                }}
                style={{
                  fontFamily: 'Poppins',
                  fontSize: '14px',
                  color: isDark ? '#9ca3af' : 'rgba(0,0,0,0.6)',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  width: '100%',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = isDark ? 'white' : 'black'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = isDark ? '#9ca3af' : 'rgba(0,0,0,0.6)'; }}
              >
                {"< Dashboard"}
              </button>
            </div>
            {/* Nav items */}
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {navItems.map((item) => (
                <button
                  key={item.key}
                  style={{
                    background: activeNav === item.key 
                      ? 'linear-gradient(to right, #003566, #0967bd)' 
                      : isDark ? '#1a1f2e' : '#ffffff',
                    color: activeNav === item.key ? 'white' : isDark ? '#cbd5e1' : 'rgba(0,0,0,0.6)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    textAlign: 'left',
                    transition: 'all 0.2s',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'Poppins',
                    fontSize: '14px',
                    fontWeight: 500,
                    width: '100%'
                  }}
                  onClick={() => {
                    setActiveNav(item.key);
                    setMenuOpen(false);
                  }}
                  onMouseEnter={(e) => {
                    if (activeNav !== item.key) {
                      e.currentTarget.style.backgroundColor = isDark ? '#252d36' : '#f0f7ff';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeNav !== item.key) {
                      e.currentTarget.style.backgroundColor = isDark ? '#1a1f2e' : '#ffffff';
                    }
                  }}
                >
                  <span style={{ flexShrink: 0 }}>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </>
      )}

      {/* ── Left profile sub-nav sidebar (desktop only) ── */}
      <div className="hidden md:flex md:w-[278px] md:shrink-0 bg-white dark:bg-[#1a1f2e] shadow-[0px_4px_18px_-1px_rgba(0,0,0,0.1)] dark:shadow-[0px_4px_18px_-1px_rgba(0,0,0,0.3)] flex-col overflow-y-auto">
        {/* Back + Profile title */}
        <div className="px-[32px] pt-[40px] pb-[20px]">
          <button
            type="button"
            onClick={onBack}
            style={{
              color: isDark ? '#94a3b8' : 'rgba(0,0,0,0.6)'
            }}
            className="font-['Poppins'] text-[14px] hover:opacity-80 transition-opacity cursor-pointer"
            onMouseEnter={(e) => { e.currentTarget.style.color = isDark ? 'white' : 'black'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = isDark ? '#94a3b8' : 'rgba(0,0,0,0.6)'; }}
          >
            {"< Dashboard"}
          </button>
          <p className="font-['Poppins'] font-medium text-[40px] text-black dark:text-white leading-tight mt-1">Profile</p>
        </div>

        {/* Nav items */}
        <nav className="flex flex-col gap-[6px] px-[16px] pb-8">
          {navItems.map((item) => (
            <SubNavItem
              key={item.key}
              icon={item.icon}
              label={item.label}
              active={activeNav === item.key}
              onClick={() => setActiveNav(item.key)}
            />
          ))}
        </nav>
      </div>

      {/* ── Main scrollable content ── */}
      <div className="flex-1 overflow-y-auto bg-[#f8fafc] dark:bg-[#1a1f2e] md:mt-0 mt-[68px]">
        {/* Desktop top bar */}
        <div className="hidden md:block bg-white dark:bg-[#22272f] border-b border-[rgba(0,0,0,0.06)] dark:border-[#3a3f47] px-10 py-[22px]">
          <div className="flex items-center justify-end gap-[10px]">
            <img
              src={avatarSrc}
              alt={fullName || "Mentor"}
              className="size-[38px] rounded-full object-cover"
            />
            <span className="font-['Poppins'] text-[16px] text-black dark:text-white">{fullName || "Mentor"}</span>
          </div>
        </div>

        {/* Page content */}
        {activeNav === "basic" ? (
          <div className="p-4 md:p-10 bg-[#f8fafc] dark:bg-[#1a1f2e] min-h-full">
            {/* Page header */}
            <div className="mb-[30px] md:mb-[40px]">
              <p className="font-['Poppins'] font-medium text-[28px] md:text-[40px] text-black dark:text-white leading-normal">Basic Information</p>
              <p className="font-['Poppins'] text-[12px] md:text-[14px] text-[rgba(0,0,0,0.6)] dark:text-slate-400 leading-normal">Personal Details</p>
            </div>

            {/* Two-column layout */}
            <div className="flex flex-col md:flex-row gap-[24px] items-start">

              {/* ── LEFT COLUMN ── */}
              <div className="flex flex-col gap-[24px] w-full md:w-[380px] md:shrink-0">

                {/* Avatar panel */}
                <div className="bg-[rgba(233,245,255,0.5)] dark:bg-[#22272f] rounded-[16px] md:rounded-[20px] p-[20px] md:p-[31px] flex flex-col items-center gap-[20px] md:gap-[24px]">
                  {/* Avatar circle */}
                  <div className="size-[120px] md:size-[176px] rounded-full overflow-hidden relative bg-[#cacaca] shrink-0">
                    <img
                      src={avatarSrc}
                      alt="Profile"
                      className="absolute inset-0 size-full object-cover"
                    />
                  </div>
                  {/* Buttons */}
                  <div className="flex flex-col gap-[12px] md:gap-[16px] w-full">
                    <input
                      ref={avatarInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                    <button
                      type="button"
                      onClick={() => avatarInputRef.current?.click()}
                      style={{
                        backgroundColor: '#003566',
                        color: 'white'
                      }}
                      className="h-[44px] md:h-[42px] rounded-[20px] w-full flex items-center justify-center gap-[8px] md:gap-[10px] hover:opacity-80 transition-opacity font-['Poppins'] text-[12px]"
                    >
                      <IconUserFocus />
                      <span className="text-white">Change Profile Pic</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAvatarSrc(imgEllipse2)}
                      style={{
                        backgroundColor: isDark ? '#003566' : '#c9e5ff',
                        color: isDark ? 'white' : '#003566'
                      }}
                      className="h-[44px] md:h-[42px] rounded-[20px] w-full flex items-center justify-center gap-[8px] md:gap-[10px] hover:opacity-80 transition-opacity font-['Poppins'] text-[12px]"
                    >
                      <IconDeleteSmall />
                      <span>Delete Avatar</span>
                    </button>
                  </div>
                </div>

                {/* Documents panel */}
                <div className="bg-[rgba(233,245,255,0.5)] dark:bg-[#22272f] rounded-[16px] md:rounded-[20px] px-[16px] md:px-[27px] py-[16px] md:py-[17px] flex flex-col gap-[16px] md:gap-[24px]">
                  {/* Header */}
                  <p className="font-['Poppins'] font-medium text-[18px] md:text-[20px] text-black dark:text-white leading-normal">
                    Documents Uploaded{" "}
                    <span className="font-['Poppins'] font-normal text-[13px] md:text-[14px]">
                      ({docs.length}/{maxDocs})
                    </span>
                  </p>

                  {/* Doc list */}
                  <div className="flex flex-col gap-0">
                    {docs.map((doc) => (
                      <div key={doc.id} className="h-[73px] flex items-center">
                        <div className="bg-white dark:bg-[#2b3139] h-[70px] rounded-[24px] w-full border border-[#dbdbdb] dark:border-[#3a3f47] flex items-center px-[20px] justify-between">
                          <div className="flex items-center gap-[10px]">
                            <IconPdf />
                            <div className="flex flex-col gap-[6px]">
                              <p className="font-['Poppins'] font-semibold text-[14px] text-black dark:text-white leading-normal">{doc.name}</p>
                              <p className="font-['Poppins'] font-medium text-[12px] text-[rgba(0,0,0,0.6)] dark:text-slate-400 leading-normal">{doc.size}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteDoc(doc.id)}
                            className="hover:opacity-70 transition-opacity cursor-pointer"
                          >
                            <IconDelete />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Doc button */}
                  {docs.length < maxDocs && (
                    <>
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        onChange={handleAddDoc}
                      />
                      <div className="flex items-center">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          style={{
                            backgroundColor: '#003566',
                            color: 'white'
                          }}
                          className="h-[42px] rounded-[20px] px-[24px] py-[10px] flex items-center gap-[6px] hover:opacity-80 transition-opacity"
                        >
                          <span className="font-['Poppins'] text-[12px] text-white">Add Doc</span>
                          <IconPlus white />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* ── RIGHT COLUMN ── */}
              <div className="w-full flex-1 flex flex-col gap-[16px] md:gap-[24px]">

                {/* Profile Information panel */}
                <div className="bg-[rgba(233,245,255,0.5)] dark:bg-[#22272f] rounded-[16px] md:rounded-[20px] px-[16px] md:px-[31px] py-[16px] md:py-[17px]">
                  <p className="font-['Poppins'] font-medium text-[18px] md:text-[20px] text-black dark:text-white leading-normal mb-[24px] md:mb-[46px]">Profile Information</p>

                  <div className="flex flex-col gap-[16px] md:gap-[24px]">
                    {/* Row 1: Full Name + Grade */}
                    <div className="flex flex-col md:flex-row gap-[16px] md:gap-[33px] items-start w-full">
                      <div className="w-full md:w-[249px] md:shrink-0">
                        <InputField
                          label="Full Name"
                          icon={<IconEdit />}
                          value={fullName}
                          onChange={setFullName}
                        />
                      </div>
                      <div className="flex-1">
                        <GradeDropdown value={grade} onChange={setGrade} />
                      </div>
                    </div>

                    {/* Row 2: Email + Expertise */}
                    <div className="flex flex-col md:flex-row gap-[16px] md:gap-[33px] items-start w-full">
                      <div className="w-full md:flex-1">
                        <InputField
                          label="Email"
                          icon={<IconEmail />}
                          value={email}
                          onChange={setEmail}
                        />
                      </div>
                      <div className="flex-1">
                        <InputField
                          label="Area of Expertise (Subject)"
                          icon={<IconBrain />}
                          value={expertise}
                          onChange={setExpertise}
                        />
                      </div>
                    </div>

                    {/* Row 3: Languages */}
                    <div className="flex flex-col gap-[10px]">
                      <p className="font-['Poppins'] text-[16px] text-black dark:text-white leading-normal">Known Languages</p>
                      <div className="flex flex-wrap gap-[10px] items-start">
                        {languages.map((lang) => (
                          <div
                            key={lang}
                            className="bg-white dark:bg-[#2b3139] h-[39px] px-[10px] rounded-[10px] shadow-[0px_4px_11.4px_0px_rgba(0,0,0,0.1)] dark:shadow-none flex items-center gap-[6px]"
                          >
                            <span className="font-['Poppins'] font-medium text-[14px] text-black dark:text-white">{lang}</span>
                            <button
                              type="button"
                              onClick={() => handleDeleteLanguage(lang)}
                              className="text-[rgba(0,0,0,0.4)] hover:text-[rgba(0,0,0,0.7)] dark:text-slate-500 dark:hover:text-slate-400 text-[16px] leading-none transition-colors cursor-pointer"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                        {/* Add language input + button */}
                        <div className="flex items-center gap-[6px]">
                          <input
                            type="text"
                            value={newLang}
                            onChange={(e) => setNewLang(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") handleAddLanguage(); }}
                            placeholder="Add language"
                            className="h-[39px] px-[10px] rounded-[10px] border border-[rgba(0,0,0,0.2)] dark:bg-[#2b3139] dark:border-[#3a3f47] dark:text-white dark:placeholder:text-slate-500 font-['Poppins'] text-[14px] text-black outline-none w-[120px] placeholder:text-[rgba(0,0,0,0.3)]"
                          />
                          <button
                            type="button"
                            onClick={handleAddLanguage}
                            style={{
                              backgroundColor: '#003566',
                              color: 'white',
                              width: '43px'
                            }}
                            className="h-[39px] rounded-[20px] flex items-center justify-center hover:opacity-80 transition-opacity"
                          >
                            <IconPlus white />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Row 4: Bio */}
                    <div className="flex flex-col gap-[10px] w-full">
                      <p className="font-['Poppins'] text-[16px] text-black dark:text-white leading-normal">Bio</p>
                      <div className="h-[112px] rounded-[10px] border border-[rgba(0,0,0,0.4)] dark:border-[#3a3f47] dark:bg-[#2b3139] flex gap-[10px] items-start p-[10px]">
                        <IconEditPen />
                        <textarea
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          disabled={isSaving}
                          className="flex-1 h-full bg-transparent font-['Poppins'] text-[14px] text-[rgba(0,0,0,0.8)] dark:text-white outline-none resize-none leading-normal disabled:opacity-60"
                        />
                      </div>
                    </div>

                    {/* Error message */}
                    {error && (
                      <div className="bg-[#fde8e8] dark:bg-[#cc3636]/20 border border-[#cc3636] dark:border-[#cc3636]/40 rounded-[10px] px-4 py-3 flex items-center gap-2">
                        <svg className="w-4 h-4 text-[#cc3636] dark:text-[#ff8080]" fill="none" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor" />
                        </svg>
                        <p className="font-['Poppins'] text-[12px] text-[#cc3636] dark:text-[#ff8080]">{error}</p>
                      </div>
                    )}

                    {/* Save button */}
                    <div className="flex justify-end pt-2 gap-2">
                      {saved && (
                        <span className="font-['Poppins'] text-[12px] text-[#16a34a] flex items-center gap-1">
                          ✓ Saved
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={handleSaveBasicInfo}
                        disabled={isSaving}
                        className="bg-[#003566] h-[42px] rounded-[20px] px-[32px] font-['Poppins'] text-[12px] text-white hover:bg-[#002a52] transition-colors disabled:opacity-60 flex items-center gap-2"
                      >
                        {isSaving ? (
                          <>
                            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Change Password panel - Hidden for Google OAuth users */}
                {isGoogleAuth ?  (
                  <div className="bg-[rgba(233,245,255,0.5)] dark:bg-[#22272f] rounded-[16px] md:rounded-[20px] px-[16px] md:px-[27px] py-[16px] md:py-[17px] flex flex-col gap-[16px] items-start">
                    <p className="font-['Poppins'] font-medium text-[18px] md:text-[20px] text-black dark:text-white leading-normal w-full">Password Management</p>
                    <p className="font-['Poppins'] text-[13px] md:text-[14px] text-[rgba(0,0,0,0.6)] dark:text-slate-400 leading-relaxed">
                      Your account is secured with Google Sign-In. Password changes are managed through your Google account settings.
                    </p>
                  </div>
                ) : (
                  <div className="bg-[rgba(233,245,255,0.5)] dark:bg-[#22272f] rounded-[16px] md:rounded-[20px] px-[16px] md:px-[27px] py-[16px] md:py-[17px] flex flex-col gap-[16px] md:gap-[24px]">
                    <p className="font-['Poppins'] font-medium text-[18px] md:text-[20px] text-black dark:text-white leading-normal w-full">Change Password</p>

                    <div className="flex flex-col gap-[12px] md:gap-[16px] w-full">
                      <PasswordField label="Current Password" value={currentPw} />
                      <PasswordField label="New Password"     value={newPw}     />
                      <PasswordField label="Confirm Password" value={confirmPw} />
                    </div>

                    <div className="flex flex-col-reverse md:flex-row gap-[12px] md:gap-[16px] items-stretch md:items-center">
                      <button
                        type="button"
                        onClick={handleSavePassword}
                        className="bg-[#003566] h-[44px] md:h-[42px] rounded-[20px] px-[24px] py-[10px] font-['Poppins'] text-[12px] text-white hover:bg-[#002a52] transition-colors w-full md:w-auto whitespace-nowrap"
                      >
                        {pwSaved ? "Updated ✓" : "Update"}
                      </button>
                      <button
                        type="button"
                        onClick={() => { setNewPw(""); setConfirmPw(""); }}
                        className="bg-[#c9e5ff] dark:bg-[#003566] h-[44px] md:h-[42px] rounded-[20px] px-[24px] py-[10px] font-['Poppins'] text-[12px] text-[#003566] dark:text-white hover:bg-[#b6d9ff] dark:hover:bg-[#0967bd] transition-colors w-full md:w-auto whitespace-nowrap"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : activeNav === "session-history" ? (
          <SessionHistoryView />
        ) : activeNav === "performance" ? (
          <PerformanceStatsView />
        ) : activeNav === "earning" ? (
          <EarningStatsView />
        ) : activeNav === "payment" ? (
          <PaymentModesView />
        ) : activeNav === "withdrawal" ? (
          <WithdrawalView />
        ) : activeNav === "notifications" ? (
          <NotificationsView 
            enabled={notifEnabled}
            onToggle={(key) => setNotifEnabled((prev) => ({ ...prev, [key]: !prev[key] }))}
            onSave={handleSaveNotifications}
            isSaving={notifSaving}
          />
        ) : activeNav === "security" ? (
          <SecurityView onAccountDeleted={() => window.location.href = '/login'} />
        ) : (
          <div className="p-10">
            <div className="mb-[40px]">
              <p className="font-['Poppins'] font-medium text-[40px] text-black leading-normal">
                {navItems.find((n) => n.key === activeNav)?.label}
              </p>
            </div>
            <ComingSoonPanel label={navItems.find((n) => n.key === activeNav)?.label ?? ""} />
          </div>
        )}
      </div>
    </div>
  );
}