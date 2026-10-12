import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ModalCard } from '@/components/modal-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { getMarket, MARKET_RULES } from '@/constants/market';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { solarToLunar } from '@/utils/lunar';
import { addDays } from '@/utils/market';

const WEEKDAYS = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

const START_OFFSET = -2;
const END_OFFSET = 4;

const RELATIVE_LABELS: Record<number, string> = {
  [-1]: '昨天',
  0: '今天',
  1: '明天',
  2: '后天',
};

type CalendarDay = {
  date: Date;
  lunar: ReturnType<typeof solarToLunar>;
  offset: number;
};

export default function CalendarScreen() {
  const today = useMemo(() => new Date(), []);
  const theme = useTheme();
  const { select } = useLocalSearchParams<{ select?: string }>();
  const [helpVisible, setHelpVisible] = useState(false);

  const selectedOffset = useMemo(() => {
    if (select == null || select === '') return 0;
    const next = Number(select);
    return Number.isNaN(next) ? 0 : next;
  }, [select]);

  const selectDay = (offset: number) => {
    router.setParams({ select: String(offset) });
  };

  const days = useMemo<CalendarDay[]>(() => {
    const list: CalendarDay[] = [];
    for (let offset = START_OFFSET; offset <= END_OFFSET; offset++) {
      const date = addDays(today, offset);
      list.push({ date, lunar: solarToLunar(date), offset });
    }
    return list;
  }, [today]);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <ThemedText style={styles.title}>日历</ThemedText>
          <Pressable
            onPress={() => setHelpVisible(true)}
            hitSlop={12}
            accessibilityLabel="集市规则"
            style={({ pressed }) => pressed && styles.pressed}>
            <Image
              source={require('@/assets/images/icons/circle-question-mark.png')}
              style={styles.helpIcon}
              tintColor={theme.text}
            />
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.marketList}>
            {days.map(({ date, lunar, offset }) => {
              const isSelected = offset === selectedOffset;
              const market = getMarket(lunar.day);
              const label = isSelected ? RELATIVE_LABELS[offset] : undefined;
              return (
                <Pressable
                  key={offset}
                  onPress={() => selectDay(offset)}
                  style={({ pressed }) => pressed && styles.pressed}>
                  <ThemedView
                    type={isSelected ? 'backgroundSelected' : 'backgroundElement'}
                    style={[styles.row, isSelected && styles.rowSelected]}>
                    <View style={styles.rowLeft}>
                      <ThemedText type={isSelected ? 'subtitle' : 'default'}>
                        {lunar.day === 1 ? lunar.monthText : lunar.dayText}
                      </ThemedText>
                      <ThemedText type="small" themeColor="textSecondary">
                        {WEEKDAYS[date.getDay()]} {date.getMonth() + 1}/{date.getDate()}
                        {label ? (
                          <ThemedText style={styles.relativeLabel}>{` · ${label}`}</ThemedText>
                        ) : null}
                      </ThemedText>
                    </View>
                    <ThemedText
                      type={isSelected ? 'smallBold' : 'small'}
                      themeColor={
                        market ? (isSelected ? 'text' : 'textSecondary') : 'textSecondary'
                      }>
                      {market ?? '无会'}
                    </ThemedText>
                  </ThemedView>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      </SafeAreaView>

      <ModalCard visible={helpVisible} onClose={() => setHelpVisible(false)}>
        <ThemedText style={styles.modalTitle}>集市规则</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          集市每 5 天轮换一次，按农历日期排定：
        </ThemedText>

        <View style={styles.ruleList}>
          {MARKET_RULES.map((rule) => (
            <View key={rule.name} style={styles.ruleItem}>
              <ThemedText type="smallBold">{rule.name}</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {rule.days}
              </ThemedText>
            </View>
          ))}
        </View>

        <ThemedText type="small" themeColor="textSecondary">
          也就是用农历日期除以 5：余 1 去东夏峰，余 3 去孟庄，余 0（初五、初十……）去西夏峰。
        </ThemedText>

        <Pressable
          onPress={() => setHelpVisible(false)}
          style={({ pressed }) => [styles.modalButton, pressed && styles.pressed]}>
          <ThemedText type="smallBold" style={styles.modalButtonText}>
            知道了
          </ThemedText>
        </Pressable>
      </ModalCard>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.three,
  },
  title: {
    fontSize: 30,
    lineHeight: 38,
    fontWeight: '700',
  },
  helpIcon: {
    width: 24,
    height: 24,
  },
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.four,
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
  rowSelected: {
    borderWidth: 1,
    borderColor: '#3c87f7',
  },
  rowLeft: {
    gap: Spacing.half,
  },
  relativeLabel: {
    color: '#3c87f7',
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.7,
  },
  modalTitle: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '700',
  },
  ruleList: {
    gap: Spacing.three,
  },
  ruleItem: {
    gap: Spacing.half,
  },
  modalButton: {
    marginTop: Spacing.two,
    alignSelf: 'flex-end',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.five,
    backgroundColor: '#3c87f7',
  },
  modalButtonText: {
    color: '#ffffff',
  },
});
