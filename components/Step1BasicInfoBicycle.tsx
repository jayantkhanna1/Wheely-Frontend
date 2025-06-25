// components/Step1BasicInfo.tsx
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { StepProps, DropdownOption, brandOptions } from '../types/BicycleTypes';


const Step1BasicInfo: React.FC<StepProps> = ({ formData, updateFormData, showDropdown, setShowDropdown }) => {
  const renderDropdown = (
    field: keyof typeof formData,
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

  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Basic Bicycle Information</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Bicycle Brand *</Text>
        {renderDropdown('brand', brandOptions, 'Select Bicycle brand')}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Model *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Domane SL 7"
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
    </View>
  );
};


export default Step1BasicInfo;

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