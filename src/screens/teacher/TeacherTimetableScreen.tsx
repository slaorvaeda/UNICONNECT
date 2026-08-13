import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView, Modal, Pressable } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenContainer, GlassCard } from '../../components';
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

export function TeacherTimetableScreen({ navigation }: { navigation?: any }) {
  const insets = useSafeAreaInsets();
  
  // Roster inputs
  const [dept, setDept] = useState('');
  const [year, setYear] = useState('3rd');
  const [section, setSection] = useState('A');
  const [scheduleLoaded, setScheduleLoaded] = useState(false);

  // Selector sheets (toggled instantly as absolute view overlays)
  const [showDeptPicker, setShowDeptPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [showSecPicker, setShowSecPicker] = useState(false);

  // Options
  const yearsList = ['1st', '2nd', '3rd', '4th'];
  const sectionsList = ['A', 'B', 'C', 'D'];
  const [departments, setDepartments] = useState<any[]>([]);
  const [loadingDepts, setLoadingDepts] = useState(false);

  // Timetable records
  const [schedule, setSchedule] = useState<TimetableSlot[]>([]);
  const [loadingSchedule, setLoadingSchedule] = useState(false);
  const [activeDay, setActiveDay] = useState('Monday');

  const fetchDepartments = async () => {
    try {
      setLoadingDepts(true);
      const res = await fetch(`${API_BASE_URL}/api/teacher/departments`);
      if (res.ok) {
        const data = await res.json();
        setDepartments(data);
        if (data.length > 0) {
          setDept(data[0].name);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingDepts(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const loadTimetable = async () => {
    if (!dept || !year || !section) return;

    try {
      setLoadingSchedule(true);
      const url = `${API_BASE_URL}/api/teacher/timetable?department=${encodeURIComponent(dept)}&year=${encodeURIComponent(year)}&section=${encodeURIComponent(section)}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setSchedule(data);
        setScheduleLoaded(true);
      }
    } catch (e) {
      console.error('Error fetching class schedule:', e);
    } finally {
      setLoadingSchedule(false);
    }
  };

  const activeSlots = schedule.filter((s) => s.day.toLowerCase() === activeDay.toLowerCase());

  return (
    <ScreenContainer scroll>
      <View style={styles.headerRow}>
        {navigation?.canGoBack() && (
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        )}
        <Text style={styles.title}>Class Timetables</Text>
      </View>
      <Text style={styles.subtitle}>Select a class to view scheduling hours</Text>

      {!scheduleLoaded ? (
        <Animated.View entering={FadeInDown.duration(200)}>
          <GlassCard rounded="lg" style={{ padding: spacing.md }}>
            {/* Department Dropdown Selector */}
            <Text style={styles.dropdownLabel}>Department</Text>
            <TouchableOpacity
              onPress={() => setShowDeptPicker(true)}
              style={styles.dropdownTrigger}
            >
              <Text style={styles.dropdownValue}>
                {dept || 'Select Department'}
              </Text>
              <Ionicons name="chevron-down" size={18} color={colors.textSecondary} />
            </TouchableOpacity>

            {/* Year Dropdown Selector */}
            <Text style={styles.dropdownLabel}>Year</Text>
            <TouchableOpacity
              onPress={() => setShowYearPicker(true)}
              style={styles.dropdownTrigger}
            >
              <Text style={styles.dropdownValue}>{year} Year</Text>
              <Ionicons name="chevron-down" size={18} color={colors.textSecondary} />
            </TouchableOpacity>

            {/* Section Dropdown Selector */}
            <Text style={styles.dropdownLabel}>Section</Text>
            <TouchableOpacity
              onPress={() => setShowSecPicker(true)}
              style={styles.dropdownTrigger}
            >
              <Text style={styles.dropdownValue}>Section {section}</Text>
              <Ionicons name="chevron-down" size={18} color={colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={loadTimetable}
              disabled={loadingSchedule || loadingDepts}
              style={[styles.primaryButton, { marginTop: spacing.md }]}
            >
              {loadingSchedule ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="calendar-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                  <Text style={styles.primaryButtonText}>Load Class Schedule</Text>
                </>
              )}
            </TouchableOpacity>
          </GlassCard>
        </Animated.View>
      ) : (
        <Animated.View entering={FadeInDown.duration(200)}>
          <View style={styles.rosterHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.classMetaTitle}>{dept}</Text>
              <Text style={styles.classMetaSub}>
                {year} Year • Section {section}
              </Text>
            </View>
            <TouchableOpacity onPress={() => setScheduleLoaded(false)} style={styles.changeClassBtn}>
              <Text style={styles.changeClassText}>Change Class</Text>
            </TouchableOpacity>
          </View>

          {/* Weekday Selector Bar */}
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

          {activeSlots.length === 0 ? (
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
        </Animated.View>
      )}

      {/* -------------------- INSTANT ABSOLUTE PICKERS (Inside Main Screen Container) -------------------- */}
      {showDeptPicker && (
        <Pressable style={styles.absolutePickerOverlay} onPress={() => setShowDeptPicker(false)}>
          <View style={styles.pickerCard}>
            <Text style={styles.pickerTitle}>Select Department</Text>
            {departments.length === 0 ? (
              <Text style={{ textAlign: 'center', color: colors.textSecondary, margin: 20 }}>
                No active departments found.
              </Text>
            ) : (
              <ScrollView>
                {departments.map((d) => (
                  <TouchableOpacity
                    key={d.id}
                    style={styles.pickerItem}
                    onPress={() => {
                      setDept(d.name);
                      setShowDeptPicker(false);
                    }}
                  >
                    <Text style={styles.pickerItemText}>{d.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
        </Pressable>
      )}

      {showYearPicker && (
        <Pressable style={styles.absolutePickerOverlay} onPress={() => setShowYearPicker(false)}>
          <View style={styles.pickerCard}>
            <Text style={styles.pickerTitle}>Select Year</Text>
            <ScrollView>
              {yearsList.map((y) => (
                <TouchableOpacity
                  key={y}
                  style={styles.pickerItem}
                  onPress={() => {
                    setYear(y);
                    setShowYearPicker(false);
                  }}
                >
                  <Text style={styles.pickerItemText}>{y} Year</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      )}

      {showSecPicker && (
        <Pressable style={styles.absolutePickerOverlay} onPress={() => setShowSecPicker(false)}>
          <View style={styles.pickerCard}>
            <Text style={styles.pickerTitle}>Select Section</Text>
            <ScrollView>
              {sectionsList.map((s) => (
                <TouchableOpacity
                  key={s}
                  style={styles.pickerItem}
                  onPress={() => {
                    setSection(s);
                    setShowSecPicker(false);
                  }}
                >
                  <Text style={styles.pickerItemText}>Section {s}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  backBtn: { padding: 4, marginRight: spacing.sm },
  title: { fontSize: 24, fontWeight: '700', color: colors.textPrimary },
  subtitle: { color: colors.textSecondary, marginBottom: spacing.lg },
  rosterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  classMetaTitle: { color: colors.textPrimary, fontSize: 18, fontWeight: '700' },
  classMetaSub: { color: colors.textSecondary, fontSize: 13, marginTop: 2 },
  changeClassBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  changeClassText: { color: colors.textSecondary, fontSize: 12, fontWeight: '600' },
  dropdownLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: spacing.xs,
    marginBottom: 6,
  },
  dropdownTrigger: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EBEBEB',
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    marginBottom: spacing.sm,
  },
  dropdownValue: {
    fontSize: 15,
    color: colors.textPrimary,
  },
  primaryButton: {
    backgroundColor: '#000000',
    borderRadius: 12,
    minHeight: 52,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  // Days selector
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

  // Slot card styles
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

  // Picker modal sheet overlay
  pickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  pickerCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: spacing.md,
    maxHeight: '60%',
    ...colors.shadow,
  },
  pickerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingBottom: spacing.xs,
  },
  pickerItem: {
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#F7F7F7',
  },
  pickerItemText: {
    fontSize: 15,
    color: colors.textPrimary,
  },

  // Absolute picker sibling overlay
  absolutePickerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    zIndex: 999,
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
