import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer, GlassCard } from '../../components';
import { dummyAcademicRecords } from '../../data/dummy';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing } from '../../theme';

export function StudentAcademicRecordsScreen({ navigation }: { navigation: any }) {
  const { user } = useAuth();
  const records = dummyAcademicRecords.filter((r) => r.studentId === user?.id || r.studentId === '1');

  return (
    <ScreenContainer scroll>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Academic Records</Text>
      </View>
      <Text style={styles.subtitle}>Grades & marks by subject</Text>

      {records.map((r, i) => (
        <Animated.View key={r.id} entering={FadeInDown.delay(i * 50).springify().damping(20)}>
          <GlassCard rounded="lg" style={styles.card}>
            <View style={styles.row}>
              <View>
                <Text style={styles.subject}>{r.subject}</Text>
                <Text style={styles.semester}>{r.semester} Semester</Text>
              </View>
              <View style={styles.marksWrap}>
                <Text style={styles.marks}>{r.marks} / {r.maxMarks}</Text>
                {r.grade && <Text style={styles.grade}>{r.grade}</Text>}
              </View>
            </View>
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
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  subject: { color: colors.textPrimary, fontWeight: '600', fontSize: 16 },
  semester: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
  marksWrap: { alignItems: 'flex-end' },
  marks: { color: colors.primary, fontWeight: '700', fontSize: 18 },
  grade: { color: colors.textSecondary, fontSize: 14, marginTop: 2 },
});
