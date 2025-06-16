import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import Toast from '@/components/Toast';

export default function VerifyEmailScreen() {
  const { email, customerId } = useLocalSearchParams();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'error' as 'success' | 'error' });
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ visible: true, message, type });
  };

  const hideToast = () => {
    setToast({ ...toast, visible: false });
  };

  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyEmail = async () => {
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      showToast('Please enter the complete 6-digit code', 'error');
      return;
    }

    setLoading(true);

    try {
      const apiUrl = `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/user/verifyEmail/`;
      console.log('Making verification request to:', apiUrl);
      
      const requestData = {
        email: email,
        otp: parseInt(otpString),
      };
      
      console.log('Verification request data:', requestData);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      console.log('Verification response status:', response.status);
      const data = await response.json();
      console.log('Verification response data:', data);

      if (response.ok && (data.message === "Email verified successfully" || data.success === true)) {
        showToast('Email verified successfully!', 'success');
        setTimeout(() => {
          router.replace('/(tabs)');
        }, 1500);
      } else {
        if (response.status === 400) {
          showToast('Invalid OTP format. Please check your code.', 'error');
        } else if (response.status === 404) {
          showToast('OTP expired or not found. Please request a new code.', 'error');
        } else {
          showToast(data.message || 'Invalid OTP. Please try again.', 'error');
        }
      }
    } catch (error) {
      console.error('Verification error:', error);
      
      if (error instanceof TypeError && error.message === 'Network request failed') {
        showToast('Cannot connect to server. Please check your internet connection.', 'error');
      } else {
        showToast('Network error. Please try again.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!customerId) {
      showToast('Unable to resend OTP. Please try registering again.', 'error');
      return;
    }

    setResendLoading(true);

    try {
      const apiUrl = `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/user/resendOtp/`;
      console.log('Making resend OTP request to:', apiUrl);
      
      const requestData = {
        user_id: parseInt(String(customerId)),
      };
      
      console.log('Resend OTP request data:', requestData);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      console.log('Resend OTP response status:', response.status);
      const data = await response.json();
      console.log('Resend OTP response data:', data);

      if (response.ok && data.message === "OTP sent successfully") {
        showToast('New verification code sent to your email!', 'success');
        // Clear current OTP inputs
        setOtp(['', '', '', '', '', '']);
        // Focus first input
        inputRefs.current[0]?.focus();
      } else {
        showToast(data.message || 'Failed to resend code. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      
      if (error instanceof TypeError && error.message === 'Network request failed') {
        showToast('Cannot connect to server. Please check your internet connection.', 'error');
      } else {
        showToast('Network error. Please try again.', 'error');
      }
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Toast {...toast} onHide={hideToast} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verify your email 2 / 2</Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={[styles.progressDot, styles.progressActive]} />
        <View style={[styles.progressDot, styles.progressActive]} />
        <View style={styles.progressDot} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <View style={styles.messageContainer}>
            <Text style={styles.message}>
              We just sent a 6-digit code to{'\n'}
              <Text style={styles.email}>{email}</Text> enter it below:
            </Text>
          </View>

          <View style={styles.otpContainer}>
            <Text style={styles.codeLabel}>Verification Code</Text>
            <View style={styles.otpInputContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (inputRefs.current[index] = ref)}
                  style={[styles.otpInput, digit && styles.otpInputFilled]}
                  value={digit}
                  onChangeText={(value) => handleOtpChange(value, index)}
                  onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                  keyboardType="numeric"
                  maxLength={1}
                  textAlign="center"
                  autoFocus={index === 0}
                  selectTextOnFocus
                />
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={[styles.verifyButton, loading && styles.verifyButtonDisabled]}
            onPress={handleVerifyEmail}
            disabled={loading}
          >
            <Text style={styles.verifyButtonText}>
              {loading ? 'Verifying...' : 'Verify Email'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.resendContainer} 
            onPress={handleResendOTP}
            disabled={resendLoading}
          >
            <Text style={styles.resendText}>
              Didn't receive the code? <Text style={[styles.resendLink, resendLoading && styles.resendLinkDisabled]}>
                {resendLoading ? 'Sending...' : 'Resend Code'}
              </Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.changeEmailContainer}>
            <Text style={styles.changeEmailText}>
              Wrong email? <Text style={styles.changeEmailLink}>Send to different email</Text>
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
    fontSize: 20,
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
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    minHeight: 400,
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  message: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    lineHeight: 24,
  },
  email: {
    fontWeight: '600',
    color: '#059669',
  },
  otpContainer: {
    marginBottom: 40,
  },
  codeLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 16,
  },
  otpInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  otpInput: {
    flex: 1,
    height: 60,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    fontSize: 24,
    fontWeight: '600',
    color: '#374151',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  otpInputFilled: {
    borderColor: '#059669',
    backgroundColor: '#F0FDF4',
    shadowColor: '#059669',
    shadowOpacity: 0.1,
  },
  verifyButton: {
    backgroundColor: '#059669',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#059669',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  verifyButtonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0,
    elevation: 0,
  },
  verifyButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 8,
  },
  resendText: {
    fontSize: 16,
    color: '#6B7280',
  },
  resendLink: {
    color: '#059669',
    fontWeight: '600',
  },
  resendLinkDisabled: {
    color: '#9CA3AF',
  },
  changeEmailContainer: {
    alignItems: 'center',
    marginBottom: 40,
    paddingVertical: 8,
  },
  changeEmailText: {
    fontSize: 16,
    color: '#6B7280',
  },
  changeEmailLink: {
    color: '#059669',
    fontWeight: '600',
  },
  termsContainer: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 30,
  },
  termsText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  termsLink: {
    color: '#059669',
    fontWeight: '600',
  },
});