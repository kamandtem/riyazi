import { ExerciseDef } from './types';

/**
 * کاتالوگ تمرین‌های نسخهٔ اول (فقط «ضروری» و «مهم»).
 * هر ردیف یک «الگوی تمرینی» است، نه یک سؤال؛ عددها در هر دور تازه ساخته می‌شوند.
 * افزودن تمرین تازه = افزودن یک ردیف (با یکی از typeهای موجود) — نیازی به دست زدن به UI نیست.
 * ترتیب ردیف‌ها داخل هر خانه همان ترتیب پیشنهادی (سطح ۱ ← ۳) است.
 */
export const FRUITS = ['🍎', '🍐', '🍊', '🍓', '🍋', '🍇'];
export const ANIMALS = ['🐥', '🐟', '🐞', '🐸', '🐰', '🦋', '🐢', '🐝'];
export const TOYS = ['⚽', '🎈', '🧸', '🚗', '⭐', '🪁'];
const ALL = [...FRUITS, ...ANIMALS, ...TOYS];

export const EXERCISES: ExerciseDef[] = [
  /* ---------------- جزیرهٔ ۱ · خانهٔ شمارش ---------------- */
  { id: 'count-touch', house: 'counting', skill: 'counting', level: 1, difficulty: 1, priority: 'essential', type: 'tapCount', emoji: '👆',
    title: 'لمس کن و بشمار', goal: 'تناظر یک‌به‌یک: هر شیء فقط یک بار شمرده شود؛ عدد آخر یعنی تعداد کل.',
    objects: ALL, params: { min: 1, max: 6, layout: 'row' }, prerequisite: [],
    feedback: { hint: 'هر کدام را فقط یک بار لمس کن.' } },
  { id: 'count-scatter', house: 'counting', skill: 'counting', level: 2, difficulty: 2, priority: 'essential', type: 'tapCount', emoji: '🐞',
    title: 'شمردن اشیای پراکنده', goal: 'پیگیری شمارش وقتی اشیا مرتب نیستند (کدام را شمردم؟).',
    objects: ANIMALS, params: { min: 5, max: 10, layout: 'scatter' }, prerequisite: ['count-touch'] },
  { id: 'subitize', house: 'counting', skill: 'counting', level: 2, difficulty: 2, priority: 'important', type: 'subitize', emoji: '⚡',
    title: 'سریع بگو چند تا', goal: 'دیدن تعداد بدون شمردن (۱ تا ۶) با الگوی تاس و خانهٔ ده‌تایی؛ پایهٔ جمع ذهنی.',
    params: { min: 1, max: 6, flashMs: 1700 }, prerequisite: ['count-touch'] },
  { id: 'count-check', house: 'counting', skill: 'counting', level: 3, difficulty: 3, priority: 'important', type: 'countCheck', emoji: '🐰',
    title: 'خرگوش درست شمرد؟', goal: 'فهم قاعده‌های شمارش: جا انداختن، دوبار شمردن و پریدن از روی عدد اشتباه است.',
    objects: FRUITS, params: { min: 4, max: 8 }, prerequisite: ['count-scatter'] },
  { id: 'count-on', house: 'counting', skill: 'counting', level: 3, difficulty: 3, priority: 'essential', type: 'countOn', emoji: '📦',
    title: 'ادامه بشمار', goal: 'شمردن از عدد دسته‌ی اول به بعد، بدون شروع دوباره از یک (کتاب: آمادگی برای جمع).',
    objects: TOYS, params: { start: [3, 7], add: [1, 3] }, prerequisite: ['count-scatter'] },

  /* ---------------- جزیرهٔ ۱ · خانهٔ ساختن عدد ---------------- */
  { id: 'build-set', house: 'building', skill: 'numberSense', level: 1, difficulty: 1, priority: 'essential', type: 'buildSet', emoji: '🧺',
    title: 'به همین تعداد بگذار', goal: 'ساختن یک مجموعه با تعداد مشخص (از عدد به مقدار).',
    objects: FRUITS, params: { min: 1, max: 10, rep: 'objects' }, prerequisite: ['count-touch'] },
  { id: 'build-tally', house: 'building', skill: 'numberSense', level: 2, difficulty: 2, priority: 'essential', type: 'buildSet', emoji: '🥢',
    title: 'چوب‌خط بکش', goal: 'نمایش عدد با چوب‌خط و دسته‌های پنج‌تایی (کتاب از فصل ۴ تا آخر از آن استفاده می‌کند).',
    params: { min: 2, max: 12, rep: 'tally' }, prerequisite: ['build-set'] },
  { id: 'match-rep', house: 'building', skill: 'numberSense', level: 2, difficulty: 2, priority: 'essential', type: 'matchRep', emoji: '🃏',
    title: 'کدام کارت همین عدد است؟', goal: 'یک عدد، چند نمایش: نقطه، چوب‌خط، خانهٔ ده‌تایی و شیء.',
    objects: FRUITS, params: { min: 1, max: 10, dir: 'toRep', reps: ['dots', 'tally', 'tenframe', 'objects'] }, prerequisite: ['build-set'] },
  { id: 'five-and', house: 'building', skill: 'numberSense', level: 3, difficulty: 3, priority: 'important', type: 'matchRep', emoji: '✋',
    title: 'پنج و چند تا؟', goal: 'دیدن ۶ تا ۱۰ به‌صورت «۵ و ...» (کتاب: ۶ = ۵ و ۱، ۷ = ۵ و ۲ ...).',
    params: { min: 5, max: 10, dir: 'toNumber', reps: ['tenframe'], fiveStructure: true }, prerequisite: ['match-rep'] },

  /* ---------------- جزیرهٔ ۱ · خانهٔ قبل و بعد ---------------- */
  { id: 'one-more-less', house: 'neighbors', skill: 'order', level: 1, difficulty: 1, priority: 'essential', type: 'oneMoreLess', emoji: '🐥',
    title: 'یکی آمد، یکی رفت', goal: 'یکی بیشتر و یکی کمتر با اشیا، بدون شمردن دوباره (کتاب ص ۱۲ و ۱۴).',
    objects: ANIMALS, params: { min: 1, max: 9 }, prerequisite: ['count-touch'] },
  { id: 'before-after', house: 'neighbors', skill: 'order', level: 2, difficulty: 2, priority: 'essential', type: 'sequenceGap', emoji: '🚂',
    title: 'قطار قبل و بعد', goal: 'عدد قبل و عدد بعد یک عدد تا ۲۰.',
    params: { mode: 'neighbors', min: 1, max: 20, theme: 'train' }, prerequisite: ['one-more-less'] },
  { id: 'count-forward', house: 'neighbors', skill: 'order', level: 2, difficulty: 2, priority: 'essential', type: 'sequenceGap', emoji: '🐾',
    title: 'جای خالی را پر کن', goal: 'ادامهٔ شمارش رو به جلو و کامل کردن دنباله.',
    params: { mode: 'run', len: 6, gaps: 2, step: 1, dir: 1, min: 0, max: 20, theme: 'stones' }, prerequisite: ['before-after'] },
  { id: 'count-back', house: 'neighbors', skill: 'order', level: 3, difficulty: 3, priority: 'important', type: 'sequenceGap', emoji: '🚀',
    title: 'شمارش معکوس موشک', goal: 'شمارش رو به عقب از ۱۰ (آمادگی برای تفریق روی محور).',
    params: { mode: 'run', len: 6, gaps: 2, step: 1, dir: -1, min: 0, max: 12, theme: 'rocket' }, prerequisite: ['count-forward'] },
  { id: 'order-cards', house: 'neighbors', skill: 'order', level: 3, difficulty: 3, priority: 'essential', type: 'orderCards', emoji: '🔢',
    title: 'از کوچک به بزرگ', goal: 'مرتب کردن چند عدد (عددها پشت سر هم نیستند).',
    params: { count: [3, 5], min: 0, max: 20 }, prerequisite: ['before-after'] },

  /* ---------------- جزیرهٔ ۱ · خانهٔ مقایسه ---------------- */
  { id: 'more-less', house: 'compare', skill: 'compare', level: 1, difficulty: 1, priority: 'essential', type: 'compareGroups', emoji: '🐸',
    title: 'کدام بیشتر است؟', goal: 'بیشتر، کمتر و مساوی با جفت کردن یک‌به‌یک (نه فقط اندازهٔ ظاهری دسته).',
    objects: ALL, params: { min: 1, max: 9, equalFrom: 3 }, prerequisite: ['count-touch'] },
  { id: 'make-equal', house: 'compare', skill: 'compare', level: 2, difficulty: 2, priority: 'essential', type: 'makeEqual', emoji: '🟰',
    title: 'مساوی‌اش کن', goal: 'آن‌قدر بگذار یا بردار که دو دسته برابر شوند (کتاب ص ۷۲).',
    objects: FRUITS, params: { min: 2, max: 8 }, prerequisite: ['more-less'] },
  { id: 'compare-symbol', house: 'compare', skill: 'compare', level: 3, difficulty: 3, priority: 'essential', type: 'compareSymbol', emoji: '🐊',
    title: 'علامت < > =', goal: 'از مقایسهٔ دو دسته به مقایسهٔ دو عدد و نماد آن.',
    objects: ALL, params: { min: 0, max: 10, pictureRounds: 3, maxNumbers: 20 }, prerequisite: ['make-equal'] },

  /* ---------------- جزیرهٔ ۱ · خانهٔ ده‌تایی‌ها ---------------- */
  { id: 'bundle-ten', house: 'tens', skill: 'placeValue', level: 2, difficulty: 3, priority: 'important', type: 'tensOnes', emoji: '🥢',
    title: 'ده‌تا را ببند', goal: 'عددهای ۱۱ تا ۱۹ یعنی «یک ده‌تایی و چند یکی».',
    params: { mode: 'bundle', min: 11, max: 19 }, prerequisite: ['build-tally', 'count-scatter'] },
  { id: 'build-tens', house: 'tens', skill: 'placeValue', level: 3, difficulty: 4, priority: 'important', type: 'tensOnes', emoji: '📦',
    title: 'عدد را با بسته‌ها بساز', goal: 'ساختن عدد دورقمی با بستهٔ ده‌تایی و یکی (جدول ده‌تایی/یکی کتاب).',
    params: { mode: 'build', min: 10, max: 59 }, prerequisite: ['bundle-ten'] },

  /* ---------------- جزیرهٔ ۲ · خانهٔ الگو ---------------- */
  { id: 'pattern-next', house: 'patterns', skill: 'pattern', level: 1, difficulty: 1, priority: 'essential', type: 'pattern', emoji: '🔴',
    title: 'بعدی چیست؟', goal: 'پیدا کردن عضو بعدی الگوی رنگی، شکلی، تصویری و حرکتی.',
    params: { mode: 'next', units: ['AB', 'AAB', 'ABB', 'ABC'], kinds: ['color', 'shape', 'picture', 'motion'] }, prerequisite: [] },
  { id: 'pattern-gap', house: 'patterns', skill: 'pattern', level: 2, difficulty: 2, priority: 'essential', type: 'pattern', emoji: '🧩',
    title: 'جای خالی الگو', goal: 'استفاده از نظم الگو در وسط آن، نه فقط در انتها.',
    params: { mode: 'gap', units: ['AB', 'AAB', 'ABC', 'AABB'], kinds: ['color', 'shape', 'picture'] }, prerequisite: ['pattern-next'] },
  { id: 'pattern-wrong', house: 'patterns', skill: 'pattern', level: 3, difficulty: 3, priority: 'essential', type: 'pattern', emoji: '🔍',
    title: 'قطعهٔ اشتباه', goal: 'بررسی کل الگو و پیدا کردن جایی که نظم به هم خورده است.',
    params: { mode: 'wrong', units: ['AB', 'ABC', 'AAB', 'ABB'], kinds: ['color', 'shape', 'picture'] }, prerequisite: ['pattern-gap'] },
  { id: 'pattern-unit', house: 'patterns', skill: 'pattern', level: 3, difficulty: 4, priority: 'important', type: 'pattern', emoji: '🔁',
    title: 'چه چیزی تکرار می‌شود؟', goal: 'تشخیص بخش تکرارشوندهٔ الگو (کتاب ص ۳۴ و ۳۹).',
    params: { mode: 'unit', units: ['AB', 'AAB', 'ABB', 'ABC', 'AABB'], kinds: ['color', 'shape', 'picture'] }, prerequisite: ['pattern-gap'] },
  { id: 'pattern-number', house: 'patterns', skill: 'pattern', level: 3, difficulty: 4, priority: 'important', type: 'sequenceGap', emoji: '🦘',
    title: 'الگوی عددی', goal: 'شمردن ۲تا۲تا، ۵تا۵تا و ۱۰تا۱۰تا با دیدن اندازهٔ پرش.',
    params: { mode: 'run', len: 6, gaps: 1, steps: [2, 5, 10], dir: 1, min: 0, max: 60, theme: 'jumps', showJumps: true }, prerequisite: ['pattern-next', 'count-forward'] },

  /* ---------------- جزیرهٔ ۲ · خانهٔ جدول عددها ---------------- */
  { id: 'chart-find', house: 'chart', skill: 'numberChart', level: 1, difficulty: 2, priority: 'essential', type: 'chart', emoji: '🔎',
    title: 'عدد را در جدول پیدا کن', goal: 'آشنایی با جدول و جای عددها در ردیف‌ها.',
    params: { mode: 'find', size: 20 }, prerequisite: ['before-after'] },
  { id: 'chart-fill', house: 'chart', skill: 'numberChart', level: 2, difficulty: 3, priority: 'essential', type: 'chart', emoji: '✏️',
    title: 'خانهٔ خالی جدول', goal: 'استفاده از عدد قبل، بعد، بالا و پایین برای پیدا کردن عدد گم‌شده.',
    params: { mode: 'fill', size: 30 }, prerequisite: ['chart-find'] },
  { id: 'chart-move', house: 'chart', skill: 'numberChart', level: 3, difficulty: 4, priority: 'important', type: 'chart', emoji: '🧭',
    title: 'حرکت در جدول', goal: 'یک خانه جلو = یکی بیشتر؛ یک خانه پایین = ده‌تا بیشتر.',
    params: { mode: 'move', size: 50 }, prerequisite: ['chart-fill'] },
  { id: 'chart-skip', house: 'chart', skill: 'numberChart', level: 3, difficulty: 4, priority: 'important', type: 'chart', emoji: '🎨',
    title: 'با پرش رنگ کن', goal: 'دیدن الگوی ۲تا۲تا، ۵تا۵تا و ۱۰تا۱۰تا روی جدول (کتاب ص ۱۴۹).',
    params: { mode: 'skip', size: 50, steps: [2, 5, 10] }, prerequisite: ['chart-fill', 'pattern-number'] },

  /* ---------------- جزیرهٔ ۲ · خانهٔ جدول شگفت‌انگیز ---------------- */
  { id: 'latin-3', house: 'logic', skill: 'logic', level: 2, difficulty: 2, priority: 'important', type: 'latinSquare', emoji: '🟥',
    title: 'جدول شگفت‌انگیز رنگی', goal: 'استدلال با سطر و ستون (در هر ردیف و ستون هر رنگ یک بار).',
    params: { n: 3, symbols: 'colors', blanks: [2, 3] }, prerequisite: ['pattern-next'], rounds: 4 },
  { id: 'latin-4', house: 'logic', skill: 'logic', level: 3, difficulty: 4, priority: 'important', type: 'latinSquare', emoji: '4️⃣',
    title: 'جدول شگفت‌انگیز عددی', goal: 'همان استدلال با عددهای ۱ تا ۴ (کتاب ص ۵۶).',
    params: { n: 4, symbols: 'numbers', blanks: [3, 4] }, prerequisite: ['latin-3'], rounds: 4 },

  /* ---------------- جزیرهٔ ۲ · خانهٔ شکل‌ها ---------------- */
  { id: 'shape-corners', house: 'shapes', skill: 'geometry', level: 1, difficulty: 1, priority: 'important', type: 'shapeCorners', emoji: '🔺',
    title: 'گوشه‌ها را بشمار', goal: 'شناختن شکل از روی تعداد گوشه و لبه (بدون حفظ کردن نام).',
    params: { mode: 'count' }, prerequisite: ['count-touch'] },
  { id: 'shape-which', house: 'shapes', skill: 'geometry', level: 2, difficulty: 2, priority: 'important', type: 'shapeCorners', emoji: '🟦',
    title: 'کدام شکل؟', goal: 'پیدا کردن شکل با تعداد گوشهٔ خواسته‌شده میان شکل‌های چرخیده و هم‌رنگ.',
    params: { mode: 'which' }, prerequisite: ['shape-corners'] },

  /* ---------------- جزیرهٔ ۲ · خانهٔ اندازه ---------------- */
  { id: 'longer-shorter', house: 'measure', skill: 'measurement', level: 1, difficulty: 1, priority: 'important', type: 'compareLength', emoji: '✏️',
    title: 'بلندتر و کوتاه‌تر', goal: 'مقایسهٔ طول با هم‌تراز کردن سر اشیا.',
    params: {}, prerequisite: [] },
  { id: 'measure-units', house: 'measure', skill: 'measurement', level: 2, difficulty: 2, priority: 'important', type: 'measureUnits', emoji: '📎',
    title: 'چند گیره است؟', goal: 'عدد به‌عنوان طول: واحدها پشت سر هم، بدون فاصله (کتاب ص ۵۵).',
    params: { min: 2, max: 8 }, prerequisite: ['count-touch', 'longer-shorter'] },

  /* ---------------- جزیرهٔ ۳ · خانهٔ جمع ---------------- */
  { id: 'add-combine', house: 'addition', skill: 'addition', level: 1, difficulty: 1, priority: 'essential', type: 'addCombine', emoji: '🍎',
    title: 'دو دسته، یک سبد', goal: 'جمع یعنی کنار هم گذاشتن: دو دسته را یکی کن و همه را بشمار.',
    objects: FRUITS, params: { rep: 'objects', maxSum: 8 }, prerequisite: ['count-on'] },
  { id: 'add-tally', house: 'addition', skill: 'addition', level: 2, difficulty: 2, priority: 'essential', type: 'addCombine', emoji: '🥢',
    title: 'جمع با چوب‌خط', goal: 'همان جمع با نمایش چوب‌خط؛ دستهٔ پنج‌تایی شمردن را سریع‌تر می‌کند.',
    params: { rep: 'tally', maxSum: 12 }, prerequisite: ['add-combine', 'build-tally'] },
  { id: 'add-frame', house: 'addition', skill: 'addition', level: 2, difficulty: 2, priority: 'important', type: 'addCombine', emoji: '🟦',
    title: 'جمع با خانه‌های رنگی', goal: 'رنگ کردن دو رنگ در خانهٔ ده‌تایی و دیدن حاصل (کتاب ص ۸۸).',
    params: { rep: 'tenframe', maxSum: 10 }, prerequisite: ['add-combine'] },
  { id: 'add-number', house: 'addition', skill: 'addition', level: 3, difficulty: 3, priority: 'essential', type: 'expression', emoji: '🔢',
    title: 'جمع با عدد', goal: 'عبارت جمع؛ اگر لازم شد، کمکِ تصویری در دسترس است.',
    params: { op: '+', maxSum: 10 }, prerequisite: ['add-tally'] },
  { id: 'add-reps', house: 'addition', skill: 'addition', level: 3, difficulty: 3, priority: 'essential', type: 'repMatch', emoji: '🪞',
    title: 'یک جمع، چند شکل', goal: 'شکل، چوب‌خط، محور و عدد همه نمایش یک مفهوم‌اند.',
    objects: FRUITS, params: { op: '+', maxSum: 10 }, prerequisite: ['add-number'] },

  /* ---------------- جزیرهٔ ۳ · خانهٔ تفریق ---------------- */
  { id: 'take-away', house: 'subtraction', skill: 'subtraction', level: 1, difficulty: 1, priority: 'essential', type: 'takeAway', emoji: '🐦',
    title: 'پرنده‌ها پریدند', goal: 'تفریق یعنی برداشتن: خودت بردار و باقی‌مانده را بشمار (صفر هم پیش می‌آید).',
    params: { rep: 'objects', max: 8 }, prerequisite: ['count-touch', 'one-more-less'] },
  { id: 'take-tally', house: 'subtraction', skill: 'subtraction', level: 2, difficulty: 2, priority: 'essential', type: 'takeAway', emoji: '✂️',
    title: 'تفریق با چوب‌خط', goal: 'خط زدن چوب‌خط‌ها و خواندن باقی‌مانده (کتاب ص ۳۸ و ۴۰).',
    params: { rep: 'tally', max: 10 }, prerequisite: ['take-away', 'build-tally'] },
  { id: 'sub-number', house: 'subtraction', skill: 'subtraction', level: 3, difficulty: 3, priority: 'essential', type: 'expression', emoji: '🔢',
    title: 'تفریق با عدد', goal: 'عبارت تفریق؛ کمکِ تصویری در دسترس است.',
    params: { op: '-', max: 10 }, prerequisite: ['take-tally'] },
  { id: 'sub-reps', house: 'subtraction', skill: 'subtraction', level: 3, difficulty: 3, priority: 'important', type: 'repMatch', emoji: '🪞',
    title: 'یک تفریق، چند شکل', goal: 'پیوند دادن تصویر برداشتن، چوب‌خط خط‌خورده، پرش عقب و عبارت.',
    objects: FRUITS, params: { op: '-', max: 10 }, prerequisite: ['sub-number'] },

  /* ---------------- جزیرهٔ ۳ · خانهٔ محور ---------------- */
  { id: 'line-add', house: 'numberline', skill: 'numberLine', level: 2, difficulty: 2, priority: 'essential', type: 'lineJump', emoji: '🐸',
    title: 'جلو بپر', goal: 'جمع روی محور یعنی چند تا جلو رفتن (کتاب ص ۱۱۹).',
    params: { op: '+', max: 10, guided: true }, prerequisite: ['add-combine', 'count-forward'] },
  { id: 'line-sub', house: 'numberline', skill: 'numberLine', level: 2, difficulty: 2, priority: 'essential', type: 'lineJump', emoji: '🐸',
    title: 'عقب بپر', goal: 'تفریق روی محور یعنی چند تا عقب رفتن.',
    params: { op: '-', max: 10, guided: true }, prerequisite: ['line-add', 'take-away'] },
  { id: 'line-expr', house: 'numberline', skill: 'numberLine', level: 3, difficulty: 4, priority: 'important', type: 'lineJump', emoji: '🧠',
    title: 'عبارت را بپر', goal: 'از روی عبارت، خودت نقطهٔ شروع و جهت پرش را پیدا کن (تا ۲۰).',
    params: { op: 'mix', max: 20, guided: false }, prerequisite: ['line-sub'] },

  /* ---------------- جزیرهٔ ۳ · خانهٔ ساختن ده ---------------- */
  { id: 'hidden-part', house: 'bonds', skill: 'composition', level: 2, difficulty: 2, priority: 'essential', type: 'hiddenPart', emoji: '🥣',
    title: 'زیر کاسه چند تا؟', goal: 'کل و جزء: اگر کل را بدانی و یک تکه را ببینی، تکهٔ پنهان را پیدا می‌کنی.',
    params: { mode: 'hidden', min: 3, max: 10 }, prerequisite: ['add-combine', 'take-away'] },
  { id: 'make-ten', house: 'bonds', skill: 'composition', level: 2, difficulty: 3, priority: 'essential', type: 'makeTen', emoji: '🔟',
    title: 'ده را کامل کن', goal: 'چند تا دیگر تا ده؟ (پایهٔ راهبرد «ده‌سازی» کتاب ص ۱۲۶).',
    params: {}, prerequisite: ['add-frame'] },
  { id: 'split-number', house: 'bonds', skill: 'composition', level: 3, difficulty: 3, priority: 'important', type: 'hiddenPart', emoji: '🎨',
    title: 'یک عدد، چند جمع', goal: 'پیدا کردن جفت‌عددهایی که با هم یک عدد می‌شوند (کتاب ص ۸۷ و ۹۰).',
    params: { mode: 'split', min: 4, max: 10, need: 3 }, prerequisite: ['hidden-part'], rounds: 3 },

  /* ---------------- جزیرهٔ ۳ · خانهٔ مسئله ---------------- */
  { id: 'story-picture', house: 'problems', skill: 'problemSolving', level: 2, difficulty: 3, priority: 'essential', type: 'story', emoji: '🦆',
    title: 'قصهٔ تصویری', goal: 'فهمیدن قصه: چیزی اضافه شد یا کم شد؟ بعد پیدا کردن جواب با تصویر.',
    params: { mode: 'solve', max: 10 }, prerequisite: ['add-number', 'sub-number'] },
  { id: 'story-expression', house: 'problems', skill: 'problemSolving', level: 3, difficulty: 4, priority: 'important', type: 'story', emoji: '📝',
    title: 'عبارت قصه', goal: 'انتخاب عبارت ریاضیِ مناسبِ قصه و حل آن (تا ۲۰).',
    params: { mode: 'expression', max: 20 }, prerequisite: ['story-picture', 'line-expr'] },
];

export const EXERCISE_BY_ID: Record<string, ExerciseDef> = Object.fromEntries(EXERCISES.map(e => [e.id, e]));
export const exercisesOfHouse = (house: string) => EXERCISES.filter(e => e.house === house);
