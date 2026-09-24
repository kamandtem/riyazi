import React, { useEffect } from 'react';
import { UserProgress } from '../types';
import { HOUSES, ISLANDS } from '../math/curriculum';
import { EXERCISES, exercisesOfHouse } from '../math/exercises';
import { houseStats, isMastered, islandStats, useMathProgress } from '../math/progress';
import { toFa } from '../utils/fa';
import { useBackHandler } from '../utils/backNav';
import { sound } from '../utils/audio';
import { CloseArt } from './shared/ArtButtons';

/** «پیشرفت من»: چند تمرین را یاد گرفتم، ستاره‌ها، و وضعیت هر خانه */
export const MyProgress: React.FC<{ progress: UserProgress; onBack: () => void }> = ({ progress, onBack }) => {
  const p = useMathProgress();
  useBackHandler(() => { onBack(); });
  useEffect(() => { document.title = 'پیشرفت من · دهکدهٔ ریاضی'; }, []);
  const mastered = EXERCISES.filter(e => isMastered(p, e.id)).length;
  const pct = Math.round((mastered / EXERCISES.length) * 100);
  const cheer = pct >= 100 ? 'همهٔ تمرین‌ها را یاد گرفتی! قهرمانی! 🏆' : pct >= 50 ? 'بیشتر از نصف راه را رفتی، ادامه بده! 🚀' : mastered ? 'داری عالی جلو می‌روی! 🌟' : 'سفر تازه شروع شده، بزن بریم! 🎒';
  const arts = ['/assets/map-island-1.webp', '/assets/map-island-2.webp', '/assets/map-island-3.webp'];
  const tones = ['coral', 'green', 'blue'];
  return <main className="mp-screen" dir="rtl">
    <div className="mp-sky" aria-hidden="true"><span className="mp-sun" /><span className="mp-cloud a" /><span className="mp-cloud b" /></div>
    <header className="mp-top">
      <div className="mp-ribbon"><small>دفترچهٔ من</small><strong>پیشرفت من</strong></div>
      <CloseArt className="mp-close" onClick={() => { sound.playPop(); onBack(); }} label="بازگشت" />
    </header>
    <section className="mp-hero" aria-label="خلاصهٔ پیشرفت">
      <div className="mp-ring" style={{ ['--p' as string]: pct } as React.CSSProperties} role="img" aria-label={`${toFa(pct)} درصد`}><div><b>{toFa(pct)}٪</b><small>یاد گرفتم</small></div></div>
      <div className="mp-hero-text"><h1>{toFa(mastered)} تمرین از {toFa(EXERCISES.length)}</h1><p>{cheer}</p></div>
    </section>
    <section className="mp-loot" aria-label="جایزه‌های من">
      <div className="mp-jar star"><i>⭐</i><b>{toFa(progress.starsCount)}</b><span>ستاره</span></div>
      <div className="mp-jar leaf"><i>🌱</i><b>{toFa(progress.gardenLeaves)}</b><span>برگ باغچه</span></div>
      <div className="mp-jar today"><i>🎯</i><b>{toFa(progress.activitiesDoneToday)}</b><span>تمرین امروز</span></div>
    </section>
    <section className="mp-villages" aria-label="جزیره‌ها">
      <h2>جزیره‌های من</h2>
      {ISLANDS.map((isl, k) => { const st = islandStats(p, isl.id); const r = st.total ? st.mastered / st.total : 0;
        return <div key={isl.id} className={`mp-village tone-${tones[k]}`}>
          <img src={arts[k]} alt="" />
          <div className="mp-village-body">
            <div className="mp-village-head"><b>{isl.title}</b><span>{toFa(st.mastered)} از {toFa(st.total)} · ★{toFa(st.stars)}</span></div>
            <div className="mp-bar" role="progressbar" aria-valuemin={0} aria-valuemax={st.total} aria-valuenow={st.mastered}><i style={{ transform: `scaleX(${Math.max(r, 0.04)})` }} /></div>
            <div className="mx-mp-houses">{isl.houses.map(h => { const hs = houseStats(p, h);
              return <span key={h} className={hs.mastered === hs.total ? 'done' : hs.stars ? 'part' : ''} title={HOUSES[h].title}>{HOUSES[h].emoji}<small>{toFa(hs.mastered)}/{toFa(hs.total)}</small></span>; })}</div>
          </div>
        </div>; })}
    </section>
    <section className="mp-path" aria-label="همهٔ تمرین‌ها">
      <h2>ستاره‌های هر تمرین</h2>
      {ISLANDS.map(isl => isl.houses.map(h => <div key={h} className="mx-mp-row">
        <b>{HOUSES[h].emoji} {HOUSES[h].title}</b>
        <div>{exercisesOfHouse(h).map(e => <span key={e.id} className={`mx-mp-ex ${isMastered(p, e.id) ? 'done' : ''}`} title={e.title}>{e.emoji}<i>{'★'.repeat(p.stars[e.id] || 0) || '·'}</i></span>)}</div>
      </div>))}
    </section>
  </main>;
};
