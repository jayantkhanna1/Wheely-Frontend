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
  Alert,
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

interface BackendVehicle {
  id: number;
  vehicle_name: string;
  vehicle_brand: string;
  vehicle_model: string;
  vehicle_type: string;
  price_per_hour: string;
  price_per_day: string;
  location: any;
  owner_name: string;
  rating: number;
  is_available: boolean;
  primary_photo: string;
  photos: any[];
  seating_capacity: number;
  fuel_type: string;
  year: string;
  transmission?: string;
  features?: string[];
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

const { width: screenWidth } = Dimensions.get('window');

export default function CycleDetailsScreen() {
  const params = useLocalSearchParams();
  const vehicleId = params.vehicleId as string;
  const locationParam = params.location as string;
  const tripStartDate = params.tripStartDate as string;
  const tripEndDate = params.tripEndDate as string;
  const tripStartTime = params.tripStartTime as string;
  const tripEndTime = params.tripEndTime as string;

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
  const [isAgreed, setIsAgreed] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [vehicleData, setVehicleData] = useState<BackendVehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [cycleImages, setCycleImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Ref for scrolling to sections
  const scrollViewRef = useRef<ScrollView>(null);
  const sectionRefs = {
    photos: useRef<View>(null),
    reviews: useRef<View>(null),
    features: useRef<View>(null),
    location: useRef<View>(null),
    offers: useRef<View>(null),
    faqs: useRef<View>(null),
  };
  
  useEffect(() => {
    loadUserData();
    fetchVehicleDetails();
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

        // Set cycle images
        const images: string[] = [];
        
        // Process photos array
        if (data.photos && Array.isArray(data.photos)) {
          data.photos.forEach((photo: any) => {
            // Check if photo is an object with a 'photo' property
            if (photo && typeof photo === 'object' && photo.photo) {
              images.push(photo.photo);
            } 
            // Check if photo is a string
            else if (typeof photo === 'string') {
              images.push(photo);
            }
          });
        }
        
        // If no images found in photos array, try primary_photo
        if (images.length === 0 && data.primary_photo) {
          images.push(data.primary_photo);
        }
        
        // If still no images, use placeholders
        if (images.length === 0) {
          images.push(
            'https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
            'https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop'
          );
        }
        
        setCycleImages(images);
      } else {
        console.error('Failed to fetch vehicle details');
        Alert.alert('Error', 'Failed to load bicycle details');
        
        // Set default placeholder images
        setCycleImages([
          'https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
          'https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop'
        ]);
      }
    } catch (error) {
      console.error('Error fetching vehicle details:', error);
      Alert.alert('Error', 'Network error. Please check your connection and try again.');
      
      // Set default placeholder images
      setCycleImages([
        'https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
        'https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop'
      ]);
    } finally {
      setLoading(false);
    }
  };

  const [faqs, setFaqs] = useState<FAQ[]>([
    {
      id: '1',
      question: 'What documents do I need to rent a bicycle?',
      answer: 'You need a valid ID proof and a security deposit. No driving license is required for bicycles.',
      expanded: false
    },
    {
      id: '2',
      question: 'Is there a time limit for bicycle rentals?',
      answer: 'Most bicycle rentals are available for hourly, half-day, or full-day periods. Extended rentals are also available.',
      expanded: false
    },
    {
      id: '3',
      question: 'What happens if the bicycle breaks down?',
      answer: 'In case of a breakdown, contact our 24/7 customer support. We\'ll arrange for assistance or a replacement bicycle depending on your location.',
      expanded: false
    },
    {
      id: '4',
      question: 'Are helmets provided with the bicycle?',
      answer: 'Yes, helmets are provided with all bicycle rentals at no extra cost. We prioritize your safety.',
      expanded: false
    },
    {
      id: '5',
      question: 'Can I extend my rental period?',
      answer: 'Yes, you can extend your rental period through the app, subject to availability. It\'s recommended to do this at least 1 hour before your scheduled return time.',
      expanded: false
    },
    {
      id: '6',
      question: 'Is insurance included?',
      answer: 'Basic insurance is included in the rental price. You can opt for premium insurance coverage for an additional fee.',
      expanded: false
    }
  ]);

  const menuSlideAnim = useRef(new Animated.Value(screenWidth)).current;

  // Empty reviews state for the "no reviews" message
  const [hasReviews, setHasReviews] = useState(false);

  const features = vehicleData?.features || [
    '21 Speed Gears',
    'Lightweight Frame',
    'Disc Brakes',
    'Adjustable Seat',
    'LED Lights',
    'Water Bottle Holder',
    'Comfortable Grips',
    'Reflectors',
    'Bell',
    'Eco-Friendly'
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
    setCurrentImageIndex((prev) => (prev + 1) % cycleImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + cycleImages.length) % cycleImages.length);
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

    if (!vehicleData) {
      Alert.alert('Error', 'Vehicle data not available');
      return;
    }

    router.push({
      pathname: '/payment',
      params: {
        vehicleId: vehicleId,
        vehicleType: 'cycle',
        vehicleName: vehicleData.vehicle_name || `${vehicleData.vehicle_brand} ${vehicleData.vehicle_model}`,
        price: vehicleData.price_per_hour,
        duration: '12 hours',
        pickupLocation: vehicleData.location?.address || location,
        tripStartDate: tripStartDate,
        tripEndDate: tripEndDate,
        tripStartTime: tripStartTime,
        tripEndTime: tripEndTime
      }
    });
  };

  // Function to scroll to a specific section
  const scrollToSection = (sectionName: keyof typeof sectionRefs) => {
    const sectionRef = sectionRefs[sectionName];
    if (sectionRef.current && scrollViewRef.current) {
      sectionRef.current.measureLayout(
        // @ts-ignore - This is a valid method but TypeScript doesn't recognize it
        scrollViewRef.current.getInnerViewNode(),
        (_x: number, y: number) => {
          scrollViewRef.current?.scrollTo({ y: y - 20, animated: true });
        },
        () => console.log('Failed to measure layout')
      );
    }
  };

  if (loading) {
    return (
      <ScreenWrapper>
        <SafeAreaView style={styles.container}>
          <View style={styles.loadingFullScreen}>
            <ActivityIndicator size="large" color="#059669" />
            <Text style={styles.loadingText}>Loading bicycle details...</Text>
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
          <TouchableOpacity onPress={() => router.push({
            pathname: '/cycle-selection',
            params: {
              location: location,
              tripStartDate: tripStartDate,
              tripEndDate: tripEndDate,
              tripStartTime: tripStartTime,
              tripEndTime: tripEndTime
            }
          })} style={styles.backButton}>
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
                <Text style={styles.cycleTitle}>
                  {vehicleData ? `${vehicleData.vehicle_brand} ${vehicleData.vehicle_model}` : 'Trek FX 3 Disc'}
                </Text>
                <Text style={styles.cycleLocation}>{location}</Text>
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
                <Text style={styles.dateTimeLabel}>
                  {tripStartDate ? new Date(tripStartDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit' }) : formatDateTime(tripStart, 'date')}
                </Text>
                <Text style={styles.dateTimeValue}>
                  {tripStartTime || formatDateTime(tripStart, 'time')}
                </Text>
                <Edit3 size={12} color="#6B7280" style={styles.editIcon} />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.dateTimeItem}
                onPress={() => handleDateTimeEdit('end')}
              >
                <Text style={styles.dateTimeLabel}>
                  {tripEndDate ? new Date(tripEndDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit' }) : formatDateTime(tripEnd, 'date')}
                </Text>
                <Text style={styles.dateTimeValue}>
                  {tripEndTime || formatDateTime(tripEnd, 'time')}
                </Text>
                <Edit3 size={12} color="#6B7280" style={styles.editIcon} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Cycle Info */}
          <View style={styles.cycleInfo}>
            <View style={styles.cycleHeader}>
              <Text style={styles.cycleName}>
                {vehicleData ? `${vehicleData.vehicle_brand} ${vehicleData.vehicle_model}` : 'Trek FX 3 Disc'}
              </Text>
            </View>
            <Text style={styles.cycleFeatures}>
              {vehicleData ? 
                `${vehicleData.transmission || '21 Speed'} • ${vehicleData.fuel_type || 'Manual'} • ${vehicleData.seating_capacity || 1} Seat` : 
                '24 Speed • Hybrid • Disc Brakes'}
            </Text>
            <Text style={styles.cycleUrl}>https://maps.google.com/25716420/details/712681</Text>
          </View>

          {/* Tabs */}
          <View style={styles.tabsContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <TouchableOpacity
                style={styles.tab}
                onPress={() => scrollToSection('photos')}
              >
                <Text style={styles.tabText}>Photos</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.tab}
                onPress={() => scrollToSection('reviews')}
              >
                <Text style={styles.tabText}>Reviews</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.tab}
                onPress={() => scrollToSection('features')}
              >
                <Text style={styles.tabText}>Features</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.tab}
                onPress={() => scrollToSection('location')}
              >
                <Text style={styles.tabText}>Location</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.tab}
                onPress={() => scrollToSection('offers')}
              >
                <Text style={styles.tabText}>Offers</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          {/* Photos Section */}
          <View ref={sectionRefs.photos} style={styles.photosContainer}>
            <Text style={styles.sectionTitle}>Photos</Text>
            <View style={styles.mainImageContainer}>
              {loading ? (
                <View style={[styles.mainImage, styles.loadingContainer]}>
                  <ActivityIndicator size="large" color="#059669" />
                </View>
              ) : (
                <>
                  <Image 
                    source={{ uri: cycleImages[currentImageIndex] }} 
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
                      {currentImageIndex + 1} / {cycleImages.length}
                    </Text>
                  </View>
                </>
              )}
            </View>
            <View style={styles.thumbnailContainer}>
              {cycleImages.map((image, index) => (
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
              {cycleImages.length > 5 && (
                <View style={styles.morePhotos}>
                  <Text style={styles.morePhotosText}>+{cycleImages.length - 5} more</Text>
                </View>
              )}
            </View>
          </View>

          {/* Reviews Section */}
          <View ref={sectionRefs.reviews} style={styles.reviewsContainer}>
            <Text style={styles.sectionTitle}>Reviews & Rating</Text>
            <View style={styles.ratingOverview}>
              <View style={styles.ratingHeader}>
                <Text style={styles.ratingScore}>{vehicleData?.rating?.toFixed(1) || '4.8'}</Text>
                <View style={styles.ratingStarsContainer}>
                  <View style={styles.ratingStars}>
                    {renderStars(vehicleData?.rating || 4.8)}
                  </View>
                </View>
              </View>
            </View>
            
            {hasReviews ? (
              <View>
                {/* This would show actual reviews if we had them */}
              </View>
            ) : (
              <View style={styles.noReviewsContainer}>
                <Text style={styles.noReviewsText}>No reviews yet</Text>
                <Text style={styles.noReviewsSubtext}>Be the first to review this bicycle after your trip!</Text>
              </View>
            )}
          </View>

          {/* Features Section */}
          <View ref={sectionRefs.features} style={styles.featuresContainer}>
            <Text style={styles.sectionTitle}>Cycle Features</Text>
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
          <View ref={sectionRefs.location} style={styles.locationContainer}>
            <Text style={styles.sectionTitle}>Cycle Location</Text>
            <View style={styles.locationCard}>
              <View style={styles.locationIcon}>
                <MapPin size={24} color="#059669" />
              </View>
              <View style={styles.locationInfo}>
                <Text style={styles.locationAddress}>
                  {vehicleData?.location?.address || 'XUPH, MWC, Special Wing, Saket Colony, Delhi, 110046, India'}
                </Text>
                <Text style={styles.locationDistance}>1.2 km away</Text>
              </View>
            </View>
          </View>

          {/* Offers Section */}
          <View ref={sectionRefs.offers} style={styles.offersContainer}>
            <Text style={styles.sectionTitle}>Special Offers</Text>
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
          <View ref={sectionRefs.faqs} style={styles.faqsContainer}>
            <Text style={styles.sectionTitle}>FAQs</Text>
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
            <Text style={styles.sectionTitle}>Policies and Agreement</Text>
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
            <Text style={styles.priceAmount}>₹{vehicleData?.price_per_hour || '25'}</Text>
            <Text style={styles.priceBreakup}>Price Breakup</Text>
            <View style={styles.priceFeatures}>
              <Text style={styles.priceFeature}>• Helmet</Text>
              <Text style={styles.priceFeature}>• Lock</Text>
              <Text style={styles.priceFeature}>• Lights</Text>
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
  cycleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  cycleLocation: {
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
  cycleInfo: {
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
  cycleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cycleName: {
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
  cycleFeatures: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  cycleUrl: {
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
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#059669',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
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
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  ratingOverview: {
    marginBottom: 24,
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
    padding: 20,
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
  featuresContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
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
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
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
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
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
    borderTopColor: '#F3F4F6',
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
    borderTopColor: '#F3F4F6',
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
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingFullScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6B7280',
  }
});