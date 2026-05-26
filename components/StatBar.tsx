import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useWindowDimensions } from 'react-native';
import { COLORS, FONTS, SPACING } from '../constants/theme';

type Props = {
  label: string;
  current: number;
  max: number;
  color: string;
};

export default function StatBar({ label, current, max, color }: Props) {
  const { width } = useWindowDimensions();
  const pct = Math.max(0, Math.min(1, current / max));
  const barWidth = width - SPACING.md * 4;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>
          {current} / {max}
        </Text>
      </View>
      <View style={[styles.track, { width: barWidth }]}>
        <View style={[styles.fill, { width: barWidth * pct, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: SPACING.sm },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.xs },
  label: { color: COLORS.textMuted, fontSize: FONTS.small },
  value: { color: COLORS.text, fontSize: FONTS.small, fontWeight: 'bold' },
  track: { height: 10, backgroundColor: COLORS.border, borderRadius: 5, overflow: 'hidden' },
  fill: { height: 10, borderRadius: 5 },
});
