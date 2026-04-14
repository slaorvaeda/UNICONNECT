import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ScreenContainer, GlassCard, StatusBadge } from '../../components';
import { dummyAttendance } from '../../data/dummy';
import { colors, spacing } from '../../theme';

export function StudentAttendanceScreen() {
  return (
    <ScreenContainer scroll>
      <Animated.View entering={FadeInDown.duration(280).springify().damping(20)}>
        <Text style={styles.title}>My Attendance</Text>
        <Text style={styles.subtitle}>Recent records</Text>
      </Animated.View>
      {dummyAttendance.map((r, i) => (
        <Animated.View key={r.id} entering={FadeInDown.delay(i * 50).springify().damping(20)}>
          <GlassCard rounded="md" style={styles.card}>
            <View style={styles.row}>
              <View>
                <Text style={styles.subject}>{r.subject}</Text>
                <Text style={styles.date}>{r.date}</Text>
              </View>
              <StatusBadge status={r.status} />
              {r.percentage != null && (
                <Text style={styles.pct}>{r.percentage}%</Text>
              )}
            </View>
          </GlassCard>
        </Animated.View>
      ))}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: '700', color: colors.textPrimary },
  subtitle: { color: colors.textSecondary, marginTop: 4, marginBottom: spacing.lg },
  card: { marginBottom: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  subject: { color: colors.textPrimary, fontWeight: '600', fontSize: 16 },
  date: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
  pct: { color: colors.primaryLight, fontWeight: '600', marginLeft: spacing.sm },
});
