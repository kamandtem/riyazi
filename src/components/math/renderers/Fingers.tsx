import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnsMode, Choices, Hand, Hands, NumAnswer, PlainShape, RProps, SideOk, Stage, Things, fingersFor, useWrongs } from '../Visuals';
import { numWord } from '../../../utils/fa';
import { sound } from '../../../utils/audio';
import { ansMode } from '../../../math/generators';

const say = (t: string) => sound.speakPersian(t);
const countOf = (f: boolean[]) => f.filter(Boolean).length;

/* ---------- بشمار و رنگ کن (کتاب ص ۳) / به تعداد سمت چپ، از سمت راست رنگ کن (کتاب ص ۹) ---------- */
export const ColorCount: React.FC<RProps> = ({ round, answer, solved }) => {
  const d = round.data;
  const size = d.mode === 'shapes' ? d.pool : d.cells;
  const [on, setOn] = useState<boolean[]>(() => Array.from({ length: size }, () => false));
  const count = on.filter(Boolean).length;
  const toggle = (i: number) => {
    if (solved) return;
    const nx = [...on]; nx[i] = !nx[i]; setOn(nx);
    if (nx[i]) { sound.playSnap(); say(numWord(nx.filter(Boolean).length)); } else sound.playPop();
  };
  const model = d.mode === 'shapes'
    ? <div className="mx-shape-row">{Array.from({ length: d.n }, (_, i) => <PlainShape key={i} kind={d.kind} color={d.color} size={40} />)}</div>
    : <Things n={d.n} emoji={round.objects?.[0] || '🍎'} />;
  const work = d.mode === 'shapes'
    ? <div className="mx-shape-row pick">{on.map((v, i) => <button key={i} type="button" className={`mx-paint-shape ${v ? 'on' : ''}`} onClick={() => toggle(i)} aria-label="رنگ کن"><PlainShape kind={d.kind} color={d.color} filled={v} size={44} /></button>)}</div>
    : <div className="mx-paint-strip">{on.map((v, i) => <button key={i} type="button" className={`mx-paint-cell ${v ? 'on' : ''}`} style={v ? { background: d.color } : undefined} onClick={() => toggle(i)} aria-label="خانه" />)}</div>;
  return <>
    <Stage className="mx-model-stage">
      <div className="mx-model" dir="ltr">
        <div className="mx-model-src">{model}</div>
        <span className="mx-model-arrow">➜</span>
        <div className="mx-model-dst">{work}</div>
      </div>
    </Stage>
    <p className="mx-hint-line">{count === 0 ? '🖍️ روی خانه‌ها بزن تا رنگ شوند' : 'اگر اشتباه شد، دوباره بزن تا پاک شود'}</p>
    <SideOk ready={count > 0} caption="تمام شد" onClick={() => { if (solved) return; if (count === d.n) answer(true); else answer(false, count < d.n ? 'کم است. هر شکل را با یک خانه جفت کن.' : 'زیاد شد! روی یکی بزن تا پاک شود.'); }} />
  </>;
};

/** دستی که کودک روی انگشت‌هایش می‌زند تا باز یا بسته شوند */
const LiveHand: React.FC<{ f: boolean[]; setF: (f: boolean[]) => void; side?: 'right' | 'left'; disabled?: boolean; size?: number; onlyFold?: boolean }> = ({ f, setF, side = 'right', disabled, size = 104, onlyFold }) =>
  <Hand fingers={f} side={side} size={size} onFinger={disabled ? undefined : i => {
    if (onlyFold && !f[i]) { sound.playGentleHint(); return; }
    const nx = [...f]; nx[i] = !nx[i]; setF(nx);
    sound.playSnap(); if (nx[i]) say(numWord(countOf(nx)));
  }} />;
const CLOSED = () => [false, false, false, false, false];

/* ---------- انگشت‌ها ---------- */
export const FingerMatch: React.FC<RProps> = ({ round, def, answer, solved }) => {
  const d = round.data;
  const emoji = round.objects?.[0] || '🔑';
  const { wrong, addWrong } = useWrongs<number>();
  const [f, setF] = useState<boolean[]>(CLOSED);
  const [f2, setF2] = useState<boolean[]>(CLOSED);
  const [phase, setPhase] = useState<'raise' | 'leave' | 'fold' | 'say'>('raise');
  useEffect(() => {
    if (d.mode !== 'fold' || phase !== 'leave') return;
    const t = window.setTimeout(() => { setPhase('fold'); sound.playSnap(); say(d.k === 1 ? 'یکی رفت. یک انگشت ببند' : `${numWord(d.k)} تا رفتند. ${numWord(d.k)} انگشت ببند`); }, 1500);
    return () => window.clearTimeout(t);
  }, [phase]); // eslint-disable-line

  if (d.mode === 'pick') return <>
    <Stage className="mx-center"><Things n={d.n} emoji={emoji} className="big" /></Stage>
    <Choices className="mx-choices-art hands" options={d.vals.map((_: number, i: number) => i)} wrong={wrong} disabled={solved}
      onPick={(_, i) => { if (i === round.answer) { answer(true); say(numWord(d.n)); } else { addWrong(i); answer(false, 'انگشت‌های باز را بشمار.'); } }}
      render={(_, i) => <Hand fingers={fingersFor(d.vals[i], d.alts[i])} size={70} />} />
  </>;

  if (d.mode === 'raise') return <>
    <Stage className="mx-model-stage">
      <div className="mx-model" dir="ltr">
        <div className="mx-model-src"><Things n={d.n} emoji={emoji} /></div>
        <span className="mx-model-arrow">➜</span>
        <div className="mx-model-dst"><LiveHand f={f} setF={setF} disabled={solved} /></div>
      </div>
    </Stage>
    <p className="mx-hint-line">✋ روی انگشت‌ها بزن تا باز شوند؛ با دست خودت هم نشان بده</p>
    <SideOk ready={countOf(f) > 0} caption="نشان دادم" onClick={() => { if (solved) return; const c = countOf(f); if (c === d.n) { answer(true); } else answer(false, c < d.n ? 'یک انگشت دیگر باز کن.' : 'زیاد شد! یکی را ببند.'); }} />
  </>;

  if (d.mode === 'handSay') return <>
    <Stage className="mx-center"><Hands n={d.n} alt={d.alt} size={d.n > 5 ? 118 : 150} /></Stage>
    <NumAnswer n={d.n} options={round.options} mode={ansMode(def) as AnsMode} solved={solved} answer={answer} hint="انگشت‌های باز را یکی‌یکی بشمار." />
  </>;

  if (d.mode === 'twoHands') {
    const ok = () => { if (solved) return; const a = countOf(f), b = countOf(f2);
      if (a === d.a && b === d.b) answer(true);
      else answer(false, a !== d.a ? 'دست راست را با دستهٔ سمت راست مقایسه کن.' : 'دست چپ را با دستهٔ سمت چپ مقایسه کن.'); };
    return <>
      <Stage className="mx-two-hands">
        <div className="mx-two" dir="ltr">
          <div className="mx-two-side left"><small>سمت چپ</small><Things n={d.b} emoji={d.el} className="small" /><LiveHand side="left" f={f2} setF={setF2} disabled={solved} size={92} /></div>
          <div className="mx-two-side right"><small>سمت راست</small><Things n={d.a} emoji={d.er} className="small" /><LiveHand side="right" f={f} setF={setF} disabled={solved} size={92} /></div>
        </div>
      </Stage>
      <SideOk ready={countOf(f) + countOf(f2) > 0} caption="نشان دادم" onClick={ok} />
    </>;
  }

  if (d.mode === 'sum') return <>
    <Stage className="mx-center">
      <div className="mx-sum-hands" dir="ltr">
        <Hand side="left" fingers={fingersFor(d.a, d.alt)} size={108} />
        <span className="mx-and">و</span>
        <Hand side="right" fingers={fingersFor(d.b, d.alt)} size={108} />
      </div>
    </Stage>
    <NumAnswer n={d.a + d.b} options={round.options} mode={ansMode(def) as AnsMode} solved={solved} answer={answer}
      hint="اول انگشت‌های یک دست را بشمار، بعد ادامه بده." onRight={() => window.setTimeout(() => say(`${numWord(d.a)} و ${numWord(d.b)} می‌شود ${numWord(d.a + d.b)}`), 300)} />
  </>;

  // fold: کتاب ص ۳۱
  const c = countOf(f);
  return <>
    <Stage className="mx-model-stage">
      <div className="mx-model" dir="ltr">
        <div className="mx-model-src"><div className="mx-row-box">{Array.from({ length: d.a }, (_, i) => <span key={i} className={`mx-obj still small ${phase !== 'raise' && i >= d.a - d.k ? 'leave' : ''}`}><span>{emoji}</span></span>)}</div></div>
        <span className="mx-model-arrow">➜</span>
        <div className="mx-model-dst"><LiveHand f={f} setF={setF} disabled={solved || phase === 'leave' || phase === 'say'} onlyFold={phase === 'fold'} /></div>
      </div>
    </Stage>
    {phase === 'raise' && <><p className="mx-hint-line">✋ چند تا هستند؟ همان‌قدر انگشت باز کن</p>
      <SideOk ready={c > 0} caption="نشان دادم" onClick={() => { if (c === d.a) { sound.playSuccess(); setPhase('leave'); } else answer(false, c < d.a ? 'باز هم انگشت باز کن.' : 'زیاد شد! یکی را ببند.'); }} /></>}
    {phase === 'leave' && <p className="mx-hint-line">خوب نگاه کن... 👀</p>}
    {phase === 'fold' && <><p className="mx-hint-line">✊ به تعداد رفته‌ها، انگشت ببند</p>
      <SideOk ready={c < d.a} caption="بستم" onClick={() => { if (c === d.a - d.k) { sound.playSnap(); setPhase('say'); say('حالا بگو چند تا ماند؟'); } else answer(false, c > d.a - d.k ? 'باز هم ببند؛ به تعداد رفته‌ها.' : 'زیاد بستی! یکی را باز کن.'); }} /></>}
    {phase === 'say' && <><p className="mx-ask">چند تا ماند؟</p><NumAnswer n={d.a - d.k} options={round.options} mode={ansMode(def) as AnsMode} solved={solved} answer={answer} hint="انگشت‌های باز را بشمار." /></>}
  </>;
};

/* ---------- دسته‌های هم‌تعداد را به هم وصل کن (کتاب ص ۶) ---------- */
const PAIR_COLORS = ['#FF7A45', '#2F8FE8', '#2FB165', '#A46BF5', '#E9A400'];
export const GroupMatch: React.FC<RProps> = ({ round, answer, solved }) => {
  const { left, right } = round.data as { left: { n: number; e: string }[]; right: { n: number; e: string }[] };
  const [sel, setSel] = useState<{ side: 'l' | 'r'; i: number } | null>(null);
  const [pairs, setPairs] = useState<[number, number][]>([]);
  const box = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<{ x1: number; y1: number; x2: number; y2: number; c: string }[]>([]);
  useLayoutEffect(() => {
    const calc = () => {
      const el = box.current; if (!el) return;
      // در حالت چرخیدهٔ CSS، مختصات صفحه چرخیده است؛ از offset استفاده می‌کنیم که به چرخش حساس نیست
      const pos = (side: string, i: number) => { const b = el.querySelector<HTMLElement>(`[data-g="${side}${i}"]`); if (!b) return { x: 0, y: 0 };
        return { x: b.offsetLeft + (side === 'l' ? b.offsetWidth : 0), y: b.offsetTop + b.offsetHeight / 2 }; };
      setLines(pairs.map(([l, r], k) => { const a = pos('l', l), b = pos('r', r); return { x1: a.x, y1: a.y, x2: b.x, y2: b.y, c: PAIR_COLORS[k % PAIR_COLORS.length] }; }));
    };
    calc(); window.addEventListener('resize', calc); return () => window.removeEventListener('resize', calc);
  }, [pairs]);
  const pairOf = (side: 'l' | 'r', i: number) => pairs.findIndex(p => (side === 'l' ? p[0] : p[1]) === i);
  const tap = (side: 'l' | 'r', i: number) => {
    if (solved || pairOf(side, i) >= 0) return;
    const g = side === 'l' ? left[i] : right[i];
    say(numWord(g.n));
    if (!sel || sel.side === side) { sound.playPop(); setSel({ side, i }); return; }
    const li = side === 'l' ? i : sel.i, ri = side === 'r' ? i : sel.i;
    if (left[li].n === right[ri].n) {
      const np: [number, number][] = [...pairs, [li, ri]]; setPairs(np); setSel(null); sound.playSnap();
      if (np.length === left.length) window.setTimeout(() => answer(true), 500);
    } else { setSel(null); answer(false, 'هر دو دسته را بشمار؛ باید مثل هم باشند.'); }
  };
  const group = (side: 'l' | 'r', g: { n: number; e: string }, i: number) => {
    const k = pairOf(side, i);
    const c = k >= 0 ? PAIR_COLORS[k % PAIR_COLORS.length] : undefined;
    return <button key={i} type="button" data-g={`${side}${i}`} onClick={() => tap(side, i)}
      className={`mx-gm-box ${sel && sel.side === side && sel.i === i ? 'sel' : ''} ${k >= 0 ? 'paired' : ''}`} style={c ? { borderColor: c, boxShadow: `0 4px 0 ${c}` } : undefined}>
      {Array.from({ length: g.n }, (_, j) => <span key={j}>{g.e}</span>)}
      <i className="mx-gm-dot" style={c ? { background: c } : undefined} />
    </button>;
  };
  return <Stage className="mx-gm-stage">
    <div className="mx-gm" dir="ltr" ref={box}>
      <svg className="mx-gm-lines" aria-hidden="true">{lines.map((l, k) => <line key={k} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke={l.c} strokeWidth={6} strokeLinecap="round" pathLength={1} className="mx-gm-line" />)}</svg>
      <div className="mx-gm-col">{left.map((g, i) => group('l', g, i))}</div>
      <div className="mx-gm-col">{right.map((g, i) => group('r', g, i))}</div>
    </div>
  </Stage>;
};
