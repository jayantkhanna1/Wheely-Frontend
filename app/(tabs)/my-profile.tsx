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
  Switch,
  Dimensions,
  Platform,
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
  Lock,
  Settings,
  Bell,
  Globe,
  UserCheck,
  ImageIcon,
  Download,
  Trash2,
  LogOut,
} from 'lucide-react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScreenWrapper } from '../../components/ScreenWrapper';

const { width } = Dimensions.get('window');

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

interface PrivacySettings {
  profileVisibility: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  locationSharing: boolean;
  dataCollection: boolean;
  thirdPartySharing: boolean;
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
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editedData, setEditedData] = useState<Partial<UserData>>({});
  
  // Password change states
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Privacy settings state
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    profileVisibility: true,
    emailNotifications: true,
    smsNotifications: false,
    locationSharing: false,
    dataCollection: true,
    thirdPartySharing: false,
  });

  // Validation states
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

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
        const storedPrivacySettings = await AsyncStorage.getItem('privacy_settings');
        
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
            profile_image: "null",
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

        if (storedPrivacySettings) {
          setPrivacySettings(JSON.parse(storedPrivacySettings));
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        Alert.alert('Error', 'Failed to load profile data');
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

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const validatePincode = (pincode: string): boolean => {
    const pincodeRegex = /^[1-9][0-9]{5}$/;
    return pincodeRegex.test(pincode);
  };

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (!editedData.first_name?.trim()) {
      errors.first_name = 'First name is required';
    }

    if (!editedData.last_name?.trim()) {
      errors.last_name = 'Last name is required';
    }

    if (!editedData.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!validateEmail(editedData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!editedData.phone?.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!validatePhone(editedData.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }

    if (editedData.pincode && !validatePincode(editedData.pincode)) {
      errors.pincode = 'Please enter a valid 6-digit pincode';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const getUserInitials = () => {
    return (userData?.first_name?.[0] || '') + (userData?.last_name?.[0] || '');
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData({ ...userData });
    setValidationErrors({});
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData({ ...userData });
    setValidationErrors({});
  };

  const handleSave = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors in the form');
      return;
    }

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
      setValidationErrors({});
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Change Password functionality
  const handleChangePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      Alert.alert('Error', 'Please fill all password fields');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      Alert.alert('Error', 'New password must be at least 8 characters long');
      return;
    }

    // Password strength validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(passwordData.newPassword)) {
      Alert.alert(
        'Weak Password', 
        'Password must contain at least:\n• One uppercase letter\n• One lowercase letter\n• One number\n• One special character\n• Minimum 8 characters'
      );
      return;
    }

    setPasswordLoading(true);
    try {
      // Simulate API call for password change
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert('Success', 'Password changed successfully!');
      setShowPasswordModal(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setShowPasswords({
        current: false,
        new: false,
        confirm: false,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to change password. Please try again.');
    } finally {
      setPasswordLoading(false);
    }
  };

  // Photo editing functionality
  const handleImageSelection = (source: 'camera' | 'gallery') => {
    setShowImageModal(false);
    
    // Simulate image selection and upload
    Alert.alert(
      'Photo Selected',
      `Image from ${source} selected. Uploading...`,
      [
        {
          text: 'OK',
          onPress: () => {
            // Simulate successful upload with a placeholder image URL
            const mockImageUrl = `https://ui-avatars.com/api/?name=${userData?.first_name}+${userData?.last_name}&size=200&background=059669&color=fff`;
            
            if (userData) {
              const updatedData = { ...userData, profile_image: mockImageUrl };
              setLocalUserData(updatedData);
              AsyncStorage.setItem('user_data', JSON.stringify(updatedData));
              
              if (setUserData) {
                setUserData(updatedData);
              }
            }
          }
        }
      ]
    );
  };

  const removeProfileImage = () => {
    Alert.alert(
      'Remove Photo',
      'Are you sure you want to remove your profile photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            if (userData) {
              const updatedData = { ...userData, profile_image: undefined };
              setLocalUserData(updatedData);
              AsyncStorage.setItem('user_data', JSON.stringify(updatedData));
              
              if (setUserData) {
                setUserData(updatedData);
              }
            }
            setShowImageModal(false);
          }
        }
      ]
    );
  };

  // Privacy settings functionality
  const handlePrivacySettingChange = (key: keyof PrivacySettings, value: boolean) => {
    const updatedSettings = { ...privacySettings, [key]: value };
    setPrivacySettings(updatedSettings);
  };

  const savePrivacySettings = async () => {
    try {
      await AsyncStorage.setItem('privacy_settings', JSON.stringify(privacySettings));
      Alert.alert('Success', 'Privacy settings updated successfully!');
      setShowPrivacyModal(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to save privacy settings');
    }
  };

  // Account management
  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // Simulate API call to delete account
              await new Promise(resolve => setTimeout(resolve, 2000));
              
              // Clear local storage
              await AsyncStorage.multiRemove(['user_data', 'privacy_settings']);
              
              Alert.alert('Account Deleted', 'Your account has been successfully deleted.');
              
              // Navigate to login or onboarding screen
              if (setUserData) {
                setUserData(null);
              }
              router.replace('/login');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete account. Please try again.');
            }
          }
        }
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          onPress: async () => {
            try {
              // Clear auth tokens but keep user data
              await AsyncStorage.removeItem('auth_token');
              
              if (setUserData) {
                setUserData(null);
              }
              
              router.replace('/login');
            } catch (error) {
              console.error('Logout error:', error);
            }
          }
        }
      ]
    );
  };

  const handleDownloadData = () => {
    Alert.alert(
      'Download Data',
      'We will prepare your data and send a download link to your email address within 24 hours.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Request Download',
          onPress: () => {
            Alert.alert('Success', 'Data download request submitted. You will receive an email with the download link within 24 hours.');
          }
        }
      ]
    );
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
            Alert.alert('Success', 'Verification email sent! Please check your inbox.');
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
            Alert.alert('Success', 'Verification code sent! Please check your messages.');
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
        { text: 'Camera', onPress: () => console.log('Open camera for license') },
        { text: 'Gallery', onPress: () => console.log('Open gallery for license') },
      ]
    );
  };

  const renderVerificationStatus = (isVerified: boolean, label: string, onPress?: () => void) => (
    <TouchableOpacity
      style={[styles.verificationItem, isVerified && styles.verifiedItem]}
      onPress={onPress}
      disabled={isVerified}
      activeOpacity={isVerified ? 1 : 0.7}
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
            <Text style={styles.unverifiedText}>Tap to Verify</Text>
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
    keyboardType?: any,
    multiline?: boolean
  ) => {
    const hasError = validationErrors[key];
    
    return (
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>{label}</Text>
        <View style={[styles.inputWrapper, hasError && styles.inputError]}>
          <View style={styles.inputIcon}>{icon}</View>
          <TextInput
            style={[
              styles.textInput, 
              !isEditing && styles.disabledInput,
              multiline && styles.multilineInput
            ]}
            value={editedData[key]?.toString() || ''}
            onChangeText={(text) => {
              setEditedData({ ...editedData, [key]: text });
              // Clear error when user starts typing
              if (hasError) {
                setValidationErrors({ ...validationErrors, [key]: '' });
              }
            }}
            placeholder={placeholder}
            editable={isEditing}
            keyboardType={keyboardType || 'default'}
            multiline={multiline}
            numberOfLines={multiline ? 3 : 1}
          />
        </View>
        {hasError && <Text style={styles.errorText}>{hasError}</Text>}
      </View>
    );
  };

  const renderPrivacySetting = (
    key: keyof PrivacySettings,
    title: string,
    description: string,
    icon: React.ReactNode
  ) => (
    <View style={styles.privacyItem}>
      <View style={styles.privacyIcon}>{icon}</View>
      <View style={styles.privacyTextContent}>
        <Text style={styles.privacyTitle}>{title}</Text>
        <Text style={styles.privacyDescription}>{description}</Text>
      </View>
      <Switch
        value={privacySettings[key]}
        onValueChange={(value) => handlePrivacySettingChange(key, value)}
        trackColor={{ false: '#E5E7EB', true: '#059669' }}
        thumbColor={privacySettings[key] ? '#FFFFFF' : '#9CA3AF'}
        ios_backgroundColor="#E5E7EB"
      />
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
    <ScreenWrapper>
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.content}>
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

          {/* Profile Section */}
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
            {renderInputField('address', 'Address', <MapPin size={16} color="#6B7280" />, 'Enter your address', 'default', true)}
            {renderInputField('city', 'City', <MapPin size={16} color="#6B7280" />, 'Enter city')}
            {renderInputField('state', 'State', <MapPin size={16} color="#6B7280" />, 'Enter state')}
            {renderInputField('pincode', 'Pincode', <MapPin size={16} color="#6B7280" />, 'Enter pincode', 'numeric')}
          </View>

          {/* Account Security */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account Security</Text>
            <TouchableOpacity 
              style={styles.securityItem}
              onPress={() => setShowPasswordModal(true)}
            >
              <Shield size={20} color="#6B7280" />
              <Text style={styles.securityText}>Change Password</Text>
              <ArrowLeft size={16} color="#6B7280" style={{ transform: [{ rotate: '180deg' }] }} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.securityItem}
              onPress={() => setShowPrivacyModal(true)}
            >
              <Eye size={20} color="#6B7280" />
              <Text style={styles.securityText}>Privacy Settings</Text>
              <ArrowLeft size={16} color="#6B7280" style={{ transform: [{ rotate: '180deg' }] }} />
            </TouchableOpacity>
          </View>

          {/* Data & Account Management */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Data & Account</Text>
            <TouchableOpacity 
              style={styles.securityItem}
              onPress={handleDownloadData}
            >
              <Download size={20} color="#6B7280" />
              <Text style={styles.securityText}>Download My Data</Text>
              <ArrowLeft size={16} color="#6B7280" style={{ transform: [{ rotate: '180deg' }] }} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.securityItem}
              onPress={handleLogout}
            >
              <LogOut size={20} color="#6B7280" />
              <Text style={styles.securityText}>Logout</Text>
              <ArrowLeft size={16} color="#6B7280" style={{ transform: [{ rotate: '180deg' }] }} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.securityItem, styles.dangerItem]}
              onPress={handleDeleteAccount}
            >
              <Trash2 size={20} color="#EF4444" />
              <Text style={[styles.securityText, styles.dangerText]}>Delete Account</Text>
              <ArrowLeft size={16} color="#EF4444" style={{ transform: [{ rotate: '180deg' }] }} />
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
                  <Save size={20} color="#FFFFFF" />
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
          animationType="slide"
          onRequestClose={() => setShowImageModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.imageModal}>
              <Text style={styles.modalTitle}>Change Profile Picture</Text>
              <TouchableOpacity 
                style={styles.modalOption}
                onPress={() => handleImageSelection('camera')}
              >
                <Camera size={20} color="#374151" />
                <Text style={styles.modalOptionText}>Take Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalOption}
                onPress={() => handleImageSelection('gallery')}
              >
                <ImageIcon size={20} color="#374151" />
                <Text style={styles.modalOptionText}>Choose from Gallery</Text>
              </TouchableOpacity>
              {userData.profile_image && (
                <TouchableOpacity 
                  style={[styles.modalOption, styles.removeOption]}
                  onPress={removeProfileImage}
                >
                  <X size={20} color="#EF4444" />
                  <Text style={[styles.modalOptionText, styles.removeOptionText]}>Remove Photo</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity 
                style={styles.modalCancel}
                onPress={() => setShowImageModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Change Password Modal */}
        <Modal
          visible={showPasswordModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowPasswordModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.passwordModal}>
              <Text style={styles.modalTitle}>Change Password</Text>
              <ScrollView style={styles.passwordContent}>
                
                {/* Current Password */}
                <View style={styles.passwordInputContainer}>
                  <Text style={styles.passwordLabel}>Current Password</Text>
                  <View style={styles.passwordInputWrapper}>
                    <Lock size={16} color="#6B7280" />
                    <TextInput
                      style={styles.passwordInput}
                      value={passwordData.currentPassword}
                      onChangeText={(text) => setPasswordData({ ...passwordData, currentPassword: text })}
                      placeholder="Enter current password"
                      secureTextEntry={!showPasswords.current}
                      autoCapitalize="none"
                    />
                    <TouchableOpacity
                      onPress={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                    >
                      {showPasswords.current ? (
                        <EyeOff size={16} color="#6B7280" />
                      ) : (
                        <Eye size={16} color="#6B7280" />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>

                {/* New Password */}
                <View style={styles.passwordInputContainer}>
                  <Text style={styles.passwordLabel}>New Password</Text>
                  <View style={styles.passwordInputWrapper}>
                    <Lock size={16} color="#6B7280" />
                    <TextInput
                      style={styles.passwordInput}
                      value={passwordData.newPassword}
                      onChangeText={(text) => setPasswordData({ ...passwordData, newPassword: text })}
                      placeholder="Enter new password"
                      secureTextEntry={!showPasswords.new}
                      autoCapitalize="none"
                    />
                    <TouchableOpacity
                      onPress={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                    >
                      {showPasswords.new ? (
                        <EyeOff size={16} color="#6B7280" />
                      ) : (
                        <Eye size={16} color="#6B7280" />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Confirm Password */}
                <View style={styles.passwordInputContainer}>
                  <Text style={styles.passwordLabel}>Confirm New Password</Text>
                  <View style={styles.passwordInputWrapper}>
                    <Lock size={16} color="#6B7280" />
                    <TextInput
                      style={styles.passwordInput}
                      value={passwordData.confirmPassword}
                      onChangeText={(text) => setPasswordData({ ...passwordData, confirmPassword: text })}
                      placeholder="Confirm new password"
                      secureTextEntry={!showPasswords.confirm}
                      autoCapitalize="none"
                    />
                    <TouchableOpacity
                      onPress={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                    >
                      {showPasswords.confirm ? (
                        <EyeOff size={16} color="#6B7280" />
                      ) : (
                        <Eye size={16} color="#6B7280" />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Password Requirements */}
                <View style={styles.passwordRequirements}>
                  <Text style={styles.requirementsTitle}>Password Requirements:</Text>
                  <Text style={styles.requirementText}>• At least 8 characters long</Text>
                  <Text style={styles.requirementText}>• One uppercase letter</Text>
                  <Text style={styles.requirementText}>• One lowercase letter</Text>
                  <Text style={styles.requirementText}>• One number</Text>
                  <Text style={styles.requirementText}>• One special character (@$!%*?&)</Text>
                </View>
              </ScrollView>

              <View style={styles.passwordModalActions}>
                <TouchableOpacity 
                  style={styles.passwordCancelButton}
                  onPress={() => setShowPasswordModal(false)}
                >
                  <Text style={styles.passwordCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.passwordSaveButton, passwordLoading && styles.disabledButton]}
                  onPress={handleChangePassword}
                  disabled={passwordLoading}
                >
                  {passwordLoading ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.passwordSaveText}>Change Password</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Privacy Settings Modal */}
        <Modal
          visible={showPrivacyModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowPrivacyModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.privacyModal}>
              <Text style={styles.modalTitle}>Privacy Settings</Text>
              <ScrollView style={styles.privacyContent}>
                {renderPrivacySetting(
                  'profileVisibility',
                  'Profile Visibility',
                  'Make your profile visible to other users',
                  <UserCheck size={20} color="#6B7280" />
                )}
                {renderPrivacySetting(
                  'emailNotifications',
                  'Email Notifications',
                  'Receive notifications via email',
                  <Mail size={20} color="#6B7280" />
                )}
                {renderPrivacySetting(
                  'smsNotifications',
                  'SMS Notifications',
                  'Receive notifications via SMS',
                  <Phone size={20} color="#6B7280" />
                )}
                {renderPrivacySetting(
                  'locationSharing',
                  'Location Sharing',
                  'Share your location for better service',
                  <MapPin size={20} color="#6B7280" />
                )}
                {renderPrivacySetting(
                  'dataCollection',
                  'Data Collection',
                  'Allow collection of usage analytics',
                  <Settings size={20} color="#6B7280" />
                )}
                {renderPrivacySetting(
                  'thirdPartySharing',
                  'Third-party Sharing',
                  'Share data with trusted partners',
                  <Globe size={20} color="#6B7280" />
                )}
              </ScrollView>
              <View style={styles.privacyModalActions}>
                <TouchableOpacity 
                  style={styles.privacyCancelButton}
                  onPress={() => setShowPrivacyModal(false)}
                >
                  <Text style={styles.privacyCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.privacySaveButton}
                  onPress={savePrivacySettings}
                >
                  <Text style={styles.privacySaveText}>Save Settings</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 16,
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
    backgroundColor: '#FFFFFF',
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
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 16,
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
    backgroundColor: '#374151',
    width: 32,
    height: 32,
    borderRadius: 16,
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
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 20,
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
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  verifiedItem: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  verificationLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#991B1B',
  },
  verifiedLabel: {
    color: '#14532D',
  },
  verificationStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  verifiedText: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '500',
  },
  unverifiedText: {
    fontSize: 14,
    color: '#EF4444',
    fontWeight: '500',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  inputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
  },
  disabledInput: {
    color: '#6B7280',
  },
  multilineInput: {
    textAlignVertical: 'top',
    minHeight: 80,
  },
  securityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  securityText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#374151',
  },
  dangerItem: {
    borderBottomWidth: 0,
  },
  dangerText: {
    color: '#EF4444',
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  infoLabel: {
    fontSize: 16,
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 16,
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
    borderRadius: 8,
    gap: 8,
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 32,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  imageModal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalOptionText: {
    marginLeft: 16,
    fontSize: 16,
    color: '#374151',
  },
  removeOption: {
    borderBottomWidth: 0,
  },
  removeOptionText: {
    color: '#EF4444',
  },
  modalCancel: {
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 8,
  },
  modalCancelText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  passwordModal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    maxHeight: '80%',
  },
  passwordContent: {
    paddingHorizontal: 20,
    maxHeight: 400,
  },
  passwordInputContainer: {
    marginBottom: 16,
  },
  passwordLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  passwordInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    gap: 10,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
  },
  passwordRequirements: {
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  requirementText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  passwordModalActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 12,
  },
  passwordCancelButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
  },
  passwordCancelText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  passwordSaveButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    backgroundColor: '#059669',
    borderRadius: 8,
  },
  passwordSaveText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  privacyModal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    maxHeight: '80%',
  },
  privacyContent: {
    paddingHorizontal: 20,
    maxHeight: 400,
  },
  privacyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  privacyIcon: {
    marginRight: 12,
  },
  privacyTextContent: {
    flex: 1,
    marginRight: 12,
  },
  privacyTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  privacyDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  privacyModalActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 12,
  },
  privacyCancelButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
  },
  privacyCancelText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  privacySaveButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    backgroundColor: '#059669',
    borderRadius: 8,
  },
  privacySaveText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default MyProfile;