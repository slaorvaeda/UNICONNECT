import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer, GlassCard, Avatar } from '../../components';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing } from '../../theme';

export function StudentProfileScreen({ navigation }: { navigation?: any }) {
  const { user, logout } = useAuth();
  const ringScale = useSharedValue(1);

  useEffect(() => {
    ringScale.value = withRepeat(
      withSequence(withTiming(1.03, { duration: 1200 }), withTiming(1, { duration: 1200 })),
      -1,
      true
    );
  }, []);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
  }));

  return (
    <ScreenContainer scroll>
      <Animated.View entering={FadeInDown.duration(280).springify().damping(20)}>
        <View style={styles.header}>
          <View style={styles.avatarWrap}>
            <Animated.View style={[styles.avatarRing, ringStyle]} />
            <View style={styles.avatarCircle}>
              <Avatar name={user?.name ?? 'User'} size={100} />
              <TouchableOpacity style={styles.changePhotoBtn} activeOpacity={0.8}>
                <Ionicons name="camera" size={18} color={colors.white} />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          {user?.studentId && <Text style={styles.id}>{user.studentId}</Text>}
          {user?.department && <Text style={styles.dept}>{user.department} • {user.year}</Text>}
        </View>
      </Animated.View>
      <GlassCard rounded="lg" style={styles.card}>
        <Text style={styles.cardTitle}>Account</Text>
        <TouchableOpacity onPress={() => navigation?.navigate('StudentAcademicRecords')} style={styles.itemWrap}>
          <Text style={styles.item}>View academic records</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation?.navigate('StudentFees')} style={styles.itemWrap}>
          <Text style={styles.item}>Fee details</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation?.navigate('StudentExamSchedules')} style={styles.itemWrap}>
          <Text style={styles.item}>Exam schedules</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation?.navigate('StudentDocuments')} style={styles.itemWrap}>
          <Text style={styles.item}>My documents & certificates</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </TouchableOpacity>
      </GlassCard>
      <View style={styles.logoutWrap}>
        <Pressable onPress={logout} style={({ pressed }) => [styles.logoutBtn, pressed && styles.logoutBtnPressed]}>
          <Text style={styles.logoutBtnText}>Logout</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', marginBottom: spacing.xl, marginTop: spacing.md },
  avatarWrap: { position: 'relative', marginBottom: spacing.sm },
  avatarRing: {
    position: 'absolute',
    width: 112,
    height: 112,
    borderRadius: 56,
    borderWidth: 2,
    borderStyle: 'dotted',
    borderColor: colors.cardBorder,
    top: -6,
    left: -6,
  },
  avatarCircle: { position: 'relative' },
  changePhotoBtn: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: { color: colors.textPrimary, fontSize: 22, fontWeight: '700', marginTop: spacing.sm },
  email: { color: colors.textSecondary, fontSize: 14, marginTop: 2 },
  id: { color: colors.primaryLight, fontSize: 14, marginTop: 2 },
  dept: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
  card: { marginBottom: spacing.lg },
  cardTitle: { color: colors.textPrimary, fontWeight: '600', fontSize: 16, marginBottom: spacing.sm },
  itemWrap: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  item: { color: colors.textSecondary, fontSize: 14 },
  logoutWrap: { marginTop: spacing.xl, paddingBottom: 88, alignItems: 'center' },
  logoutBtn: {
    backgroundColor: '#1A1A1A',
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 12,
  },
  logoutBtnPressed: { opacity: 0.9 },
  logoutBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
