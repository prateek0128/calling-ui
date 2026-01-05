import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  useColorScheme,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { PhoneInput } from '../components/PhoneInput';
import { GradientButton } from '../components/GradientButton';

const lightTheme = {
  background: '#f8fafc',
  gradientColors: ['#e0f2fe', '#f0f9ff'] as const,
  cardBackground: '#ffffff',
  shadowColor: '#000000',
  textPrimary: '#0f172a',
  textSecondary: '#64748b',
  tabBackground: '#f1f5f9',
  activeTabBackground: '#ffffff',
  activeTabText: '#3b82f6',
  inactiveTabText: '#64748b',
  inputBackground: '#ffffff',
  inputBorder: '#e2e8f0',
  iconColor: '#64748b',
  placeholderColor: '#94a3b8',
  linkColor: '#3b82f6',
};

const darkTheme = {
  background: '#0f172a',
  gradientColors: ['#1e293b', '#334155'] as const,
  cardBackground: '#1e293b',
  shadowColor: '#000000',
  textPrimary: '#f8fafc',
  textSecondary: '#94a3b8',
  tabBackground: '#334155',
  activeTabBackground: '#475569',
  activeTabText: '#60a5fa',
  inactiveTabText: '#94a3b8',
  inputBackground: '#334155',
  inputBorder: '#475569',
  iconColor: '#94a3b8',
  placeholderColor: '#64748b',
  linkColor: '#60a5fa',
};

const countryCodes = [
  { code: '+1', country: 'US' },
  { code: '+44', country: 'UK' },
  { code: '+91', country: 'IN' },
  { code: '+86', country: 'CN' },
  { code: '+81', country: 'JP' },
];

export default function LoginScreen() {
  const [loginMethod, setLoginMethod] = useState<'userId' | 'phone'>('userId');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();

  const handleUserIdLogin = () => {
    if (!userId || !password) {
      Alert.alert('Error', 'Please enter both User ID and Password');
      return;
    }
    Alert.alert('Success', 'Login successful!', [
      { text: 'OK', onPress: () => router.replace('/(tabs)') }
    ]);
  };

  const handlePhoneLogin = () => {
    if (!phoneNumber) {
      Alert.alert('Error', 'Please enter phone number');
      return;
    }
    router.push(`/otp?phone=${encodeURIComponent(phoneNumber)}`);
  };

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <LinearGradient
        colors={theme.gradientColors}
        style={styles.backgroundGradient}
      />

      <View style={[styles.card, { backgroundColor: theme.cardBackground, shadowColor: theme.shadowColor }]}>
        <View style={styles.cardHeader}>
          <Text style={[styles.title, { color: theme.textPrimary }]}>Welcome Back</Text>
        </View>

        <View style={[styles.tabContainer, { backgroundColor: theme.tabBackground }]}>
          <TouchableOpacity
            style={[
              styles.tab,
              loginMethod === 'userId' && styles.activeTab,
              loginMethod === 'userId' && { backgroundColor: theme.activeTabBackground }
            ]}
            onPress={() => setLoginMethod('userId')}
          >
            <Text style={[
              styles.tabText,
              { color: loginMethod === 'userId' ? theme.activeTabText : theme.inactiveTabText }
            ]}>
              User ID
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              loginMethod === 'phone' && styles.activeTab,
              loginMethod === 'phone' && { backgroundColor: theme.activeTabBackground }
            ]}
            onPress={() => setLoginMethod('phone')}
          >
            <Text style={[
              styles.tabText,
              { color: loginMethod === 'phone' ? theme.activeTabText : theme.inactiveTabText }
            ]}>
              Phone Login
            </Text>
          </TouchableOpacity>
        </View>

        {loginMethod === 'userId' ? (
          <View style={styles.form}>
            <View>
              <Text style={[styles.label, { color: theme.textSecondary }]}>User ID</Text>
              <View style={[styles.inputContainer, { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder }]}>
                <Ionicons name="person-outline" size={20} color={theme.iconColor} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: theme.textPrimary }]}
                  placeholder="Enter your user ID"
                  placeholderTextColor={theme.placeholderColor}
                  value={userId}
                  onChangeText={setUserId}
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View>
              <Text style={[styles.label, { color: theme.textSecondary }]}>Password</Text>
              <View style={[styles.inputContainer, { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder }]}>
                <Ionicons name="lock-closed-outline" size={20} color={theme.iconColor} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: theme.textPrimary }]}
                  placeholder="Enter your password"
                  placeholderTextColor={theme.placeholderColor}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons 
                    name={showPassword ? "eye-outline" : "eye-off-outline"} 
                    size={20} 
                    color={theme.iconColor} 
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.optionsRow}>
              <TouchableOpacity 
                style={styles.checkboxContainer}
                onPress={() => setRememberMe(!rememberMe)}
              >
                <View style={[styles.checkbox, rememberMe && styles.checkboxActive]}>
                  {rememberMe && <Ionicons name="checkmark" size={12} color="white" />}
                </View>
                <Text style={[styles.checkboxText, { color: theme.textSecondary }]}>Remember me</Text>
              </TouchableOpacity>
              
              <TouchableOpacity>
                <Text style={[styles.linkText, { color: theme.linkColor }]}>Forgot password?</Text>
              </TouchableOpacity>
            </View>

            <GradientButton onPress={handleUserIdLogin}>
              Sign In
            </GradientButton>
          </View>
        ) : (
          <View style={styles.form}>
            <View>
              <Text style={[styles.label, { color: theme.textSecondary }]}>Phone Number</Text>
              <PhoneInput
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                theme={theme}
              />
              <Text style={[styles.helperText, { color: theme.textSecondary }]}>
                OTP will be sent to this number for verification
              </Text>
            </View>

            <GradientButton onPress={handlePhoneLogin}>
              Continue
            </GradientButton>

            <TouchableOpacity style={styles.alternateLogin} onPress={() => setLoginMethod('userId')}>
              <Text style={[styles.alternateText, { color: theme.linkColor }]}>
                Use password login instead
              </Text>
            </TouchableOpacity>
          </View>
        )}
        
        <View style={styles.signupRow}>
          <Text style={[styles.signupText, { color: theme.textSecondary }]}>
            New user?{' '}
          </Text>
          <TouchableOpacity onPress={() => router.push('/signup')}>
            <Text style={[styles.linkText, { color: theme.linkColor }]}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    height: 120,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 20,
  },
  card: {
    flex: 1,
    marginTop: -20,
    marginHorizontal: 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 32,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  tabContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
    marginBottom: 32,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTab: {
    borderWidth: 2,
    borderColor: '#3b82f6',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  form: {
    gap: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputContainer: {
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
  helperText: {
    fontSize: 12,
    marginTop: 8,
    lineHeight: 16,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  checkboxText: {
    fontSize: 14,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '600',
  },
  buttonContainer: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonContainerDark: {
    shadowColor: '#4f46e5',
  },
  gradientButton: {
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  alternateLogin: {
    alignItems: 'center',
    marginTop: 8,
  },
  alternateText: {
    fontSize: 14,
    fontWeight: '600',
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
    paddingBottom: 20,
  },
  signupText: {
    fontSize: 14,
  },
});