import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { getAssignmentStats, AssignmentStats, sendStatsEmail } from '../endpoints/stats';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface StatsCardProps {
  isDark: boolean;
}

export const StatsCard: React.FC<StatsCardProps> = ({ isDark }) => {
  const [stats, setStats] = useState<AssignmentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [showCurrentDay, setShowCurrentDay] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);

  useEffect(() => {
    loadUserStats();
  }, [showCurrentDay]);

  const loadUserStats = async () => {
    try {
      // Get current user
      const userInfo = await AsyncStorage.getItem('userInfo');
      let username = 'ADMIN';
      let email = '';
      if (userInfo) {
        const parsedUser = JSON.parse(userInfo);
        username = parsedUser.username || parsedUser.email;
        email = parsedUser.email || '';
      }
      setCurrentUser(username);
      setUserEmail(email);

      // Fetch stats
      const response = await getAssignmentStats(showCurrentDay);
      const userStats = response.data.find(stat => stat.assigned_to === username);
      setStats(userStats || null);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'interested': return '#22c55e';
      case 'not_interested': return '#ef4444';
      case 'escalate_to_sonia': return '#8b5cf6';
      case 'declined': return '#dc2626';
      case 'busy_call_later': return '#f59e0b';
      case 'married_engaged': return '#ec4899';
      case 'complete_soon': return '#10b981';
      case 'need_help_completing': return '#3b82f6';
      case 'not_serious': return '#f97316';
      case 'pending': return '#6b7280';
      default: return '#64748b';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'interested': return 'heart';
      case 'not_interested': return 'heart-dislike';
      case 'escalate_to_sonia': return 'arrow-up-circle';
      case 'declined': return 'close-circle';
      case 'busy_call_later': return 'time';
      case 'married_engaged': return 'people';
      case 'complete_soon': return 'checkmark-circle';
      case 'need_help_completing': return 'help-circle';
      case 'not_serious': return 'warning';
      case 'pending': return 'hourglass';
      default: return 'ellipse';
    }
  };

  const formatStatusLabel = (status: string) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleSendEmail = async () => {
    if (!userEmail) {
      alert('Email not found in user profile');
      return;
    }
    setSendingEmail(true);
    try {
      const time = showCurrentDay ? 'current' : 'all';
      await sendStatsEmail(currentUser, userEmail, time);
      alert('Statistics sent to your email successfully!');
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email. Please try again.');
    } finally {
      setSendingEmail(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: isDark ? '#1e293b' : '#ffffff' }]}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={[styles.loadingText, { color: isDark ? '#94a3b8' : '#64748b' }]}>
          Loading your stats...
        </Text>
      </View>
    );
  }

  if (!stats) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: isDark ? '#1e293b' : '#ffffff' }]}>
        <Ionicons name="stats-chart" size={48} color={isDark ? '#64748b' : '#94a3b8'} />
        <Text style={[styles.emptyText, { color: isDark ? '#94a3b8' : '#64748b' }]}>
          No statistics available for {currentUser}
        </Text>
      </View>
    );
  }

  const statusItems = [
    { key: 'interested', value: stats.interested },
    { key: 'not_interested', value: stats.not_interested },
    { key: 'escalate_to_sonia', value: stats.escalate_to_sonia },
    { key: 'declined', value: stats.declined },
    { key: 'busy_call_later', value: stats.busy_call_later },
    { key: 'married_engaged', value: stats.married_engaged },
    { key: 'complete_soon', value: stats.complete_soon },
    { key: 'need_help_completing', value: stats.need_help_completing },
    { key: 'not_serious', value: stats.not_serious },
    { key: 'pending', value: stats.pending },
  ].filter(item => item.value > 0);

  return (
    <LinearGradient
      colors={isDark ? ['#1e293b', '#334155'] : ['#ffffff', '#f8fafc']}
      style={styles.container}
    >
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <LinearGradient
            colors={['#3b82f6', '#8b5cf6']}
            style={styles.iconContainer}
          >
            <Ionicons name="stats-chart" size={24} color="white" />
          </LinearGradient>
          <View style={styles.titleContent}>
            <Text style={[styles.title, { color: isDark ? '#f8fafc' : '#0f172a' }]}>
              My Statistics
            </Text>
            <Text style={[styles.subtitle, { color: isDark ? '#94a3b8' : '#64748b' }]}>
              {currentUser} • Total: {stats.total}
            </Text>
          </View>
        </View>
        
        {/* Toggle Button */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              !showCurrentDay && styles.activeToggle,
              { backgroundColor: !showCurrentDay ? '#3b82f6' : (isDark ? '#374151' : '#f3f4f6') }
            ]}
            onPress={() => setShowCurrentDay(false)}
          >
            <Text style={[
              styles.toggleText,
              { color: !showCurrentDay ? '#ffffff' : (isDark ? '#94a3b8' : '#64748b') }
            ]}>
              All Time
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              showCurrentDay && styles.activeToggle,
              { backgroundColor: showCurrentDay ? '#3b82f6' : (isDark ? '#374151' : '#f3f4f6') }
            ]}
            onPress={() => setShowCurrentDay(true)}
          >
            <Text style={[
              styles.toggleText,
              { color: showCurrentDay ? '#ffffff' : (isDark ? '#94a3b8' : '#64748b') }
            ]}>
              Today
            </Text>
          </TouchableOpacity>
        </View>

        {/* Send Email Button */}
        <TouchableOpacity
          style={[
            styles.emailButton,
            { backgroundColor: isDark ? '#374151' : '#f3f4f6' }
          ]}
          onPress={handleSendEmail}
          disabled={sendingEmail}
        >
          {sendingEmail ? (
            <ActivityIndicator size="small" color="#3b82f6" />
          ) : (
            <>
              <Ionicons name="mail" size={16} color="#3b82f6" />
              <Text style={[styles.emailButtonText, { color: isDark ? '#94a3b8' : '#64748b' }]}>
                Email Stats
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsGrid}>
          {statusItems.map((item) => {
            const percentage = stats.total > 0 ? (item.value / stats.total) * 100 : 0;
            const color = getStatusColor(item.key);
            
            return (
              <View
                key={item.key}
                style={[
                  styles.statCard,
                  { backgroundColor: isDark ? '#334155' : '#ffffff' }
                ]}
              >
                <View style={styles.statHeader}>
                  <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
                    <Ionicons
                      name={getStatusIcon(item.key) as any}
                      size={20}
                      color={color}
                    />
                  </View>
                  <Text style={[styles.statValue, { color: isDark ? '#f8fafc' : '#0f172a' }]}>
                    {item.value}
                  </Text>
                </View>
                
                <Text style={[styles.statLabel, { color: isDark ? '#94a3b8' : '#64748b' }]}>
                  {formatStatusLabel(item.key)}
                </Text>
                
                <View style={[styles.progressBar, { backgroundColor: isDark ? '#475569' : '#e2e8f0' }]}>
                  <View
                    style={[
                      styles.progressFill,
                      { backgroundColor: color, width: `${percentage}%` }
                    ]}
                  />
                </View>
                
                <Text style={[styles.percentage, { color: color }]}>
                  {percentage.toFixed(1)}%
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    margin: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.2)',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  titleContent: {
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 2,
  },
  content: {
    maxHeight: 300,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  statCard: {
    width: '47%',
    padding: 16,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  percentage: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'right',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    borderRadius: 16,
    margin: 16,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    borderRadius: 16,
    margin: 16,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(148, 163, 184, 0.1)',
    borderRadius: 8,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  activeToggle: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
  },
  emailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 12,
    gap: 8,
  },
  emailButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});