import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Alert,
  TextInput,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { ArrowLeft, CreditCard as Edit3, Save, X, Star, Users, DollarSign, Calendar, MapPin, Camera, Settings, Eye, EyeOff, Trash2, CircleCheck as CheckCircle, CircleAlert as AlertCircle } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScreenWrapper } from '../../components/ScreenWrapper';

interface VehicleDetails {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  image: string;
  images: string[];
  status: 'active' | 'inactive';
  earnings: string;
  totalEarnings: string;
  rating: number;
  totalTrips: number;
  description: string;
  pricePerDay: number;
  pricePerHour: number;
  location: string;
  availability: boolean;
  features: string[];
  fuelType: string;
  transmission: string;
  seats: number;
  mileage: string;
  registrationNumber: string;
  insuranceExpiry: string;
  pucExpiry: string;
  lastServiced: string;
}

interface EditableField {
  field: keyof VehicleDetails;
  label: string;
  type: 'text' | 'number' | 'switch' | 'select';
  options?: string[];
}

interface BackendVehicle {
  id: number;
  vehicle_name: string;
  vehicle_brand: string;
  vehicle_model: string;
  vehicle_color: string;
  vehicle_year: number;
  vehicle_type: string;
  transmission_type: string;
  fuel_type: string;
  seating_capacity: number;
  price_per_hour: string;
  price_per_day: string;
  location: {
    id: number;
    address: string;
    street: string;
    colony: string;
    road: string;
    pincode: string;
    city: string;
    state: string;
    country: string;
    google_map_location: string;
    created_at: string;
    updated_at: string;
  };
  owner: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string | null;
    location: any;
    driving_license: any;
    driving_license_verified: boolean;
    profile_picture: string | null;
    date_of_birth: string;
    email_verified: boolean;
    phone_verified: boolean;
    private_token: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
  vehicle_rc: string | null;
  vehicle_insurance: string | null;
  vehicle_pollution_certificate: string | null;
  is_available: boolean;
  is_verified: boolean;
  rating: number;
  total_bookings: number;
  photos: Array<{
    id: number;
    photo: string;
    is_primary: boolean;
    created_at: string;
  }>;
  availability_slots: Array<{
    id: number;
    start_date: string;
    end_date: string;
    start_time: string;
    end_time: string;
    is_available: boolean;
    created_at: string;
    updated_at: string;
    vehicle: number;
  }>;
  created_at: string;
  updated_at: string;
  category: string;
  features: string[];
  license_plate: string;
}

const VehicleDetailsScreen: React.FC = () => {
  const params = useLocalSearchParams();
  const vehicleId = params.vehicleId as string;
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [vehicleData, setVehicleData] = useState<VehicleDetails | null>(null);
  const [editedData, setEditedData] = useState<VehicleDetails | null>(null);
  const [backendData, setBackendData] = useState<BackendVehicle | null>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    if (userData && vehicleId) {
      fetchVehicleDetails();
    }
  }, [userData, vehicleId]);

  const loadUserData = async () => {
    try {
      const storedUserData = await AsyncStorage.getItem('user_data');
      if (storedUserData) {
        const parsedUserData = JSON.parse(storedUserData);
        setUserData(parsedUserData);
        console.log('User data loaded:', parsedUserData);
      } else {
        console.log('No user data found in storage');
        setError('Please log in to view vehicle details');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      setError('Failed to load user data');
      setLoading(false);
    }
  };

  const fetchVehicleDetails = async () => {
    if (!vehicleId) {
      setError('Vehicle ID is missing');
      setLoading(false);
      return;
    }

    try {
      const apiURL = `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/host/getVehicle/${vehicleId}/`;
      console.log('Fetching vehicle details from:', apiURL);

      const response = await fetch(apiURL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Vehicle details response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Vehicle details data:', data);
        setBackendData(data);
        
        // Transform backend data to match frontend format
        const transformedData = transformVehicleData(data);
        setVehicleData(transformedData);
        setEditedData(transformedData);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error Response:', errorData);
        setError(errorData.message || `Failed to fetch vehicle details. Status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching vehicle details:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const transformVehicleData = (backendData: BackendVehicle): VehicleDetails => {
    // Extract images from photos array
    const images = backendData.photos.map(photo => photo.photo);
    
    // Find primary image or use first image
    const primaryPhoto = backendData.photos.find(photo => photo.is_primary);
    const mainImage = primaryPhoto ? primaryPhoto.photo : (images.length > 0 ? images[0] : '');
    
    // Format location string
    const location = [
      backendData.location.address,
      backendData.location.city,
      backendData.location.state,
      backendData.location.country
    ].filter(Boolean).join(', ');
    
    // Calculate insurance and PUC expiry dates (mock data for now)
    const today = new Date();
    const insuranceExpiry = new Date(today);
    insuranceExpiry.setMonth(today.getMonth() + 6);
    
    const pucExpiry = new Date(today);
    pucExpiry.setMonth(today.getMonth() + 3);
    
    const lastServiced = new Date(today);
    lastServiced.setMonth(today.getMonth() - 1);
    
    // Mock earnings data (not provided by backend)
    const mockEarnings = Math.floor(Math.random() * 10000) + 5000;
    const mockTotalEarnings = mockEarnings * (Math.floor(Math.random() * 5) + 3);
    
    return {
      id: backendData.id.toString(),
      name: backendData.vehicle_name,
      brand: backendData.vehicle_brand,
      model: backendData.vehicle_model,
      year: backendData.vehicle_year,
      image: mainImage,
      images: images,
      status: backendData.is_available ? 'active' : 'inactive',
      earnings: `₹${mockEarnings}`,
      totalEarnings: `₹${mockTotalEarnings}`,
      rating: backendData.rating || 0,
      totalTrips: backendData.total_bookings || 0,
      description: `${backendData.vehicle_brand} ${backendData.vehicle_model} (${backendData.vehicle_year}) in ${backendData.vehicle_color} color. Well-maintained vehicle with excellent condition.`,
      pricePerDay: parseFloat(backendData.price_per_day),
      pricePerHour: parseFloat(backendData.price_per_hour),
      location: location,
      availability: backendData.is_available,
      features: backendData.features || [],
      fuelType: backendData.fuel_type,
      transmission: backendData.transmission_type,
      seats: backendData.seating_capacity,
      mileage: backendData.vehicle_type === '2_wheeler' ? '40 kmpl' : '16 kmpl', // Mock data
      registrationNumber: backendData.license_plate || 'Not provided',
      insuranceExpiry: insuranceExpiry.toISOString().split('T')[0],
      pucExpiry: pucExpiry.toISOString().split('T')[0],
      lastServiced: lastServiced.toISOString().split('T')[0],
    };
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData(vehicleData);
  };

  const handleSave = async () => {
    if (!editedData) return;
    
    setLoading(true);
    
    try {
      // Prepare data for API
      const updateData = {
        vehicle_id: vehicleId,
        user_id: userData.id,
        private_token: userData.private_token,
        price_per_hour: editedData.pricePerHour.toString(),
        price_per_day: editedData.pricePerDay.toString(),
        is_available: editedData.status === 'active',
        // Add other editable fields as needed
      };
      
      const apiURL = `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/host/updateVehicle/`;
      
      const response = await fetch(apiURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Update response:', data);
        
        // Update local state with edited data
        setVehicleData(editedData);
        setIsEditing(false);
        Alert.alert('Success', 'Vehicle details updated successfully!');
      } else {
        const errorData = await response.json().catch(() => ({}));
        Alert.alert('Error', errorData.message || 'Failed to update vehicle details');
      }
    } catch (error) {
      console.error('Error updating vehicle:', error);
      Alert.alert('Error', 'Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedData(vehicleData);
    setIsEditing(false);
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Vehicle',
      'Are you sure you want to delete this vehicle? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              
              const apiURL = `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/host/deleteVehicle/`;
              
              const response = await fetch(apiURL, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  vehicle_id: vehicleId,
                  user_id: userData.id,
                  private_token: userData.private_token,
                }),
              });
              
              if (response.ok) {
                Alert.alert('Deleted', 'Vehicle has been removed from your listings.', [
                  { text: 'OK', onPress: () => router.back() }
                ]);
              } else {
                const errorData = await response.json().catch(() => ({}));
                Alert.alert('Error', errorData.message || 'Failed to delete vehicle');
              }
            } catch (error) {
              console.error('Error deleting vehicle:', error);
              Alert.alert('Error', 'Network error. Please check your connection and try again.');
            } finally {
              setLoading(false);
            }
          }
        },
      ]
    );
  };

  const toggleStatus = async () => {
    if (!vehicleData) return;
    
    const newStatus = vehicleData.status === 'active' ? 'inactive' : 'active';
    
    try {
      setLoading(true);
      
      const apiURL = `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/host/updateVehicleStatus/`;
      
      const response = await fetch(apiURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vehicle_id: vehicleId,
          user_id: userData.id,
          private_token: userData.private_token,
          is_available: newStatus === 'active',
        }),
      });
      
      if (response.ok) {
        // Update local state
        setVehicleData({
          ...vehicleData,
          status: newStatus,
        });
        
        Alert.alert(
          'Status Updated',
          `Vehicle is now ${newStatus}. ${newStatus === 'active' ? 'It will be visible to renters.' : 'It will be hidden from renters.'}`
        );
      } else {
        const errorData = await response.json().catch(() => ({}));
        Alert.alert('Error', errorData.message || 'Failed to update vehicle status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      Alert.alert('Error', 'Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: keyof VehicleDetails, value: any) => {
    if (!editedData) return;
    setEditedData({ ...editedData, [field]: value });
  };

  const renderEditableField = (fieldConfig: EditableField) => {
    if (!editedData) return null;
    
    const { field, label, type, options } = fieldConfig;
    const value = editedData[field];

    return (
      <View key={field} style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>{label}</Text>
        {type === 'text' && (
          <TextInput
            style={styles.textInput}
            value={String(value)}
            onChangeText={(text) => updateField(field, text)}
            multiline={field === 'description'}
            numberOfLines={field === 'description' ? 3 : 1}
          />
        )}
        {type === 'number' && (
          <TextInput
            style={styles.textInput}
            value={String(value)}
            onChangeText={(text) => updateField(field, Number(text) || 0)}
            keyboardType="numeric"
          />
        )}
        {type === 'switch' && (
          <Switch
            value={Boolean(value)}
            onValueChange={(newValue) => updateField(field, newValue)}
            trackColor={{ false: '#D1D5DB', true: '#BBF7D0' }}
            thumbColor={Boolean(value) ? '#059669' : '#9CA3AF'}
          />
        )}
        {type === 'select' && options && (
          <View style={styles.selectContainer}>
            {options.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.selectOption,
                  value === option && styles.selectedOption
                ]}
                onPress={() => updateField(field, option)}
              >
                <Text style={[
                  styles.selectText,
                  value === option && styles.selectedText
                ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10B981';
      case 'inactive': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const editableFields: EditableField[] = [
    { field: 'name', label: 'Vehicle Name', type: 'text' },
    { field: 'description', label: 'Description', type: 'text' },
    { field: 'pricePerDay', label: 'Price per Day (₹)', type: 'number' },
    { field: 'pricePerHour', label: 'Price per Hour (₹)', type: 'number' },
    { field: 'location', label: 'Location', type: 'text' },
    { field: 'availability', label: 'Available for Booking', type: 'switch' },
    { field: 'fuelType', label: 'Fuel Type', type: 'select', options: ['Petrol', 'Diesel', 'CNG', 'Electric'] },
    { field: 'transmission', label: 'Transmission', type: 'select', options: ['Manual', 'Automatic'] },
    { field: 'seats', label: 'Number of Seats', type: 'number' },
    { field: 'mileage', label: 'Mileage', type: 'text' },
  ];

  if (loading) {
    return (
      <ScreenWrapper>
        <SafeAreaView style={styles.container}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#059669" />
            <Text style={styles.loadingText}>Loading vehicle details...</Text>
          </View>
        </SafeAreaView>
      </ScreenWrapper>
    );
  }

  if (error) {
    return (
      <ScreenWrapper>
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={20} color="#374151" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Vehicle Details</Text>
            <View style={styles.placeholder} />
          </View>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchVehicleDetails}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ScreenWrapper>
    );
  }

  if (!vehicleData) {
    return (
      <ScreenWrapper>
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={20} color="#374151" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Vehicle Details</Text>
            <View style={styles.placeholder} />
          </View>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Vehicle data not available</Text>
            <TouchableOpacity style={styles.retryButton} onPress={() => router.back()}>
              <Text style={styles.retryButtonText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={20} color="#374151" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Vehicle Details</Text>
          <TouchableOpacity 
            onPress={isEditing ? handleSave : handleEdit}
            style={styles.editButton}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#059669" />
            ) : (
              isEditing ? <Save size={20} color="#059669" /> : <Edit3 size={20} color="#059669" />
            )}
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Vehicle Images */}
          <View style={styles.imageSection}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {vehicleData.image ? (
                <Image source={{ uri: vehicleData.image }} style={styles.mainImage} />
              ) : (
                <View style={[styles.mainImage, styles.placeholderImage]}>
                  <Text style={styles.placeholderText}>{vehicleData.name}</Text>
                </View>
              )}
              
              {vehicleData.images.map((img, index) => (
                <Image key={index} source={{ uri: img }} style={styles.thumbnailImage} />
              ))}
              
              {isEditing && (
                <TouchableOpacity style={styles.addImageButton}>
                  <Camera size={24} color="#9CA3AF" />
                  <Text style={styles.addImageText}>Add Photo</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>

          {/* Vehicle Info */}
          <View style={styles.section}>
            <View style={styles.vehicleHeader}>
              <View style={styles.vehicleTitle}>
                <Text style={styles.vehicleName}>{vehicleData.name}</Text>
                <View style={styles.statusContainer}>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(vehicleData.status) }]}>
                    <Text style={styles.statusText}>{vehicleData.status.toUpperCase()}</Text>
                  </View>
                  <TouchableOpacity onPress={toggleStatus} style={styles.toggleButton}>
                    {vehicleData.status === 'active' ? (
                      <EyeOff size={16} color="#6B7280" />
                    ) : (
                      <Eye size={16} color="#6B7280" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Stats */}
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <DollarSign size={20} color="#059669" />
                <Text style={styles.statValue}>{vehicleData.earnings}</Text>
                <Text style={styles.statLabel}>This Month</Text>
              </View>
              <View style={styles.statCard}>
                <Star size={20} color="#F59E0B" />
                <Text style={styles.statValue}>{vehicleData.rating}</Text>
                <Text style={styles.statLabel}>Rating</Text>
              </View>
              <View style={styles.statCard}>
                <Users size={20} color="#6B7280" />
                <Text style={styles.statValue}>{vehicleData.totalTrips}</Text>
                <Text style={styles.statLabel}>Total Trips</Text>
              </View>
            </View>
          </View>

          {/* Pricing */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pricing</Text>
            <View style={styles.pricingContainer}>
              <View style={styles.priceCard}>
                <Text style={styles.priceValue}>₹{isEditing ? editedData?.pricePerDay : vehicleData.pricePerDay}</Text>
                <Text style={styles.priceLabel}>per day</Text>
              </View>
              <View style={styles.priceCard}>
                <Text style={styles.priceValue}>₹{isEditing ? editedData?.pricePerHour : vehicleData.pricePerHour}</Text>
                <Text style={styles.priceLabel}>per hour</Text>
              </View>
            </View>
          </View>

          {/* Vehicle Specifications */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Specifications</Text>
            <View style={styles.specGrid}>
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>Fuel Type</Text>
                <Text style={styles.specValue}>{vehicleData.fuelType}</Text>
              </View>
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>Transmission</Text>
                <Text style={styles.specValue}>{vehicleData.transmission}</Text>
              </View>
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>Seats</Text>
                <Text style={styles.specValue}>{vehicleData.seats}</Text>
              </View>
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>Mileage</Text>
                <Text style={styles.specValue}>{vehicleData.mileage}</Text>
              </View>
            </View>
          </View>

          {/* Features */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Features</Text>
            <View style={styles.featuresContainer}>
              {vehicleData.features && vehicleData.features.length > 0 ? (
                vehicleData.features.map((feature, index) => (
                  <View key={index} style={styles.featureTag}>
                    <CheckCircle size={12} color="#059669" />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.noFeaturesText}>No features listed</Text>
              )}
            </View>
          </View>

          {/* Documents Status */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Document Status</Text>
            <View style={styles.documentContainer}>
              <View style={styles.documentItem}>
                <Text style={styles.docLabel}>Registration Number</Text>
                <Text style={styles.docValue}>{vehicleData.registrationNumber}</Text>
              </View>
              <View style={styles.documentItem}>
                <Text style={styles.docLabel}>Insurance Expiry</Text>
                <Text style={styles.docValue}>{vehicleData.insuranceExpiry}</Text>
                <CheckCircle size={16} color="#10B981" />
              </View>
              <View style={styles.documentItem}>
                <Text style={styles.docLabel}>PUC Expiry</Text>
                <Text style={styles.docValue}>{vehicleData.pucExpiry}</Text>
                <AlertCircle size={16} color="#F59E0B" />
              </View>
              <View style={styles.documentItem}>
                <Text style={styles.docLabel}>Last Serviced</Text>
                <Text style={styles.docValue}>{vehicleData.lastServiced}</Text>
              </View>
            </View>
          </View>

          {/* Editable Fields */}
          {isEditing && editedData && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Edit Details</Text>
              {editableFields.map(renderEditableField)}
              
              <View style={styles.editActions}>
                <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                  <X size={16} color="#EF4444" />
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.saveButton} 
                  onPress={handleSave}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <>
                      <Save size={16} color="#FFFFFF" />
                      <Text style={styles.saveButtonText}>Save Changes</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Danger Zone */}
          {!isEditing && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Danger Zone</Text>
              <TouchableOpacity 
                style={styles.deleteButton} 
                onPress={handleDelete}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#EF4444" />
                ) : (
                  <>
                    <Trash2 size={16} color="#EF4444" />
                    <Text style={styles.deleteButtonText}>Delete Vehicle</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}
          
          <View style={styles.bottomSpacing} />
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
  editButton: {
    padding: 8,
  },
  placeholder: {
    width: 36,
  },
  content: {
    flex: 1,
  },
  imageSection: {
    paddingVertical: 16,
    paddingLeft: 16,
  },
  mainImage: {
    width: 250,
    height: 150,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: '#F3F4F6',
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
  },
  placeholderText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  thumbnailImage: {
    width: 100,
    height: 150,
    borderRadius: 8,
    marginRight: 8,
    backgroundColor: '#F3F4F6',
  },
  addImageButton: {
    width: 100,
    height: 150,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
  },
  addImageText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  vehicleHeader: {
    marginBottom: 16,
  },
  vehicleTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vehicleName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  toggleButton: {
    padding: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  pricingContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  priceCard: {
    flex: 1,
    backgroundColor: '#059669',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  priceValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  priceLabel: {
    fontSize: 12,
    color: '#BBF7D0',
    marginTop: 2,
  },
  specGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  specItem: {
    width: '48%',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
  },
  specLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  specValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  featureTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  featureText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '500',
  },
  noFeaturesText: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  documentContainer: {
    gap: 12,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
  },
  docLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  docValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    textAlign: 'center',
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  selectContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
  },
  selectedOption: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  selectText: {
    fontSize: 14,
    color: '#6B7280',
  },
  selectedText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  editActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EF4444',
    backgroundColor: '#FFFFFF',
    gap: 8,
  },
  cancelButtonText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#059669',
    gap: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
    gap: 8,
  },
  deleteButtonText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#059669',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 40,
  },
});

export default VehicleDetailsScreen;