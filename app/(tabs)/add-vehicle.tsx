import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Alert,
  Image,
  Modal,
  FlatList,
} from 'react-native';
import {
  ArrowLeft,
  Camera,
  Upload,
  MapPin,
  Calendar,
  DollarSign,
  Car,
  Fuel,
  Users,
  Settings,
  CheckCircle,
  ChevronDown,
  X,
} from 'lucide-react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

interface VehicleForm {
  // Basic Information
  brand: string;
  make: string;
  model: string;
  year: string;
  color: string;
  licensePlate: string;

  // Vehicle Details
  fuelType: string;
  transmission: string;
  seatingCapacity: string;
  category: string;

  // Pricing & Availability
  pricePerDay: string;
  pricePerHour: string;

  // Location Details
  address: string;
  street: string;
  city: string;
  state: string;
  country: string;

  // Features
  features: string[];

  // Documents & Images
  images: string[];
  rcDocument: any;
  insuranceDocument: any;
  pucDocument: any;
}

interface DropdownOption {
  label: string;
  value: string;
}

const AddVehicleScreen: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showDropdown, setShowDropdown] = useState<string | null>(null);

  const [formData, setFormData] = useState<VehicleForm>({
    brand: '',
    make: '',
    model: '',
    year: '',
    color: '',
    licensePlate: '',
    fuelType: '',
    transmission: '',
    seatingCapacity: '',
    category: '',
    pricePerDay: '',
    pricePerHour: '',
    address: '',
    street: '',
    city: '',
    state: '',
    country: '',
    features: [],
    images: [],
    rcDocument: null,
    insuranceDocument: null,
    pucDocument: null,
  });

  const totalSteps = 4;

  // Dropdown options
  const brandOptions: DropdownOption[] = [
    { label: 'Maruti Suzuki', value: 'maruti' },
    { label: 'Hyundai', value: 'hyundai' },
    { label: 'Honda', value: 'honda' },
    { label: 'Toyota', value: 'toyota' },
    { label: 'Mahindra', value: 'mahindra' },
    { label: 'Tata', value: 'tata' },
    { label: 'Ford', value: 'ford' },
    { label: 'Volkswagen', value: 'volkswagen' },
    { label: 'BMW', value: 'bmw' },
    { label: 'Mercedes-Benz', value: 'mercedes' },
    { label: 'Audi', value: 'audi' },
    { label: 'Other', value: 'other' },
  ];

  const fuelTypes: DropdownOption[] = [
    { label: 'Petrol', value: 'petrol' },
    { label: 'Diesel', value: 'diesel' },
    { label: 'CNG', value: 'cng' },
    { label: 'Electric', value: 'electric' },
    { label: 'Hybrid', value: 'hybrid' },
  ];

  const transmissionTypes: DropdownOption[] = [
    { label: 'Manual', value: 'manual' },
    { label: 'Automatic', value: 'automatic' },
    { label: 'CVT', value: 'cvt' },
  ];

  const seatingOptions: DropdownOption[] = [
    { label: '2 Seater', value: '2' },
    { label: '4 Seater', value: '4' },
    { label: '5 Seater', value: '5' },
    { label: '7 Seater', value: '7' },
    { label: '8+ Seater', value: '8+' },
  ];

  const categoryOptions: DropdownOption[] = [
    { label: 'Hatchback', value: 'hatchback' },
    { label: 'Sedan', value: 'sedan' },
    { label: 'SUV', value: 'suv' },
    { label: 'MUV', value: 'muv' },
    { label: 'Luxury', value: 'luxury' },
    { label: 'Sports', value: 'sports' },
  ];

  const availableFeatures = [
    'Air Conditioning',
    'Bluetooth',
    'GPS Navigation',
    'Backup Camera',
    'Sunroof',
    'Leather Seats',
    'Cruise Control',
    'Parking Sensors',
    'Music System',
    'USB Charging',
    'Power Windows',
    'Central Locking',
  ];

  const updateFormData = (field: keyof VehicleForm, value: string | string[] | any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleFeature = (feature: string) => {
    const updatedFeatures = formData.features.includes(feature)
      ? formData.features.filter(f => f !== feature)
      : [...formData.features, feature];
    updateFormData('features', updatedFeatures);
  };

  const handleImagePicker = async () => {
    if (formData.images.length >= 8) {
      Alert.alert('Maximum Photos', 'You can upload maximum 8 photos');
      return;
    }

    Alert.alert(
      'Add Vehicle Photos',
      'Choose an option',
      [
        { text: 'Camera', onPress: () => openCamera() },
        { text: 'Gallery', onPress: () => openGallery() },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const openCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Camera permission is required to take photos');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      const newImages = [...formData.images, result.assets[0].uri];
      updateFormData('images', newImages);
    }
  };

  const openGallery = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Gallery permission is required to select photos');
      return;
    }

    const remainingSlots = 8 - formData.images.length;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: remainingSlots,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      const newImages = [...formData.images, ...result.assets.map(asset => asset.uri)];
      updateFormData('images', newImages);
    }
  };

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    updateFormData('images', newImages);
  };

  const handleDocumentPicker = async (docType: string) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        const docField = docType.includes('RC') ? 'rcDocument' :
          docType.includes('Insurance') ? 'insuranceDocument' : 'pucDocument';
        updateFormData(docField, result.assets[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.brand && formData.make && formData.model && formData.year && formData.color && formData.licensePlate);
      case 2:
        return !!(formData.fuelType && formData.transmission && formData.seatingCapacity && formData.category);
      case 3:
        return !!(formData.pricePerDay && formData.pricePerHour && formData.address && formData.city && formData.state && formData.country);
      case 4:
        return formData.images.length >= 5; // At least 5 images required
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

  const submitForm = () => {
    if (validateStep(4)) {
      Alert.alert(
        'Submit Vehicle',
        'Your vehicle will be reviewed and activated within 24-48 hours.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Submit',
            onPress: () => {
              console.log('Submitting vehicle data:', formData);
              // Here you would typically make an API call to submit the data
              router.back();
            }
          },
        ]
      );
    } else {
      Alert.alert('Incomplete Information', 'Please complete all required steps.');
    }
  };

  const renderDropdown = (
    field: keyof VehicleForm,
    options: DropdownOption[],
    placeholder: string
  ) => (
    <View style={styles.inputContainer}>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setShowDropdown(showDropdown === field ? null : field)}
      >
        <Text style={[styles.dropdownText, !formData[field] && styles.placeholderText]}>
          {formData[field] ? options.find(opt => opt.value === formData[field])?.label : placeholder}
        </Text>
        <ChevronDown size={20} color="#6B7280" />
      </TouchableOpacity>

      {showDropdown === field && (
        <ScrollView style={styles.dropdownList} nestedScrollEnabled>
          {options.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={styles.dropdownItem}
              onPress={() => {
                updateFormData(field, option.value);
                setShowDropdown(null);
              }}
            >
              <Text style={styles.dropdownItemText}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );

  const renderStep1 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Basic Vehicle Information</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Vehicle Brand *</Text>
        {renderDropdown('brand', brandOptions, 'Select vehicle brand')}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Vehicle Make *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Honda, Maruti, Toyota"
          value={formData.make}
          onChangeText={(text) => updateFormData('make', text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Model *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., City, Swift, Innova"
          value={formData.model}
          onChangeText={(text) => updateFormData('model', text)}
        />
      </View>

      <View style={styles.row}>
        <View style={styles.halfInput}>
          <Text style={styles.label}>Year *</Text>
          <TextInput
            style={styles.input}
            placeholder="2020"
            value={formData.year}
            onChangeText={(text) => updateFormData('year', text)}
            keyboardType="numeric"
            maxLength={4}
          />
        </View>
        <View style={styles.halfInput}>
          <Text style={styles.label}>Color *</Text>
          <TextInput
            style={styles.input}
            placeholder="White"
            value={formData.color}
            onChangeText={(text) => updateFormData('color', text)}
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>License Plate Number *</Text>
        <TextInput
          style={styles.input}
          placeholder="MH01AB1234"
          value={formData.licensePlate}
          onChangeText={(text) => updateFormData('licensePlate', text.toUpperCase())}
          autoCapitalize="characters"
        />
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Vehicle Details</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Fuel Type *</Text>
        {renderDropdown('fuelType', fuelTypes, 'Select fuel type')}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Transmission *</Text>
        {renderDropdown('transmission', transmissionTypes, 'Select transmission')}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Seating Capacity *</Text>
        {renderDropdown('seatingCapacity', seatingOptions, 'Select seating capacity')}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Category *</Text>
        {renderDropdown('category', categoryOptions, 'Select vehicle category')}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Features</Text>
        <View style={styles.featuresContainer}>
          {availableFeatures.map((feature) => (
            <TouchableOpacity
              key={feature}
              style={[
                styles.featureChip,
                formData.features.includes(feature) && styles.featureChipSelected
              ]}
              onPress={() => toggleFeature(feature)}
            >
              <Text style={[
                styles.featureChipText,
                formData.features.includes(feature) && styles.featureChipTextSelected
              ]}>
                {feature}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  const renderStep3 = () => (
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
            onChangeText={(text) => updateFormData('city', text)}
          />
        </View>
        <View style={styles.halfInput}>
          <Text style={styles.label}>State *</Text>
          <TextInput
            style={styles.input}
            placeholder="State"
            value={formData.state}
            onChangeText={(text) => updateFormData('state', text)}
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Country *</Text>
        <TextInput
          style={styles.input}
          placeholder="Country"
          value={formData.country}
          onChangeText={(text) => updateFormData('country', text)}
        />
      </View>

      <View style={styles.pricingTip}>
        <Text style={styles.tipTitle}>💡 Pricing Tips</Text>
        <Text style={styles.tipText}>
          • Research similar vehicles in your area{'\n'}
          • Consider fuel costs and maintenance{'\n'}
          • Competitive pricing gets more bookings
        </Text>
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Photos & Documents</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Vehicle Photos *</Text>
        <Text style={styles.sectionSubtitle}>Add at least 5 high-quality photos (maximum 8)</Text>

        <TouchableOpacity style={styles.uploadButton} onPress={handleImagePicker}>
          <Camera size={24} color="#059669" />
          <Text style={styles.uploadButtonText}>
            Add Photos ({formData.images.length}/8)
          </Text>
        </TouchableOpacity>

        {formData.images.length > 0 && (
          <View style={styles.imageGrid}>
            {formData.images.map((image, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image source={{ uri: image }} style={styles.uploadedImage} />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => removeImage(index)}
                >
                  <X size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Required Documents</Text>

        <TouchableOpacity
          style={styles.documentButton}
          onPress={() => handleDocumentPicker('Registration Certificate (RC)')}
        >
          <Upload size={20} color="#059669" />
          <View style={styles.documentTextContainer}>
            <Text style={styles.documentButtonText}>Registration Certificate (RC)</Text>
            {formData.rcDocument && (
              <Text style={styles.documentTextContainer}>
                {formData.rcDocument.name}
              </Text>
            )}
          </View>
          {formData.rcDocument && <CheckCircle size={20} color="#10B981" />}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.documentButton}
          onPress={() => handleDocumentPicker('Insurance Document')}
        >
          <Upload size={20} color="#059669" />
          <View style={styles.documentTextContainer}>
            <Text style={styles.documentButtonText}>Insurance Document</Text>
            {formData.insuranceDocument && (
              <Text style={styles.documentFileName}>
                {formData.insuranceDocument.name}
              </Text>
            )}
          </View>
          {formData.insuranceDocument && <CheckCircle size={20} color="#10B981" />}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.documentButton}
          onPress={() => handleDocumentPicker('PUC Certificate')}
        >
          <Upload size={20} color="#059669" />
          <View style={styles.documentTextContainer}>
            <Text style={styles.documentButtonText}>PUC Certificate</Text>
            {formData.pucDocument && (
              <Text style={styles.documentFileName}>
                {formData.pucDocument.name}
              </Text>
            )}
          </View>
          {formData.pucDocument && <CheckCircle size={20} color="#10B981" />}
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
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
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
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