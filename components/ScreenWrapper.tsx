import { StatusBar } from 'expo-status-bar';
import React, {ReactNode } from 'react';
import {
  View,
  StyleSheet,
  Platform, 
  StatusBar as RNStatusBar
} from 'react-native';

const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? RNStatusBar.currentHeight || 24 : 44;

interface ScreenWrapperProps {
  children: ReactNode;
}

export function ScreenWrapper({ children }: ScreenWrapperProps) {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      {children}
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