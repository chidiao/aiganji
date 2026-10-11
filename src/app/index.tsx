import { ImageBackground } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View, type TextStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { randomBackground } from '@/constants/backgrounds';
import { randomQuote } from '@/constants/quotes';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { getDayGanzhi, getMonthGanzhi } from '@/utils/ganzhi';
import { solarToLunar, type LunarDate } from '@/utils/lunar';

const WEEKDAYS = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

const textShadow: TextStyle = {
  textShadowColor: 'rgba(0, 0, 0, 0.5)',
  textShadowOffset: { width: 0, height: 1 },
  textShadowRadius: 8,
};

function getMarket(lunarDay: number): string {
  const remainder = lunarDay % 5;
  if (remainder === 1) return '东夏峰';
  if (remainder === 3) return '孟庄';
  if (remainder === 0) return '西夏峰';
  return '未知';
}

type DayInfo = {
  date: Date;
  lunar: LunarDate;
  market: string;
  offset: number;
};

export default function GanjiScreen() {
  const today = useMemo(() => new Date(), []);
  const quote = useMemo(() => randomQuote(), []);
  const backgroundUrl = useMemo(() => randomBackground(), []);
  const [imageFailed, setImageFailed] = useState(false);

  const lunar = useMemo(() => solarToLunar(today), [today]);
  const monthGanzhi = useMemo(() => getMonthGanzhi(today), [today]);
  const dayGanzhi = useMemo(() => getDayGanzhi(today), [today]);

  const days = useMemo<DayInfo[]>(() => {
    const list: DayInfo[] = [];
    for (let offset = -2; offset <= 2; offset++) {
      const date = new Date(today);
      date.setDate(today.getDate() + offset);
      const info = solarToLunar(date);
      list.push({ date, lunar: info, market: getMarket(info.day), offset });
    }
    return list;
  }, [today]);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <ImageBackground
              source={
                imageFailed
                  ? require('@/assets/images/ganji-bg.jpg')
                  : { uri: backgroundUrl }
              }
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
                      {WEEKDAYS[today.getDay()]}
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

                <ThemedText style={[styles.quote, textShadow]}>{quote}</ThemedText>
              </View>
            </ImageBackground>
          </View>

          <View style={styles.marketList}>
            {days.map(({ date, lunar: dayLunar, market, offset }) => {
              const isToday = offset === 0;
              return (
                <ThemedView
                  key={offset}
                  type={isToday ? 'backgroundSelected' : 'backgroundElement'}
                  style={[styles.row, isToday && styles.rowToday]}>
                  <View style={styles.rowLeft}>
                    <ThemedText type={isToday ? 'subtitle' : 'default'}>
                      {dayLunar.day === 1 ? dayLunar.monthText : dayLunar.dayText}
                    </ThemedText>
                    <ThemedText type="small" themeColor="textSecondary">
                      {WEEKDAYS[date.getDay()]}
                      {isToday ? ' · 今天' : ''}
                    </ThemedText>
                  </View>
                  <ThemedText
                    type={isToday ? 'smallBold' : 'small'}
                    themeColor={isToday ? 'text' : 'textSecondary'}>
                    {market}
                  </ThemedText>
                </ThemedView>
              );
            })}
          </View>
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
  marketList: {
    gap: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    borderRadius: Spacing.three,
  },
  rowToday: {
    borderWidth: 1,
    borderColor: '#3c87f7',
  },
  rowLeft: {
    gap: Spacing.half,
  },
});
