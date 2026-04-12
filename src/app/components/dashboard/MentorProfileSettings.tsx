import React, { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { getCurrentUser, getSupabaseClient } from '@/app/lib/api';
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
  | "notifications";

/* ── SVG icons ── */

function IconProfile({ active }: { active?: boolean }) {
  return (
    <svg className="shrink-0 size-[24px]" fill="none" viewBox="0 0 18 18">
      <path d={svgPaths.p36395980} stroke={active ? "#003566" : "rgba(0,0,0,0.6)"} strokeLinejoin="round" strokeWidth="2" />
      <path d={svgPaths.p372d2a00} stroke={active ? "#003566" : "rgba(0,0,0,0.6)"} strokeWidth="2" />
    </svg>
  );
}

function IconHistory() {
  return (
    <svg className="shrink-0 size-[24px]" fill="none" viewBox="0 0 24 24">
      <path d={svgPaths.p111e9c0} fill="rgba(0,0,0,0.6)" />
    </svg>
  );
}

function IconStats() {
  return (
    <svg className="shrink-0 size-[20px]" fill="none" viewBox="0 0 20.5714 12">
      <path d="M13.8571 1H19.5714V6.71429" stroke="rgba(0,0,0,0.6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <path d={svgPaths.p25d06e00} stroke="rgba(0,0,0,0.6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

function IconEarning() {
  return (
    <svg className="shrink-0 size-[19px]" fill="none" viewBox="0 0 19 18.2074">
      <path d={svgPaths.p36ee6380} fill="rgba(0,0,0,0.6)" />
    </svg>
  );
}

function IconCard() {
  return (
    <svg className="shrink-0 size-[20px]" fill="none" viewBox="0 0 20 20">
      <path d={svgPaths.p2068a280} stroke="rgba(0,0,0,0.6)" strokeLinecap="round" strokeLinejoin="round" />
      <path d={svgPaths.p18f7d00} stroke="rgba(0,0,0,0.6)" strokeLinejoin="round" strokeWidth="1.875" />
    </svg>
  );
}

function IconWithdrawal() {
  return (
    <svg className="shrink-0 size-[24px]" fill="none" viewBox="0 0 21.5 19.5">
      <path d={svgPaths.p392a47c0} stroke="rgba(0,0,0,0.6)" strokeLinecap="round" strokeWidth="1.5" />
      <path d={svgPaths.peb17a80} stroke="rgba(0,0,0,0.6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      <path d={svgPaths.p2cd66780} stroke="rgba(0,0,0,0.6)" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  );
}

function IconBell() {
  return (
    <svg className="shrink-0 size-[24px]" fill="none" viewBox="0 0 24 24">
      <path d={svgPaths.p13baf700} stroke="rgba(0,0,0,0.6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.017" />
    </svg>
  );
}

function IconLock() {
  return (
    <svg className="shrink-0 size-[24px]" fill="none" viewBox="0 0 24 24">
      <path clipRule="evenodd" d={svgPaths.p33a04860} fill="black" fillRule="evenodd" />
    </svg>
  );
}

function IconEye({ show, onClick }: { show: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="shrink-0 size-[24px] overflow-hidden relative cursor-pointer">
      <svg className="absolute block size-full" fill="none" viewBox="0 0 21.0844 20">
        <path d={svgPaths.p4dca300} stroke="rgba(0,0,0,0.7)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </svg>
      {!show && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[18px] h-[1.5px] bg-black/70 rotate-45" />
        </div>
      )}
    </button>
  );
}

function IconEdit() {
  return (
    <svg className="shrink-0 size-[24px]" fill="none" viewBox="0 0 20.5 21">
      <path d={svgPaths.p2e0ed500} stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <path d={svgPaths.p2780a180} stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

function IconEditPen() {
  return (
    <svg className="shrink-0 size-[24px]" fill="none" viewBox="0 0 19 19">
      <path d={svgPaths.p21391480} stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <path d={svgPaths.p19aa5300} stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

function IconEmail() {
  return (
    <svg className="shrink-0 size-[24px]" fill="none" viewBox="0 0 24 24">
      <path d={svgPaths.p629a600} fill="black" />
    </svg>
  );
}

function IconBrain() {
  return (
    <svg className="shrink-0 size-[24px]" fill="none" viewBox="0 0 24 24">
      <path d={svgPaths.p53a5500} fill="black" />
    </svg>
  );
}

function IconGrad() {
  return (
    <svg className="shrink-0 size-[18px]" fill="none" viewBox="0 0 19.4118 15.4118">
      <path d={svgPaths.peeffb80} stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.412" />
      <path d={svgPaths.p26571700} stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.412" />
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
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex gap-[6px] h-[42px] items-center px-[16px] rounded-[10px] w-full text-left transition-colors ${
        active ? "bg-[#c9e5ff]" : "hover:bg-[#f0f7ff]"
      }`}
    >
      {icon}
      <span
        className={`font-['Poppins'] text-[14px] leading-normal ${
          active ? "text-[#003566]" : "text-[rgba(0,0,0,0.6)]"
        }`}
      >
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
      <p className="font-['Poppins'] text-[16px] text-black leading-normal">{label}</p>
      <div className="relative h-[39px] rounded-[10px] w-full border border-[rgba(0,0,0,0.4)] flex items-center gap-[10px] px-[10px]">
        {icon}
        <input
          type="text"
          readOnly={readOnly}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange?.(e.target.value)}
          className="flex-1 bg-transparent font-['Poppins'] text-[14px] text-[rgba(0,0,0,0.8)] outline-none placeholder:text-[rgba(0,0,0,0.4)]"
        />
      </div>
    </div>
  );
}

/* ── Password field ── */

function PasswordField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col gap-[10px] items-start w-full">
      <p className="font-['Poppins'] text-[16px] text-black leading-normal">{label}</p>
      <div className="relative rounded-[10px] w-full border border-[rgba(0,0,0,0.4)] flex items-center justify-between px-[10px] py-[8px]">
        <div className="flex gap-[5px] items-center">
          <IconLock />
          <span className="font-['Poppins'] text-[14px] text-[rgba(0,0,0,0.8)]">
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
  const [open, setOpen] = useState(false);
  const grades = [
    "0-2 years",
    "2-5 years",
    "5-10 years",
    "10-15 years",
    "15+ years",
  ];
  return (
    <div className="flex flex-col gap-[10px] items-start w-full relative">
      <p className="font-['Poppins'] text-[16px] text-black leading-normal">Grade / Level</p>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="h-[39px] w-full rounded-[10px] border border-[rgba(0,0,0,0.7)] flex items-center justify-between px-[10px] hover:border-[#003566] transition-colors"
      >
        <div className="flex items-center gap-[10px]">
          <IconGrad />
          <span className="font-['Poppins'] font-medium text-[14px] text-black">{value}</span>
        </div>
        <svg className="shrink-0 size-[24px]" fill="none" viewBox="0 0 24 24">
          <path d="M7 10L12 15L17 10" stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </svg>
      </button>
      {open && (
        <div className="absolute top-[80px] left-0 w-full bg-white rounded-[10px] shadow-[0px_4px_20px_rgba(0,0,0,0.12)] z-10 py-1">
          {grades.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => { onChange(g); setOpen(false); }}
              className={`w-full px-4 py-2 text-left font-['Poppins'] text-[14px] hover:bg-[#f0f7ff] transition-colors ${g === value ? "text-[#003566] font-medium" : "text-black"}`}
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
        <div className="size-[64px] rounded-full bg-[#e9f5ff] flex items-center justify-center">
          <svg className="size-[32px]" fill="none" viewBox="0 0 24 24">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#003566" strokeWidth="2" />
            <path d="M12 8V12M12 16H12.01" stroke="#003566" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <p className="font-['Poppins'] font-medium text-[20px] text-[#003566]">{label}</p>
        <p className="font-['Poppins'] text-[14px] text-[rgba(0,0,0,0.5)]">This section is coming soon.</p>
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
    Completed: "bg-[#d8f5e8] text-[#1a7a45]",
    Cancelled:  "bg-[#fde8e8] text-[#cc3636]",
    Upcoming:   "bg-[#e9f5ff] text-[#003566]",
  };
  return (
    <span className={`inline-flex items-center px-[10px] py-[4px] rounded-[20px] font-['Poppins'] text-[12px] ${styles[status]}`}>
      {status}
    </span>
  );
}

function SessionHistoryView() {
  const [filter, setFilter] = useState<FilterTab>("All");
  const [search, setSearch] = useState("");

  const filtered = SESSION_DATA.filter((s) => {
    const matchFilter = filter === "All" || s.status === filter;
    const matchSearch =
      search.trim() === "" ||
      s.student.toLowerCase().includes(search.toLowerCase()) ||
      s.subject.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const totalCompleted = SESSION_DATA.filter((s) => s.status === "Completed").length;
  const totalCancelled = SESSION_DATA.filter((s) => s.status === "Cancelled").length;
  const totalHours = SESSION_DATA.filter((s) => s.status === "Completed")
    .reduce((acc, s) => acc + parseInt(s.duration), 0);

  const tabs: FilterTab[] = ["All", "Completed", "Cancelled", "Upcoming"];

  return (
    <div className="p-10">
      {/* Page header */}
      <div className="mb-[32px]">
        <div className="flex items-center gap-[10px] mb-[4px]">
          <svg className="size-[28px]" fill="none" viewBox="0 0 24 24">
            <path d={svgPathsHistory.p111e9c0} fill="#003566" />
          </svg>
          <p className="font-['Poppins'] font-medium text-[40px] text-black leading-normal">Session History</p>
        </div>
        <p className="font-['Poppins'] text-[14px] text-[rgba(0,0,0,0.6)] leading-normal ml-[38px]">Your session history</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-[16px] mb-[28px]">
        {[
          { label: "Total Sessions", value: SESSION_DATA.length, color: "#003566", bg: "#e9f5ff" },
          { label: "Completed",      value: totalCompleted,       color: "#1a7a45", bg: "#d8f5e8" },
          { label: "Cancelled",      value: totalCancelled,       color: "#cc3636", bg: "#fde8e8" },
          { label: "Total Hours",    value: `${totalHours}h`,    color: "#F77F00", bg: "#fff4d8" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-[20px] px-[24px] py-[20px] flex flex-col gap-[4px] shadow-[0px_2px_12px_rgba(0,0,0,0.06)]"
          >
            <p className="font-['Poppins'] font-medium text-[28px] leading-normal" style={{ color: stat.color }}>
              {stat.value}
            </p>
            <p className="font-['Poppins'] text-[13px] text-[rgba(0,0,0,0.5)] leading-normal">{stat.label}</p>
            <div className="h-[3px] rounded-full mt-[8px]" style={{ backgroundColor: stat.color, opacity: 0.25 }} />
          </div>
        ))}
      </div>

      {/* Filter + Search bar */}
      <div className="flex items-center justify-between mb-[20px] gap-[16px]">
        {/* Filter tabs */}
        <div className="flex items-center bg-white rounded-[20px] p-[4px] shadow-[0px_2px_8px_rgba(0,0,0,0.06)]">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`px-[16px] py-[8px] rounded-[16px] font-['Poppins'] text-[13px] transition-colors ${
                filter === tab
                  ? "bg-[#003566] text-white"
                  : "text-[rgba(0,0,0,0.5)] hover:text-black"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <svg
            className="absolute left-[12px] top-1/2 -translate-y-1/2 size-[16px] text-[rgba(0,0,0,0.4)]"
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
            className="h-[40px] pl-[36px] pr-[16px] rounded-[20px] border border-[rgba(0,0,0,0.12)] bg-white font-['Poppins'] text-[13px] text-black outline-none w-[260px] placeholder:text-[rgba(0,0,0,0.35)] focus:border-[#003566] transition-colors"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[20px] overflow-hidden shadow-[0px_2px_12px_rgba(0,0,0,0.06)]">
        {/* Table header */}
        <div className="grid grid-cols-[2fr_1.2fr_1.4fr_0.8fr_1fr_1fr] gap-[0] bg-[#003566] px-[24px] py-[14px]">
          {["Student", "Subject", "Date & Time", "Duration", "Status", "Rating"].map((col) => (
            <p key={col} className="font-['Poppins'] font-medium text-[13px] text-white/90 leading-normal">
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
              className={`grid grid-cols-[2fr_1.2fr_1.4fr_0.8fr_1fr_1fr] gap-[0] px-[24px] py-[16px] items-center border-b border-[rgba(0,0,0,0.05)] last:border-0 transition-colors hover:bg-[rgba(233,245,255,0.4)] ${
                idx % 2 === 0 ? "bg-white" : "bg-[rgba(233,245,255,0.15)]"
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
                <span className="font-['Poppins'] text-[14px] text-black leading-normal">{session.student}</span>
              </div>

              {/* Subject */}
              <span className="font-['Poppins'] text-[13px] text-[rgba(0,0,0,0.7)] leading-normal">{session.subject}</span>

              {/* Date & Time */}
              <div className="flex flex-col gap-[2px]">
                <span className="font-['Poppins'] text-[13px] text-black leading-normal">{session.date}</span>
                <span className="font-['Poppins'] text-[12px] text-[rgba(0,0,0,0.45)] leading-normal">{session.time}</span>
              </div>

              {/* Duration */}
              <span className="font-['Poppins'] text-[13px] text-[rgba(0,0,0,0.7)] leading-normal">{session.duration}</span>

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
        Showing {filtered.length} of {SESSION_DATA.length} sessions
      </p>
    </div>
  );
}

/* ── Performance Stats ── */

const WEEKLY_DATA = [
  { day: "MON", hours: 0 },
  { day: "TUE", hours: 0 },
  { day: "WED", hours: 0 },
  { day: "THU", hours: 0 },
  { day: "FRI", hours: 0 },
  { day: "SAT", hours: 0 },
  { day: "SUN", hours: 0 },
];

const MONTHLY_DATA = [
  { day: "W1", hours: 0 },
  { day: "W2", hours: 0 },
  { day: "W3", hours: 0 },
  { day: "W4", hours: 0 },
];

function PerformanceStatsView() {
  const [period, setPeriod] = useState<"Weekly" | "Monthly">("Weekly");
  const [periodOpen, setPeriodOpen] = useState(false);

  const chartData = period === "Weekly" ? WEEKLY_DATA : MONTHLY_DATA;
  const maxY = period === "Weekly" ? 4 : 16;

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
        <div className="bg-white rounded-[20px] shadow-[0px_4px_50px_5px_rgba(0,0,0,0.08)] p-[24px] flex flex-col gap-[8px] flex-1 min-w-0">
          {/* Chart header */}
          <div className="flex items-center justify-between pb-[8px]">
            <p className="font-['Poppins'] font-semibold text-[20px] text-black">Hours Taught</p>
            {/* Period dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setPeriodOpen((v) => !v)}
                className="flex items-center gap-[4px] hover:opacity-70 transition-opacity"
              >
                <span className="font-['Poppins'] text-[14px] text-[#454545]">{period}</span>
                <svg className="size-[14px]" fill="none" viewBox="0 0 8 4.5">
                  <path d="M0.5 0.5L4 4L7.5 0.5" stroke="#7D7D7D" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {periodOpen && (
                <div className="absolute right-0 top-[24px] bg-white rounded-[10px] shadow-[0px_4px_20px_rgba(0,0,0,0.12)] z-10 py-1 w-[100px]">
                  {(["Weekly", "Monthly"] as const).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => { setPeriod(opt); setPeriodOpen(false); }}
                      className={`w-full px-4 py-2 text-left font-['Poppins'] text-[13px] hover:bg-[#f0f7ff] transition-colors ${opt === period ? "text-[#003566] font-medium" : "text-black"}`}
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
                  ticks={period === "Weekly" ? [0, 1, 2, 3, 4] : [0, 4, 8, 12, 16]}
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
            <div className="bg-white flex-1 rounded-[16px] shadow-[0px_4px_50px_5px_rgba(0,0,0,0.08)] p-[16px] flex flex-col gap-[10px]">
              <div className="flex items-center gap-[6px]">
                {/* Fire gradient icon */}
                <div className="size-[32px] rounded-[20px] flex items-center justify-center shrink-0"
                  style={{ background: "linear-gradient(to bottom, #fab522, #f98018)" }}>
                  <svg className="size-[16px]" fill="none" viewBox="0 0 16 16">
                    <path d={svgPathsPerf.p2473d7f0} fill="white" />
                  </svg>
                </div>
                <p className="font-['Poppins'] font-semibold text-[14px] text-black">Students Taught</p>
              </div>
              <div>
                <p className="font-['Poppins'] font-medium text-[24px] text-black">7</p>
                <p className="font-['Poppins'] text-[12px] text-[#f98118]">Keep it going</p>
              </div>
            </div>

            {/* Sessions Completed */}
            <div className="bg-white flex-1 rounded-[16px] shadow-[0px_4px_50px_5px_rgba(0,0,0,0.08)] p-[16px] flex flex-col gap-[10px]">
              <div className="flex items-center gap-[6px]">
                {/* Purple people icon */}
                <div className="size-[32px] rounded-full bg-[#AD5FF8] flex items-center justify-center shrink-0">
                  <svg className="size-[18px]" fill="none" viewBox="0 0 32 32">
                    <path d={svgPathsPerf.p3f34aa80} fill="white" />
                  </svg>
                </div>
                <p className="font-['Poppins'] font-semibold text-[14px] text-black">Sessions Completed</p>
              </div>
              <div>
                <p className="font-['Poppins'] font-medium text-[24px] text-black">3</p>
                <p className="font-['Poppins'] text-[12px] text-[#ac5cf8]">1 upcoming</p>
              </div>
            </div>
          </div>

          {/* Avg. Session Rating */}
          <div className="bg-white rounded-[16px] shadow-[0px_4px_50px_5px_rgba(0,0,0,0.08)] p-[16px] flex flex-col gap-[10px]">
            <div className="flex items-center gap-[6px]">
              {/* Pink star icon */}
              <div className="size-[32px] rounded-[20px] bg-[#f85fa1] flex items-center justify-center shrink-0">
                <svg className="size-[20px]" fill="none" viewBox="0 0 24 24">
                  <path d={svgPathsPerf.p3dd4d300} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
              <p className="font-['Poppins'] font-semibold text-[16px] text-black">Avg. Session Rating</p>
            </div>
            <div>
              <div className="flex items-center gap-[6px]">
                <p className="font-['Poppins'] font-medium text-[24px] text-black">4.5</p>
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
  const [period, setPeriod] = useState<"Weekly" | "Monthly">("Weekly");
  const [periodOpen, setPeriodOpen] = useState(false);
  const [payFilter, setPayFilter] = useState<"All" | PayStatus>("All");
  const [search, setSearch] = useState("");

  const chartData = period === "Weekly" ? EARN_WEEKLY_DATA : EARN_MONTHLY_DATA;
  const maxY      = period === "Weekly" ? 4000 : 16000;
  const yTicks    = period === "Weekly"
    ? [0, 1000, 2000, 3000, 4000]
    : [0, 4000, 8000, 12000, 16000];
  const yFmt = (v: number) => v === 0 ? "0" : `${v / 1000}K`;

  const filtered = EARNING_ROWS.filter((r) => {
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
        <div className="bg-white rounded-[20px] shadow-[0px_4px_50px_5px_rgba(0,0,0,0.08)] p-[24px] flex flex-col gap-[8px] flex-1 min-w-0">
          <div className="flex items-center justify-between pb-[8px]">
            <p className="font-['Poppins'] font-semibold text-[20px] text-black">Earning Trends</p>
            <div className="relative">
              <button
                type="button"
                onClick={() => setPeriodOpen((v) => !v)}
                className="flex items-center gap-[4px] hover:opacity-70 transition-opacity"
              >
                <span className="font-['Poppins'] text-[14px] text-[#454545]">{period}</span>
                <svg className="size-[14px]" fill="none" viewBox="0 0 8 4.5">
                  <path d="M0.5 0.5L4 4L7.5 0.5" stroke="#7D7D7D" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {periodOpen && (
                <div className="absolute right-0 top-[24px] bg-white rounded-[10px] shadow-[0px_4px_20px_rgba(0,0,0,0.12)] z-10 py-1 w-[100px]">
                  {(["Weekly", "Monthly"] as const).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => { setPeriod(opt); setPeriodOpen(false); }}
                      className={`w-full px-4 py-2 text-left font-['Poppins'] text-[13px] hover:bg-[#f0f7ff] transition-colors ${opt === period ? "text-[#003566] font-medium" : "text-black"}`}
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
                <YAxis domain={[0, maxY]} ticks={yTicks} tickFormatter={yFmt} tick={{ fontFamily: "Poppins", fontSize: 10, fill: "#7d7d7d" }} axisLine={false} tickLine={false} />
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
            <div className="bg-white flex-1 rounded-[16px] shadow-[0px_4px_50px_5px_rgba(0,0,0,0.08)] p-[16px] flex flex-col gap-[10px]">
              <div className="flex items-center gap-[6px]">
                <div className="size-[32px] rounded-[20px] flex items-center justify-center shrink-0"
                  style={{ background: "linear-gradient(to bottom, #fab522, #f98018)" }}>
                  <svg className="size-[16px]" fill="none" viewBox="0 0 16 16">
                    <path d={svgPathsEarn.p2473d7f0} fill="white" />
                  </svg>
                </div>
                <p className="font-['Poppins'] font-semibold text-[14px] text-black">Total Earnings</p>
              </div>
              <div>
                <p className="font-['Poppins'] font-medium text-[22px] text-black">₹7,500</p>
                <p className="font-['Poppins'] text-[11px] text-[#f98118]">Your total earnings so far!</p>
              </div>
            </div>

            {/* Pending Payouts */}
            <div className="bg-white flex-1 rounded-[16px] shadow-[0px_4px_50px_5px_rgba(0,0,0,0.08)] p-[16px] flex flex-col gap-[10px]">
              <div className="flex items-center gap-[6px]">
                <div className="size-[32px] rounded-[20px] bg-[#ad5ff8] flex items-center justify-center shrink-0">
                  <svg className="size-[16px]" fill="none" viewBox="0 0 16 18.0006">
                    <path d={svgPathsEarn.p125b7c00} fill="white" />
                    <path d={svgPathsEarn.p31e1b9b0} fill="white" />
                    <path d={svgPathsEarn.p23139900} fill="white" />
                    <path d={svgPathsEarn.p25fe700}  fill="white" />
                  </svg>
                </div>
                <p className="font-['Poppins'] font-semibold text-[13px] text-black">Pending Payouts</p>
              </div>
              <div>
                <p className="font-['Poppins'] font-medium text-[22px] text-black">₹3,000</p>
                <p className="font-['Poppins'] text-[11px] text-[#ac5cf8]">Amount Awaiting Withdrawal</p>
              </div>
            </div>
          </div>

          {/* Sessions Completed */}
          <div className="bg-white rounded-[16px] shadow-[0px_4px_50px_5px_rgba(0,0,0,0.08)] p-[16px] flex flex-col gap-[10px]">
            <div className="flex items-center gap-[6px]">
              <div className="size-[32px] rounded-[20px] bg-[#f85fa1] flex items-center justify-center shrink-0">
                <svg className="size-[20px]" fill="none" viewBox="0 0 24 24">
                  <path d={svgPathsEarn.p16a0cd00} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </div>
              <p className="font-['Poppins'] font-semibold text-[16px] text-black">Sessions Completed</p>
            </div>
            <div>
              <p className="font-['Poppins'] font-medium text-[24px] text-black">10</p>
              <p className="font-['Poppins'] text-[12px] text-[#ac5cf8]">Keep mentoring</p>
            </div>
          </div>
        </div>
      </div>

      {/* Earnings History */}
      <div className="flex items-center justify-between mb-[16px] gap-[16px]">
        <p className="font-['Poppins'] font-medium text-[20px] text-black">Earnings History</p>
        <div className="flex items-center gap-[12px]">
          {/* Filter tabs */}
          <div className="flex items-center bg-white rounded-[20px] p-[4px] shadow-[0px_2px_8px_rgba(0,0,0,0.06)]">
            {(["All", "Paid", "Pending"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setPayFilter(tab)}
                className={`px-[16px] py-[7px] rounded-[16px] font-['Poppins'] text-[13px] transition-colors ${
                  payFilter === tab ? "bg-[#003566] text-white" : "text-[rgba(0,0,0,0.5)] hover:text-black"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          {/* Search */}
          <div className="relative">
            <svg className="absolute left-[12px] top-1/2 -translate-y-1/2 size-[14px] text-[rgba(0,0,0,0.4)]" fill="none" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
              <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Search…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-[38px] pl-[32px] pr-[14px] rounded-[20px] border border-[rgba(0,0,0,0.12)] bg-white font-['Poppins'] text-[13px] text-black outline-none w-[200px] placeholder:text-[rgba(0,0,0,0.35)] focus:border-[#003566] transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[20px] overflow-hidden shadow-[0px_2px_12px_rgba(0,0,0,0.06)]">
        {/* Header */}
        <div className="grid grid-cols-[2fr_1.2fr_1.2fr_0.8fr_0.8fr_0.8fr] bg-[#003566] px-[24px] py-[14px]">
          {["Student", "Subject", "Date", "Duration", "Amount", "Status"].map((col) => (
            <p key={col} className="font-['Poppins'] font-medium text-[13px] text-white/90">{col}</p>
          ))}
        </div>
        {/* Rows */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-[50px] gap-[10px]">
            <p className="font-['Poppins'] text-[14px] text-[rgba(0,0,0,0.4)]">No earnings found</p>
          </div>
        ) : (
          filtered.map((row, idx) => (
            <div
              key={row.id}
              className={`grid grid-cols-[2fr_1.2fr_1.2fr_0.8fr_0.8fr_0.8fr] px-[24px] py-[15px] items-center border-b border-[rgba(0,0,0,0.05)] last:border-0 hover:bg-[rgba(233,245,255,0.4)] transition-colors ${
                idx % 2 === 0 ? "bg-white" : "bg-[rgba(233,245,255,0.15)]"
              }`}
            >
              {/* Student */}
              <div className="flex items-center gap-[10px]">
                <div className="size-[34px] rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: row.avatarColor }}>
                  <span className="font-['Poppins'] font-medium text-[11px] text-[#003566]">{row.initials}</span>
                </div>
                <span className="font-['Poppins'] text-[13px] text-black">{row.student}</span>
              </div>
              {/* Subject */}
              <span className="font-['Poppins'] text-[13px] text-[rgba(0,0,0,0.7)]">{row.subject}</span>
              {/* Date */}
              <span className="font-['Poppins'] text-[13px] text-black">{row.date}</span>
              {/* Duration */}
              <span className="font-['Poppins'] text-[13px] text-[rgba(0,0,0,0.7)]">{row.duration}</span>
              {/* Amount */}
              <span className="font-['Poppins'] font-medium text-[13px] text-[#003566]">{row.amount}</span>
              {/* Status */}
              <PayBadge status={row.status} />
            </div>
          ))
        )}
      </div>

      <p className="font-['Poppins'] text-[12px] text-[rgba(0,0,0,0.4)] mt-[12px] text-right">
        Showing {filtered.length} of {EARNING_ROWS.length} transactions
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

const INITIAL_METHODS: PaymentMethod[] = [
  { id: "pm1", type: "upi", name: "UPI", detail: "jack@sbiybl", primary: true, upiId: "jack@sbiybl" },
  { id: "pm2", type: "bank", name: "HDFC Bank", detail: "****6789  •  HDFC0001234", primary: false, holderName: "Jack Sparrow", accountNumber: "1234567890", bankName: "HDFC Bank", ifscCode: "HDFC0001234" },
];

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
  const [methods, setMethods] = useState<PaymentMethod[]>(INITIAL_METHODS);
  const [payModal, setPayModal] = useState<PayModalState>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [upiId, setUpiId] = useState("");
  const [holderName, setHolderName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [confirmAccNum, setConfirmAccNum] = useState("");
  const [bkName, setBkName] = useState("");
  const [ifscCode, setIfscCode] = useState("");

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

  function handleAddUpi() {
    if (!upiId.trim()) return;
    setMethods(prev => [...prev, { id: `pm${Date.now()}`, type: "upi", name: "UPI", detail: upiId.trim(), primary: prev.length === 0, upiId: upiId.trim() }]);
    closeModal();
  }
  function handleSaveUpi() {
    if (!upiId.trim()) return;
    setMethods(prev => prev.map(m => m.id === editingId ? { ...m, detail: upiId.trim(), upiId: upiId.trim() } : m));
    closeModal();
  }
  function handleAddBank() {
    if (!holderName.trim() || !accountNumber.trim() || !bkName.trim() || !ifscCode.trim()) return;
    const masked = `****${accountNumber.slice(-4)}`;
    setMethods(prev => [...prev, {
      id: `pm${Date.now()}`, type: "bank", name: bkName.trim(),
      detail: `${masked}  •  ${ifscCode.trim()}`, primary: prev.length === 0,
      holderName: holderName.trim(), accountNumber: accountNumber.trim(), bankName: bkName.trim(), ifscCode: ifscCode.trim(),
    }]);
    closeModal();
  }
  function handleSaveBank() {
    if (!holderName.trim() || !accountNumber.trim() || !bkName.trim() || !ifscCode.trim()) return;
    const masked = `****${accountNumber.slice(-4)}`;
    setMethods(prev => prev.map(m => m.id === editingId ? {
      ...m, name: bkName.trim(), detail: `${masked}  •  ${ifscCode.trim()}`,
      holderName: holderName.trim(), accountNumber: accountNumber.trim(), bankName: bkName.trim(), ifscCode: ifscCode.trim(),
    } : m));
    closeModal();
  }
  function handleDelete(id: string) {
    setMethods(prev => {
      const wasPrimary = prev.find(m => m.id === id)?.primary ?? false;
      const next = prev.filter(m => m.id !== id);
      if (wasPrimary && next.length > 0) next[0] = { ...next[0], primary: true };
      return next;
    });
  }
  function handleSetPrimary(id: string) {
    setMethods(prev => prev.map(m => ({ ...m, primary: m.id === id })));
  }

  return (
    <div className="p-10">
      {/* Header */}
      <div className="mb-[32px]">
        <div className="flex items-center gap-[10px] mb-[4px]">
          <svg className="size-[22px]" fill="none" viewBox="0 0 20 20">
            <path d={svgPathsPayment.p2068a280} stroke="#003566" strokeLinecap="round" strokeLinejoin="round" />
            <path d={svgPathsPayment.p18f7d00} stroke="#003566" strokeLinejoin="round" strokeWidth="1.875" />
          </svg>
          <p className="font-['Poppins'] font-medium text-[40px] text-black leading-normal">Payment Modes</p>
        </div>
        <p className="font-['Poppins'] text-[14px] text-[rgba(0,0,0,0.6)] leading-normal ml-[32px]">Manage how you receive your earnings.</p>
      </div>

      {methods.length === 0 && (
        <p className="font-['Poppins'] text-[16px] text-[rgba(0,0,0,0.6)] text-center mb-[16px]">
          No payment methods found. Please add a payment method
        </p>
      )}

      <div className="flex flex-col gap-[16px]">
        {methods.map(m => (
          <div key={m.id}
            className="bg-white flex h-[124px] items-center justify-between overflow-clip p-[16px] rounded-[16px] shadow-[0px_4px_50px_5px_rgba(0,0,0,0.1)]">
            <button type="button"
              onClick={() => m.type === "upi" ? openEditUpi(m) : openEditBank(m)}
              className="flex items-center gap-[10px] hover:opacity-80 transition-opacity text-left">
              {m.type === "upi" ? <UpiIconBadge size={46} /> : <BankIconBadge size={46} />}
              <div className="flex flex-col gap-[4px]">
                <div className="flex items-center gap-[8px]">
                  <p className="font-['Poppins'] font-medium text-[24px] text-black leading-normal">{m.name}</p>
                  {m.primary && (
                    <span className="inline-flex items-center justify-center h-[17px] px-[10px] rounded-[20px] bg-[rgba(52,177,97,0.2)]">
                      <span className="font-['Poppins'] text-[10px] text-[#34b161]">Primary</span>
                    </span>
                  )}
                </div>
                <p className="font-['Poppins'] text-[12px] text-[rgba(0,0,0,0.6)]">{m.detail}</p>
              </div>
            </button>
            <div className="flex items-center gap-[42px]">
              {!m.primary && (
                <button type="button" onClick={() => handleSetPrimary(m.id)}
                  className="font-['Poppins'] font-medium text-[14px] text-[#0788ff] hover:opacity-70 transition-opacity whitespace-nowrap">
                  Set as Primary
                </button>
              )}
              <button type="button" onClick={() => handleDelete(m.id)}
                className="shrink-0 size-[24px] hover:opacity-70 transition-opacity">
                <svg className="block size-full" fill="none" viewBox="0 0 24 24">
                  <path d={svgPathsPayment.p252a400} fill="#FF5E5E" />
                </svg>
              </button>
            </div>
          </div>
        ))}

        {/* Add New */}
        <button type="button" onClick={() => setPayModal("select-type")}
          className="bg-white flex gap-[10px] h-[124px] items-center justify-center overflow-clip p-[16px] rounded-[16px] shadow-[0px_4px_50px_5px_rgba(0,0,0,0.1)] w-full hover:bg-[#f8fbff] transition-colors">
          <div className="size-[46px] rounded-[20px] bg-[#c9e5ff] flex items-center justify-center shrink-0">
            <svg className="size-[24px]" fill="none" viewBox="0 0 24 24">
              <path d={svgPathsPayment.p155fb3f0} fill="#003566" />
            </svg>
          </div>
          <p className="font-['Poppins'] font-medium text-[16px] text-[#003566]">Add New Payment Method</p>
        </button>
      </div>

      {/* ── Modals ── */}
      {payModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6"
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>

          {/* Select Type */}
          {payModal === "select-type" && (
            <div className="bg-white rounded-[20px] shadow-[0px_4px_50px_5px_rgba(0,0,0,0.1)] p-[32px] flex flex-col gap-[24px] w-[660px]">
              <div className="flex items-center justify-between">
                <p className="font-['Poppins'] font-medium text-[32px] text-black">Add New Payment Method</p>
                <ModalCloseBtn onClick={closeModal} />
              </div>
              <div className="flex gap-[32px]">
                {/* UPI */}
                <div className="bg-white flex flex-col gap-[16px] items-center justify-center p-[32px] rounded-[20px] shadow-[0px_4px_50px_0px_rgba(0,0,0,0.1)] flex-1">
                  <UpiIconModal />
                  <div className="flex flex-col items-center gap-[2px]">
                    <p className="font-['Poppins'] font-medium text-[24px] text-black">UPI</p>
                    <p className="font-['Poppins'] text-[12px] text-[rgba(0,0,0,0.6)] text-center">Quick and instant payments via UPI ID</p>
                  </div>
                  <button type="button" onClick={openAddUpi} className="flex items-center gap-[6px] hover:opacity-70 transition-opacity">
                    <p className="font-['Poppins'] font-medium text-[14px] text-[#f85fa1]">Select</p>
                    <svg className="size-[22px] rotate-90" fill="none" viewBox="0 0 22 22">
                      <path clipRule="evenodd" d={svgPathsModal.p16746080} fill="#F85FA1" fillRule="evenodd" />
                    </svg>
                  </button>
                </div>
                {/* Bank */}
                <div className="bg-white flex flex-col gap-[16px] items-center justify-center p-[32px] rounded-[20px] shadow-[0px_4px_50px_0px_rgba(0,0,0,0.1)] flex-1">
                  <BankIconModal />
                  <div className="flex flex-col items-center gap-[2px]">
                    <p className="font-['Poppins'] font-medium text-[24px] text-black">Bank Account</p>
                    <p className="font-['Poppins'] text-[12px] text-[rgba(0,0,0,0.6)] text-center">Direct bank transfer to your account</p>
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
            <div className="bg-white rounded-[20px] shadow-[0px_4px_50px_5px_rgba(0,0,0,0.1)] p-[32px] flex flex-col gap-[24px] w-[700px]">
              <div className="flex items-center justify-between">
                <div>
                  <button type="button" onClick={() => setPayModal("select-type")}
                    className="font-['Poppins'] text-[14px] text-[rgba(0,0,0,0.6)] hover:text-black transition-colors">{"< Back"}</button>
                  <p className="font-['Poppins'] font-medium text-[32px] text-black">Add UPI</p>
                </div>
                <ModalCloseBtn onClick={closeModal} />
              </div>
              <div className="bg-white flex flex-col gap-[16px] items-start p-[32px] rounded-[20px] shadow-[0px_4px_50px_0px_rgba(0,0,0,0.1)] w-full">
                <UpiIconModal />
                <PayFormInput label="UPI ID" value={upiId} onChange={setUpiId} placeholder="yourname@upi" />
                <div className="flex gap-[16px] items-center justify-end w-full">
                  <button type="button" onClick={closeModal}
                    className="bg-[#e4e4e4] h-[42px] px-[24px] rounded-[20px] font-['Poppins'] font-medium text-[12px] text-[rgba(0,0,0,0.6)] hover:bg-[#d4d4d4] transition-colors">Cancel</button>
                  <button type="button" onClick={handleAddUpi}
                    className="bg-[#f96faa] h-[42px] px-[24px] rounded-[20px] font-['Poppins'] font-medium text-[12px] text-white hover:bg-[#f055a0] transition-colors">Add UPI</button>
                </div>
              </div>
            </div>
          )}

          {/* Edit UPI */}
          {payModal === "edit-upi" && (
            <div className="bg-white rounded-[20px] shadow-[0px_4px_50px_5px_rgba(0,0,0,0.1)] p-[32px] flex flex-col gap-[24px] w-[700px]">
              <div className="flex items-center justify-between">
                <p className="font-['Poppins'] font-medium text-[32px] text-black">Edit UPI</p>
                <ModalCloseBtn onClick={closeModal} />
              </div>
              <div className="bg-white flex flex-col gap-[16px] items-start p-[32px] rounded-[20px] shadow-[0px_4px_50px_0px_rgba(0,0,0,0.1)] w-full">
                <UpiIconModal />
                <PayFormInput label="UPI ID" value={upiId} onChange={setUpiId} placeholder="yourname@upi" />
                <div className="flex gap-[16px] items-center justify-end w-full">
                  <button type="button" onClick={closeModal}
                    className="bg-[#e4e4e4] h-[42px] px-[24px] rounded-[20px] font-['Poppins'] font-medium text-[12px] text-[rgba(0,0,0,0.6)] hover:bg-[#d4d4d4] transition-colors">Cancel</button>
                  <button type="button" onClick={handleSaveUpi}
                    className="bg-[#f96faa] h-[42px] px-[24px] rounded-[20px] font-['Poppins'] font-medium text-[12px] text-white hover:bg-[#f055a0] transition-colors">Save</button>
                </div>
              </div>
            </div>
          )}

          {/* Add Bank */}
          {payModal === "add-bank" && (
            <div className="bg-white rounded-[20px] shadow-[0px_4px_50px_5px_rgba(0,0,0,0.1)] p-[32px] flex flex-col gap-[24px] w-[700px] max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between">
                <div>
                  <button type="button" onClick={() => setPayModal("select-type")}
                    className="font-['Poppins'] text-[14px] text-[rgba(0,0,0,0.6)] hover:text-black transition-colors">{"< Back"}</button>
                  <p className="font-['Poppins'] font-medium text-[32px] text-black">Add Bank Account</p>
                </div>
                <ModalCloseBtn onClick={closeModal} />
              </div>
              <div className="bg-white flex flex-col gap-[16px] items-start p-[32px] rounded-[20px] shadow-[0px_4px_50px_0px_rgba(0,0,0,0.1)] w-full">
                <BankIconModal />
                <PayFormInput label="Account Holder Name" value={holderName} onChange={setHolderName} placeholder="Enter full name as per bank records" />
                <PayFormInput label="Account Number" value={accountNumber} onChange={setAccountNumber} placeholder="Enter account number" type="password" />
                <PayFormInput label="Confirm Account Number" value={confirmAccNum} onChange={setConfirmAccNum} placeholder="Re-Enter account number" type="password" />
                <PayFormInput label="Bank Name" value={bkName} onChange={setBkName} placeholder="Enter Bank Name" />
                <PayFormInput label="IFSC Code" value={ifscCode} onChange={setIfscCode} placeholder="Enter Bank IFSC Code" />
                <div className="flex gap-[16px] items-center justify-end w-full">
                  <button type="button" onClick={closeModal}
                    className="bg-[#e4e4e4] h-[42px] px-[24px] rounded-[20px] font-['Poppins'] font-medium text-[12px] text-[rgba(0,0,0,0.6)] hover:bg-[#d4d4d4] transition-colors">Cancel</button>
                  <button type="button" onClick={handleAddBank}
                    className="bg-[#8a38f5] h-[42px] px-[24px] rounded-[20px] font-['Poppins'] font-medium text-[12px] text-white hover:bg-[#7a2ee5] transition-colors">Add Bank Account</button>
                </div>
              </div>
            </div>
          )}

          {/* Edit Bank */}
          {payModal === "edit-bank" && (
            <div className="bg-white rounded-[20px] shadow-[0px_4px_50px_5px_rgba(0,0,0,0.1)] p-[32px] flex flex-col gap-[24px] w-[700px] max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between">
                <p className="font-['Poppins'] font-medium text-[32px] text-black">Edit Bank Account</p>
                <ModalCloseBtn onClick={closeModal} />
              </div>
              <div className="bg-white flex flex-col gap-[16px] items-start p-[32px] rounded-[20px] shadow-[0px_4px_50px_0px_rgba(0,0,0,0.1)] w-full">
                <BankIconModal />
                <PayFormInput label="Account Holder Name" value={holderName} onChange={setHolderName} placeholder="Enter full name as per bank records" />
                <PayFormInput label="Account Number" value={accountNumber} onChange={setAccountNumber} placeholder="Enter account number" />
                <PayFormInput label="Confirm Account Number" value={confirmAccNum} onChange={setConfirmAccNum} placeholder="Re-Enter account number" />
                <PayFormInput label="Bank Name" value={bkName} onChange={setBkName} placeholder="Enter Bank Name" />
                <PayFormInput label="IFSC Code" value={ifscCode} onChange={setIfscCode} placeholder="Enter Bank IFSC Code" />
                <div className="flex gap-[16px] items-center justify-end w-full">
                  <button type="button" onClick={closeModal}
                    className="bg-[#e4e4e4] h-[42px] px-[24px] rounded-[20px] font-['Poppins'] font-medium text-[12px] text-[rgba(0,0,0,0.6)] hover:bg-[#d4d4d4] transition-colors">Cancel</button>
                  <button type="button" onClick={handleSaveBank}
                    className="bg-[#8a38f5] h-[42px] px-[24px] rounded-[20px] font-['Poppins'] font-medium text-[12px] text-white hover:bg-[#7a2ee5] transition-colors">Save</button>
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

const INITIAL_WITHDRAWALS: WithdrawalRow[] = [
  { id: "w1", date: "20-10-24", amount: "₹500/-", method: "UPI",          status: "Completed"  },
  { id: "w2", date: "20-10-24", amount: "₹500/-", method: "Bank Account", status: "Processing" },
  { id: "w3", date: "20-10-24", amount: "₹500/-", method: "UPI",          status: "Processing" },
  { id: "w4", date: "20-10-24", amount: "₹500/-", method: "Bank Account", status: "Completed"  },
  { id: "w5", date: "20-10-24", amount: "₹500/-", method: "UPI",          status: "Completed"  },
  { id: "w6", date: "20-10-24", amount: "₹500/-", method: "Bank Account", status: "Completed"  },
];

const PAYOUT_METHODS = [
  { id: "pm1", label: "UPI",       detail: "jack@sbiybl"              },
  { id: "pm2", label: "HDFC Bank", detail: "****6789  •  HDFC0001234" },
];

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
  const [amount,    setAmount]    = useState("0");
  const [selMethod, setSelMethod] = useState("pm1");
  const [history,   setHistory]   = useState<WithdrawalRow[]>(INITIAL_WITHDRAWALS);
  const [balance,   setBalance]   = useState(12450);
  const [wError,    setWError]    = useState("");

  function handleConfirm() {
    const amt = parseInt(amount, 10);
    if (isNaN(amt) || amt < 500) { setWError("Minimum withdrawal is ₹500."); return; }
    if (amt > balance)           { setWError("Amount exceeds available balance."); return; }
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yy = String(today.getFullYear()).slice(-2);
    const methodLabel = selMethod === "pm1" ? "UPI" : "Bank Account";
    setHistory(prev => [
      { id: `w${Date.now()}`, date: `${dd}-${mm}-${yy}`, amount: `₹${amt.toLocaleString("en-IN")}/-`, method: methodLabel, status: "Processing" },
      ...prev,
    ]);
    setBalance(prev => prev - amt);
    setAmount("0"); setWError(""); setShowModal(false);
  }

  function openModal() { setAmount("0"); setWError(""); setSelMethod("pm1"); setShowModal(true); }

  return (
    <div className="p-10">
      {/* Header */}
      <div className="mb-[32px]">
        <div className="flex items-center gap-[10px] mb-[4px]">
          <svg className="size-[22px]" fill="none" viewBox="0 0 21.5 19.5">
            <path d={svgPathsPayment.p392a47c0} stroke="#003566" strokeLinecap="round" strokeWidth="1.5" />
            <path d={svgPathsPayment.peb17a80}  stroke="#003566" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPathsPayment.p2cd66780} stroke="#003566" strokeLinecap="round" strokeWidth="1.5" />
          </svg>
          <p className="font-['Poppins'] font-medium text-[40px] text-black leading-normal">Withdrawal</p>
        </div>
        <p className="font-['Poppins'] text-[14px] text-[rgba(0,0,0,0.6)] ml-[32px]">Transfer your funds securely</p>
      </div>

      {/* Available Balance card */}
      <div className="bg-white/50 flex items-center justify-between p-[16px] rounded-[16px] shadow-[0px_4px_50px_5px_rgba(0,0,0,0.1)] mb-[20px]">
        <div className="flex flex-col gap-[2px]">
          <p className="font-['Poppins'] text-[12px] text-[rgba(0,0,0,0.6)]">Available Balance</p>
          <p className="font-['Poppins'] font-medium text-[32px] text-black tracking-[-0.2px]">
            ₹{balance.toLocaleString("en-IN")}
          </p>
          <p className="font-['Poppins'] text-[12px] text-[rgba(0,0,0,0.6)]">Earnings ready for withdrawal</p>
        </div>
        <div className="flex flex-col items-end gap-[6px]">
          <p className="font-['Poppins'] text-[12px] text-[rgba(0,0,0,0.6)]">Minimum withdrawal ₹500</p>
          <button type="button" onClick={openModal}
            className="bg-[#003566] h-[42px] w-[155px] rounded-[20px] font-['Poppins'] text-[14px] text-white hover:bg-[#002a52] transition-colors">
            Withdraw
          </button>
        </div>
      </div>

      {/* Two stat cards */}
      <div className="flex gap-[32px] mb-[28px]">
        <div className="bg-white/50 flex-1 h-[116px] rounded-[16px] shadow-[0px_4px_50px_5px_rgba(0,0,0,0.1)] p-[16px] flex flex-col gap-[2px]">
          <p className="font-['Poppins'] text-[12px] text-[rgba(0,0,0,0.6)]">This Month</p>
          <p className="font-['Poppins'] font-medium text-[24px] text-black tracking-[-0.2px]">₹1,200</p>
          <p className="font-['Poppins'] text-[12px] text-[rgba(0,0,0,0.6)]">Income generated this month</p>
        </div>
        <div className="bg-white/50 flex-1 rounded-[16px] shadow-[0px_4px_50px_5px_rgba(0,0,0,0.1)] p-[16px] flex flex-col gap-[2px]">
          <p className="font-['Poppins'] text-[12px] text-[rgba(0,0,0,0.6)]">Pending Payouts</p>
          <p className="font-['Poppins'] font-medium text-[32px] text-black tracking-[-0.2px]">₹1,200</p>
          <p className="font-['Poppins'] text-[12px] text-[rgba(0,0,0,0.6)]">Amount awaiting processing</p>
        </div>
      </div>

      {/* Recent Withdrawals */}
      <p className="font-['Poppins'] font-medium text-[20px] text-black mb-[16px]">Recent Withdrawals</p>
      {history.length === 0 ? (
        <p className="font-['Poppins'] text-[14px] text-[rgba(0,0,0,0.6)]">No withdrawal history found.</p>
      ) : (
        <div className="bg-white rounded-[20px] overflow-hidden shadow-[0px_2px_12px_rgba(0,0,0,0.06)]">
          <div className="grid grid-cols-4 bg-[#c9e5ff] px-[24px] py-[16px]">
            {["Date", "Amount", "Method", "Status"].map(col => (
              <p key={col} className="font-['Poppins'] text-[14px] text-black">{col}</p>
            ))}
          </div>
          {history.map((row, idx) => (
            <div key={row.id}
              className={`grid grid-cols-4 px-[24px] py-[16px] items-center border-b border-[rgba(0,0,0,0.05)] last:border-0 hover:bg-[rgba(233,245,255,0.3)] transition-colors ${
                idx % 2 === 0 ? "bg-white" : "bg-[rgba(233,245,255,0.15)]"
              }`}>
              <span className="font-['Poppins'] text-[14px] text-black">{row.date}</span>
              <span className="font-['Poppins'] text-[14px] text-black">{row.amount}</span>
              <span className="font-['Poppins'] text-[14px] text-black">{row.method}</span>
              <WithdrawalBadge status={row.status} />
            </div>
          ))}
        </div>
      )}

      {/* Withdraw Funds Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6"
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className="bg-white rounded-[20px] shadow-[0px_4px_50px_5px_rgba(0,0,0,0.1)] p-[32px] w-[500px] flex flex-col gap-[20px]">

            <div className="flex items-start justify-between">
              <div>
                <p className="font-['Poppins'] font-medium text-[28px] text-black">Withdraw Funds</p>
                <p className="font-['Poppins'] text-[14px] text-[rgba(0,0,0,0.6)]">Enter amount and choose a payout method</p>
              </div>
              <ModalCloseBtn onClick={() => setShowModal(false)} />
            </div>

            {/* Amount field */}
            <div className="flex flex-col gap-[6px]">
              <p className="font-['Poppins'] font-medium text-[14px] text-black">Amount (₹)</p>
              <input
                type="number" min="500" max={balance} value={amount}
                onChange={(e) => { setAmount(e.target.value); setWError(""); }}
                className="w-full h-[42px] border border-[rgba(0,0,0,0.3)] rounded-[10px] px-[12px] font-['Poppins'] text-[14px] outline-none focus:border-[#003566] transition-colors"
              />
              <p className="font-['Poppins'] text-[12px] text-[rgba(0,0,0,0.5)]">Minimum withdrawal ₹500</p>
              {wError && <p className="font-['Poppins'] text-[12px] text-[#cc3636]">{wError}</p>}
            </div>

            {/* Payout method */}
            <div className="flex flex-col gap-[10px]">
              <p className="font-['Poppins'] font-medium text-[14px] text-black">Payout Method</p>
              <div className="flex gap-[12px]">
                {PAYOUT_METHODS.map(m => (
                  <button key={m.id} type="button" onClick={() => setSelMethod(m.id)}
                    className={`flex-1 flex items-center gap-[10px] p-[14px] rounded-[10px] border-2 transition-colors ${
                      selMethod === m.id ? "bg-[#c9e5ff] border-[#003566]" : "bg-white border-[rgba(0,0,0,0.15)] hover:border-[rgba(0,0,0,0.3)]"
                    }`}>
                    <div className={`size-[18px] rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                      selMethod === m.id ? "border-[#003566]" : "border-[rgba(0,0,0,0.3)]"
                    }`}>
                      {selMethod === m.id && <div className="size-[8px] rounded-full bg-[#003566]" />}
                    </div>
                    <div className="text-left">
                      <p className="font-['Poppins'] font-medium text-[14px] text-black leading-tight">{m.label}</p>
                      <p className="font-['Poppins'] text-[11px] text-[rgba(0,0,0,0.6)]">{m.detail}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-[12px] justify-end">
              <button type="button" onClick={() => setShowModal(false)}
                className="bg-[#e4e4e4] h-[42px] px-[24px] rounded-[20px] font-['Poppins'] text-[14px] text-[rgba(0,0,0,0.6)] hover:bg-[#d4d4d4] transition-colors">
                Cancel
              </button>
              <button type="button" onClick={handleConfirm}
                className="bg-[#003566] h-[42px] px-[24px] rounded-[20px] font-['Poppins'] text-[14px] text-white hover:bg-[#002a52] transition-colors">
                Confirm Withdrawal
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
      className={`relative h-[24px] w-[48px] shrink-0 rounded-[20px] transition-colors duration-200 focus:outline-none ${
        on ? "bg-[#003566]" : "bg-[#c3c3c3]"
      }`}
    >
      <span
        className={`absolute top-0 size-[24px] rounded-full shadow transition-transform duration-200 ${
          on ? "translate-x-6 bg-white" : "translate-x-0 bg-[#d9d9d9]"
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
    <div className="p-10">
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
          <p className="font-['Poppins'] font-medium text-[40px] text-black leading-normal">
            Notifications
          </p>
        </div>
        <p className="font-['Poppins'] text-[14px] text-[rgba(0,0,0,0.6)] ml-[32px]">
          Manage which alerts you want to receive
        </p>
      </div>

      {/* Toggle rows */}
      <div className="flex flex-col gap-[16px] mb-6">
        {NOTIF_SETTINGS.map((item) => (
          <div key={item.key} className="flex flex-col gap-[4px]">
            <div className="flex items-center justify-between">
              <p className="font-['Poppins'] text-[18px] text-black leading-[20px]">
                {item.label}
              </p>
              <NotifToggle on={enabled[item.key]} onClick={() => onToggle(item.key)} />
            </div>
            <p className="font-['Poppins'] text-[16px] text-[rgba(0,0,0,0.6)] leading-[20px]">
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

/* ── Main component ── */

export function MentorProfileSettings({ onBack }: MentorProfileSettingsProps) {
  const currentUser = getCurrentUser();
  const [activeNav, setActiveNav] = useState<ProfileSubNav>("basic");

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

  // Load mentor profile from database
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        if (!currentUser) {
          setEmail("");
          return;
        }

        const supabase = getSupabaseClient();
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .single();

        if (data) {
          setFullName(data.name || "");
          setEmail(data.email || currentUser.email || "");
          setBio(data.bio || "");
          setGrade(data.mentor_grade || "5-10 years");
          setExpertise(data.expertise || "");
          setLanguages(data.languages || []);
          
          // Load mentor-specific fields
          if (data.mentor_documents) setDocs(data.mentor_documents);
          if (data.avatar_url) setAvatarSrc(data.avatar_url);
          
          // Load notification preferences
          if (data.notification_preferences) {
            setNotifEnabled((prev) => ({
              ...prev,
              ...data.notification_preferences,
            }));
          }
        }
      } catch (err: any) {
        console.log("Failed to load mentor profile:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [currentUser]);

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
          updated_at: new Date().toISOString(),
        })
        .eq('id', currentUser.id);

      if (updateError) {
        throw updateError;
      }

      setSaved(true);
      toast.success("Profile saved successfully!");
      setTimeout(() => setSaved(false), 2500);
    } catch (err: any) {
      const msg = err.message || "Failed to save profile";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  }

  // Save notification preferences
  async function handleSaveNotifications() {
    setNotifSaving(true);
    try {
      const supabase = getSupabaseClient();
      if (!currentUser) {
        toast.error("Not authenticated");
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({ notification_preferences: notifEnabled })
        .eq('id', currentUser.id);

      if (error) {
        toast.error("Failed to save preferences");
        return;
      }

      toast.success("Notification preferences saved!");
    } catch (err: any) {
      toast.error(err.message || "Failed to save preferences");
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

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatarSrc(url);
    e.target.value = "";
  }

  const navItems: { key: ProfileSubNav; label: string; icon: React.ReactNode }[] = [
    { key: "basic",           label: "Basic Information",  icon: <IconProfile active={activeNav === "basic"} /> },
    { key: "session-history", label: "Session History",    icon: <IconHistory /> },
    { key: "performance",     label: "Performance Stats",  icon: <IconStats /> },
    { key: "earning",         label: "Earning Stats",      icon: <IconEarning /> },
    { key: "payment",         label: "Payment Modes",      icon: <IconCard /> },
    { key: "withdrawal",      label: "Withdrawal",         icon: <IconWithdrawal /> },
    { key: "notifications",   label: "Notifications",      icon: <IconBell /> },
  ];

  return (
    <div className="flex h-full w-full overflow-hidden">

      {/* ── Left profile sub-nav sidebar ── */}
      <div className="w-[278px] shrink-0 bg-white shadow-[0px_4px_18px_-1px_rgba(0,0,0,0.1)] flex flex-col overflow-y-auto">
        {/* Back + Profile title */}
        <div className="px-[32px] pt-[40px] pb-[20px]">
          <button
            type="button"
            onClick={onBack}
            className="font-['Poppins'] text-[14px] text-[rgba(0,0,0,0.6)] hover:text-black transition-colors cursor-pointer"
          >
            {"< Dashboard"}
          </button>
          <p className="font-['Poppins'] font-medium text-[40px] text-black leading-tight mt-1">Profile</p>
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
      <div className="flex-1 overflow-y-auto bg-[#f8fafc]">
        {/* Top bar */}
        <div className="bg-white border-b border-[rgba(0,0,0,0.06)] px-10 py-[22px] flex items-center justify-end gap-6">
          <button className="relative p-1 hover:opacity-70 transition-opacity">
            <svg className="size-[26px]" fill="none" viewBox="0 0 24 24">
              <path d={svgPaths.p13baf700} stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.017" />
            </svg>
          </button>
          <div className="flex items-center gap-[10px]">
            <img
              src={imgEllipse1}
              alt="Jack Sparrow"
              className="size-[38px] rounded-full object-cover"
            />
            <span className="font-['Poppins'] text-[16px] text-black">Jack Sparrow</span>
          </div>
        </div>

        {/* Page content */}
        {activeNav === "basic" ? (
          <div className="p-10">
            {/* Page header */}
            <div className="mb-[40px]">
              <p className="font-['Poppins'] font-medium text-[40px] text-black leading-normal">Basic Information</p>
              <p className="font-['Poppins'] text-[14px] text-[rgba(0,0,0,0.6)] leading-normal">Personal Details</p>
            </div>

            {/* Two-column layout */}
            <div className="flex gap-[24px] items-start">

              {/* ── LEFT COLUMN ── */}
              <div className="flex flex-col gap-[24px] w-[380px] shrink-0">

                {/* Avatar panel */}
                <div className="bg-[rgba(233,245,255,0.5)] rounded-[20px] p-[31px] flex flex-col items-center gap-[24px]">
                  {/* Avatar circle */}
                  <div className="size-[176px] rounded-full overflow-hidden relative bg-[#cacaca] shrink-0">
                    <img
                      src={avatarSrc}
                      alt="Profile"
                      className="absolute inset-0 size-full object-cover"
                    />
                  </div>
                  {/* Buttons */}
                  <div className="flex flex-col gap-[16px] w-full">
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
                      className="bg-[#003566] h-[42px] rounded-[20px] w-full flex items-center justify-center gap-[10px] hover:bg-[#002a52] transition-colors"
                    >
                      <IconUserFocus />
                      <span className="font-['Poppins'] text-[12px] text-white">Change Profile Pic</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAvatarSrc(imgEllipse2)}
                      className="bg-[#c9e5ff] h-[42px] rounded-[20px] w-full flex items-center justify-center gap-[10px] hover:bg-[#b6d9ff] transition-colors"
                    >
                      <IconDeleteSmall />
                      <span className="font-['Poppins'] text-[12px] text-[#003566]">Delete Avatar</span>
                    </button>
                  </div>
                </div>

                {/* Documents panel */}
                <div className="bg-[rgba(233,245,255,0.5)] rounded-[20px] px-[27px] py-[17px] flex flex-col gap-[24px]">
                  {/* Header */}
                  <p className="font-['Poppins'] font-medium text-[20px] text-black leading-normal">
                    Documents Uploaded{" "}
                    <span className="font-['Poppins'] font-normal text-[14px]">
                      ({docs.length}/{maxDocs})
                    </span>
                  </p>

                  {/* Doc list */}
                  <div className="flex flex-col gap-0">
                    {docs.map((doc) => (
                      <div key={doc.id} className="h-[73px] flex items-center">
                        <div className="bg-white h-[70px] rounded-[24px] w-full border border-[#dbdbdb] flex items-center px-[20px] justify-between">
                          <div className="flex items-center gap-[10px]">
                            <IconPdf />
                            <div className="flex flex-col gap-[6px]">
                              <p className="font-['Poppins'] font-semibold text-[14px] text-black leading-normal">{doc.name}</p>
                              <p className="font-['Poppins'] font-medium text-[12px] text-[rgba(0,0,0,0.6)] leading-normal">{doc.size}</p>
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
                          className="bg-[#003566] h-[42px] rounded-[20px] px-[24px] py-[10px] flex items-center gap-[6px] hover:bg-[#002a52] transition-colors"
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
              <div className="flex-1 flex flex-col gap-[24px]">

                {/* Profile Information panel */}
                <div className="bg-[rgba(233,245,255,0.5)] rounded-[20px] px-[31px] py-[17px]">
                  <p className="font-['Poppins'] font-medium text-[20px] text-black leading-normal mb-[46px]">Profile Information</p>

                  <div className="flex flex-col gap-[24px]">
                    {/* Row 1: Full Name + Grade */}
                    <div className="flex gap-[33px] items-start">
                      <div className="w-[249px] shrink-0">
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
                    <div className="flex gap-[33px] items-start">
                      <div className="flex-1">
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
                      <p className="font-['Poppins'] text-[16px] text-black leading-normal">Known Languages</p>
                      <div className="flex flex-wrap gap-[10px] items-start">
                        {languages.map((lang) => (
                          <div
                            key={lang}
                            className="bg-white h-[39px] px-[10px] rounded-[10px] shadow-[0px_4px_11.4px_0px_rgba(0,0,0,0.1)] flex items-center gap-[6px]"
                          >
                            <span className="font-['Poppins'] font-medium text-[14px] text-black">{lang}</span>
                            <button
                              type="button"
                              onClick={() => handleDeleteLanguage(lang)}
                              className="text-[rgba(0,0,0,0.4)] hover:text-[rgba(0,0,0,0.7)] text-[16px] leading-none transition-colors cursor-pointer"
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
                            className="h-[39px] px-[10px] rounded-[10px] border border-[rgba(0,0,0,0.2)] font-['Poppins'] text-[14px] text-black outline-none w-[120px] placeholder:text-[rgba(0,0,0,0.3)]"
                          />
                          <button
                            type="button"
                            onClick={handleAddLanguage}
                            className="bg-[#003566] h-[39px] w-[43px] rounded-[20px] flex items-center justify-center hover:bg-[#002a52] transition-colors"
                          >
                            <IconPlus white />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Row 4: Bio */}
                    <div className="flex flex-col gap-[10px] w-[313px]">
                      <p className="font-['Poppins'] text-[16px] text-black leading-normal">Bio</p>
                      <div className="h-[112px] rounded-[10px] border border-[rgba(0,0,0,0.4)] flex gap-[10px] items-start p-[10px]">
                        <IconEditPen />
                        <textarea
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          disabled={isSaving}
                          className="flex-1 h-full bg-transparent font-['Poppins'] text-[14px] text-[rgba(0,0,0,0.8)] outline-none resize-none leading-normal disabled:opacity-60"
                        />
                      </div>
                    </div>

                    {/* Error message */}
                    {error && (
                      <div className="bg-[#fde8e8] border border-[#cc3636] rounded-[10px] px-4 py-3 flex items-center gap-2">
                        <svg className="w-4 h-4 text-[#cc3636]" fill="none" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor" />
                        </svg>
                        <p className="font-['Poppins'] text-[12px] text-[#cc3636]">{error}</p>
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

                {/* Change Password panel */}
                <div className="bg-[rgba(233,245,255,0.5)] rounded-[20px] px-[27px] py-[17px] flex flex-col gap-[24px] items-end">
                  <p className="font-['Poppins'] font-medium text-[20px] text-black leading-normal w-full">Change Password</p>

                  <div className="flex flex-col gap-[16px] w-full">
                    <PasswordField label="Current Password" value={currentPw} onChange={setCurrentPw} />
                    <PasswordField label="New Password"     value={newPw}     onChange={setNewPw} />
                    <PasswordField label="Confirm Password" value={confirmPw} onChange={setConfirmPw} />
                  </div>

                  <div className="flex gap-[16px] items-center">
                    <button
                      type="button"
                      onClick={handleSavePassword}
                      className="bg-[#003566] h-[42px] rounded-[20px] px-[24px] py-[10px] font-['Poppins'] text-[12px] text-white hover:bg-[#002a52] transition-colors"
                    >
                      {pwSaved ? "Updated ✓" : "Update"}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setNewPw(""); setConfirmPw(""); }}
                      className="bg-[#c9e5ff] h-[42px] rounded-[20px] px-[24px] py-[10px] font-['Poppins'] text-[12px] text-[#003566] hover:bg-[#b6d9ff] transition-colors"
                    >
                      Decline
                    </button>
                  </div>
                </div>
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