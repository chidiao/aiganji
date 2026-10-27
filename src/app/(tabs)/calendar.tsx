import { router, useLocalSearchParams } from 'expo-router';
import { CircleHelp } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ModalCard } from '@/components/modal-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { getMarket, MARKET_RULES } from '@/constants/market';
import { PageBackground, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { solarToLunar } from '@/utils/lunar';
import { addDays, findNextMarket } from '@/utils/market';

const WEEKDAYS = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
const WEEKDAY_SHORT = ['日', '一', '二', '三', '四', '五', '六'];
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
    if (!Number.isFinite(next)) return 0;
    return Math.trunc(Math.min(END_OFFSET, Math.max(START_OFFSET, next)));
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

  const selectedDay = days.find((day) => day.offset === selectedOffset) ?? days[2];
  const selectedMarket = getMarket(selectedDay.lunar.day);
  const nextMarket = findNextMarket(selectedDay.date);
  const marketDays = days.filter(({ lunar }) => getMarket(lunar.day) != null);
  const selectedWeekday = WEEKDAYS[selectedDay.date.getDay()];

  return (
    <ThemedView style={[styles.container, { backgroundColor: PageBackground }]}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View>
              <ThemedText style={styles.eyebrow}>赶集安排</ThemedText>
              <ThemedText style={styles.title}>日历</ThemedText>
            </View>
            <Pressable
              onPress={() => setHelpVisible(true)}
              hitSlop={10}
              accessibilityLabel="集市规则"
              style={({ pressed }) => [styles.helpButton, pressed && styles.pressed]}>
              <CircleHelp size={21} color={theme.text} strokeWidth={1.9} />
            </Pressable>
          </View>

          <ThemedText style={styles.sectionHeading}>选择日期</ThemedText>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dayStrip}>
            {days.map(({ date, lunar, offset }) => {
              const isSelected = offset === selectedOffset;
              const hasMarket = getMarket(lunar.day) != null;
              const relativeLabel = RELATIVE_LABELS[offset];
              return (
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  key={offset}
                  onPress={() => selectDay(offset)}
                  style={({ pressed }) => [
                    styles.dayCard,
                    isSelected && styles.dayCardSelected,
                    pressed && styles.pressed,
                  ]}>
                  <ThemedText style={[styles.dayWeekday, isSelected && styles.dayTextSelected]}>
                    {relativeLabel ?? `周${WEEKDAY_SHORT[date.getDay()]}`}
                  </ThemedText>
                  <ThemedText style={[styles.dayNumber, isSelected && styles.dayTextSelected]}>
                    {date.getDate()}
                  </ThemedText>
                  <ThemedText style={[styles.dayLunar, isSelected && styles.dayLunarSelected]}>
                    {lunar.dayText}
                  </ThemedText>
                  <View
                    style={[
                      styles.marketDot,
                      hasMarket && styles.marketDotActive,
                      isSelected && hasMarket && styles.marketDotSelected,
                    ]}
                  />
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={styles.detailCard}>
            <View style={styles.detailHeader}>
              <View>
                <ThemedText style={styles.detailDate}>
                  {selectedDay.date.getMonth() + 1}月{selectedDay.date.getDate()}日
                </ThemedText>
                <ThemedText style={styles.detailSubtitle}>
                  {selectedWeekday} · 农历{selectedDay.lunar.monthText}{selectedDay.lunar.dayText}
                </ThemedText>
              </View>
              <View style={[styles.statusPill, selectedMarket ? styles.statusPillActive : null]}>
                <ThemedText style={[styles.statusText, selectedMarket ? styles.statusTextActive : null]}>
                  {selectedMarket ? '今日有集' : '今日休集'}
                </ThemedText>
              </View>
            </View>

            <View style={styles.detailDivider} />
            {selectedMarket ? (
              <>
                <ThemedText style={styles.marketLabel}>赶集地点</ThemedText>
                <ThemedText style={styles.marketName}>{selectedMarket}集市</ThemedText>
              </>
            ) : (
              <View style={styles.restDayContent}>
                <ThemedText style={styles.restDayTitle}>今天没有集市</ThemedText>
                <ThemedText style={styles.restDayHint}>村集按农历日期轮换，下一场在</ThemedText>
                {nextMarket ? (
                  <View style={styles.nextMarketRow}>
                    <ThemedText style={styles.nextMarketDate}>
                      {nextMarket.date.getMonth() + 1}月{nextMarket.date.getDate()}日
                    </ThemedText>
                    <ThemedText style={styles.nextMarketName}>{nextMarket.market}集市</ThemedText>
                  </View>
                ) : null}
              </View>
            )}
          </View>

          <View style={styles.agendaHeader}>
            <View>
              <ThemedText style={styles.sectionHeading}>本周集市</ThemedText>
              <ThemedText style={styles.agendaSubtitle}>点选日期查看当天安排</ThemedText>
            </View>
            <ThemedText style={styles.agendaCount}>{marketDays.length} 场</ThemedText>
          </View>

          <View style={styles.agendaList}>
            {marketDays.map(({ date, lunar, offset }) => {
              const market = getMarket(lunar.day);
              if (!market) return null;
              const isSelected = offset === selectedOffset;
              return (
                <Pressable
                  key={offset}
                  onPress={() => selectDay(offset)}
                  style={({ pressed }) => [styles.agendaRow, isSelected && styles.agendaRowSelected, pressed && styles.pressed]}>
                  <View style={styles.agendaDateBlock}>
                    <ThemedText style={styles.agendaMonth}>{date.getMonth() + 1}月</ThemedText>
                    <ThemedText style={styles.agendaDate}>{date.getDate()}</ThemedText>
                  </View>
                  <View style={styles.agendaInfo}>
                    <ThemedText style={styles.agendaMarket}>{market}集市</ThemedText>
                    <ThemedText style={styles.agendaMeta}>
                      {WEEKDAYS[date.getDay()]} · 农历{lunar.monthText}{lunar.dayText}
                    </ThemedText>
                  </View>
                  <View style={styles.agendaTag}>
                    <ThemedText style={styles.agendaTagText}>
                      {RELATIVE_LABELS[offset] ?? '有集'}
                    </ThemedText>
                  </View>
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
              <ThemedText type="small" themeColor="textSecondary">{rule.days}</ThemedText>
            </View>
          ))}
        </View>
        <ThemedText type="small" themeColor="textSecondary">
          也就是用农历日期除以 5：余 1 去东夏峰，余 3 去孟庄，余 0（初五、初十……）去西夏峰。
        </ThemedText>
        <Pressable
          onPress={() => setHelpVisible(false)}
          style={({ pressed }) => [styles.modalButton, pressed && styles.pressed]}>
          <ThemedText type="smallBold" style={styles.modalButtonText}>知道了</ThemedText>
        </Pressable>
      </ModalCard>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.four,
    gap: Spacing.three,
  },
  header: {
    minHeight: 66,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  eyebrow: { color: '#657184', fontSize: 12, lineHeight: 18, fontWeight: '600', letterSpacing: 1 },
  title: { marginTop: 2, fontSize: 28, lineHeight: 34, fontWeight: '800', color: '#172238' },
  helpButton: {
    width: 46,
    height: 46,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  sectionHeading: { color: '#172238', fontSize: 17, lineHeight: 23, fontWeight: '800' },
  dayStrip: { gap: 8, paddingVertical: 2 },
  dayCard: {
    width: 46,
    minHeight: 98,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8ECF2',
  },
  dayCardSelected: { backgroundColor: '#1B66D0', borderColor: '#1B66D0' },
  dayWeekday: { color: '#687386', fontSize: 11, lineHeight: 16, fontWeight: '600' },
  dayNumber: { marginTop: 4, color: '#172238', fontSize: 20, lineHeight: 25, fontWeight: '800' },
  dayTextSelected: { color: '#FFFFFF' },
  dayLunar: { marginTop: 1, color: '#8A93A1', fontSize: 10, lineHeight: 14 },
  dayLunarSelected: { color: 'rgba(255,255,255,0.78)' },
  marketDot: { width: 5, height: 5, marginTop: 5, borderRadius: 3, backgroundColor: 'transparent' },
  marketDotActive: { backgroundColor: '#1B66D0' },
  marketDotSelected: { backgroundColor: '#FFFFFF' },
  detailCard: {
    padding: 20,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8ECF2',
  },
  detailHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  detailDate: { color: '#172238', fontSize: 22, lineHeight: 28, fontWeight: '800' },
  detailSubtitle: { marginTop: 4, color: '#7A8493', fontSize: 13, lineHeight: 18 },
  statusPill: { paddingHorizontal: 11, paddingVertical: 7, borderRadius: 12, backgroundColor: '#F1F3F6' },
  statusPillActive: { backgroundColor: '#E8F2FF' },
  statusText: { color: '#687386', fontSize: 12, fontWeight: '700' },
  statusTextActive: { color: '#1B66D0' },
  detailDivider: { height: StyleSheet.hairlineWidth, marginVertical: 17, backgroundColor: '#E8ECF2' },
  marketLabel: { color: '#7A8493', fontSize: 12, lineHeight: 17, fontWeight: '600' },
  marketName: { marginTop: 4, color: '#1B66D0', fontSize: 28, lineHeight: 36, fontWeight: '800' },
  restDayContent: { gap: 5 },
  restDayTitle: { color: '#172238', fontSize: 18, lineHeight: 25, fontWeight: '800' },
  restDayHint: { color: '#7A8493', fontSize: 13, lineHeight: 19 },
  nextMarketRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 7 },
  nextMarketDate: { color: '#172238', fontSize: 16, lineHeight: 22, fontWeight: '800' },
  nextMarketName: { color: '#1B66D0', fontSize: 14, lineHeight: 20, fontWeight: '700' },
  agendaHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 3 },
  agendaSubtitle: { marginTop: 3, color: '#7A8493', fontSize: 12, lineHeight: 17 },
  agendaCount: { color: '#1B66D0', fontSize: 12, fontWeight: '700' },
  agendaList: { gap: 9 },
  agendaRow: {
    minHeight: 74,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8ECF2',
  },
  agendaRowSelected: { borderColor: '#94BFFA', backgroundColor: '#F8FBFF' },
  agendaDateBlock: { width: 44, alignItems: 'center' },
  agendaMonth: { color: '#7A8493', fontSize: 10, lineHeight: 14, fontWeight: '600' },
  agendaDate: { color: '#172238', fontSize: 21, lineHeight: 25, fontWeight: '800' },
  agendaInfo: { flex: 1, marginLeft: 10 },
  agendaMarket: { color: '#172238', fontSize: 15, lineHeight: 21, fontWeight: '700' },
  agendaMeta: { marginTop: 2, color: '#7A8493', fontSize: 11, lineHeight: 16 },
  agendaTag: { paddingHorizontal: 9, paddingVertical: 6, borderRadius: 10, backgroundColor: '#F1F3F6' },
  agendaTagText: { color: '#657184', fontSize: 11, fontWeight: '700' },
  pressed: { opacity: 0.72 },
  modalTitle: { fontSize: 20, lineHeight: 28, fontWeight: '700' },
  ruleList: { gap: Spacing.three },
  ruleItem: { gap: Spacing.half },
  modalButton: {
    marginTop: Spacing.two,
    alignSelf: 'flex-end',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.five,
    backgroundColor: '#3c87f7',
  },
  modalButtonText: { color: '#FFFFFF' },
});
