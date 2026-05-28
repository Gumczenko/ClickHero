import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useGame } from '../context/GameContext';
import { COLORS, FONTS, SPACING } from '../constants/theme';

const UPGRADES = [
  { stat: 'attack' as const,  label: '⚔️ Atak +5',    cost: 50 },
  { stat: 'defense' as const, label: '🔰 Obrona +3',   cost: 40 },
  { stat: 'maxHp' as const,   label: '❤️ Max HP +20',  cost: 35 },
];

export default function StatsScreen() {
  const { state, dispatch } = useGame();

  const rows = [
    { label: 'Poziom',            value: state.level },
    { label: 'Pokonani wrogowie', value: state.kills },
    { label: 'Złoto',             value: state.gold },
    { label: 'HP',                value: `${state.hp} / ${state.maxHp}` },
    { label: 'Atak',              value: state.attack },
    { label: 'Obrona',            value: state.defense },
    { label: 'XP',                value: `${state.xp} / ${state.xpToNext}` },
  ];

  const handleUpgrade = (stat: 'attack' | 'defense' | 'maxHp', cost: number) => {
    if (state.gold < cost) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    dispatch({ type: 'UPGRADE_STAT', stat });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Image source={require('../assets/rycerz.png')} style={styles.heroImage} resizeMode="contain" />
        <Text style={styles.heroName}>Poziom {state.level} Wojownik</Text>

        <View style={styles.card}>
          {rows.map(({ label, value }, i) => (
            <View key={label} style={[styles.row, i < rows.length - 1 && styles.rowBorder]}>
              <Text style={styles.label}>{label}</Text>
              <Text style={styles.value}>{value}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Ulepszenia</Text>
        <View style={styles.card}>
          {UPGRADES.map(({ stat, label, cost }, i) => {
            const canAfford = state.gold >= cost;
            return (
              <TouchableOpacity
                key={stat}
                style={[styles.upgradeRow, i < UPGRADES.length - 1 && styles.rowBorder, !canAfford && styles.upgradeDisabled]}
                onPress={() => handleUpgrade(stat, cost)}
                disabled={!canAfford}
              >
                <Text style={[styles.upgradeLabel, !canAfford && styles.textDisabled]}>{label}</Text>
                <Text style={[styles.upgradeCost, !canAfford && styles.textDisabled]}>🪙 {cost}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  container: { padding: SPACING.md, paddingBottom: SPACING.xl, alignItems: 'center' },
  heroImage: { width: 140, height: 140, marginTop: SPACING.md },
  heroName: { fontSize: FONTS.heading, color: COLORS.text, fontWeight: 'bold', marginVertical: SPACING.md },
  card: { backgroundColor: COLORS.surface, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, width: '100%', marginBottom: SPACING.md },
  row: { flexDirection: 'row', justifyContent: 'space-between', padding: SPACING.md },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
  label: { color: COLORS.textMuted, fontSize: FONTS.body },
  value: { color: COLORS.gold, fontWeight: 'bold', fontSize: FONTS.body },
  sectionTitle: { color: COLORS.textMuted, fontSize: FONTS.small, fontWeight: 'bold', alignSelf: 'flex-start', marginBottom: SPACING.sm },
  upgradeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.md },
  upgradeLabel: { color: COLORS.text, fontSize: FONTS.body },
  upgradeCost: { color: COLORS.gold, fontWeight: 'bold', fontSize: FONTS.body },
  upgradeDisabled: { opacity: 0.4 },
  textDisabled: { color: COLORS.textMuted },
});
