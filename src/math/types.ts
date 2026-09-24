/**
 * مدل دادهٔ موتور تمرین ریاضی.
 * تمرین‌ها «داده» هستند (src/math/exercises.ts) و از UI جدا هستند؛
 * هر «نوع» (type) یک سازندهٔ دور (generator) و یک نمایشگر (renderer) دارد.
 * برای افزودن تمرین تازه با نوعِ موجود، فقط یک ردیف به exercises.ts اضافه کنید.
 */
export type IslandId = 'numbers' | 'order' | 'operations';
export type HouseId =
  | 'counting' | 'building' | 'neighbors' | 'compare' | 'tens'          // جزیرهٔ ۱
  | 'patterns' | 'chart' | 'logic' | 'shapes' | 'measure'               // جزیرهٔ ۲
  | 'addition' | 'subtraction' | 'numberline' | 'bonds' | 'problems';   // جزیرهٔ ۳

export type SkillId =
  | 'counting' | 'numberSense' | 'order' | 'compare' | 'placeValue'
  | 'pattern' | 'numberChart' | 'logic' | 'geometry' | 'measurement'
  | 'addition' | 'subtraction' | 'numberLine' | 'composition' | 'problemSolving';

/** ۱ = عینی و تصویری · ۲ = تصویری + عددی · ۳ = نمادین و مفهومی */
export type Level = 1 | 2 | 3;
export type Priority = 'essential' | 'important' | 'optional';

export type ExerciseType =
  | 'tapCount' | 'subitize' | 'countCheck' | 'countOn'
  | 'buildSet' | 'matchRep'
  | 'oneMoreLess' | 'sequenceGap' | 'orderCards'
  | 'compareGroups' | 'makeEqual' | 'compareSymbol'
  | 'tensOnes'
  | 'pattern' | 'chart' | 'latinSquare' | 'shapeCorners' | 'compareLength' | 'measureUnits'
  | 'addCombine' | 'takeAway' | 'expression' | 'lineJump' | 'hiddenPart' | 'makeTen' | 'repMatch' | 'story';

/** نمایش‌های مختلفِ یک مقدار (از عینی به نمادین) */
export type Rep = 'objects' | 'dots' | 'tally' | 'tenframe' | 'numeral' | 'line';

export interface ExerciseFeedback { good?: string; try?: string; hint?: string }

/** یک دورِ ساخته‌شده از تمرین: دادهٔ آماده برای نمایشگر */
export interface Round {
  question: string;          // جملهٔ صفحه
  speak?: string;            // جمله‌ای که خوانده می‌شود (اگر با question فرق دارد)
  objects?: string[];        // اشیای تصویری (ایموجی)
  options?: (number | string)[];
  answer: number | string | number[] | string[];
  data: Record<string, any>; // دادهٔ مخصوص هر نوع
}

export interface ExerciseDef {
  id: string;
  house: HouseId;
  skill: SkillId;
  level: Level;
  difficulty: 1 | 2 | 3 | 4 | 5;
  priority: Priority;
  type: ExerciseType;
  title: string;             // نام کوتاه روی کارت
  goal: string;              // هدف آموزشی (برای والد/معلم)
  question?: string;         // جملهٔ ثابت (اگر generator جمله نسازد)
  objects?: string[];        // مجموعهٔ ایموجی‌های مجاز
  params: Record<string, any>;
  prerequisite: string[];    // شناسهٔ تمرین‌های پیش‌نیاز
  rounds?: number;           // تعداد دور (پیش‌فرض ۵)
  feedback?: ExerciseFeedback;
  /** دورهای ثابت دست‌ساز؛ اگر باشد به جای generator استفاده می‌شود */
  fixed?: Round[];
  emoji: string;
}

export interface IslandDef { id: IslandId; title: string; subtitle: string; text: string; houses: HouseId[] }
export interface HouseDef { id: HouseId; island: IslandId; title: string; subtitle: string; emoji: string; tone: string; text: string }
