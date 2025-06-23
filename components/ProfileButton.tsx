import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface ProfileButtonProps {
  userData: {
    first_name?: string;
    last_name?: string;
  } | null;
  onPress: () => void;
}

export const ProfileButton: React.FC<ProfileButtonProps> = ({ userData, onPress }) => {
  const getUserInitials = () => {
    return (userData?.first_name?.[0] || '') + (userData?.last_name?.[0] || '');
  };

  return (
    <TouchableOpacity style={styles.profileIcon} onPress={onPress}>
      <Text style={styles.profileText}>{getUserInitials()}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#059669',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
