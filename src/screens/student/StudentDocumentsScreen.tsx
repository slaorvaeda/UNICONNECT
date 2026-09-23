import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  Pressable,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ScreenContainer, GlassCard } from '../../components';
import { dummyDocuments } from '../../data/dummy';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing } from '../../theme';
import type { StudentDocument } from '../../types';

const DOC_TYPE_LABELS: Record<StudentDocument['type'], string> = {
  certificate: 'Certificate',
  marksheet: 'Marksheet',
  id_proof: 'ID Proof',
  other: 'Other',
};

export function StudentDocumentsScreen({ navigation }: { navigation: any }) {
  const { user } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [docType, setDocType] = useState<StudentDocument['type']>('other');
  const [localDocs, setLocalDocs] = useState<StudentDocument[]>([]);

  const documents = [...dummyDocuments, ...localDocs].filter(
    (d) => d.studentId === user?.id || d.studentId === '1'
  );

  const handleAdd = () => {
    if (!title.trim()) return;
    setLocalDocs((prev) => [
      ...prev,
      {
        id: `d-${Date.now()}`,
        studentId: user?.id ?? '1',
        type: docType,
        title: title.trim(),
        uploadedAt: new Date().toISOString().split('T')[0],
      },
    ]);
    setTitle('');
    setDocType('other');
    setModalVisible(false);
  };

  const getIcon = (type: StudentDocument['type']) => {
    switch (type) {
      case 'certificate':
        return 'ribbon-outline';
      case 'marksheet':
        return 'document-text-outline';
      case 'id_proof':
        return 'card-outline';
      default:
        return 'folder-open-outline';
    }
  };

  return (
    <ScreenContainer scroll>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>My Documents</Text>
      </View>
      <Text style={styles.subtitle}>Certificates, marksheets & ID</Text>

      {documents.map((d, i) => (
        <Animated.View key={d.id} entering={FadeInDown.delay(i * 50).springify().damping(20)}>
          <GlassCard rounded="lg" style={styles.card}>
            <View style={styles.docRow}>
              <View style={styles.docIcon}>
                <Ionicons name={getIcon(d.type)} size={24} color={colors.primary} />
              </View>
              <View style={styles.docInfo}>
                <Text style={styles.docTitle}>{d.title}</Text>
                <Text style={styles.docMeta}>
                  {DOC_TYPE_LABELS[d.type]} • {d.uploadedAt}
                </Text>
              </View>
              <Ionicons name="download-outline" size={22} color={colors.textMuted} />
            </View>
          </GlassCard>
        </Animated.View>
      ))}

      <Pressable
        onPress={() => setModalVisible(true)}
        style={({ pressed }) => [styles.addBtn, pressed && styles.addBtnPressed]}
      >
        <Ionicons name="add-circle-outline" size={24} color={colors.primary} />
        <Text style={styles.addBtnText}>Add Document</Text>
      </Pressable>

      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={() => setModalVisible(false)} />
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Document</Text>
            <Text style={styles.inputLabel}>Document type</Text>
            <View style={styles.typeRow}>
              {(['certificate', 'marksheet', 'id_proof', 'other'] as const).map((t) => (
                <Pressable
                  key={t}
                  onPress={() => setDocType(t)}
                  style={[styles.typeChip, docType === t && styles.typeChipActive]}
                >
                  <Text style={[styles.typeChipText, docType === t && styles.typeChipTextActive]}>{DOC_TYPE_LABELS[t]}</Text>
                </Pressable>
              ))}
            </View>
            <Text style={[styles.inputLabel, { marginTop: spacing.md }]}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Semester 2 Marksheet"
              placeholderTextColor={colors.textMuted}
              value={title}
              onChangeText={setTitle}
            />
            <View style={styles.inputUnderline} />
            <View style={styles.modalActions}>
              <Pressable onPress={() => setModalVisible(false)} style={styles.cancelBtn}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={handleAdd}
                style={[styles.submitBtn, !title.trim() && styles.submitBtnDisabled]}
                disabled={!title.trim()}
              >
                <Text style={styles.submitBtnText}>Add</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  backBtn: { padding: 4, marginRight: spacing.sm },
  title: { fontSize: 24, fontWeight: '700', color: colors.textPrimary },
  subtitle: { color: colors.textSecondary, marginBottom: spacing.lg },
  card: { marginBottom: spacing.sm },
  docRow: { flexDirection: 'row', alignItems: 'center' },
  docIcon: { width: 44, height: 44, borderRadius: 10, backgroundColor: 'rgba(45,45,45,0.08)', justifyContent: 'center', alignItems: 'center', marginRight: spacing.md },
  docInfo: { flex: 1 },
  docTitle: { color: colors.textPrimary, fontWeight: '600', fontSize: 16 },
  docMeta: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: spacing.lg,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: 12,
    borderStyle: 'dashed',
  },
  addBtnPressed: { opacity: 0.8 },
  addBtnText: { color: colors.primary, fontWeight: '600' },

  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  modalBackdrop: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(0,0,0,0.4)' },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: spacing.lg,
  },
  modalTitle: { fontSize: 20, fontWeight: '700', color: colors.textPrimary, marginBottom: spacing.lg },
  inputLabel: { fontSize: 14, color: colors.textSecondary, fontWeight: '500', marginBottom: spacing.xs },
  typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  typeChip: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8, borderWidth: 1, borderColor: colors.cardBorder },
  typeChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  typeChipText: { color: colors.textSecondary, fontSize: 14 },
  typeChipTextActive: { color: colors.white },
  input: { fontSize: 16, color: colors.textPrimary, paddingVertical: spacing.sm },
  inputUnderline: { height: 1, backgroundColor: colors.cardBorder },
  modalActions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.xl },
  cancelBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, borderWidth: 1, borderColor: colors.cardBorder, alignItems: 'center' },
  cancelBtnText: { color: colors.textSecondary, fontWeight: '600' },
  submitBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: colors.primary, alignItems: 'center' },
  submitBtnDisabled: { opacity: 0.5 },
  submitBtnText: { color: colors.white, fontWeight: '600' },
});
