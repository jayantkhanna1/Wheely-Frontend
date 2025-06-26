import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import {
  ArrowLeft,
  Gift,
  Star,
  Trophy,
  Coins,
  Calendar,
  Users,
  Target,
} from 'lucide-react-native';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

interface Reward {
  id: string;
  title: string;
  description: string;
  points: number;
  type: 'voucher' | 'discount' | 'freebie';
  expiryDate: string;
  icon: React.ReactNode;
}
export default function RewardsPage() {
  const [activeTab, setActiveTab] = useState<'available' | 'history'>('available');
  const [userPoints] = useState(1250);

  const availableRewards: Reward[] = [
    {
      id: '1',
      title: '₹100 Off Next Ride',
      description: 'Get ₹100 discount on your next booking',
      points: 500,
      type: 'discount',
      expiryDate: '30 days',
      icon: <Gift size={24} color="#059669" />,
    },
    {
      id: '2',
      title: 'Free Premium Upgrade',
      description: 'Upgrade to premium vehicle at no extra cost',
      points: 800,
      type: 'freebie',
      expiryDate: '15 days',
      icon: <Star size={24} color="#F59E0B" />,
    },
    {
      id: '3',
      title: 'Fuel Voucher ₹200',
      description: 'Redeem for fuel at partner stations',
      points: 1000,
      type: 'voucher',
      expiryDate: '60 days',
      icon: <Trophy size={24} color="#8B5CF6" />,
    },
    {
      id: '4',
      title: '₹50 Cashback',
      description: 'Direct cashback to your wallet',
      points: 300,
      type: 'discount',
      expiryDate: '45 days',
      icon: <Coins size={24} color="#10B981" />,
    },
  ];

  const rewardHistory = [
    {
      id: 'h1',
      title: '₹100 Off Ride',
      date: '2024-06-20',
      points: 500,
      status: 'Used',
    },
    {
      id: 'h2',
      title: 'Free Coffee Voucher',
      date: '2024-06-15',
      points: 200,
      status: 'Expired',
    },
  ];

  const handleRedeem = (reward: Reward) => {
    if (userPoints >= reward.points) {
      console.log(`Redeeming ${reward.title}`);
      // Add redemption logic here
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'voucher': return '#8B5CF6';
      case 'discount': return '#059669';
      case 'freebie': return '#F59E0B';
      default: return '#6B7280';
    }
  };

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
        <Text style={styles.headerTitle}>Rewards</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Points Card */}
        <View style={styles.pointsCard}>
          <View style={styles.pointsHeader}>
            <View style={styles.pointsIconContainer}>
              <Coins size={32} color="#FFFFFF" />
            </View>
            <View style={styles.pointsInfo}>
              <Text style={styles.pointsLabel}>Your Points</Text>
              <Text style={styles.pointsValue}>{userPoints.toLocaleString()}</Text>
            </View>
          </View>
          <Text style={styles.pointsSubtext}>
            Keep riding to earn more points and unlock amazing rewards!
          </Text>
        </View>

        {/* How to Earn Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How to Earn Points</Text>
          <View style={styles.earnGrid}>
            <View style={styles.earnCard}>
              <Target size={20} color="#059669" />
              <Text style={styles.earnTitle}>Complete Rides</Text>
              <Text style={styles.earnPoints}>+10 points per ride</Text>
            </View>
            <View style={styles.earnCard}>
              <Users size={20} color="#059669" />
              <Text style={styles.earnTitle}>Refer Friends</Text>
              <Text style={styles.earnPoints}>+100 points each</Text>
            </View>
            <View style={styles.earnCard}>
              <Calendar size={20} color="#059669" />
              <Text style={styles.earnTitle}>Daily Check-in</Text>
              <Text style={styles.earnPoints}>+5 points daily</Text>
            </View>
            <View style={styles.earnCard}>
              <Star size={20} color="#059669" />
              <Text style={styles.earnTitle}>Rate Rides</Text>
              <Text style={styles.earnPoints}>+2 points each</Text>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'available' && styles.activeTab]}
            onPress={() => setActiveTab('available')}
          >
            <Text style={[
              styles.tabText, 
              activeTab === 'available' && styles.activeTabText
            ]}>
              Available Rewards
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'history' && styles.activeTab]}
            onPress={() => setActiveTab('history')}
          >
            <Text style={[
              styles.tabText, 
              activeTab === 'history' && styles.activeTabText
            ]}>
              History
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content based on active tab */}
        {activeTab === 'available' ? (
          <View style={styles.rewardsContainer}>
            {availableRewards.map((reward) => (
              <View key={reward.id} style={styles.rewardCard}>
                <View style={styles.rewardHeader}>
                  <View style={styles.rewardIcon}>
                    {reward.icon}
                  </View>
                  <View style={styles.rewardInfo}>
                    <Text style={styles.rewardTitle}>{reward.title}</Text>
                    <Text style={styles.rewardDescription}>{reward.description}</Text>
                    <View style={styles.rewardMeta}>
                      <View style={[
                        styles.typeBadge, 
                        { backgroundColor: getTypeColor(reward.type) }
                      ]}>
                        <Text style={styles.typeBadgeText}>
                          {reward.type.toUpperCase()}
                        </Text>
                      </View>
                      <Text style={styles.expiryText}>Expires in {reward.expiryDate}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.rewardAction}>
                  <Text style={styles.pointsRequired}>{reward.points} pts</Text>
                  <TouchableOpacity
                    style={[
                      styles.redeemButton,
                      userPoints < reward.points && styles.redeemButtonDisabled
                    ]}
                    onPress={() => handleRedeem(reward)}
                    disabled={userPoints < reward.points}
                  >
                    <Text style={[
                      styles.redeemButtonText,
                      userPoints < reward.points && styles.redeemButtonTextDisabled
                    ]}>
                      {userPoints >= reward.points ? 'Redeem' : 'Not Enough'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.historyContainer}>
            {rewardHistory.map((item) => (
              <View key={item.id} style={styles.historyCard}>
                <View style={styles.historyInfo}>
                  <Text style={styles.historyTitle}>{item.title}</Text>
                  <Text style={styles.historyDate}>{item.date}</Text>
                  <Text style={styles.historyPoints}>{item.points} points</Text>
                </View>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: item.status === 'Used' ? '#10B981' : '#EF4444' }
                ]}>
                  <Text style={styles.statusText}>{item.status}</Text>
                </View>
              </View>
            ))}
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
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  pointsCard: {
    margin: 16,
    padding: 24,
    backgroundColor: '#059669',
    borderRadius: 16,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  pointsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  pointsIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  pointsInfo: {
    flex: 1,
  },
  pointsLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  pointsValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  pointsSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  earnGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  earnCard: {
    width: (width - 48) / 2,
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  earnTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginTop: 8,
    textAlign: 'center',
  },
  earnPoints: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '500',
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    margin: 16,
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
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
  rewardsContainer: {
    padding: 16,
  },
  rewardCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  rewardHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  rewardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rewardInfo: {
    flex: 1,
  },
  rewardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  rewardDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  rewardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  expiryText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  rewardAction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pointsRequired: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
  },
  redeemButton: {
    backgroundColor: '#059669',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  redeemButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  redeemButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  redeemButtonTextDisabled: {
    color: '#9CA3AF',
  },
  historyContainer: {
    padding: 16,
  },
  historyCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  historyInfo: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  historyDate: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  historyPoints: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});