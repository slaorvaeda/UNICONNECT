import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ScreenContainer, GlassCard, StatusBadge } from '../../components';
import { dummyFees } from '../../data/dummy';
import { colors, spacing } from '../../theme';

export function StudentFeesScreen() {
  const pending = dummyFees.filter((f) => f.status === 'pending');
  const totalPending = pending.reduce((sum, f) => sum + f.amount, 0);

  return (
    <ScreenContainer scroll>
      <Animated.View entering={FadeInDown.duration(280).springify().damping(20)}>
        <Text style={styles.title}>Fee Details</Text>
        <Text style={styles.subtitle}>Payment status & dues</Text>
      </Animated.View>

      <GlassCard rounded="lg" style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Total Pending</Text>
        <Text style={styles.summaryAmount}>₹{totalPending.toLocaleString()}</Text>
      </GlassCard>

      {dummyFees.map((f, i) => (
        <Animated.View key={f.id} entering={FadeInDown.delay(i * 50).springify().damping(20)}>
          <GlassCard rounded="md" style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.amount}>₹{f.amount.toLocaleString()}</Text>
              <StatusBadge status={f.status} />
            </View>
            <Text style={styles.due}>Due: {f.dueDate}</Text>
            {f.paidAt && (
              <Text style={styles.paid}>Paid on: {f.paidAt}</Text>
            )}
          </GlassCard>
        </Animated.View>
      ))}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: '700', color: colors.textPrimary },
  subtitle: { color: colors.textSecondary, marginTop: 4, marginBottom: spacing.lg },
  summaryCard: { marginBottom: spacing.lg, alignItems: 'center' },
  summaryLabel: { color: colors.textSecondary, fontSize: 14 },
  summaryAmount: { color: colors.primary, fontSize: 28, fontWeight: '800', marginTop: 4 },
  card: { marginBottom: spacing.sm },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  amount: { color: colors.textPrimary, fontWeight: '600', fontSize: 18 },
  due: { color: colors.textMuted, fontSize: 13, marginTop: 4 },
  paid: { color: colors.success, fontSize: 12, marginTop: 2 },
});
