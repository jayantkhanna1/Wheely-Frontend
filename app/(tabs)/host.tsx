import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, SafeAreaView, Animated, Dimensions, Modal, TouchableWithoutFeedback, FlatList } from 'react-native';
import { Search, MapPin, Mic, Calendar, Clock, Bike, X, User, Map as MapIcon, Phone, Gift, Percent, CircleHelp as HelpCircle, FileText, Globe, ChevronDown, ChevronUp } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HeaderWithProfile } from '../../components/HeaderWithProfile';
import { SlideMenu } from '../../components/SlideMenu';
// import * as Location from 'expo-location'; // uncomment when youn join google for location services

// const GOOGLE_PLACES_API_KEY = 'YOUR_GOOGLE_PLACES_API_KEY';


interface VehicleOption {
  id: string;
  name: string;
  icon: React.ReactNode;
}

interface MenuItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  onPress: () => void;
}

interface LocationSuggestion {
  id: string;
  name: string;
  address: string;
  type: 'popular' | 'recent' | 'nearby';
}

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

const { width: screenWidth } = Dimensions.get('window');

export default function HomeScreen() {
  const [location, setLocation] = useState('');
  const [tripStart, setTripStart] = useState(new Date());
  const [tripEnd, setTripEnd] = useState(new Date(Date.now() + 12 * 60 * 60 * 1000)); // 12 hours later
  const [selectedVehicle, setSelectedVehicle] = useState<string>(''); // No default selection
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [startPickerMode, setStartPickerMode] = useState<'date' | 'time'>('date');
  const [endPickerMode, setEndPickerMode] = useState<'date' | 'time'>('date');
  const [showMenu, setShowMenu] = useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const slideAnim = useRef(new Animated.Value(screenWidth)).current;
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const storedUserData = await AsyncStorage.getItem('user_data');
      if (storedUserData) {
        const parsedUserData = JSON.parse(storedUserData);
        setUserData(parsedUserData);
        console.log('User data loaded:', parsedUserData);
      } else {
        console.log('No user data found in storage');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <HeaderWithProfile userData={userData} />
      <View style={{ flex: 1 }}>
        {/* Your main content goes here */}
      </View>
      <SlideMenu
        visible={showMenu}
        onClose={() => setShowMenu(false)}
        menuItems={menuItems}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

});