import React from 'react';
import { View, StyleSheet, Platform, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors } from '../theme';

/**
 * BlurView can crash on Android in Expo Go. Use a solid fallback on Android.
 */
interface SafeBlurViewProps {
  intensity?: number;
  tint?: 'light' | 'dark' | 'default';
  style?: ViewStyle;
}

export function SafeBlurView({ intensity = 40, tint = 'dark', style }: SafeBlurViewProps) {
  if (Platform.OS === 'android') {
    return (
      <View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: tint === 'dark' ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255,255,255,0.1)' },
          style,
        ]}
      />
    );
  }
  return <BlurView intensity={intensity} tint={tint} style={[StyleSheet.absoluteFill, style]} />;
}
