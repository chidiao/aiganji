import { fetch } from 'expo/fetch';

export const WEATHER_LATITUDE = 35.425;
export const WEATHER_LONGITUDE = 113.828;

export const WEATHER_TEXT: Record<number, string> = {
  0: '晴',
  1: '晴间多云',
  2: '多云',
  3: '阴',
  45: '雾',
  48: '雾凇',
  51: '毛毛雨',
  53: '毛毛雨',
  55: '毛毛雨',
  56: '冻毛毛雨',
  57: '冻毛毛雨',
  61: '小雨',
  63: '中雨',
  65: '大雨',
  66: '冻雨',
  67: '冻雨',
  71: '小雪',
  73: '中雪',
  75: '大雪',
  77: '雪粒',
  80: '阵雨',
  81: '阵雨',
  82: '强阵雨',
  85: '阵雪',
  86: '强阵雪',
  95: '雷雨',
  96: '雷雨伴冰雹',
  99: '雷雨伴冰雹',
};

export type CurrentWeather = {
  temperature: number;
  windspeed: number;
  winddirection: number;
  weathercode: number;
  is_day: number;
  time: string;
};

export type WeatherResponse = {
  current_weather: CurrentWeather;
};

const WEATHER_API =
  'https://api.open-meteo.com/v1/forecast?current_weather=true&timezone=Asia/Shanghai';

export async function fetchWeather(
  latitude = WEATHER_LATITUDE,
  longitude = WEATHER_LONGITUDE,
): Promise<CurrentWeather> {
  const url = `${WEATHER_API}&latitude=${latitude}&longitude=${longitude}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Weather request failed with status ${res.status}`);
  }
  const data = (await res.json()) as WeatherResponse;
  if (!data.current_weather) {
    throw new Error('Weather response is missing current_weather');
  }
  return data.current_weather;
}