import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, ScrollView } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer, GlassCard, StatusBadge, Input } from '../../components';
import { colors, spacing } from '../../theme';
import { API_BASE_URL } from '../../config';

export function TeacherGrievancesScreen() {
  const [grievances, setGrievances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolvingId, setResolvingId] = useState<number | null>(null);
  const [responses, setResponses] = useState<{ [key: number]: string }>({});

  const fetchGrievances = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/teacher/grievances`);
      if (res.ok) {
        const data = await res.json();
        setGrievances(data);
      }
    } catch (e) {
      console.error('Fetch grievances error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrievances();
  }, []);

  const handleResolveGrievance = async (id: number) => {
    const text = responses[id] || '';
    if (!text.trim()) {
      Alert.alert('Required', 'Please enter a resolution response.');
      return;
    }

    try {
      setResolvingId(id);
      const res = await fetch(`${API_BASE_URL}/api/teacher/grievances/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'resolved',
          response: text,
        }),
      });

      if (res.ok) {
        Alert.alert('Success', 'Grievance ticket resolved!');
        setResponses({ ...responses, [id]: '' });
        fetchGrievances();
      } else {
        Alert.alert('Error', 'Failed to resolve grievance.');
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Network request failed.');
    } finally {
      setResolvingId(null);
    }
  };

  return (
    <ScreenContainer scroll>
      <Animated.View entering={FadeInDown.duration(280).springify().damping(20)}>
        <Text style={styles.title}>Grievances to review</Text>
        <Text style={styles.subtitle}>Resolve student issues</Text>
      </Animated.View>

      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
      ) : grievances.length === 0 ? (
        <Text style={styles.emptyText}>No grievance tickets filed.</Text>
      ) : (
        grievances.map((g, i) => (
          <Animated.View key={g.id} entering={FadeInDown.delay(i * 50).springify().damping(20)}>
            <GlassCard rounded="lg" style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.subject}>{g.subject}</Text>
                <View style={[
                  styles.badge,
                  g.status === 'resolved' ? styles.badgeSuccess : styles.badgeWarning
                ]}>
                  <Text style={styles.badgeText}>
                    {g.status === 'resolved' ? 'Resolved' : 'Pending'}
                  </Text>
                </View>
              </View>
              <Text style={styles.desc}>{g.description}</Text>
              <Text style={styles.date}>Filed: {new Date(g.created_at).toLocaleDateString()}</Text>

              {g.status !== 'resolved' ? (
                <View style={styles.resolveForm}>
                  <Input
                    label="Resolution Response"
                    placeholder="Type response to student..."
                    value={responses[g.id] || ''}
                    onChangeText={(t) => setResponses({ ...responses, [g.id]: t })}
                    multiline
                  />
                  <TouchableOpacity
                    onPress={() => handleResolveGrievance(g.id)}
                    disabled={resolvingId === g.id}
                    style={[styles.primaryButton, { marginTop: spacing.xs }]}
                  >
                    {resolvingId === g.id ? (
                      <ActivityIndicator color="#FFFFFF" />
                    ) : (
                      <Text style={styles.primaryButtonText}>Resolve Ticket</Text>
                    )}
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.resolvedBox}>
                  <Text style={styles.responseLabel}>Response:</Text>
                  <Text style={styles.responseText}>{g.response}</Text>
                </View>
              )}
            </GlassCard>
          </Animated.View>
        ))
      )}
      <View style={{ height: 40 }} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: '700', color: colors.textPrimary },
  subtitle: { color: colors.textSecondary, marginTop: 4, marginBottom: spacing.lg },
  card: { marginBottom: spacing.md, padding: spacing.md },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  subject: { color: colors.textPrimary, fontWeight: '600', fontSize: 16, flex: 1 },
  desc: { color: colors.textSecondary, fontSize: 14 },
  date: { color: colors.textMuted, fontSize: 12, marginTop: 4 },
  
  // Resolution form styles
  resolveForm: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  resolvedBox: {
    marginTop: spacing.sm,
    padding: spacing.sm,
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  responseLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#166534',
  },
  responseText: {
    fontSize: 13,
    color: '#14532D',
    marginTop: 2,
  },
  primaryButton: {
    backgroundColor: '#000000',
    borderRadius: 12,
    minHeight: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: spacing.xs,
  },
  badgeSuccess: {
    backgroundColor: '#DCFCE7',
  },
  badgeWarning: {
    backgroundColor: '#FEF3C7',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});
