import React, { useState } from 'react';
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
} from 'react-native';
import {
  ArrowLeft,
  Edit3,
  Save,
  X,
  Star,
  Users,
  DollarSign,
  Calendar,
  MapPin,
  Camera,
  Settings,
  Eye,
  EyeOff,
  Trash2,
  CheckCircle,
  AlertCircle,
} from 'lucide-react-native';
import { router } from 'expo-router';

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

const VehicleDetailsScreen: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [vehicleData, setVehicleData] = useState<VehicleDetails>({
    id: '1',
    name: 'Honda City 2022',
    brand: 'Honda',
    model: 'City',
    year: 2022,
    image: 'https://via.placeholder.com/300x200/E5E7EB/374151?text=Honda+City',
    images: [
      'https://via.placeholder.com/300x200/E5E7EB/374151?text=Front+View',
      'https://via.placeholder.com/300x200/E5E7EB/374151?text=Interior',
      'https://via.placeholder.com/300x200/E5E7EB/374151?text=Side+View',
    ],
    status: 'active',
    earnings: '₹15,240',
    totalEarnings: '₹85,670',
    rating: 4.8,
    totalTrips: 12,
    description: 'Well-maintained Honda City with excellent fuel efficiency. Perfect for city drives and long trips.',
    pricePerDay: 2500,
    pricePerHour: 150,
    location: 'Koramangala, Bangalore',
    availability: true,
    features: ['AC', 'GPS', 'Bluetooth', 'USB Charging', 'Premium Sound'],
    fuelType: 'Petrol',
    transmission: 'Manual',
    seats: 5,
    mileage: '16.5 kmpl',
    registrationNumber: 'KA05MZ1234',
    insuranceExpiry: '2025-03-15',
    pucExpiry: '2024-08-20',
    lastServiced: '2024-11-15',
  });

  const [editedData, setEditedData] = useState<VehicleDetails>(vehicleData);

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

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData(vehicleData);
  };

  const handleSave = () => {
    setVehicleData(editedData);
    setIsEditing(false);
    Alert.alert('Success', 'Vehicle details updated successfully!');
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
          onPress: () => {
            Alert.alert('Deleted', 'Vehicle has been removed from your listings.');
            router.back();
          }
        },
      ]
    );
  };

  const toggleStatus = () => {
    const newStatus = vehicleData.status === 'active' ? 'inactive' : 'active';
    setVehicleData({ ...vehicleData, status: newStatus });
    Alert.alert(
      'Status Updated',
      `Vehicle is now ${newStatus}. ${newStatus === 'active' ? 'It will be visible to renters.' : 'It will be hidden from renters.'}`
    );
  };

  const updateField = (field: keyof VehicleDetails, value: any) => {
    setEditedData({ ...editedData, [field]: value });
  };

  const renderEditableField = (fieldConfig: EditableField) => {
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

  return (
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
        >
          {isEditing ? <Save size={20} color="#059669" /> : <Edit3 size={20} color="#059669" />}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Vehicle Images */}
        <View style={styles.imageSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Image source={{ uri: vehicleData.image }} style={styles.mainImage} />
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
              <Text style={styles.priceValue}>₹{isEditing ? editedData.pricePerDay : vehicleData.pricePerDay}</Text>
              <Text style={styles.priceLabel}>per day</Text>
            </View>
            <View style={styles.priceCard}>
              <Text style={styles.priceValue}>₹{isEditing ? editedData.pricePerHour : vehicleData.pricePerHour}</Text>
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
            {vehicleData.features.map((feature, index) => (
              <View key={index} style={styles.featureTag}>
                <CheckCircle size={12} color="#059669" />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
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
        {isEditing && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Edit Details</Text>
            {editableFields.map(renderEditableField)}
            
            <View style={styles.editActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                <X size={16} color="#EF4444" />
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Save size={16} color="#FFFFFF" />
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Danger Zone */}
        {!isEditing && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Danger Zone</Text>
            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
              <Trash2 size={16} color="#EF4444" />
              <Text style={styles.deleteButtonText}>Delete Vehicle</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
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
  editButton: {
    padding: 8,
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
});

export default VehicleDetailsScreen;