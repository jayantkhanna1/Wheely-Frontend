import { Tabs } from 'expo-router';
import { Chrome as Home, Car, Bike, Bicycle } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#059669',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          paddingBottom: 8,
          paddingTop: 8,
          height: 80,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ size, color }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="car-selection"
        options={{
          title: 'Cars',
          tabBarIcon: ({ size, color }) => (
            <Car size={size} color={color} />
          ),
          href: null, // Hide from tab bar but keep accessible via navigation
        }}
      />
      <Tabs.Screen
        name="bike-selection"
        options={{
          title: 'Bikes',
          tabBarIcon: ({ size, color }) => (
            <Bike size={size} color={color} />
          ),
          href: null, // Hide from tab bar but keep accessible via navigation
        }}
      />
      <Tabs.Screen
        name="cycle-selection"
        options={{
          title: 'Cycles',
          tabBarIcon: ({ size, color }) => (
            <Bicycle size={size} color={color} />
          ),
          href: null, // Hide from tab bar but keep accessible via navigation
        }}
      />
    </Tabs>
  );
}