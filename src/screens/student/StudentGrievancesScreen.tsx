import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  Pressable,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ScreenContainer, GlassCard, StatusBadge, GlassButton } from '../../components';
import { dummyGrievances } from '../../data/dummy';
import { colors, spacing } from '../../theme';

export function StudentGrievancesScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [localGrievances, setLocalGrievances] = useState<typeof dummyGrievances>([]);

  const grievances = [...dummyGrievances, ...localGrievances];

  const handleSubmit = () => {
    if (!subject.trim() || !description.trim()) return;
    setLocalGrievances((prev) => [
      ...prev,
      {
        id: `g-${Date.now()}`,
        studentId: '1',
        subject: subject.trim(),
        description: description.trim(),
        status: 'pending' as const,
        createdAt: new Date().toISOString().split('T')[0],
      },
    ]);
    setSubject('');
    setDescription('');
    setModalVisible(false);
  };

  const handleClose = () => {
    setModalVisible(false);
    setSubject('');
    setDescription('');
  };

  return (
    <ScreenContainer scroll>
      <Animated.View entering={FadeInDown.duration(280).springify().damping(20)}>
        <Text style={styles.title}>My Grievances</Text>
        <Text style={styles.subtitle}>Track and submit</Text>
      </Animated.View>
      {grievances.map((g, i) => (
        <Animated.View key={g.id} entering={FadeInDown.delay(i * 50).springify().damping(20)}>
          <GlassCard rounded="lg" style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.subject}>{g.subject}</Text>
              <StatusBadge status={g.status} />
            </View>
            <Text style={styles.desc} numberOfLines={2}>
              {g.description}
            </Text>
            <Text style={styles.date}>{g.createdAt}</Text>
            {g.response && (
              <View style={styles.responseWrap}>
                <Text style={styles.responseLabel}>Response:</Text>
                <Text style={styles.response}>{g.response}</Text>
              </View>
            )}
          </GlassCard>
        </Animated.View>
      ))}
      <GlassButton
        title="+ New Grievance"
        onPress={() => setModalVisible(true)}
        variant="outline"
        style={styles.addBtn}
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={handleClose}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalOverlay}
        >
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={handleClose}
          />
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Grievance</Text>

            <Text style={styles.inputLabel}>Subject</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Library timings"
              placeholderTextColor={colors.textMuted}
              value={subject}
              onChangeText={setSubject}
            />
            <View style={styles.inputUnderline} />

            <Text style={[styles.inputLabel, { marginTop: spacing.md }]}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe your grievance..."
              placeholderTextColor={colors.textMuted}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
            />
            <View style={styles.inputUnderline} />

            <View style={styles.modalActions}>
              <Pressable onPress={handleClose} style={styles.cancelBtn}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={handleSubmit}
                style={[styles.submitBtn, (!subject.trim() || !description.trim()) && styles.submitBtnDisabled]}
                disabled={!subject.trim() || !description.trim()}
              >
                <Text style={styles.submitBtnText}>Submit</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: '700', color: colors.textPrimary },
  subtitle: { color: colors.textSecondary, marginTop: 4, marginBottom: spacing.lg },
  card: { marginBottom: spacing.md },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  subject: { color: colors.textPrimary, fontWeight: '600', fontSize: 16 },
  desc: { color: colors.textSecondary, fontSize: 14 },
  date: { color: colors.textMuted, fontSize: 12, marginTop: 4 },
  responseWrap: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
  },
  responseLabel: { color: colors.primary, fontSize: 12, fontWeight: '600' },
  response: { color: colors.textSecondary, fontSize: 13, marginTop: 2 },
  addBtn: { marginTop: spacing.md, paddingBottom: 88 },

  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: spacing.lg,
    paddingBottom: spacing.xxl + 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  inputLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
    marginBottom: spacing.xs,
  },
  input: {
    fontSize: 16,
    color: colors.textPrimary,
    paddingVertical: spacing.sm,
  },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  inputUnderline: {
    height: 1,
    backgroundColor: colors.cardBorder,
  },
  modalActions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
  },
  cancelBtnText: { color: colors.textSecondary, fontWeight: '600' },
  submitBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  submitBtnDisabled: { opacity: 0.5 },
  submitBtnText: { color: colors.white, fontWeight: '600' },
});
