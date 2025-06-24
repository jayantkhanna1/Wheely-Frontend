import { Tabs } from 'expo-router';
import { Car, Bike, Recycle as Bicycle } from 'lucide-react-native';

export default function TabLayout() {
  return (
    // return none
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          display: 'none',
        },
      }}
    ></Tabs>
  );
}