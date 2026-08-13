import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ScreenContainer, GlassCard } from '../../components';
import { colors, spacing } from '../../theme';
import { API_BASE_URL } from '../../config';

interface Notice {
  id: number;
  title: string;
  body: string;
  date: string;
  category: string;
}

export function StudentNoticesScreen() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE_URL}/api/student/notices`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch notices');
        return res.json();
      })
      .then((data) => {
        setNotices(data);
      })
      .catch((err) => {
        console.error('Error fetching notices:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <ScreenContainer scroll>
      <Animated.View entering={FadeInDown.duration(280).springify().damping(20)}>
        <Text style={styles.title}>Notices</Text>
        <Text style={styles.subtitle}>College announcements</Text>
      </Animated.View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#E07C3C" />
        </View>
      ) : notices.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>No notices found.</Text>
        </View>
      ) : (
        notices.map((n, i) => (
          <Animated.View key={n.id} entering={FadeInDown.delay(i * 50).springify().damping(20)}>
            <GlassCard rounded="lg" style={styles.card}>
              <Text style={styles.category}>{n.category}</Text>
              <Text style={styles.noticeTitle}>{n.title}</Text>
              <Text style={styles.body}>{n.body}</Text>
              <Text style={styles.date}>{n.date}</Text>
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
  category: { color: colors.primary, fontSize: 12, fontWeight: '600' },
  noticeTitle: { color: colors.textPrimary, fontWeight: '600', fontSize: 16, marginTop: 4 },
  body: { color: colors.textSecondary, fontSize: 14, marginTop: 4 },
  date: { color: colors.textMuted, fontSize: 12, marginTop: spacing.sm },
  centered: { padding: spacing.xl, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: colors.textSecondary, fontSize: 14 },
});
