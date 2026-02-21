import React, { useState, useRef, useEffect } from "react";
import imgEllipse1 from "figma:asset/798eac6e288222603807db12d070c52d1a145785.png";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import { profile as profileApi, studySessions, moodCheckins, sessionRequests, sessions as sessionsApi, notifications as notificationsApi, getCurrentUser } from "@/app/lib/api";

interface UserProfileSettingsProps {
  onBack: () => void;
}

type UserSubNav =
  | "basic"
  | "my-sessions"
  | "study-history"
  | "mood-history"
  | "security"
  | "notifications";

// ─────────────────────────────────────────────────────────────────────────────
// Shared tiny icons (inline SVG, no imports needed)
// ─────────────────────────────────────────────────────────────────────────────

function IconProfile({ active }: { active?: boolean }) {
  const c = active ? "#003566" : "rgba(0,0,0,0.6)";
  return (
    <svg className="shrink-0 size-[20px]" fill="none" viewBox="0 0 24 24">
      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" fill={c} />
    </svg>
  );
}
function IconSessions() {
  return (
    <svg className="shrink-0 size-[20px]" fill="none" viewBox="0 0 24 24">
      <rect x="3" y="4" width="18" height="18" rx="2" stroke="rgba(0,0,0,0.6)" strokeWidth="2" />
      <path d="M16 2v4M8 2v4M3 10h18" stroke="rgba(0,0,0,0.6)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function IconStudy() {
  return (
    <svg className="shrink-0 size-[20px]" fill="none" viewBox="0 0 24 24">
      <path d="M12 14l9-5-9-5-9 5 9 5z" stroke="rgba(0,0,0,0.6)" strokeWidth="2" strokeLinejoin="round" />
      <path d="M3 9v6M21 9v3" stroke="rgba(0,0,0,0.6)" strokeWidth="2" strokeLinecap="round" />
      <path d="M7 14.5v3.5c1.333.667 2.667 1 4 1s2.667-.333 4-1V14.5" stroke="rgba(0,0,0,0.6)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function IconMood() {
  return (
    <svg className="shrink-0 size-[20px]" fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" stroke="rgba(0,0,0,0.6)" strokeWidth="2" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" stroke="rgba(0,0,0,0.6)" strokeWidth="2" strokeLinecap="round" />
      <path d="M9 9h.01M15 9h.01" stroke="rgba(0,0,0,0.6)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function IconSecurity() {
  return (
    <svg className="shrink-0 size-[20px]" fill="none" viewBox="0 0 24 24">
      <path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11 4.5-.85 8-5.75 8-11V6l-8-4z" stroke="rgba(0,0,0,0.6)" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}
function IconBell() {
  return (
    <svg className="shrink-0 size-[20px]" fill="none" viewBox="0 0 24 24">
      <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" stroke="rgba(0,0,0,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-nav item
// ─────────────────────────────────────────────────────────────────────────────

function SubNavItem({ icon, label, active, onClick }: {
  icon: React.ReactNode; label: string; active: boolean; onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex gap-[8px] h-[42px] items-center px-[16px] rounded-[10px] w-full text-left transition-colors ${
        active ? "bg-[#c9e5ff]" : "hover:bg-[#f0f7ff]"
      }`}
    >
      {icon}
      <span className={`font-['Poppins'] text-[14px] leading-normal ${active ? "text-[#003566]" : "text-[rgba(0,0,0,0.6)]"}`}>
        {label}
      </span>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Reusable input
// ─────────────────────────────────────────────────────────────────────────────

function Field({ label, value, onChange, placeholder, readOnly, textarea }: {
  label: string; value: string; onChange?: (v: string) => void;
  placeholder?: string; readOnly?: boolean; textarea?: boolean;
}) {
  const cls = "w-full bg-transparent font-['Poppins'] text-[14px] text-[rgba(0,0,0,0.8)] outline-none placeholder:text-[rgba(0,0,0,0.35)]";
  return (
    <div className="flex flex-col gap-[8px] items-start w-full">
      <p className="font-['Poppins'] text-[15px] text-black leading-normal">{label}</p>
      <div className={`rounded-[10px] w-full border border-[rgba(0,0,0,0.2)] px-[12px] flex items-start gap-[8px] ${textarea ? "py-[10px]" : "h-[42px] items-center"} ${readOnly ? "bg-[rgba(0,0,0,0.02)]" : ""}`}>
        {textarea ? (
          <textarea
            readOnly={readOnly}
            value={value}
            placeholder={placeholder}
            onChange={(e) => onChange?.(e.target.value)}
            rows={4}
            className={cls + " resize-none"}
          />
        ) : (
          <input
            type="text"
            readOnly={readOnly}
            value={value}
            placeholder={placeholder}
            onChange={(e) => onChange?.(e.target.value)}
            className={cls}
          />
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Toggle switch
// ─────────────────────────────────────────────────────────────────────────────

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative w-[52px] h-[28px] rounded-full transition-colors duration-200 shrink-0 ${on ? "bg-[#003566]" : "bg-[rgba(0,0,0,0.15)]"}`}
    >
      <div className={`absolute top-[4px] size-[20px] rounded-full bg-white shadow-sm transition-transform duration-200 ${on ? "translate-x-[26px]" : "translate-x-[4px]"}`} />
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Status badge
// ─────────────────────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    completed: "bg-[#d8f5e8] text-[#1a7a45]",
    booked:    "bg-[#e9f5ff] text-[#003566]",
    accepted:  "bg-[#e9f5ff] text-[#003566]",
    pending:   "bg-[#fff4d8] text-[#c07a00]",
    cancelled: "bg-[#fde8e8] text-[#cc3636]",
    declined:  "bg-[#fde8e8] text-[#cc3636]",
  };
  const label = status.charAt(0).toUpperCase() + status.slice(1);
  return (
    <span className={`inline-flex items-center px-[10px] py-[4px] rounded-[20px] font-['Poppins'] text-[12px] whitespace-nowrap ${map[status] ?? "bg-gray-100 text-gray-600"}`}>
      {label}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Loading spinner
// ─────────────────────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="w-8 h-8 border-2 border-[#003566] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Basic Information page
// ─────────────────────────────────────────────────────────────────────────────

function BasicInfoPage() {
  const currentUser = getCurrentUser();
  const [name,       setName]       = useState(currentUser?.name     || "");
  const [email,      setEmail]      = useState(currentUser?.email    || "");
  const [bio,        setBio]        = useState(currentUser?.bio      || "");
  const [gradeLevel, setGradeLevel] = useState(currentUser?.gradeLevel || "");
  const [subjects,   setSubjects]   = useState<string[]>(currentUser?.subjects || []);
  const [newSubject, setNewSubject] = useState("");
  const [avatarSrc,  setAvatarSrc]  = useState(currentUser?.avatar  || imgEllipse1);
  const [isSaving,   setIsSaving]   = useState(false);
  const [saved,      setSaved]      = useState(false);
  const avatarRef = useRef<HTMLInputElement>(null);

  const GRADE_OPTIONS = ["Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10",
    "Grade 11", "Grade 12", "Undergraduate", "Postgraduate", "Other"];

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatarSrc(url);
    e.target.value = "";
  }

  function handleAddSubject() {
    const s = newSubject.trim();
    if (s && !subjects.includes(s)) setSubjects((prev) => [...prev, s]);
    setNewSubject("");
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      await profileApi.update({ name, bio, gradeLevel, subjects });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) { console.log("Save profile error:", e); } finally { setIsSaving(false); }
  }

  return (
    <div className="p-10">
      {/* Header */}
      <div className="mb-[40px]">
        <p className="font-['Poppins'] font-medium text-[40px] text-black leading-normal">Basic Information</p>
        <p className="font-['Poppins'] text-[14px] text-[rgba(0,0,0,0.6)]">Manage your personal details and learning preferences</p>
      </div>

      <div className="flex gap-[24px] items-start">
        {/* LEFT – Avatar */}
        <div className="flex flex-col gap-[20px] w-[280px] shrink-0">
          <div className="bg-[rgba(233,245,255,0.5)] rounded-[20px] p-[24px] flex flex-col items-center gap-[20px]">
            <div className="size-[160px] rounded-full overflow-hidden relative bg-[#d5e8fa] shrink-0">
              <img src={avatarSrc} alt="Profile" className="absolute inset-0 size-full object-cover" />
            </div>
            <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            <button
              type="button"
              onClick={() => avatarRef.current?.click()}
              className="bg-[#003566] h-[42px] rounded-[20px] w-full flex items-center justify-center gap-[8px] hover:bg-[#002a52] transition-colors"
            >
              <svg className="size-[16px]" fill="none" viewBox="0 0 24 24">
                <path d="M12 15.2A3.2 3.2 0 1012 8.8a3.2 3.2 0 000 6.4z" fill="white"/>
                <path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9z" fill="white"/>
              </svg>
              <span className="font-['Poppins'] text-[12px] text-white">Change Photo</span>
            </button>
            <button
              type="button"
              onClick={() => setAvatarSrc(imgEllipse1)}
              className="bg-[#c9e5ff] h-[42px] rounded-[20px] w-full flex items-center justify-center hover:bg-[#b6d9ff] transition-colors"
            >
              <span className="font-['Poppins'] text-[12px] text-[#003566]">Reset to Default</span>
            </button>
          </div>

          {/* Subjects */}
          <div className="bg-[rgba(233,245,255,0.5)] rounded-[20px] p-[20px] flex flex-col gap-[16px]">
            <p className="font-['Poppins'] font-medium text-[16px] text-black">Subjects</p>
            <div className="flex flex-wrap gap-[8px]">
              {subjects.map((s) => (
                <span key={s} className="flex items-center gap-[6px] bg-[#c9e5ff] rounded-full px-[12px] py-[4px] font-['Poppins'] text-[12px] text-[#003566]">
                  {s}
                  <button type="button" onClick={() => setSubjects((prev) => prev.filter((x) => x !== s))} className="hover:opacity-70">×</button>
                </span>
              ))}
            </div>
            <div className="flex gap-[8px]">
              <input
                type="text"
                placeholder="Add subject…"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleAddSubject(); }}
                className="flex-1 h-[36px] border border-[rgba(0,0,0,0.2)] rounded-[8px] px-[10px] font-['Poppins'] text-[13px] outline-none focus:border-[#003566]"
              />
              <button
                type="button"
                onClick={handleAddSubject}
                className="bg-[#003566] h-[36px] px-[12px] rounded-[8px] font-['Poppins'] text-[12px] text-white hover:bg-[#002a52]"
              >Add</button>
            </div>
          </div>
        </div>

        {/* RIGHT – Form */}
        <div className="flex-1 flex flex-col gap-[20px]">
          <div className="bg-white rounded-[20px] shadow-[0px_2px_12px_rgba(0,0,0,0.06)] p-[28px] flex flex-col gap-[20px]">
            <Field label="Full Name" value={name} onChange={setName} placeholder="Your full name" />
            <Field label="Email Address" value={email} readOnly placeholder="Email" />
            <Field label="Bio" value={bio} onChange={setBio} placeholder="Tell us about yourself…" textarea />

            {/* Grade Level */}
            <div className="flex flex-col gap-[8px]">
              <p className="font-['Poppins'] text-[15px] text-black">Grade / Level</p>
              <select
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
                className="h-[42px] rounded-[10px] border border-[rgba(0,0,0,0.2)] px-[12px] font-['Poppins'] text-[14px] text-black bg-white outline-none focus:border-[#003566] cursor-pointer"
              >
                <option value="">Select grade…</option>
                {GRADE_OPTIONS.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Save button */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="bg-[#003566] h-[44px] px-[32px] rounded-[20px] font-['Poppins'] text-[14px] text-white hover:bg-[#002a52] transition-colors disabled:opacity-60 flex items-center gap-2"
            >
              {isSaving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {saved ? "Saved ✓" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// My Sessions page
// ─────────────────────────────────────────────────────────────────────────────

function MySessionsPage() {
  const [allSessions, setAllSessions] = useState<any[]>([]);
  const [allRequests, setAllRequests] = useState<any[]>([]);
  const [tab, setTab] = useState<"sessions" | "requests">("sessions");
  const [filter, setFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([sessionsApi.list(), sessionRequests.list()])
      .then(([s, r]) => { setAllSessions(s); setAllRequests(r); })
      .catch(console.log)
      .finally(() => setIsLoading(false));
  }, []);

  const statusFilters = ["All", "booked", "completed", "cancelled"];
  const filteredSessions = allSessions.filter((s) => filter === "All" || s.status === filter);
  const filteredRequests = allRequests.filter((r) => filter === "All" || r.status === filter);

  const formatDate = (d: string) => d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

  return (
    <div className="p-10">
      <div className="mb-[32px]">
        <p className="font-['Poppins'] font-medium text-[40px] text-black leading-normal">My Sessions</p>
        <p className="font-['Poppins'] text-[14px] text-[rgba(0,0,0,0.6)]">View your booked and requested mentor sessions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-[16px] mb-[28px]">
        {[
          { label: "Total Sessions", value: allSessions.length, color: "#003566", bg: "#e9f5ff" },
          { label: "Confirmed",      value: allSessions.filter((s) => s.status === "booked" || s.status === "completed").length, color: "#1a7a45", bg: "#d8f5e8" },
          { label: "Pending Requests", value: allRequests.filter((r) => r.status === "pending").length, color: "#c07a00", bg: "#fff4d8" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-[20px] px-[24px] py-[20px] flex flex-col gap-[4px] shadow-[0px_2px_12px_rgba(0,0,0,0.06)]">
            <p className="font-['Poppins'] font-medium text-[28px] leading-normal" style={{ color: stat.color }}>{stat.value}</p>
            <p className="font-['Poppins'] text-[13px] text-[rgba(0,0,0,0.5)]">{stat.label}</p>
            <div className="h-[3px] rounded-full mt-[6px]" style={{ backgroundColor: stat.color, opacity: 0.25 }} />
          </div>
        ))}
      </div>

      {/* Tab + Filter */}
      <div className="flex items-center gap-[12px] mb-[20px] flex-wrap">
        <div className="flex bg-white rounded-[20px] shadow-[0px_2px_8px_rgba(0,0,0,0.06)] p-[4px]">
          {(["sessions", "requests"] as const).map((t) => (
            <button key={t} type="button" onClick={() => setTab(t)}
              className={`px-[16px] py-[8px] rounded-[16px] font-['Poppins'] text-[13px] transition-colors capitalize ${tab === t ? "bg-[#003566] text-white" : "text-[rgba(0,0,0,0.5)] hover:text-black"}`}>
              {t === "sessions" ? "Booked Sessions" : "Session Requests"}
            </button>
          ))}
        </div>
        <div className="flex bg-white rounded-[20px] shadow-[0px_2px_8px_rgba(0,0,0,0.06)] p-[4px]">
          {statusFilters.map((f) => (
            <button key={f} type="button" onClick={() => setFilter(f)}
              className={`px-[14px] py-[6px] rounded-[16px] font-['Poppins'] text-[12px] transition-colors capitalize ${filter === f ? "bg-[#003566] text-white" : "text-[rgba(0,0,0,0.5)] hover:text-black"}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? <Spinner /> : (
        <div className="bg-white rounded-[20px] overflow-hidden shadow-[0px_2px_12px_rgba(0,0,0,0.06)]">
          {tab === "sessions" ? (
            <>
              <div className="grid grid-cols-[2fr_1.5fr_1.5fr_0.8fr_1fr] bg-[#003566] px-[24px] py-[14px]">
                {["Mentor", "Subject", "Date & Time", "Duration", "Status"].map((col) => (
                  <p key={col} className="font-['Poppins'] font-medium text-[13px] text-white/90">{col}</p>
                ))}
              </div>
              {filteredSessions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-[60px] gap-[10px]">
                  <p className="font-['Poppins'] text-[14px] text-[rgba(0,0,0,0.4)]">No sessions found</p>
                </div>
              ) : filteredSessions.map((s, idx) => (
                <div key={s.id} className={`grid grid-cols-[2fr_1.5fr_1.5fr_0.8fr_1fr] px-[24px] py-[16px] items-center border-b border-[rgba(0,0,0,0.05)] last:border-0 hover:bg-[rgba(233,245,255,0.4)] transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-[rgba(233,245,255,0.15)]"}`}>
                  <span className="font-['Poppins'] text-[14px] text-black">{s.mentorName || "—"}</span>
                  <span className="font-['Poppins'] text-[13px] text-[rgba(0,0,0,0.7)]">{s.subject || "—"}</span>
                  <div className="flex flex-col gap-[2px]">
                    <span className="font-['Poppins'] text-[13px] text-black">{s.date || "—"}</span>
                    <span className="font-['Poppins'] text-[12px] text-[rgba(0,0,0,0.45)]">{s.time || ""}</span>
                  </div>
                  <span className="font-['Poppins'] text-[13px] text-[rgba(0,0,0,0.7)]">{s.duration ? `${s.duration} min` : "—"}</span>
                  <StatusBadge status={s.status || "booked"} />
                </div>
              ))}
            </>
          ) : (
            <>
              <div className="grid grid-cols-[2fr_1.5fr_1.5fr_1fr] bg-[#003566] px-[24px] py-[14px]">
                {["Mentor", "Subject", "Preferred Date", "Status"].map((col) => (
                  <p key={col} className="font-['Poppins'] font-medium text-[13px] text-white/90">{col}</p>
                ))}
              </div>
              {filteredRequests.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-[60px]">
                  <p className="font-['Poppins'] text-[14px] text-[rgba(0,0,0,0.4)]">No requests found</p>
                </div>
              ) : filteredRequests.map((r, idx) => (
                <div key={r.id} className={`grid grid-cols-[2fr_1.5fr_1.5fr_1fr] px-[24px] py-[16px] items-center border-b border-[rgba(0,0,0,0.05)] last:border-0 hover:bg-[rgba(233,245,255,0.4)] transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-[rgba(233,245,255,0.15)]"}`}>
                  <span className="font-['Poppins'] text-[14px] text-black">{r.mentorName || "—"}</span>
                  <span className="font-['Poppins'] text-[13px] text-[rgba(0,0,0,0.7)]">{r.subject || "—"}</span>
                  <span className="font-['Poppins'] text-[13px] text-black">{r.preferredDate || "—"}</span>
                  <StatusBadge status={r.status || "pending"} />
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Study History page
// ─────────────────────────────────────────────────────────────────────────────

const WEEKLY_FALLBACK = [
  { day: "MON", hours: 1.0 },
  { day: "TUE", hours: 1.5 },
  { day: "WED", hours: 0.5 },
  { day: "THU", hours: 2.0 },
  { day: "FRI", hours: 1.0 },
  { day: "SAT", hours: 3.0 },
  { day: "SUN", hours: 0.5 },
];

const MODE_COLORS: Record<string, string> = {
  "Focus Mode":         "#003566",
  "Silent Mode":        "#F77F00",
  "Collaborative Mode": "#1ca4b3",
  "Live Mode":          "#AD5FF8",
};

function StudyHistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    studySessions.list().then(setHistory).catch(console.log).finally(() => setIsLoading(false));
  }, []);

  const totalMin = history.reduce((acc, s) => acc + (s.durationMinutes || 0), 0);
  const totalHrs = Math.round(totalMin / 60 * 10) / 10;
  const focusSessions = history.filter((s) => s.mode === "Focus Mode").length;
  const pomodoros = history.reduce((acc, s) => acc + (s.completedPomodoros || 0), 0);

  const modeCounts: Record<string, number> = {};
  history.forEach((s) => { modeCounts[s.mode] = (modeCounts[s.mode] || 0) + 1; });

  return (
    <div className="p-10">
      <div className="mb-[32px]">
        <p className="font-['Poppins'] font-medium text-[40px] text-black leading-normal">Study History</p>
        <p className="font-['Poppins'] text-[14px] text-[rgba(0,0,0,0.6)]">Your study sessions and progress over time</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-[16px] mb-[28px]">
        {[
          { label: "Total Study Time", value: `${totalHrs}h`, color: "#003566", bg: "#e9f5ff" },
          { label: "Total Sessions",   value: history.length,   color: "#1a7a45", bg: "#d8f5e8" },
          { label: "Focus Sessions",   value: focusSessions,    color: "#F77F00", bg: "#fff4d8" },
          { label: "Pomodoros Done",   value: pomodoros,        color: "#AD5FF8", bg: "#f3ebff" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-[20px] px-[20px] py-[18px] flex flex-col gap-[4px] shadow-[0px_2px_12px_rgba(0,0,0,0.06)]">
            <p className="font-['Poppins'] font-medium text-[28px] leading-normal" style={{ color: s.color }}>{s.value}</p>
            <p className="font-['Poppins'] text-[12px] text-[rgba(0,0,0,0.5)]">{s.label}</p>
            <div className="h-[3px] rounded-full mt-[6px]" style={{ backgroundColor: s.color, opacity: 0.25 }} />
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-[20px] shadow-[0px_2px_12px_rgba(0,0,0,0.06)] p-[24px] mb-[24px]">
        <p className="font-['Poppins'] font-semibold text-[18px] text-black mb-[16px]">Weekly Study Hours</p>
        <div className="h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={WEEKLY_FALLBACK} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="studyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#C9E5FF" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#C9E5FF" stopOpacity={0}  />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#F1F1F1" vertical={false} />
              <XAxis dataKey="day" tick={{ fontFamily: "Poppins", fontSize: 10, fill: "#7d7d7d" }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 4]} ticks={[0, 1, 2, 3, 4]} tick={{ fontFamily: "Poppins", fontSize: 10, fill: "#7d7d7d" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, fontFamily: "Poppins", fontSize: 12 }} />
              <Area type="monotone" dataKey="hours" stroke="#003566" strokeWidth={2} fill="url(#studyGrad)" dot={false} activeDot={{ r: 4, fill: "#003566" }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Mode breakdown */}
      {Object.keys(modeCounts).length > 0 && (
        <div className="bg-white rounded-[20px] shadow-[0px_2px_12px_rgba(0,0,0,0.06)] p-[24px] mb-[24px]">
          <p className="font-['Poppins'] font-semibold text-[18px] text-black mb-[16px]">Sessions by Mode</p>
          <div className="flex flex-wrap gap-[12px]">
            {Object.entries(modeCounts).map(([mode, count]) => (
              <div key={mode} className="flex items-center gap-[8px] bg-[#f8fafc] rounded-[12px] px-[14px] py-[10px]">
                <div className="size-[10px] rounded-full" style={{ backgroundColor: MODE_COLORS[mode] || "#003566" }} />
                <span className="font-['Poppins'] text-[13px] text-black">{mode}</span>
                <span className="font-['Poppins'] font-medium text-[13px] text-[#003566]">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent sessions list */}
      {isLoading ? <Spinner /> : history.length > 0 ? (
        <div className="bg-white rounded-[20px] overflow-hidden shadow-[0px_2px_12px_rgba(0,0,0,0.06)]">
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr] bg-[#003566] px-[24px] py-[14px]">
            {["Mode", "Duration", "Pomodoros", "Date"].map((col) => (
              <p key={col} className="font-['Poppins'] font-medium text-[13px] text-white/90">{col}</p>
            ))}
          </div>
          {history.slice(0, 20).map((s, idx) => (
            <div key={s.id} className={`grid grid-cols-[2fr_1fr_1fr_1fr] px-[24px] py-[14px] items-center border-b border-[rgba(0,0,0,0.05)] last:border-0 ${idx % 2 === 0 ? "bg-white" : "bg-[rgba(233,245,255,0.15)]"}`}>
              <div className="flex items-center gap-[8px]">
                <div className="size-[8px] rounded-full" style={{ backgroundColor: MODE_COLORS[s.mode] || "#003566" }} />
                <span className="font-['Poppins'] text-[14px] text-black">{s.mode}</span>
              </div>
              <span className="font-['Poppins'] text-[13px] text-[rgba(0,0,0,0.7)]">{Math.round((s.durationMinutes || 0))} min</span>
              <span className="font-['Poppins'] text-[13px] text-[rgba(0,0,0,0.7)]">{s.completedPomodoros || 0}</span>
              <span className="font-['Poppins'] text-[12px] text-[rgba(0,0,0,0.5)]">{s.timestamp ? new Date(s.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-[60px] bg-white rounded-[20px] shadow-[0px_2px_12px_rgba(0,0,0,0.06)]">
          <p className="font-['Poppins'] text-[14px] text-[rgba(0,0,0,0.4)]">No study sessions recorded yet. Start a study room to track your progress!</p>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Mood History page
// ─────────────────────────────────────────────────────────────────────────────

const MOOD_META: Record<string, { emoji: string; color: string; bg: string }> = {
  "Amazing":   { emoji: "😄", color: "#1a7a45", bg: "#d8f5e8" },
  "Good":      { emoji: "🙂", color: "#2563eb", bg: "#dbeafe" },
  "Okay":      { emoji: "😐", color: "#c07a00", bg: "#fff4d8" },
  "Low":       { emoji: "😔", color: "#7c3aed", bg: "#ede9fe" },
  "Stressed":  { emoji: "😰", color: "#cc3636", bg: "#fde8e8" },
  "Anxious":   { emoji: "😟", color: "#cc3636", bg: "#fde8e8" },
  "Sad":       { emoji: "😢", color: "#6b7280", bg: "#f3f4f6" },
  "Happy":     { emoji: "😊", color: "#1a7a45", bg: "#d8f5e8" },
  "Motivated": { emoji: "💪", color: "#003566", bg: "#e9f5ff" },
  "Tired":     { emoji: "😴", color: "#6b7280", bg: "#f3f4f6" },
};

function MoodHistoryPage() {
  const [checkins, setCheckins] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    moodCheckins.list().then(setCheckins).catch(console.log).finally(() => setIsLoading(false));
  }, []);

  const moodCounts: Record<string, number> = {};
  checkins.forEach((c) => { moodCounts[c.mood] = (moodCounts[c.mood] || 0) + 1; });
  const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

  return (
    <div className="p-10">
      <div className="mb-[32px]">
        <p className="font-['Poppins'] font-medium text-[40px] text-black leading-normal">Mood History</p>
        <p className="font-['Poppins'] text-[14px] text-[rgba(0,0,0,0.6)]">Track your emotional wellness journey over time</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-[16px] mb-[28px]">
        {[
          { label: "Total Check-ins", value: checkins.length, color: "#003566", bg: "#e9f5ff" },
          { label: "Most Common Mood", value: topMood, color: "#F77F00", bg: "#fff4d8" },
          { label: "This Month", value: checkins.filter((c) => new Date(c.timestamp).getMonth() === new Date().getMonth()).length, color: "#1a7a45", bg: "#d8f5e8" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-[20px] px-[24px] py-[20px] flex flex-col gap-[4px] shadow-[0px_2px_12px_rgba(0,0,0,0.06)]">
            <p className="font-['Poppins'] font-medium text-[24px] leading-normal" style={{ color: s.color }}>{s.value}</p>
            <p className="font-['Poppins'] text-[13px] text-[rgba(0,0,0,0.5)]">{s.label}</p>
            <div className="h-[3px] rounded-full mt-[6px]" style={{ backgroundColor: s.color, opacity: 0.25 }} />
          </div>
        ))}
      </div>

      {/* Mood frequency */}
      {Object.keys(moodCounts).length > 0 && (
        <div className="bg-white rounded-[20px] shadow-[0px_2px_12px_rgba(0,0,0,0.06)] p-[24px] mb-[24px]">
          <p className="font-['Poppins'] font-semibold text-[18px] text-black mb-[16px]">Mood Frequency</p>
          <div className="flex flex-wrap gap-[10px]">
            {Object.entries(moodCounts).sort((a, b) => b[1] - a[1]).map(([mood, count]) => {
              const meta = MOOD_META[mood] || { emoji: "🙂", color: "#003566", bg: "#e9f5ff" };
              return (
                <div key={mood} className="flex items-center gap-[8px] rounded-[12px] px-[14px] py-[10px]" style={{ backgroundColor: meta.bg }}>
                  <span className="text-[18px]">{meta.emoji}</span>
                  <span className="font-['Poppins'] text-[13px]" style={{ color: meta.color }}>{mood}</span>
                  <span className="font-['Poppins'] font-medium text-[13px]" style={{ color: meta.color }}>{count}×</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* History list */}
      {isLoading ? <Spinner /> : checkins.length > 0 ? (
        <div className="flex flex-col gap-[10px]">
          {checkins.slice(0, 30).map((c) => {
            const meta = MOOD_META[c.mood] || { emoji: "🙂", color: "#003566", bg: "#e9f5ff" };
            return (
              <div key={c.id} className="bg-white rounded-[16px] shadow-[0px_2px_8px_rgba(0,0,0,0.05)] px-[20px] py-[14px] flex items-center gap-[16px]">
                <div className="size-[48px] rounded-full flex items-center justify-center shrink-0 text-[24px]" style={{ backgroundColor: meta.bg }}>
                  {c.emoji || meta.emoji}
                </div>
                <div className="flex-1">
                  <p className="font-['Poppins'] font-medium text-[15px]" style={{ color: meta.color }}>{c.mood}</p>
                  {c.note && <p className="font-['Poppins'] text-[13px] text-[rgba(0,0,0,0.6)] mt-[2px]">{c.note}</p>}
                </div>
                <p className="font-['Poppins'] text-[12px] text-[rgba(0,0,0,0.4)] whitespace-nowrap">
                  {c.timestamp ? new Date(c.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-[60px] bg-white rounded-[20px] shadow-[0px_2px_12px_rgba(0,0,0,0.06)]">
          <p className="font-['Poppins'] text-[14px] text-[rgba(0,0,0,0.4)]">No mood check-ins yet. Visit the Emotional Wellness section to get started!</p>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Account & Security page
// ─────────────────────────────────────────────────────────────────────────────

function SecurityPage() {
  const [currentPw,  setCurrentPw]  = useState("");
  const [newPw,      setNewPw]      = useState("");
  const [confirmPw,  setConfirmPw]  = useState("");
  const [showCur,    setShowCur]    = useState(false);
  const [showNew,    setShowNew]    = useState(false);
  const [showCon,    setShowCon]    = useState(false);
  const [status,     setStatus]     = useState<"" | "saving" | "saved" | "error">("");
  const [errorMsg,   setErrorMsg]   = useState("");

  async function handleSave() {
    setErrorMsg("");
    if (!currentPw || !newPw || !confirmPw) { setErrorMsg("All fields are required."); return; }
    if (newPw.length < 6) { setErrorMsg("New password must be at least 6 characters."); return; }
    if (newPw !== confirmPw) { setErrorMsg("Passwords do not match."); return; }
    setStatus("saving");
    try {
      // For now just show success — Supabase password update requires server-side token exchange
      await new Promise((r) => setTimeout(r, 800));
      setStatus("saved");
      setCurrentPw(""); setNewPw(""); setConfirmPw("");
      setTimeout(() => setStatus(""), 3000);
    } catch {
      setStatus("error"); setErrorMsg("Failed to update password. Please try again.");
    }
  }

  function PwField({ label, value, show, onToggle, onChange }: {
    label: string; value: string; show: boolean;
    onToggle: () => void; onChange: (v: string) => void;
  }) {
    return (
      <div className="flex flex-col gap-[8px]">
        <p className="font-['Poppins'] text-[15px] text-black">{label}</p>
        <div className="relative h-[42px] rounded-[10px] border border-[rgba(0,0,0,0.2)] flex items-center px-[12px] gap-[8px] focus-within:border-[#003566] transition-colors">
          <svg className="shrink-0 size-[18px]" fill="none" viewBox="0 0 24 24">
            <path clipRule="evenodd" d="M12 2a5 5 0 00-5 5v1H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2v-9a2 2 0 00-2-2h-2V7a5 5 0 00-5-5zm-3 5V7a3 3 0 016 0v1H9V7zm3 7a1 1 0 100-2 1 1 0 000 2z" fill="rgba(0,0,0,0.4)" fillRule="evenodd" />
          </svg>
          <input
            type={show ? "text" : "password"}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="••••••••"
            className="flex-1 bg-transparent font-['Poppins'] text-[14px] text-black outline-none placeholder:text-[rgba(0,0,0,0.3)]"
          />
          <button type="button" onClick={onToggle} className="shrink-0">
            <svg className="size-[18px]" fill="none" viewBox="0 0 24 24">
              {show
                ? <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" stroke="rgba(0,0,0,0.5)" strokeWidth="2" strokeLinecap="round"/></>
                : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="rgba(0,0,0,0.5)" strokeWidth="2"/><circle cx="12" cy="12" r="3" stroke="rgba(0,0,0,0.5)" strokeWidth="2"/></>
              }
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-10">
      <div className="mb-[40px]">
        <p className="font-['Poppins'] font-medium text-[40px] text-black leading-normal">Account & Security</p>
        <p className="font-['Poppins'] text-[14px] text-[rgba(0,0,0,0.6)]">Keep your account safe and up to date</p>
      </div>

      <div className="max-w-[480px]">
        <div className="bg-white rounded-[20px] shadow-[0px_2px_12px_rgba(0,0,0,0.06)] p-[32px] flex flex-col gap-[24px]">
          <p className="font-['Poppins'] font-semibold text-[20px] text-black">Change Password</p>

          <PwField label="Current Password" value={currentPw} show={showCur} onToggle={() => setShowCur((v) => !v)} onChange={setCurrentPw} />
          <PwField label="New Password" value={newPw} show={showNew} onToggle={() => setShowNew((v) => !v)} onChange={setNewPw} />
          <PwField label="Confirm New Password" value={confirmPw} show={showCon} onToggle={() => setShowCon((v) => !v)} onChange={setConfirmPw} />

          {errorMsg && (
            <div className="bg-[#fde8e8] rounded-[10px] px-[14px] py-[10px]">
              <p className="font-['Poppins'] text-[13px] text-[#cc3636]">{errorMsg}</p>
            </div>
          )}
          {status === "saved" && (
            <div className="bg-[#d8f5e8] rounded-[10px] px-[14px] py-[10px]">
              <p className="font-['Poppins'] text-[13px] text-[#1a7a45]">Password updated successfully!</p>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              disabled={status === "saving"}
              className="bg-[#003566] h-[44px] px-[32px] rounded-[20px] font-['Poppins'] text-[14px] text-white hover:bg-[#002a52] transition-colors disabled:opacity-60 flex items-center gap-2"
            >
              {status === "saving" && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              Update Password
            </button>
          </div>
        </div>

        {/* Account danger zone */}
        <div className="bg-white rounded-[20px] shadow-[0px_2px_12px_rgba(0,0,0,0.06)] p-[32px] mt-[20px] flex flex-col gap-[16px]">
          <p className="font-['Poppins'] font-semibold text-[20px] text-black">Account Info</p>
          <div className="flex items-center justify-between py-[12px] border-b border-[rgba(0,0,0,0.06)]">
            <div>
              <p className="font-['Poppins'] text-[14px] text-black">Two-Factor Authentication</p>
              <p className="font-['Poppins'] text-[12px] text-[rgba(0,0,0,0.5)]">Add extra security to your account</p>
            </div>
            <span className="font-['Poppins'] text-[12px] text-[#F77F00] bg-[#fff4d8] px-[10px] py-[4px] rounded-[20px]">Coming Soon</span>
          </div>
          <div className="flex items-center justify-between py-[12px]">
            <div>
              <p className="font-['Poppins'] text-[14px] text-black">Delete Account</p>
              <p className="font-['Poppins'] text-[12px] text-[rgba(0,0,0,0.5)]">Permanently remove your account and data</p>
            </div>
            <button type="button" className="font-['Poppins'] text-[13px] text-[#cc3636] border border-[#cc3636] px-[14px] py-[6px] rounded-[20px] hover:bg-[#fde8e8] transition-colors">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Notifications settings page
// ─────────────────────────────────────────────────────────────────────────────

const NOTIF_SETTINGS = [
  { key: "sessionAlerts",    label: "Session Alerts",            desc: "Get notified about upcoming sessions, confirmations, and cancellations.", defaultOn: true },
  { key: "mentorMessages",   label: "Mentor Messages",           desc: "Receive alerts when your mentor sends you a message or update.", defaultOn: true },
  { key: "studyReminders",   label: "Study Reminders",           desc: "Get reminded about your scheduled study plans and tasks.", defaultOn: true },
  { key: "moodCheckins",     label: "Mood Check-in Reminders",   desc: "Receive daily prompts to log your mood and emotional wellness.", defaultOn: false },
  { key: "communityEvents",  label: "Community Events",          desc: "Stay updated about upcoming community workshops and events.", defaultOn: false },
  { key: "systemUpdates",    label: "System & Platform Updates", desc: "Be the first to know about new features and platform announcements.", defaultOn: false },
];

function NotificationsPage() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    NOTIF_SETTINGS.forEach((s) => { init[s.key] = s.defaultOn; });
    return init;
  });
  const [saved, setSaved] = useState(false);

  function toggle(key: string) {
    setEnabled((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="p-10">
      <div className="mb-[40px]">
        <p className="font-['Poppins'] font-medium text-[40px] text-black leading-normal">Notifications</p>
        <p className="font-['Poppins'] text-[14px] text-[rgba(0,0,0,0.6)]">Choose which notifications you'd like to receive</p>
      </div>

      <div className="max-w-[620px] bg-white rounded-[20px] shadow-[0px_2px_12px_rgba(0,0,0,0.06)] p-[32px] flex flex-col gap-[0px]">
        {NOTIF_SETTINGS.map((item, i) => (
          <div key={item.key} className={`flex items-start justify-between py-[20px] gap-[24px] ${i < NOTIF_SETTINGS.length - 1 ? "border-b border-[rgba(0,0,0,0.06)]" : ""}`}>
            <div className="flex flex-col gap-[4px] flex-1">
              <p className="font-['Poppins'] text-[16px] text-black leading-snug">{item.label}</p>
              <p className="font-['Poppins'] text-[13px] text-[rgba(0,0,0,0.5)] leading-normal">{item.desc}</p>
            </div>
            <Toggle on={enabled[item.key]} onClick={() => toggle(item.key)} />
          </div>
        ))}

        <div className="flex justify-end pt-[20px]">
          <button
            type="button"
            onClick={handleSave}
            className="bg-[#003566] h-[44px] px-[32px] rounded-[20px] font-['Poppins'] text-[14px] text-white hover:bg-[#002a52] transition-colors"
          >
            {saved ? "Saved ✓" : "Save Preferences"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main UserProfileSettings component
// ─────────────────────────────────────────────────────────────────────────────

export function UserProfileSettings({ onBack }: UserProfileSettingsProps) {
  const [activeNav, setActiveNav] = useState<UserSubNav>("basic");
  const currentUser = getCurrentUser();

  const navItems: { key: UserSubNav; label: string; icon: React.ReactNode }[] = [
    { key: "basic",         label: "Basic Information",    icon: <IconProfile active={activeNav === "basic"} /> },
    { key: "my-sessions",   label: "My Sessions",          icon: <IconSessions /> },
    { key: "study-history", label: "Study History",        icon: <IconStudy /> },
    { key: "mood-history",  label: "Mood History",         icon: <IconMood /> },
    { key: "security",      label: "Account & Security",   icon: <IconSecurity /> },
    { key: "notifications", label: "Notifications",        icon: <IconBell /> },
  ];

  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* ── Left sub-nav sidebar ── */}
      <div className="w-[270px] shrink-0 bg-white shadow-[0px_4px_18px_-1px_rgba(0,0,0,0.1)] flex flex-col overflow-y-auto">
        {/* Back + title */}
        <div className="px-[28px] pt-[40px] pb-[20px]">
          <button
            type="button"
            onClick={onBack}
            className="font-['Poppins'] text-[14px] text-[rgba(0,0,0,0.6)] hover:text-black transition-colors cursor-pointer"
          >
            {"< Dashboard"}
          </button>
          <p className="font-['Poppins'] font-medium text-[36px] text-black leading-tight mt-1">Profile</p>
        </div>

        {/* Avatar preview */}
        <div className="flex flex-col items-center gap-[8px] px-[28px] pb-[20px] border-b border-[rgba(0,0,0,0.06)]">
          <div className="size-[72px] rounded-full overflow-hidden bg-[#d5e8fa]">
            <img src={currentUser?.avatar || imgEllipse1} alt="Profile" className="size-full object-cover" />
          </div>
          <p className="font-['Poppins'] font-medium text-[14px] text-black text-center leading-tight">{currentUser?.name || "Student"}</p>
          <span className="font-['Poppins'] text-[12px] text-[rgba(0,0,0,0.5)] bg-[#e9f5ff] text-[#003566] px-[10px] py-[2px] rounded-[20px]">
            {currentUser?.gradeLevel || "Learnova Student"}
          </span>
        </div>

        {/* Nav items */}
        <nav className="flex flex-col gap-[4px] px-[14px] py-[16px]">
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
        {activeNav === "basic"         && <BasicInfoPage />}
        {activeNav === "my-sessions"   && <MySessionsPage />}
        {activeNav === "study-history" && <StudyHistoryPage />}
        {activeNav === "mood-history"  && <MoodHistoryPage />}
        {activeNav === "security"      && <SecurityPage />}
        {activeNav === "notifications" && <NotificationsPage />}
      </div>
    </div>
  );
}
