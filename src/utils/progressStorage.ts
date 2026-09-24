import { UserProgress } from '../types';

/** شمارنده‌های عمومی (ستاره‌ها، تمرین امروز). پیشرفت هر تمرین در src/math/progress.ts است. */
const STORAGE_KEY = 'riazi_child_progress_v1';
const getTodayString = () => new Date().toISOString().split('T')[0];
const defaultProgress = (): UserProgress => ({ activitiesDoneToday: 0, mathChallengesSolved: 0, gardenLeaves: 0, starsCount: 0, lastActiveDate: getTodayString() });

export function loadProgress(): UserProgress {
  if (typeof window === 'undefined') return defaultProgress();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress();
    const data: UserProgress = { ...defaultProgress(), ...JSON.parse(raw) };
    const today = getTodayString();
    if (data.lastActiveDate !== today) { data.activitiesDoneToday = 0; data.lastActiveDate = today; }
    return data;
  } catch { return defaultProgress(); }
}
export function saveProgress(data: UserProgress) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch { /* ignore */ } }

export function recordActivityCompleted(stars = 1): UserProgress {
  const current = loadProgress();
  current.activitiesDoneToday += 1;
  current.mathChallengesSolved += 1;
  current.starsCount += stars;
  if (current.activitiesDoneToday % 2 === 0) current.gardenLeaves += 1;
  saveProgress(current);
  return current;
}
