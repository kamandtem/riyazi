import { HouseDef, HouseId, IslandDef } from './types';

/**
 * ساختار آموزشی اپ: ۳ جزیره × ۵ خانه.
 * ترتیب جزیره‌ها و خانه‌ها همان مسیر پیشنهادی یادگیری است
 * (از کتاب: شمارش و الگو ← نمایش‌های عدد ← مقایسه ← جمع و تفریق مفهومی ← نماد ← محور و مسئله).
 */
export const ISLANDS: IslandDef[] = [
  { id: 'numbers', title: 'جزیرهٔ عددها', subtitle: 'بشمار، بساز، مقایسه کن', houses: ['counting', 'building', 'neighbors', 'compare', 'tens'],
    text: 'بشمار و بگو، با انگشت نشان بده، چوب‌خط بکش، یکی بیشتر و یکی کمتر، و دسته‌ها را مقایسه کن. تمرین‌های اول بدون نوشتن عدد است، مثل کتاب تا تم ۷.' },
  { id: 'order', title: 'جزیرهٔ نظم و الگو', subtitle: 'الگو، جدول و شکل', houses: ['patterns', 'chart', 'logic', 'shapes', 'measure'],
    text: 'پیدا کردن نظم در الگوها، کار با جدول عددها، جدول‌های شگفت‌انگیز، شکل‌ها و اندازه‌گیری.' },
  { id: 'operations', title: 'جزیرهٔ جمع و تفریق', subtitle: 'با شکل، چوب‌خط و محور', houses: ['addition', 'subtraction', 'numberline', 'bonds', 'problems'],
    text: 'جمع و تفریق از شکل تا عدد: کنار هم گذاشتن، برداشتن، پریدن روی محور، ساختن ده و حل مسئلهٔ تصویری.' },
];

export const HOUSES: Record<HouseId, HouseDef> = {
  counting:    { id: 'counting', island: 'numbers', title: 'خانهٔ شمارش', subtitle: 'بشمار و بگو', emoji: '👆', tone: 'coral', text: 'یکی‌یکی لمس کن و بشمار، بلند بگو و به همان تعداد رنگ کن. اول فقط یک، دو، سه.' },
  building:    { id: 'building', island: 'numbers', title: 'خانهٔ انگشت و چوب‌خط', subtitle: 'با دست نشان بده', emoji: '✋', tone: 'green', text: 'تعداد را با انگشت‌های دست نشان بده، با دو دست بشمار و چوب‌خط بکش؛ پنجمی کج روی چهار تا.' },
  neighbors:   { id: 'neighbors', island: 'numbers', title: 'خانهٔ قبل و بعد', subtitle: 'ترتیب عددها', emoji: '🚂', tone: 'blue', text: 'یکی بیشتر، یکی کمتر، عدد قبل و بعد و مرتب کردن عددها.' },
  compare:     { id: 'compare', island: 'numbers', title: 'خانهٔ مقایسه', subtitle: 'بیشتر، کمتر، مساوی', emoji: '⚖️', tone: 'violet', text: 'کدام دسته بیشتر است؟ دو دسته را مساوی کن و علامت درست را بگذار.' },
  tens:        { id: 'tens', island: 'numbers', title: 'خانهٔ ده‌تایی‌ها', subtitle: 'ده‌تایی و یکی', emoji: '🥢', tone: 'sun', text: 'ده‌تا را با هم ببند و عددهای بزرگ‌تر از ده را بشناس.' },

  patterns:    { id: 'patterns', island: 'order', title: 'خانهٔ الگو', subtitle: 'بعدی چیست؟', emoji: '🔴', tone: 'coral', text: 'نظم را پیدا کن: بعدی، جای خالی، قطعهٔ اشتباه و بخش تکرارشونده.' },
  chart:       { id: 'chart', island: 'order', title: 'خانهٔ جدول عددها', subtitle: 'پیدا کن و کامل کن', emoji: '🔢', tone: 'green', text: 'روی جدول عددها بگرد، خانهٔ خالی را پر کن و الگوی حرکت را کشف کن.' },
  logic:       { id: 'logic', island: 'order', title: 'خانهٔ جدول شگفت‌انگیز', subtitle: 'هر ردیف یکی', emoji: '🧩', tone: 'blue', text: 'جدول را طوری کامل کن که در هر ردیف و هر ستون، هر رنگ فقط یک بار باشد.' },
  shapes:      { id: 'shapes', island: 'order', title: 'خانهٔ شکل‌ها', subtitle: 'گوشه‌ها را بشمار', emoji: '🔺', tone: 'violet', text: 'گوشه‌های هر شکل را بشمار و شکل‌ها را از هم تشخیص بده.' },
  measure:     { id: 'measure', island: 'order', title: 'خانهٔ اندازه', subtitle: 'بلند و کوتاه', emoji: '📏', tone: 'sun', text: 'بلندتر و کوتاه‌تر را پیدا کن و با گیره اندازه بگیر.' },

  addition:    { id: 'addition', island: 'operations', title: 'خانهٔ جمع', subtitle: 'کنار هم بگذار', emoji: '➕', tone: 'coral', text: 'دو دسته را کنار هم بگذار: با شکل، با چوب‌خط، با خانه‌های رنگی و بعد با عدد.' },
  subtraction: { id: 'subtraction', island: 'operations', title: 'خانهٔ تفریق', subtitle: 'بردار و ببین', emoji: '➖', tone: 'green', text: 'چندتا را بردار یا خط بزن و ببین چند تا مانده است.' },
  numberline:  { id: 'numberline', island: 'operations', title: 'خانهٔ محور', subtitle: 'جلو و عقب بپر', emoji: '🐸', tone: 'blue', text: 'قورباغه روی محور جلو می‌پرد (جمع) و عقب می‌پرد (تفریق).' },
  bonds:       { id: 'bonds', island: 'operations', title: 'خانهٔ ساختن ده', subtitle: 'دو تکهٔ یک عدد', emoji: '🔟', tone: 'violet', text: 'هر عدد از دو تکه ساخته می‌شود؛ ده را کامل کن و تکهٔ پنهان را پیدا کن.' },
  problems:    { id: 'problems', island: 'operations', title: 'خانهٔ مسئله', subtitle: 'قصه‌های عددی', emoji: '📖', tone: 'sun', text: 'قصه را گوش کن، تصویرش را ببین و بفهم چیزی اضافه شد یا کم شد.' },
};
