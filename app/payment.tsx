import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView, 
  Image,
  Alert
} from 'react-native';
import { ArrowLeft, CreditCard, Smartphone, Building2, Wallet, ChevronRight, Clock } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';

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
  const vehicleType = params.vehicleType as string || 'car';
  const vehicleName = params.vehicleName as string || 'Lamborghini 2020';
  const price = params.price as string || '20010';
  const duration = params.duration as string || '12 hours';
  const pickupLocation = params.pickupLocation as string || '8XM9+MwC, Special Wing, Prem Nagar...';
  
  const [selectedPayment, setSelectedPayment] = useState('google-pay');
  const [timeLeft, setTimeLeft] = useState(582); // 9:42 minutes in seconds

  // Format time remaining
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')} Minutes`;
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
          name: 'Honda Activa 6G',
          rating: '4.6',
          features: ['Helmet', 'Automatic', 'Fuel']
        };
      case 'cycle':
        return {
          name: 'Trek FX 3 Disc',
          rating: '4.8',
          features: ['Helmet', 'Lock', 'Lights']
        };
      default:
        return {
          name: 'Lamborghini 2020',
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

  const handlePayment = () => {
    if (!selectedPayment) {
      Alert.alert('Error', 'Please select a payment method');
      return;
    }

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
  };

  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedPayment(methodId);
  };

  const handleOtherPaymentSelect = (optionId: string) => {
    // Navigate to specific payment flow or show more options
    Alert.alert('Coming Soon', `${optionId} payment method will be available soon.`);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Complete Payment</Text>
        <View style={styles.timerContainer}>
          <Clock size={16} color="#059669" />
          <Text style={styles.timerText}>price locked for</Text>
          <Text style={styles.timerValue}>{formatTime(timeLeft)}</Text>
        </View>
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
              <Text style={styles.vehicleRating}>{vehicle.rating}</Text>
            </View>
            
            <Text style={styles.vehicleDate}>
              13 Jun '25,8AM (Fri) → 13 Jun '25, 11PM (Fri)
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
            
            <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
              <Text style={styles.payButtonText}>PAY ₹{price}.00</Text>
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    marginLeft: 16,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF8FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  timerText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '500',
  },
  timerValue: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600',
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