import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, SafeAreaView } from 'react-native';
import { Search, MapPin, Mic, Calendar, Clock, Bike } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform } from 'react-native';

interface VehicleOption {
  id: string;
  name: string;
  icon: React.ReactNode;
}

export default function HomeScreen() {
  const [location, setLocation] = useState('');
  const [tripStart, setTripStart] = useState(new Date());
  const [tripEnd, setTripEnd] = useState(new Date(Date.now() + 12 * 60 * 60 * 1000)); // 12 hours later
  const [selectedVehicle, setSelectedVehicle] = useState<string>('bicycle');
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [startPickerMode, setStartPickerMode] = useState<'date' | 'time'>('date');
  const [endPickerMode, setEndPickerMode] = useState<'date' | 'time'>('date');

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
          <View style={styles.bikeWheel} />
          <View style={[styles.bikeWheel, styles.bikeWheelRight]} />
          <View style={styles.bikeFrame} />
        </View>
      )
    },
    {
      id: 'car',
      name: 'Car',
      icon: (
        <View style={styles.carIcon}>
          <View style={styles.carBody} />
          <View style={styles.carWindow} />
          <View style={styles.carWheel} />
          <View style={[styles.carWheel, styles.carWheelRight]} />
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
    console.log('Search initiated with:', {
      location,
      tripStart,
      tripEnd,
      selectedVehicle
    });
    // Here you would typically navigate to search results or make an API call
  };

  const getUserInitials = () => {
    // This would typically come from user data
    return 'AV'; // Ananya's initials as shown in the design
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
          <View style={styles.profileIcon}>
            <Text style={styles.profileText}>{getUserInitials()}</Text>
          </View>
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
            <TouchableOpacity style={styles.locationButton}>
              <MapPin size={20} color="#6B7280" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.micButton}>
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
    color: '#111827',
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
});