import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, ScrollView, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useGame } from '../../context/GameContext';
import StatBar from '../../components/StatBar';
import { COLORS, FONTS, SPACING } from '../../constants/theme';
import { pickMonster, Monster } from '../../constants/gameData';

export default function BattleScreen() {
  const { state, dispatch } = useGame();

  const [monster, setMonster] = useState<Monster>(() => pickMonster(state.level));
  const [monsterHp, setMonsterHp] = useState(monster.maxHp);
  const [log, setLog] = useState<string[]>(['Walka rozpoczęta!']);
  const [shakeAnim] = useState(new Animated.Value(0));
  const [levelUpAnim] = useState(new Animated.Value(0));
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [cooldown, setCooldown] = useState(false);

  const playerDead = state.hp <= 0;

  const shake = useCallback(() => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  }, [shakeAnim]);

  const spawnMonster = useCallback((level: number) => {
    const next = pickMonster(level);
    setMonster(next);
    setMonsterHp(next.maxHp);
    setLog([`Pojawił się ${next.name}!`]);
  }, []);

  const attack = useCallback(() => {
    if (playerDead || cooldown || monsterHp <= 0) return;
    setCooldown(true);
    setTimeout(() => setCooldown(false), 600);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const playerDmg = Math.max(1, state.attack - Math.floor(Math.random() * 3));
    const newMonsterHp = monsterHp - playerDmg;
    const newLog: string[] = [`Zadałeś ${playerDmg} obrażeń ${monster.name}!`];

    if (newMonsterHp <= 0) {
      dispatch({ type: 'EARN_REWARDS', xp: monster.xpReward, gold: monster.goldReward });
      newLog.push(`${monster.name} pokonany! +${monster.xpReward} XP, +${monster.goldReward} 🪙`);
      setMonsterHp(0);
      setLog(newLog);

      const newXp = state.xp + monster.xpReward;
      if (newXp >= state.xpToNext) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setTimeout(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success), 200);
        setTimeout(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success), 400);
        setShowLevelUp(true);
        levelUpAnim.setValue(0);
        Animated.sequence([
          Animated.timing(levelUpAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.delay(800),
          Animated.timing(levelUpAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
        ]).start(() => setShowLevelUp(false));
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      setTimeout(() => spawnMonster(state.level), 1400);
      return;
    }

    const monsterDmg = Math.max(1, monster.attack - Math.floor(Math.random() * 3));
    dispatch({ type: 'TAKE_DAMAGE', amount: monsterDmg });
    newLog.push(`${monster.name} atakuje za ${monsterDmg} obrażeń!`);
    shake();
    setMonsterHp(newMonsterHp);
    setLog(newLog);
  }, [playerDead, cooldown, state.attack, state.level, state.xp, state.xpToNext, monsterHp, monster, dispatch, spawnMonster, levelUpAnim, shake]);

  const revive = useCallback(() => {
    dispatch({ type: 'REVIVE' });
    setLog(['Odrodzono się! Walcz dalej!']);
  }, [dispatch]);

  const handleReset = () => {
    Alert.alert('Reset', 'Czy na pewno chcesz zresetować postać?', [
      { text: 'Anuluj', style: 'cancel' },
      { text: 'Resetuj', style: 'destructive', onPress: () => {
        dispatch({ type: 'RESET' });
        spawnMonster(1);
        setLog(['Nowa gra!']);
      }},
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>

        <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
          <Text style={styles.resetBtnText}>Reset</Text>
        </TouchableOpacity>

        {showLevelUp && (
          <Animated.View style={[styles.levelUpBanner, { opacity: levelUpAnim, transform: [{ scale: levelUpAnim }] }]}>
            <Text style={styles.levelUpText}>⬆️ LEVEL UP! 🎉</Text>
          </Animated.View>
        )}

        <Animated.View style={[styles.monsterCard, { transform: [{ translateX: shakeAnim }] }]}>
          <Image source={monster.image} style={styles.monsterImage} resizeMode="contain" />
          <Text style={styles.monsterName}>{monster.name}</Text>
          <StatBar label="❤️" current={monsterHp} max={monster.maxHp} color={COLORS.hp} />
          <Text style={styles.monsterStats}>⚔️ {monster.attack} ataku</Text>
        </Animated.View>

        <View style={styles.logBox}>
          {log.map((line, i) => (
            <Text key={i} style={[styles.logLine, i === 0 && styles.logLatest]}>{line}</Text>
          ))}
        </View>

        <View style={styles.playerCard}>
          <StatBar label="❤️ Twoje HP" current={state.hp} max={state.maxHp} color={COLORS.hp} />
          <StatBar label="⭐ XP" current={state.xp} max={state.xpToNext} color={COLORS.xp} />
        </View>

        {playerDead ? (
          <TouchableOpacity style={styles.reviveBtn} onPress={revive}>
            <Text style={styles.reviveBtnText}>💀 Odrodź się</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity style={[styles.attackBtn, (cooldown || monsterHp <= 0) && styles.attackBtnCooldown]} onPress={attack} activeOpacity={0.7}>
              <Text style={styles.attackBtnText}>⚔️ ATAKUJ</Text>
              <Text style={styles.attackSub}>({state.attack} ataku)</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.potionBtn, (state.gold < 30 || state.hp >= state.maxHp) && styles.potionDisabled]}
              onPress={() => {
                if (state.gold < 30 || state.hp >= state.maxHp) return;
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                dispatch({ type: 'BUY_POTION' });
              }}
              disabled={state.gold < 30 || state.hp >= state.maxHp}
            >
              <Text style={styles.potionBtnText}>🧪 Mikstura +50 HP</Text>
              <Text style={styles.potionCost}>🪙 30</Text>
            </TouchableOpacity>
          </>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { padding: SPACING.md, paddingBottom: SPACING.xl },
  monsterCard: { backgroundColor: COLORS.surface, borderRadius: 12, padding: SPACING.lg, marginBottom: SPACING.md, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  monsterImage: { width: 140, height: 140 },
  monsterName: { fontSize: FONTS.heading, color: COLORS.text, fontWeight: 'bold', marginVertical: SPACING.sm },
  monsterStats: { color: COLORS.textMuted, fontSize: FONTS.small, marginTop: SPACING.xs },
  logBox: { backgroundColor: COLORS.surface, borderRadius: 12, padding: SPACING.md, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border, minHeight: 80 },
  logLine: { color: COLORS.textMuted, fontSize: FONTS.small, marginBottom: 2 },
  logLatest: { color: COLORS.text, fontWeight: 'bold' },
  playerCard: { backgroundColor: COLORS.surface, borderRadius: 12, padding: SPACING.md, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  attackBtn: { backgroundColor: COLORS.accent, borderRadius: 16, padding: SPACING.lg, alignItems: 'center', elevation: 4 },
  attackBtnText: { color: COLORS.white, fontSize: FONTS.title, fontWeight: 'bold' },
  attackSub: { color: COLORS.white, fontSize: FONTS.small, opacity: 0.8, marginTop: 4 },
  attackBtnCooldown: { opacity: 0.6 },
  reviveBtn: { backgroundColor: COLORS.card, borderRadius: 16, padding: SPACING.lg, alignItems: 'center', borderWidth: 1, borderColor: COLORS.accent },
  reviveBtnText: { color: COLORS.accent, fontSize: FONTS.heading, fontWeight: 'bold' },
  potionBtn: { backgroundColor: COLORS.surface, borderRadius: 16, padding: SPACING.md, alignItems: 'center', marginTop: SPACING.sm, borderWidth: 1, borderColor: COLORS.xp, flexDirection: 'row', justifyContent: 'center', gap: SPACING.md },
  potionDisabled: { opacity: 0.4 },
  potionBtnText: { color: COLORS.xp, fontSize: FONTS.body, fontWeight: 'bold' },
  potionCost: { color: COLORS.gold, fontSize: FONTS.body, fontWeight: 'bold' },
  resetBtn: { alignSelf: 'flex-start', marginBottom: SPACING.sm, paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: 8, borderWidth: 1, borderColor: COLORS.border },
  resetBtnText: { color: COLORS.textMuted, fontSize: FONTS.small },
  levelUpBanner: { backgroundColor: COLORS.gold, borderRadius: 12, padding: SPACING.md, alignItems: 'center', marginBottom: SPACING.md },
  levelUpText: { color: COLORS.bg, fontSize: FONTS.heading, fontWeight: 'bold' },
});
