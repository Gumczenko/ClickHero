import { Tabs } from 'expo-router';
import { COLORS } from '../../constants/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: COLORS.surface, borderTopColor: COLORS.border },
        tabBarActiveTintColor: COLORS.accent,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarLabelStyle: { fontSize: 15, fontWeight: 'bold' },
      }}
    >
      <Tabs.Screen name="index"  options={{ title: 'Bohater', tabBarIcon: () => null, tabBarLabel: 'Bohater' }} />
      <Tabs.Screen name="battle" options={{ title: 'Walka',   tabBarIcon: () => null, tabBarLabel: 'Walka' }} />
    </Tabs>
  );
}
