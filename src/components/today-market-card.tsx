import { Pressable, StyleSheet, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { type MarketName } from '@/constants/market';
import { Spacing } from '@/constants/theme';

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
      <ThemedView style={styles.card}>
        <View style={styles.header}>
          <ThemedText style={styles.eyebrow}>赶集安排</ThemedText>
          <ChevronRight size={18} color="#8490A1" strokeWidth={1.8} />
        </View>

        {market ? (
          <>
            <ThemedText style={styles.status}>今天有集</ThemedText>
            <ThemedText style={styles.marketName}>{market}集市</ThemedText>
            <ThemedText style={styles.detail}>{todayIntro}欢迎来逛。</ThemedText>
          </>
        ) : (
          <>
            <ThemedText style={styles.status}>今天休集</ThemedText>
            <ThemedText style={styles.detail}>{todayIntro}附近村集按农历日期轮换。</ThemedText>
            {nextMarket ? (
              <View style={styles.nextMarket}>
                <ThemedText style={styles.nextLabel}>下一场</ThemedText>
                <ThemedText style={styles.nextText}>
                  {`${nextMarket.date.getMonth() + 1}月${nextMarket.date.getDate()}日 · ${nextMarket.market}`}
                </ThemedText>
              </View>
            ) : null}
          </>
        )}
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    padding: Spacing.four,
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8ECF2',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  eyebrow: {
    color: '#657184',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  status: {
    color: '#1B66D0',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
  },
  marketName: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '800',
    color: '#172238',
  },
  detail: {
    marginTop: 2,
    color: '#657184',
    fontSize: 14,
    lineHeight: 21,
  },
  nextMarket: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E8ECF2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nextLabel: {
    color: '#7A8493',
    fontSize: 12,
    fontWeight: '600',
  },
  nextText: {
    color: '#1B66D0',
    fontSize: 13,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.7,
  },
});
