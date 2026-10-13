import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { type MarketName } from '@/constants/market';
import { Spacing } from '@/constants/theme';

const WEEKDAYS = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

type NextMarketInfo = {
  date: Date;
  market: MarketName;
  offset: number;
};

type TodayMarketCardProps = {
  market: MarketName | null;
  nextMarket: NextMarketInfo | null;
  weekday: string;
  lunarText: string;
  onPress: () => void;
};

export function TodayMarketCard({
  market,
  nextMarket,
  weekday,
  lunarText,
  onPress,
}: TodayMarketCardProps) {
  const todayIntro = `今天是${weekday}，农历${lunarText}，`;

  return (
    <Pressable onPress={onPress} style={({ pressed }) => pressed && styles.pressed}>
      <ThemedView type="backgroundElement" style={styles.card}>
        <ThemedText type="small" themeColor="textSecondary">
          今日集市
        </ThemedText>

        {market ? (
          <ThemedText style={styles.sentence}>
            {todayIntro}
            <ThemedText style={styles.marketName}>{market}</ThemedText>
            有集市。
          </ThemedText>
        ) : (
          <>
            <ThemedText style={styles.sentence}>
              {todayIntro}今天没有集市。
            </ThemedText>
            {nextMarket ? (
              <ThemedText style={styles.sentence}>
                {`最近的是${nextMarket.date.getMonth() + 1}月${nextMarket.date.getDate()}日（${
                  WEEKDAYS[nextMarket.date.getDay()]
                }），`}
                <ThemedText style={styles.marketName}>{nextMarket.market}</ThemedText>
                有集市。
              </ThemedText>
            ) : null}
          </>
        )}
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Spacing.four,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  sentence: {
    fontSize: 16,
    lineHeight: 26,
    fontWeight: '500',
  },
  marketName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#3c87f7',
  },
  pressed: {
    opacity: 0.7,
  },
});