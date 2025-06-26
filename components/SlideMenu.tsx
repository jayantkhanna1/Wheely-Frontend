import React, { useRef, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  StyleSheet,
} from 'react-native';
import {
  X,
  User,
  MapIcon,
  Phone,
  Gift,
  CarIcon,
  Percent,
  HelpCircle,
  FileText,
  Globe,
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

interface MenuItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  onPress: () => void;
}

interface UserData {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  private_token: string;
  email_verified: boolean;
  phone_verified: boolean;
  driving_license_verified: boolean;
}

interface SlideMenuProps {
  visible: boolean;
  onClose: () => void;
  userData: UserData | null;
  setUserData: (userData: UserData | null) => void;
}

const { width: screenWidth } = Dimensions.get('window');

export const SlideMenu: React.FC<SlideMenuProps> = ({ 
  visible, 
  onClose, 
  userData, 
  setUserData 
}) => {
  const slideAnim = useRef(new Animated.Value(screenWidth)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: screenWidth,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const getUserInitials = () => {
    return (userData?.first_name?.[0] || '') + (userData?.last_name?.[0] || '');
  };

  const menuItems: MenuItem[] = [
    {
      id: 'trips',
      title: 'My Trips',
      icon: <MapIcon size={20} color="#374151" />,
      onPress: () => {
      router.push('/(tabs)/my-trips'); // or wherever you place this component
        // Add navigation logic here
        // router.push('/trips');
      }
    },
    {
      id: 'host',
      title: 'Host and Earn',
      // car icon
      icon: <CarIcon size={20} color="#374151" />,
      onPress: () => {
        router.push('/host');
      }
    },
    {
      id: 'contact',
      title: 'Contact Us',
      icon: <Phone size={20} color="#374151" />,
      onPress: () => {
        router.push('/contact-us'); // or wherever you place this component
        // Add navigation logic here
        // router.push('/contact');
      }
    },
    {
      id: 'profile',
      title: 'My Profile',
      icon: <User size={20} color="#374151" />,
      onPress: () => {
        router.push('/my-profile');
        // Add navigation logic here
        // router.push('/profile');
      }
    },
    {
      id: 'rewards',
      title: 'Rewards',
      icon: <Gift size={20} color="#374151" />,
      onPress: () => {
        router.push('/rewards');
        // Add navigation logic here
        // router.push('/rewards');
      }
    },
    {
      id: 'offers',
      title: 'Offers',
      icon: <Percent size={20} color="#374151" />,
      onPress: () => {
        router.push('/offers');
        // Add navigation logic here
        // router.push('/offers');
      }
    },
  
    {
      id: 'policies',
      title: 'Policies',
      icon: <FileText size={20} color="#374151" />,
      onPress: () => {
        router.push('/policies');
        // Add navigation logic here
        // router.push('/policies');
      }
    },
    {
      id: 'language',
      title: 'Language',
      icon: <Globe size={20} color="#374151" />,
      onPress: () => {
        router.push('/language');
        // Add navigation logic here
        // router.push('/language');
      }
    },
    {
      id: 'logout',
      title: 'Logout',
      icon: <X size={20} color="#374151" />,
      onPress: async () => {
        try {
          await AsyncStorage.removeItem('user_data');
          await AsyncStorage.removeItem('user_id');
          await AsyncStorage.removeItem('private_token');
          console.log('User data cleared from storage');
          setUserData(null);
          router.push('/login');
        } catch (error) {
          console.error('Error clearing user data:', error);
        }
      }
    }
  ];

  const handleMenuItemPress = (item: MenuItem) => {
    item.onPress();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <Animated.View 
              style={[
                styles.slideMenu,
                {
                  transform: [{ translateX: slideAnim }]
                }
              ]}
            >
              <View style={styles.menuHeader}>
                <View style={styles.menuProfileSection}>
                  <View style={styles.menuProfileIcon}>
                    <Text style={styles.menuProfileText}>{getUserInitials()}</Text>
                  </View>
                  <Text style={styles.menuProfileName}>{userData?.first_name}</Text>
                </View>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                  <X size={20} color="#374151" />
                </TouchableOpacity>
              </View>

              <View style={styles.menuContent}>
                {menuItems.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.menuItem}
                    onPress={() => handleMenuItemPress(item)}
                  >
                    <View style={styles.menuItemIcon}>
                      {item.icon}
                    </View>
                    <Text style={styles.menuItemText}>{item.title}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  slideMenu: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: screenWidth * 0.8,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: {
      width: -2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  menuProfileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuProfileIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#059669',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuProfileText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  menuProfileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  closeButton: {
    padding: 8,
  },
  menuContent: {
    flex: 1,
    paddingTop: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuItemIcon: {
    marginRight: 16,
    width: 20,
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
});


// How to use these components in your HomeScreen:

// 1. Import the components at the top of your file:
// import { HeaderWithProfile } from './components/HeaderWithProfile';
// import { SlideMenu } from './components/SlideMenu';

// 2. Replace your existing header JSX with:
// <HeaderWithProfile 
//   userData={userData} 
//   onProfilePress={openMenu}
// />

// 3. Replace your existing Modal JSX with:
// <SlideMenu
//   visible={showMenu}
//   onClose={closeMenu}
//   userData={userData}
//   setUserData={setUserData}
// />

// 4. Remove the following from your component:
// - slideAnim useRef
// - menuItems array
// - getUserInitials function
// - openMenu function (keep closeMenu if you need it elsewhere)
// - All the modal-related styles from your StyleSheet