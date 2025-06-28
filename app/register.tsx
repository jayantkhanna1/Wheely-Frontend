import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react-native';
import Toast from '@/components/Toast';
import DatePicker from '@/components/DatePicker';
import { ScreenWrapper } from '../components/ScreenWrapper';

interface PasswordRequirement {
  text: string;
  met: boolean;
}

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    dateOfBirth: null as Date | null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'error' as 'success' | 'error' });

  const passwordRequirements: PasswordRequirement[] = [
    { text: '8 characters minimum', met: formData.password.length >= 8 },
    { text: 'a number', met: /\d/.test(formData.password) },
    { text: 'a symbol', met: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password) },
  ];

  const hasUppercase = /[A-Z]/.test(formData.password);
  const hasLowercase = /[a-z]/.test(formData.password);
  const allRequirementsMet = passwordRequirements.every(req => req.met) && hasUppercase && hasLowercase;

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ visible: true, message, type });
  };

  const hideToast = () => {
    setToast({ ...toast, visible: false });
  };

  const formatDateForAPI = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleContinue = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.dateOfBirth) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    if (!allRequirementsMet) {
      showToast('Please meet all password requirements', 'error');
      return;
    }

    setLoading(true);

    try {
      const apiUrl = `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/user/register/`;
      console.log('Making request to:', apiUrl);
      
      const requestData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password: formData.password,
        date_of_birth: formatDateForAPI(formData.dateOfBirth),
      };
      
      console.log('Request data:', requestData);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        // Check for successful registration message
        if (data.message === "User registered successfully. Please check your email for verification." || 
            data.message?.includes("OTP sent") || 
            data.success === true) {
          
          showToast('Registration successful! Please check your email for verification code.', 'success');
          
          // Navigate to verification screen immediately
          setTimeout(() => {
            router.push({
              pathname: '/verify-email',
              params: { 
                email: formData.email, 
                customerId: String(data.customer_id || data.id || 'temp_id')
              }
            });
          }, 1000);
        } else {
          showToast(data.message || 'Registration completed but verification step failed', 'error');
        }
      } else {
        // Handle different error scenarios
        if (response.status === 400) {
          showToast(data.message || 'Invalid registration data. Please check your inputs.', 'error');
        } else if (response.status === 409) {
          showToast('An account with this email already exists.', 'error');
        } else if (response.status >= 500) {
          showToast('Server error. Please try again later.', 'error');
        } else {
          showToast(data.message || 'Registration failed. Please try again.', 'error');
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error instanceof TypeError && error.message === 'Network request failed') {
        showToast('Cannot connect to server. Please check your internet connection and try again.', 'error');
      } else {
        showToast('Network error. Please try again.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Toast {...toast} onHide={hideToast} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={20} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create your account 1 / 2</Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={[styles.progressDot, styles.progressActive]} />
        <View style={[styles.progressDot, styles.progressActive]} />
        <View style={[styles.progressDot, styles.progressActive]} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              value={formData.firstName}
              onChangeText={(text) => setFormData({ ...formData, firstName: text })}
              placeholder="Enter your first name"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              value={formData.lastName}
              onChangeText={(text) => setFormData({ ...formData, lastName: text })}
              placeholder="Enter your last name"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              placeholder="Enter your email"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <DatePicker
              label="Date of Birth"
              value={formData.dateOfBirth}
              onChange={(date) => setFormData({ ...formData, dateOfBirth: date })}
              placeholder="Select your date of birth"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                value={formData.password}
                onChangeText={(text) => setFormData({ ...formData, password: text })}
                placeholder="Enter password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
              >
                {showPassword ? (
                  <EyeOff size={18} color="#6B7280" />
                ) : (
                  <Eye size={18} color="#6B7280" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.requirementsContainer}>
            {passwordRequirements.map((requirement, index) => (
              <View key={index} style={styles.requirement}>
                <View style={[styles.requirementDot, requirement.met && styles.requirementMet]} />
                <Text style={[styles.requirementText, requirement.met && styles.requirementTextMet]}>
                  {requirement.text}
                </Text>
              </View>
            ))}
            <View style={styles.requirement}>
              <View style={[styles.requirementDot, hasUppercase && styles.requirementMet]} />
              <Text style={[styles.requirementText, hasUppercase && styles.requirementTextMet]}>
                an uppercase letter
              </Text>
            </View>
            <View style={styles.requirement}>
              <View style={[styles.requirementDot, hasLowercase && styles.requirementMet]} />
              <Text style={[styles.requirementText, hasLowercase && styles.requirementTextMet]}>
                a lowercase letter
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.continueButton, (!allRequirementsMet || loading) && styles.continueButtonDisabled]}
            onPress={handleContinue}
            disabled={!allRequirementsMet || loading}
          >
            <Text style={styles.continueButtonText}>
              {loading ? 'Creating Account...' : 'Continue'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.termsContainer}>
          <Text style={styles.termsText}>
            By using Wheely, you agree to the{'\n'}
            <Text style={styles.termsLink}>Terms</Text> and <Text style={styles.termsLink}>Privacy Policy</Text>.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginLeft: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 8,
  },
  progressDot: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E7EB',
  },
  progressActive: {
    backgroundColor: '#059669',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 14,
    color: '#374151',
    backgroundColor: '#FFFFFF',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 14,
    color: '#374151',
  },
  eyeButton: {
    padding: 16,
  },
  requirementsContainer: {
    gap: 12,
    marginTop: 8,
  },
  requirement: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  requirementDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
  },
  requirementMet: {
    backgroundColor: '#059669',
  },
  requirementText: {
    fontSize: 12,
    color: '#6B7280',
  },
  requirementTextMet: {
    color: '#059669',
  },
  continueButton: {
    backgroundColor: '#059669',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  continueButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  termsContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  termsText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: '#059669',
    fontWeight: '600',
  },
});