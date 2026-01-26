import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface ProgressIndicatorProps {
  completed: number;
  total: number;
  isDark: boolean;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  completed,
  total,
  isDark,
}) => {
  const percentage = total > 0 ? (completed / total) * 100 : 0;
  
  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#1e293b' : '#ffffff' }]}>
      <View style={styles.header}>
        <Ionicons name="trending-up" size={20} color="#3b82f6" />
        <Text style={[styles.title, { color: isDark ? '#f8fafc' : '#0f172a' }]}>
          Today's Progress
        </Text>
      </View>
      
      <View style={styles.stats}>
        <Text style={[styles.number, { color: '#3b82f6' }]}>{completed}</Text>
        <Text style={[styles.label, { color: isDark ? '#94a3b8' : '#64748b' }]}>
          of {total} completed
        </Text>
      </View>
      
      <View style={[styles.progressBar, { backgroundColor: isDark ? '#334155' : '#e2e8f0' }]}>
        <LinearGradient
          colors={['#3b82f6', '#8b5cf6']}
          style={[styles.progressFill, { width: `${Math.min(percentage, 100)}%` }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
      </View>
      
      <Text style={[styles.percentage, { color: '#3b82f6' }]}>
        {percentage.toFixed(1)}% Complete
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginBottom: 8,
  },
  number: {
    fontSize: 24,
    fontWeight: '700',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  percentage: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'right',
  },
});