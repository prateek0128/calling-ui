import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const countryCodes = [
  { code: '+1', country: 'US' },
  { code: '+44', country: 'UK' },
  { code: '+91', country: 'IN' },
  { code: '+86', country: 'CN' },
  { code: '+81', country: 'JP' },
];

interface PhoneInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  theme: any;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChangeText,
  placeholder = "Enter phone number",
  theme,
}) => {
  const [countryCode, setCountryCode] = useState('+1');
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  return (
    <View style={styles.phoneInputRow}>
      <TouchableOpacity 
        style={[styles.countrySelector, { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder }]}
        onPress={() => setShowCountryPicker(!showCountryPicker)}
      >
        <Text style={[styles.countryCode, { color: theme.textPrimary }]}>{countryCode}</Text>
        <Ionicons name="chevron-down" size={16} color={theme.iconColor} />
      </TouchableOpacity>
      {showCountryPicker && (
        <ScrollView style={[styles.countryDropdown, { backgroundColor: theme.cardBackground, borderColor: theme.inputBorder }]}>
          {countryCodes.map((item) => (
            <TouchableOpacity
              key={item.code}
              style={styles.countryOption}
              onPress={() => {
                setCountryCode(item.code);
                setShowCountryPicker(false);
              }}
            >
              <Text style={[styles.countryOptionText, { color: theme.textPrimary }]}>
                {item.code} ({item.country})
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
      <View style={[styles.phoneInputContainer, { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder }]}>
        <Ionicons name="call-outline" size={20} color={theme.iconColor} style={styles.inputIcon} />
        <TextInput
          style={[styles.input, { color: theme.textPrimary }]}
          placeholder={placeholder}
          placeholderTextColor={theme.placeholderColor}
          value={value}
          onChangeText={onChangeText}
          keyboardType="phone-pad"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  phoneInputRow: {
    flexDirection: 'row',
    gap: 12,
    position: 'relative',
  },
  countrySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  countryDropdown: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 80,
    borderRadius: 12,
    borderWidth: 1,
    maxHeight: 200,
    zIndex: 1000,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  countryOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  countryOptionText: {
    fontSize: 14,
  },
  countryCode: {
    fontSize: 16,
    fontWeight: '600',
  },
  phoneInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
});