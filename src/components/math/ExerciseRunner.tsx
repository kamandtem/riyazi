import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Home, Volume2 } from 'lucide-react';
import { ExerciseDef, Round } from '../../math/types';
import { buildRound } from '../../math/generators';
import { saveResult } from '../../math/progress';
import { HOUSES } from '../../math/curriculum';
import { recordActivityCompleted } from '../../utils/progressStorage';
import { sound } from '../../utils/audio';
import { numWord, toFa } from '../../utils/fa';
import { vibrate } from '../../utils/native';
import { cheer, FeedbackState, FeedbackToast, praise } from '../shared/Feedback';
import { OkArt } from '../shared/ArtButtons';
import { RENDERERS } from './renderers';
import { ActionSlot } from './Visuals';
import { useLandscape } from '../../utils/orientation';
import { bookRef } from '../../math/exercises';

/** چیدمان افقی: نوع‌هایی که باید در یک ردیف کامل (پهنای کامل) نمایش داده شوند */
const VERTICAL = new Set(['pattern', 'patternStrip', 'lineJump', 'sequenceGap', 'orderCards', 'compareGroups', 'makeEqual', 'compareLength', 'measureUnits', 'chart', 'story', 'groupMatch']);

export const LEVEL_LABEL: Record<number, { short: string; long: string; icon: string }> = {
  1: { short: 'سطح ۱', long: 'عینی و تصویری', icon: '🧸' },
  2: { short: 'سطح ۲', long: 'تصویر + عدد', icon: '🖼️' },
  3: { short: 'سطح ۳', long: 'عدد و نماد', icon: '🔣' },
};

/** متن را برای موتور گفتار آماده می‌کند: رقم‌ها ← نام عدد، علامت‌ها ← کلمه */
export function speakable(t: string) {
  return t.replace(/[۰-۹0-9]+/g, m => numWord(parseInt(m.replace(/[۰-۹]/g, d => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d))), 10)))
    .replace(/\s\+\s/g, ' به‌اضافهٔ ').replace(/\s[−-]\s/g, ' منهای ').replace(/[<>=؟?!«»()]/g, ' ');
}

/**
 * اجرای یک تمرین: چند دور، بازخورد مهربان، ستاره‌ها.
 * نمایشگرِ هر نوع فقط answer(true/false) را صدا می‌زند؛ بقیه (امتیاز، رفتن به دور بعد، ذخیره) این‌جاست.
 */
export const ExerciseRunner: React.FC<{ def: ExerciseDef; onExit: () => void; onHome?: () => void; onNext?: () => void; nextTitle?: string }> = ({ def, onExit, onHome, onNext, nextTitle }) => {
  const total = def.rounds || 8;
  const { rotated, style } = useLandscape();
  const [slot, setSlot] = useState<HTMLElement | null>(null);
  const [i, setI] = useState(0);
  const [session, setSession] = useState(0);
  const round: Round = useMemo(() => buildRound(def, i, total), [def, i, session]); // eslint-disable-line react-hooks/exhaustive-deps
  const [mistakes, setMistakes] = useState(0);
  const [solved, setSolved] = useState(false);
  const [firstTry, setFirstTry] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);
  const [finished, setFinished] = useState<null | number>(null);
  const [fb, setFb] = useState<FeedbackState>(null);
  const timer = useRef(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const speakQ = useCallback(() => sound.speakPersian(speakable(round.speak || round.question)), [round]);
  useEffect(() => { const t = window.setTimeout(speakQ, 350); return () => window.clearTimeout(t); }, [speakQ]);

  const answer = useCallback((ok: boolean, hint?: string) => {
    if (solved) return;
    if (ok) {
      setSolved(true);
      const clean = mistakes === 0;
      if (clean) setFirstTry(f => f + 1);
      setResults(r => [...r, clean]);
      sound.playSuccess(); vibrate?.(20);
      setFb({ tone: 'good', text: def.feedback?.good || praise() });
      timer.current = window.setTimeout(() => {
        if (i + 1 >= total) {
          const ft = firstTry + (clean ? 1 : 0);
          const ratio = ft / total;
          const stars = ratio >= 0.8 ? 3 : ratio >= 0.5 ? 2 : 1;
          saveResult(def.id, stars); recordActivityCompleted(stars);
          setFinished(stars); sound.speakPersian(stars === 3 ? 'آفرین! سه ستاره گرفتی' : 'آفرین! تمرین تمام شد');
        } else { setI(i + 1); setMistakes(0); setSolved(false); }
      }, 1900);
    } else {
      setMistakes(m => m + 1);
      sound.playGentleHint();
      const text = hint || def.feedback?.hint || cheer();
      setFb({ tone: 'try', text });
      window.setTimeout(() => sound.speakPersian(speakable(text)), 250);
    }
  }, [solved, mistakes, def, i, total, firstTry]);

  const restart = () => { sound.playPop(); setI(0); setSession(s => s + 1); setMistakes(0); setSolved(false); setFirstTry(0); setResults([]); setFinished(null); };
  const house = HOUSES[def.house];
  const R = RENDERERS[def.type];
  const lv = LEVEL_LABEL[def.level];

  const back = () => { sound.playPop(); onExit(); };
  return <div className={`ls-shell ${rotated ? 'ls-rotated' : ''}`} style={style}>
    <main className="recognition-game-screen mx-screen ls" dir="rtl">
      <aside className="mx-side">
        <button type="button" className="kid-round-btn" onClick={back} aria-label="برگشت"><ArrowRight strokeWidth={3} /></button>
        <div className="mx-side-title"><span className="mx-side-emoji">{def.emoji}</span><b>{def.title}</b><small>{house.title} · {lv.short}</small>{def.page ? <small className="mx-bookref">📖 {bookRef(def)}</small> : null}</div>
        <button type="button" className="kid-round-btn speak" onClick={() => { sound.playPop(); speakQ(); }} aria-label="دوباره بخوان"><Volume2 strokeWidth={2.8} /></button>
        <div className="mx-side-slot" ref={setSlot} />
        {onHome && <button type="button" className="kid-round-btn home" onClick={() => { sound.playPop(); onHome(); }} aria-label="خانه"><Home strokeWidth={2.8} /></button>}
      </aside>
      <ActionSlot.Provider value={slot}>
        <div className="mx-main">
          <header className="mx-main-top">
            {finished === null && def.type !== 'story' ? <p className="mx-question">{round.question}</p> : <span />}
            <div className="mx-progress" aria-label={`دور ${toFa(i + 1)} از ${toFa(total)}`}>
              {Array.from({ length: total }, (_, k) => <i key={k} className={k < results.length ? (results[k] ? 'star' : 'done') : k === i ? 'now' : ''}>{k < results.length && results[k] ? '★' : ''}</i>)}
            </div>
          </header>
          {finished === null
            ? <div className={`mx-round ${VERTICAL.has(def.type) ? 'lay-v' : 'lay-h'} t-${def.type}`} key={`${session}-${i}`}><R round={round} def={def} answer={answer} mistakes={mistakes} solved={solved} /></div>
            : <section className="mx-finish">
              <div className="mx-finish-stars">{[1, 2, 3].map(s => <span key={s} className={s <= finished ? 'on' : ''} style={{ animationDelay: `${s * .18}s` }}>★</span>)}</div>
              <h2>{finished === 3 ? 'عالی بود!' : finished === 2 ? 'آفرین! خیلی خوب بود' : 'آفرین! تمرین تمام شد'}</h2>
              <p>{toFa(firstTry)} از {toFa(total)} را بار اول درست گفتی.</p>
              <div className="mx-finish-actions">
                <button type="button" className="mx-tool undo" onClick={restart}>🔁 دوباره</button>
                {onNext && <button type="button" className="mx-tool add" onClick={() => { sound.playPop(); onNext(); }}>▶️ {nextTitle || 'بعدی'}</button>}
                <OkArt className="mx-ok" ready caption="برگشت به خانه" onClick={back} />
              </div>
            </section>}
        </div>
      </ActionSlot.Provider>
      <FeedbackToast state={fb} onClose={() => setFb(null)} />
    </main>
  </div>;
};
