// AddVehicleScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';

import { VehicleForm, DropdownOption } from '../../types/VehicleTypes';
import Step1BasicInfo from '../../components/Step1BasicInfo';
import Step2VehicleDetails from '../../components/Step2VehicleDetails';
import Step3PricingLocation from '../../components/Step3PricingLocation';
import Step4PhotosDocuments from '../../components/Step4PhotosDocuments';
import Step5Availability from '../../components/Step5Availability';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScreenWrapper } from '../../components/ScreenWrapper';

const AddVehicleScreen: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showDropdown, setShowDropdown] = useState<string | null>(null);

  const [formData, setFormData] = useState<VehicleForm>({
    brand: '',
    model: '',
    year: '',
    color: '',
    licensePlate: '',
    vehicleType: '',
    fuelType: '',
    transmission: '',
    seatingCapacity: '',
    category: '',
    pricePerDay: '',
    pricePerHour: '',
    address: '',
    street: '',
    city: '',
    pincode: '',
    state: '',
    country: '',
    features: [],
    images: [],
    rcDocument: null,
    insuranceDocument: null,
    pucDocument: null,
    availability: null, // Add availability field
  });

  const totalSteps = 5; // Updated to 5 steps

  const updateFormData = (field: keyof VehicleForm, value: string | string[] | any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.brand && formData.model && formData.year && formData.color && formData.licensePlate);
      case 2:
        return !!(formData.fuelType && formData.transmission && formData.seatingCapacity && formData.category);
      case 3:
        return !!(formData.pricePerDay && formData.pricePerHour && formData.address && formData.city && formData.state && formData.country);
      case 4:
        return formData.images.length >= 1; // At least 1 image required
      case 5:
        // Validate availability step
        if (!formData.availability) return false;
        const availability = formData.availability;
        return availability.timeSlots && availability.timeSlots.length > 0;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    } else {
      Alert.alert('Incomplete Information', 'Please fill all required fields before proceeding.');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleBackPress = () => {
    if (currentStep > 1) {
      prevStep();
    } else {
      router.push('/host');
    }
  };
  const capitalizeFirst = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const submitForm = async () => {
    if (validateStep(5)) {
      Alert.alert(
        'Submit Vehicle',
        'Your vehicle will be reviewed and activated within 24-48 hours.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Submit',
            onPress: async () => {
              try {
                console.log('Submitting vehicle data:', formData);

                // Create FormData for multipart/form-data request
                const submitData = new FormData();
                const userData = await AsyncStorage.getItem('user_data');
                console.log('User data:', userData);
                const user = userData ? JSON.parse(userData) : null;
                const owner_id = user ? user.id : null;

                // Map and append basic vehicle information
                submitData.append('owner_id', owner_id?.toString() || '');
                submitData.append('vehicle_name', `${formData.brand} ${formData.model}`);
                submitData.append('vehicle_brand', formData.brand);
                submitData.append('vehicle_model', formData.model);
                submitData.append('vehicle_color', formData.color);
                submitData.append('vehicle_year', formData.year?.toString() || '');
                submitData.append('vehicle_type', formData.vehicleType);
                submitData.append('transmission_type', formData.transmission);
                submitData.append('fuel_type', formData.fuelType);
                submitData.append('seating_capacity', formData.seatingCapacity?.toString() || '');
                submitData.append('price_per_hour', parseFloat(formData.pricePerHour || "0").toFixed(2));
                submitData.append('price_per_day', parseFloat(formData.pricePerDay || "0").toFixed(2));

                // Map location data - send as JSON string
                const locationData = {
                  address: `${formData.address || ''}, ${formData.street || ''}, ${formData.city || ''}`.replace(/^,\s*|,\s*$/g, ''),
                  street: formData.street || '',
                  colony: formData.address || '',
                  road: formData.street || '',
                  pincode: formData.pincode || '',
                  city: formData.city || '',
                  state: formData.state || '',
                  country: formData.country || '',
                  google_map_location: ""
                };
                submitData.append('location', JSON.stringify(locationData));
                submitData.append('availability_slots', JSON.stringify(formData.availability));
                const categ= capitalizeFirst(formData.category) || '';
                submitData.append('is_available', 'true');
                submitData.append('category', categ);
                submitData.append('license_plate', formData.licensePlate || '');
                submitData.append('features', JSON.stringify(formData.features || []));

                // Handle file uploads - Check if documents exist and are valid
                if (formData.rcDocument?.uri) {
                  try {
                    // In React Native, append the file object directly without converting to blob
                    submitData.append('vehicle_rc', {
                      uri: formData.rcDocument.uri,
                      type: formData.rcDocument.mimeType || 'application/pdf',
                      name: formData.rcDocument.name || 'rc_document.pdf',
                    } as any);
                  } catch (error) {
                    console.error('Error processing RC document:', error);
                  }
                }

                if (formData.insuranceDocument?.uri) {
                  try {
                    // In React Native, append the file object directly without converting to blob
                    submitData.append('vehicle_insurance', {
                      uri: formData.insuranceDocument.uri,
                      type: formData.insuranceDocument.mimeType || 'application/pdf',
                      name: formData.insuranceDocument.name || 'insurance_document.pdf',
                    } as any);
                  } catch (error) {
                    console.error('Error processing insurance document:', error);
                  }
                }

                if (formData.pucDocument?.uri) {
                  try {
                    submitData.append('vehicle_pollution_certificate', {
                      uri: formData.pucDocument.uri,
                      type: formData.pucDocument.mimeType || 'application/pdf',
                      name: formData.pucDocument.name || 'puc_document.pdf',
                    } as any);
                  } catch (error) {
                    console.error('Error processing PUC document:', error);
                  }
                }

                // Handle photos - React Native approach
                if (formData.images && formData.images.length > 0) {
                  for (let index = 0; index < formData.images.length; index++) {
                    const imageUri = formData.images[index];
                    try {
                      submitData.append('photos', {
                        uri: imageUri,
                        type: 'image/jpeg',
                        name: `vehicle_photo_${index + 1}.jpg`,
                      } as any);
                    } catch (error) {
                      console.error(`Error processing image ${index + 1}:`, error);
                    }
                  }
                }

                console.log('FormData prepared for submission', submitData);

                // Make API call
                const apiURL = `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/upload/vehicle/`;
                console.log(apiURL)
                const response = await fetch(apiURL, {
                  method: 'POST',
                  body: submitData,
                  headers: {
                    // Remove Content-Type header - let the browser set it automatically for FormData
                    // 'Content-Type': 'multipart/form-data', // Don't set this manually
                    // Add authorization header if needed
                    // 'Authorization': 'Bearer YOUR_TOKEN_HERE',
                  },
                });

                console.log('API Response Status:', response.status);

                if (response.status === 201) {
                  Alert.alert(
                    'Success',
                    'Vehicle submitted successfully!',
                    [
                      {
                        text: 'OK',
                        onPress: () => {
                          router.push('/');
                        }
                      }
                    ]
                  );
                } else {
                  const errorData = await response.json().catch(() => ({}));
                  console.error('API Error Response:', errorData);
                  Alert.alert(
                    'Error',
                    errorData.error || errorData.message || `Failed to submit vehicle. Status: ${response.status}`,
                    [{ text: 'OK' }]
                  );
                }

              } catch (error) {
                console.error('Error submitting vehicle:', error);
                Alert.alert(
                  'Error',
                  'Network error. Please check your connection and try again.',
                  [{ text: 'OK' }]
                );
              }
            }
          },
        ]
      );
    } else {
      Alert.alert('Incomplete Information', 'Please complete all required steps.');
    }
  };

  const renderCurrentStep = () => {
    const stepProps = {
      formData,
      updateFormData,
      showDropdown,
      setShowDropdown,
    };

    switch (currentStep) {
      case 1:
        return <Step1BasicInfo {...stepProps} />;
      case 2:
        return <Step2VehicleDetails {...stepProps} />;
      case 3:
        return <Step3PricingLocation {...stepProps} />;
      case 4:
        return <Step4PhotosDocuments {...stepProps} />;
      case 5:
        return <Step5Availability formData={formData} updateFormData={updateFormData} />;
      default:
        return null;
    }
  };

  return (
    <ScreenWrapper>
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <ArrowLeft size={20} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Vehicle</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${(currentStep / totalSteps) * 100}%` }]} />
        </View>
        <Text style={styles.progressText}>Step {currentStep} of {totalSteps}</Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderCurrentStep()}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNavigation}>
        {currentStep > 1 && (
          <TouchableOpacity style={styles.secondaryButton} onPress={prevStep}>
            <Text style={styles.secondaryButtonText}>Previous</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.primaryButton, currentStep === 1 && styles.fullWidthButton]}
          onPress={currentStep === totalSteps ? submitForm : nextStep}
        >
          <Text style={styles.primaryButtonText}>
            {currentStep === totalSteps ? 'Submit Vehicle' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
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
    width: 36,
  },
  progressContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#059669',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  content: {
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
  },
  halfInput: {
    flex: 1,
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
  }
});

export default AddVehicleScreen;