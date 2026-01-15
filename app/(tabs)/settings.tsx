import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme, ScrollView, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CustomPopup } from '../../components/CustomPopup';
import { getCustomerSupportUsers } from '../../endpoints/users';

export default function SettingsScreen() {
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [supportUsers, setSupportUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();

  useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    try {
      const storedUserInfo = await AsyncStorage.getItem('userInfo');
      if (storedUserInfo) {
        setUserInfo(JSON.parse(storedUserInfo));
      }
    } catch (error) {
      console.error('Error loading user info:', error);
    }
  };

  const loadSupportUsers = async () => {
    setLoading(true);
    try {
      const response = await getCustomerSupportUsers();
      setSupportUsers(response.users || []);
      setShowUserDetails(true);
    } catch (error) {
      console.error('Error loading support users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setShowLogoutPopup(true);
  };

  const confirmLogout = async () => {
    try {
      // Clear all AsyncStorage data
      await AsyncStorage.clear();
      console.log('All data cleared from AsyncStorage');
      setShowLogoutPopup(false);
      router.replace('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <LinearGradient
      colors={isDark ? ['#0f172a', '#1e293b', '#334155'] as const : ['#f0f9ff', '#e0f2fe', '#f8fafc'] as const}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDark ? '#f8fafc' : '#0f172a' }]}>Settings</Text>
      </View>

      <View style={styles.content}>
        {userInfo && (
          <View style={[
            styles.userInfoCard,
            { backgroundColor: isDark ? '#1e293b' : '#ffffff' }
          ]}>
            <View style={styles.userInfoHeader}>
              <Ionicons name="person-circle" size={40} color={isDark ? '#60a5fa' : '#3b82f6'} />
              <View style={styles.userDetails}>
                <Text style={[styles.userName, { color: isDark ? '#f8fafc' : '#0f172a' }]}>
                  {userInfo.username}
                </Text>
                <Text style={[styles.userEmail, { color: isDark ? '#94a3b8' : '#64748b' }]}>
                  {userInfo.email}
                </Text>
              </View>
            </View>
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.settingItem,
            { backgroundColor: isDark ? '#1e293b' : '#ffffff' }
          ]}
          onPress={loadSupportUsers}
          disabled={loading}
        >
          <View style={styles.settingLeft}>
            <Ionicons name="people-outline" size={24} color={isDark ? '#60a5fa' : '#3b82f6'} />
            <Text style={[styles.settingText, { color: isDark ? '#f8fafc' : '#0f172a' }]}>User Details</Text>
          </View>
          {loading ? (
            <ActivityIndicator size="small" color={isDark ? '#60a5fa' : '#3b82f6'} />
          ) : (
            <Ionicons name="chevron-forward" size={20} color={isDark ? '#94a3b8' : '#64748b'} />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.settingItem,
            { backgroundColor: isDark ? '#1e293b' : '#ffffff' }
          ]}
          onPress={handleLogout}
        >
          <View style={styles.settingLeft}>
            <Ionicons name="log-out-outline" size={24} color="#ef4444" />
            <Text style={[styles.settingText, { color: '#ef4444' }]}>Logout</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={isDark ? '#94a3b8' : '#64748b'} />
        </TouchableOpacity>
      </View>

      <CustomPopup
        visible={showLogoutPopup}
        title="Logout"
        message="Are you sure you want to logout?"
        type="warning"
        buttons={[
          {
            text: 'Cancel',
            onPress: () => setShowLogoutPopup(false),
            style: 'cancel'
          },
          {
            text: 'Logout',
            onPress: confirmLogout,
            style: 'destructive'
          }
        ]}
        onClose={() => setShowLogoutPopup(false)}
      />

      <CustomPopup
        visible={showUserDetails}
        title="Telecaller Users"
        message=""
        type="info"
        buttons={[
          {
            text: 'Close',
            onPress: () => setShowUserDetails(false),
            style: 'cancel'
          }
        ]}
        onClose={() => setShowUserDetails(false)}
      >
        <ScrollView style={styles.userList}>
          {supportUsers.map((user, index) => (
            <View key={index} style={[styles.userDetailCard, { backgroundColor: isDark ? '#334155' : '#f0f9ff' }]}>
              <Text style={[styles.userDetailName, { color: isDark ? '#f8fafc' : '#0f172a' }]}>{user.username}</Text>
              <Text style={[styles.userDetailText, { color: isDark ? '#94a3b8' : '#64748b' }]}>📧 {user.email}</Text>
              <Text style={[styles.userDetailText, { color: isDark ? '#94a3b8' : '#64748b' }]}>📱 {user.phone}</Text>
              <Text style={[styles.userDetailText, { color: isDark ? '#94a3b8' : '#64748b' }]}>ID: {user.admin_id}</Text>
            </View>
          ))}
        </ScrollView>
      </CustomPopup>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -1,
  },
  content: {
    paddingHorizontal: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  userInfoCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userDetails: {
    marginLeft: 16,
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    fontWeight: '500',
  },
  userList: {
    maxHeight: 300,
    marginTop: 16,
  },
  userDetailCard: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  userDetailName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  userDetailText: {
    fontSize: 14,
    marginBottom: 2,
  },
});