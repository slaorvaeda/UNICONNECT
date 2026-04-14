import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ScreenContainer, GlassCard, Avatar } from '../../components';
import { useAuth } from '../../context/AuthContext';
import { dummyUsers, dummyGrievances } from '../../data/dummy';
import { colors, spacing } from '../../theme';

export function AdminHomeScreen() {
  const { user } = useAuth();
  const pendingGrievances = dummyGrievances.filter((g) => g.status !== 'resolved').length;

  return (
    <ScreenContainer scroll>
      <Animated.View entering={FadeInDown.duration(280).springify().damping(20)}>
        <View style={styles.header}>
          <Avatar name={user?.name ?? 'Admin'} size={56} />
          <View style={styles.headerText}>
            <Text style={styles.greeting}>Admin,</Text>
            <Text style={styles.name}>{user?.name}</Text>
          </View>
        </View>
      </Animated.View>
      <View style={styles.statsRow}>
        <GlassCard rounded="lg" style={styles.statCard}>
          <Text style={styles.statValue}>{dummyUsers.filter((u) => u.role === 'student').length}</Text>
          <Text style={styles.statLabel}>Students</Text>
        </GlassCard>
        <GlassCard rounded="lg" style={styles.statCard}>
          <Text style={styles.statValue}>{pendingGrievances}</Text>
          <Text style={styles.statLabel}>Pending grievances</Text>
        </GlassCard>
      </View>
      <Text style={styles.sectionTitle}>Quick actions</Text>
      <GlassCard rounded="lg" style={styles.card} onPress={() => {}}>
        <Text style={styles.cardTitle}>Manage students</Text>
      </GlassCard>
      <GlassCard rounded="lg" style={styles.card} onPress={() => {}}>
        <Text style={styles.cardTitle}>Publish notice</Text>
      </GlassCard>
      <GlassCard rounded="lg" style={styles.card} onPress={() => {}}>
        <Text style={styles.cardTitle}>Manage events</Text>
      </GlassCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xl },
  headerText: { marginLeft: spacing.md },
  greeting: { color: colors.textSecondary, fontSize: 14 },
  name: { color: colors.textPrimary, fontSize: 22, fontWeight: '700' },
  statsRow: { flexDirection: 'row', marginBottom: spacing.lg },
  statCard: { flex: 1, marginHorizontal: spacing.xs },
  statValue: { color: colors.primaryLight, fontSize: 28, fontWeight: '800' },
  statLabel: { color: colors.textSecondary, fontSize: 12, marginTop: 4 },
  sectionTitle: { color: colors.textSecondary, fontSize: 14, fontWeight: '600', marginBottom: spacing.sm },
  card: { marginBottom: spacing.sm },
  cardTitle: { color: colors.textPrimary, fontWeight: '600', fontSize: 16 },
});
