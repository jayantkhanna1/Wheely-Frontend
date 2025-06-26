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
} from 'react-native';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  Car,
  Bike,
  CarIcon,
  Filter,
  Search,
} from 'lucide-react-native';
import { router } from 'expo-router';

interface Trip {
  id: string;
  type: 'bicycle' | 'bike' | 'car';
  startLocation: string;
  endLocation: string;
  startTime: string;
  endTime: string;
  date: string;
  status: 'completed' | 'ongoing' | 'cancelled' | 'upcoming';
  amount: number;
  distance: string;
  duration: string;
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

export const MyTrips: React.FC<MyTripsProps> = ({ userData }) => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'completed' | 'ongoing' | 'upcoming'>('all');

  // Sample trip data - replace with actual API call
  const sampleTrips: Trip[] = [
    {
      id: '1',
      type: 'car',
      startLocation: 'Koramangala',
      endLocation: 'Electronic City',
      startTime: '9:00 AM',
      endTime: '10:30 AM',
      date: 'Jun 25, 2025',
      status: 'completed',
      amount: 450,
      distance: '12.5 km',
      duration: '1h 30m',
    },
    {
      id: '2',
      type: 'bike',
      startLocation: 'Indiranagar',
      endLocation: 'MG Road',
      startTime: '2:00 PM',
      endTime: '2:45 PM',
      date: 'Jun 24, 2025',
      status: 'completed',
      amount: 85,
      distance: '8.2 km',
      duration: '45m',
    },
    {
      id: '3',
      type: 'bicycle',
      startLocation: 'Cubbon Park',
      endLocation: 'UB City Mall',
      startTime: '7:00 AM',
      endTime: '7:30 AM',
      date: 'Jun 23, 2025',
      status: 'completed',
      amount: 25,
      distance: '3.1 km',
      duration: '30m',
    },
    {
      id: '4',
      type: 'car',
      startLocation: 'Whitefield',
      endLocation: 'Brigade Road',
      startTime: '6:30 PM',
      endTime: 'Ongoing',
      date: 'Today',
      status: 'ongoing',
      amount: 0,
      distance: '18.7 km',
      duration: 'Ongoing',
    },
    {
      id: '5',
      type: 'bike',
      startLocation: 'HSR Layout',
      endLocation: 'Bannerghatta Road',
      startTime: '11:00 AM',
      endTime: '',
      date: 'Jun 27, 2025',
      status: 'upcoming',
      amount: 0,
      distance: '6.4 km',
      duration: 'Est. 35m',
    },
  ];

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    // Replace with actual API call
    setTrips(sampleTrips);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTrips();
    setRefreshing(false);
  };

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'bicycle':
        return <Bike size={20} color="#059669" />;
      case 'bike':
        return <Car size={20} color="#059669" />;
      case 'car':
        return <CarIcon size={20} color="#059669" />;
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
      default:
        return status;
    }
  };

  const filteredTrips = trips.filter(trip => {
    if (activeFilter === 'all') return true;
    return trip.status === activeFilter;
  });

  const renderTripCard = (trip: Trip) => (
    <TouchableOpacity key={trip.id} style={styles.tripCard}>
      <View style={styles.tripHeader}>
        <View style={styles.vehicleIconContainer}>
          {getVehicleIcon(trip.type)}
        </View>
        <View style={styles.tripInfo}>
          <Text style={styles.tripDate}>{trip.date}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(trip.status) + '20' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(trip.status) }]}>
              {getStatusText(trip.status)}
            </Text>
          </View>
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
          <MapPin size={14} color="#6B7280" />
          <Text style={styles.detailText}>{trip.distance}</Text>
        </View>
        <View style={styles.detailItem}>
          <Calendar size={14} color="#6B7280" />
          <Text style={styles.detailText}>{trip.duration}</Text>
        </View>
      </View>

      {trip.status === 'completed' && (
        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>Amount Paid</Text>
          <Text style={styles.amountValue}>₹{trip.amount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
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
    </SafeAreaView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  vehicleIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tripInfo: {
    flex: 1,
    alignItems: 'flex-end',
  },
  tripDate: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
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
  },
  detailText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
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
});

export default MyTrips;