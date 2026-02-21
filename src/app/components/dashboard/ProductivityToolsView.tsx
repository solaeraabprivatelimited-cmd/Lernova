import React, { useState, useEffect } from "react";
import imgNotesImage from "figma:asset/00ae786af8ac4c0943552db9a6f6dfd10268ca06.png";
import imgPlannerImage from "figma:asset/3bed40028d21e55021d8008bb0100eca00d08ab3.png";
import svgNotePaths from "@/imports/svg-acp3s7jq6n";
import svgPlannerPaths from "@/imports/svg-c9gs1u9we0";
import svgModalPaths from "@/imports/svg-xl1sy24t63";
import svgAddTaskPaths from "@/imports/svg-dalfud3wlq";
import svgAddReminderPaths from "@/imports/svg-y1tmdqw9t2";
import svgCompletedPlanPaths from "@/imports/svg-7qydjhl9d5";
import { notes as notesApi, tasks as tasksApi, reminders as remindersApi, studyPlans as studyPlansApi } from "@/app/lib/api";

interface ToolCard {
  id: string;
  title: string;
  description: string;
  image: string;
  gradient: string;
}

const tools: ToolCard[] = [
  {
    id: "notes",
    title: "Notes",
    description: "Write freely and store your thoughts in one neat place.",
    image: imgNotesImage,
    gradient:
      "linear-gradient(-7.39deg, rgba(0, 0, 0, 0) 41.14%, rgba(0, 0, 0, 0.4) 70.39%)",
  },
  {
    id: "planner",
    title: "Planner/Scheduler",
    description: "Organize your day, set goals, and track your progress.",
    image: imgPlannerImage,
    gradient:
      "linear-gradient(-2.49deg, rgba(0, 0, 0, 0) 47.33%, rgba(0, 0, 0, 0.4) 66.41%)",
  },
];

export function ProductivityToolsView() {
  const [activeTool, setActiveTool] = useState<string | null>(null);

  if (activeTool === "notes") {
    return <NotesApp onBack={() => setActiveTool(null)} />;
  }

  if (activeTool === "planner") {
    return <PlannerApp onBack={() => setActiveTool(null)} />;
  }

  return (
    <>
      <div className="mb-8 md:mb-10">
        <h1 className="text-[28px] md:text-[32px] lg:text-[40px] font-medium text-black mb-1 font-['Poppins']">
          Productivity Tools
        </h1>
        <p className="text-[14px] text-black/60 font-['Poppins']">
          Everything you need to manage your learning efficiently
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
        {tools.map((tool) => (
          <div
            key={tool.id}
            onClick={() => setActiveTool(tool.id)}
            className="relative w-full h-[280px] md:h-[307px] rounded-[20px] overflow-hidden group cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300"
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src={tool.image}
                alt={tool.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Gradient Overlay */}
            <div
              className="absolute inset-0"
              style={{ background: tool.gradient }}
            />

            {/* Content */}
            <div className="absolute top-4 left-8 right-8 text-white z-10">
              <h3 className="font-['Poppins'] font-semibold text-[20px] mb-0.5 drop-shadow-[0_0_1.5px_white]">
                {tool.title}
              </h3>
              <p className="font-['Poppins'] text-[12px] drop-shadow-[0_0_1.5px_white] opacity-95">
                {tool.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ─────────────── Notes App ─────────────── */

interface Note {
  id: string;
  title: string;
  content: string;
  timestamp: string;
}

const sampleNotes: Note[] = [
  {
    id: "1",
    title: "Social Science",
    content:
      "Lorem ipsum dolor sit amet consectetur. Semper leo quis odio enim. Purus diam at aenean morbi dictum. Est dui id malesuada amet pellentesque mattis leo. Placerat id libero eget enim ut rhoncus massa lectus. In et bibendum sem phasellus.",
    timestamp: "Today, 15:24",
  },
  {
    id: "2",
    title: "Maths",
    content:
      "Lorem ipsum dolor sit amet consectetur. Semper leo quis odio enim. Purus diam at aenean morbi dictum. Est dui id malesuada amet pellentesque mattis leo. Placerat id libero eget enim ut rhoncus massa lectus. In et bibendum sem phasellus.",
    timestamp: "Today, 15:24",
  },
  {
    id: "3",
    title: "Physics",
    content:
      "Lorem ipsum dolor sit amet consectetur. Semper leo quis odio enim. Purus diam at aenean morbi dictum. Est dui id malesuada amet pellentesque mattis leo. Placerat id libero eget enim ut rhoncus massa lectus. In et bibendum sem phasellus.",
    timestamp: "Today, 15:24",
  },
  {
    id: "4",
    title: "Chemistry",
    content:
      "Lorem ipsum dolor sit amet consectetur. Semper leo quis odio enim. Purus diam at aenean morbi dictum. Est dui id malesuada amet pellentesque mattis leo. Placerat id libero eget enim ut rhoncus massa lectus. In et bibendum sem phasellus.",
    timestamp: "Today, 14:50",
  },
  {
    id: "5",
    title: "English Literature",
    content:
      "Lorem ipsum dolor sit amet consectetur. Semper leo quis odio enim. Purus diam at aenean morbi dictum. Est dui id malesuada amet pellentesque mattis leo. Placerat id libero eget enim ut rhoncus massa lectus. In et bibendum sem phasellus.",
    timestamp: "Today, 14:12",
  },
];

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
    notesApi.list().then((data) => {
      setNotes(data.map((n: any) => ({
        id: n.id, title: n.title, content: n.content,
        timestamp: n.updatedAt ? `${new Date(n.updatedAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}` : "Now",
      })));
    }).catch(console.log).finally(() => setIsLoading(false));
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
      const timeStr = `Today, ${now.getHours().toString().padStart(2,"0")}:${now.getMinutes().toString().padStart(2,"0")}`;
      setNotes([{ id: saved.id, title: saved.title, content: saved.content, timestamp: timeStr }, ...notes]);
      setNewTitle(""); setNewContent(""); setIsCreating(false);
    } catch (e) { console.log("Save note error:", e); } finally { setIsSaving(false); }
  };

  const handleUpdateNote = async () => {
    if (!editingNote) return;
    setIsSaving(true);
    try {
      await notesApi.update(editingNote.id, { title: editingNote.title, content: editingNote.content });
      setNotes(notes.map((n) => (n.id === editingNote.id ? editingNote : n)));
      setEditingNote(null);
    } catch (e) { console.log("Update note error:", e); } finally { setIsSaving(false); }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await notesApi.delete(id);
      setNotes(notes.filter((n) => n.id !== id));
      if (editingNote?.id === id) setEditingNote(null);
    } catch (e) { console.log("Delete note error:", e); }
  };

  return (
    <div className="font-['Poppins']">
      {/* Breadcrumb */}
      <button
        type="button"
        onClick={onBack}
        className="text-[14px] font-medium text-black/60 hover:text-black/80 transition-colors cursor-pointer mb-1"
      >
        {"< Productivity Tools"}
      </button>

      {/* Title */}
      <h1 className="text-[28px] md:text-[32px] lg:text-[40px] font-medium text-black mb-5">
        Notes
      </h1>

      {/* Search Bar + Plus Button */}
      <div className="flex items-center gap-4 mb-8">
        {/* Search Bar */}
        <div className="flex-1 bg-white rounded-[12px] shadow-[0px_4px_60px_5px_rgba(0,0,0,0.15)] overflow-hidden">
          <div className="flex items-center gap-6 px-6 py-3">
            {/* Search Icon */}
            <div className="shrink-0 size-[24px]">
              <svg className="block size-full" fill="none" viewBox="0 0 24 24">
                <path
                  d={svgNotePaths.p10a22f00}
                  stroke="black"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search Notes"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 text-[16px] text-black/60 font-medium outline-none placeholder:text-black/60 bg-transparent"
            />
          </div>
        </div>

        {/* Plus Button */}
        <button
          type="button"
          onClick={() => {
            setIsCreating(true);
            setEditingNote(null);
          }}
          className="shrink-0 size-[49px] bg-[#003566] rounded-[12px] flex items-center justify-center hover:bg-[#002a52] transition-colors cursor-pointer"
        >
          <svg className="block size-[49px]" fill="none" viewBox="0 0 49 49">
            <path d={svgNotePaths.p36014500} fill="white" />
          </svg>
        </button>
      </div>

      {/* Create / Edit Note Modal */}
      {(isCreating || editingNote) && (
        <div className="mb-8 bg-white rounded-[20px] shadow-[0px_4px_60px_5px_rgba(0,0,0,0.08)] p-6">
          <input
            type="text"
            placeholder="Note title..."
            value={editingNote ? editingNote.title : newTitle}
            onChange={(e) =>
              editingNote
                ? setEditingNote({ ...editingNote, title: e.target.value })
                : setNewTitle(e.target.value)
            }
            className="w-full text-[16px] font-medium mb-4 outline-none placeholder:text-black/30 bg-transparent"
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
            className="w-full text-[16px] text-black/60 outline-none resize-none placeholder:text-black/30 bg-transparent"
          />
          <div className="flex items-center gap-3 mt-4 justify-end">
            {editingNote && (
              <button
                type="button"
                onClick={() => handleDeleteNote(editingNote.id)}
                className="px-5 py-2.5 text-[14px] rounded-[10px] text-red-500 hover:bg-red-50 transition-colors cursor-pointer mr-auto"
              >
                Delete
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setIsCreating(false);
                setEditingNote(null);
                setNewTitle("");
                setNewContent("");
              }}
              className="px-5 py-2.5 text-[14px] rounded-[10px] text-black/60 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={editingNote ? handleUpdateNote : handleSaveNote}
              className="px-5 py-2.5 text-[14px] rounded-[10px] bg-[#003566] text-white hover:bg-[#002a52] transition-colors cursor-pointer"
            >
              {editingNote ? "Update" : "Save"}
            </button>
          </div>
        </div>
      )}

      {/* Notes Row - Horizontally Scrollable */}
      <div className="relative">
        <div
          className="flex gap-[34px] overflow-x-auto pb-4 pr-4"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#003566 rgba(0,0,0,0.2)",
          }}
        >
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              onClick={() => {
                setEditingNote(note);
                setIsCreating(false);
              }}
              className="bg-[rgba(201,229,255,0.4)] shrink-0 w-[300px] md:w-[338px] rounded-[20px] p-6 cursor-pointer hover:shadow-md transition-all flex flex-col gap-4 group"
            >
              {/* Note Title */}
              <p className="text-[16px] font-medium text-black">
                {note.title}
              </p>

              {/* Note Content */}
              <p className="text-[16px] text-black/60 h-[193px] overflow-hidden whitespace-pre-wrap">
                {note.content}
              </p>

              {/* Timestamp */}
              <div className="flex items-center justify-end w-full">
                <p className="text-[12px] font-medium text-black/70">
                  {note.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Scrollbar Track (visual only, matching Figma) */}
      </div>

      {filteredNotes.length === 0 && !isCreating && !editingNote && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="size-16 rounded-full bg-[rgba(201,229,255,0.3)] flex items-center justify-center mb-4">
            <svg
              className="size-8 text-[#003566]/30"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
              />
            </svg>
          </div>
          <p className="text-black/40 text-[14px]">No notes found</p>
        </div>
      )}
    </div>
  );
}

/* ─────────────── Planner / Scheduler App ─────────────── */

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

const initialTasks: PlannerTask[] = [
  { id: "t1", title: "Complete Math Assignment", completed: false },
  { id: "t2", title: "Submit History Essays", completed: true },
  { id: "t3", title: "Read Biology Chapter 12", completed: false },
  { id: "t4", title: "Practice Spanish Verbs", completed: false },
  { id: "t5", title: "Review Chemistry Notes", completed: false },
];

const initialReminders: Reminder[] = [
  { id: "r1", title: "Maths Study Session  | Daily at 3:00PM", completed: false },
  { id: "r2", title: "Assignment Deadline | Weekly on Friday at 11:35PM", completed: true },
];

const initialStudyPlans: StudyPlan[] = [
  { id: "s1", title: "Advanced Physics", time: "9:00 AM - 11:00AM", progress: 75, priority: "high" },
  { id: "s2", title: "Statistics Review", time: "2:00 PM - 4:00 PM", progress: 50, priority: "medium" },
  { id: "s3", title: "Spanish Vocabulary", time: "7:00 PM - 8:00 PM", progress: 25, priority: "low" },
];

interface WeeklyDay {
  id: string;
  day: string;
  date: string;
  sessions: StudyPlan[];
}

const initialWeeklyData: WeeklyDay[] = [
  {
    id: "w1",
    day: "Monday",
    date: "Oct 21",
    sessions: [
      { id: "ws1", title: "Advanced Physics", time: "9:00 AM - 11:00 AM", progress: 75, priority: "high" },
      { id: "ws2", title: "Statistics Review", time: "11:30 AM - 1:00 PM", progress: 50, priority: "medium" },
      { id: "ws3", title: "Spanish Vocabulary", time: "3:00 PM - 4:00 PM", progress: 25, priority: "low" },
      { id: "ws4", title: "Chemistry Lab Prep", time: "5:00 PM - 6:30 PM", progress: 60, priority: "medium" },
    ],
  },
  {
    id: "w2",
    day: "Sunday",
    date: "Oct 20",
    sessions: [
      { id: "ws5", title: "Biology Chapter 12", time: "9:00 AM - 10:30 AM", progress: 40, priority: "high" },
      { id: "ws6", title: "English Literature", time: "11:00 AM - 12:30 PM", progress: 80, priority: "low" },
      { id: "ws7", title: "Math Practice", time: "2:00 PM - 3:30 PM", progress: 30, priority: "high" },
      { id: "ws8", title: "History Essays", time: "4:00 PM - 5:00 PM", progress: 90, priority: "medium" },
    ],
  },
  {
    id: "w3",
    day: "Saturday",
    date: "Oct 19",
    sessions: [
      { id: "ws9", title: "Physics Lab Report", time: "10:00 AM - 12:00 PM", progress: 55, priority: "high" },
      { id: "ws10", title: "French Conversation", time: "1:00 PM - 2:00 PM", progress: 70, priority: "low" },
      { id: "ws11", title: "Calculus Review", time: "3:00 PM - 5:00 PM", progress: 20, priority: "medium" },
      { id: "ws12", title: "Art History Reading", time: "6:00 PM - 7:00 PM", progress: 45, priority: "low" },
    ],
  },
  {
    id: "w4",
    day: "Friday",
    date: "Oct 18",
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

const initialCompletedPlans: CompletedPlan[] = [
  { id: "cp1", title: "Advanced Physics", date: "Oct 21", time: "9:00AM - 11:00AM" },
  { id: "cp2", title: "Statistics Review", date: "Oct 20", time: "2:00PM - 4:00PM" },
  { id: "cp3", title: "Chemistry", date: "Oct 19", time: "9:00AM - 11:00AM" },
  { id: "cp4", title: "English Literature", date: "Oct 18", time: "1:00PM - 3:00PM" },
  { id: "cp5", title: "Biology Lab Report", date: "Oct 17", time: "10:00AM - 12:00PM" },
];

const priorityConfig = {
  high: {
    rowBg: "bg-[#fef2f2]",
    badgeBg: "bg-[#fee2e2]",
    badgeText: "text-[#ef4444]",
    barColor: "bg-[#ef4444]",
    label: "High",
  },
  medium: {
    rowBg: "bg-[#fff7ed]",
    badgeBg: "bg-[#ffedd5]",
    badgeText: "text-[#f77f00]",
    barColor: "bg-[#f77f00]",
    label: "Medium",
  },
  low: {
    rowBg: "bg-[#f0fdf4]",
    badgeBg: "bg-[#dffbe9]",
    badgeText: "text-[#34b161]",
    barColor: "bg-[#34b161]",
    label: "Low",
  },
};

/* Shared icon components */
function CheckTickIcon({ size = 24 }: { size?: number }) {
  const path = size >= 32 ? svgPlannerPaths.p8611000 : svgPlannerPaths.p155a3500;
  return (
    <svg className="block" style={{ width: size, height: size }} fill="none" viewBox={`0 0 ${size} ${size}`}>
      <rect fill="#DCFCE7" height={size} rx="4" width={size} />
      <path clipRule="evenodd" d={path} fill="#34B161" fillRule="evenodd" />
    </svg>
  );
}

function DeleteIcon() {
  return (
    <svg className="block size-[24px]" fill="none" viewBox="0 0 24 24">
      <rect fill="#FEE2E2" height="24" rx="4" width="24" />
      <path d={svgPlannerPaths.p830b800} fill="#DC2626" />
      <path d="M8 9H16V19H8V9Z" fill="#DC2626" />
    </svg>
  );
}

function CompletedCircle() {
  return (
    <svg className="block w-[24px] h-[22px] shrink-0" fill="none" viewBox="0 0 24 22">
      <circle cx="12.75" cy="11" fill="#22C55E" r="11" />
      <circle cx="12.75" cy="11" r="10" stroke="#22C55E" strokeOpacity="0.4" strokeWidth="2" />
      <path clipRule="evenodd" d={svgPlannerPaths.p1caa2d00} fill="white" fillRule="evenodd" />
    </svg>
  );
}

function EmptyCircle() {
  return (
    <svg className="block size-[22px] shrink-0" fill="none" viewBox="0 0 22 22">
      <circle cx="11" cy="11" r="10" stroke="black" strokeOpacity="0.4" strokeWidth="2" />
    </svg>
  );
}

/* Icon for "My Tasks" section header */
function MyTasksIcon() {
  return (
    <svg className="block size-[24px] shrink-0" fill="none" viewBox="0 0 24 24">
      <rect fill="#F77F00" height="24" rx="5" width="24" />
      <path d={svgPlannerPaths.p27706680} fill="white" />
    </svg>
  );
}

/* Icon for "Active Reminders" section header */
function RemindersIcon() {
  return (
    <svg className="block size-[24px] shrink-0" fill="none" viewBox="0 0 24 24">
      <rect fill="#FFD60A" height="24" rx="5" width="24" />
      <path d={svgPlannerPaths.p67f3e80} fill="white" />
    </svg>
  );
}

/* Icon for "Study Plans" section header */
function StudyPlansIcon() {
  return (
    <div className="bg-[#1ca4b3] flex flex-col items-center justify-center rounded-[5px] shrink-0 size-[24px]">
      <svg className="block w-[12px] h-[14px]" fill="none" viewBox="0 0 13.5002 15.4998">
        <path d={svgPlannerPaths.p32c303f0} stroke="white" strokeLinejoin="round" strokeWidth="1.5" />
        <path d={svgPlannerPaths.p2b26e580} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        <path d={svgPlannerPaths.pa20fe80} stroke="white" strokeLinecap="round" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

/* Icon for Completed Plans – charm:circle-tick (outlined green circle with checkmark) */
function CharmCircleTickIcon() {
  return (
    <div className="overflow-clip relative shrink-0 size-[24px]">
      <div className="absolute inset-[11.02%_10.94%_10.94%_10.94%]">
        <div className="absolute inset-[-4%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20.2503 20.2309">
            <path d={svgCompletedPlanPaths.p25d5a980} stroke="#34B161" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgCompletedPlanPaths.p2d1019e0} stroke="#34B161" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

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

  /* Create Study Plan form state */
  const [formSubject, setFormSubject] = useState("");
  const [formGoal, setFormGoal] = useState("");
  const [formStartDate, setFormStartDate] = useState("");
  const [formEndDate, setFormEndDate] = useState("");
  const [formStartTime, setFormStartTime] = useState("");
  const [formEndTime, setFormEndTime] = useState("");
  const [formReminder, setFormReminder] = useState("Daily");
  const [formPriority, setFormPriority] = useState<"high" | "medium" | "low">("low");

  // Load all planner data from API
  useEffect(() => {
    Promise.all([tasksApi.list(), remindersApi.list(), studyPlansApi.list()])
      .then(([t, r, sp]) => {
        setTasks(t.map((x: any) => ({ id: x.id, title: x.title, completed: x.completed })));
        setReminders(r.map((x: any) => ({ id: x.id, title: `${x.title}  | ${x.frequency}${x.reminderTime ? " at " + x.reminderTime : ""}`, completed: x.completed })));
        const active = sp.filter((x: any) => !x.completed);
        const done = sp.filter((x: any) => x.completed);
        setStudyPlans(active.map((x: any) => ({ id: x.id, title: x.subject, time: x.timeStr || "TBD", progress: x.progress || 0, priority: x.priority || "low" })));
        setCompletedPlans(done.map((x: any) => ({ id: x.id, title: x.subject, date: x.startDate || "", time: x.timeStr || "" })));
      }).catch(console.log).finally(() => setIsLoading(false));
  }, []);

  const toggleTask = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const updated = { ...task, completed: !task.completed };
    setTasks(tasks.map((t) => (t.id === id ? updated : t)));
    try { await tasksApi.update(id, { completed: updated.completed }); } catch (e) { console.log(e); }
  };
  const deleteTask = async (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
    try { await tasksApi.delete(id); } catch (e) { console.log(e); }
  };
  const toggleReminder = async (id: string) => {
    const r = reminders.find((x) => x.id === id);
    if (!r) return;
    const updated = { ...r, completed: !r.completed };
    setReminders(reminders.map((x) => (x.id === id ? updated : x)));
    try { await remindersApi.update(id, { completed: updated.completed }); } catch (e) { console.log(e); }
  };
  const deleteReminder = async (id: string) => {
    setReminders(reminders.filter((r) => r.id !== id));
    try { await remindersApi.delete(id); } catch (e) { console.log(e); }
  };

  const visibleTasks = showAllTasks ? tasks : tasks.slice(0, 2);
  const visibleReminders = showAllReminders ? reminders : reminders.slice(0, 2);
  const visiblePlans = showAllPlans ? studyPlans : studyPlans.slice(0, 3);

  const resetForm = () => {
    setFormSubject(""); setFormGoal(""); setFormStartDate(""); setFormEndDate("");
    setFormStartTime(""); setFormEndTime(""); setFormReminder("Daily"); setFormPriority("low");
  };

  const handleCreateStudyPlan = async () => {
    if (!formSubject.trim()) return;
    try {
      const saved = await studyPlansApi.create({ subject: formSubject, goal: formGoal, startDate: formStartDate, endDate: formEndDate, startTime: formStartTime, endTime: formEndTime, reminder: formReminder, priority: formPriority });
      const timeStr = formStartTime && formEndTime ? `${formStartTime} - ${formEndTime}` : "TBD";
      setStudyPlans([...studyPlans, { id: saved.id, title: formSubject, time: timeStr, progress: 0, priority: formPriority }]);
      resetForm(); setShowCreateModal(false);
    } catch (e) { console.log("Create study plan error:", e); }
  };

  return (
    <div className="font-['Poppins']">
      {/* Breadcrumb */}
      <button
        type="button"
        onClick={onBack}
        className="text-[14px] font-medium text-black/60 hover:text-black/80 transition-colors cursor-pointer mb-1"
      >
        {"< Productivity Tools"}
      </button>

      {/* Title Row */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[28px] md:text-[32px] lg:text-[40px] font-medium text-black">
          Planner/Scheduler
        </h1>
        {/* + Button with Popup */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowAddPopup(!showAddPopup)}
            className="shrink-0 size-[49px] bg-[#003566] rounded-[12px] flex items-center justify-center hover:bg-[#002a52] transition-colors cursor-pointer"
          >
            <svg className="block size-[49px]" fill="none" viewBox="0 0 49 49">
              <path d={svgPlannerPaths.p36014500} fill="white" />
            </svg>
          </button>

          {/* Add Popup */}
          {showAddPopup && (
            <>
              {/* Invisible backdrop to close popup */}
              <div className="fixed inset-0 z-[90]" onClick={() => setShowAddPopup(false)} />
              {/* Popup card */}
              <div className="absolute right-0 top-[56px] z-[91] bg-white rounded-[20px] shadow-[0px_4px_50px_5px_rgba(0,0,0,0.1)] p-8 flex flex-col gap-6 w-[260px]">
                {/* Add New Task */}
                <button
                  type="button"
                  onClick={() => {
                    setShowAddPopup(false);
                    setShowAddTaskInput(true);
                  }}
                  className="flex gap-2.5 items-center cursor-pointer w-full hover:opacity-70 transition-opacity"
                >
                  <MyTasksIcon />
                  <p className="text-[14px] font-medium text-black">Add New Task</p>
                </button>
                {/* Add Smart Reminder */}
                <button
                  type="button"
                  onClick={() => {
                    setShowAddPopup(false);
                    setShowAddReminderInput(true);
                  }}
                  className="flex gap-2.5 items-center cursor-pointer w-full hover:opacity-70 transition-opacity"
                >
                  <RemindersIcon />
                  <p className="text-[14px] font-medium text-black">Add Smart Reminder</p>
                </button>
                {/* Create Study Plan */}
                <button
                  type="button"
                  onClick={() => {
                    setShowAddPopup(false);
                    setShowCreateModal(true);
                  }}
                  className="flex gap-2.5 items-center cursor-pointer w-full hover:opacity-70 transition-opacity"
                >
                  <StudyPlansIcon />
                  <p className="text-[14px] font-medium text-black">Create Study Plan</p>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ═══════ Add New Task Modal ═══════ */}
      {showAddTaskInput && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => { setShowAddTaskInput(false); setNewTaskTitle(""); }}
          />
          {/* Modal */}
          <div className="relative bg-white rounded-[20px] shadow-[0px_4px_50px_5px_rgba(0,0,0,0.1)] p-8 w-[calc(100%-32px)] max-w-[656px] z-10 overflow-hidden">
            <div className="flex flex-col gap-6 items-end w-full max-w-[592px]">
              {/* Header */}
              <div className="flex items-start gap-2.5 w-full">
                <svg className="block shrink-0 size-[36px]" fill="none" viewBox="0 0 36 36">
                  <rect fill="#F77F00" height="36" rx="5" width="36" />
                  <path d={svgAddTaskPaths.p3a4ec300} fill="white" />
                </svg>
                <p className="text-[24px] font-semibold text-black">Add New Task</p>
              </div>

              {/* Task Name Input */}
              <div className="flex flex-col gap-2.5 w-full">
                <p className="text-[16px] text-black">Task Name</p>
                <div className="relative h-[39px] rounded-[10px] border border-black/40">
                  <input
                    type="text"
                    autoFocus
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    onKeyDown={async (e) => {
                      if (e.key === "Enter" && newTaskTitle.trim()) {
                        try { const s = await tasksApi.create(newTaskTitle.trim()); setTasks([{ id: s.id, title: s.title, completed: false }, ...tasks]); } catch { setTasks([{ id: Date.now().toString(), title: newTaskTitle.trim(), completed: false }, ...tasks]); }
                        setNewTaskTitle(""); setShowAddTaskInput(false);
                      }
                      if (e.key === "Escape") { setShowAddTaskInput(false); setNewTaskTitle(""); }
                    }}
                    placeholder="example@ybl"
                    className="w-full h-full px-2.5 text-[14px] text-black/60 bg-transparent outline-none rounded-[10px] placeholder:text-black/60"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-6 items-center w-[334px]">
                <button
                  type="button"
                  onClick={() => { setShowAddTaskInput(false); setNewTaskTitle(""); }}
                  className="flex-1 h-[42px] rounded-[20px] border border-[#cc3636] flex items-center justify-center cursor-pointer hover:bg-red-50 transition-colors"
                >
                  <p className="text-[14px] font-medium text-[#cc3636]">Cancel</p>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (newTaskTitle.trim()) {
                      setTasks([...tasks, { id: Date.now().toString(), title: newTaskTitle.trim(), completed: false }]);
                      setNewTaskTitle("");
                      setShowAddTaskInput(false);
                    }
                  }}
                  className="flex-1 bg-[#f77f00] h-[42px] rounded-[20px] flex items-center justify-center cursor-pointer hover:bg-[#e07300] transition-colors"
                >
                  <p className="text-[14px] font-medium text-white">Add Task</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════ Add Smart Reminder Modal ═══════ */}
      {showAddReminderInput && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => { setShowAddReminderInput(false); setNewReminderTitle(""); setReminderFrequency("Daily"); setReminderDate(""); setReminderTime(""); }}
          />
          {/* Modal */}
          <div className="relative bg-white rounded-[20px] shadow-[0px_4px_50px_5px_rgba(0,0,0,0.1)] p-8 w-[calc(100%-32px)] max-w-[656px] z-10 overflow-hidden">
            <div className="flex flex-col gap-6 items-end w-full max-w-[592px]">
              {/* Header */}
              <div className="flex items-start gap-2.5 w-full">
                <svg className="block shrink-0 size-[36px]" fill="none" viewBox="0 0 36 36">
                  <rect fill="#FFD60A" height="36" rx="5" width="36" />
                  <path d={svgAddReminderPaths.p148ead00} fill="white" />
                </svg>
                <p className="text-[24px] font-semibold text-black">Add Smart Reminder</p>
              </div>

              {/* Row 1: Reminder Name + Frequency */}
              <div className="flex gap-6 items-start w-full">
                <div className="flex-1 flex flex-col gap-2.5">
                  <p className="text-[16px] text-black">Reminder Name</p>
                  <div className="relative h-[39px] rounded-[10px] border border-black/40">
                    <input
                      type="text"
                      autoFocus
                      value={newReminderTitle}
                      onChange={(e) => setNewReminderTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Escape") { setShowAddReminderInput(false); setNewReminderTitle(""); setReminderFrequency("Daily"); setReminderDate(""); setReminderTime(""); }
                      }}
                      placeholder="example@ybl"
                      className="w-full h-full px-2.5 text-[14px] text-black/60 bg-transparent outline-none rounded-[10px] placeholder:text-black/60"
                    />
                  </div>
                </div>
                <div className="flex-1 flex flex-col gap-2.5">
                  <p className="text-[16px] text-black">Frequency</p>
                  <div className="relative h-[39px] rounded-[10px] border border-black/70">
                    <select
                      value={reminderFrequency}
                      onChange={(e) => setReminderFrequency(e.target.value)}
                      className="w-full h-full px-2.5 pr-8 text-[14px] text-black/60 bg-transparent outline-none rounded-[10px] appearance-none cursor-pointer"
                    >
                      <option value="Daily">Daily</option>
                      <option value="Weekly">Weekly</option>
                      <option value="Monthly">Monthly</option>
                      <option value="Once">Once</option>
                    </select>
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="block size-[24px]" fill="none" viewBox="0 0 24 24">
                        <path d="M7 10L12 15L17 10" stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.6" strokeWidth="1.5" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 2: Date + Time */}
              <div className="flex gap-6 items-start w-full">
                <div className="flex-1 flex flex-col gap-2.5">
                  <p className="text-[16px] text-black">Date</p>
                  <div className="relative h-[39px] rounded-[10px] border border-black/70">
                    <input
                      type="date"
                      value={reminderDate}
                      onChange={(e) => setReminderDate(e.target.value)}
                      className="w-full h-full px-2.5 text-[14px] text-black/60 bg-transparent outline-none rounded-[10px] appearance-none"
                    />
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="block size-[21px]" fill="none" viewBox="0 0 21 21">
                        <path d={svgAddReminderPaths.p24603f80} fill="black" fillOpacity="0.6" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="flex-1 flex flex-col gap-2.5">
                  <p className="text-[16px] text-black">Time</p>
                  <div className="relative h-[39px] rounded-[10px] border border-black/40">
                    <input
                      type="time"
                      value={reminderTime}
                      onChange={(e) => setReminderTime(e.target.value)}
                      className="w-full h-full px-2.5 text-[14px] text-black/60 bg-transparent outline-none rounded-[10px] appearance-none"
                    />
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="block size-[19px] overflow-hidden" fill="none" viewBox="0 0 16.25 16.25">
                        <path d={svgAddReminderPaths.p153bcd80} stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.6" strokeWidth="2" />
                        <path d={svgAddReminderPaths.p3b383680} stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.6" strokeWidth="2" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-6 items-center w-[334px]">
                <button
                  type="button"
                  onClick={() => { setShowAddReminderInput(false); setNewReminderTitle(""); setReminderFrequency("Daily"); setReminderDate(""); setReminderTime(""); }}
                  className="flex-1 h-[42px] rounded-[20px] border border-[#cc3636] flex items-center justify-center cursor-pointer hover:bg-red-50 transition-colors"
                >
                  <p className="text-[14px] font-medium text-[#cc3636]">Cancel</p>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (newReminderTitle.trim()) {
                      const freqStr = reminderFrequency;
                      const timeStr = reminderTime || "TBD";
                      const title = `${newReminderTitle.trim()} | ${freqStr} at ${timeStr}`;
                      setReminders([...reminders, { id: Date.now().toString(), title, completed: false }]);
                      setNewReminderTitle("");
                      setReminderFrequency("Daily");
                      setReminderDate("");
                      setReminderTime("");
                      setShowAddReminderInput(false);
                    }
                  }}
                  className="flex-1 bg-[#ffd60a] h-[42px] rounded-[20px] flex items-center justify-center cursor-pointer hover:bg-[#e6c209] transition-colors"
                >
                  <p className="text-[14px] font-medium text-white">Add Reminder</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════ Create Study Plan Modal ═══════ */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => { setShowCreateModal(false); resetForm(); }}
          />
          {/* Modal */}
          <div className="relative bg-white rounded-[20px] shadow-[0px_4px_50px_5px_rgba(0,0,0,0.1)] p-8 w-[calc(100%-32px)] max-w-[656px] max-h-[90vh] overflow-y-auto z-10">
            <div className="flex flex-col gap-6 w-full">
              {/* Header */}
              <div className="flex items-start gap-2.5 w-full">
                <div className="bg-[#1ca4b3] flex flex-col items-center justify-center rounded-[5px] shrink-0 size-[36px]">
                  <svg className="block w-[12px] h-[14px]" fill="none" viewBox="0 0 13.5002 15.4998">
                    <path d={svgPlannerPaths.p32c303f0} stroke="white" strokeLinejoin="round" strokeWidth="1.5" />
                    <path d={svgPlannerPaths.p2b26e580} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                    <path d={svgPlannerPaths.pa20fe80} stroke="white" strokeLinecap="round" strokeWidth="1.5" />
                  </svg>
                </div>
                <p className="text-[24px] font-semibold text-black">Create Study Plan</p>
              </div>

              {/* Row 1: Subject/Topic + Goal/Target */}
              <div className="flex gap-6 w-full">
                <div className="flex-1 flex flex-col gap-2.5">
                  <p className="text-[16px] text-black">Subject/Topic</p>
                  <div className="relative h-[39px] rounded-[10px] border border-black/40">
                    <input
                      type="text"
                      value={formSubject}
                      onChange={(e) => setFormSubject(e.target.value)}
                      placeholder="example@ybl"
                      className="w-full h-full px-2.5 text-[14px] text-black/60 bg-transparent outline-none rounded-[10px] placeholder:text-black/60"
                    />
                  </div>
                </div>
                <div className="flex-1 flex flex-col gap-2.5">
                  <p className="text-[16px] text-black">Goal/Target</p>
                  <div className="relative h-[39px] rounded-[10px] border border-black/40">
                    <input
                      type="text"
                      value={formGoal}
                      onChange={(e) => setFormGoal(e.target.value)}
                      placeholder="Complete 5 chapters"
                      className="w-full h-full px-2.5 text-[14px] text-black/60 bg-transparent outline-none rounded-[10px] placeholder:text-black/60"
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Start Date + End Date */}
              <div className="flex gap-6 w-full">
                <div className="flex-1 flex flex-col gap-2.5">
                  <p className="text-[16px] text-black">Start Date</p>
                  <div className="relative h-[39px] rounded-[10px] border border-black/70">
                    <input
                      type="date"
                      value={formStartDate}
                      onChange={(e) => setFormStartDate(e.target.value)}
                      className="w-full h-full px-2.5 text-[14px] text-black/60 bg-transparent outline-none rounded-[10px] appearance-none"
                    />
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="block size-[21px]" fill="none" viewBox="0 0 21 21">
                        <path d={svgModalPaths.p24603f80} fill="black" fillOpacity="0.6" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="flex-1 flex flex-col gap-2.5">
                  <p className="text-[16px] text-black">End Date</p>
                  <div className="relative h-[39px] rounded-[10px] border border-black/70">
                    <input
                      type="date"
                      value={formEndDate}
                      onChange={(e) => setFormEndDate(e.target.value)}
                      className="w-full h-full px-2.5 text-[14px] text-black/60 bg-transparent outline-none rounded-[10px] appearance-none"
                    />
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="block size-[21px]" fill="none" viewBox="0 0 21 21">
                        <path d={svgModalPaths.p24603f80} fill="black" fillOpacity="0.6" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 3: Start Time + End Time */}
              <div className="flex gap-6 w-full">
                <div className="flex-1 flex flex-col gap-2.5">
                  <p className="text-[16px] text-black">Start Time</p>
                  <div className="relative h-[39px] rounded-[10px] border border-black/40">
                    <input
                      type="time"
                      value={formStartTime}
                      onChange={(e) => setFormStartTime(e.target.value)}
                      className="w-full h-full px-2.5 text-[14px] text-black/60 bg-transparent outline-none rounded-[10px] appearance-none"
                    />
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="block size-[19px] overflow-hidden" fill="none" viewBox="0 0 16.25 16.25">
                        <path d={svgModalPaths.p153bcd80} stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.6" strokeWidth="2" />
                        <path d={svgModalPaths.p3b383680} stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.6" strokeWidth="2" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="flex-1 flex flex-col gap-2.5">
                  <p className="text-[16px] text-black">End Time</p>
                  <div className="relative h-[39px] rounded-[10px] border border-black/40">
                    <input
                      type="time"
                      value={formEndTime}
                      onChange={(e) => setFormEndTime(e.target.value)}
                      className="w-full h-full px-2.5 text-[14px] text-black/60 bg-transparent outline-none rounded-[10px] appearance-none"
                    />
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="block size-[19px] overflow-hidden" fill="none" viewBox="0 0 16.25 16.25">
                        <path d={svgModalPaths.p153bcd80} stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.6" strokeWidth="2" />
                        <path d={svgModalPaths.p3b383680} stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.6" strokeWidth="2" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 4: Set Reminder + Priority */}
              <div className="flex gap-6 w-full">
                <div className="flex flex-col gap-2.5 w-[284px]">
                  <p className="text-[16px] text-black">Set Reminder</p>
                  <div className="relative h-[39px] rounded-[10px] border border-black/70">
                    <select
                      value={formReminder}
                      onChange={(e) => setFormReminder(e.target.value)}
                      className="w-full h-full px-2.5 pr-8 text-[14px] text-black/60 bg-transparent outline-none rounded-[10px] appearance-none cursor-pointer"
                    >
                      <option value="Daily">Daily</option>
                      <option value="Weekly">Weekly</option>
                      <option value="Monthly">Monthly</option>
                      <option value="None">None</option>
                    </select>
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="block size-[24px]" fill="none" viewBox="0 0 24 24">
                        <path d="M7 10L12 15L17 10" stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.6" strokeWidth="1.5" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2.5 w-[284px]">
                  <p className="text-[16px] text-black">Priority</p>
                  <div className="relative h-[39px] rounded-[10px] border border-black/70">
                    <select
                      value={formPriority}
                      onChange={(e) => setFormPriority(e.target.value as "high" | "medium" | "low")}
                      className="w-full h-full px-2.5 pr-8 text-[14px] text-black/60 bg-transparent outline-none rounded-[10px] appearance-none cursor-pointer"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="block size-[24px]" fill="none" viewBox="0 0 24 24">
                        <path d="M7 10L12 15L17 10" stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.6" strokeWidth="1.5" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-6 items-center justify-end w-full">
                <button
                  type="button"
                  onClick={() => { setShowCreateModal(false); resetForm(); }}
                  className="flex-1 max-w-[138px] h-[42px] rounded-[20px] border border-[#cc3636] flex items-center justify-center cursor-pointer hover:bg-red-50 transition-colors"
                >
                  <p className="text-[14px] font-medium text-[#cc3636]">Cancel</p>
                </button>
                <button
                  type="button"
                  onClick={handleCreateStudyPlan}
                  className="bg-[#1ca4b3] h-[42px] rounded-[20px] w-[172px] flex items-center justify-center cursor-pointer hover:bg-[#189aa8] transition-colors"
                >
                  <p className="text-[14px] font-medium text-white">Create Study Plan</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cards */}
      <div className="flex flex-col gap-6">
        {/* ───── My Tasks Card ───── */}
        <div className="bg-white rounded-[20px] shadow-[0px_4px_60px_5px_rgba(0,0,0,0.1)] overflow-hidden">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-1.5">
                <MyTasksIcon />
                <p className="text-[16px] font-medium text-black">My Tasks</p>
              </div>
              <div className="bg-[#f3f4f6] h-[27px] flex items-center justify-center rounded-[20px] px-3">
                <p className="text-[12px] text-black">{tasks.length} tasks</p>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              {visibleTasks.map((task) => (
                <div
                  key={task.id}
                  className={`h-[50px] rounded-[20px] flex items-center justify-between px-5 md:px-7 ${
                    task.completed ? "bg-[#f0fdf4]" : "bg-[#f9fafb]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <button type="button" onClick={() => toggleTask(task.id)} className="cursor-pointer shrink-0">
                      {task.completed ? <CompletedCircle /> : <EmptyCircle />}
                    </button>
                    <p className="text-[12px] text-black/80">{task.title}</p>
                  </div>
                  {task.completed ? (
                    <p className="text-[12px] font-medium text-[#34b161]">Completed</p>
                  ) : (
                    <div className="flex items-center gap-2.5">
                      <button type="button" onClick={() => toggleTask(task.id)} className="cursor-pointer shrink-0">
                        <CheckTickIcon size={24} />
                      </button>
                      <button type="button" onClick={() => deleteTask(task.id)} className="cursor-pointer shrink-0">
                        <DeleteIcon />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {tasks.length > 2 && (
              <div className="flex justify-center mt-5">
                <button type="button" onClick={() => setShowAllTasks(!showAllTasks)} className="text-[14px] font-medium text-black/80 underline cursor-pointer hover:text-black transition-colors">
                  {showAllTasks ? "Show Less" : "View All"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ───── Active Reminders Card ───── */}
        <div className="bg-white rounded-[20px] shadow-[0px_4px_60px_5px_rgba(0,0,0,0.1)] overflow-hidden">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-1.5">
                <RemindersIcon />
                <p className="text-[16px] font-medium text-black">Active Reminders</p>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              {visibleReminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className={`h-[50px] rounded-[20px] flex items-center justify-between px-5 md:px-7 ${
                    reminder.completed ? "bg-[#f0fdf4]" : "bg-[#f9fafb]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <button type="button" onClick={() => toggleReminder(reminder.id)} className="cursor-pointer shrink-0">
                      {reminder.completed ? <CompletedCircle /> : <EmptyCircle />}
                    </button>
                    <p className="text-[12px] text-black/80">{reminder.title}</p>
                  </div>
                  {reminder.completed ? (
                    <p className="text-[12px] font-medium text-[#34b161]">Completed</p>
                  ) : (
                    <div className="flex items-center gap-2.5">
                      <button type="button" onClick={() => toggleReminder(reminder.id)} className="cursor-pointer shrink-0">
                        <CheckTickIcon size={24} />
                      </button>
                      <button type="button" onClick={() => deleteReminder(reminder.id)} className="cursor-pointer shrink-0">
                        <DeleteIcon />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {reminders.length > 2 && (
              <div className="flex justify-center mt-5">
                <button type="button" onClick={() => setShowAllReminders(!showAllReminders)} className="text-[14px] font-medium text-black/80 underline cursor-pointer hover:text-black transition-colors">
                  {showAllReminders ? "Show Less" : "View All"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ───── Study Plans Card ───── */}
        <div className="bg-white rounded-[20px] shadow-[0px_4px_60px_5px_rgba(0,0,0,0.1)] overflow-hidden">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-1.5">
                <StudyPlansIcon />
                <p className="text-[16px] font-medium text-black">Study Plans</p>
              </div>
            </div>
            <div className="bg-[#f3f4f6] h-[50px] rounded-[20px] flex items-center p-1.5 mb-4">
              {([
                { key: "today" as const, label: "Todays Plan" },
                { key: "weekly" as const, label: "Weekly Overview" },
                { key: "completed" as const, label: "Completed Plans" },
              ]).map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setStudyTab(tab.key)}
                  className={`flex-1 h-full rounded-[20px] flex items-center justify-center text-[12px] font-medium cursor-pointer transition-colors ${
                    studyTab === tab.key
                      ? "bg-white text-black shadow-sm"
                      : "text-black/80 hover:text-black"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            {/* ── Today's Plan Tab ── */}
            {studyTab === "today" && (
              <>
                <div className="flex flex-col gap-4">
                  {visiblePlans.map((plan) => {
                    const config = priorityConfig[plan.priority];
                    return (
                      <div
                        key={plan.id}
                        className={`${config.rowBg} rounded-[20px] flex items-center justify-between px-5 md:px-7 py-5`}
                      >
                        <div className="flex flex-col gap-1">
                          <p className="text-[12px] font-medium text-black/80">{plan.title}</p>
                          <p className="text-[12px] text-black/60">{plan.time}</p>
                          <div className="flex items-center gap-2.5 mt-0.5">
                            <div className="relative w-[82px] h-[5px]">
                              <div className="absolute bg-[#d3d3d3] h-full left-0 rounded-[20px] top-0 w-full" />
                              <div
                                className={`absolute ${config.barColor} h-full left-0 rounded-[20px] top-0`}
                                style={{ width: `${(plan.progress / 100) * 82}px` }}
                              />
                            </div>
                            <p className="text-[10px] text-black/60">{plan.progress}%</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className={`${config.badgeBg} h-[27px] flex items-center justify-center px-2.5 rounded-[20px]`}>
                            <p className={`text-[12px] font-medium ${config.badgeText}`}>{config.label}</p>
                          </div>
                          <button type="button" className="cursor-pointer shrink-0">
                            <CheckTickIcon size={32} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {studyPlans.length > 3 && (
                  <div className="flex justify-center mt-5">
                    <button
                      type="button"
                      onClick={() => setShowAllPlans(!showAllPlans)}
                      className="text-[14px] font-medium text-black/80 underline cursor-pointer hover:text-black transition-colors"
                    >
                      {showAllPlans ? "Show Less" : "View All"}
                    </button>
                  </div>
                )}
              </>
            )}

            {/* ── Weekly Overview Tab ── */}
            {studyTab === "weekly" && (
              <>
                <div className="flex flex-col gap-4">
                  {(showAllWeekly ? initialWeeklyData : initialWeeklyData.slice(0, 3)).map((weekDay) => {
                    const isExpanded = expandedDays.includes(weekDay.id);
                    return (
                      <div key={weekDay.id} className="flex flex-col gap-0">
                        {/* Day Row */}
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedDays(
                              isExpanded
                                ? expandedDays.filter((d) => d !== weekDay.id)
                                : [...expandedDays, weekDay.id]
                            )
                          }
                          className={`bg-[#f9fafb] w-full flex items-center justify-between px-7 md:px-10 py-[23px] cursor-pointer hover:bg-[#f3f4f6] transition-colors ${
                            isExpanded ? "rounded-t-[20px]" : "rounded-[20px]"
                          }`}
                        >
                          <div className="flex flex-col gap-0.5 items-start">
                            <p className="text-[14px] font-medium text-black/80">{weekDay.day}</p>
                            <p className="text-[10px] text-black/80">{weekDay.date}</p>
                          </div>
                          <div className="flex gap-1.5 items-center">
                            <p className="text-[12px] text-black/80">{weekDay.sessions.length} sessions</p>
                            <svg
                              className={`block size-[24px] transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <path
                                d="M18 9L12 15L6 9"
                                stroke="black"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeOpacity="0.8"
                                strokeWidth="1.5"
                              />
                            </svg>
                          </div>
                        </button>
                        {/* Expanded Sessions */}
                        {isExpanded && (
                          <div className="bg-white border border-[#f3f4f6] border-t-0 rounded-b-[20px] px-5 md:px-7 py-4 flex flex-col gap-3">
                            {weekDay.sessions.map((session) => {
                              const config = priorityConfig[session.priority];
                              return (
                                <div
                                  key={session.id}
                                  className={`${config.rowBg} rounded-[16px] flex items-center justify-between px-5 md:px-6 py-4`}
                                >
                                  <div className="flex flex-col gap-1">
                                    <p className="text-[12px] font-medium text-black/80">{session.title}</p>
                                    <p className="text-[12px] text-black/60">{session.time}</p>
                                    <div className="flex items-center gap-2.5 mt-0.5">
                                      <div className="relative w-[82px] h-[5px]">
                                        <div className="absolute bg-[#d3d3d3] h-full left-0 rounded-[20px] top-0 w-full" />
                                        <div
                                          className={`absolute ${config.barColor} h-full left-0 rounded-[20px] top-0`}
                                          style={{ width: `${(session.progress / 100) * 82}px` }}
                                        />
                                      </div>
                                      <p className="text-[10px] text-black/60">{session.progress}%</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <div className={`${config.badgeBg} h-[27px] flex items-center justify-center px-2.5 rounded-[20px]`}>
                                      <p className={`text-[12px] font-medium ${config.badgeText}`}>{config.label}</p>
                                    </div>
                                    <button type="button" className="cursor-pointer shrink-0">
                                      <CheckTickIcon size={24} />
                                    </button>
                                  </div>
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
                  <div className="flex justify-center mt-5">
                    <button
                      type="button"
                      onClick={() => setShowAllWeekly(!showAllWeekly)}
                      className="text-[14px] font-medium text-black/80 underline cursor-pointer hover:text-black transition-colors"
                    >
                      {showAllWeekly ? "Show Less" : "View All"}
                    </button>
                  </div>
                )}
              </>
            )}

            {/* ── Completed Plans Tab ── */}
            {studyTab === "completed" && (
              <>
                <div className="flex flex-col gap-4">
                  {completedPlans.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <div className="size-14 rounded-full bg-[#f0fdf4] flex items-center justify-center mb-3">
                        <CharmCircleTickIcon />
                      </div>
                      <p className="text-[14px] text-black/40">No completed plans yet</p>
                      <p className="text-[12px] text-black/30 mt-1">Complete your study plans to see them here</p>
                    </div>
                  )}
                  {(showAllCompleted ? completedPlans : completedPlans.slice(0, 3)).map((plan) => (
                    <div
                      key={plan.id}
                      className="bg-[#f9fafb] rounded-[20px] flex items-center justify-between px-7 md:px-10 py-[23px]"
                    >
                      <div className="flex items-center gap-4">
                        <CharmCircleTickIcon />
                        <div className="flex flex-col gap-0.5">
                          <p className="text-[14px] font-medium text-black/80">{plan.title}</p>
                          <p className="text-[10px] text-black/80">{`${plan.date}  |  ${plan.time}`}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {completedPlans.length > 3 && (
                  <div className="flex justify-center mt-5">
                    <button
                      type="button"
                      onClick={() => setShowAllCompleted(!showAllCompleted)}
                      className="text-[14px] font-medium text-black/80 underline cursor-pointer hover:text-black transition-colors"
                    >
                      {showAllCompleted ? "Show Less" : "View All"}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}