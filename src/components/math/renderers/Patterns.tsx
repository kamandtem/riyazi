import React, { useEffect, useMemo, useState } from 'react';
import { Choices, RProps, Stage, useWrongs } from '../Visuals';
import { numWord, toFa } from '../../../utils/fa';
import { sound } from '../../../utils/audio';
import { MOTION_NAMES, PatternToken } from '../../../math/generators';

const say = (t: string) => sound.speakPersian(t);

/* ---------- یک قطعهٔ الگو ---------- */
export const Token: React.FC<{ t: PatternToken; size?: number }> = ({ t, size = 44 }) => {
  if (t.kind === 'picture' || t.kind === 'motion') return <span className="mx-token-emoji" style={{ fontSize: size * .82 }}>{t.v}</span>;
  const c = t.c || '#FF5A5F';
  const s = { width: size, height: size };
  const path = t.v === 'triangle' ? <polygon points="50,8 94,90 6,90" fill={c} />
    : t.v === 'square' ? <rect x="10" y="10" width="80" height="80" rx="10" fill={c} />
    : t.v === 'star' ? <polygon points="50,5 61,38 96,38 68,59 78,93 50,72 22,93 32,59 4,38 39,38" fill={c} />
    : t.v === 'heart' ? <path d="M50 90 C10 60 2 35 20 20 C35 8 48 18 50 28 C52 18 65 8 80 20 C98 35 90 60 50 90Z" fill={c} />
    : <circle cx="50" cy="50" r="42" fill={c} />;
  return <svg viewBox="0 0 100 100" style={{ ...s, maxWidth: '82%', maxHeight: '82%' }} className="mx-token">{path}</svg>;
};

export const Pattern: React.FC<RProps> = ({ round, answer, solved }) => {
  const d = round.data;
  const { wrong, addWrong } = useWrongs<number>();
  useEffect(() => { if (d.kind === 'motion') say(d.seq.map((t: PatternToken) => MOTION_NAMES[t.v]).join('، ')); }, []); // eslint-disable-line
  const ok = (i: number) => { if (i === round.answer) answer(true); else { addWrong(i); answer(false, 'بلند بگو: ' + (d.kind === 'motion' ? 'حرکت‌ها را' : 'قطعه‌ها را') + ' یکی‌یکی. چه چیزی تکرار می‌شود؟'); } };
  const cellsN = d.seq.length + (d.mode === 'next' ? 1 : 0);
  const seqView = (clickable: boolean) => <div className="mx-pattern" dir="ltr" style={{ '--n': cellsN } as React.CSSProperties}>
    {d.seq.map((t: PatternToken, i: number) => {
      if (d.mode === 'gap' && i === d.gap) return <span key={i} className="mx-pat-cell hole">{solved ? <Token t={t} /> : '؟'}</span>;
      const shown = d.mode === 'wrong' && solved && i === round.answer ? d.correct : t;
      return clickable
        ? <button key={i} type="button" disabled={solved || wrong.includes(i)} onClick={() => ok(i)} className={`mx-pat-cell tap ${wrong.includes(i) ? 'is-wrong' : ''} ${solved && i === round.answer ? 'is-right' : ''}`}><Token t={shown} /></button>
        : <span key={i} className="mx-pat-cell" onClick={d.kind === 'motion' ? () => say(MOTION_NAMES[t.v]) : undefined}><Token t={t} /></span>;
    })}
    {d.mode === 'next' && <span className="mx-pat-cell hole">{solved ? <Token t={d.opts[round.answer as number]} /> : '؟'}</span>}
  </div>;
  if (d.mode === 'wrong') return <><Stage className="mx-full">{seqView(true)}</Stage><p className="mx-hint-line">روی قطعه‌ای بزن که جای درستش نیست</p></>;
  if (d.mode === 'unit') return <>
    <Stage className="mx-full">{seqView(false)}</Stage>
    <div className="mx-cards">{d.opts.map((o: PatternToken[], i: number) => <button key={i} type="button" disabled={solved || wrong.includes(i)} onClick={() => ok(i)}
      className={`mx-card unit ${wrong.includes(i) ? 'is-wrong' : ''} ${solved && i === round.answer ? 'is-right' : ''}`} dir="ltr">{o.map((t, k) => <Token key={k} t={t} size={34} />)}</button>)}</div>
  </>;
  return <>
    <Stage className="mx-full">{seqView(false)}</Stage>
    <Choices options={d.opts.map((_: any, i: number) => i)} wrong={wrong} disabled={solved} onPick={(_, i) => ok(i)} render={(_, i) => <Token t={d.opts[i]} />} />
  </>;
};

/* ---------- جدول عددها ----------
 * جهت چیدمان جدول: راست‌به‌چپ مثل خواندن فارسی (عدد ۱ بالا-راست). اگر لازم شد فقط همین ثابت را عوض کنید. */
export const CHART_DIR: 'rtl' | 'ltr' = 'rtl';

export const Chart: React.FC<RProps> = ({ round, answer, solved, mistakes }) => {
  const d = round.data;
  const size: number = d.size;
  const [done, setDone] = useState<number[]>([]);
  const [flash, setFlash] = useState<number | null>(null);
  const { wrong, addWrong, reset } = useWrongs<number>();
  const curAsk = d.mode === 'fill' ? d.ask[done.length] : undefined;
  const fillOpts = useMemo(() => curAsk === undefined ? [] : [curAsk - 1, curAsk, curAsk + 1].filter(v => v > 0).sort(() => Math.random() - .5), [curAsk]); // eslint-disable-line
  const bad = (v: number, hint: string) => { setFlash(v); window.setTimeout(() => setFlash(null), 500); answer(false, hint); };
  const tapCell = (v: number) => {
    if (solved) return;
    if (d.mode === 'find') { if (v === d.target) { answer(true); } else bad(v, mistakes >= 1 ? `در ردیفی بگرد که با ${toFa(Math.floor((d.target - 1) / 10) * 10 + 1)} شروع می‌شود.` : `این ${toFa(v)} است. دوباره بگرد.`); }
    else if (d.mode === 'move') { if (v === d.start + d.delta) answer(true); else bad(v, d.dir === 'down' ? 'پایین رفتن یعنی ده‌تا بیشتر.' : d.dir === 'up' ? 'بالا رفتن یعنی ده‌تا کمتر.' : 'فقط یک خانه!'); }
    else if (d.mode === 'skip') {
      const need: number[] = round.answer as number[];
      if (done.includes(v) || d.shown.includes(v)) return;
      if (v === need[done.length]) { const nd = [...done, v]; setDone(nd); sound.playSnap(); say(numWord(v)); if (nd.length === need.length) answer(true); }
      else bad(v, `از ${toFa(done.length ? done[done.length - 1] : d.shown[d.shown.length - 1])}، ${toFa(d.step)} خانه جلو برو.`);
    }
  };
  const cells = Array.from({ length: size }, (_, i) => i + 1);
  return <>
    <Stage className="mx-chart-stage">
      <div className="mx-chart" dir={CHART_DIR}>{cells.map(v => {
        const hidden = d.mode === 'fill' && d.hidden.includes(v) && !done.includes(v);
        const isAsk = v === curAsk;
        const cls = [
          'mx-chart-cell',
          hidden ? 'hidden' : '', isAsk ? 'ask' : '',
          d.mode === 'move' && v === d.start ? 'start' : '',
          d.mode === 'skip' && (d.shown.includes(v) || done.includes(v)) ? 'painted' : '',
          (d.mode === 'find' && solved && v === d.target) || (d.mode === 'move' && solved && v === d.start + d.delta) ? 'found' : '',
          flash === v ? 'shake' : '',
        ].join(' ');
        return <button key={v} type="button" className={cls} onClick={() => tapCell(v)} disabled={d.mode === 'fill'}>{hidden ? (isAsk ? '؟' : '') : toFa(v)}</button>;
      })}</div>
    </Stage>
    {d.mode === 'fill' && curAsk !== undefined && <Choices options={fillOpts} wrong={wrong} disabled={solved} onPick={v => {
      if (v === curAsk) { sound.playSnap(); say(numWord(v)); const nd = [...done, v]; setDone(nd); reset(); if (nd.length === d.ask.length) answer(true); }
      else { addWrong(v); answer(false, 'به خانهٔ قبل و بعدش نگاه کن؛ یا خانهٔ بالایش.'); }
    }} />}
    {d.mode === 'skip' && solved && <p className="mx-note">دیدی؟ رنگ‌ها یک نظم درست کردند!</p>}
  </>;
};

/* ---------- جدول شگفت‌انگیز ---------- */
const SYM_COLORS = ['#FF5A5F', '#3FA7F5', '#FFC83D', '#39C47A'];
const Sym: React.FC<{ s: number; kind: string }> = ({ s, kind }) => kind === 'colors' ? <i className="mx-sq-color" style={{ background: SYM_COLORS[s] }} /> : <b className="mx-sq-num">{toFa(s + 1)}</b>;

export const LatinSquare: React.FC<RProps> = ({ round, answer, solved }) => {
  const { n, grid, blanks, symbols } = round.data;
  const [vals, setVals] = useState<Record<string, number>>({});
  const open = (blanks as number[][]).filter(([r, c]) => vals[`${r}-${c}`] === undefined);
  const [sel, setSel] = useState<string>(open.length ? `${open[0][0]}-${open[0][1]}` : '');
  const put = (s: number) => {
    if (!sel || solved) return;
    const [r, c] = sel.split('-').map(Number);
    if (grid[r][c] === s) {
      const nv = { ...vals, [sel]: s }; setVals(nv); sound.playSnap();
      const rest = (blanks as number[][]).filter(([rr, cc]) => nv[`${rr}-${cc}`] === undefined);
      if (!rest.length) answer(true); else setSel(`${rest[0][0]}-${rest[0][1]}`);
    } else {
      const inRow = grid[r].some((x: number, cc: number) => cc !== c && x === s && !(blanks as number[][]).some(([br, bc]) => br === r && bc === cc));
      answer(false, inRow ? 'این در همین ردیف هست! یکی دیگر.' : 'این در همین ستون هست! یکی دیگر.');
    }
  };
  return <>
    <Stage className="mx-center">
      <div className="mx-latin" style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }} dir="ltr">
        {grid.map((row: number[], r: number) => row.map((s, c) => {
          const key = `${r}-${c}`;
          const isBlank = (blanks as number[][]).some(([br, bc]) => br === r && bc === c);
          const v = isBlank ? vals[key] : s;
          return <button key={key} type="button" disabled={!isBlank || v !== undefined || solved} onClick={() => setSel(key)}
            className={`mx-latin-cell ${isBlank ? 'blank' : ''} ${sel === key && v === undefined ? 'sel' : ''}`}>{v !== undefined && <Sym s={v} kind={symbols} />}</button>;
        }))}
      </div>
    </Stage>
    <p className="mx-ask">خانهٔ خالی را انتخاب کن و بعد این‌جا بزن</p>
    <div className="mx-choices">{Array.from({ length: n }, (_, s) => <button key={s} type="button" className="mx-choice" disabled={solved} onClick={() => put(s)}><Sym s={s} kind={symbols} /></button>)}</div>
  </>;
};


/* ---------- الگو با رنگ کردن خانه‌ها، همه در یک ردیف (کتاب ص ۴، ۷، ۱۰) ---------- */
export const PatternStrip: React.FC<RProps> = ({ round, answer, solved }) => {
  const { seq, shown, palette, unitLen } = round.data as { seq: string[]; shown: number; palette: string[]; unitLen: number };
  const [filled, setFilled] = useState<string[]>([]);
  const [color, setColor] = useState<string>(palette[0]);
  const cur = shown + filled.length;
  const tap = (i: number) => {
    if (solved || i < cur) return;
    if (i > cur) { sound.playGentleHint(); say('به ترتیب! اول خانهٔ چشمک‌زن'); return; }
    if (color === seq[i]) {
      const nf = [...filled, color]; setFilled(nf); sound.playSnap();
      if (shown + nf.length === seq.length) window.setTimeout(() => answer(true), 350);
    } else answer(false, 'بخش تکرارشونده را بلند بگو؛ بعدی چه رنگی است؟');
  };
  return <>
    <Stage className="mx-full">
      <div className="mx-strip" dir="ltr" style={{ '--n': seq.length } as React.CSSProperties}>
        {seq.map((c, i) => {
          const val = i < shown ? c : filled[i - shown];
          return <button key={i} type="button" onClick={() => tap(i)} className={`mx-strip-cell ${i < shown ? 'given' : ''} ${i === cur && !solved ? 'now' : ''} ${i > 0 && i % unitLen === 0 && i <= shown ? 'unit-edge' : ''}`}
            style={val ? { background: val } : undefined} aria-label="خانه" />;
        })}
      </div>
    </Stage>
    <div className="mx-palette">{palette.map(c => <button key={c} type="button" className={`mx-pal ${color === c ? 'on' : ''}`} style={{ background: c }} onClick={() => { setColor(c); sound.playPop(); }} aria-label="رنگ" />)}</div>
    <p className="mx-hint-line">🎨 رنگ را انتخاب کن، بعد روی خانهٔ چشمک‌زن بزن</p>
  </>;
};
