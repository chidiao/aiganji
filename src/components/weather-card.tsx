import LottieView from 'lottie-react-native';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { fetchWeather, WEATHER_TEXT, type CurrentWeather } from '@/api/weather';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { getWeatherIcon, WEATHER_ICONS } from '@/constants/weather-icons';

const WIND_DIRECTIONS = ['北风', '东北风', '东风', '东南风', '南风', '西南风', '西风', '西北风'];

function windDirectionText(degrees: number) {
  return WIND_DIRECTIONS[Math.round(degrees / 45) % 8];
}

type WeatherStatus = 'loading' | 'ready' | 'error';

export function WeatherCard() {
  const [status, setStatus] = useState<WeatherStatus>('loading');
  const [weather, setWeather] = useState<CurrentWeather | null>(null);

  const badgeColor = 'rgba(15,23,42,0.25)';

  useEffect(() => {
    let active = true;

    fetchWeather()
      .then((data) => {
        if (!active) return;
        setWeather(data);
        setStatus('ready');
      })
      .catch(() => {
        if (active) setStatus('error');
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <ThemedText type="small" themeColor="textSecondary">
        今日天气
      </ThemedText>

      {status === 'ready' && weather ? (
        <>
          <View style={styles.mainRow}>
            <View style={styles.tempColumn}>
              <ThemedText style={styles.temperature}>
                {Math.round(weather.temperature)}°
              </ThemedText>
              <ThemedText style={styles.condition}>
                {WEATHER_TEXT[weather.weathercode] ?? '未知'}
              </ThemedText>
            </View>
            <View style={[styles.iconBadge, { backgroundColor: badgeColor }]}>
              <LottieView
                source={WEATHER_ICONS[getWeatherIcon(weather.weathercode, weather.is_day === 1)]}
                autoPlay
                loop
                style={styles.icon}
              />
            </View>
          </View>
          <ThemedText type="small" themeColor="textSecondary">
            风速 {Math.round(weather.windspeed)} km/h · {windDirectionText(weather.winddirection)}
          </ThemedText>
        </>
      ) : status === 'error' ? (
        <ThemedText type="small" themeColor="textSecondary">
          暂时无法获取天气
        </ThemedText>
      ) : (
        <ThemedText type="small" themeColor="textSecondary">
          天气加载中…
        </ThemedText>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Spacing.four,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  iconBadge: {
    width: 68,
    height: 68,
    borderRadius: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  icon: {
    width: 68,
    height: 68,
  },
  tempColumn: {
    gap: Spacing.half,
  },
  temperature: {
    fontSize: 40,
    lineHeight: 46,
    fontWeight: '800',
  },
  condition: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
  },
});