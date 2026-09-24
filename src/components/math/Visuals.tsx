import React from 'react';
import { toFa } from '../../utils/fa';
import { ExerciseDef, Round } from '../../math/types';

/** رابط مشترک همهٔ نمایشگرهای تمرین */
export interface RProps {
  round: Round;
  def: ExerciseDef;
  /** گزارش جواب به موتور؛ ok=false یعنی تلاش دوباره (بازخورد مهربان) */
  answer: (ok: boolean, hint?: string) => void;
  mistakes: number;
  solved: boolean;
}

/* ---------------- دکمه‌های جواب ---------------- */
export const Choices: React.FC<{ options: (number | string)[]; onPick: (v: any, i: number) => void; disabled?: boolean; render?: (v: any, i: number) => React.ReactNode; wrong?: (number | string)[]; right?: number | string | null; small?: boolean }> =
  ({ options, onPick, disabled, render, wrong = [], right = null, small }) => (
  <div className={`mx-choices ${small ? 'small' : ''}`}>
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

/* ---------------- چوب‌خط با دسته‌های پنج‌تایی ---------------- */
export const Tally: React.FC<{ n: number; crossed?: number[]; onStick?: (i: number) => void; color?: string; small?: boolean; split?: number }> = ({ n, crossed = [], onStick, color = '#7a4a1c', small, split }) => {
  const groups: number[][] = [];
  for (let i = 0; i < n; i += 5) groups.push(Array.from({ length: Math.min(5, n - i) }, (_, k) => i + k));
  return <div className={`mx-tally ${small ? 'small' : ''}`} dir="ltr">
    {groups.map((g, gi) => <svg key={gi} viewBox="0 0 64 64" className="mx-tally-group" aria-hidden={!onStick}>
      {g.map((idx, k) => {
        const isDiag = k === 4;
        const c = split !== undefined && idx >= split ? '#2F8FE8' : color;
        const line = isDiag ? { x1: 2, y1: 50, x2: 62, y2: 12 } : { x1: 10 + k * 13, y1: 6, x2: 10 + k * 13, y2: 58 };
        const x = crossed.includes(idx);
        return <g key={idx} onClick={onStick ? () => onStick(idx) : undefined} style={onStick ? { cursor: 'pointer' } : undefined}>
          {onStick && <line {...line} stroke="transparent" strokeWidth={16} />}
          <line {...line} stroke={x ? '#c9b7a3' : c} strokeWidth={6} strokeLinecap="round" />
          {x && !isDiag && <line x1={line.x1 - 7} y1={36} x2={line.x1 + 7} y2={26} stroke="#FF5A5F" strokeWidth={4} strokeLinecap="round" />}
          {x && isDiag && <line x1={26} y1={20} x2={38} y2={42} stroke="#FF5A5F" strokeWidth={4} strokeLinecap="round" />}
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
  return <svg viewBox="0 0 100 100" className={`mx-dice ${small ? 'small' : ''}`}><rect x="4" y="4" width="92" height="92" rx="20" fill="#fff" stroke="#f1d9a8" strokeWidth="5" />
    {(DICE[n] || []).map(([x, y], i) => <circle key={i} cx={x} cy={y} r="10" fill={color} />)}</svg>;
};

/* ---------------- محور اعداد ---------------- */
export const NumberLine: React.FC<{
  max: number; min?: number; frog?: number | null; jumps?: { from: number; to: number }[]; onTick?: (v: number) => void;
  hot?: number[]; marked?: number[]; small?: boolean;
}> = ({ max, min = 0, frog = null, jumps = [], onTick, hot = [], marked = [], small }) => {
  const n = max - min;
  const W = Math.max(320, n * 34 + 40), H = small ? 86 : 118, base = H - 34;
  const x = (v: number) => 20 + ((v - min) / n) * (W - 40);
  return <div className={`mx-line-wrap ${small ? 'small' : ''}`} dir="ltr">
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-line" style={{ minWidth: small ? undefined : Math.min(W, 720) }}>
      <line x1={8} y1={base} x2={W - 8} y2={base} stroke="#7a4a1c" strokeWidth={4} strokeLinecap="round" />
      {jumps.map((j, i) => { const x1 = x(j.from), x2 = x(j.to), mx = (x1 + x2) / 2, h = Math.min(46, 18 + Math.abs(x2 - x1) * 0.5);
        return <path key={i} d={`M${x1} ${base - 6} Q${mx} ${base - 6 - h * 2} ${x2} ${base - 6}`} fill="none" stroke={j.to > j.from ? '#2FB165' : '#F2603A'} strokeWidth={3.5} strokeDasharray="0" markerEnd="" />; })}
      {Array.from({ length: n + 1 }, (_, k) => { const v = min + k; const X = x(v);
        return <g key={v} onClick={onTick ? () => onTick(v) : undefined} style={onTick ? { cursor: 'pointer' } : undefined}>
          {onTick && <rect x={X - 16} y={base - 40} width={32} height={74} fill="transparent" />}
          <line x1={X} y1={base - 9} x2={X} y2={base + 9} stroke="#7a4a1c" strokeWidth={3} />
          {hot.includes(v) && <circle cx={X} cy={base} r={12} fill="#FFE07A" opacity={.9} className="mx-line-hot" />}
          {marked.includes(v) && <circle cx={X} cy={base} r={7} fill="#2F8FE8" />}
          <text x={X} y={base + 29} textAnchor="middle" fontSize={small ? 15 : 17} fontWeight={800} fill="#5a3510">{toFa(v)}</text>
        </g>; })}
      {frog !== null && <text x={x(frog)} y={base - 14} textAnchor="middle" fontSize={small ? 26 : 34} className="mx-frog">🐸</text>}
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
      <polygon points={pts.map(p => p.join(',')).join(' ')} fill={color} fillOpacity={.85} stroke="#5a3510" strokeWidth={3} strokeLinejoin="round" />
      {onCorner && pts.map(([cx, cy], i) => <g key={i} onClick={() => onCorner(i)} style={{ cursor: 'pointer' }}>
        <circle cx={cx} cy={cy} r={13} fill="transparent" />
        <circle cx={cx} cy={cy} r={marks.includes(i) ? 8 : 6} fill={marks.includes(i) ? '#FFE07A' : '#fff'} stroke="#5a3510" strokeWidth={2.5} />
        {marks.includes(i) && <text x={cx} y={cy + 4} textAnchor="middle" fontSize={10} fontWeight={900} fill="#5a3510" transform={`rotate(${-rot} ${cx} ${cy})`}>{toFa(marks.indexOf(i) + 1)}</text>}
      </g>)}
    </g>
  </svg>;
};

/** کارت/صحنهٔ سفید تمرین */
export const Stage: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => <section className={`mx-stage ${className}`}>{children}</section>;
