import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer, GlassCard } from '../../components';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing } from '../../theme';
import { API_BASE_URL } from '../../config';

interface TimetableSlot {
  id: number;
  subject: string;
  day: string;
  time_slot: string;
  room: string;
  teacher_name?: string;
}

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function StudentTimetableScreen({ navigation }: { navigation?: any }) {
  const { user } = useAuth();
  const [schedule, setSchedule] = useState<TimetableSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState('Monday');

  useEffect(() => {
    if (!user?.id) return;
    
    setLoading(true);
    fetch(`${API_BASE_URL}/api/student/${user.id}/timetable`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch timetable');
        return res.json();
      })
      .then((data) => {
        setSchedule(data);
      })
      .catch((err) => {
        console.error('Error fetching timetable:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user?.id]);

  const activeSlots = schedule.filter((s) => s.day.toLowerCase() === activeDay.toLowerCase());

  return (
    <ScreenContainer scroll>
      <View style={styles.headerRow}>
        {navigation?.canGoBack() && (
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        )}
        <Text style={styles.title}>Weekly Timetable</Text>
      </View>
      <Text style={styles.subtitle}>Class schedules & room allocations</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.daysBar}
      >
        {DAYS_OF_WEEK.map((day) => {
          const isSelected = activeDay === day;
          return (
            <TouchableOpacity
              key={day}
              onPress={() => setActiveDay(day)}
              style={[styles.dayTab, isSelected && styles.dayTabSelected]}
            >
              <Text style={[styles.dayTabText, isSelected && styles.dayTabTextSelected]}>
                {day.substring(0, 3)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#E07C3C" />
        </View>
      ) : activeSlots.length === 0 ? (
        <Animated.View entering={FadeInDown.duration(200)} style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={48} color={colors.textMuted} />
          <Text style={styles.emptyText}>No classes scheduled for {activeDay}.</Text>
        </Animated.View>
      ) : (
        activeSlots.map((slot, i) => (
          <Animated.View key={slot.id} entering={FadeInDown.delay(i * 50).springify().damping(20)}>
            <GlassCard rounded="lg" style={styles.slotCard}>
              <View style={styles.timeBadge}>
                <Ionicons name="time-outline" size={14} color="#FFFFFF" style={{ marginRight: 4 }} />
                <Text style={styles.timeText}>{slot.time_slot}</Text>
              </View>

              <View style={styles.cardBody}>
                <Text style={styles.subjectText}>{slot.subject}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginTop: 6 }}>
                  {slot.room ? (
                    <View style={styles.roomRow}>
                      <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
                      <Text style={styles.roomText}>{slot.room}</Text>
                    </View>
                  ) : null}

                  {slot.teacher_name ? (
                    <View style={styles.roomRow}>
                      <Ionicons name="person-outline" size={14} color={colors.textSecondary} />
                      <Text style={styles.roomText}>{slot.teacher_name}</Text>
                    </View>
                  ) : null}
                </View>
              </View>
            </GlassCard>
          </Animated.View>
        ))
      )}
      <View style={{ height: 40 }} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  backBtn: { padding: 4, marginRight: spacing.sm },
  title: { fontSize: 24, fontWeight: '700', color: colors.textPrimary },
  subtitle: { color: colors.textSecondary, marginBottom: spacing.md },
  daysBar: { paddingVertical: spacing.xs, marginBottom: spacing.md, gap: spacing.xs },
  dayTab: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EBEBEB',
  },
  dayTabSelected: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  dayTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  dayTabTextSelected: {
    color: '#FFFFFF',
  },
  slotCard: {
    marginBottom: spacing.sm,
    padding: spacing.md,
  },
  timeBadge: {
    backgroundColor: '#E07C3C',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  timeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  cardBody: {
    marginTop: 2,
  },
  subjectText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  roomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  roomText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  centered: { padding: spacing.xl, alignItems: 'center', justifyContent: 'center' },
  emptyContainer: {
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    marginTop: spacing.md,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: spacing.sm,
    fontWeight: '500',
  },
});
