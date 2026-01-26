import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { WhatsAppModal } from './WhatsAppModal';

interface QuickActionsProps {
  isDark: boolean;
  currentUser?: any;
  onFetchUsers: () => void;
  onOpenFilters: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  isDark,
  currentUser,
  onFetchUsers,
  onOpenFilters,
}) => {
  return null;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradient: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
});