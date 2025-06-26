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

  // Sample location suggestions
  const locationSuggestions: LocationSuggestion[] = [
    { id: '1', name: 'Delhi', address: 'Delhi, Delhi', type: 'popular' },
    { id: '2', name: 'Bangalore', address: 'Bangalore, Karnataka', type: 'popular' },
    { id: '3', name: 'Dehradun', address: 'Dehradun, Uttarakhand', type: 'popular' },
    { id: '4', name: 'Mumbai', address: 'Mumbai, Maharashtra', type: 'popular' },
    { id: '5', name: 'Chennai', address: 'Chennai, Tamil Nadu', type: 'popular' },
    { id: '6', name: 'Kolkata', address: 'Kolkata, West Bengal', type: 'popular' },
    { id: '7', name: 'Hyderabad', address: 'Hyderabad, Telangana', type: 'popular' },
    { id: '8', name: 'Ahmedabad', address: 'Ahmedabad, Gujarat', type: 'popular' },
    { id: '9', name: 'Pune', address: 'Pune, Maharashtra', type: 'popular' },
    { id: '10', name: 'Jaipur', address: 'Jaipur, Rajasthan', type: 'popular' },
    { id: '11', name: 'Lucknow', address: 'Lucknow, Uttar Pradesh', type: 'popular' },
    { id: '12', name: 'Chandigarh', address: 'Chandigarh', type: 'popular' },
    { id: '13', name: 'Bhopal', address: 'Bhopal, Madhya Pradesh', type: 'popular' },
    { id: '14', name: 'Patna', address: 'Patna, Bihar', type: 'popular' },
    { id: '15', name: 'Guwahati', address: 'Guwahati, Assam', type: 'popular' },
    { id: '16', name: 'Srinagar', address: 'Srinagar, Jammu and Kashmir', type: 'popular' },
    { id: '17', name: 'Shimla', address: 'Shimla, Himachal Pradesh', type: 'popular' },
    { id: '18', name: 'Panaji', address: 'Panaji, Goa', type: 'popular' },
    { id: '19', name: 'Thiruvananthapuram', address: 'Thiruvananthapuram, Kerala', type: 'popular' },
    { id: '20', name: 'Ranchi', address: 'Ranchi, Jharkhand', type: 'popular' },
    { id: '21', name: 'Raipur', address: 'Raipur, Chhattisgarh', type: 'popular' },
    { id: '22', name: 'Aizawl', address: 'Aizawl, Mizoram', type: 'popular' },
    { id: '23', name: 'Shillong', address: 'Shillong, Meghalaya', type: 'popular' },
    { id: '24', name: 'Imphal', address: 'Imphal, Manipur', type: 'popular' },
    { id: '25', name: 'Kohima', address: 'Kohima, Nagaland', type: 'popular' },
    { id: '26', name: 'Itanagar', address: 'Itanagar, Arunachal Pradesh', type: 'popular' },
    { id: '27', name: 'Agartala', address: 'Agartala, Tripura', type: 'popular' },
    { id: '28', name: 'Gangtok', address: 'Gangtok, Sikkim', type: 'popular' },
    { id: '29', name: 'Puducherry', address: 'Puducherry', type: 'popular' },
    { id: '30', name: 'Port Blair', address: 'Port Blair, Andaman and Nicobar Islands', type: 'popular' },
    { id: '31', name: 'Varanasi', address: 'Varanasi, Uttar Pradesh', type: 'popular' },
    { id: '32', name: 'Amritsar', address: 'Amritsar, Punjab', type: 'popular' },
    { id: '33', name: 'Noida', address: 'Noida, Uttar Pradesh', type: 'popular' },
    { id: '34', name: 'Gurgaon', address: 'Gurgaon, Haryana', type: 'popular' },
    { id: '35', name: 'Faridabad', address: 'Faridabad, Haryana', type: 'popular' },
    { id: '36', name: 'Ghaziabad', address: 'Ghaziabad, Uttar Pradesh', type: 'popular' },
    { id: '37', name: 'Nagpur', address: 'Nagpur, Maharashtra', type: 'popular' },
    { id: '38', name: 'Surat', address: 'Surat, Gujarat', type: 'popular' },
    { id: '39', name: 'Vadodara', address: 'Vadodara, Gujarat', type: 'popular' },
    { id: '40', name: 'Rajkot', address: 'Rajkot, Gujarat', type: 'popular' },
    { id: '41', name: 'Jodhpur', address: 'Jodhpur, Rajasthan', type: 'popular' },
    { id: '42', name: 'Udaipur', address: 'Udaipur, Rajasthan', type: 'popular' },
    { id: '43', name: 'Ajmer', address: 'Ajmer, Rajasthan', type: 'popular' },
    { id: '44', name: 'Aligarh', address: 'Aligarh, Uttar Pradesh', type: 'popular' },
    { id: '45', name: 'Meerut', address: 'Meerut, Uttar Pradesh', type: 'popular' },
    { id: '46', name: 'Kanpur', address: 'Kanpur, Uttar Pradesh', type: 'popular' },
    { id: '47', name: 'Allahabad', address: 'Allahabad, Uttar Pradesh', type: 'popular' },
    { id: '48', name: 'Bareilly', address: 'Bareilly, Uttar Pradesh', type: 'popular' },
    { id: '49', name: 'Moradabad', address: 'Moradabad, Uttar Pradesh', type: 'popular' },
    { id: '50', name: 'Gaya', address: 'Gaya, Bihar', type: 'popular' },
    { id: '51', name: 'Muzaffarpur', address: 'Muzaffarpur, Bihar', type: 'popular' },
    { id: '52', name: 'Dhanbad', address: 'Dhanbad, Jharkhand', type: 'popular' },
    { id: '53', name: 'Jamshedpur', address: 'Jamshedpur, Jharkhand', type: 'popular' },
    { id: '54', name: 'Bilaspur', address: 'Bilaspur, Chhattisgarh', type: 'popular' },
    { id: '55', name: 'Bhilai', address: 'Bhilai, Chhattisgarh', type: 'popular' },
    { id: '56', name: 'Nashik', address: 'Nashik, Maharashtra', type: 'popular' },
    { id: '57', name: 'Aurangabad', address: 'Aurangabad, Maharashtra', type: 'popular' },
    { id: '58', name: 'Kolhapur', address: 'Kolhapur, Maharashtra', type: 'popular' },
    { id: '59', name: 'Amravati', address: 'Amravati, Maharashtra', type: 'popular' },
    { id: '60', name: 'Salem', address: 'Salem, Tamil Nadu', type: 'popular' },
    { id: '61', name: 'Madurai', address: 'Madurai, Tamil Nadu', type: 'popular' },
    { id: '62', name: 'Coimbatore', address: 'Coimbatore, Tamil Nadu', type: 'popular' },
    { id: '63', name: 'Tiruchirappalli', address: 'Tiruchirappalli, Tamil Nadu', type: 'popular' },
    { id: '64', name: 'Tirunelveli', address: 'Tirunelveli, Tamil Nadu', type: 'popular' },
    { id: '65', name: 'Warangal', address: 'Warangal, Telangana', type: 'popular' },
    { id: '66', name: 'Vijayawada', address: 'Vijayawada, Andhra Pradesh', type: 'popular' },
    { id: '67', name: 'Visakhapatnam', address: 'Visakhapatnam, Andhra Pradesh', type: 'popular' },
    { id: '68', name: 'Nellore', address: 'Nellore, Andhra Pradesh', type: 'popular' },
    { id: '69', name: 'Guntur', address: 'Guntur, Andhra Pradesh', type: 'popular' },
    { id: '70', name: 'Kurnool', address: 'Kurnool, Andhra Pradesh', type: 'popular' },
    { id: '71', name: 'Hubli', address: 'Hubli, Karnataka', type: 'popular' },
    { id: '72', name: 'Mysore', address: 'Mysore, Karnataka', type: 'popular' },
    { id: '73', name: 'Belgaum', address: 'Belgaum, Karnataka', type: 'popular' },
    { id: '74', name: 'Davangere', address: 'Davangere, Karnataka', type: 'popular' },
    { id: '75', name: 'Silvassa', address: 'Silvassa, Dadra and Nagar Haveli', type: 'popular' },
    { id: '76', name: 'Daman', address: 'Daman, Daman and Diu', type: 'popular' },
    { id: '77', name: 'Kavaratti', address: 'Kavaratti, Lakshadweep', type: 'popular' },
    { id: '78', name: 'Leh', address: 'Leh, Ladakh', type: 'popular' },
    { id: '79', name: 'Diu', address: 'Diu, Daman and Diu', type: 'popular' },
    { id: '80', name: 'Palakkad', address: 'Palakkad, Kerala', type: 'popular' },
    { id: '81', name: 'Thrissur', address: 'Thrissur, Kerala', type: 'popular' },
    { id: '82', name: 'Kochi', address: 'Kochi, Kerala', type: 'popular' },
    { id: '83', name: 'Alappuzha', address: 'Alappuzha, Kerala', type: 'popular' },
    { id: '84', name: 'Kannur', address: 'Kannur, Kerala', type: 'popular' },
    { id: '85', name: 'Kozhikode', address: 'Kozhikode, Kerala', type: 'popular' },
    { id: '86', name: 'Malappuram', address: 'Malappuram, Kerala', type: 'popular' },
    { id: '87', name: 'Nagercoil', address: 'Nagercoil, Tamil Nadu', type: 'popular' },
    { id: '88', name: 'Erode', address: 'Erode, Tamil Nadu', type: 'popular' },
    { id: '89', name: 'Vellore', address: 'Vellore, Tamil Nadu', type: 'popular' },
    { id: '90', name: 'Cuddalore', address: 'Cuddalore, Tamil Nadu', type: 'popular' },
    { id: '91', name: 'Anantapur', address: 'Anantapur, Andhra Pradesh', type: 'popular' },
    { id: '92', name: 'Kadapa', address: 'Kadapa, Andhra Pradesh', type: 'popular' },
    { id: '93', name: 'Karimnagar', address: 'Karimnagar, Telangana', type: 'popular' },
    { id: '94', name: 'Nizamabad', address: 'Nizamabad, Telangana', type: 'popular' },
    { id: '95', name: 'Bidar', address: 'Bidar, Karnataka', type: 'popular' },
    { id: '96', name: 'Tumkur', address: 'Tumkur, Karnataka', type: 'popular' },
    { id: '97', name: 'Hassan', address: 'Hassan, Karnataka', type: 'popular' },
    { id: '98', name: 'Raichur', address: 'Raichur, Karnataka', type: 'popular' },
    { id: '99', name: 'Kalaburagi', address: 'Kalaburagi, Karnataka', type: 'popular' },
    { id: '100', name: 'Chhindwara', address: 'Chhindwara, Madhya Pradesh', type: 'popular' },
    { id: '101', name: 'Satna', address: 'Satna, Madhya Pradesh', type: 'popular' },
    { id: '102', name: 'Gwalior', address: 'Gwalior, Madhya Pradesh', type: 'popular' },
    { id: '103', name: 'Rewa', address: 'Rewa, Madhya Pradesh', type: 'popular' },
    { id: '104', name: 'Ujjain', address: 'Ujjain, Madhya Pradesh', type: 'popular' },
    { id: '105', name: 'Ratlam', address: 'Ratlam, Madhya Pradesh', type: 'popular' },
    { id: '106', name: 'Sagar', address: 'Sagar, Madhya Pradesh', type: 'popular' },
    { id: '107', name: 'Bhavnagar', address: 'Bhavnagar, Gujarat', type: 'popular' },
    { id: '108', name: 'Gandhinagar', address: 'Gandhinagar, Gujarat', type: 'popular' },
    { id: '109', name: 'Jamnagar', address: 'Jamnagar, Gujarat', type: 'popular' },
    { id: '110', name: 'Porbandar', address: 'Porbandar, Gujarat', type: 'popular' },
    { id: '111', name: 'Junagadh', address: 'Junagadh, Gujarat', type: 'popular' },
    { id: '112', name: 'Bikaner', address: 'Bikaner, Rajasthan', type: 'popular' },
    { id: '113', name: 'Kota', address: 'Kota, Rajasthan', type: 'popular' },
    { id: '114', name: 'Bharatpur', address: 'Bharatpur, Rajasthan', type: 'popular' },
    { id: '115', name: 'Alwar', address: 'Alwar, Rajasthan', type: 'popular' },
    { id: '116', name: 'Sikar', address: 'Sikar, Rajasthan', type: 'popular' },
    { id: '117', name: 'Firozabad', address: 'Firozabad, Uttar Pradesh', type: 'popular' },
    { id: '118', name: 'Saharanpur', address: 'Saharanpur, Uttar Pradesh', type: 'popular' },
    { id: '119', name: 'Fatehpur', address: 'Fatehpur, Uttar Pradesh', type: 'popular' },
    { id: '120', name: 'Etawah', address: 'Etawah, Uttar Pradesh', type: 'popular' },
    { id: '121', name: 'Ballia', address: 'Ballia, Uttar Pradesh', type: 'popular' },
    { id: '122', name: 'Haldwani', address: 'Haldwani, Uttarakhand', type: 'popular' },
    { id: '123', name: 'Roorkee', address: 'Roorkee, Uttarakhand', type: 'popular' },

  ];

  const filteredSuggestions = locationSuggestions.filter(suggestion =>
    suggestion.name.toLowerCase().includes(location.toLowerCase()) ||
    suggestion.address.toLowerCase().includes(location.toLowerCase())
  );

  const vehicleOptions: VehicleOption[] = [
    {
      id: 'bicycle',
      name: 'Bicycle',
      icon: <Bike size={28} color={selectedVehicle === 'bicycle' ? '#FFFFFF' : '#374151'} strokeWidth={1.5} />
    },
    {
      id: 'bike',
      name: 'Bike',
      icon: (
        <View style={styles.bikeIcon}>
          <View style={[styles.bikeWheel, { borderColor: selectedVehicle === 'bike' ? '#FFFFFF' : '#374151' }]} />
          <View style={[styles.bikeWheel, styles.bikeWheelRight, { borderColor: selectedVehicle === 'bike' ? '#FFFFFF' : '#374151' }]} />
          <View style={[styles.bikeFrame, { backgroundColor: selectedVehicle === 'bike' ? '#FFFFFF' : '#374151' }]} />
        </View>
      )
    },
    {
      id: 'car',
      name: 'Car',
      icon: (
        <View style={styles.carIcon}>
          <View style={[styles.carBody, { backgroundColor: selectedVehicle === 'car' ? '#FFFFFF' : '#374151' }]} />
          <View style={[styles.carWindow, { backgroundColor: selectedVehicle === 'car' ? '#FFFFFF' : '#374151' }]} />
          <View style={[styles.carWheel, { backgroundColor: selectedVehicle === 'car' ? '#FFFFFF' : '#374151' }]} />
          <View style={[styles.carWheel, styles.carWheelRight, { backgroundColor: selectedVehicle === 'car' ? '#FFFFFF' : '#374151' }]} />
        </View>
      )
    }
  ];

  const formatDateTime = (date: Date, type: 'date' | 'time') => {
    if (type === 'date') {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit'
      });
    } else {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    }
  };

  const formatDateTimeForDropdown = (date: Date) => {
    const dateStr = date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit'
    });
    const timeStr = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    return `${dateStr}, ${timeStr}`;
  };

  // 1. Update the handleDateTimeChange function to properly handle both date and time changes:

  const handleDateTimeChange = (event: any, selectedDate?: Date, type?: 'start' | 'end', mode?: 'date' | 'time') => {
    // Hide picker on Android after selection
    if (Platform.OS === 'android') {
      if (type === 'start') {
        setShowStartPicker(false);
      } else {
        setShowEndPicker(false);
      }
    }

    if (selectedDate) {
      if (type === 'start') {
        if (mode === 'date') {
          // Update only the date part, preserve existing time
          const newDate = new Date(tripStart);
          newDate.setFullYear(selectedDate.getFullYear());
          newDate.setMonth(selectedDate.getMonth());
          newDate.setDate(selectedDate.getDate());
          setTripStart(newDate);

          // After setting date on Android, automatically show time picker
          if (Platform.OS === 'android') {
            setTimeout(() => {
              setStartPickerMode('time');
              setShowStartPicker(true);
            }, 100);
          }
        } else if (mode === 'time') {
          // Update only the time part, preserve existing date  
          const newDate = new Date(tripStart);
          newDate.setHours(selectedDate.getHours());
          newDate.setMinutes(selectedDate.getMinutes());
          newDate.setSeconds(0);
          newDate.setMilliseconds(0);
          setTripStart(newDate);
        }
      } else if (type === 'end') {
        if (mode === 'date') {
          // Update only the date part, preserve existing time
          const newDate = new Date(tripEnd);
          newDate.setFullYear(selectedDate.getFullYear());
          newDate.setMonth(selectedDate.getMonth());
          newDate.setDate(selectedDate.getDate());
          setTripEnd(newDate);

          // After setting date on Android, automatically show time picker
          if (Platform.OS === 'android') {
            setTimeout(() => {
              setEndPickerMode('time');
              setShowEndPicker(true);
            }, 100);
          }
        } else if (mode === 'time') {
          // Update only the time part, preserve existing date
          const newDate = new Date(tripEnd);
          newDate.setHours(selectedDate.getHours());
          newDate.setMinutes(selectedDate.getMinutes());
          newDate.setSeconds(0);
          newDate.setMilliseconds(0);
          setTripEnd(newDate);
        }
      }
    }
  };

  // 2. Update the date/time press handlers to ensure proper picker state management:

  const handleStartDateTimePress = () => {
    // Close end picker if open
    setShowEndPicker(false);
    setStartPickerMode('date');
    setShowStartPicker(!showStartPicker);
  };

  const handleEndDateTimePress = () => {
    // Close start picker if open  
    setShowStartPicker(false);
    setEndPickerMode('date');
    setShowEndPicker(!showEndPicker);
  };

  // 3. Update the mode switching functions to ensure proper state updates:

  const switchToTimeMode = (type: 'start' | 'end') => {
    if (type === 'start') {
      setStartPickerMode('time');
      // Ensure picker stays open when switching modes
      if (!showStartPicker) {
        setShowStartPicker(true);
      }
    } else {
      setEndPickerMode('time');
      // Ensure picker stays open when switching modes
      if (!showEndPicker) {
        setShowEndPicker(true);
      }
    }
  };

  const switchToDateMode = (type: 'start' | 'end') => {
    if (type === 'start') {
      setStartPickerMode('date');
      // Ensure picker stays open when switching modes
      if (!showStartPicker) {
        setShowStartPicker(true);
      }
    } else {
      setEndPickerMode('date');
      // Ensure picker stays open when switching modes
      if (!showEndPicker) {
        setShowEndPicker(true);
      }
    }
  };

  // 4. Add validation to ensure end time is after start time:

  const validateDateTime = () => {
    if (tripEnd <= tripStart) {
      // If end time is before or equal to start time, set it to 1 hour after start
      const newEndTime = new Date(tripStart.getTime() + 60 * 60 * 1000); // Add 1 hour
      setTripEnd(newEndTime);
      return false;
    }
    return true;
  };

  // 5. Update the handleSearch function to include validation:

  const handleSearch = () => {
    if (!selectedVehicle) {
      alert('Please select a vehicle type');
      return;
    }
    if (!location.trim()) {
      alert('Please enter a location');
      return;
    }

    // Validate date/time
    if (tripStart < new Date()) {
      alert('Trip start time cannot be in the past');
      return;
    }

    if (tripEnd <= tripStart) {
      alert('Trip end time must be after start time');
      return;
    }

    // Navigate to appropriate selection screen based on vehicle type
    if (selectedVehicle === 'car') {
      router.push({
        pathname: '/car-selection',
        params: { 
          location: location,
          tripStartDate: tripStart.toISOString(),
          tripEndDate: tripEnd.toISOString(),
          tripStartTime: tripStart.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
          tripEndTime: tripEnd.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
        }
      });
    } else if (selectedVehicle === 'bike') {
      router.push({
        pathname: '/bike-selection',
        params: { 
          location: location,
          tripStartDate: tripStart.toISOString(),
          tripEndDate: tripEnd.toISOString(),
          tripStartTime: tripStart.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }), 
          tripEndTime: tripEnd.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
        }
      });
    } else if (selectedVehicle === 'bicycle') {
      router.push({
        pathname: '/cycle-selection',
        params: {
          location: location,
          tripStartDate: tripStart.toISOString(),
          tripEndDate: tripEnd.toISOString(),
          tripStartTime: tripStart.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }), 
          tripEndTime: tripEnd.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
        }
      });
    }
  };

  const handleMicPress = () => {
    // Implement voice input functionality
    console.log('Voice input activated');
    alert('Voice input feature will be implemented');
  };

  const handleLocationPress = () => {
    // Implement GPS location functionality
    console.log('Getting current location');
    alert('GPS location feature will be implemented');
  };

  const handleLocationChange = (text: string) => {
    setLocation(text);
    setShowLocationSuggestions(text.length > 0);
  };

  const handleLocationSuggestionPress = (suggestion: LocationSuggestion) => {
    setLocation(suggestion.name);
    setShowLocationSuggestions(false);
  };

  const openMenu = () => {
    setShowMenu(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(slideAnim, {
      toValue: screenWidth,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowMenu(false);
    });
  };

  const handleMenuItemPress = (item: MenuItem) => {
    item.onPress();
    closeMenu();
  };

  const closeStartPicker = () => {
    setShowStartPicker(false);
  };

  const closeEndPicker = () => {
    setShowEndPicker(false);
  };

  // Close dropdowns when clicking outside
  const handleOutsidePress = () => {
    setShowStartPicker(false);
    setShowEndPicker(false);
    setShowLocationSuggestions(false);
  };

  const renderLocationSuggestion = ({ item }: { item: LocationSuggestion }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => handleLocationSuggestionPress(item)}
    >
      <View style={styles.suggestionIcon}>
        <MapPin size={14} color="#6B7280" />
      </View>
      <View style={styles.suggestionContent}>
        <Text style={styles.suggestionName}>{item.name}</Text>
        <Text style={styles.suggestionAddress}>{item.address}</Text>
      </View>
      <View style={[styles.suggestionType,
      item.type === 'popular' && styles.suggestionTypePopular,
      item.type === 'recent' && styles.suggestionTypeRecent,
      item.type === 'nearby' && styles.suggestionTypeNearby
      ]}>
        <Text style={[styles.suggestionTypeText,
        item.type === 'popular' && styles.suggestionTypeTextPopular,
        item.type === 'recent' && styles.suggestionTypeTextRecent,
        item.type === 'nearby' && styles.suggestionTypeTextNearby
        ]}>
          {item.type}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          {/* Header */}
          <HeaderWithProfile
            userData={userData}
            onProfilePress={openMenu}
          />

          {/* Location Search */}
          <View style={styles.locationContainer}>
            <View style={styles.locationInputContainer}>
              <Search size={18} color="#6B7280" style={styles.searchIcon} />
              <TextInput
                style={styles.locationInput}
                value={location}
                onChangeText={handleLocationChange}
                placeholder="Location"
                placeholderTextColor="#9CA3AF"
                onFocus={() => setShowLocationSuggestions(location.length > 0)}
              />
              <TouchableOpacity style={styles.locationButton} onPress={handleLocationPress}>
                <MapPin size={18} color="#6B7280" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.micButton} onPress={handleMicPress}>
                <Mic size={18} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Location Suggestions */}
            {showLocationSuggestions && (
              <View style={styles.suggestionsContainer}>
                <FlatList
                  data={filteredSuggestions}
                  renderItem={renderLocationSuggestion}
                  keyExtractor={(item) => item.id}
                  style={styles.suggestionsList}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                />
              </View>
            )}
          </View>

          {/* Date and Time Selection - New Design */}
          <View style={styles.dateTimeContainer}>
            <View style={styles.dateTimeSection}>
              <TouchableOpacity
                style={styles.dateTimeDropdownNew}
                onPress={handleStartDateTimePress}
              >
                <Text style={styles.dateTimeLabel}>Trip Start</Text>
                <Text style={styles.dateTimeValue}>
                  {formatDateTimeForDropdown(tripStart)}
                </Text>
                {showStartPicker ? (
                  <ChevronUp size={16} color="#000000" style={styles.dropdownIcon} />
                ) : (
                  <ChevronDown size={16} color="#000000" style={styles.dropdownIcon} />
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.dateTimeSection}>
              <TouchableOpacity
                style={styles.dateTimeDropdownNew}
                onPress={handleEndDateTimePress}
              >
                <Text style={styles.dateTimeLabel}>Trip End</Text>
                <Text style={styles.dateTimeValue}>
                  {formatDateTimeForDropdown(tripEnd)}
                </Text>
                {showEndPicker ? (
                  <ChevronUp size={16} color="#000000" style={styles.dropdownIcon} />
                ) : (
                  <ChevronDown size={16} color="#000000" style={styles.dropdownIcon} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Date/Time Pickers positioned below the entire date/time container */}
          {showStartPicker && Platform.OS !== 'web' && (
            <View style={styles.pickerContainerFullWidth}>
              <View style={styles.pickerHeader}>
                <Text style={styles.pickerTitle}>Select Date & Time</Text>
                <TouchableOpacity
                  style={styles.pickerCloseButton}
                  onPress={closeStartPicker}
                >
                  <X size={18} color="#000000" />
                </TouchableOpacity>
              </View>

              {/* Mode Toggle Buttons */}
              <View style={styles.modeToggleContainer}>
                <TouchableOpacity
                  style={[styles.modeToggleButton, startPickerMode === 'date' && styles.modeToggleButtonActive]}
                  onPress={() => switchToDateMode('start')}
                >
                  <Calendar size={14} color={startPickerMode === 'date' ? '#FFFFFF' : '#374151'} />
                  <Text style={[styles.modeToggleText, startPickerMode === 'date' && styles.modeToggleTextActive]}>
                    Date
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modeToggleButton, startPickerMode === 'time' && styles.modeToggleButtonActive]}
                  onPress={() => switchToTimeMode('start')}
                >
                  <Clock size={14} color={startPickerMode === 'time' ? '#FFFFFF' : '#374151'} />
                  <Text style={[styles.modeToggleText, startPickerMode === 'time' && styles.modeToggleTextActive]}>
                    Time
                  </Text>
                </TouchableOpacity>
              </View>

              <DateTimePicker
                value={tripStart}
                mode={startPickerMode}
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, date) => handleDateTimeChange(event, date, 'start', startPickerMode)}
                minimumDate={new Date()}
                textColor="#000000"
                accentColor="#059669"
              />

              {Platform.OS === 'ios' && (
                <View style={styles.pickerButtons}>
                  <TouchableOpacity
                    style={styles.pickerButton}
                    onPress={closeStartPicker}
                  >
                    <Text style={styles.pickerButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.pickerButton, styles.confirmButton]}
                    onPress={closeStartPicker}
                  >
                    <Text style={[styles.pickerButtonText, styles.confirmButtonText]}>Done</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}

          {showEndPicker && Platform.OS !== 'web' && (
            <View style={styles.pickerContainerFullWidth}>
              <View style={styles.pickerHeader}>
                <Text style={styles.pickerTitle}>Select Date & Time</Text>
                <TouchableOpacity
                  style={styles.pickerCloseButton}
                  onPress={closeEndPicker}
                >
                  <X size={18} color="#000000" />
                </TouchableOpacity>
              </View>

              {/* Mode Toggle Buttons */}
              <View style={styles.modeToggleContainer}>
                <TouchableOpacity
                  style={[styles.modeToggleButton, endPickerMode === 'date' && styles.modeToggleButtonActive]}
                  onPress={() => switchToDateMode('end')}
                >
                  <Calendar size={14} color={endPickerMode === 'date' ? '#FFFFFF' : '#374151'} />
                  <Text style={[styles.modeToggleText, endPickerMode === 'date' && styles.modeToggleTextActive]}>
                    Date
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modeToggleButton, endPickerMode === 'time' && styles.modeToggleButtonActive]}
                  onPress={() => switchToTimeMode('end')}
                >
                  <Clock size={14} color={endPickerMode === 'time' ? '#FFFFFF' : '#374151'} />
                  <Text style={[styles.modeToggleText, endPickerMode === 'time' && styles.modeToggleTextActive]}>
                    Time
                  </Text>
                </TouchableOpacity>
              </View>

              <DateTimePicker
                value={tripEnd}
                mode={endPickerMode}
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, date) => handleDateTimeChange(event, date, 'end', endPickerMode)}
                minimumDate={tripStart}
                textColor="#000000"
                accentColor="#059669"
              />

              {Platform.OS === 'ios' && (
                <View style={styles.pickerButtons}>
                  <TouchableOpacity
                    style={styles.pickerButton}
                    onPress={closeEndPicker}
                  >
                    <Text style={styles.pickerButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.pickerButton, styles.confirmButton]}
                    onPress={closeEndPicker}
                  >
                    <Text style={[styles.pickerButtonText, styles.confirmButtonText]}>Done</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}

          {/* Vehicle Selection */}
          <View style={styles.vehicleContainer}>
            {vehicleOptions.map((vehicle) => (
              <TouchableOpacity
                key={vehicle.id}
                style={[
                  styles.vehicleOption,
                  selectedVehicle === vehicle.id && styles.vehicleOptionSelected
                ]}
                onPress={() => setSelectedVehicle(vehicle.id)}
              >
                <View style={styles.vehicleIconContainer}>
                  {vehicle.icon}
                </View>
                <Text style={[
                  styles.vehicleText,
                  selectedVehicle === vehicle.id && styles.vehicleTextSelected
                ]}>
                  {vehicle.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Search Button */}
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>

        <SlideMenu
          visible={showMenu}
          onClose={closeMenu}
          userData={userData}
          setUserData={setUserData}
        />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 32,
  },
  greeting: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
  },
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
  locationContainer: {
    marginBottom: 32,
    position: 'relative',
  },
  locationInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 12,
  },
  locationInput: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    paddingVertical: 16,
  },
  locationButton: {
    padding: 8,
    marginLeft: 8,
  },
  micButton: {
    padding: 8,
    marginLeft: 4,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginTop: 8,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 1000,
    maxHeight: 300,
  },
  suggestionsList: {
    maxHeight: 300,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  suggestionIcon: {
    marginRight: 12,
    width: 20,
    alignItems: 'center',
  },
  suggestionContent: {
    flex: 1,
  },
  suggestionName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  suggestionAddress: {
    fontSize: 12,
    color: '#6B7280',
  },
  suggestionType: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  suggestionTypePopular: {
    backgroundColor: '#FEF3C7',
  },
  suggestionTypeRecent: {
    backgroundColor: '#DBEAFE',
  },
  suggestionTypeNearby: {
    backgroundColor: '#D1FAE5',
  },
  suggestionTypeText: {
    fontSize: 10,
    fontWeight: '500',
  },
  suggestionTypeTextPopular: {
    color: '#92400E',
  },
  suggestionTypeTextRecent: {
    color: '#1E40AF',
  },
  suggestionTypeTextNearby: {
    color: '#065F46',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    gap: 16,
  },
  dateTimeSection: {
    flex: 1,
    position: 'relative',
  },
  dateTimeLabel: {
    fontSize: 9,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 4,
  },
  dateTimeDropdownNew: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    position: 'relative',
    minHeight: 55,
    justifyContent: 'center',
  },
  dateTimeValue: {
    fontSize: 11,
    fontWeight: '600',
    color: '#000000',
    marginTop: 2,
  },
  dropdownIcon: {
    position: 'absolute',
    right: 12,
    top: '50%',
    marginTop: -8,
  },
  // Date/Time Picker positioned below the entire date/time container with full width
  pickerContainerFullWidth: {
    position: 'absolute',
    top: 220, // Position below the date/time container
    left: 24,
    right: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 8,
    zIndex: 1000,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  pickerTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000000',
  },
  pickerCloseButton: {
    padding: 4,
  },
  modeToggleContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modeToggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    gap: 6,
  },
  modeToggleButtonActive: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  modeToggleText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#374151',
  },
  modeToggleTextActive: {
    color: '#FFFFFF',
  },
  pickerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  pickerButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#000000',
  },
  confirmButton: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  pickerButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
  },
  confirmButtonText: {
    color: '#FFFFFF',
  },
  vehicleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
    gap: 12,
  },
  vehicleOption: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  vehicleOptionSelected: {
    backgroundColor: '#059669',
    borderColor: '#047857',
    shadowColor: '#059669',
    shadowOpacity: 0.2,
  },
  vehicleIconContainer: {
    marginBottom: 10,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vehicleText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  vehicleTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  // Custom bike icon styles
  bikeIcon: {
    width: 28,
    height: 18,
    position: 'relative',
  },
  bikeWheel: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#374151',
    position: 'absolute',
    top: 8,
  },
  bikeWheelRight: {
    right: 0,
  },
  bikeFrame: {
    position: 'absolute',
    top: 11,
    left: 5,
    right: 5,
    height: 2,
    backgroundColor: '#374151',
  },
  // Custom car icon styles
  carIcon: {
    width: 28,
    height: 18,
    position: 'relative',
  },
  carBody: {
    position: 'absolute',
    top: 5,
    left: 2,
    right: 2,
    height: 7,
    backgroundColor: '#374151',
    borderRadius: 3,
  },
  carWindow: {
    position: 'absolute',
    top: 2,
    left: 7,
    right: 7,
    height: 5,
    backgroundColor: '#374151',
    borderRadius: 2,
  },
  carWheel: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#374151',
    position: 'absolute',
    bottom: 0,
    left: 3,
  },
  carWheelRight: {
    right: 3,
    left: 'auto' as any,
  },
  searchButton: {
    backgroundColor: '#059669',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#059669',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  searchButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // Modal and Sliding Menu Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  slideMenu: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: screenWidth * 0.8,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: {
      width: -2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  menuProfileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuProfileIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#059669',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuProfileText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  menuProfileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  closeButton: {
    padding: 8,
  },
  menuContent: {
    flex: 1,
    paddingTop: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuItemIcon: {
    marginRight: 16,
    width: 20,
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
});