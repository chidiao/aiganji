import type { AnimationObject } from 'lottie-react-native';

export type WeatherIconName =
  | 'clear-day'
  | 'clear-night'
  | 'partly-cloudy-day'
  | 'partly-cloudy-night'
  | 'overcast'
  | 'fog'
  | 'drizzle'
  | 'rain'
  | 'snow'
  | 'thunderstorms';

export const WEATHER_ICONS: Record<WeatherIconName, AnimationObject> = {
  'clear-day': require('@/assets/weather/clear-day.json'),
  'clear-night': require('@/assets/weather/clear-night.json'),
  'partly-cloudy-day': require('@/assets/weather/partly-cloudy-day.json'),
  'partly-cloudy-night': require('@/assets/weather/partly-cloudy-night.json'),
  overcast: require('@/assets/weather/overcast.json'),
  fog: require('@/assets/weather/fog.json'),
  drizzle: require('@/assets/weather/drizzle.json'),
  rain: require('@/assets/weather/rain.json'),
  snow: require('@/assets/weather/snow.json'),
  thunderstorms: require('@/assets/weather/thunderstorms.json'),
};

export function getWeatherIcon(weathercode: number, isDay: boolean): WeatherIconName {
  switch (weathercode) {
    case 0:
    case 1:
      return isDay ? 'clear-day' : 'clear-night';
    case 2:
      return isDay ? 'partly-cloudy-day' : 'partly-cloudy-night';
    case 45:
    case 48:
      return 'fog';
    case 51:
    case 53:
    case 55:
    case 56:
    case 57:
      return 'drizzle';
    case 61:
    case 63:
    case 65:
    case 66:
    case 67:
    case 80:
    case 81:
    case 82:
      return 'rain';
    case 71:
    case 73:
    case 75:
    case 77:
    case 85:
    case 86:
      return 'snow';
    case 95:
    case 96:
    case 99:
      return 'thunderstorms';
    default:
      return 'overcast';
  }
}
