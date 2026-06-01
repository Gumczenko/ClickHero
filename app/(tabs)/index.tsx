import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useGame } from '../../context/GameContext';
import StatBar from '../../components/StatBar';
import { COLORS, FONTS, SPACING } from '../../constants/theme';

export default function HeroScreen() {
  const { state } = useGame();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>⚔️ ClickHero</Text>

        <View style={styles.card}>
          <Image source={require('../../assets/rycerz.png')} style={styles.heroImage} resizeMode="contain" />
          <Text style={styles.heroName}>Poziom {state.level} Wojownik</Text>
        </View>

        <View style={styles.card}>
          <StatBar label="❤️ HP" current={state.hp} max={state.maxHp} color={COLORS.hp} />
          <StatBar label="⭐ XP" current={state.xp} max={state.xpToNext} color={COLORS.xp} />
        </View>

        <TouchableOpacity style={styles.statsBtn} onPress={() => router.push({ pathname: '/stats', params: { level: state.level } })}>
          <Text style={styles.statsBtnText}>📊 Szczegółowe statystyki</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  container: { padding: SPACING.md, paddingBottom: SPACING.xl },
  title: { fontSize: FONTS.title, color: COLORS.accent, fontWeight: 'bold', textAlign: 'center', marginBottom: SPACING.md },
  card: { backgroundColor: COLORS.surface, borderRadius: 12, padding: SPACING.md, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  heroImage: { width: 120, height: 120, alignSelf: 'center' },
  heroName: { fontSize: FONTS.heading, color: COLORS.text, fontWeight: 'bold', textAlign: 'center', marginTop: SPACING.sm },
statsBtn: { backgroundColor: COLORS.surface, borderRadius: 12, padding: SPACING.md, alignItems: 'center', borderWidth: 1, borderColor: COLORS.accent },
  statsBtnText: { color: COLORS.accent, fontSize: FONTS.body, fontWeight: 'bold' },
});
