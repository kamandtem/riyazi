import React, { useState } from 'react';
import { HouseDef } from '../../math/types';
import { bookRef, exercisesOfHouse, EXERCISE_BY_ID } from '../../math/exercises';
import { isMastered, nextRecommended, prereqsMet, useMathProgress } from '../../math/progress';
import { sound } from '../../utils/audio';
import { toFa } from '../../utils/fa';
import { GameHeader } from '../shared/GameHeader';
import { LEVEL_LABEL } from './ExerciseRunner';

/** داخل هر خانه: فهرست کوتاه تمرین‌ها، از سطح ۱ تا ۳ */
export const HouseScreen: React.FC<{ house: HouseDef; onBack: () => void; onHome: () => void; onPick: (id: string) => void }> = ({ house, onBack, onHome, onPick }) => {
  const p = useMathProgress();
  const list = exercisesOfHouse(house.id);
  const rec = nextRecommended(p);
  const [parent, setParent] = useState(false);
  return <main className="recognition-game-screen mx-screen" dir="rtl">
    <GameHeader kicker={house.subtitle} title={house.title} emoji={house.emoji} tone="sun" onBack={onBack} onHome={onHome}>
      <button type="button" className={`kid-round-btn ${parent ? 'on' : ''}`} onClick={() => { sound.playPop(); setParent(!parent); }} aria-label="راهنمای والدین">👪</button>
    </GameHeader>
    <div className="mx-body">
      <p className="mx-house-text">{house.text}</p>
      <ol className="mx-ex-list">
        {list.map((e, k) => {
          const stars = p.stars[e.id] || 0;
          const ready = prereqsMet(p, e.id);
          const lv = LEVEL_LABEL[e.level];
          const missing = e.prerequisite.filter(r => !(p.stars[r] >= 1)).map(r => EXERCISE_BY_ID[r]?.title).filter(Boolean);
          return <li key={e.id}>
            <button type="button" className={`mx-ex-card lv-${e.level} ${ready ? '' : 'soft-lock'} ${isMastered(p, e.id) ? 'mastered' : ''}`} onClick={() => { sound.playPop(); onPick(e.id); }}>
              <span className="mx-ex-num">{toFa(k + 1)}</span>
              <span className="mx-ex-emoji">{e.emoji}</span>
              <span className="mx-ex-body">
                <b>{e.title}</b>
                <small>{lv.icon} {lv.short} · {lv.long}{e.page ? ` · 📖 ${bookRef(e)}` : ''}</small>
                {e.numerals === false && <i className="mx-ex-tag">🗣️ گفتنی با بزرگ‌تر</i>}
                {parent && <em>🎯 {e.goal}</em>}
                {!ready && missing.length > 0 && <u>بهتر است اول «{missing[0]}» را بازی کنی</u>}
              </span>
              <span className="mx-ex-stars" aria-label={`${toFa(stars)} ستاره`}>{[1, 2, 3].map(s => <i key={s} className={s <= stars ? 'on' : ''}>★</i>)}</span>
              {rec === e.id && <span className="mx-ex-rec">پیشنهاد امروز</span>}
            </button>
          </li>;
        })}
      </ol>
    </div>
  </main>;
};
