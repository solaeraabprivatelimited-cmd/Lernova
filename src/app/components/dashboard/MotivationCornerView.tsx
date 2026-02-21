import React, { useState, useRef } from "react";
import svgPaths from "@/imports/svg-22pgop4ljw";
import attachSvgPaths from "@/imports/svg-wmk6nszp1j";
import storySvgPaths from "@/imports/svg-lqbdnhvtlu";
import imgFrame1171275609 from "figma:asset/d0b5e8618139abd2e6c665600d3134442c6ea4a3.png";
import imgImage27 from "figma:asset/f0a250ad1361e9247b086e20f69a2980c11fcc14.png";
import { ImageWithFallback } from "../figma/ImageWithFallback";

/* ── SVG Icon Components ── */

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
  {
    id: "1",
    type: "quote",
    title: "Motivational Quote",
    quoteText:
      "\"The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle.\" — Steve Jobs",
    author: "Jack Sparrow",
    authorAvatar: imgFrame1171275609,
    date: "July 15,2024",
    likes: 34,
    dislikes: 2,
    userReaction: null,
  },
  {
    id: "2",
    type: "story",
    title: "Motivational Story",
    description:
      "Lorem ipsum dolor sit amet consectetur. Adipiscing porttitor vel varius ut sed neque ut. Aliquet molestie dignissim eu elementum sollicitudin.",
    thumbnail: imgImage27,
    author: "Jack Sparrow",
    authorAvatar: imgFrame1171275609,
    date: "July 15,2024",
    likes: 28,
    dislikes: 1,
    userReaction: null,
  },
  {
    id: "3",
    type: "quote",
    title: "Motivational Quote",
    quoteText:
      "\"Education is the most powerful weapon which you can use to change the world.\" — Nelson Mandela",
    author: "Sarah Johnson",
    authorAvatar: imgFrame1171275609,
    date: "August 3,2024",
    likes: 56,
    dislikes: 0,
    userReaction: null,
  },
  {
    id: "4",
    type: "story",
    title: "Motivational Story",
    description:
      "A student who failed three times before finally passing their medical boards shares how perseverance and self-belief led to ultimate success.",
    thumbnail:
      "https://images.unsplash.com/photo-1764377725269-a26ada9b551a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMHBlYWslMjBhY2hpZXZlbWVudCUyMHN1Y2Nlc3N8ZW58MXx8fHwxNzcxMTQ2OTIwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    author: "Dr. Emily Chen",
    authorAvatar: imgFrame1171275609,
    date: "September 12,2024",
    likes: 42,
    dislikes: 3,
    userReaction: null,
  },
  {
    id: "5",
    type: "quote",
    title: "Motivational Quote",
    quoteText:
      "\"Success is not final, failure is not fatal: it is the courage to continue that counts.\" — Winston Churchill",
    author: "Alex Rivera",
    authorAvatar: imgFrame1171275609,
    date: "October 8,2024",
    likes: 71,
    dislikes: 1,
    userReaction: null,
  },
];

/* ── Post Modal ── */

interface PostModalProps {
  onClose: () => void;
  onPost: (post: Omit<MotivationPost, "id" | "likes" | "dislikes" | "userReaction">) => void;
}

function PostModal({ onClose, onPost }: PostModalProps) {
  const [postType, setPostType] = useState<"quote" | "story" | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [quoteText, setQuoteText] = useState("");
  const [storyText, setStoryText] = useState("");
  const [attachedImages, setAttachedImages] = useState<
    { id: string; url: string; file?: File }[]
  >([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canSubmit =
    postType === "quote"
      ? quoteText.trim().length > 0
      : postType === "story"
        ? storyText.trim().length > 0
        : false;

  const handleSubmit = () => {
    if (!canSubmit) return;

    const now = new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    if (postType === "quote") {
      onPost({
        type: "quote",
        title: "Motivational Quote",
        quoteText: quoteText.trim(),
        author: "Jack Sparrow",
        authorAvatar: imgFrame1171275609,
        date: now,
      });
    } else {
      onPost({
        type: "story",
        title: "Motivational Story",
        description: storyText.trim(),
        thumbnail: attachedImages.length > 0
          ? attachedImages[0].url
          : "https://images.unsplash.com/photo-1563208183-17ce26d6e360?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW5zZXQlMjBvY2VhbiUyMGluc3BpcmF0aW9uYWwlMjBsYW5kc2NhcGV8ZW58MXx8fHwxNzcxMTczMzMyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        author: "Jack Sparrow",
        authorAvatar: imgFrame1171275609,
        date: now,
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && canSubmit) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newImages = Array.from(files).map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      url: URL.createObjectURL(file),
      file,
    }));
    setAttachedImages((prev) => [...prev, ...newImages]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveImage = (id: string) => {
    setAttachedImages((prev) => {
      const img = prev.find((i) => i.id === id);
      if (img) URL.revokeObjectURL(img.url);
      return prev.filter((i) => i.id !== id);
    });
  };

  const dropdownLabel =
    postType === "quote"
      ? "Quote"
      : postType === "story"
        ? "Story"
        : "Post Type";

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[20px] shadow-[0px_4px_50px_0px_rgba(0,0,0,0.1)] w-full max-w-[618px] p-[24px] flex flex-col gap-[24px] items-end">
        {/* Title */}
        <p className="font-['Poppins'] font-semibold text-[24px] text-black w-full">
          Post Motivational Quote/Story
        </p>

        {/* Post Type Dropdown + Input Area */}
        <div className="flex flex-col gap-[4px] items-start w-full">
          {/* Dropdown Selector */}
          <div className="relative w-full">
            <button
              type="button"
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="bg-white w-full rounded-[10px] shadow-[0px_4px_29.4px_0px_rgba(0,0,0,0.1)] flex items-center justify-between p-[16px] cursor-pointer"
            >
              <span className="font-['Poppins'] font-medium text-[16px] text-black/80">
                {dropdownLabel}
              </span>
              <svg
                className={`shrink-0 size-[24px] transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  d="M7 10L12 15L17 10"
                  stroke="black"
                  strokeOpacity="0.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
              </svg>
            </button>

            {/* Dropdown Options */}
            {dropdownOpen && (
              <div className="absolute top-full left-0 mt-[4px] w-full bg-white rounded-[10px] shadow-[0px_4px_29.4px_0px_rgba(0,0,0,0.1)] z-10 overflow-hidden">
                <button
                  type="button"
                  onClick={() => {
                    setPostType("quote");
                    setDropdownOpen(false);
                  }}
                  className={`w-full text-left px-[16px] py-[12px] font-['Poppins'] font-medium text-[16px] cursor-pointer transition-colors ${
                    postType === "quote"
                      ? "bg-[#c9e5ff] text-[#003566]"
                      : "text-black/80 hover:bg-[#f5f5f5]"
                  }`}
                >
                  Quote
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPostType("story");
                    setDropdownOpen(false);
                  }}
                  className={`w-full text-left px-[16px] py-[12px] font-['Poppins'] font-medium text-[16px] cursor-pointer transition-colors ${
                    postType === "story"
                      ? "bg-[#c9e5ff] text-[#003566]"
                      : "text-black/80 hover:bg-[#f5f5f5]"
                  }`}
                >
                  Story
                </button>
              </div>
            )}
          </div>

          {/* Quote Input */}
          {postType === "quote" && (
            <textarea
              value={quoteText}
              onChange={(e) => setQuoteText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your quote here"
              className="bg-white rounded-[10px] shadow-[0px_4px_29.4px_0px_rgba(0,0,0,0.1)] w-full h-[111px] p-[16px] font-['Poppins'] font-medium text-[16px] text-black resize-none outline-none border-none placeholder:text-black/60"
            />
          )}

          {/* Story Inputs */}
          {postType === "story" && (
            <>
              <textarea
                value={storyText}
                onChange={(e) => setStoryText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type in your story here"
                className="bg-white rounded-[10px] shadow-[0px_4px_29.4px_0px_rgba(0,0,0,0.1)] w-full h-[327px] p-[16px] font-['Poppins'] font-medium text-[16px] text-black resize-none outline-none border-none placeholder:text-black/60"
              />
            </>
          )}
        </div>

        {/* Attach / Attached Images — Story only */}
        {postType === "story" && (
          <>
            {attachedImages.length === 0 ? (
              /* No images yet — show "Attach Image, Video" button */
              <button
                type="button"
                onClick={handleAttachClick}
                className="flex gap-[10px] items-center justify-center p-[10px] rounded-[10px] border border-[#f77f00] shadow-[0px_4px_29.4px_0px_rgba(0,0,0,0.1)] cursor-pointer hover:bg-[#f77f00]/5 transition-colors self-start"
              >
                <div className="relative shrink-0 size-[20px]">
                  <svg className="block size-full" fill="none" viewBox="0 0 20 20">
                    <path
                      d={attachSvgPaths.p350cac80}
                      stroke="#F77F00"
                      strokeLinecap="square"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
                <span className="font-['Poppins'] font-medium text-[12px] text-[#f77f00]">
                  Attach Image, Video
                </span>
              </button>
            ) : (
              /* Has images — show thumbnails with close + add more button */
              <div className="flex gap-[24px] items-center w-full self-start">
                {attachedImages.map((img) => (
                  <div
                    key={img.id}
                    className="relative shrink-0 w-[112px] h-[113px] rounded-[20px] overflow-hidden"
                  >
                    <ImageWithFallback
                      alt="Attached"
                      className="absolute inset-0 size-full object-cover"
                      src={img.url}
                    />
                    {/* Close / Remove button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(img.id)}
                      className="absolute top-[7px] right-[9px] shrink-0 size-[13px] cursor-pointer"
                    >
                      <svg className="block size-full" fill="none" viewBox="0 0 13 13">
                        <rect fill="white" height="13" rx="6.5" width="13" />
                        <path
                          d={storySvgPaths.p11434fc0}
                          stroke="black"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="0.85"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
                {/* Add more button */}
                <button
                  type="button"
                  onClick={handleAttachClick}
                  className="relative shrink-0 size-[47px] overflow-hidden cursor-pointer hover:scale-105 transition-transform"
                >
                  <svg className="block size-full" fill="none" viewBox="0 0 47 47">
                    <circle cx="23.5" cy="23.5" r="23.5" fill="#F77F00" fillOpacity="0.2" />
                    <path
                      d="M23.5 13V34M34 23.5H13"
                      stroke="#F77F00"
                      strokeLinecap="square"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Action Buttons */}
        <div className="flex gap-[16px] items-center w-[337px]">
          <button
            type="button"
            onClick={onClose}
            className="h-[42px] flex-1 flex items-center justify-center rounded-[20px] border border-[#cc3636] cursor-pointer hover:bg-[#cc3636]/5 transition-colors"
          >
            <span className="font-['Poppins'] font-medium text-[14px] text-[#cc3636]">
              Cancel
            </span>
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`h-[42px] flex-1 flex items-center justify-center rounded-[20px] cursor-pointer transition-colors ${
              canSubmit
                ? "bg-[#003566] hover:bg-[#002a52]"
                : "bg-[#a6a6a6] cursor-not-allowed"
            }`}
          >
            <span className="font-['Poppins'] font-medium text-[14px] text-white">
              {postType === "story" ? "Post Story" : "Post"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Post Card Components ── */

interface PostCardProps {
  post: MotivationPost;
  onLike: (id: string) => void;
  onDislike: (id: string) => void;
}

function QuoteCard({ post, onLike, onDislike }: PostCardProps) {
  return (
    <div className="bg-white flex flex-col gap-[24px] items-start p-[24px] rounded-[20px] shadow-[0px_4px_50px_0px_rgba(0,0,0,0.1)] w-full">
      {/* Quote Text */}
      <div className="flex flex-col items-start w-full">
        <p className="font-['Poppins'] font-medium text-[24px] text-[#003566] w-full">
          {post.quoteText || post.title}
        </p>
      </div>

      {/* Author & Actions */}
      <div className="flex items-center justify-between w-full">
        {/* Author Info */}
        <div className="flex gap-[10px] items-center">
          <div className="relative rounded-full shrink-0 size-[55px] overflow-hidden bg-[#cacaca]">
            <ImageWithFallback
              alt={post.author}
              className="absolute inset-0 size-full object-cover"
              src={post.authorAvatar}
            />
          </div>
          <div className="flex flex-col gap-[10px]">
            <p className="font-['Poppins'] font-medium text-[14px] text-black/70 leading-[21px]">
              {post.author}
            </p>
            <p className="font-['Poppins'] font-medium text-[12px] text-black/60 leading-[21px]">
              {post.date}
            </p>
          </div>
        </div>

        {/* Like / Dislike */}
        <div className="flex gap-[24px] items-center">
          <button
            type="button"
            onClick={() => onLike(post.id)}
            className="cursor-pointer hover:scale-110 transition-transform"
          >
            <LikeIcon filled={post.userReaction === "like"} />
          </button>
          <button
            type="button"
            onClick={() => onDislike(post.id)}
            className="cursor-pointer hover:scale-110 transition-transform"
          >
            <DislikeIcon filled={post.userReaction === "dislike"} />
          </button>
        </div>
      </div>
    </div>
  );
}

function StoryCard({ post, onLike, onDislike }: PostCardProps) {
  return (
    <div className="bg-white flex flex-col gap-[24px] items-start p-[24px] rounded-[20px] shadow-[0px_4px_50px_0px_rgba(0,0,0,0.1)] w-full">
      {/* Thumbnail Image */}
      {post.thumbnail && (
        <div className="bg-[#9f9f9f] h-[127px] overflow-hidden rounded-[20px] shrink-0 w-[249px]">
          <ImageWithFallback
            alt={post.title}
            className="size-full object-cover"
            src={post.thumbnail}
          />
        </div>
      )}

      {/* Title & Description */}
      <div className="flex flex-col gap-[4px] w-full">
        <p className="font-['Poppins'] font-medium text-[24px] text-[#003566] w-full">
          {post.title}
        </p>
        {post.description && (
          <p className="font-['Poppins'] text-[16px] text-black/70 leading-[21px] w-full">
            {post.description}
          </p>
        )}
      </div>

      {/* Author & Actions */}
      <div className="flex items-center justify-between w-full">
        {/* Author Info */}
        <div className="flex gap-[10px] items-center">
          <div className="relative rounded-full shrink-0 size-[55px] overflow-hidden bg-[#cacaca]">
            <ImageWithFallback
              alt={post.author}
              className="absolute inset-0 size-full object-cover"
              src={post.authorAvatar}
            />
          </div>
          <div className="flex flex-col gap-[10px]">
            <p className="font-['Poppins'] font-medium text-[14px] text-black/70 leading-[21px]">
              {post.author}
            </p>
            <p className="font-['Poppins'] font-medium text-[12px] text-black/60 leading-[21px]">
              {post.date}
            </p>
          </div>
        </div>

        {/* Like / Dislike */}
        <div className="flex gap-[24px] items-center">
          <button
            type="button"
            onClick={() => onLike(post.id)}
            className="cursor-pointer hover:scale-110 transition-transform"
          >
            <LikeIcon filled={post.userReaction === "like"} />
          </button>
          <button
            type="button"
            onClick={() => onDislike(post.id)}
            className="cursor-pointer hover:scale-110 transition-transform"
          >
            <DislikeIcon filled={post.userReaction === "dislike"} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Component ── */

interface MotivationCornerViewProps {
  onBack: () => void;
}

export function MotivationCornerView({ onBack }: MotivationCornerViewProps) {
  const [posts, setPosts] = useState<MotivationPost[]>(initialPosts);
  const [showPostModal, setShowPostModal] = useState(false);

  const handleLike = (id: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        if (p.userReaction === "like") {
          return { ...p, likes: p.likes - 1, userReaction: null };
        }
        return {
          ...p,
          likes: p.likes + 1,
          dislikes: p.userReaction === "dislike" ? p.dislikes - 1 : p.dislikes,
          userReaction: "like" as const,
        };
      })
    );
  };

  const handleDislike = (id: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        if (p.userReaction === "dislike") {
          return { ...p, dislikes: p.dislikes - 1, userReaction: null };
        }
        return {
          ...p,
          dislikes: p.dislikes + 1,
          likes: p.userReaction === "like" ? p.likes - 1 : p.likes,
          userReaction: "dislike" as const,
        };
      })
    );
  };

  const handleNewPost = (
    post: Omit<MotivationPost, "id" | "likes" | "dislikes" | "userReaction">
  ) => {
    const newPost: MotivationPost = {
      ...post,
      id: Date.now().toString(),
      likes: 0,
      dislikes: 0,
      userReaction: null,
    };
    setPosts((prev) => [newPost, ...prev]);
    setShowPostModal(false);
  };

  return (
    <div className="w-full flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between max-w-[1082px] w-full shrink-0 mb-6">
        <div className="flex flex-col items-start pb-1.5">
          <button
            type="button"
            onClick={onBack}
            className="font-['Poppins'] text-[14px] text-black/60 cursor-pointer hover:text-black/80 transition-colors mb-0.5"
          >
            {"< Emotional Wellness"}
          </button>
          <h1 className="font-['Poppins'] font-medium text-[40px] text-black leading-tight">
            Motivation Corner
          </h1>
        </div>

        {/* Post Button */}
        <button
          type="button"
          onClick={() => setShowPostModal(true)}
          className="flex gap-[6px] h-[42px] items-center px-[16px] rounded-[10px] border-2 border-[#003566] cursor-pointer hover:bg-[#003566]/5 transition-colors"
        >
          <span className="font-['Poppins'] font-medium text-[14px] text-[#003566]">
            Post{" "}
          </span>
          <PlusIcon />
        </button>
      </div>

      {/* Posts Feed */}
      <div className="flex flex-col gap-[24px] overflow-y-auto max-w-[1082px] w-full pb-6 min-h-0 flex-1 pr-2">
        {posts.map((post) =>
          post.type === "quote" ? (
            <QuoteCard
              key={post.id}
              post={post}
              onLike={handleLike}
              onDislike={handleDislike}
            />
          ) : (
            <StoryCard
              key={post.id}
              post={post}
              onLike={handleLike}
              onDislike={handleDislike}
            />
          )
        )}
      </div>

      {/* Post Modal */}
      {showPostModal && (
        <PostModal onClose={() => setShowPostModal(false)} onPost={handleNewPost} />
      )}
    </div>
  );
}