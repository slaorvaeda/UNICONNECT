import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ScreenContainer, GlassCard } from '../../components';
import { colors, spacing } from '../../theme';
import { API_BASE_URL } from '../../config';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  type: string;
  venue: string;
}

export function StudentEventsScreen() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE_URL}/api/student/events`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch events');
        return res.json();
      })
      .then((data) => {
        setEvents(data);
      })
      .catch((err) => {
        console.error('Error fetching events:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <ScreenContainer scroll>
      <Animated.View entering={FadeInDown.duration(280).springify().damping(20)}>
        <Text style={styles.title}>Events & Activities</Text>
        <Text style={styles.subtitle}>Sports, cultural, tech</Text>
      </Animated.View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#E07C3C" />
        </View>
      ) : events.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>No events found.</Text>
        </View>
      ) : (
        events.map((e, i) => (
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
        ))
      )}
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
  centered: { padding: spacing.xl, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: colors.textSecondary, fontSize: 14 },
});
