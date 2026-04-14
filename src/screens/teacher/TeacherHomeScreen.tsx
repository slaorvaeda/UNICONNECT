import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ScreenContainer, GlassCard, Avatar } from '../../components';
import { useAuth } from '../../context/AuthContext';
import { dummyClassStudents } from '../../data/dummy';
import { colors, spacing } from '../../theme';

export function TeacherHomeScreen() {
  const { user } = useAuth();

  return (
    <ScreenContainer scroll>
      <Animated.View entering={FadeInDown.duration(280).springify().damping(20)}>
        <View style={styles.header}>
          <Avatar name={user?.name ?? 'Teacher'} size={56} />
          <View style={styles.headerText}>
            <Text style={styles.greeting}>Welcome,</Text>
            <Text style={styles.name}>{user?.name}</Text>
          </View>
        </View>
      </Animated.View>
      <Text style={styles.sectionTitle}>Today's attendance (Class C)</Text>
      <GlassCard rounded="lg">
        {dummyClassStudents.map((s) => (
          <View key={s.id} style={styles.row}>
            <Text style={styles.studentName}>{s.name}</Text>
            <Text style={[styles.status, s.present && styles.present]}>{s.present ? 'Present' : 'Absent'}</Text>
          </View>
        ))}
      </GlassCard>
      <GlassCard rounded="lg" style={styles.card} onPress={() => {}}>
        <Text style={styles.cardTitle}>Mark attendance</Text>
        <Text style={styles.cardSub}>Start session & enter code on board</Text>
      </GlassCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xl },
  headerText: { marginLeft: spacing.md },
  greeting: { color: colors.textSecondary, fontSize: 14 },
  name: { color: colors.textPrimary, fontSize: 22, fontWeight: '700' },
  sectionTitle: { color: colors.textSecondary, fontSize: 14, fontWeight: '600', marginBottom: spacing.sm },
  card: { marginTop: spacing.lg },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.xs },
  studentName: { color: colors.textPrimary, fontSize: 15 },
  status: { color: colors.textMuted, fontSize: 14 },
  present: { color: colors.success },
  cardTitle: { color: colors.textPrimary, fontWeight: '600', fontSize: 16 },
  cardSub: { color: colors.textSecondary, fontSize: 13, marginTop: 2 },
});
