import React from 'react';
import { RProps } from '../Visuals';
import { BuildSet, CountCheck, CountOn, MatchRep, OneMoreLess, OrderCards, SequenceGap, Subitize, TapCount } from './Counting';
import { CompareGroups, CompareLength, CompareSymbol, MakeEqual, MeasureUnits, ShapeCorners, TensOnes } from './Compare';
import { Chart, LatinSquare, Pattern, PatternStrip } from './Patterns';
import { ColorCount, FingerMatch, GroupMatch } from './Fingers';
import { AddCombine, Expression, HiddenPart, LineJump, MakeTen, RepMatch, Story, TakeAway } from './Operations';
import { ExerciseType } from '../../../math/types';

/** نگاشت type ← نمایشگر. نوع تازه = یک کامپوننت + یک ردیف این‌جا + یک generator */
export const RENDERERS: Record<ExerciseType, React.FC<RProps>> = {
  tapCount: TapCount, subitize: Subitize, countCheck: CountCheck, countOn: CountOn,
  buildSet: BuildSet, matchRep: MatchRep,
  oneMoreLess: OneMoreLess, sequenceGap: SequenceGap, orderCards: OrderCards,
  compareGroups: CompareGroups, makeEqual: MakeEqual, compareSymbol: CompareSymbol,
  tensOnes: TensOnes,
  pattern: Pattern, chart: Chart, latinSquare: LatinSquare, shapeCorners: ShapeCorners, compareLength: CompareLength, measureUnits: MeasureUnits,
  addCombine: AddCombine, takeAway: TakeAway, expression: Expression, lineJump: LineJump, hiddenPart: HiddenPart, makeTen: MakeTen, repMatch: RepMatch, story: Story,
  colorCount: ColorCount, fingerMatch: FingerMatch, groupMatch: GroupMatch, patternStrip: PatternStrip,
};
