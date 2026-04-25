import React from 'react';
import { ImageWithFallback } from "./figma/ImageWithFallback";
import imgImage22 from "figma:asset/0e9be4322071079db03af57bb0f8639a28cb33b8.png";
import imgImage21 from "figma:asset/ea1b48400101ed37bbd08ba927f38f0586b2ad63.png";
import { Bot, Users, Sparkles, MessageCircle, Video, Star, ArrowRight, Zap } from 'lucide-react';

interface MentorSupportProps {
  onStartAiMentor?: () => void;
  onStartHumanMentor?: () => void;
}

export function MentorSupport({ onStartAiMentor, onStartHumanMentor }: MentorSupportProps) {
  return (
    <div className="w-full animate-in fade-in duration-300" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Hero Header */}
      <div className="relative rounded-[24px] overflow-hidden mb-8 md:mb-10"
        style={{ background: 'linear-gradient(135deg, #001d3d 0%, #003566 50%, #0967bd 100%)' }}>
        {/* Decorative */}
        <div className="absolute -top-20 -right-20 w-[300px] h-[300px] rounded-full opacity-[0.06]"
          style={{ background: 'radial-gradient(circle, white, transparent 70%)' }} />
        <div className="absolute bottom-0 left-0 w-[200px] h-[200px] rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, white, transparent 70%)' }} />

        <div className="relative z-10 px-6 md:px-10 py-8 md:py-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
            style={{ background: 'rgba(247,127,0,0.15)', border: '1px solid rgba(247,127,0,0.25)' }}>
            <Sparkles className="w-3.5 h-3.5 text-[#f77f00]" />
            <span className="text-[12px] font-semibold text-[#f77f00]">Personalized Learning Support</span>
          </div>
          <h1 className="text-[28px] md:text-[36px] lg:text-[40px] text-white mb-3 leading-[1.1]"
            style={{ fontFamily: "'DM Serif Display', serif", color: 'white' }}>
            Mentor Support
          </h1>
          <p className="text-[14px] md:text-[15px] text-white/50 max-w-[480px] leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.5)' }}>
            Get instant AI-powered help or connect with experienced human mentors for personalized guidance on your learning journey.
          </p>
        </div>
      </div>

      {/* Section Label */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-5 rounded-full bg-[#f77f00]" />
        <h2 className="text-[16px] font-bold text-white" style={{ color: 'white' }}>Choose Your Mentor</h2>
      </div>

      {/* Cards Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">

        {/* AI Mentor Card */}
        <div
          onClick={onStartAiMentor}
          className="group relative rounded-[22px] overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
          style={{ minHeight: 520 }}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <ImageWithFallback
              src={imgImage22}
              alt="AI Mentor"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>

          {/* Overlay */}
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(180deg, rgba(0,53,102,0.1) 0%, rgba(0,29,61,0.92) 65%)' }} />

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col justify-between p-7" style={{ minHeight: 520 }}>
            {/* Top badges */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider"
                  style={{ background: 'rgba(9,103,189,0.25)', color: '#7cc4ff', border: '1px solid rgba(9,103,189,0.3)', backdropFilter: 'blur(8px)' }}>
                  AI Powered
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)' }}>
                <Zap className="w-3.5 h-3.5 text-[#f77f00]" />
                <span className="text-[11px] font-semibold text-white">Instant</span>
              </div>
            </div>

            {/* Bottom content */}
            <div>
              <div className="flex items-center gap-3.5 mb-3">
                <div className="w-11 h-11 rounded-[14px] flex items-center justify-center"
                  style={{ background: '#0967bd' }}>
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-[24px] md:text-[28px] text-white leading-tight"
                  style={{ fontFamily: "'DM Serif Display', serif", color: 'white' }}>
                  AI Mentor
                </h3>
              </div>

              <p className="text-[14px] text-white/55 leading-relaxed mb-5 max-w-[380px]"
                style={{ color: 'rgba(255,255,255,0.55)' }}>
                Get instant answers, explanations, and study help from our AI-powered mentor — available 24/7 with voice and text modes.
              </p>

              {/* Feature pills */}
              <div className="flex flex-wrap gap-2 mb-5">
                {[
                  { icon: <MessageCircle className="w-3 h-3" />, label: "Chat Interface" },
                  { icon: <Video className="w-3 h-3" />, label: "Voice Mode" },
                  { icon: <Sparkles className="w-3 h-3" />, label: "File Upload" },
                ].map((f) => (
                  <span key={f.label} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium text-white/70"
                    style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    {f.icon}
                    {f.label}
                  </span>
                ))}
              </div>

              {/* CTA Button */}
              <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0 translate-x-2">
                <span className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-[14px] font-bold shadow-xl"
                  style={{ background: '#0967bd', color: 'white', boxShadow: '0 8px 30px rgba(9,103,189,0.4)' }}>
                  Chat with AI Mentor
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Human Mentor Card */}
        <div
          onClick={onStartHumanMentor}
          className="group relative rounded-[22px] overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
          style={{ minHeight: 520 }}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <ImageWithFallback
              src={imgImage21}
              alt="Human Mentor"
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
          </div>

          {/* Overlay */}
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(180deg, rgba(60,30,0,0.05) 0%, rgba(40,20,0,0.9) 65%)' }} />

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col justify-between p-7" style={{ minHeight: 520 }}>
            {/* Top badges */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider"
                  style={{ background: 'rgba(247,127,0,0.2)', color: '#f77f00', border: '1px solid rgba(247,127,0,0.25)', backdropFilter: 'blur(8px)' }}>
                  Verified Experts
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)' }}>
                <Star className="w-3.5 h-3.5 text-[#facc15] fill-[#facc15]" />
                <span className="text-[11px] font-semibold text-white">4.8 avg</span>
              </div>
            </div>

            {/* Bottom content */}
            <div>
              <div className="flex items-center gap-3.5 mb-3">
                <div className="w-11 h-11 rounded-[14px] flex items-center justify-center"
                  style={{ background: '#f77f00' }}>
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-[24px] md:text-[28px] text-white leading-tight"
                  style={{ fontFamily: "'DM Serif Display', serif", color: 'white' }}>
                  Human Mentor
                </h3>
              </div>

              <p className="text-[14px] text-white/55 leading-relaxed mb-5 max-w-[380px]"
                style={{ color: 'rgba(255,255,255,0.55)' }}>
                Connect with verified mentors for personalized guidance, live sessions, and progress feedback tailored to your goals.
              </p>

              {/* Feature pills */}
              <div className="flex flex-wrap gap-2 mb-5">
                {[
                  { icon: <Users className="w-3 h-3" />, label: "1:1 Sessions" },
                  { icon: <Star className="w-3 h-3" />, label: "Rated Mentors" },
                  { icon: <Video className="w-3 h-3" />, label: "Live Video" },
                ].map((f) => (
                  <span key={f.label} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium text-white/70"
                    style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    {f.icon}
                    {f.label}
                  </span>
                ))}
              </div>

              {/* CTA Button */}
              <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0 translate-x-2">
                <span className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-[14px] font-bold shadow-xl"
                  style={{ background: '#f77f00', color: 'white', boxShadow: '0 8px 30px rgba(247,127,0,0.4)' }}>
                  Find a Mentor
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Info Banner */}
      <div className="mt-8 rounded-[20px] overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #001d3d 0%, #003566 60%, #0967bd 100%)' }}>
        <div className="relative px-6 md:px-8 py-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="absolute right-0 top-0 w-[200px] h-full opacity-[0.04]"
            style={{ background: 'radial-gradient(ellipse at 100% 50%, white, transparent 70%)' }} />

          <div className="w-12 h-12 rounded-[16px] flex items-center justify-center shrink-0"
            style={{ background: 'rgba(247,127,0,0.15)', border: '1px solid rgba(247,127,0,0.2)' }}>
            <Sparkles className="w-5 h-5 text-[#f77f00]" />
          </div>
          <div className="flex-1 relative z-10">
            <p className="text-[15px] font-bold text-white mb-1" style={{ color: 'white' }}>
              Not sure which to pick?
            </p>
            <p className="text-[13px] text-white/45 leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Try the <strong className="text-[#f77f00] font-semibold">AI Mentor</strong> for quick concept checks and instant help, or book a <strong style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Human Mentor</strong> for in-depth guidance.
            </p>
          </div>
          <button
            onClick={onStartAiMentor}
            className="relative z-10 group/btn inline-flex items-center gap-2 px-6 py-3 rounded-full text-[13px] font-bold text-[#003566] bg-white hover:bg-[#f77f00] hover:text-white transition-all duration-300 shrink-0 shadow-lg hover:shadow-xl cursor-pointer"
          >
            Start with AI
            <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
