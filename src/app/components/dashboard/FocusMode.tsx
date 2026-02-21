import React, { useState, useEffect, useRef } from "react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { toast } from "sonner";
import { SilentModeView } from "./SilentModeView"; // Import Silent Mode component
import { PostReportNotification } from "./PostReportNotification"; // Import Post Report Notification
import { notes as notesApi } from "@/app/lib/api";

// Import SVGs
import svgPathsNew from "@/imports/svg-734xismd1b";
import svgPathsNotes from "@/imports/svg-notes";
import svgPaths from "@/imports/svg-10iypj6y9t";
import svgPathsBackground from "@/imports/svg-background";

// Import Images
import imgScreenshot111 from "figma:asset/a474824d07b7e42cbfd6a81ec948e9946f5e4c3e.png";
import imgImage29 from "figma:asset/30b04958b99e4725a9210a26769081ac12720108.png";
import imgImage30 from "figma:asset/aa7efc412ce1a4c3d775b48b4309e6230467e2c0.png";
import imgImage31 from "figma:asset/de662746f74c12720ca8b42aaa277de185521cd9.png";

// --- Icons for Timer Overlay ---

function IconParkOutlineCloseOne() {
  return (
    <div className="overflow-clip relative shrink-0 size-[32px] cursor-pointer hover:opacity-80 transition-opacity">
      <svg className="block size-full" fill="none" viewBox="0 0 29 29">
        <path d={svgPathsNew.p1fd3cb00} stroke="white" strokeLinejoin="round" strokeWidth="2" />
        <path d={svgPathsNew.p89d1180} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </svg>
    </div>
  );
}

function SolarPlayBold({ color = "#50FE00" }: { color?: string }) {
  return (
    <div className="relative shrink-0 size-[18px]">
      <svg className="block size-full" fill="none" viewBox="0 0 18 18">
        <path d={svgPathsNew.p10dbe800} fill={color} />
      </svg>
    </div>
  );
}

function MingcuteDeleteLine() {
  return (
    <div className="overflow-clip relative shrink-0 size-[18px]">
      <svg className="block size-full" fill="none" viewBox="0 0 14 17">
        <path d={svgPathsNew.p13847780} fill="#FF6969" />
      </svg>
    </div>
  );
}

// --- Icons for Notes Overlay ---

function MageSearch() {
  return (
    <div className="relative shrink-0 size-[24px]">
      <svg className="block size-full" fill="none" viewBox="0 0 24 24">
        <path d={svgPathsNotes.p1a791c50} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.6" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

function LucidePlus() {
  return (
    <div className="relative shrink-0 size-[24px]">
      <svg className="block size-full" fill="none" viewBox="0 0 24 24">
        <path d="M5 12H19M12 5V19" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.6" strokeWidth="2" />
      </svg>
    </div>
  );
}

// --- Icons for Footer ---

function Group() {
  return (
    <div className="h-[24px] relative shrink-0 w-[19px]">
      <svg className="block size-full" fill="none" viewBox="0 0 22 26">
        <path d={svgPaths.p139e5180} stroke="white" strokeWidth="2" />
        <path d={svgPaths.p1e52200} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </svg>
    </div>
  );
}

function SvgRepoIconCarrier() {
  return (
    <div className="h-[24px] relative shrink-0 w-[21px]">
       <svg className="block size-full" fill="none" viewBox="0 0 22 26">
         <path d={svgPaths.p32c67b00} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
         <path d={svgPaths.p18aa6100} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
       </svg>
    </div>
  );
}

function NotesFooterIcon() {
  return (
    <div className="h-[24px] relative w-[24px]">
      <svg className="block size-full" fill="none" viewBox="0 0 37 38">
        <path d={svgPathsNotes.p19076800} fill="white" />
        <path d={svgPathsNotes.p10c86b80} fill="white" />
        <path d={svgPathsNotes.p3cc2e600} fill="white" />
        <path d={svgPathsNotes.pac75b00} fill="white" />
        <path d={svgPathsNotes.p77ad900} fill="white" />
      </svg>
    </div>
  );
}

function BackgroundIcon() {
  return (
    <div className="relative shrink-0 size-[44px]">
      <svg className="block size-full" fill="none" viewBox="0 0 44 44">
        <path d={svgPathsBackground.p3de58900} fill="white" />
        <path clipRule="evenodd" d={svgPathsBackground.p103a8e00} fill="white" fillRule="evenodd" />
        <path d={svgPathsBackground.p239d3480} fill="white" opacity="0.5" />
      </svg>
    </div>
  );
}

function MynauiMusicSolid() {
  return (
    <div className="relative shrink-0 size-[24px]">
      <svg className="block size-full" fill="none" viewBox="0 0 24 24">
        <path d={svgPaths.p26fc0380} fill="white" />
      </svg>
    </div>
  );
}

// --- Helper Functions ---

const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h.toString().padStart(2, '0')} : ${m.toString().padStart(2, '0')} : ${s.toString().padStart(2, '0')}`;
};

// --- Components ---

function TimerOverlay({ onClose }: { onClose: () => void }) {
  const [timeLeft, setTimeLeft] = useState(60); // Default 1 min
  const [isActive, setIsActive] = useState(false);
  const [label, setLabel] = useState("Focus Session");
  
  // Ref to store the interval id
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
      toast.success("Timer finished!");
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, timeLeft]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const stopTimer = () => {
    setIsActive(false);
    setTimeLeft(60); // Reset to default or handle differently
  };

  const setTimer = (seconds: number, newLabel: string) => {
    setTimeLeft(seconds);
    setLabel(newLabel);
    setIsActive(true);
  };

  return (
    <div className="absolute right-4 bottom-24 md:right-12 md:bottom-24 w-[350px] md:w-[462px] bg-[rgba(20,19,22,0.95)] backdrop-blur-xl rounded-[20px] p-8 border border-white/10 shadow-2xl animate-in fade-in slide-in-from-bottom-4 z-40 flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <h2 className="font-['Poppins'] font-medium text-[24px] text-white">Focus Timer</h2>
        <button 
          onClick={onClose}
          type="button"
          className="relative z-50 cursor-pointer hover:opacity-80 transition-opacity"
          aria-label="Close"
        >
          <IconParkOutlineCloseOne />
        </button>
      </div>

      {/* Set Timer Section */}
      <div className="flex flex-col gap-4 w-full">
        <p className="font-['Poppins'] font-medium text-[16px] text-[rgba(255,255,255,0.6)]">Set Timer</p>
        
        {/* Label Input */}
        <div className="bg-[rgba(255,255,255,0.1)] rounded-[20px] w-full px-6 py-4 flex items-center justify-between">
           <span className="text-white font-['Poppins']">Label</span>
           <input 
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="text-[rgba(255,255,255,0.6)] font-['Poppins'] bg-transparent text-right outline-none"
           />
        </div>

        {/* Timer Display */}
        <div className="flex justify-center py-2">
           <p className="font-['Poppins'] text-[48px] md:text-[60px] text-white tabular-nums tracking-wider">{formatTime(timeLeft)}</p>
        </div>

        {/* Start/Stop Buttons */}
        <div className="flex items-center justify-between w-full gap-4">
           {/* Stop Button */}
           <button 
              onClick={stopTimer}
              className="flex-1 bg-[rgba(255,105,105,0.1)] rounded-[20px] px-6 py-4 flex items-center justify-center hover:bg-[rgba(255,105,105,0.2)] transition-colors active:scale-95"
           >
              <span className="text-[#ff6969] font-['Poppins']">Reset</span>
           </button>
           
           {/* Start Button */}
           <button 
              onClick={toggleTimer}
              className={`flex-1 rounded-[20px] px-6 py-4 flex items-center justify-center transition-colors active:scale-95 ${isActive ? 'bg-yellow-500/10 hover:bg-yellow-500/20' : 'bg-[rgba(80,254,0,0.1)] hover:bg-[rgba(80,254,0,0.2)]'}`}
           >
              <span className={`font-['Poppins'] ${isActive ? 'text-yellow-500' : 'text-[#50fe00]'}`}>
                 {isActive ? 'Pause' : 'Start'}
              </span>
           </button>
        </div>
      </div>

      {/* Recents Section */}
      <div className="flex flex-col gap-4 w-full">
         <div className="flex items-center justify-end w-full">
            <p className="font-['Poppins'] font-medium text-[16px] text-white">Recents</p>
         </div>

         {/* Recent Item 1 */}
         <div className="bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] transition-colors rounded-[20px] w-full px-6 py-4 flex items-center justify-between">
            <div className="flex flex-col items-start gap-1">
               <span className="text-[24px] text-[rgba(255,255,255,0.8)] font-['Poppins']">25:00</span>
               <span className="text-[16px] text-[rgba(255,255,255,0.6)] font-['Poppins']">Pomodoro</span>
            </div>
            <div className="flex items-center gap-4">
               <button onClick={() => setTimer(1500, "Pomodoro")} className="bg-[rgba(80,254,0,0.1)] rounded-[20px] size-[32px] flex items-center justify-center hover:bg-[rgba(80,254,0,0.2)] transition-colors">
                  <SolarPlayBold />
               </button>
            </div>
         </div>

         {/* Recent Item 2 */}
         <div className="bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] transition-colors rounded-[20px] w-full px-6 py-4 flex items-center justify-between">
            <div className="flex flex-col items-start gap-1">
               <span className="text-[24px] text-[rgba(255,255,255,0.8)] font-['Poppins']">05:00</span>
               <span className="text-[16px] text-[rgba(255,255,255,0.6)] font-['Poppins']">Short Break</span>
            </div>
            <div className="flex items-center gap-4">
               <button onClick={() => setTimer(300, "Short Break")} className="bg-[rgba(80,254,0,0.1)] rounded-[20px] size-[32px] flex items-center justify-center hover:bg-[rgba(80,254,0,0.2)] transition-colors">
                  <SolarPlayBold />
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}

interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
}

function NotesOverlay({ onClose }: { onClose: () => void }) {
  const [notesList, setNotesList] = useState<Note[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  // editing state: null = list view, 'new' = creating, noteId = editing existing
  const [editingId, setEditingId] = useState<string | null | "new">(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Load notes from API
  useEffect(() => {
    notesApi.list()
      .then((data: any[]) => {
        setNotesList(
          data.map((n) => ({
            id: n.id,
            title: n.title || "Untitled",
            content: n.content || "",
            date: n.createdAt
              ? new Date(n.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
              : "Just now",
          }))
        );
      })
      .catch((e) => {
        console.log("Error loading notes:", e);
        toast.error("Failed to load notes");
      })
      .finally(() => setIsLoading(false));
  }, []);

  // Open new note form
  const openNew = () => {
    setEditTitle("");
    setEditContent("");
    setEditingId("new");
  };

  // Open existing note for editing
  const openEdit = (note: Note) => {
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditingId(note.id);
  };

  // Save (create or update)
  const handleSave = async () => {
    if (!editTitle.trim() && !editContent.trim()) {
      setEditingId(null);
      return;
    }
    setIsSaving(true);
    try {
      if (editingId === "new") {
        const created = await notesApi.create(editTitle.trim() || "Untitled", editContent.trim());
        const newNote: Note = {
          id: created.id,
          title: created.title || "Untitled",
          content: created.content || "",
          date: "Just now",
        };
        setNotesList((prev) => [newNote, ...prev]);
        toast.success("Note saved");
      } else if (editingId) {
        await notesApi.update(editingId, { title: editTitle.trim() || "Untitled", content: editContent.trim() });
        setNotesList((prev) =>
          prev.map((n) =>
            n.id === editingId ? { ...n, title: editTitle.trim() || "Untitled", content: editContent.trim() } : n
          )
        );
        toast.success("Note updated");
      }
    } catch (e) {
      console.log("Error saving note:", e);
      toast.error("Failed to save note");
    } finally {
      setIsSaving(false);
      setEditingId(null);
    }
  };

  // Delete note
  const deleteNote = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await notesApi.delete(id);
      setNotesList((prev) => prev.filter((n) => n.id !== id));
      toast.success("Note deleted");
    } catch (e) {
      console.log("Error deleting note:", e);
      toast.error("Failed to delete note");
    }
  };

  const filteredNotes = notesList.filter((n) =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.content.toLowerCase().includes(search.toLowerCase())
  );

  // ── Edit / Create view ──
  if (editingId !== null) {
    return (
      <div className="absolute right-4 bottom-24 md:right-12 top-8 md:top-auto md:bottom-24 w-[350px] md:w-[462px] bg-[rgba(20,19,22,0.97)] backdrop-blur-xl rounded-[20px] p-8 border border-white/10 shadow-2xl animate-in fade-in z-40 flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center justify-between w-full">
          <button
            type="button"
            onClick={() => setEditingId(null)}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            <svg className="size-[18px]" fill="none" viewBox="0 0 24 24">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="font-['Poppins'] text-[14px]">Notes</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors rounded-full px-4 py-1.5 disabled:opacity-50"
          >
            {isSaving && (
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            <span className="font-['Poppins'] text-[13px] text-white">Save</span>
          </button>
        </div>

        {/* Title input */}
        <input
          type="text"
          placeholder="Note title…"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          autoFocus
          className="bg-transparent font-['Poppins'] font-medium text-[20px] text-white outline-none placeholder:text-white/30 border-b border-white/10 pb-3"
        />

        {/* Content textarea */}
        <textarea
          placeholder="Start writing your note…"
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          className="flex-1 bg-transparent font-['Poppins'] text-[15px] text-white/80 outline-none placeholder:text-white/30 resize-none leading-relaxed min-h-[260px]"
        />

        {/* Character count */}
        <p className="font-['Poppins'] text-[11px] text-white/30 text-right">{editContent.length} characters</p>
      </div>
    );
  }

  // ── List view ──
  return (
    <div className="absolute right-4 bottom-24 md:right-12 top-8 md:top-auto md:bottom-24 w-[350px] md:w-[462px] bg-[rgba(20,19,22,0.95)] backdrop-blur-xl rounded-[20px] p-8 border border-white/10 shadow-2xl animate-in fade-in slide-in-from-bottom-4 z-40 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <h2 className="font-['Poppins'] font-medium text-[24px] text-white">Notes</h2>
        <button
          onClick={onClose}
          type="button"
          className="relative z-50 cursor-pointer hover:opacity-80 transition-opacity"
          aria-label="Close"
        >
          <IconParkOutlineCloseOne />
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-[rgba(255,255,255,0.1)] rounded-[20px] w-full px-6 py-3 flex items-center gap-3">
        <MageSearch />
        <input
          type="text"
          placeholder="Search Notes"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent border-none outline-none text-[16px] text-white placeholder:text-[rgba(255,255,255,0.6)] w-full font-['Poppins']"
        />
      </div>

      {/* My Notes Header */}
      <div className="flex items-center justify-between w-full">
        <p className="font-['Poppins'] text-[12px] text-[rgba(255,255,255,0.6)] uppercase">My Notes</p>
        <button
          onClick={openNew}
          className="opacity-60 hover:opacity-100 transition-opacity hover:bg-white/10 rounded-full p-1"
          title="Add note"
        >
          <LucidePlus />
        </button>
      </div>

      {/* Notes List */}
      <div className="flex flex-col gap-4 w-full flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-3">
            <svg className="size-[40px] text-white/20" fill="none" viewBox="0 0 24 24">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="1.5" />
              <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <p className="font-['Poppins'] text-white/40 text-[14px] text-center">
              {search ? "No notes match your search" : "No notes yet. Tap + to create one."}
            </p>
          </div>
        ) : (
          filteredNotes.map((note) => (
            <div
              key={note.id}
              onClick={() => openEdit(note)}
              className="bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] rounded-[20px] p-6 flex flex-col gap-2 transition-colors cursor-pointer group relative"
            >
              <h3 className="font-['Poppins'] font-medium text-[16px] text-white">{note.title}</h3>
              <p className="font-['Poppins'] text-[14px] text-[rgba(255,255,255,0.6)] line-clamp-3">
                {note.content || <span className="italic text-white/30">Empty note</span>}
              </p>
              <div className="flex justify-between items-end mt-2">
                <span className="font-['Poppins'] font-medium text-[12px] text-[rgba(255,255,255,0.4)]">{note.date}</span>
                <button
                  onClick={(e) => deleteNote(note.id, e)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-500/20 rounded-full text-red-400"
                  title="Delete note"
                >
                  <MingcuteDeleteLine />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Quick-add CTA when empty */}
      {!isLoading && filteredNotes.length === 0 && !search && (
        <button
          onClick={openNew}
          className="w-full bg-white/10 hover:bg-white/15 transition-colors rounded-[16px] py-3 font-['Poppins'] text-[14px] text-white/70"
        >
          + Create your first note
        </button>
      )}
    </div>
  );
}

function BackgroundSelector({ 
  onSelect, 
  onClose,
  currentBackground 
}: { 
  onSelect: (bg: string) => void, 
  onClose: () => void,
  currentBackground: string
}) {
  const backgrounds = [
    { id: 'train', src: imgScreenshot111, alt: 'Train' },
    { id: 'snow', src: imgImage29, alt: 'Snow Cafe' },
    { id: 'space', src: imgImage30, alt: 'Space' },
    { id: 'jungle', src: imgImage31, alt: 'Jungle' },
  ];

  return (
    <div className="absolute left-1/2 -translate-x-1/2 bottom-[100px] z-40 animate-in fade-in slide-in-from-bottom-4">
       <div className="bg-[rgba(20,19,22,0.9)] backdrop-blur-xl rounded-[20px] p-[16px] flex gap-[16px] overflow-x-auto border border-white/10 shadow-2xl">
          {backgrounds.map((bg) => (
             <div 
                key={bg.id}
                onClick={() => onSelect(bg.src)}
                className={`relative w-[180px] h-[100px] md:w-[278px] md:h-[156px] rounded-[16px] overflow-hidden cursor-pointer transition-all hover:scale-[1.02] ${currentBackground === bg.src ? 'ring-2 ring-[#50fe00] shadow-lg scale-[1.02]' : 'opacity-70 hover:opacity-100'}`}
             >
                <ImageWithFallback 
                   src={bg.src} 
                   alt={bg.alt} 
                   className="absolute inset-0 size-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 hover:bg-transparent transition-colors" />
             </div>
          ))}
       </div>
    </div>
  );
}

interface FocusModeProps {
  onLeave: () => void;
}

export function FocusMode({ onLeave }: FocusModeProps) {
  const [showTimer, setShowTimer] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showBackgroundSelector, setShowBackgroundSelector] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState(imgScreenshot111);
  const [blockNotifications, setBlockNotifications] = useState(false);
  const [isSilentMode, setIsSilentMode] = useState(false); // Add Silent Mode toggle state
  const [reportNotification, setReportNotification] = useState<{ visible: boolean; name: string }>({ visible: false, name: '' });

  const toggleSilentMode = () => {
    const newState = !isSilentMode;
    setIsSilentMode(newState);
    if (newState) {
       toast.success("Silent Mode activated");
    } else {
       toast.info("Focus Mode activated");
    }
  };

  const handleReportSubmitted = (participantName: string) => {
    setReportNotification({ visible: true, name: participantName });
  };

  const closeReportNotification = () => {
    setReportNotification({ visible: false, name: '' });
  };

  // If Silent Mode is active, render the Silent Mode View
  if (isSilentMode) {
    return (
      <>
        <SilentModeView 
          onLeave={onLeave} 
          onBackToFocus={toggleSilentMode}
          onReportSubmitted={handleReportSubmitted}
        />
        <PostReportNotification 
          isVisible={reportNotification.visible}
          participantName={reportNotification.name}
          onClose={closeReportNotification}
        />
      </>
    );
  }

  const closeAll = () => {
    setShowTimer(false);
    setShowNotes(false);
    setShowBackgroundSelector(false);
  }

  const toggleTimer = () => {
    const newState = !showTimer;
    closeAll();
    setShowTimer(newState);
  };

  const toggleNotes = () => {
    const newState = !showNotes;
    closeAll();
    setShowNotes(newState);
  };
  
  const toggleBackgroundSelector = () => {
    const newState = !showBackgroundSelector;
    closeAll();
    setShowBackgroundSelector(newState);
  };

  const toggleNotifications = () => {
    const newState = !blockNotifications;
    setBlockNotifications(newState);
    if (newState) {
       toast.success("Notifications blocked");
    } else {
       toast.info("Notifications allowed");
    }
  };

  const handleMusicClick = () => {
     toast.info("Music player is currently disabled");
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#141316] flex flex-col overflow-hidden font-['Poppins']">
      {/* Background Image */}
      <div className="absolute inset-0 transition-all duration-700 ease-in-out">
        <ImageWithFallback 
          key={backgroundImage} 
          alt="Focus Background" 
          className="size-full object-cover animate-in fade-in duration-700" 
          src={backgroundImage} 
        />
        {/* Gradient Overlay for better text visibility at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-[300px] bg-gradient-to-t from-[#141316]/90 to-transparent pointer-events-none" />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative z-10 p-8 flex items-center justify-center">
          {/* Overlays */}
          {showTimer && <TimerOverlay onClose={() => setShowTimer(false)} />}
          {showNotes && <NotesOverlay onClose={() => setShowNotes(false)} />}
          
          {/* Background Selector */}
          {showBackgroundSelector && (
            <BackgroundSelector 
               onSelect={(bg) => setBackgroundImage(bg)} 
               onClose={() => setShowBackgroundSelector(false)}
               currentBackground={backgroundImage}
            />
          )}
      </div>

      {/* Footer Bar */}
      <div className="relative z-20 w-full px-6 md:px-12 pb-8 pt-4 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12">
        
        {/* Left: Time & Mode */}
        <div className="flex items-center gap-[16px] text-white shrink-0 bg-black/20 backdrop-blur-md px-6 py-3 rounded-full border border-white/5">
          <p className="text-[16px] text-[rgba(255,255,255,0.7)]">
            <span className="font-medium text-white">Time Elapsed: </span>
            00:01:29
          </p>
          
          {/* Vertical Separator */}
          <div className="h-[20px] w-[1px] bg-white/30" />
          
          <p className="font-medium text-[16px] text-white">Focus Mode</p>
        </div>

        {/* Center: Navigation Bar */}
        <div className="flex items-center justify-center w-full max-w-[374px]">
           <div className="bg-[rgba(255,255,255,0.1)] backdrop-blur-xl flex gap-[20px] px-6 py-2 h-[64px] items-center justify-center rounded-full w-full border border-white/10 shadow-2xl">
              {/* Timer Button */}
              <button 
                onClick={toggleTimer}
                className={`flex items-center justify-center rounded-full size-[48px] transition-all duration-300 ${showTimer ? 'bg-white text-black scale-110 shadow-[0_0_15px_rgba(255,255,255,0.5)]' : 'hover:bg-white/10 text-white'}`} 
                title="Timer"
              >
                <div className={`flex items-center justify-center size-[24px] ${showTimer ? 'brightness-0 invert' : ''}`}>
                   <Group />
                </div>
              </button>
              
              {/* Notifications Button */}
              <button 
                onClick={toggleNotifications}
                className={`flex items-center justify-center rounded-full size-[48px] transition-all duration-300 ${blockNotifications ? 'bg-white text-black scale-110 shadow-[0_0_15px_rgba(255,255,255,0.5)]' : 'hover:bg-white/10 text-white'}`} 
                title={blockNotifications ? "Unblock Notifications" : "Block Notifications"}
              >
                <div className={`${blockNotifications ? 'brightness-0 invert' : ''}`}>
                   <SvgRepoIconCarrier />
                </div>
              </button>
              
              {/* Notes Button */}
              <button 
                onClick={toggleNotes}
                className={`flex items-center justify-center rounded-full size-[48px] transition-all duration-300 ${showNotes ? 'bg-white text-black scale-110 shadow-[0_0_15px_rgba(255,255,255,0.5)]' : 'hover:bg-white/10 text-white'}`}
                title="Notes"
              >
                 <div className={`flex-none scale-y-[-100%] ${showNotes ? 'brightness-0 invert' : ''}`}>
                    <NotesFooterIcon />
                 </div>
              </button>
              
              {/* Background Button */}
              <button 
                onClick={toggleBackgroundSelector}
                className={`flex items-center justify-center rounded-full size-[48px] transition-all duration-300 ${showBackgroundSelector ? 'bg-white text-black scale-110 shadow-[0_0_15px_rgba(255,255,255,0.5)]' : 'hover:bg-white/10 text-white'}`}
                title="Change Background"
              >
                 <div className={`${showBackgroundSelector ? 'brightness-0 invert' : ''}`}>
                    <BackgroundIcon />
                 </div>
              </button>
              
              {/* Silent Mode Toggle Button */}
              <button 
                onClick={toggleSilentMode}
                className={`flex items-center justify-center rounded-full size-[48px] transition-all duration-300 hover:bg-white/10 text-white`}
                title="Activate Silent Mode"
              >
                 <svg className="size-[24px]" fill="none" viewBox="0 0 24 24">
                   <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" fill="white" fillOpacity="0.8"/>
                 </svg>
              </button>
           </div>
        </div>

        {/* Right: Leave Button */}
        <button 
          onClick={onLeave}
          className="bg-[#cc3636] flex h-[48px] items-center justify-center px-[28px] rounded-full hover:bg-[#b02e2e] transition-all shadow-lg shrink-0 hover:scale-105 active:scale-95"
        >
          <p className="font-semibold text-[16px] text-white tracking-wide">Leave Room</p>
        </button>
      </div>
    </div>
  );
}