import React, { useState, useRef } from 'react';
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
  TextInput,
  TouchableWithoutFeedback
} from 'react-native';
import { ArrowLeft, MapPin, Calendar, Clock, Filter, ArrowUpDown, Star, Fuel, Users, Settings, X, ChevronDown, ChevronUp, User, Map as MapIcon, Phone, Gift, Percent, CircleHelp as HelpCircle, FileText, Globe, CreditCard as Edit3 } from 'lucide-react-native';
import { router } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform } from 'react-native';

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
  image: string;
  features: string[];
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

interface MenuItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  onPress: () => void;
}

const { width: screenWidth } = Dimensions.get('window');

export default function CarSelectionScreen() {
  const [location, setLocation] = useState('Saket Colony, Delhi');
  const [tripStart, setTripStart] = useState(new Date());
  const [tripEnd, setTripEnd] = useState(new Date(Date.now() + 12 * 60 * 60 * 1000));
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [showLocationEdit, setShowLocationEdit] = useState(false);
  const [showDateTimeEdit, setShowDateTimeEdit] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [startPickerMode, setStartPickerMode] = useState<'date' | 'time'>('date');
  const [endPickerMode, setEndPickerMode] = useState<'date' | 'time'>('date');
  const [editingField, setEditingField] = useState<'start' | 'end' | null>(null);
  const [tempLocation, setTempLocation] = useState(location);
  const [showMenu, setShowMenu] = useState(false);

  const slideAnim = useRef(new Animated.Value(screenWidth)).current;
  const sortSlideAnim = useRef(new Animated.Value(screenWidth)).current;
  const menuSlideAnim = useRef(new Animated.Value(screenWidth)).current;

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

  const cars: Car[] = [
    {
      id: '1',
      name: 'Lamborghini',
      model: 'Aventador',
      year: '2020',
      type: 'Sports Car',
      fuel: 'Petrol',
      seats: 2,
      rating: 4.8,
      distance: '4.4 km away',
      price: 590,
      image: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
      features: ['Automatic', 'Petrol', '2 Seats', 'Luxury']
    },
    {
      id: '2',
      name: 'Mercedes-Benz',
      model: 'AMG GT',
      year: '2021',
      type: 'Sports Car',
      fuel: 'Petrol',
      seats: 2,
      rating: 4.7,
      distance: '3.2 km away',
      price: 650,
      image: 'https://images.pexels.com/photos/3764984/pexels-photo-3764984.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
      features: ['Automatic', 'Petrol', '2 Seats', 'Luxury']
    },
    {
      id: '3',
      name: 'BMW',
      model: 'M4 Competition',
      year: '2022',
      type: 'Sports Car',
      fuel: 'Petrol',
      seats: 4,
      rating: 4.6,
      distance: '5.1 km away',
      price: 580,
      image: 'https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
      features: ['Automatic', 'Petrol', '4 Seats', 'Sports']
    },
    {
      id: '4',
      name: 'Aston Martin',
      model: 'Vantage',
      year: '2021',
      type: 'Sports Car',
      fuel: 'Petrol',
      seats: 2,
      rating: 4.9,
      distance: '6.8 km away',
      price: 720,
      image: 'https://images.pexels.com/photos/3764984/pexels-photo-3764984.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
      features: ['Automatic', 'Petrol', '2 Seats', 'Luxury']
    },
    {
      id: '5',
      name: 'Ferrari',
      model: 'F8 Tributo',
      year: '2023',
      type: 'Sports Car',
      fuel: 'Petrol',
      seats: 2,
      rating: 4.9,
      distance: '7.2 km away',
      price: 850,
      image: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
      features: ['Automatic', 'Petrol', '2 Seats', 'Luxury']
    },
    {
      id: '6',
      name: 'Porsche',
      model: '911 Turbo S',
      year: '2022',
      type: 'Sports Car',
      fuel: 'Petrol',
      seats: 4,
      rating: 4.8,
      distance: '8.5 km away',
      price: 780,
      image: 'https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
      features: ['Automatic', 'Petrol', '4 Seats', 'Sports']
    },
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

  const getSelectedSortLabel = () => {
    const selected = sortOptions.find(option => option.selected);
    return selected ? selected.label : 'Sort';
  };

  const handleLocationEdit = () => {
    setTempLocation(location);
    setShowLocationEdit(true);
  };

  const saveLocationEdit = () => {
    setLocation(tempLocation);
    setShowLocationEdit(false);
  };

  const handleDateTimeEdit = (field: 'start' | 'end') => {
    setEditingField(field);
    if (field === 'start') {
      setStartPickerMode('date');
      setShowStartPicker(true);
    } else {
      setEndPickerMode('date');
      setShowEndPicker(true);
    }
  };

  const handleMenuItemPress = (item: MenuItem) => {
    item.onPress();
    closeMenu();
  };

  const handleCarPress = (car: Car) => {
    // Navigate to car details screen
    router.push('/car-details');
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
          <Text style={styles.carName}>{item.name} {item.year}</Text>
          <Text style={styles.carPrice}>₹{item.price}/hr</Text>
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
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#000000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.profileIcon} onPress={openMenu}>
          <Text style={styles.profileText}>AV</Text>
        </TouchableOpacity>
      </View>

      {/* Trip Details - Editable */}
      <View style={styles.tripDetails}>
        <TouchableOpacity 
          style={styles.locationSection}
          onPress={handleLocationEdit}
        >
          <Text style={styles.sectionLabel}>Location</Text>
          <View style={styles.locationRow}>
            <MapPin size={16} color="#059669" />
            <Text style={styles.locationText}>{location}</Text>
            <Edit3 size={16} color="#6B7280" />
          </View>
        </TouchableOpacity>

        <View style={styles.dateTimeSection}>
          <TouchableOpacity 
            style={styles.dateTimeItem}
            onPress={() => handleDateTimeEdit('start')}
          >
            <Text style={styles.dateTimeLabel}>{formatDateTime(tripStart, 'date')}</Text>
            <Text style={styles.dateTimeValue}>{formatDateTime(tripStart, 'time')}</Text>
            <Edit3 size={12} color="#6B7280" style={styles.editIcon} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.dateTimeItem}
            onPress={() => handleDateTimeEdit('end')}
          >
            <Text style={styles.dateTimeLabel}>{formatDateTime(tripEnd, 'date')}</Text>
            <Text style={styles.dateTimeValue}>{formatDateTime(tripEnd, 'time')}</Text>
            <Edit3 size={12} color="#6B7280" style={styles.editIcon} />
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

      {/* Date/Time Pickers */}
      {showStartPicker && Platform.OS !== 'web' && (
        <View style={styles.pickerOverlay}>
          <View style={styles.pickerContainer}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>Select Start Date & Time</Text>
              <TouchableOpacity onPress={() => setShowStartPicker(false)}>
                <X size={20} color="#000000" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modeToggleContainer}>
              <TouchableOpacity 
                style={[styles.modeToggleButton, startPickerMode === 'date' && styles.modeToggleButtonActive]}
                onPress={() => setStartPickerMode('date')}
              >
                <Calendar size={16} color={startPickerMode === 'date' ? '#FFFFFF' : '#374151'} />
                <Text style={[styles.modeToggleText, startPickerMode === 'date' && styles.modeToggleTextActive]}>
                  Date
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modeToggleButton, startPickerMode === 'time' && styles.modeToggleButtonActive]}
                onPress={() => setStartPickerMode('time')}
              >
                <Clock size={16} color={startPickerMode === 'time' ? '#FFFFFF' : '#374151'} />
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
          </View>
        </View>
      )}

      {showEndPicker && Platform.OS !== 'web' && (
        <View style={styles.pickerOverlay}>
          <View style={styles.pickerContainer}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>Select End Date & Time</Text>
              <TouchableOpacity onPress={() => setShowEndPicker(false)}>
                <X size={20} color="#000000" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modeToggleContainer}>
              <TouchableOpacity 
                style={[styles.modeToggleButton, endPickerMode === 'date' && styles.modeToggleButtonActive]}
                onPress={() => setEndPickerMode('date')}
              >
                <Calendar size={16} color={endPickerMode === 'date' ? '#FFFFFF' : '#374151'} />
                <Text style={[styles.modeToggleText, endPickerMode === 'date' && styles.modeToggleTextActive]}>
                  Date
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modeToggleButton, endPickerMode === 'time' && styles.modeToggleButtonActive]}
                onPress={() => setEndPickerMode('time')}
              >
                <Clock size={16} color={endPickerMode === 'time' ? '#FFFFFF' : '#374151'} />
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
          </View>
        </View>
      )}

      {/* Location Edit Modal */}
      <Modal
        visible={showLocationEdit}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLocationEdit(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowLocationEdit(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.locationEditModal}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Edit Location</Text>
                  <TouchableOpacity onPress={() => setShowLocationEdit(false)}>
                    <X size={24} color="#000000" />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.locationEditContent}>
                  <TextInput
                    style={styles.locationEditInput}
                    value={tempLocation}
                    onChangeText={setTempLocation}
                    placeholder="Enter location"
                    autoFocus={true}
                  />
                  
                  <View style={styles.locationEditButtons}>
                    <TouchableOpacity 
                      style={styles.cancelButton}
                      onPress={() => setShowLocationEdit(false)}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.saveButton}
                      onPress={saveLocationEdit}
                    >
                      <Text style={styles.saveButtonText}>Save</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

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
                    transform: [{ translateX: menuSlideAnim }]
                  }
                ]}
              >
                <View style={styles.menuHeader}>
                  <View style={styles.menuProfileSection}>
                    <View style={styles.menuProfileIcon}>
                      <Text style={styles.menuProfileText}>AV</Text>
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