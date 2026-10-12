import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type RadioRowProps = {
  label: string;
  description?: string;
  selected: boolean;
  onSelect: () => void;
};

export function RadioRow({ label, description, selected, onSelect }: RadioRowProps) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onSelect}
      style={({ pressed }) => [styles.radioRow, pressed && styles.pressed]}>
      <View
        style={[styles.radioOuter, { borderColor: selected ? '#3c87f7' : theme.textSecondary }]}>
        {selected ? <View style={styles.radioInner} /> : null}
      </View>
      <View style={styles.radioBody}>
        <ThemedText style={selected && styles.radioLabelSelected}>{label}</ThemedText>
        {description ? (
          <ThemedText type="small" themeColor="textSecondary">
            {description}
          </ThemedText>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    minHeight: 46,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#3c87f7',
  },
  radioBody: {
    flex: 1,
    gap: Spacing.half,
  },
  radioLabelSelected: {
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.7,
  },
});
