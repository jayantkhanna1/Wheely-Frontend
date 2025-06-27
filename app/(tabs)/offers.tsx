import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Gift, Percent, ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { ScreenWrapper } from '../../components/ScreenWrapper';

const { width } = Dimensions.get('window');

const offersData = [
  {
    id: '1',
    title: 'Get 15% off on your next ride',
    description: 'Use code RIDE15 during checkout.',
  },
  {
    id: '2',
    title: 'Refer & Earn ₹100',
    description: 'Invite friends and earn credits after their first trip.',
  },
  {
    id: '3',
    title: '₹50 Cashback on 3rd Ride',
    description: 'Valid for rides above ₹200.',
  },
];

export default function Offers() {
  return (
    <ScreenWrapper>
    <View style={styles.pageContainer}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Offers</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.headerText}>Exclusive Offers</Text>

        {offersData.map((offer) => (
          <View key={offer.id} style={styles.offerCard}>
            <View style={styles.offerIcon}>
              <Percent size={20} color="#059669" />
            </View>
            <View style={styles.offerTextContainer}>
              <Text style={styles.offerTitle}>{offer.title}</Text>
              <Text style={styles.offerDescription}>{offer.description}</Text>
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.redeemButton}>
          <Gift size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.redeemButtonText}>Redeem Promo Code</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 48,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  placeholder: {
    width: 32, // Matches back button width for balance
  },
  headerText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 24,
  },
  offerCard: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  offerIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  offerTextContainer: {
    flex: 1,
  },
  offerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#065F46',
  },
  offerDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  redeemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#059669',
    paddingVertical: 14,
    borderRadius: 8,
    justifyContent: 'center',
    marginTop: 24,
  },
  redeemButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
