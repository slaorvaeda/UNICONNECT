import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing } from '../../theme';

function LoginButton({ onPress }: { onPress: () => void }) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  return (
    <Animated.View entering={FadeInDown.delay(260).duration(300).springify().damping(18)}>
      <AnimatedPressable
        onPress={onPress}
        onPressIn={() => {
          scale.value = withSpring(0.97, { damping: 18, stiffness: 500 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 18, stiffness: 500 });
        }}
        style={[styles.loginBtn, animatedStyle]}
      >
        <Text style={styles.loginBtnText}>Log In</Text>
      </AnimatedPressable>
    </Animated.View>
  );
}

export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleLogin = () => {
    setError('');
    if (!email.trim()) {
      setError('Enter email');
      return;
    }
    if (!password) {
      setError('Enter password');
      return;
    }
    const ok = login(email.trim(), password);
    if (!ok) setError('Invalid email or password. Use dummy: 123456');
  };

  return (
    <View style={styles.outer}>
      <LinearGradient
        colors={['#EDE9E4', colors.background, colors.background]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          style={styles.keyboard}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          {/* Header / Branding - Top Right */}
          <Animated.View style={styles.header} entering={FadeIn.duration(350)}>
            <Text style={styles.brand}>Uniconnect</Text>
          </Animated.View>

          {/* Welcome Section */}
          <Animated.View
            style={styles.welcome}
            entering={FadeInDown.delay(50).duration(300).springify().damping(18)}
          >
            <Text style={styles.hi}>Hi!</Text>
            <Text style={styles.welcomeTitle}>Welcome</Text>
            <Text style={styles.welcomeSubtitle}>
              Im waiting for you, please enter your detail
            </Text>
          </Animated.View>

          {/* Input Fields */}
          <Animated.View
            style={styles.form}
            entering={FadeInDown.delay(120).duration(300).springify().damping(18)}
          >
            <View style={styles.inputWrap}>
              <TextInput
                placeholder="Username, Email or Phone Number"
                placeholderTextColor={colors.textSecondary}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                style={styles.input}
              />
              <View style={styles.underline} />
            </View>

            <View style={styles.inputWrap}>
              <TextInput
                placeholder="Password"
                placeholderTextColor={colors.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                style={styles.input}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword((v) => !v)}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
              <View style={styles.underline} />
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}
          </Animated.View>

          {/* Remember Me + Forgot Password */}
          <Animated.View
            style={styles.options}
            entering={FadeInDown.delay(190).duration(300).springify().damping(18)}
          >
            <TouchableOpacity
              style={styles.rememberRow}
              onPress={() => setRememberMe((v) => !v)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                {rememberMe && (
                  <Ionicons name="checkmark" size={12} color={colors.textPrimary} />
                )}
              </View>
              <Text style={styles.rememberText}>Remember Me</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.forgotText}>Forgot Password ?</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Log In Button */}
          <LoginButton onPress={handleLogin} />

        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: { flex: 1 },
  safe: { flex: 1, paddingHorizontal: spacing.lg },
  keyboard: { flex: 1, paddingBottom: spacing.xl },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: spacing.md,
  },
  brand: {
    fontSize: 22,
    fontFamily: 'BetaniaPatmosIn_400Regular',
    color: colors.textPrimary,
  },
  welcome: {
    marginTop: spacing.xxl,
  },
  hi: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  welcomeTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 4,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  form: {
    marginTop: spacing.xl,
  },
  inputWrap: {
    marginBottom: spacing.lg,
    position: 'relative',
  },
  input: {
    fontSize: 16,
    color: colors.textPrimary,
    paddingVertical: spacing.sm,
    paddingRight: 40,
  },
  eyeIcon: {
    position: 'absolute',
    right: 0,
    top: spacing.sm,
    padding: 4,
  },
  underline: {
    height: 1,
    backgroundColor: colors.cardBorder,
  },
  error: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: -spacing.sm,
    marginBottom: spacing.sm,
  },
  options: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.cardBorder,
  },
  rememberText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  forgotText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  loginBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  loginBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
