import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SmartStatusSelectorProps {
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  isDark: boolean;
}

const QUICK_STATUSES = [
  { key: 'Interested', icon: 'heart', color: '#22c55e', label: '✅ Interested' },
  { key: 'Not Interested', icon: 'heart-dislike', color: '#ef4444', label: '❌ Not Interested' },
  { key: 'Busy Call Later', icon: 'time', color: '#f59e0b', label: '⏰ Call Later' },
  { key: 'Declined', icon: 'close-circle', color: '#dc2626', label: '🚫 Declined' },
];

export const SmartStatusSelector: React.FC<SmartStatusSelectorProps> = ({
  selectedStatus,
  onStatusChange,
  isDark,
}) => {
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: isDark ? '#f8fafc' : '#0f172a' }]}>
        Quick Status
      </Text>
      <View style={styles.statusGrid}>
        {QUICK_STATUSES.map((status) => {
          const isSelected = selectedStatus === status.key;
          return (
            <TouchableOpacity
              key={status.key}
              style={[
                styles.statusButton,
                {
                  backgroundColor: isSelected ? status.color : (isDark ? '#334155' : '#f8fafc'),
                  borderColor: status.color,
                  borderWidth: isSelected ? 0 : 1,
                },
              ]}
              onPress={() => onStatusChange(status.key)}
            >
              <Ionicons
                name={status.icon as any}
                size={18}
                color={isSelected ? 'white' : status.color}
              />
              <Text
                style={[
                  styles.statusText,
                  { color: isSelected ? 'white' : (isDark ? '#f8fafc' : '#0f172a') },
                ]}
              >
                {status.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    minWidth: '47%',
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
  },
});