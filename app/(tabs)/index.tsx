import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGame } from '../../context/GameContext';
import StatBar from '../../components/StatBar';
import { COLORS, FONTS, SPACING } from '../../constants/theme';

export default function HeroScreen() {
  const { state } = useGame();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>⚔️ ClickHero</Text>

        <View style={styles.card}>
          <Text style={styles.heroEmoji}>🧙</Text>
          <Text style={styles.heroName}>Poziom {state.level} Wojownik</Text>
          <Text style={styles.kills}>Pokonani wrogowie: {state.kills}</Text>
        </View>

        <View style={styles.card}>
          <StatBar label="❤️ HP" current={state.hp} max={state.maxHp} color={COLORS.hp} />
          <StatBar label="⭐ XP" current={state.xp} max={state.xpToNext} color={COLORS.xp} />
        </View>

        <View style={styles.statsGrid}>
          {[
            { emoji: '⚔️', label: 'Atak',    value: state.attack  },
            { emoji: '🔰', label: 'Obrona',  value: state.defense },
            { emoji: '❤️', label: 'Max HP',  value: state.maxHp   },
            { emoji: '🪙', label: 'Złoto',   value: state.gold    },
          ].map(({ emoji, label, value }) => (
            <View key={label} style={styles.statBox}>
              <Text style={styles.statEmoji}>{emoji}</Text>
              <Text style={styles.statValue}>{value}</Text>
              <Text style={styles.statLabel}>{label}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  container: { padding: SPACING.md, paddingBottom: SPACING.xl },
  title: { fontSize: FONTS.title, color: COLORS.accent, fontWeight: 'bold', textAlign: 'center', marginBottom: SPACING.md },
  card: { backgroundColor: COLORS.surface, borderRadius: 12, padding: SPACING.md, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  heroEmoji: { fontSize: 64, textAlign: 'center' },
  heroName: { fontSize: FONTS.heading, color: COLORS.text, fontWeight: 'bold', textAlign: 'center', marginTop: SPACING.sm },
  kills: { fontSize: FONTS.small, color: COLORS.textMuted, textAlign: 'center', marginTop: SPACING.xs },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  statBox: { flex: 1, minWidth: '45%', backgroundColor: COLORS.surface, borderRadius: 12, padding: SPACING.md, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  statEmoji: { fontSize: 22 },
  statValue: { fontSize: FONTS.heading, color: COLORS.gold, fontWeight: 'bold', marginTop: SPACING.xs },
  statLabel: { fontSize: FONTS.small, color: COLORS.textMuted, marginTop: 2 },
});
