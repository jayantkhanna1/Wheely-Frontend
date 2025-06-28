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

const { width: screenWidth } = Dimensions.get('window');

export default function BikeDetailsScreen() {
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
  const [activeTab, setActiveTab] = useState('Photos');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAgreed, setIsAgreed] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [vehicleData, setVehicleData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);
  const [duration, setDuration] = useState('');
  
  useEffect(() => {
    loadUserData();
    fetchVehicleDetails();
    
    // Parse dates from URL params
    if (tripStartDate && tripEndDate && tripStartTime && tripEndTime) {
      try {
        const parsedStartDate = parseDateTime(tripStartDate, tripStartTime);
        const parsedEndDate = parseDateTime(tripEndDate, tripEndTime);
        
        if (parsedStartDate) setTripStart(parsedStartDate);
        if (parsedEndDate) setTripEnd(parsedEndDate);
        
        // Calculate price and duration
        if (parsedStartDate && parsedEndDate && vehicleData) {
          calculatePriceAndDuration(parsedStartDate, parsedEndDate);
        }
      } catch (error) {
        console.error('Error parsing dates:', error);
      }
    }
  }, [vehicleData]);
  
  // Helper function to parse date and time from URL params
  const parseDateTime = (dateStr: string, timeStr: string): Date | null => {
    try {
      // Handle different date formats
      let date: Date;
      
      if (dateStr.includes('T')) {
        // If it's already an ISO string
        date = new Date(dateStr);
      } else {
        // If it's just a date string like YYYY-MM-DD
        date = new Date(dateStr);
      }
      
      // Now handle the time part
      if (timeStr) {
        const timeParts = timeStr.match(/(\d+):(\d+)(?::(\d+))?\s*(am|pm)?/i);
        if (timeParts) {
          let hours = parseInt(timeParts[1], 10);
          const minutes = parseInt(timeParts[2], 10);
          const seconds = timeParts[3] ? parseInt(timeParts[3], 10) : 0;
          const period = timeParts[4]?.toLowerCase();
          
          // Convert to 24-hour format if needed
          if (period === 'pm' && hours < 12) hours += 12;
          if (period === 'am' && hours === 12) hours = 0;
          
          date.setHours(hours, minutes, seconds);
        }
      }
      
      return date;
    } catch (error) {
      console.error('Error parsing date/time:', error);
      return null;
    }
  };
  
  // Calculate price based on duration
  const calculatePriceAndDuration = (startDate: Date, endDate: Date) => {
    if (!vehicleData) return;
    
    const hourlyRate = parseFloat(vehicleData.price_per_hour) || 0;
    const dailyRate = parseFloat(vehicleData.price_per_day) || 0;
    
    // Calculate duration in milliseconds
    const durationMs = endDate.getTime() - startDate.getTime();
    
    // Convert to hours and days
    const durationHours = durationMs / (1000 * 60 * 60);
    const durationDays = durationHours / 24;
    
    // Calculate price
    let price = 0;
    let durationText = '';
    
    if (durationHours < 24) {
      // Round up to the next hour
      const roundedHours = Math.ceil(durationHours);
      price = roundedHours * hourlyRate;
      durationText = `${roundedHours} hour${roundedHours !== 1 ? 's' : ''}`;
    } else {
      // Calculate full days and remaining hours
      const fullDays = Math.floor(durationDays);
      const remainingHours = Math.ceil(durationHours - (fullDays * 24));
      
      // Calculate price: (full days * daily rate) + (remaining hours * hourly rate)
      price = (fullDays * dailyRate) + (remainingHours * hourlyRate);
      
      if (remainingHours > 0) {
        durationText = `${fullDays} day${fullDays !== 1 ? 's' : ''} and ${remainingHours} hour${remainingHours !== 1 ? 's' : ''}`;
      } else {
        durationText = `${fullDays} day${fullDays !== 1 ? 's' : ''}`;
      }
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
      const apiURL = `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/vehicles/${vehicleId}/`;
      console.log('Fetching vehicle details from:', apiURL);
      
      const response = await fetch(apiURL);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Vehicle details:', data);
        setVehicleData(data);
        
        // Update bike images
        if (data.photos && data.photos.length > 0) {
          setBikeImages(data.photos.map((photo: any) => photo.photo_url));
        }
        
        // Calculate price and duration once we have the vehicle data
        if (tripStart && tripEnd) {
          calculatePriceAndDuration(tripStart, tripEnd);
        }
      } else {
        console.error('Failed to fetch vehicle details:', response.status);
        Alert.alert('Error', 'Failed to load bike details');
      }
    } catch (error) {
      console.error('Error fetching vehicle details:', error);
      Alert.alert('Error', 'Network error while loading bike details');
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
      answer: 'Yes, we provide the bike with a full tank. You are expected to return it with a full tank, or we charge for the missing fuel plus a service fee.',
      expanded: false
    },
    {
      id: '3',
      question: 'What happens if the bike breaks down?',
      answer: 'In case of a breakdown, call our 24/7 roadside assistance. We'll either fix the issue or provide a replacement bike as soon as possible.',
      expanded: false
    },
    {
      id: '4',
      question: 'Is there a mileage limit for rentals?',
      answer: 'Most of our rentals come with unlimited mileage. Any exceptions will be clearly mentioned in the bike details.',
      expanded: false
    },
    {
      id: '5',
      question: 'Do you provide helmets with the bike?',
      answer: 'Yes, we provide DOT-approved helmets for the rider and passenger at no extra cost.',
      expanded: false
    },
    {
      id: '6',
      question: 'What is the cancellation policy?',
      answer: 'Free cancellation up to 24 hours before pickup. Cancellations within 24 hours may incur a fee of up to 50% of the rental cost.',
      expanded: false
    }
  ]);

  const menuSlideAnim = useRef(new Animated.Value(screenWidth)).current;

  const [bikeImages, setBikeImages] = useState([
    'https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
    'https://images.pexels.com/photos/1119796/pexels-photo-1119796.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
    'https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
    'https://images.pexels.com/photos/1119796/pexels-photo-1119796.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
    'https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop'
  ]);

  const reviews: Review[] = [
    {
      id: '1',
      name: 'Ananya Vishnoi',
      rating: 5,
      comment: 'I rode this bike around 150+ kms over 3 days very satisfied with the performance and mileage. I recommend this bike that an amazing experience, would love to go with this bike again in future.',
      date: '2 days ago',
      avatar: 'AV'
    },
    {
      id: '2',
      name: 'Rahul Sharma',
      rating: 5,
      comment: 'Excellent bike with amazing performance. The booking process was smooth and the bike was in perfect condition.',
      date: '1 week ago',
      avatar: 'RS'
    },
    {
      id: '3',
      name: 'Priya Patel',
      rating: 4,
      comment: 'Great experience overall. The bike was clean and well-maintained. Would definitely book again.',
      date: '2 weeks ago',
      avatar: 'PP'
    }
  ];

  const tabs = ['Photos', 'Reviews', 'Features', 'Location', 'Offers'];

  const features = [
    'Automatic Transmission',
    'Petrol Engine',
    'Electric Start',
    'Disc Brakes',
    'LED Headlight',
    'Digital Speedometer',
    'USB Charging Port',
    'Under Seat Storage',
    'Comfortable Seating',
    'Fuel Efficient'
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
      
      // Recalculate price when dates change
      if (vehicleData) {
        calculatePriceAndDuration(
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
    setCurrentImageIndex((prev) => (prev + 1) % bikeImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + bikeImages.length) % bikeImages.length);
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
        tripStartDate: tripStart.toISOString(),
        tripEndDate: tripEnd.toISOString(),
        tripStartTime: formatDateTime(tripStart, 'time'),
        tripEndTime: formatDateTime(tripEnd, 'time')
      }
    });
  };

  const scrollViewRef = useRef<ScrollView>(null);
  
  const scrollToSection = (tabName: string) => {
    setActiveTab(tabName);
    
    // Scroll to the appropriate section
    if (scrollViewRef.current) {
      let yOffset = 0;
      
      switch (tabName) {
        case 'Photos':
          yOffset = 500; // Approximate position of Photos section
          break;
        case 'Reviews':
          yOffset = 900; // Approximate position of Reviews section
          break;
        case 'Features':
          yOffset = 1300; // Approximate position of Features section
          break;
        case 'Location':
          yOffset = 1500; // Approximate position of Location section
          break;
        case 'Offers':
          yOffset = 1700; // Approximate position of Offers section
          break;
      }
      
      scrollViewRef.current.scrollTo({ y: yOffset, animated: true });
    }
  };

  if (loading) {
    return (
      <ScreenWrapper>
        <SafeAreaView style={styles.container}>
          <View style={styles.loadingContainer}>
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
        <TouchableOpacity onPress={() => router.push({
          pathname: '/bike-selection',
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
            {vehicleData?.transmission || 'Automatic'} • 
            {vehicleData?.fuel_type || 'Petrol'} • 
            {vehicleData?.seating_capacity || '2'} Seats
          </Text>
          <Text style={styles.bikeUrl}>https://maps.google.com/25716420/details/712681</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, activeTab === tab && styles.activeTab]}
                onPress={() => scrollToSection(tab)}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Photos Section */}
        <View style={styles.sectionContainer} id="photos-section">
          <Text style={styles.sectionTitle}>Photos</Text>
          <View style={styles.photosContainer}>
            <View style={styles.mainImageContainer}>
              <Image 
                source={{ 
                  uri: bikeImages.length > 0 
                    ? bikeImages[currentImageIndex] 
                    : 'https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop'
                }} 
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
                  {currentImageIndex + 1} / {bikeImages.length}
                </Text>
              </View>
            </View>
            <View style={styles.thumbnailContainer}>
              {bikeImages.slice(0, 4).map((image, index) => (
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
              {bikeImages.length > 4 && (
                <View style={styles.morePhotos}>
                  <Text style={styles.morePhotosText}>+{bikeImages.length - 4} more</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Reviews Section */}
        <View style={styles.sectionContainer} id="reviews-section">
          <Text style={styles.sectionTitle}>Reviews & Rating</Text>
          <View style={styles.reviewsContainer}>
            {reviews.length > 0 ? (
              <>
                <View style={styles.ratingOverview}>
                  <View style={styles.ratingHeader}>
                    <Text style={styles.ratingScore}>
                      {vehicleData?.rating?.toFixed(1) || '4.6'}
                    </Text>
                    <View style={styles.ratingStarsContainer}>
                      <View style={styles.ratingStars}>
                        {renderStars(vehicleData?.rating || 4.6)}
                      </View>
                      <Text style={styles.reviewCount}>{reviews.length} Reviews</Text>
                    </View>
                  </View>
                </View>

                {reviews.map((item) => (
                  <View key={item.id} style={styles.reviewCard}>
                    <View style={styles.reviewHeader}>
                      <View style={styles.reviewerInfo}>
                        <View style={styles.reviewerAvatar}>
                          <Text style={styles.reviewerAvatarText}>{item.avatar}</Text>
                        </View>
                        <View>
                          <Text style={styles.reviewerName}>{item.name}</Text>
                          <Text style={styles.reviewDate}>{item.date}</Text>
                        </View>
                      </View>
                      <View style={styles.reviewRating}>
                        {renderStars(item.rating)}
                      </View>
                    </View>
                    <Text style={styles.reviewComment}>{item.comment}</Text>
                  </View>
                ))}
              </>
            ) : (
              <View style={styles.noReviewsContainer}>
                <Text style={styles.noReviewsText}>No reviews yet</Text>
                <Text style={styles.noReviewsSubtext}>Be the first to review this bike after your trip!</Text>
              </View>
            )}
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.sectionContainer} id="features-section">
          <Text style={styles.sectionTitle}>Features</Text>
          <View style={styles.featuresContainer}>
            <View style={styles.featuresList}>
              {(vehicleData?.features || features).map((feature: string, index: number) => (
                <View key={index} style={styles.featureItem}>
                  <View style={styles.featureBullet} />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Location Section */}
        <View style={styles.sectionContainer} id="location-section">
          <Text style={styles.sectionTitle}>Location</Text>
          <View style={styles.locationContainer}>
            <View style={styles.locationCard}>
              <View style={styles.locationIcon}>
                <MapPin size={24} color="#059669" />
              </View>
              <View style={styles.locationInfo}>
                <Text style={styles.locationAddress}>
                  {vehicleData?.location?.address || 'XUPH, MWC, Special Wing, Saket Colony, Delhi, 110046, India'}
                </Text>
                <Text style={styles.locationDistance}>2.1 km away</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Offers Section */}
        <View style={styles.sectionContainer} id="offers-section">
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
            <Text style={styles.priceFeature}>• Helmet</Text>
            <Text style={styles.priceFeature}>• {vehicleData?.transmission || 'Automatic'}</Text>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  photosContainer: {
    marginTop: 10,
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
    marginTop: 10,
  },
  noReviewsContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
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
    marginTop: 10,
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
    marginTop: 10,
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
    marginTop: 10,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
});