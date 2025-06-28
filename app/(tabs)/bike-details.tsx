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
  ActivityIndicator,
  Alert
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

export default function BikeDetailsScreen() {
  const params = useLocalSearchParams();
  const vehicleId = params.vehicleId as string;
  const locationParam = params.location as string;
  const tripStartDateParam = params.tripStartDate as string;
  const tripEndDateParam = params.tripEndDate as string;
  const tripStartTimeParam = params.tripStartTime as string;
  const tripEndTimeParam = params.tripEndTime as string;

  const [location, setLocation] = useState(locationParam || 'Saket Colony, Delhi');
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

  // Refs for scrolling to sections
  const photosRef = useRef<View>(null);
  const reviewsRef = useRef<View>(null);
  const featuresRef = useRef<View>(null);
  const locationRef = useRef<View>(null);
  const offersRef = useRef<View>(null);
  const faqsRef = useRef<View>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    loadUserData();
    fetchVehicleDetails();
    initializeDateTimes();
  }, []);

  // Initialize date and time from URL parameters
  const initializeDateTimes = () => {
    try {
      if (tripStartDateParam && tripStartTimeParam) {
        const startDate = new Date(tripStartDateParam);
        
        // Parse time (handle different formats)
        if (tripStartTimeParam.includes(':')) {
          const [hours, minutes] = tripStartTimeParam.split(':');
          startDate.setHours(parseInt(hours, 10));
          startDate.setMinutes(parseInt(minutes, 10));
        } else if (tripStartTimeParam.toLowerCase().includes('am') || tripStartTimeParam.toLowerCase().includes('pm')) {
          // Handle 12-hour format with AM/PM
          const timeMatch = tripStartTimeParam.match(/(\d+):(\d+)\s*(am|pm)/i);
          if (timeMatch) {
            let hours = parseInt(timeMatch[1], 10);
            const minutes = parseInt(timeMatch[2], 10);
            const period = timeMatch[3].toLowerCase();
            
            if (period === 'pm' && hours < 12) hours += 12;
            if (period === 'am' && hours === 12) hours = 0;
            
            startDate.setHours(hours, minutes);
          }
        }
        
        setTripStart(startDate);
      }
      
      if (tripEndDateParam && tripEndTimeParam) {
        const endDate = new Date(tripEndDateParam);
        
        // Parse time (handle different formats)
        if (tripEndTimeParam.includes(':')) {
          const [hours, minutes] = tripEndTimeParam.split(':');
          endDate.setHours(parseInt(hours, 10));
          endDate.setMinutes(parseInt(minutes, 10));
        } else if (tripEndTimeParam.toLowerCase().includes('am') || tripEndTimeParam.toLowerCase().includes('pm')) {
          // Handle 12-hour format with AM/PM
          const timeMatch = tripEndTimeParam.match(/(\d+):(\d+)\s*(am|pm)/i);
          if (timeMatch) {
            let hours = parseInt(timeMatch[1], 10);
            const minutes = parseInt(timeMatch[2], 10);
            const period = timeMatch[3].toLowerCase();
            
            if (period === 'pm' && hours < 12) hours += 12;
            if (period === 'am' && hours === 12) hours = 0;
            
            endDate.setHours(hours, minutes);
          }
        }
        
        setTripEnd(endDate);
      }
    } catch (error) {
      console.error('Error initializing date/times:', error);
    }
  };

  // Calculate price based on duration
  useEffect(() => {
    if (vehicleData && tripStart && tripEnd) {
      calculatePrice();
    }
  }, [vehicleData, tripStart, tripEnd]);

  const calculatePrice = () => {
    if (!vehicleData) return;

    const hourlyRate = parseFloat(vehicleData.price_per_hour);
    const dailyRate = parseFloat(vehicleData.price_per_day);
    
    // Calculate duration in milliseconds
    const durationMs = tripEnd.getTime() - tripStart.getTime();
    
    // Convert to hours and days
    const durationHours = durationMs / (1000 * 60 * 60);
    const durationDays = Math.floor(durationHours / 24);
    const remainingHours = Math.ceil(durationHours % 24);
    
    let price = 0;
    let durationText = '';
    
    if (durationDays > 0) {
      price += durationDays * dailyRate;
      durationText += `${durationDays} day${durationDays > 1 ? 's' : ''}`;
      
      if (remainingHours > 0) {
        price += remainingHours * hourlyRate;
        durationText += ` ${remainingHours} hour${remainingHours > 1 ? 's' : ''}`;
      }
    } else {
      // If less than a day, charge by hour
      price = Math.max(1, Math.ceil(durationHours)) * hourlyRate;
      durationText = `${Math.max(1, Math.ceil(durationHours))} hour${Math.ceil(durationHours) > 1 ? 's' : ''}`;
    }
    
    setTotalPrice(price);
    setDuration(durationText);
  };

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
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error Response:', errorData);
        Alert.alert(
          'Error',
          errorData.error || errorData.message || `Failed to fetch vehicle details. Status: ${response.status}`,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error fetching vehicle details:', error);
      Alert.alert(
        'Error',
        'Failed to load vehicle details. Please check your connection and try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const [faqs, setFaqs] = useState<FAQ[]>([
    {
      id: '1',
      question: 'What documents do I need to rent a bike?',
      answer: 'You need a valid driving license, a government-issued ID proof, and a credit/debit card for security deposit.',
      expanded: false
    },
    {
      id: '2',
      question: 'Is fuel included in the rental price?',
      answer: 'Yes, our bikes come with a full tank of fuel. You are expected to return the bike with a full tank, or we charge for the missing fuel plus a service fee.',
      expanded: false
    },
    {
      id: '3',
      question: 'What happens if I return the bike late?',
      answer: 'Late returns are charged at 1.5x the hourly rate for each additional hour. Please contact us if you need to extend your booking.',
      expanded: false
    },
    {
      id: '4',
      question: 'Is insurance included with the bike rental?',
      answer: 'Basic third-party insurance is included. For comprehensive coverage, you can purchase additional insurance during checkout.',
      expanded: false
    },
    {
      id: '5',
      question: 'What if the bike breaks down during my rental period?',
      answer: 'Call our 24/7 roadside assistance number provided in your booking confirmation. We\'ll either fix the issue or provide a replacement bike as soon as possible.',
      expanded: false
    },
    {
      id: '6',
      question: 'Can I modify or cancel my booking?',
      answer: 'Bookings can be modified or canceled up to 24 hours before the rental start time for a full refund. Changes within 24 hours may incur charges.',
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
      Alert.alert('Agreement Required', 'Please agree to the terms and conditions before booking.');
      return;
    }

    router.push({
      pathname: '/payment',
      params: {
        vehicleId: vehicleId,
        vehicleType: 'bike',
        vehicleName: vehicleData?.vehicle_name || 'Honda Activa 6G',
        price: totalPrice.toString(),
        duration: duration,
        pickupLocation: vehicleData?.location?.address || 'Location not specified',
        tripStartDate: tripStart.toISOString().split('T')[0],
        tripEndDate: tripEnd.toISOString().split('T')[0],
        tripStartTime: tripStart.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
        tripEndTime: tripEnd.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
      }
    });
  };

  const scrollToSection = (sectionRef: React.RefObject<View>) => {
    if (sectionRef.current && scrollViewRef.current) {
      sectionRef.current.measureLayout(
        // @ts-ignore - This is a valid method but TypeScript doesn't recognize it
        scrollViewRef.current.getInnerViewNode(),
        (_x: number, y: number) => {
          scrollViewRef.current?.scrollTo({ y: y, animated: true });
        },
        () => console.log('Failed to measure')
      );
    }
  };

  const renderTabContent = () => {
    return (
      <View>
        {/* Photos Section */}
        <View ref={photosRef} style={[styles.sectionContainer, activeTab === 'Photos' && styles.activeSection]}>
          <Text style={styles.sectionTitle}>Photos</Text>
          <View style={styles.photosContainer}>
            <View style={styles.mainImageContainer}>
              {loading ? (
                <View style={[styles.mainImage, styles.loadingContainer]}>
                  <ActivityIndicator size="large" color="#059669" />
                </View>
              ) : vehicleData?.photos && vehicleData.photos.length > 0 ? (
                <>
                  <Image 
                    source={{ uri: vehicleData.photos[currentImageIndex].photo }} 
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
                      {currentImageIndex + 1} / {vehicleData.photos.length}
                    </Text>
                  </View>
                </>
              ) : (
                <View style={[styles.mainImage, styles.noImageContainer]}>
                  <Text style={styles.noImageText}>No images available</Text>
                </View>
              )}
            </View>
            
            {!loading && vehicleData?.photos && vehicleData.photos.length > 0 && (
              <View style={styles.thumbnailContainer}>
                {vehicleData.photos.map((photo, index) => (
                  <TouchableOpacity
                    key={photo.id}
                    style={[
                      styles.thumbnail,
                      index === currentImageIndex && styles.activeThumbnail
                    ]}
                    onPress={() => setCurrentImageIndex(index)}
                  >
                    <Image source={{ uri: photo.photo }} style={styles.thumbnailImage} />
                  </TouchableOpacity>
                ))}
                {vehicleData.photos.length > 5 && (
                  <View style={styles.morePhotos}>
                    <Text style={styles.morePhotosText}>+{vehicleData.photos.length - 5} more</Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>

        {/* Reviews Section */}
        <View ref={reviewsRef} style={[styles.sectionContainer, activeTab === 'Reviews' && styles.activeSection]}>
          <Text style={styles.sectionTitle}>Reviews & Rating</Text>
          <View style={styles.reviewsContainer}>
            <View style={styles.ratingOverview}>
              <View style={styles.ratingHeader}>
                <Text style={styles.ratingScore}>{vehicleData?.rating?.toFixed(1) || '0.0'}</Text>
                <View style={styles.ratingStarsContainer}>
                  <View style={styles.ratingStars}>
                    {renderStars(vehicleData?.rating || 0)}
                  </View>
                  <Text style={styles.reviewCount}>{vehicleData?.total_bookings || 0} Reviews</Text>
                </View>
              </View>
            </View>

            <View style={styles.noReviewsContainer}>
              <Text style={styles.noReviewsText}>No reviews found for this bike yet.</Text>
              <Text style={styles.noReviewsSubtext}>Be the first to rent and review this bike!</Text>
            </View>
          </View>
        </View>

        {/* Features Section */}
        <View ref={featuresRef} style={[styles.sectionContainer, activeTab === 'Features' && styles.activeSection]}>
          <Text style={styles.sectionTitle}>Bike Features</Text>
          <View style={styles.featuresContainer}>
            <View style={styles.featuresList}>
              {loading ? (
                <ActivityIndicator size="small" color="#059669" />
              ) : (
                <>
                  {/* Display vehicle features from backend */}
                  {vehicleData?.features && vehicleData.features.length > 0 ? (
                    vehicleData.features.map((feature, index) => (
                      <View key={index} style={styles.featureItem}>
                        <View style={styles.featureBullet} />
                        <Text style={styles.featureText}>{feature}</Text>
                      </View>
                    ))
                  ) : (
                    // Default features based on vehicle data
                    <>
                      <View style={styles.featureItem}>
                        <View style={styles.featureBullet} />
                        <Text style={styles.featureText}>{vehicleData?.transmission_type || 'Manual'} Transmission</Text>
                      </View>
                      <View style={styles.featureItem}>
                        <View style={styles.featureBullet} />
                        <Text style={styles.featureText}>{vehicleData?.fuel_type || 'Petrol'} Engine</Text>
                      </View>
                      <View style={styles.featureItem}>
                        <View style={styles.featureBullet} />
                        <Text style={styles.featureText}>{vehicleData?.seating_capacity || 2} Seats</Text>
                      </View>
                      <View style={styles.featureItem}>
                        <View style={styles.featureBullet} />
                        <Text style={styles.featureText}>Electric Start</Text>
                      </View>
                      <View style={styles.featureItem}>
                        <View style={styles.featureBullet} />
                        <Text style={styles.featureText}>Disc Brakes</Text>
                      </View>
                      <View style={styles.featureItem}>
                        <View style={styles.featureBullet} />
                        <Text style={styles.featureText}>LED Headlight</Text>
                      </View>
                      <View style={styles.featureItem}>
                        <View style={styles.featureBullet} />
                        <Text style={styles.featureText}>Digital Speedometer</Text>
                      </View>
                      <View style={styles.featureItem}>
                        <View style={styles.featureBullet} />
                        <Text style={styles.featureText}>USB Charging Port</Text>
                      </View>
                    </>
                  )}
                </>
              )}
            </View>
          </View>
        </View>

        {/* Location Section */}
        <View ref={locationRef} style={[styles.sectionContainer, activeTab === 'Location' && styles.activeSection]}>
          <Text style={styles.sectionTitle}>Bike Location</Text>
          <View style={styles.locationContainer}>
            <View style={styles.locationCard}>
              <View style={styles.locationIcon}>
                <MapPin size={24} color="#059669" />
              </View>
              <View style={styles.locationInfo}>
                <Text style={styles.locationAddress}>
                  {vehicleData?.location?.address || 'Location not available'}
                </Text>
                <Text style={styles.locationDistance}>2.1 km away</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Offers Section */}
        <View ref={offersRef} style={[styles.sectionContainer, activeTab === 'Offers' && styles.activeSection]}>
          <Text style={styles.sectionTitle}>Special Offers</Text>
          <View style={styles.offersContainer}>
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
        </View>

        {/* FAQs Section */}
        <View ref={faqsRef} style={styles.faqsContainer}>
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
      </View>
    );
  };

  if (loading) {
    return (
      <ScreenWrapper>
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.push('/bike-selection')} style={styles.backButton}>
              <ArrowLeft size={24} color="#000000" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.profileIcon} onPress={openMenu}>
              <Text style={styles.profileText}>{userData?.first_name?.[0]}{userData?.last_name?.[0]}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.loadingFullContainer}>
            <ActivityIndicator size="large" color="#059669" />
            <Text style={styles.loadingText}>Loading bike details...</Text>
          </View>
        </SafeAreaView>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.push({
            pathname: '/bike-selection',
            params: {
              location: locationParam,
              tripStartDate: tripStartDateParam,
              tripEndDate: tripEndDateParam,
              tripStartTime: tripStartTimeParam,
              tripEndTime: tripEndTimeParam
            }
          })} 
          style={styles.backButton}
        >
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
              <Text style={styles.bikeTitle}>{vehicleData?.vehicle_name || 'Honda Activa 6G'}</Text>
              <Text style={styles.bikeLocation}>{location}</Text>
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

        {/* Bike Info */}
        <View style={styles.bikeInfo}>
          <View style={styles.bikeHeader}>
            <Text style={styles.bikeName}>{vehicleData?.vehicle_name || 'Honda Activa 6G'}</Text>
          </View>
          <Text style={styles.bikeFeatures}>
            {vehicleData?.transmission_type || 'Automatic'} • {vehicleData?.fuel_type || 'Petrol'} • {vehicleData?.seating_capacity || 2} Seats
          </Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {['Photos', 'Reviews', 'Features', 'Location', 'Offers'].map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, activeTab === tab && styles.activeTab]}
                onPress={() => {
                  setActiveTab(tab);
                  switch(tab) {
                    case 'Photos': scrollToSection(photosRef); break;
                    case 'Reviews': scrollToSection(reviewsRef); break;
                    case 'Features': scrollToSection(featuresRef); break;
                    case 'Location': scrollToSection(locationRef); break;
                    case 'Offers': scrollToSection(offersRef); break;
                  }
                }}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Tab Content */}
        {renderTabContent()}

        {/* Bottom Spacing for Fixed Price Bar */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Fixed Price Bar */}
      <View style={styles.priceBar}>
        <View style={styles.priceInfo}>
          <Text style={styles.priceAmount}>₹{totalPrice.toFixed(0)}</Text>
          <Text style={styles.priceBreakup}>for {duration}</Text>
          <View style={styles.priceFeatures}>
            <Text style={styles.priceFeature}>• Helmet</Text>
            <Text style={styles.priceFeature}>• {vehicleData?.transmission_type || 'Automatic'}</Text>
            <Text style={styles.priceFeature}>• Fuel</Text>
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
  loadingFullContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6B7280',
  },
  noImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  noImageText: {
    fontSize: 16,
    color: '#6B7280',
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
  bikeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  bikeLocation: {
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
  bikeInfo: {
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
  bikeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  bikeName: {
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
  bikeFeatures: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  bikeUrl: {
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
  sectionContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  activeSection: {
    backgroundColor: '#F9FAFB',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  photosContainer: {
    marginBottom: 16,
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
    marginBottom: 16,
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
    padding: 20,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    alignItems: 'center',
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