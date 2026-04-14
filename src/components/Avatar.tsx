import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../theme';

interface AvatarProps {
  name: string;
  size?: number;
  style?: ViewStyle;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function getColor(name: string): string {
  const hues = ['#4A5568', '#5A6B7D', '#6B7B8E', '#3D4F5F', '#2D3748'];
  let n = 0;
  for (let i = 0; i < name.length; i++) n += name.charCodeAt(i);
  return hues[n % hues.length];
}

export function Avatar({ name, size = 48, style }: AvatarProps) {
  const initials = getInitials(name);
  const bg = getColor(name);
  return (
    <View style={[styles.outer, { width: size, height: size, borderRadius: size / 2 }, style]}>
      <View style={[styles.inner, { width: size, height: size, borderRadius: size / 2, backgroundColor: bg }]}>
        <Text style={[styles.text, { fontSize: size * 0.4 }]}>{initials}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    borderWidth: 2,
    borderColor: colors.cardBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inner: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: colors.white,
    fontWeight: '700',
  },
});
