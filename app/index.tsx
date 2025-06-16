import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.iconContainer}>
            <Image
              source={{ uri: 'https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop' }}
              style={styles.scooterIcon}
            />
          </View>
          <Text style={styles.title}>Wheely</Text>
          <Text style={styles.subtitle}>Smart rides, faster lives</Text>
        </View>

        <View style={styles.bottomSection}>
          <Text style={styles.description}>
            Join over 10,000 riders over the World{'\n'}and enjoy your ride!!
          </Text>

          <TouchableOpacity
            style={styles.createAccountButton}
            onPress={() => router.push('/create-account')}
          >
            <Text style={styles.createAccountText}>Create an account</Text>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity>
              <Text style={styles.loginLink}>Log in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#059669',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingTop: 100,
    paddingBottom: 50,
  },
  logoContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  iconContainer: {
    marginBottom: 40,
  },
  scooterIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    tintColor: '#FFFFFF',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  bottomSection: {
    alignItems: 'center',
  },
  description: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
    opacity: 0.9,
  },
  createAccountButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  createAccountText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#059669',
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  loginLink: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});