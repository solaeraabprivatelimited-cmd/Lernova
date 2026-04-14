import React, { useState } from "react";
import { MoodCheckInView } from "./MoodCheckInView";
import { WellnessResourcesView } from "./WellnessResourcesView";
import { WorldChatView } from "./WorldChatView";
import { MotivationCornerView } from "./MotivationCornerView";
import { SkeletonWellnessResources } from "../skeletons/PageSkeletons";
import { Heart, BookOpen, MessageCircle, Sparkles, ArrowRight, Shield } from "lucide-react";

type SubView = "home" | "mood-check-in" | "wellness-resources" | "world-chat" | "motivation-corner";

interface WellnessCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  cta: string;
  gradient: string;
  iconBg: string;
  onClick?: () => void;
}

function WellnessCard({ icon, title, description, cta, gradient, iconBg, onClick }: WellnessCardProps) {
  return (
    <div
      className="group relative rounded-[22px] overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
      onClick={onClick}
      style={{ background: gradient, minHeight: 260 }}
    >
      {/* Decorative glow */}
      <div className="absolute -top-16 -right-16 w-[180px] h-[180px] rounded-full opacity-[0.08] group-hover:opacity-[0.15] transition-opacity duration-500"
        style={{ background: 'radial-gradient(circle, white, transparent 70%)' }} />
      <div className="absolute bottom-0 left-0 right-0 h-[120px] opacity-[0.06]"
        style={{ background: 'linear-gradient(180deg, transparent, white)' }} />

      <div className="relative z-10 h-full flex flex-col justify-between p-6" style={{ minHeight: 260 }}>
        <div>
          <div className="w-12 h-12 rounded-[16px] flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
            style={{ background: iconBg }}>
            {icon}
          </div>
          <h3 className="text-[22px] font-bold text-white mb-2 leading-tight"
            style={{ fontFamily: "'DM Serif Display', serif" }}>
            {title}
          </h3>
          <p className="text-[13px] text-white/60 leading-relaxed max-w-[280px]">
            {description}
          </p>
        </div>

        <div className="flex items-center gap-2 group/cta">
          <span className="text-[13px] font-semibold text-white/80 group-hover/cta:text-white transition-colors">{cta}</span>
          <ArrowRight className="w-4 h-4 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </div>
  );
}

export function EmotionalWellnessView() {
  const [subView, setSubView] = useState<SubView>("home");
  const [isLoading, setIsLoading] = useState(false);

  // Show skeleton while loading sub-views
  if (isLoading) {
    return <SkeletonWellnessResources />;
  }

  if (subView === "mood-check-in") return <MoodCheckInView onBack={() => setSubView("home")} />;
  if (subView === "wellness-resources") return <WellnessResourcesView onBack={() => setSubView("home")} />;
  if (subView === "world-chat") return <WorldChatView onBack={() => setSubView("home")} />;
  if (subView === "motivation-corner") return <MotivationCornerView onBack={() => setSubView("home")} />;

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="animate-in fade-in duration-300">
      {/* Hero Header */}
      <div className="relative rounded-[24px] overflow-hidden mb-8"
        style={{ background: 'linear-gradient(135deg, #001d3d 0%, #003566 40%, #0967bd 100%)' }}>
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="absolute -top-20 -right-20 w-[300px] h-[300px] rounded-full opacity-[0.06]"
          style={{ background: 'radial-gradient(circle, white, transparent 70%)' }} />

        <div className="relative z-10 px-6 md:px-10 py-8 md:py-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
            style={{ background: 'rgba(247,127,0,0.15)', border: '1px solid rgba(247,127,0,0.25)' }}>
            <Shield className="w-3.5 h-3.5 text-[#f77f00]" />
            <span className="text-[12px] font-semibold text-[#f77f00]">Safe Space</span>
          </div>
          <h1 className="text-[28px] md:text-[36px] lg:text-[40px] text-white mb-3 leading-[1.1]"
            style={{ fontFamily: "'DM Serif Display', serif" }}>
            Emotional Wellness
          </h1>
          <p className="text-[14px] text-white/45 max-w-[460px] leading-relaxed">
            Your mental health matters. Check in on your mood, find resources, connect with others, and stay inspired.
          </p>
        </div>
      </div>

      {/* Section Label */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-5 rounded-full bg-[#f77f00]" />
        <h2 className="text-[16px] font-bold text-[#003566]">Explore Wellness</h2>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <WellnessCard
          icon={<Heart className="w-5 h-5 text-white" />}
          title="Mood Check-In"
          description="Share your feelings and let AI organize, track, and understand your mood journey."
          cta="Start Check-In"
          gradient="linear-gradient(135deg, #b91d73 0%, #f953c6 50%, #ff5858 100%)"
          iconBg="rgba(255,255,255,0.2)"
          onClick={() => setSubView("mood-check-in")}
        />
        <WellnessCard
          icon={<BookOpen className="w-5 h-5 text-white" />}
          title="Wellness Resources"
          description="Access articles, guided meditations, videos, and inspiring stories."
          cta="Explore Resources"
          gradient="linear-gradient(135deg, #0052d4 0%, #4364f7 50%, #6fb1fc 100%)"
          iconBg="rgba(255,255,255,0.2)"
          onClick={() => setSubView("wellness-resources")}
        />
        <WellnessCard
          icon={<MessageCircle className="w-5 h-5 text-white" />}
          title="World Chat"
          description="Connect, share, and support each other in a global community."
          cta="Join Conversation"
          gradient="linear-gradient(135deg, #11998e 0%, #38ef7d 100%)"
          iconBg="rgba(255,255,255,0.2)"
          onClick={() => setSubView("world-chat")}
        />
        <WellnessCard
          icon={<Sparkles className="w-5 h-5 text-white" />}
          title="Motivation Corner"
          description="Get inspired with uplifting quotes and real success stories from the community."
          cta="Find Inspiration"
          gradient="linear-gradient(135deg, #7f00ff 0%, #e100ff 100%)"
          iconBg="rgba(255,255,255,0.2)"
          onClick={() => setSubView("motivation-corner")}
        />
      </div>
    </div>
  );
}
