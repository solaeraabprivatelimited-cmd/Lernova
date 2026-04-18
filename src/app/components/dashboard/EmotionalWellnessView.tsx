import React, { useState } from "react";
import { MoodCheckInView } from "./MoodCheckInView";
import { WellnessResourcesView } from "./WellnessResourcesView";
import { WorldChatView } from "./WorldChatView";
import { MotivationCornerView } from "./MotivationCornerView";
import { SkeletonWellnessResources } from "../skeletons/PageSkeletons";
import { Heart, BookOpen, MessageCircle, Sparkles, ArrowRight, Shield, Brain, Lightbulb, TrendingUp } from "lucide-react";

type SubView = "home" | "mood-check-in" | "wellness-resources" | "world-chat" | "motivation-corner" | "ai-advisor";

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
  if (subView === "ai-advisor") return <AIWellnessAdvisor onBack={() => setSubView("home")} />;

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
        <div className="w-1 h-5 rounded-full bg-orange-500" />
        <h2 className="text-[16px] font-bold text-slate-900 dark:text-white">Explore Wellness</h2>
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
          icon={<Brain className="w-5 h-5 text-white" />}
          title="AI Wellness Advisor"
          description="Get personalized wellness recommendations powered by AI based on your mood patterns."
          cta="Consult AI Advisor"
          gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          iconBg="rgba(255,255,255,0.2)"
          onClick={() => setSubView("ai-advisor")}
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

interface AIWellnessAdvisorProps {
  onBack: () => void;
}

import { ArrowLeft } from 'lucide-react';

function AIWellnessAdvisor({ onBack }: AIWellnessAdvisorProps) {
  const [recommendations] = React.useState([
    {
      id: 1,
      title: "Practice Mindfulness Meditation",
      description: "Based on your recent stress levels, daily 10-minute meditation can help reduce anxiety by 30%.",
      icon: <Brain className="w-6 h-6" />,
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      actionText: "Start Session"
    },
    {
      id: 2,
      title: "Increase Physical Activity",
      description: "Your mood data shows low energy. 30 minutes of exercise 3x/week can boost mood significantly.",
      icon: <TrendingUp className="w-6 h-6" />,
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      actionText: "View Workouts"
    },
    {
      id: 3,
      title: "Sleep Optimization Plan",
      description: "Establishing a consistent sleep schedule can improve your overall wellness score by 25%.",
      icon: <Heart className="w-6 h-6" />,
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      actionText: "Create Plan"
    },
    {
      id: 4,
      title: "Social Connection Goals",
      description: "Regular social interaction has shown to boost your mood positively. Connect with others today!",
      icon: <MessageCircle className="w-6 h-6" />,
      gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      actionText: "Find Community"
    }
  ]);

  const [wellnessScore] = React.useState(72);
  const [moodTrend] = React.useState("improving");

  return (
    <div className="w-full bg-white dark:bg-slate-950" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Header */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 mb-6 transition-colors group cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-[13px] font-medium">Emotional Wellness</span>
      </button>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-[14px] flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-[28px] md:text-[34px] text-slate-900 dark:text-white" style={{ fontFamily: "'DM Serif Display', serif" }}>
            AI Wellness Advisor
          </h1>
          <p className="text-[13px] text-slate-600 dark:text-slate-400">Personalized recommendations based on your wellness data</p>
        </div>
      </div>

      {/* Wellness Score Card */}
      <div className="bg-white dark:bg-slate-800 rounded-[20px] border border-slate-200 dark:border-slate-700 p-6 mb-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4">
            <div className="relative w-24 h-24">
              <svg className="w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="48" cy="48" r="40" fill="none" stroke="currentColor" strokeWidth="4" className="text-slate-200 dark:text-slate-700" />
                <circle
                  cx="48" cy="48" r="40" fill="none" stroke="#667eea"
                  strokeWidth="4" strokeDasharray={`${(wellnessScore / 100) * 251} 251`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-[20px] font-bold text-slate-900 dark:text-white">{wellnessScore}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Score</p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 uppercase font-semibold">Wellness Index</p>
              <p className="text-[13px] font-semibold text-slate-900 dark:text-white mt-1">Good</p>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-2">Keep up the momentum!</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-full">
              <p className="text-[11px] text-slate-600 dark:text-slate-400 uppercase font-semibold mb-3">Mood Trend</p>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <span className="text-[15px] font-bold text-slate-900 dark:text-white capitalize">{moodTrend}</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-2">Your mood has been improving over the last 7 days</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-full">
              <p className="text-[11px] text-slate-600 dark:text-slate-400 uppercase font-semibold mb-3">Recent Check-ins</p>
              <p className="text-[24px] font-bold text-slate-900 dark:text-white">12</p>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-2">This month</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-5 rounded-full bg-indigo-500" />
          <h2 className="text-[16px] font-bold text-slate-900 dark:text-white">AI-Powered Recommendations</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className="bg-white dark:bg-slate-800 rounded-[18px] border border-slate-200 dark:border-slate-700 p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
            >
              <div className="flex items-start gap-4 mb-4">
                <div
                  className="w-12 h-12 rounded-[12px] flex items-center justify-center flex-shrink-0"
                  style={{ background: rec.gradient }}
                >
                  <div className="text-white">{rec.icon}</div>
                </div>
                <div className="flex-1">
                  <h3 className="text-[15px] font-bold text-slate-900 dark:text-white mb-1">{rec.title}</h3>
                  <p className="text-[12px] text-slate-600 dark:text-slate-400 leading-relaxed">{rec.description}</p>
                </div>
              </div>
              <button
                className="w-full px-4 py-2.5 rounded-[12px] text-[12px] font-semibold transition-all cursor-pointer bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-700/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/30"
              >
                {rec.actionText}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Tips */}
      <div className="bg-slate-50 dark:bg-slate-800 rounded-[20px] border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Lightbulb className="w-5 h-5 text-orange-500" />
          <h3 className="text-[15px] font-bold text-slate-900 dark:text-white">Quick Wellness Tips</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-white dark:bg-slate-700 rounded-[12px] border border-slate-200 dark:border-slate-600">
            <span className="text-[12px] font-bold text-indigo-600 dark:text-indigo-400 flex-shrink-0">1</span>
            <p className="text-[12px] text-slate-700 dark:text-slate-300">Start your day with 5 minutes of deep breathing to calm your nervous system.</p>
          </div>
          <div className="flex items-start gap-3 p-3 bg-white dark:bg-slate-700 rounded-[12px] border border-slate-200 dark:border-slate-600">
            <span className="text-[12px] font-bold text-indigo-600 dark:text-indigo-400 flex-shrink-0">2</span>
            <p className="text-[12px] text-slate-700 dark:text-slate-300">Take regular breaks during study sessions (5 min per 25 min) to maintain focus and mood.</p>
          </div>
          <div className="flex items-start gap-3 p-3 bg-white dark:bg-slate-700 rounded-[12px] border border-slate-200 dark:border-slate-600">
            <span className="text-[12px] font-bold text-indigo-600 dark:text-indigo-400 flex-shrink-0">3</span>
            <p className="text-[12px] text-slate-700 dark:text-slate-300">Connect with someone daily. Share your feelings and listen to others - it improves well-being.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
