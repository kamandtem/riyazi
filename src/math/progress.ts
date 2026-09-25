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

/** مسیر یادگیری سراسری: به ترتیب صفحه‌های کتاب درسی (نه ترتیب جزیره‌ها) */
export const LEARNING_PATH: string[] = [...EXERCISES].map((e, i) => ({ e, i })).sort((a, b) => a.e.page - b.e.page || a.i - b.i).map(x => x.e.id);

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


