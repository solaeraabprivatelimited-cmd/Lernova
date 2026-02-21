import React, { useState } from "react";
import svgPaths from "@/imports/svg-6wktpch2pb";
import { MoodCheckInView } from "./MoodCheckInView";
import { WellnessResourcesView } from "./WellnessResourcesView";
import { WorldChatView } from "./WorldChatView";
import { MotivationCornerView } from "./MotivationCornerView";

/* ── SVG Icon Components (from Figma import) ── */

function HeartIcon() {
  return (
    <div className="relative shrink-0 size-[46px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 46 46">
        <path
          d={svgPaths.pf3ff700}
          stroke="white"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="4"
        />
      </svg>
    </div>
  );
}

function BookIcon() {
  return (
    <div className="relative shrink-0 size-[46px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 46 46">
        <path
          d={svgPaths.p2bf7e800}
          stroke="white"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
        />
      </svg>
    </div>
  );
}

function ChatIcon() {
  return (
    <div className="relative shrink-0 size-[46px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 46 46">
        <path d={svgPaths.p232f3d30} fill="white" />
      </svg>
    </div>
  );
}

function StarsIcon() {
  return (
    <div className="relative shrink-0 size-[46px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 46 46">
        <path
          d={svgPaths.p2a8f0980}
          stroke="white"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}

function ArrowRightIcon() {
  return (
    <div className="relative size-[22px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 22">
        <path
          clipRule="evenodd"
          d={svgPaths.p16746080}
          fill="white"
          fillRule="evenodd"
        />
      </svg>
    </div>
  );
}

/* ── Wellness Card Component ── */

interface WellnessCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  cta: string;
  gradient: string;
  onClick?: () => void;
}

function WellnessCard({ icon, title, description, cta, gradient, onClick }: WellnessCardProps) {
  return (
    <div
      className={`${gradient} flex flex-col items-start justify-between overflow-hidden p-6 rounded-[20px] h-[308px] w-full cursor-pointer transition-transform hover:scale-[1.01] hover:shadow-lg`}
      onClick={onClick}
    >
      {/* Top section */}
      <div className="flex flex-col gap-1.5 w-full">
        <div className="flex gap-1.5 items-center w-full">
          {icon}
          <p className="font-['Poppins'] font-semibold text-[24px] text-white">{title}</p>
        </div>
        <p className="font-['Poppins'] font-medium text-[16px] text-white w-full">
          {description}
        </p>
      </div>

      {/* CTA at bottom */}
      <div className="flex gap-1.5 items-center">
        <p className="font-['Poppins'] font-medium text-[14px] text-white">{cta}</p>
        <div className="flex items-center justify-center size-[22px] rotate-90">
          <ArrowRightIcon />
        </div>
      </div>
    </div>
  );
}

/* ── Main Emotional Wellness View ── */

type SubView = "home" | "mood-check-in" | "wellness-resources" | "world-chat" | "motivation-corner";

export function EmotionalWellnessView() {
  const [subView, setSubView] = useState<SubView>("home");

  if (subView === "mood-check-in") {
    return <MoodCheckInView onBack={() => setSubView("home")} />;
  }

  if (subView === "wellness-resources") {
    return <WellnessResourcesView onBack={() => setSubView("home")} />;
  }

  if (subView === "world-chat") {
    return <WorldChatView onBack={() => setSubView("home")} />;
  }

  if (subView === "motivation-corner") {
    return <MotivationCornerView onBack={() => setSubView("home")} />;
  }

  return (
    <div className="w-full">
      {/* Heading */}
      <div className="flex flex-col items-start pb-1.5 mb-6">
        <h1 className="font-['Poppins'] font-medium text-[40px] text-black">
          Emotional Wellness
        </h1>
        <p className="font-['Poppins'] text-[14px] text-black/60">
          Everything you need to manage your mental health journey
        </p>
      </div>

      {/* Cards Grid - 2x2 */}
      <div className="flex flex-col gap-[25px] w-full max-w-[1082px]">
        {/* Row 1 */}
        <div className="flex gap-10 w-full">
          <div className="flex-1 min-w-0">
            <WellnessCard
              icon={<HeartIcon />}
              title="Mood Check-In"
              description="Share your feelings and let AI organize, track, and understand your mood journey."
              cta="Start Check-In"
              gradient="bg-gradient-to-r from-[#f953c6] via-[#b91d73] to-[#ff5858]"
              onClick={() => setSubView("mood-check-in")}
            />
          </div>
          <div className="flex-1 min-w-0">
            <WellnessCard
              icon={<BookIcon />}
              title="Wellness Resources"
              description="Access articles, videos and inspiring stories."
              cta="Explore Resources"
              gradient="bg-gradient-to-r from-[#00c6ff] to-[#0072ff]"
              onClick={() => setSubView("wellness-resources")}
            />
          </div>
        </div>

        {/* Row 2 */}
        <div className="flex gap-10 w-full">
          <div className="flex-1 min-w-0">
            <WellnessCard
              icon={<ChatIcon />}
              title="World Chat"
              description="Connect, share, and support each other worldwide."
              cta="Join Conversation"
              gradient="bg-gradient-to-r from-[#56ab2f] to-[#a8e063]"
              onClick={() => setSubView("world-chat")}
            />
          </div>
          <div className="flex-1 min-w-0">
            <WellnessCard
              icon={<StarsIcon />}
              title="Motivation Corner"
              description="Get inspired with uplifting quotes and real success stories."
              cta="Find Inspiration"
              gradient="bg-gradient-to-r from-[#7f00ff] to-[#e100ff]"
              onClick={() => setSubView("motivation-corner")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}