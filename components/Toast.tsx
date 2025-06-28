import React, { useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  visible: boolean;
  onHide: () => void;
}

export default function Toast({ message, type, visible, onHide }: ToastProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  // Memoize the onHide callback to prevent unnecessary re-renders
  const handleHide = useCallback(() => {
    // Use setTimeout to defer the state update to the next tick
    setTimeout(() => {
      onHide();
    }, 0);
  }, [onHide]);

  useEffect(() => {
    // Clear any existing animation
    if (animationRef.current) {
      animationRef.current.stop();
    }

    if (visible) {
      // Reset opacity to 0 when showing
      opacity.setValue(0);
      
      animationRef.current = Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(3000),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]);

      animationRef.current.start((finished) => {
        if (finished) {
          handleHide();
        }
      });
    } else {
      // Ensure opacity is 0 when not visible
      opacity.setValue(0);
    }

    // Cleanup function
    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
      }
    };
  }, [visible, opacity, handleHide]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <View style={[styles.toast, type === 'error' ? styles.error : styles.success]}>
        <Text style={styles.text}>{message}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  toast: {
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  success: {
    backgroundColor: '#10B981',
  },
  error: {
    backgroundColor: '#EF4444',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});