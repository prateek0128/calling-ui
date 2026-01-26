import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, useColorScheme, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  visible: boolean;
  onHide: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, visible, onHide }) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(3000),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onHide();
      });
    }
  }, [visible]);

  if (!visible) return null;

  const getToastConfig = () => {
    switch (type) {
      case 'success':
        return { colors: ['#22c55e', '#16a34a'], emoji: '✅' };
      case 'error':
        return { colors: ['#ef4444', '#dc2626'], emoji: '❌' };
      case 'warning':
        return { colors: ['#f59e0b', '#d97706'], emoji: '⚠️' };
      case 'info':
      default:
        return { colors: ['#3b82f6', '#2563eb'], emoji: 'ℹ️' };
    }
  };

  const config = getToastConfig();

  return (
    <Animated.View
      style={[
        styles.container,
        { opacity: fadeAnim }
      ]}
    >
      <TouchableOpacity onPress={onHide} activeOpacity={0.9} style={styles.touchable}>
        <LinearGradient
          colors={config.colors}
          style={styles.toast}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.emoji}>{config.emoji}</Text>
          <Text style={styles.message} numberOfLines={2}>{message}</Text>
          <TouchableOpacity onPress={onHide} style={styles.closeButton}>
            <Ionicons name="close" size={16} color="white" />
          </TouchableOpacity>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    zIndex: 9999,
  },
  touchable: {
    width: '100%',
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    gap: 12,
  },
  emoji: {
    fontSize: 18,
  },
  message: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
    lineHeight: 20,
  },
  closeButton: {
    padding: 4,
  },
});