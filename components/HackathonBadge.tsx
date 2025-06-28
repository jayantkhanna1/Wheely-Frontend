import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Dimensions } from 'react-native';

interface HackathonBadgeProps {
  eventName?: string;
  link?: string;
}

const { width } = Dimensions.get('window');

export const HackathonBadge: React.FC<HackathonBadgeProps> = ({ 
  eventName = "Hackathon 2025", 
  link = "https://hackathon.example.com" 
}) => {
  const handlePress = () => {
    if (link) {
      Linking.openURL(link);
    }
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={styles.badge}>
        <Text style={styles.text}>{eventName}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 9999,
    width: 120,
    height: 120,
    overflow: 'hidden',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FF5722',
    paddingVertical: 5,
    paddingHorizontal: 30,
    transform: [{ rotate: '45deg' }, { translateX: 30 }, { translateY: -5 }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  text: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 10,
    textAlign: 'center',
  }
});