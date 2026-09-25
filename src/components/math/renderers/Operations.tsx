import React, { useEffect, useState } from 'react';
import { AnsMode, BLUE, Choices, Expr, GREEN, LineJumpArc, NumAnswer, NumberLine, RED, RProps, SideOk, Stage, Tally, TenFrame, Things, frameFill, useWrongs } from '../Visuals';
import { numWord, toFa } from '../../../utils/fa';
import { sound } from '../../../utils/audio';
import { ansMode } from '../../../math/generators';

const say = (t: string) => sound.speakPersian(t);
const opSign = (op: string) => (op === '+' ? '+' : '−');

/* ---------- جمع: شکل ← چوب‌خط ← خانهٔ رنگی ---------- */
export const AddCombine: React.FC<RProps> = ({ round, def, answer, solved }) => {
  const { a, b, rep } = round.data;
  const num = def.numerals;
  const mode = ansMode(def) as AnsMode;
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
      {rep === 'tally' && num && <Expr parts={[a, '+', b]} />}
    </Stage>
    <div className="mx-tools"><button type="button" className="mx-tool add big" onClick={merge}>{rep === 'tally' ? '🤝 کنار هم بگذار' : '🧺 بریزیم توی یک سبد'}</button></div>
  </>;
  const tap = (i: number) => { if (order.includes(i) || solved) return; const nx = [...order, i]; setOrder(nx); sound.playCount(nx.length); say(numWord(nx.length)); };
  const counted = rep === 'tally' || order.length === s;
  return <>
    <Stage>
      {rep === 'tally' ? <div className="mx-center"><Tally n={s} split={a} animateLast /></div>
        : <div className="mx-basket">{Array.from({ length: s }, (_, i) => { const k = order.indexOf(i);
          return <button key={i} type="button" className={`mx-obj ${k >= 0 ? 'counted' : ''} ${i >= a ? 'from-b' : ''}`} onClick={() => tap(i)}><span>{emoji}</span>{k >= 0 && <em>{toFa(k + 1)}</em>}</button>; })}</div>}
      {num && (rep === 'tally' || solved) && <Expr parts={[a, '+', b, '=', solved ? s : null]} />}
    </Stage>
    {counted ? (mode === 'numeral' ? <Choices options={round.options!} wrong={wrong} disabled={solved} onPick={pick} />
      : <NumAnswer n={s} options={round.options} mode={mode} solved={solved} answer={answer} hint="همه را یکی‌یکی بشمار."
        onRight={() => window.setTimeout(() => say(`${numWord(a)} و ${numWord(b)} می‌شود ${numWord(s)}`), 300)} />)
      : <p className="mx-hint-line">👆 روی هر کدام بزن و بشمار</p>}
  </>;
};

/* ---------- تفریق: برداشتن ← خط زدن ---------- */
export const TakeAway: React.FC<RProps> = ({ round, def, answer, solved }) => {
  const { n, k, rep } = round.data;
  const num = def.numerals;
  const mode = ansMode(def) as AnsMode;
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
      {num && (rep === 'tally' || solved) && <Expr parts={[n, '−', k, '=', solved ? n - k : null]} />}
    </Stage>
    {ready ? <><p className="mx-ask">چند تا ماند؟</p>{mode === 'numeral' ? <Choices options={round.options!} wrong={wrong} disabled={solved}
      onPick={v => { if (v === n - k) { answer(true); say(`${numWord(n)} منهای ${numWord(k)} می‌شود ${numWord(n - k)}`); } else { addWrong(v); answer(false, n - k === 0 ? 'هیچ کدام نماند یعنی صفر.' : 'آن‌هایی را که مانده‌اند بشمار.'); } }} />
      : <NumAnswer n={n - k} options={round.options} mode={mode} solved={solved} answer={answer} hint={n - k === 0 ? 'هیچ کدام نماند یعنی صفر.' : 'آن‌هایی را که مانده‌اند بشمار.'} />}</>
      : <p className="mx-hint-line">{num ? (rep === 'tally' ? `روی ${toFa(k)} چوب‌خط بزن` : `روی ${toFa(k)} تا بزن`) : (rep === 'tally' ? `روی ${numWord(k)} چوب‌خط بزن` : `روی ${numWord(k)} تا بزن`)}</p>}
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

/* ---------- محور اعداد (کتاب ص ۱۱۹) ----------
 * مثل کتاب: برای ۳ + ۲ اول یک کمان از صفر تا ۳، بعد یک کمانِ دوتایی از ۳ تا ۵.
 * زیر محور مکعب‌ها همان عبارت را نشان می‌دهند. تمرین‌های اول فقط پرش یک‌خانه‌ای از صفر یا یک است.
 */
const signLabel = (v: number) => `${v > 0 ? '+' : '−'}${toFa(Math.abs(v))}`;
export const LineJump: React.FC<RProps> = props => props.round.data.mode === 'hop'
  ? <LineHop round={props.round} answer={props.answer} solved={props.solved} />
  : <LineArcs {...props} />;
const LineArcs: React.FC<RProps> = ({ round, answer, solved, mistakes }) => {
  const d = round.data;
  const steps: number[] = d.steps;
  const targets = steps.reduce<number[]>((acc, v, k) => [...acc, (k ? acc[k - 1] : 0) + v], []);
  const [phase, setPhase] = useState(0);
  const [jumps, setJumps] = useState<LineJumpArc[]>([]);
  const pos = phase === 0 ? 0 : targets[phase - 1];
  const done = phase === steps.length;
  const r = targets[targets.length - 1];
  const prompt = (k: number) => k === 0 ? `اول از صفر یک‌جا بپر روی ${numWord(steps[0])}` : steps[k] > 0 ? `حالا ${numWord(steps[k])} تا جلو بپر` : `حالا ${numWord(-steps[k])} تا عقب بپر`;
  const promptFa = (k: number) => k === 0 ? `اول از صفر یک‌جا بپر روی ${toFa(steps[0])}` : steps[k] > 0 ? `حالا ${toFa(steps[k])} تا جلو بپر ➡️` : `حالا ${toFa(-steps[k])} تا عقب بپر ⬅️`;
  useEffect(() => { const t = window.setTimeout(() => say(prompt(0)), 2600); return () => window.clearTimeout(t); }, []); // eslint-disable-line
  const tick = (v: number) => {
    if (solved || done) return;
    const target = targets[phase], s = steps[phase];
    if (v === target) {
      const j = [...jumps, { from: pos, to: v, label: phase === 0 ? toFa(v) : signLabel(s) }];
      setJumps(j); sound.playSnap(); const np = phase + 1; setPhase(np);
      if (np === steps.length) {
        const sentence = steps.map((x, k) => k === 0 ? numWord(x) : `${x > 0 ? 'به‌اضافهٔ' : 'منهای'} ${numWord(Math.abs(x))}`).join(' ');
        window.setTimeout(() => { say(`${sentence} می‌شود ${numWord(r)}`); answer(true); }, 700);
      } else window.setTimeout(() => say(prompt(np)), 450);
      return;
    }
    if (v === pos) { answer(false, 'قورباغه همین‌جاست؛ روی عددی بزن که باید برسد.'); return; }
    if (phase === 0) { answer(false, `عدد اول ${toFa(steps[0])} است؛ از صفر یک‌جا تا ${toFa(steps[0])} بپر.`); return; }
    if (Math.sign(v - pos) !== Math.sign(s)) { answer(false, s > 0 ? 'جمع یعنی جلو رفتن ➡️' : 'تفریق یعنی عقب رفتن ⬅️'); return; }
    answer(false, `از ${toFa(pos)}، ${toFa(Math.abs(s))} تا بشمار؛ هر خانه یکی.`);
  };
  // مکعب‌های زیر محور، مثل کتاب
  const COLS = ['#FF6B5E', '#46B3F5', '#FFC83D'];
  const blocks = steps.map((v, k) => {
    if (k === 0) return { from: 0, to: v, color: COLS[0] };
    const base = targets[k - 1];
    return v > 0 ? { from: base, to: base + v, color: COLS[k % 3] } : null;
  }).filter(Boolean) as { from: number; to: number; color: string; crossFrom?: number }[];
  if (steps.some(v => v < 0)) { const neg = steps.find(v => v < 0)!; blocks[0] = { ...blocks[0], crossFrom: steps[0] + neg }; }
  const helper = mistakes >= 1 && !done && phase > 0 ? Array.from({ length: Math.abs(steps[phase]) }, (_, k) => pos + Math.sign(steps[phase]) * (k + 1)) : [];
  const exprParts: (string | number | null)[] = [];
  steps.forEach((v, k) => { if (k) exprParts.push(v > 0 ? '+' : '−'); exprParts.push(Math.abs(v)); });
  return <>
    <Stage className="mx-full mx-line-stage">
      <Expr parts={[...exprParts, '=', done || solved ? r : null]} />
      <NumberLine max={d.max} frog={pos} jumps={jumps} onTick={tick} blocks={blocks} hot={mistakes >= 2 && !done ? [targets[phase]] : helper} />
    </Stage>
    <p className="mx-hint-line">{done ? `رسیدی به ${toFa(r)}! 🎉` : promptFa(phase)}</p>
  </>;
};

/** آشنایی با محور: هر بار فقط یک خانه */
const LineHop: React.FC<{ round: RProps['round']; answer: RProps['answer']; solved: boolean }> = ({ round, answer, solved }) => {
  const { start, hops, max } = round.data;
  const [pos, setPos] = useState<number>(start);
  const [jumps, setJumps] = useState<LineJumpArc[]>([]);
  const left = hops - jumps.length;
  const tick = (v: number) => {
    if (solved || left <= 0) return;
    if (v === pos + 1) {
      const j = [...jumps, { from: pos, to: v, label: '+۱' }]; setJumps(j); setPos(v); sound.playSnap(); say(numWord(v));
      if (j.length === hops) window.setTimeout(() => { say(`رسیدی به ${numWord(v)}`); answer(true); }, 600);
    } else if (v === pos) answer(false, 'قورباغه همین‌جاست؛ خانهٔ بعدی را بزن.');
    else if (v < pos) answer(false, 'جلو بپر ➡️ نه عقب.');
    else answer(false, 'فقط یک خانه! همان خانهٔ کناری.');
  };
  return <>
    <Stage className="mx-full mx-line-stage">
      <NumberLine max={max} frog={pos} jumps={jumps} onTick={tick} hot={left > 0 ? [pos + 1] : []} />
    </Stage>
    <p className="mx-hint-line">{left > 0 ? `👆 روی خانهٔ بعدی بزن${hops > 1 ? ` (${toFa(jumps.length)} از ${toFa(hops)})` : ''}` : 'آفرین! 🎉'}</p>
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
      <SideOk ready caption="ثبت کن" onClick={save} />
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
  if (rep === 'line') { const to = op === '+' ? a + b : a - b;
    return <NumberLine max={Math.max(10, a + (op === '+' ? b : 0))} frog={to} jumps={[{ from: 0, to: a }, { from: a, to }]} small />; }
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
      {(step === 'num' && mistakes >= 1) && <NumberLine max={Math.max(10, a + (join ? b : 0))} small frog={null}
        jumps={[{ from: 0, to: a }, { from: a, to: join ? a + b : a - b }]} />}
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
