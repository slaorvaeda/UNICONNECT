import React from 'react';
import { View, StyleSheet, ViewStyle, ViewProps } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Pressable } from 'react-native';
import { colors, spacing, borderRadius } from '../theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface GlassCardProps extends ViewProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  intensity?: number;
  rounded?: keyof typeof borderRadius;
}

const springConfig = { damping: 18, stiffness: 500 };

export function GlassCard({
  children,
  style,
  onPress,
  rounded = 'lg',
  ...rest
}: GlassCardProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const content = (
    <View style={[styles.content, { borderRadius: borderRadius[rounded] }]}>{children}</View>
  );

  if (onPress) {
    return (
      <AnimatedPressable
        onPress={onPress}
        onPressIn={() => {
          scale.value = withSpring(0.98, springConfig);
        }}
        onPressOut={() => {
          scale.value = withSpring(1, springConfig);
        }}
        style={[styles.outer, animatedStyle, style]}
        {...rest}
      >
        {content}
      </AnimatedPressable>
    );
  }
  return (
    <View style={[styles.outer, style]} {...rest}>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  content: {
    padding: spacing.md,
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
});
