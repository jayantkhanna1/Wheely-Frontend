import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import Toast from '@/components/Toast';

export default function ResetPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'error' as 'success' | 'error' });

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ visible: true, message, type });
  };

  const hideToast = () => {
    setToast({ ...toast, visible: false });
  };

  const handleSendResetLink = async () => {
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

    setLoading(true);

    try {
      // Note: You'll need to implement the reset password endpoint on your backend
      const apiUrl = `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/user/reset-password/`;
      console.log('Making reset password request to:', apiUrl);
      
      const requestData = {
        email: email,
      };
      
      console.log('Reset password request data:', requestData);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      console.log('Reset password response status:', response.status);
      const data = await response.json();
      console.log('Reset password response data:', data);

      if (response.ok) {
        showToast('Password reset link sent to your email!', 'success');
        setTimeout(() => {
          router.back();
        }, 2000);
      } else {
        if (response.status === 404) {
          showToast('No account found with this email address', 'error');
        } else if (response.status >= 500) {
          showToast('Server error. Please try again later.', 'error');
        } else {
          showToast(data.message || 'Failed to send reset link. Please try again.', 'error');
        }
      }
    } catch (error) {
      console.error('Reset password error:', error);
      
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
        <Text style={styles.headerTitle}>Reset password</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.form}>
          <View style={styles.messageContainer}>
            <Text style={styles.message}>We will email you</Text>
            <Text style={styles.message}>a link to reset your password.</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="example@example.com"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <TouchableOpacity
            style={[styles.sendButton, loading && styles.sendButtonDisabled]}
            onPress={handleSendResetLink}
            disabled={loading}
          >
            <Text style={styles.sendButtonText}>
              {loading ? 'Sending...' : 'Send'}
            </Text>
          </TouchableOpacity>
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
    fontSize: 18,
    color: '#059669',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 26,
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