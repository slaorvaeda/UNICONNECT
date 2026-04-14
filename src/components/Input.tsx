import React from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps, ViewStyle } from 'react-native';
import { colors, spacing } from '../theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export function Input({ label, error, containerStyle, style, ...props }: InputProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputWrap}>
        <TextInput
          placeholderTextColor={colors.textMuted}
          style={[styles.input, error && styles.inputError, style]}
          {...props}
        />
        <View style={styles.underline} />
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.md },
  label: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: spacing.xs,
    fontWeight: '500',
  },
  inputWrap: {
    position: 'relative',
  },
  input: {
    paddingHorizontal: 0,
    paddingVertical: spacing.sm,
    paddingRight: 40,
    fontSize: 16,
    color: colors.textPrimary,
  },
  underline: {
    height: 1,
    backgroundColor: colors.inputBorder,
  },
  inputError: { color: colors.error },
  error: { color: colors.error, fontSize: 12, marginTop: spacing.xs },
});
