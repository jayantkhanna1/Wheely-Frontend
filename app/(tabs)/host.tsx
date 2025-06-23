import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  SafeAreaView, 
  ScrollView, 
  Modal, 
  Image, 
  Alert,
  Platform,
  Dimensions,
  TouchableWithoutFeedback
} from 'react-native';
import { 
  ArrowLeft, 
  Car, 
  Bike, 
  Bicycle, 
  Camera, 
  MapPin, 
  Upload, 
  FileText, 
  Calendar, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  X, 
  Plus, 
  Trash2 
} from 'lucide-react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import Toast from '@/components/Toast';

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

interface VehicleData {
  vehicle_name: string;
  vehicle_brand: string;
  vehicle_model: string;
  vehicle_color: string;
  vehicle_year: string;
  vehicle_type: '4_wheeler' | '2_wheeler' | 'bicycle';
  transmission_type?: string;
  fuel_type?: string;
  seating_capacity?: string;
  mileage?: string;
  price_per_hour: string;
  price_per_day: string;
}

interface LocationData {
  address: string;
  street: string;
  colony: string;
  road: string;
  pincode: string;
  city: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  google_map_location: string;
}

interface AvailabilitySlot {
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

interface DocumentData {
  vehicle_rc?: any;
  vehicle_insurance?: any;
  vehicle_pollution_certificate?: any;
}

const { width: screenWidth } = Dimensions.get('window');

export default function HostScreen() {
  const [currentStep, setCurrentStep] = useState(1);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [vehicleData, setVehicleData] = useState<VehicleData>({
    vehicle_name: '',
    vehicle_brand: '',
    vehicle_model: '',
    vehicle_color: '',
    vehicle_year: '',
    vehicle_type: '4_wheeler',
    transmission_type: '',
    fuel_type: '',
    seating_capacity: '',
    mileage: '',
    price_per_hour: '',
    price_per_day: '',
  });
  const [locationData, setLocationData] = useState<LocationData>({
    address: '',
    street: '',
    colony: '',
    road: '',
    pincode: '',
    city: '',
    state: '',
    country: '',
    latitude: 0,
    longitude: 0,
    google_map_location: '',
  });
  const [photos, setPhotos] = useState<any[]>([]);
  const [documents, setDocuments] = useState<DocumentData>({});
  const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'error' as 'success' | 'error' });

  // Date/Time picker states
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');
  const [currentPickerType, setCurrentPickerType] = useState<'start_date' | 'end_date' | 'start_time' | 'end_time'>('start_date');
  const [tempSlot, setTempSlot] = useState<AvailabilitySlot>({
    start_date: '',
    end_date: '',
    start_time: '',
    end_time: '',
    is_available: true,
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const storedUserData = await AsyncStorage.getItem('user_data');
      if (storedUserData) {
        const parsedUserData = JSON.parse(storedUserData);
        setUserData(parsedUserData);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ visible: true, message, type });
  };

  const hideToast = () => {
    setToast({ ...toast, visible: false });
  };

  const vehicleTypes = [
    { id: '4_wheeler', name: '4 Wheeler', icon: <Car size={32} color="#059669" /> },
    { id: '2_wheeler', name: '2 Wheeler', icon: <Bike size={32} color="#059669" /> },
    { id: 'bicycle', name: 'Bicycle', icon: <Bicycle size={32} color="#059669" /> },
  ];

  const transmissionTypes = ['manual', 'automatic', 'cvt'];
  const fuelTypes = ['petrol', 'diesel', 'electric', 'hybrid', 'cng'];

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const formatTime = (date: Date) => {
    return date.toTimeString().split(' ')[0];
  };

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatDisplayTime = (timeString: string) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const openDateTimePicker = (type: 'start_date' | 'end_date' | 'start_time' | 'end_time') => {
    setCurrentPickerType(type);
    setPickerMode(type.includes('date') ? 'date' : 'time');
    setShowDateTimePicker(true);
  };

  const handleDateTimeChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDateTimePicker(false);
    }

    if (selectedDate) {
      const newSlot = { ...tempSlot };
      
      if (currentPickerType.includes('date')) {
        newSlot[currentPickerType] = formatDate(selectedDate);
      } else {
        newSlot[currentPickerType] = formatTime(selectedDate);
      }
      
      setTempSlot(newSlot);
    }
  };

  const addAvailabilitySlot = () => {
    if (!tempSlot.start_date || !tempSlot.end_date || !tempSlot.start_time || !tempSlot.end_time) {
      showToast('Please fill all date and time fields', 'error');
      return;
    }

    setAvailabilitySlots([...availabilitySlots, tempSlot]);
    setTempSlot({
      start_date: '',
      end_date: '',
      start_time: '',
      end_time: '',
      is_available: true,
    });
  };

  const removeAvailabilitySlot = (index: number) => {
    const newSlots = availabilitySlots.filter((_, i) => i !== index);
    setAvailabilitySlots(newSlots);
  };

  const pickImage = async () => {
    if (photos.length >= 8) {
      showToast('Maximum 8 photos allowed', 'error');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPhotos([...photos, result.assets[0]]);
    }
  };

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    setPhotos(newPhotos);
  };

  const pickDocument = async (type: keyof DocumentData) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        setDocuments({ ...documents, [type]: result.assets[0] });
      }
    } catch (error) {
      showToast('Error picking document', 'error');
    }
  };

  const validateStep = () => {
    switch (currentStep) {
      case 1:
        if (!vehicleData.vehicle_name || !vehicleData.price_per_hour || !vehicleData.price_per_day) {
          showToast('Please fill required fields', 'error');
          return false;
        }
        if (vehicleData.vehicle_type !== 'bicycle') {
          if (!vehicleData.vehicle_brand || !vehicleData.vehicle_model || !vehicleData.vehicle_year) {
            showToast('Please fill all vehicle details', 'error');
            return false;
          }
        }
        break;
      case 2:
        if (photos.length === 0) {
          showToast('Please upload at least one photo', 'error');
          return false;
        }
        break;
      case 3:
        if (!locationData.address || !locationData.city || !locationData.pincode) {
          showToast('Please fill location details', 'error');
          return false;
        }
        break;
      case 4:
        if (vehicleData.vehicle_type !== 'bicycle') {
          if (!documents.vehicle_rc || !documents.vehicle_insurance) {
            showToast('Please upload required documents', 'error');
            return false;
          }
        }
        break;
      case 5:
        if (availabilitySlots.length === 0) {
          showToast('Please add at least one availability slot', 'error');
          return false;
        }
        break;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep()) {
      if (vehicleData.vehicle_type === 'bicycle' && currentStep === 3) {
        setCurrentStep(5); // Skip documents step for bicycle
      } else {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const prevStep = () => {
    if (vehicleData.vehicle_type === 'bicycle' && currentStep === 5) {
      setCurrentStep(3); // Skip documents step for bicycle
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  const submitVehicle = async () => {
    if (!userData) {
      showToast('User data not found', 'error');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      
      // Add basic vehicle data
      formData.append('owner_id', userData.id.toString());
      formData.append('vehicle_name', vehicleData.vehicle_name);
      formData.append('vehicle_brand', vehicleData.vehicle_brand);
      formData.append('vehicle_model', vehicleData.vehicle_model);
      formData.append('vehicle_color', vehicleData.vehicle_color);
      formData.append('vehicle_year', vehicleData.vehicle_year);
      formData.append('vehicle_type', vehicleData.vehicle_type);
      formData.append('price_per_hour', vehicleData.price_per_hour);
      formData.append('price_per_day', vehicleData.price_per_day);
      formData.append('is_available', 'true');

      // Add conditional fields
      if (vehicleData.vehicle_type !== 'bicycle') {
        if (vehicleData.transmission_type) formData.append('transmission_type', vehicleData.transmission_type);
        if (vehicleData.fuel_type) formData.append('fuel_type', vehicleData.fuel_type);
        if (vehicleData.seating_capacity) formData.append('seating_capacity', vehicleData.seating_capacity);
        if (vehicleData.mileage) formData.append('mileage', vehicleData.mileage);
      }

      // Add location data
      formData.append('location', JSON.stringify(locationData));

      // Add photos
      photos.forEach((photo, index) => {
        formData.append('photos', {
          uri: photo.uri,
          type: 'image/jpeg',
          name: `photo_${index}.jpg`,
        } as any);
      });

      // Add documents (if not bicycle)
      if (vehicleData.vehicle_type !== 'bicycle') {
        if (documents.vehicle_rc) {
          formData.append('vehicle_rc', {
            uri: documents.vehicle_rc.uri,
            type: documents.vehicle_rc.mimeType,
            name: documents.vehicle_rc.name,
          } as any);
        }
        if (documents.vehicle_insurance) {
          formData.append('vehicle_insurance', {
            uri: documents.vehicle_insurance.uri,
            type: documents.vehicle_insurance.mimeType,
            name: documents.vehicle_insurance.name,
          } as any);
        }
        if (documents.vehicle_pollution_certificate) {
          formData.append('vehicle_pollution_certificate', {
            uri: documents.vehicle_pollution_certificate.uri,
            type: documents.vehicle_pollution_certificate.mimeType,
            name: documents.vehicle_pollution_certificate.name,
          } as any);
        }
      }

      // Add availability slots
      formData.append('availability_slots', JSON.stringify(availabilitySlots));

      const response = await fetch('http://127.0.0.1:8000/api/upload/vehicle/', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        showToast('Vehicle uploaded successfully!', 'success');
        setTimeout(() => {
          router.back();
        }, 2000);
      } else {
        showToast(result.message || 'Upload failed', 'error');
      }
    } catch (error) {
      console.error('Upload error:', error);
      showToast('Upload failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => {
    const totalSteps = vehicleData.vehicle_type === 'bicycle' ? 4 : 5;
    
    return (
      <View style={styles.stepIndicator}>
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = vehicleData.vehicle_type === 'bicycle' && index >= 3 ? index + 2 : index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <View key={index} style={styles.stepContainer}>
              <View style={[
                styles.stepCircle,
                isActive && styles.stepCircleActive,
                isCompleted && styles.stepCircleCompleted
              ]}>
                <Text style={[
                  styles.stepNumber,
                  (isActive || isCompleted) && styles.stepNumberActive
                ]}>
                  {stepNumber}
                </Text>
              </View>
              {index < totalSteps - 1 && (
                <View style={[
                  styles.stepLine,
                  isCompleted && styles.stepLineCompleted
                ]} />
              )}
            </View>
          );
        })}
      </View>
    );
  };

  const renderVehicleDetailsStep = () => (
    <ScrollView style={styles.stepContent}>
      <Text style={styles.stepTitle}>Vehicle Details</Text>
      
      {/* Vehicle Type Selection */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Vehicle Type</Text>
        <View style={styles.vehicleContainer}>
          {vehicleTypes.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.vehicleOption,
                vehicleData.vehicle_type === type.id && styles.vehicleOptionSelected
              ]}
              onPress={() => setVehicleData({ ...vehicleData, vehicle_type: type.id as any })}
            >
              <View style={styles.vehicleIconContainer}>
                {React.cloneElement(type.icon, {
                  color: vehicleData.vehicle_type === type.id ? '#FFFFFF' : '#059669'
                })}
              </View>
              <Text style={[
                styles.vehicleText,
                vehicleData.vehicle_type === type.id && styles.vehicleTextSelected
              ]}>
                {type.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Basic Details */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Basic Information</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Vehicle Name *</Text>
          <TextInput
            style={styles.textInput}
            value={vehicleData.vehicle_name}
            onChangeText={(text) => setVehicleData({ ...vehicleData, vehicle_name: text })}
            placeholder="Enter vehicle name"
          />
        </View>

        {vehicleData.vehicle_type !== 'bicycle' && (
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Brand *</Text>
              <TextInput
                style={styles.textInput}
                value={vehicleData.vehicle_brand}
                onChangeText={(text) => setVehicleData({ ...vehicleData, vehicle_brand: text })}
                placeholder="Enter brand"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Model *</Text>
              <TextInput
                style={styles.textInput}
                value={vehicleData.vehicle_model}
                onChangeText={(text) => setVehicleData({ ...vehicleData, vehicle_model: text })}
                placeholder="Enter model"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Year *</Text>
              <TextInput
                style={styles.textInput}
                value={vehicleData.vehicle_year}
                onChangeText={(text) => setVehicleData({ ...vehicleData, vehicle_year: text })}
                placeholder="Enter year"
                keyboardType="numeric"
              />
            </View>
          </>
        )}

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Color</Text>
          <TextInput
            style={styles.textInput}
            value={vehicleData.vehicle_color}
            onChangeText={(text) => setVehicleData({ ...vehicleData, vehicle_color: text })}
            placeholder="Enter color"
          />
        </View>
      </View>

      {/* Vehicle Specifications */}
      {vehicleData.vehicle_type !== 'bicycle' && (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Specifications</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Transmission Type</Text>
            <View style={styles.pickerContainer}>
              {transmissionTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.pickerOption,
                    vehicleData.transmission_type === type && styles.pickerOptionSelected
                  ]}
                  onPress={() => setVehicleData({ ...vehicleData, transmission_type: type })}
                >
                  <Text style={[
                    styles.pickerOptionText,
                    vehicleData.transmission_type === type && styles.pickerOptionTextSelected
                  ]}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Fuel Type</Text>
            <View style={styles.pickerContainer}>
              {fuelTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.pickerOption,
                    vehicleData.fuel_type === type && styles.pickerOptionSelected
                  ]}
                  onPress={() => setVehicleData({ ...vehicleData, fuel_type: type })}
                >
                  <Text style={[
                    styles.pickerOptionText,
                    vehicleData.fuel_type === type && styles.pickerOptionTextSelected
                  ]}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Seating Capacity</Text>
            <TextInput
              style={styles.textInput}
              value={vehicleData.seating_capacity}
              onChangeText={(text) => setVehicleData({ ...vehicleData, seating_capacity: text })}
              placeholder="Enter seating capacity"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Mileage (km/l)</Text>
            <TextInput
              style={styles.textInput}
              value={vehicleData.mileage}
              onChangeText={(text) => setVehicleData({ ...vehicleData, mileage: text })}
              placeholder="Enter mileage"
              keyboardType="numeric"
            />
          </View>
        </View>
      )}

      {/* Pricing */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Pricing</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Price per Hour *</Text>
          <TextInput
            style={styles.textInput}
            value={vehicleData.price_per_hour}
            onChangeText={(text) => setVehicleData({ ...vehicleData, price_per_hour: text })}
            placeholder="Enter price per hour"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Price per Day *</Text>
          <TextInput
            style={styles.textInput}
            value={vehicleData.price_per_day}
            onChangeText={(text) => setVehicleData({ ...vehicleData, price_per_day: text })}
            placeholder="Enter price per day"
            keyboardType="numeric"
          />
        </View>
      </View>
    </ScrollView>
  );

  const renderPhotosStep = () => (
    <ScrollView style={styles.stepContent}>
      <Text style={styles.stepTitle}>Vehicle Photos</Text>
      <Text style={styles.stepSubtitle}>Upload up to 8 photos of your vehicle</Text>

      <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
        <Camera size={24} color="#059669" />
        <Text style={styles.uploadButtonText}>Add Photos</Text>
        <Text style={styles.uploadButtonSubtext}>{photos.length}/8 photos</Text>
      </TouchableOpacity>

      {photos.length > 0 && (
        <View style={styles.photosGrid}>
          {photos.map((photo, index) => (
            <View key={index} style={styles.photoContainer}>
              <Image source={{ uri: photo.uri }} style={styles.photoPreview} />
              <TouchableOpacity
                style={styles.removePhotoButton}
                onPress={() => removePhoto(index)}
              >
                <X size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );

  const renderLocationStep = () => (
    <ScrollView style={styles.stepContent}>
      <Text style={styles.stepTitle}>Vehicle Location</Text>
      <Text style={styles.stepSubtitle}>Where is your vehicle located?</Text>

      <View style={styles.sectionContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Address *</Text>
          <TextInput
            style={styles.textInput}
            value={locationData.address}
            onChangeText={(text) => setLocationData({ ...locationData, address: text })}
            placeholder="Enter full address"
            multiline
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Street</Text>
          <TextInput
            style={styles.textInput}
            value={locationData.street}
            onChangeText={(text) => setLocationData({ ...locationData, street: text })}
            placeholder="Enter street"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Colony</Text>
          <TextInput
            style={styles.textInput}
            value={locationData.colony}
            onChangeText={(text) => setLocationData({ ...locationData, colony: text })}
            placeholder="Enter colony"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Road</Text>
          <TextInput
            style={styles.textInput}
            value={locationData.road}
            onChangeText={(text) => setLocationData({ ...locationData, road: text })}
            placeholder="Enter road"
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.inputContainer, styles.halfWidth]}>
            <Text style={styles.inputLabel}>City *</Text>
            <TextInput
              style={styles.textInput}
              value={locationData.city}
              onChangeText={(text) => setLocationData({ ...locationData, city: text })}
              placeholder="Enter city"
            />
          </View>

          <View style={[styles.inputContainer, styles.halfWidth]}>
            <Text style={styles.inputLabel}>Pincode *</Text>
            <TextInput
              style={styles.textInput}
              value={locationData.pincode}
              onChangeText={(text) => setLocationData({ ...locationData, pincode: text })}
              placeholder="Enter pincode"
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>State</Text>
          <TextInput
            style={styles.textInput}
            value={locationData.state}
            onChangeText={(text) => setLocationData({ ...locationData, state: text })}
            placeholder="Enter state"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Country</Text>
          <TextInput
            style={styles.textInput}
            value={locationData.country}
            onChangeText={(text) => setLocationData({ ...locationData, country: text })}
            placeholder="Enter country"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Google Maps Location</Text>
          <TextInput
            style={styles.textInput}
            value={locationData.google_map_location}
            onChangeText={(text) => setLocationData({ ...locationData, google_map_location: text })}
            placeholder="Enter Google Maps URL"
          />
        </View>
      </View>
    </ScrollView>
  );

  const renderDocumentsStep = () => (
    <ScrollView style={styles.stepContent}>
      <Text style={styles.stepTitle}>Vehicle Documents</Text>
      <Text style={styles.stepSubtitle}>Upload required documents</Text>

      <View style={styles.sectionContainer}>
        <View style={styles.documentContainer}>
          <Text style={styles.documentTitle}>Registration Certificate (RC) *</Text>
          <TouchableOpacity
            style={styles.documentUploadButton}
            onPress={() => pickDocument('vehicle_rc')}
          >
            <FileText size={24} color="#059669" />
            <Text style={styles.documentUploadText}>
              {documents.vehicle_rc ? 'RC Uploaded' : 'Upload RC'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.documentContainer}>
          <Text style={styles.documentTitle}>Insurance *</Text>
          <TouchableOpacity
            style={styles.documentUploadButton}
            onPress={() => pickDocument('vehicle_insurance')}
          >
            <FileText size={24} color="#059669" />
            <Text style={styles.documentUploadText}>
              {documents.vehicle_insurance ? 'Insurance Uploaded' : 'Upload Insurance'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.documentContainer}>
          <Text style={styles.documentTitle}>Pollution Certificate</Text>
          <TouchableOpacity
            style={styles.documentUploadButton}
            onPress={() => pickDocument('vehicle_pollution_certificate')}
          >
            <FileText size={24} color="#059669" />
            <Text style={styles.documentUploadText}>
              {documents.vehicle_pollution_certificate ? 'PUC Uploaded' : 'Upload PUC'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
  const renderAvailabilityStep = () => (
  <ScrollView style={styles.stepContent}>
    <Text style={styles.stepTitle}>Vehicle Availability</Text>
    <Text style={styles.stepSubtitle}>Set when your vehicle is available for rent</Text>

    {/* Add New Availability Slot */}
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Add Availability Slot</Text>
      
      <View style={styles.dateTimeContainer}>
        <View style={styles.dateTimeSection}>
          <Text style={styles.dateTimeLabel}>START DATE</Text>
          <TouchableOpacity
            style={styles.dateTimeDropdownNew}
            onPress={() => openDateTimePicker('start_date')}
          >
            <Text style={styles.dateTimeValue}>
              {tempSlot.start_date ? formatDisplayDate(tempSlot.start_date) : 'Select date'}
            </Text>
            <View style={styles.dropdownIcon}>
              <Calendar size={16} color="#6B7280" />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.dateTimeSection}>
          <Text style={styles.dateTimeLabel}>END DATE</Text>
          <TouchableOpacity
            style={styles.dateTimeDropdownNew}
            onPress={() => openDateTimePicker('end_date')}
          >
            <Text style={styles.dateTimeValue}>
              {tempSlot.end_date ? formatDisplayDate(tempSlot.end_date) : 'Select date'}
            </Text>
            <View style={styles.dropdownIcon}>
              <Calendar size={16} color="#6B7280" />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.dateTimeContainer}>
        <View style={styles.dateTimeSection}>
          <Text style={styles.dateTimeLabel}>START TIME</Text>
          <TouchableOpacity
            style={styles.dateTimeDropdownNew}
            onPress={() => openDateTimePicker('start_time')}
          >
            <Text style={styles.dateTimeValue}>
              {tempSlot.start_time ? formatDisplayTime(tempSlot.start_time) : 'Select time'}
            </Text>
            <View style={styles.dropdownIcon}>
              <Clock size={16} color="#6B7280" />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.dateTimeSection}>
          <Text style={styles.dateTimeLabel}>END TIME</Text>
          <TouchableOpacity
            style={styles.dateTimeDropdownNew}
            onPress={() => openDateTimePicker('end_time')}
          >
            <Text style={styles.dateTimeValue}>
              {tempSlot.end_time ? formatDisplayTime(tempSlot.end_time) : 'Select time'}
            </Text>
            <View style={styles.dropdownIcon}>
              <Clock size={16} color="#6B7280" />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.addSlotButton} onPress={addAvailabilitySlot}>
        <Plus size={20} color="#FFFFFF" />
        <Text style={styles.addSlotButtonText}>Add Slot</Text>
      </TouchableOpacity>
    </View>

    {/* Existing Availability Slots */}
    {availabilitySlots.length > 0 && (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Added Slots ({availabilitySlots.length})</Text>
        {availabilitySlots.map((slot, index) => (
          <View key={index} style={styles.slotItem}>
            <View style={styles.slotInfo}>
              <View style={styles.slotDateRange}>
                <Text style={styles.slotDateText}>
                  {formatDisplayDate(slot.start_date)} - {formatDisplayDate(slot.end_date)}
                </Text>
              </View>
              <View style={styles.slotTimeRange}>
                <Text style={styles.slotTimeText}>
                  {formatDisplayTime(slot.start_time)} - {formatDisplayTime(slot.end_time)}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.removeSlotButton}
              onPress={() => removeAvailabilitySlot(index)}
            >
              <Trash2 size={16} color="#EF4444" />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    )}

    {/* Date/Time Picker Modal */}
    {showDateTimePicker && (
      <Modal
        transparent={true}
        visible={showDateTimePicker}
        animationType="fade"
        onRequestClose={() => setShowDateTimePicker(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowDateTimePicker(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.pickerContainerFullWidth}>
                <View style={styles.pickerHeader}>
                  <Text style={styles.pickerTitle}>
                    Select {currentPickerType.replace('_', ' ').toUpperCase()}
                  </Text>
                  <TouchableOpacity
                    style={styles.pickerCloseButton}
                    onPress={() => setShowDateTimePicker(false)}
                  >
                    <X size={20} color="#6B7280" />
                  </TouchableOpacity>
                </View>

                <DateTimePicker
                  value={new Date()}
                  mode={pickerMode}
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleDateTimeChange}
                  style={{ backgroundColor: '#FFFFFF' }}
                />

                {Platform.OS === 'ios' && (
                  <View style={styles.pickerButtons}>
                    <TouchableOpacity
                      style={styles.pickerButton}
                      onPress={() => setShowDateTimePicker(false)}
                    >
                      <Text style={styles.pickerButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.pickerButton, styles.confirmButton]}
                      onPress={() => setShowDateTimePicker(false)}
                    >
                      <Text style={[styles.pickerButtonText, styles.confirmButtonText]}>Confirm</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    )}
  </ScrollView>
);

// Add these styles to your existing StyleSheet
const additionalStyles = StyleSheet.create({
  stepContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
  },
  sectionContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  addSlotButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 16,
    gap: 8,
  },
  addSlotButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  slotItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  slotInfo: {
    flex: 1,
  },
  slotDateRange: {
    marginBottom: 4,
  },
  slotDateText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  slotTimeRange: {},
  slotTimeText: {
    fontSize: 12,
    color: '#6B7280',
  },
  removeSlotButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Add step indicator styles
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#D1D5DB',
  },
  stepCircleActive: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  stepCircleCompleted: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  stepNumberActive: {
    color: '#FFFFFF',
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 8,
  },
  stepLineCompleted: {
    backgroundColor: '#10B981',
  },
});

// Main render function that determines which step to show
const renderCurrentStep = () => {
  switch (currentStep) {
    case 1:
      return renderVehicleDetailsStep();
    case 2:
      return renderPhotosStep();
    case 3:
      return renderLocationStep();
    case 4:
      return renderDocumentsStep();
    case 5:
      return renderAvailabilityStep();
    default:
      return renderVehicleDetailsStep();
  }
};

// Add navigation buttons at the bottom
const renderNavigationButtons = () => (
  <View style={styles.navigationContainer}>
    {currentStep > 1 && (
      <TouchableOpacity
        style={styles.backButton}
        onPress={prevStep}
      >
        <ArrowLeft size={20} color="#059669" />
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    )}
    
    <View style={{ flex: 1 }} />
    
    {currentStep < (vehicleData.vehicle_type === 'bicycle' ? 4 : 5) ? (
      <TouchableOpacity
        style={styles.nextButton}
        onPress={nextStep}
      >
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    ) : (
      <TouchableOpacity
        style={[styles.nextButton, loading && styles.nextButtonDisabled]}
        onPress={submitVehicle}
        disabled={loading}
      >
        <Text style={styles.nextButtonText}>
          {loading ? 'Uploading...' : 'Submit'}
        </Text>
      </TouchableOpacity>
    )}
  </View>
);

// Navigation button styles
const navigationStyles = StyleSheet.create({
  navigationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#059669',
    backgroundColor: '#FFFFFF',
    gap: 8,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
  },
  nextButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: '#059669',
  },
  nextButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  nextButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

// Main component return
return (
  <SafeAreaView style={styles.container}>
    {/* Header */}
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.back()}>
        <ArrowLeft size={24} color="#111827" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>List Your Vehicle</Text>
      <View style={{ width: 24 }} />
    </View>

    {/* Step Indicator */}
    {renderStepIndicator()}

    {/* Step Content */}
    {renderCurrentStep()}

    {/* Navigation Buttons */}
    {renderNavigationButtons()}

    {/* Toast */}
    <Toast
      visible={toast.visible}
      message={toast.message}
      type={toast.type}
      onHide={hideToast}
    />
  </SafeAreaView>
);


const styles = StyleSheet.create({
  // ... your existing styles ...
  
  // Main container styles
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  
  // Step indicator styles
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#D1D5DB',
  },
  stepCircleActive: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  stepCircleCompleted: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  stepNumberActive: {
    color: '#FFFFFF',
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 8,
  },
  stepLineCompleted: {
    backgroundColor: '#10B981',
  },
  
  // Content styles
  stepContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
  },
  
  // Section styles
  sectionContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  
  // Vehicle type selection
  vehicleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 20,
  },
  vehicleOption: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  vehicleOptionSelected: {
    backgroundColor: '#059669',
    borderColor: '#047857',
  },
  vehicleIconContainer: {
    marginBottom: 10,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vehicleText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  vehicleTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  
  // Input styles
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  
  // Picker styles
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pickerOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
  },
  pickerOptionSelected: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  pickerOptionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  pickerOptionTextSelected: {
    color: '#FFFFFF',
  },
  
  // Layout helpers
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  halfWidth: {
    flex: 1,
  },
  
  // Upload button styles
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#059669',
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginBottom: 20,
    gap: 8,
  },
  uploadButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
  },
  uploadButtonSubtext: {
    fontSize: 12,
    color: '#6B7280',
  },
  
  // Photo grid styles
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  photoContainer: {
    width: (screenWidth - 72) / 3,
    height: (screenWidth - 72) / 3,
    position: 'relative',
  },
  photoPreview: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  removePhotoButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#EF4444',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Document upload styles
  documentContainer: {
    marginBottom: 20,
  },
  documentTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 8,
  },
  documentUploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 12,
  },
  documentUploadText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  
  // Date/Time picker styles (using your existing styles)
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 16,
  },
  dateTimeSection: {
    flex: 1,
    position: 'relative',
  },
  dateTimeLabel: {
    fontSize: 9,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 4,
  },
  dateTimeDropdownNew: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    position: 'relative',
    minHeight: 55,
    justifyContent: 'center',
  },
  dateTimeValue: {
    fontSize: 11,
    fontWeight: '600',
    color: '#000000',
    marginTop: 2,
  },
  dropdownIcon: {
    position: 'absolute',
    right: 12,
    top: '50%',
    marginTop: -8,
  },
  
  // Availability slot styles
  addSlotButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 16,
    gap: 8,
  },
  addSlotButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  slotItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  slotInfo: {
    flex: 1,
  },
  slotDateRange: {
    marginBottom: 4,
  },
  slotDateText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  slotTimeRange: {},
  slotTimeText: {
    fontSize: 12,
    color: '#6B7280',
  },
  removeSlotButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
  },
  
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerContainerFullWidth: {
    position: 'absolute',
    top: 220,
    left: 24,
    right: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 8,
    zIndex: 1000,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  pickerTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000000',
  },
  pickerCloseButton: {
    padding: 4,
  },
  pickerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  pickerButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#000000',
  },
  confirmButton: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  pickerButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
  },
  confirmButtonText: {
    color: '#FFFFFF',
  },
  
  // Navigation styles
  navigationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#059669',
    backgroundColor: '#FFFFFF',
    gap: 8,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
  },
  nextButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: '#059669',
  },
  nextButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  nextButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});