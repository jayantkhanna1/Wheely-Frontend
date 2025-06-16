import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import Toast from '@/components/Toast';

export default function ChangeEmailScreen() {
  const { customerId } = useLocalSearchParams();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'error' as 'success' | 'error' });

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ visible: true, message, type });
  };

  const hideToast = () => {
    setToast({ ...toast, visible: false });
  };

  const handleSendOTP = async () => {
    if (!email) {
      showToast('Please enter your email address', 'error');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast('Please enter a valid email address', 'error');
      return;
    }

    if (!customerId) {
      showToast('Unable to send OTP. Please try registering again.', 'error');
      return;
    }

    setLoading(true);

    try {
      const apiUrl = `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/user/resendOtp/`;
      console.log('Making change email OTP request to:', apiUrl);
      
      const requestData = {
        user_id: parseInt(String(customerId)),
        email: email, // Include new email if your API supports it
      };
      
      console.log('Change email OTP request data:', requestData);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      console.log('Change email OTP response status:', response.status);
      const data = await response.json();
      console.log('Change email OTP response data:', data);

      if (response.ok && data.message === "OTP sent successfully") {
        showToast('Verification code sent to your new email!', 'success');
        
        // Navigate to verification screen with new email
        setTimeout(() => {
          router.replace({
            pathname: '/verify-email',
            params: { 
              email: email, 
              customerId: String(customerId)
            }
          });
        }, 1500);
      } else {
        showToast(data.message || 'Failed to send verification code. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Change email OTP error:', error);
      
      if (error instanceof TypeError && error.message === 'Network request failed') {
        showToast('Cannot connect to server. Please check your internet connection.', 'error');
      } else {
        showToast('Network error. Please try again.', 'error');
      }
    } finally {
      setLoading(false);
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
        <Text style={styles.headerTitle}>Change email address</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.form}>
          <View style={styles.messageContainer}>
            <Text style={styles.message}>Enter a different email address</Text>
            <Text style={styles.submessage}>
              We'll send a verification code to your new email address
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>New Email Address</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your new email"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus={true}
            />
          </View>

          <TouchableOpacity
            style={[styles.sendButton, loading && styles.sendButtonDisabled]}
            onPress={handleSendOTP}
            disabled={loading}
          >
            <Text style={styles.sendButtonText}>
              {loading ? 'Sending Code...' : 'Send Verification Code'}
            </Text>
          </TouchableOpacity>

          <View style={styles.noteContainer}>
            <Text style={styles.noteText}>
              💡 Make sure you have access to this email address to receive the verification code
            </Text>
          </View>
        </View>

        <View style={styles.termsContainer}>
          <Text style={styles.termsText}>
            By using Wheely, you agree to the{'\n'}
            <Text style={styles.termsLink}>Terms</Text> and <Text style={styles.termsLink}>Privacy Policy</Text>.
          </Text>
        </View>
      </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  form: {
    flex: 1,
    paddingTop: 40,
    gap: 32,
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  message: {
    fontSize: 22,
    color: '#374151',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 8,
  },
  submessage: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
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
  sendButton: {
    backgroundColor: '#059669',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#059669',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  sendButtonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0,
    elevation: 0,
  },
  sendButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  noteContainer: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  noteText: {
    fontSize: 14,
    color: '#059669',
    textAlign: 'center',
    lineHeight: 20,
  },
  termsContainer: {
    alignItems: 'center',
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