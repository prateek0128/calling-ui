import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { LocationPicker } from '../components/LocationPicker';

export default function LocationDemoScreen() {
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <LinearGradient
      colors={isDark ? ['#0f172a', '#1e293b'] : ['#f0f9ff', '#e0f2fe']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: isDark ? '#f8fafc' : '#0f172a' }]}>
            Location Picker Demo
          </Text>
          <Text style={[styles.subtitle, { color: isDark ? '#94a3b8' : '#64748b' }]}>
            Select your state and city
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: isDark ? '#1e293b' : '#ffffff' }]}>
          <LocationPicker
            selectedState={selectedState}
            selectedCity={selectedCity}
            onStateChange={setSelectedState}
            onCityChange={setSelectedCity}
            isDark={isDark}
          />
        </View>

        {(selectedState || selectedCity) && (
          <View style={[styles.resultCard, { backgroundColor: isDark ? '#1e293b' : '#ffffff' }]}>
            <Text style={[styles.resultTitle, { color: isDark ? '#f8fafc' : '#0f172a' }]}>
              Selected Location
            </Text>
            {selectedState && (
              <Text style={[styles.resultText, { color: isDark ? '#94a3b8' : '#64748b' }]}>
                State: {selectedState}
              </Text>
            )}
            {selectedCity && (
              <Text style={[styles.resultText, { color: isDark ? '#94a3b8' : '#64748b' }]}>
                City: {selectedCity}
              </Text>
            )}
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  card: {
    padding: 20,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20,
  },
  resultCard: {
    padding: 20,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  resultText: {
    fontSize: 16,
    marginBottom: 4,
  },
});