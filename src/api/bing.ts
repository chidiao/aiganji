import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import { fetch } from 'expo/fetch';

export type DailyBackground = {
  url: string;
  copyright?: string;
  title?: string;
};

const BING_BASE = 'https://cn.bing.com';
const BING_API = `${BING_BASE}/HPImageArchive.aspx?format=js&idx=0&n=1`;

const HISTORY_KEY = 'bing-image-history';
const HISTORY_LIMIT = 3;

type BingImageEntry = {
  dateKey: string;
  url: string;
};

type BingResponse = {
  images?: {
    url?: string;
    urlbase?: string;
    copyright?: string;
    title?: string;
  }[];
};

function dateKey(date = new Date()) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

async function loadHistory(): Promise<BingImageEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as BingImageEntry[]) : [];
  } catch {
    return [];
  }
}

export async function fetchDailyBackground(): Promise<DailyBackground> {
  const res = await fetch(BING_API);
  if (!res.ok) {
    throw new Error(`Bing background request failed with status ${res.status}`);
  }
  const data = (await res.json()) as BingResponse;
  const image = data.images?.[0];
  if (!image?.urlbase && !image?.url) {
    throw new Error('Bing background response is empty');
  }

  const urlbase = (image.urlbase ?? '').startsWith('http')
    ? image.urlbase
    : `${BING_BASE}${image.urlbase}`;
  const url = image.urlbase
    ? `${urlbase}_1920x1080.jpg`
    : image.url!.startsWith('http')
      ? image.url!
      : `${BING_BASE}${image.url}`;

  return { url, copyright: image.copyright, title: image.title };
}

/**
 * Keeps the image disk cache bounded: when the Bing image changes (new day or a
 * mid-day swap), the old cached image is cleared from disk and only the latest
 * one is kept. A rolling list of the most recent URLs is persisted so the
 * change can be detected across app restarts.
 */
export async function rollBingImageCache(url: string): Promise<void> {
  const today = dateKey();
  const history = await loadHistory();

  const latest = history[0];
  const imageChanged = !latest || latest.dateKey !== today || latest.url !== url;

  const next: BingImageEntry[] = [{ dateKey: today, url }, ...history.filter((e) => e.url !== url)];
  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(next.slice(0, HISTORY_LIMIT))).catch(
    () => {},
  );

  if (!imageChanged) return;

  await Image.clearDiskCache();
  await Image.prefetch(url);
}