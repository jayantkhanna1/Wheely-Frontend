import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView, 
  Image,
  Alert,
  ActivityIndicator
} from 'react-native';
import { ArrowLeft, CreditCard, Smartphone, Building2, Wallet, ChevronRight } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  recommended?: boolean;
  category: 'upi' | 'card' | 'wallet' | 'banking';
}

export default function PaymentScreen() {
  const params = useLocalSearchParams();
  const vehicleId = params.vehicleId as string;
  const vehicleType = params.vehicleType as string || 'car';
  const vehicleName = params.vehicleName as string || 'Vehicle';
  const price = params.price as string || '0';
  const duration = params.duration as string || '12 hours';
  const pickupLocation = params.pickupLocation as string || 'Location not specified';
  const tripStartDate = params.tripStartDate as string;
  const tripEndDate = params.tripEndDate as string;
  const tripStartTime = params.tripStartTime as string;
  const tripEndTime = params.tripEndTime as string;
  
  const [selectedPayment, setSelectedPayment] = useState('google-pay');
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  React.useEffect(() => {
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

  const getVehicleImage = () => {
    switch (vehicleType) {
      case 'bike':
        return 'https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop';
      case 'cycle':
        return 'https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop';
      default:
        return 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop';
    }
  };

  const getVehicleDetails = () => {
    switch (vehicleType) {
      case 'bike':
        return {
          name: vehicleName || 'Honda Activa 6G',
          rating: '4.6',
          features: ['Helmet', 'Automatic', 'Fuel']
        };
      case 'cycle':
        return {
          name: vehicleName || 'Trek FX 3 Disc',
          rating: '4.8',
          features: ['Helmet', 'Lock', 'Lights']
        };
      default:
        return {
          name: vehicleName || 'Car',
          rating: '5.0',
          features: ['Toolkit', 'Automatic', 'Headlights']
        };
    }
  };

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'google-pay',
      name: 'Google Pay',
      description: 'Most Successful Payment Method',
      icon: <View style={styles.googlePayIcon}><Text style={styles.googlePayText}>G Pay</Text></View>,
      recommended: true,
      category: 'upi'
    },
    {
      id: 'phonepe',
      name: 'PhonePe',
      description: 'Quick and secure payments',
      icon: <View style={styles.phonePeIcon}><Text style={styles.phonePeText}>φ</Text></View>,
      category: 'upi'
    },
    {
      id: 'paytm',
      name: 'Paytm UPI',
      description: 'Pay with Paytm wallet or UPI',
      icon: <View style={styles.paytmIcon}><Text style={styles.paytmText}>paytm</Text></View>,
      category: 'upi'
    }
  ];

  const otherPaymentOptions = [
    {
      id: 'card',
      name: 'Credit / Debit / ATM Card',
      description: 'Please ensure your card is enabled for online transactions',
      icon: <CreditCard size={24} color="#374151" />
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      description: 'All major banks are supported',
      icon: <Building2 size={24} color="#374151" />
    },
    {
      id: 'upi-other',
      name: 'UPI',
      description: 'Google Pay, PhonePe, BHIM UPI',
      icon: <View style={styles.upiIcon}><Text style={styles.upiText}>UPI</Text></View>
    },
    {
      id: 'wallet',
      name: 'Mobile Wallet',
      description: 'All major wallets are supported',
      icon: <Wallet size={24} color="#374151" />
    }
  ];

  const vehicle = getVehicleDetails();

  const handlePayment = async () => {
    if (!selectedPayment) {
      Alert.alert('Error', 'Please select a payment method');
      return;
    }

    if (!userData || !userData.id) {
      Alert.alert('Error', 'User data not available. Please log in again.');
      return;
    }

    if (!vehicleId) {
      Alert.alert('Error', 'Vehicle information is missing');
      return;
    }

    setLoading(true);

    try {
      // Prepare booking data
      const bookingData = {
        user_id: userData.id,
        vehicle_id: parseInt(vehicleId),
        start_date: tripStartDate ? new Date(tripStartDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        end_date: tripEndDate ? new Date(tripEndDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        start_time: tripStartTime || '09:00:00',
        end_time: tripEndTime || '18:00:00',
        payment_method: selectedPayment,
        amount: parseFloat(price),
        location: pickupLocation,
        status: 'confirmed'
      };

      console.log('Sending booking request with data:', bookingData);

      // Make API call to book the vehicle
      const apiURL = `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/user/book/`;
      const response = await fetch(apiURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      console.log('Booking response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Booking response data:', data);
        
        // Simulate payment processing
        Alert.alert(
          'Payment Successful!',
          `Your ${vehicleType} has been booked successfully. You will receive a confirmation shortly.`,
          [
            {
              text: 'OK',
              onPress: () => router.replace('/(tabs)')
            }
          ]
        );
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Booking Error Response:', errorData);
        
        Alert.alert(
          'Booking Failed',
          errorData.message || errorData.error || 'Failed to book the vehicle. Please try again.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error during booking:', error);
      Alert.alert(
        'Error',
        'Network error. Please check your connection and try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedPayment(methodId);
  };

  const handleOtherPaymentSelect = (optionId: string) => {
    // Navigate to specific payment flow or show more options
    Alert.alert('Coming Soon', `${optionId} payment method will be available soon.`);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: '2-digit'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Format time for display
  const formatTime = (timeString: string) => {
    try {
      // Handle different time formats
      if (timeString.includes(':')) {
        // If it's already in HH:MM format
        return timeString;
      } else {
        // If it's a full date string
        const date = new Date(timeString);
        return date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
      }
    } catch (error) {
      return timeString;
    }
  };

  return (
    <ScreenWrapper>
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Complete Payment</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Urgency Banner */}
        <View style={styles.urgencyBanner}>
          <Text style={styles.urgencyText}>
            Hurry! Few {vehicleType}s are left - secure your booking now
          </Text>
        </View>

        {/* Vehicle Details Card */}
        <View style={styles.vehicleCard}>
          <View style={styles.vehicleImageContainer}>
            <Image source={{ uri: getVehicleImage() }} style={styles.vehicleImage} />
            <Image source={{ uri: getVehicleImage() }} style={styles.vehicleImageSmall} />
          </View>
          
          <View style={styles.vehicleInfo}>
            <View style={styles.vehicleHeader}>
              <Text style={styles.vehicleName}>{vehicle.name}</Text>
            </View>
            
            <Text style={styles.vehicleDate}>
              {formatDate(tripStartDate as string)}, {formatTime(tripStartTime as string)} → {formatDate(tripEndDate as string)}, {formatTime(tripEndTime as string)}
            </Text>
            
            <Text style={styles.pickupLocation}>
              Pickup from: {pickupLocation}
            </Text>
            
            <View style={styles.priceSection}>
              <Text style={styles.priceLabel}>Pay: ₹{price}</Text>
              <TouchableOpacity>
                <Text style={styles.viewDetails}>View Details</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Recommended UPI Option */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommended UPI Option</Text>
          
          <View style={styles.paymentMethodCard}>
            <TouchableOpacity
              style={[styles.paymentMethod, selectedPayment === 'google-pay' && styles.paymentMethodSelected]}
              onPress={() => handlePaymentMethodSelect('google-pay')}
            >
              <View style={styles.paymentMethodLeft}>
                <View style={styles.googlePayIcon}>
                  <Text style={styles.googlePayText}>G Pay</Text>
                </View>
                <View style={styles.paymentMethodInfo}>
                  <Text style={styles.paymentMethodName}>Google Pay</Text>
                  <Text style={styles.paymentMethodDesc}>Most Successful Payment Method</Text>
                </View>
              </View>
              <View style={[styles.radioButton, selectedPayment === 'google-pay' && styles.radioButtonSelected]} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.payButton, loading && styles.payButtonDisabled]} 
              onPress={handlePayment}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.payButtonText}>PAY ₹{price}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* More UPI Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>More UPI Options</Text>
          
          <View style={styles.paymentOptionsCard}>
            {paymentMethods.slice(1).map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[styles.paymentOption, selectedPayment === method.id && styles.paymentOptionSelected]}
                onPress={() => handlePaymentMethodSelect(method.id)}
              >
                <View style={styles.paymentOptionLeft}>
                  {method.icon}
                  <Text style={styles.paymentOptionName}>{method.name}</Text>
                </View>
                <View style={[styles.radioButton, selectedPayment === method.id && styles.radioButtonSelected]} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Other Payment Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Other Payment Options</Text>
          
          <View style={styles.otherOptionsCard}>
            {otherPaymentOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.otherOption}
                onPress={() => handleOtherPaymentSelect(option.id)}
              >
                <View style={styles.otherOptionLeft}>
                  {option.icon}
                  <View style={styles.otherOptionInfo}>
                    <Text style={styles.otherOptionName}>{option.name}</Text>
                    <Text style={styles.otherOptionDesc}>{option.description}</Text>
                  </View>
                </View>
                <ChevronRight size={20} color="#9CA3AF" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Payment Logos */}
        <View style={styles.paymentLogos}>
          <View style={styles.logoItem}>
            <Text style={styles.logoText}>VISA</Text>
          </View>
          <View style={styles.logoItem}>
            <Text style={styles.logoText}>Mastercard</Text>
          </View>
          <View style={styles.logoItem}>
            <Text style={styles.logoText}>RuPay</Text>
          </View>
          <View style={styles.logoItem}>
            <Text style={styles.logoText}>UPI</Text>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  content: {
    flex: 1,
  },
  urgencyBanner: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  urgencyText: {
    fontSize: 14,
    color: '#92400E',
    fontWeight: '500',
    textAlign: 'center',
  },
  vehicleCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  vehicleImageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  vehicleImage: {
    width: 120,
    height: 80,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  vehicleImageSmall: {
    width: 120,
    height: 80,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  vehicleInfo: {
    gap: 8,
  },
  vehicleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vehicleName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  vehicleRating: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
  },
  vehicleDate: {
    fontSize: 14,
    color: '#6B7280',
  },
  pickupLocation: {
    fontSize: 14,
    color: '#6B7280',
  },
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  priceLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  viewDetails: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '600',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  paymentMethodCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    marginBottom: 16,
  },
  paymentMethodSelected: {
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  paymentMethodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  paymentMethodInfo: {
    gap: 2,
  },
  paymentMethodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  paymentMethodDesc: {
    fontSize: 14,
    color: '#6B7280',
  },
  googlePayIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4285F4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  googlePayText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  phonePeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#5F259F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  phonePeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  paytmIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#00BAF2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paytmText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  upiIcon: {
    width: 24,
    height: 24,
    borderRadius: 4,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
  },
  upiText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
  },
  radioButtonSelected: {
    borderColor: '#059669',
    backgroundColor: '#059669',
    position: 'relative',
  },
  payButton: {
    backgroundColor: '#059669',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  payButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  payButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  paymentOptionsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  paymentOptionSelected: {
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginHorizontal: -12,
  },
  paymentOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  paymentOptionName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  otherOptionsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  otherOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  otherOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  otherOptionInfo: {
    flex: 1,
    gap: 2,
  },
  otherOptionName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  otherOptionDesc: {
    fontSize: 14,
    color: '#6B7280',
  },
  paymentLogos: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    marginTop: 24,
    paddingHorizontal: 20,
  },
  logoItem: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
  },
  logoText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  bottomSpacing: {
    height: 40,
  },
});