import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GameProvider } from '../context/GameContext';
import ErrorBoundary from '../components/ErrorBoundary';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <GameProvider>
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
        </GameProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
