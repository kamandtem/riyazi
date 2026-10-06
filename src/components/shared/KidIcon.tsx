import React from 'react';

/**
 * آیکن‌های کودکانهٔ اختصاصی برنامه (جایگزین همهٔ ایموجی‌های عنوان‌ها).
 * هر آیکن یک «برچسب» گرد و رنگی است با نقاشی ساده، خط دور قهوه‌ای و گاهی صورتک خندان.
 */
const O = '#4A2C12';
const S = { stroke: O, strokeWidth: 2.4, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };
const C = {
  red: '#FF6B6B', orange: '#FF9F43', yellow: '#FFD23F', green: '#4CD17A', teal: '#35C6C0', blue: '#4DA8FF',
  purple: '#A77BFF', pink: '#FF8FC1', brown: '#D39152', skin: '#FFD1A8', white: '#FFFDF7', dark: '#3B3350',
};
const T = { // رنگ زمینهٔ برچسب
  sun: '#FFF1C2', peach: '#FFE2D2', mint: '#DDF7E6', sky: '#DDEFFF', lilac: '#EDE4FF', rose: '#FFE3EF', sand: '#F6E9D5',
};

const Face: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => <g>
  <circle cx={x - 4 * s} cy={y} r={1.7 * s} fill={O} />
  <circle cx={x + 4 * s} cy={y} r={1.7 * s} fill={O} />
  <path d={`M${x - 3 * s} ${y + 3.4 * s}q${3 * s} ${3 * s} ${6 * s} 0`} fill="none" {...S} strokeWidth={2} />
</g>;
const Cheek: React.FC<{ x: number; y: number }> = ({ x, y }) => <circle cx={x} cy={y} r={1.8} fill={C.pink} opacity={.8} />;
const Spark: React.FC<{ x: number; y: number; r?: number; c?: string }> = ({ x, y, r = 3.4, c = C.yellow }) =>
  <path d={`M${x} ${y - r}L${x + r * .32} ${y - r * .32}L${x + r} ${y}L${x + r * .32} ${y + r * .32}L${x} ${y + r}L${x - r * .32} ${y + r * .32}L${x - r} ${y}L${x - r * .32} ${y - r * .32}Z`} fill={c} stroke={O} strokeWidth={1.4} strokeLinejoin="round" />;
const Badge: React.FC<{ kind: '+' | '-' | '2' }> = ({ kind }) => <g>
  <circle cx={37} cy={12} r={7} fill={kind === '-' ? C.red : C.green} {...S} strokeWidth={2} />
  {kind === '2' ? <text x={37} y={15.6} textAnchor="middle" fontSize={10} fontWeight={900} fill={C.white} fontFamily="IRANSansDN,Vazirmatn,Tahoma,sans-serif">۲</text>
    : <path d={kind === '+' ? 'M33.5 12h7M37 8.5v7' : 'M33.5 12h7'} stroke={C.white} strokeWidth={2.6} strokeLinecap="round" />}
</g>;

/* ---------- قطعه‌های تکراری ---------- */
const Palm = ({ fingers, x = 0 }: { fingers: number[]; x?: number }) => <g transform={`translate(${x} 0)`}>
  {[0, 1, 2, 3].map(k => {
    const fx = 15 + k * 5.4; const up = fingers.includes(k + 1);
    return <rect key={k} x={fx} y={up ? 9 + (k === 1 ? -2 : k === 3 ? 4 : 0) : 20} width={5.4} height={up ? 18 : 8} rx={2.7} fill={C.skin} {...S} strokeWidth={2} />;
  })}
  {fingers.includes(0) && <rect x={8} y={23} width={5.4} height={13} rx={2.7} transform="rotate(-38 10.7 29.5)" fill={C.skin} {...S} strokeWidth={2} />}
  <path d="M13 24q0-3 3-3h18q3 0 3 3v8q0 9-9 9h-6q-9 0-9-9z" fill={C.skin} {...S} />
</g>;
const Chick = ({ c = C.yellow }: { c?: string }) => <g>
  <ellipse cx={22} cy={29} rx={12} ry={11} fill={c} {...S} />
  <path d="M19 15q3-5 6 0" fill="none" {...S} strokeWidth={2} />
  <circle cx={22} cy={22} r={8.5} fill={c} {...S} />
  <circle cx={19} cy={21} r={1.6} fill={O} /><circle cx={25} cy={21} r={1.6} fill={O} />
  <path d="M20 24.5l2 2.8 2-2.8z" fill={C.orange} {...S} strokeWidth={1.6} />
  <Cheek x={16.6} y={24.4} /><Cheek x={27.4} y={24.4} />
  <path d="M29 30q4 1 4 5" fill="none" {...S} strokeWidth={2} />
  <path d="M18 40v3M26 40v3" {...S} stroke={C.orange} strokeWidth={2.6} />
</g>;
const Grid = ({ mark }: { mark: 'find' | 'fill' | 'move' | 'skip' }) => <g>
  <rect x={8} y={8} width={32} height={32} rx={7} fill={C.white} {...S} />
  {[18.7, 29.3].map(v => <g key={v}><path d={`M${v} 8v32`} {...S} strokeWidth={1.6} /><path d={`M8 ${v}h32`} {...S} strokeWidth={1.6} /></g>)}
  {mark === 'skip' && <><rect x={10} y={10} width={7} height={7} rx={2} fill={C.orange} /><rect x={20.5} y={20.5} width={7} height={7} rx={2} fill={C.orange} /><rect x={31} y={31} width={7} height={7} rx={2} fill={C.orange} /></>}
  {mark === 'fill' && <><rect x={20.5} y={20.5} width={7} height={7} rx={2} fill={C.yellow} stroke={C.orange} strokeWidth={1.4} strokeDasharray="2 1.4" /><path d="M31 44l8-12 3 2-8 12-4 1z" fill={C.orange} {...S} strokeWidth={1.8} /></>}
  {mark === 'move' && <><rect x={10} y={20.5} width={7} height={7} rx={2} fill={C.blue} /><path d="M17 24h11m-3-3l3 3-3 3" fill="none" {...S} stroke={C.red} strokeWidth={2.4} /></>}
  {mark === 'find' && <><circle cx={31} cy={31} r={7} fill={T.sky} {...S} /><path d="M36 36l6 6" {...S} strokeWidth={3.4} /></>}
</g>;

/* ---------- نقاشی‌ها ---------- */
type Draw = { tone: string; d: React.ReactNode };
const ICONS: Record<string, Draw> = {
  finger: { tone: T.peach, d: <><path d="M13.5 24V8.5a3.6 3.6 0 0 1 7.2 0V24" fill={C.skin} {...S} /><path d="M15.4 9h3.4" {...S} stroke={C.white} strokeWidth={2.2} /><rect x={20} y={19.5} width={6.4} height={10} rx={3.2} fill={C.skin} {...S} strokeWidth={2} /><rect x={25.8} y={20.5} width={6} height={9.5} rx={3} fill={C.skin} {...S} strokeWidth={2} /><rect x={31.2} y={22} width={5.4} height={8.5} rx={2.7} fill={C.skin} {...S} strokeWidth={2} /><path d="M12 26a3.5 3.5 0 0 1 3.5-3.5H34a3.5 3.5 0 0 1 3.5 3.5v5.5a9.5 9.5 0 0 1-9.5 9.5h-6.5A9.5 9.5 0 0 1 12 31.5z" fill={C.skin} {...S} /><path d="M14 29.5h12.5a3 3 0 0 1 0 6H18" fill={C.skin} {...S} strokeWidth={2} /><Spark x={36} y={10} /></> },
  crayon: { tone: T.sun, d: <><path d="M9 36q7-5 12 0t12-2" fill="none" {...S} stroke={C.red} strokeWidth={3} /><g transform="rotate(40 26 20)"><rect x={21} y={10} width={10} height={22} rx={3} fill={C.red} {...S} /><path d="M21 10l5-7 5 7z" fill={C.skin} {...S} /><path d="M24.4 5.2l1.6-2.2 1.6 2.2z" fill={C.red} /><rect x={21} y={16} width={10} height={4} fill={C.white} {...S} strokeWidth={1.6} /></g></> },
  ladybug: { tone: T.mint, d: <><circle cx={24} cy={13} r={6} fill={C.dark} {...S} /><path d="M21 8l-3-4M27 8l3-4" {...S} strokeWidth={2} /><circle cx={24} cy={27} r={13} fill={C.red} {...S} /><path d="M24 15v25" {...S} /><circle cx={18} cy={24} r={2.6} fill={C.dark} /><circle cx={30} cy={24} r={2.6} fill={C.dark} /><circle cx={19} cy={32} r={2.2} fill={C.dark} /><circle cx={29} cy={32} r={2.2} fill={C.dark} /><circle cx={22} cy={12.6} r={1.3} fill={C.white} /><circle cx={26} cy={12.6} r={1.3} fill={C.white} /></> },
  paint: { tone: T.mint, d: <><rect x={7} y={9} width={11} height={11} rx={3} fill={C.green} {...S} /><rect x={20} y={9} width={11} height={11} rx={3} fill={C.green} {...S} /><rect x={7} y={23} width={11} height={11} rx={3} fill={C.white} {...S} /><rect x={20} y={23} width={11} height={11} rx={3} fill={C.white} {...S} /><path d="M33 40l5-17 4 1-3 17z" fill={C.yellow} {...S} strokeWidth={2} /><path d="M38 23l1-5 3 1-1 5z" fill={C.green} {...S} strokeWidth={1.8} /></> },
  palette: { tone: T.lilac, d: <><path d="M24 7C13 7 6 15 6 24c0 9 7 16 15 16 4 0 4-3 3-5-1-3 1-5 4-5h5c5 0 9-3 9-9C42 13 34 7 24 7z" fill={C.white} {...S} /><circle cx={15} cy={21} r={3.4} fill={C.red} {...S} strokeWidth={1.6} /><circle cx={22} cy={14} r={3.4} fill={C.yellow} {...S} strokeWidth={1.6} /><circle cx={31} cy={15} r={3.4} fill={C.blue} {...S} strokeWidth={1.6} /><circle cx={35} cy={23} r={3.4} fill={C.green} {...S} strokeWidth={1.6} /></> },
  bolt: { tone: T.sun, d: <><path d="M27 4L11 27h11l-4 17 19-25H25z" fill={C.yellow} {...S} /><Face x={24} y={22} s={.75} /><Spark x={10} y={11} r={3} c={C.orange} /></> },
  butterfly: { tone: T.rose, d: <><path d="M24 22C18 8 6 9 7 18s11 8 17 4z" fill={C.pink} {...S} /><path d="M24 22c6-14 18-13 17-4s-11 8-17 4z" fill={C.purple} {...S} /><path d="M24 24c-5 3-12 6-11 12s9 1 11-8zM24 24c5 3 12 6 11 12s-9 1-11-8z" fill={C.yellow} {...S} /><rect x={22} y={14} width={4} height={24} rx={2} fill={C.dark} {...S} strokeWidth={1.6} /><path d="M23 14l-3-6M25 14l3-6" {...S} strokeWidth={1.8} /></> },
  one: { tone: T.sky, d: <><rect x={9} y={8} width={30} height={32} rx={9} fill={C.blue} {...S} /><text x={24} y={33} textAnchor="middle" fontSize={24} fontWeight={900} fill={C.white} stroke={O} strokeWidth={1.2} fontFamily="IRANSansDN,Vazirmatn,Tahoma,sans-serif">۱</text><Spark x={38} y={9} /></> },
  fish: { tone: T.sky, d: <><path d="M31 24l10-8v16z" fill={C.orange} {...S} /><ellipse cx={20} cy={24} rx={14} ry={10} fill={C.orange} {...S} /><path d="M20 15q-4 9 0 18" fill="none" {...S} strokeWidth={1.8} /><circle cx={12.5} cy={21.5} r={2} fill={O} /><path d="M9 27q3 2 5 0" fill="none" {...S} strokeWidth={1.8} /><circle cx={9} cy={9} r={2.4} fill={T.sky} {...S} strokeWidth={1.4} /><circle cx={14} cy={5.6} r={1.6} fill={T.sky} {...S} strokeWidth={1.2} /></> },
  bunny: { tone: T.lilac, d: <><rect x={14} y={3} width={7} height={19} rx={3.5} transform="rotate(-10 17.5 12)" fill={C.white} {...S} /><rect x={27} y={3} width={7} height={19} rx={3.5} transform="rotate(10 30.5 12)" fill={C.white} {...S} /><rect x={16.2} y={6} width={2.8} height={12} rx={1.4} transform="rotate(-10 17.5 12)" fill={C.pink} /><rect x={29} y={6} width={2.8} height={12} rx={1.4} transform="rotate(10 30.5 12)" fill={C.pink} /><circle cx={24} cy={29} r={12} fill={C.white} {...S} /><circle cx={19.5} cy={27} r={1.8} fill={O} /><circle cx={28.5} cy={27} r={1.8} fill={O} /><path d="M22.5 31h3l-1.5 1.8z" fill={C.pink} {...S} strokeWidth={1.4} /><path d="M21 34q3 2 6 0" fill="none" {...S} strokeWidth={1.8} /><Cheek x={16.4} y={31.5} /><Cheek x={31.6} y={31.5} /></> },
  box: { tone: T.sand, d: <><path d="M8 20l16-7 16 7v16l-16 7-16-7z" fill={C.brown} {...S} /><path d="M8 20l16 7 16-7M24 27v16" fill="none" {...S} /><path d="M8 20l-3-6 16-6 3 5zM40 20l3-6-16-6-3 5z" fill="#E7B075" {...S} strokeWidth={2} /><Spark x={24} y={7} r={3.4} /></> },
  hand5: { tone: T.peach, d: <Palm fingers={[0, 1, 2, 3, 4]} x={-1} /> },
  hand2: { tone: T.peach, d: <><Palm fingers={[1, 2]} x={-1} /><Spark x={38} y={10} /></> },
  hand1: { tone: T.peach, d: <><Palm fingers={[1]} x={-1} /><Spark x={36} y={12} /></> },
  handsay: { tone: T.mint, d: <><path d="M9 9h26a5 5 0 0 1 5 5v11a5 5 0 0 1-5 5H21l-7 6v-6H9a5 5 0 0 1-5-5V14a5 5 0 0 1 5-5z" fill={C.white} {...S} /><circle cx={14} cy={19.5} r={2.6} fill={C.red} /><circle cx={22} cy={19.5} r={2.6} fill={C.blue} /><circle cx={30} cy={19.5} r={2.6} fill={C.green} /><path d="M38 38q3-3 0-6M42 41q6-6 0-12" fill="none" {...S} stroke={C.orange} strokeWidth={2.4} /></> },
  twohands: { tone: T.peach, d: <><g transform="translate(-6 4) scale(.8)"><Palm fingers={[0, 1, 2, 3, 4]} /></g><g transform="translate(16 4) scale(.8)"><Palm fingers={[1, 2, 3]} /></g></> },
  tally: { tone: T.sand, d: <><rect x={6} y={8} width={36} height={32} rx={7} fill={C.white} {...S} />{[13, 19, 25, 31].map(x => <path key={x} d={`M${x} 14v20`} {...S} stroke={C.brown} strokeWidth={3.2} />)}<path d="M9 30l27-12" {...S} stroke={C.red} strokeWidth={3.2} /></> },
  sticks: { tone: T.sand, d: <>{[13, 17.5, 22, 26.5, 31, 35.5].map(x => <rect key={x} x={x - 2} y={7} width={4} height={34} rx={2} fill="#E9B26A" {...S} strokeWidth={1.8} />)}<rect x={9} y={21} width={30} height={6} rx={3} fill={C.red} {...S} strokeWidth={2} /></> },
  cards: { tone: T.lilac, d: <><rect x={6} y={12} width={18} height={26} rx={5} transform="rotate(-10 15 25)" fill={C.white} {...S} /><rect x={22} y={10} width={18} height={26} rx={5} transform="rotate(8 31 23)" fill={C.purple} {...S} /><circle cx={13} cy={21} r={2.2} fill={C.red} /><circle cx={17} cy={28} r={2.2} fill={C.red} /><text x={31.5} y={28.5} textAnchor="middle" fontSize={14} fontWeight={900} fill={C.white} fontFamily="IRANSansDN,Vazirmatn,Tahoma,sans-serif" transform="rotate(8 31 23)">۲</text></> },
  fivedots: { tone: T.rose, d: <><rect x={5} y={13} width={38} height={22} rx={6} fill={C.white} {...S} />{[0, 1, 2, 3, 4].map(k => <circle key={k} cx={11 + k * 6.5} cy={20} r={2.5} fill={C.red} />)}{[0, 1, 2].map(k => <circle key={k} cx={11 + k * 6.5} cy={28.5} r={2.5} fill={C.blue} />)}<path d="M5 24.5h38" {...S} strokeWidth={1.4} /></> },
  chickplus: { tone: T.sun, d: <><Chick /><Badge kind="+" /></> },
  chickminus: { tone: T.sun, d: <><Chick /><Badge kind="-" /></> },
  chicktwo: { tone: T.sun, d: <><Chick /><Badge kind="2" /></> },
  swap: { tone: T.mint, d: <><Chick c="#FFE27A" /><path d="M34 8a8 8 0 0 1 7 7m0 0l1-4m-1 4l-4-1" fill="none" {...S} stroke={C.green} strokeWidth={2.4} /><path d="M41 22a8 8 0 0 1-5 5m0 0l4 1m-4-1l1-4" fill="none" {...S} stroke={C.red} strokeWidth={2.4} /></> },
  train: { tone: T.sky, d: <><rect x={6} y={18} width={24} height={15} rx={4} fill={C.red} {...S} /><rect x={22} y={10} width={14} height={23} rx={4} fill={C.blue} {...S} /><rect x={25.5} y={14} width={7} height={6} rx={2} fill={C.white} {...S} strokeWidth={1.8} /><path d="M36 26h5v7h-5z" fill={C.yellow} {...S} strokeWidth={2} /><circle cx={12} cy={36} r={4} fill={C.dark} {...S} strokeWidth={2} /><circle cx={27} cy={36} r={4} fill={C.dark} {...S} strokeWidth={2} /><rect x={10} y={12} width={5} height={6} rx={1.5} fill={C.dark} {...S} strokeWidth={1.6} /><circle cx={11} cy={7} r={3} fill={C.white} {...S} strokeWidth={1.4} /></> },
  paw: { tone: T.sand, d: <><path d="M24 24c-6 0-11 6-11 10s4 6 7 5 5-1 8 0 7-1 7-5-5-10-11-10z" fill={C.brown} {...S} /><ellipse cx={12} cy={20} rx={4} ry={5} fill={C.brown} {...S} strokeWidth={2} /><ellipse cx={19.5} cy={12} rx={4} ry={5} fill={C.brown} {...S} strokeWidth={2} /><ellipse cx={28.5} cy={12} rx={4} ry={5} fill={C.brown} {...S} strokeWidth={2} /><ellipse cx={36} cy={20} rx={4} ry={5} fill={C.brown} {...S} strokeWidth={2} /></> },
  rocket: { tone: T.lilac, d: <><path d="M24 4c8 6 10 16 7 26H17C14 20 16 10 24 4z" fill={C.white} {...S} /><circle cx={24} cy={17} r={4.4} fill={C.blue} {...S} strokeWidth={2} /><path d="M17 24l-6 7 3 4 4-5zM31 24l6 7-3 4-4-5z" fill={C.red} {...S} strokeWidth={2} /><path d="M19 31q5 13 10 0z" fill={C.orange} {...S} strokeWidth={2} /><Spark x={9} y={10} r={2.6} /><Spark x={40} y={14} r={2.2} /></> },
  order: { tone: T.sky, d: <>{[[5, 26, 12, C.green, '۱'], [18, 18, 20, C.blue, '۲'], [31, 10, 28, C.purple, '۳']].map(([x, y, h, c, t]) => <g key={t as string}><rect x={x as number} y={y as number} width={12} height={h as number} rx={4} fill={c as string} {...S} strokeWidth={2.2} /><text x={(x as number) + 6} y={(y as number) + 10} textAnchor="middle" fontSize={9} fontWeight={900} fill={C.white} fontFamily="IRANSansDN,Vazirmatn,Tahoma,sans-serif">{t as string}</text></g>)}</> },
  link: { tone: T.mint, d: <><rect x={5} y={16} width={20} height={16} rx={8} fill="none" {...S} stroke={C.green} strokeWidth={5} /><rect x={23} y={16} width={20} height={16} rx={8} fill="none" {...S} stroke={C.blue} strokeWidth={5} /><rect x={5} y={16} width={20} height={16} rx={8} fill="none" stroke={O} strokeWidth={1.2} /><rect x={23} y={16} width={20} height={16} rx={8} fill="none" stroke={O} strokeWidth={1.2} /><Spark x={24} y={9} r={3} /></> },
  clip: { tone: T.sky, d: <><path d="M17 36V14a7 7 0 0 1 14 0v20a4.5 4.5 0 0 1-9 0V16" fill="none" {...S} stroke={C.blue} strokeWidth={4} /><path d="M17 36V14a7 7 0 0 1 14 0v20a4.5 4.5 0 0 1-9 0V16" fill="none" stroke={O} strokeWidth={1.1} /><Spark x={36} y={10} r={3} /></> },
  frog: { tone: T.mint, d: <><ellipse cx={24} cy={29} rx={16} ry={12} fill={C.green} {...S} /><circle cx={15} cy={16} r={6} fill={C.green} {...S} /><circle cx={33} cy={16} r={6} fill={C.green} {...S} /><circle cx={15} cy={16} r={3.2} fill={C.white} /><circle cx={33} cy={16} r={3.2} fill={C.white} /><circle cx={15.6} cy={16.4} r={1.7} fill={O} /><circle cx={33.6} cy={16.4} r={1.7} fill={O} /><path d="M15 30q9 7 18 0" fill="none" {...S} /><Cheek x={12} y={28} /><Cheek x={36} y={28} /></> },
  equal: { tone: T.sky, d: <><circle cx={24} cy={24} r={17} fill={C.blue} {...S} /><rect x={14} y={17} width={20} height={5} rx={2.5} fill={C.white} {...S} strokeWidth={1.6} /><rect x={14} y={26} width={20} height={5} rx={2.5} fill={C.white} {...S} strokeWidth={1.6} /><Spark x={39} y={8} r={3} /></> },
  scale: { tone: T.lilac, d: <><path d="M24 8v28M14 40h20" {...S} strokeWidth={3} /><path d="M8 14h32" {...S} strokeWidth={3} /><circle cx={24} cy={8} r={3} fill={C.yellow} {...S} strokeWidth={1.8} /><path d="M8 14l-5 11h10zM40 14l-5 11h10z" fill="none" {...S} strokeWidth={1.6} /><path d="M3 25a5 3 0 0 0 10 0z" fill={C.red} {...S} strokeWidth={2} /><path d="M35 25a5 3 0 0 0 10 0z" fill={C.blue} {...S} strokeWidth={2} /></> },
  croc: { tone: T.mint, d: <><path d="M6 30l34-14q4 2 1 6L16 30l25 7q3 4-1 6z" fill={C.green} {...S} /><path d="M16 26l3-3 2 3 3-3 2 3 3-3M16 34l3 3 2-3 3 3 2-3 3 3" fill="none" stroke={C.white} strokeWidth={2} strokeLinejoin="round" /><circle cx={12} cy={22} r={3.4} fill={C.white} {...S} strokeWidth={1.8} /><circle cx={12.6} cy={22.4} r={1.5} fill={O} /></> },
  eyes: { tone: T.sky, d: <><ellipse cx={16} cy={24} rx={9} ry={11} fill={C.white} {...S} /><ellipse cx={32} cy={24} rx={9} ry={11} fill={C.white} {...S} /><circle cx={18} cy={26} r={4.4} fill={C.blue} /><circle cx={34} cy={26} r={4.4} fill={C.blue} /><circle cx={18} cy={26} r={2} fill={O} /><circle cx={34} cy={26} r={2} fill={O} /><circle cx={19.4} cy={24.4} r={1} fill={C.white} /><circle cx={35.4} cy={24.4} r={1} fill={C.white} /></> },
  blocks: { tone: T.sun, d: <><rect x={6} y={26} width={14} height={14} rx={3} fill={C.red} {...S} /><rect x={20} y={26} width={14} height={14} rx={3} fill={C.blue} {...S} /><rect x={13} y={12} width={14} height={14} rx={3} fill={C.yellow} {...S} /><rect x={34} y={33} width={8} height={7} rx={2} fill={C.green} {...S} strokeWidth={2} /><Spark x={36} y={14} r={3.4} /></> },
  beads: { tone: T.peach, d: <><path d="M4 28q20-14 40 0" fill="none" {...S} strokeWidth={1.8} />{[[9, 24, C.red], [17, 19.6, C.blue], [25, 18.4, C.red], [33, 19.8, C.blue], [40.5, 24.4, C.red]].map(([x, y, c], k) => <circle key={k} cx={x as number} cy={y as number} r={4.6} fill={c as string} {...S} strokeWidth={2} />)}<Spark x={24} y={36} r={3.4} c={C.orange} /></> },
  stripy: { tone: T.sun, d: <>{[0, 1, 2, 3].map(k => <rect key={k} x={5 + k * 9.8} y={16} width={9} height={16} rx={3} fill={k === 3 ? C.white : [C.red, C.yellow, C.red][k]} {...S} strokeWidth={2} strokeDasharray={k === 3 ? '3 2' : undefined} />)}<Spark x={39.5} y={10} r={3} /></> },
  clap: { tone: T.rose, d: <><g transform="rotate(-18 20 26)"><Palm fingers={[0, 1, 2, 3, 4]} x={-4} /></g><path d="M36 8l3-4M40 14l5-2M38 20l4 2" {...S} stroke={C.orange} strokeWidth={2.4} /></> },
  puzzle: { tone: T.lilac, d: <><path d="M9 15h8a4 4 0 1 1 8 0h8v8a4 4 0 1 1 0 8v8h-8a4 4 0 1 0-8 0H9v-8a4 4 0 1 0 0-8z" fill={C.purple} {...S} /><Face x={21} y={25} s={.8} /></> },
  repeat: { tone: T.mint, d: <><path d="M12 22a12 12 0 0 1 22-5m0 0l1-6m-1 6l-6-1" fill="none" {...S} stroke={C.green} strokeWidth={3.4} /><path d="M36 26a12 12 0 0 1-22 5m0 0l-1 6m1-6l6 1" fill="none" {...S} stroke={C.blue} strokeWidth={3.4} /><circle cx={24} cy={24} r={3.6} fill={C.yellow} {...S} strokeWidth={1.6} /></> },
  magnifier: { tone: T.sky, d: <><path d="M31 31l10 10" {...S} strokeWidth={6} stroke={C.brown} /><path d="M31 31l10 10" stroke={O} strokeWidth={1.2} /><circle cx={21} cy={21} r={13} fill="#BFE3FF" {...S} strokeWidth={3} /><path d="M14 17a8 8 0 0 1 6-5" fill="none" stroke={C.white} strokeWidth={3} strokeLinecap="round" /><circle cx={24} cy={24} r={2.6} fill={C.red} /></> },
  jumps: { tone: T.peach, d: <><path d="M5 38h38" {...S} strokeWidth={2.4} />{[9, 20, 31, 42].map(x => <path key={x} d={`M${x} 35v6`} {...S} strokeWidth={2} />)}<path d="M9 34q5.5-14 11 0M20 34q5.5-14 11 0" fill="none" {...S} stroke={C.orange} strokeWidth={2.6} strokeDasharray="3 3" /><circle cx={36} cy={16} r={6} fill={C.brown} {...S} /><circle cx={34} cy={15} r={1.2} fill={O} /><circle cx={38} cy={15} r={1.2} fill={O} /><path d="M33 8l1-4M39 8l-1-4" {...S} strokeWidth={2.2} /></> },
  gridfind: { tone: T.mint, d: <Grid mark="find" /> },
  gridfill: { tone: T.sun, d: <Grid mark="fill" /> },
  gridmove: { tone: T.sky, d: <Grid mark="move" /> },
  gridskip: { tone: T.peach, d: <Grid mark="skip" /> },
  latin: { tone: T.rose, d: <>{[0, 1, 2].map(r => [0, 1, 2].map(c => { const cols = [C.red, C.blue, C.yellow]; const blank = r === 1 && c === 2; return <rect key={`${r}${c}`} x={7 + c * 11.6} y={7 + r * 11.6} width={10.4} height={10.4} rx={3} fill={blank ? C.white : cols[(r + c) % 3]} {...S} strokeWidth={1.8} strokeDasharray={blank ? '2.4 1.8' : undefined} />; }))}</> },
  latinnum: { tone: T.lilac, d: <>{[0, 1].map(r => [0, 1].map(c => <g key={`${r}${c}`}><rect x={8 + c * 17} y={8 + r * 17} width={15} height={15} rx={4} fill={(r + c) % 2 ? C.purple : C.white} {...S} strokeWidth={2} /><text x={15.5 + c * 17} y={20 + r * 17} textAnchor="middle" fontSize={11} fontWeight={900} fill={(r + c) % 2 ? C.white : O} fontFamily="IRANSansDN,Vazirmatn,Tahoma,sans-serif">{['۱', '۲', '۲', '۱'][r * 2 + c]}</text></g>))}</> },
  triangle: { tone: T.peach, d: <><path d="M24 7L41 38H7z" fill={C.orange} {...S} /><circle cx={24} cy={7} r={3.6} fill={C.yellow} {...S} strokeWidth={1.8} /><circle cx={41} cy={38} r={3.6} fill={C.yellow} {...S} strokeWidth={1.8} /><circle cx={7} cy={38} r={3.6} fill={C.yellow} {...S} strokeWidth={1.8} /><Face x={24} y={27} s={.8} /></> },
  shapes: { tone: T.sky, d: <><rect x={5} y={24} width={16} height={16} rx={3} fill={C.blue} {...S} /><circle cx={34} cy={31} r={9} fill={C.yellow} {...S} /><path d="M22 5l10 16H12z" fill={C.red} {...S} /></> },
  pencils: { tone: T.sun, d: <>{[[14, C.blue, 32], [24, C.red, 22], [34, C.green, 14]].map(([y, c, w]) => <g key={y as number}><rect x={6} y={(y as number) - 3.5} width={w as number} height={7} rx={2} fill={c as string} {...S} strokeWidth={2} /><path d={`M${6 + (w as number)} ${(y as number) - 3.5}l6 3.5-6 3.5z`} fill={C.skin} {...S} strokeWidth={1.8} /></g>)}<path d="M6 40h36" {...S} strokeWidth={2} strokeDasharray="3 3" /></> },
  apple: { tone: T.rose, d: <><path d="M24 15c-4-4-15-3-15 9 0 10 7 17 11 17 2 0 3-1 4-1s2 1 4 1c4 0 11-7 11-17 0-12-11-13-15-9z" fill={C.red} {...S} /><path d="M24 15q-1-6 3-9" fill="none" {...S} /><path d="M26 10q6-5 10-1-5 5-10 1z" fill={C.green} {...S} strokeWidth={2} /><Face x={24} y={26} s={.8} /></> },
  basket: { tone: T.sand, d: <><path d="M13 21a11 11 0 0 1 22 0" fill="none" {...S} stroke={C.brown} strokeWidth={3.4} /><circle cx={18} cy={20} r={4.4} fill={C.red} {...S} strokeWidth={1.8} /><circle cx={27} cy={18} r={4.4} fill={C.orange} {...S} strokeWidth={1.8} /><circle cx={33} cy={21} r={3.6} fill={C.green} {...S} strokeWidth={1.8} /><path d="M7 22h34l-4 18H11z" fill="#E7B075" {...S} /><path d="M10 28h28M12 34h24" {...S} strokeWidth={1.6} /></> },
  mirror: { tone: T.lilac, d: <><rect x={5} y={10} width={16} height={24} rx={5} fill={C.white} {...S} /><rect x={27} y={10} width={16} height={24} rx={5} fill={C.white} {...S} /><circle cx={11} cy={18} r={2.2} fill={C.red} /><circle cx={15} cy={26} r={2.2} fill={C.red} />{[[31, 16], [35, 22], [39, 28]].map(([x, y]) => <path key={x} d={`M${x} ${y - 3}v6`} {...S} strokeWidth={2.2} stroke={C.brown} />)}<path d="M22.5 20h3M22.5 24h3" {...S} strokeWidth={2} /><path d="M24 38v4M14 42h20" {...S} strokeWidth={2} /></> },
  fist: { tone: T.peach, d: <><Palm fingers={[]} x={-1} /><path d="M18 34h8" {...S} strokeWidth={1.8} /><path d="M38 12l-3 5M42 18l-5 2" {...S} stroke={C.orange} strokeWidth={2.4} /></> },
  bird: { tone: T.sky, d: <><path d="M8 26c0-9 7-15 16-15 7 0 12 4 12 10v3l7 2-7 3c-2 7-8 11-16 11-7 0-12-6-12-14z" fill={C.blue} {...S} /><path d="M14 27q7 9 15 1" fill={C.white} {...S} strokeWidth={2} /><circle cx={28} cy={20} r={1.8} fill={O} /><Cheek x={31} y={24.6} /><path d="M20 10q2-5 6-4" fill="none" {...S} strokeWidth={2} /></> },
  scissors: { tone: T.mint, d: <><circle cx={13} cy={34} r={6} fill="none" {...S} stroke={C.red} strokeWidth={3.4} /><circle cx={30} cy={36} r={6} fill="none" {...S} stroke={C.red} strokeWidth={3.4} /><path d="M17 29L38 7M26 31L20 8" {...S} strokeWidth={3.6} stroke="#B9C4D6" /><path d="M17 29L38 7M26 31L20 8" stroke={O} strokeWidth={1.2} /><circle cx={21.5} cy={24} r={1.8} fill={O} /></> },
  balloon: { tone: T.rose, d: <><path d="M24 34q-3 5 2 10" fill="none" {...S} strokeWidth={1.8} /><ellipse cx={24} cy={19} rx={12} ry={14} fill={C.pink} {...S} /><path d="M22 33h4l-2 3z" fill={C.pink} {...S} strokeWidth={1.8} /><path d="M17 13q2-4 6-5" fill="none" stroke={C.white} strokeWidth={3} strokeLinecap="round" /><Face x={24} y={20} s={.8} /></> },
  plus: { tone: T.mint, d: <><rect x={7} y={7} width={34} height={34} rx={11} fill={C.green} {...S} /><path d="M24 15v18M15 24h18" stroke={C.white} strokeWidth={5.6} strokeLinecap="round" /><path d="M24 15v18M15 24h18" stroke={O} strokeWidth={1} strokeLinecap="round" opacity={.25} /><Spark x={39} y={9} r={3.2} /></> },
  minus: { tone: T.peach, d: <><rect x={7} y={7} width={34} height={34} rx={11} fill={C.orange} {...S} /><path d="M15 24h18" stroke={C.white} strokeWidth={5.6} strokeLinecap="round" /><Spark x={39} y={9} r={3.2} /></> },
  bulb: { tone: T.sun, d: <><path d="M24 5a13 13 0 0 0-8 23c2 2 3 4 3 6h10c0-2 1-4 3-6A13 13 0 0 0 24 5z" fill={C.yellow} {...S} /><rect x={18.5} y={34} width={11} height={7} rx={2.5} fill="#B9C4D6" {...S} strokeWidth={2} /><Face x={24} y={18} s={.8} /><path d="M6 12l-3-2M42 12l3-2M5 22H2M43 22h3" {...S} stroke={C.orange} strokeWidth={2.2} /></> },
  bowl: { tone: T.sky, d: <><path d="M6 20h36q0 18-18 18T6 20z" fill={C.blue} {...S} /><path d="M11 26h26" stroke={C.white} strokeWidth={2.4} strokeLinecap="round" opacity={.6} /><circle cx={16} cy={16} r={3.4} fill={C.red} {...S} strokeWidth={1.8} /><circle cx={24} cy={14} r={3.4} fill={C.red} {...S} strokeWidth={1.8} /><text x={32} y={18} fontSize={11} fontWeight={900} fill={O} fontFamily="IRANSansDN,Vazirmatn,Tahoma,sans-serif">؟</text></> },
  ten: { tone: T.lilac, d: <><rect x={4} y={13} width={40} height={22} rx={5} fill={C.brown} {...S} />{[0, 1].map(r => [0, 1, 2, 3, 4].map(c => <circle key={`${r}${c}`} cx={10 + c * 7} cy={19.5 + r * 9} r={2.9} fill={r === 1 && c > 2 ? C.white : r ? C.blue : C.red} stroke={O} strokeWidth={1.2} />))}</> },
  duck: { tone: T.sky, d: <><path d="M6 30q2 10 18 10t18-12q-6 3-12 1-2-4-6-5" fill={C.yellow} {...S} /><circle cx={20} cy={18} r={8} fill={C.yellow} {...S} /><path d="M27 18l7 1-6 3z" fill={C.orange} {...S} strokeWidth={1.8} /><circle cx={21.5} cy={16.6} r={1.7} fill={O} /><Cheek x={23} y={21} /><path d="M3 40q5 3 10 0t10 0 10 0 12 0" fill="none" {...S} stroke={C.blue} strokeWidth={2.4} /></> },
  book: { tone: T.rose, d: <><path d="M24 12Q16 7 6 9v27q10-2 18 3 8-5 18-3V9q-10-2-18 3z" fill={C.white} {...S} /><path d="M24 12v27" {...S} /><path d="M10 16q5-1 10 1M10 22q5-1 10 1M28 17q5-2 10-1M28 23q5-2 10-1" fill="none" {...S} strokeWidth={1.6} stroke={C.purple} /><Spark x={40} y={5} r={3} /></> },
  family: { tone: T.peach, d: <><circle cx={17} cy={16} r={7} fill={C.skin} {...S} /><path d="M5 40q0-14 12-14t12 14z" fill={C.blue} {...S} /><circle cx={33} cy={22} r={5.4} fill={C.skin} {...S} /><path d="M24 40q0-10 9-10t9 10z" fill={C.orange} {...S} /><path d="M11 12q6-6 12 0" fill="none" {...S} stroke={C.brown} strokeWidth={3} /><circle cx={15} cy={16} r={1.1} fill={O} /><circle cx={19} cy={16} r={1.1} fill={O} /><circle cx={31.3} cy={22} r={1} fill={O} /><circle cx={34.7} cy={22} r={1} fill={O} /><path d="M15.4 19q1.6 1.4 3.2 0M31.8 24.6q1.2 1 2.4 0" fill="none" {...S} strokeWidth={1.4} /></> },
  ruler: { tone: T.sun, d: <><rect x={4} y={16} width={40} height={14} rx={3} fill={C.yellow} {...S} />{[10, 16, 22, 28, 34, 40].map((x, k) => <path key={x} d={`M${x} 16v${k % 2 ? 4 : 7}`} {...S} strokeWidth={1.8} />)}<Face x={22} y={25} s={.6} /></> },
  clock: { tone: T.sun, d: <><circle cx={24} cy={25} r={16} fill={C.white} {...S} /><circle cx={24} cy={25} r={12.5} fill="none" stroke={C.yellow} strokeWidth={2} /><path d="M24 25V14" {...S} stroke={C.blue} strokeWidth={2.6} /><path d="M24 25l7 4" {...S} stroke={C.red} strokeWidth={3.4} /><circle cx={24} cy={25} r={2} fill={O} /><path d="M11 12l-3-3M37 12l3-3" {...S} /><Spark x={40} y={38} r={3} /></> },
  star: { tone: T.sun, d: <><path d="M24 5l5.6 11.6 12.8 1.8-9.3 9 2.3 12.6L24 34l-11.4 6 2.3-12.6-9.3-9 12.8-1.8z" fill={C.yellow} {...S} /><Face x={24} y={24} s={.8} /></> },
};

/** آیکن هر تمرین (با شناسهٔ تمرین) */
export const EXERCISE_ICON: Record<string, string> = {
  'count-3': 'finger', 'color-3': 'crayon', 'count-5': 'ladybug', 'color-5': 'paint', 'color-pick': 'palette', 'subitize-3': 'bolt',
  'count-scatter': 'butterfly', 'count-numeral': 'one', 'count-10': 'fish', 'count-check': 'bunny', 'count-on': 'box',
  'finger-pick-3': 'hand2', 'finger-raise-3': 'hand1', 'finger-pick-5': 'hand5', 'finger-raise-5': 'hand5', 'hand-say': 'handsay',
  'two-hands': 'twohands', 'finger-sum': 'twohands', 'tally-5': 'tally', 'tally-10': 'sticks', 'match-rep': 'cards', 'five-and': 'fivedots',
  'one-more': 'chickplus', 'one-less': 'chickminus', 'one-more-less': 'swap', 'add-two': 'chicktwo', 'before-after': 'train',
  'count-forward': 'paw', 'count-back': 'rocket', 'order-cards': 'order',
  'group-match': 'link', 'group-match-5': 'clip', 'more-less': 'frog', 'make-equal': 'equal', 'more-less-equal': 'scale', 'compare-symbol': 'croc',
  'ten-hands': 'twohands', 'bundle-ten-13': 'sticks', 'bundle-ten': 'sticks', 'tens-read': 'eyes', 'build-tens': 'box', 'build-tens-99': 'blocks',
  'strip-ab': 'stripy', 'pattern-next': 'beads', 'strip-abc': 'stripy', 'pattern-motion': 'clap', 'pattern-gap': 'puzzle', 'pattern-unit': 'repeat',
  'pattern-wrong': 'magnifier', 'pattern-number': 'jumps',
  'chart-find': 'gridfind', 'chart-fill': 'gridfill', 'chart-move': 'gridmove', 'chart-skip': 'gridskip',
  'latin-3': 'latin', 'latin-3b': 'latin', 'latin-4': 'latinnum', 'shape-corners': 'triangle', 'shape-which': 'shapes',
  'longer-shorter': 'pencils', 'measure-units': 'clip',
  'add-oral': 'apple', 'add-tally-oral': 'tally', 'add-combine': 'basket', 'add-frame': 'ten', 'add-number': 'plus', 'add-reps': 'mirror', 'add-tally': 'sticks',
  'finger-fold': 'fist', 'take-oral': 'bird', 'take-tally-oral': 'scissors', 'take-away': 'balloon', 'take-tally': 'sticks', 'sub-number': 'minus', 'sub-reps': 'mirror',
  'line-hop': 'frog', 'line-add-small': 'jumps', 'line-add': 'plus', 'line-sub': 'minus', 'line-three': 'paw', 'line-expr': 'bulb',
  'hidden-part': 'bowl', 'split-number': 'palette', 'make-ten': 'ten', 'story-picture': 'duck', 'story-expression': 'book',
  'story-join': 'bird', 'story-leave': 'basket', 'clock-read': 'clock', 'clock-set': 'clock', 'clock-pick': 'clock', 'clock-story': 'clock',
  'strip-aabb': 'stripy', 'pattern-next-3': 'beads', 'pattern-motion-2': 'clap', 'strip-abcd': 'stripy', 'pattern-gap-2': 'puzzle', 'pattern-wrong-2': 'magnifier', 'pattern-number-2': 'jumps',
};
/** آیکن هر خانه */
export const HOUSE_ICON: Record<string, string> = {
  counting: 'finger', building: 'hand5', neighbors: 'train', compare: 'scale', tens: 'sticks',
  patterns: 'beads', chart: 'gridfind', logic: 'puzzle', shapes: 'shapes', measure: 'ruler',
  addition: 'plus', subtraction: 'minus', numberline: 'frog', bonds: 'ten', problems: 'book',
};

export const KidIcon: React.FC<{ name: string; size?: number; className?: string; plain?: boolean }> = ({ name, size = 40, className = '', plain }) => {
  const ic = ICONS[name] || ICONS.star;
  return <svg className={`kid-icon ${className}`} viewBox="0 0 48 48" width={size} height={size} aria-hidden="true" focusable="false">
    {!plain && <rect x={0} y={0} width={48} height={48} rx={15} fill={ic.tone} />}
    <g transform={plain ? undefined : 'translate(4.8 4.8) scale(.8)'}>{ic.d}</g>
  </svg>;
};
export const ExerciseIcon: React.FC<{ id: string; size?: number; className?: string }> = ({ id, size, className }) => <KidIcon name={EXERCISE_ICON[id] || 'star'} size={size} className={className} />;
export const HouseIcon: React.FC<{ id: string; size?: number; className?: string; plain?: boolean }> = ({ id, size, className, plain }) => <KidIcon name={HOUSE_ICON[id] || 'star'} size={size} className={className} plain={plain} />;
