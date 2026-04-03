import React, { useState, useRef } from "react";
import imgFrame1171275609 from "figma:asset/d0b5e8618139abd2e6c665600d3134442c6ea4a3.png";
import imgImage27 from "figma:asset/f0a250ad1361e9247b086e20f69a2980c11fcc14.png";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { motivationPosts as motivationPostsApi } from "@/app/lib/api";
import {
  ArrowLeft, Plus, ThumbsUp, ThumbsDown, Sparkles, Quote, BookOpen,
  ChevronDown, X, Image as ImageIcon, Paperclip
} from "lucide-react";

/* ── Types ── */
interface MotivationPost {
  id: string;
  type: "quote" | "story";
  title: string;
  description?: string;
  quoteText?: string;
  thumbnail?: string;
  author: string;
  authorAvatar: string;
  date: string;
  likes: number;
  dislikes: number;
  userReaction: "like" | "dislike" | null;
}

/* ── Mock Data ── */
const initialPosts: MotivationPost[] = [
  { id: "1", type: "quote", title: "Motivational Quote", quoteText: "\"The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle.\" — Steve Jobs", author: "Jack Sparrow", authorAvatar: imgFrame1171275609, date: "July 15, 2024", likes: 34, dislikes: 2, userReaction: null },
  { id: "2", type: "story", title: "Motivational Story", description: "A student who struggled with math for years discovered a love for problem-solving through a supportive study group. Their journey shows how community and persistence can transform your relationship with any subject.", thumbnail: imgImage27, author: "Jack Sparrow", authorAvatar: imgFrame1171275609, date: "July 15, 2024", likes: 28, dislikes: 1, userReaction: null },
  { id: "3", type: "quote", title: "Motivational Quote", quoteText: "\"Education is the most powerful weapon which you can use to change the world.\" — Nelson Mandela", author: "Sarah Johnson", authorAvatar: imgFrame1171275609, date: "August 3, 2024", likes: 56, dislikes: 0, userReaction: null },
  { id: "4", type: "story", title: "Motivational Story", description: "A student who failed three times before finally passing their medical boards shares how perseverance and self-belief led to ultimate success.", thumbnail: "https://images.unsplash.com/photo-1764377725269-a26ada9b551a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMHBlYWslMjBhY2hpZXZlbWVudCUyMHN1Y2Nlc3N8ZW58MXx8fHwxNzcxMTQ2OTIwfDA&ixlib=rb-4.1.0&q=80&w=1080", author: "Dr. Emily Chen", authorAvatar: imgFrame1171275609, date: "September 12, 2024", likes: 42, dislikes: 3, userReaction: null },
  { id: "5", type: "quote", title: "Motivational Quote", quoteText: "\"Success is not final, failure is not fatal: it is the courage to continue that counts.\" — Winston Churchill", author: "Alex Rivera", authorAvatar: imgFrame1171275609, date: "October 8, 2024", likes: 71, dislikes: 1, userReaction: null },
];

/* ── Modal Backdrop ── */
function ModalBackdrop({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#001d3d]/40 backdrop-blur-sm" onClick={onClose} />
      {children}
    </div>
  );
}

/* ── Post Modal ── */
function PostModal({ onClose, onPost }: {
  onClose: () => void;
  onPost: (post: Omit<MotivationPost, "id" | "likes" | "dislikes" | "userReaction">) => Promise<void> | void;
}) {
  const [postType, setPostType] = useState<"quote" | "story" | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [quoteText, setQuoteText] = useState("");
  const [storyText, setStoryText] = useState("");
  const [attachedImages, setAttachedImages] = useState<{ id: string; url: string; file?: File }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canSubmit = postType === "quote" ? quoteText.trim().length > 0 : postType === "story" ? storyText.trim().length > 0 : false;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    const now = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    if (postType === "quote") {
      await onPost({ type: "quote", title: "Motivational Quote", quoteText: quoteText.trim(), author: "Jack Sparrow", authorAvatar: imgFrame1171275609, date: now });
    } else {
      await onPost({ type: "story", title: "Motivational Story", description: storyText.trim(),
        thumbnail: attachedImages.length > 0 ? attachedImages[0].url : "https://images.unsplash.com/photo-1563208183-17ce26d6e360?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW5zZXQlMjBvY2VhbiUyMGluc3BpcmF0aW9uYWwlMjBsYW5kc2NhcGV8ZW58MXx8fHwxNzcxMTczMzMyfDA&ixlib=rb-4.1.0&q=80&w=1080",
        author: "Jack Sparrow", authorAvatar: imgFrame1171275609, date: now });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files; if (!files) return;
    const newImages = Array.from(files).map((file) => ({ id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, url: URL.createObjectURL(file), file }));
    setAttachedImages((prev) => [...prev, ...newImages]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const handleRemoveImage = (id: string) => {
    setAttachedImages((prev) => { const img = prev.find((i) => i.id === id); if (img) URL.revokeObjectURL(img.url); return prev.filter((i) => i.id !== id); });
  };

  const dropdownLabel = postType === "quote" ? "Quote" : postType === "story" ? "Story" : "Select post type...";

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="relative bg-white rounded-[24px] shadow-2xl p-7 w-full max-w-[560px] max-h-[90vh] overflow-y-auto z-10 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-[14px] flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #7f00ff, #e100ff)' }}>
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-[22px] font-bold text-[#003566]" style={{ fontFamily: "'DM Serif Display', serif" }}>Share Inspiration</h2>
          <button onClick={onClose} className="ml-auto w-8 h-8 rounded-[10px] hover:bg-[#f5f7fa] flex items-center justify-center text-[#94a3b8] hover:text-[#003566] transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Post Type Dropdown */}
        <div className="relative mb-4">
          <button onClick={() => setDropdownOpen((p) => !p)}
            className="w-full h-[44px] border border-[#e2e8f0] rounded-[12px] px-4 flex items-center justify-between cursor-pointer hover:border-[#c9ddf0] transition-colors bg-white">
            <span className={`text-[13px] ${postType ? "font-semibold text-[#1e293b]" : "text-[#94a3b8]"}`}>{dropdownLabel}</span>
            <ChevronDown className={`w-4 h-4 text-[#94a3b8] transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
          </button>
          {dropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-full bg-white rounded-[12px] shadow-xl border border-[#edf0f4] z-10 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
              <button onClick={() => { setPostType("quote"); setDropdownOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left cursor-pointer transition-colors text-[13px] ${postType === "quote" ? "bg-[#0967bd]/5 text-[#003566] font-semibold" : "text-[#5a7089] hover:bg-[#f5f7fa]"}`}>
                <Quote className="w-4 h-4" /> Quote
              </button>
              <button onClick={() => { setPostType("story"); setDropdownOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left cursor-pointer transition-colors text-[13px] ${postType === "story" ? "bg-[#0967bd]/5 text-[#003566] font-semibold" : "text-[#5a7089] hover:bg-[#f5f7fa]"}`}>
                <BookOpen className="w-4 h-4" /> Story
              </button>
            </div>
          )}
        </div>

        {/* Quote Input */}
        {postType === "quote" && (
          <textarea value={quoteText} onChange={(e) => setQuoteText(e.target.value)} placeholder="Type your inspiring quote here..."
            rows={4} className="w-full border border-[#e2e8f0] rounded-[12px] px-4 py-3 text-[14px] outline-none focus:border-[#7f00ff] focus:ring-1 focus:ring-[#7f00ff]/20 transition-all text-[#1e293b] placeholder:text-[#94a3b8] bg-white resize-none leading-relaxed mb-4" />
        )}

        {/* Story Input */}
        {postType === "story" && (
          <>
            <textarea value={storyText} onChange={(e) => setStoryText(e.target.value)} placeholder="Share your motivational story..."
              rows={8} className="w-full border border-[#e2e8f0] rounded-[12px] px-4 py-3 text-[14px] outline-none focus:border-[#7f00ff] focus:ring-1 focus:ring-[#7f00ff]/20 transition-all text-[#1e293b] placeholder:text-[#94a3b8] bg-white resize-none leading-relaxed mb-4" />

            {/* Attachments */}
            <div className="flex items-center gap-3 mb-4">
              {attachedImages.map((img) => (
                <div key={img.id} className="relative w-[80px] h-[80px] rounded-[14px] overflow-hidden border border-[#edf0f4]">
                  <ImageWithFallback src={img.url} alt="Attached" className="w-full h-full object-cover" />
                  <button onClick={() => handleRemoveImage(img.id)}
                    className="absolute top-1 right-1 w-5 h-5 bg-white/90 rounded-full flex items-center justify-center cursor-pointer shadow-sm">
                    <X className="w-3 h-3 text-[#1e293b]" />
                  </button>
                </div>
              ))}
              <button onClick={() => fileInputRef.current?.click()}
                className="h-[80px] px-4 rounded-[14px] border-2 border-dashed border-[#e2e8f0] hover:border-[#f77f00] flex items-center gap-2 cursor-pointer transition-colors group">
                <Paperclip className="w-4 h-4 text-[#c1c7ce] group-hover:text-[#f77f00] transition-colors" />
                <span className="text-[11px] font-medium text-[#c1c7ce] group-hover:text-[#f77f00] transition-colors">Attach</span>
              </button>
            </div>

            <input ref={fileInputRef} type="file" multiple accept="image/*,video/*" onChange={handleFileChange} className="hidden" />
          </>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button onClick={onClose}
            className="flex-1 h-[44px] rounded-[14px] border border-[#cc3636] text-[#cc3636] font-bold text-[13px] hover:bg-red-50 transition-colors cursor-pointer">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={!canSubmit}
            className="flex-1 h-[44px] rounded-[14px] font-bold text-[13px] text-white transition-all cursor-pointer disabled:opacity-50 hover:shadow-lg"
            style={{ background: canSubmit ? 'linear-gradient(135deg, #7f00ff, #e100ff)' : '#a6a6a6' }}>
            {postType === "story" ? "Post Story" : "Post"}
          </button>
        </div>
      </div>
    </ModalBackdrop>
  );
}

/* ── Reaction Buttons ── */
function ReactionButtons({ post, onLike, onDislike }: { post: MotivationPost; onLike: (id: string) => void; onDislike: (id: string) => void }) {
  return (
    <div className="flex items-center gap-2.5">
      <button onClick={() => onLike(post.id)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-[10px] transition-all cursor-pointer ${
          post.userReaction === "like" ? "bg-[#f77f00]/10 text-[#f77f00]" : "hover:bg-[#f5f7fa] text-[#94a3b8]"
        }`}>
        <ThumbsUp className="w-3.5 h-3.5" />
        <span className="text-[11px] font-bold">{post.likes}</span>
      </button>
      <button onClick={() => onDislike(post.id)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-[10px] transition-all cursor-pointer ${
          post.userReaction === "dislike" ? "bg-[#94a3b8]/10 text-[#5a7089]" : "hover:bg-[#f5f7fa] text-[#94a3b8]"
        }`}>
        <ThumbsDown className="w-3.5 h-3.5" />
        <span className="text-[11px] font-bold">{post.dislikes}</span>
      </button>
    </div>
  );
}

/* ── Quote Card ── */
function QuoteCard({ post, onLike, onDislike }: { post: MotivationPost; onLike: (id: string) => void; onDislike: (id: string) => void }) {
  return (
    <div className="bg-white rounded-[20px] border border-[#edf0f4] shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 p-6">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-9 h-9 rounded-[12px] flex items-center justify-center shrink-0"
          style={{ background: 'rgba(127,0,255,0.06)' }}>
          <Quote className="w-4 h-4 text-[#7f00ff]" />
        </div>
        <span className="text-[10px] font-bold text-[#7f00ff] uppercase tracking-[0.1em] mt-2.5">{post.title}</span>
      </div>

      <p className="text-[18px] md:text-[20px] text-[#003566] leading-[1.6] mb-6 italic"
        style={{ fontFamily: "'DM Serif Display', serif" }}>
        {post.quoteText || post.title}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-[#edf0f4]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 border border-[#edf0f4]">
            <ImageWithFallback src={post.authorAvatar} alt={post.author} className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-[12px] font-semibold text-[#1e293b]">{post.author}</p>
            <p className="text-[10px] text-[#94a3b8]">{post.date}</p>
          </div>
        </div>
        <ReactionButtons post={post} onLike={onLike} onDislike={onDislike} />
      </div>
    </div>
  );
}

/* ── Story Card ── */
function StoryCard({ post, onLike, onDislike }: { post: MotivationPost; onLike: (id: string) => void; onDislike: (id: string) => void }) {
  return (
    <div className="bg-white rounded-[20px] border border-[#edf0f4] shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <div className="flex flex-col md:flex-row">
        {post.thumbnail && (
          <div className="relative md:w-[220px] h-[160px] md:h-auto shrink-0 overflow-hidden">
            <ImageWithFallback src={post.thumbnail} alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold text-white uppercase bg-[#7f00ff]">Story</span>
          </div>
        )}
        <div className="flex-1 p-5 md:p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-[18px] font-bold text-[#003566] mb-2 leading-tight group-hover:text-[#7f00ff] transition-colors"
              style={{ fontFamily: "'DM Serif Display', serif" }}>
              {post.title}
            </h3>
            {post.description && (
              <p className="text-[13px] text-[#5a7089] leading-relaxed line-clamp-3 mb-4">{post.description}</p>
            )}
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-[#edf0f4]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 border border-[#edf0f4]">
                <ImageWithFallback src={post.authorAvatar} alt={post.author} className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-[12px] font-semibold text-[#1e293b]">{post.author}</p>
                <p className="text-[10px] text-[#94a3b8]">{post.date}</p>
              </div>
            </div>
            <ReactionButtons post={post} onLike={onLike} onDislike={onDislike} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main Component ── */
export function MotivationCornerView({ onBack }: { onBack: () => void }) {
  const [posts, setPosts] = useState<MotivationPost[]>(initialPosts);
  const [showPostModal, setShowPostModal] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(true);

  React.useEffect(() => {
    let mounted = true;
    motivationPostsApi
      .list()
      .then((rows) => {
        if (!mounted) return;
        if ((rows ?? []).length === 0) {
          setPosts([]);
          return;
        }

        setPosts((rows ?? []).map((post: any) => ({
          id: post.id,
          type: post.type,
          title: post.title,
          description: post.type === "story" ? post.content : undefined,
          quoteText: post.type === "quote" ? post.content : undefined,
          thumbnail: post.imageUrl || undefined,
          author: post.author,
          authorAvatar: post.authorAvatar || imgFrame1171275609,
          date: post.createdAt
            ? new Date(post.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
            : "Today",
          likes: 0,
          dislikes: 0,
          userReaction: null,
        })));
      })
      .catch((error) => {
        console.log("Motivation posts load error:", error);
      })
      .finally(() => {
        if (mounted) setLoadingPosts(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleLike = (id: string) => {
    setPosts((prev) => prev.map((p) => {
      if (p.id !== id) return p;
      if (p.userReaction === "like") return { ...p, likes: p.likes - 1, userReaction: null };
      return { ...p, likes: p.likes + 1, dislikes: p.userReaction === "dislike" ? p.dislikes - 1 : p.dislikes, userReaction: "like" as const };
    }));
  };
  const handleDislike = (id: string) => {
    setPosts((prev) => prev.map((p) => {
      if (p.id !== id) return p;
      if (p.userReaction === "dislike") return { ...p, dislikes: p.dislikes - 1, userReaction: null };
      return { ...p, dislikes: p.dislikes + 1, likes: p.userReaction === "like" ? p.likes - 1 : p.likes, userReaction: "dislike" as const };
    }));
  };
  const handleNewPost = async (post: Omit<MotivationPost, "id" | "likes" | "dislikes" | "userReaction">) => {
    try {
      const saved = await motivationPostsApi.create({
        type: post.type,
        title: post.title,
        content: post.type === "quote" ? (post.quoteText || post.title) : (post.description || ""),
        imageUrl: post.thumbnail || null,
      });

      setPosts((prev) => [{
        id: saved.id,
        type: saved.type,
        title: saved.title,
        description: saved.type === "story" ? saved.content : undefined,
        quoteText: saved.type === "quote" ? saved.content : undefined,
        thumbnail: saved.imageUrl || undefined,
        author: saved.author,
        authorAvatar: saved.authorAvatar || imgFrame1171275609,
        date: saved.createdAt
          ? new Date(saved.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
          : post.date,
        likes: 0,
        dislikes: 0,
        userReaction: null,
      }, ...prev]);
      setShowPostModal(false);
    } catch (error) {
      console.log("Create motivation post error:", error);
    }
  };

  return (
    <div className="w-full flex flex-col h-full" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Header */}
      <div className="flex items-center justify-between max-w-[900px] w-full shrink-0 mb-6">
        <div>
          <button onClick={onBack} className="flex items-center gap-2 text-[#5a7089] hover:text-[#003566] mb-3 transition-colors group cursor-pointer">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[13px] font-medium">Emotional Wellness</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[14px] flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #7f00ff, #e100ff)' }}>
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-[28px] md:text-[34px] text-[#003566]" style={{ fontFamily: "'DM Serif Display', serif" }}>
              Motivation Corner
            </h1>
          </div>
        </div>

        <button onClick={() => setShowPostModal(true)}
          className="flex items-center gap-2 px-4 h-[42px] rounded-[14px] font-bold text-[13px] text-white cursor-pointer hover:shadow-lg transition-all shrink-0"
          style={{ background: 'linear-gradient(135deg, #7f00ff, #e100ff)' }}>
          <Plus className="w-4 h-4" />
          Post
        </button>
      </div>

      {/* Posts Feed */}
      <div className="flex flex-col gap-5 overflow-y-auto max-w-[900px] w-full pb-6 min-h-0 flex-1 pr-1">
        {loadingPosts ? (
          <div className="bg-white rounded-[20px] border border-[#edf0f4] shadow-sm p-8 text-center">
            <p className="text-[14px] text-[#5a7089]">Loading community posts...</p>
          </div>
        ) : posts.length > 0 ? (
          posts.map((post) =>
            post.type === "quote" ? (
              <QuoteCard key={post.id} post={post} onLike={handleLike} onDislike={handleDislike} />
            ) : (
              <StoryCard key={post.id} post={post} onLike={handleLike} onDislike={handleDislike} />
            )
          )
        ) : (
          <div className="bg-white rounded-[20px] border border-[#edf0f4] shadow-sm p-8 text-center">
            <p className="text-[15px] font-semibold text-[#003566]">No community posts yet</p>
            <p className="text-[13px] text-[#94a3b8] mt-2">Be the first to share a quote or motivational story.</p>
          </div>
        )}
      </div>

      {showPostModal && <PostModal onClose={() => setShowPostModal(false)} onPost={handleNewPost} />}
    </div>
  );
}
