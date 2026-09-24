export type ActiveScreen = 'splash' | 'island_map' | 'island' | 'my_progress';
export type { IslandId } from './math/types';

export interface UserProgress {
  activitiesDoneToday: number;
  mathChallengesSolved: number;
  gardenLeaves: number;
  starsCount: number;
  lastActiveDate: string;
}
