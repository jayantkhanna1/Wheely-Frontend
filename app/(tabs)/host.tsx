import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Alert,
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
} from 'lucide-react-native';
import { router } from 'expo-router';

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
  status: 'active' | 'inactive' ;
  earnings: string;
  rating: number;
  trips: number;
}

const HostScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'vehicles' | 'earnings'>('overview');
  
  // Mock data - replace with actual data from your API
  const [hostVehicles, setHostVehicles] = useState<HostVehicle[]>([
    {
      id: '1',
      name: 'Honda City 2022',
      image: 'https://via.placeholder.com/150x100/E5E7EB/374151?text=Car',
      status: 'active',
      earnings: '₹15,240',
      rating: 4.8,
      trips: 12,
    },
    {
      id: '2',
      name: 'Maruti Swift 2021',
      image: 'https://via.placeholder.com/150x100/E5E7EB/374151?text=Car',
      status: 'inactive',
      earnings: '₹8,950',
      rating: 4.5,
      trips: 7,
    },
  ]);

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

  const handleAddVehicle = () => {
    // Navigate to add vehicle screen
    // Alert.alert('Add Vehicle', 'Navigate to vehicle registration form');
    router.push('/add-vehicle');
  };
  const handleAddBicycle = () => {
    // Navigate to add bicycle screen
    router.push('/add-bicycle');
  };

  const handleVehiclePress = (vehicle: HostVehicle) => {
    // Navigate to vehicle details screen
    router.push('/vehicle-details');
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
          <TouchableOpacity style={styles.actionButton} onPress={handleAddVehicle}>
            <Plus size={20} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Add Vehicle</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.actionButtonSecondary}>
            <Calendar size={20} color="#059669" />
            <Text style={styles.actionButtonSecondaryText}>Add Bicycle</Text>
          </TouchableOpacity> */}
          <TouchableOpacity style={styles.actionButton} onPress={handleAddBicycle}>
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
          <TouchableOpacity onPress={handleAddVehicle}>
            <Plus size={20} color="#059669" />
          </TouchableOpacity>
        </View>
        
        {hostVehicles.length === 0 ? (
          <View style={styles.emptyState}>
            <Car size={48} color="#9CA3AF" />
            <Text style={styles.emptyStateTitle}>No vehicles added yet</Text>
            <Text style={styles.emptyStateDescription}>
              Add your first vehicle to start earning
            </Text>
            <TouchableOpacity style={styles.actionButton} onPress={handleAddVehicle}>
              <Plus size={20} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Add Vehicle</Text>
            </TouchableOpacity>
          </View>
        ) : (
          hostVehicles.map((vehicle) => (
            <TouchableOpacity
              key={vehicle.id}
              style={styles.vehicleCard}
              onPress={() => handleVehiclePress(vehicle)}
            >
              <Image source={{ uri: vehicle.image }} style={styles.vehicleImage} />
              <View style={styles.vehicleInfo}>
                <View style={styles.vehicleHeader}>
                  <Text style={styles.vehicleName}>{vehicle.name}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(vehicle.status) }]}>
                    <Text style={styles.statusText}>{vehicle.status.toUpperCase()}</Text>
                  </View>
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
            <Text style={styles.transactionDate}>Dec 20, 2024</Text>
          </View>
          <Text style={styles.transactionAmount}>+₹2,400</Text>
        </View>
        <View style={styles.transactionCard}>
          <View style={styles.transactionInfo}>
            <Text style={styles.transactionTitle}>Trip Completed - Maruti Swift</Text>
            <Text style={styles.transactionDate}>Dec 18, 2024</Text>
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
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
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
});

export default HostScreen;