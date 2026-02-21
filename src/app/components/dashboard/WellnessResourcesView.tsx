import React, { useState } from "react";
import svgPaths from "@/imports/svg-w1ctq7f27e";
import attachSvgPaths from "@/imports/svg-rie42b8guu";
import addSvgPaths from "@/imports/svg-ao7iptlbn4";
import imgImage28 from "figma:asset/605a593a8aec5bcd93a6caef17da90dbf55364dc.png";
import imgFrame1171275609 from "figma:asset/d0b5e8618139abd2e6c665600d3134442c6ea4a3.png";
import { ImageWithFallback } from "../figma/ImageWithFallback";

/* ── SVG Icon Components (from Figma import) ── */

function LikeIcon({ filled }: { filled?: boolean }) {
  return (
    <div className="relative shrink-0 size-[24px]">
      <svg className="block size-full" fill="none" viewBox="0 0 24 24">
        {filled ? (
          <>
            <path d={svgPaths.p2a838600} fill="#F77F00" />
            <path
              clipRule="evenodd"
              d={svgPaths.p34820a00}
              fill="#F77F00"
              fillRule="evenodd"
            />
          </>
        ) : (
          <path d={svgPaths.p3adbf600} fill="#F77F00" />
        )}
      </svg>
    </div>
  );
}

function DislikeIcon({ filled }: { filled?: boolean }) {
  return (
    <div className="relative shrink-0 size-[24px] -scale-y-100">
      <svg className="block size-full" fill="none" viewBox="0 0 24 24">
        {filled ? (
          <>
            <path d={svgPaths.p2a838600} fill="#F77F00" />
            <path
              clipRule="evenodd"
              d={svgPaths.p34820a00}
              fill="#F77F00"
              fillRule="evenodd"
            />
          </>
        ) : (
          <path d={svgPaths.p3adbf600} fill="#F77F00" />
        )}
      </svg>
    </div>
  );
}

function PlayIcon() {
  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[24px]">
      <svg className="block size-full" fill="none" viewBox="0 0 24 24">
        <path d={svgPaths.p1c33f400} fill="white" />
      </svg>
    </div>
  );
}

function PlusIcon() {
  return (
    <div className="relative shrink-0 size-[24px]">
      <svg className="block size-full" fill="none" viewBox="0 0 24 24">
        <path
          d="M12 5V19M5 12H19"
          stroke="#003566"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}

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
  {
    id: "1",
    type: "article",
    title: "5 Ways to Manage Exam Stress Effectively",
    description:
      "Exams can be overwhelming, but managing stress is key to performing well. Learn five proven strategies including deep breathing exercises, structured study plans, and mindfulness techniques that help you stay calm and focused during exam season.",
    thumbnail:
      "https://images.unsplash.com/photo-1578264141195-263ee8c797a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW5zZXQlMjBtZWRpdGF0aW9uJTIwd2VsbG5lc3N8ZW58MXx8fHwxNzcxMTcyMjkyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    author: "Jack Sparrow",
    date: "July 15, 2024",
    likes: 24,
    dislikes: 2,
  },
  {
    id: "2",
    type: "video",
    title: "Guided Meditation for Students: 10 Minutes to Calm",
    description:
      "This guided meditation video is designed specifically for students. Take 10 minutes out of your day to reset, relax, and refocus. Perfect for study breaks or before bedtime to improve sleep quality.",
    thumbnail:
      "https://images.unsplash.com/photo-1764889743612-9e3761d787f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2dhJTIwbWluZGZ1bG5lc3MlMjBjYWxtfGVufDF8fHx8MTc3MTE2NjYyMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    author: "Sarah Johnson",
    date: "August 3, 2024",
    likes: 56,
    dislikes: 1,
  },
  {
    id: "3",
    type: "article",
    title: "The Power of Gratitude: How It Changes Your Brain",
    description:
      "Research shows that practicing gratitude regularly can rewire your brain for happiness. Discover the science behind gratitude journaling and how just five minutes a day can boost your mood and academic performance.",
    thumbnail:
      "https://images.unsplash.com/photo-1617844580965-4cb9f0ba3e6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmUlMjBwZWFjZWZ1bCUyMGZvcmVzdHxlbnwxfHx8fDE3NzExNzIyOTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    author: "Dr. Emily Chen",
    date: "September 12, 2024",
    likes: 42,
    dislikes: 0,
  },
  {
    id: "4",
    type: "video",
    title: "Study Focus Music: Lofi Beats for Deep Concentration",
    description:
      "Enhance your study sessions with carefully curated lofi beats. This playlist is scientifically designed to improve concentration, reduce anxiety, and help you enter a state of flow while studying.",
    thumbnail:
      "https://images.unsplash.com/photo-1763575648841-8793ad446b89?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwc3R1ZHlpbmclMjBmb2N1c3xlbnwxfHx8fDE3NzExNzIyOTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    author: "Alex Rivera",
    date: "October 8, 2024",
    likes: 89,
    dislikes: 3,
  },
];

/* ── Post Article Modal ── */

interface PostArticleModalProps {
  onClose: () => void;
  onPost: (article: Omit<WellnessArticle, "id" | "likes" | "dislikes">) => void;
}

function PostArticleModal({ onClose, onPost }: PostArticleModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [attachedImages, setAttachedImages] = useState<string[]>([]);

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return;

    onPost({
      type: attachedImages.length > 0 ? "article" : "article",
      title: title.trim(),
      description: content.trim(),
      thumbnail: attachedImages[0] ||
        "https://images.unsplash.com/photo-1578264141195-263ee8c797a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW5zZXQlMjBtZWRpdGF0aW9uJTIwd2VsbG5lc3N8ZW58MXx8fHwxNzcxMTcyMjkyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      author: "Jack Sparrow",
      date: new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && title.trim() && content.trim()) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleAddImage = () => {
    // Simulate adding a sample image
    setAttachedImages((prev) => [...prev, imgImage28]);
  };

  const handleRemoveImage = (index: number) => {
    setAttachedImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[20px] shadow-[0px_4px_50px_0px_rgba(0,0,0,0.1)] w-full max-w-[600px] p-[24px] flex flex-col gap-[24px] items-end">
        {/* Title */}
        <p className="font-['Poppins'] font-semibold text-[24px] text-black w-full">
          Post New Article
        </p>

        {/* Input Fields */}
        <div className="flex flex-col gap-[4px] items-start w-full">
          {/* Article Title Input */}
          <div className="bg-white rounded-[10px] shadow-[0px_4px_29.4px_0px_rgba(0,0,0,0.1)] w-full">
            <div className="flex items-start p-[16px] w-full">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Article Title"
                className="font-['Poppins'] font-medium text-[16px] text-black/80 bg-transparent outline-none border-none w-full placeholder:text-black/80"
              />
            </div>
          </div>

          {/* Article Content Textarea */}
          <div className="bg-white h-[222px] rounded-[10px] shadow-[0px_4px_29.4px_0px_rgba(0,0,0,0.1)] w-full">
            <div className="flex items-start p-[16px] size-full">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Article Content"
                className="font-['Poppins'] text-[16px] text-black/70 leading-[21px] bg-transparent outline-none border-none w-full h-full resize-none placeholder:text-black/70"
              />
            </div>
          </div>
        </div>

        {/* Attached Images Gallery */}
        <div className="flex gap-[24px] items-center w-full">
          {attachedImages.map((img, index) => (
            <div
              key={index}
              className="h-[113px] overflow-clip relative rounded-[20px] shrink-0 w-[112px]"
            >
              <img
                alt="Attached"
                className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
                src={img}
              />
              {/* Close / Remove Button */}
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute left-[90px] top-[7px] size-[13px] cursor-pointer z-10"
              >
                <svg className="block size-full" fill="none" viewBox="0 0 13 13">
                  <rect fill="white" height="13" rx="6.5" width="13" />
                  <path
                    d={addSvgPaths.p11434fc0}
                    stroke="black"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="0.85"
                  />
                </svg>
              </button>
            </div>
          ))}

          {/* Add Image Button */}
          <button
            type="button"
            onClick={handleAddImage}
            className="overflow-clip relative shrink-0 size-[47px] cursor-pointer hover:scale-105 transition-transform"
          >
            <svg className="block size-full" fill="none" viewBox="0 0 47 47">
              <circle cx="23.5" cy="23.5" r="23.5" fill="#F77F00" fillOpacity="0.2" />
              <path
                d={addSvgPaths.pa4ae8c0}
                stroke="#F77F00"
                strokeLinecap="square"
                strokeLinejoin="round"
                strokeWidth="2"
                transform="translate(5.875, 5.875)"
              />
            </svg>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-[16px] items-center w-[337px]">
          {/* Cancel */}
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-[42px] flex items-center justify-center rounded-[20px] border border-[#cc3636] cursor-pointer hover:bg-[#cc3636]/5 transition-colors"
          >
            <span className="font-['Poppins'] font-medium text-[14px] text-[#cc3636]">
              Cancel
            </span>
          </button>

          {/* Post Article */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!title.trim() || !content.trim()}
            className="flex-1 h-[42px] bg-[#003566] flex items-center justify-center rounded-[20px] cursor-pointer hover:bg-[#002a52] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="font-['Poppins'] font-medium text-[14px] text-white">
              Post Article
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Article Card Component ── */

interface ArticleCardProps {
  article: WellnessArticle;
  onLike: (id: string) => void;
  onDislike: (id: string) => void;
  userReaction: "like" | "dislike" | null;
}

function ArticleCard({ article, onLike, onDislike, userReaction }: ArticleCardProps) {
  return (
    <div className="bg-white flex flex-col gap-[24px] items-start p-[24px] rounded-[20px] shadow-[0px_4px_50px_0px_rgba(0,0,0,0.1)] w-full">
      {/* Thumbnail */}
      <div className="bg-[#9f9f9f] h-[127px] overflow-clip relative rounded-[20px] shrink-0 w-[249px]">
        <ImageWithFallback
          src={article.thumbnail}
          alt={article.title}
          className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
        />
        {article.type === "video" && <PlayIcon />}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-[4px] items-start w-full">
        <p className="font-['Poppins'] font-medium text-[24px] text-[#003566] w-full">
          {article.title}
        </p>
        <p className="font-['Poppins'] text-[16px] text-black/70 leading-[21px] w-full">
          {article.description}
        </p>
      </div>

      {/* Footer: Author + Reactions */}
      <div className="flex items-center justify-between w-full">
        {/* Author */}
        <div className="flex gap-[10px] items-center">
          <div className="relative rounded-full shrink-0 size-[55px] overflow-hidden">
            <div className="absolute bg-[#cacaca] inset-0 rounded-full" />
            <img
              alt={article.author}
              className="absolute h-full left-0 max-w-none top-0 w-full object-cover"
              src={imgFrame1171275609}
            />
          </div>
          <div className="flex flex-col gap-[10px] items-start">
            <p className="font-['Poppins'] font-medium text-[14px] text-black/70 leading-[21px]">
              {article.author}
            </p>
            <p className="font-['Poppins'] font-medium text-[12px] text-black/60 leading-[21px]">
              {article.date}
            </p>
          </div>
        </div>

        {/* Like / Dislike */}
        <div className="flex gap-[24px] items-center">
          <button
            type="button"
            onClick={() => onLike(article.id)}
            className="cursor-pointer hover:scale-110 transition-transform flex items-center gap-1.5"
          >
            <LikeIcon filled={userReaction === "like"} />
            <span className="font-['Poppins'] text-[12px] text-[#F77F00]">
              {article.likes}
            </span>
          </button>
          <button
            type="button"
            onClick={() => onDislike(article.id)}
            className="cursor-pointer hover:scale-110 transition-transform flex items-center gap-1.5"
          >
            <DislikeIcon filled={userReaction === "dislike"} />
            <span className="font-['Poppins'] text-[12px] text-[#F77F00]">
              {article.dislikes}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Component ── */

interface WellnessResourcesViewProps {
  onBack: () => void;
}

export function WellnessResourcesView({ onBack }: WellnessResourcesViewProps) {
  const [articles, setArticles] = useState<WellnessArticle[]>(initialArticles);
  const [reactions, setReactions] = useState<Record<string, "like" | "dislike" | null>>({});
  const [showPostModal, setShowPostModal] = useState(false);

  const handleLike = (id: string) => {
    setReactions((prev) => {
      const current = prev[id];
      const next = current === "like" ? null : "like";
      return { ...prev, [id]: next };
    });

    setArticles((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;
        const currentReaction = reactions[id];
        let likes = a.likes;
        let dislikes = a.dislikes;

        if (currentReaction === "like") {
          // Undo like
          likes -= 1;
        } else if (currentReaction === "dislike") {
          // Switch from dislike to like
          dislikes -= 1;
          likes += 1;
        } else {
          // Fresh like
          likes += 1;
        }

        return { ...a, likes, dislikes };
      })
    );
  };

  const handleDislike = (id: string) => {
    setReactions((prev) => {
      const current = prev[id];
      const next = current === "dislike" ? null : "dislike";
      return { ...prev, [id]: next };
    });

    setArticles((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;
        const currentReaction = reactions[id];
        let likes = a.likes;
        let dislikes = a.dislikes;

        if (currentReaction === "dislike") {
          // Undo dislike
          dislikes -= 1;
        } else if (currentReaction === "like") {
          // Switch from like to dislike
          likes -= 1;
          dislikes += 1;
        } else {
          // Fresh dislike
          dislikes += 1;
        }

        return { ...a, likes, dislikes };
      })
    );
  };

  const handlePostArticle = (
    newArticle: Omit<WellnessArticle, "id" | "likes" | "dislikes">
  ) => {
    const article: WellnessArticle = {
      ...newArticle,
      id: Date.now().toString(),
      likes: 0,
      dislikes: 0,
    };
    setArticles((prev) => [article, ...prev]);
    setShowPostModal(false);
  };

  return (
    <div className="w-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div className="flex flex-col items-start pb-1.5">
          <button
            type="button"
            onClick={onBack}
            className="font-['Poppins'] text-[14px] text-black/60 cursor-pointer hover:text-black/80 transition-colors mb-0.5"
          >
            {"< Emotional Wellness"}
          </button>
          <h1 className="font-['Poppins'] font-medium text-[40px] text-black leading-tight">
            Wellness Resources
          </h1>
        </div>

        {/* Post Article Button */}
        <button
          type="button"
          onClick={() => setShowPostModal(true)}
          className="flex gap-[6px] h-[42px] items-center px-[16px] rounded-[10px] border-2 border-[#003566] cursor-pointer hover:bg-[#003566]/5 transition-colors shrink-0"
        >
          <span className="font-['Poppins'] font-medium text-[14px] text-[#003566]">
            Post Article
          </span>
          <PlusIcon />
        </button>
      </div>

      {/* Articles List */}
      <div className="flex flex-col gap-[24px] w-full max-w-[1082px]">
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            onLike={handleLike}
            onDislike={handleDislike}
            userReaction={reactions[article.id] ?? null}
          />
        ))}

        {articles.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="font-['Poppins'] text-[18px] text-black/40">
              No resources yet. Be the first to post!
            </p>
          </div>
        )}
      </div>

      {/* Post Article Modal */}
      {showPostModal && (
        <PostArticleModal
          onClose={() => setShowPostModal(false)}
          onPost={handlePostArticle}
        />
      )}
    </div>
  );
}