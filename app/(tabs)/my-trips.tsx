import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  Image,
  ActivityIndicator,
  Alert
} from 'react-native';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  Car,
  Bike,
  Recycle as Bicycle,
  Filter,
  Search,
} from 'lucide-react-native';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Trip {
  id: string;
  type: 'Bicycle' | '2_wheeler' | '4_wheeler';
  startLocation: string;
  endLocation: string;
  startTime: string;
  endTime: string;
  date: string;
  status: 'confirmed' | 'ongoing' | 'cancelled' | 'completed' | 'upcoming';
  amount: number;
  distance: string;
  duration: string;
  vehicleName: string;
  vehicleImage: string;
}

interface BackendTrip {
  id: number;
  vehicle: {
    id: number;
    vehicle_name: string;
    vehicle_brand: string;
    vehicle_model: string;
    vehicle_type: string;
    photos: Array<{
      id: number;
      photo: string;
      is_primary: boolean;
    }>;
    location: {
      address: string;
      city: string;
    };
    primary_photo?: string;
  };
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  amount: string;
  status: string;
  payment_method: string;
  created_at: string;
  updated_at: string;
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

interface MyTripsProps {
  userData?: UserData | null;
}

export const MyTrips: React.FC<MyTripsProps> = ({ userData: propUserData }) => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'completed' | 'ongoing' | 'upcoming'>('all');
  const [userData, setUserData] = useState<UserData | null>(propUserData || null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    if (userData) {
      fetchTrips();
    }
  }, [userData]);

  const loadUserData = async () => {
    try {
      if (propUserData) {
        setUserData(propUserData);
        return;
      }

      const storedUserData = await AsyncStorage.getItem('user_data');
      if (storedUserData) {
        const parsedUserData = JSON.parse(storedUserData);
        setUserData(parsedUserData);
        console.log('User data loaded:', parsedUserData);
      } else {
        console.log('No user data found in storage');
        setError('Please log in to view your trips');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      setError('Failed to load user data');
      setLoading(false);
    }
  };

  const fetchTrips = async () => {
    if (!userData || !userData.id || !userData.private_token) {
      setError('User authentication required');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const apiURL = `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/user/myrides/`;
      console.log('Fetching trips from:', apiURL);

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

      console.log('Trips response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Trips data:', data);
        
        if (Array.isArray(data)) {
          const transformedTrips = transformBackendTrips(data);
          setTrips(transformedTrips);
        } else {
          console.error('Unexpected response format:', data);
          setError('Unexpected data format received from server');
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error Response:', errorData);
        setError(errorData.message || `Failed to fetch trips. Status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching trips:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const transformBackendTrips = (backendTrips: BackendTrip[]): Trip[] => {
    return backendTrips.map(trip => {
      // Get the primary photo or the first photo in the array
      let vehicleImage = '';
      if (trip.vehicle.primary_photo) {
        vehicleImage = trip.vehicle.primary_photo;
      } else if (trip.vehicle.photos && trip.vehicle.photos.length > 0) {
        const primaryPhoto = trip.vehicle.photos.find(photo => photo.is_primary);
        vehicleImage = primaryPhoto ? primaryPhoto.photo : trip.vehicle.photos[0].photo;
      }

      // Determine vehicle type icon
      const vehicleType = trip.vehicle.vehicle_type === 'Bicycle' ? 'Bicycle' :
                         trip.vehicle.vehicle_type === '2_wheeler' ? '2_wheeler' : '4_wheeler';

      // Format dates and times
      const startDate = new Date(trip.start_date);
      const endDate = new Date(trip.end_date);
      
      // Parse start and end times
      let startTimeStr = trip.start_time;
      let endTimeStr = trip.end_time;
      
      // If start_time and end_time are full ISO strings, extract just the time part
      if (startTimeStr && startTimeStr.includes('T')) {
        const startDateTime = new Date(startTimeStr);
        startTimeStr = startDateTime.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
      }
      
      if (endTimeStr && endTimeStr.includes('T')) {
        const endDateTime = new Date(endTimeStr);
        endTimeStr = endDateTime.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
      }

      // Calculate duration (simple approximation)
      const durationMs = endDate.getTime() - startDate.getTime();
      const durationDays = Math.floor(durationMs / (1000 * 60 * 60 * 24));
      const durationHours = Math.floor((durationMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      
      let durationStr = '';
      if (durationDays > 0) {
        durationStr = `${durationDays}d ${durationHours}h`;
      } else {
        durationStr = `${durationHours}h`;
      }

      // Determine trip status
      let status: Trip['status'] = 'confirmed';
      if (trip.status === 'completed') {
        status = 'completed';
      } else if (trip.status === 'cancelled') {
        status = 'cancelled';
      } else {
        const now = new Date();
        if (startDate > now) {
          status = 'upcoming';
        } else if (endDate > now) {
          status = 'ongoing';
        }
      }

      return {
        id: trip.id.toString(),
        type: vehicleType,
        startLocation: trip.vehicle.location.address || trip.vehicle.location.city || 'Unknown location',
        endLocation: trip.vehicle.location.address || trip.vehicle.location.city || 'Unknown location',
        startTime: startTimeStr,
        endTime: endTimeStr,
        date: startDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        status: status,
        amount: parseFloat(trip.amount),
        distance: '~', // Not available in backend data
        duration: durationStr,
        vehicleName: trip.vehicle.vehicle_name,
        vehicleImage: vehicleImage || getDefaultVehicleImage(vehicleType)
      };
    });
  };

  const getDefaultVehicleImage = (type: string) => {
    switch (type) {
      case 'Bicycle':
        return 'https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop';
      case '2_wheeler':
        return 'https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop';
      case '4_wheeler':
      default:
        return 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop';
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTrips();
  };

  const getVehicleIcon = (type: string) => {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#059669';
      case 'ongoing':
        return '#F59E0B';
      case 'cancelled':
        return '#DC2626';
      case 'upcoming':
        return '#3B82F6';
      default:
        return '#6B7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'ongoing':
        return 'Ongoing';
      case 'cancelled':
        return 'Cancelled';
      case 'upcoming':
        return 'Upcoming';
      case 'confirmed':
        return 'Confirmed';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const filteredTrips = trips.filter(trip => {
    if (activeFilter === 'all') return true;
    return trip.status === activeFilter;
  });

  const renderTripCard = (trip: Trip) => (
    <TouchableOpacity key={trip.id} style={styles.tripCard}>
      <View style={styles.tripHeader}>
        <View style={styles.vehicleImageContainer}>
          <Image 
            source={{ uri: trip.vehicleImage }} 
            style={styles.vehicleImage}
            defaultSource={{ uri: getDefaultVehicleImage(trip.type) }}
          />
        </View>
        <View style={styles.tripHeaderContent}>
          <Text style={styles.vehicleName}>{trip.vehicleName}</Text>
          <Text style={styles.tripDate}>{trip.date}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(trip.status) + '20' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(trip.status) }]}>
              {getStatusText(trip.status)}
            </Text>
          </View>
        </View>
        <View style={styles.vehicleIconContainer}>
          {getVehicleIcon(trip.type)}
        </View>
      </View>

      <View style={styles.locationContainer}>
        <View style={styles.locationRow}>
          <View style={styles.locationDot} />
          <Text style={styles.locationText}>{trip.startLocation}</Text>
        </View>
        <View style={styles.locationLine} />
        <View style={styles.locationRow}>
          <View style={[styles.locationDot, styles.destinationDot]} />
          <Text style={styles.locationText}>{trip.endLocation}</Text>
        </View>
      </View>

      <View style={styles.tripDetails}>
        <View style={styles.detailItem}>
          <Clock size={14} color="#6B7280" />
          <Text style={styles.detailText}>{trip.startTime} - {trip.endTime}</Text>
        </View>
        <View style={styles.detailItem}>
          <Calendar size={14} color="#6B7280" />
          <Text style={styles.detailText}>{trip.duration}</Text>
        </View>
      </View>

      {trip.status === 'completed' && (
        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>Amount Paid</Text>
          <Text style={styles.amountValue}>₹{trip.amount.toFixed(2)}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Trips</Text>
          <TouchableOpacity style={styles.searchButton}>
            <Search size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {['all', 'ongoing', 'upcoming', 'completed'].map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterTab,
                  activeFilter === filter && styles.activeFilterTab
                ]}
                onPress={() => setActiveFilter(filter as any)}
              >
                <Text style={[
                  styles.filterText,
                  activeFilter === filter && styles.activeFilterText
                ]}>
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Trips List */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#059669" />
            <Text style={styles.loadingText}>Loading your trips...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchTrips}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView
            style={styles.tripsContainer}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            showsVerticalScrollIndicator={false}
          >
            {filteredTrips.length > 0 ? (
              filteredTrips.map(renderTripCard)
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateTitle}>No trips found</Text>
                <Text style={styles.emptyStateText}>
                  {activeFilter === 'all' 
                    ? "You haven't taken any trips yet. Start exploring!"
                    : `No ${activeFilter} trips found.`
                  }
                </Text>
              </View>
            )}
          </ScrollView>
        )}
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
  searchButton: {
    padding: 8,
  },
  filterContainer: {
    paddingVertical: 16,
    paddingLeft: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  filterTab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
  },
  activeFilterTab: {
    backgroundColor: '#059669',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  tripsContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  tripCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  tripHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  vehicleImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 12,
  },
  vehicleImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  tripHeaderContent: {
    flex: 1,
    justifyContent: 'center',
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  tripDate: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  vehicleIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  locationContainer: {
    marginVertical: 12,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#059669',
    marginRight: 12,
  },
  destinationDot: {
    backgroundColor: '#EF4444',
  },
  locationLine: {
    width: 1,
    height: 20,
    backgroundColor: '#E5E7EB',
    marginLeft: 4,
    marginVertical: 4,
  },
  locationText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  tripDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 6,
  },
  detailText: {
    fontSize: 12,
    color: '#6B7280',
  },
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  amountLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  amountValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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

export default MyTrips;