import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ScreenContainer, GlassCard, StatusBadge } from '../../components';
import { dummyGrievances } from '../../data/dummy';
import { colors, spacing } from '../../theme';

export function TeacherGrievancesScreen() {
  return (
    <ScreenContainer scroll>
      <Animated.View entering={FadeInDown.duration(280).springify().damping(20)}>
        <Text style={styles.title}>Grievances to review</Text>
        <Text style={styles.subtitle}>Resolve student issues</Text>
      </Animated.View>
      {dummyGrievances.map((g, i) => (
        <Animated.View key={g.id} entering={FadeInDown.delay(i * 50).springify().damping(20)}>
          <GlassCard rounded="lg" style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.subject}>{g.subject}</Text>
              <StatusBadge status={g.status} />
            </View>
            <Text style={styles.desc}>{g.description}</Text>
            <Text style={styles.date}>{g.createdAt}</Text>
          </GlassCard>
        </Animated.View>
      ))}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: '700', color: colors.textPrimary },
  subtitle: { color: colors.textSecondary, marginTop: 4, marginBottom: spacing.lg },
  card: { marginBottom: spacing.md },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  subject: { color: colors.textPrimary, fontWeight: '600', fontSize: 16 },
  desc: { color: colors.textSecondary, fontSize: 14 },
  date: { color: colors.textMuted, fontSize: 12, marginTop: 4 },
});
