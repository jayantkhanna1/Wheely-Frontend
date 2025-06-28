import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';

interface HackathonBadgeProps {
  eventName?: string;
  link?: string;
}

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
      <View style={styles.ribbon} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 999,
  },
  badge: {
    backgroundColor: '#FF5722',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderBottomLeftRadius: 8,
    transform: [{ rotate: '45deg' }, { translateX: 20 }, { translateY: -10 }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  text: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 10,
    textAlign: 'center',
  },
  ribbon: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 60,
    height: 60,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 0,
    borderRightWidth: 60,
    borderBottomWidth: 60,
    borderLeftWidth: 0,
    borderTopColor: 'transparent',
    borderRightColor: '#FF5722',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
    transform: [{ rotate: '45deg' }, { translateX: 15 }, { translateY: -15 }],
    zIndex: -1,
  }
});