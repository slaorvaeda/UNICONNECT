import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ScreenContainer, GlassCard } from '../../components';
import { dummyEvents } from '../../data/dummy';
import { colors, spacing } from '../../theme';

export function StudentEventsScreen() {
  return (
    <ScreenContainer scroll>
      <Animated.View entering={FadeInDown.duration(280).springify().damping(20)}>
        <Text style={styles.title}>Events & Activities</Text>
        <Text style={styles.subtitle}>Sports, cultural, tech</Text>
      </Animated.View>
      {dummyEvents.map((e, i) => (
        <Animated.View key={e.id} entering={FadeInDown.delay(i * 50).springify().damping(20)}>
          <GlassCard rounded="lg" style={styles.card}>
            <View style={styles.typeWrap}>
              <Text style={[styles.type, { color: colors.primary }]}>{e.type}</Text>
            </View>
            <Text style={styles.eventTitle}>{e.title}</Text>
            <Text style={styles.desc} numberOfLines={2}>{e.description}</Text>
            <Text style={styles.venue}>📍 {e.venue} • {e.date}</Text>
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
  typeWrap: { marginBottom: spacing.xs },
  type: { fontSize: 12, fontWeight: '600', textTransform: 'capitalize' },
  eventTitle: { color: colors.textPrimary, fontSize: 18, fontWeight: '700' },
  desc: { color: colors.textSecondary, marginTop: 4, fontSize: 14 },
  venue: { color: colors.textMuted, fontSize: 13, marginTop: spacing.sm },
});
