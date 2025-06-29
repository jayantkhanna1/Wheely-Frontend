import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface OfflineBannerProps {
  onRetry: () => void;
}

export function OfflineBanner({ onRetry }: OfflineBannerProps) {
  return (
    <View style={styles.offlineBanner}>
      <Text style={styles.offlineBannerText}>
        You are currently offline. Some features may be limited.
      </Text>
      <TouchableOpacity onPress={onRetry}>
        <Text style={styles.retryText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  offlineBanner: {
    backgroundColor: '#FEF2F2',
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  offlineBannerText: {
    color: '#B91C1C',
    fontSize: 12,
    flex: 1,
  },
  retryText: {
    color: '#B91C1C',
    fontWeight: '600',
    fontSize: 12,
    marginLeft: 8,
    textDecorationLine: 'underline',
  }
});