import React from 'react';
import { Pressable, Text, View, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { colors, spacing } from '../theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface GlassButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'glass' | 'outline';
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

const springConfig = { damping: 18, stiffness: 500 };

export function GlassButton({
  title,
  onPress,
  variant = 'primary',
  loading,
  style,
  textStyle,
  disabled,
}: GlassButtonProps) {
  const isGlass = variant === 'glass';
  const isOutline = variant === 'outline';
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const content = (
    <View style={styles.content}>
      {loading ? (
        <ActivityIndicator color={isGlass || isOutline ? colors.primary : colors.white} />
      ) : (
        <Text
          style={[
            styles.text,
            variant === 'primary' && styles.textPrimary,
            (isGlass || isOutline) && styles.textOutline,
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </View>
  );

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.97, springConfig);
      }}
      onPressOut={() => {
        scale.value = withSpring(1, springConfig);
      }}
      disabled={disabled || loading}
      style={[
        styles.button,
        variant === 'primary' && styles.primary,
        isOutline && styles.outline,
        isGlass && styles.glass,
        disabled && styles.disabled,
        animatedStyle,
        style,
      ]}
    >
      {content}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    overflow: 'hidden',
    minHeight: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primary: {
    backgroundColor: colors.primary,
    borderWidth: 0,
  },
  glass: {
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.cardBg,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  content: { paddingVertical: spacing.sm, paddingHorizontal: spacing.lg },
  text: { fontSize: 16, fontWeight: '600' },
  textPrimary: { color: colors.white },
  textOutline: { color: colors.primary },
  disabled: { opacity: 0.5 },
});
