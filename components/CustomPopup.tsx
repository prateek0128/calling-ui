import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface CustomPopupProps {
  visible: boolean;
  title: string;
  message: string;
  type?: 'info' | 'warning' | 'error' | 'success';
  buttons: Array<{
    text: string;
    onPress: () => void;
    style?: 'default' | 'destructive' | 'cancel';
  }>;
  onClose?: () => void;
}

export const CustomPopup: React.FC<CustomPopupProps> = ({
  visible,
  title,
  message,
  type = 'info',
  buttons,
  onClose,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const getIconAndColor = () => {
    switch (type) {
      case 'success':
        return { icon: 'checkmark-circle', color: '#22c55e' };
      case 'warning':
        return { icon: 'warning', color: '#f59e0b' };
      case 'error':
        return { icon: 'close-circle', color: '#ef4444' };
      default:
        return { icon: 'information-circle', color: '#3b82f6' };
    }
  };

  const { icon, color } = getIconAndColor();

  const getButtonStyle = (buttonStyle: string) => {
    switch (buttonStyle) {
      case 'destructive':
        return {
          backgroundColor: '#ef4444',
          textColor: '#ffffff',
        };
      case 'cancel':
        return {
          backgroundColor: isDark ? '#374151' : '#f3f4f6',
          textColor: isDark ? '#f9fafb' : '#374151',
        };
      default:
        return {
          backgroundColor: '#3b82f6',
          textColor: '#ffffff',
        };
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[
          styles.popup,
          { backgroundColor: isDark ? '#1e293b' : '#ffffff' }
        ]}>
          <View style={styles.iconContainer}>
            <Ionicons name={icon as any} size={48} color={color} />
          </View>

          <Text style={[styles.title, { color: isDark ? '#f8fafc' : '#0f172a' }]}>
            {title}
          </Text>

          <Text style={[styles.message, { color: isDark ? '#d1d5db' : '#6b7280' }]}>
            {message}
          </Text>

          <View style={styles.buttonContainer}>
            {buttons.map((button, index) => {
              const buttonStyles = getButtonStyle(button.style || 'default');
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.button,
                    { backgroundColor: buttonStyles.backgroundColor },
                    buttons.length === 1 && styles.singleButton
                  ]}
                  onPress={button.onPress}
                >
                  <Text style={[styles.buttonText, { color: buttonStyles.textColor }]}>
                    {button.text}
                  </Text>
                </TouchableOpacity>
              );
            })}
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
    alignItems: 'center',
    padding: 20,
  },
  popup: {
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  singleButton: {
    flex: 0,
    minWidth: 120,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});