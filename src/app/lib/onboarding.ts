export type OnboardingRole = 'student' | 'mentor';

const PENDING_ONBOARDING_KEY = 'learnova_onboarding_pending_v1';
const COMPLETED_ONBOARDING_KEY = 'learnova_onboarding_completed_v1';

interface PendingOnboardingState {
  role: OnboardingRole;
  createdAt: string;
}

type CompletedOnboardingState = Record<string, true>;

function readCompletedState(): CompletedOnboardingState {
  if (typeof window === 'undefined') return {};

  try {
    const raw = window.localStorage.getItem(COMPLETED_ONBOARDING_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function writeCompletedState(state: CompletedOnboardingState) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(COMPLETED_ONBOARDING_KEY, JSON.stringify(state));
}

export function markOnboardingPending(role: OnboardingRole) {
  if (typeof window === 'undefined') return;

  const payload: PendingOnboardingState = {
    role,
    createdAt: new Date().toISOString(),
  };

  window.localStorage.setItem(PENDING_ONBOARDING_KEY, JSON.stringify(payload));
}

export function getPendingOnboardingRole(): OnboardingRole | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(PENDING_ONBOARDING_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as PendingOnboardingState | null;
    if (parsed?.role === 'student' || parsed?.role === 'mentor') {
      return parsed.role;
    }
  } catch {
    return null;
  }

  return null;
}

export function shouldShowPendingOnboarding(userId: string | null | undefined, role: OnboardingRole): boolean {
  if (!userId) return false;

  const pendingRole = getPendingOnboardingRole();
  if (pendingRole !== role) return false;

  const completedState = readCompletedState();
  return completedState[userId] !== true;
}

export function completePendingOnboarding(userId: string | null | undefined) {
  if (typeof window === 'undefined') return;

  window.localStorage.removeItem(PENDING_ONBOARDING_KEY);

  if (!userId) return;

  const completedState = readCompletedState();
  completedState[userId] = true;
  writeCompletedState(completedState);
}
