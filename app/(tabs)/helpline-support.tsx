import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Linking,
} from 'react-native';
import { ArrowLeft, Phone, MessageCircle, HelpCircle } from 'lucide-react-native';
import { router } from 'expo-router';
import { ScreenWrapper } from '../../components/ScreenWrapper';

export default function HelplineSupport() {
  return (
    <ScreenWrapper>
    <SafeAreaView style={styles.container}>
    <View style={styles.page}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Helpline Support</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.card} onPress={() => Linking.openURL('tel:18001234567')}>
          <Phone size={20} color="#059669" style={styles.cardIcon} />
          <View>
            <Text style={styles.cardTitle}>Call Us</Text>
            <Text style={styles.cardSubtitle}>24/7 available</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => Linking.openURL('mailto:support@example.com')}>
          <MessageCircle size={20} color="#059669" style={styles.cardIcon} />
          <View>
            <Text style={styles.cardTitle}>Email Us</Text>
            <Text style={styles.cardSubtitle}>Replies within 24 hours</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <HelpCircle size={20} color="#059669" style={styles.cardIcon} />
          <View>
            <Text style={styles.cardTitle}>FAQs</Text>
            <Text style={styles.cardSubtitle}>Find answers quickly</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
    </SafeAreaView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  page: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 48,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  cardIcon: {
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#065F46',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
});
