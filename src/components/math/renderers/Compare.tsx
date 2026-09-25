import React, { useState } from 'react';
import { AnsMode, Choices, NumAnswer, RProps, ShapeSvg, SideOk, Stage, Tally, Things, useWrongs } from '../Visuals';
import { numWord, toFa } from '../../../utils/fa';
import { sound } from '../../../utils/audio';
import { ansMode } from '../../../math/generators';

const say = (t: string) => sound.speakPersian(t);

/** دو ردیف که بعد از جواب، یک‌به‌یک جفت می‌شوند تا «اضافه‌ها» دیده شوند */
const PairRows: React.FC<{ a: number; b: number; ea: string; eb: string; paired: boolean; spread?: 'a' | 'b' | null; onRow?: (r: 'a' | 'b') => void; wrong?: string[]; disabled?: boolean }> =
  ({ a, b, ea, eb, paired, spread, onRow, wrong = [], disabled }) => {
  const row = (r: 'a' | 'b', n: number, e: string, other: number) => {
    const Tag: any = onRow ? 'button' : 'div';
    return <Tag type={onRow ? 'button' : undefined} disabled={onRow ? disabled || wrong.includes(r) : undefined} onClick={onRow ? () => onRow(r) : undefined}
      className={`mx-pair-row ${spread === r && !paired ? 'spread' : ''} ${paired ? 'paired' : ''} ${wrong.includes(r) ? 'is-wrong' : ''}`} dir="ltr">
      {Array.from({ length: n }, (_, i) => <span key={i} className={`mx-pair-item ${paired && i >= other ? 'extra' : ''}`}>{e}</span>)}
      {n === 0 && <span className="mx-pair-empty">هیچی</span>}
    </Tag>;
  };
  return <div className="mx-pairs">{row('a', a, ea, b)}{row('b', b, eb, a)}</div>;
};

export const CompareGroups: React.FC<RProps> = ({ round, def, answer, solved }) => {
  const { a, b, ea, eb, ask, spreadSmall } = round.data;
  const { wrong, addWrong } = useWrongs<string>();
  const pick = (v: string) => { if (v === round.answer) answer(true); else { addWrong(v); answer(false, 'هر کدام از بالا را با یکی از پایین جفت کن.'); } };
  return <>
    <Stage>
      <PairRows a={a} b={b} ea={ea} eb={eb} paired={solved} spread={spreadSmall ? (a < b ? 'a' : 'b') : null} onRow={pick} wrong={wrong} disabled={solved} />
      {solved && <p className="mx-note">{a === b ? 'همه جفت شدند: مساوی‌اند!' : `${def.numerals ? toFa(Math.abs(a - b)) : numWord(Math.abs(a - b))} تا جفت ندارند.`}</p>}
    </Stage>
    <p className="mx-ask">{ask === 'more' ? 'روی دستهٔ بیشتر بزن' : 'روی دستهٔ کمتر بزن'}</p>
    {round.options!.includes('equal') && <Choices options={['🟰 مساوی‌اند']} disabled={solved || wrong.includes('equal')} onPick={() => pick('equal')} small />}
  </>;
};

export const MakeEqual: React.FC<RProps> = ({ round, answer, solved }) => {
  const { n, m, ea, eb } = round.data;
  const [c, setC] = useState(m);
  return <>
    <Stage><PairRows a={n} b={c} ea={ea} eb={eb} paired={solved} /></Stage>
    <div className="mx-tools">
      <button type="button" className="mx-tool add" disabled={solved || c >= 12} onClick={() => { setC(c + 1); sound.playSnap(); }}>➕ یکی بگذار</button>
      <button type="button" className="mx-tool undo" disabled={solved || c <= 0} onClick={() => { setC(c - 1); sound.playPop(); }}>➖ یکی بردار</button>
    </div>
 <SideOk ready caption="مساوی شد" onClick={() => { if (solved) return; if (c === n) answer(true); else answer(false, c < n ? 'پایینی هنوز کمتر است.' : 'پایینی بیشتر شد!'); }} />
  </>;
};

export const CompareSymbol: React.FC<RProps> = ({ round, answer, solved }) => {
  const { a, b, pics, ea, eb } = round.data;
  const { wrong, addWrong } = useWrongs<string>();
  const [chosen, setChosen] = useState<string | null>(null);
  return <>
    <Stage className="mx-center">
      <div className="mx-cmp" dir="ltr">
        <div className="mx-cmp-side">{pics && <Things n={a} emoji={ea} className="small" />}<b>{toFa(a)}</b></div>
        <span className={`mx-cmp-slot ${chosen ? 'on' : ''}`}>{solved ? round.answer : '?'}</span>
        <div className="mx-cmp-side">{pics && <Things n={b} emoji={eb} className="small" />}<b>{toFa(b)}</b></div>
      </div>
      <p className="mx-note">🐊 دهان تمساح همیشه به طرف عدد بزرگ‌تر باز است.</p>
    </Stage>
    <Choices options={round.options!} wrong={wrong} disabled={solved} onPick={v => { setChosen(v); if (v === round.answer) { answer(true); say(v === '=' ? `${numWord(a)} مساوی ${numWord(b)}` : v === '<' ? `${numWord(a)} کمتر از ${numWord(b)}` : `${numWord(a)} بیشتر از ${numWord(b)}`); } else { addWrong(v); answer(false, 'کدام عدد بزرگ‌تر است؟ دهان به طرف آن.'); } }} />
  </>;
};

/* ---------- ده‌تایی و یکی ----------
 * ستون «ده‌تایی» سمت چپ جدول و «یکی» سمت راست، مثل کتاب.
 * یکی‌ها همیشه چوب‌خط‌اند: چهار تا ایستاده و پنجمی کج روی آن‌ها.
 */
const Bundle: React.FC = () => <span className="mx-bundle" aria-label="بستهٔ ده‌تایی">{Array.from({ length: 10 }, (_, i) => <i key={i} />)}<u /></span>;
const PVTable: React.FC<{ tens: number | null; ones: number | null }> = ({ tens, ones }) => <table className="mx-pv" dir="ltr"><thead><tr><th>ده‌تایی</th><th>یکی</th></tr></thead><tbody><tr><td>{tens === null ? '؟' : toFa(tens)}</td><td>{ones === null ? '؟' : toFa(ones)}</td></tr></tbody></table>;
const PVScene: React.FC<{ tens: number; ones: number; animate?: boolean }> = ({ tens, ones, animate }) => <div className="mx-pv-scene" dir="ltr">
  <div className="mx-pv-tens">{tens === 0 ? <span className="mx-pv-empty">—</span> : Array.from({ length: tens }, (_, i) => <Bundle key={i} />)}</div>
  <div className="mx-pv-ones">{ones === 0 ? <span className="mx-pv-empty">—</span> : <Tally n={ones} animateLast={animate} />}</div>
</div>;

export const TensOnes: React.FC<RProps> = ({ round, answer, solved }) => {
  const { n, mode } = round.data;
  const [sel, setSel] = useState<number[]>([]);
  const [bundled, setBundled] = useState(false);
  const [t, setT] = useState(0); const [o, setO] = useState(0);
  const { wrong, addWrong } = useWrongs<number>();
  if (mode === 'read') return <>
    <Stage className="mx-center"><PVScene tens={Math.floor(n / 10)} ones={n % 10} /><PVTable tens={solved ? Math.floor(n / 10) : null} ones={solved ? n % 10 : null} /></Stage>
    <Choices options={round.options!} wrong={wrong} disabled={solved} onPick={v => { if (v === n) { answer(true); say(numWord(n)); } else { addWrong(v); answer(false, 'اول بسته‌های ده‌تایی را بشمار: ده، بیست، ... بعد یکی‌ها.'); } }} />
  </>;
  if (mode === 'bundle') {
    const tap = (i: number) => {
      if (bundled || solved) return;
      if (sel.includes(i)) { setSel(sel.filter(x => x !== i)); sound.playPop(); return; }
      if (sel.length >= 10) return;
      const s2 = [...sel, i]; setSel(s2); sound.playCount(s2.length); say(numWord(s2.length));
      if (s2.length === 10) window.setTimeout(() => { setBundled(true); sound.playSuccess(); say('ده تا شد! یک بستهٔ ده‌تایی'); }, 450);
    };
    return <>
      <Stage className="mx-center">
        {bundled ? <PVScene tens={1} ones={n - 10} /> : <div className="mx-pv-scene" dir="ltr"><div className="mx-pv-ones wide"><Tally n={n} selected={sel} onStick={tap} /></div></div>}
        {bundled && <PVTable tens={1} ones={n - 10} />}
      </Stage>
      {bundled ? <><p className="mx-ask">یک ده‌تایی و {toFa(n - 10)} یکی، چه عددی است؟</p><Choices options={round.options!} wrong={wrong} disabled={solved} onPick={v => { if (v === n) answer(true); else { addWrong(v); answer(false, 'ده و چند تا؟'); } }} /></>
        : <p className="mx-hint-line">روی ده تا چوب‌خط بزن تا زرد شوند ({toFa(sel.length)} از ۱۰)</p>}
    </>;
  }
  const addOne = () => { if (solved) return; if (o + 1 === 10) { setO(0); setT(t + 1); sound.playSuccess(); say('ده تا یکی شد یک ده‌تایی'); } else { setO(o + 1); sound.playSnap(); if (o + 1 === 5) say('پنجمی کج، روی چهار تا'); } };
  return <>
    <div className="mx-target"><b>{toFa(n)}</b></div>
    <Stage className="mx-center">
      <PVScene tens={t} ones={o} animate />
      <PVTable tens={t} ones={o} />
    </Stage>
    <div className="mx-tools">
      <button type="button" className="mx-tool add" disabled={solved || t >= 9} onClick={() => { setT(t + 1); sound.playSnap(); }}>📦 ده‌تایی</button>
      <button type="button" className="mx-tool add alt" disabled={solved} onClick={addOne}>🥢 یکی</button>
      <button type="button" className="mx-tool undo" disabled={solved || (!t && !o)} onClick={() => { if (o) setO(o - 1); else setT(t - 1); sound.playPop(); }}>↩️</button>
    </div>
    <SideOk ready caption="ساختم" onClick={() => { if (solved) return; const v = t * 10 + o; if (v === n) answer(true); else answer(false, v < n ? 'هنوز کم است.' : 'زیاد شد.'); }} />
  </>;
};

/* ---------- بلندتر / کوتاه‌تر ---------- */
export const CompareLength: React.FC<RProps> = ({ round, answer, solved }) => {
  const { items } = round.data;
  const { wrong, addWrong } = useWrongs<number>();
  return <Stage>
    <div className="mx-lengths" dir="ltr">{items.map((it: any, i: number) => <button key={i} type="button" disabled={solved || wrong.includes(i)} onClick={() => { if (i === round.answer) answer(true); else { addWrong(i); answer(false, 'سرهایشان هم‌ترازند؛ به تهِ آن‌ها نگاه کن.'); } }}
      className={`mx-length ${wrong.includes(i) ? 'is-wrong' : ''} ${solved && i === round.answer ? 'is-right' : ''}`}>
      <span className="mx-length-bar" style={{ width: `${it.len * 10}%`, background: it.color }} />
    </button>)}</div>
  </Stage>;
};

export const MeasureUnits: React.FC<RProps> = ({ round, answer, solved }) => {
  const { L, color } = round.data;
  const [c, setC] = useState(0);
  const { wrong, addWrong } = useWrongs<number>();
  const U = 10;
  const put = () => { if (solved || c >= L) return; sound.playSnap(); setC(c + 1); if (c + 1 === L) say('رسید به تهِ مداد'); };
  return <>
    <Stage>
      <div className="mx-measure" dir="ltr">
        <div className="mx-pencil" style={{ width: `${(L / U) * 100}%`, background: color }}><i /></div>
        <div className="mx-clips">{Array.from({ length: c }, (_, i) => <span key={i} style={{ width: `${100 / U}%` }}>📎</span>)}</div>
      </div>
    </Stage>
    {c < L ? <div className="mx-tools"><button type="button" className="mx-tool add" onClick={put}>📎 یک گیره بگذار</button></div>
      : <><p className="mx-ask">مداد چند گیره است؟</p><Choices options={round.options!} wrong={wrong} disabled={solved} onPick={v => { if (v === L) answer(true); else { addWrong(v); answer(false, 'گیره‌ها را بشمار.'); } }} /></>}
  </>;
};

/* ---------- گوشه‌ها ---------- */
export const ShapeCorners: React.FC<RProps> = ({ round, def, answer, solved }) => {
  const { wrong, addWrong } = useWrongs<number>();
  const [marks, setMarks] = useState<number[]>([]);
  if (round.data.shapes) {
    return <div className="mx-cards mx-wide">{round.data.shapes.map((s: any, i: number) => <button key={i} type="button" disabled={solved || wrong.includes(i)}
      className={`mx-card ${wrong.includes(i) ? 'is-wrong' : ''} ${solved && i === round.answer ? 'is-right' : ''}`}
      onClick={() => { if (i === round.answer) answer(true); else { addWrong(i); answer(false, 'گوشه‌های این شکل را بشمار.'); } }}><ShapeSvg id={s.id} color={s.color} rot={s.rot} size={96} /></button>)}</div>;
  }
  const { shape, corners, rot, color } = round.data;
  const done = marks.length === corners;
  return <>
    <Stage className="mx-center"><ShapeSvg id={shape} color={color} rot={rot} marks={marks} size={220}
      onCorner={i => { if (marks.includes(i) || solved) return; const m = [...marks, i]; setMarks(m); sound.playCount(m.length); say(numWord(m.length)); }} /></Stage>
    {done ? <><p className="mx-ask">این شکل چند گوشه دارد؟</p><NumAnswer n={corners} options={round.options} mode={ansMode(def) as AnsMode} solved={solved} answer={answer} hint="نقطه‌های زرد را بشمار." /></>
      : <p className="mx-hint-line">روی نقطه‌های گوشه بزن ({toFa(marks.length)})</p>}
  </>;
};
