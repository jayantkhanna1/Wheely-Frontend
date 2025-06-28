import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  ArrowLeft,
  Car,
  DollarSign,
  Calendar,
  MapPin,
  Shield,
  Users,
  Bike,
  Star,
  Plus,
  ChevronRight,
  Recycle as Bicycle,
} from 'lucide-react-native';
import { router } from 'expo-router';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface EarningsCard {
  title: string;
  amount: string;
  subtitle: string;
  color: string;
}

interface FeatureCard {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface HostVehicle {
  id: string;
  name: string;
  image: string;
  status: 'active' | 'inactive';
  earnings: string;
  rating: number;
  trips: number;
  type: string;
}

interface BackendVehicle {
  id: number;
  vehicle_name: string;
  vehicle_brand: string;
  vehicle_model: string;
  vehicle_type: string;
  price_per_hour: string;
  price_per_day: string;
  location: any;
  owner_name: string;
  rating: number;
  is_available: boolean;
  primary_photo: string;
  seating_capacity: number;
  fuel_type: string;
  year: string;
  transmission?: string;
  features?: string[];
  total_bookings?: number;
}

const HostScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'vehicles' | 'earnings'>('overview');
  const [hostVehicles, setHostVehicles] = useState<HostVehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);
  
  // Mock data for earnings
  const earningsData: EarningsCard[] = [
    {
      title: 'This Month',
      amount: '₹24,190',
      subtitle: '+18% from last month',
      color: '#059669',
    },
    {
      title: 'Total Earnings',
      amount: '₹1,45,670',
      subtitle: 'All time earnings',
      color: '#3B82F6',
    },
  ];

  const features: FeatureCard[] = [
    {
      icon: <Shield size={24} color="#059669" />,
      title: 'Comprehensive Insurance',
      description: 'Your vehicle is protected with full coverage during rentals',
    },
    {
      icon: <Users size={24} color="#059669" />,
      title: 'Verified Renters',
      description: 'All renters go through identity and license verification',
    },
    {
      icon: <DollarSign size={24} color="#059669" />,
      title: 'Competitive Earnings',
      description: 'Earn up to ₹20,000+ per month by hosting your vehicle',
    },
    {
      icon: <Calendar size={24} color="#059669" />,
      title: 'Flexible Schedule',
      description: 'Set your own availability and pricing',
    },
  ];

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    if (userData && activeTab === 'vehicles') {
      fetchHostVehicles();
    }
  }, [userData, activeTab]);

  const loadUserData = async () => {
    try {
      const storedUserData = await AsyncStorage.getItem('user_data');
      if (storedUserData) {
        const parsedUserData = JSON.parse(storedUserData);
        setUserData(parsedUserData);
        console.log('User data loaded:', parsedUserData);
      } else {
        console.log('No user data found in storage');
        setError('Please log in to view your vehicles');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      setError('Failed to load user data');
    }
  };

  const fetchHostVehicles = async () => {
    if (!userData || !userData.id || !userData.private_token) {
      setError('User authentication required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const apiURL = `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/host/getAllVehicles`;
      console.log('Fetching host vehicles from:', apiURL);

      const requestData = {
        user_id: userData.id,
        private_token: userData.private_token
      };

      console.log('Request data:', requestData);

      const response = await fetch(apiURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      console.log('Host vehicles response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Host vehicles data:', data);
        
        if (Array.isArray(data)) {
          const transformedVehicles = transformBackendVehicles(data);
          setHostVehicles(transformedVehicles);
        } else {
          console.error('Unexpected response format:', data);
          setError('Unexpected data format received from server');
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error Response:', errorData);
        setError(errorData.message || `Failed to fetch vehicles. Status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching host vehicles:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const transformBackendVehicles = (backendVehicles: BackendVehicle[]): HostVehicle[] => {
    return backendVehicles.map(vehicle => {
      // Get the primary photo or the first photo in the array
      let vehicleImage = '';
      if (vehicle.primary_photo) {
        vehicleImage = vehicle.primary_photo;
      } else if (vehicle.primary_photo === null) {
        // Use default image based on vehicle type
        if (vehicle.vehicle_type === 'Bicycle') {
          vehicleImage = 'https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop';
        } else if (vehicle.vehicle_type === '2_wheeler') {
          vehicleImage = 'https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop';
        } else {
          vehicleImage = 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop';
        }
      }

      return {
        id: vehicle.id.toString(),
        name: vehicle.vehicle_name,
        image: vehicleImage,
        status: vehicle.is_available ? 'active' : 'inactive',
        earnings: `₹${(Math.random() * 10000).toFixed(0)}`, // Mock earnings since not provided by API
        rating: vehicle.rating || 0,
        trips: vehicle.total_bookings || 0,
        type: vehicle.vehicle_type
      };
    });
  };

  const handleAddVehicle = () => {
    router.push('/add-vehicle');
  };

  const handleAddBicycle = () => {
    router.push('/add-bicycle');
  };

  const handleVehiclePress = (vehicle: HostVehicle) => {
    router.push('/vehicle-details');
  };

  const getVehicleTypeIcon = (type: string) => {
    switch (type) {
      case 'Bicycle':
        return <Bicycle size={20} color="#059669" />;
      case '2_wheeler':
        return <Bike size={20} color="#059669" />;
      case '4_wheeler':
      default:
        return <Car size={20} color="#059669" />;
    }
  };

  const renderOverview = () => (
    <View style={styles.tabContent}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Earnings Overview</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.earningsScroll}>
          {earningsData.map((earning, index) => (
            <View key={index} style={[styles.earningsCard, { borderLeftColor: earning.color }]}>
              <Text style={styles.earningsTitle}>{earning.title}</Text>
              <Text style={styles.earningsAmount}>{earning.amount}</Text>
              <Text style={styles.earningsSubtitle}>{earning.subtitle}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleAddVehicle}
          >
            <Plus size={20} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Add Vehicle</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={handleAddBicycle}
          >
            <Bike size={20} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Add Bicycle</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Features */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Why Host With Us?</Text>
        {features.map((feature, index) => (
          <View key={index} style={styles.featureCard}>
            <View style={styles.featureIcon}>
              {feature.icon}
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderVehicles = () => (
    <View style={styles.tabContent}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Vehicles</Text>
          <View style={styles.addButtonsContainer}>
            <TouchableOpacity 
              style={styles.smallAddButton} 
              onPress={handleAddVehicle}
            >
              <Car size={16} color="#059669" />
              <Plus size={16} color="#059669" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.smallAddButton} 
              onPress={handleAddBicycle}
            >
              <Bicycle size={16} color="#059669" />
              <Plus size={16} color="#059669" />
            </TouchableOpacity>
          </View>
        </View>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#059669" />
            <Text style={styles.loadingText}>Loading your vehicles...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity 
              style={styles.retryButton} 
              onPress={fetchHostVehicles}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : hostVehicles.length === 0 ? (
          <View style={styles.emptyState}>
            <Car size={48} color="#9CA3AF" />
            <Text style={styles.emptyStateTitle}>No vehicles added yet</Text>
            <Text style={styles.emptyStateDescription}>
              Add your first vehicle to start earning
            </Text>
            <View style={styles.emptyStateActions}>
              <TouchableOpacity style={styles.actionButton} onPress={handleAddVehicle}>
                <Car size={16} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>Add Vehicle</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={handleAddBicycle}>
                <Bicycle size={16} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>Add Bicycle</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          hostVehicles.map((vehicle) => (
            <TouchableOpacity
              key={vehicle.id}
              style={styles.vehicleCard}
              onPress={() => handleVehiclePress(vehicle)}
            >
              <Image 
                source={{ uri: vehicle.image }} 
                style={styles.vehicleImage}
                defaultSource={{ uri: 'https://via.placeholder.com/150x100/E5E7EB/374151?text=Vehicle' }}
              />
              <View style={styles.vehicleInfo}>
                <View style={styles.vehicleHeader}>
                  <Text style={styles.vehicleName}>{vehicle.name}</Text>
                  <View style={styles.vehicleTypeIcon}>
                    {getVehicleTypeIcon(vehicle.type)}
                  </View>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(vehicle.status) }]}>
                  <Text style={styles.statusText}>{vehicle.status.toUpperCase()}</Text>
                </View>
                <View style={styles.vehicleStats}>
                  <View style={styles.statItem}>
                    <DollarSign size={14} color="#059669" />
                    <Text style={styles.statText}>{vehicle.earnings}</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Star size={14} color="#F59E0B" />
                    <Text style={styles.statText}>{vehicle.rating}</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Users size={14} color="#6B7280" />
                    <Text style={styles.statText}>{vehicle.trips} trips</Text>
                  </View>
                </View>
              </View>
              <ChevronRight size={20} color="#9CA3AF" />
            </TouchableOpacity>
          ))
        )}
      </View>
    </View>
  );

  const renderEarnings = () => (
    <View style={styles.tabContent}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Earnings Breakdown</Text>
        
        {/* Monthly Earnings Chart Placeholder */}
        <View style={styles.chartPlaceholder}>
          <Text style={styles.chartTitle}>Monthly Earnings</Text>
          <Text style={styles.chartSubtitle}>Coming Soon</Text>
        </View>

        {/* Transaction History */}
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        <View style={styles.transactionCard}>
          <View style={styles.transactionInfo}>
            <Text style={styles.transactionTitle}>Trip Completed - Honda City</Text>
            <Text style={styles.transactionDate}>Dec 20, 2025</Text>
          </View>
          <Text style={styles.transactionAmount}>+₹2,400</Text>
        </View>
        <View style={styles.transactionCard}>
          <View style={styles.transactionInfo}>
            <Text style={styles.transactionTitle}>Trip Completed - Maruti Swift</Text>
            <Text style={styles.transactionDate}>Dec 18, 2025</Text>
          </View>
          <Text style={styles.transactionAmount}>+₹1,800</Text>
        </View>
      </View>
    </View>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10B981';
      case 'inactive': return '#EF4444';
      default: return '#6B7280';
    }
  };

  return (
    <ScreenWrapper>
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={20} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Host & Earn</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
          onPress={() => setActiveTab('overview')}
        >
          <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>
            Overview
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'vehicles' && styles.activeTab]}
          onPress={() => setActiveTab('vehicles')}
        >
          <Text style={[styles.tabText, activeTab === 'vehicles' && styles.activeTabText]}>
            Vehicles
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'earnings' && styles.activeTab]}
          onPress={() => setActiveTab('earnings')}
        >
          <Text style={[styles.tabText, activeTab === 'earnings' && styles.activeTabText]}>
            Earnings
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'vehicles' && renderVehicles()}
        {activeTab === 'earnings' && renderEarnings()}
      </ScrollView>
    </SafeAreaView>
    </ScreenWrapper>
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
  placeholder: {
    width: 36,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#059669',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#059669',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  addButtonsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  smallAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#059669',
    borderRadius: 8,
    padding: 8,
    gap: 4,
  },
  earningsScroll: {
    marginLeft: -16,
    paddingLeft: 16,
  },
  earningsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    minWidth: 160,
    borderLeftWidth: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  earningsTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 4,
  },
  earningsAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  earningsSubtitle: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#059669',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  actionButtonSecondary: {
    flex: 1,
    backgroundColor: '#F0FDF4',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    gap: 8,
  },
  actionButtonSecondaryText: {
    color: '#059669',
    fontSize: 14,
    fontWeight: '600',
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    gap: 12,
  },
  featureIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#F0FDF4',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyStateActions: {
    flexDirection: 'row',
    gap: 12,
  },
  vehicleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  vehicleImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  vehicleInfo: {
    flex: 1,
    marginLeft: 12,
  },
  vehicleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  vehicleTypeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  vehicleStats: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#6B7280',
  },
  chartPlaceholder: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  chartSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  transactionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 10,
  },
  errorContainer: {
    padding: 40,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#059669',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default HostScreen;