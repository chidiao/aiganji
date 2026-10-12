import { getMarket, type MarketName } from '@/constants/market';
import { solarToLunar } from '@/utils/lunar';

export function addDays(base: Date, offset: number): Date {
  const date = new Date(base);
  date.setDate(base.getDate() + offset);
  return date;
}

export function getMarketForDate(date: Date): MarketName | null {
  return getMarket(solarToLunar(date).day);
}

export function findNextMarket(
  base: Date,
  maxDays = 7
): { date: Date; market: MarketName; offset: number } | null {
  for (let offset = 1; offset <= maxDays; offset++) {
    const date = addDays(base, offset);
    const market = getMarketForDate(date);
    if (market) return { date, market, offset };
  }
  return null;
}
