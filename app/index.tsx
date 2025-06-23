import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

export default function WelcomeScreen() {
  const [isAutoLogging, setIsAutoLogging] = useState(true);

  useEffect(() => {
    attemptAutoLogin();
  }, []);

  const attemptAutoLogin = async () => {
    try {
      // Get stored user data
      const storedUserId = await AsyncStorage.getItem('user_id');
      const storedPrivateToken = await AsyncStorage.getItem('private_token');

      console.log('Stored user_id:', storedUserId);
      console.log('Stored private_token:', storedPrivateToken);

      if (storedUserId && storedPrivateToken) {
        console.log('Attempting auto-login...');
        
        const apiUrl = `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/user/autoLogin/`;
        console.log('Making auto-login request to:', apiUrl);
        
        const requestData = {
          user_id: parseInt(storedUserId),
          private_token: storedPrivateToken,
        };
        
        console.log('Auto-login request data:', requestData);

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(requestData),
        });

        console.log('Auto-login response status:', response.status);
        const data = await response.json();
        console.log('Auto-login response data:', data);

        if (response.ok && data.message === "Auto-login successful") {
          console.log('Auto-login successful, storing updated user data...');
          
          // Store updated user data
          await storeUserData(data.user);
          
          console.log('Redirecting to home...');
          
          // Small delay to ensure data is stored
          setTimeout(() => {
            router.replace('/(tabs)');
          }, 500);
          
          return; // Exit early, don't set isAutoLogging to false
        } else {
          console.log('Auto-login failed, clearing stored data');
          // Clear invalid stored data
          await clearStoredData();
        }
      } else {
        console.log('No stored credentials found');
      }
    } catch (error) {
      console.error('Auto-login error:', error);
      // Clear potentially corrupted data
      await clearStoredData();
    }
    
    setIsAutoLogging(false);
  };

  const storeUserData = async (userData: UserData) => {
    try {
      await AsyncStorage.multiSet([
        ['user_id', userData.id.toString()],
        ['private_token', userData.private_token],
        ['user_data', JSON.stringify(userData)],
        ['first_name', userData.first_name || ''],
        ['last_name', userData.last_name || ''],
        ['email', userData.email || ''],
        ['phone', userData.phone || ''],
        ['email_verified', userData.email_verified ? 'true' : 'false'],
        ['phone_verified', userData.phone_verified ? 'true' : 'false'],
        ['driving_license_verified', userData.driving_license_verified ? 'true' : 'false'],
      ]);
      console.log('User data stored successfully');
    } catch (error) {
      console.error('Error storing user data:', error);
    }
  };

  const clearStoredData = async () => {
    try {
      await AsyncStorage.multiRemove([
        'user_id',
        'private_token',
        'user_data',
        'first_name',
        'last_name',
        'email',
        'phone',
        'email_verified',
        'phone_verified',
        'driving_license_verified',
      ]);
      console.log('Stored data cleared');
    } catch (error) {
      console.error('Error clearing stored data:', error);
    }
  };

  // Show loading screen while attempting auto-login
  if (isAutoLogging) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
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
        
        <View style={styles.loadingSection}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.loadingText}>Checking for existing session...</Text>
        </View>
      </View>
    );
  }

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
            <TouchableOpacity onPress={() => router.push('/login')}>
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
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
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
    width: 100,
    height: 100,
    borderRadius: 50,
    tintColor: '#FFFFFF',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  bottomSection: {
    alignItems: 'center',
  },
  description: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
    opacity: 0.9,
  },
  createAccountButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  createAccountText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  loginLink: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  loadingSection: {
    alignItems: 'center',
    marginTop: 40,
  },
  loadingText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: 16,
    opacity: 0.9,
  },
});