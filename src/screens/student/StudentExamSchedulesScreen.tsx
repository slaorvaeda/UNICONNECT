import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer, GlassCard } from '../../components';
import { dummyExamSchedules } from '../../data/dummy';
import { colors, spacing } from '../../theme';

export function StudentExamSchedulesScreen({ navigation }: { navigation: any }) {
  return (
    <ScreenContainer scroll>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Exam Schedules</Text>
      </View>
      <Text style={styles.subtitle}>Upcoming exams</Text>

      {dummyExamSchedules.map((e, i) => (
        <Animated.View key={e.id} entering={FadeInDown.delay(i * 50).springify().damping(20)}>
          <GlassCard rounded="lg" style={styles.card}>
            <Text style={styles.subject}>{e.subject}</Text>
            <View style={styles.metaRow}>
              <Text style={styles.meta}>📅 {e.date}</Text>
              <Text style={styles.meta}>🕐 {e.time}</Text>
            </View>
            <Text style={styles.venue}>📍 {e.venue}</Text>
          </GlassCard>
        </Animated.View>
      ))}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  backBtn: { padding: 4, marginRight: spacing.sm },
  title: { fontSize: 24, fontWeight: '700', color: colors.textPrimary },
  subtitle: { color: colors.textSecondary, marginBottom: spacing.lg },
  card: { marginBottom: spacing.sm },
  subject: { color: colors.textPrimary, fontWeight: '600', fontSize: 18 },
  metaRow: { flexDirection: 'row', gap: spacing.md, marginTop: 8 },
  meta: { color: colors.textSecondary, fontSize: 14 },
  venue: { color: colors.textMuted, fontSize: 13, marginTop: 4 },
});
