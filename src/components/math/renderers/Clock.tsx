import React, { useRef, useState } from 'react';
import { Choices, RProps, SideOk, Stage, useWrongs } from '../Visuals';
import { numWord, toFa } from '../../../utils/fa';
import { sound } from '../../../utils/audio';

const say = (t: string) => sound.speakPersian(t);

/* ---------- صفحهٔ ساعت ----------
 * فقط ساعت‌های کامل: عقربهٔ بزرگ (آبی، بلند) همیشه روی ۱۲ است.
 * عقربهٔ کوچک (قرمز، کوتاه و پهن) ساعت را نشان می‌دهد و در حالت live کشیدنی است؛
 * زدن روی هر عدد هم عقربهٔ کوچک را همان‌جا می‌برد (pointerdown زاویه را حساب می‌کند).
 */
export const ClockFace: React.FC<{ h: number; swap?: boolean; size?: number; onSet?: (h: number) => void; hot?: boolean }> = ({ h, swap, size = 240, onSet, hot }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const drag = useRef(false);
  const live = !!onSet;
  const hourAt = (e: React.PointerEvent) => {
    const svg = svgRef.current; if (!svg) return null;
    const m = svg.getScreenCTM(); if (!m) return null;
    const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
    const p = pt.matrixTransform(m.inverse());
    const dx = p.x - 100, dy = p.y - 100;
    if (Math.hypot(dx, dy) < 8) return null;
    const deg = (Math.atan2(dx, -dy) * 180 / Math.PI + 360) % 360;
    const v = Math.round(deg / 30) % 12;
    return v === 0 ? 12 : v;
  };
  const move = (e: React.PointerEvent) => { if (!live || !drag.current) return; const v = hourAt(e); if (v && v !== h) { onSet!(v); sound.playSnap(); } };
  const hourAng = (swap ? 0 : h % 12) * 30;
  const minAng = swap ? (h % 12) * 30 : 0;
  return <svg ref={svgRef} viewBox="0 0 200 200" className={`mx-clock ${live ? 'live' : ''} ${hot ? 'hot' : ''}`} style={{ width: size, height: size, touchAction: live ? 'none' : undefined }}
    onPointerDown={live ? e => { drag.current = true; (e.currentTarget as Element).setPointerCapture?.(e.pointerId); move(e); } : undefined}
    onPointerMove={live ? move : undefined}
    onPointerUp={live ? () => { drag.current = false; } : undefined} onPointerCancel={live ? () => { drag.current = false; } : undefined}
    aria-label={`ساعت ${numWord(h)}`}>
    <circle cx={100} cy={100} r={95} fill="#FFC83D" stroke="#7a4a1c" strokeWidth={5} />
    <circle cx={100} cy={100} r={84} fill="#FFFDF7" stroke="#7a4a1c" strokeWidth={2.5} />
    {Array.from({ length: 60 }, (_, k) => { const a = k * 6 * Math.PI / 180; const r1 = k % 5 ? 79 : 74;
      return <line key={k} x1={100 + r1 * Math.sin(a)} y1={100 - r1 * Math.cos(a)} x2={100 + 82 * Math.sin(a)} y2={100 - 82 * Math.cos(a)} stroke="#b08a5a" strokeWidth={k % 5 ? 1.2 : 3} strokeLinecap="round" />; })}
    {Array.from({ length: 12 }, (_, k) => { const v = k + 1; const a = v * 30 * Math.PI / 180; const x = 100 + 60 * Math.sin(a), y = 100 - 60 * Math.cos(a);
      return <g key={v} style={live ? { cursor: 'pointer' } : undefined}>
        {live && <circle cx={x} cy={y} r={15} fill={v === h ? '#FFE07A' : 'transparent'} />}
        <text x={x} y={y + 7} textAnchor="middle" fontSize={20} fontWeight={900} fill={v === 12 ? '#C24524' : '#5a3510'} fontFamily="IRANSansDN,Vazirmatn,Tahoma,sans-serif">{toFa(v)}</text>
      </g>; })}
    {/* عقربهٔ بزرگ (دقیقه) */}
    <g transform={`rotate(${minAng} 100 100)`}><line x1={100} y1={108} x2={100} y2={30} stroke="#2F8FE8" strokeWidth={6} strokeLinecap="round" /><polygon points="100,22 94,34 106,34" fill="#2F8FE8" /></g>
    {/* عقربهٔ کوچک (ساعت) */}
    <g transform={`rotate(${hourAng} 100 100)`} className="mx-clock-hour">
      {live && <line x1={100} y1={100} x2={100} y2={40} stroke="transparent" strokeWidth={30} strokeLinecap="round" />}
      <line x1={100} y1={110} x2={100} y2={56} stroke="#E8473F" strokeWidth={11} strokeLinecap="round" />
      <polygon points="100,44 90,60 110,60" fill="#E8473F" />
    </g>
    <circle cx={100} cy={100} r={8} fill="#5a3510" />
  </svg>;
};

const Legend = () => <p className="mx-clock-legend"><span className="h">●</span> عقربهٔ کوچک: ساعت &nbsp; <span className="m">●</span> عقربهٔ بزرگ: روی ۱۲</p>;

export const Clock: React.FC<RProps> = ({ round, answer, solved, mistakes }) => {
  const d = round.data;
  const { wrong, addWrong } = useWrongs<any>();
  const [cur, setCur] = useState<number>(d.start ?? 12);
  if (d.mode === 'read') return <>
    <Stage className="mx-center mx-clock-stage"><ClockFace h={d.h} /><Legend /></Stage>
    <Choices options={round.options!} wrong={wrong} disabled={solved} render={v => `ساعت ${toFa(v)}`}
      onPick={v => { if (v === d.h) { answer(true); say(`ساعت ${numWord(d.h)}`); } else { addWrong(v); answer(false, 'ببین عقربهٔ کوچکِ قرمز روی کدام عدد است.'); } }} />
  </>;
  if (d.mode === 'pick') return <>
    <Stage className="mx-full mx-clock-stage">
      <div className="mx-clock-row">{d.clocks.map((c: { h: number; swap: boolean }, i: number) => <button key={i} type="button" disabled={solved || wrong.includes(i)}
        className={`mx-card mx-clock-card ${wrong.includes(i) ? 'is-wrong' : ''} ${solved && i === round.answer ? 'is-right' : ''}`}
        onClick={() => { if (i === round.answer) answer(true); else { addWrong(i); answer(false, c.swap ? 'عقربهٔ کوچک ساعت را نشان می‌دهد، نه عقربهٔ بزرگ.' : 'عقربهٔ کوچک باید روی همان عدد باشد.'); } }}>
        <ClockFace h={c.h} swap={c.swap} size={150} /></button>)}</div>
    </Stage>
  </>;
  // set: کودک فقط عقربهٔ کوچک را جابه‌جا می‌کند
  return <>
    <Stage className="mx-center mx-clock-stage">
      <ClockFace h={cur} size={260} hot={!solved} onSet={solved ? undefined : v => { setCur(v); say(numWord(v)); }} />
      <div className="mx-clock-tools">
        <button type="button" className="mx-tool undo" disabled={solved} onClick={() => { const v = cur === 1 ? 12 : cur - 1; setCur(v); sound.playSnap(); say(numWord(v)); }} aria-label="یک ساعت عقب">↺ عقب</button>
        <b className="mx-clock-now">ساعت {toFa(cur)}</b>
        <button type="button" className="mx-tool add" disabled={solved} onClick={() => { const v = cur === 12 ? 1 : cur + 1; setCur(v); sound.playSnap(); say(numWord(v)); }} aria-label="یک ساعت جلو">جلو ↻</button>
      </div>
      <p className="mx-hint-line">عقربهٔ کوچکِ قرمز را بکش یا روی یک عدد بزن</p>
    </Stage>
    <SideOk ready caption="درست شد" onClick={() => {
      if (solved) return;
      if (cur === d.h) { answer(true); say(`ساعت ${numWord(d.h)}`); }
      else answer(false, mistakes >= 1 && d.hint ? d.hint : `الان ساعت ${toFa(cur)} را نشان می‌دهد. عقربهٔ کوچک را روی ${toFa(d.h)} بگذار.`);
    }} />
  </>;
};
