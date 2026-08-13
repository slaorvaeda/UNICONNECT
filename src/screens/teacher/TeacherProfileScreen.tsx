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

export function TeacherProfileScreen({ navigation }: { navigation?: any }) {
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
              <Avatar name={user?.name ?? 'Teacher'} size={100} />
              <TouchableOpacity style={styles.changePhotoBtn} activeOpacity={0.8}>
                <Ionicons name="camera" size={18} color={colors.white} />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          {user?.department && <Text style={styles.dept}>{user.department}</Text>}
        </View>
      </Animated.View>
      
      <GlassCard rounded="lg" style={styles.card}>
        <Text style={styles.cardTitle}>Academic Quick Actions</Text>
        <TouchableOpacity
          style={styles.menuRow}
          onPress={() => navigation?.navigate('TeacherTimetable')}
        >
          <View style={styles.menuRowLeft}>
            <Ionicons name="calendar-outline" size={20} color={colors.primary} style={{ marginRight: spacing.sm }} />
            <Text style={styles.menuRowText}>View Class Timetables</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
        </TouchableOpacity>
      </GlassCard>

      <GlassCard rounded="lg" style={styles.card}>
        <Text style={styles.cardTitle}>Personal Profile</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Employee ID</Text>
          <Text style={styles.detailValue}>{user?.employee_id || 'N/A'}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Designation</Text>
          <Text style={styles.detailValue}>{user?.designation || 'N/A'}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Date of Birth</Text>
          <Text style={styles.detailValue}>{user?.dob || 'N/A'}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Phone Number</Text>
          <Text style={styles.detailValue}>{user?.phone || 'N/A'}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Gender</Text>
          <Text style={styles.detailValue}>{user?.gender || 'N/A'}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Blood Group</Text>
          <Text style={styles.detailValue}>{user?.blood_group || 'N/A'}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Home Address</Text>
          <Text style={styles.detailValue}>{user?.address || 'N/A'}</Text>
        </View>
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
  dept: { color: colors.primaryLight, fontSize: 14, marginTop: 2 },
  card: { marginBottom: spacing.lg },
  cardTitle: { color: colors.textPrimary, fontWeight: '600', fontSize: 16, marginBottom: spacing.sm },
  item: { color: colors.textSecondary, paddingVertical: 4, fontSize: 14 },
  logoutWrap: { marginTop: spacing.xl, paddingBottom: 88, alignItems: 'center' },
  logoutBtn: {
    backgroundColor: '#1A1A1A',
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 12,
  },
  logoutBtnPressed: { opacity: 0.9 },
  logoutBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  detailLabel: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  detailValue: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '500',
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  menuRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuRowText: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '500',
  },
});
