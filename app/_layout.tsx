import { Stack } from 'expo-router';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GameProvider, useGame } from '../context/GameContext';
import ErrorBoundary from '../components/ErrorBoundary';
import { COLORS } from '../constants/theme';

function AppNavigator() {
  const { loading } = useGame();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.accent} />
        <Text style={styles.loadingText}>Ładowanie...</Text>
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="stats"
        options={{
          headerShown: true,
          title: 'Statystyki',
          headerBackTitle: 'Wróć',
          headerStyle: { backgroundColor: '#1a1a2e' },
          headerTintColor: '#eaeaea',
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <GameProvider>
          <AppNavigator />
        </GameProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, backgroundColor: COLORS.bg, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: COLORS.textMuted, marginTop: 16, fontSize: 16 },
});
