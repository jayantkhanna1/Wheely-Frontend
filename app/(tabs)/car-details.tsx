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
  Animated,
  Dimensions,
  TextInput,
  TouchableWithoutFeedback,
  ActivityIndicator
} from 'react-native';
import { ArrowLeft, MapPin, Calendar, Clock, Star, Share2, X, ChevronDown, ChevronUp, User, Map as MapIcon, Phone, Gift, Percent, CircleHelp as HelpCircle, FileText, Globe, CreditCard as Edit3, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform } from 'react-native';
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

interface MenuItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  onPress: () => void;
}

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  avatar: string;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  expanded: boolean;
}

interface VehiclePhoto {
  id: number;
  photo: string;
  is_primary: boolean;
  created_at: string;
}

interface VehicleDetails {
  id: number;
  vehicle_name: string;
  vehicle_brand: string;
  vehicle_model: string;
  vehicle_color: string;
  vehicle_year: number;
  vehicle_type: string;
  transmission_type: string;
  fuel_type: string;
  seating_capacity: number;
  price_per_hour: string;
  price_per_day: string;
  location: {
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
  };
  owner: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string | null;
    location: any;
    driving_license: any;
    driving_license_verified: boolean;
    profile_picture: string | null;
    date_of_birth: string;
    email_verified: boolean;
    phone_verified: boolean;
    private_token: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
  vehicle_rc: string | null;
  vehicle_insurance: string | null;
  vehicle_pollution_certificate: string | null;
  is_available: boolean;
  is_verified: boolean;
  rating: number;
  total_bookings: number;
  photos: VehiclePhoto[];
  availability_slots: any[];
  created_at: string;
  updated_at: string;
  category: string;
  features: string[];
  license_plate: string | null;
}

const { width: screenWidth } = Dimensions.get('window');

export default function CarDetailsScreen() {
  const params = useLocalSearchParams();
  const vehicleId = params.vehicleId;
  const locationParam = params.location;
  const tripStartDate = params.tripStartDate;
  const tripEndDate = params.tripEndDate;
  const tripStartTime = params.tripStartTime;
  const tripEndTime = params.tripEndTime;

  const [location, setLocation] = useState(Array.isArray(locationParam) ? locationParam[0] : locationParam || '');
  const [tripStart, setTripStart] = useState(new Date());
  const [tripEnd, setTripEnd] = useState(new Date(Date.now() + 12 * 60 * 60 * 1000));
  const [showLocationEdit, setShowLocationEdit] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [startPickerMode, setStartPickerMode] = useState<'date' | 'time'>('date');
  const [endPickerMode, setEndPickerMode] = useState<'date' | 'time'>('date');
  const [tempLocation, setTempLocation] = useState(location);
  const [showMenu, setShowMenu] = useState(false);
  const [activeTab, setActiveTab] = useState('Photos');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAgreed, setIsAgreed] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [vehicleData, setVehicleData] = useState<VehicleDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);
  const [duration, setDuration] = useState('');

  // Create refs for scrolling to sections
  const scrollViewRef = useRef<ScrollView>(null);
  const sectionRefs = {
    Photos: useRef<View>(null),
    Reviews: useRef<View>(null),
    Features: useRef<View>(null),
    Location: useRef<View>(null),
    Offers: useRef<View>(null)
  };

  // Parse dates from URL parameters
  useEffect(() => {
    if (tripStartDate && tripStartTime && tripEndDate && tripEndTime) {
      try {
        // Parse start date and time
        const startDateStr = Array.isArray(tripStartDate) ? tripStartDate[0] : tripStartDate;
        const startTimeStr = Array.isArray(tripStartTime) ? tripStartTime[0] : tripStartTime;
        
        // Parse end date and time
        const endDateStr = Array.isArray(tripEndDate) ? tripEndDate[0] : tripEndDate;
        const endTimeStr = Array.isArray(tripEndTime) ? tripEndTime[0] : tripEndTime;
        
        // Create Date objects
        const parsedStartDate = parseDateTime(startDateStr, startTimeStr);
        const parsedEndDate = parseDateTime(endDateStr, endTimeStr);
        
        if (parsedStartDate && parsedEndDate) {
          setTripStart(parsedStartDate);
          setTripEnd(parsedEndDate);
          
          // Calculate duration and price
          calculateDurationAndPrice(parsedStartDate, parsedEndDate);
        }
      } catch (error) {
        console.error('Error parsing dates:', error);
      }
    }
  }, [tripStartDate, tripStartTime, tripEndDate, tripEndTime, vehicleData]);

  // Helper function to parse date and time strings
  const parseDateTime = (dateStr: string, timeStr: string): Date | null => {
    try {
      // Handle different date formats
      let formattedDate = dateStr;
      if (dateStr.includes('T')) {
        formattedDate = dateStr.split('T')[0];
      }
      
      // Parse time string (handle 12-hour format with AM/PM)
      let hours = 0;
      let minutes = 0;
      
      if (timeStr.toLowerCase().includes('am') || timeStr.toLowerCase().includes('pm')) {
        const match = timeStr.match(/(\d+):(\d+)\s*(am|pm)/i);
        if (match) {
          hours = parseInt(match[1]);
          minutes = parseInt(match[2]);
          const period = match[3].toLowerCase();
          
          // Convert to 24-hour format
          if (period === 'pm' && hours < 12) hours += 12;
          if (period === 'am' && hours === 12) hours = 0;
        }
      } else {
        // Handle 24-hour format
        const parts = timeStr.split(':');
        hours = parseInt(parts[0]);
        minutes = parseInt(parts[1]);
      }
      
      // Create date object
      const date = new Date(formattedDate);
      date.setHours(hours, minutes, 0, 0);
      
      return date;
    } catch (error) {
      console.error('Error parsing date/time:', error);
      return null;
    }
  };

  // Calculate duration and price based on start and end times
  const calculateDurationAndPrice = (start: Date, end: Date) => {
    if (!vehicleData) return;
    
    const durationMs = end.getTime() - start.getTime();
    const durationHours = durationMs / (1000 * 60 * 60);
    const days = Math.floor(durationHours / 24);
    const remainingHours = Math.ceil(durationHours % 24);
    
    // Format duration string
    let durationText = '';
    if (days > 0) {
      durationText += `${days} day${days > 1 ? 's' : ''}`;
      if (remainingHours > 0) {
        durationText += ` ${remainingHours} hour${remainingHours > 1 ? 's' : ''}`;
      }
    } else {
      durationText = `${remainingHours} hour${remainingHours > 1 ? 's' : ''}`;
    }
    setDuration(durationText);
    
    // Calculate price
    const hourlyRate = parseFloat(vehicleData.price_per_hour);
    const dailyRate = parseFloat(vehicleData.price_per_day);
    
    let price = 0;
    if (days > 0) {
      price += days * dailyRate;
      if (remainingHours > 0) {
        price += remainingHours * hourlyRate;
      }
    } else {
      price = remainingHours * hourlyRate;
    }
    
    setTotalPrice(price);
  };

  useEffect(() => {
    loadUserData();
    fetchVehicleDetails();
  }, [vehicleId]);

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

  const fetchVehicleDetails = async () => {
    if (!vehicleId) {
      console.error('No vehicle ID provided');
      setLoading(false);
      return;
    }

    try {
      const apiURL = `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/search/vehicle/${vehicleId}/`;
      console.log('Fetching vehicle details from:', apiURL);

      const response = await fetch(apiURL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Vehicle details response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Vehicle details data:', data);
        setVehicleData(data);
        
        // Calculate price and duration once we have the vehicle data
        if (tripStart && tripEnd) {
          calculateDurationAndPrice(tripStart, tripEnd);
        }
      } else {
        console.error('Failed to fetch vehicle details');
      }
    } catch (error) {
      console.error('Error fetching vehicle details:', error);
    } finally {
      setLoading(false);
    }
  };

  const [faqs, setFaqs] = useState<FAQ[]>([
    {
      id: '1',
      question: 'What documents do I need to rent this vehicle?',
      answer: 'You need a valid driving license, a government-issued ID proof, and a credit/debit card for security deposit.',
      expanded: false
    },
    {
      id: '2',
      question: 'Is there a security deposit required?',
      answer: 'Yes, a refundable security deposit is required at the time of pickup. The amount varies based on the vehicle type.',
      expanded: false
    },
    {
      id: '3',
      question: 'What is the fuel policy?',
      answer: 'The vehicle will be provided with a full tank, and you are expected to return it with a full tank. Otherwise, a refueling charge will apply.',
      expanded: false
    },
    {
      id: '4',
      question: 'Can I extend my booking duration?',
      answer: 'Yes, you can extend your booking through the app, subject to availability. Please ensure you request an extension before your current booking ends.',
      expanded: false
    },
    {
      id: '5',
      question: 'What happens if I return the vehicle late?',
      answer: 'Late returns are charged at 1.5x the hourly rate for each additional hour. Please notify us in advance if you expect to be late.',
      expanded: false
    },
    {
      id: '6',
      question: 'Is roadside assistance included?',
      answer: 'Yes, 24/7 roadside assistance is included with every booking. Contact details will be provided at the time of pickup.',
      expanded: false
    }
  ]);

  const menuSlideAnim = useRef(new Animated.Value(screenWidth)).current;

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

  const handleDateTimeChange = (event: any, selectedDate?: Date, type?: 'start' | 'end', mode?: 'date' | 'time') => {
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
      
      // Recalculate price and duration when dates change
      if (vehicleData) {
        calculateDurationAndPrice(
          type === 'start' ? selectedDate : tripStart,
          type === 'end' ? selectedDate : tripEnd
        );
      }
    }
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

  const handleLocationEdit = () => {
    setTempLocation(location);
    setShowLocationEdit(true);
  };

  const saveLocationEdit = () => {
    setLocation(tempLocation);
    setShowLocationEdit(false);
  };

  const handleDateTimeEdit = (field: 'start' | 'end') => {
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

  const toggleFAQ = (faqId: string) => {
    setFaqs(prev => prev.map(faq =>
      faq.id === faqId
        ? { ...faq, expanded: !faq.expanded }
        : faq
    ));
  };

  const nextImage = () => {
    if (vehicleData?.photos && vehicleData.photos.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % vehicleData.photos.length);
    }
  };

  const prevImage = () => {
    if (vehicleData?.photos && vehicleData.photos.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + vehicleData.photos.length) % vehicleData.photos.length);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={16}
        color="#FFA500"
        fill={index < rating ? "#FFA500" : "transparent"}
      />
    ));
  };

  const handleBookNow = () => {
    if (!isAgreed) {
      alert('Please agree to the terms and conditions before booking');
      return;
    }
    
    if (!vehicleData) {
      alert('Vehicle data is not available');
      return;
    }

    router.push({
      pathname: '/payment',
      params: {
        vehicleId: vehicleData.id.toString(),
        vehicleType: 'car',
        vehicleName: vehicleData.vehicle_name,
        price: totalPrice.toString(),
        duration: duration,
        pickupLocation: vehicleData.location.address,
        tripStartDate: tripStart.toISOString(),
        tripEndDate: tripEnd.toISOString(),
        tripStartTime: formatDateTime(tripStart, 'time'),
        tripEndTime: formatDateTime(tripEnd, 'time')
      }
    });
  };

  // Function to handle tab press and scroll to section
  const handleTabPress = (tabName: string) => {
    setActiveTab(tabName);
    
    // Scroll to the section
    const sectionRef = sectionRefs[tabName as keyof typeof sectionRefs];
    if (sectionRef.current && scrollViewRef.current) {
      sectionRef.current.measureLayout(
        scrollViewRef.current.getInnerViewNode(),
        (x, y) => {
          scrollViewRef.current?.scrollTo({ y, animated: true });
        },
        () => console.log('Failed to measure layout')
      );
    }
  };

  if (loading) {
    return (
      <ScreenWrapper>
        <SafeAreaView style={styles.container}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#059669" />
            <Text style={styles.loadingText}>Loading vehicle details...</Text>
          </View>
        </SafeAreaView>
      </ScreenWrapper>
    );
  }

  if (!vehicleData) {
    return (
      <ScreenWrapper>
        <SafeAreaView style={styles.container}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Failed to load vehicle details</Text>
            <TouchableOpacity style={styles.backButtonLarge} onPress={() => router.back()}>
              <Text style={styles.backButtonText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ScreenWrapper>
    );
  }

  // Get vehicle photos or use fallback
  const vehiclePhotos = vehicleData.photos && vehicleData.photos.length > 0
    ? vehicleData.photos.map(photo => photo.photo)
    : ['https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop'];

  // Extract features from vehicle data or use defaults
  const features = vehicleData.features && vehicleData.features.length > 0
    ? vehicleData.features
    : [
        'Air Conditioning',
        'Power Steering',
        'ABS Brakes',
        'Airbags',
        'GPS Navigation',
        'Bluetooth Connectivity',
        'USB Charging Ports',
        'Premium Sound System',
        vehicleData.transmission_type || 'Automatic Transmission',
        vehicleData.fuel_type || 'Petrol Engine'
      ];

  return (
    <ScreenWrapper>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#000000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileIcon} onPress={openMenu}>
            <Text style={styles.profileText}>{userData?.first_name?.[0]}{userData?.last_name?.[0]}</Text>
          </TouchableOpacity>
        </View>

        {/* Scrollable Content */}
        <ScrollView 
          ref={scrollViewRef}
          style={styles.content} 
          showsVerticalScrollIndicator={false}
        >
          {/* Trip Details - Editable */}
          <View style={styles.tripDetails}>
            <View style={styles.tripHeader}>
              <View>
                <Text style={styles.carTitle}>{vehicleData.vehicle_name}</Text>
                <Text style={styles.carLocation}>{location}</Text>
              </View>
              <TouchableOpacity style={styles.shareButton}>
                <Share2 size={20} color="#059669" />
              </TouchableOpacity>
            </View>

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

          {/* Car Info */}
          <View style={styles.carInfo}>
            <View style={styles.carHeader}>
              <Text style={styles.carName}>{vehicleData.vehicle_name}</Text>
            </View>
            <Text style={styles.carFeatures}>
              {vehicleData.transmission_type || 'Automatic'} • 
              {vehicleData.fuel_type || 'Petrol'} • 
              {vehicleData.seating_capacity || '4'} Seats
            </Text>
            <Text style={styles.carUrl}>https://maps.google.com/25716420/details/712681</Text>
          </View>

          {/* Tabs */}
          <View style={styles.tabsContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {['Photos', 'Reviews', 'Features', 'Location', 'Offers'].map((tab) => (
                <TouchableOpacity
                  key={tab}
                  style={[styles.tab, activeTab === tab && styles.activeTab]}
                  onPress={() => handleTabPress(tab)}
                >
                  <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                    {tab}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Photos Section */}
          <View ref={sectionRefs.Photos} style={styles.photosContainer}>
            <View style={styles.mainImageContainer}>
              <Image 
                source={{ uri: vehiclePhotos[currentImageIndex] }} 
                style={styles.mainImage} 
              />
              <TouchableOpacity style={styles.prevButton} onPress={prevImage}>
                <ChevronLeft size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.nextButton} onPress={nextImage}>
                <ChevronRight size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <View style={styles.imageCounter}>
                <Text style={styles.imageCounterText}>
                  {currentImageIndex + 1} / {vehiclePhotos.length}
                </Text>
              </View>
            </View>
            <View style={styles.thumbnailContainer}>
              {vehiclePhotos.map((image, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.thumbnail,
                    index === currentImageIndex && styles.activeThumbnail
                  ]}
                  onPress={() => setCurrentImageIndex(index)}
                >
                  <Image source={{ uri: image }} style={styles.thumbnailImage} />
                </TouchableOpacity>
              ))}
              {vehiclePhotos.length > 5 && (
                <View style={styles.morePhotos}>
                  <Text style={styles.morePhotosText}>+{vehiclePhotos.length - 5} more</Text>
                </View>
              )}
            </View>
          </View>

          {/* Reviews Section */}
          <View ref={sectionRefs.Reviews} style={styles.reviewsContainer}>
            <View style={styles.ratingOverview}>
              <Text style={styles.ratingTitle}>Reviews & Rating</Text>
              <View style={styles.ratingHeader}>
                <Text style={styles.ratingScore}>{vehicleData.rating.toFixed(1)}</Text>
                <View style={styles.ratingStarsContainer}>
                  <View style={styles.ratingStars}>
                    {renderStars(vehicleData.rating)}
                  </View>
                  <Text style={styles.reviewCount}>{vehicleData.total_bookings} Bookings</Text>
                </View>
              </View>
            </View>

            <View style={styles.noReviewsContainer}>
              <Text style={styles.noReviewsText}>No reviews found</Text>
              <Text style={styles.noReviewsSubtext}>Be the first to review this vehicle after your trip!</Text>
            </View>
          </View>

          {/* Features Section */}
          <View ref={sectionRefs.Features} style={styles.featuresContainer}>
            <Text style={styles.featuresTitle}>Car Features</Text>
            <View style={styles.featuresList}>
              {features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <View style={styles.featureBullet} />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Location Section */}
          <View ref={sectionRefs.Location} style={styles.locationContainer}>
            <Text style={styles.locationTitle}>Car Location</Text>
            <View style={styles.locationCard}>
              <View style={styles.locationIcon}>
                <MapPin size={24} color="#059669" />
              </View>
              <View style={styles.locationInfo}>
                <Text style={styles.locationAddress}>
                  {vehicleData.location.address}
                </Text>
                <Text style={styles.locationDistance}>
                  {vehicleData.location.city}, {vehicleData.location.state}, {vehicleData.location.pincode}
                </Text>
              </View>
            </View>
          </View>

          {/* Offers Section */}
          <View ref={sectionRefs.Offers} style={styles.offersContainer}>
            <Text style={styles.offersTitle}>Special Offers</Text>
            <View style={styles.offerCard}>
              <Text style={styles.offerTitle}>First Time User</Text>
              <Text style={styles.offerDescription}>Get 20% off on your first booking</Text>
              <Text style={styles.offerCode}>Use code: FIRST20</Text>
            </View>
            <View style={styles.offerCard}>
              <Text style={styles.offerTitle}>Weekend Special</Text>
              <Text style={styles.offerDescription}>15% off on weekend bookings</Text>
              <Text style={styles.offerCode}>Use code: WEEKEND15</Text>
            </View>
          </View>

          {/* FAQs Section */}
          <View style={styles.faqsContainer}>
            <Text style={styles.faqsTitle}>FAQs</Text>
            {faqs.map((faq) => (
              <TouchableOpacity
                key={faq.id}
                style={styles.faqItem}
                onPress={() => toggleFAQ(faq.id)}
              >
                <View style={styles.faqHeader}>
                  <Text style={styles.faqQuestion}>{faq.question}</Text>
                  {faq.expanded ? (
                    <ChevronUp size={20} color="#6B7280" />
                  ) : (
                    <ChevronDown size={20} color="#6B7280" />
                  )}
                </View>
                {faq.expanded && (
                  <Text style={styles.faqAnswer}>{faq.answer}</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Policies Section */}
          <View style={styles.policiesContainer}>
            <Text style={styles.policiesTitle}>Policies and Agreement</Text>
            <TouchableOpacity
              style={styles.policyItem}
              onPress={() => setIsAgreed(!isAgreed)}
            >
              <View style={[styles.checkbox, isAgreed && styles.checkboxChecked]}>
                {isAgreed && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.policyText}>
                I hereby agree to the terms and conditions of the Lease Agreement with Host.
              </Text>
            </TouchableOpacity>
          </View>

          {/* Bottom Spacing for Fixed Price Bar */}
          <View style={styles.bottomSpacing} />
        </ScrollView>

        {/* Fixed Price Bar */}
        <View style={styles.priceBar}>
          <View style={styles.priceInfo}>
            <Text style={styles.priceAmount}>₹{totalPrice.toFixed(0)}</Text>
            <Text style={styles.priceBreakup}>For {duration}</Text>
            <View style={styles.priceFeatures}>
              <Text style={styles.priceFeature}>• {vehicleData.transmission_type || 'Automatic'}</Text>
              <Text style={styles.priceFeature}>• {vehicleData.fuel_type || 'Petrol'}</Text>
              <Text style={styles.priceFeature}>• {vehicleData.seating_capacity || '4'} Seats</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={[styles.bookButton, !isAgreed && styles.bookButtonDisabled]}
            onPress={handleBookNow}
            disabled={!isAgreed}
          >
            <Text style={styles.bookButtonText}>Book Now</Text>
          </TouchableOpacity>
        </View>

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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#059669',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#EF4444',
    marginBottom: 20,
    textAlign: 'center',
  },
  backButtonLarge: {
    backgroundColor: '#059669',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
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
  content: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  carTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  carLocation: {
    fontSize: 14,
    color: '#6B7280',
  },
  shareButton: {
    padding: 8,
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
  carInfo: {
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
  carHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  carName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reviewCount: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  carFeatures: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  carUrl: {
    fontSize: 12,
    color: '#059669',
    textDecorationLine: 'underline',
  },
  tabsContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#059669',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  photosContainer: {
    padding: 20,
  },
  mainImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  mainImage: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  prevButton: {
    position: 'absolute',
    left: 12,
    top: '50%',
    marginTop: -20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
  },
  nextButton: {
    position: 'absolute',
    right: 12,
    top: '50%',
    marginTop: -20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
  },
  imageCounter: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  imageCounterText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  thumbnailContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeThumbnail: {
    borderColor: '#059669',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
    resizeMode: 'cover',
  },
  morePhotos: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  morePhotosText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  reviewsContainer: {
    padding: 20,
  },
  ratingOverview: {
    marginBottom: 24,
  },
  ratingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  ratingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ratingScore: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#059669',
  },
  ratingStarsContainer: {
    alignItems: 'flex-start',
  },
  ratingStars: {
    flexDirection: 'row',
    gap: 2,
    marginBottom: 2,
  },
  noReviewsContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noReviewsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  noReviewsSubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  reviewCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#059669',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewerAvatarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  reviewDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  reviewRating: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewComment: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  featuresContainer: {
    padding: 20,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#059669',
  },
  featureText: {
    fontSize: 16,
    color: '#374151',
  },
  locationContainer: {
    padding: 20,
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
  },
  locationIcon: {
    marginTop: 2,
  },
  locationInfo: {
    flex: 1,
  },
  locationAddress: {
    fontSize: 16,
    color: '#111827',
    lineHeight: 22,
    marginBottom: 4,
  },
  locationDistance: {
    fontSize: 14,
    color: '#6B7280',
  },
  offersContainer: {
    padding: 20,
  },
  offersTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  offerCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  offerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#059669',
    marginBottom: 4,
  },
  offerDescription: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
  },
  offerCode: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
  },
  faqsContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  faqsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 16,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    flex: 1,
    marginRight: 12,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 12,
    lineHeight: 20,
  },
  policiesContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  policiesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  policyItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  policyText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 120,
  },
  priceBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  priceInfo: {
    flex: 1,
  },
  priceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  priceBreakup: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  priceFeatures: {
    flexDirection: 'row',
    gap: 8,
  },
  priceFeature: {
    fontSize: 10,
    color: '#6B7280',
  },
  bookButton: {
    backgroundColor: '#059669',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#059669',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  bookButtonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0,
  },
  bookButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
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
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
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