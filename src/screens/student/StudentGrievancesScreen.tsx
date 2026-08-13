import React, { useState, useEffect } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ScreenContainer, GlassCard, StatusBadge, GlassButton } from '../../components';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing } from '../../theme';
import { API_BASE_URL } from '../../config';

interface Grievance {
  id: number;
  subject: string;
  description: string;
  status: 'pending' | 'in_progress' | 'resolved';
  createdAt: string;
  response?: string;
}

export function StudentGrievancesScreen() {
  const { user } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    
    setLoading(true);
    fetch(`${API_BASE_URL}/api/student/${user.id}/grievances`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch grievances');
        return res.json();
      })
      .then((data) => {
        const mapped = data.map((item: any) => ({
          id: item.id,
          subject: item.subject,
          description: item.description,
          status: item.status,
          createdAt: new Date(item.created_at).toLocaleDateString(),
          response: item.response || undefined,
        }));
        setGrievances(mapped);
      })
      .catch((err) => {
        console.error('Error fetching grievances:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user?.id]);

  const handleSubmit = () => {
    if (!subject.trim() || !description.trim() || !user?.id || submitting) return;

    setSubmitting(true);
    fetch(`${API_BASE_URL}/api/student/${user.id}/grievances`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subject: subject.trim(),
        description: description.trim(),
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to submit grievance');
        return res.json();
      })
      .then((newG) => {
        const mapped: Grievance = {
          id: newG.id,
          subject: newG.subject,
          description: newG.description,
          status: newG.status,
          createdAt: new Date(newG.created_at).toLocaleDateString(),
          response: newG.response || undefined,
        };
        setGrievances((prev) => [mapped, ...prev]);
        setSubject('');
        setDescription('');
        setModalVisible(false);
      })
      .catch((err) => {
        console.error('Error submitting grievance:', err);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const handleClose = () => {
    if (submitting) return;
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

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#E07C3C" />
        </View>
      ) : grievances.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>No grievances submitted.</Text>
        </View>
      ) : (
        grievances.map((g, i) => (
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
        ))
      )}

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
              editable={!submitting}
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
              editable={!submitting}
            />
            <View style={styles.inputUnderline} />

            <View style={styles.modalActions}>
              <Pressable onPress={handleClose} style={styles.cancelBtn} disabled={submitting}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={handleSubmit}
                style={[
                  styles.submitBtn,
                  (!subject.trim() || !description.trim() || submitting) && styles.submitBtnDisabled,
                ]}
                disabled={!subject.trim() || !description.trim() || submitting}
              >
                {submitting ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <Text style={styles.submitBtnText}>Submit</Text>
                )}
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
  centered: { padding: spacing.xl, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: colors.textSecondary, fontSize: 14 },

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
    justifyContent: 'center',
  },
  submitBtnDisabled: { opacity: 0.5 },
  submitBtnText: { color: colors.white, fontWeight: '600' },
});
