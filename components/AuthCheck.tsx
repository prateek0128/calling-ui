import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

interface AuthCheckProps {
  children: React.ReactNode;
}

export const AuthCheck: React.FC<AuthCheckProps> = ({ children }) => {
  const [isChecking, setIsChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuthToken();
  }, []);

  const checkAuthToken = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      
      if (token) {
        // Token exists, redirect to dashboard
        router.replace('/(tabs)');
      } else {
        // No token, stay on current screen
        setIsChecking(false);
      }
    } catch (error) {
      console.error('Error checking auth token:', error);
      setIsChecking(false);
    }
  };

  if (isChecking) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});