import React, { useState } from 'react';
import { IslandId } from '../math/types';
import { ISLANDS } from '../math/curriculum';
import { EXERCISE_BY_ID } from '../math/exercises';
import { islandOfExercise, islandStats, nextRecommended, useMathProgress } from '../math/progress';
import { sound } from '../utils/audio';
import { toFa } from '../utils/fa';
import { useBackHandler } from '../utils/backNav';
import { MapScreen } from './shared/MapScreen';
import { MapSpot } from './shared/MapSpot';
import { CloseArt, OkArt } from './shared/ArtButtons';

/* همان جای سه جزیره روی نقشهٔ پروژهٔ الفبا */
const PLACES = [
  { asset: '/assets/map-island-1.webp', tone: 'coral', place: { left: 24.38, top: 4.14, w: 41.94, ratio: 1, bb: [16.2, 85.7, 11.5, 88.8] as [number, number, number, number] } },
  { asset: '/assets/map-island-2.webp', tone: 'green', place: { left: 17.40, top: 29.45, w: 63.02, ratio: 1, bb: [21.3, 76.3, 18.2, 88.5] as [number, number, number, number] } },
  { asset: '/assets/map-island-3.webp', tone: 'blue', place: { left: 29.57, top: 61.78, w: 73.03, ratio: 1, bb: [22.7, 73.5, 13.3, 91.2] as [number, number, number, number] } },
];

export const IslandMap: React.FC<{ onIsland: (id: IslandId) => void; onExercise: (id: string) => void; onStart: () => void }> = ({ onIsland, onExercise, onStart }) => {
  const [help, setHelp] = useState(false);
  const p = useMathProgress();
  const rec = EXERCISE_BY_ID[nextRecommended(p)];
  const recIsland = islandOfExercise(rec.id);
  useBackHandler(() => { if (help) { setHelp(false); return; } onStart(); });
  return <MapScreen id="islands" map="/assets/island-map.webp" alt="نقشهٔ جزیره‌های دهکدهٔ ریاضی" overlay={<>
    <header className="map-topbar">
      <button className="map-svg-button" onClick={() => { sound.playPop(); onStart(); }} aria-label="بازگشت به صفحهٔ شروع"><img src="/assets/map-home.svg" alt="خانه" /></button>
      <div className="map-title-ribbon"><small>ماجراجویی من</small><strong>دهکدهٔ ریاضی</strong></div>
      <button className="map-svg-button" onClick={() => { sound.playPop(); setHelp(true); }} aria-label="راهنمای نقشه"><img src="/assets/map-help.svg" alt="راهنما" /></button>
    </header>
    <button className="lesson-chip" onClick={() => { sound.playPop(); onExercise(rec.id); }}><span>🎯 پیشنهاد امروز</span><b className="mx-chip-emoji">{rec.emoji}</b><small>{rec.title}</small></button>
    {help && <div className="map-help-backdrop" role="presentation" onClick={() => setHelp(false)}>
      <section className="map-help-panel" role="dialog" aria-modal="true" onClick={e => e.stopPropagation()}>
        <CloseArt className="map-help-close" onClick={() => setHelp(false)} />
        <div className="map-help-mark">؟</div>
        <h2>راهنمای نقشه</h2>
        <p>سه جزیره داری. هر جزیره پنج خانه دارد و هر خانه چند تمرین کوتاه. دکمهٔ «پیشنهاد امروز» تو را قدم‌به‌قدم در مسیر درست می‌برد.</p>
        <div className="map-help-list">{ISLANDS.map((v, i) => <button key={v.id} onClick={() => { setHelp(false); sound.playPop(); onIsland(v.id); }}><span>{toFa(i + 1)}</span><strong>{v.title}</strong><small>{v.text}</small></button>)}</div>
        <OkArt className="map-help-ok" onClick={() => setHelp(false)} label="فهمیدم، بریم بازی!" caption="فهمیدم، بریم بازی!" />
      </section>
    </div>}
  </>}>
    {ISLANDS.map((v, index) => ({ v, index })).reverse().map(({ v, index }) => {
      const st = islandStats(p, v.id);
      return <MapSpot key={v.id} place={PLACES[index].place} art={PLACES[index].asset} index={index} title={v.title} subtitle={v.subtitle} tone={PLACES[index].tone}
        hint={recIsland === v.id} badge={st.stars ? `★${toFa(st.stars)}` : undefined} onClick={() => { sound.playPop(); onIsland(v.id); }} />;
    })}
  </MapScreen>;
};
