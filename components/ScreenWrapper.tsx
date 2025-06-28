import { StatusBar } from 'expo-status-bar';
import React, {ReactNode } from 'react';
import {
  View,
  StyleSheet,
  Platform, 
  StatusBar as RNStatusBar
} from 'react-native';
import { HackathonBadge } from './HackathonBadge';

const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? RNStatusBar.currentHeight || 24 : 44;

interface ScreenWrapperProps {
  children: ReactNode;
  showHackathonBadge?: boolean;
}

export function ScreenWrapper({ children, showHackathonBadge = true }: ScreenWrapperProps) {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      {children}
      {showHackathonBadge && <HackathonBadge eventName="HACKATHON 2025" link="https://hackathon.wheely.xyz" />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: STATUS_BAR_HEIGHT,
    backgroundColor: "#ffffff"
  },
});