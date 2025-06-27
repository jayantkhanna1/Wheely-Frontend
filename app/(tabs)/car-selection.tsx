import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  Modal,
  FlatList,
  Animated,
  Dimensions,
  Alert,
  TouchableWithoutFeedback
} from 'react-native';
import { ArrowLeft, MapPin, ArrowUpDown, Star, X, CreditCard as Edit3, Filter } from 'lucide-react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SlideMenu } from '../../components/SlideMenu';
import { useLocalSearchParams } from 'expo-router';
import { ScreenWrapper } from '../../components/ScreenWrapper';

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

interface BackendLocation {
  id: number;
  address: string;
  street: string;
  colony: string;
  road: string;
  pincode: string;
  city: string;
  state: string;
  country: string;
  google_map_location: string;
  created_at: string;
  updated_at: string;
}

interface BackendVehicle {
  id: number;
  vehicle_name: string;
  vehicle_brand: string;
  vehicle_model: string;
  vehicle_type: string;
  price_per_hour: string;
  price_per_day: string;
  location: BackendLocation;
  owner_name: string;
  rating: number;
  is_available: boolean;
  primary_photo: string;
  seating_capacity: number;
  fuel_type: string;
  year: string;
  transmission?: string;
}

interface Car {
  id: string;
  name: string;
  model: string;
  year: string;
  type: string;
  fuel: string;
  seats: number;
  rating: number;
  distance: string;
  price: number;
  pricePerDay: number; // Added price per day
  image: string;
  features: string[];
  transmission: string; // Added transmission
}

interface FilterOption {
  id: string;
  label: string;
  selected: boolean;
}

interface SortOption {
  id: string;
  label: string;
  selected: boolean;
}

const { width: screenWidth } = Dimensions.get('window');
export default function CarSelectionScreen() {
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [tripStart, setTripStart] = useState(new Date());
  const [tripEnd, setTripEnd] = useState(new Date(Date.now() + 12 * 60 * 60 * 1000));
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const slideAnim = useRef(new Animated.Value(screenWidth)).current;
  const sortSlideAnim = useRef(new Animated.Value(screenWidth)).current;
  const menuSlideAnim = useRef(new Animated.Value(screenWidth)).current;


  const { location, tripStartDate, tripEndDate, tripStartTime, tripEndTime } = useLocalSearchParams();

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

  const [filters, setFilters] = useState<FilterOption[]>([
    { id: 'model2020+', label: 'Model 2020+', selected: true },
    { id: 'rated4.5+', label: '4.5+ Rated', selected: true },
    { id: 'diesel', label: 'Diesel', selected: true },
    { id: 'automatic', label: 'Automatic', selected: false },
    { id: 'luxury', label: 'Luxury', selected: false },
    { id: 'suv', label: 'SUV', selected: false },
    { id: 'sedan', label: 'Sedan', selected: false },
    { id: 'hatchback', label: 'Hatchback', selected: false },
    { id: 'convertible', label: 'Convertible', selected: false },
    { id: 'electric', label: 'Electric', selected: false },
    { id: 'hybrid', label: 'Hybrid', selected: false },
    { id: 'manual', label: 'Manual', selected: false },
  ]);

  const [sortOptions, setSortOptions] = useState<SortOption[]>([
    { id: 'price-low', label: 'Price: Low to High', selected: false },
    { id: 'price-high', label: 'Price: High to Low', selected: false },
    { id: 'rating', label: 'Highest Rated', selected: false },
    { id: 'distance', label: 'Nearest First', selected: true },
    { id: 'newest', label: 'Newest Models', selected: false },
    { id: 'fuel-efficient', label: 'Most Fuel Efficient', selected: false },
    { id: 'popular', label: 'Most Popular', selected: false },
  ]);

  // Function to apply filters and sorting
  const applyFiltersAndSort = (carsList = cars) => {
    let filtered = [...carsList];

    // Apply filters
    const selectedFilters = filters.filter(f => f.selected);

    if (selectedFilters.length > 0) {
      filtered = filtered.filter(car => {
        return selectedFilters.every(filter => {
          switch (filter.id) {
            case 'model2020+':
              return parseInt(car.year) >= 2020;
            case 'rated4.5+':
              return car.rating >= 4.5;
            case 'diesel':
              return car.fuel.toLowerCase() === 'diesel';
            case 'automatic':
              return car.transmission.toLowerCase() === 'automatic';
            case 'manual':
              return car.transmission.toLowerCase() === 'manual';
            case 'luxury':
              return car.price > 600;
            case 'suv':
              return car.type.toLowerCase().includes('suv');
            case 'sedan':
              return car.type.toLowerCase().includes('sedan');
            case 'hatchback':
              return car.type.toLowerCase().includes('hatchback');
            case 'convertible':
              return car.type.toLowerCase().includes('convertible');
            case 'electric':
              return car.fuel.toLowerCase() === 'electric';
            case 'hybrid':
              return car.fuel.toLowerCase() === 'hybrid';
            default:
              return true;
          }
        });
      });
    }

    // Apply sorting
    const selectedSort = sortOptions.find(s => s.selected);
    if (selectedSort) {
      switch (selectedSort.id) {
        case 'price-low':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        case 'distance':
          filtered.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
          break;
        case 'newest':
          filtered.sort((a, b) => parseInt(b.year) - parseInt(a.year));
          break;
        case 'fuel-efficient':
          // Assuming electric > hybrid > petrol > diesel for efficiency
          const fuelPriority = { electric: 4, hybrid: 3, petrol: 2, diesel: 1 };
          filtered.sort((a, b) =>
            (fuelPriority[b.fuel.toLowerCase() as keyof typeof fuelPriority] || 0) -
            (fuelPriority[a.fuel.toLowerCase() as keyof typeof fuelPriority] || 0)
          );
          break;
        case 'popular':
          filtered.sort((a, b) => b.rating - a.rating); // Using rating as popularity metric
          break;
      }
    }

    setFilteredCars(filtered);
  };

  // Update filtered cars when filters or sort options change
  useEffect(() => {
    applyFiltersAndSort();
  }, [filters, sortOptions, cars]);

  const searchVehicles = async () => {
    try {
      // Format dates and times properly for the backend
      const formatDate = (date: Date) => {
        return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
      };

      const formatTime = (date: Date) => {
        return date.toTimeString().split(' ')[0]; // Returns HH:MM:SS
      };

      // Helper function to safely parse date/time from URL params
      const parseUrlDateTime = (dateParam: string | string[] | undefined, timeParam: string | string[] | undefined) => {
        if (!dateParam || !timeParam) return null;

        try {
          // Extract string values from arrays if needed
          const dateString = Array.isArray(dateParam) ? dateParam[0] : dateParam;
          const timeString = Array.isArray(timeParam) ? timeParam[0] : timeParam;

          // Validate date format (should be YYYY-MM-DD)
          const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
          if (!dateRegex.test(dateString)) {
            console.warn('Invalid date format:', dateString);
            return null;
          }

          // Validate time format (should be HH:MM or HH:MM:SS)
          const timeRegex = /^\d{2}:\d{2}(:\d{2})?$/;
          if (!timeRegex.test(timeString)) {
            console.warn('Invalid time format:', timeString);
            return null;
          }

          // Create combined date-time string
          const combinedDateTime = `${dateString}T${timeString}`;
          const parsedDate = new Date(combinedDateTime);

          // Check if the date is valid
          if (isNaN(parsedDate.getTime())) {
            console.warn('Invalid date created from:', combinedDateTime);
            return null;
          }

          return parsedDate;
        } catch (error) {
          console.error('Error parsing date/time:', error);
          return null;
        }
      };

      // Create proper date/time objects
      let startDate, endDate;

      // Try to parse from URL params first
      const urlStartDate = parseUrlDateTime(tripStartDate, tripStartTime);
      const urlEndDate = parseUrlDateTime(tripEndDate, tripEndTime);

      if (urlStartDate && urlEndDate) {
        startDate = urlStartDate;
        endDate = urlEndDate;
        console.log('Using URL params for dates:', { startDate, endDate });
      } else {
        // Fallback to state values
        startDate = tripStart;
        endDate = tripEnd;
        console.log('Using state values for dates:', { startDate, endDate });
      }

      // Validate that we have valid dates
      if (!startDate || !endDate || isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new Error('Invalid start or end date');
      }

      // Validate that start date is before end date
      if (startDate >= endDate) {
        Alert.alert(
          'Invalid Date Range',
          'End date must be after start date. Please check your trip dates.',
          [{ text: 'OK' }]
        );
        return [];
      }

      const formattedStartDate = formatDate(startDate);
      const formattedEndDate = formatDate(endDate);
      const formattedStartTime = formatTime(startDate);
      const formattedEndTime = formatTime(endDate);

      // Build the API URL with properly formatted parameters
      const locationString = Array.isArray(location) ? location[0] : location;

      if (!locationString) {
        Alert.alert(
          'Location Required',
          'Please select a location for your trip.',
          [{ text: 'OK' }]
        );
        return [];
      }

      const apiURL = `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/search/vehicles/?vehicle_type=4_wheeler&location=${encodeURIComponent(locationString)}&start_date=${formattedStartDate}&end_date=${formattedEndDate}&start_time=${formattedStartTime}&end_time=${formattedEndTime}`;

      console.log('API URL:', apiURL);

      const response = await fetch(apiURL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('API Response Status:', response.status);

      if (response.status === 200 || response.status === 201) {
        const backendData = await response.json();
        console.log('API Response Data:', backendData);

        if (backendData && backendData.length > 0) {
          // Transform backend data to match frontend Car interface
          const transformedCars = backendData.map((vehicle: BackendVehicle, index: number) => ({
            id: vehicle.id.toString(),
            name: vehicle.vehicle_brand,
            model: vehicle.vehicle_model,
            year: vehicle.year || 'N/A',
            type: vehicle.vehicle_type === '4_wheeler' ? 'Car' : vehicle.vehicle_type,
            fuel: vehicle.fuel_type.charAt(0).toUpperCase() + vehicle.fuel_type.slice(1),
            seats: vehicle.seating_capacity || 4, // Use actual seating capacity
            rating: vehicle.rating || 0,
            distance: `${((Math.random() * 10) + 1).toFixed(1)} km away`,
            price: parseFloat(vehicle.price_per_hour),
            pricePerDay: parseFloat(vehicle.price_per_day), // Added price per day
            image: vehicle.primary_photo || 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
            transmission: vehicle.transmission || 'Manual', // Use actual transmission type
            features: [
              vehicle.transmission || 'Manual',
              vehicle.fuel_type.charAt(0).toUpperCase() + vehicle.fuel_type.slice(1),
              `${vehicle.seating_capacity || 4} Seats`,
              parseFloat(vehicle.price_per_hour) > 600 ? 'Luxury' : 'Standard'
            ],
            // Additional backend fields
            owner_name: vehicle.owner_name,
            location: vehicle.location,
            is_available: vehicle.is_available
          }));

          console.log('Transformed cars data:', transformedCars);
          return transformedCars;

        } else {
          console.log('No vehicles found');
          Alert.alert(
            'No Results',
            'No vehicles found for your search criteria. Please try different dates or location.',
            [{ text: 'OK' }]
          );
          return [];
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error Response:', errorData);
        Alert.alert(
          'Error',
          errorData.error || errorData.message || `Failed to search vehicles. Status: ${response.status}`,
          [{ text: 'OK' }]
        );
        return [];
      }
    } catch (error) {
      console.error('Network or parsing error:', error);

      // Provide more specific error messages
      let errorMessage = 'Failed to connect to server. Please check your internet connection and try again.';

      if (error instanceof RangeError && (error as Error).message.includes('Date')) {
        errorMessage = 'Invalid date format detected. Please check your trip dates and try again.';
      } else if ((error as Error).message === 'Invalid start or end date') {
        errorMessage = 'Invalid trip dates. Please select valid start and end dates.';
      }

      Alert.alert('Error', errorMessage, [{ text: 'OK' }]);
      return [];
    }
  };

  const renderCarCard = ({ item }: { item: Car }) => (
    <TouchableOpacity style={styles.carCard} onPress={() => handleCarPress(item)}>
      <View style={styles.carImageContainer}>
        <Image source={{ uri: item.image }} style={styles.carImage} />
        <View style={styles.carBadge}>
          <Text style={styles.carBadgeText}>{item.year}</Text>
        </View>
      </View>

      <View style={styles.carInfo}>
        <View style={styles.carHeader}>
          <Text style={styles.carName}>{item.name} {item.model}</Text>
          <View>
            <Text style={styles.carPrice}>₹{item.price}/hr</Text>
            <Text style={styles.carPriceSmall}>₹{item.pricePerDay}/day</Text>
          </View>
        </View>

        <Text style={styles.carModel}>{item.features.join(' • ')}</Text>

        <View style={styles.carDetails}>
          <View style={styles.carDetailItem}>
            <Star size={14} color="#FFA500" fill="#FFA500" />
            <Text style={styles.carDetailText}>{item.rating}</Text>
          </View>

          <View style={styles.carDetailItem}>
            <MapPin size={14} color="#6B7280" />
            <Text style={styles.carDetailText}>{item.distance}</Text>
          </View>
        </View>

        <Text style={styles.carPriceDetail}>₹{(item.price * 0.8).toFixed(0)} excluding taxes</Text>
      </View>
    </TouchableOpacity>
  );

  // Fixed handleSearch function - should update state with vehicle data
  const handleSearch = async () => {
    try {
      const vehicleData = await searchVehicles();
      setCars(vehicleData);
      console.log('Vehicle data set to state:', vehicleData);
    } catch (error) {
      console.error('Error in handleSearch:', error);
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  // Fixed formatDateTime function to handle time parsing correctly
  const formatDateTime = (dateValue: string | string[] | Date, type: 'date' | 'time') => {
    try {
      let date: Date;

      if (dateValue instanceof Date) {
        date = dateValue;
      } else {
        const dateString = Array.isArray(dateValue) ? dateValue[0] : dateValue;

        if (type === 'time') {
          // For time, we need to create a proper date object
          // Assume it's in HH:MM format from URL params
          const timeMatch = dateString.match(/^(\d{2}):(\d{2})(:(\d{2}))?$/);
          if (timeMatch) {
            const today = new Date();
            today.setHours(parseInt(timeMatch[1]), parseInt(timeMatch[2]), parseInt(timeMatch[4] || '0'));
            date = today;
          } else {
            // Try parsing as full date string
            date = new Date(dateString);
          }
        } else {
          date = new Date(dateString);
        }
      }

      if (isNaN(date.getTime())) {
        console.warn('Invalid date:', dateValue);
        return type === 'date' ? 'Invalid Date' : 'Invalid Time';
      }

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
    } catch (error) {
      console.error('Error formatting date/time:', error);
      return type === 'date' ? 'Invalid Date' : 'Invalid Time';
    }
  };

  const openFilters = () => {
    setShowFilters(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeFilters = () => {
    Animated.timing(slideAnim, {
      toValue: screenWidth,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowFilters(false);
    });
  };

  const openSort = () => {
    setShowSort(true);
    Animated.timing(sortSlideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeSort = () => {
    Animated.timing(sortSlideAnim, {
      toValue: screenWidth,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowSort(false);
    });
  };

  const openMenu = () => {
    setShowMenu(true);
    Animated.timing(menuSlideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(menuSlideAnim, {
      toValue: screenWidth,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowMenu(false);
    });
  };

  const toggleFilter = (filterId: string) => {
    setFilters(prev => prev.map(filter =>
      filter.id === filterId
        ? { ...filter, selected: !filter.selected }
        : filter
    ));
  };

  const selectSortOption = (sortId: string) => {
    setSortOptions(prev => prev.map(option => ({
      ...option,
      selected: option.id === sortId
    })));
    closeSort();
  };

  const getSelectedFiltersCount = () => {
    return filters.filter(f => f.selected).length;
  };

  const handleCarPress = (car: Car) => {
    router.push('/car-details');
  };

  const renderFilterOption = ({ item }: { item: FilterOption }) => (
    <TouchableOpacity
      style={[styles.filterOption, item.selected && styles.filterOptionSelected]}
      onPress={() => toggleFilter(item.id)}
    >
      <Text style={[styles.filterOptionText, item.selected && styles.filterOptionTextSelected]}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  const renderSortOption = ({ item }: { item: SortOption }) => (
    <TouchableOpacity
      style={[styles.sortOption, item.selected && styles.sortOptionSelected]}
      onPress={() => selectSortOption(item.id)}
    >
      <Text style={[styles.sortOptionText, item.selected && styles.sortOptionTextSelected]}>
        {item.label}
      </Text>
      {item.selected && (
        <View style={styles.sortSelectedIndicator} />
      )}
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper>
    <SafeAreaView style={styles.container}>
      <View>
        <ScrollView>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color="#000000" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.profileIcon} onPress={openMenu}>
              <Text style={styles.profileText}>{userData?.first_name[0]}{userData?.last_name[0]}</Text>
            </TouchableOpacity>
          </View>

          {/* Trip Details - Editable */}
          <View style={styles.tripDetails}>
            <TouchableOpacity
              style={styles.locationSection}
            >
              <Text style={styles.sectionLabel}>Location</Text>
              <View style={styles.locationRow}>
                <MapPin size={16} color="#059669" />
                <Text style={styles.locationText}>{location}</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.dateTimeSection}>
              <TouchableOpacity style={styles.dateTimeItem}>
                <Text style={styles.dateTimeLabel}>{formatDateTime(tripStartDate, 'date')}</Text>
                <Text style={styles.dateTimeValue}>{tripStartTime}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.dateTimeItem}>
                <Text style={styles.dateTimeLabel}>{formatDateTime(tripEndDate, 'date')}</Text>
                <Text style={styles.dateTimeValue}>{tripEndTime}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>DAILY RIDE</Text>
            <Text style={styles.subtitle}>Everyday booking made quick and easy!</Text>
          </View>

          {/* Filter and Sort Bar - Scrollable */}
          <View style={styles.filterBar}>
            <TouchableOpacity style={styles.filterButton} onPress={openFilters}>
              <Filter size={16} color="#059669" />
              <Text style={styles.filterButtonText}>Filters</Text>
              {getSelectedFiltersCount() > 0 && (
                <View style={styles.filterBadge}>
                  <Text style={styles.filterBadgeText}>{getSelectedFiltersCount()}</Text>
                </View>
              )}
            </TouchableOpacity>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filterTagsContainer}
              contentContainerStyle={styles.filterTagsContent}
            >
              {filters.filter(f => f.selected).map(filter => (
                <View key={filter.id} style={styles.filterTag}>
                  <Text style={styles.filterTagText}>{filter.label}</Text>
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity style={styles.sortButton} onPress={openSort}>
              <ArrowUpDown size={16} color="#059669" />
              <Text style={styles.sortButtonText}>Sort</Text>
            </TouchableOpacity>
          </View>

          {/* Car List - Scrollable Daily Ride Section */}
          <FlatList
            data={cars}
            renderItem={renderCarCard}
            keyExtractor={(item) => item.id}
            style={styles.carList}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.carListContent}
          />

          {/* Filters Modal - Scrollable */}
          <Modal
            visible={showFilters}
            transparent={true}
            animationType="none"
            onRequestClose={closeFilters}
          >
            <TouchableWithoutFeedback onPress={closeFilters}>
              <View style={styles.modalOverlay}>
                <TouchableWithoutFeedback>
                  <Animated.View
                    style={[
                      styles.filterModal,
                      { transform: [{ translateX: slideAnim }] }
                    ]}
                  >
                    <View style={styles.modalHeader}>
                      <Text style={styles.modalTitle}>Filters</Text>
                      <TouchableOpacity onPress={closeFilters}>
                        <X size={24} color="#000000" />
                      </TouchableOpacity>
                    </View>

                    <FlatList
                      data={filters}
                      renderItem={renderFilterOption}
                      keyExtractor={(item) => item.id}
                      style={styles.filterList}
                      showsVerticalScrollIndicator={false}
                    />

                    <View style={styles.modalFooter}>
                      <TouchableOpacity style={styles.applyButton} onPress={closeFilters}>
                        <Text style={styles.applyButtonText}>Apply Filters</Text>
                      </TouchableOpacity>
                    </View>
                  </Animated.View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>

          {/* Sort Modal - Scrollable */}
          <Modal
            visible={showSort}
            transparent={true}
            animationType="none"
            onRequestClose={closeSort}
          >
            <TouchableWithoutFeedback onPress={closeSort}>
              <View style={styles.modalOverlay}>
                <TouchableWithoutFeedback>
                  <Animated.View
                    style={[
                      styles.sortModal,
                      { transform: [{ translateX: sortSlideAnim }] }
                    ]}
                  >
                    <View style={styles.modalHeader}>
                      <Text style={styles.modalTitle}>Sort By</Text>
                      <TouchableOpacity onPress={closeSort}>
                        <X size={24} color="#000000" />
                      </TouchableOpacity>
                    </View>

                    <FlatList
                      data={sortOptions}
                      renderItem={renderSortOption}
                      keyExtractor={(item) => item.id}
                      style={styles.sortList}
                      showsVerticalScrollIndicator={false}
                    />
                  </Animated.View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>

          <SlideMenu
            visible={showMenu}
            onClose={closeMenu}
            userData={userData}
            setUserData={setUserData}
          />
        </ScrollView>
      </View>
      
    </SafeAreaView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
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
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  tripDetails: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  locationSection: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  dateTimeSection: {
    flexDirection: 'row',
    gap: 16,
  },
  dateTimeItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    position: 'relative',
  },
  dateTimeLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 4,
  },
  dateTimeValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  editIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#059669',
    letterSpacing: 2,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#059669',
    gap: 6,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#059669',
  },
  filterBadge: {
    backgroundColor: '#059669',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  filterBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  filterTagsContainer: {
    flex: 1,
  },
  filterTagsContent: {
    paddingRight: 12,
  },
  filterTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#E0F2FE',
    borderRadius: 12,
    marginRight: 8,
  },
  filterTagText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#0369A1',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#059669',
    gap: 6,
  },
  sortButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#059669',
  },
  carList: {
    flex: 1,
  },
  carListContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  carCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  carImageContainer: {
    position: 'relative',
  },
  carImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  carBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  carBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  carInfo: {
    padding: 16,
  },
  carHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  carName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    flex: 1,
  },
  carPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#059669',
  },
  carPriceSmall: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#059668b4',
  },
  carModel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  carDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 8,
  },
  carDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  carDetailText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  carPriceDetail: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  pickerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    margin: 20,
    maxHeight: '80%',
    width: '90%',
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  modeToggleContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  modeToggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    gap: 8,
  },
  modeToggleButtonActive: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  modeToggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  modeToggleTextActive: {
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  locationEditModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    margin: 20,
    marginTop: 100,
  },
  locationEditContent: {
    padding: 20,
  },
  locationEditInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    marginBottom: 20,
  },
  locationEditButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#059669',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  filterModal: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: screenWidth * 0.85,
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
  sortModal: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: screenWidth * 0.75,
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
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  filterList: {
    flex: 1,
    paddingTop: 20,
  },
  sortList: {
    flex: 1,
    paddingTop: 20,
  },
  filterOption: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  filterOptionSelected: {
    backgroundColor: '#F0FDF4',
  },
  filterOptionText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  filterOptionTextSelected: {
    color: '#059669',
    fontWeight: '600',
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  sortOptionSelected: {
    backgroundColor: '#F0FDF4',
  },
  sortOptionText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  sortOptionTextSelected: {
    color: '#059669',
    fontWeight: '600',
  },
  sortSelectedIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#059669',
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  applyButton: {
    backgroundColor: '#059669',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
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