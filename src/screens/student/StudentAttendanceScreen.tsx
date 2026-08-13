import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ScreenContainer, GlassCard, StatusBadge } from '../../components';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing } from '../../theme';
import { API_BASE_URL } from '../../config';

interface AttendanceRecord {
  id: number;
  subject?: string;
  date: string;
  status: 'present' | 'absent';
}

export function StudentAttendanceScreen() {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    
    setLoading(true);
    fetch(`${API_BASE_URL}/api/student/${user.id}/attendance`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch attendance');
        return res.json();
      })
      .then((data) => {
        setAttendance(data);
      })
      .catch((err) => {
        console.error('Error fetching attendance:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user?.id]);

  // Calculate statistics
  const totalClasses = attendance.length;
  const presentClasses = attendance.filter((r) => r.status === 'present').length;
  const attendanceRate = totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 100;
  const isShortage = attendanceRate < 75;

  return (
    <ScreenContainer scroll>
      <Animated.View entering={FadeInDown.duration(280).springify().damping(20)}>
        <Text style={styles.title}>My Attendance</Text>
        <Text style={styles.subtitle}>Track your class presence</Text>
      </Animated.View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#E07C3C" />
        </View>
      ) : (
        <>
          {/* Summary Stat Card */}
          <Animated.View entering={FadeInDown.delay(100).duration(200)}>
            <GlassCard rounded="lg" style={styles.summaryCard}>
              <View style={styles.statContainer}>
                <View style={styles.circularPlaceholder}>
                  <Text style={styles.percentageText}>{attendanceRate}%</Text>
                </View>
                <View style={styles.statDetails}>
                  <Text style={styles.statSummaryTitle}>Overall Rate</Text>
                  <Text style={styles.statMeta}>
                    Present: {presentClasses} / {totalClasses} classes
                  </Text>
                  <View style={[styles.guardBadge, isShortage ? styles.guardWarning : styles.guardSuccess]}>
                    <Text style={[styles.guardText, isShortage ? styles.textWarning : styles.textSuccess]}>
                      {isShortage ? '⚠️ Attendance Shortage' : '✓ Eligible for Exams'}
                    </Text>
                  </View>
                </View>
              </View>
            </GlassCard>
          </Animated.View>

          <Text style={styles.sectionTitle}>Session logs</Text>
          {attendance.length === 0 ? (
            <View style={styles.centered}>
              <Text style={styles.emptyText}>No attendance records found.</Text>
            </View>
          ) : (
            attendance.map((r, i) => (
              <Animated.View key={r.id} entering={FadeInDown.delay(150 + i * 50).springify().damping(20)}>
                <GlassCard rounded="md" style={styles.card}>
                  <View style={styles.row}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.subject}>
                        {r.subject || `${user?.department || 'College'} Lecture`}
                      </Text>
                      <Text style={styles.date}>{r.date}</Text>
                    </View>
                    <StatusBadge status={r.status} />
                  </View>
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
  title: { fontSize: 24, fontWeight: '700', color: colors.textPrimary },
  subtitle: { color: colors.textSecondary, marginTop: 4, marginBottom: spacing.lg },
  summaryCard: { marginBottom: spacing.lg, padding: spacing.md },
  statContainer: { flexDirection: 'row', alignItems: 'center' },
  circularPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FAF9F7',
    borderWidth: 3,
    borderColor: '#EBEBEB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  percentageText: { fontSize: 18, fontWeight: '800', color: colors.textPrimary },
  statDetails: { flex: 1 },
  statSummaryTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  statMeta: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  guardBadge: {
    marginTop: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  guardWarning: { backgroundColor: '#FEE2E2' },
  guardSuccess: { backgroundColor: '#DCFCE7' },
  guardText: { fontSize: 11, fontWeight: '700' },
  textWarning: { color: '#991B1B' },
  textSuccess: { color: '#166534' },
  sectionTitle: { color: colors.textSecondary, fontSize: 14, fontWeight: '600', marginBottom: spacing.sm },
  card: { marginBottom: spacing.sm, padding: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  subject: { color: colors.textPrimary, fontWeight: '600', fontSize: 16 },
  date: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
  centered: { padding: spacing.xl, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: colors.textSecondary, fontSize: 14 },
});
