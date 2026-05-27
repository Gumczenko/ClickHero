import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGame } from '../context/GameContext';
import { COLORS, FONTS, SPACING } from '../constants/theme';

export default function StatsScreen() {
  const { state } = useGame();

  const rows = [
    { label: 'Poziom',            value: state.level },
    { label: 'Pokonani wrogowie', value: state.kills },
    { label: 'Złoto',             value: state.gold },
    { label: 'HP',                value: `${state.hp} / ${state.maxHp}` },
    { label: 'Atak',              value: state.attack },
    { label: 'Obrona',            value: state.defense },
    { label: 'XP',                value: `${state.xp} / ${state.xpToNext}` },
  ];

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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  container: { padding: SPACING.md, paddingBottom: SPACING.xl, alignItems: 'center' },
  heroImage: { width: 140, height: 140, marginTop: SPACING.md },
  heroName: { fontSize: FONTS.heading, color: COLORS.text, fontWeight: 'bold', marginVertical: SPACING.md },
  card: { backgroundColor: COLORS.surface, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, width: '100%' },
  row: { flexDirection: 'row', justifyContent: 'space-between', padding: SPACING.md },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
  label: { color: COLORS.textMuted, fontSize: FONTS.body },
  value: { color: COLORS.gold, fontWeight: 'bold', fontSize: FONTS.body },
});
