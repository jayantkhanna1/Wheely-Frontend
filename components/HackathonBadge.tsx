import React from 'react';
import { View, StyleSheet, TouchableOpacity, Linking, Image } from 'react-native';

interface HackathonBadgeProps {
  link?: string;
}

export const HackathonBadge: React.FC<HackathonBadgeProps> = ({
  link = "https://bolt.new/~/github-gbz9wglg "
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
      <Image
        source={require('../assets/images/badge.jpeg')}
        style={styles.badgeImage}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 9999,
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
  },
  badgeImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  }
});