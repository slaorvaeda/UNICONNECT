import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, borderRadius } from '../theme';

type Status = 'present' | 'absent' | 'pending' | 'in_progress' | 'resolved' | 'paid' | 'overdue';

const statusConfig: Record<Status, { bg: string; text: string }> = {
  present: { bg: 'rgba(34, 197, 94, 0.15)', text: colors.success },
  absent: { bg: 'rgba(239, 68, 68, 0.15)', text: colors.error },
  pending: { bg: 'rgba(245, 158, 11, 0.15)', text: colors.warning },
  in_progress: { bg: 'rgba(59, 130, 246, 0.15)', text: colors.info },
  resolved: { bg: 'rgba(34, 197, 94, 0.15)', text: colors.success },
  paid: { bg: 'rgba(34, 197, 94, 0.15)', text: colors.success },
  overdue: { bg: 'rgba(239, 68, 68, 0.15)', text: colors.error },
};

interface StatusBadgeProps {
  status: Status;
  label?: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const config = statusConfig[status] ?? statusConfig.pending;
  const display = label ?? status.replace('_', ' ');
  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <Text style={[styles.text, { color: config.text }]}>{display}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});
