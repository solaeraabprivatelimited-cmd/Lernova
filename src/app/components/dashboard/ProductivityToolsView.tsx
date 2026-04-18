import React, { useState, useEffect } from "react";
import imgNotesImage from "figma:asset/00ae786af8ac4c0943552db9a6f6dfd10268ca06.png";
import imgPlannerImage from "figma:asset/3bed40028d21e55021d8008bb0100eca00d08ab3.png";
import { notes as notesApi, notifications as notificationsApi, tasks as tasksApi, reminders as remindersApi, studyPlans as studyPlansApi } from "@/app/lib/api";
import { SkeletonProductivityTools } from "@/app/components/skeletons/PageSkeletons";
import {
  ArrowLeft, Plus, Search, FileText, Sparkles, ArrowRight,
  StickyNote, ClipboardList, Clock, ChevronDown, Check, Trash2, X,
  Bell, BookOpen, CheckCircle, Target, ChevronRight
} from "lucide-react";

/* ═══════ LANDING PAGE ═══════ */

interface ToolCard {
  id: string;
  title: string;
  description: string;
  image: string;
  icon: React.ReactNode;
  accent: string;
  features: string[];
}

const tools: ToolCard[] = [
  {
    id: "notes",
    title: "Notes",
    description: "Write freely and store your thoughts in one neat place.",
    image: imgNotesImage,
    icon: <StickyNote className="w-5 h-5 text-white" />,
    accent: "#0967bd",
    features: ["Quick capture", "Rich text", "Search & filter"],
  },
  {
    id: "planner",
    title: "Planner / Scheduler",
    description: "Organize your day, set goals, and track your progress.",
    image: imgPlannerImage,
    icon: <ClipboardList className="w-5 h-5 text-white" />,
    accent: "#f77f00",
    features: ["Tasks & reminders", "Study plans", "Weekly overview"],
  },
];

export function ProductivityToolsView() {
  const [activeTool, setActiveTool] = useState<string | null>(null);

  if (activeTool === "notes") return <NotesApp onBack={() => setActiveTool(null)} />;
  if (activeTool === "planner") return <PlannerApp onBack={() => setActiveTool(null)} />;

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="animate-in fade-in duration-300">
      {/* Hero Header */}
      <div className="relative rounded-[24px] overflow-hidden mb-8"
        style={{ background: 'linear-gradient(135deg, #001d3d 0%, #003566 50%, #0967bd 100%)' }}>
        <div className="absolute -top-20 -right-20 w-[300px] h-[300px] rounded-full opacity-[0.06]"
          style={{ background: 'radial-gradient(circle, white, transparent 70%)' }} />
        <div className="relative z-10 px-6 md:px-10 py-8 md:py-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
            style={{ background: 'rgba(247,127,0,0.15)', border: '1px solid rgba(247,127,0,0.25)' }}>
            <Sparkles className="w-3.5 h-3.5 text-[#f77f00]" />
            <span className="text-[12px] font-semibold text-[#f77f00]">Stay Organized</span>
          </div>
          <h1 className="text-[28px] md:text-[36px] lg:text-[40px] text-white mb-3 leading-[1.1]"
            style={{ fontFamily: "'DM Serif Display', serif" }}>
            Productivity Tools
          </h1>
          <p className="text-[14px] text-white/50 max-w-[460px] leading-relaxed">
            Everything you need to manage your learning efficiently — capture ideas, plan study sessions, and track progress.
          </p>
        </div>
      </div>

      {/* Section Label */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-5 rounded-full bg-[#f77f00]" />
        <h2 className="text-[16px] font-bold text-[#003566]">Choose a Tool</h2>
      </div>

      {/* Tool Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {tools.map((tool) => (
          <div
            key={tool.id}
            onClick={() => setActiveTool(tool.id)}
            className="group relative rounded-[22px] overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
            style={{ minHeight: 320 }}
          >
            <div className="absolute inset-0">
              <img src={tool.image} alt={tool.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="absolute inset-0"
              style={{ background: 'linear-gradient(180deg, rgba(0,29,61,0.15) 0%, rgba(0,29,61,0.92) 60%)' }} />

            <div className="relative z-10 h-full flex flex-col justify-between p-6" style={{ minHeight: 320 }}>
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-[14px] flex items-center justify-center"
                  style={{ background: tool.accent }}>
                  {tool.icon}
                </div>
                <ArrowRight className="w-5 h-5 text-white/30 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </div>

              <div>
                <h3 className="text-[22px] md:text-[26px] font-bold text-white mb-2 leading-tight"
                  style={{ fontFamily: "'DM Serif Display', serif" }}>
                  {tool.title}
                </h3>
                <p className="text-[13px] text-white/50 mb-4 leading-relaxed">{tool.description}</p>
                <div className="flex flex-wrap gap-2">
                  {tool.features.map((f) => (
                    <span key={f} className="px-3 py-1.5 rounded-full text-[10px] font-medium text-white/60"
                      style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════ NOTES APP ═══════════════ */

interface Note {
  id: string;
  title: string;
  content: string;
  timestamp: string;
}

function NotesApp({ onBack }: { onBack: () => void }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    notesApi
      .list()
      .then((data) => {
        setNotes(
          data.map((n: any) => ({
            id: n.id,
            title: n.title,
            content: n.content,
            timestamp: n.updatedAt
              ? new Date(n.updatedAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
              : "Now",
          }))
        );
      })
      .catch(console.log)
      .finally(() => setIsLoading(false));
  }, []);

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveNote = async () => {
    if (!newTitle.trim() && !newContent.trim()) return;
    setIsSaving(true);
    try {
      const saved = await notesApi.create(newTitle || "Untitled Note", newContent);
      const now = new Date();
      const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
      setNotes([{ id: saved.id, title: saved.title, content: saved.content, timestamp: timeStr }, ...notes]);
      setNewTitle("");
      setNewContent("");
      setIsCreating(false);
    } catch (e) {
      console.log("Save note error:", e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateNote = async () => {
    if (!editingNote) return;
    setIsSaving(true);
    try {
      const updated = await notesApi.update(editingNote.id, { title: editingNote.title, content: editingNote.content });
      const timeStr = updated.updatedAt
        ? new Date(updated.updatedAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
        : "Now";
      setNotes(notes.map((n) => (
        n.id === editingNote.id
          ? { ...editingNote, timestamp: timeStr }
          : n
      )));
      setEditingNote(null);
    } catch (e) {
      console.log("Update note error:", e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await notesApi.delete(id);
      setNotes(notes.filter((n) => n.id !== id));
      if (editingNote?.id === id) setEditingNote(null);
    } catch (e) {
      console.log("Delete note error:", e);
    }
  };

  // Show skeleton while loading tools
  if (isLoading) {
    return <SkeletonProductivityTools />;
  }

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="animate-in fade-in duration-300">
      {/* Breadcrumb */}
      <button onClick={onBack}
        className="flex items-center gap-2 text-[#5a7089] hover:text-[#003566] mb-5 transition-colors group cursor-pointer">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-[13px] font-medium">Productivity Tools</span>
      </button>

      {/* Title + Search Row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[14px] flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #003566, #0967bd)' }}>
            <StickyNote className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-[28px] md:text-[34px] text-[#003566]"
            style={{ fontFamily: "'DM Serif Display', serif" }}>
            Notes
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="flex items-center gap-2.5 px-4 h-[44px] rounded-[14px] bg-white border border-[#e2e8f0] hover:border-[#c9ddf0] transition-all flex-1 md:w-[280px] shadow-sm">
            <Search className="w-4 h-4 text-[#94a3b8] shrink-0" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-[13px] text-[#1e293b] placeholder:text-[#94a3b8] font-medium"
            />
          </div>
          {/* Add Button */}
          <button
            onClick={() => { setIsCreating(true); setEditingNote(null); }}
            className="w-[44px] h-[44px] rounded-[14px] flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-[1.04] transition-all cursor-pointer shrink-0"
            style={{ background: 'linear-gradient(135deg, #003566, #0967bd)' }}>
            <Plus className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Create / Edit Note Modal */}
      {(isCreating || editingNote) && (
        <div className="mb-6 bg-white rounded-[20px] border border-[#edf0f4] shadow-lg p-6">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-7 h-7 rounded-[10px] flex items-center justify-center"
              style={{ background: 'rgba(9,103,189,0.1)' }}>
              <FileText className="w-3.5 h-3.5 text-[#0967bd]" />
            </div>
            <span className="text-[14px] font-bold text-[#003566]">{editingNote ? "Edit Note" : "New Note"}</span>
          </div>
          <input
            type="text"
            placeholder="Note title..."
            value={editingNote ? editingNote.title : newTitle}
            onChange={(e) =>
              editingNote
                ? setEditingNote({ ...editingNote, title: e.target.value })
                : setNewTitle(e.target.value)
            }
            className="w-full text-[15px] font-bold mb-3 outline-none placeholder:text-[#c1c7ce] bg-transparent text-[#1e293b]"
          />
          <textarea
            placeholder="Start writing your note..."
            value={editingNote ? editingNote.content : newContent}
            onChange={(e) =>
              editingNote
                ? setEditingNote({ ...editingNote, content: e.target.value })
                : setNewContent(e.target.value)
            }
            rows={8}
            className="w-full text-[14px] text-[#5a7089] outline-none resize-none placeholder:text-[#c1c7ce] bg-transparent leading-relaxed"
          />
          <div className="flex items-center gap-3 mt-4 justify-end">
            {editingNote && (
              <button onClick={() => handleDeleteNote(editingNote.id)}
                className="px-4 py-2.5 text-[13px] font-bold rounded-[12px] text-[#cc3636] hover:bg-red-50 transition-colors cursor-pointer mr-auto flex items-center gap-1.5">
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            )}
            <button
              onClick={() => { setIsCreating(false); setEditingNote(null); setNewTitle(""); setNewContent(""); }}
              className="px-5 py-2.5 text-[13px] font-bold rounded-[12px] text-[#5a7089] hover:bg-[#f5f7fa] transition-colors cursor-pointer border border-[#e2e8f0]">
              Cancel
            </button>
            <button
              onClick={editingNote ? handleUpdateNote : handleSaveNote}
              disabled={isSaving}
              className="px-5 py-2.5 text-[13px] font-bold rounded-[12px] text-white transition-all cursor-pointer disabled:opacity-60 hover:shadow-lg"
              style={{ background: 'linear-gradient(135deg, #003566, #0967bd)' }}>
              {isSaving ? "Saving..." : editingNote ? "Update" : "Save Note"}
            </button>
          </div>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-[#003566]/15 border-t-[#0967bd] rounded-full animate-spin" />
        </div>
      )}

      {/* Notes Grid */}
      {!isLoading && filteredNotes.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map((note, i) => {
            const colors = [
              'rgba(9,103,189,0.06)',
              'rgba(247,127,0,0.06)',
              'rgba(34,197,94,0.06)',
              'rgba(124,58,237,0.06)',
            ];
            const borderColors = [
              'rgba(9,103,189,0.1)',
              'rgba(247,127,0,0.1)',
              'rgba(34,197,94,0.1)',
              'rgba(124,58,237,0.1)',
            ];
            return (
              <div
                key={note.id}
                onClick={() => { setEditingNote(note); setIsCreating(false); }}
                className="rounded-[18px] p-5 cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 group flex flex-col gap-3"
                style={{ background: colors[i % 4], border: `1px solid ${borderColors[i % 4]}` }}
              >
                <p className="text-[14px] font-bold text-[#003566] group-hover:text-[#0967bd] transition-colors line-clamp-1">{note.title}</p>
                <p className="text-[13px] text-[#5a7089] leading-relaxed h-[140px] overflow-hidden whitespace-pre-wrap line-clamp-6">
                  {note.content}
                </p>
                <div className="flex items-center justify-between mt-auto pt-2 border-t border-black/[0.04]">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-[#c1c7ce]" />
                    <span className="text-[11px] font-medium text-[#94a3b8]">{note.timestamp}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-[#c1c7ce] group-hover:text-[#0967bd] transition-colors" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredNotes.length === 0 && !isCreating && !editingNote && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-[20px] flex items-center justify-center mb-4"
            style={{ background: 'rgba(9,103,189,0.06)' }}>
            <FileText className="w-7 h-7 text-[#0967bd]/30" />
          </div>
          <p className="text-[14px] font-semibold text-[#5a7089] mb-1">
            {searchQuery ? "No notes match your search" : "No notes yet"}
          </p>
          <p className="text-[12px] text-[#94a3b8]">
            {searchQuery ? "Try a different keyword" : "Click + to create your first note"}
          </p>
        </div>
      )}
    </div>
  );
}

/* ═══════════════ PLANNER / SCHEDULER APP ═══════════════ */

interface PlannerTask {
  id: string;
  title: string;
  completed: boolean;
}

interface Reminder {
  id: string;
  title: string;
  completed: boolean;
}

interface StudyPlan {
  id: string;
  title: string;
  time: string;
  progress: number;
  priority: "high" | "medium" | "low";
}

interface WeeklyDay {
  id: string;
  day: string;
  date: string;
  sessions: StudyPlan[];
}

const initialWeeklyData: WeeklyDay[] = [
  {
    id: "w1", day: "Monday", date: "Oct 21",
    sessions: [
      { id: "ws1", title: "Advanced Physics", time: "9:00 AM - 11:00 AM", progress: 75, priority: "high" },
      { id: "ws2", title: "Statistics Review", time: "11:30 AM - 1:00 PM", progress: 50, priority: "medium" },
      { id: "ws3", title: "Spanish Vocabulary", time: "3:00 PM - 4:00 PM", progress: 25, priority: "low" },
      { id: "ws4", title: "Chemistry Lab Prep", time: "5:00 PM - 6:30 PM", progress: 60, priority: "medium" },
    ],
  },
  {
    id: "w2", day: "Sunday", date: "Oct 20",
    sessions: [
      { id: "ws5", title: "Biology Chapter 12", time: "9:00 AM - 10:30 AM", progress: 40, priority: "high" },
      { id: "ws6", title: "English Literature", time: "11:00 AM - 12:30 PM", progress: 80, priority: "low" },
      { id: "ws7", title: "Math Practice", time: "2:00 PM - 3:30 PM", progress: 30, priority: "high" },
      { id: "ws8", title: "History Essays", time: "4:00 PM - 5:00 PM", progress: 90, priority: "medium" },
    ],
  },
  {
    id: "w3", day: "Saturday", date: "Oct 19",
    sessions: [
      { id: "ws9", title: "Physics Lab Report", time: "10:00 AM - 12:00 PM", progress: 55, priority: "high" },
      { id: "ws10", title: "French Conversation", time: "1:00 PM - 2:00 PM", progress: 70, priority: "low" },
      { id: "ws11", title: "Calculus Review", time: "3:00 PM - 5:00 PM", progress: 20, priority: "medium" },
      { id: "ws12", title: "Art History Reading", time: "6:00 PM - 7:00 PM", progress: 45, priority: "low" },
    ],
  },
  {
    id: "w4", day: "Friday", date: "Oct 18",
    sessions: [
      { id: "ws13", title: "Organic Chemistry", time: "9:00 AM - 11:00 AM", progress: 65, priority: "high" },
      { id: "ws14", title: "Computer Science", time: "1:00 PM - 3:00 PM", progress: 85, priority: "medium" },
      { id: "ws15", title: "Psychology Notes", time: "4:00 PM - 5:30 PM", progress: 35, priority: "low" },
      { id: "ws16", title: "Economics Review", time: "6:00 PM - 7:00 PM", progress: 50, priority: "medium" },
    ],
  },
];

interface CompletedPlan {
  id: string;
  title: string;
  date: string;
  time: string;
}

const priorityConfig = {
  high: { bg: "rgba(239,68,68,0.05)", border: "rgba(239,68,68,0.1)", badgeBg: "#fef2f2", badgeText: "#ef4444", barColor: "#ef4444", label: "High" },
  medium: { bg: "rgba(247,127,0,0.05)", border: "rgba(247,127,0,0.1)", badgeBg: "#fff7ed", badgeText: "#f77f00", barColor: "#f77f00", label: "Medium" },
  low: { bg: "rgba(34,177,97,0.05)", border: "rgba(34,177,97,0.1)", badgeBg: "#f0fdf4", badgeText: "#34b161", barColor: "#34b161", label: "Low" },
};

/* ── Shared modal backdrop ── */
function ModalBackdrop({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm" onClick={onClose} />
      {children}
    </div>
  );
}

/* ── Styled form input ── */
function FormInput({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[13px] font-bold text-slate-900 dark:text-white">{label}</label>
      {children}
    </div>
  );
}

const inputClass = "w-full h-[44px] border border-slate-300 dark:border-slate-600 rounded-[12px] px-4 text-[13px] outline-none focus:border-blue-600 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-600/20 dark:focus:ring-blue-400/20 transition-all text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 bg-white dark:bg-slate-700";
const selectClass = "w-full h-[44px] border border-slate-300 dark:border-slate-600 rounded-[12px] px-4 pr-9 text-[13px] outline-none focus:border-blue-600 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-600/20 dark:focus:ring-blue-400/20 transition-all text-slate-900 dark:text-white bg-white dark:bg-slate-700 appearance-none cursor-pointer";

function PlannerApp({ onBack }: { onBack: () => void }) {
  const [tasks, setTasks] = useState<PlannerTask[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([]);
  const [studyTab, setStudyTab] = useState<"today" | "weekly" | "completed">("today");
  const [showAllTasks, setShowAllTasks] = useState(false);
  const [showAllReminders, setShowAllReminders] = useState(false);
  const [showAllPlans, setShowAllPlans] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showAddTaskInput, setShowAddTaskInput] = useState(false);
  const [showAddReminderInput, setShowAddReminderInput] = useState(false);
  const [expandedDays, setExpandedDays] = useState<string[]>([]);
  const [showAllWeekly, setShowAllWeekly] = useState(false);
  const [completedPlans, setCompletedPlans] = useState<CompletedPlan[]>([]);
  const [showAllCompleted, setShowAllCompleted] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newReminderTitle, setNewReminderTitle] = useState("");
  const [reminderFrequency, setReminderFrequency] = useState("Daily");
  const [reminderDate, setReminderDate] = useState("");
  const [reminderTime, setReminderTime] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingTask, setIsSavingTask] = useState(false);
  const [isSavingReminder, setIsSavingReminder] = useState(false);
  const [isSavingPlan, setIsSavingPlan] = useState(false);

  const [formSubject, setFormSubject] = useState("");
  const [formGoal, setFormGoal] = useState("");
  const [formStartDate, setFormStartDate] = useState("");
  const [formEndDate, setFormEndDate] = useState("");
  const [formStartTime, setFormStartTime] = useState("");
  const [formEndTime, setFormEndTime] = useState("");
  const [formReminder, setFormReminder] = useState("Daily");
  const [formPriority, setFormPriority] = useState<"high" | "medium" | "low">("low");

  useEffect(() => {
    Promise.allSettled([tasksApi.list(), remindersApi.list(), studyPlansApi.list()])
      .then(([tasksResult, remindersResult, studyPlansResult]) => {
        if (tasksResult.status === "fulfilled") {
          setTasks(tasksResult.value.map((x: any) => ({ id: x.id, title: x.title, completed: x.completed })));
        }

        if (remindersResult.status === "fulfilled") {
          setReminders(
            remindersResult.value.map((x: any) => ({
              id: x.id,
              title: `${x.title}  | ${x.frequency}${x.reminderTime ? " at " + x.reminderTime : ""}`,
              completed: x.completed,
            }))
          );
        } else {
          console.log("Reminder load error:", remindersResult.reason);
        }

        if (studyPlansResult.status === "fulfilled") {
          const active = studyPlansResult.value.filter((x: any) => !x.completed);
          const done = studyPlansResult.value.filter((x: any) => x.completed);
          setStudyPlans(active.map((x: any) => ({ id: x.id, title: x.subject, time: x.timeStr || "TBD", progress: x.progress || 0, priority: x.priority || "low" })));
          setCompletedPlans(done.map((x: any) => ({ id: x.id, title: x.subject, date: x.startDate || "", time: x.timeStr || "" })));
        }
      })
      .catch(console.log)
      .finally(() => setIsLoading(false));
  }, []);

  /* ── Task handlers ── */
  const toggleTask = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const updated = { ...task, completed: !task.completed };
    setTasks(tasks.map((t) => (t.id === id ? updated : t)));
    try { await tasksApi.update(id, { completed: updated.completed }); } catch (e) { console.log("Toggle task error:", e); }
  };
  const deleteTask = async (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
    try { await tasksApi.delete(id); } catch (e) { console.log("Delete task error:", e); }
  };
  const handleAddTask = async () => {
    const title = newTaskTitle.trim();
    if (!title) return;
    setIsSavingTask(true); setNewTaskTitle(""); setShowAddTaskInput(false);
    try { const saved = await tasksApi.create(title); setTasks((prev) => [{ id: saved.id, title: saved.title, completed: false }, ...prev]); }
    catch (e) { console.log("Add task error:", e); }
    finally { setIsSavingTask(false); }
  };

  /* ── Reminder handlers ── */
  const toggleReminder = async (id: string) => {
    const r = reminders.find((x) => x.id === id);
    if (!r) return;
    const updated = { ...r, completed: !r.completed };
    setReminders(reminders.map((x) => (x.id === id ? updated : x)));
    try { await remindersApi.update(id, { completed: updated.completed }); } catch (e) { console.log("Toggle reminder error:", e); }
  };
  const deleteReminder = async (id: string) => {
    setReminders(reminders.filter((r) => r.id !== id));
    try { await remindersApi.delete(id); } catch (e) { console.log("Delete reminder error:", e); }
  };
  const handleAddReminder = async () => {
    const name = newReminderTitle.trim();
    if (!name) return;
    setIsSavingReminder(true);
    const freqStr = reminderFrequency;
    const shouldRequestNotificationPermission =
      typeof window !== "undefined" &&
      typeof Notification !== "undefined" &&
      Notification.permission === "default" &&
      Boolean(reminderDate && reminderTime);
    setNewReminderTitle(""); setReminderFrequency("Daily"); setReminderDate(""); setReminderTime(""); setShowAddReminderInput(false);
    try {
      if (shouldRequestNotificationPermission) {
        try {
          await Notification.requestPermission();
        } catch (permissionError) {
          console.log("Notification permission request error:", permissionError);
        }
      }
      const saved = await remindersApi.create({ title: name, frequency: freqStr, reminderDate, reminderTime });
      setReminders((prev) => [{ id: saved.id, title: `${saved.title}  | ${saved.frequency}${saved.reminderTime ? " at " + saved.reminderTime : ""}`, completed: false }, ...prev]);
      await notificationsApi.create({
        type: "planner_reminder_created",
        title: "Reminder Created",
        content: `${saved.title} has been added to your reminders${saved.reminderTime ? ` for ${saved.reminderTime}` : ""}.`,
        relatedId: saved.id,
        actionUrl: "/dashboard/productivity-tools",
      });
    } catch (e) {
      console.log("Add reminder error:", e);
    } finally { setIsSavingReminder(false); }
  };

  /* ── Study plan handlers ── */
  const resetForm = () => { setFormSubject(""); setFormGoal(""); setFormStartDate(""); setFormEndDate(""); setFormStartTime(""); setFormEndTime(""); setFormReminder("Daily"); setFormPriority("low"); };
  const handleCreateStudyPlan = async () => {
    if (!formSubject.trim()) return;
    setIsSavingPlan(true);
    try {
      const saved = await studyPlansApi.create({ subject: formSubject, goal: formGoal, startDate: formStartDate, endDate: formEndDate, startTime: formStartTime, endTime: formEndTime, reminder: formReminder, priority: formPriority });
      setStudyPlans((prev) => [...prev, { id: saved.id, title: saved.subject, time: saved.timeStr || "TBD", progress: saved.progress || 0, priority: saved.priority || formPriority }]);
      await notificationsApi.create({
        type: "study_plan_created",
        title: "Study Plan Created",
        content: `${saved.subject} has been added to your study plans.`,
        relatedId: saved.id,
        actionUrl: "/dashboard/productivity-tools",
      });
      resetForm(); setShowCreateModal(false);
    } catch (e) { console.log("Create study plan error:", e); } finally { setIsSavingPlan(false); }
  };
  const handleCompleteStudyPlan = async (planId: string) => {
    const plan = studyPlans.find((p) => p.id === planId);
    if (!plan) return;
    setStudyPlans((prev) => prev.filter((p) => p.id !== planId));
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    setCompletedPlans((prev) => [{ id: planId, title: plan.title, date: dateStr, time: plan.time }, ...prev]);
    try {
      await studyPlansApi.update(planId, { completed: true, progress: 100 });
      await notificationsApi.create({
        type: "study_plan_completed",
        title: "Study Plan Completed",
        content: `Nice work finishing ${plan.title}.`,
        relatedId: planId,
        actionUrl: "/dashboard/productivity-tools",
      });
    }
    catch (e) { console.log("Complete study plan error:", e); setStudyPlans((prev) => [plan, ...prev]); setCompletedPlans((prev) => prev.filter((p) => p.id !== planId)); }
  };
  const deleteStudyPlan = async (planId: string) => {
    setStudyPlans((prev) => prev.filter((p) => p.id !== planId));
    try { await studyPlansApi.delete(planId); } catch (e) { console.log("Delete study plan error:", e); }
  };

  const visibleTasks = showAllTasks ? tasks : tasks.slice(0, 3);
  const visibleReminders = showAllReminders ? reminders : reminders.slice(0, 3);
  const visiblePlans = showAllPlans ? studyPlans : studyPlans.slice(0, 3);

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="animate-in fade-in duration-300 bg-white dark:bg-slate-950">
      {/* Breadcrumb */}
      <button onClick={onBack}
        className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 mb-5 transition-colors group cursor-pointer">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-[13px] font-medium">Productivity Tools</span>
      </button>

      {/* Title Row */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[14px] flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #f77f00, #ff9a3c)' }}>
            <ClipboardList className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-[28px] md:text-[34px] text-slate-900 dark:text-white"
            style={{ fontFamily: "'DM Serif Display', serif" }}>
            Planner
          </h1>
        </div>

        {/* + Button with Popup */}
        <div className="relative">
          <button onClick={() => setShowAddPopup(!showAddPopup)}
            className="w-[44px] h-[44px] rounded-[14px] flex items-center justify-center shadow-lg dark:shadow-xl hover:shadow-2xl dark:hover:shadow-2xl hover:scale-[1.04] transition-all cursor-pointer shrink-0 ring-2 ring-orange-500/0 hover:ring-orange-500/20 dark:ring-orange-500/10 dark:hover:ring-orange-500/30"
            style={{ background: 'linear-gradient(135deg, #003566, #0967bd)' }} title="Add new item">
            <Plus className="w-5 h-5 text-white" />
          </button>

          {showAddPopup && (
            <>
              <div className="fixed inset-0 z-[90]" onClick={() => setShowAddPopup(false)} />
              <div className="absolute right-0 top-[52px] z-[91] bg-white dark:bg-slate-800 rounded-[18px] shadow-xl border border-slate-200 dark:border-slate-700 p-3 flex flex-col gap-1 w-[220px] animate-in fade-in slide-in-from-top-2 duration-200">
                <button onClick={() => { setShowAddPopup(false); setShowAddTaskInput(true); }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-[12px] hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors w-full text-left">
                  <div className="w-8 h-8 rounded-[10px] bg-[#f77f00] flex items-center justify-center shrink-0">
                    <Target className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-[13px] font-semibold text-slate-900 dark:text-white">Add New Task</span>
                </button>
                <button onClick={() => { setShowAddPopup(false); setShowAddReminderInput(true); }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-[12px] hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors w-full text-left">
                  <div className="w-8 h-8 rounded-[10px] bg-[#ffd60a] flex items-center justify-center shrink-0">
                    <Bell className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-[13px] font-semibold text-slate-900 dark:text-white">Smart Reminder</span>
                </button>
                <button onClick={() => { setShowAddPopup(false); setShowCreateModal(true); }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-[12px] hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors w-full text-left">
                  <div className="w-8 h-8 rounded-[10px] bg-[#1ca4b3] flex items-center justify-center shrink-0">
                    <BookOpen className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-[13px] font-semibold text-slate-900 dark:text-white">Study Plan</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ═══ Add New Task Modal ═══ */}
      {showAddTaskInput && (
        <ModalBackdrop onClose={() => { setShowAddTaskInput(false); setNewTaskTitle(""); }}>
          <div className="relative bg-white dark:bg-slate-800 rounded-[24px] shadow-2xl p-7 w-full max-w-[520px] z-10 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-[14px] bg-orange-500 flex items-center justify-center shrink-0">
                <Target className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-[22px] font-bold text-slate-900 dark:text-white" style={{ fontFamily: "'DM Serif Display', serif" }}>Add New Task</h2>
              <button onClick={() => { setShowAddTaskInput(false); setNewTaskTitle(""); }}
                className="ml-auto w-8 h-8 rounded-[10px] hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <FormInput label="Task Name">
              <input type="text" autoFocus value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && newTaskTitle.trim()) handleAddTask(); if (e.key === "Escape") { setShowAddTaskInput(false); setNewTaskTitle(""); } }}
                placeholder="Enter task name…" className={inputClass} />
            </FormInput>
            <div className="flex items-center gap-3 mt-6">
              <button onClick={() => { setShowAddTaskInput(false); setNewTaskTitle(""); }}
                className="flex-1 h-[44px] rounded-[14px] border border-[#cc3636] text-[#cc3636] font-bold text-[13px] hover:bg-red-50 transition-colors cursor-pointer">
                Cancel
              </button>
              <button onClick={handleAddTask} disabled={isSavingTask || !newTaskTitle.trim()}
                className="flex-1 h-[44px] rounded-[14px] font-bold text-[13px] text-white transition-all cursor-pointer disabled:opacity-60 hover:shadow-lg"
                style={{ background: '#f77f00' }}>
                {isSavingTask ? "Adding…" : "Add Task"}
              </button>
            </div>
          </div>
        </ModalBackdrop>
      )}

      {/* ═══ Add Smart Reminder Modal ═══ */}
      {showAddReminderInput && (
        <ModalBackdrop onClose={() => { setShowAddReminderInput(false); setNewReminderTitle(""); setReminderFrequency("Daily"); setReminderDate(""); setReminderTime(""); }}>
          <div className="relative bg-white dark:bg-slate-800 rounded-[24px] shadow-2xl p-7 w-full max-w-[520px] z-10 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-[14px] bg-yellow-400 flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-[22px] font-bold text-slate-900 dark:text-white" style={{ fontFamily: "'DM Serif Display', serif" }}>Smart Reminder</h2>
              <button onClick={() => { setShowAddReminderInput(false); setNewReminderTitle(""); setReminderFrequency("Daily"); setReminderDate(""); setReminderTime(""); }}
                className="ml-auto w-8 h-8 rounded-[10px] hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <FormInput label="Reminder Name">
                <input type="text" autoFocus value={newReminderTitle} onChange={(e) => setNewReminderTitle(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && newReminderTitle.trim()) handleAddReminder(); }}
                  placeholder="Enter reminder name…" className={inputClass} />
              </FormInput>
              <FormInput label="Frequency">
                <div className="relative">
                  <select value={reminderFrequency} onChange={(e) => setReminderFrequency(e.target.value)} className={selectClass}>
                    <option value="Daily">Daily</option><option value="Weekly">Weekly</option><option value="Monthly">Monthly</option><option value="Once">Once</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-slate-400 pointer-events-none" />
                </div>
              </FormInput>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput label="Date">
                <input type="date" value={reminderDate} onChange={(e) => setReminderDate(e.target.value)} className={inputClass} />
              </FormInput>
              <FormInput label="Time">
                <input type="time" value={reminderTime} onChange={(e) => setReminderTime(e.target.value)} className={inputClass} />
              </FormInput>
            </div>
            <div className="flex items-center gap-3 mt-6">
              <button onClick={() => { setShowAddReminderInput(false); setNewReminderTitle(""); setReminderFrequency("Daily"); setReminderDate(""); setReminderTime(""); }}
                className="flex-1 h-[44px] rounded-[14px] border border-red-600 dark:border-red-500 text-red-600 dark:text-red-400 font-bold text-[13px] hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer">
                Cancel
              </button>
              <button onClick={handleAddReminder} disabled={isSavingReminder || !newReminderTitle.trim()}
                className="flex-1 h-[44px] rounded-[14px] font-bold text-[13px] text-white transition-all cursor-pointer disabled:opacity-60 hover:shadow-lg"
                style={{ background: '#f77f00' }}>
                {isSavingReminder ? "Adding…" : "Add Reminder"}
              </button>
            </div>
          </div>
        </ModalBackdrop>
      )}

      {/* ═══ Create Study Plan Modal ═══ */}
      {showCreateModal && (
        <ModalBackdrop onClose={() => { setShowCreateModal(false); resetForm(); }}>
          <div className="relative bg-white dark:bg-slate-800 rounded-[24px] shadow-2xl p-7 w-full max-w-[560px] max-h-[90vh] overflow-y-auto z-10 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-[14px] bg-cyan-600 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-[22px] font-bold text-slate-900 dark:text-white" style={{ fontFamily: "'DM Serif Display', serif" }}>Create Study Plan</h2>
              <button onClick={() => { setShowCreateModal(false); resetForm(); }}
                className="ml-auto w-8 h-8 rounded-[10px] hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <FormInput label="Subject/Topic">
                <input type="text" autoFocus value={formSubject} onChange={(e) => setFormSubject(e.target.value)} placeholder="e.g. Advanced Physics" className={inputClass} />
              </FormInput>
              <FormInput label="Goal/Target">
                <input type="text" value={formGoal} onChange={(e) => setFormGoal(e.target.value)} placeholder="Complete 5 chapters" className={inputClass} />
              </FormInput>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <FormInput label="Start Date"><input type="date" value={formStartDate} onChange={(e) => setFormStartDate(e.target.value)} className={inputClass} /></FormInput>
              <FormInput label="End Date"><input type="date" value={formEndDate} onChange={(e) => setFormEndDate(e.target.value)} className={inputClass} /></FormInput>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <FormInput label="Start Time"><input type="time" value={formStartTime} onChange={(e) => setFormStartTime(e.target.value)} className={inputClass} /></FormInput>
              <FormInput label="End Time"><input type="time" value={formEndTime} onChange={(e) => setFormEndTime(e.target.value)} className={inputClass} /></FormInput>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput label="Set Reminder">
                <div className="relative">
                  <select value={formReminder} onChange={(e) => setFormReminder(e.target.value)} className={selectClass}>
                    <option value="Daily">Daily</option><option value="Weekly">Weekly</option><option value="Monthly">Monthly</option><option value="None">None</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-slate-400 pointer-events-none" />
                </div>
              </FormInput>
              <FormInput label="Priority">
                <div className="relative">
                  <select value={formPriority} onChange={(e) => setFormPriority(e.target.value as any)} className={selectClass}>
                    <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-slate-400 pointer-events-none" />
                </div>
              </FormInput>
            </div>
            <div className="flex items-center gap-3 mt-6">
              <button onClick={() => { setShowCreateModal(false); resetForm(); }}
                className="flex-1 h-[44px] rounded-[14px] border border-red-600 dark:border-red-500 text-red-600 dark:text-red-400 font-bold text-[13px] hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer">
                Cancel
              </button>
              <button onClick={handleCreateStudyPlan} disabled={isSavingPlan || !formSubject.trim()}
                className="flex-1 h-[44px] rounded-[14px] font-bold text-[13px] text-white transition-all cursor-pointer disabled:opacity-60 hover:shadow-lg"
                style={{ background: '#1ca4b3' }}>
                {isSavingPlan ? "Creating…" : "Create Study Plan"}
              </button>
            </div>
          </div>
        </ModalBackdrop>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-slate-200 dark:border-slate-700 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin" />
        </div>
      )}

      {/* Cards */}
      {!isLoading && (
        <div className="flex flex-col gap-5">

          {/* ───── My Tasks Card ───── */}
          <div className="bg-white dark:bg-slate-800 rounded-[20px] border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="px-6 py-5">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-[10px] bg-orange-500 flex items-center justify-center">
                    <Target className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-[15px] font-bold text-slate-900 dark:text-white">My Tasks</h3>
                </div>
                <span className="px-3 py-1 rounded-full text-[11px] font-semibold text-slate-600 dark:text-slate-300"
                  style={{ background: 'rgba(0,53,102,0.04)', border: '1px solid rgba(0,53,102,0.06)' }}>
                  {tasks.length} tasks
                </span>
              </div>
              <div className="flex flex-col gap-2.5">
                {visibleTasks.map((task) => (
                  <div key={task.id}
                    className={`rounded-[14px] flex items-center justify-between px-4 py-3.5 transition-colors ${
                      task.completed ? 'bg-green-50 dark:bg-green-900/20' : 'bg-slate-50 dark:bg-slate-700'
                    }`}>
                    <div className="flex items-center gap-3 min-w-0">
                      <button onClick={() => toggleTask(task.id)} className="cursor-pointer shrink-0">
                        {task.completed ? (
                          <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" strokeWidth={3} />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-500 hover:border-blue-600 dark:hover:border-blue-400 transition-colors" />
                        )}
                      </button>
                      <span className={`text-[13px] truncate ${task.completed ? "line-through text-slate-400 dark:text-slate-500" : "text-slate-900 dark:text-white font-medium"}`}>
                        {task.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {task.completed && <span className="text-[10px] font-bold text-green-600 dark:text-green-400">Done</span>}
                      {!task.completed && (
                        <button onClick={() => toggleTask(task.id)} className="p-1.5 rounded-[8px] hover:bg-green-50 dark:hover:bg-green-900/20 text-green-600 dark:text-green-400 cursor-pointer transition-colors" title="Complete">
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button onClick={() => deleteTask(task.id)} className="p-1.5 rounded-[8px] hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-300 dark:text-slate-600 hover:text-red-600 dark:hover:text-red-400 cursor-pointer transition-colors" title="Delete">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
                {tasks.length === 0 && (
                  <p className="text-[13px] text-slate-400 dark:text-slate-500 text-center py-8">No tasks yet — tap + to add your first task</p>
                )}
              </div>
              {tasks.length > 3 && (
                <button onClick={() => setShowAllTasks(!showAllTasks)}
                  className="w-full mt-4 text-[12px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer transition-colors">
                  {showAllTasks ? "Show Less" : `View All (${tasks.length})`}
                </button>
              )}
            </div>
          </div>

          {/* ───── Active Reminders Card ───── */}
          <div className="bg-white dark:bg-slate-800 rounded-[20px] border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="px-6 py-5">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-[10px] bg-yellow-400 flex items-center justify-center">
                    <Bell className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-[15px] font-bold text-slate-900 dark:text-white">Active Reminders</h3>
                </div>
              </div>
              <div className="flex flex-col gap-2.5">
                {visibleReminders.map((reminder) => (
                  <div key={reminder.id}
                    className={`rounded-[14px] flex items-center justify-between px-4 py-3.5 transition-colors ${
                      reminder.completed ? 'bg-green-50 dark:bg-green-900/20' : 'bg-slate-50 dark:bg-slate-700'
                    }`}>
                    <div className="flex items-center gap-3 min-w-0">
                      <button onClick={() => toggleReminder(reminder.id)} className="cursor-pointer shrink-0">
                        {reminder.completed ? (
                          <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" strokeWidth={3} />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-500 hover:border-yellow-400 dark:hover:border-yellow-400 transition-colors" />
                        )}
                      </button>
                      <span className={`text-[13px] truncate ${reminder.completed ? "line-through text-slate-400 dark:text-slate-500" : "text-slate-900 dark:text-white font-medium"}`}>
                        {reminder.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {reminder.completed && <span className="text-[10px] font-bold text-green-600 dark:text-green-400">Done</span>}
                      {!reminder.completed && (
                        <button onClick={() => toggleReminder(reminder.id)} className="p-1.5 rounded-[8px] hover:bg-green-50 dark:hover:bg-green-900/20 text-green-600 dark:text-green-400 cursor-pointer transition-colors" title="Complete">
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button onClick={() => deleteReminder(reminder.id)} className="p-1.5 rounded-[8px] hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-300 dark:text-slate-600 hover:text-red-600 dark:hover:text-red-400 cursor-pointer transition-colors" title="Delete">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
                {reminders.length === 0 && (
                  <p className="text-[13px] text-slate-400 dark:text-slate-500 text-center py-8">No reminders yet — tap + to add a smart reminder</p>
                )}
              </div>
              {reminders.length > 3 && (
                <button onClick={() => setShowAllReminders(!showAllReminders)}
                  className="w-full mt-4 text-[12px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer transition-colors">
                  {showAllReminders ? "Show Less" : `View All (${reminders.length})`}
                </button>
              )}
            </div>
          </div>

          {/* ───── Study Plans Card ───── */}
          <div className="bg-white dark:bg-slate-800 rounded-[20px] border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="px-6 py-5">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-[10px] bg-cyan-600 flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-[15px] font-bold text-slate-900 dark:text-white">Study Plans</h3>
                </div>
              </div>

              {/* Tab Pills */}
              <div className="p-1 rounded-[14px] flex mb-5 bg-slate-100 dark:bg-slate-700">
                {([
                  { key: "today" as const, label: "Today's Plan" },
                  { key: "weekly" as const, label: "Weekly Overview" },
                  { key: "completed" as const, label: "Completed" },
                ]).map((tab) => (
                  <button key={tab.key} onClick={() => setStudyTab(tab.key)}
                    className={`flex-1 h-[38px] rounded-[12px] flex items-center justify-center text-[12px] font-bold cursor-pointer transition-all ${
                      studyTab === tab.key
                        ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                        : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                    }`}>
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* ── Today's Plan ── */}
              {studyTab === "today" && (
                <>
                  <div className="flex flex-col gap-3">
                    {visiblePlans.map((plan) => {
                      const config = priorityConfig[plan.priority];
                      return (
                        <div key={plan.id} className="rounded-[16px] flex items-center justify-between px-5 py-4 transition-colors"
                          style={{ background: config.bg, border: `1px solid ${config.border}` }}>
                          <div className="flex flex-col gap-1.5 min-w-0">
                            <span className="text-[13px] font-bold text-slate-900 dark:text-white">{plan.title}</span>
                            <div className="flex items-center gap-2">
                              <Clock className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                              <span className="text-[11px] text-slate-500 dark:text-slate-400">{plan.time}</span>
                            </div>
                            <div className="flex items-center gap-2.5 mt-0.5">
                              <div className="w-[80px] h-[4px] bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full rounded-full transition-all" style={{ width: `${plan.progress}%`, background: config.barColor }} />
                              </div>
                              <span className="text-[10px] font-medium" style={{ color: config.badgeText }}>{plan.progress}%</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold"
                              style={{ background: config.badgeBg, color: config.badgeText }}>
                              {config.label}
                            </span>
                            <button onClick={() => handleCompleteStudyPlan(plan.id)}
                              className="p-1.5 rounded-[8px] hover:bg-green-50 dark:hover:bg-green-900/20 text-green-600 dark:text-green-400 cursor-pointer transition-colors" title="Complete">
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button onClick={() => deleteStudyPlan(plan.id)}
                              className="p-1.5 rounded-[8px] hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-300 dark:text-slate-600 hover:text-red-600 dark:hover:text-red-400 cursor-pointer transition-colors" title="Delete">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                    {studyPlans.length === 0 && (
                      <p className="text-[13px] text-slate-400 dark:text-slate-500 text-center py-8">No study plans yet — tap + to create your first plan</p>
                    )}
                  </div>
                  {studyPlans.length > 3 && (
                    <button onClick={() => setShowAllPlans(!showAllPlans)}
                      className="w-full mt-4 text-[12px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer transition-colors">
                      {showAllPlans ? "Show Less" : `View All (${studyPlans.length})`}
                    </button>
                  )}
                </>
              )}

              {/* ── Weekly Overview ── */}
              {studyTab === "weekly" && (
                <>
                  <div className="flex flex-col gap-3">
                    {(showAllWeekly ? initialWeeklyData : initialWeeklyData.slice(0, 3)).map((weekDay) => {
                      const isExpanded = expandedDays.includes(weekDay.id);
                      return (
                        <div key={weekDay.id} className="flex flex-col">
                          <button onClick={() => setExpandedDays(isExpanded ? expandedDays.filter((d) => d !== weekDay.id) : [...expandedDays, weekDay.id])}
                            className={`bg-slate-50 dark:bg-slate-700 w-full flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors ${
                              isExpanded ? "rounded-t-[16px]" : "rounded-[16px]"
                            }`}>
                            <div>
                              <p className="text-[14px] font-bold text-slate-900 dark:text-white">{weekDay.day}</p>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400">{weekDay.date}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300">{weekDay.sessions.length} sessions</span>
                              <ChevronDown className={`w-4 h-4 text-slate-400 dark:text-slate-500 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                            </div>
                          </button>
                          {isExpanded && (
                            <div className="border border-slate-200 dark:border-slate-700 border-t-0 rounded-b-[16px] px-4 py-3 flex flex-col gap-2.5 bg-white dark:bg-slate-800">
                              {weekDay.sessions.map((session) => {
                                const config = priorityConfig[session.priority];
                                return (
                                  <div key={session.id} className="rounded-[14px] flex items-center justify-between px-4 py-3.5"
                                    style={{ background: config.bg, border: `1px solid ${config.border}` }}>
                                    <div className="flex flex-col gap-1">
                                      <span className="text-[12px] font-bold text-slate-900 dark:text-white">{session.title}</span>
                                      <span className="text-[11px] text-slate-500 dark:text-slate-400">{session.time}</span>
                                      <div className="flex items-center gap-2 mt-0.5">
                                        <div className="w-[70px] h-[3px] bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                                          <div className="h-full rounded-full" style={{ width: `${session.progress}%`, background: config.barColor }} />
                                        </div>
                                        <span className="text-[9px] font-medium" style={{ color: config.badgeText }}>{session.progress}%</span>
                                      </div>
                                    </div>
                                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0"
                                      style={{ background: config.badgeBg, color: config.badgeText }}>
                                      {config.label}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {initialWeeklyData.length > 3 && (
                    <button onClick={() => setShowAllWeekly(!showAllWeekly)}
                      className="w-full mt-4 text-[12px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer transition-colors">
                      {showAllWeekly ? "Show Less" : "View All"}
                    </button>
                  )}
                </>
              )}

              {/* ── Completed Plans ── */}
              {studyTab === "completed" && (
                <>
                  <div className="flex flex-col gap-2.5">
                    {completedPlans.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-14 h-14 rounded-[18px] flex items-center justify-center mb-3"
                          style={{ background: 'rgba(34,197,94,0.08)' }}>
                          <CheckCircle className="w-6 h-6 text-green-500/40" />
                        </div>
                        <p className="text-[14px] font-semibold text-slate-600 dark:text-slate-300">No completed plans yet</p>
                        <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-1">Complete your study plans to see them here</p>
                      </div>
                    )}
                    {(showAllCompleted ? completedPlans : completedPlans.slice(0, 3)).map((plan) => (
                      <div key={plan.id} className="bg-slate-50 dark:bg-slate-700 rounded-[14px] flex items-center justify-between px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 text-white" strokeWidth={3} />
                          </div>
                          <div>
                            <p className="text-[13px] font-bold text-slate-900 dark:text-white">{plan.title}</p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">{`${plan.date}  |  ${plan.time}`}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {completedPlans.length > 3 && (
                    <button onClick={() => setShowAllCompleted(!showAllCompleted)}
                      className="w-full mt-4 text-[12px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer transition-colors">
                      {showAllCompleted ? "Show Less" : `View All (${completedPlans.length})`}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
