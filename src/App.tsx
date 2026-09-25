import React, { useCallback, useEffect, useState } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { IslandMap } from './components/IslandMap';
import { IslandScreen, IslandRoute } from './components/math/IslandScreen';
import { MyProgress } from './components/MyProgress';
import { ExitDialog } from './components/ExitDialog';
import { ActiveScreen, IslandId } from './types';
import { UserProgress } from './types';
import { loadProgress } from './utils/progressStorage';
import { sound } from './utils/audio';
import { initBackNavigation } from './utils/backNav';
import { initNativeChrome, setStatusBarColor } from './utils/native';
import { lockOrientation } from './utils/orientation';
import { EXERCISE_BY_ID } from './math/exercises';
import { HOUSES } from './math/curriculum';

interface Route { screen: ActiveScreen; island?: IslandId; house?: IslandRoute['house']; ex?: string | null }
/** «ادامه»: آخرین جایی که کودک بود */
const RESUME_KEY = 'riazi_last_route_v1';
const readResume = (): Route | null => { try { const r = JSON.parse(localStorage.getItem(RESUME_KEY) || 'null'); return r && r.screen === 'island' && r.island ? r : null; } catch { return null; } };
const STATUS: Partial<Record<ActiveScreen, string>> = { splash: '#57C3F1', island_map: '#57C3F1', my_progress: '#8FD3FF' };

export default function App() { return <><AppScreens /><ExitDialog /></>; }

function AppScreens() {
  const [route, setRoute] = useState<Route>({ screen: 'splash' });
  const [progress, setProgress] = useState<UserProgress>(loadProgress());
  const [skipNativeSplash, setSkipNativeSplash] = useState(false);
  const nav = useCallback((r: Route) => { sound.playPop(); setRoute(r); if (r.screen !== 'splash' && r.screen !== 'my_progress') setSkipNativeSplash(true); }, []);
  useEffect(() => { initBackNavigation(); initNativeChrome(); lockOrientation('portrait'); }, []);
  useEffect(() => { if (STATUS[route.screen]) setStatusBarColor(STATUS[route.screen]!); }, [route.screen]);
  useEffect(() => { if (route.screen === 'island') { try { localStorage.setItem(RESUME_KEY, JSON.stringify(route)); } catch { /* ignore */ } } }, [route]);
  useEffect(() => { document.body.classList.toggle('app-splash', route.screen === 'splash'); if (route.screen === 'my_progress' || route.screen === 'splash') setProgress(loadProgress()); }, [route.screen]);
  const toStart = () => { setSkipNativeSplash(true); nav({ screen: 'splash' }); };
  const openExercise = (id: string) => { const e = EXERCISE_BY_ID[id]; nav({ screen: 'island', island: HOUSES[e.house].island, house: e.house, ex: id }); };

  if (route.screen === 'splash') { const resume = readResume();
    const label = resume ? (resume.ex ? EXERCISE_BY_ID[resume.ex]?.title : resume.house ? HOUSES[resume.house]?.title : null) : null;
    return <SplashScreen skipNativeSplash={skipNativeSplash} resumeLabel={label}
      onStart={() => nav({ screen: 'island_map' })}
      onContinue={() => nav(readResume() || { screen: 'island_map' })}
      onProgress={() => { setSkipNativeSplash(true); nav({ screen: 'my_progress' }); }} />; }
  if (route.screen === 'my_progress') return <MyProgress progress={progress} onBack={toStart} />;
  if (route.screen === 'island' && route.island) return <IslandScreen island={route.island} route={{ house: route.house || null, ex: route.ex || null }}
    go={r => nav({ screen: 'island', island: route.island, ...r })} onBack={() => nav({ screen: 'island_map' })} onHome={toStart} />;
  return <IslandMap onStart={toStart} onIsland={id => nav({ screen: 'island', island: id, house: null, ex: null })} onExercise={openExercise} />;
}
