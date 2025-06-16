import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, SafeAreaView, Animated, Dimensions, Modal, TouchableWithoutFeedback, FlatList } from 'react-native';
import { Search, MapPin, Mic, Calendar, Clock, Bike, X, User, Map as MapIcon, Phone, Gift, Percent, CircleHelp as HelpCircle, FileText, Globe, ChevronDown } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform } from 'react-native';

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

  // Sample location suggestions
  const locationSuggestions: LocationSuggestion[] = [
    { id: '1', name: 'Airport Terminal 1', address: 'International Airport, Delhi', type: 'popular' },
    { id: '2', name: 'Connaught Place', address: 'Central Delhi, New Delhi', type: 'popular' },
    { id: '3', name: 'India Gate', address: 'Rajpath, New Delhi', type: 'popular' },
    { id: '4', name: 'Red Fort', address: 'Netaji Subhash Marg, Delhi', type: 'popular' },
    { id: '5', name: 'Lotus Temple', address: 'Bahapur, New Delhi', type: 'recent' },
    { id: '6', name: 'Qutub Minar', address: 'Mehrauli, New Delhi', type: 'recent' },
    { id: '7', name: 'Akshardham Temple', address: 'Noida Mor, Delhi', type: 'nearby' },
    { id: '8', name: 'Humayun Tomb', address: 'Mathura Road, Delhi', type: 'nearby' },
  ];

  const filteredSuggestions = locationSuggestions.filter(suggestion =>
    suggestion.name.toLowerCase().includes(location.toLowerCase()) ||
    suggestion.address.toLowerCase().includes(location.toLowerCase())
  );

  const vehicleOptions: VehicleOption[] = [
    {
      id: 'bicycle',
      name: 'Bicycle',
      icon: <Bike size={32} color={selectedVehicle === 'bicycle' ? '#FFFFFF' : '#374151'} strokeWidth={1.5} />
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

  const menuItems: MenuItem[] = [
    {
      id: 'trips',
      title: 'My Trips',
      icon: <MapIcon size={24} color="#374151" />,
      onPress: () => console.log('My Trips pressed')
    },
    {
      id: 'contact',
      title: 'Contact Us',
      icon: <Phone size={24} color="#374151" />,
      onPress: () => console.log('Contact Us pressed')
    },
    {
      id: 'profile',
      title: 'My Profile',
      icon: <User size={24} color="#374151" />,
      onPress: () => console.log('My Profile pressed')
    },
    {
      id: 'rewards',
      title: 'Rewards',
      icon: <Gift size={24} color="#374151" />,
      onPress: () => console.log('Rewards pressed')
    },
    {
      id: 'offers',
      title: 'Offers',
      icon: <Percent size={24} color="#374151" />,
      onPress: () => console.log('Offers pressed')
    },
    {
      id: 'helpline',
      title: 'Helpline Support',
      icon: <HelpCircle size={24} color="#374151" />,
      onPress: () => console.log('Helpline Support pressed')
    },
    {
      id: 'policies',
      title: 'Policies',
      icon: <FileText size={24} color="#374151" />,
      onPress: () => console.log('Policies pressed')
    },
    {
      id: 'language',
      title: 'Language',
      icon: <Globe size={24} color="#374151" />,
      onPress: () => console.log('Language pressed')
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

  const handleDateTimeChange = (event: any, selectedDate?: Date, type: 'start' | 'end', mode: 'date' | 'time') => {
    if (Platform.OS === 'android') {
      setShowStartPicker(false);
      setShowEndPicker(false);
    }

    if (selectedDate) {
      if (type === 'start') {
        if (mode === 'date') {
          const newDate = new Date(tripStart);
          newDate.setFullYear(selectedDate.getFullYear());
          newDate.setMonth(selectedDate.getMonth());
          newDate.setDate(selectedDate.getDate());
          setTripStart(newDate);
        } else {
          const newDate = new Date(tripStart);
          newDate.setHours(selectedDate.getHours());
          newDate.setMinutes(selectedDate.getMinutes());
          setTripStart(newDate);
        }
      } else {
        if (mode === 'date') {
          const newDate = new Date(tripEnd);
          newDate.setFullYear(selectedDate.getFullYear());
          newDate.setMonth(selectedDate.getMonth());
          newDate.setDate(selectedDate.getDate());
          setTripEnd(newDate);
        } else {
          const newDate = new Date(tripEnd);
          newDate.setHours(selectedDate.getHours());
          newDate.setMinutes(selectedDate.getMinutes());
          setTripEnd(newDate);
        }
      }
    }
  };

  const handleSearch = () => {
    if (!selectedVehicle) {
      alert('Please select a vehicle type');
      return;
    }
    if (!location.trim()) {
      alert('Please enter a location');
      return;
    }
    
    console.log('Search initiated with:', {
      location,
      tripStart,
      tripEnd,
      selectedVehicle
    });
    // Here you would typically navigate to search results or make an API call
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

  const getUserInitials = () => {
    return 'AV'; // Ananya's initials as shown in the design
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

  const handleStartDateTimePress = () => {
    setStartPickerMode('date');
    if (Platform.OS !== 'web') {
      setShowStartPicker(true);
    }
  };

  const handleEndDateTimePress = () => {
    setEndPickerMode('date');
    if (Platform.OS !== 'web') {
      setShowEndPicker(true);
    }
  };

  const renderLocationSuggestion = ({ item }: { item: LocationSuggestion }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => handleLocationSuggestionPress(item)}
    >
      <View style={styles.suggestionIcon}>
        <MapPin size={16} color="#6B7280" />
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
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello, Ananya!!</Text>
          <TouchableOpacity style={styles.profileIcon} onPress={openMenu}>
            <Text style={styles.profileText}>{getUserInitials()}</Text>
          </TouchableOpacity>
        </View>

        {/* Location Search */}
        <View style={styles.locationContainer}>
          <View style={styles.locationInputContainer}>
            <Search size={20} color="#6B7280" style={styles.searchIcon} />
            <TextInput
              style={styles.locationInput}
              value={location}
              onChangeText={handleLocationChange}
              placeholder="Location"
              placeholderTextColor="#9CA3AF"
              onFocus={() => setShowLocationSuggestions(location.length > 0)}
            />
            <TouchableOpacity style={styles.locationButton} onPress={handleLocationPress}>
              <MapPin size={20} color="#6B7280" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.micButton} onPress={handleMicPress}>
              <Mic size={20} color="#6B7280" />
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
              <ChevronDown size={20} color="#000000" style={styles.dropdownIcon} />
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
              <ChevronDown size={20} color="#000000" style={styles.dropdownIcon} />
            </TouchableOpacity>
          </View>
        </View>

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

        {/* Date/Time Pickers */}
        {showStartPicker && Platform.OS !== 'web' && (
          <DateTimePicker
            value={tripStart}
            mode={startPickerMode}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, date) => handleDateTimeChange(event, date, 'start', startPickerMode)}
            minimumDate={new Date()}
          />
        )}

        {showEndPicker && Platform.OS !== 'web' && (
          <DateTimePicker
            value={tripEnd}
            mode={endPickerMode}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, date) => handleDateTimeChange(event, date, 'end', endPickerMode)}
            minimumDate={tripStart}
          />
        )}
      </View>

      {/* Sliding Menu Modal */}
      <Modal
        visible={showMenu}
        transparent={true}
        animationType="none"
        onRequestClose={closeMenu}
      >
        <TouchableWithoutFeedback onPress={closeMenu}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <Animated.View 
                style={[
                  styles.slideMenu,
                  {
                    transform: [{ translateX: slideAnim }]
                  }
                ]}
              >
                <View style={styles.menuHeader}>
                  <View style={styles.menuProfileSection}>
                    <View style={styles.menuProfileIcon}>
                      <Text style={styles.menuProfileText}>{getUserInitials()}</Text>
                    </View>
                    <Text style={styles.menuProfileName}>Ananya</Text>
                  </View>
                  <TouchableOpacity style={styles.closeButton} onPress={closeMenu}>
                    <X size={24} color="#374151" />
                  </TouchableOpacity>
                </View>

                <View style={styles.menuContent}>
                  {menuItems.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.menuItem}
                      onPress={() => handleMenuItemPress(item)}
                    >
                      <View style={styles.menuItemIcon}>
                        {item.icon}
                      </View>
                      <Text style={styles.menuItemText}>{item.title}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  profileIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#059669',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileText: {
    fontSize: 16,
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
    fontSize: 16,
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
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  suggestionAddress: {
    fontSize: 14,
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
    fontSize: 12,
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
  },
  dateTimeLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 4,
  },
  dateTimeDropdownNew: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    position: 'relative',
    minHeight: 60,
    justifyContent: 'center',
  },
  dateTimeValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginTop: 2,
  },
  dropdownIcon: {
    position: 'absolute',
    right: 16,
    top: '50%',
    marginTop: -10,
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
    paddingVertical: 24,
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
    marginBottom: 12,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vehicleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  vehicleTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  // Custom bike icon styles
  bikeIcon: {
    width: 32,
    height: 20,
    position: 'relative',
  },
  bikeWheel: {
    width: 12,
    height: 12,
    borderRadius: 6,
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
    top: 12,
    left: 6,
    right: 6,
    height: 2,
    backgroundColor: '#374151',
  },
  // Custom car icon styles
  carIcon: {
    width: 32,
    height: 20,
    position: 'relative',
  },
  carBody: {
    position: 'absolute',
    top: 6,
    left: 2,
    right: 2,
    height: 8,
    backgroundColor: '#374151',
    borderRadius: 4,
  },
  carWindow: {
    position: 'absolute',
    top: 2,
    left: 8,
    right: 8,
    height: 6,
    backgroundColor: '#374151',
    borderRadius: 2,
  },
  carWheel: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#374151',
    position: 'absolute',
    bottom: 0,
    left: 4,
  },
  carWheelRight: {
    right: 4,
    left: 'auto' as any,
  },
  searchButton: {
    backgroundColor: '#059669',
    borderRadius: 16,
    paddingVertical: 20,
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
    fontSize: 18,
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#059669',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuProfileText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  menuProfileName: {
    fontSize: 18,
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
    width: 24,
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
});