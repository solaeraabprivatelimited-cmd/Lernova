import React, { useState, useRef, useEffect } from "react";
import imgEllipse1 from "figma:asset/798eac6e288222603807db12d070c52d1a145785.png";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import { profile as profileApi, studySessions, moodCheckins, sessionRequests, sessions as sessionsApi, getCurrentUser, getSupabaseClient, auth } from "@/app/lib/api";
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

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Shared components
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; text: string; border: string }> = {
    completed: { bg: "#1a7a45/10", text: "#4ade80", border: "#1a7a45/20" },
    booked:    { bg: "#003566/10", text: "#3b82f6", border: "#003566/20" },
    accepted:  { bg: "#003566/10", text: "#3b82f6", border: "#003566/20" },
    pending:   { bg: "#f77f00/10", text: "#fbbf24", border: "#f77f00/20" },
    cancelled: { bg: "#cc3636/10", text: "#ff8080", border: "#cc3636/20" },
    declined:  { bg: "#cc3636/10", text: "#ff8080", border: "#cc3636/20" },
  };
  const s = map[status] || { bg: "#22272f", text: "#cbd5e1", border: "#3a3f47" };
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
    <div className="bg-white dark:bg-[#22272f] rounded-[16px] md:rounded-[18px] border border-[#edf0f4] dark:border-[#3a3f47] p-3.5 md:p-5 flex flex-col gap-2 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <p className="text-[22px] md:text-[26px] font-bold dark:text-white" style={{ color, ...HEADING }}>{value}</p>
        <div className="w-8 md:w-9 h-8 md:h-9 rounded-[10px] md:rounded-[12px] flex items-center justify-center" style={{ background: `${color}10` }}>
          {icon}
        </div>
      </div>
      <p className="text-[11px] md:text-[12px] text-[#94a3b8] dark:text-slate-400 font-medium">{label}</p>
    </div>
  );
}

function SectionHeader({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-[28px] md:text-[32px] text-[#003566] dark:text-blue-400 mb-1" style={HEADING}>{title}</h2>
      <p className="text-[13px] text-[#94a3b8] dark:text-slate-400">{desc}</p>
    </div>
  );
}

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className={`relative w-[48px] h-[26px] rounded-full transition-colors duration-200 shrink-0 cursor-pointer ${on ? "bg-[#0967bd]" : "bg-[#e2e8f0] dark:bg-[#3a3f47]"}`}>
      <div className={`absolute top-[3px] w-[20px] h-[20px] rounded-full bg-white dark:bg-white shadow-sm transition-transform duration-200 ${on ? "translate-x-[25px]" : "translate-x-[3px]"}`} />
    </button>
  );
}

const inputClass = "w-full h-[44px] border border-[#e2e8f0] dark:border-[#3a3f47] rounded-[12px] px-4 text-[13px] outline-none focus:border-[#0967bd] focus:ring-1 focus:ring-[#0967bd]/20 transition-all text-[#1e293b] dark:text-white placeholder:text-[#94a3b8] dark:placeholder:text-slate-500 bg-white dark:bg-[#2b3139] disabled:opacity-60";

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Basic Information
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function BasicInfoPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const [subjects, setSubjects] = useState<string[]>([]);
  const [newSubject, setNewSubject] = useState("");
  const [avatarSrc, setAvatarSrc] = useState(imgEllipse1);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const avatarRef = useRef<HTMLInputElement>(null);

  const GRADE_OPTIONS = ["Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12", "Undergraduate", "Postgraduate", "Other"];

  // Load profile data on mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        const profile = await profileApi.get();
        if (profile) {
          setName(profile.name || "");
          setEmail(profile.email || "");
          setBio(profile.bio || "");
          setGradeLevel(profile.gradeLevel || "");
          setSubjects(profile.subjects || []);
          const avatarUrl = profile.avatar || profile.avatar_url;
          if (avatarUrl) setAvatarSrc(avatarUrl);
        }
      } catch (err: any) {
        console.log("Failed to load profile:", err);
        toast.error("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };
    loadProfile();
  }, []);

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setAvatarSrc(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  async function handleSave() {
    setError("");
    if (!name.trim()) {
      setError("Full name is required");
      return;
    }

    setIsSaving(true);
    try {
      // Update profile in database
      await profileApi.update({
        name: name.trim(),
        bio: bio.trim(),
        subjects,
      });

      setSaved(true);
      toast.success("Profile updated successfully!");
      setTimeout(() => setSaved(false), 2500);
    } catch (err: any) {
      const errorMsg = err.message || "Failed to save profile";
      setError(errorMsg);
      toast.error(errorMsg);
      console.error("Save profile error:", err);
    } finally {
      setIsSaving(false);
    }
  }

  function handleAddSubject() {
    const s = newSubject.trim();
    if (s && !subjects.includes(s)) {
      if (subjects.length >= 10) {
        toast.error("Maximum 10 subjects allowed");
        return;
      }
      setSubjects((prev) => [...prev, s]);
      setNewSubject("");
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 lg:p-10 flex items-center justify-center min-h-[400px]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 lg:p-10" style={FONT}>
      <SectionHeader title="Basic Information" desc="Manage your personal details and learning preferences" />

      <div className="flex flex-col gap-5">
        {/* LEFT - Avatar + Subjects */}
        <div className="w-full flex flex-col gap-4">
          {/* Avatar Card */}
          <div className="bg-white dark:bg-[#22272f] rounded-[16px] md:rounded-[20px] border border-[#edf0f4] dark:border-[#3a3f47] p-4 md:p-6 flex flex-col items-center gap-4 shadow-sm">
            <div className="relative group">
              <div className="w-[100px] md:w-[140px] h-[100px] md:h-[140px] rounded-full overflow-hidden border-4 border-white dark:border-[#2b3139] shadow-lg">
                <img src={avatarSrc} alt="Profile" className="w-full h-full object-cover" />
              </div>
              <button onClick={() => avatarRef.current?.click()}
                className="absolute bottom-1 right-1 w-8 md:w-10 h-8 md:h-10 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-105 transition-transform"
                style={{ background: 'linear-gradient(135deg, #003566, #0967bd)' }}>
                <Camera className="w-3.5 md:w-4 h-3.5 md:h-4 text-white" />
              </button>
            </div>
            <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            <button onClick={() => setAvatarSrc(imgEllipse1)}
              className="text-[11px] md:text-[12px] font-semibold text-[#94a3b8] dark:text-slate-400 hover:text-[#5a7089] dark:hover:text-slate-300 transition-colors cursor-pointer">
              Reset to Default
            </button>
          </div>

          {/* Subjects Card */}
          <div className="bg-white dark:bg-[#22272f] rounded-[16px] md:rounded-[20px] border border-[#edf0f4] dark:border-[#3a3f47] p-4 md:p-5 shadow-sm">
            <h3 className="text-[13px] md:text-[14px] font-bold text-[#003566] dark:text-blue-400 mb-3">Subjects</h3>
            <div className="flex flex-wrap gap-1.5 md:gap-2 mb-3">
              {subjects.map((s) => (
                <span key={s} className="flex items-center gap-1 px-2.5 md:px-3 py-1 md:py-1.5 rounded-full text-[10px] md:text-[11px] font-semibold text-[#003566] dark:text-blue-400"
                  style={{ background: 'rgba(9,103,189,0.08)', border: '1px solid rgba(9,103,189,0.1)' }}>
                  {s}
                  <button onClick={() => setSubjects((prev) => prev.filter((x) => x !== s))}
                    className="hover:text-[#cc3636] transition-colors cursor-pointer"><X className="w-3 h-3" /></button>
                </span>
              ))}
              {subjects.length === 0 && <p className="text-[11px] md:text-[12px] text-[#c1c7ce] dark:text-slate-600">No subjects added</p>}
            </div>
            <div className="flex gap-2">
              <input type="text" placeholder="Add subjectâ€¦" value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleAddSubject(); }}
                className="flex-1 h-[36px] border border-[#e2e8f0] dark:border-[#3a3f47] rounded-[10px] px-3 text-[12px] outline-none focus:border-[#0967bd] focus:ring-1 focus:ring-[#0967bd]/20 transition-colors dark:bg-[#2b3139] dark:text-white placeholder:text-[#94a3b8] dark:placeholder:text-slate-500" />
              <button onClick={handleAddSubject}
                className="h-[36px] w-[36px] rounded-[10px] text-[12px] font-bold text-white cursor-pointer hover:shadow-md transition-all disabled:opacity-60 flex items-center justify-center shrink-0"
                style={{ background: 'linear-gradient(135deg, #003566, #0967bd)' }}
                disabled={isSaving}>
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT - Form */}
        <div className="w-full flex flex-col gap-4 md:gap-5">
          <div className="bg-white dark:bg-[#22272f] rounded-[16px] md:rounded-[20px] border border-[#edf0f4] dark:border-[#3a3f47] p-4 md:p-6 shadow-sm flex flex-col gap-4 md:gap-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              <div className="flex flex-col gap-3">
                <label className="text-[12px] md:text-[13px] font-bold text-[#003566] dark:text-blue-400">Full Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" className={inputClass} disabled={isSaving} />
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-[12px] md:text-[13px] font-bold text-[#003566] dark:text-blue-400">Email Address</label>
                <input type="text" value={email} readOnly className={`${inputClass} bg-[#f8f9fc] dark:bg-[#1a1f2e] cursor-not-allowed text-[#94a3b8] dark:text-slate-500`} />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-[12px] md:text-[13px] font-bold text-[#003566] dark:text-blue-400">Bio</label>
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell us about yourselfâ€¦" rows={4}
                className="w-full border border-[#e2e8f0] dark:border-[#3a3f47] rounded-[12px] px-4 py-3 text-[12px] md:text-[13px] outline-none focus:border-[#0967bd] focus:ring-1 focus:ring-[#0967bd]/20 transition-all text-[#1e293b] dark:text-white placeholder:text-[#94a3b8] dark:placeholder:text-slate-500 bg-white dark:bg-[#2b3139] resize-none disabled:opacity-60"
                disabled={isSaving} />
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-[12px] md:text-[13px] font-bold text-[#003566] dark:text-blue-400">Grade / Level</label>
              <div className="relative">
                <select value={gradeLevel} onChange={(e) => setGradeLevel(e.target.value)}
                  className={`${inputClass} appearance-none cursor-pointer pr-10 disabled:opacity-60 [color-scheme:light_dark]`}
                  style={{ colorScheme: 'light dark' }}
                  disabled={isSaving}>
                  <option value="">Select gradeâ€¦</option>
                  {GRADE_OPTIONS.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8] dark:text-slate-500 pointer-events-none" />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-[12px] px-4 py-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
                <p className="text-[12px] text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <button onClick={handleSave} disabled={isSaving}
              className="h-[44px] px-6 md:px-8 rounded-[14px] text-[12px] md:text-[13px] font-bold text-white transition-all cursor-pointer disabled:opacity-60 hover:shadow-lg flex items-center gap-2 w-full md:w-auto justify-center md:justify-start"
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

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// My Sessions
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function MySessionsPage() {
  const [allSessions, setAllSessions] = useState<any[]>([]);
  const [allRequests, setAllRequests] = useState<any[]>([]);
  const [tab, setTab] = useState<"sessions" | "requests">("sessions");
  const [filter, setFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [s, r] = await Promise.all([sessionsApi.list(), sessionRequests.list()]);
        setAllSessions(s);
        setAllRequests(r);
        
        // Load saved notes from database
        const supabase = getSupabaseClient();
        const user = getCurrentUser();
        if (user) {
          const { data } = await supabase
            .from('profiles')
            .select('session_notes')
            .eq('id', user.id)
            .single();
          if (data?.session_notes) {
            setNotes(data.session_notes);
          }
        }
      } catch (err: any) {
        console.log("Failed to load sessions:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  async function saveNotes(id: string) {
    setIsSaving(true);
    try {
      const supabase = getSupabaseClient();
      const user = getCurrentUser();
      if (!user) {
        toast.error("Not authenticated");
        return;
      }

      // Save notes to database
      const { error } = await supabase
        .from('profiles')
        .update({ session_notes: notes })
        .eq('id', id);

      if (error) {
        toast.error("Failed to save notes");
        return;
      }

      toast.success("Session notes saved!");
      setExpandedId(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to save notes");
    } finally {
      setIsSaving(false);
    }
  }

  const statusFilters = ["All", "booked", "completed", "cancelled"];
  const filteredSessions = allSessions.filter((s) => filter === "All" || s.status === filter);
  const filteredRequests = allRequests.filter((r) => filter === "All" || r.status === filter);

  return (
    <div className="p-6 md:p-8 lg:p-10" style={FONT}>
      <SectionHeader title="My Sessions" desc="View your booked and requested mentor sessions" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-5 md:mb-6">
        <StatCard label="Total Sessions" value={allSessions.length} color="#003566" icon={<Calendar className="w-4 h-4 text-[#003566]" />} />
        <StatCard label="Confirmed" value={allSessions.filter((s) => s.status === "booked" || s.status === "completed").length} color="#16a34a" icon={<Check className="w-4 h-4 text-[#16a34a]" />} />
        <StatCard label="Pending Requests" value={allRequests.filter((r) => r.status === "pending").length} color="#f77f00" icon={<Clock className="w-4 h-4 text-[#f77f00]" />} />
      </div>

      {/* Tab + Filter */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="p-1 rounded-[14px] flex dark:bg-[#2b3139]" style={{ background: '#f5f7fa' }}>
          {(["sessions", "requests"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-[12px] text-[12px] font-bold cursor-pointer transition-all ${
                tab === t ? "bg-gradient-to-r from-[#003566] to-[#0967bd] text-white shadow-sm dark:shadow-none" : "text-[#94a3b8] dark:text-slate-500 hover:text-[#5a7089] dark:hover:text-slate-400"
              }`}>
              {t === "sessions" ? "Booked Sessions" : "Session Requests"}
            </button>
          ))}
        </div>
        <div className="p-1 rounded-[14px] flex dark:bg-[#2b3139]" style={{ background: '#f5f7fa' }}>
          {statusFilters.map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-[10px] text-[11px] font-bold cursor-pointer transition-all capitalize ${
                filter === f ? "bg-gradient-to-r from-[#003566] to-[#0967bd] text-white shadow-sm dark:shadow-none" : "text-[#94a3b8] dark:text-slate-500 hover:text-[#5a7089] dark:hover:text-slate-400"
              }`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? <Spinner /> : (
        <div className="bg-white dark:bg-[#22272f] rounded-[16px] md:rounded-[20px] overflow-hidden border border-[#edf0f4] dark:border-[#3a3f47] shadow-sm">
          {tab === "sessions" ? (
            <>
              <div className="hidden md:grid grid-cols-[2fr_1.5fr_1.5fr_0.8fr_0.8fr_1fr] px-6 py-3.5 bg-gradient-to-r from-[#001d3d] via-[#003566] to-[#0967bd] dark:from-[#1a1f2e] dark:via-[#22272f] dark:to-[#2b3139]">
                {["Mentor", "Subject", "Date & Time", "Duration", "Notes", "Status"].map((col) => (
                  <p key={col} className="text-[10px] font-bold text-white/70 dark:text-slate-300 uppercase tracking-[0.05em]">{col}</p>
                ))}
              </div>
              {filteredSessions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16"><p className="text-[13px] text-[#94a3b8] dark:text-slate-400">No sessions found</p></div>
              ) : filteredSessions.map((s, idx) => (
                <div key={s.id} className="border-b border-[#edf0f4] dark:border-[#3a3f47] last:border-0">
                  <div className={`grid grid-cols-1 md:grid-cols-[2fr_1.5fr_1.5fr_0.8fr_0.8fr_1fr] gap-2 md:gap-0 px-4 md:px-6 py-3 md:py-4 items-start md:items-center hover:bg-[#f8f9fc] dark:hover:bg-[#2b3139] transition-colors ${idx % 2 === 0 ? "" : "bg-[#fafbfc] dark:bg-[#1a1f2e]"} first:md:bg-transparent md:first:hover:bg-transparent`}>
                    <div className="flex justify-between items-start md:items-center w-full md:w-auto md:col-span-1">
                      <span className="md:hidden text-[10px] text-[#94a3b8] dark:text-slate-500 font-medium">Mentor</span>
                      <span className="text-[12px] md:text-[13px] font-semibold text-[#1e293b] dark:text-white">{s.mentorName || "â€”"}</span>
                    </div>
                    <div className="flex justify-between items-center md:items-start">
                      <span className="md:hidden text-[10px] text-[#94a3b8] dark:text-slate-500 font-medium">Subject</span>
                      <span className="text-[12px] text-[#5a7089] dark:text-slate-400">{s.subject || "â€”"}</span>
                    </div>
                    <div className="flex justify-between items-start md:items-center">
                      <div className="md:hidden text-[10px] text-[#94a3b8] dark:text-slate-500 font-medium">Date</div>
                      <div><span className="text-[12px] font-medium text-[#1e293b] dark:text-white">{s.date || "â€”"}</span><br/><span className="text-[11px] text-[#94a3b8] dark:text-slate-400">{s.time || ""}</span></div>
                    </div>
                    <div className="flex justify-between items-center md:items-start">
                      <span className="md:hidden text-[10px] text-[#94a3b8] dark:text-slate-500 font-medium">Duration</span>
                      <span className="text-[12px] text-[#5a7089] dark:text-slate-400">{s.duration ? `${s.duration} min` : "â€”"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="md:hidden text-[10px] text-[#94a3b8] dark:text-slate-500 font-medium">Actions</span>
                      <button onClick={() => setExpandedId(expandedId === s.id ? null : s.id)} className="text-[11px] md:text-[12px] font-bold text-[#0967bd] hover:text-[#003566] dark:hover:text-blue-300 cursor-pointer">
                        {notes[s.id] ? "Edit" : "Add"}
                      </button>
                    </div>
                    <div className="flex justify-end md:justify-start"><StatusBadge status={s.status || "booked"} /></div>
                  </div>
                  {expandedId === s.id && (
                    <div className="px-4 md:px-6 py-3 md:py-4 bg-[#f8f9fc] dark:bg-[#1a1f2e] border-t border-[#edf0f4] dark:border-[#3a3f47] flex flex-col gap-3">
                      <textarea value={notes[s.id] || ""} onChange={(e) => setNotes((prev) => ({ ...prev, [s.id]: e.target.value }))}
                        placeholder="Add notes about this sessionâ€¦" rows={3}
                        className="w-full border border-[#e2e8f0] dark:border-[#3a3f47] rounded-[10px] px-3 py-2 text-[12px] outline-none focus:border-[#0967bd] focus:ring-1 focus:ring-[#0967bd]/20 transition-all text-[#1e293b] dark:text-white placeholder:text-[#94a3b8] dark:placeholder:text-slate-500 bg-white dark:bg-[#2b3139]" />
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => setExpandedId(null)} className="px-3 py-2 rounded-[8px] text-[12px] font-bold text-[#5a7089] dark:text-slate-400 hover:bg-[#edf0f4] dark:hover:bg-[#3a3f47] transition-colors cursor-pointer">
                          Cancel
                        </button>
                        <button onClick={() => saveNotes(s.id)} disabled={isSaving}
                          className="px-4 py-2 rounded-[8px] text-[12px] font-bold text-white transition-all cursor-pointer disabled:opacity-60 hover:shadow-md flex items-center gap-1.5"
                          style={{ background: 'linear-gradient(135deg, #003566, #0967bd)' }}>
                          {isSaving ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-3 h-3" />}
                          Save
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </>
          ) : (
            <>
              <div className="hidden md:grid grid-cols-[2fr_1.5fr_1.5fr_0.8fr_1fr] px-6 py-3.5 bg-gradient-to-r from-[#001d3d] via-[#003566] to-[#0967bd] dark:from-[#1a1f2e] dark:via-[#22272f] dark:to-[#2b3139]">
                {["Mentor", "Subject", "Preferred Date", "Notes", "Status"].map((col) => (
                  <p key={col} className="text-[10px] font-bold text-white/70 dark:text-slate-300 uppercase tracking-[0.05em]">{col}</p>
                ))}
              </div>
              {filteredRequests.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16"><p className="text-[13px] text-[#94a3b8] dark:text-slate-400">No requests found</p></div>
              ) : filteredRequests.map((r, idx) => (
                <div key={r.id} className="border-b border-[#edf0f4] dark:border-[#3a3f47] last:border-0">
                  <div className={`grid grid-cols-1 md:grid-cols-[2fr_1.5fr_1.5fr_0.8fr_1fr] gap-2 md:gap-0 px-4 md:px-6 py-3 md:py-4 items-start md:items-center hover:bg-[#f8f9fc] dark:hover:bg-[#2b3139] transition-colors ${idx % 2 === 0 ? "" : "bg-[#fafbfc] dark:bg-[#1a1f2e]"}`}>
                    <div className="flex justify-between items-start md:items-center w-full md:w-auto md:col-span-1">
                      <span className="md:hidden text-[10px] text-[#94a3b8] dark:text-slate-500 font-medium">Mentor</span>
                      <span className="text-[12px] md:text-[13px] font-semibold text-[#1e293b] dark:text-white">{r.mentorName || "â€”"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="md:hidden text-[10px] text-[#94a3b8] dark:text-slate-500 font-medium">Subject</span>
                      <span className="text-[12px] text-[#5a7089] dark:text-slate-400">{r.subject || "â€”"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="md:hidden text-[10px] text-[#94a3b8] dark:text-slate-500 font-medium">Preferred Date</span>
                      <span className="text-[12px] font-medium text-[#1e293b] dark:text-white">{r.preferredDate || "â€”"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="md:hidden text-[10px] text-[#94a3b8] dark:text-slate-500 font-medium">Actions</span>
                      <button onClick={() => setExpandedId(expandedId === r.id ? null : r.id)} className="text-[11px] md:text-[12px] font-bold text-[#0967bd] hover:text-[#003566] dark:hover:text-blue-300 cursor-pointer">
                        {notes[r.id] ? "Edit" : "Add"}
                      </button>
                    </div>
                    <div className="flex justify-end md:justify-start"><StatusBadge status={r.status || "pending"} /></div>
                  </div>
                  {expandedId === r.id && (
                    <div className="px-4 md:px-6 py-3 md:py-4 bg-[#f8f9fc] dark:bg-[#1a1f2e] border-t border-[#edf0f4] dark:border-[#3a3f47] flex flex-col gap-3">
                      <textarea value={notes[r.id] || ""} onChange={(e) => setNotes((prev) => ({ ...prev, [r.id]: e.target.value }))}
                        placeholder="Add notes about this requestâ€¦" rows={3}
                        className="w-full border border-[#e2e8f0] dark:border-[#3a3f47] rounded-[10px] px-3 py-2 text-[12px] outline-none focus:border-[#0967bd] focus:ring-1 focus:ring-[#0967bd]/20 transition-all text-[#1e293b] dark:text-white placeholder:text-[#94a3b8] dark:placeholder:text-slate-500 bg-white dark:bg-[#2b3139]" />
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => setExpandedId(null)} className="px-3 py-2 rounded-[8px] text-[12px] font-bold text-[#5a7089] dark:text-slate-400 hover:bg-[#edf0f4] dark:hover:bg-[#3a3f47] transition-colors cursor-pointer">
                          Cancel
                        </button>
                        <button onClick={() => saveNotes(r.id)} disabled={isSaving}
                          className="px-4 py-2 rounded-[8px] text-[12px] font-bold text-white transition-all cursor-pointer disabled:opacity-60 hover:shadow-md flex items-center gap-1.5"
                          style={{ background: 'linear-gradient(135deg, #003566, #0967bd)' }}>
                          {isSaving ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-3 h-3" />}
                          Save
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Study History
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 mb-5 md:mb-6">
        <StatCard label="Total Study Time" value={`${totalHrs}h`} color="#003566" icon={<Clock className="w-4 h-4 text-[#003566]" />} />
        <StatCard label="Total Sessions" value={history.length} color="#16a34a" icon={<BookOpen className="w-4 h-4 text-[#16a34a]" />} />
        <StatCard label="Focus Sessions" value={focusSessions} color="#f77f00" icon={<Target className="w-4 h-4 text-[#f77f00]" />} />
        <StatCard label="Pomodoros Done" value={pomodoros} color="#AD5FF8" icon={<Zap className="w-4 h-4 text-[#AD5FF8]" />} />
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-[#22272f] rounded-[16px] md:rounded-[20px] border border-[#edf0f4] dark:border-[#3a3f47] p-4 md:p-6 mb-4 md:mb-5 shadow-sm overflow-x-auto">
        <h3 className="text-[14px] md:text-[16px] font-bold text-[#003566] dark:text-blue-400 mb-4">Weekly Study Hours</h3>
        <div className="h-[150px] md:h-[180px] min-w-[300px] md:min-w-full">
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
        <div className="bg-white dark:bg-[#22272f] rounded-[16px] md:rounded-[20px] border border-[#edf0f4] dark:border-[#3a3f47] p-4 md:p-6 mb-4 md:mb-5 shadow-sm">
          <h3 className="text-[14px] md:text-[16px] font-bold text-[#003566] dark:text-blue-400 mb-4">Sessions by Mode</h3>
          <div className="flex flex-wrap gap-2.5">
            {Object.entries(modeCounts).map(([mode, count]) => (
              <div key={mode} className="flex items-center gap-2.5 rounded-[12px] px-4 py-2.5"
                style={{ background: `${MODE_COLORS[mode] || '#003566'}08`, border: `1px solid ${MODE_COLORS[mode] || '#003566'}15` }}>
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: MODE_COLORS[mode] || "#003566" }} />
                <span className="text-[12px] font-medium text-[#1e293b] dark:text-white">{mode}</span>
                <span className="text-[12px] font-bold" style={{ color: MODE_COLORS[mode] || "#003566" }}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent sessions table */}
      {isLoading ? <Spinner /> : history.length > 0 ? (
        <div className="bg-white dark:bg-[#22272f] rounded-[16px] md:rounded-[20px] overflow-hidden border border-[#edf0f4] dark:border-[#3a3f47] shadow-sm">
          <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr] px-6 py-3.5 bg-gradient-to-r from-[#001d3d] via-[#003566] to-[#0967bd] dark:from-[#1a1f2e] dark:via-[#22272f] dark:to-[#2b3139]">
            {["Mode", "Duration", "Pomodoros", "Date"].map((col) => (
              <p key={col} className="text-[10px] md:text-[11px] font-bold text-white/70 dark:text-slate-300 uppercase tracking-[0.05em]">{col}</p>
            ))}
          </div>
          {history.slice(0, 20).map((s, idx) => (
            <div key={s.id} className={`grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-3 md:gap-0 px-4 md:px-6 py-3 md:py-3.5 items-start md:items-center border-b border-[#edf0f4] dark:border-[#3a3f47] last:border-0 hover:bg-[#f8f9fc] dark:hover:bg-[#2b3139] transition-colors ${idx % 2 ? "bg-[#fafbfc] dark:bg-[#1a1f2e]" : ""}`}>
              <div className="flex items-center justify-between md:col-span-4">
                <div className="md:hidden text-[11px] text-[#94a3b8] dark:text-slate-500 font-medium">Mode</div>
              </div>
              <div className="flex items-center gap-2.5 col-span-full md:col-span-1">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: MODE_COLORS[s.mode] || "#003566" }} />
                <span className="text-[12px] md:text-[13px] font-medium text-[#1e293b] dark:text-white">{s.mode}</span>
              </div>
              <span className="text-[12px] text-[#5a7089] dark:text-slate-400">{Math.round(s.durationMinutes || 0)} min</span>
              <span className="text-[12px] text-[#5a7089] dark:text-slate-400">{s.completedPomodoros || 0}</span>
              <span className="text-[11px] text-[#94a3b8] dark:text-slate-500">{s.timestamp ? new Date(s.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "â€”"}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-[#22272f] rounded-[20px] border border-[#edf0f4] dark:border-[#3a3f47]">
          <BookOpen className="w-8 h-8 text-[#c1c7ce] dark:text-slate-700 mb-3" />
          <p className="text-[13px] text-[#94a3b8] dark:text-slate-400">No study sessions recorded yet</p>
        </div>
      )}
    </div>
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Mood History
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const MOOD_META: Record<string, { emoji: string; color: string; bg: string }> = {
  "Amazing":   { emoji: "ðŸ˜„", color: "#16a34a", bg: "rgba(34,197,94,0.08)" },
  "Good":      { emoji: "ðŸ™‚", color: "#2563eb", bg: "rgba(37,99,235,0.08)" },
  "Okay":      { emoji: "ðŸ˜", color: "#f77f00", bg: "rgba(247,127,0,0.08)" },
  "Low":       { emoji: "ðŸ˜”", color: "#7c3aed", bg: "rgba(124,58,237,0.08)" },
  "Stressed":  { emoji: "ðŸ˜°", color: "#cc3636", bg: "rgba(204,54,54,0.08)" },
  "Anxious":   { emoji: "ðŸ˜Ÿ", color: "#cc3636", bg: "rgba(204,54,54,0.08)" },
  "Sad":       { emoji: "ðŸ˜¢", color: "#6b7280", bg: "rgba(107,114,128,0.08)" },
  "Happy":     { emoji: "ðŸ˜Š", color: "#16a34a", bg: "rgba(34,197,94,0.08)" },
  "Motivated": { emoji: "ðŸ’ª", color: "#003566", bg: "rgba(0,53,102,0.08)" },
  "Tired":     { emoji: "ðŸ˜´", color: "#6b7280", bg: "rgba(107,114,128,0.08)" },
};

function MoodHistoryPage() {
  const [checkins, setCheckins] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { moodCheckins.list().then(setCheckins).catch(console.log).finally(() => setIsLoading(false)); }, []);

  const moodCounts: Record<string, number> = {};
  checkins.forEach((c) => { moodCounts[c.mood] = (moodCounts[c.mood] || 0) + 1; });
  const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "â€”";

  return (
    <div className="p-6 md:p-8 lg:p-10" style={FONT}>
      <SectionHeader title="Mood History" desc="Track your emotional wellness journey over time" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-5 md:mb-6">
        <StatCard label="Total Check-ins" value={checkins.length} color="#003566" icon={<Smile className="w-4 h-4 text-[#003566]" />} />
        <StatCard label="Most Common Mood" value={topMood} color="#f77f00" icon={<TrendingUp className="w-4 h-4 text-[#f77f00]" />} />
        <StatCard label="This Month" value={checkins.filter((c) => new Date(c.timestamp).getMonth() === new Date().getMonth()).length} color="#16a34a" icon={<Calendar className="w-4 h-4 text-[#16a34a]" />} />
      </div>

      {/* Mood frequency */}
      {Object.keys(moodCounts).length > 0 && (
        <div className="bg-white dark:bg-[#22272f] rounded-[20px] border border-[#edf0f4] dark:border-[#3a3f47] p-6 mb-5 shadow-sm">
          <h3 className="text-[16px] font-bold text-[#003566] dark:text-blue-400 mb-4">Mood Frequency</h3>
          <div className="flex flex-wrap gap-2.5">
            {Object.entries(moodCounts).sort((a, b) => b[1] - a[1]).map(([mood, count]) => {
              const meta = MOOD_META[mood] || { emoji: "ðŸ™‚", color: "#003566", bg: "rgba(0,53,102,0.08)" };
              return (
                <div key={mood} className="flex items-center gap-2.5 rounded-[14px] px-4 py-2.5"
                  style={{ background: meta.bg, border: `1px solid ${meta.color}15` }}>
                  <span className="text-[16px]">{meta.emoji}</span>
                  <span className="text-[12px] font-semibold" style={{ color: meta.color }}>{mood}</span>
                  <span className="text-[12px] font-bold" style={{ color: meta.color }}>{count}Ã—</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* History list */}
      {isLoading ? <Spinner /> : checkins.length > 0 ? (
        <div className="flex flex-col gap-2.5 md:gap-3">
          {checkins.slice(0, 30).map((c) => {
            const meta = MOOD_META[c.mood] || { emoji: "ðŸ™‚", color: "#003566", bg: "rgba(0,53,102,0.08)" };
            return (
              <div key={c.id} className="bg-white dark:bg-[#22272f] rounded-[14px] md:rounded-[16px] border border-[#edf0f4] dark:border-[#3a3f47] px-3.5 md:px-5 py-3 md:py-4 flex items-center gap-3 md:gap-4 hover:shadow-md transition-shadow">
                <div className="w-9 md:w-11 h-9 md:h-11 rounded-[12px] md:rounded-[14px] flex items-center justify-center shrink-0 text-[18px] md:text-[22px]" style={{ background: meta.bg }}>
                  {c.emoji || meta.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] md:text-[14px] font-bold" style={{ color: meta.color }}>{c.mood}</p>
                  {c.note && <p className="text-[11px] md:text-[12px] text-[#5a7089] dark:text-slate-400 mt-0.5 truncate">{c.note}</p>}
                </div>
                <p className="text-[10px] md:text-[11px] text-[#c1c7ce] dark:text-slate-600 whitespace-nowrap shrink-0">
                  {c.timestamp ? new Date(c.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-[#22272f] rounded-[20px] border border-[#edf0f4] dark:border-[#3a3f47]">
          <Smile className="w-8 h-8 text-[#c1c7ce] dark:text-slate-700 mb-3" />
          <p className="text-[13px] text-[#94a3b8] dark:text-slate-400">No mood check-ins yet</p>
        </div>
      )}
    </div>
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Account & Security
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function DeleteAccountModal({ onConfirm, onCancel, isDeleting }: {
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}) {
  const [confirmText, setConfirmText] = useState("");
  const canDelete = confirmText === "DELETE";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={(e) => { if (e.target === e.currentTarget && !isDeleting) onCancel(); }}>
      <div className="bg-white dark:bg-[#22272f] rounded-[20px] shadow-2xl w-full max-w-[440px] p-6 flex flex-col gap-5" style={FONT}>
        {/* Icon + title */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-14 h-14 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
            <Trash2 className="w-6 h-6 text-[#cc3636]" />
          </div>
          <div>
            <h3 className="text-[18px] font-bold text-[#1e293b] dark:text-white">Delete Account</h3>
            <p className="text-[12px] text-[#94a3b8] dark:text-slate-400 mt-1 leading-relaxed">
              This will permanently delete your account and all associated data including sessions, study history, mood check-ins, and payment information. This action cannot be undone.
            </p>
          </div>
        </div>

        {/* Confirmation input */}
        <div className="flex flex-col gap-2">
          <label className="text-[12px] font-bold text-[#cc3636]">Type DELETE to confirm</label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="DELETE"
            disabled={isDeleting}
            className="w-full h-[44px] border-2 border-[#e2e8f0] dark:border-[#3a3f47] rounded-[12px] px-4 text-[13px] outline-none focus:border-[#cc3636] transition-all text-[#1e293b] dark:text-white placeholder:text-[#c1c7ce] dark:placeholder:text-slate-600 bg-white dark:bg-[#2b3139] disabled:opacity-60 font-mono tracking-widest"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 h-[44px] rounded-[12px] text-[13px] font-bold border border-[#e2e8f0] dark:border-[#3a3f47] text-[#5a7089] dark:text-slate-400 hover:bg-[#f8f9fc] dark:hover:bg-[#2b3139] transition-colors disabled:opacity-60 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={!canDelete || isDeleting}
            className="flex-1 h-[44px] rounded-[12px] text-[13px] font-bold text-white bg-[#cc3636] hover:bg-[#b02e2e] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
          >
            {isDeleting ? (
              <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Deleting...</>
            ) : (
              <><Trash2 className="w-4 h-4" /> Delete Account</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function SecurityPage({ onAccountDeleted }: { onAccountDeleted?: () => void }) {
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showCur, setShowCur] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showCon, setShowCon] = useState(false);
  const [status, setStatus] = useState<"" | "saving" | "saved" | "error">("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleSave() {
    setErrorMsg("");
    if (!currentPw || !newPw || !confirmPw) { setErrorMsg("All fields are required."); return; }
    if (newPw.length < 6) { setErrorMsg("New password must be at least 6 characters."); return; }
    if (newPw !== confirmPw) { setErrorMsg("Passwords do not match."); return; }
    
    setStatus("saving");
    try {
      const supabase = getSupabaseClient();
      const currentUser = getCurrentUser();
      
      if (!currentUser?.email) {
        setStatus("error");
        setErrorMsg("Unable to verify your identity.");
        return;
      }

      // Verify current password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: currentUser.email,
        password: currentPw,
      });

      if (signInError) {
        setStatus("error");
        setErrorMsg("Current password is incorrect.");
        return;
      }

      // Update to new password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPw,
      });

      if (updateError) {
        setStatus("error");
        setErrorMsg(updateError.message || "Failed to update password.");
        return;
      }

      setStatus("saved");
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
      toast.success("Password updated successfully!");
      setTimeout(() => setStatus(""), 3000);
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message || "Failed to update password.");
    }
  }

  async function handleDeleteAccount() {
    setIsDeleting(true);
    try {
      await auth.deleteOwnAccount();
      toast.success("Account deleted successfully");
      onAccountDeleted?.();
      // Redirect to login
      window.location.href = '/login';
    } catch (err: any) {
      setIsDeleting(false);
      toast.error(err.message || "Failed to delete account");
    }
  }

  function PwField({ label, value, show, onToggle, onChange }: {
    label: string; value: string; show: boolean; onToggle: () => void; onChange: (v: string) => void;
  }) {
    return (
      <div className="flex flex-col gap-2">
        <label className="text-[13px] font-bold text-[#003566] dark:text-blue-400">{label}</label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8] dark:text-slate-500"><Lock className="w-4 h-4" /></div>
          <input type={show ? "text" : "password"} value={value} onChange={(e) => onChange(e.target.value)}
            placeholder="••••••••" className={`${inputClass} pl-9 md:pl-10 pr-9 md:pr-10 text-[12px] md:text-[13px] h-[38px] md:h-[40px]`} />
          <button type="button" onClick={onToggle}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] dark:text-slate-500 hover:text-[#5a7089] dark:hover:text-slate-400 cursor-pointer transition-colors">
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 lg:p-10" style={FONT}>
      <SectionHeader title="Account & Security" desc="Keep your account safe and up to date" />

      <div className="max-w-full md:max-w-[500px] space-y-4 md:space-y-5">
        <div className="bg-white dark:bg-[#22272f] rounded-[16px] md:rounded-[20px] border border-[#edf0f4] dark:border-[#3a3f47] p-4 md:p-6 shadow-sm">
          <div className="flex items-center gap-2.5 mb-4 md:mb-5">
            <div className="w-8 h-8 rounded-[10px] flex items-center justify-center" style={{ background: 'rgba(0,53,102,0.06)' }}>
              <Lock className="w-4 h-4 text-[#003566]" />
            </div>
            <h3 className="text-[15px] md:text-[16px] font-bold text-[#003566] dark:text-blue-400">Change Password</h3>
          </div>

          <div className="space-y-4 md:space-y-4">
            <PwField label="Current Password" value={currentPw} show={showCur} onToggle={() => setShowCur((v) => !v)} onChange={setCurrentPw} />
            <PwField label="New Password" value={newPw} show={showNew} onToggle={() => setShowNew((v) => !v)} onChange={setNewPw} />
            <PwField label="Confirm New Password" value={confirmPw} show={showCon} onToggle={() => setShowCon((v) => !v)} onChange={setConfirmPw} />
          </div>

          {errorMsg && (
            <div className="mt-4 bg-[#cc3636]/5 dark:bg-[#cc3636]/10 border border-[#cc3636]/10 dark:border-[#cc3636]/20 rounded-[12px] px-4 py-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#cc3636] shrink-0" />
              <p className="text-[12px] text-[#cc3636] font-medium">{errorMsg}</p>
            </div>
          )}
          {status === "saved" && (
            <div className="mt-4 bg-[#16a34a]/5 dark:bg-[#16a34a]/10 border border-[#16a34a]/10 dark:border-[#16a34a]/20 rounded-[12px] px-4 py-3 flex items-center gap-2">
              <Check className="w-4 h-4 text-[#16a34a] shrink-0" />
              <p className="text-[12px] text-[#16a34a] font-medium">Password updated successfully!</p>
            </div>
          )}

          <div className="flex justify-end mt-4 md:mt-5">
            <button onClick={handleSave} disabled={status === "saving"}
              className="h-[42px] md:h-[44px] px-6 md:px-8 rounded-[14px] text-[12px] md:text-[13px] font-bold text-white transition-all cursor-pointer disabled:opacity-60 hover:shadow-lg flex items-center gap-2 w-full md:w-auto justify-center md:justify-start"
              style={{ background: 'linear-gradient(135deg, #003566, #0967bd)' }}>
              {status === "saving" && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              Update Password
            </button>
          </div>
        </div>

        {/* Account Info */}
        <div className="bg-white dark:bg-[#22272f] rounded-[16px] md:rounded-[20px] border border-[#edf0f4] dark:border-[#3a3f47] p-4 md:p-6 shadow-sm">
          <h3 className="text-[15px] md:text-[16px] font-bold text-[#003566] dark:text-blue-400 mb-4">Account Info</h3>
          <TwoFASettings />
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-6 py-4 md:py-4 border-t border-[#edf0f4] dark:border-[#3a3f47]">
            <div>
              <p className="text-[12px] md:text-[13px] font-semibold text-[#1e293b] dark:text-white mb-0.5">Delete Account</p>
              <p className="text-[10px] md:text-[11px] text-[#94a3b8] dark:text-slate-400 mt-0.5">Permanently remove your account and data</p>
            </div>
            <button onClick={() => setShowDeleteModal(true)} className="text-[10px] md:text-[11px] font-bold text-[#cc3636] border border-[#cc3636] px-3 py-1.5 md:px-3 md:py-1.5 rounded-[10px] hover:bg-red-50 dark:hover:bg-[#2b3139] transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap w-full md:w-auto justify-center md:justify-start">
              <Trash2 className="w-3 h-3" /> Delete
            </button>
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <DeleteAccountModal 
          onConfirm={handleDeleteAccount} 
          onCancel={() => setShowDeleteModal(false)}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Notifications
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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
  const [isSaving, setIsSaving] = useState(false);

  // Load saved preferences on mount
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const supabase = getSupabaseClient();
        const user = getCurrentUser();
        if (!user) return;

        const { data } = await supabase
          .from('profiles')
          .select('notification_preferences')
          .eq('id', user.id)
          .single();

        if (data?.notification_preferences) {
          setEnabled((prev) => ({
            ...prev,
            ...data.notification_preferences,
          }));
        }
      } catch (err) {
        console.log('Failed to load notification preferences:', err);
      }
    };
    loadPreferences();
  }, []);

  async function handleSave() {
    setIsSaving(true);
    try {
      const supabase = getSupabaseClient();
      const user = getCurrentUser();
      if (!user) {
        toast.error("Authentication expired. Please log in again.");
        return;
      }

      // Save to database
      const { error } = await supabase
        .from('profiles')
        .update({ notification_preferences: enabled })
        .eq('id', user.id);

      if (error) {
        toast.error("Failed to save preferences");
        return;
      }

      setSaved(true);
      toast.success("Notification preferences saved!");
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      toast.error(err.message || "Failed to save preferences");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 lg:p-10" style={FONT}>
      <SectionHeader title="Notifications" desc="Choose which notifications you'd like to receive" />

      <div className="max-w-full md:max-w-[640px] bg-white dark:bg-[#22272f] rounded-[16px] md:rounded-[20px] border border-[#edf0f4] dark:border-[#3a3f47] shadow-sm overflow-hidden">
        <div className="p-4 md:p-6 flex flex-col gap-0">
          {NOTIF_SETTINGS.map((item, i) => (
            <div key={item.key} className={`flex flex-col md:flex-row md:items-start md:justify-between gap-3 md:gap-6 py-4 md:py-5 ${i < NOTIF_SETTINGS.length - 1 ? "border-b border-[#edf0f4] dark:border-[#3a3f47]" : ""}`}>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] md:text-[14px] font-bold text-[#1e293b] dark:text-white mb-0.5">{item.label}</p>
                <p className="text-[11px] md:text-[12px] text-[#94a3b8] dark:text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
              <div className="flex justify-between items-center md:items-start">
                <span className="md:hidden text-[11px] text-[#94a3b8] dark:text-slate-500 font-medium">Enable</span>
                <Toggle on={enabled[item.key]} onClick={() => setEnabled((prev) => ({ ...prev, [item.key]: !prev[item.key] }))} />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end px-4 md:px-6 py-3 md:py-4 border-t border-[#edf0f4] dark:border-[#3a3f47]">
          <button onClick={handleSave} disabled={isSaving}
            className="h-[42px] md:h-[44px] px-6 md:px-8 rounded-[14px] text-[12px] md:text-[13px] font-bold text-white transition-all cursor-pointer hover:shadow-lg disabled:opacity-60 flex items-center gap-2 w-full md:w-auto justify-center md:justify-start"
            style={{ background: 'linear-gradient(135deg, #003566, #0967bd)' }}>
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span className="hidden md:inline">Saving...</span>
              </>
            ) : saved ? (
              <><Check className="w-4 h-4" /> <span className="hidden md:inline">Saved!</span></>
            ) : (
              <><Save className="w-4 h-4" /> <span className="hidden md:inline">Save Preferences</span><span className="md:hidden">Save</span></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Main UserProfileSettings
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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
      <div className="py-4 border-b border-[#edf0f4] dark:border-[#3a3f47]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-[10px] flex items-center justify-center" style={{ background: 'rgba(158,51,226,0.06)' }}>
            <Check className="w-4 h-4 text-[#9e33e2]" />
          </div>
          <h4 className="text-[14px] font-bold text-[#1e293b] dark:text-white">Verify Your Email</h4>
        </div>
        <p className="text-[12px] text-[#5a7089] dark:text-slate-400 mb-4">Enter the 6-digit code sent to your email</p>
        <input
          type="text"
          maxLength={6}
          value={otpInput}
          onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
          placeholder="000000"
          className={inputClass}
        />
        <p className="text-[11px] text-[#94a3b8] dark:text-slate-500 mt-2">Expires in {timeLeft}s</p>
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
            className="h-[44px] px-6 rounded-[12px] text-[13px] font-bold text-[#5a7089] dark:text-slate-400 border border-[#e2e8f0] dark:border-[#3a3f47] cursor-pointer hover:bg-[#f8f9fc] dark:hover:bg-[#2b3139]"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between py-4 border-b border-[#edf0f4] dark:border-[#3a3f47]">
      <div>
        <p className="text-[13px] font-semibold text-[#1e293b] dark:text-white">Two-Factor Authentication</p>
        <p className="text-[11px] text-[#94a3b8] dark:text-slate-400 mt-0.5">
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
    <div className="flex flex-col md:flex-row h-full w-full overflow-hidden" style={FONT}>
      {/* â”€â”€ Mobile Tab Navigation â”€â”€ */}
      <div className="md:hidden flex flex-col gap-3 bg-white dark:bg-[#22272f] border-b border-[#edf0f4] dark:border-[#3a3f47] px-4 py-3">
        <div className="flex items-center justify-between gap-2 mb-2">
          <button onClick={onBack} className="flex items-center gap-2 text-[#5a7089] dark:text-slate-400 hover:text-[#003566] dark:hover:text-blue-400 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-[12px] font-medium">Back</span>
          </button>
          <div className="flex flex-col items-end">
            <p className="text-[13px] font-bold text-[#003566] dark:text-blue-400">{currentUser?.name || "Student"}</p>
            <span className="text-[10px] text-[#94a3b8] dark:text-slate-500 mt-0.5">{currentUser?.gradeLevel || "Student"}</span>
          </div>
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
          {navConfig.map((item) => {
            const isActive = activeNav === item.key;
            return (
              <button key={item.key} onClick={() => setActiveNav(item.key)}
                className={`px-3 py-1.5 rounded-[10px] text-[11px] font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? "text-white"
                    : "text-[#94a3b8] dark:text-slate-500 bg-[#f5f7fa] dark:bg-[#2b3139]"
                }`}
                style={isActive ? { background: 'linear-gradient(135deg, #003566, #0967bd)' } : undefined}>
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* â”€â”€ Desktop Sidebar Navigation â”€â”€ */}
      <div className="hidden md:flex md:w-[280px] shrink-0 flex-col overflow-y-auto border-r border-[#edf0f4] dark:border-[#3a3f47] bg-white dark:bg-[#1a1f2e]">
        {/* Back + Title */}
        <div className="px-6 pt-8 pb-5 bg-white dark:bg-[#1a1f2e]">
          <button onClick={onBack} className="flex items-center gap-2 text-[#5a7089] dark:text-slate-400 hover:text-[#003566] dark:hover:text-blue-400 mb-3 transition-colors group cursor-pointer">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[12px] font-medium">Dashboard</span>
          </button>
          <h1 className="text-[28px] text-[#003566] dark:text-blue-400" style={HEADING}>Profile</h1>
        </div>

        {/* Avatar preview */}
        <div className="flex flex-col items-center gap-2.5 px-6 py-5 border-b border-[#edf0f4] dark:border-[#3a3f47] bg-white dark:bg-[#1a1f2e]">
          <div className="w-[72px] h-[72px] rounded-full overflow-hidden border-3 border-[#edf0f4] dark:border-[#3a3f47] shadow-lg">
            <img src={currentUser?.avatar || imgEllipse1} alt="Profile" className="w-full h-full object-cover" />
          </div>
          <div className="text-center">
            <p className="text-[13px] font-bold text-[#003566] dark:text-blue-400">{currentUser?.name || "Student"}</p>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-[#0967bd] dark:text-blue-300 mt-1"
              style={{ background: 'rgba(9,103,189,0.06)', border: '1px solid rgba(9,103,189,0.1)' }}>
              {currentUser?.gradeLevel || "Elm Origin Student"}
            </span>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex flex-col gap-1 px-3 py-4">
          {navConfig.map((item) => {
            const isActive = activeNav === item.key;
            return (
              <button key={item.key} onClick={() => setActiveNav(item.key)}
                className="flex items-center gap-3 px-4 py-2.5 rounded-[12px] w-full text-left transition-all cursor-pointer font-medium text-[13px]"
                style={isActive ? {
                  background: 'linear-gradient(135deg, #003566, #0967bd)',
                  color: 'white'
                } : {
                  background: '#2b3139',
                  color: 'white'
                }}>
                <span style={{ display: 'flex', alignItems: 'center' }}>{item.icon}</span>
                <span>{item.label}</span>
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#f77f00]" />}
              </button>
            );
          })}
        </nav>
      </div>


      <div className="flex-1 overflow-y-auto bg-[#f8f9fc] dark:bg-[#1a1f2e]">
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

