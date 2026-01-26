import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface PhoneSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  phoneNumbers: string[];
  userName: string;
  onSelectPhone: (phoneNumber: string) => void;
  isDark: boolean;
}

export const PhoneSelectionModal: React.FC<PhoneSelectionModalProps> = ({
  visible,
  onClose,
  phoneNumbers,
  userName,
  onSelectPhone,
  isDark,
}) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: isDark ? '#1e293b' : '#ffffff' }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: isDark ? '#f8fafc' : '#0f172a' }]}>
              Select Phone Number
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={isDark ? '#94a3b8' : '#64748b'} />
            </TouchableOpacity>
          </View>

          <Text style={[styles.subtitle, { color: isDark ? '#94a3b8' : '#64748b' }]}>
            Choose which number to send WhatsApp message for {userName}
          </Text>

          <View style={styles.phoneList}>
            {phoneNumbers.map((phone, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.phoneButton,
                  { backgroundColor: isDark ? '#334155' : '#f8fafc' }
                ]}
                onPress={() => {
                  onSelectPhone(phone);
                  onClose();
                }}
              >
                <LinearGradient
                  colors={['#10b981', '#059669']}
                  style={styles.phoneIcon}
                >
                  <Ionicons name="logo-whatsapp" size={16} color="white" />
                </LinearGradient>
                <Text style={[styles.phoneText, { color: isDark ? '#f8fafc' : '#0f172a' }]}>
                  {phone}
                </Text>
                <Ionicons name="chevron-forward" size={16} color="#10b981" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  container: {
    borderRadius: 16,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 20,
    lineHeight: 20,
  },
  phoneList: {
    gap: 12,
  },
  phoneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 12,
  },
  phoneIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  phoneText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
});