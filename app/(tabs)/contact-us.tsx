import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  SafeAreaView,
} from 'react-native';
import {
  ArrowLeft,
  Phone,
  Mail,
  MessageCircle,
  MapPin,
  Clock,
  HelpCircle,
} from 'lucide-react-native';
import { router } from 'expo-router';
import { ScreenWrapper } from '../../components/ScreenWrapper';

export default function ContactUsPage() {
  const handleCall = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  const handleWhatsApp = () => {
    Linking.openURL('https://wa.me/1234567890');
  };

  return (
    <ScreenWrapper>
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contact Us</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>We're Here to Help</Text>
          <Text style={styles.heroSubtitle}>
            Get in touch with us for any questions, support, or feedback
          </Text>
        </View>

        {/* Quick Contact Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Contact</Text>
          
          <TouchableOpacity 
            style={styles.contactCard}
            onPress={() => handleCall('+1234567890')}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#059669' }]}>
              <Phone size={20} color="#FFFFFF" />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactTitle}>Call Us</Text>
              <Text style={styles.contactSubtitle}>+91 12345 67890</Text>
              <Text style={styles.contactTime}>24/7 Available</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.contactCard}
            onPress={handleWhatsApp}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#25D366' }]}>
              <MessageCircle size={20} color="#FFFFFF" />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactTitle}>WhatsApp</Text>
              <Text style={styles.contactSubtitle}>Chat with us instantly</Text>
              <Text style={styles.contactTime}>Response within 5 mins</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.contactCard}
            onPress={() => handleEmail('support@yourapp.com')}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#3B82F6' }]}>
              <Mail size={20} color="#FFFFFF" />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactTitle}>Email Support</Text>
              <Text style={styles.contactSubtitle}>support@yourapp.com</Text>
              <Text style={styles.contactTime}>Response within 24 hours</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Office Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Office</Text>
          
          <View style={styles.officeCard}>
            <View style={styles.officeHeader}>
              <MapPin size={20} color="#059669" />
              <Text style={styles.officeTitle}>Head Office</Text>
            </View>
            <Text style={styles.officeAddress}>
              123 Business District,{'\n'}
              Koramangala, Bangalore - 560034{'\n'}
              Karnataka, India
            </Text>
          </View>

          <View style={styles.officeCard}>
            <View style={styles.officeHeader}>
              <Clock size={20} color="#059669" />
              <Text style={styles.officeTitle}>Business Hours</Text>
            </View>
            <Text style={styles.officeAddress}>
              Monday - Friday: 9:00 AM - 6:00 PM{'\n'}
              Saturday: 10:00 AM - 4:00 PM{'\n'}
              Sunday: Closed
            </Text>
          </View>
        </View>

        {/* FAQ Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          
          <TouchableOpacity style={styles.faqCard}>
            <HelpCircle size={16} color="#059669" />
            <Text style={styles.faqText}>How do I cancel my booking?</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.faqCard}>
            <HelpCircle size={16} color="#059669" />
            <Text style={styles.faqText}>What are the payment methods accepted?</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.faqCard}>
            <HelpCircle size={16} color="#059669" />
            <Text style={styles.faqText}>How do I track my ride?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View All FAQs</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  heroSection: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  section: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  contactSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  contactTime: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '500',
  },
  officeCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  officeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  officeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 8,
  },
  officeAddress: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  faqCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  faqText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 12,
    flex: 1,
  },
  viewAllButton: {
    alignItems: 'center',
    padding: 16,
    marginTop: 8,
  },
  viewAllText: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '600',
  },
});
