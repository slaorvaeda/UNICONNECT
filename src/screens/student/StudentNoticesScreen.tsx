import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ScreenContainer, GlassCard } from '../../components';
import { dummyNotices } from '../../data/dummy';
import { colors, spacing } from '../../theme';

export function StudentNoticesScreen() {
  return (
    <ScreenContainer scroll>
      <Animated.View entering={FadeInDown.duration(280).springify().damping(20)}>
        <Text style={styles.title}>Notices</Text>
        <Text style={styles.subtitle}>College announcements</Text>
      </Animated.View>
      {dummyNotices.map((n, i) => (
        <Animated.View key={n.id} entering={FadeInDown.delay(i * 50).springify().damping(20)}>
          <GlassCard rounded="lg" style={styles.card}>
            <Text style={styles.category}>{n.category}</Text>
            <Text style={styles.noticeTitle}>{n.title}</Text>
            <Text style={styles.body}>{n.body}</Text>
            <Text style={styles.date}>{n.date}</Text>
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
  category: { color: colors.primary, fontSize: 12, fontWeight: '600' },
  noticeTitle: { color: colors.textPrimary, fontWeight: '600', fontSize: 16, marginTop: 4 },
  body: { color: colors.textSecondary, fontSize: 14, marginTop: 4 },
  date: { color: colors.textMuted, fontSize: 12, marginTop: spacing.sm },
});
