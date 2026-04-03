import React, { useState, useEffect, useRef, useCallback } from "react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { toast } from "sonner";
import { SilentModeView } from "./SilentModeView";
import { PostReportNotification } from "./PostReportNotification";
import { notes as notesApi, studySessions } from "@/app/lib/api";

// Import Images
import imgScreenshot111 from "figma:asset/a474824d07b7e42cbfd6a81ec948e9946f5e4c3e.png";
import imgImage29 from "figma:asset/30b04958b99e4725a9210a26769081ac12720108.png";
import imgImage30 from "figma:asset/aa7efc412ce1a4c3d775b48b4309e6230467e2c0.png";
import imgImage31 from "figma:asset/de662746f74c12720ca8b42aaa277de185521cd9.png";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const pad = (n: number) => n.toString().padStart(2, "0");
const fmtTimer = (s: number) => `${pad(Math.floor(s / 60))}:${pad(s % 60)}`;
const fmtElapsed = (s: number) => {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${pad(h)}:${pad(m)}:${pad(sec)}`;
};

// ─── Circular Progress Ring ──────────────────────────────────────────────────

function ProgressRing({ radius, stroke, progress, color }: { radius: number; stroke: number; progress: number; color: string }) {
  const norm = radius - stroke / 2;
  const circ = 2 * Math.PI * norm;
  const offset = circ - (progress / 100) * circ;
  return (
    <svg width={radius * 2} height={radius * 2} className="rotate-[-90deg]">
      <circle cx={radius} cy={radius} r={norm} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
      <circle
        cx={radius} cy={radius} r={norm} fill="none"
        stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-500"
      />
    </svg>
  );
}

// ─── Timer Panel ─────────────────────────────────────────────────────────────

function TimerPanel({ onClose }: { onClose: () => void }) {
  const [totalTime, setTotalTime] = useState(1500);
  const [timeLeft, setTimeLeft] = useState(1500);
  const [isActive, setIsActive] = useState(false);
  const [label, setLabel] = useState("Pomodoro");
  const [totalStudyHours, setTotalStudyHours] = useState(0);
  const [totalCompletedSessions, setTotalCompletedSessions] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const refreshStudySummary = useCallback(async () => {
    try {
      const summary = await studySessions.summary();
      setTotalStudyHours(summary.totalHours);
      setTotalCompletedSessions(summary.totalSessions);
    } catch {
      // Non-blocking for timer UX.
    }
  }, []);

  const persistCompletedSession = useCallback(async (durationSeconds: number, modeLabel: string) => {
    const durationMinutes = Number((durationSeconds / 60).toFixed(2));
    const completedPomodoros = modeLabel.toLowerCase().includes("pomodoro") ? 1 : 0;
    await studySessions.record(modeLabel.toLowerCase(), durationMinutes, completedPomodoros);
    await refreshStudySummary();
  }, [refreshStudySummary]);

  useEffect(() => {
    void refreshStudySummary();
  }, [refreshStudySummary]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => setTimeLeft((p) => p - 1), 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      void persistCompletedSession(totalTime, label)
        .then(() => {
          toast.success("Timer complete! Session saved to your study history.");
        })
        .catch(() => {
          toast.error("Timer complete, but failed to save session.");
        });
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isActive, timeLeft, totalTime, label, persistCompletedSession]);

  const progress = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0;

  const presets = [
    { label: "Pomodoro", time: 1500 },
    { label: "Short Break", time: 300 },
    { label: "Long Break", time: 900 },
    { label: "Deep Work", time: 3600 },
  ];

  const selectPreset = (p: typeof presets[0]) => {
    setTotalTime(p.time);
    setTimeLeft(p.time);
    setLabel(p.label);
    setIsActive(true);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-end pointer-events-none" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Backdrop - click to close */}
      <div className="absolute inset-0 pointer-events-auto" onClick={onClose} />

      {/* Panel */}
      <div
        className="relative pointer-events-auto w-[380px] md:w-[420px] mb-24 mr-4 md:mr-10 rounded-[24px] border border-white/[0.12] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300"
        style={{ background: 'rgba(0,20,50,0.94)', backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-7 pt-6 pb-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[10px] flex items-center justify-center" style={{ background: 'rgba(247,127,0,0.2)' }}>
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="#f77f00">
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.2 14.2L11 13V7h1.5v5.2l4.5 2.7-.8 1.3z" />
              </svg>
            </div>
            <h2 className="text-[18px] font-bold text-white">Focus Timer</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center transition-colors cursor-pointer">
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Timer Display */}
        <div className="flex flex-col items-center py-6 gap-2">
          <div className="relative">
            <ProgressRing radius={90} stroke={6} progress={progress} color={isActive ? "#f77f00" : "#0967bd"} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[42px] font-bold text-white tabular-nums tracking-tight" style={{ fontFamily: "'DM Serif Display', serif" }}>
                {fmtTimer(timeLeft)}
              </span>
              <span className="text-[12px] font-medium text-white/40 uppercase tracking-wider">{label}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 mt-3">
            <button
              onClick={() => { setIsActive(false); setTimeLeft(totalTime); }}
              className="px-5 py-2.5 rounded-full text-[13px] font-semibold transition-all cursor-pointer hover:opacity-80"
              style={{ background: 'rgba(204,54,54,0.15)', color: '#ff6b6b' }}
            >
              Reset
            </button>
            <button
              onClick={() => setIsActive(!isActive)}
              className="px-7 py-2.5 rounded-full text-[13px] font-bold transition-all shadow-lg cursor-pointer hover:opacity-90"
              style={{
                background: isActive ? 'rgba(251,191,36,0.15)' : 'linear-gradient(135deg, #f77f00, #e63946)',
                color: isActive ? '#fbbf24' : 'white',
                boxShadow: isActive ? 'none' : '0 4px 20px rgba(247,127,0,0.3)',
              }}
            >
              {isActive ? "Pause" : "Start"}
            </button>
          </div>
        </div>

        {/* Presets */}
        <div className="px-7 pb-6">
          <div className="mb-4 rounded-[14px] border border-white/[0.08] bg-white/[0.04] px-4 py-3">
            <p className="text-[11px] font-semibold text-white/30 uppercase tracking-wider">Your Study Stats</p>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-[13px] text-white/70">Total Hours</span>
              <span className="text-[14px] font-bold text-white">{totalStudyHours.toFixed(2)}h</span>
            </div>
            <div className="mt-1 flex items-center justify-between">
              <span className="text-[13px] text-white/70">Sessions Logged</span>
              <span className="text-[14px] font-bold text-white">{totalCompletedSessions}</span>
            </div>
          </div>

          <p className="text-[11px] font-semibold text-white/30 uppercase tracking-wider mb-3">Quick Presets</p>
          <div className="grid grid-cols-2 gap-2">
            {presets.map((p) => (
              <button
                key={p.label}
                onClick={() => selectPreset(p)}
                className="flex items-center justify-between px-4 py-3 rounded-[14px] transition-all hover:bg-white/[0.1] group cursor-pointer"
                style={{
                  background: label === p.label && isActive ? 'rgba(247,127,0,0.12)' : 'rgba(255,255,255,0.04)',
                  border: label === p.label && isActive ? '1px solid rgba(247,127,0,0.3)' : '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <div className="text-left">
                  <div className="text-[13px] font-semibold text-white/80">{p.label}</div>
                  <div className="text-[11px] text-white/30">{fmtTimer(p.time)}</div>
                </div>
                <div className="w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: 'rgba(247,127,0,0.2)' }}>
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="#f77f00"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Notes Panel ─────────────────────────────────────────────────────────────

interface Note { id: string; title: string; content: string; date: string; }

function NotesPanel({ onClose }: { onClose: () => void }) {
  const [notesList, setNotesList] = useState<Note[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null | "new">(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    notesApi.list()
      .then((data: any[]) => {
        setNotesList(data.map((n) => ({
          id: n.id, title: n.title || "Untitled", content: n.content || "",
          date: n.createdAt ? new Date(n.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "Just now",
        })));
      })
      .catch((e) => { console.log("Error loading notes:", e); toast.error("Failed to load notes"); })
      .finally(() => setIsLoading(false));
  }, []);

  const openNew = () => { setEditTitle(""); setEditContent(""); setEditingId("new"); };
  const openEdit = (note: Note) => { setEditTitle(note.title); setEditContent(note.content); setEditingId(note.id); };

  const handleSave = async () => {
    if (!editTitle.trim() && !editContent.trim()) { setEditingId(null); return; }
    setIsSaving(true);
    try {
      if (editingId === "new") {
        const created = await notesApi.create(editTitle.trim() || "Untitled", editContent.trim());
        setNotesList((prev) => [{ id: created.id, title: created.title || "Untitled", content: created.content || "", date: "Just now" }, ...prev]);
        toast.success("Note saved");
      } else if (editingId) {
        await notesApi.update(editingId, { title: editTitle.trim() || "Untitled", content: editContent.trim() });
        setNotesList((prev) => prev.map((n) => n.id === editingId ? { ...n, title: editTitle.trim() || "Untitled", content: editContent.trim() } : n));
        toast.success("Note updated");
      }
    } catch (e) { console.log("Error saving note:", e); toast.error("Failed to save note"); }
    finally { setIsSaving(false); setEditingId(null); }
  };

  const deleteNote = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try { await notesApi.delete(id); setNotesList((prev) => prev.filter((n) => n.id !== id)); toast.success("Note deleted"); }
    catch (e) { console.log("Error deleting note:", e); toast.error("Failed to delete note"); }
  };

  const filteredNotes = notesList.filter((n) => n.title.toLowerCase().includes(search.toLowerCase()) || n.content.toLowerCase().includes(search.toLowerCase()));

  const panelBg: React.CSSProperties = {
    background: 'rgba(0,20,50,0.94)',
    backdropFilter: 'blur(40px)',
    WebkitBackdropFilter: 'blur(40px)',
  };

  // ── Edit / Create view ──
  if (editingId !== null) {
    return (
      <div className="fixed inset-0 z-[60] flex items-stretch justify-end pointer-events-none" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <div className="absolute inset-0 pointer-events-auto" onClick={() => setEditingId(null)} />
        <div
          className="relative pointer-events-auto w-[380px] md:w-[420px] my-4 mr-4 md:mr-10 rounded-[24px] border border-white/[0.12] shadow-2xl flex flex-col overflow-hidden animate-in fade-in duration-200"
          style={panelBg}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-7 pt-6 pb-3 shrink-0">
            <button onClick={() => setEditingId(null)} className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-[13px] font-semibold cursor-pointer">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>
              Back
            </button>
            <button onClick={handleSave} disabled={isSaving}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full text-[13px] font-bold transition-all disabled:opacity-50 cursor-pointer hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #003566, #0967bd)', color: 'white' }}>
              {isSaving && <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              Save
            </button>
          </div>

          {/* Title Input */}
          <div className="px-7 shrink-0">
            <input type="text" placeholder="Note title…" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} autoFocus
              className="w-full bg-transparent text-[20px] font-bold text-white outline-none placeholder:text-white/20 border-b border-white/[0.08] pb-3" />
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-7 pt-4 pb-2">
            <textarea placeholder="Start writing your note…" value={editContent} onChange={(e) => setEditContent(e.target.value)}
              className="w-full h-full bg-transparent text-[14px] text-white/70 outline-none placeholder:text-white/20 resize-none leading-relaxed min-h-[200px]" />
          </div>

          {/* Footer */}
          <div className="px-7 py-3 shrink-0 border-t border-white/[0.06]">
            <p className="text-[11px] text-white/20 text-right">{editContent.length} characters</p>
          </div>
        </div>
      </div>
    );
  }

  // ── List view ──
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-end pointer-events-none" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="absolute inset-0 pointer-events-auto" onClick={onClose} />
      <div
        className="relative pointer-events-auto w-[380px] md:w-[420px] mb-24 mr-4 md:mr-10 max-h-[calc(100vh-120px)] rounded-[24px] border border-white/[0.12] shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300"
        style={panelBg}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-7 pt-6 pb-2 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[10px] flex items-center justify-center" style={{ background: 'rgba(9,103,189,0.2)' }}>
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="#0967bd" strokeWidth="2" strokeLinecap="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
              </svg>
            </div>
            <h2 className="text-[18px] font-bold text-white">Notes</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center transition-colors cursor-pointer">
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Search */}
        <div className="px-7 py-3 shrink-0">
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-[14px] border border-white/[0.08]" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
            <input type="text" placeholder="Search notes…" value={search} onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-[13px] text-white/70 placeholder:text-white/25 outline-none w-full" />
          </div>
        </div>

        {/* Section Header */}
        <div className="flex items-center justify-between px-7 py-2 shrink-0">
          <p className="text-[11px] font-semibold text-white/25 uppercase tracking-wider">My Notes</p>
          <button onClick={openNew} className="w-7 h-7 rounded-full bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center transition-colors cursor-pointer" title="New Note">
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
          </button>
        </div>

        {/* Notes List */}
        <div className="flex-1 overflow-y-auto px-7 pb-6 flex flex-col gap-2.5 min-h-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-10"><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /></div>
          ) : filteredNotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <div className="w-12 h-12 rounded-full bg-white/[0.05] flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.2">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
                </svg>
              </div>
              <p className="text-[13px] text-white/25 text-center">{search ? "No notes match your search" : "No notes yet"}</p>
              {!search && (
                <button onClick={openNew} className="px-4 py-2 rounded-full text-[12px] font-semibold text-white/50 bg-white/[0.06] hover:bg-white/[0.12] transition-colors cursor-pointer">
                  + Create your first note
                </button>
              )}
            </div>
          ) : (
            filteredNotes.map((note) => (
              <div key={note.id} onClick={() => openEdit(note)}
                className="px-4 py-3.5 rounded-[14px] transition-all cursor-pointer group"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'; }}
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-[14px] font-semibold text-white/80 line-clamp-1">{note.title}</h3>
                  <button onClick={(e) => deleteNote(note.id, e)} className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 p-1 rounded-full hover:bg-red-500/20 cursor-pointer">
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="#ff6b6b" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
                  </button>
                </div>
                <p className="text-[12px] text-white/35 line-clamp-2 mt-1">{note.content || "Empty note"}</p>
                <p className="text-[10px] text-white/[0.15] mt-2">{note.date}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Background Selector ─────────────────────────────────────────────────────

function BackgroundSelector({
  onSelect,
  onClose,
  currentBackground,
}: {
  onSelect: (bg: string) => void;
  onClose: () => void;
  currentBackground: string;
}) {
  const backgrounds = [
    { id: "train", src: imgScreenshot111, label: "Train Journey" },
    { id: "snow", src: imgImage29, label: "Snow Cafe" },
    { id: "space", src: imgImage30, label: "Deep Space" },
    { id: "jungle", src: imgImage31, label: "Tropical" },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center pointer-events-none" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Backdrop */}
      <div className="absolute inset-0 pointer-events-auto" onClick={onClose} />

      {/* Selector */}
      <div
        className="relative pointer-events-auto mb-24 rounded-[20px] border border-white/[0.12] shadow-2xl p-4 flex gap-3 overflow-x-auto animate-in fade-in slide-in-from-bottom-4 duration-300"
        style={{ background: 'rgba(0,20,50,0.94)', backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)' }}
      >
        {backgrounds.map((bg) => (
          <button
            key={bg.id}
            onClick={() => onSelect(bg.src)}
            className={`relative w-[160px] h-[100px] md:w-[200px] md:h-[120px] rounded-[14px] overflow-hidden shrink-0 transition-all duration-200 group cursor-pointer ${currentBackground === bg.src ? "ring-2 ring-[#f77f00] scale-[1.02]" : "opacity-60 hover:opacity-100"}`}
          >
            <ImageWithFallback src={bg.src} alt={bg.label} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-2.5">
              <span className="text-[11px] font-semibold text-white">{bg.label}</span>
            </div>
            {currentBackground === bg.src && (
              <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#f77f00] flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Toolbar Button ──────────────────────────────────────────────────────────

function ToolbarBtn({
  active,
  label,
  onClick,
  title,
  children,
}: {
  active?: boolean;
  label?: string;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`relative flex items-center gap-2 h-12 rounded-full transition-all duration-200 cursor-pointer ${
        active
          ? "bg-white shadow-[0_0_20px_rgba(255,255,255,0.25)] px-4"
          : "w-12 justify-center bg-white/[0.08] hover:bg-white/[0.15]"
      }`}
    >
      <div className={active ? "text-[#003566]" : "text-white"}>
        {children}
      </div>
      {active && label && (
        <span className="text-[12px] font-bold text-[#003566] pr-1">{label}</span>
      )}
    </button>
  );
}

// ─── Focus Mode (Main) ──────────────────────────────────────────────────────

interface FocusModeProps { onLeave: () => void; }

export function FocusMode({ onLeave }: FocusModeProps) {
  const [activePanel, setActivePanel] = useState<"timer" | "notes" | "bg" | null>(null);
  const [backgroundImage, setBackgroundImage] = useState(imgScreenshot111);
  const [blockNotifs, setBlockNotifs] = useState(false);
  const [isSilentMode, setIsSilentMode] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [reportNotification, setReportNotification] = useState<{ visible: boolean; name: string }>({ visible: false, name: "" });

  // Elapsed timer
  useEffect(() => {
    const id = setInterval(() => setElapsed((p) => p + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const toggleSilentMode = () => {
    const next = !isSilentMode;
    setIsSilentMode(next);
    toast[next ? "success" : "info"](next ? "Silent Mode activated" : "Focus Mode activated");
  };

  const togglePanel = useCallback((panel: "timer" | "notes" | "bg") => {
    setActivePanel((prev) => (prev === panel ? null : panel));
  }, []);

  const closePanel = useCallback(() => {
    setActivePanel(null);
  }, []);

  if (isSilentMode) {
    return (
      <>
        <SilentModeView onLeave={onLeave} onBackToFocus={toggleSilentMode} onReportSubmitted={(name: string) => setReportNotification({ visible: true, name })} />
        <PostReportNotification isVisible={reportNotification.visible} participantName={reportNotification.name} onClose={() => setReportNotification({ visible: false, name: "" })} />
      </>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* ─── Background ─── */}
      <div className="absolute inset-0">
        <ImageWithFallback key={backgroundImage} alt="Focus Background" className="w-full h-full object-cover animate-in fade-in duration-700" src={backgroundImage} />
        <div className="absolute inset-x-0 top-0 h-[200px] bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-[300px] bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
      </div>

      {/* ─── Top Bar ─── */}
      <div className="relative z-10 flex items-center justify-between px-6 md:px-10 pt-6 pb-4">
        {/* Left */}
        <div className="flex items-center gap-4">
          <button onClick={onLeave} className="w-9 h-9 rounded-full bg-white/[0.1] hover:bg-white/[0.2] flex items-center justify-center transition-all backdrop-blur-sm border border-white/[0.1] cursor-pointer">
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-bold text-white">Focus Mode</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
            </div>
            <span className="text-[11px] text-white/40">Session in progress</span>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full border border-white/[0.1] bg-white/[0.05] backdrop-blur-sm">
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.5">
              <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
            </svg>
            <span className="text-[13px] font-semibold text-white/60 tabular-nums">{fmtElapsed(elapsed)}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-white/[0.1] bg-white/[0.05] backdrop-blur-sm">
            <span className="w-[5px] h-[5px] rounded-full bg-[#22c55e] animate-pulse" />
            <span className="text-[11px] font-semibold text-white/50">128 online</span>
          </div>
        </div>
      </div>

      {/* ─── Center area (spacer) ─── */}
      <div className="flex-1" />

      {/* ─── Overlay Panels (rendered at root level with fixed positioning) ─── */}
      {activePanel === "timer" && <TimerPanel onClose={closePanel} />}
      {activePanel === "notes" && <NotesPanel onClose={closePanel} />}
      {activePanel === "bg" && (
        <BackgroundSelector
          onSelect={(bg) => setBackgroundImage(bg)}
          onClose={closePanel}
          currentBackground={backgroundImage}
        />
      )}

      {/* ─── Bottom Toolbar ─── */}
      <div className="relative z-10 w-full px-4 md:px-10 pb-6 pt-2 flex flex-wrap items-center justify-center gap-3 md:gap-4">
        {/* Toolbar pill */}
        <div
          className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-white/[0.1] shadow-2xl"
          style={{ background: 'rgba(0,20,50,0.75)', backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)' }}
        >
          {/* Timer */}
          <ToolbarBtn active={activePanel === "timer"} label="Timer" onClick={() => togglePanel("timer")} title="Focus Timer">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.2 14.2L11 13V7h1.5v5.2l4.5 2.7-.8 1.3z" />
            </svg>
          </ToolbarBtn>

          {/* Notes */}
          <ToolbarBtn active={activePanel === "notes"} label="Notes" onClick={() => togglePanel("notes")} title="Notes">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
            </svg>
          </ToolbarBtn>

          {/* Block Notifications */}
          <ToolbarBtn
            active={blockNotifs}
            label={blockNotifs ? "Blocked" : undefined}
            onClick={() => {
              const next = !blockNotifs;
              setBlockNotifs(next);
              toast[next ? "success" : "info"](next ? "Notifications blocked" : "Notifications allowed");
            }}
            title={blockNotifs ? "Unblock Notifications" : "Block Notifications"}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {blockNotifs ? (
                <>
                  <path d="M13.73 21a2 2 0 01-3.46 0" />
                  <path d="M18.63 13A17.89 17.89 0 0118 8" />
                  <path d="M6.26 6.26A5.86 5.86 0 006 8c0 7-3 9-3 9h14" />
                  <path d="M18 8a6 6 0 00-9.33-5" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </>
              ) : (
                <>
                  <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 01-3.46 0" />
                </>
              )}
            </svg>
          </ToolbarBtn>

          {/* Background */}
          <ToolbarBtn active={activePanel === "bg"} label="Scene" onClick={() => togglePanel("bg")} title="Change Background">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" />
            </svg>
          </ToolbarBtn>

          {/* Divider */}
          <div className="w-px h-8 bg-white/[0.1] mx-0.5" />

          {/* Silent Mode */}
          <ToolbarBtn onClick={toggleSilentMode} title="Switch to Silent Mode">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          </ToolbarBtn>

          {/* Music */}
          <ToolbarBtn onClick={() => toast.info("Music player coming soon")} title="Music">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
            </svg>
          </ToolbarBtn>
        </div>

        {/* Leave button */}
        <button
          onClick={onLeave}
          className="h-12 px-7 rounded-full flex items-center gap-2 text-[14px] font-bold text-white transition-all hover:scale-105 active:scale-95 shadow-lg shrink-0 cursor-pointer"
          style={{ background: 'linear-gradient(135deg, #cc3636, #e63946)', boxShadow: '0 4px 20px rgba(204,54,54,0.4)' }}
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
          </svg>
          Leave
        </button>
      </div>
    </div>
  );
}
