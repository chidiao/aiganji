import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetch } from 'expo/fetch';

export type Hitokoto = {
  hitokoto: string;
  from: string;
  from_who?: string | null;
  type?: string;
};

const HITOKOTO_API = 'https://v1.hitokoto.cn/';
const CACHE_KEY = 'hitokoto-cache';
const CACHE_LIMIT = 7;

type QuoteEntry = {
  dateKey: string;
  quote: Hitokoto;
};

let memory: QuoteEntry | null = null;

function todayKey() {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
}

async function loadCache(): Promise<QuoteEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as QuoteEntry[]) : [];
  } catch {
    return [];
  }
}

async function saveCache(entries: QuoteEntry[]): Promise<void> {
  await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(entries.slice(0, CACHE_LIMIT))).catch(
    () => {},
  );
}

/** Most recently cached quote, shown while the daily request is in flight. */
export async function getLatestCachedQuote(): Promise<Hitokoto | null> {
  if (memory) return memory.quote;

  const cache = await loadCache();
  if (cache[0]) {
    memory = cache[0];
    return cache[0].quote;
  }
  return null;
}

/**
 * Returns today's quote. Reuses the cache if today was already fetched; otherwise
 * requests the API and stores the result, keeping at most the last 7 days. Falls
 * back to the most recent cached quote when the request fails.
 */
export async function fetchDailyQuote(): Promise<Hitokoto> {
  const dateKey = todayKey();
  if (memory?.dateKey === dateKey) return memory.quote;

  const cache = await loadCache();
  const todayEntry = cache.find((entry) => entry.dateKey === dateKey);
  if (todayEntry) {
    memory = todayEntry;
    return todayEntry.quote;
  }

  const fallback = cache[0]?.quote ?? null;

  try {
    const res = await fetch(HITOKOTO_API);
    if (!res.ok) {
      throw new Error(`Hitokoto request failed with status ${res.status}`);
    }
    const quote = (await res.json()) as Hitokoto;
    memory = { dateKey, quote };
    await saveCache([{ dateKey, quote }, ...cache.filter((entry) => entry.dateKey !== dateKey)]);
    return quote;
  } catch (error) {
    if (fallback) return fallback;
    throw error;
  }
}
