const STEMS = '甲乙丙丁戊己庚辛壬癸';
const BRANCHES = '子丑寅卯辰巳午未申酉戌亥';

// 各「节」（节气之节）的近似交节日，用于确定干支月支：寅月起于立春
const MONTH_JIE: { month: number; day: number; branch: number }[] = [
  { month: 1, day: 6, branch: 1 }, // 小寒 -> 丑月
  { month: 2, day: 4, branch: 2 }, // 立春 -> 寅月
  { month: 3, day: 6, branch: 3 }, // 惊蛰 -> 卯月
  { month: 4, day: 5, branch: 4 }, // 清明 -> 辰月
  { month: 5, day: 6, branch: 5 }, // 立夏 -> 巳月
  { month: 6, day: 6, branch: 6 }, // 芒种 -> 午月
  { month: 7, day: 7, branch: 7 }, // 小暑 -> 未月
  { month: 8, day: 8, branch: 8 }, // 立秋 -> 申月
  { month: 9, day: 8, branch: 9 }, // 白露 -> 酉月
  { month: 10, day: 8, branch: 10 }, // 寒露 -> 戌月
  { month: 11, day: 7, branch: 11 }, // 立冬 -> 亥月
  { month: 12, day: 7, branch: 0 }, // 大雪 -> 子月
];

/** 儒略日数（当日正午，UTC） */
function julianDayNumber(year: number, month: number, day: number) {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return (
    day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045
  );
}

/** 日柱干支，如「戊午」 */
export function getDayGanzhi(date: Date) {
  const jdn = julianDayNumber(date.getFullYear(), date.getMonth() + 1, date.getDate());
  const index = ((jdn + 49) % 60 + 60) % 60;
  return STEMS[index % 10] + BRANCHES[index % 12];
}

/** 月柱干支，如「戊戌」 */
export function getMonthGanzhi(date: Date) {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  let branch = 0; // 子
  for (const jie of MONTH_JIE) {
    if (month > jie.month || (month === jie.month && day >= jie.day)) {
      branch = jie.branch;
    }
  }
  // 1 月初，未过小寒，仍属上一年子月
  if (month === 1 && day < MONTH_JIE[0].day) {
    branch = 0;
  }

  // 干支年以立春为界
  const beforeSpring = month < 2 || (month === 2 && day < 4);
  const ganzhiYear = beforeSpring ? date.getFullYear() - 1 : date.getFullYear();
  const yearStem = ((ganzhiYear - 4) % 10 + 10) % 10;

  // 月序：寅=1 … 丑=12
  const monthOrder = ((branch - 2 + 12) % 12) + 1;
  // 五虎遁：由年干推月干
  const monthStem = (2 * yearStem + 1 + monthOrder) % 10;

  return STEMS[monthStem] + BRANCHES[branch];
}
