import { getCurrentUser } from "@/app/lib/api";
import imgImage28 from "figma:asset/605a593a8aec5bcd93a6caef17da90dbf55364dc.png";
import imgFrame1171275609 from "figma:asset/d0b5e8618139abd2e6c665600d3134442c6ea4a3.png";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import {
  ArrowLeft, BookOpen, Plus, ThumbsUp, ThumbsDown, Play, FileText, X,
  Image as ImageIcon, Sparkles, Clock, User
} from "lucide-react";

/* ── Types ── */
interface WellnessArticle {
  id: string;
  type: "article" | "video";
  title: string;
  description: string;
  thumbnail: string;
  author: string;
  date: string;
  likes: number;
  dislikes: number;
}

/* ── Mock Data ── */
const initialArticles: WellnessArticle[] = [
  { id: "1", type: "article", title: "5 Ways to Manage Exam Stress Effectively", description: "Exams can be overwhelming, but managing stress is key to performing well. Learn five proven strategies including deep breathing exercises, structured study plans, and mindfulness techniques that help you stay calm and focused during exam season.", thumbnail: "https://images.unsplash.com/photo-1578264141195-263ee8c797a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW5zZXQlMjBtZWRpdGF0aW9uJTIwd2VsbG5lc3N8ZW58MXx8fHwxNzcxMTcyMjkyfDA&ixlib=rb-4.1.0&q=80&w=1080", author: "Jack Sparrow", date: "July 15, 2024", likes: 24, dislikes: 2 },
  { id: "2", type: "video", title: "Guided Meditation for Students: 10 Minutes to Calm", description: "This guided meditation video is designed specifically for students. Take 10 minutes out of your day to reset, relax, and refocus. Perfect for study breaks or before bedtime to improve sleep quality.", thumbnail: "https://images.unsplash.com/photo-1764889743612-9e3761d787f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2dhJTIwbWluZGZ1bG5lc3MlMjBjYWxtfGVufDF8fHx8MTc3MTE2NjYyMHww&ixlib=rb-4.1.0&q=80&w=1080", author: "Sarah Johnson", date: "August 3, 2024", likes: 56, dislikes: 1 },
  { id: "3", type: "article", title: "The Power of Gratitude: How It Changes Your Brain", description: "Research shows that practicing gratitude regularly can rewire your brain for happiness. Discover the science behind gratitude journaling and how just five minutes a day can boost your mood and academic performance.", thumbnail: "https://images.unsplash.com/photo-1617844580965-4cb9f0ba3e6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmUlMjBwZWFjZWZ1bCUyMGZvcmVzdHxlbnwxfHx8fDE3NzExNzIyOTN8MA&ixlib=rb-4.1.0&q=80&w=1080", author: "Dr. Emily Chen", date: "September 12, 2024", likes: 42, dislikes: 0 },
  { id: "4", type: "video", title: "Study Focus Music: Lofi Beats for Deep Concentration", description: "Enhance your study sessions with carefully curated lofi beats. This playlist is scientifically designed to improve concentration, reduce anxiety, and help you enter a state of flow while studying.", thumbnail: "https://images.unsplash.com/photo-1763575648841-8793ad446b89?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwc3R1ZHlpbmclMjBmb2N1c3xlbnwxfHx8fDE3NzExNzIyOTN8MA&ixlib=rb-4.1.0&q=80&w=1080", author: "Alex Rivera", date: "October 8, 2024", likes: 89, dislikes: 3 },
];

/* ── Modal Backdrop ── */
function ModalBackdrop({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md" onClick={onClose} />
      {children}
    </div>
  );
}

/* ── Post Article Modal ── */
function PostArticleModal({ onClose, onPost }: { onClose: () => void; onPost: (a: Omit<WellnessArticle, "id" | "likes" | "dislikes">) => void }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [attachedImages, setAttachedImages] = useState<string[]>([]);

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return;
    onPost({
      type: "article", title: title.trim(), description: content.trim(),
      thumbnail: attachedImages[0] || "https://images.unsplash.com/photo-1578264141195-263ee8c797a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW5zZXQlMjBtZWRpdGF0aW9uJTIwd2VsbG5lc3N8ZW58MXx8fHwxNzcxMTcyMjkyfDA&ixlib=rb-4.1.0&q=80&w=1080",
      author: getCurrentUser()?.name ?? "You", date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
    });
  };

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="relative bg-white rounded-[24px] shadow-2xl p-7 w-full max-w-[560px] z-10 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-[14px] flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #003566, #0967bd)' }}>
            <FileText className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-[22px] font-bold text-[#003566]" style={{ fontFamily: "'DM Serif Display', serif" }}>Post New Article</h2>
          <button onClick={onClose} className="ml-auto w-8 h-8 rounded-[10px] hover:bg-[#f5f7fa] flex items-center justify-center text-[#94a3b8] hover:text-[#003566] transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 mb-4">
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Article Title"
            className="w-full h-[44px] border border-[#e2e8f0] rounded-[12px] px-4 text-[14px] font-bold outline-none focus:border-[#0967bd] focus:ring-1 focus:ring-[#0967bd]/20 transition-all text-[#1e293b] placeholder:text-[#94a3b8] bg-white" />
          <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write your article content..."
            rows={7} className="w-full border border-[#e2e8f0] rounded-[12px] px-4 py-3 text-[14px] outline-none focus:border-[#0967bd] focus:ring-1 focus:ring-[#0967bd]/20 transition-all text-[#1e293b] placeholder:text-[#94a3b8] bg-white resize-none leading-relaxed" />
        </div>

        {/* Attached Images */}
        <div className="flex items-center gap-3 mb-5">
          {attachedImages.map((img, i) => (
            <div key={i} className="relative w-[80px] h-[80px] rounded-[14px] overflow-hidden border border-[#edf0f4]">
              <img src={img} alt="Attached" className="w-full h-full object-cover" />
              <button onClick={() => setAttachedImages((p) => p.filter((_, j) => j !== i))}
                className="absolute top-1 right-1 w-5 h-5 bg-white/90 rounded-full flex items-center justify-center cursor-pointer shadow-sm">
                <X className="w-3 h-3 text-[#1e293b]" />
              </button>
            </div>
          ))}
          <button onClick={() => setAttachedImages((p) => [...p, imgImage28])}
            className="w-[80px] h-[80px] rounded-[14px] border-2 border-dashed border-[#e2e8f0] hover:border-[#f77f00] flex flex-col items-center justify-center cursor-pointer transition-colors group">
            <ImageIcon className="w-5 h-5 text-[#c1c7ce] group-hover:text-[#f77f00] transition-colors" />
            <span className="text-[9px] font-medium text-[#c1c7ce] group-hover:text-[#f77f00] mt-1 transition-colors">Add Image</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={onClose}
            className="flex-1 h-[44px] rounded-[14px] border border-[#cc3636] text-[#cc3636] font-bold text-[13px] hover:bg-red-50 transition-colors cursor-pointer">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={!title.trim() || !content.trim()}
            className="flex-1 h-[44px] rounded-[14px] font-bold text-[13px] text-white transition-all cursor-pointer disabled:opacity-50 hover:shadow-lg"
            style={{ background: 'linear-gradient(135deg, #003566, #0967bd)' }}>
            Post Article
          </button>
        </div>
      </div>
    </ModalBackdrop>
  );
}

/* ── Article Card ── */
function ArticleCard({ article, onLike, onDislike, userReaction }: {
  article: WellnessArticle; onLike: (id: string) => void; onDislike: (id: string) => void; userReaction: "like" | "dislike" | null;
}) {
  return (
    <div className="bg-white rounded-[20px] border border-[#edf0f4] shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <div className="flex flex-col md:flex-row">
        {/* Thumbnail */}
        <div className="relative md:w-[240px] h-[180px] md:h-auto shrink-0 overflow-hidden">
          <ImageWithFallback src={article.thumbnail} alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          {article.type === "video" && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
              <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                <Play className="w-5 h-5 text-[#003566] ml-0.5" fill="#003566" />
              </div>
            </div>
          )}
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold text-white uppercase"
            style={{ background: article.type === "video" ? '#f77f00' : '#0967bd' }}>
            {article.type}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 p-5 md:p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-[18px] font-bold text-[#003566] mb-2 leading-tight group-hover:text-[#0967bd] transition-colors"
              style={{ fontFamily: "'DM Serif Display', serif" }}>
              {article.title}
            </h3>
            <p className="text-[13px] text-[#5a7089] leading-relaxed line-clamp-3 mb-4">
              {article.description}
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 border border-[#edf0f4]">
                <img src={imgFrame1171275609} alt={article.author} className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-[12px] font-semibold text-[#1e293b]">{article.author}</p>
                <p className="text-[10px] text-[#94a3b8]">{article.date}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => onLike(article.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-[10px] transition-all cursor-pointer ${
                  userReaction === "like" ? "bg-[#f77f00]/10 text-[#f77f00]" : "hover:bg-[#f5f7fa] text-[#94a3b8]"
                }`}>
                <ThumbsUp className="w-3.5 h-3.5" />
                <span className="text-[11px] font-bold">{article.likes}</span>
              </button>
              <button onClick={() => onDislike(article.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-[10px] transition-all cursor-pointer ${
                  userReaction === "dislike" ? "bg-[#94a3b8]/10 text-[#5a7089]" : "hover:bg-[#f5f7fa] text-[#94a3b8]"
                }`}>
                <ThumbsDown className="w-3.5 h-3.5" />
                <span className="text-[11px] font-bold">{article.dislikes}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main Component ── */
export function WellnessResourcesView({ onBack }: { onBack: () => void }) {
  const [articles, setArticles] = useState<WellnessArticle[]>(initialArticles);
  const [reactions, setReactions] = useState<Record<string, "like" | "dislike" | null>>({});
  const [showPostModal, setShowPostModal] = useState(false);

  const handleLike = (id: string) => {
    setReactions((prev) => ({ ...prev, [id]: prev[id] === "like" ? null : "like" }));
    setArticles((prev) => prev.map((a) => {
      if (a.id !== id) return a;
      const cur = reactions[id];
      let likes = a.likes, dislikes = a.dislikes;
      if (cur === "like") likes -= 1; else if (cur === "dislike") { dislikes -= 1; likes += 1; } else likes += 1;
      return { ...a, likes, dislikes };
    }));
  };
  const handleDislike = (id: string) => {
    setReactions((prev) => ({ ...prev, [id]: prev[id] === "dislike" ? null : "dislike" }));
    setArticles((prev) => prev.map((a) => {
      if (a.id !== id) return a;
      const cur = reactions[id];
      let likes = a.likes, dislikes = a.dislikes;
      if (cur === "dislike") dislikes -= 1; else if (cur === "like") { likes -= 1; dislikes += 1; } else dislikes += 1;
      return { ...a, likes, dislikes };
    }));
  };
  const handlePostArticle = (newArticle: Omit<WellnessArticle, "id" | "likes" | "dislikes">) => {
    setArticles((prev) => [{ ...newArticle, id: Date.now().toString(), likes: 0, dislikes: 0 }, ...prev]);
    setShowPostModal(false);
  };

  return (
    <div className="w-full flex flex-col" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div>
          <button onClick={onBack} className="flex items-center gap-2 text-[#5a7089] hover:text-[#003566] mb-3 transition-colors group cursor-pointer">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[13px] font-medium">Emotional Wellness</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[14px] flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #0052d4, #6fb1fc)' }}>
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-[28px] md:text-[34px] text-[#003566]" style={{ fontFamily: "'DM Serif Display', serif" }}>
              Wellness Resources
            </h1>
          </div>
        </div>

        <button onClick={() => setShowPostModal(true)}
          className="flex items-center gap-2 px-4 h-[42px] rounded-[14px] font-bold text-[13px] text-white cursor-pointer hover:shadow-lg transition-all shrink-0"
          style={{ background: 'linear-gradient(135deg, #003566, #0967bd)' }}>
          <Plus className="w-4 h-4" />
          Post Article
        </button>
      </div>

      {/* Articles List */}
      <div className="flex flex-col gap-5 w-full max-w-[900px]">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} onLike={handleLike} onDislike={handleDislike}
            userReaction={reactions[article.id] ?? null} />
        ))}
        {articles.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 rounded-[20px] flex items-center justify-center mb-4" style={{ background: 'rgba(9,103,189,0.06)' }}>
              <BookOpen className="w-7 h-7 text-[#0967bd]/30" />
            </div>
            <p className="text-[14px] font-semibold text-[#5a7089]">No resources yet</p>
            <p className="text-[12px] text-[#94a3b8] mt-1">Be the first to post an article!</p>
          </div>
        )}
      </div>

      {showPostModal && <PostArticleModal onClose={() => setShowPostModal(false)} onPost={handlePostArticle} />}
    </div>
  );
}
