import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  FadeInDown,
  createAnimatedComponent,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const AnimatedText = createAnimatedComponent(Text);
import { Ionicons } from '@expo/vector-icons';
import { Avatar, CircularStatChart, CircularPendingBadge } from '../../components';
import { useAuth } from '../../context/AuthContext';
import {
  dummyAttendance,
  dummyNotices,
  dummyEvents,
  dummyFees,
  dummyExamSchedules,
  dummyGrievances,
} from '../../data/dummy';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { colors, spacing, borderRadius } from '../../theme';

const HEADER_ORANGE = '#E07C3C';
const DARK_CARD = '#1A1A1A';

function AnimatedLogo() {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.92);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.06, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500 }),
        withTiming(0.9, { duration: 1500 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <AnimatedText style={[styles.logo, animatedStyle]}>Uniconnect</AnimatedText>
  );
}

export function StudentHomeScreen({ navigation }: { navigation?: any }) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const recentNotices = dummyNotices.slice(0, 2);
  const upcomingEvents = dummyEvents.slice(0, 2);
  const upcomingExams = dummyExamSchedules.slice(0, 2);
  const recentGrievance = dummyGrievances.find((g) => g.status === 'in_progress') ?? dummyGrievances[0];
  const pendingFees = dummyFees.filter((f) => f.status === 'pending');
  const totalPending = pendingFees.reduce((sum, f) => sum + f.amount, 0);
  const attendancePct = dummyAttendance[0]?.percentage ?? 0;
  const presentCount = dummyAttendance.filter((a) => a.status === 'present').length;

  return (
    <View style={styles.outer}>
      <Animated.View
        entering={FadeInDown.duration(280).springify().damping(20)}
        style={[styles.header, { paddingTop: Math.max(insets.top, 12) + 12 }]}
      >
        {Platform.OS === 'ios' ? (
          <BlurView intensity={50} tint="light" style={StyleSheet.absoluteFill} />
        ) : (
          <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(224,124,60,0.92)' }]} />
        )}
        <LinearGradient
          colors={['rgba(224,124,60,0.65)', 'rgba(224,124,60,0.88)', 'rgba(200,90,40,0.95)']}
          style={StyleSheet.absoluteFill}
        />
        <AnimatedLogo />
        <View style={styles.headerInner}>
        <Avatar name={user?.name ?? 'Student'} size={44} />
        <View style={styles.headerIcons}>
          <Pressable style={styles.iconPill}>
            <Ionicons name="people-outline" size={18} color="#fff" />
          </Pressable>
          <Pressable style={styles.iconPill}>
            <Ionicons name="gift-outline" size={18} color="#fff" />
          </Pressable>
          <Pressable style={styles.iconPill}>
            <Ionicons name="notifications-outline" size={18} color="#fff" />
          </Pressable>
        </View>
        <View style={styles.headerCenter}>
          <Text style={styles.headerLabel}>Attendance</Text>
          <Text style={styles.headerValue}>{attendancePct}%</Text>
        </View>
        </View>
      </Animated.View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
      <View style={styles.content}>
        <View style={styles.statsRow}>
          <CircularStatChart
            value={presentCount}
            max={dummyAttendance.length}
            label="Present"
            color={colors.success}
            displayValue={`${presentCount}`}
          />
          <CircularStatChart
            value={attendancePct}
            max={100}
            label="Attendance"
            color={HEADER_ORANGE}
            displayValue={`${attendancePct}%`}
          />
          <CircularPendingBadge
            displayValue={`₹${(totalPending / 1000).toFixed(0)}k`}
            label="Pending"
            color={colors.warning}
          />
        </View>

        <Text style={styles.sectionTitle}>Quick actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation?.navigate('StudentAttendance')}
          >
            <View style={styles.actionCircle}>
              <Ionicons name="calendar-outline" size={24} color={colors.textPrimary} />
            </View>
            <Text style={styles.actionLabel}>Attendance</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation?.navigate('StudentFees')}
          >
            <View style={styles.actionCircle}>
              <Ionicons name="card-outline" size={24} color={colors.textPrimary} />
            </View>
            <Text style={styles.actionLabel}>Fees</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation?.navigate('StudentEvents')}
          >
            <View style={styles.actionCircle}>
              <Ionicons name="megaphone-outline" size={24} color={colors.textPrimary} />
            </View>
            <Text style={styles.actionLabel}>Events</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation?.navigate('StudentGrievances')}
          >
            <View style={styles.actionCircle}>
              <Ionicons name="chatbubble-outline" size={24} color={colors.textPrimary} />
            </View>
            <Text style={styles.actionLabel}>Grievances</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.promoCard}>
          <View style={styles.promoText}>
            <Text style={styles.promoTitle}>Pay fees and stay on track</Text>
            <Text style={styles.promoDesc}>
              Clear your pending dues to avoid late charges
            </Text>
            <TouchableOpacity
              style={styles.promoBtn}
              onPress={() => navigation?.navigate('StudentFees')}
            >
              <Text style={styles.promoBtnText}>Pay now</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.favouritesRow}>
          <Text style={styles.favouritesTitle}>Upcoming</Text>
          <TouchableOpacity onPress={() => navigation?.navigate('StudentEvents')}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        {upcomingEvents.map((e, i) => (
          <Animated.View
            key={e.id}
            entering={FadeInDown.delay(i * 50).springify().damping(20)}
          >
            <TouchableOpacity
              style={styles.listItem}
              onPress={() => navigation?.navigate('StudentEvents')}
            >
              <View style={styles.listIcon}>
                <Ionicons name="calendar" size={20} color={HEADER_ORANGE} />
              </View>
              <View style={styles.listContent}>
                <Text style={styles.listTitle}>{e.title}</Text>
                <Text style={styles.listMeta}>{e.venue} • {e.date}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          </Animated.View>
        ))}

        <View style={styles.favouritesRow}>
          <Text style={styles.favouritesTitle}>Exam schedule</Text>
          <TouchableOpacity onPress={() => navigation?.navigate('StudentExamSchedules')}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        {upcomingExams.map((exam, i) => (
          <Animated.View
            key={exam.id}
            entering={FadeInDown.delay((2 + i) * 50).springify().damping(20)}
          >
            <TouchableOpacity
              style={styles.listItem}
              onPress={() => navigation?.navigate('StudentExamSchedules')}
            >
              <View style={[styles.listIcon, styles.listIconExam]}>
                <Ionicons name="document-attach" size={20} color={colors.info} />
              </View>
              <View style={styles.listContent}>
                <Text style={styles.listTitle}>{exam.subject}</Text>
                <Text style={styles.listMeta}>{exam.date} • {exam.time} • {exam.venue}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          </Animated.View>
        ))}

        <View style={styles.favouritesRow}>
          <Text style={styles.favouritesTitle}>Latest notices</Text>
          <TouchableOpacity onPress={() => navigation?.navigate('StudentNotices')}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        {recentNotices.map((notice, i) => (
          <Animated.View
            key={notice.id}
            entering={FadeInDown.delay((4 + i) * 50).springify().damping(20)}
          >
            <TouchableOpacity
              style={styles.listItem}
              onPress={() => navigation?.navigate('StudentNotices')}
            >
              <View style={[styles.listIcon, styles.listIconMuted]}>
                <Ionicons name="document-text" size={20} color={colors.textSecondary} />
              </View>
              <View style={styles.listContent}>
                <Text style={styles.listTitle}>{notice.title}</Text>
                <Text style={styles.listMeta} numberOfLines={1}>{notice.body}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          </Animated.View>
        ))}

        {recentGrievance && (
          <>
            <View style={styles.favouritesRow}>
              <Text style={styles.favouritesTitle}>Your grievances</Text>
              <TouchableOpacity onPress={() => navigation?.navigate('StudentGrievances')}>
                <Text style={styles.seeAll}>See all</Text>
              </TouchableOpacity>
            </View>
            <Animated.View entering={FadeInDown.delay(200).springify().damping(20)}>
              <TouchableOpacity
                style={styles.listItem}
                onPress={() => navigation?.navigate('StudentGrievances')}
              >
                <View style={[styles.listIcon, styles.listIconGrievance]}>
                  <Ionicons
                    name={recentGrievance.status === 'resolved' ? 'checkmark-circle' : 'time'}
                    size={20}
                    color={recentGrievance.status === 'resolved' ? colors.success : colors.warning}
                  />
                </View>
                <View style={styles.listContent}>
                  <Text style={styles.listTitle}>{recentGrievance.subject}</Text>
                  <Text style={styles.listMeta}>
                    {recentGrievance.status === 'resolved' ? 'Resolved' : 'In progress'}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              </TouchableOpacity>
            </Animated.View>
          </>
        )}

        <View style={styles.feeSummary}>
          <Text style={styles.feeLabel}>Pending fees</Text>
          <Text style={styles.feeAmount}>₹{totalPending.toLocaleString()}</Text>
        </View>
      </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: spacing.xxl + 60 },
  header: {
    overflow: 'hidden',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl + 16,
    minHeight: 260,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.25)',
    ...Platform.select({
      ios: {
        shadowColor: '#8B4513',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 14,
      },
      android: {
        elevation: 14,
      },
    }),
  },
  logo: {
    position: 'absolute',
    bottom: spacing.md,
    right: spacing.lg,
    fontSize: 20,
    fontFamily: 'BetaniaPatmosIn_400Regular',
    color: 'rgba(255,255,255,0.95)',
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 4,
    zIndex: 1,
  },
  headerInner: {
    position: 'relative',
    zIndex: 1,
  },
  headerIcons: {
    position: 'absolute',
    top: 0,
    right: spacing.lg,
    flexDirection: 'row',
    gap: spacing.xs,
  },
  iconPill: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  headerLabel: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    marginBottom: 2,
  },
  headerValue: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '700',
  },
  content: {
    paddingHorizontal: spacing.lg,
    marginTop: -20,
    paddingTop: spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
    alignItems: 'flex-start',
  },
  sectionTitle: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  actionBtn: {
    alignItems: 'center',
  },
  actionCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: { elevation: 4 },
    }),
  },
  actionLabel: {
    color: colors.textPrimary,
    fontSize: 12,
    marginTop: spacing.xs,
    fontWeight: '500',
  },
  promoCard: {
    backgroundColor: DARK_CARD,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: { elevation: 4 },
    }),
  },
  promoText: {
    maxWidth: '75%',
  },
  promoTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  promoDesc: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    marginBottom: spacing.md,
  },
  promoBtn: {
    alignSelf: 'flex-start',
    backgroundColor: HEADER_ORANGE,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 20,
  },
  promoBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  favouritesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  favouritesTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  seeAll: {
    color: HEADER_ORANGE,
    fontSize: 14,
    fontWeight: '600',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  listIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(224,124,60,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  listIconMuted: {
    backgroundColor: colors.cardBorder,
  },
  listIconExam: {
    backgroundColor: 'rgba(59,130,246,0.15)',
  },
  listIconGrievance: {
    backgroundColor: 'rgba(245,158,11,0.15)',
  },
  listContent: { flex: 1 },
  listTitle: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  listMeta: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 2,
  },
  feeSummary: {
    marginTop: spacing.lg,
    marginBottom: spacing.xxl,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  feeLabel: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  feeAmount: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
    marginTop: 4,
  },
});
