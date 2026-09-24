import React, { useEffect, useState } from 'react';
import { HouseId, IslandId } from '../../math/types';
import { HOUSES, ISLANDS } from '../../math/curriculum';
import { EXERCISE_BY_ID, exercisesOfHouse } from '../../math/exercises';
import { houseStats, isMastered, nextRecommended, useMathProgress } from '../../math/progress';
import { sound } from '../../utils/audio';
import { toFa } from '../../utils/fa';
import { useBackHandler } from '../../utils/backNav';
import { setStatusBarColor } from '../../utils/native';
import { MapScreen } from '../shared/MapScreen';
import { MapSpot, SpotPlace } from '../shared/MapSpot';
import { CloseArt } from '../shared/ArtButtons';
import { HouseScreen } from './HouseScreen';
import { ExerciseRunner } from './ExerciseRunner';

const HR = 258 / 246;
/** جای ۵ خانه روی نقشهٔ دهکده (همان نقاشی‌ها و جای‌های پروژهٔ الفبا) */
const PLACES: { asset: string; place: SpotPlace }[] = [
  { asset: '/assets/letters-house-4.webp', place: { left: 23.70, top: 5.92, w: 44.46, ratio: HR, bb: [19.2, 80.0, 22.1, 70.1] } },
  { asset: '/assets/letters-house-3.webp', place: { left: 43.11, top: 22.66, w: 44.12, ratio: HR, bb: [19.0, 75.7, 9.7, 79.2] } },
  { asset: '/assets/letters-house-5.webp', place: { left: 21.16, top: 37.86, w: 44.31, ratio: HR, bb: [20.0, 82.2, 10.0, 90.6] } },
  { asset: '/assets/letters-house-2.webp', place: { left: 41.24, top: 54.56, w: 43.76, ratio: HR, bb: [11.0, 87.3, 17.3, 73.9] } },
  { asset: '/assets/letters-house-1.webp', place: { left: 41.13, top: 75.40, w: 43.56, ratio: HR, bb: [16.0, 89.0, 23.2, 75.8] } },
];

export interface IslandRoute { house: HouseId | null; ex: string | null }

export const IslandScreen: React.FC<{ island: IslandId; route: IslandRoute; go: (r: IslandRoute) => void; onBack: () => void; onHome: () => void }> = ({ island, route, go, onBack, onHome }) => {
  const def = ISLANDS.find(i => i.id === island)!;
  const p = useMathProgress();
  const [help, setHelp] = useState(false);
  useBackHandler(() => { if (help) { setHelp(false); return; } if (route.ex) { go({ house: route.house, ex: null }); return; } if (route.house) { go({ house: null, ex: null }); return; } onBack(); });
  useEffect(() => { setStatusBarColor(route.house ? '#FFD25A' : '#57C3F1'); }, [route.house]);

  if (route.house && route.ex) {
    const ex = EXERCISE_BY_ID[route.ex];
    const list = exercisesOfHouse(route.house);
    const idx = list.findIndex(e => e.id === ex.id);
    const next = list[idx + 1];
    return <ExerciseRunner key={ex.id} def={ex} onExit={() => go({ house: route.house, ex: null })} onHome={onHome}
      onNext={next ? () => go({ house: route.house, ex: next.id }) : undefined} nextTitle={next?.title} />;
  }
  if (route.house) return <HouseScreen house={HOUSES[route.house]} onBack={() => go({ house: null, ex: null })} onHome={onHome} onPick={id => go({ house: route.house, ex: id })} />;

  const rec = nextRecommended(p);
  const recHere = def.houses.includes(EXERCISE_BY_ID[rec].house) ? EXERCISE_BY_ID[rec] : null;
  const tone = island === 'numbers' ? 'coral' : island === 'order' ? '' : 'coral';
  return <MapScreen id={`island-${island}`} map="/assets/letters-map.webp" alt={`مسیر ${def.title}`} overlay={<>
    <header className="map-topbar">
      <button className="kid-back-btn big" onClick={() => { sound.playPop(); onBack(); }} aria-label="بازگشت به نقشهٔ جزیره‌ها"><img className="kid-back-art" src="/assets/ui/btn-back.svg" alt="" draggable={false} /></button>
      <div className={`map-title-ribbon ${tone}`}><small>{def.subtitle}</small><strong>{def.title}</strong></div>
      <button className="map-svg-button" onClick={() => { sound.playPop(); setHelp(true); }} aria-label="راهنما"><img src="/assets/letters-help.svg" alt="راهنما" /></button>
    </header>
    {recHere && <button className="lesson-chip" onClick={() => { sound.playPop(); go({ house: recHere.house, ex: recHere.id }); }}><span>🎯 پیشنهاد امروز</span><b className="mx-chip-emoji">{recHere.emoji}</b><small>{recHere.title}</small></button>}
    {help && <div className="letters-help-backdrop" onClick={() => setHelp(false)}><section className="letters-help-panel" role="dialog" aria-modal="true" onClick={e => e.stopPropagation()}>
      <CloseArt className="letters-help-close" onClick={() => setHelp(false)} />
      <div className="letters-help-mark">؟</div><h2>{def.title}</h2>
      <p>{def.text}</p>
      <div className="letters-help-list">{def.houses.map((h, i) => <button key={h} onClick={() => { setHelp(false); sound.playPop(); go({ house: h, ex: null }); }}><span>{toFa(i + 1)}</span><b>{HOUSES[h].title}</b><small>{HOUSES[h].text}</small></button>)}</div>
    </section></div>}
  </>}>
    {def.houses.map((h, i) => ({ h, i })).reverse().map(({ h, i }) => {
      const st = houseStats(p, h);
      const all = exercisesOfHouse(h).every(e => isMastered(p, e.id));
      return <MapSpot key={h} place={PLACES[i].place} art={PLACES[i].asset} index={i} title={HOUSES[h].title} subtitle={HOUSES[h].subtitle} tone={HOUSES[h].tone}
        hint={recHere?.house === h} badge={all ? '🏆' : st.stars ? `★${toFa(st.stars)}` : undefined} onClick={() => { sound.playPop(); go({ house: h, ex: null }); }} />;
    })}
  </MapScreen>;
};
