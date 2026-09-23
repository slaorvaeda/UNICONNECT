import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer, GlassCard, StatusBadge } from '../../components';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing } from '../../theme';
import { API_BASE_URL } from '../../config';

interface FeeRecord {
  id: number;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid';
  paidAt?: string;
}

export function StudentFeesScreen({ navigation }: { navigation?: any }) {
  const { user } = useAuth();
  const [fees, setFees] = useState<FeeRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFees = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/student/${user.id}/fees`);
      if (res.ok) {
        const data = await res.json();
        const mapped = data.map((item: any) => ({
          id: item.id,
          amount: item.amount,
          dueDate: item.due_date,
          status: item.status,
          paidAt: item.paid_at ? new Date(item.paid_at).toLocaleDateString() : undefined,
        }));
        setFees(mapped);
      }
    } catch (err) {
      console.error('Error fetching fees:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFees();
  }, [user?.id]);

  const handlePayFee = (feeId: number, amount: number) => {
    Alert.alert('Confirm Payment', `Do you want to process payment for ₹${amount.toLocaleString()}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Pay Now',
        onPress: async () => {
          if (!user) return;
          try {
            const res = await fetch(`${API_BASE_URL}/api/student/${user.id}/fees/${feeId}/pay`, {
              method: 'POST',
            });
            if (res.ok) {
              Alert.alert('Success', 'Payment processed successfully! Your fee is marked as Paid.');
              fetchFees();
            } else {
              Alert.alert('Error', 'Could not process fee payment.');
            }
          } catch (e) {
            console.error(e);
            Alert.alert('Error', 'Network request failed.');
          }
        },
      },
    ]);
  };

  const pending = fees.filter((f) => f.status === 'pending');
  const totalPending = pending.reduce((sum, f) => sum + f.amount, 0);

  return (
    <ScreenContainer scroll>
      <View style={styles.headerRow}>
        {navigation?.canGoBack() && (
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        )}
        <Text style={styles.title}>Fee Details</Text>
      </View>
      <Text style={styles.subtitle}>Payment status & dues</Text>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#E07C3C" />
        </View>
      ) : (
        <>
          <GlassCard rounded="lg" style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Total Pending</Text>
            <Text style={styles.summaryAmount}>₹{totalPending.toLocaleString()}</Text>
          </GlassCard>

          {fees.length === 0 ? (
            <View style={styles.centered}>
              <Text style={styles.emptyText}>No fee records found.</Text>
            </View>
          ) : (
            fees.map((f, i) => (
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
                  {f.status === 'pending' && (
                    <TouchableOpacity
                      onPress={() => handlePayFee(f.id, f.amount)}
                      style={styles.payButton}
                    >
                      <Text style={styles.payButtonText}>Pay Now</Text>
                    </TouchableOpacity>
                  )}
                </GlassCard>
              </Animated.View>
            ))
          )}
        </>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  backBtn: { padding: 4, marginRight: spacing.sm },
  title: { fontSize: 24, fontWeight: '700', color: colors.textPrimary },
  subtitle: { color: colors.textSecondary, marginBottom: spacing.lg },
  summaryCard: { marginBottom: spacing.lg, alignItems: 'center', padding: spacing.md },
  summaryLabel: { color: colors.textSecondary, fontSize: 14 },
  summaryAmount: { color: colors.primary, fontSize: 28, fontWeight: '800', marginTop: 4 },
  card: { marginBottom: spacing.sm, padding: spacing.md },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  amount: { color: colors.textPrimary, fontWeight: '600', fontSize: 18 },
  due: { color: colors.textMuted, fontSize: 13, marginTop: 4 },
  paid: { color: colors.success, fontSize: 12, marginTop: 2 },
  centered: { padding: spacing.xl, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: colors.textSecondary, fontSize: 14 },
  payButton: {
    backgroundColor: '#000000',
    borderRadius: 8,
    paddingVertical: 10,
    marginTop: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
