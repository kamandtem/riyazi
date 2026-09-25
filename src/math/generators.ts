import { ExerciseDef, Round } from './types';
import { nearOptions, pick, rand, range, shuffle, toFa, numWord } from '../utils/fa';
import { ANIMALS, FRUITS, TOYS } from './exercises';

/**
 * سازندهٔ دورها: برای هر type یک تابع که از params تمرین یک Round تازه می‌سازد.
 * «i» شمارهٔ دور است تا دورهای اول آسان‌تر باشند (سخت شدنِ تدریجی، نه ناگهانی).
 */
type Gen = (def: ExerciseDef, i: number, total: number) => Round;

/** سقف تدریجی: دور اول نزدیک به min، دور آخر = max */
const ramp = (min: number, max: number, i: number, total: number) => {
  const t = total <= 1 ? 1 : i / (total - 1);
  return Math.max(min, Math.round(min + (max - min) * (0.45 + 0.55 * t)));
};
/** بالا رفتنِ پلّه‌ای: دور اول ساده‌ترین، دور آخر سخت‌ترین (با کمی تنوع) */
export const stepUp = (min: number, max: number, i: number, total: number) => {
  const t = total <= 1 ? 1 : i / (total - 1);
  const cap = Math.round(min + (max - min) * t);
  return rand(Math.max(min, cap - 1), Math.max(min, cap));
};
/** نوع جواب: پیش از تم ۷ کتاب پیش‌فرض «گفتن» است */
export const ansMode = (def: ExerciseDef): string => def.params.answer || (def.numerals ? 'numeral' : 'oral');
const ansOptions = (n: number, def: ExerciseDef) => {
  const m = ansMode(def);
  if (m === 'hands' || m === 'dots') return nearOptions(n, 3, n === 0 ? 0 : 1, n > 5 ? 10 : 5);
  return nearOptions(n, 3, 0, 20);
};
const obj = (def: ExerciseDef, fallback = FRUITS) => pick(def.objects?.length ? def.objects : fallback);
const scatter = (n: number) => {
  // جای تصادفی بدون هم‌پوشانی (درصدی از قاب)
  const pts: { x: number; y: number }[] = [];
  let guard = 0;
  while (pts.length < n && guard++ < 2000) {
    const p = { x: rand(8, 92), y: rand(10, 88) };
    if (pts.every(q => Math.hypot(q.x - p.x, (q.y - p.y) * 0.8) > 17)) pts.push(p);
  }
  while (pts.length < n) pts.push({ x: rand(8, 92), y: rand(10, 88) });
  return pts;
};

/* ---------- الگوها ---------- */
const COLORS = ['#FF5A5F', '#3FA7F5', '#FFC83D', '#39C47A', '#A46BF5', '#FF8A3D'];
const SHAPES = ['circle', 'triangle', 'square', 'star', 'heart'];
const PICS = ['🍎', '🍌', '🐟', '🌸', '⭐', '🚗', '🐞', '🎈'];
const MOTIONS = ['👏', '🦶', '🙌', '👆'];
export const MOTION_NAMES: Record<string, string> = { '👏': 'دست بزن', '🦶': 'پا بکوب', '🙌': 'دست‌ها بالا', '👆': 'انگشت بالا' };
export type PatternToken = { kind: string; v: string; c?: string };
function tokensFor(kind: string, count: number): PatternToken[] {
  if (kind === 'color') return shuffle(COLORS).slice(0, count).map(c => ({ kind, v: 'circle', c }));
  if (kind === 'shape') { const c = pick(COLORS); return shuffle(SHAPES).slice(0, count).map(v => ({ kind, v, c })); }
  if (kind === 'motion') return shuffle(MOTIONS).slice(0, count).map(v => ({ kind, v }));
  return shuffle(PICS).slice(0, count).map(v => ({ kind, v }));
}
const tokenKey = (t: PatternToken) => `${t.v}|${t.c || ''}`;

/* ---------- عبارت‌ها ---------- */
const fa = toFa;

export const GENERATORS: Record<string, Gen> = {
  tapCount(def, i, total) {
    const { min, max, layout } = def.params;
    const n = stepUp(min, max, i, total);
    return { question: 'هر کدام را لمس کن و بلند بشمار.', objects: [obj(def)], answer: n, options: ansOptions(n, def),
      data: { n, layout, pos: layout === 'scatter' ? scatter(n) : null } };
  },
  subitize(def, i, total) {
    const n = stepUp(def.params.min, def.params.max, i, total);
    const pattern = def.params.max <= 4 ? pick(['dice', 'objects']) : i % 2 === 0 ? 'dice' : 'frame';
    return { question: 'خوب نگاه کن! چند تا بود؟', objects: [obj(def, ALL_OBJ)], answer: n, options: ansOptions(n, def), data: { n, pattern, flashMs: def.params.flashMs } };
  },
  countCheck(def) {
    const n = rand(def.params.min, def.params.max);
    const kind = pick(['ok', 'skip', 'double', 'jump'] as const);
    const badges: number[][] = range(1, n).map(k => [k]);
    let claimed = n; let bad: number | null = null;
    if (kind === 'skip') { bad = rand(1, n - 2); badges[bad] = []; for (let k = bad + 1; k < n; k++) badges[k] = [k]; claimed = n - 1; }
    if (kind === 'double') { bad = rand(1, n - 2); badges[bad] = [bad + 1, bad + 2]; for (let k = bad + 1; k < n; k++) badges[k] = [k + 2]; claimed = n + 1; }
    if (kind === 'jump') { bad = rand(1, n - 1); for (let k = bad; k < n; k++) badges[k] = [k + 2]; claimed = n + 1; }
    return { question: `خرگوش شمرد و گفت: «${fa(claimed)} تا». درست شمرد؟`, objects: [obj(def)], answer: bad === null ? 'ok' : bad,
      data: { n, badges, claimed, kind, bad } };
  },
  countOn(def) {
    const s = rand(def.params.start[0], def.params.start[1]);
    const k = rand(def.params.add[0], def.params.add[1]);
    return { question: `توی جعبه ${fa(s)} تا هست. ${fa(k)} تای دیگر هم آمد. از ${fa(s)} ادامه بشمار!`, objects: [obj(def, TOYS)], answer: s + k,
      options: nearOptions(s + k, 3, 1, 20), data: { s, k } };
  },
  buildSet(def, i, total) {
    const { min, max, rep, target } = def.params;
    const n = stepUp(min, max, i, total);
    if (target === 'objects') return { question: rep === 'tally' ? 'به تعداد حیوان‌ها چوب‌خط بکش.' : 'به همین تعداد بگذار.', objects: [obj(def)], answer: n, data: { n, rep, target } };
    return { question: rep === 'tally' ? `${fa(n)} تا چوب‌خط بکش.` : `${fa(n)} تا بگذار توی بشقاب.`, speak: rep === 'tally' ? `${numWord(n)} تا چوب‌خط بکش` : `${numWord(n)} تا بگذار توی بشقاب`,
      objects: [obj(def)], answer: n, data: { n, rep } };
  },
  matchRep(def, i, total) {
    const { min, max, dir, reps, fiveStructure } = def.params;
    const n = rand(min, ramp(min, max, i, total));
    if (dir === 'toNumber') {
      return { question: fiveStructure ? 'پنج تا قرمز و چند تا آبی؟ همه چند تا؟' : 'این چه عددی است؟', answer: n, options: nearOptions(n, 3, 0, 20),
        data: { n, rep: pick(reps), fiveStructure } };
    }
    const vals = shuffle([n, ...nearOptions(n, 4, Math.max(1, min), max).filter(v => v !== n).slice(0, 2)]);
    const repsFor = shuffle(reps as string[]);
    const cards = vals.map((v, k) => ({ v, rep: repsFor[k % repsFor.length] }));
    return { question: `کدام کارت ${fa(n)} را نشان می‌دهد؟`, speak: `کدام کارت ${numWord(n)} را نشان می‌دهد؟`, objects: [obj(def)], answer: cards.findIndex(c => c.v === n), data: { n, cards } };
  },
  oneMoreLess(def, i, total) {
    const ops: number[] = def.params.ops || [1, -1];
    let op = pick(ops);
    const n = Math.max(op < 0 ? -op : 1, stepUp(def.params.min, def.params.max, i, total));
    if (n + op < 0) op = Math.abs(op);
    const r = n + op;
    const q = op === 1 ? 'یکی دیگر آمد! حالا چند تا شد؟' : op === -1 ? 'یکی رفت! حالا چند تا ماند؟' : op > 0 ? 'دو تای دیگر آمدند! حالا چند تا شد؟' : 'دو تا رفتند! حالا چند تا ماند؟';
    return { question: q, objects: [obj(def, ANIMALS)], answer: r, options: ansOptions(r, def), data: { n, op } };
  },
  sequenceGap(def, i, total) {
    const p = def.params;
    if (p.mode === 'neighbors') {
      const n = rand(Math.max(p.min, 1), ramp(5, p.max, i, total));
      const which = pick(['before', 'after', 'both'] as const);
      const seq = [n - 1, n, n + 1];
      const gaps = which === 'before' ? [0] : which === 'after' ? [2] : [0, 2];
      return { question: which === 'before' ? `عدد قبل از ${fa(n)} چیست؟` : which === 'after' ? `عدد بعد از ${fa(n)} چیست؟` : `قبل و بعد ${fa(n)} را پیدا کن.`,
        answer: gaps.map(g => seq[g]), data: { seq, gaps, theme: p.theme, step: 1 } };
    }
    const step = p.steps ? pick(p.steps as number[]) : p.step;
    const dir = p.dir;
    const len = p.len;
    const span = step * (len - 1);
    let start: number;
    if (dir > 0) { const hi = Math.max(p.min, Math.min(p.max - span, ramp(p.min, p.max - span, i, total))); start = step > 1 ? step * rand(0, Math.floor(hi / step)) : rand(p.min, hi); }
    else start = rand(p.min + span, Math.max(p.min + span, Math.min(p.max, ramp(p.min + span, p.max, i, total))));
    const seq = range(0, len - 1).map(k => start + dir * step * k);
    const gapCount = p.gaps;
    const gaps = shuffle(range(1, len - 1)).slice(0, gapCount).sort((a, b) => a - b);
    return { question: dir < 0 ? 'شمارش معکوس! جاهای خالی را پر کن.' : step > 1 ? `${fa(step)}تا ${fa(step)}تا جلو می‌رود. جای خالی چیست؟` : 'جاهای خالی را پر کن.',
      answer: gaps.map(g => seq[g]), data: { seq, gaps, theme: p.theme, step, dir, showJumps: p.showJumps } };
  },
  orderCards(def, i, total) {
    const count = rand(def.params.count[0], ramp(def.params.count[0], def.params.count[1], i, total));
    const pool = shuffle(range(def.params.min, ramp(8, def.params.max, i, total))).slice(0, count);
    return { question: 'عددها را از کوچک به بزرگ بچین.', answer: [...pool].sort((a, b) => a - b), data: { cards: pool } };
  },
  compareGroups(def, i) {
    const { min, max, equalFrom } = def.params;
    let a = rand(min, max), b = rand(min, max);
    const eq = i >= equalFrom && Math.random() < 0.3;
    if (eq) b = a; else while (b === a) b = rand(min, max);
    const ask = pick(['more', 'less'] as const);
    const [ea, eb] = shuffle(def.objects || FRUITS).slice(0, 2);
    // دستهٔ کم‌تر گاهی بزرگ‌تر کشیده می‌شود تا کودک به اندازهٔ ظاهری تکیه نکند
    const ans = a === b ? 'equal' : (ask === 'more') === (a > b) ? 'a' : 'b';
    return { question: ask === 'more' ? 'کدام دسته بیشتر است؟' : 'کدام دسته کمتر است؟', answer: ans, options: ['a', 'b', ...(i >= equalFrom ? ['equal'] : [])],
      data: { a, b, ea, eb, ask, spreadSmall: Math.random() < 0.5 } };
  },
  makeEqual(def) {
    const n = rand(def.params.min, def.params.max);
    let m = rand(0, def.params.max + 1); while (m === n) m = rand(0, def.params.max + 1);
    const [ea, eb] = shuffle(def.objects || FRUITS).slice(0, 2);
    return { question: 'دستهٔ پایین را با دستهٔ بالا مساوی کن.', answer: n, data: { n, m, ea, eb } };
  },
  compareSymbol(def, i) {
    const pics = i < def.params.pictureRounds;
    const max = pics ? def.params.max : def.params.maxNumbers;
    let a = rand(def.params.min, max), b = rand(def.params.min, max);
    if (Math.random() < 0.2) b = a;
    const ans = a < b ? '<' : a > b ? '>' : '=';
    return { question: 'علامت درست را بگذار.', answer: ans, options: ['<', '=', '>'], data: { a, b, pics, ea: obj(def), eb: obj(def) } };
  },
  tensOnes(def, i, total) {
    const n = stepUp(def.params.min, def.params.max, i, total);
    if (def.params.mode === 'read') {
      const sw = (n % 10) * 10 + Math.floor(n / 10);
      const set = new Set<number>([n]);
      if (sw !== n && sw >= 10 && sw <= 99) set.add(sw);
      for (const d of shuffle([1, -1, 10, -10])) { if (set.size >= 3) break; if (n + d >= 10 && n + d <= 99) set.add(n + d); }
      return { question: 'چند ده‌تایی و چند یکی؟ این چه عددی است؟', answer: n, options: shuffle([...set]), data: { n, mode: 'read' } };
    }
    return def.params.mode === 'bundle'
      ? { question: 'ده تا چوب را انتخاب کن و ببندشان.', answer: n, options: nearOptions(n, 3, 10, 20), data: { n, mode: 'bundle' } }
      : { question: `عدد ${fa(n)} را با بسته‌های ده‌تایی و یکی بساز.`, speak: `عدد ${numWord(n)} را بساز`, answer: n, data: { n, mode: 'build' } };
  },
  pattern(def, i) {
    const { mode, units, kinds } = def.params;
    const unit: string = pick(units as string[]);
    const letters = [...new Set(unit.split(''))];
    const kind: string = mode === 'next' ? kinds[i % kinds.length] : pick(kinds as string[]);
    const toks = tokensFor(kind, letters.length);
    const map = Object.fromEntries(letters.map((l, k) => [l, toks[k]]));
    const L = unit.length * (mode === 'unit' ? 3 : unit.length <= 2 ? 4 : 3);
    const seq = range(0, L - 1).map(k => map[unit[k % unit.length]]);
    const extra = tokensFor(kind, letters.length + 1).find(t => !toks.some(x => tokenKey(x) === tokenKey(t))) || toks[0];
    if (mode === 'next') {
      const nextTok = map[unit[L % unit.length]];
      const opts = shuffle([...toks, ...(toks.length < 3 ? [extra] : [])]);
      return { question: kind === 'motion' ? 'این حرکت‌ها را انجام بده! بعدی چیست؟' : 'بعدی کدام است؟', answer: opts.findIndex(t => tokenKey(t) === tokenKey(nextTok)), options: opts.map(tokenKey),
        data: { seq, opts, kind, mode, unitLen: unit.length } };
    }
    if (mode === 'gap') {
      const g = rand(unit.length, L - 2);
      const opts = shuffle([...toks, ...(toks.length < 3 ? [extra] : [])]);
      return { question: 'جای خالی چه باید باشد؟', answer: opts.findIndex(t => tokenKey(t) === tokenKey(seq[g])), options: opts.map(tokenKey), data: { seq, gap: g, opts, kind, mode } };
    }
    if (mode === 'wrong') {
      const w = rand(unit.length, L - 1);
      const wrongTok = [...toks, extra].find(t => tokenKey(t) !== tokenKey(seq[w]))!;
      const s2 = [...seq]; s2[w] = wrongTok;
      return { question: 'یکی از قطعه‌ها اشتباه است. پیدایش کن!', answer: w, data: { seq: s2, correct: seq[w], kind, mode } };
    }
    // unit: کدام بخش تکرار می‌شود؟
    const correct = unit.split('').map(l => map[l]);
    const cands: PatternToken[][] = [correct];
    if (unit.length > 2) cands.push(correct.slice(0, unit.length - 1)); else cands.push([correct[0]]);
    cands.push([...correct.slice(1), correct[0], ...(unit.length === 2 ? [correct[1]] : [])]);
    const uniq = cands.filter((c, k) => cands.findIndex(d => d.map(tokenKey).join() === c.map(tokenKey).join()) === k);
    if (uniq.length < 3) uniq.push([...correct, correct[0]]);
    const opts = shuffle(uniq.slice(0, 3));
    return { question: 'کدام تکه، دوباره و دوباره تکرار شده است؟', answer: opts.findIndex(o => o === correct), data: { seq, opts, kind, mode } };
  },
  chart(def, i) {
    const { mode, size } = def.params;
    if (mode === 'find') { const t = rand(1, size); return { question: `عدد ${fa(t)} را در جدول پیدا کن.`, speak: `عدد ${numWord(t)} را پیدا کن`, answer: t, data: { size, mode, target: t } }; }
    if (mode === 'fill') {
      const hidden = shuffle(range(2, size - 1)).slice(0, 6).sort((a, b) => a - b);
      const ask = shuffle(hidden).slice(0, 2);
      return { question: 'خانه‌های خالیِ چشمک‌زن چه عددی دارند؟', answer: ask, data: { size, mode, hidden, ask } };
    }
    if (mode === 'move') {
      const dirs = i < 2 ? ['after', 'before'] : ['after', 'before', 'down', 'up'];
      const d = pick(dirs);
      const delta = d === 'after' ? 1 : d === 'before' ? -1 : d === 'down' ? 10 : -10;
      let s = rand(1, size); while (s + delta < 1 || s + delta > size || (Math.abs(delta) === 1 && Math.ceil(s / 10) !== Math.ceil((s + delta) / 10))) s = rand(1, size);
      const label = d === 'after' ? 'یک خانه جلو برو (عدد بعد)' : d === 'before' ? 'یک خانه عقب برو (عدد قبل)' : d === 'down' ? 'یک خانه پایین برو' : 'یک خانه بالا برو';
      return { question: `از ${fa(s)} ${label}. کجا رسیدی؟`, answer: s + delta, data: { size, mode, start: s, delta, dir: d } };
    }
    const step = def.params.steps[i % def.params.steps.length];
    const shown = [step, step * 2];
    const need = range(3, 6).map(k => k * step).filter(v => v <= size);
    return { question: `${fa(step)}تا ${fa(step)}تا بشمار و خانه‌ها را رنگ کن.`, answer: need, data: { size, mode, step, shown } };
  },
  latinSquare(def) {
    const n = def.params.n;
    const base = range(0, n - 1);
    const rows = shuffle(base), cols = shuffle(base), syms = shuffle(base);
    const grid = rows.map(r => cols.map(c => syms[(r + c) % n]));
    const blanksN = rand(def.params.blanks[0], def.params.blanks[1]);
    const blankRows = shuffle(base).slice(0, Math.min(blanksN, n));
    const blanks = blankRows.map(r => [r, rand(0, n - 1)]);
    return { question: 'در هر ردیف و هر ستون، هر کدام فقط یک بار!', answer: grid.flat(), data: { n, grid, blanks, symbols: def.params.symbols } };
  },
  shapeCorners(def, i) {
    const SH = [{ id: 'triangle', c: 3 }, { id: 'square', c: 4 }, { id: 'rect', c: 4 }, { id: 'pentagon', c: 5 }, { id: 'hexagon', c: 6 }];
    if (def.params.mode === 'count') { const s = SH[i < 3 ? [0, 1, 0][i] : rand(0, SH.length - 1)]; return { question: 'روی هر گوشه بزن و بشمار.', answer: s.c, options: nearOptions(s.c, 3, 0, 8), data: { shape: s.id, corners: s.c, rot: rand(-25, 25), color: pick(COLORS) } }; }
    const target = pick([3, 4, 5, 6]);
    const right = pick(SH.filter(s => s.c === target));
    const others = shuffle(SH.filter(s => s.c !== target)).slice(0, 2);
    const shapes = shuffle([right, ...others]).map(s => ({ ...s, rot: rand(-40, 40), color: pick(COLORS) }));
    return { question: `کدام شکل ${fa(target)} گوشه دارد؟`, speak: `کدام شکل ${numWord(target)} گوشه دارد؟`, answer: shapes.findIndex(s => s.id === right.id), data: { shapes, target } };
  },
  compareLength(def, i) {
    const count = i < 2 ? 2 : 3;
    const lens = shuffle(range(3, 9)).slice(0, count);
    const ask = pick(['long', 'short'] as const);
    const target = ask === 'long' ? Math.max(...lens) : Math.min(...lens);
    const items = lens.map(l => ({ len: l, emoji: pick(['✏️', '🖍️', '🥕', '🐍']), color: pick(COLORS) }));
    return { question: ask === 'long' ? 'کدام بلندتر است؟' : 'کدام کوتاه‌تر است؟', answer: lens.indexOf(target), data: { items, ask } };
  },
  measureUnits(def, i, total) {
    const L = rand(def.params.min, ramp(def.params.min, def.params.max, i, total));
    return { question: 'گیره‌ها را پشت سر هم زیر مداد بگذار. مداد چند گیره است؟', answer: L, options: nearOptions(L, 3, 1, 12), data: { L, color: pick(COLORS) } };
  },
  addCombine(def, i, total) {
    const sum = stepUp(def.params.minSum || 3, def.params.maxSum, i, total);
    const a = rand(1, sum - 1), b = sum - a;
    const q = def.params.rep === 'tenframe' ? `${fa(a)} خانه آبی و ${fa(b)} خانه سبز رنگ کن.` : !def.numerals ? 'این دسته و آن دسته، روی هم چند تا می‌شود؟' : 'دو دسته را با هم یکی کن. همه چند تا شد؟';
    return { question: q, objects: [obj(def)], answer: a + b, options: ansOptions(a + b, def), data: { a, b, rep: def.params.rep } };
  },
  takeAway(def, i, total) {
    const n = stepUp(3, def.params.max, i, total);
    const k = i < 2 ? 1 : rand(1, i > total / 2 ? n : n - 1);
    const e = def.params.rep === 'objects' ? pick(['🐦', '🎈', '🐟', '🦋']) : '';
    const verb = e === '🐦' || e === '🦋' ? 'پرواز کردند' : e === '🎈' ? 'ترکیدند' : 'رفتند';
    const q = !def.numerals
      ? (def.params.rep === 'tally' ? `${numWord(k)} تا چوب‌خط را خط بزن. چند تا ماند؟` : `${numWord(k)} تا ${verb}. روی همان‌ها بزن!`)
      : (def.params.rep === 'tally' ? `${fa(k)} تا چوب‌خط را خط بزن. چند تا ماند؟` : `${fa(k)} تا ${verb}. روی ${fa(k)} تا بزن!`);
    return { question: q, objects: [e], answer: n - k, options: ansOptions(n - k, def), data: { n, k, rep: def.params.rep, verb } };
  },
  expression(def, i, total) {
    const op = def.params.op;
    const max = ramp(5, def.params.maxSum || def.params.max, i, total);
    let a: number, b: number;
    if (op === '+') { a = rand(0, max - 1); b = rand(1, max - a); } else { a = rand(2, max); b = rand(0, a); }
    const r = op === '+' ? a + b : a - b;
    return { question: 'جواب چند است؟', answer: r, options: nearOptions(r, 4, 0, 20), data: { a, b, op } };
  },
  lineJump(def, i, total) {
    const p = def.params;
    if (p.mode === 'hop') {
      // آشنایی: پرش‌های یک‌خانه‌ای از صفر یا یک
      const start = i < 3 ? 0 : i % 2 ? 1 : 0;
      const hops = i < 2 ? 1 : i < 4 ? 2 : 3;
      const q = start === 0 ? 'قورباغه روی صفر است. هر بار یک خانه جلو بپر!' : 'قورباغه روی یک است. هر بار یک خانه جلو بپر!';
      return { question: hops === 1 ? q.replace('هر بار ', '') : q, answer: start + hops, data: { mode: 'hop', start, hops, max: p.max } };
    }
    const max = p.max;
    const lineMax = p.lineMax || (max <= 10 ? 10 : 20);
    let steps: number[];
    if (p.terms === 3) {
      const a = rand(1, 4), b = rand(1, Math.min(4, max - a - 1)), c = rand(1, Math.max(1, Math.min(4, max - a - b)));
      steps = [a, b, c];
    } else {
      const op = p.op === 'mix' ? pick(['+', '-']) : p.op;
      const top = stepUp(p.minSum || 3, max, i, total);
      if (op === '+') { const a = rand(1, top - 1); steps = [a, top - a]; }
      else { const b = rand(1, Math.max(1, Math.min(top - 1, 6))); steps = [top, -b]; }
    }
    const r = steps.reduce((s2, v) => s2 + v, 0);
    const text = steps.map((v, k) => k === 0 ? fa(v) : `${v > 0 ? '+' : '−'} ${fa(Math.abs(v))}`).join(' ');
    return { question: `${text} را روی محور نشان بده.`, answer: r, options: nearOptions(r, 3, 0, lineMax), data: { mode: 'arcs', steps, max: lineMax } };
  },
  hiddenPart(def, i, total) {
    const n = rand(def.params.min, ramp(def.params.min + 1, def.params.max, i, total));
    if (def.params.mode === 'split') return { question: `${fa(n)} مهره داریم. با رنگ کردن، چند جور می‌شود آن را دو تکه کرد؟`, answer: n, data: { n, need: def.params.need, mode: 'split' } };
    const v = rand(0, n - 1);
    return { question: `روی هم ${fa(n)} مهره است. چند تا زیر کاسه پنهان شده؟`, speak: `روی هم ${numWord(n)} مهره است. چند تا زیر کاسه است؟`, answer: n - v, options: nearOptions(n - v, 3, 0, 10), data: { n, v, mode: 'hidden' } };
  },
  makeTen(def, i) {
    const k = i < 2 ? rand(6, 9) : rand(2, 8);
    return { question: 'خانه‌های خالی را پر کن تا ده شود.', answer: 10 - k, options: nearOptions(10 - k, 3, 0, 10), data: { k } };
  },
  repMatch(def, i, total) {
    const op = def.params.op;
    const max = ramp(5, def.params.maxSum || def.params.max, i, total);
    const make = () => { if (op === '+') { const a = rand(1, max - 1); return { a, b: rand(1, max - a) }; } const a = rand(2, max); return { a, b: rand(1, a) }; };
    const main = make();
    const decoys: { a: number; b: number }[] = [];
    let guard = 0;
    while (decoys.length < 2 && guard++ < 50) { const d = make(); if (!(d.a === main.a && d.b === main.b) && !decoys.some(x => x.a === d.a && x.b === d.b)) decoys.push(d); }
    const cards = shuffle([main, ...decoys]).map((c, k) => ({ ...c, rep: shuffle(['objects', 'tally', 'line'])[k] }));
    return { question: 'کدام تصویر همین عبارت را نشان می‌دهد؟', objects: [obj(def)], answer: cards.findIndex(c => c.a === main.a && c.b === main.b), data: { main, cards, op } };
  },
  story(def, i, total) {
    const max = ramp(6, def.params.max, i, total);
    const join = Math.random() < 0.5;
    const S = pick(STORIES);
    let a: number, b: number;
    if (join) { a = rand(1, max - 1); b = rand(1, Math.min(5, max - a)); } else { a = rand(3, max); b = rand(1, Math.min(a, 5)); }
    const text = (join ? S.join : S.leave).replace('{a}', fa(a)).replace('{b}', fa(b));
    const r = join ? a + b : a - b;
    const exprs = shuffle([{ a, b, op: join ? '+' : '-' }, { a, b, op: join ? '-' : '+' }, { a: b, b: a, op: '-' }].filter((e, k, arr) => !(e.op === '-' && e.a < e.b) && arr.findIndex(x => x.a === e.a && x.b === e.b && x.op === e.op) === k));
    return { question: text + ' ' + S.ask, answer: r, options: nearOptions(r, 3, 0, 20), data: { a, b, join, emoji: S.emoji, place: S.place, exprs, mode: def.params.mode } };
  },

  /* ---------- بشمار و رنگ کن / از این‌ها رنگ کن (کتاب ص ۳ و ۹) ---------- */
  colorCount(def, i, total) {
    const { min, max, mode, cells = 5 } = def.params;
    const n = stepUp(min, max, i, total);
    const color = pick(PAINT);
    if (mode === 'shapes') {
      const kind = pick(['circle', 'square', 'triangle', 'star', 'heart']);
      const pool = Math.min(8, n + rand(2, 3));
      return { question: 'به تعداد شکل‌های سمت چپ، از شکل‌های سمت راست رنگ کن.', answer: n, data: { n, mode, kind, color, pool } };
    }
    return { question: 'بشمار و به همان تعداد خانه رنگ کن.', objects: [obj(def, ALL_OBJ)], answer: n, data: { n, mode: 'cells', cells: Math.max(cells, n + 1), color } };
  },
  /* ---------- انگشت‌ها (کتاب ص ۷، ۱۱، ۲۵، ۳۱) ---------- */
  fingerMatch(def, i, total) {
    const p = def.params;
    const e = obj(def, THINGS_OBJ);
    if (p.mode === 'twoHands') {
      const a = stepUp(p.min, p.max, i, total), b = rand(p.min, p.max);
      const [er, el] = shuffle(THINGS_OBJ).slice(0, 2);
      return { question: 'دستهٔ سمت راست را با دست راست و دستهٔ سمت چپ را با دست چپ نشان بده.', answer: [a, b], data: { mode: 'twoHands', a, b, er, el } };
    }
    if (p.mode === 'sum') {
      const s2 = stepUp(p.minSum || 2, p.maxSum, i, total);
      const a = rand(Math.max(1, s2 - 5), Math.min(5, s2 - 1)); const b = s2 - a;
      return { question: 'انگشت‌های این دست و آن دست، روی هم چند تا می‌شود؟', answer: s2, options: ansOptions(s2, def), data: { mode: 'sum', a, b, alt: rand(0, 2) } };
    }
    if (p.mode === 'fold') {
      const a = stepUp(p.min, p.max, i, total);
      const k = i < 2 ? 1 : rand(1, a - 1);
      return { question: 'چند تا هستند؟ با انگشت نشان بده. بعد به تعداد رفته‌ها انگشت ببند.', objects: [e], answer: a - k, options: ansOptions(a - k, def), data: { mode: 'fold', a, k } };
    }
    const n = stepUp(p.min, p.max, i, total);
    if (p.mode === 'handSay') {
      const alt = p.alt && n <= 5 ? rand(0, 2) : 0;
      return { question: n > 5 ? 'انگشت‌های باز را بشمار. چند تاست؟' : 'این دست چند تا را نشان می‌دهد؟', answer: n, options: ansOptions(n, def), data: { mode: 'handSay', n, alt } };
    }
    if (p.mode === 'raise') return { question: 'روی انگشت‌ها بزن تا به تعداد شکل‌ها باز شوند.', objects: [e], answer: n, data: { mode: 'raise', n } };
    // pick: کدام دست همین تعداد را نشان می‌دهد؟
    const vals = nearOptions(n, 3, 1, 5);
    const alts = vals.map(() => (p.alt ? rand(0, 2) : 0));
    return { question: 'کدام دست همین تعداد را نشان می‌دهد؟', objects: [e], answer: vals.indexOf(n), data: { mode: 'pick', n, vals, alts } };
  },
  /* ---------- دسته‌های هم‌تعداد را وصل کن (کتاب ص ۶) ---------- */
  groupMatch(def, i, total) {
    const g = def.params.groups || 3;
    const hi = Math.max(def.params.min + g - 1, stepUp(def.params.min + g - 1, def.params.max, i, total));
    const counts = shuffle(range(def.params.min, hi)).slice(0, g);
    const emo = shuffle(ALL_OBJ);
    const left = counts.map((n, k) => ({ n, e: emo[k] }));
    const right = shuffle(counts).map((n, k) => ({ n, e: emo[k + g] }));
    return { question: 'دسته‌هایی را که تعدادشان مثل هم است به هم وصل کن.', answer: counts, data: { left, right } };
  },
  /* ---------- الگو با رنگ کردن خانه‌ها، در یک ردیف (کتاب ص ۴) ---------- */
  patternStrip(def, i) {
    const units: string[] = def.params.units;
    const unit = i < 3 ? units[0] : pick(units);
    const letters = [...new Set(unit.split(''))];
    const cols = shuffle(PAINT).slice(0, letters.length);
    const map = Object.fromEntries(letters.map((l, k) => [l, cols[k]]));
    const len: number = def.params.len + (i > 3 ? 2 : 0);
    const seq = range(0, len - 1).map(k => map[unit[k % unit.length]]);
    const shown = Math.min(len - 3, unit.length * 2 + (i < 3 ? 1 : 0));
    const palette = shuffle([...cols, ...(cols.length < 3 ? [PAINT.find(c => !cols.includes(c))!] : [])]);
    return { question: 'الگو را پیدا کن و خانه‌های بعدی را به همان ترتیب رنگ کن.', answer: seq.slice(shown), data: { seq, shown, palette, unitLen: unit.length } };
  },
};

const PAINT = ['#FF5A5F', '#3FA7F5', '#FFC83D', '#39C47A', '#A46BF5'];
const ALL_OBJ = [...FRUITS, ...ANIMALS, ...TOYS];
const THINGS_OBJ = ['🔑', '☂️', '🧤', '👟', '🚗', '🎒', '🧦', '🎈'];

const STORIES = [
  { emoji: '🦆', place: '💧', join: '{a} اردک در آب بودند. {b} اردک دیگر هم آمدند.', leave: '{a} اردک در آب بودند. {b} تا از آب بیرون رفتند.', ask: 'حالا چند اردک در آب است؟' },
  { emoji: '🐦', place: '🌳', join: '{a} پرنده روی درخت بودند. {b} پرندهٔ دیگر نشستند.', leave: '{a} پرنده روی درخت بودند. {b} تا پرواز کردند.', ask: 'حالا چند پرنده روی درخت است؟' },
  { emoji: '🐟', place: '🫙', join: '{a} ماهی در تنگ بود. {b} ماهی دیگر به تنگ اضافه شد.', leave: '{a} ماهی در تنگ بود. {b} ماهی را به حوض بردیم.', ask: 'حالا چند ماهی در تنگ است؟' },
  { emoji: '🍪', place: '🍽️', join: '{a} کلوچه در بشقاب بود. مادر {b} کلوچهٔ دیگر گذاشت.', leave: '{a} کلوچه در بشقاب بود. بچه‌ها {b} تا را خوردند.', ask: 'حالا چند کلوچه در بشقاب است؟' },
  { emoji: '🧒', place: '🚌', join: '{a} نفر در اتوبوس بودند. در ایستگاه {b} نفر سوار شدند.', leave: '{a} نفر در اتوبوس بودند. در ایستگاه {b} نفر پیاده شدند.', ask: 'حالا چند نفر در اتوبوس است؟' },
];

export function buildRound(def: ExerciseDef, i: number, total: number): Round {
  if (def.fixed?.length) return def.fixed[i % def.fixed.length];
  const g = GENERATORS[def.type];
  if (!g) throw new Error(`generator not found: ${def.type}`);
  return g(def, i, total);
}
