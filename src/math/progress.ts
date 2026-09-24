import { useEffect, useState } from 'react';
import { EXERCISES, EXERCISE_BY_ID } from './exercises';
import { HOUSES, ISLANDS } from './curriculum';
import { HouseId, IslandId } from './types';

/** پیشرفت هر تمرین: بهترین ستاره (۰ تا ۳) و تعداد دفعه‌های بازی */
export interface MathProgress { stars: Record<string, number>; plays: Record<string, number> }
const KEY = 'riazi_math_progress_v1';
const EVT = 'riazi-progress-change';

export function loadMath(): MathProgress {
  try { const raw = localStorage.getItem(KEY); if (raw) { const d = JSON.parse(raw); return { stars: d.stars || {}, plays: d.plays || {} }; } } catch { /* ignore */ }
  return { stars: {}, plays: {} };
}
export function saveResult(exId: string, stars: number): MathProgress {
  const p = loadMath();
  p.stars[exId] = Math.max(p.stars[exId] || 0, stars);
  p.plays[exId] = (p.plays[exId] || 0) + 1;
  try { localStorage.setItem(KEY, JSON.stringify(p)); } catch { /* ignore */ }
  window.dispatchEvent(new CustomEvent(EVT));
  return p;
}
export function useMathProgress(): MathProgress {
  const [p, setP] = useState(loadMath);
  useEffect(() => { const on = () => setP(loadMath()); window.addEventListener(EVT, on); return () => window.removeEventListener(EVT, on); }, []);
  return p;
}

/** «یاد گرفته» = حداقل ۲ ستاره */
export const isMastered = (p: MathProgress, id: string) => (p.stars[id] || 0) >= 2;
export const prereqsMet = (p: MathProgress, id: string) => (EXERCISE_BY_ID[id]?.prerequisite || []).every(r => (p.stars[r] || 0) >= 1);

/** مسیر یادگیری سراسری: ترتیب کتاب (مفهوم عینی ← نمایش ← نماد) نه ترتیب جزیره‌ها */
export const LEARNING_PATH: string[] = [
  'count-touch', 'pattern-next', 'build-set', 'one-more-less', 'more-less', 'subitize', 'longer-shorter', 'shape-corners',
  'count-scatter', 'pattern-gap', 'build-tally', 'match-rep', 'count-on', 'add-combine', 'take-away', 'before-after', 'latin-3',
  'make-equal', 'count-forward', 'five-and', 'pattern-wrong', 'add-tally', 'take-tally', 'add-frame', 'hidden-part', 'measure-units',
  'compare-symbol', 'order-cards', 'shape-which', 'count-check', 'add-number', 'sub-number', 'chart-find', 'make-ten', 'line-add', 'line-sub',
  'pattern-unit', 'count-back', 'add-reps', 'sub-reps', 'bundle-ten', 'chart-fill', 'split-number', 'story-picture', 'latin-4',
  'pattern-number', 'build-tens', 'chart-move', 'line-expr', 'chart-skip', 'story-expression',
];

/** تمرین پیشنهادی بعدی: اولین تمرین مسیر که هنوز یاد گرفته نشده و پیش‌نیازهایش انجام شده */
export function nextRecommended(p: MathProgress): string {
  return LEARNING_PATH.find(id => !isMastered(p, id) && prereqsMet(p, id)) || LEARNING_PATH.find(id => !isMastered(p, id)) || LEARNING_PATH[0];
}

export function houseStats(p: MathProgress, house: HouseId) {
  const list = EXERCISES.filter(e => e.house === house);
  const stars = list.reduce((s, e) => s + (p.stars[e.id] || 0), 0);
  return { total: list.length, mastered: list.filter(e => isMastered(p, e.id)).length, stars, maxStars: list.length * 3 };
}
export function islandStats(p: MathProgress, island: IslandId) {
  const houses = ISLANDS.find(i => i.id === island)!.houses;
  return houses.map(h => houseStats(p, h)).reduce((a, s) => ({ total: a.total + s.total, mastered: a.mastered + s.mastered, stars: a.stars + s.stars, maxStars: a.maxStars + s.maxStars }), { total: 0, mastered: 0, stars: 0, maxStars: 0 });
}
export const islandOfExercise = (id: string): IslandId => HOUSES[EXERCISE_BY_ID[id].house].island;

if (LEARNING_PATH.length !== EXERCISES.length || EXERCISES.some(e => !LEARNING_PATH.includes(e.id))) {
  console.warn('[riazi] LEARNING_PATH با فهرست تمرین‌ها هم‌خوان نیست', EXERCISES.filter(e => !LEARNING_PATH.includes(e.id)).map(e => e.id));
}
