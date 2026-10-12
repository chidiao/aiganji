export type MarketName = '东夏峰' | '孟庄' | '西夏峰';

export function getMarket(lunarDay: number): MarketName | null {
  switch (lunarDay % 5) {
    case 1:
      return '东夏峰';
    case 3:
      return '孟庄';
    case 0:
      return '西夏峰';
    default:
      return null;
  }
}

export const MARKET_RULES: readonly { name: MarketName; days: string }[] = [
  { name: '东夏峰', days: '初一 · 初六 · 十一 · 十六 · 廿一 · 廿六' },
  { name: '孟庄', days: '初三 · 初八 · 十三 · 十八 · 廿三 · 廿八' },
  { name: '西夏峰', days: '初五 · 初十 · 十五 · 二十 · 廿五 · 三十' },
];
