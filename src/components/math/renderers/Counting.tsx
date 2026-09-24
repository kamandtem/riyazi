import React, { useEffect, useMemo, useState } from 'react';
import { Choices, Dice, RProps, RED, BLUE, Stage, Tally, TenFrame, Things, frameFill, useWrongs } from '../Visuals';
import { numWord, toFa } from '../../../utils/fa';
import { sound } from '../../../utils/audio';
import { OkArt } from '../../shared/ArtButtons';

const say = (t: string) => sound.speakPersian(t);
const countTap = (n: number) => { sound.playCount(n); say(numWord(n)); };

/** نمایش یک مقدار با یکی از نمایش‌ها */
export const RepView: React.FC<{ rep: string; v: number; emoji?: string; five?: boolean; small?: boolean }> = ({ rep, v, emoji = '🍎', five, small }) => {
  if (rep === 'dots') return <Dice n={v} small={small} />;
  if (rep === 'tally') return <Tally n={v} small={small} />;
  if (rep === 'tenframe') return <TenFrame fill={five ? frameFill(Math.min(5, v), Math.max(0, v - 5), RED, BLUE) : frameFill(v)} small={small} />;
  if (rep === 'numeral') return <b className="mx-numeral">{toFa(v)}</b>;
  return <Things n={v} emoji={emoji} className={small ? 'small' : ''} />;
};

/* ---------- لمس کن و بشمار ---------- */
export const TapCount: React.FC<RProps> = ({ round, answer, solved }) => {
  const { n, layout, pos } = round.data;
  const emoji = round.objects![0];
  const [order, setOrder] = useState<number[]>([]);
  const { wrong, addWrong } = useWrongs<number>();
  const done = order.length === n;
  const tap = (i: number) => {
    if (solved) return;
    if (order.includes(i)) { sound.playGentleHint(); say('این را شمردی'); return; }
    const next = [...order, i]; setOrder(next); countTap(next.length);
    if (next.length === n) window.setTimeout(() => say('همه چند تا شد؟'), 700);
  };
  return <>
    <Stage className={layout === 'scatter' ? 'mx-scatter' : ''}>
      <div className={layout === 'scatter' ? 'mx-scatter-box' : 'mx-row-box'}>
        {Array.from({ length: n }, (_, i) => {
          const k = order.indexOf(i);
          const st = pos ? { left: `${pos[i].x}%`, top: `${pos[i].y}%` } as React.CSSProperties : undefined;
          return <button key={i} type="button" style={st} className={`mx-obj ${k >= 0 ? 'counted' : ''}`} onClick={() => tap(i)}>
            <span>{emoji}</span>{k >= 0 && <em>{toFa(k + 1)}</em>}
          </button>;
        })}
      </div>
    </Stage>
    {done ? <><p className="mx-ask">همه چند تا؟</p><Choices options={round.options!} wrong={wrong} disabled={solved}
      onPick={v => { if (v === n) answer(true); else { addWrong(v); answer(false, 'عدد آخری که گفتی، یعنی همه.'); } }} /></>
      : <p className="mx-hint-line">👆 {toFa(order.length)} تا شمردی</p>}
  </>;
};

/* ---------- سریع بگو ---------- */
export const Subitize: React.FC<RProps> = ({ round, answer, solved }) => {
  const { n, pattern, flashMs } = round.data;
  const [phase, setPhase] = useState<'ready' | 'show' | 'hidden'>('ready');
  const { wrong, addWrong } = useWrongs<number>();
  const show = () => { sound.playPop(); setPhase('show'); window.setTimeout(() => setPhase('hidden'), flashMs); };
  return <>
    <Stage className="mx-center">
      {phase === 'ready' && <button type="button" className="mx-big-btn" onClick={show}>👀 نشانم بده</button>}
      {phase === 'show' && (pattern === 'dice' ? <Dice n={n} /> : <TenFrame fill={frameFill(n)} />)}
      {phase === 'hidden' && <div className="mx-cover">❓<button type="button" className="mx-link" onClick={show}>یک بار دیگر ببینم</button></div>}
      {solved && (pattern === 'dice' ? <Dice n={n} small /> : <TenFrame fill={frameFill(n)} small />)}
    </Stage>
    {phase === 'hidden' && <Choices options={round.options!} wrong={wrong} disabled={solved} onPick={v => { if (v === n) answer(true); else { addWrong(v); answer(false, 'دوباره نگاه کن، نقطه‌ها را دسته‌دسته ببین.'); } }} />}
  </>;
};

/* ---------- خرگوش درست شمرد؟ ---------- */
export const CountCheck: React.FC<RProps> = ({ round, answer, solved }) => {
  const { n, badges, kind, bad } = round.data;
  const emoji = round.objects![0];
  const [step, setStep] = useState<'judge' | 'find'>('judge');
  const why = kind === 'skip' ? 'یکی را جا انداخت!' : kind === 'double' ? 'یکی را دو بار شمرد!' : 'از روی یک عدد پرید!';
  return <>
    <Stage>
      <div className="mx-row-box">
        {Array.from({ length: n }, (_, i) => <button key={i} type="button" disabled={step !== 'find' || solved} className={`mx-obj counted ${solved && i === bad ? 'is-bad' : ''}`}
          onClick={() => { if (i === bad) answer(true); else answer(false, 'به عددهای روی هر کدام دقت کن.'); }}>
          <span>{emoji}</span>{badges[i].map((b: number, k: number) => <em key={k} className={k ? 'second' : ''}>{toFa(b)}</em>)}
          {badges[i].length === 0 && <em className="none">؟</em>}
        </button>)}
      </div>
    </Stage>
    <p className="mx-ask">{step === 'judge' ? '🐰 درست شمرد؟' : `کجا اشتباه کرد؟ روی همان بزن. ${solved ? why : ''}`}</p>
    {step === 'judge' && <Choices options={['✅ درست', '❌ اشتباه']} disabled={solved} onPick={(_, i) => {
      if (i === 0) { if (bad === null) answer(true); else answer(false, 'خوب نگاه کن، یک جای کار می‌لنگد!'); }
      else { if (bad === null) answer(false, 'دوباره بشمار، خرگوش درست گفته بود.'); else { sound.playPop(); setStep('find'); say('کجا اشتباه کرد؟'); } }
    }} />}
  </>;
};

/* ---------- ادامه بشمار ---------- */
export const CountOn: React.FC<RProps> = ({ round, answer, solved }) => {
  const { s, k } = round.data;
  const emoji = round.objects![0];
  const [order, setOrder] = useState<number[]>([]);
  const { wrong, addWrong } = useWrongs<number>();
  const tap = (i: number) => { if (order.includes(i) || solved) return; const nx = [...order, i]; setOrder(nx); countTap(s + nx.length); };
  return <>
    <Stage className="mx-counton">
      <button type="button" className="mx-box" onClick={() => say(`توی جعبه ${numWord(s)} تا هست. از بعدش بشمار`)}><span>📦</span><b>{toFa(s)}</b></button>
      <span className="mx-plus">+</span>
      <div className="mx-row-box">{Array.from({ length: k }, (_, i) => { const o = order.indexOf(i);
        return <button key={i} type="button" className={`mx-obj ${o >= 0 ? 'counted' : ''}`} onClick={() => tap(i)}><span>{emoji}</span>{o >= 0 && <em>{toFa(s + o + 1)}</em>}</button>; })}</div>
    </Stage>
    {order.length === k ? <Choices options={round.options!} wrong={wrong} disabled={solved} onPick={v => { if (v === s + k) answer(true); else { addWrong(v); answer(false, `از ${toFa(s)} شروع کن و جلو برو.`); } }} />
      : <p className="mx-hint-line">بگو «{numWord(s)}» و بعد روی تازه‌ها بزن</p>}
  </>;
};

/* ---------- بساز ---------- */
export const BuildSet: React.FC<RProps> = ({ round, answer, solved }) => {
  const { n, rep } = round.data;
  const emoji = round.objects?.[0] || '🍎';
  const [c, setC] = useState(0);
  const cap = rep === 'tally' ? 20 : 10;
  const add = () => { if (c >= cap || solved) return; const v = c + 1; setC(v); sound.playSnap(); countTap(v); };
  const rem = () => { if (c <= 0 || solved) return; setC(c - 1); sound.playPop(); };
  return <>
    <div className="mx-target"><b>{toFa(n)}</b><small>{rep === 'tally' ? 'چوب‌خط' : 'تا'}</small></div>
    <Stage className="mx-center">
      {rep === 'tally'
        ? <div className="mx-tally-board" onClick={rem}><Tally n={c} />{c === 0 && <small>هنوز چیزی نکشیدی</small>}</div>
        : <div className="mx-plate">{Array.from({ length: 10 }, (_, i) => <button key={i} type="button" className="mx-plate-cell" onClick={() => i < c && rem()}>{i < c ? emoji : ''}</button>)}</div>}
    </Stage>
    <div className="mx-tools">
      <button type="button" className="mx-tool add" onClick={add}>{rep === 'tally' ? '✏️ یک چوب‌خط' : <>🧺 یکی بگذار {emoji}</>}</button>
      <button type="button" className="mx-tool undo" onClick={rem} disabled={!c}>↩️ یکی بردار</button>
    </div>
    <OkArt className="mx-ok" ready={c > 0} caption="تمام شد" onClick={() => { if (solved) return; if (c === n) answer(true); else answer(false, c < n ? 'هنوز کم است، باز هم بگذار.' : 'زیاد شد! یکی بردار.'); }} />
  </>;
};

/* ---------- کدام کارت؟ / این چه عددی است؟ ---------- */
export const MatchRep: React.FC<RProps> = ({ round, answer, solved }) => {
  const { wrong, addWrong } = useWrongs<number>();
  if (round.data.cards) {
    const { n, cards } = round.data;
    return <>
      <div className="mx-target"><b>{toFa(n)}</b></div>
      <div className="mx-cards">{cards.map((c: any, i: number) => <button key={i} type="button" disabled={solved || wrong.includes(i)} className={`mx-card ${wrong.includes(i) ? 'is-wrong' : ''} ${solved && i === round.answer ? 'is-right' : ''}`}
        onClick={() => { if (i === round.answer) answer(true); else { addWrong(i); answer(false, 'این کارت را بشمار.'); } }}><RepView rep={c.rep} v={c.v} emoji={round.objects?.[0]} small /></button>)}</div>
    </>;
  }
  const { n, rep, fiveStructure } = round.data;
  return <>
    <Stage className="mx-center"><RepView rep={rep} v={n} five={fiveStructure} />{fiveStructure && solved && <p className="mx-note" dir="rtl">پنج و {toFa(n - 5)} می‌شود {toFa(n)}</p>}</Stage>
    <Choices options={round.options!} wrong={wrong} disabled={solved} onPick={v => { if (v === n) { answer(true); if (fiveStructure) say(`پنج و ${numWord(n - 5)} می‌شود ${numWord(n)}`); } else { addWrong(v); answer(false, fiveStructure ? 'ردیف بالا پنج تاست؛ از شش ادامه بده.' : 'دوباره بشمار.'); } }} />
  </>;
};

/* ---------- یکی آمد / یکی رفت ---------- */
export const OneMoreLess: React.FC<RProps> = ({ round, answer, solved }) => {
  const { n, op } = round.data;
  const emoji = round.objects![0];
  const [moved, setMoved] = useState(false);
  const { wrong, addWrong } = useWrongs<number>();
  useEffect(() => { const t = window.setTimeout(() => { setMoved(true); sound.playSnap(); }, 1500); return () => window.clearTimeout(t); }, []);
  const shown = op > 0 ? (moved ? n + 1 : n) : n;
  return <>
    <Stage>
      <div className="mx-tag">اینجا {toFa(n)} تا بود</div>
      <div className="mx-row-box">{Array.from({ length: shown }, (_, i) => <span key={i} className={`mx-obj still ${op > 0 && moved && i === n ? 'arrive' : ''} ${op < 0 && moved && i === n - 1 ? 'leave' : ''}`}><span>{emoji}</span></span>)}</div>
    </Stage>
    {moved ? <Choices options={round.options!} wrong={wrong} disabled={solved} onPick={v => { if (v === n + op) answer(true); else { addWrong(v); answer(false, op > 0 ? `یکی بیشتر از ${toFa(n)}؟` : `یکی کمتر از ${toFa(n)}؟`); } }} />
      : <p className="mx-hint-line">خوب نگاه کن... 👀</p>}
  </>;
};

/* ---------- جای خالی دنباله / قطار / موشک ---------- */
export const SequenceGap: React.FC<RProps> = ({ round, answer, solved }) => {
  const { seq, gaps, theme, step, showJumps } = round.data;
  const [filled, setFilled] = useState<number[]>([]);
  const cur = gaps[filled.length];
  const { wrong, addWrong, reset } = useWrongs<number>();
  const opts = useMemo(() => {
    if (cur === undefined) return [];
    const v = seq[cur]; const s = step || 1;
    return [v - s, v, v + s].filter(x => x >= 0).sort(() => Math.random() - .5);
  }, [cur]); // eslint-disable-line
  const icon = theme === 'train' ? '🚃' : theme === 'rocket' ? '🚀' : theme === 'jumps' ? '🦘' : '🪨';
  return <>
    <Stage className={`mx-seq theme-${theme}`}>
      {theme === 'train' && <span className="mx-seq-engine">🚂</span>}
      <div className="mx-seq-row" dir="ltr">
        {seq.map((v: number, i: number) => {
          const gi = gaps.indexOf(i);
          const isGap = gi >= 0; const show = !isGap || gi < filled.length;
          return <React.Fragment key={i}>
            {showJumps && i > 0 && <span className="mx-jump">+{toFa(step)}</span>}
            <span className={`mx-seq-cell ${isGap ? 'gap' : ''} ${i === cur ? 'now' : ''}`}><i>{icon}</i><b>{show ? toFa(v) : '؟'}</b></span>
          </React.Fragment>;
        })}
      </div>
    </Stage>
    {cur !== undefined && <Choices options={opts} wrong={wrong} disabled={solved} onPick={v => {
      if (v === seq[cur]) { sound.playSnap(); say(numWord(v)); const f = [...filled, v]; setFilled(f); reset(); if (f.length === gaps.length) answer(true); }
      else { addWrong(v); answer(false, 'به عددهای کناری نگاه کن.'); }
    }} />}
  </>;
};

/* ---------- از کوچک به بزرگ ---------- */
export const OrderCards: React.FC<RProps> = ({ round, answer, solved }) => {
  const cards: number[] = round.data.cards;
  const sorted = round.answer as number[];
  const [placed, setPlaced] = useState<number[]>([]);
  const [shake, setShake] = useState<number | null>(null);
  const tap = (v: number) => {
    if (solved || placed.includes(v)) return;
    if (v === sorted[placed.length]) { const p = [...placed, v]; setPlaced(p); sound.playSnap(); say(numWord(v)); if (p.length === sorted.length) answer(true); }
    else { setShake(v); window.setTimeout(() => setShake(null), 500); answer(false, 'کوچک‌ترینِ عددهای باقی‌مانده کدام است؟'); }
  };
  return <>
    <Stage>
      <div className="mx-slots" dir="ltr">{sorted.map((_, i) => <span key={i} className={`mx-slot ${placed[i] !== undefined ? 'on' : ''}`}>{placed[i] !== undefined ? toFa(placed[i]) : ''}</span>)}</div>
      <p className="mx-note" dir="ltr">کوچک‌تر ➜ ➜ بزرگ‌تر</p>
    </Stage>
    <div className="mx-choices">{cards.map(v => <button key={v} type="button" disabled={placed.includes(v) || solved} className={`mx-choice ${shake === v ? 'shake' : ''} ${placed.includes(v) ? 'used' : ''}`} onClick={() => tap(v)}>{toFa(v)}</button>)}</div>
  </>;
};
