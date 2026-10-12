import { ImageBackground } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View, type TextStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { fetchDailyBackground, rollBingImageCache } from '@/api/bing';
import { fetchDailyQuote, getLatestCachedQuote } from '@/api/hitokoto';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { TodayMarketCard } from '@/components/today-market-card';
import { WeatherCard } from '@/components/weather-card';
import { getMarket } from '@/constants/market';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { useSettings } from '@/hooks/use-settings';
import { getDayGanzhi, getMonthGanzhi } from '@/utils/ganzhi';
import { solarToLunar } from '@/utils/lunar';
import { findNextMarket } from '@/utils/market';

const WEEKDAYS = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

const textShadow: TextStyle = {
  textShadowColor: 'rgba(0, 0, 0, 0.5)',
  textShadowOffset: { width: 0, height: 1 },
  textShadowRadius: 8,
};

export default function HomeScreen() {
  const today = useMemo(() => new Date(), []);
  const { settings } = useSettings();
  const [quote, setQuote] = useState<string | null>(null);
  const [backgroundUrl, setBackgroundUrl] = useState<string | null>(null);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    if (settings.backgroundMode !== 'bing') return;
    let active = true;

    fetchDailyBackground()
      .then(async (data) => {
        await rollBingImageCache(data.url);
        if (active) {
          setBackgroundUrl(data.url);
          setImageFailed(false);
        }
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [settings.backgroundMode]);

  useEffect(() => {
    if (settings.quoteMode !== 'api') return;
    let active = true;

    const load = async () => {
      const cached = await getLatestCachedQuote();
      if (active && cached) setQuote(cached.hitokoto);

      const data = await fetchDailyQuote();
      if (active) setQuote(data.hitokoto);
    };

    load().catch(() => {});

    return () => {
      active = false;
    };
  }, [settings.quoteMode]);

  const lunar = useMemo(() => solarToLunar(today), [today]);
  const monthGanzhi = useMemo(() => getMonthGanzhi(today), [today]);
  const dayGanzhi = useMemo(() => getDayGanzhi(today), [today]);
  const market = useMemo(() => getMarket(lunar.day), [lunar.day]);
  const nextMarket = useMemo(() => (market ? null : findNextMarket(today)), [market, today]);
  const weekday = WEEKDAYS[today.getDay()];

  const highlightOffset = market ? 0 : (nextMarket?.offset ?? 0);

  const goToCalendar = () => {
    router.navigate({
      pathname: '/calendar',
      params: { select: String(highlightOffset) },
    });
  };

  const backgroundSource =
    settings.backgroundMode === 'bing' && backgroundUrl && !imageFailed
      ? { uri: backgroundUrl }
      : require('@/assets/images/ganji-bg.jpg');

  const effectiveQuote =
    settings.quoteMode === 'custom' ? settings.customQuote.trim() : (quote ?? '');

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <ImageBackground
              source={backgroundSource}
              style={styles.cardImage}
              contentFit="cover"
              cachePolicy="memory-disk"
              transition={300}
              onError={() => setImageFailed(true)}>
              <LinearGradient
                colors={['rgba(0,0,0,0.28)', 'rgba(0,0,0,0.02)', 'rgba(0,0,0,0.6)']}
                locations={[0, 0.45, 1]}
                style={StyleSheet.absoluteFill}
              />

              <View style={styles.cardContent}>
                <View style={styles.cardTopRow}>
                  <View>
                    <ThemedText style={[styles.yearMonth, textShadow]}>
                      {today.getFullYear()} / {today.getMonth() + 1}
                    </ThemedText>
                    <ThemedText style={[styles.dayNumber, textShadow]}>
                      {today.getDate()}
                    </ThemedText>
                  </View>

                  <View style={styles.metaColumn}>
                    <ThemedText style={[styles.metaText, textShadow]}>
                      {weekday}
                    </ThemedText>
                    <ThemedText style={[styles.metaText, textShadow]}>
                      {lunar.monthText}
                      {lunar.dayText}
                    </ThemedText>
                    <ThemedText style={[styles.metaText, textShadow]}>
                      {monthGanzhi}月 {dayGanzhi}日
                    </ThemedText>
                  </View>
                </View>

                <ThemedText numberOfLines={3} style={[styles.quote, textShadow]}>
                  {effectiveQuote}
                </ThemedText>
              </View>
            </ImageBackground>
          </View>

          <WeatherCard />

          <TodayMarketCard
            market={market}
            nextMarket={nextMarket}
            weekday={weekday}
            lunarText={`${lunar.monthText}${lunar.dayText}`}
            onPress={goToCalendar}
          />
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.four,
    gap: Spacing.five,
  },
  card: {
    width: '100%',
    aspectRatio: 1.35,
    borderRadius: Spacing.four,
    overflow: 'hidden',
    backgroundColor: '#111111',
  },
  cardImage: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
    padding: Spacing.four,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  yearMonth: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
    letterSpacing: 2,
    color: 'rgba(255, 255, 255, 0.92)',
  },
  dayNumber: {
    fontSize: 88,
    lineHeight: 94,
    fontWeight: '800',
    color: '#ffffff',
  },
  metaColumn: {
    alignItems: 'flex-end',
    gap: Spacing.half,
    marginTop: Spacing.two,
  },
  metaText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.92)',
  },
  quote: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.95)',
  },
});