import React, { useEffect, useState } from 'react';
import { BLUE, Choices, Expr, GREEN, NumberLine, RED, RProps, Stage, Tally, TenFrame, Things, frameFill, useWrongs } from '../Visuals';
import { numWord, toFa } from '../../../utils/fa';
import { sound } from '../../../utils/audio';
import { OkArt } from '../../shared/ArtButtons';

const say = (t: string) => sound.speakPersian(t);
const opSign = (op: string) => (op === '+' ? '+' : '−');

/* ---------- جمع: شکل ← چوب‌خط ← خانهٔ رنگی ---------- */
export const AddCombine: React.FC<RProps> = ({ round, answer, solved }) => {
  const { a, b, rep } = round.data;
  const s = a + b;
  const emoji = round.objects?.[0] || '🍎';
  const [together, setTogether] = useState(rep === 'tenframe');
  const [order, setOrder] = useState<number[]>([]);
  const [cells, setCells] = useState(0);
  const { wrong, addWrong } = useWrongs<number>();
  const pick = (v: number) => { if (v === s) { answer(true); say(`${numWord(a)} و ${numWord(b)} می‌شود ${numWord(s)}`); } else { addWrong(v); answer(false, rep === 'tally' ? 'دستهٔ پنج‌تایی را یکجا بشمار: پنج، شش، ...' : 'همه را یکی‌یکی بشمار.'); } };
  const merge = () => { sound.playSnap(); setTogether(true); say('حالا همه را بشمار'); };

  if (rep === 'tenframe') {
    const fill = Array.from({ length: 10 }, (_, i) => i < Math.min(cells, a) ? BLUE : i < cells ? GREEN : null);
    const tapCell = () => { if (solved || cells >= s) return; const c = cells + 1; setCells(c); sound.playCount(c); if (c === a) say(`${numWord(a)} تا آبی. حالا سبز`); };
    return <>
      <Stage className="mx-center">
        <Expr parts={[a, '+', b, '=', solved ? s : null]} />
        <TenFrame fill={fill} onCell={tapCell} pulse={cells < s ? [cells] : []} />
        <p className="mx-hint-line">{cells < a ? `🟦 آبی: ${toFa(cells)} از ${toFa(a)}` : cells < s ? `🟩 سبز: ${toFa(cells - a)} از ${toFa(b)}` : 'چند خانه رنگ شد؟'}</p>
      </Stage>
      {cells === s && <Choices options={round.options!} wrong={wrong} disabled={solved} onPick={pick} />}
    </>;
  }
  if (!together) return <>
    <Stage>
      <div className="mx-groups">
        <div className="mx-group">{rep === 'tally' ? <Tally n={a} /> : <Things n={a} emoji={emoji} />}</div>
        <span className="mx-and">و</span>
        <div className="mx-group alt">{rep === 'tally' ? <Tally n={b} color="#2F8FE8" /> : <Things n={b} emoji={emoji} />}</div>
      </div>
      {rep === 'tally' && <Expr parts={[a, '+', b]} />}
    </Stage>
    <div className="mx-tools"><button type="button" className="mx-tool add big" onClick={merge}>{rep === 'tally' ? '🤝 کنار هم بگذار' : '🧺 بریزیم توی یک سبد'}</button></div>
  </>;
  const tap = (i: number) => { if (order.includes(i) || solved) return; const nx = [...order, i]; setOrder(nx); sound.playCount(nx.length); say(numWord(nx.length)); };
  const counted = rep === 'tally' || order.length === s;
  return <>
    <Stage>
      {rep === 'tally' ? <div className="mx-center"><Tally n={s} split={a} /></div>
        : <div className="mx-basket">{Array.from({ length: s }, (_, i) => { const k = order.indexOf(i);
          return <button key={i} type="button" className={`mx-obj ${k >= 0 ? 'counted' : ''} ${i >= a ? 'from-b' : ''}`} onClick={() => tap(i)}><span>{emoji}</span>{k >= 0 && <em>{toFa(k + 1)}</em>}</button>; })}</div>}
      {(rep === 'tally' || solved) && <Expr parts={[a, '+', b, '=', solved ? s : null]} />}
    </Stage>
    {counted ? <Choices options={round.options!} wrong={wrong} disabled={solved} onPick={pick} /> : <p className="mx-hint-line">👆 روی هر کدام بزن و بشمار</p>}
  </>;
};

/* ---------- تفریق: برداشتن ← خط زدن ---------- */
export const TakeAway: React.FC<RProps> = ({ round, answer, solved }) => {
  const { n, k, rep } = round.data;
  const e = round.objects?.[0] || '🐦';
  const [gone, setGone] = useState<number[]>([]);
  const { wrong, addWrong } = useWrongs<number>();
  const take = (i: number) => {
    if (solved || gone.includes(i)) return;
    if (gone.length >= k) { sound.playGentleHint(); say(`فقط ${numWord(k)} تا`); return; }
    const g = [...gone, i]; setGone(g); sound.playPop(); sound.playCount(g.length);
    if (g.length === k) window.setTimeout(() => say('چند تا ماند؟'), 600);
  };
  const ready = gone.length === k;
  return <>
    <Stage>
      {rep === 'tally' ? <div className="mx-center"><Tally n={n} crossed={gone} onStick={take} /></div>
        : <div className="mx-row-box">{Array.from({ length: n }, (_, i) => <button key={i} type="button" className={`mx-obj ${gone.includes(i) ? 'gone' : ''}`} onClick={() => take(i)}><span>{e}</span></button>)}</div>}
      {(rep === 'tally' || solved) && <Expr parts={[n, '−', k, '=', solved ? n - k : null]} />}
    </Stage>
    {ready ? <><p className="mx-ask">چند تا ماند؟</p><Choices options={round.options!} wrong={wrong} disabled={solved}
      onPick={v => { if (v === n - k) { answer(true); say(`${numWord(n)} منهای ${numWord(k)} می‌شود ${numWord(n - k)}`); } else { addWrong(v); answer(false, n - k === 0 ? 'هیچ کدام نماند یعنی صفر.' : 'آن‌هایی را که مانده‌اند بشمار.'); } }} /></>
      : <p className="mx-hint-line">{rep === 'tally' ? `روی ${toFa(k)} چوب‌خط بزن` : `روی ${toFa(k)} تا بزن`} ({toFa(gone.length)})</p>}
  </>;
};

/* ---------- عبارت با کمکِ تصویری ---------- */
export const Expression: React.FC<RProps> = ({ round, answer, solved, mistakes }) => {
  const { a, b, op } = round.data;
  const r = round.answer as number;
  const [help, setHelp] = useState(false);
  const { wrong, addWrong } = useWrongs<number>();
  const showHelp = help || mistakes >= 2;
  return <>
    <Stage className="mx-center">
      <Expr big parts={[a, opSign(op), b, '=', solved ? r : null]} />
      {showHelp && (op === '+'
        ? (a + b <= 10 ? <TenFrame fill={frameFill(a, b, RED, BLUE)} small /> : <Tally n={a + b} split={a} small />)
        : <Things n={a} emoji="🍎" className="small" faded={Array.from({ length: b }, (_, i) => a - 1 - i)} />)}
      {!showHelp && <button type="button" className="mx-link" onClick={() => { sound.playPop(); setHelp(true); }}>🤔 کمک: نشانم بده</button>}
    </Stage>
    <Choices options={round.options!} wrong={wrong} disabled={solved} onPick={v => { if (v === r) answer(true); else { addWrong(v); answer(false, op === '+' ? `از ${toFa(a)} جلو بشمار.` : `از ${toFa(a)} عقب بشمار.`); } }} />
  </>;
};

/* ---------- محور اعداد ---------- */
export const LineJump: React.FC<RProps> = ({ round, answer, solved }) => {
  const { a, k, op, max, guided } = round.data;
  const dir = op === '+' ? 1 : -1;
  const [frog, setFrog] = useState<number | null>(guided ? a : null);
  const [jumps, setJumps] = useState<{ from: number; to: number }[]>([]);
  const { wrong, addWrong } = useWrongs<number>();
  const landed = jumps.length === k;
  const tick = (v: number) => {
    if (solved || landed) return;
    if (frog === null) { if (v === a) { setFrog(a); sound.playSnap(); say(`از ${numWord(a)} شروع کن`); } else answer(false, 'از عدد اول عبارت شروع کن.'); return; }
    if (v === frog + dir) {
      const j = [...jumps, { from: frog, to: v }]; setJumps(j); setFrog(v); sound.playCount(j.length); say(numWord(j.length));
      if (j.length === k && !guided) window.setTimeout(() => answer(true), 500);
    } else if (v === frog - dir) answer(false, op === '+' ? 'جمع یعنی جلو رفتن ➡️' : 'تفریق یعنی عقب رفتن ⬅️');
    else answer(false, 'هر بار فقط یک خانه بپر.');
  };
  return <>
    <Stage>
      {!guided && <Expr parts={[a, opSign(op), k, '=', solved ? a + dir * k : null]} />}
      <NumberLine max={max} frog={frog} jumps={jumps} onTick={tick} hot={frog !== null && !landed ? [frog + dir] : []} />
      <p className="mx-hint-line">{frog === null ? 'قورباغه را روی عدد شروع بگذار' : landed ? 'رسیدی!' : `پرش ${toFa(jumps.length)} از ${toFa(k)}`}</p>
    </Stage>
    {guided && landed && <><Expr parts={[a, opSign(op), k, '=', solved ? a + dir * k : null]} /><Choices options={round.options!} wrong={wrong} disabled={solved}
      onPick={v => { if (v === a + dir * k) answer(true); else { addWrong(v); answer(false, 'قورباغه کجا ایستاده؟'); } }} /></>}
  </>;
};

/* ---------- کل و جزء ---------- */
export const HiddenPart: React.FC<RProps> = ({ round, answer, solved }) => {
  const d = round.data;
  const { wrong, addWrong } = useWrongs<number>();
  const [red, setRed] = useState<boolean[]>(() => Array.from({ length: d.n }, (_, i) => i < Math.ceil(d.n / 2)));
  const [found, setFound] = useState<string[]>([]);
  if (d.mode === 'split') {
    const a = red.filter(Boolean).length, b = d.n - a;
    const save = () => {
      if (solved) return;
      const key = `${a}+${b}`;
      if (found.includes(key)) { sound.playGentleHint(); say('این را پیدا کرده بودی! یک جور دیگر رنگ کن'); return; }
      const f = [...found, key]; setFound(f); sound.playSuccess(); say(`${numWord(a)} و ${numWord(b)} می‌شود ${numWord(d.n)}`);
      if (f.length >= d.need) window.setTimeout(() => answer(true), 700);
    };
    return <>
      <Stage className="mx-center">
        <div className="mx-beads" dir="ltr">{red.map((r, i) => <button key={i} type="button" className={`mx-bead ${r ? 'r' : 'b'}`} onClick={() => { const nr = [...red]; nr[i] = !nr[i]; setRed(nr); sound.playPop(); }} />)}</div>
        <Expr parts={[d.n, '=', a, '+', b]} />
        <div className="mx-found">{found.map(k => <span key={k} dir="ltr">{toFa(d.n)} = {toFa(k.replace('+', ' + '))}</span>)}</div>
      </Stage>
      <p className="mx-hint-line">روی مهره‌ها بزن تا رنگشان عوض شود ({toFa(found.length)} از {toFa(d.need)})</p>
      <OkArt className="mx-ok" ready caption="این یکی را ثبت کن" onClick={save} />
    </>;
  }
  const { n, v } = d;
  return <>
    <Stage className="mx-center">
      <div className="mx-tag">روی هم {toFa(n)} تا</div>
      <div className="mx-beads" dir="ltr">
        {Array.from({ length: v }, (_, i) => <span key={i} className="mx-bead r" />)}
        <span className={`mx-cup ${solved ? 'lift' : ''}`}>{solved ? Array.from({ length: n - v }, (_, i) => <span key={i} className="mx-bead b" />) : <b>🥣</b>}</span>
      </div>
      <Expr parts={[v, '+', solved ? n - v : null, '=', n]} />
    </Stage>
    <Choices options={round.options!} wrong={wrong} disabled={solved} onPick={x => { if (x === n - v) answer(true); else { addWrong(x); answer(false, `از ${toFa(v)} تا ${toFa(n)} چند تا جلو می‌روی؟`); } }} />
  </>;
};

/* ---------- ده را کامل کن ---------- */
export const MakeTen: React.FC<RProps> = ({ round, answer, solved }) => {
  const { k } = round.data;
  const [c, setC] = useState(k);
  const { wrong, addWrong } = useWrongs<number>();
  const tap = () => { if (c >= 10 || solved) return; const n = c + 1; setC(n); sound.playCount(n - k); say(numWord(n)); if (n === 10) window.setTimeout(() => say('ده شد! چند تا آبی گذاشتی؟'), 600); };
  return <>
    <Stage className="mx-center">
      <TenFrame fill={frameFill(k, c - k, RED, BLUE)} onCell={tap} pulse={c < 10 ? [c] : []} />
      <Expr parts={[k, '+', c === 10 && solved ? 10 - k : null, '=', 10]} />
    </Stage>
    {c === 10 ? <Choices options={round.options!} wrong={wrong} disabled={solved} onPick={v => { if (v === 10 - k) answer(true); else { addWrong(v); answer(false, 'خانه‌های آبی را بشمار.'); } }} />
      : <p className="mx-hint-line">روی خانه‌های خالی بزن</p>}
  </>;
};

/* ---------- یک عبارت، چند نمایش ---------- */
const RepCard: React.FC<{ rep: string; a: number; b: number; op: string; emoji: string }> = ({ rep, a, b, op, emoji }) => {
  if (rep === 'tally') return op === '+' ? <div className="mx-groups tight"><Tally n={a} small /><span className="mx-and">و</span><Tally n={b} small color="#2F8FE8" /></div> : <Tally n={a} small crossed={Array.from({ length: b }, (_, i) => a - 1 - i)} />;
  if (rep === 'line') { const to = op === '+' ? a + b : a - b; const js = Array.from({ length: b }, (_, i) => op === '+' ? { from: a + i, to: a + i + 1 } : { from: a - i, to: a - i - 1 });
    return <NumberLine max={Math.max(10, a + (op === '+' ? b : 0))} frog={to} jumps={js} marked={[a]} small />; }
  return op === '+' ? <div className="mx-groups tight"><Things n={a} emoji={emoji} className="small" /><span className="mx-and">و</span><Things n={b} emoji={emoji} className="small" /></div>
    : <Things n={a} emoji={emoji} className="small" faded={Array.from({ length: b }, (_, i) => a - 1 - i)} />;
};
export const RepMatch: React.FC<RProps> = ({ round, answer, solved }) => {
  const { main, cards, op } = round.data;
  const { wrong, addWrong } = useWrongs<number>();
  const r = op === '+' ? main.a + main.b : main.a - main.b;
  return <>
    <Expr big parts={[main.a, opSign(op), main.b, ...(solved ? ['=', r] : [])]} />
    <div className="mx-cards col">{cards.map((c: any, i: number) => <button key={i} type="button" disabled={solved || wrong.includes(i)}
      className={`mx-card wide ${wrong.includes(i) ? 'is-wrong' : ''} ${solved && i === round.answer ? 'is-right' : ''}`}
      onClick={() => { if (i === round.answer) answer(true); else { addWrong(i); answer(false, `این تصویر ${toFa(c.a)} ${opSign(op)} ${toFa(c.b)} است.`); } }}>
      <RepCard rep={c.rep} a={c.a} b={c.b} op={op} emoji={round.objects?.[0] || '🍎'} /></button>)}</div>
  </>;
};

/* ---------- قصهٔ تصویری ---------- */
export const Story: React.FC<RProps> = ({ round, answer, solved, mistakes }) => {
  const { a, b, join, emoji, place, exprs, mode } = round.data;
  const r = round.answer as number;
  const [moved, setMoved] = useState(false);
  const [step, setStep] = useState<'kind' | 'num'>('kind');
  const { wrong, addWrong, reset } = useWrongs<any>();
  useEffect(() => { const t = window.setTimeout(() => { setMoved(true); sound.playSnap(); }, 1800); return () => window.clearTimeout(t); }, []);
  const total = join ? a + b : a;
  return <>
    <Stage className="mx-story">
      <span className="mx-story-place">{place}</span>
      <div className="mx-row-box">{Array.from({ length: total }, (_, i) => {
        const cls = join ? (i >= a ? (moved ? 'arrive' : 'hide') : '') : (i >= a - b && moved ? 'gone' : '');
        return <span key={i} className={`mx-obj still ${cls}`}><span>{emoji}</span></span>;
      })}</div>
      {(step === 'num' && mistakes >= 1) && <NumberLine max={Math.max(10, a + (join ? b : 0))} small marked={[a]} frog={null}
        jumps={Array.from({ length: b }, (_, i) => join ? { from: a + i, to: a + i + 1 } : { from: a - i, to: a - i - 1 })} />}
    </Stage>
    <p className="mx-story-text">{round.question}</p>
    {step === 'kind' && mode === 'solve' && <Choices options={['➕ بیشتر شد', '➖ کمتر شد']} wrong={wrong} disabled={solved || !moved} onPick={(v, i) => {
      if ((i === 0) === join) { sound.playSnap(); say(join ? 'آفرین، اضافه شدند' : 'آفرین، کم شدند'); setStep('num'); reset(); } else { addWrong(v); answer(false, 'قصه را دوباره گوش کن: آمدند یا رفتند؟'); } }} />}
    {step === 'kind' && mode === 'expression' && <div className="mx-cards col">{exprs.map((e: any, i: number) => <button key={i} type="button" disabled={solved || !moved || wrong.includes(i)} className={`mx-card wide ${wrong.includes(i) ? 'is-wrong' : ''}`}
      onClick={() => { const good = e.a === a && e.b === b && e.op === (join ? '+' : '-'); if (good) { sound.playSnap(); setStep('num'); reset(); } else { addWrong(i); answer(false, join ? 'چیزی اضافه شد، پس…' : 'چیزی کم شد، پس…'); } }}>
      <Expr parts={[e.a, opSign(e.op), e.b]} /></button>)}</div>}
    {step === 'num' && <><Expr parts={[a, join ? '+' : '−', b, '=', solved ? r : null]} /><Choices options={round.options!} wrong={wrong} disabled={solved}
      onPick={v => { if (v === r) answer(true); else { addWrong(v); answer(false, 'با تصویر بشمار.'); } }} /></>}
  </>;
};
