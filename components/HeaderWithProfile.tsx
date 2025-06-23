import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProfileButton } from './ProfileButton';

interface UserData {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  private_token: string;
  email_verified: boolean;
  phone_verified: boolean;
  driving_license_verified: boolean;
}

interface HeaderWithProfileProps {
  userData: UserData | null;
  onProfilePress: () => void;
  greeting?: string;
}

export const HeaderWithProfile: React.FC<HeaderWithProfileProps> = ({ 
  userData, 
  onProfilePress, 
  greeting 
}) => {
  const defaultGreeting = `Hello, ${userData?.first_name || 'User'}!!`;
  
  return (
    <View style={styles.header}>
      <Text style={styles.greeting}>{greeting || defaultGreeting}</Text>
      <ProfileButton userData={userData} onPress={onProfilePress} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 32,
    marginTop: 20
  },
  greeting: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
  },
});