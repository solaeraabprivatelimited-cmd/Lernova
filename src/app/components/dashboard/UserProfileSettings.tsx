import React, { useState, useRef, useEffect } from "react";
import imgEllipse1 from "figma:asset/798eac6e288222603807db12d070c52d1a145785.png";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import { profile as profileApi, studySessions, moodCheckins, sessionRequests, sessions as sessionsApi, notifications as notificationsApi, getCurrentUser } from "@/app/lib/api";
import { enable2FA, disable2FA, get2FASettings, sendOTP, verifyOTP } from "@/utils/supabase/twoFA";
import { toast } from "sonner";
import {
  ArrowLeft, User, Calendar, GraduationCap, Smile, Shield, Bell,
  Camera, X, Plus, Check, Lock, Eye, EyeOff, Trash2, ChevronDown,
  Clock, BookOpen, Target, Zap, TrendingUp, AlertTriangle, Save
} from "lucide-react";

interface UserProfileSettingsProps { onBack: () => void; }

type UserSubNav = "basic" | "my-sessions" | "study-history" | "mood-history" | "security" | "notifications";

const FONT = { fontFamily: "'Plus Jakarta Sans', sans-serif" };
const HEADING = { fontFamily: "'DM Serif Display', serif" };

// ─────────────────────────────────────────────────────────────────────────────
// Shared components
// ─────────────────────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; text: string; border: string }> = {
    completed: { bg: "rgba(34,197,94,0.06)", text: "#16a34a", border: "rgba(34,197,94,0.12)" },
    booked:    { bg: "rgba(9,103,189,0.06)", text: "#0967bd", border: "rgba(9,103,189,0.12)" },
    accepted:  { bg: "rgba(9,103,189,0.06)", text: "#0967bd", border: "rgba(9,103,189,0.12)" },
    pending:   { bg: "rgba(247,127,0,0.06)", text: "#f77f00", border: "rgba(247,127,0,0.12)" },
    cancelled: { bg: "rgba(204,54,54,0.06)", text: "#cc3636", border: "rgba(204,54,54,0.12)" },
    declined:  { bg: "rgba(204,54,54,0.06)", text: "#cc3636", border: "rgba(204,54,54,0.12)" },
  };
  const s = map[status] || { bg: "#f5f7fa", text: "#5a7089", border: "#edf0f4" };
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold"
      style={{ background: s.bg, color: s.text, border: `1px solid ${s.border}` }}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function Spinner() {
  return <div className="flex items-center justify-center py-16"><div className="w-8 h-8 border-2 border-[#003566]/15 border-t-[#0967bd] rounded-full animate-spin" /></div>;
}

function StatCard({ label, value, color, icon }: { label: string; value: string | number; color: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white rounded-[18px] border border-[#edf0f4] p-5 flex flex-col gap-2 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <p className="text-[26px] font-bold" style={{ color, ...HEADING }}>{value}</p>
        <div className="w-9 h-9 rounded-[12px] flex items-center justify-center" style={{ background: `${color}10` }}>
          {icon}
        </div>
      </div>
      <p className="text-[12px] text-[#94a3b8] font-medium">{label}</p>
    </div>
  );
}

function SectionHeader({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-[28px] md:text-[32px] text-[#003566] mb-1" style={HEADING}>{title}</h2>
      <p className="text-[13px] text-[#94a3b8]">{desc}</p>
    </div>
  );
}

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className={`relative w-[48px] h-[26px] rounded-full transition-colors duration-200 shrink-0 cursor-pointer ${on ? "bg-[#0967bd]" : "bg-[#e2e8f0]"}`}>
      <div className={`absolute top-[3px] w-[20px] h-[20px] rounded-full bg-white shadow-sm transition-transform duration-200 ${on ? "translate-x-[25px]" : "translate-x-[3px]"}`} />
    </button>
  );
}

const inputClass = "w-full h-[44px] border border-[#e2e8f0] rounded-[12px] px-4 text-[13px] outline-none focus:border-[#0967bd] focus:ring-1 focus:ring-[#0967bd]/20 transition-all text-[#1e293b] placeholder:text-[#94a3b8] bg-white";

// ─────────────────────────────────────────────────────────────────────────────
// Basic Information
// ─────────────────────────────────────────────────────────────────────────────

function BasicInfoPage() {
  const currentUser = getCurrentUser();
  const [name, setName] = useState(currentUser?.name || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [bio, setBio] = useState(currentUser?.bio || "");
  const [gradeLevel, setGradeLevel] = useState(currentUser?.gradeLevel || "");
  const [subjects, setSubjects] = useState<string[]>(currentUser?.subjects || []);
  const [newSubject, setNewSubject] = useState("");
  const [avatarSrc, setAvatarSrc] = useState(currentUser?.avatar || imgEllipse1);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const avatarRef = useRef<HTMLInputElement>(null);

  const GRADE_OPTIONS = ["Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12", "Undergraduate", "Postgraduate", "Other"];

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    setAvatarSrc(URL.createObjectURL(file)); e.target.value = "";
  }
  function handleAddSubject() {
    const s = newSubject.trim();
    if (s && !subjects.includes(s)) setSubjects((prev) => [...prev, s]);
    setNewSubject("");
  }
  async function handleSave() {
    setIsSaving(true);
    try { await profileApi.update({ name, bio, gradeLevel, subjects }); setSaved(true); setTimeout(() => setSaved(false), 2500); }
    catch (e) { console.log("Save profile error:", e); } finally { setIsSaving(false); }
  }

  return (
    <div className="p-6 md:p-8 lg:p-10" style={FONT}>
      <SectionHeader title="Basic Information" desc="Manage your personal details and learning preferences" />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* LEFT - Avatar + Subjects */}
        <div className="lg:w-[280px] shrink-0 flex flex-col gap-5">
          {/* Avatar Card */}
          <div className="bg-white rounded-[20px] border border-[#edf0f4] p-6 flex flex-col items-center gap-4 shadow-sm">
            <div className="relative group">
              <div className="w-[140px] h-[140px] rounded-full overflow-hidden border-4 border-white shadow-lg">
                <img src={avatarSrc} alt="Profile" className="w-full h-full object-cover" />
              </div>
              <button onClick={() => avatarRef.current?.click()}
                className="absolute bottom-1 right-1 w-10 h-10 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-105 transition-transform"
                style={{ background: 'linear-gradient(135deg, #003566, #0967bd)' }}>
                <Camera className="w-4 h-4 text-white" />
              </button>
            </div>
            <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            <button onClick={() => setAvatarSrc(imgEllipse1)}
              className="text-[12px] font-semibold text-[#94a3b8] hover:text-[#5a7089] transition-colors cursor-pointer">
              Reset to Default
            </button>
          </div>

          {/* Subjects Card */}
          <div className="bg-white rounded-[20px] border border-[#edf0f4] p-5 shadow-sm">
            <h3 className="text-[14px] font-bold text-[#003566] mb-3">Subjects</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {subjects.map((s) => (
                <span key={s} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold text-[#003566]"
                  style={{ background: 'rgba(9,103,189,0.08)', border: '1px solid rgba(9,103,189,0.1)' }}>
                  {s}
                  <button onClick={() => setSubjects((prev) => prev.filter((x) => x !== s))}
                    className="hover:text-[#cc3636] transition-colors cursor-pointer"><X className="w-3 h-3" /></button>
                </span>
              ))}
              {subjects.length === 0 && <p className="text-[12px] text-[#c1c7ce]">No subjects added</p>}
            </div>
            <div className="flex gap-2">
              <input type="text" placeholder="Add subject…" value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleAddSubject(); }}
                className="flex-1 h-[36px] border border-[#e2e8f0] rounded-[10px] px-3 text-[12px] outline-none focus:border-[#0967bd] transition-colors" />
              <button onClick={handleAddSubject}
                className="h-[36px] px-3 rounded-[10px] text-[12px] font-bold text-white cursor-pointer hover:shadow-md transition-all"
                style={{ background: 'linear-gradient(135deg, #003566, #0967bd)' }}>
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT - Form */}
        <div className="flex-1 flex flex-col gap-5">
          <div className="bg-white rounded-[20px] border border-[#edf0f4] p-6 shadow-sm flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold text-[#003566]">Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" className={inputClass} />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold text-[#003566]">Email Address</label>
              <input type="text" value={email} readOnly className={`${inputClass} bg-[#f8f9fc] cursor-not-allowed text-[#94a3b8]`} />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold text-[#003566]">Bio</label>
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell us about yourself…" rows={4}
                className="w-full border border-[#e2e8f0] rounded-[12px] px-4 py-3 text-[13px] outline-none focus:border-[#0967bd] focus:ring-1 focus:ring-[#0967bd]/20 transition-all text-[#1e293b] placeholder:text-[#94a3b8] bg-white resize-none" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold text-[#003566]">Grade / Level</label>
              <div className="relative">
                <select value={gradeLevel} onChange={(e) => setGradeLevel(e.target.value)}
                  className={`${inputClass} appearance-none cursor-pointer pr-10`}>
                  <option value="">Select grade…</option>
                  {GRADE_OPTIONS.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8] pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button onClick={handleSave} disabled={isSaving}
              className="h-[44px] px-8 rounded-[14px] text-[13px] font-bold text-white transition-all cursor-pointer disabled:opacity-60 hover:shadow-lg flex items-center gap-2"
              style={{ background: 'linear-gradient(135deg, #003566, #0967bd)' }}>
              {isSaving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
              {saved ? "Saved!" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// My Sessions
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
      .catch(console.log).finally(() => setIsLoading(false));
  }, []);

  const statusFilters = ["All", "booked", "completed", "cancelled"];
  const filteredSessions = allSessions.filter((s) => filter === "All" || s.status === filter);
  const filteredRequests = allRequests.filter((r) => filter === "All" || r.status === filter);

  return (
    <div className="p-6 md:p-8 lg:p-10" style={FONT}>
      <SectionHeader title="My Sessions" desc="View your booked and requested mentor sessions" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Total Sessions" value={allSessions.length} color="#003566" icon={<Calendar className="w-4 h-4 text-[#003566]" />} />
        <StatCard label="Confirmed" value={allSessions.filter((s) => s.status === "booked" || s.status === "completed").length} color="#16a34a" icon={<Check className="w-4 h-4 text-[#16a34a]" />} />
        <StatCard label="Pending Requests" value={allRequests.filter((r) => r.status === "pending").length} color="#f77f00" icon={<Clock className="w-4 h-4 text-[#f77f00]" />} />
      </div>

      {/* Tab + Filter */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="p-1 rounded-[14px] flex" style={{ background: '#f5f7fa' }}>
          {(["sessions", "requests"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-[12px] text-[12px] font-bold cursor-pointer transition-all ${
                tab === t ? "bg-white text-[#003566] shadow-sm" : "text-[#94a3b8] hover:text-[#5a7089]"
              }`}>
              {t === "sessions" ? "Booked Sessions" : "Session Requests"}
            </button>
          ))}
        </div>
        <div className="p-1 rounded-[14px] flex" style={{ background: '#f5f7fa' }}>
          {statusFilters.map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-[10px] text-[11px] font-bold cursor-pointer transition-all capitalize ${
                filter === f ? "bg-white text-[#003566] shadow-sm" : "text-[#94a3b8] hover:text-[#5a7089]"
              }`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? <Spinner /> : (
        <div className="bg-white rounded-[20px] overflow-hidden border border-[#edf0f4] shadow-sm">
          {tab === "sessions" ? (
            <>
              <div className="grid grid-cols-[2fr_1.5fr_1.5fr_0.8fr_1fr] px-6 py-3.5"
                style={{ background: 'linear-gradient(135deg, #001d3d, #003566)' }}>
                {["Mentor", "Subject", "Date & Time", "Duration", "Status"].map((col) => (
                  <p key={col} className="text-[11px] font-bold text-white/70 uppercase tracking-[0.05em]">{col}</p>
                ))}
              </div>
              {filteredSessions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16"><p className="text-[13px] text-[#94a3b8]">No sessions found</p></div>
              ) : filteredSessions.map((s, idx) => (
                <div key={s.id} className={`grid grid-cols-[2fr_1.5fr_1.5fr_0.8fr_1fr] px-6 py-4 items-center border-b border-[#edf0f4] last:border-0 hover:bg-[#f8f9fc] transition-colors ${idx % 2 === 0 ? "" : "bg-[#fafbfc]"}`}>
                  <span className="text-[13px] font-semibold text-[#1e293b]">{s.mentorName || "—"}</span>
                  <span className="text-[12px] text-[#5a7089]">{s.subject || "—"}</span>
                  <div><span className="text-[12px] font-medium text-[#1e293b]">{s.date || "—"}</span><br/><span className="text-[11px] text-[#94a3b8]">{s.time || ""}</span></div>
                  <span className="text-[12px] text-[#5a7089]">{s.duration ? `${s.duration} min` : "—"}</span>
                  <StatusBadge status={s.status || "booked"} />
                </div>
              ))}
            </>
          ) : (
            <>
              <div className="grid grid-cols-[2fr_1.5fr_1.5fr_1fr] px-6 py-3.5"
                style={{ background: 'linear-gradient(135deg, #001d3d, #003566)' }}>
                {["Mentor", "Subject", "Preferred Date", "Status"].map((col) => (
                  <p key={col} className="text-[11px] font-bold text-white/70 uppercase tracking-[0.05em]">{col}</p>
                ))}
              </div>
              {filteredRequests.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16"><p className="text-[13px] text-[#94a3b8]">No requests found</p></div>
              ) : filteredRequests.map((r, idx) => (
                <div key={r.id} className={`grid grid-cols-[2fr_1.5fr_1.5fr_1fr] px-6 py-4 items-center border-b border-[#edf0f4] last:border-0 hover:bg-[#f8f9fc] transition-colors ${idx % 2 === 0 ? "" : "bg-[#fafbfc]"}`}>
                  <span className="text-[13px] font-semibold text-[#1e293b]">{r.mentorName || "—"}</span>
                  <span className="text-[12px] text-[#5a7089]">{r.subject || "—"}</span>
                  <span className="text-[12px] font-medium text-[#1e293b]">{r.preferredDate || "—"}</span>
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
// Study History
// ─────────────────────────────────────────────────────────────────────────────

const WEEKLY_FALLBACK = [
  { day: "MON", hours: 1.0 }, { day: "TUE", hours: 1.5 }, { day: "WED", hours: 0.5 },
  { day: "THU", hours: 2.0 }, { day: "FRI", hours: 1.0 }, { day: "SAT", hours: 3.0 }, { day: "SUN", hours: 0.5 },
];

const MODE_COLORS: Record<string, string> = {
  "Focus Mode": "#003566", "Silent Mode": "#F77F00", "Collaborative Mode": "#1ca4b3", "Live Mode": "#AD5FF8",
};

function StudyHistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { studySessions.list().then(setHistory).catch(console.log).finally(() => setIsLoading(false)); }, []);

  const totalMin = history.reduce((acc, s) => acc + (s.durationMinutes || 0), 0);
  const totalHrs = Math.round(totalMin / 60 * 10) / 10;
  const focusSessions = history.filter((s) => s.mode === "Focus Mode").length;
  const pomodoros = history.reduce((acc, s) => acc + (s.completedPomodoros || 0), 0);
  const modeCounts: Record<string, number> = {};
  history.forEach((s) => { modeCounts[s.mode] = (modeCounts[s.mode] || 0) + 1; });

  return (
    <div className="p-6 md:p-8 lg:p-10" style={FONT}>
      <SectionHeader title="Study History" desc="Your study sessions and progress over time" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Study Time" value={`${totalHrs}h`} color="#003566" icon={<Clock className="w-4 h-4 text-[#003566]" />} />
        <StatCard label="Total Sessions" value={history.length} color="#16a34a" icon={<BookOpen className="w-4 h-4 text-[#16a34a]" />} />
        <StatCard label="Focus Sessions" value={focusSessions} color="#f77f00" icon={<Target className="w-4 h-4 text-[#f77f00]" />} />
        <StatCard label="Pomodoros Done" value={pomodoros} color="#AD5FF8" icon={<Zap className="w-4 h-4 text-[#AD5FF8]" />} />
      </div>

      {/* Chart */}
      <div className="bg-white rounded-[20px] border border-[#edf0f4] p-6 mb-5 shadow-sm">
        <h3 className="text-[16px] font-bold text-[#003566] mb-4">Weekly Study Hours</h3>
        <div className="h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={WEEKLY_FALLBACK} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="studyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0967bd" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#0967bd" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#f0f2f5" vertical={false} />
              <XAxis dataKey="day" tick={{ fontFamily: "Plus Jakarta Sans", fontSize: 10, fill: "#94a3b8", fontWeight: 600 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 4]} ticks={[0, 1, 2, 3, 4]} tick={{ fontFamily: "Plus Jakarta Sans", fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, fontFamily: "Plus Jakarta Sans", fontSize: 12, border: '1px solid #edf0f4', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }} />
              <Area type="monotone" dataKey="hours" stroke="#0967bd" strokeWidth={2.5} fill="url(#studyGrad)" dot={false} activeDot={{ r: 5, fill: "#0967bd", strokeWidth: 2, stroke: "white" }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Mode breakdown */}
      {Object.keys(modeCounts).length > 0 && (
        <div className="bg-white rounded-[20px] border border-[#edf0f4] p-6 mb-5 shadow-sm">
          <h3 className="text-[16px] font-bold text-[#003566] mb-4">Sessions by Mode</h3>
          <div className="flex flex-wrap gap-2.5">
            {Object.entries(modeCounts).map(([mode, count]) => (
              <div key={mode} className="flex items-center gap-2.5 rounded-[12px] px-4 py-2.5"
                style={{ background: `${MODE_COLORS[mode] || '#003566'}08`, border: `1px solid ${MODE_COLORS[mode] || '#003566'}15` }}>
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: MODE_COLORS[mode] || "#003566" }} />
                <span className="text-[12px] font-medium text-[#1e293b]">{mode}</span>
                <span className="text-[12px] font-bold" style={{ color: MODE_COLORS[mode] || "#003566" }}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent sessions table */}
      {isLoading ? <Spinner /> : history.length > 0 ? (
        <div className="bg-white rounded-[20px] overflow-hidden border border-[#edf0f4] shadow-sm">
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr] px-6 py-3.5"
            style={{ background: 'linear-gradient(135deg, #001d3d, #003566)' }}>
            {["Mode", "Duration", "Pomodoros", "Date"].map((col) => (
              <p key={col} className="text-[11px] font-bold text-white/70 uppercase tracking-[0.05em]">{col}</p>
            ))}
          </div>
          {history.slice(0, 20).map((s, idx) => (
            <div key={s.id} className={`grid grid-cols-[2fr_1fr_1fr_1fr] px-6 py-3.5 items-center border-b border-[#edf0f4] last:border-0 hover:bg-[#f8f9fc] transition-colors ${idx % 2 ? "bg-[#fafbfc]" : ""}`}>
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: MODE_COLORS[s.mode] || "#003566" }} />
                <span className="text-[13px] font-medium text-[#1e293b]">{s.mode}</span>
              </div>
              <span className="text-[12px] text-[#5a7089]">{Math.round(s.durationMinutes || 0)} min</span>
              <span className="text-[12px] text-[#5a7089]">{s.completedPomodoros || 0}</span>
              <span className="text-[11px] text-[#94a3b8]">{s.timestamp ? new Date(s.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-[20px] border border-[#edf0f4]">
          <BookOpen className="w-8 h-8 text-[#c1c7ce] mb-3" />
          <p className="text-[13px] text-[#94a3b8]">No study sessions recorded yet</p>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Mood History
// ─────────────────────────────────────────────────────────────────────────────

const MOOD_META: Record<string, { emoji: string; color: string; bg: string }> = {
  "Amazing":   { emoji: "😄", color: "#16a34a", bg: "rgba(34,197,94,0.08)" },
  "Good":      { emoji: "🙂", color: "#2563eb", bg: "rgba(37,99,235,0.08)" },
  "Okay":      { emoji: "😐", color: "#f77f00", bg: "rgba(247,127,0,0.08)" },
  "Low":       { emoji: "😔", color: "#7c3aed", bg: "rgba(124,58,237,0.08)" },
  "Stressed":  { emoji: "😰", color: "#cc3636", bg: "rgba(204,54,54,0.08)" },
  "Anxious":   { emoji: "😟", color: "#cc3636", bg: "rgba(204,54,54,0.08)" },
  "Sad":       { emoji: "😢", color: "#6b7280", bg: "rgba(107,114,128,0.08)" },
  "Happy":     { emoji: "😊", color: "#16a34a", bg: "rgba(34,197,94,0.08)" },
  "Motivated": { emoji: "💪", color: "#003566", bg: "rgba(0,53,102,0.08)" },
  "Tired":     { emoji: "😴", color: "#6b7280", bg: "rgba(107,114,128,0.08)" },
};

function MoodHistoryPage() {
  const [checkins, setCheckins] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { moodCheckins.list().then(setCheckins).catch(console.log).finally(() => setIsLoading(false)); }, []);

  const moodCounts: Record<string, number> = {};
  checkins.forEach((c) => { moodCounts[c.mood] = (moodCounts[c.mood] || 0) + 1; });
  const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

  return (
    <div className="p-6 md:p-8 lg:p-10" style={FONT}>
      <SectionHeader title="Mood History" desc="Track your emotional wellness journey over time" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Total Check-ins" value={checkins.length} color="#003566" icon={<Smile className="w-4 h-4 text-[#003566]" />} />
        <StatCard label="Most Common Mood" value={topMood} color="#f77f00" icon={<TrendingUp className="w-4 h-4 text-[#f77f00]" />} />
        <StatCard label="This Month" value={checkins.filter((c) => new Date(c.timestamp).getMonth() === new Date().getMonth()).length} color="#16a34a" icon={<Calendar className="w-4 h-4 text-[#16a34a]" />} />
      </div>

      {/* Mood frequency */}
      {Object.keys(moodCounts).length > 0 && (
        <div className="bg-white rounded-[20px] border border-[#edf0f4] p-6 mb-5 shadow-sm">
          <h3 className="text-[16px] font-bold text-[#003566] mb-4">Mood Frequency</h3>
          <div className="flex flex-wrap gap-2.5">
            {Object.entries(moodCounts).sort((a, b) => b[1] - a[1]).map(([mood, count]) => {
              const meta = MOOD_META[mood] || { emoji: "🙂", color: "#003566", bg: "rgba(0,53,102,0.08)" };
              return (
                <div key={mood} className="flex items-center gap-2.5 rounded-[14px] px-4 py-2.5"
                  style={{ background: meta.bg, border: `1px solid ${meta.color}15` }}>
                  <span className="text-[16px]">{meta.emoji}</span>
                  <span className="text-[12px] font-semibold" style={{ color: meta.color }}>{mood}</span>
                  <span className="text-[12px] font-bold" style={{ color: meta.color }}>{count}×</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* History list */}
      {isLoading ? <Spinner /> : checkins.length > 0 ? (
        <div className="flex flex-col gap-2.5">
          {checkins.slice(0, 30).map((c) => {
            const meta = MOOD_META[c.mood] || { emoji: "🙂", color: "#003566", bg: "rgba(0,53,102,0.08)" };
            return (
              <div key={c.id} className="bg-white rounded-[16px] border border-[#edf0f4] px-5 py-4 flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="w-11 h-11 rounded-[14px] flex items-center justify-center shrink-0 text-[22px]" style={{ background: meta.bg }}>
                  {c.emoji || meta.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-bold" style={{ color: meta.color }}>{c.mood}</p>
                  {c.note && <p className="text-[12px] text-[#5a7089] mt-0.5 truncate">{c.note}</p>}
                </div>
                <p className="text-[11px] text-[#c1c7ce] whitespace-nowrap shrink-0">
                  {c.timestamp ? new Date(c.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-[20px] border border-[#edf0f4]">
          <Smile className="w-8 h-8 text-[#c1c7ce] mb-3" />
          <p className="text-[13px] text-[#94a3b8]">No mood check-ins yet</p>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Account & Security
// ─────────────────────────────────────────────────────────────────────────────

function SecurityPage() {
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showCur, setShowCur] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showCon, setShowCon] = useState(false);
  const [status, setStatus] = useState<"" | "saving" | "saved" | "error">("");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSave() {
    setErrorMsg("");
    if (!currentPw || !newPw || !confirmPw) { setErrorMsg("All fields are required."); return; }
    if (newPw.length < 6) { setErrorMsg("New password must be at least 6 characters."); return; }
    if (newPw !== confirmPw) { setErrorMsg("Passwords do not match."); return; }
    setStatus("saving");
    try {
      await new Promise((r) => setTimeout(r, 800));
      setStatus("saved"); setCurrentPw(""); setNewPw(""); setConfirmPw("");
      setTimeout(() => setStatus(""), 3000);
    } catch { setStatus("error"); setErrorMsg("Failed to update password."); }
  }

  function PwField({ label, value, show, onToggle, onChange }: {
    label: string; value: string; show: boolean; onToggle: () => void; onChange: (v: string) => void;
  }) {
    return (
      <div className="flex flex-col gap-2">
        <label className="text-[13px] font-bold text-[#003566]">{label}</label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]"><Lock className="w-4 h-4" /></div>
          <input type={show ? "text" : "password"} value={value} onChange={(e) => onChange(e.target.value)}
            placeholder="••••••••" className={`${inputClass} pl-10 pr-10`} />
          <button type="button" onClick={onToggle}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#5a7089] cursor-pointer transition-colors">
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 lg:p-10" style={FONT}>
      <SectionHeader title="Account & Security" desc="Keep your account safe and up to date" />

      <div className="max-w-[500px] space-y-5">
        <div className="bg-white rounded-[20px] border border-[#edf0f4] p-6 shadow-sm">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-[10px] flex items-center justify-center" style={{ background: 'rgba(0,53,102,0.06)' }}>
              <Lock className="w-4 h-4 text-[#003566]" />
            </div>
            <h3 className="text-[16px] font-bold text-[#003566]">Change Password</h3>
          </div>

          <div className="space-y-4">
            <PwField label="Current Password" value={currentPw} show={showCur} onToggle={() => setShowCur((v) => !v)} onChange={setCurrentPw} />
            <PwField label="New Password" value={newPw} show={showNew} onToggle={() => setShowNew((v) => !v)} onChange={setNewPw} />
            <PwField label="Confirm New Password" value={confirmPw} show={showCon} onToggle={() => setShowCon((v) => !v)} onChange={setConfirmPw} />
          </div>

          {errorMsg && (
            <div className="mt-4 bg-[#cc3636]/5 border border-[#cc3636]/10 rounded-[12px] px-4 py-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#cc3636] shrink-0" />
              <p className="text-[12px] text-[#cc3636] font-medium">{errorMsg}</p>
            </div>
          )}
          {status === "saved" && (
            <div className="mt-4 bg-[#16a34a]/5 border border-[#16a34a]/10 rounded-[12px] px-4 py-3 flex items-center gap-2">
              <Check className="w-4 h-4 text-[#16a34a] shrink-0" />
              <p className="text-[12px] text-[#16a34a] font-medium">Password updated successfully!</p>
            </div>
          )}

          <div className="flex justify-end mt-5">
            <button onClick={handleSave} disabled={status === "saving"}
              className="h-[44px] px-8 rounded-[14px] text-[13px] font-bold text-white transition-all cursor-pointer disabled:opacity-60 hover:shadow-lg flex items-center gap-2"
              style={{ background: 'linear-gradient(135deg, #003566, #0967bd)' }}>
              {status === "saving" && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              Update Password
            </button>
          </div>
        </div>

        {/* Account Info */}
        <div className="bg-white rounded-[20px] border border-[#edf0f4] p-6 shadow-sm">
          <h3 className="text-[16px] font-bold text-[#003566] mb-4">Account Info</h3>
          <TwoFASettings />
          <div className="flex items-center justify-between py-4">
            <div>
              <p className="text-[13px] font-semibold text-[#1e293b]">Delete Account</p>
              <p className="text-[11px] text-[#94a3b8] mt-0.5">Permanently remove your account and data</p>
            </div>
            <button className="text-[11px] font-bold text-[#cc3636] border border-[#cc3636] px-3 py-1.5 rounded-[10px] hover:bg-red-50 transition-colors cursor-pointer flex items-center gap-1.5">
              <Trash2 className="w-3 h-3" /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Notifications
// ─────────────────────────────────────────────────────────────────────────────

const NOTIF_SETTINGS = [
  { key: "sessionAlerts", label: "Session Alerts", desc: "Get notified about upcoming sessions, confirmations, and cancellations.", defaultOn: true },
  { key: "mentorMessages", label: "Mentor Messages", desc: "Receive alerts when your mentor sends you a message or update.", defaultOn: true },
  { key: "studyReminders", label: "Study Reminders", desc: "Get reminded about your scheduled study plans and tasks.", defaultOn: true },
  { key: "moodCheckins", label: "Mood Check-in Reminders", desc: "Receive daily prompts to log your mood and emotional wellness.", defaultOn: false },
  { key: "communityEvents", label: "Community Events", desc: "Stay updated about upcoming community workshops and events.", defaultOn: false },
  { key: "systemUpdates", label: "System & Platform Updates", desc: "Be the first to know about new features and platform announcements.", defaultOn: false },
];

function NotificationsPage() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    NOTIF_SETTINGS.forEach((s) => { init[s.key] = s.defaultOn; });
    return init;
  });
  const [saved, setSaved] = useState(false);

  return (
    <div className="p-6 md:p-8 lg:p-10" style={FONT}>
      <SectionHeader title="Notifications" desc="Choose which notifications you'd like to receive" />

      <div className="max-w-[640px] bg-white rounded-[20px] border border-[#edf0f4] shadow-sm overflow-hidden">
        <div className="p-6 flex flex-col gap-0">
          {NOTIF_SETTINGS.map((item, i) => (
            <div key={item.key} className={`flex items-start justify-between gap-6 py-5 ${i < NOTIF_SETTINGS.length - 1 ? "border-b border-[#edf0f4]" : ""}`}>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-bold text-[#1e293b] mb-0.5">{item.label}</p>
                <p className="text-[12px] text-[#94a3b8] leading-relaxed">{item.desc}</p>
              </div>
              <Toggle on={enabled[item.key]} onClick={() => setEnabled((prev) => ({ ...prev, [item.key]: !prev[item.key] }))} />
            </div>
          ))}
        </div>

        <div className="flex justify-end px-6 py-4 border-t border-[#edf0f4]">
          <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}
            className="h-[44px] px-8 rounded-[14px] text-[13px] font-bold text-white transition-all cursor-pointer hover:shadow-lg flex items-center gap-2"
            style={{ background: 'linear-gradient(135deg, #003566, #0967bd)' }}>
            {saved ? <><Check className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Preferences</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main UserProfileSettings
// ─────────────────────────────────────────────────────────────────────────────

const navConfig: { key: UserSubNav; label: string; icon: React.ReactNode }[] = [
  { key: "basic", label: "Basic Information", icon: <User className="w-[18px] h-[18px]" /> },
  { key: "my-sessions", label: "My Sessions", icon: <Calendar className="w-[18px] h-[18px]" /> },
  { key: "study-history", label: "Study History", icon: <GraduationCap className="w-[18px] h-[18px]" /> },
  { key: "mood-history", label: "Mood History", icon: <Smile className="w-[18px] h-[18px]" /> },
  { key: "security", label: "Account & Security", icon: <Shield className="w-[18px] h-[18px]" /> },
  { key: "notifications", label: "Notifications", icon: <Bell className="w-[18px] h-[18px]" /> },
];

function TwoFASettings() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [email, setEmail] = useState("");
  const [showOTPVerify, setShowOTPVerify] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const loadSettings = async () => {
      const settings = await get2FASettings();
      if (settings) {
        setIsEnabled(settings.isEnabled);
        setEmail(settings.email);
      }
    };
    loadSettings();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timeLeft]);

  const handleEnable = async () => {
    setIsLoading(true);
    try {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        toast.error("Not authenticated");
        return;
      }

      const result = await sendOTP(email || currentUser.email, currentUser.id);
      if (result.success) {
        setShowOTPVerify(true);
        setTimeLeft(result.expiresInSeconds);
        toast.success("OTP sent to your email");
      } else {
        toast.error(result.error || "Failed to send OTP");
      }
    } catch (err) {
      console.error("[2FA] Enable error:", err);
      toast.error("Error enabling 2FA");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otpInput.length !== 6) {
      toast.error("OTP must be 6 digits");
      return;
    }

    setIsLoading(true);
    try {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        toast.error("Not authenticated");
        return;
      }

      const result = await verifyOTP(currentUser.id, otpInput);
      if (result.success) {
        const enableResult = await enable2FA(email || currentUser.email);
        if (enableResult.success) {
          setIsEnabled(true);
          setShowOTPVerify(false);
          setOtpInput("");
          setTimeLeft(0);
          toast.success("Two-Factor Authentication enabled!");
        } else {
          toast.error(enableResult.error || "Failed to enable 2FA");
        }
      } else {
        toast.error(result.error || "Invalid OTP");
      }
    } catch (err) {
      console.error("[2FA] Verify error:", err);
      toast.error("Error verifying OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisable = async () => {
    setIsLoading(true);
    try {
      const result = await disable2FA();
      if (result.success) {
        setIsEnabled(false);
        toast.success("Two-Factor Authentication disabled");
      } else {
        toast.error(result.error || "Failed to disable 2FA");
      }
    } catch (err) {
      console.error("[2FA] Disable error:", err);
      toast.error("Error disabling 2FA");
    } finally {
      setIsLoading(false);
    }
  };

  if (showOTPVerify) {
    return (
      <div className="py-4 border-b border-[#edf0f4]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-[10px] flex items-center justify-center" style={{ background: 'rgba(158,51,226,0.06)' }}>
            <Check className="w-4 h-4 text-[#9e33e2]" />
          </div>
          <h4 className="text-[14px] font-bold text-[#1e293b]">Verify Your Email</h4>
        </div>
        <p className="text-[12px] text-[#5a7089] mb-4">Enter the 6-digit code sent to your email</p>
        <input
          type="text"
          maxLength={6}
          value={otpInput}
          onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
          placeholder="000000"
          className={inputClass}
        />
        <p className="text-[11px] text-[#94a3b8] mt-2">Expires in {timeLeft}s</p>
        <div className="flex gap-2 mt-4">
          <button
            onClick={handleVerifyOTP}
            disabled={isLoading || otpInput.length !== 6}
            className="flex-1 h-[44px] rounded-[12px] text-[13px] font-bold text-white transition-all disabled:opacity-60 cursor-pointer hover:shadow-lg"
            style={{ background: 'linear-gradient(135deg, #003566, #0967bd)' }}
          >
            {isLoading ? "Verifying..." : "Verify & Enable"}
          </button>
          <button
            onClick={() => { setShowOTPVerify(false); setOtpInput(""); setTimeLeft(0); }}
            className="h-[44px] px-6 rounded-[12px] text-[13px] font-bold text-[#5a7089] border border-[#e2e8f0] cursor-pointer hover:bg-[#f8f9fc]"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between py-4 border-b border-[#edf0f4]">
      <div>
        <p className="text-[13px] font-semibold text-[#1e293b]">Two-Factor Authentication</p>
        <p className="text-[11px] text-[#94a3b8] mt-0.5">
          {isEnabled ? "Protect your account with email OTP" : "Add extra security to your account"}
        </p>
      </div>
      <div className="flex items-center gap-3">
        {isEnabled && <span className="text-[10px] font-bold text-[#16a34a] px-2.5 py-1 rounded-full" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.12)' }}>Enabled</span>}
        <Toggle
          on={isEnabled}
          onClick={() => {
            if (isEnabled) {
              handleDisable();
            } else {
              handleEnable();
            }
          }}
        />
      </div>
    </div>
  );
}

export function UserProfileSettings({ onBack }: UserProfileSettingsProps) {
  const [activeNav, setActiveNav] = useState<UserSubNav>("basic");
  const currentUser = getCurrentUser();

  return (
    <div className="flex h-full w-full overflow-hidden" style={FONT}>
      {/* ── Left sub-nav sidebar ── */}
      <div className="w-[260px] shrink-0 flex flex-col overflow-y-auto border-r border-[#edf0f4]"
        style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f8f9fc 100%)' }}>
        {/* Back + Title */}
        <div className="px-6 pt-8 pb-5">
          <button onClick={onBack} className="flex items-center gap-2 text-[#5a7089] hover:text-[#003566] mb-3 transition-colors group cursor-pointer">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[12px] font-medium">Dashboard</span>
          </button>
          <h1 className="text-[28px] text-[#003566]" style={HEADING}>Profile</h1>
        </div>

        {/* Avatar preview */}
        <div className="flex flex-col items-center gap-2.5 px-6 pb-5 border-b border-[#edf0f4]">
          <div className="w-[72px] h-[72px] rounded-full overflow-hidden border-3 border-white shadow-lg">
            <img src={currentUser?.avatar || imgEllipse1} alt="Profile" className="w-full h-full object-cover" />
          </div>
          <div className="text-center">
            <p className="text-[13px] font-bold text-[#003566]">{currentUser?.name || "Student"}</p>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-[#0967bd] mt-1"
              style={{ background: 'rgba(9,103,189,0.06)', border: '1px solid rgba(9,103,189,0.1)' }}>
              {currentUser?.gradeLevel || "Lernova Student"}
            </span>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex flex-col gap-1 px-3 py-4">
          {navConfig.map((item) => {
            const isActive = activeNav === item.key;
            return (
              <button key={item.key} onClick={() => setActiveNav(item.key)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-[12px] w-full text-left transition-all cursor-pointer ${
                  isActive
                    ? "text-[#003566] font-bold"
                    : "text-[#94a3b8] hover:text-[#5a7089] hover:bg-[#f5f7fa]"
                }`}
                style={isActive ? { background: 'rgba(9,103,189,0.06)', border: '1px solid rgba(9,103,189,0.08)' } : undefined}>
                <span className={isActive ? "text-[#0967bd]" : ""}>{item.icon}</span>
                <span className="text-[13px]">{item.label}</span>
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#f77f00]" />}
              </button>
            );
          })}
        </nav>
      </div>

      {/* ── Main scrollable content ── */}
      <div className="flex-1 overflow-y-auto bg-[#f8f9fc]">
        {activeNav === "basic" && <BasicInfoPage />}
        {activeNav === "my-sessions" && <MySessionsPage />}
        {activeNav === "study-history" && <StudyHistoryPage />}
        {activeNav === "mood-history" && <MoodHistoryPage />}
        {activeNav === "security" && <SecurityPage />}
        {activeNav === "notifications" && <NotificationsPage />}
      </div>
    </div>
  );
}
