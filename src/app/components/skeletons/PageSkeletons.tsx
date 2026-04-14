import React from 'react';
import { Skeleton, SkeletonList, SkeletonGrid, SkeletonAbstractCard, SkeletonHeader } from './SkeletonLoader';

/* ── Authentication Pages ── */
export function SkeletonAuthPage() {
  return (
    <div className="flex h-screen">
      <div className="hidden lg:flex flex-1 flex-col gap-8 p-12 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="space-y-3">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <Skeleton className="aspect-video w-full rounded-2xl" />
        <div className="grid grid-cols-3 gap-4 mt-auto">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-6">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
          <div className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Dashboard ── */
export function SkeletonDashboardLayout() {
  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <div className="w-64 border-r border-slate-200 dark:border-slate-700 p-4 space-y-4">
        <Skeleton className="h-8 w-3/4 rounded-lg" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-10 w-full rounded-lg" />
          ))}
        </div>
      </div>
      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        <div className="space-y-8">
          <SkeletonHeader />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 rounded-lg" />
            ))}
          </div>
          <Skeleton className="h-96 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

/* ── Study Room / Focus Mode ── */
export function SkeletonFocusMode() {
  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      {/* Left Sidebar */}
      <div className="w-80 border-r border-slate-200 dark:border-slate-700 p-6 space-y-6">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-40 rounded-2xl" />
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-12 rounded-lg" />
          ))}
        </div>
        <div className="mt-auto space-y-3">
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-32 rounded-lg" />
        </div>
      </div>
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="border-b border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <SkeletonHeader />
            <Skeleton className="h-10 w-32 rounded-lg" />
          </div>
        </div>
        <div className="flex-1 p-8 space-y-6">
          <Skeleton className="h-96 rounded-2xl" />
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Chat Pages ── */
export function SkeletonChatPage() {
  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <div className="w-80 border-r border-slate-200 dark:border-slate-700 p-4 space-y-4">
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-10 w-full rounded-lg" />
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-10 w-full rounded-lg" />
          ))}
        </div>
      </div>
      {/* Main Chat */}
      <div className="flex-1 flex flex-col">
        <div className="border-b border-slate-200 dark:border-slate-700 p-4">
          <SkeletonHeader />
        </div>
        <div className="flex-1 p-6 space-y-4 overflow-y-auto">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
              <Skeleton className={`h-12 w-1/2 rounded-lg ${i % 2 === 0 ? 'ml-12' : 'mr-12'}`} />
            </div>
          ))}
        </div>
        <div className="border-t border-slate-200 dark:border-slate-700 p-4 space-y-3">
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

/* ── Mentor Support ── */
export function SkeletonMentorSupport() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 p-8 space-y-4">
        <div className="flex gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
          </div>
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <SkeletonAbstractCard key={i} />
        ))}
      </div>
    </div>
  );
}

/* ── Community / Wellness ── */
export function SkeletonWellnessResources() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-10 w-1/2" />
        </div>
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-4 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <Skeleton className="h-40 w-40 rounded-lg shrink-0" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <div className="flex gap-3 mt-auto">
                <Skeleton className="h-8 w-16 rounded-lg" />
                <Skeleton className="h-8 w-16 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Mood Check-in ── */
export function SkeletonMoodCheckIn() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 p-8 space-y-4">
        <Skeleton className="h-8 w-1/2" />
        <div className="grid grid-cols-5 gap-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-20 w-full rounded-lg" />
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>
    </div>
  );
}

/* ── Productivity Tools ── */
export function SkeletonProductivityTools() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <Skeleton className="h-6 w-1/2" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Profile Settings ── */
export function SkeletonProfileSettings() {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-6">
        <div className="flex items-center gap-6">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
          </div>
          <Skeleton className="h-10 w-24 rounded-lg" />
        </div>
        <div className="border-t border-slate-200 dark:border-slate-700 pt-6 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── World Chat ── */
export function SkeletonWorldChat() {
  return (
    <div className="flex h-[600px] gap-4">
      {/* Chat List */}
      <div className="w-64 border-r border-slate-200 dark:border-slate-700 space-y-2 overflow-y-auto">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-16 rounded-lg" />
        ))}
      </div>
      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="border-b border-slate-200 dark:border-slate-700 p-4">
          <SkeletonHeader />
        </div>
        <div className="flex-1 p-4 space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
              <Skeleton className={`h-12 w-1/2 rounded-lg ${i % 2 === 0 ? 'ml-12' : 'mr-12'}`} />
            </div>
          ))}
        </div>
        <div className="border-t border-slate-200 dark:border-slate-700 p-4 flex gap-2">
          <Skeleton className="h-10 flex-1 rounded-lg" />
          <Skeleton className="h-10 w-12 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

/* ── Motivation Corner ── */
export function SkeletonMotivationCorner() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-4 min-h-64">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <div className="mt-auto flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Room Link Entry ── */
export function SkeletonRoomEntry() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md space-y-8 p-8 rounded-2xl border border-slate-200 dark:border-slate-700">
        <div className="text-center space-y-4">
          <Skeleton className="h-16 w-16 rounded-full mx-auto" />
          <Skeleton className="h-8 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-full mx-auto" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}

/* ── Onboarding ── */
export function SkeletonOnboarding() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="w-full max-w-2xl space-y-8 p-8">
        <div className="flex justify-between mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-2 flex-1 rounded-full mx-2" />
          ))}
        </div>
        <div className="space-y-6">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <div className="grid grid-cols-2 gap-4 mt-8">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24 rounded-lg" />
            ))}
          </div>
        </div>
        <div className="flex gap-4 mt-8">
          <Skeleton className="h-10 flex-1 rounded-lg" />
          <Skeleton className="h-10 flex-1 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
