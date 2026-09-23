import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Linking, Alert } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer, GlassCard } from '../../components';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing } from '../../theme';
import { API_BASE_URL } from '../../config';

interface StudyMaterial {
  id: number;
  title: string;
  description?: string;
  file_url: string;
  subject: string;
  teacher_name: string;
  department: string;
  scheme: string;
  year?: string;
  semester?: string;
  created_at: string;
}

export function StudentLibraryScreen({ navigation }: { navigation: any }) {
  const { user } = useAuth();
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    fetch(`${API_BASE_URL}/api/student/${user.id}/materials`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch library resources');
        return res.json();
      })
      .then((data) => {
        setMaterials(data);
      })
      .catch((err) => {
        console.error('Error fetching materials:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user?.id]);

  const openMaterialLink = (url: string) => {
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert('Error', 'Cannot open the URL: ' + url);
        }
      })
      .catch((err) => {
        console.error('Error opening URL:', err);
        Alert.alert('Error', 'An error occurred while opening the notes link.');
      });
  };

  // Group materials by subject
  const groupedMaterials: { [subject: string]: StudyMaterial[] } = {};
  materials.forEach((mat) => {
    if (!groupedMaterials[mat.subject]) {
      groupedMaterials[mat.subject] = [];
    }
    groupedMaterials[mat.subject].push(mat);
  });

  return (
    <ScreenContainer scroll>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Study Notes Library</Text>
      </View>
      <Text style={styles.subtitle}>Reference materials and classroom resources</Text>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#E07C3C" />
        </View>
      ) : materials.length === 0 ? (
        <View style={styles.centered}>
          <Ionicons name="library-outline" size={48} color={colors.textMuted} style={{ marginBottom: 12 }} />
          <Text style={styles.emptyText}>No reference notes uploaded for your department yet.</Text>
        </View>
      ) : (
        Object.keys(groupedMaterials).map((subject, index) => (
          <Animated.View key={subject} entering={FadeInDown.delay(index * 80).springify().damping(20)}>
            <Text style={styles.subjectHeader}>{subject}</Text>
            {groupedMaterials[subject].map((mat) => (
              <GlassCard key={mat.id} rounded="lg" style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.materialTitle}>{mat.title}</Text>
                    {mat.description ? (
                      <Text style={styles.materialDesc}>{mat.description}</Text>
                    ) : null}
                    <Text style={styles.materialMeta}>
                      Uploaded by: {mat.teacher_name} • {mat.semester ? mat.semester : `${mat.year} Year`}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.openBtn}
                    onPress={() => openMaterialLink(mat.file_url)}
                  >
                    <Ionicons name="open-outline" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </GlassCard>
            ))}
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
  centered: { alignItems: 'center', justifyContent: 'center', marginTop: 80 },
  emptyText: { color: colors.textSecondary, fontSize: 15, textAlign: 'center', paddingHorizontal: 40 },
  subjectHeader: { fontSize: 14, fontWeight: '700', color: '#E07C3C', marginTop: spacing.md, marginBottom: spacing.xs, textTransform: 'uppercase', letterSpacing: 0.5 },
  card: { marginBottom: spacing.sm, padding: spacing.md },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  materialTitle: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  materialDesc: { fontSize: 13, color: colors.textSecondary, marginTop: 4, lineHeight: 18 },
  materialMeta: { fontSize: 11, color: colors.textMuted, marginTop: 6 },
  openBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
});
