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
  Animated,
  Dimensions,
  TextInput,
  TouchableWithoutFeedback
} from 'react-native';
import { ArrowLeft, MapPin, Calendar, Clock, Star, Share2, X, ChevronDown, ChevronUp, User, Map as MapIcon, Phone, Gift, Percent, CircleHelp as HelpCircle, FileText, Globe, CreditCard as Edit3, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { router } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform } from 'react-native';

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

export default function CarDetailsScreen() {
  const [location, setLocation] = useState('Saket Colony, Delhi');
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
  const [faqs, setFaqs] = useState<FAQ[]>([
    {
      id: '1',
      question: 'What happens if a Perm employee cannot complete their contracted hours?',
      answer: 'If a permanent employee cannot complete their contracted hours, they should notify their supervisor immediately. Alternative arrangements will be made to ensure coverage.',
      expanded: false
    },
    {
      id: '2',
      question: 'How do I apply for the position of an NDIS Support Worker?',
      answer: 'You can apply through our online portal or contact our HR department directly. All applications require relevant certifications and background checks.',
      expanded: false
    },
    {
      id: '3',
      question: 'What experience is preferred for candidates applying for this role?',
      answer: 'We prefer candidates with at least 2 years of experience in customer service or related fields, along with relevant certifications.',
      expanded: false
    },
    {
      id: '4',
      question: 'Are there any specific certifications required for this role?',
      answer: 'Yes, valid driving license, first aid certification, and NDIS worker screening check are mandatory requirements.',
      expanded: false
    },
    {
      id: '5',
      question: 'How long does the recruitment process typically take?',
      answer: 'The recruitment process typically takes 2-3 weeks from application to final decision, including interviews and background checks.',
      expanded: false
    },
    {
      id: '6',
      question: 'When do I get my shifts?',
      answer: 'Shifts are typically assigned 1 week in advance. You will receive notifications through our mobile app and email.',
      expanded: false
    }
  ]);

  const menuSlideAnim = useRef(new Animated.Value(screenWidth)).current;

  const carImages = [
    'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
    'https://images.pexels.com/photos/3764984/pexels-photo-3764984.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
    'https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
    'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
    'https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop'
  ];

  const reviews: Review[] = [
    {
      id: '1',
      name: 'Ananya Vishnoi',
      rating: 5,
      comment: 'I drove this car around 1500+ kms over 3 days very satisfied with the performance and speed. I recommend this car that an amazing experience, would love to go with this car again in future.',
      date: '2 days ago',
      avatar: 'AV'
    },
    {
      id: '2',
      name: 'Rahul Sharma',
      rating: 5,
      comment: 'Excellent car with amazing performance. The booking process was smooth and the car was in perfect condition.',
      date: '1 week ago',
      avatar: 'RS'
    },
    {
      id: '3',
      name: 'Priya Patel',
      rating: 4,
      comment: 'Great experience overall. The car was clean and well-maintained. Would definitely book again.',
      date: '2 weeks ago',
      avatar: 'PP'
    }
  ];

  const tabs = ['Photos', 'Reviews', 'Features', 'Location', 'Offers'];

  const features = [
    'Automatic Transmission',
    'Petrol Engine',
    'Air Conditioning',
    'Power Steering',
    'ABS Brakes',
    'Airbags',
    'GPS Navigation',
    'Bluetooth Connectivity',
    'USB Charging Ports',
    'Premium Sound System'
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
    setCurrentImageIndex((prev) => (prev + 1) % carImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + carImages.length) % carImages.length);
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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Photos':
        return (
          <View style={styles.photosContainer}>
            <View style={styles.mainImageContainer}>
              <Image source={{ uri: carImages[currentImageIndex] }} style={styles.mainImage} />
              <TouchableOpacity style={styles.prevButton} onPress={prevImage}>
                <ChevronLeft size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.nextButton} onPress={nextImage}>
                <ChevronRight size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <View style={styles.imageCounter}>
                <Text style={styles.imageCounterText}>
                  {currentImageIndex + 1} / {carImages.length}
                </Text>
              </View>
            </View>
            <View style={styles.thumbnailContainer}>
              {carImages.map((image, index) => (
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
              <View style={styles.morePhotos}>
                <Text style={styles.morePhotosText}>+5 more</Text>
              </View>
            </View>
          </View>
        );

      case 'Reviews':
        return (
          <View style={styles.reviewsContainer}>
            <View style={styles.ratingOverview}>
              <Text style={styles.ratingTitle}>Reviews & Rating</Text>
              <View style={styles.ratingHeader}>
                <Text style={styles.ratingScore}>5.0</Text>
                <View style={styles.ratingStars}>
                  {renderStars(5)}
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
          </View>
        );

      case 'Features':
        return (
          <View style={styles.featuresContainer}>
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
        );

      case 'Location':
        return (
          <View style={styles.locationContainer}>
            <Text style={styles.locationTitle}>Car Location</Text>
            <View style={styles.locationCard}>
              <View style={styles.locationIcon}>
                <MapPin size={24} color="#059669" />
              </View>
              <View style={styles.locationInfo}>
                <Text style={styles.locationAddress}>
                  XUPH, MWC, Special Wing, Saket Colony, Delhi, 110046, India
                </Text>
                <Text style={styles.locationDistance}>2.1 km away</Text>
              </View>
            </View>
          </View>
        );

      case 'Offers':
        return (
          <View style={styles.offersContainer}>
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
        );

      default:
        return null;
    }
  };

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

      {/* Scrollable Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Trip Details - Editable */}
        <View style={styles.tripDetails}>
          <View style={styles.tripHeader}>
            <View>
              <Text style={styles.carTitle}>Lamborghini 2020</Text>
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
            <Text style={styles.carName}>Lamborghini 2020</Text>
            <View style={styles.ratingContainer}>
              {renderStars(5)}
              <Text style={styles.reviewCount}>10 Reviews</Text>
            </View>
          </View>
          <Text style={styles.carFeatures}>Automatic • Petrol • 2 Seats</Text>
          <Text style={styles.carUrl}>https://maps.google.com/25716420/details/712681</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, activeTab === tab && styles.activeTab]}
                onPress={() => setActiveTab(tab)}
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
          <View style={styles.policyItem}>
            <View style={styles.checkbox}>
              <Text style={styles.checkmark}>✓</Text>
            </View>
            <Text style={styles.policyText}>
              I hereby agree to the terms and conditions of the Lease Agreement with Host.
            </Text>
          </View>
        </View>

        {/* Bottom Spacing for Fixed Price Bar */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Fixed Price Bar */}
      <View style={styles.priceBar}>
        <View style={styles.priceInfo}>
          <Text style={styles.priceAmount}>₹20,010</Text>
          <Text style={styles.priceBreakup}>Price Breakup</Text>
          <View style={styles.priceFeatures}>
            <Text style={styles.priceFeature}>• Toolkit</Text>
            <Text style={styles.priceFeature}>• Automatic</Text>
            <Text style={styles.priceFeature}>• Headlights</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.bookButton}>
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
  ratingStars: {
    flexDirection: 'row',
    gap: 2,
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
    backgroundColor: '#059669',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
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