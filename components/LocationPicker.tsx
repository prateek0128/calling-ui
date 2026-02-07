import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { getStatesAndCities, StatesAndCitiesData } from '../endpoints/location';

interface LocationPickerProps {
  selectedState?: string;
  selectedCity?: string;
  onStateChange: (state: string) => void;
  onCityChange: (city: string) => void;
  isDark: boolean;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  selectedState,
  selectedCity,
  onStateChange,
  onCityChange,
  isDark,
}) => {
  const [showStateModal, setShowStateModal] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);
  const [locationData, setLocationData] = useState<StatesAndCitiesData | null>(null);
  const [loading, setLoading] = useState(false);
  const [stateSearch, setStateSearch] = useState('');
  const [citySearch, setCitySearch] = useState('');

  useEffect(() => {
    fetchLocationData();
  }, []);

  const fetchLocationData = async () => {
    setLoading(true);
    try {
      const response = await getStatesAndCities();
      if (response.success) {
        setLocationData(response.data);
      }
    } catch (error) {
      console.error('Error fetching location data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStates = locationData?.states.filter(state =>
    state.toLowerCase().includes(stateSearch.toLowerCase())
  ) || [];

  const filteredCities = locationData?.cities.filter(city =>
    city.toLowerCase().includes(citySearch.toLowerCase())
  ) || [];

  const renderStateItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[styles.listItem, { backgroundColor: isDark ? '#334155' : '#ffffff' }]}
      onPress={() => {
        onStateChange(item);
        setShowStateModal(false);
        setStateSearch('');
      }}
    >
      <Text style={[styles.listItemText, { color: isDark ? '#f8fafc' : '#0f172a' }]}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  const renderCityItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[styles.listItem, { backgroundColor: isDark ? '#334155' : '#ffffff' }]}
      onPress={() => {
        onCityChange(item);
        setShowCityModal(false);
        setCitySearch('');
      }}
    >
      <Text style={[styles.listItemText, { color: isDark ? '#f8fafc' : '#0f172a' }]}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* State Picker */}
      <View style={styles.pickerSection}>
        <Text style={[styles.label, { color: isDark ? '#94a3b8' : '#64748b' }]}>
          State
        </Text>
        <TouchableOpacity
          style={[
            styles.picker,
            {
              backgroundColor: isDark ? '#334155' : '#ffffff',
              borderColor: isDark ? '#475569' : '#e2e8f0',
            },
          ]}
          onPress={() => setShowStateModal(true)}
          disabled={loading}
        >
          <Ionicons
            name="location-outline"
            size={20}
            color={isDark ? '#94a3b8' : '#64748b'}
          />
          <Text
            style={[
              styles.pickerText,
              { color: selectedState ? (isDark ? '#f8fafc' : '#0f172a') : (isDark ? '#64748b' : '#94a3b8') },
            ]}
          >
            {selectedState || 'Select State'}
          </Text>
          <Ionicons
            name="chevron-down"
            size={20}
            color={isDark ? '#94a3b8' : '#64748b'}
          />
        </TouchableOpacity>
      </View>

      {/* City Picker */}
      <View style={styles.pickerSection}>
        <Text style={[styles.label, { color: isDark ? '#94a3b8' : '#64748b' }]}>
          City
        </Text>
        <TouchableOpacity
          style={[
            styles.picker,
            {
              backgroundColor: isDark ? '#334155' : '#ffffff',
              borderColor: isDark ? '#475569' : '#e2e8f0',
            },
          ]}
          onPress={() => setShowCityModal(true)}
          disabled={loading}
        >
          <Ionicons
            name="business-outline"
            size={20}
            color={isDark ? '#94a3b8' : '#64748b'}
          />
          <Text
            style={[
              styles.pickerText,
              { color: selectedCity ? (isDark ? '#f8fafc' : '#0f172a') : (isDark ? '#64748b' : '#94a3b8') },
            ]}
          >
            {selectedCity || 'Select City'}
          </Text>
          <Ionicons
            name="chevron-down"
            size={20}
            color={isDark ? '#94a3b8' : '#64748b'}
          />
        </TouchableOpacity>
      </View>

      {/* State Modal */}
      <Modal visible={showStateModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? '#1e293b' : '#ffffff' }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: isDark ? '#f8fafc' : '#0f172a' }]}>
                Select State
              </Text>
              <TouchableOpacity onPress={() => setShowStateModal(false)}>
                <Ionicons name="close" size={24} color={isDark ? '#94a3b8' : '#64748b'} />
              </TouchableOpacity>
            </View>
            
            <View style={[styles.searchContainer, { backgroundColor: isDark ? '#334155' : '#f8fafc' }]}>
              <Ionicons name="search" size={20} color={isDark ? '#94a3b8' : '#64748b'} />
              <TextInput
                style={[styles.searchInput, { color: isDark ? '#f8fafc' : '#0f172a' }]}
                placeholder="Search states..."
                placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                value={stateSearch}
                onChangeText={setStateSearch}
              />
            </View>

            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3b82f6" />
              </View>
            ) : (
              <FlatList
                data={filteredStates}
                renderItem={renderStateItem}
                keyExtractor={(item) => item}
                style={styles.list}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        </View>
      </Modal>

      {/* City Modal */}
      <Modal visible={showCityModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? '#1e293b' : '#ffffff' }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: isDark ? '#f8fafc' : '#0f172a' }]}>
                Select City
              </Text>
              <TouchableOpacity onPress={() => setShowCityModal(false)}>
                <Ionicons name="close" size={24} color={isDark ? '#94a3b8' : '#64748b'} />
              </TouchableOpacity>
            </View>
            
            <View style={[styles.searchContainer, { backgroundColor: isDark ? '#334155' : '#f8fafc' }]}>
              <Ionicons name="search" size={20} color={isDark ? '#94a3b8' : '#64748b'} />
              <TextInput
                style={[styles.searchInput, { color: isDark ? '#f8fafc' : '#0f172a' }]}
                placeholder="Search cities..."
                placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                value={citySearch}
                onChangeText={setCitySearch}
              />
            </View>

            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3b82f6" />
              </View>
            ) : (
              <FlatList
                data={filteredCities}
                renderItem={renderCityItem}
                keyExtractor={(item) => item}
                style={styles.list}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  pickerSection: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  picker: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  pickerText: {
    flex: 1,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    height: '70%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  list: {
    flex: 1,
  },
  listItem: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  listItemText: {
    fontSize: 16,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});