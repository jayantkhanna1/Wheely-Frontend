// components/Step2PricingLocation.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { StepProps } from '../types/BicycleTypes';

// Indian states and cities for location suggestions
const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 
  'West Bengal'
];

const majorCities = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Ahmedabad', 'Pune', 
  'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 
  'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik', 'Faridabad', 'Meerut', 
  'Rajkot', 'Varanasi', 'Srinagar', 'Aurangabad', 'Dhanbad', 'Amritsar', 'Navi Mumbai', 
  'Allahabad', 'Ranchi', 'Howrah', 'Coimbatore', 'Jabalpur', 'Gwalior', 'Vijayawada', 
  'Jodhpur', 'Madurai', 'Raipur', 'Kota', 'Chandigarh', 'Guwahati', 'Solapur', 'Hubli-Dharwad'
];

interface LocationSuggestion {
  id: string;
  text: string;
  type: 'state' | 'city';
}

const Step2PricingLocation: React.FC<StepProps> = ({ formData, updateFormData }) => {
  const [stateSuggestions, setStateSuggestions] = useState<LocationSuggestion[]>([]);
  const [citySuggestions, setCitySuggestions] = useState<LocationSuggestion[]>([]);
  const [showStateSuggestions, setShowStateSuggestions] = useState(false);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);

  const handleStateChange = (text: string) => {
    updateFormData('state', text);
    
    if (text.length > 0) {
      const filtered = indianStates
        .filter(state => state.toLowerCase().includes(text.toLowerCase()))
        .map((state, index) => ({
          id: `state-${index}`,
          text: state,
          type: 'state' as const
        }));
      
      setStateSuggestions(filtered);
      setShowStateSuggestions(filtered.length > 0);
    } else {
      setShowStateSuggestions(false);
    }
  };

  const handleCityChange = (text: string) => {
    updateFormData('city', text);
    
    if (text.length > 0) {
      const filtered = majorCities
        .filter(city => city.toLowerCase().includes(text.toLowerCase()))
        .map((city, index) => ({
          id: `city-${index}`,
          text: city,
          type: 'city' as const
        }));
      
      setCitySuggestions(filtered);
      setShowCitySuggestions(filtered.length > 0);
    } else {
      setShowCitySuggestions(false);
    }
  };

  const selectState = (state: string) => {
    updateFormData('state', state);
    setShowStateSuggestions(false);
  };

  const selectCity = (city: string) => {
    updateFormData('city', city);
    setShowCitySuggestions(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={100}
    >
      <ScrollView style={styles.container}>
        <View style={styles.stepContent}>
          <Text style={styles.stepTitle}>Pricing & Location</Text>

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Price per Day (₹) *</Text>
              <TextInput
                style={styles.input}
                placeholder="1500"
                value={formData.pricePerDay}
                onChangeText={(text) => updateFormData('pricePerDay', text)}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Price per Hour (₹) *</Text>
              <TextInput
                style={styles.input}
                placeholder="200"
                value={formData.pricePerHour}
                onChangeText={(text) => updateFormData('pricePerHour', text)}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Address *</Text>
            <View style={styles.locationContainer}>
              <View style={styles.mapPinContainer}>
                <MapPin size={18} color="#059669" />
              </View>
              <TextInput
                style={styles.locationInput}
                placeholder="Enter your complete address"
                value={formData.address}
                onChangeText={(text) => updateFormData('address', text)}
                multiline
                numberOfLines={2}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Street</Text>
            <TextInput
              style={styles.input}
              placeholder="Street name"
              value={formData.street}
              onChangeText={(text) => updateFormData('street', text)}
            />
          </View>

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Text style={styles.label}>City *</Text>
              <TextInput
                style={styles.input}
                placeholder="City"
                value={formData.city}
                onChangeText={handleCityChange}
              />
              {showCitySuggestions && (
                <View style={styles.suggestionsContainer}>
                  <FlatList
                    data={citySuggestions}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                      <TouchableOpacity 
                        style={styles.suggestionItem}
                        onPress={() => selectCity(item.text)}
                      >
                        <Text style={styles.suggestionText}>{item.text}</Text>
                      </TouchableOpacity>
                    )}
                    style={styles.suggestionsList}
                    nestedScrollEnabled
                  />
                </View>
              )}
            </View>
            <View style={styles.halfInput}>
              <Text style={styles.label}>State *</Text>
              <TextInput
                style={styles.input}
                placeholder="State"
                value={formData.state}
                onChangeText={handleStateChange}
              />
              {showStateSuggestions && (
                <View style={styles.suggestionsContainer}>
                  <FlatList
                    data={stateSuggestions}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                      <TouchableOpacity 
                        style={styles.suggestionItem}
                        onPress={() => selectState(item.text)}
                      >
                        <Text style={styles.suggestionText}>{item.text}</Text>
                      </TouchableOpacity>
                    )}
                    style={styles.suggestionsList}
                    nestedScrollEnabled
                  />
                </View>
              )}
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Pincode *</Text>
              <TextInput
                style={styles.input}
                placeholder="Pincode"
                value={formData.pincode}
                onChangeText={(text) => updateFormData('pincode', text)}
              />
            </View>

            <View style={styles.halfInput}>
              <Text style={styles.label}>Country *</Text>
              <TextInput
                style={styles.input}
                placeholder="Country"
                value={formData.country}
                onChangeText={(text) => updateFormData('country', text)}
              />
            </View>
          </View>

          <View style={styles.pricingTip}>
            <Text style={styles.tipTitle}>💡 Pricing Tips</Text>
            <Text style={styles.tipText}>
              • Research similar bicycles in your area{'\n'}
              • Consider fuel costs and maintenance{'\n'}
              • Competitive pricing gets more bookings
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Step2PricingLocation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stepContent: {
    padding: 16,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
    position: 'relative',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  halfInput: {
    flex: 1,
    position: 'relative',
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 16,
    color: '#111827',
  },
  placeholderText: {
    color: '#9CA3AF',
  },
  dropdownList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    maxHeight: 200,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#111827',
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  featureChip: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  featureChipSelected: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  featureChipText: {
    fontSize: 12,
    color: '#374151',
  },
  featureChipTextSelected: {
    color: '#FFFFFF',
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
  },
  locationInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    minHeight: 20,
  },
  pricingTip: {
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 12,
    color: '#065F46',
    lineHeight: 18,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 12,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0FDF4',
    borderWidth: 2,
    borderColor: '#059669',
    borderStyle: 'dashed',
    borderRadius: 8,
    paddingVertical: 16,
    gap: 8,
  },
  uploadButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#059669',
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  uploadedImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  documentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    gap: 12,
  },
  documentButtonText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  bottomNavigation: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#059669',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '500',
  },
  fullWidthButton: {
    flex: 1,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
  },
  mapPinContainer: {
    paddingTop: 2,
  },
  imageContainer: {
    position: 'relative',
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#EF4444',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  documentTextContainer: {
    flex: 1,
  },
  documentFileName: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 4,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    maxHeight: 150,
  },
  suggestionsList: {
    maxHeight: 150,
  },
  suggestionItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  suggestionText: {
    fontSize: 14,
    color: '#374151',
  }
});