/**
 * Типографика: расстановка неразрывных пробелов, чтобы исправить некорректные
 * переносы строк (висящие предлоги/союзы, разрыв «число + единица», тире в начале
 * строки и т. п.). Применяется ко всему отображаемому тексту словарей.
 *
 * Язык не важен — правила работают одинаково для ru / kk / en, так как опираются
 * на длину слова и пунктуацию, а не на конкретный словарь.
 */

const NBSP = ' ';

// Служебные слова из 3+ букв (предлоги, союзы), которые тоже не должны
// оставаться в конце строки. Слова из 1–2 букв обрабатываются обобщённо.
const FUNCTION_WORDS = [
  // ru
  'для', 'при', 'без', 'над', 'под', 'про', 'как', 'что', 'или', 'чтобы',
  'если', 'либо', 'чем', 'это', 'эта', 'эти', 'тот',
  // en
  'the', 'and', 'for', 'but', 'nor', 'yet', 'are', 'was',
  // kk
  'мен', 'бен', 'пен', 'үшін', 'және', 'бұл', 'осы', 'сол',
]

const FUNCTION_WORDS_RE = new RegExp(
  `(?<=^|[\\s(«"„\\[ ])(${FUNCTION_WORDS.join('|')})[ \\t]+(?=\\p{L}|\\d)`,
  'giu',
)

// Словосочетания, которые нельзя разрывать переносом (внутренние пробелы
// заменяются на неразрывные). Сюда добавляем случаи, которые общие правила
// не ловят — когда оба слова длинные, но по смыслу должны идти в одной строке.
const KEEP_TOGETHER = [
  'оптимального микроклимата',
  'вакуумным прессованием',
]

const KEEP_TOGETHER_RE = KEEP_TOGETHER.map((phrase) => ({
  re: new RegExp(phrase.replace(/\s+/g, '[ \\t ]+'), 'giu'),
  glued: phrase.replace(/\s+/g, NBSP),
}))

/**
 * Применяет типографские правила к одной строке.
 */
export function applyTypography(input: string): string {
  let s = input;

  // 1. Короткие слова (предлоги, союзы, частицы 1–2 буквы) приклеиваем к
  //    следующему слову, чтобы они не оставались в конце строки.
  //    Lookbehind не «съедает» разделитель — это позволяет обрабатывать
  //    идущие подряд короткие слова («и в дом» → «и в дом»).
  s = s.replace(
    /(?<=^|[\s(«"„\[ ])(\p{L}{1,2})[ \t]+(?=\p{L}|\d)/gu,
    `$1${NBSP}`,
  );

  // 1b. Явный список служебных слов из 3+ букв (для, при, как, the, and …).
  s = s.replace(FUNCTION_WORDS_RE, `$1${NBSP}`);

  // 2. Число и следующее за ним слово либо группа цифр не разрываются
  //    («15 Га», «1 000», «5 кг»).
  s = s.replace(/(\d)[ \t]+(?=[\p{L}\d])/gu, `$1${NBSP}`);

  // 3. Тире.
  //   а) Одиночный дефис/среднее тире между словами (в окружении пробелов) —
  //      это тире: заменяем на длинное «—». Диапазоны вроде «40-50», «5–10°C»
  //      без пробелов не затрагиваются.
  //   б) Перед тире ставим неразрывный пробел, после — обычный, чтобы тире
  //      не начинало строку и не отрывалось от предыдущего слова.
  s = s.replace(/(\S)[ \t]+[-–][ \t]+/gu, `$1${NBSP}— `);
  s = s.replace(/(\S)[ \t]+(—)/gu, `$1${NBSP}$2`);

  // 4. № и § не отрываются от своего числа.
  s = s.replace(/([№§])[ \t]+(?=\d)/g, `$1${NBSP}`);

  // 5. Словосочетания из списка KEEP_TOGETHER не разрываются.
  for (const { re, glued } of KEEP_TOGETHER_RE) {
    s = s.replace(re, glued);
  }

  return s;
}

// Технические ключи, значения которых не являются отображаемым текстом.
const SKIP_KEYS = new Set([
  'href', 'icon', 'color', 'src', 'image', 'img', 'url', 'link',
  'poster', 'video', 'id', 'slug', 'className', 'class', 'key', 'alt',
]);

/**
 * Решает, нужно ли пропустить значение (ссылки, пути, цвета, эмодзи, числа).
 */
function shouldSkipValue(s: string): boolean {
  if (s.length < 2) return true;
  if (/^[#/]/.test(s)) return true;                 // путь, якорь, hex-цвет
  if (/^https?:/i.test(s)) return true;             // ссылка
  if (!/\p{L}/u.test(s)) return true;               // нет букв (эмодзи, числа, символы)
  if (/\//.test(s) && !/\s/.test(s)) return true;   // путь без пробелов
  return false;
}

/**
 * Рекурсивно применяет типографику ко всем строковым значениям объекта,
 * не трогая технические ключи и нетекстовые значения. Возвращает новую копию.
 */
export function typographDeep<T>(value: T, key?: string): T {
  if (typeof value === 'string') {
    if (key && SKIP_KEYS.has(key)) return value;
    if (shouldSkipValue(value)) return value;
    return applyTypography(value) as unknown as T;
  }
  if (Array.isArray(value)) {
    return value.map((v) => typographDeep(v)) as unknown as T;
  }
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const k in value as Record<string, unknown>) {
      out[k] = typographDeep((value as Record<string, unknown>)[k], k);
    }
    return out as unknown as T;
  }
  return value;
}
