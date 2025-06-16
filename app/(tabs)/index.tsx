import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, SafeAreaView, Animated, Dimensions, Modal, TouchableWithoutFeedback } from 'react-native';
import { Search, MapPin, Mic, Calendar, Clock, Bike, X, User, Map as MapIcon, Phone, Gift, Percent, CircleHelp as HelpCircle, FileText, Globe } from 'lucide-react-native';
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
  const slideAnim = useRef(new Animated.Value(screenWidth)).current;

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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
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
              onChangeText={setLocation}
              placeholder="Location"
              placeholderTextColor="#9CA3AF"
            />
            <TouchableOpacity style={styles.locationButton} onPress={handleLocationPress}>
              <MapPin size={20} color="#6B7280" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.micButton} onPress={handleMicPress}>
              <Mic size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Date and Time Selection */}
        <View style={styles.dateTimeContainer}>
          <View style={styles.dateTimeSection}>
            <Text style={styles.dateTimeLabel}>Trip Start</Text>
            <View style={styles.dateTimeRow}>
              <TouchableOpacity 
                style={styles.dateTimeButton}
                onPress={() => {
                  setStartPickerMode('date');
                  setShowStartPicker(true);
                }}
              >
                <Text style={styles.dateTimeText}>
                  {formatDateTime(tripStart, 'date')}, {formatDateTime(tripStart, 'time')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.dateTimeSection}>
            <Text style={styles.dateTimeLabel}>Trip End</Text>
            <View style={styles.dateTimeRow}>
              <TouchableOpacity 
                style={styles.dateTimeButton}
                onPress={() => {
                  setEndPickerMode('date');
                  setShowEndPicker(true);
                }}
              >
                <Text style={styles.dateTimeText}>
                  {formatDateTime(tripEnd, 'date')}, {formatDateTime(tripEnd, 'time')}
                </Text>
              </TouchableOpacity>
            </View>
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
      </ScrollView>

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

                <ScrollView style={styles.menuContent} showsVerticalScrollIndicator={false}>
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
                </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
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
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 8,
  },
  dateTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateTimeButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  dateTimeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000', // Changed to black for better visibility
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