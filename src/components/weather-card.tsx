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

  const badgeColor = '#EAF3FF';

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
    <ThemedView style={styles.card}>
      <View style={styles.header}>
        <ThemedText style={styles.eyebrow}>今日天气</ThemedText>
        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />
          <ThemedText style={styles.liveText}>本地实况</ThemedText>
        </View>
      </View>

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
          <ThemedText style={styles.weatherMeta}>
            风速 {Math.round(weather.windspeed)} km/h　·　{windDirectionText(weather.winddirection)}
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
    borderRadius: 22,
    padding: Spacing.four,
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8ECF2',
  },
  header: {
    minHeight: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  eyebrow: {
    color: '#657184',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: '#F2F6FC',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3A9B6D',
  },
  liveText: {
    color: '#687386',
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '600',
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  iconBadge: {
    width: 62,
    height: 62,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  icon: {
    width: 62,
    height: 62,
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
    color: '#657184',
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '600',
  },
  weatherMeta: {
    color: '#7A8493',
    fontSize: 12,
    lineHeight: 18,
  },
});
