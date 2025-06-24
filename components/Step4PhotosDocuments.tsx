// components/Step4PhotosDocuments.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Alert, Image, StyleSheet } from 'react-native';
import { Camera, Upload, CheckCircle, X } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { StepProps } from '../types/VehicleTypes';

const Step4PhotosDocuments: React.FC<StepProps> = ({ formData, updateFormData }) => {
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

  return (
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
              <Text style={styles.documentFileName}>
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
};

export default Step4PhotosDocuments;

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