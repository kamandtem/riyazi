import { ExerciseDef, Priority } from './types';

/**
 * کاتالوگ تمرین‌ها — نسخهٔ ۱٫۱ (هماهنگ با کتاب ریاضی اول دبستان، چاپ ۱۴۰۴).
 *
 * قاعده‌های این نسخه:
 * ۱) ترتیب داخل هر خانه از ساده به سخت است؛ اولین تمرین هر خانه خیلی مقدماتی است.
 * ۲) «page» شمارهٔ صفحهٔ کتاب است (عددی که پایین صفحهٔ کتاب چاپ شده). مسیر پیشنهادی برنامه از روی آن ساخته می‌شود.
 * ۳) تا تم ۷ کتاب (ص ۴۳) کودک نماد عدد را نمی‌شناسد و عدد نمی‌نویسد: numerals=false.
 *    در این تمرین‌ها هیچ رقمی روی صفحه نیست؛ جواب با گفتن (همراه بزرگ‌تر)، انگشت، رنگ کردن یا گذاشتن است.
 * ۴) جمع روی محور از ص ۱۱۹ کتاب شروع می‌شود: کمان اول از صفر، کمان دوم به اندازهٔ عدد دوم، و مکعب‌ها زیر محور.
 * افزودن تمرین تازه = افزودن یک ردیف با یکی از typeهای موجود.
 */
export const FRUITS = ['🍎', '🍐', '🍊', '🍓', '🍋', '🍇'];
export const ANIMALS = ['🐥', '🐟', '🐞', '🐸', '🐰', '🦋', '🐢', '🐝'];
export const TOYS = ['⚽', '🎈', '🧸', '🚗', '⭐', '🪁'];
export const THINGS = ['🔑', '☂️', '🧤', '👟', '🚗', '🎒', '🧦', '🏠'];
const ALL = [...FRUITS, ...ANIMALS, ...TOYS];

type Row = Omit<ExerciseDef, 'prerequisite' | 'priority'> & { prerequisite?: string[]; priority?: Priority };

const ROWS: Row[] = [
  /* =============== جزیرهٔ ۱ · خانهٔ شمارش («بشمار و بگو») =============== */
  { id: 'count-3', house: 'counting', skill: 'counting', level: 1, difficulty: 1, type: 'tapCount', emoji: '👆', page: 2, numerals: false,
    title: 'یک، دو، سه', goal: 'اولین قدم: فقط ۱ تا ۳ شیء. هر کدام را یک بار لمس کند و بلند بشمارد؛ عدد آخر را با شما بگوید (کتاب ص ۲).',
    objects: ALL, params: { min: 1, max: 3, layout: 'row', answer: 'oral' }, rounds: 8, feedback: { hint: 'هر کدام را فقط یک بار لمس کن.' } },
  { id: 'color-3', house: 'counting', skill: 'counting', level: 1, difficulty: 1, type: 'colorCount', emoji: '🖍️', page: 3, numerals: false,
    title: 'بشمار و رنگ کن', goal: 'به تعداد شکل‌ها خانه رنگ کند (۱ تا ۳). کتاب ص ۳.',
    objects: ALL, params: { min: 1, max: 3, mode: 'cells', cells: 5 }, rounds: 8 },
  { id: 'count-5', house: 'counting', skill: 'counting', level: 1, difficulty: 2, type: 'tapCount', emoji: '🐞', page: 4, numerals: false,
    title: 'تا پنج بشمار', goal: 'شمردن ۱ تا ۵ شیء مثل هم و گفتن تعداد (کتاب ص ۲ و ۶).',
    objects: ALL, params: { min: 2, max: 5, layout: 'row', answer: 'oral' }, rounds: 8 },
  { id: 'color-5', house: 'counting', skill: 'counting', level: 1, difficulty: 2, type: 'colorCount', emoji: '🟩', page: 4.5, numerals: false,
    title: 'به همان تعداد رنگ کن', goal: 'تناظر یک‌به‌یک: برای هر شکل یک خانه (۱ تا ۵).',
    objects: ALL, params: { min: 1, max: 5, mode: 'cells', cells: 6 }, rounds: 8 },
  { id: 'color-pick', house: 'counting', skill: 'counting', level: 1, difficulty: 2, type: 'colorCount', emoji: '🎨', page: 9, numerals: false,
    title: 'از این‌ها رنگ کن', goal: 'به تعداد شکل‌های سمت چپ، از شکل‌های سمت راست رنگ کند (کتاب ص ۹).',
    params: { min: 1, max: 5, mode: 'shapes' }, rounds: 8 },
  { id: 'subitize-3', house: 'counting', skill: 'counting', level: 1, difficulty: 2, type: 'subitize', emoji: '⚡', page: 10, numerals: false,
    title: 'سریع بگو چند تا', goal: 'دیدن تعدادهای کمتر از ۴ بدون شمردن (کتاب ص ۱۰).',
    params: { min: 1, max: 3, flashMs: 1600, answer: 'oral' }, rounds: 8 },
  { id: 'count-scatter', house: 'counting', skill: 'counting', level: 2, difficulty: 3, type: 'tapCount', emoji: '🦋', page: 16, numerals: false,
    title: 'پراکنده‌ها را بشمار', goal: 'وقتی اشیا مرتب نیستند، کدام را شمردم؟ (۳ تا ۷).',
    objects: ANIMALS, params: { min: 3, max: 7, layout: 'scatter', answer: 'oral' }, rounds: 8 },
  { id: 'count-numeral', house: 'counting', skill: 'counting', level: 2, difficulty: 3, type: 'tapCount', emoji: '1️⃣', page: 47, numerals: true,
    title: 'بشمار و عددش را پیدا کن', goal: 'بعد از آشنایی با نماد عددها (تم ۷ به بعد): شمردن و انتخاب عدد.',
    objects: ALL, params: { min: 1, max: 9, layout: 'row', answer: 'numeral' }, rounds: 8 },
  { id: 'count-10', house: 'counting', skill: 'counting', level: 3, difficulty: 3, type: 'tapCount', emoji: '🐟', page: 66, numerals: true,
    title: 'تا ده بشمار', goal: 'شمردن ۵ تا ۱۰ شیء پراکنده و انتخاب عدد.',
    objects: ANIMALS, params: { min: 5, max: 10, layout: 'scatter', answer: 'numeral' }, rounds: 8 },
  { id: 'count-check', house: 'counting', skill: 'counting', level: 3, difficulty: 4, type: 'countCheck', emoji: '🐰', page: 67, numerals: true,
    title: 'خرگوش درست شمرد؟', goal: 'قاعده‌های شمارش: جا انداختن، دو بار شمردن و پریدن از روی عدد اشتباه است.',
    objects: FRUITS, params: { min: 4, max: 8 } },
  { id: 'count-on', house: 'counting', skill: 'counting', level: 3, difficulty: 4, type: 'countOn', emoji: '📦', page: 85, numerals: true,
    title: 'ادامه بشمار', goal: 'شمردن از عدد دستهٔ اول به بعد، بدون شروع دوباره از یک (آمادگی برای جمع).',
    objects: TOYS, params: { start: [3, 7], add: [1, 3] } },

  /* =============== جزیرهٔ ۱ · خانهٔ انگشت و چوب‌خط =============== */
  { id: 'finger-pick-3', house: 'building', skill: 'numberSense', level: 1, difficulty: 1, type: 'fingerMatch', emoji: '✌️', page: 7, numerals: false,
    title: 'کدام دست؟', goal: 'دستی را پیدا کند که همان تعداد شکل را نشان می‌دهد (۱ تا ۳). کتاب ص ۷.',
    objects: THINGS, params: { mode: 'pick', min: 1, max: 3 }, rounds: 8 },
  { id: 'finger-raise-3', house: 'building', skill: 'numberSense', level: 1, difficulty: 1, type: 'fingerMatch', emoji: '☝️', page: 7.2, numerals: false,
    title: 'با انگشت نشان بده', goal: 'روی انگشت‌ها بزند تا باز شوند؛ به تعداد شکل‌ها (۱ تا ۳). خودش هم با دستش نشان دهد.',
    objects: THINGS, params: { mode: 'raise', min: 1, max: 3 }, rounds: 8 },
  { id: 'finger-pick-5', house: 'building', skill: 'numberSense', level: 1, difficulty: 2, type: 'fingerMatch', emoji: '🖐️', page: 7.4, numerals: false,
    title: 'کدام دست؟ تا پنج', goal: 'یک عدد را با انگشت‌های مختلف می‌شود نشان داد (کتاب ص ۷ و ۱۱).',
    objects: THINGS, params: { mode: 'pick', min: 1, max: 5, alt: true }, rounds: 8 },
  { id: 'finger-raise-5', house: 'building', skill: 'numberSense', level: 1, difficulty: 2, type: 'fingerMatch', emoji: '✋', page: 11, numerals: false,
    title: 'تا پنج با انگشت', goal: 'نشان دادن ۱ تا ۵ با انگشت‌های یک دست.',
    objects: THINGS, params: { mode: 'raise', min: 1, max: 5 }, rounds: 8 },
  { id: 'hand-say', house: 'building', skill: 'numberSense', level: 1, difficulty: 2, type: 'fingerMatch', emoji: '🗣️', page: 11.2, numerals: false,
    title: 'این دست چند تاست؟', goal: 'انگشت‌های باز را بشمارد و بگوید (کتاب ص ۷: انگشتان هر دست چه عددی را نشان می‌دهد؟).',
    params: { mode: 'handSay', min: 1, max: 5, alt: true, answer: 'oral' }, rounds: 8 },
  { id: 'two-hands', house: 'building', skill: 'numberSense', level: 2, difficulty: 3, type: 'fingerMatch', emoji: '🙌', page: 11.4, numerals: false,
    title: 'دست راست، دست چپ', goal: 'دستهٔ سمت راست با دست راست و دستهٔ سمت چپ با دست چپ (کتاب ص ۱۱).',
    objects: THINGS, params: { mode: 'twoHands', min: 1, max: 4 }, rounds: 6 },
  { id: 'finger-sum', house: 'building', skill: 'numberSense', level: 2, difficulty: 3, type: 'fingerMatch', emoji: '🤲', page: 25, numerals: false,
    title: 'دو دست با هم', goal: '«... و ... می‌شود ...» با انگشت‌های دو دست، بدون علامت جمع (کتاب ص ۲۵).',
    params: { mode: 'sum', minSum: 2, maxSum: 8, answer: 'oral' }, rounds: 8 },
  { id: 'tally-5', house: 'building', skill: 'numberSense', level: 2, difficulty: 2, type: 'buildSet', emoji: '🥢', page: 27, numerals: false,
    title: 'به تعداد حیوان‌ها چوب‌خط بکش', goal: 'نمایش تعداد با چوب‌خط؛ پنجمی کج روی چهار تای دیگر (کتاب ص ۲۷).',
    objects: ANIMALS, params: { min: 1, max: 5, rep: 'tally', target: 'objects' }, rounds: 8 },
  { id: 'tally-10', house: 'building', skill: 'numberSense', level: 2, difficulty: 3, type: 'buildSet', emoji: '🪵', page: 30, numerals: false,
    title: 'چوب‌خط تا ده', goal: 'دسته‌های پنج‌تایی چوب‌خط شمردن را سریع می‌کند (۴ تا ۱۰).',
    objects: ANIMALS, params: { min: 4, max: 10, rep: 'tally', target: 'objects' }, rounds: 8 },
  { id: 'match-rep', house: 'building', skill: 'numberSense', level: 2, difficulty: 3, type: 'matchRep', emoji: '🃏', page: 58, numerals: true,
    title: 'کدام کارت همین عدد است؟', goal: 'یک عدد، چند نمایش: نقطه، چوب‌خط، خانهٔ ده‌تایی و شیء.',
    objects: FRUITS, params: { min: 1, max: 9, dir: 'toRep', reps: ['dots', 'tally', 'tenframe', 'objects'] } },
  { id: 'five-and', house: 'building', skill: 'numberSense', level: 3, difficulty: 3, type: 'matchRep', emoji: '🔴', page: 64, numerals: true,
    title: 'پنج و چند تا؟', goal: 'دیدن ۶ تا ۱۰ به‌صورت «۵ و ...» (کتاب: ۶ = ۵ و ۱، ۹ = ۵ و ۴).',
    params: { min: 5, max: 10, dir: 'toNumber', reps: ['tenframe'], fiveStructure: true } },

  /* =============== جزیرهٔ ۱ · خانهٔ قبل و بعد =============== */
  { id: 'one-more', house: 'neighbors', skill: 'order', level: 1, difficulty: 1, type: 'oneMoreLess', emoji: '🐥', page: 12, numerals: false,
    title: 'یکی آمد', goal: 'اگر یکی اضافه شود چند تا می‌شود؟ جواب با انگشت (کتاب ص ۱۲). فقط تا ۴.',
    objects: ANIMALS, params: { min: 1, max: 3, ops: [1], answer: 'hands' }, rounds: 8 },
  { id: 'one-less', house: 'neighbors', skill: 'order', level: 1, difficulty: 2, type: 'oneMoreLess', emoji: '🐤', page: 14, numerals: false,
    title: 'یکی رفت', goal: 'اگر یکی برود چند تا می‌ماند؟ (کتاب ص ۱۴).',
    objects: ANIMALS, params: { min: 2, max: 4, ops: [-1], answer: 'hands' }, rounds: 8 },
  { id: 'one-more-less', house: 'neighbors', skill: 'order', level: 1, difficulty: 2, type: 'oneMoreLess', emoji: '🔄', page: 14.5, numerals: false,
    title: 'یکی بیشتر، یکی کمتر', goal: 'یکی قبل و یکی بعد از تعداد، بدون دوباره شمردن.',
    objects: ANIMALS, params: { min: 1, max: 5, ops: [1, -1], answer: 'oral' }, rounds: 8 },
  { id: 'add-two', house: 'neighbors', skill: 'order', level: 2, difficulty: 3, type: 'oneMoreLess', emoji: '✌️', page: 16, numerals: false,
    title: 'دو تا اضافه شد', goal: '۲ تا شکل به دسته اضافه شود؛ چند تا می‌شود؟ (کتاب ص ۱۶ و ۱۹).',
    objects: TOYS, params: { min: 1, max: 5, ops: [2], answer: 'oral' }, rounds: 8 },
  { id: 'before-after', house: 'neighbors', skill: 'order', level: 2, difficulty: 3, type: 'sequenceGap', emoji: '🚂', page: 68, numerals: true,
    title: 'قطار قبل و بعد', goal: 'عدد قبل و عدد بعد یک عدد تا ۱۰.',
    params: { mode: 'neighbors', min: 1, max: 10, theme: 'train' } },
  { id: 'count-forward', house: 'neighbors', skill: 'order', level: 2, difficulty: 3, type: 'sequenceGap', emoji: '🐾', page: 69, numerals: true,
    title: 'جای خالی را پر کن', goal: 'ادامهٔ شمارش رو به جلو و کامل کردن دنباله.',
    params: { mode: 'run', len: 6, gaps: 2, step: 1, dir: 1, min: 0, max: 20, theme: 'stones' } },
  { id: 'count-back', house: 'neighbors', skill: 'order', level: 3, difficulty: 3, type: 'sequenceGap', emoji: '🚀', page: 70, numerals: true,
    title: 'شمارش معکوس موشک', goal: 'شمارش رو به عقب از ۱۰ (آمادگی برای تفریق روی محور).',
    params: { mode: 'run', len: 6, gaps: 2, step: 1, dir: -1, min: 0, max: 12, theme: 'rocket' } },
  { id: 'order-cards', house: 'neighbors', skill: 'order', level: 3, difficulty: 4, type: 'orderCards', emoji: '🔢', page: 82, numerals: true,
    title: 'از کوچک به بزرگ', goal: 'مرتب کردن چند عدد (عددها پشت سر هم نیستند).',
    params: { count: [3, 5], min: 0, max: 20 } },

  /* =============== جزیرهٔ ۱ · خانهٔ مقایسه =============== */
  { id: 'group-match', house: 'compare', skill: 'compare', level: 1, difficulty: 1, type: 'groupMatch', emoji: '🔗', page: 6, numerals: false,
    title: 'دسته‌های هم‌تعداد', goal: 'دسته‌هایی را که تعدادشان مثل هم است به هم وصل کند (کتاب ص ۶).',
    params: { min: 1, max: 3, groups: 3 }, rounds: 6 },
  { id: 'group-match-5', house: 'compare', skill: 'compare', level: 1, difficulty: 2, type: 'groupMatch', emoji: '🧷', page: 13, numerals: false,
    title: 'هم‌تعدادها تا پنج', goal: 'همان کار با ۱ تا ۵ و چهار دسته.',
    params: { min: 1, max: 5, groups: 4 }, rounds: 6 },
  { id: 'more-less', house: 'compare', skill: 'compare', level: 1, difficulty: 2, type: 'compareGroups', emoji: '🐸', page: 15, numerals: false,
    title: 'کدام بیشتر است؟', goal: 'بیشتر و کمتر با جفت کردن یک‌به‌یک (نه فقط اندازهٔ ظاهری دسته).',
    objects: ALL, params: { min: 1, max: 6, equalFrom: 99 }, rounds: 8 },
  { id: 'make-equal', house: 'compare', skill: 'compare', level: 2, difficulty: 2, type: 'makeEqual', emoji: '🟰', page: 72, numerals: false,
    title: 'مساوی‌اش کن', goal: 'آن‌قدر بگذار یا بردار که دو دسته برابر شوند (کتاب ص ۷۲).',
    objects: FRUITS, params: { min: 2, max: 8 } },
  { id: 'more-less-equal', house: 'compare', skill: 'compare', level: 2, difficulty: 3, type: 'compareGroups', emoji: '⚖️', page: 73, numerals: false,
    title: 'بیشتر، کمتر یا مساوی', goal: 'حالا گاهی دو دسته مساوی‌اند (کتاب ص ۷۳).',
    objects: ALL, params: { min: 2, max: 9, equalFrom: 2 }, rounds: 8 },
  { id: 'compare-symbol', house: 'compare', skill: 'compare', level: 3, difficulty: 4, type: 'compareSymbol', emoji: '🐊', page: 80, numerals: true,
    title: 'علامت < > =', goal: 'از مقایسهٔ دو دسته به مقایسهٔ دو عدد و نماد آن (کتاب ص ۷۹ تا ۸۲).',
    objects: ALL, params: { min: 0, max: 10, pictureRounds: 4, maxNumbers: 20 } },

  /* =============== جزیرهٔ ۱ · خانهٔ ده‌تایی‌ها =============== */
  { id: 'ten-hands', house: 'tens', skill: 'placeValue', level: 2, difficulty: 2, type: 'fingerMatch', emoji: '🙌', page: 88, numerals: true,
    title: 'ده یعنی دو دست', goal: '۶ تا ۱۰ با دو دست: یک دست پنج و چند تا (کتاب ص ۸۸).',
    params: { mode: 'handSay', min: 6, max: 10, answer: 'numeral' } },
  { id: 'bundle-ten-13', house: 'tens', skill: 'placeValue', level: 2, difficulty: 3, type: 'tensOnes', emoji: '🥢', page: 100, numerals: true,
    title: 'ده‌تا را ببند', goal: 'از میان چوب‌خط‌ها ده تا را جدا کند و ببندد (۱۱ تا ۱۳).',
    params: { mode: 'bundle', min: 11, max: 13 } },
  { id: 'bundle-ten', house: 'tens', skill: 'placeValue', level: 2, difficulty: 3, type: 'tensOnes', emoji: '🪢', page: 110, numerals: true,
    title: 'یک ده‌تایی و چند یکی', goal: 'عددهای ۱۱ تا ۱۹ یعنی «یک ده‌تایی و چند یکی» (کتاب ص ۱۱۱).',
    params: { mode: 'bundle', min: 11, max: 19 } },
  { id: 'tens-read', house: 'tens', skill: 'placeValue', level: 3, difficulty: 3, type: 'tensOnes', emoji: '👀', page: 112, numerals: true,
    title: 'چه عددی ساخته شده؟', goal: 'خواندن عدد از روی بسته‌های ده‌تایی و یکی‌ها و جدول ده‌تایی/یکی.',
    params: { mode: 'read', min: 10, max: 49 } },
  { id: 'build-tens', house: 'tens', skill: 'placeValue', level: 3, difficulty: 4, type: 'tensOnes', emoji: '📦', page: 108, numerals: true,
    title: 'عدد را با بسته‌ها بساز', goal: 'ساختن عدد دورقمی با بستهٔ ده‌تایی و یکی (جدول ارزش مکانی کتاب).',
    params: { mode: 'build', min: 10, max: 59 } },
  { id: 'build-tens-99', house: 'tens', skill: 'placeValue', level: 3, difficulty: 5, type: 'tensOnes', emoji: '🏗️', page: 135, numerals: true,
    title: 'عددهای بزرگ‌تر', goal: 'ساختن عددهای تا ۹۹.',
    params: { mode: 'build', min: 20, max: 99 } },

  /* =============== جزیرهٔ ۲ · خانهٔ الگو =============== */
  { id: 'strip-ab', house: 'patterns', skill: 'pattern', level: 1, difficulty: 1, type: 'patternStrip', emoji: '🟥', page: 4, numerals: false,
    title: 'الگو را رنگ کن', goal: 'مثل کتاب: ادامهٔ الگو را با رنگ کردن خانه‌ها، در یک ردیف (کتاب ص ۴).',
    params: { units: ['AB', 'AAB'], len: 10 }, rounds: 8 },
  { id: 'pattern-next', house: 'patterns', skill: 'pattern', level: 1, difficulty: 1, type: 'pattern', emoji: '🔴', page: 5, numerals: false,
    title: 'بعدی چیست؟', goal: 'پیدا کردن عضو بعدی الگوی رنگی، شکلی و تصویری.',
    params: { mode: 'next', units: ['AB', 'AAB', 'ABB'], kinds: ['color', 'shape', 'picture'] }, rounds: 8 },
  { id: 'strip-abc', house: 'patterns', skill: 'pattern', level: 1, difficulty: 2, type: 'patternStrip', emoji: '🟨', page: 7.5, numerals: false,
    title: 'الگوهای سه‌رنگ', goal: 'الگوهای ABB، ABC و AABB (کتاب ص ۷ و ۱۰).',
    params: { units: ['ABB', 'ABC', 'AABB'], len: 12 }, rounds: 8 },
  { id: 'pattern-motion', house: 'patterns', skill: 'pattern', level: 1, difficulty: 2, type: 'pattern', emoji: '👏', page: 10, numerals: false,
    title: 'الگوی حرکتی', goal: 'دست بزن، پا بکوب: الگو را انجام بدهد و بعدی را پیدا کند.',
    params: { mode: 'next', units: ['AB', 'AAB', 'ABC'], kinds: ['motion', 'picture'] }, rounds: 6 },
  { id: 'pattern-gap', house: 'patterns', skill: 'pattern', level: 2, difficulty: 2, type: 'pattern', emoji: '🧩', page: 13, numerals: false,
    title: 'جای خالی الگو', goal: 'استفاده از نظم الگو در وسط آن، نه فقط در انتها.',
    params: { mode: 'gap', units: ['AB', 'AAB', 'ABC', 'AABB'], kinds: ['color', 'shape', 'picture'] }, rounds: 8 },
  { id: 'pattern-unit', house: 'patterns', skill: 'pattern', level: 2, difficulty: 3, type: 'pattern', emoji: '🔁', page: 34, numerals: false,
    title: 'چه چیزی تکرار می‌شود؟', goal: 'تشخیص بخش تکرارشوندهٔ الگو (کتاب ص ۳۴ و ۳۹).',
    params: { mode: 'unit', units: ['AB', 'AAB', 'ABB', 'ABC', 'AABB'], kinds: ['color', 'shape', 'picture'] } },
  { id: 'pattern-wrong', house: 'patterns', skill: 'pattern', level: 3, difficulty: 3, type: 'pattern', emoji: '🔍', page: 39, numerals: false,
    title: 'قطعهٔ اشتباه', goal: 'بررسی کل الگو و پیدا کردن جایی که نظم به هم خورده است.',
    params: { mode: 'wrong', units: ['AB', 'ABC', 'AAB', 'ABB'], kinds: ['color', 'shape', 'picture'] } },
  { id: 'pattern-number', house: 'patterns', skill: 'pattern', level: 3, difficulty: 4, type: 'sequenceGap', emoji: '🦘', page: 143, numerals: true,
    title: 'الگوی عددی', goal: 'شمردن ۲تا۲تا، ۵تا۵تا و ۱۰تا۱۰تا با دیدن اندازهٔ پرش.',
    params: { mode: 'run', len: 6, gaps: 1, steps: [2, 5, 10], dir: 1, min: 0, max: 60, theme: 'jumps', showJumps: true } },

  /* =============== جزیرهٔ ۲ · خانهٔ جدول عددها =============== */
  { id: 'chart-find', house: 'chart', skill: 'numberChart', level: 2, difficulty: 2, type: 'chart', emoji: '🔎', page: 104, numerals: true,
    title: 'عدد را در جدول پیدا کن', goal: 'آشنایی با جدول و جای عددها در ردیف‌ها.', params: { mode: 'find', size: 20 } },
  { id: 'chart-fill', house: 'chart', skill: 'numberChart', level: 2, difficulty: 3, type: 'chart', emoji: '✏️', page: 105, numerals: true,
    title: 'خانهٔ خالی جدول', goal: 'استفاده از عدد قبل، بعد، بالا و پایین برای پیدا کردن عدد گم‌شده.', params: { mode: 'fill', size: 30 } },
  { id: 'chart-move', house: 'chart', skill: 'numberChart', level: 3, difficulty: 4, type: 'chart', emoji: '🧭', page: 143.5, numerals: true,
    title: 'حرکت در جدول', goal: 'یک خانه جلو = یکی بیشتر؛ یک خانه پایین = ده‌تا بیشتر.', params: { mode: 'move', size: 50 } },
  { id: 'chart-skip', house: 'chart', skill: 'numberChart', level: 3, difficulty: 4, type: 'chart', emoji: '🎨', page: 149, numerals: true,
    title: 'با پرش رنگ کن', goal: 'دیدن الگوی ۲تا۲تا، ۵تا۵تا و ۱۰تا۱۰تا روی جدول (کتاب ص ۱۴۹).', params: { mode: 'skip', size: 50, steps: [2, 5, 10] } },

  /* =============== جزیرهٔ ۲ · خانهٔ جدول شگفت‌انگیز =============== */
  { id: 'latin-3', house: 'logic', skill: 'logic', level: 1, difficulty: 2, type: 'latinSquare', emoji: '🟥', page: 9.5, numerals: false,
    title: 'جدول شگفت‌انگیز رنگی', goal: 'در هر سطر و ستون هر سه رنگ به کار رود (کتاب ص ۹).', params: { n: 3, symbols: 'colors', blanks: [1, 2] }, rounds: 6 },
  { id: 'latin-3b', house: 'logic', skill: 'logic', level: 2, difficulty: 3, type: 'latinSquare', emoji: '🟦', page: 13.5, numerals: false,
    title: 'جای خالی بیشتر', goal: 'همان جدول با خانه‌های خالی بیشتر (کتاب ص ۱۳).', params: { n: 3, symbols: 'colors', blanks: [3, 4] }, rounds: 6 },
  { id: 'latin-4', house: 'logic', skill: 'logic', level: 3, difficulty: 4, type: 'latinSquare', emoji: '4️⃣', page: 56, numerals: true,
    title: 'جدول شگفت‌انگیز عددی', goal: 'همان استدلال با عددهای ۱ تا ۴ (کتاب ص ۵۶).', params: { n: 4, symbols: 'numbers', blanks: [3, 5] }, rounds: 5 },

  /* =============== جزیرهٔ ۲ · خانهٔ شکل‌ها =============== */
  { id: 'shape-corners', house: 'shapes', skill: 'geometry', level: 1, difficulty: 1, type: 'shapeCorners', emoji: '🔺', page: 18, numerals: false,
    title: 'گوشه‌ها را بشمار', goal: 'روی هر گوشه بزند و بشمارد؛ تعداد را بگوید (کتاب ص ۱۸: شکل با چوب کبریت).', params: { mode: 'count', answer: 'oral' } },
  { id: 'shape-which', house: 'shapes', skill: 'geometry', level: 2, difficulty: 2, type: 'shapeCorners', emoji: '🟦', page: 54, numerals: true,
    title: 'کدام شکل؟', goal: 'پیدا کردن شکل با تعداد گوشهٔ خواسته‌شده میان شکل‌های چرخیده.', params: { mode: 'which' } },

  /* =============== جزیرهٔ ۲ · خانهٔ اندازه =============== */
  { id: 'longer-shorter', house: 'measure', skill: 'measurement', level: 1, difficulty: 1, type: 'compareLength', emoji: '✏️', page: 44, numerals: false,
    title: 'بلندتر و کوتاه‌تر', goal: 'مقایسهٔ طول با هم‌تراز کردن سر اشیا.', params: {} },
  { id: 'measure-units', house: 'measure', skill: 'measurement', level: 2, difficulty: 2, type: 'measureUnits', emoji: '📎', page: 55, numerals: true,
    title: 'چند گیره است؟', goal: 'عدد به‌عنوان طول: واحدها پشت سر هم، بدون فاصله (کتاب ص ۵۵).', params: { min: 2, max: 8 } },

  /* =============== جزیرهٔ ۳ · خانهٔ جمع =============== */
  { id: 'add-oral', house: 'addition', skill: 'addition', level: 1, difficulty: 1, type: 'addCombine', emoji: '🍎', page: 19, numerals: false,
    title: 'این و آن، روی هم', goal: 'دو دسته را کنار هم بگذارد و بگوید «... و ... می‌شود ...» (بدون علامت جمع؛ تا ۵).',
    objects: FRUITS, params: { rep: 'objects', maxSum: 5, minSum: 2, answer: 'oral' }, rounds: 8 },
  { id: 'add-tally-oral', house: 'addition', skill: 'addition', level: 1, difficulty: 2, type: 'addCombine', emoji: '🥢', page: 30.5, numerals: false,
    title: 'روی هم با چوب‌خط', goal: 'با کشیدن چوب‌خط بگوید شکل‌های دو طرف روی هم چند تاست (کتاب ص ۳۰).',
    params: { rep: 'tally', maxSum: 8, minSum: 3, answer: 'oral' }, rounds: 8 },
  { id: 'add-combine', house: 'addition', skill: 'addition', level: 2, difficulty: 2, type: 'addCombine', emoji: '🧺', page: 86, numerals: true,
    title: 'جمع با علامت +', goal: 'حالا با علامت جمع (کتاب ص ۸۶): دو دسته را یکی کن و همه را بشمار.',
    objects: FRUITS, params: { rep: 'objects', maxSum: 8 } },
  { id: 'add-frame', house: 'addition', skill: 'addition', level: 2, difficulty: 2, type: 'addCombine', emoji: '🟦', page: 87, numerals: true,
    title: 'جمع با خانه‌های رنگی', goal: 'رنگ کردن دو رنگ و دیدن حاصل (کتاب ص ۸۷ و ۸۸).', params: { rep: 'tenframe', maxSum: 10 } },
  { id: 'add-number', house: 'addition', skill: 'addition', level: 3, difficulty: 3, type: 'expression', emoji: '🔢', page: 90, numerals: true,
    title: 'جمع با عدد', goal: 'عبارت جمع؛ اگر لازم شد، کمکِ تصویری در دسترس است.', params: { op: '+', maxSum: 10 } },
  { id: 'add-reps', house: 'addition', skill: 'addition', level: 3, difficulty: 3, type: 'repMatch', emoji: '🪞', page: 114, numerals: true,
    title: 'یک جمع، چند شکل', goal: 'شکل، چوب‌خط، محور و عدد همه نمایش یک مفهوم‌اند.', objects: FRUITS, params: { op: '+', maxSum: 10 } },
  { id: 'add-tally', house: 'addition', skill: 'addition', level: 3, difficulty: 4, type: 'addCombine', emoji: '🪵', page: 123, numerals: true,
    title: 'جمع تا بیست با چوب‌خط', goal: 'حاصل جمع را با چوب‌خط پیدا کند (کتاب ص ۱۲۳).', params: { rep: 'tally', maxSum: 20, minSum: 8 } },

  /* =============== جزیرهٔ ۳ · خانهٔ تفریق =============== */
  { id: 'finger-fold', house: 'subtraction', skill: 'subtraction', level: 1, difficulty: 1, type: 'fingerMatch', emoji: '✊', page: 31, numerals: false,
    title: 'انگشت‌ها را ببند', goal: 'تعداد را با انگشت نشان بده، به تعداد رفته‌ها ببند و بگو چند تا ماند (کتاب ص ۳۱).',
    objects: ANIMALS, params: { mode: 'fold', min: 2, max: 5, answer: 'oral' }, rounds: 8 },
  { id: 'take-oral', house: 'subtraction', skill: 'subtraction', level: 1, difficulty: 2, type: 'takeAway', emoji: '🐦', page: 33, numerals: false,
    title: 'پرنده‌ها پریدند', goal: 'برداشتن و گفتن باقی‌مانده، بدون علامت تفریق (تا ۶).', params: { rep: 'objects', max: 6, answer: 'oral' }, rounds: 8 },
  { id: 'take-tally-oral', house: 'subtraction', skill: 'subtraction', level: 2, difficulty: 2, type: 'takeAway', emoji: '✂️', page: 38, numerals: false,
    title: 'چوب‌خط‌ها را خط بزن', goal: 'خط زدن چوب‌خط‌ها و گفتن باقی‌مانده (کتاب ص ۳۸ و ۴۰).', params: { rep: 'tally', max: 9, answer: 'oral' }, rounds: 8 },
  { id: 'take-away', house: 'subtraction', skill: 'subtraction', level: 2, difficulty: 2, type: 'takeAway', emoji: '🎈', page: 93, numerals: true,
    title: 'تفریق با علامت −', goal: 'حالا با علامت تفریق (کتاب ص ۹۳).', params: { rep: 'objects', max: 9 } },
  { id: 'take-tally', house: 'subtraction', skill: 'subtraction', level: 3, difficulty: 3, type: 'takeAway', emoji: '🪵', page: 94, numerals: true,
    title: 'تفریق با چوب‌خط', goal: 'خط زدن و نوشتن عبارت تفریق.', params: { rep: 'tally', max: 12 } },
  { id: 'sub-number', house: 'subtraction', skill: 'subtraction', level: 3, difficulty: 3, type: 'expression', emoji: '🔢', page: 96, numerals: true,
    title: 'تفریق با عدد', goal: 'عبارت تفریق؛ کمکِ تصویری در دسترس است.', params: { op: '-', max: 10 } },
  { id: 'sub-reps', house: 'subtraction', skill: 'subtraction', level: 3, difficulty: 4, type: 'repMatch', emoji: '🪞', page: 115, numerals: true,
    title: 'یک تفریق، چند شکل', goal: 'پیوند دادن تصویر برداشتن، چوب‌خط خط‌خورده، پرش عقب و عبارت.', objects: FRUITS, params: { op: '-', max: 10 } },

  /* =============== جزیرهٔ ۳ · خانهٔ محور (کتاب ص ۱۱۹) =============== */
  { id: 'line-hop', house: 'numberline', skill: 'numberLine', level: 1, difficulty: 1, type: 'lineJump', emoji: '🐸', page: 119, numerals: true,
    title: 'یک خانه بپر', goal: 'آشنایی با محور: از صفر (یا یک) یک خانه جلو بپرد و کمان کشیده شود.', params: { mode: 'hop', max: 6 }, rounds: 6 },
  { id: 'line-add-small', house: 'numberline', skill: 'numberLine', level: 2, difficulty: 2, type: 'lineJump', emoji: '🌿', page: 119.1, numerals: true,
    title: 'دو کمان: جمع کوچک', goal: 'اول از صفر تا عدد اول یک کمان، بعد یک کمان به اندازهٔ عدد دوم (حاصل تا ۶).',
    params: { op: '+', minSum: 2, max: 6, lineMax: 10 }, rounds: 8 },
  { id: 'line-add', house: 'numberline', skill: 'numberLine', level: 2, difficulty: 3, type: 'lineJump', emoji: '➕', page: 119.2, numerals: true,
    title: 'جمع روی محور', goal: 'مثل کتاب: ۳ + ۵، کمان صفر تا ۳ و کمان پنج‌تایی تا ۸؛ مکعب‌ها زیر محور.', params: { op: '+', minSum: 4, max: 10 } },
  { id: 'line-sub', house: 'numberline', skill: 'numberLine', level: 2, difficulty: 3, type: 'lineJump', emoji: '➖', page: 119.3, numerals: true,
    title: 'تفریق روی محور', goal: 'کمان صفر تا عدد اول و بعد کمان برگشت به اندازهٔ عدد دوم (مثل ۸ − ۳).', params: { op: '-', minSum: 3, max: 10 } },
  { id: 'line-three', house: 'numberline', skill: 'numberLine', level: 3, difficulty: 4, type: 'lineJump', emoji: '🐾', page: 119.4, numerals: true,
    title: 'سه کمان', goal: 'جمع سه عدد روی محور (مثل ۳ + ۲ + ۴ در کتاب).', params: { op: '+', terms: 3, max: 10 } },
  { id: 'line-expr', house: 'numberline', skill: 'numberLine', level: 3, difficulty: 5, type: 'lineJump', emoji: '🧠', page: 151, numerals: true,
    title: 'محور تا بیست', goal: 'جمع و تفریق روی محور تا ۲۰ (کتاب ص ۱۵۱).', params: { op: 'mix', minSum: 8, max: 20 } },

  /* =============== جزیرهٔ ۳ · خانهٔ ساختن ده =============== */
  { id: 'hidden-part', house: 'bonds', skill: 'composition', level: 2, difficulty: 2, type: 'hiddenPart', emoji: '🥣', page: 61, numerals: true,
    title: 'زیر کاسه چند تا؟', goal: 'کل و جزء: اگر کل را بدانی و یک تکه را ببینی، تکهٔ پنهان را پیدا می‌کنی.', params: { mode: 'hidden', min: 3, max: 10 } },
  { id: 'split-number', house: 'bonds', skill: 'composition', level: 2, difficulty: 3, type: 'hiddenPart', emoji: '🎨', page: 97, numerals: true,
    title: 'یک عدد، چند جمع', goal: 'پیدا کردن جفت‌عددهایی که با هم یک عدد می‌شوند (کتاب ص ۹۰ و ۹۷).', params: { mode: 'split', min: 4, max: 10, need: 3 }, rounds: 3 },
  { id: 'make-ten', house: 'bonds', skill: 'composition', level: 3, difficulty: 3, type: 'makeTen', emoji: '🔟', page: 126, numerals: true,
    title: 'ده را کامل کن', goal: 'چند تا دیگر تا ده؟ (پایهٔ راهبرد «ده‌سازی» کتاب ص ۱۲۶).', params: {} },

  /* =============== جزیرهٔ ۳ · خانهٔ مسئله =============== */
  { id: 'story-picture', house: 'problems', skill: 'problemSolving', level: 2, difficulty: 3, type: 'story', emoji: '🦆', page: 95, numerals: true,
    title: 'قصهٔ تصویری', goal: 'فهمیدن قصه: چیزی اضافه شد یا کم شد؟ بعد پیدا کردن جواب با تصویر.', params: { mode: 'solve', max: 10 } },
  { id: 'story-expression', house: 'problems', skill: 'problemSolving', level: 3, difficulty: 4, type: 'story', emoji: '📝', page: 163, numerals: true,
    title: 'عبارت قصه', goal: 'انتخاب عبارت ریاضیِ مناسبِ قصه و حل آن (تا ۲۰).', params: { mode: 'expression', max: 20 } },
];

/** پیش‌نیاز پیش‌فرض: تمرین قبلیِ همان خانه (قفل نرم؛ فقط پیشنهاد است) */
export const EXERCISES: ExerciseDef[] = ROWS.map((r, i) => {
  const prev = ROWS.slice(0, i).reverse().find(p => p.house === r.house);
  return { priority: 'essential', ...r, prerequisite: r.prerequisite ?? (prev ? [prev.id] : []) };
});

export const EXERCISE_BY_ID: Record<string, ExerciseDef> = Object.fromEntries(EXERCISES.map(e => [e.id, e]));
export const exercisesOfHouse = (house: string) => EXERCISES.filter(e => e.house === house);
/** برچسب صفحهٔ کتاب برای والدین */
export const bookRef = (e: ExerciseDef) => `کتاب ص ${String(Math.floor(e.page)).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[+d])}`;
