import React, { createContext, useContext, useState } from 'react';
import { createPortal } from 'react-dom';
import { numWord, toFa } from '../../utils/fa';
import { sound } from '../../utils/audio';
import { ExerciseDef, Round } from '../../math/types';
import { OkArt } from '../shared/ArtButtons';

/** رابط مشترک همهٔ نمایشگرهای تمرین */
export interface RProps {
  round: Round;
  def: ExerciseDef;
  /** گزارش جواب به موتور؛ ok=false یعنی تلاش دوباره (بازخورد مهربان) */
  answer: (ok: boolean, hint?: string) => void;
  mistakes: number;
  solved: boolean;
}

const say = (t: string) => sound.speakPersian(t);

/* ---------------- جای دکمهٔ تایید در ستون کناری (حالت افقی) ---------------- */
export const ActionSlot = createContext<HTMLElement | null>(null);
/** دکمهٔ سبز «تمام شد»: در حالت افقی به ستون کنار صفحه (سمت چپ) می‌رود */
export const SideOk: React.FC<React.ComponentProps<typeof OkArt>> = props => {
  const slot = useContext(ActionSlot);
  const el = <OkArt {...props} className={`mx-ok ${props.className || ''}`} />;
  return slot ? createPortal(el, slot) : el;
};

/* ---------------- دکمه‌های جواب ---------------- */
export const Choices: React.FC<{ options: (number | string)[]; onPick: (v: any, i: number) => void; disabled?: boolean; render?: (v: any, i: number) => React.ReactNode; wrong?: (number | string)[]; right?: number | string | null; small?: boolean; className?: string }> =
  ({ options, onPick, disabled, render, wrong = [], right = null, small, className = '' }) => (
  <div className={`mx-choices ${small ? 'small' : ''} ${className}`}>
    {options.map((o, i) => <button key={`${o}-${i}`} type="button" disabled={disabled || wrong.includes(o)} onClick={() => onPick(o, i)}
      className={`mx-choice ${wrong.includes(o) ? 'is-wrong' : ''} ${right === o ? 'is-right' : ''}`}>
      {render ? render(o, i) : typeof o === 'number' ? toFa(o) : o}
    </button>)}
  </div>
);

/** وضعیت ساده برای «گزینه‌های اشتباهِ امتحان‌شده» */
export function useWrongs<T>() {
  const [wrong, setWrong] = React.useState<T[]>([]);
  return { wrong, addWrong: (v: T) => setWrong(w => [...w, v]), reset: () => setWrong([]) };
}

/* ---------------- دست و انگشت‌ها ----------------
 * ترتیب انگشت‌ها: [شست، اشاره، وسط، حلقه، کوچک]
 * کتاب (ص ۷ و ۱۱): هر عدد را می‌شود با انگشت‌های مختلف نشان داد؛ برای همین چند «جور» داریم.
 */
const T = true, F = false;
const FINGER_SETS: boolean[][] = [[F, F, F, F, F], [F, T, F, F, F], [F, T, T, F, F], [F, T, T, T, F], [F, T, T, T, T], [T, T, T, T, T]];
const FINGER_ALT: Record<number, boolean[][]> = {
  1: [[T, F, F, F, F], [F, F, F, F, T]],
  2: [[T, T, F, F, F], [F, F, F, T, T]],
  3: [[T, T, T, F, F], [F, F, T, T, T]],
  4: [[T, T, T, T, F]],
};
export const fingersFor = (n: number, alt = 0): boolean[] => {
  const k = Math.max(0, Math.min(5, n));
  const alts = FINGER_ALT[k];
  return alt && alts?.length ? alts[(alt - 1) % alts.length] : FINGER_SETS[k];
};
const SKIN = '#F7C7A0', SKIN_D = '#E9A77C', LINE = '#98572F', NAIL = '#FDE3CF';
const FINGERS = [{ x: 33, w: 12, top: 13 }, { x: 46, w: 12.6, top: 5 }, { x: 59.4, w: 12, top: 10 }, { x: 72, w: 10.4, top: 22 }];

export const Hand: React.FC<{ n?: number; fingers?: boolean[]; side?: 'right' | 'left'; size?: number; onFinger?: (i: number) => void; className?: string; label?: boolean }> =
  ({ n = 0, fingers, side = 'right', size = 96, onFinger, className = '', label }) => {
  const f = fingers || fingersFor(n);
  const tap = (i: number) => onFinger ? () => onFinger(i) : undefined;
  const cursor = onFinger ? { cursor: 'pointer' } : undefined;
  return <svg viewBox="0 0 90 134" className={`mx-hand ${onFinger ? 'live' : ''} ${className}`} style={{ width: size, height: size * 134 / 90 }} aria-label={`دست ${side === 'right' ? 'راست' : 'چپ'}`}>
    <g transform={side === 'left' ? 'translate(90 0) scale(-1 1)' : undefined}>
      {/* شست باز (پشت کف دست) */}
      {f[0] && <g onClick={tap(0)} style={cursor}><g transform="translate(31 94) rotate(-40)">
        <rect x={-6.8} y={-38} width={13.6} height={44} rx={6.8} fill={SKIN} stroke={LINE} strokeWidth={2.6} />
        <rect x={-3.8} y={-35} width={7.6} height={9} rx={3.4} fill={NAIL} />
      </g></g>}
      {/* چهار انگشت */}
      {FINGERS.map((g, k) => {
        const up = f[k + 1];
        const y = up ? g.top : 50;
        return <g key={k} onClick={tap(k + 1)} style={cursor} className={up ? 'f-up' : 'f-down'}>
          {onFinger && <rect x={g.x - 2} y={0} width={g.w + 4} height={70} fill="transparent" />}
          <rect x={g.x} y={y} width={g.w} height={74 - y} rx={g.w / 2} fill={SKIN} stroke={LINE} strokeWidth={2.6} />
          {up && <rect x={g.x + 2.6} y={y + 3} width={g.w - 5.2} height={9} rx={3.2} fill={NAIL} />}
          {up && <path d={`M${g.x + 3} ${y + 26} h${g.w - 6}`} stroke={SKIN_D} strokeWidth={1.6} strokeLinecap="round" />}
        </g>;
      })}
      {/* کف دست */}
      <path d="M29 62 Q29 56 36 56 L78 56 Q85 56 85 63 L85 99 Q85 121 62 123 L48 123 Q28 121 27 101 Z" fill={SKIN} stroke={LINE} strokeWidth={2.6} strokeLinejoin="round" />
      {/* انگشت‌های بسته: بند انگشت روی کف دست */}
      {FINGERS.map((g, k) => !f[k + 1] && <path key={k} d={`M${g.x + 1.5} 64 q${g.w / 2 - 1.5} 6 ${g.w - 3} 0`} fill="none" stroke={SKIN_D} strokeWidth={2.2} strokeLinecap="round" />)}
      {/* شست بسته: روی کف دست */}
      {!f[0] && <g onClick={tap(0)} style={cursor}><rect x={30} y={80} width={34} height={14} rx={7} transform="rotate(-14 30 87)" fill={SKIN} stroke={LINE} strokeWidth={2.6} /></g>}
      <rect x={31} y={116} width={52} height={17} rx={6} fill={side === 'right' ? '#3FA7F5' : '#FF8A5B'} stroke={LINE} strokeWidth={2.2} />
    </g>
    {label && <text x={45} y={130} textAnchor="middle" fontSize={10} fontWeight={900} fill="#fff">{side === 'right' ? 'راست' : 'چپ'}</text>}
  </svg>;
};

/** عدد ۰ تا ۱۰ با یک یا دو دست (مثل کتاب: از ۶ به بعد دو دست) */
export const Hands: React.FC<{ n: number; size?: number; alt?: number }> = ({ n, size = 78, alt = 0 }) => n <= 5
  ? <Hand n={n} fingers={fingersFor(n, alt)} size={size} />
  : <span className="mx-hands" dir="ltr"><Hand side="left" n={n - 5} fingers={fingersFor(n - 5, alt)} size={size * .9} /><Hand n={5} size={size * .9} /></span>;

/* ---------------- گفتن با صدا (پیش از آشنایی با نماد عدد) ----------------
 * کتاب تا تم ۷ از کودک نمی‌خواهد عدد بنویسد یا بخواند؛ «بشمار و بگو».
 * کودک بلند می‌گوید، دکمه را می‌زند، برنامه عدد را می‌گوید و با انگشت نشان می‌دهد، و بزرگ‌تر تأیید می‌کند.
 */
export const OralAnswer: React.FC<{ n: number; solved: boolean; answer: RProps['answer']; retryHint?: string; prompt?: string }> = ({ n, solved, answer, retryHint, prompt = 'بلند بگو چند تا!' }) => {
  const [phase, setPhase] = useState<'ask' | 'check'>('ask');
  if (phase === 'ask') return <div className="mx-oral">
    <button type="button" className="mx-oral-say" disabled={solved} onClick={() => { sound.playPop(); setPhase('check'); window.setTimeout(() => say(numWord(n)), 120); }}>
      <span className="mx-oral-mouth" aria-hidden="true">🗣️</span><b>{prompt}</b><small>گفتی؟ این‌جا بزن</small>
    </button>
    <p className="mx-oral-parent">👪 با پدر یا مادرت بگو</p>
  </div>;
  return <div className="mx-oral check">
    <button type="button" className="mx-oral-show" onClick={() => say(numWord(n))} aria-label="دوباره بگو"><Hands n={n} size={64} /><span className="mx-oral-dots" dir="ltr">{Array.from({ length: n }, (_, i) => <i key={i} />)}</span></button>
    <div className="mx-oral-btns">
      <button type="button" className="mx-oral-yes" disabled={solved} onClick={() => answer(true)}>✅ همین را گفتم</button>
      <button type="button" className="mx-oral-no" disabled={solved} onClick={() => { setPhase('ask'); answer(false, retryHint || 'اشکالی ندارد! یکی‌یکی دوباره بشمار.'); }}>🔁 دوباره</button>
    </div>
  </div>;
};

export type AnsMode = 'numeral' | 'oral' | 'hands' | 'dots';
/** یک جای جواب برای «چند تا؟» با چهار حالت: عدد، گفتن، انگشت، نقطه */
export const NumAnswer: React.FC<{ n: number; options?: number[]; mode?: AnsMode; solved: boolean; answer: RProps['answer']; hint?: string; onRight?: () => void }> = ({ n, options = [], mode = 'numeral', solved, answer, hint, onRight }) => {
  const { wrong, addWrong } = useWrongs<number>();
  if (mode === 'oral') return <OralAnswer n={n} solved={solved} answer={(ok, h) => { if (ok) onRight?.(); answer(ok, h || hint); }} retryHint={hint} />;
  const pickV = (v: number) => { if (v === n) { onRight?.(); answer(true); } else { addWrong(v); answer(false, hint); } };
  if (mode === 'hands') return <Choices className="mx-choices-art" options={options} wrong={wrong} disabled={solved} onPick={pickV} render={v => <Hands n={v} size={54} />} />;
  if (mode === 'dots') return <Choices className="mx-choices-art" options={options} wrong={wrong} disabled={solved} onPick={pickV} render={v => <Dots n={v} />} />;
  return <Choices options={options} wrong={wrong} disabled={solved} onPick={pickV} />;
};

/* ---------------- عبارت ریاضی (همیشه چپ‌به‌راست مثل کتاب) ---------------- */
export const Expr: React.FC<{ parts: (string | number | null)[]; big?: boolean }> = ({ parts, big }) => (
  <div className={`mx-expr ${big ? 'big' : ''}`} dir="ltr">
    {parts.map((p, i) => p === null ? <span key={i} className="mx-expr-blank">?</span> : <span key={i} className={typeof p === 'number' ? 'n' : 'op'}>{typeof p === 'number' ? toFa(p) : p}</span>)}
  </div>
);

/* ---------------- اشیا ---------------- */
export const Things: React.FC<{ n: number; emoji: string; className?: string; faded?: number[]; max?: number }> = ({ n, emoji, className = '', faded = [] }) => (
  <div className={`mx-things ${className}`}>{Array.from({ length: n }, (_, i) => <span key={i} className={`mx-thing ${faded.includes(i) ? 'faded' : ''}`}>{emoji}</span>)}</div>
);
/** نقطه‌های ردیفی (برای گزینه‌های بدون عدد) */
export const Dots: React.FC<{ n: number; color?: string }> = ({ n, color = '#FF5A5F' }) => <span className="mx-dots" dir="ltr">{Array.from({ length: n }, (_, i) => <i key={i} style={{ background: color }} />)}{n === 0 && <em>○</em>}</span>;

/* ---------------- خانهٔ ده‌تایی ---------------- */
export const TenFrame: React.FC<{ cells?: number; fill: (string | null)[]; onCell?: (i: number) => void; small?: boolean; pulse?: number[] }> = ({ cells = 10, fill, onCell, small, pulse = [] }) => (
  <div className={`mx-frame ${small ? 'small' : ''} cells-${cells}`} dir="ltr">
    {Array.from({ length: cells }, (_, i) => {
      const c = fill[i];
      const inner = <i style={c ? { background: c } : undefined} className={c ? 'on' : ''} />;
      return onCell ? <button key={i} type="button" className={`mx-cell ${pulse.includes(i) ? 'pulse' : ''}`} onClick={() => onCell(i)}>{inner}</button>
        : <span key={i} className="mx-cell">{inner}</span>;
    })}
  </div>
);
export const RED = '#FF5A5F', BLUE = '#3FA7F5', GREEN = '#39C47A', YELLOW = '#FFC83D';
/** پر کردن خانه‌ها: اول رنگ a، بعد رنگ b */
export const frameFill = (a: number, b = 0, ca = RED, cb = BLUE, cells = 10) => Array.from({ length: cells }, (_, i) => i < a ? ca : i < a + b ? cb : null);

/* ---------------- چوب‌خط با دسته‌های پنج‌تایی ----------------
 * مثل کتاب: چهار چوب‌خط ایستاده و پنجمی کج، روی همان چهار تا. در همهٔ برنامه همین شکل استفاده می‌شود.
 */
export const Tally: React.FC<{ n: number; crossed?: number[]; selected?: number[]; onStick?: (i: number) => void; color?: string; small?: boolean; split?: number; animateLast?: boolean }> =
  ({ n, crossed = [], selected = [], onStick, color = '#D8903F', small, split, animateLast }) => {
  const groups: number[][] = [];
  for (let i = 0; i < n; i += 5) groups.push(Array.from({ length: Math.min(5, n - i) }, (_, k) => i + k));
  return <div className={`mx-tally ${small ? 'small' : ''}`} dir="ltr">
    {groups.map((g, gi) => <svg key={gi} viewBox="-4 -4 72 72" className="mx-tally-group" aria-hidden={!onStick}>
      {g.map((idx, k) => {
        const isDiag = k === 4;
        const c = selected.includes(idx) ? '#FFC83D' : split !== undefined && idx >= split ? '#3FA7F5' : color;
        const line = isDiag ? { x1: 0, y1: 50, x2: 60, y2: 12 } : { x1: 10 + k * 13, y1: 6, x2: 10 + k * 13, y2: 58 };
        const x = crossed.includes(idx);
        const fresh = animateLast && idx === n - 1;
        return <g key={idx} onClick={onStick ? () => onStick(idx) : undefined} style={onStick ? { cursor: 'pointer' } : undefined} className={`${isDiag ? 'mx-tally-diag' : 'mx-tally-stick'} ${fresh ? 'fresh' : ''}`}>
          {onStick && <line {...line} stroke="transparent" strokeWidth={16} />}
          <line {...line} stroke={x ? '#b9a48d' : '#7a4a1c'} strokeWidth={9} strokeLinecap="round" pathLength={1} />
          <line {...line} stroke={x ? '#e6d8c6' : c} strokeWidth={5} strokeLinecap="round" pathLength={1} />
          {x && !isDiag && <line x1={line.x1 - 8} y1={37} x2={line.x1 + 8} y2={25} stroke="#FF5A5F" strokeWidth={4.5} strokeLinecap="round" />}
          {x && isDiag && <line x1={26} y1={18} x2={38} y2={44} stroke="#FF5A5F" strokeWidth={4.5} strokeLinecap="round" />}
        </g>;
      })}
    </svg>)}
    {n === 0 && <span className="mx-tally-zero">—</span>}
  </div>;
};

/* ---------------- نقطه‌های تاس ---------------- */
const DICE: Record<number, [number, number][]> = {
  1: [[50, 50]], 2: [[28, 28], [72, 72]], 3: [[25, 25], [50, 50], [75, 75]], 4: [[28, 28], [72, 28], [28, 72], [72, 72]],
  5: [[26, 26], [74, 26], [50, 50], [26, 74], [74, 74]], 6: [[28, 22], [72, 22], [28, 50], [72, 50], [28, 78], [72, 78]],
};
export const Dice: React.FC<{ n: number; color?: string; small?: boolean }> = ({ n, color = '#FF5A5F', small }) => {
  if (n > 6) return <div className="mx-dice-pair"><Dice n={5} color={color} small={small} /><Dice n={n - 5} color={color} small={small} /></div>;
  return <svg viewBox="0 0 100 100" className={`mx-dice ${small ? 'small' : ''}`}><rect x="4" y="4" width="92" height="92" rx="20" fill="#FFFDF7" stroke="#f1d9a8" strokeWidth="5" />
    {(DICE[n] || []).map(([x, y], i) => <circle key={i} cx={x} cy={y} r="10" fill={color} />)}</svg>;
};

/* ---------------- محور اعداد ----------------
 * مثل کتاب (ص ۱۱۹): هر عدد یک کمان است؛ کمان اول از صفر، کمان بعدی از همان‌جا به اندازهٔ عدد دوم.
 * زیر محور، مکعب‌های رنگی همان عبارت را نشان می‌دهند.
 */
export interface LineJumpArc { from: number; to: number; label?: string }
export interface LineBlock { from: number; to: number; color: string; crossFrom?: number }
export const NumberLine: React.FC<{
  max: number; min?: number; frog?: number | null; jumps?: LineJumpArc[]; onTick?: (v: number) => void;
  hot?: number[]; marked?: number[]; small?: boolean; blocks?: LineBlock[]; dim?: boolean;
}> = ({ max, min = 0, frog = null, jumps = [], onTick, hot = [], marked = [], small, blocks = [] }) => {
  const n = max - min;
  const step = small ? 30 : 46;
  const W = n * step + 48;
  const top = small ? 44 : 78;
  const base = top + 14;
  const blockY = base + (small ? 30 : 40);
  const H = blockY + (blocks.length ? (small ? 18 : 26) : 0) + 6;
  const x = (v: number) => 24 + ((v - min) / n) * (W - 48);
  return <div className={`mx-line-wrap ${small ? 'small' : ''}`} dir="ltr">
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-line" preserveAspectRatio="xMidYMid meet">
      <defs>
        <marker id="mxArrF" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#2FB165" /></marker>
        <marker id="mxArrB" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#F2603A" /></marker>
        <marker id="mxAxis" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M0 0L10 5L0 10z" fill="#7a4a1c" /></marker>
      </defs>
      <line x1={10} y1={base} x2={W - 8} y2={base} stroke="#7a4a1c" strokeWidth={4} strokeLinecap="round" markerEnd="url(#mxAxis)" />
      {jumps.map((j, i) => {
        const x1 = x(j.from), x2 = x(j.to), mx = (x1 + x2) / 2;
        const h = Math.min(top - 8, 16 + Math.abs(x2 - x1) * 0.32);
        const fwd = j.to >= j.from;
        return <g key={`${i}-${j.from}-${j.to}`} className="mx-arc">
          <path d={`M${x1} ${base - 5} Q${mx} ${base - 5 - h * 2} ${x2} ${base - 5}`} fill="none" stroke={fwd ? '#2FB165' : '#F2603A'} strokeWidth={small ? 3 : 4} strokeLinecap="round" pathLength={1} markerEnd={`url(#${fwd ? 'mxArrF' : 'mxArrB'})`} />
          {j.label && <g transform={`translate(${mx} ${base - 5 - h - 4})`}><rect x={-17} y={-13} width={34} height={22} rx={11} fill="#fff" stroke={fwd ? '#2FB165' : '#F2603A'} strokeWidth={2.5} />
            <text y={4} textAnchor="middle" fontSize={15} fontWeight={900} fill={fwd ? '#1F8A4B' : '#C24524'}>{j.label}</text></g>}
        </g>;
      })}
      {Array.from({ length: n + 1 }, (_, k) => { const v = min + k; const X = x(v);
        return <g key={v} onClick={onTick ? () => onTick(v) : undefined} style={onTick ? { cursor: 'pointer' } : undefined}>
          {onTick && <rect x={X - step / 2} y={base - top} width={step} height={top + 36} fill="transparent" />}
          {hot.includes(v) && <circle cx={X} cy={base} r={small ? 10 : 15} fill="#FFE07A" className="mx-line-hot" />}
          <line x1={X} y1={base - 9} x2={X} y2={base + 9} stroke="#7a4a1c" strokeWidth={3} strokeLinecap="round" />
          {marked.includes(v) && <circle cx={X} cy={base} r={small ? 6 : 8} fill="#2F8FE8" stroke="#fff" strokeWidth={2} />}
          <text x={X} y={base + (small ? 24 : 31)} textAnchor="middle" fontSize={small ? 15 : 19} fontWeight={900} fill={v % 5 === 0 ? '#C24524' : '#5a3510'}>{toFa(v)}</text>
        </g>; })}
      {blocks.map((b, bi) => Array.from({ length: Math.abs(b.to - b.from) }, (_, k) => {
        const v = Math.min(b.from, b.to) + k; const x1 = x(v) + 1.5, x2 = x(v + 1) - 1.5; const hh = small ? 14 : 20;
        const crossed = b.crossFrom !== undefined && v >= b.crossFrom;
        return <g key={`${bi}-${k}`} className="mx-cube">
          <rect x={x1} y={blockY} width={x2 - x1} height={hh} rx={3} fill={b.color} stroke="rgba(60,30,10,.35)" strokeWidth={1.5} />
          <rect x={x1 + 2} y={blockY + 2} width={x2 - x1 - 4} height={4} rx={2} fill="rgba(255,255,255,.45)" />
          {crossed && <path d={`M${x1 + 3} ${blockY + 3} L${x2 - 3} ${blockY + hh - 3} M${x2 - 3} ${blockY + 3} L${x1 + 3} ${blockY + hh - 3}`} stroke="#5a3510" strokeWidth={2.4} strokeLinecap="round" />}
        </g>;
      }))}
      {frog !== null && <g className="mx-frog-g" style={{ transform: `translate(${x(frog)}px, ${base - 12}px)` }}>
        <text className="mx-frog" key={frog} textAnchor="middle" fontSize={small ? 24 : 34}>🐸</text>
      </g>}
    </svg>
  </div>;
};

/* ---------------- شکل‌های هندسی ---------------- */
export function shapePoints(id: string): [number, number][] {
  const poly = (k: number, r = 40, off = -90) => Array.from({ length: k }, (_, i) => { const a = (off + (360 / k) * i) * Math.PI / 180; return [50 + r * Math.cos(a), 52 + r * Math.sin(a)] as [number, number]; });
  if (id === 'triangle') return poly(3, 44);
  if (id === 'square') return [[16, 16], [84, 16], [84, 84], [16, 84]];
  if (id === 'rect') return [[6, 28], [94, 28], [94, 76], [6, 76]];
  if (id === 'pentagon') return poly(5, 42);
  if (id === 'hexagon') return poly(6, 42, 0);
  return [];
}
export const ShapeSvg: React.FC<{ id: string; color: string; rot?: number; marks?: number[]; onCorner?: (i: number) => void; size?: number }> = ({ id, color, rot = 0, marks = [], onCorner, size }) => {
  const pts = shapePoints(id);
  return <svg viewBox="-6 -6 112 112" className="mx-shape" style={size ? { width: size, height: size } : undefined}>
    <g transform={`rotate(${rot} 50 50)`}>
      <polygon points={pts.map(p => p.join(',')).join(' ')} fill={color} fillOpacity={.88} stroke="#5a3510" strokeWidth={3} strokeLinejoin="round" />
      {onCorner && pts.map(([cx, cy], i) => <g key={i} onClick={() => onCorner(i)} style={{ cursor: 'pointer' }}>
        <circle cx={cx} cy={cy} r={13} fill="transparent" />
        <circle cx={cx} cy={cy} r={marks.includes(i) ? 8 : 6} fill={marks.includes(i) ? '#FFE07A' : '#fff'} stroke="#5a3510" strokeWidth={2.5} />
      </g>)}
    </g>
  </svg>;
};

/** شکل ساده برای رنگ کردن (دایره، مربع، مثلث، ستاره، قلب) — توپر یا فقط دور */
export const PlainShape: React.FC<{ kind: string; color?: string; filled?: boolean; size?: number }> = ({ kind, color = '#FF5A5F', filled = true, size = 44 }) => {
  const p = { fill: filled ? color : '#FFFDF7', stroke: filled ? 'rgba(60,30,10,.45)' : '#b08a5a', strokeWidth: 5, strokeLinejoin: 'round' as const, strokeDasharray: filled ? undefined : '0' };
  const el = kind === 'triangle' ? <polygon points="50,8 94,90 6,90" {...p} />
    : kind === 'square' ? <rect x="10" y="10" width="80" height="80" rx="12" {...p} />
    : kind === 'star' ? <polygon points="50,5 61,38 96,38 68,59 78,93 50,72 22,93 32,59 4,38 39,38" {...p} />
    : kind === 'heart' ? <path d="M50 90 C10 60 2 35 20 20 C35 8 48 18 50 28 C52 18 65 8 80 20 C98 35 90 60 50 90Z" {...p} />
    : <circle cx="50" cy="50" r="42" {...p} />;
  return <svg viewBox="0 0 100 100" style={{ width: size, height: size }} className="mx-plain-shape">{el}</svg>;
};

/** کارت/صحنهٔ سفید تمرین */
export const Stage: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => <section className={`mx-stage ${className}`}>{children}</section>;
