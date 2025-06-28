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
import { ArrowLeft, MapPin, Calendar, Clock, Filter, ArrowUpDown, Star, Fuel, Users, Settings, X, ChevronDown, ChevronUp, User, Map as MapIcon, Phone, Gift, Percent, CircleHelp as HelpCircle, FileText, Globe, CreditCard as Edit3 } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SlideMenu } from '../../components/SlideMenu';
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

interface Bike {
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
  pricePerDay: number;
  image: string;
  features: string[];
  transmission: string;
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

export default function BikeSelectionScreen() {
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [filteredBikes, setFilteredBikes] = useState<Bike[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(false);

  const slideAnim = useRef(new Animated.Value(screenWidth)).current;
  const sortSlideAnim = useRef(new Animated.Value(screenWidth)).current;
  const menuSlideAnim = useRef(new Animated.Value(screenWidth)).current;

  // Get search parameters from URL
  const { 
    location, 
    tripStartDate, 
    tripEndDate, 
    tripStartTime, 
    tripEndTime 
  } = useLocalSearchParams();

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
    { id: 'petrol', label: 'Petrol', selected: true },
    { id: 'automatic', label: 'Automatic', selected: false },
    { id: 'scooter', label: 'Scooter', selected: false },
    { id: 'motorcycle', label: 'Motorcycle', selected: false },
    { id: 'sport', label: 'Sport', selected: false },
    { id: 'cruiser', label: 'Cruiser', selected: false },
    { id: 'commuter', label: 'Commuter', selected: false },
    { id: 'premium', label: 'Premium', selected: false },
    { id: 'electric', label: 'Electric', selected: false },
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
  const applyFiltersAndSort = (bikesList = bikes) => {
    let filtered = [...bikesList];

    // Apply filters
    const selectedFilters = filters.filter(f => f.selected);

    if (selectedFilters.length > 0) {
      filtered = filtered.filter(bike => {
        return selectedFilters.every(filter => {
          switch (filter.id) {
            case 'model2020+':
              return parseInt(bike.year) >= 2020;
            case 'rated4.5+':
              return bike.rating >= 4.5;
            case 'petrol':
              return bike.fuel.toLowerCase() === 'petrol';
            case 'automatic':
              return bike.transmission.toLowerCase() === 'automatic';
            case 'manual':
              return bike.transmission.toLowerCase() === 'manual';
            case 'scooter':
              return bike.type.toLowerCase().includes('scooter');
            case 'motorcycle':
              return bike.type.toLowerCase().includes('motorcycle');
            case 'sport':
              return bike.features.some(f => f.toLowerCase().includes('sport'));
            case 'cruiser':
              return bike.features.some(f => f.toLowerCase().includes('cruiser'));
            case 'commuter':
              return bike.features.some(f => f.toLowerCase().includes('commuter'));
            case 'premium':
              return bike.price > 100;
            case 'electric':
              return bike.fuel.toLowerCase() === 'electric';
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

    setFilteredBikes(filtered);
  };

  // Update filtered bikes when filters or sort options change
  useEffect(() => {
    applyFiltersAndSort();
  }, [filters, sortOptions, bikes]);

  const searchVehicles = async () => {
    try {
      setLoading(true);
      
      // Parse and validate the date and time parameters from URL
      const parseDateTimeParam = (dateParam: string | string[] | undefined, timeParam: string | string[] | undefined): string | null => {
        if (!dateParam || !timeParam) {
          console.warn('Missing date or time parameter');
          return null;
        }

        try {
          // Extract string values
          const dateStr = Array.isArray(dateParam) ? dateParam[0] : dateParam;
          const timeStr = Array.isArray(timeParam) ? timeParam[0] : timeParam;
          
          // Create a combined date-time string in ISO format
          // First, ensure the date is in ISO format (YYYY-MM-DD)
          let formattedDate = dateStr;
          if (dateStr.includes('T')) {
            // If it's a full ISO string, extract just the date part
            formattedDate = dateStr.split('T')[0];
          }
          
          // Format the time (ensure it has seconds)
          let formattedTime = timeStr;
          if (!formattedTime.includes(':')) {
            console.warn('Invalid time format:', timeStr);
            return null;
          }
          
          // If time doesn't have seconds, add them
          if ((formattedTime.match(/:/g) || []).length === 1) {
            formattedTime = `${formattedTime}:00`;
          }
          
          // Remove any AM/PM indicators and convert to 24-hour format if needed
          if (formattedTime.toLowerCase().includes('am') || formattedTime.toLowerCase().includes('pm')) {
            // Parse time with AM/PM
            const timeParts = formattedTime.match(/(\d+):(\d+)(?::(\d+))?\s*(am|pm)/i);
            if (timeParts) {
              let hours = parseInt(timeParts[1], 10);
              const minutes = parseInt(timeParts[2], 10);
              const seconds = timeParts[3] ? parseInt(timeParts[3], 10) : 0;
              const period = timeParts[4].toLowerCase();
              
              // Convert to 24-hour format
              if (period === 'pm' && hours < 12) hours += 12;
              if (period === 'am' && hours === 12) hours = 0;
              
              formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
          }
          
          // Combine date and time
          return `${formattedDate}T${formattedTime}`;
        } catch (error) {
          console.error('Error parsing date/time:', error);
          return null;
        }
      };

      // Format dates for API request
      const formatDateForAPI = (dateTimeStr: string | null): { date: string, time: string } | null => {
        if (!dateTimeStr) return null;
        
        try {
          const date = new Date(dateTimeStr);
          if (isNaN(date.getTime())) {
            console.warn('Invalid date created from:', dateTimeStr);
            return null;
          }
          
          // Format date as YYYY-MM-DD
          const formattedDate = date.toISOString().split('T')[0];
          
          // Format time as HH:MM:SS
          const hours = date.getHours().toString().padStart(2, '0');
          const minutes = date.getMinutes().toString().padStart(2, '0');
          const seconds = date.getSeconds().toString().padStart(2, '0');
          const formattedTime = `${hours}:${minutes}:${seconds}`;
          
          return { date: formattedDate, time: formattedTime };
        } catch (error) {
          console.error('Error formatting date for API:', error);
          return null;
        }
      };

      // Parse start and end date/time from URL parameters
      const startDateTime = parseDateTimeParam(tripStartDate, tripStartTime);
      const endDateTime = parseDateTimeParam(tripEndDate, tripEndTime);
      
      console.log('Parsed start date/time:', startDateTime);
      console.log('Parsed end date/time:', endDateTime);
      
      if (!startDateTime || !endDateTime) {
        throw new Error('Invalid date/time parameters');
      }
      
      // Format for API
      const formattedStart = formatDateForAPI(startDateTime);
      const formattedEnd = formatDateForAPI(endDateTime);
      
      if (!formattedStart || !formattedEnd) {
        throw new Error('Failed to format date/time for API');
      }

      // Validate that start date is before end date
      const startDate = new Date(startDateTime);
      const endDate = new Date(endDateTime);
      
      if (startDate >= endDate) {
        Alert.alert(
          'Invalid Date Range',
          'End date must be after start date. Please check your trip dates.',
          [{ text: 'OK' }]
        );
        return [];
      }

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

      // Use 2_wheeler for bikes
      const apiURL = `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/search/vehicles/?vehicle_type=2_wheeler&location=${encodeURIComponent(locationString)}&start_date=${formattedStart.date}&end_date=${formattedEnd.date}&start_time=${formattedStart.time}&end_time=${formattedEnd.time}`;

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
          // Transform backend data to match frontend Bike interface
          const transformedBikes = backendData.map((vehicle: BackendVehicle, index: number) => ({
            id: vehicle.id.toString(),
            name: vehicle.vehicle_brand,
            model: vehicle.vehicle_model,
            year: vehicle.year || 'N/A',
            type: vehicle.vehicle_type === '2_wheeler' ? 'Bike' : vehicle.vehicle_type,
            fuel: vehicle.fuel_type.charAt(0).toUpperCase() + vehicle.fuel_type.slice(1),
            seats: vehicle.seating_capacity || 2, // Most bikes have 2 seats
            rating: vehicle.rating || 0,
            distance: `${((Math.random() * 10) + 1).toFixed(1)} km away`,
            price: parseFloat(vehicle.price_per_hour),
            pricePerDay: parseFloat(vehicle.price_per_day),
            image: vehicle.primary_photo || 'https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
            transmission: vehicle.transmission || 'Manual',
            features: [
              vehicle.transmission || 'Manual',
              vehicle.fuel_type.charAt(0).toUpperCase() + vehicle.fuel_type.slice(1),
              `${vehicle.seating_capacity || 2} Seats`,
              parseFloat(vehicle.price_per_hour) > 100 ? 'Premium' : 'Standard'
            ],
            // Additional backend fields
            owner_name: vehicle.owner_name,
            location: vehicle.location,
            is_available: vehicle.is_available
          }));

          console.log('Transformed bikes data:', transformedBikes);
          return transformedBikes;

        } else {
          console.log('No vehicles found');
          Alert.alert(
            'No Results',
            'No bikes found for your search criteria. Please try different dates or location.',
            [{ text: 'OK' }]
          );
          return [];
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error Response:', errorData);
        Alert.alert(
          'Error',
          errorData.error || errorData.message || `Failed to search bikes. Status: ${response.status}`,
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
    } finally {
      setLoading(false);
    }
  };

  const renderBikeCard = ({ item }: { item: Bike }) => (
    <TouchableOpacity style={styles.bikeCard} onPress={() => handleBikePress(item)}>
      <View style={styles.bikeImageContainer}>
        <Image source={{ uri: item.image }} style={styles.bikeImage} />
        <View style={styles.bikeBadge}>
          <Text style={styles.bikeBadgeText}>{item.year}</Text>
        </View>
      </View>
      
      <View style={styles.bikeInfo}>
        <View style={styles.bikeHeader}>
          <Text style={styles.bikeName}>{item.name} {item.model}</Text>
          <View>
            <Text style={styles.bikePrice}>₹{item.price}/hr</Text>
            <Text style={styles.bikePriceSmall}>₹{item.pricePerDay}/day</Text>
          </View>
        </View>
        
        <Text style={styles.bikeModel}>{item.features.join(' • ')}</Text>
        
        <View style={styles.bikeDetails}>
          <View style={styles.bikeDetailItem}>
            <MapPin size={14} color="#6B7280" />
            <Text style={styles.bikeDetailText}>{item.distance}</Text>
          </View>
        </View>
        
        <Text style={styles.bikePriceDetail}>₹{(item.price * 0.8).toFixed(0)} excluding taxes</Text>
      </View>
    </TouchableOpacity>
  );

  // Fixed handleSearch function - should update state with vehicle data
  const handleSearch = async () => {
    try {
      const vehicleData = await searchVehicles();
      setBikes(vehicleData);
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

  const handleBikePress = (bike: Bike) => {
    router.push({
      pathname: '/bike-details',
      params: { 
        vehicleId: bike.id,
        location: location,
        tripStartDate: tripStartDate,
        tripEndDate: tripEndDate,
        tripStartTime: tripStartTime,
        tripEndTime: tripEndTime
      }
    });
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
        <ScrollView>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color="#000000" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.profileIcon} onPress={openMenu}>
              <Text style={styles.profileText}>{userData?.first_name?.[0]}{userData?.last_name?.[0]}</Text>
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
            <Text style={styles.title}>BIKE RIDE</Text>
            <Text style={styles.subtitle}>Quick and convenient bike rentals!</Text>
          </View>

          {/* Filter and Sort Bar */}
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

            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filterTagsContainer}
              contentContainerStyle={styles.filterTagsContent}
              data={filters.filter(f => f.selected)}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.filterTag}>
                  <Text style={styles.filterTagText}>{item.label}</Text>
                </View>
              )}
            />

            <TouchableOpacity style={styles.sortButton} onPress={openSort}>
              <ArrowUpDown size={16} color="#059669" />
              <Text style={styles.sortButtonText}>Sort</Text>
            </TouchableOpacity>
          </View>

          {/* Bike List */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading bikes...</Text>
            </View>
          ) : bikes.length > 0 ? (
            <View style={styles.bikeListContainer}>
              {bikes.map((bike) => (
                <View key={bike.id}>
                  {renderBikeCard({ item: bike })}
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>No bikes found for your search criteria.</Text>
              <Text style={styles.noResultsSubtext}>Try adjusting your filters or search parameters.</Text>
            </View>
          )}
        </ScrollView>

        {/* Filters Modal */}
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

        {/* Sort Modal */}
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
  bikeListContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  bikeCard: {
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
  bikeImageContainer: {
    position: 'relative',
  },
  bikeImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  bikeBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  bikeBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  bikeInfo: {
    padding: 16,
  },
  bikeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bikeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    flex: 1,
  },
  bikePrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#059669',
  },
  bikePriceSmall: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#059668b4',
    textAlign: 'right',
  },
  bikeModel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  bikeDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 8,
  },
  bikeDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  bikeDetailText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  bikePriceDetail: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  noResultsContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    textAlign: 'center',
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
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