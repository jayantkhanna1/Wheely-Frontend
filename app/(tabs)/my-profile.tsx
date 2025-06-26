import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Alert,
  Modal,
  Image,
  ActivityIndicator,
} from 'react-native';
import {
  ArrowLeft,
  Edit3,
  Camera,
  CheckCircle,
  XCircle,
  Phone,
  Mail,
  User,
  MapPin,
  Calendar,
  Shield,
  Eye,
  EyeOff,
  Save,
  X,
} from 'lucide-react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserData {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  profile_image?: string;
  private_token: string;
  email_verified: boolean;
  phone_verified: boolean;
  driving_license_verified: boolean;
  created_at?: string;
}

interface MyProfileProps {
  userData?: UserData | null;
  setUserData?: (userData: UserData | null) => void;
}

export const MyProfile: React.FC<MyProfileProps> = ({ userData: propUserData, setUserData }) => {
  const [userData, setLocalUserData] = useState<UserData | null>(propUserData || null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showImageModal, setShowImageModal] = useState(false);
  const [editedData, setEditedData] = useState<Partial<UserData>>({});

  // Load user data from AsyncStorage if not provided as prop
  useEffect(() => {
    const loadUserData = async () => {
      try {
        if (propUserData) {
          setLocalUserData(propUserData);
          setInitialLoading(false);
          return;
        }

        // Try to load from AsyncStorage
        const storedData = await AsyncStorage.getItem('user_data');
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setLocalUserData(parsedData);
        } else {
          // If no stored data, create mock data for demonstration
          const mockUserData: UserData = {
            id: 12345,
            first_name: 'John',
            last_name: 'Doe',
            email: 'john.doe@example.com',
            phone: '+91 9876543210',
            date_of_birth: '15/01/1990',
            address: '123 Main Street, Apartment 4B',
            city: 'Bengaluru',
            state: 'Karnataka',
            pincode: '560001',
            profile_image: null,
            private_token: 'abc123xyz789',
            email_verified: true,
            phone_verified: false,
            driving_license_verified: false,
            created_at: '2023-06-15T10:30:00Z',
          };
          setLocalUserData(mockUserData);
          // Save mock data to AsyncStorage
          await AsyncStorage.setItem('user_data', JSON.stringify(mockUserData));
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    loadUserData();
  }, [propUserData]);

  useEffect(() => {
    if (userData) {
      setEditedData(userData);
    }
  }, [userData]);

  const getUserInitials = () => {
    return (userData?.first_name?.[0] || '') + (userData?.last_name?.[0] || '');
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData({ ...userData });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData({ ...userData });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update userData
      const updatedData = { ...userData, ...editedData } as UserData;
      setLocalUserData(updatedData);
      
      // Update parent component if setUserData is provided
      if (setUserData) {
        setUserData(updatedData);
      }
      
      // Save to AsyncStorage
      await AsyncStorage.setItem('user_data', JSON.stringify(updatedData));
      
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = async () => {
    Alert.alert(
      'Verify Email',
      'A verification link will be sent to your email address.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Send', 
          onPress: () => {
            Alert.alert('Success', 'Verification email sent!');
          }
        },
      ]
    );
  };

  const handleVerifyPhone = async () => {
    Alert.alert(
      'Verify Phone',
      'A verification code will be sent to your phone number.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Send', 
          onPress: () => {
            Alert.alert('Success', 'Verification code sent!');
          }
        },
      ]
    );
  };

  const handleUploadLicense = () => {
    Alert.alert(
      'Upload Driving License',
      'Please upload a clear photo of your driving license.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Camera', onPress: () => console.log('Open camera') },
        { text: 'Gallery', onPress: () => console.log('Open gallery') },
      ]
    );
  };

  const renderVerificationStatus = (isVerified: boolean, label: string, onPress?: () => void) => (
    <TouchableOpacity 
      style={[styles.verificationItem, isVerified && styles.verifiedItem]}
      onPress={onPress}
      disabled={isVerified}
    >
      <Text style={[styles.verificationLabel, isVerified && styles.verifiedLabel]}>
        {label}
      </Text>
      <View style={styles.verificationStatus}>
        {isVerified ? (
          <>
            <CheckCircle size={16} color="#059669" />
            <Text style={styles.verifiedText}>Verified</Text>
          </>
        ) : (
          <>
            <XCircle size={16} color="#EF4444" />
            <Text style={styles.unverifiedText}>Not Verified</Text>
          </>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderInputField = (
    key: keyof UserData,
    label: string,
    icon: React.ReactNode,
    placeholder?: string,
    keyboardType?: any
  ) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.inputWrapper}>
        <View style={styles.inputIcon}>{icon}</View>
        <TextInput
          style={[styles.textInput, !isEditing && styles.disabledInput]}
          value={editedData[key]?.toString() || ''}
          onChangeText={(text) => setEditedData({ ...editedData, [key]: text })}
          placeholder={placeholder}
          editable={isEditing}
          keyboardType={keyboardType || 'default'}
        />
      </View>
    </View>
  );

  // Show loading screen while initially loading data
  if (initialLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#059669" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show error state if no userData is available
  if (!userData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>Unable to load profile data</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => {
              setInitialLoading(true);
              // Trigger reload
            }}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={isEditing ? handleCancel : handleEdit}
        >
          {isEditing ? (
            <X size={20} color="#EF4444" />
          ) : (
            <Edit3 size={20} color="#059669" />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Picture Section */}
        <View style={styles.profileSection}>
          <TouchableOpacity 
            style={styles.profileImageContainer}
            onPress={() => setShowImageModal(true)}
          >
            {userData.profile_image ? (
              <Image source={{ uri: userData.profile_image }} style={styles.profileImage} />
            ) : (
              <View style={styles.profilePlaceholder}>
                <Text style={styles.profileInitials}>{getUserInitials()}</Text>
              </View>
            )}
            <View style={styles.cameraIcon}>
              <Camera size={16} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
          <Text style={styles.profileName}>
            {userData.first_name} {userData.last_name}
          </Text>
          <Text style={styles.profileEmail}>{userData.email}</Text>
        </View>

        {/* Verification Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Verification Status</Text>
          <View style={styles.verificationContainer}>
            {renderVerificationStatus(
              userData.email_verified,
              'Email Verification',
              !userData.email_verified ? handleVerifyEmail : undefined
            )}
            {renderVerificationStatus(
              userData.phone_verified,
              'Phone Verification',
              !userData.phone_verified ? handleVerifyPhone : undefined
            )}
            {renderVerificationStatus(
              userData.driving_license_verified,
              'Driving License',
              !userData.driving_license_verified ? handleUploadLicense : undefined
            )}
          </View>
        </View>

        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          {renderInputField('first_name', 'First Name', <User size={16} color="#6B7280" />, 'Enter first name')}
          {renderInputField('last_name', 'Last Name', <User size={16} color="#6B7280" />, 'Enter last name')}
          {renderInputField('email', 'Email', <Mail size={16} color="#6B7280" />, 'Enter email address', 'email-address')}
          {renderInputField('phone', 'Phone Number', <Phone size={16} color="#6B7280" />, 'Enter phone number', 'phone-pad')}
          {renderInputField('date_of_birth', 'Date of Birth', <Calendar size={16} color="#6B7280" />, 'DD/MM/YYYY')}
        </View>

        {/* Address Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Address Information</Text>
          {renderInputField('address', 'Address', <MapPin size={16} color="#6B7280" />, 'Enter your address')}
          {renderInputField('city', 'City', <MapPin size={16} color="#6B7280" />, 'Enter city')}
          {renderInputField('state', 'State', <MapPin size={16} color="#6B7280" />, 'Enter state')}
          {renderInputField('pincode', 'Pincode', <MapPin size={16} color="#6B7280" />, 'Enter pincode', 'numeric')}
        </View>

        {/* Account Security */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Security</Text>
          <TouchableOpacity style={styles.securityItem}>
            <Shield size={20} color="#6B7280" />
            <Text style={styles.securityText}>Change Password</Text>
            <ArrowLeft size={16} color="#6B7280" style={{ transform: [{ rotate: '180deg' }] }} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.securityItem}>
            <Eye size={20} color="#6B7280" />
            <Text style={styles.securityText}>Privacy Settings</Text>
            <ArrowLeft size={16} color="#6B7280" style={{ transform: [{ rotate: '180deg' }] }} />
          </TouchableOpacity>
        </View>

        {/* Account Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>User ID</Text>
            <Text style={styles.infoValue}>{userData.id}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Member Since</Text>
            <Text style={styles.infoValue}>
              {userData.created_at ? new Date(userData.created_at).toLocaleDateString() : 'June 2025'}
            </Text>
          </View>
        </View>

        {/* Save Button */}
        {isEditing && (
          <TouchableOpacity 
            style={[styles.saveButton, loading && styles.disabledButton]}
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
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Profile Image Modal */}
      <Modal
        visible={showImageModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowImageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.imageModal}>
            <Text style={styles.modalTitle}>Change Profile Picture</Text>
            <TouchableOpacity style={styles.modalOption}>
              <Camera size={20} color="#374151" />
              <Text style={styles.modalOptionText}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOption}>
              <Image style={{ width: 20, height: 20 }} />
              <Text style={styles.modalOptionText}>Choose from Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.modalCancel}
              onPress={() => setShowImageModal(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#059669',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
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
  profileSection: {
    alignItems: 'center',
    paddingVertical: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profilePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#059669',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitials: {
    fontSize: 32,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#059669',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  profileName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: '#6B7280',
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  verificationContainer: {
    gap: 12,
  },
  verificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  verifiedItem: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  verificationLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  verifiedLabel: {
    color: '#059669',
  },
  verificationStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#059669',
  },
  unverifiedText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#EF4444',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  inputIcon: {
    paddingHorizontal: 12,
  },
  textInput: {
    flex: 1,
    paddingVertical: 12,
    paddingRight: 12,
    fontSize: 16,
    color: '#111827',
  },
  disabledInput: {
    backgroundColor: '#F9FAFB',
    color: '#6B7280',
  },
  securityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 12,
  },
  securityText: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059669',
    marginHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  bottomSpacing: {
    height: 32,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 24,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    marginBottom: 12,
    width: '100%',
    gap: 12,
  },
  modalOptionText: {
    fontSize: 16,
    color: '#374151',
  },
  modalCancel: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 8,
  },
  modalCancelText: {
    fontSize: 16,
    color: '#6B7280',
  },
});

export default MyProfile;