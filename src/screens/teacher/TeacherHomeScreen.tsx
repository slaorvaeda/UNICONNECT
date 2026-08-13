import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, Modal, ScrollView, Pressable } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer, GlassCard, Avatar, Input } from '../../components';
import { useAuth } from '../../context/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '../../theme';
import { API_BASE_URL } from '../../config';

export function TeacherHomeScreen() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  
  // Selection states
  const [dept, setDept] = useState('');
  const [year, setYear] = useState('3rd');
  const [section, setSection] = useState('A');
  const [rosterLoaded, setRosterLoaded] = useState(false);

  // Selector list visibilities (toggled instantly as absolute view overlays)
  const [showDeptPicker, setShowDeptPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [showSecPicker, setShowSecPicker] = useState(false);
  const [showSubjectPicker, setShowSubjectPicker] = useState(false);

  // Static options
  const yearsList = ['1st', '2nd', '3rd', '4th'];
  const sectionsList = ['A', 'B', 'C', 'D'];
  const semestersList = [
    '1st Semester',
    '2nd Semester',
    '3rd Semester',
    '4th Semester',
    '5th Semester',
    '6th Semester',
    '7th Semester',
    '8th Semester',
  ];

  // Departments & Subjects from database
  const [departments, setDepartments] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loadingDepts, setLoadingDepts] = useState(false);

  // Student roster state
  const [students, setStudents] = useState<any[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  
  // Attendance records state: { [studentId]: "present" | "absent" }
  const [attendanceMap, setAttendanceMap] = useState<{ [key: number]: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [currentDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Grading Modal States
  const [gradeModal, setGradeModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [newGrade, setNewGrade] = useState({
    subject: '',
    semester: '3rd',
    marks: '',
    max_marks: '100',
    grade: 'A',
  });
  const [submittingGrade, setSubmittingGrade] = useState(false);

  // Library Modal States
  const [libraryModal, setLibraryModal] = useState(false);
  const [materials, setMaterials] = useState<any[]>([]);
  const [loadingMaterials, setLoadingMaterials] = useState(false);
  const [submittingMaterial, setSubmittingMaterial] = useState(false);
  const [newMaterial, setNewMaterial] = useState({
    title: '',
    description: '',
    file_url: '',
    subject: '',
    department: '',
    scheme: 'yearly',
    year: '3rd',
    semester: '1st Semester',
  });

  const [showLibDeptPicker, setShowLibDeptPicker] = useState(false);
  const [showLibSubjectPicker, setShowLibSubjectPicker] = useState(false);
  const [showLibYearPicker, setShowLibYearPicker] = useState(false);
  const [showLibSemPicker, setShowLibSemPicker] = useState(false);

  // Fetch Departments
  const fetchDepartments = async () => {
    try {
      setLoadingDepts(true);
      const res = await fetch(`${API_BASE_URL}/api/teacher/departments`);
      if (res.ok) {
        const data = await res.json();
        setDepartments(data);
        if (data.length > 0) {
          setDept(data[0].name);
          setNewMaterial(m => ({ ...m, department: data[0].name }));
        }
      }
    } catch (e) {
      console.error('Error fetching departments:', e);
    } finally {
      setLoadingDepts(false);
    }
  };

  // Fetch Subjects
  const fetchSubjects = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/teacher/subjects`);
      if (res.ok) {
        const data = await res.json();
        setSubjects(data);
        if (data.length > 0) {
          setNewGrade((g) => ({ ...g, subject: data[0].name }));
          setNewMaterial(m => ({ ...m, subject: data[0].name }));
        }
      }
    } catch (e) {
      console.error('Error fetching subjects:', e);
    }
  };

  // Fetch Library materials uploaded by this teacher
  const fetchLibraryMaterials = async () => {
    try {
      setLoadingMaterials(true);
      const res = await fetch(`${API_BASE_URL}/api/teacher/materials?teacher_name=${encodeURIComponent(user?.name || '')}`);
      if (res.ok) {
        const data = await res.json();
        setMaterials(data);
      }
    } catch (e) {
      console.error('Error fetching materials:', e);
    } finally {
      setLoadingMaterials(false);
    }
  };

  // Submit Study Notes material
  const handleCreateMaterial = async () => {
    if (!newMaterial.title || !newMaterial.file_url || !newMaterial.subject || !newMaterial.department) {
      Alert.alert('Validation Error', 'Title, Notes Link, Subject, and Department are required.');
      return;
    }

    try {
      setSubmittingMaterial(true);
      const payload = {
        title: newMaterial.title,
        description: newMaterial.description,
        file_url: newMaterial.file_url,
        subject: newMaterial.subject,
        teacher_name: user?.name || 'Teacher',
        department: newMaterial.department,
        scheme: newMaterial.scheme,
        year: newMaterial.scheme === 'yearly' ? newMaterial.year : null,
        semester: newMaterial.scheme === 'semester' ? newMaterial.semester : null,
      };

      const res = await fetch(`${API_BASE_URL}/api/teacher/materials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        Alert.alert('Success', 'Study notes published to the library!');
        setNewMaterial({
          title: '',
          description: '',
          file_url: '',
          subject: subjects[0]?.name || '',
          department: departments[0]?.name || '',
          scheme: 'yearly',
          year: '3rd',
          semester: '1st Semester',
        });
        fetchLibraryMaterials();
      } else {
        Alert.alert('Error', 'Failed to publish study notes.');
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Network request failed.');
    } finally {
      setSubmittingMaterial(false);
    }
  };

  // Delete notes from repository
  const handleDeleteMaterial = async (id: number) => {
    Alert.alert('Confirm Delete', 'Remove these notes from the central library?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const res = await fetch(`${API_BASE_URL}/api/teacher/materials/${id}`, {
              method: 'DELETE',
            });
            if (res.ok) {
              Alert.alert('Success', 'Study notes removed.');
              fetchLibraryMaterials();
            } else {
              Alert.alert('Error', 'Could not delete study notes.');
            }
          } catch (e) {
            console.error(e);
          }
        },
      },
    ]);
  };

  useEffect(() => {
    fetchDepartments();
    fetchSubjects();
  }, []);

  const fetchStudents = async () => {
    if (!dept || !year || !section) {
      Alert.alert('Required', 'Please fill in Department, Year, and Section.');
      return;
    }

    try {
      setLoadingStudents(true);
      const url = `${API_BASE_URL}/api/teacher/students?department=${encodeURIComponent(dept)}&year=${encodeURIComponent(year)}&section=${encodeURIComponent(section)}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setStudents(data);
        
        // Default everyone to present
        const initialMap: { [key: number]: string } = {};
        data.forEach((s: any) => {
          initialMap[s.id] = 'present';
        });
        setAttendanceMap(initialMap);
        setRosterLoaded(true);
      } else {
        Alert.alert('Error', 'Failed to load student roster.');
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Network request failed.');
    } finally {
      setLoadingStudents(false);
    }
  };

  const toggleAttendance = (id: number) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [id]: prev[id] === 'present' ? 'absent' : 'present',
    }));
  };

  const submitAttendance = async () => {
    try {
      setSubmitting(true);
      const res = await fetch(`${API_BASE_URL}/api/teacher/attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: currentDate,
          records: attendanceMap,
        }),
      });

      if (res.ok) {
        Alert.alert('Success', `Attendance logged successfully for ${dept} (${year} Year, Sec ${section})!`);
      } else {
        Alert.alert('Error', 'Failed to log attendance records.');
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Network request failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const openGradingModal = (student: any) => {
    setSelectedStudent(student);
    setNewGrade({
      subject: subjects[0]?.name || '',
      semester: '3rd Semester',
      marks: '',
      max_marks: '100',
      grade: 'A',
    });
    setGradeModal(true);
  };

  const submitGradeLog = async () => {
    if (!newGrade.subject || !newGrade.semester || !newGrade.marks || !newGrade.max_marks || !newGrade.grade) {
      Alert.alert('Validation Error', 'All grading fields are required.');
      return;
    }

    try {
      setSubmittingGrade(true);
      const res = await fetch(`${API_BASE_URL}/api/teacher/grades`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: selectedStudent.id,
          subject: newGrade.subject,
          semester: newGrade.semester,
          marks: parseInt(newGrade.marks),
          max_marks: parseInt(newGrade.max_marks),
          grade: newGrade.grade,
        }),
      });

      if (res.ok) {
        Alert.alert('Success', `Academic grade logged successfully for ${selectedStudent.name}!`);
        setGradeModal(false);
      } else {
        Alert.alert('Error', 'Failed to save student academic grade.');
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Network request failed.');
    } finally {
      setSubmittingGrade(false);
    }
  };

  const resetRoster = () => {
    setRosterLoaded(false);
    setStudents([]);
    setAttendanceMap({});
  };

  return (
    <ScreenContainer scroll>
      <Animated.View entering={FadeInDown.duration(280).springify().damping(20)}>
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Avatar name={user?.name ?? 'Teacher'} size={56} />
            <View style={styles.headerText}>
              <Text style={styles.greeting}>Welcome,</Text>
              <Text style={styles.name}>{user?.name}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.headerLibraryBtn}
            onPress={() => {
              setLibraryModal(true);
              fetchLibraryMaterials();
              fetchDepartments();
              fetchSubjects();
            }}
          >
            <Ionicons name="library-outline" size={16} color="#FFFFFF" />
            <Text style={styles.headerLibraryText}>Library</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {!rosterLoaded ? (
        <Animated.View entering={FadeInDown.duration(200)}>
          <Text style={styles.sectionTitle}>Select Class & Section</Text>
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
              onPress={fetchStudents}
              disabled={loadingStudents || loadingDepts}
              style={[styles.primaryButton, { marginTop: spacing.md }]}
            >
              {loadingStudents ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="people-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                  <Text style={styles.primaryButtonText}>Load Class Roster</Text>
                </>
              )}
            </TouchableOpacity>
          </GlassCard>
        </Animated.View>
      ) : (
        <Animated.View entering={FadeInDown.duration(200)}>
          <View style={styles.rosterHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionTitle}>Class Roster</Text>
              <Text style={styles.classMeta}>
                {dept} • {year} Year • Sec {section}
              </Text>
            </View>
            <TouchableOpacity onPress={resetRoster} style={styles.changeClassBtn}>
              <Text style={styles.changeClassText}>Change Class</Text>
            </TouchableOpacity>
          </View>

          {students.length === 0 ? (
            <Text style={styles.emptyText}>No students registered in this section.</Text>
          ) : (
            <GlassCard rounded="lg">
              {students.map((s) => {
                const isPresent = attendanceMap[s.id] === 'present';
                return (
                  <View key={s.id} style={styles.row}>
                    <View style={styles.studentInfo}>
                      <Text style={styles.studentName}>{s.name}</Text>
                      <Text style={styles.studentMeta}>USN: {s.student_id}</Text>
                    </View>
                    <View style={styles.actionControls}>
                      <TouchableOpacity
                        style={styles.gradeIconBtn}
                        onPress={() => openGradingModal(s)}
                      >
                        <Ionicons name="ribbon-outline" size={20} color={colors.primary} />
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.statusBadge, isPresent ? styles.badgePresent : styles.badgeAbsent]}
                        onPress={() => toggleAttendance(s.id)}
                      >
                        <Text style={[styles.statusText, isPresent ? styles.textPresent : styles.textAbsent]}>
                          {isPresent ? 'Present' : 'Absent'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </GlassCard>
          )}

          <TouchableOpacity
            style={[styles.primaryButton, { marginTop: spacing.md }]}
            onPress={submitAttendance}
            disabled={submitting || students.length === 0}
          >
            {submitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.primaryButtonText}>Submit Attendance Session</Text>
              </>
            )}
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* -------------------- MODAL: GRADE ASSIGNMENT -------------------- */}
      <Modal visible={gradeModal} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={[styles.modalHeader, { paddingTop: Math.max(insets.top, 12) + 12 }]}>
            <Text style={styles.modalHeaderTitle}>Assign Grades</Text>
            <TouchableOpacity onPress={() => setGradeModal(false)}>
              <Ionicons name="close" size={28} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            {selectedStudent && (
              <GlassCard rounded="md" style={styles.studentProfileCard}>
                <Text style={styles.profileName}>{selectedStudent.name}</Text>
                <Text style={styles.profileMeta}>
                  USN: {selectedStudent.student_id} • Year {selectedStudent.year}
                </Text>
              </GlassCard>
            )}

            {/* Subject Dropdown Selector */}
            <Text style={styles.dropdownLabel}>Subject</Text>
            <TouchableOpacity
              onPress={() => setShowSubjectPicker(true)}
              style={styles.dropdownTrigger}
            >
              <Text style={styles.dropdownValue}>
                {newGrade.subject || 'Select Subject'}
              </Text>
              <Ionicons name="chevron-down" size={18} color={colors.textSecondary} />
            </TouchableOpacity>

            {/* Semester Dropdown Selector */}
            <Text style={styles.dropdownLabel}>Semester</Text>
            <TouchableOpacity
              onPress={() => setShowLibSemPicker(true)} // reuse semestersList
              style={styles.dropdownTrigger}
            >
              <Text style={styles.dropdownValue}>{newGrade.semester}</Text>
              <Ionicons name="chevron-down" size={18} color={colors.textSecondary} />
            </TouchableOpacity>

            <Input
              label="Marks Obtained"
              placeholder="e.g. 85"
              keyboardType="numeric"
              value={newGrade.marks}
              onChangeText={(t) => setNewGrade({ ...newGrade, marks: t })}
            />

            <Input
              label="Maximum Marks"
              placeholder="100"
              keyboardType="numeric"
              value={newGrade.max_marks}
              onChangeText={(t) => setNewGrade({ ...newGrade, max_marks: t })}
            />

            <Input
              label="Final Grade"
              placeholder="A, B+, S, etc."
              autoCapitalize="characters"
              value={newGrade.grade}
              onChangeText={(t) => setNewGrade({ ...newGrade, grade: t })}
            />

            <TouchableOpacity
              onPress={submitGradeLog}
              disabled={submittingGrade}
              style={[styles.primaryButton, { marginTop: spacing.md }]}
            >
              {submittingGrade ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryButtonText}>Submit Academic Grade</Text>
              )}
            </TouchableOpacity>
          </ScrollView>

          {/* -------------------- INSTANT ABSOLUTE PICKERS (Inside Grade Modal) -------------------- */}
          {showSubjectPicker && (
            <Pressable style={styles.absolutePickerOverlay} onPress={() => setShowSubjectPicker(false)}>
              <View style={styles.pickerCard}>
                <Text style={styles.pickerTitle}>Select Subject</Text>
                {subjects.length === 0 ? (
                  <Text style={{ textAlign: 'center', color: colors.textSecondary, margin: 20 }}>
                    No active subjects found.
                  </Text>
                ) : (
                  <ScrollView>
                    {subjects.map((sub) => (
                      <TouchableOpacity
                        key={sub.id}
                        style={styles.pickerItem}
                        onPress={() => {
                          setNewGrade({ ...newGrade, subject: sub.name });
                          setShowSubjectPicker(false);
                        }}
                      >
                        <Text style={styles.pickerItemText}>{sub.name} {sub.code ? `(${sub.code})` : ''}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                )}
              </View>
            </Pressable>
          )}
        </View>
      </Modal>

      {/* -------------------- MODAL: MANAGE STUDY MATERIALS (LIBRARY) -------------------- */}
      <Modal visible={libraryModal} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={[styles.modalHeader, { paddingTop: Math.max(insets.top, 12) + 12 }]}>
            <Text style={styles.modalHeaderTitle}>Notes & Library Manager</Text>
            <TouchableOpacity onPress={() => setLibraryModal(false)}>
              <Ionicons name="close" size={28} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.subFormTitle}>Publish New Material</Text>

            <Input
              label="Notes Title"
              placeholder="e.g. Relational Algebra Guide"
              value={newMaterial.title}
              onChangeText={(t) => setNewMaterial({ ...newMaterial, title: t })}
            />

            <Input
              label="Notes Link / PDF URL"
              placeholder="e.g. https://drive.google.com/..."
              value={newMaterial.file_url}
              onChangeText={(t) => setNewMaterial({ ...newMaterial, file_url: t })}
              autoCapitalize="none"
            />

            <Input
              label="Brief Description (Optional)"
              placeholder="Introductory concepts..."
              value={newMaterial.description}
              onChangeText={(t) => setNewMaterial({ ...newMaterial, description: t })}
            />

            {/* Department Dropdown Selector */}
            <Text style={styles.dropdownLabel}>Department</Text>
            <TouchableOpacity
              onPress={() => setShowLibDeptPicker(true)}
              style={styles.dropdownTrigger}
            >
              <Text style={styles.dropdownValue}>
                {newMaterial.department || 'Select Department'}
              </Text>
              <Ionicons name="chevron-down" size={18} color={colors.textSecondary} />
            </TouchableOpacity>

            {/* Subject Dropdown Selector */}
            <Text style={styles.dropdownLabel}>Subject</Text>
            <TouchableOpacity
              onPress={() => setShowLibSubjectPicker(true)}
              style={styles.dropdownTrigger}
            >
              <Text style={styles.dropdownValue}>
                {newMaterial.subject || 'Select Subject'}
              </Text>
              <Ionicons name="chevron-down" size={18} color={colors.textSecondary} />
            </TouchableOpacity>

            {/* Academic Scheme Selector */}
            <Text style={styles.dropdownLabel}>Academic Scheme</Text>
            <View style={styles.schemeTabsContainer}>
              <TouchableOpacity
                style={[
                  styles.schemeTab,
                  newMaterial.scheme === 'yearly' && styles.schemeTabActive,
                ]}
                onPress={() => setNewMaterial({ ...newMaterial, scheme: 'yearly', year: '3rd', semester: null })}
              >
                <Text
                  style={[
                    styles.schemeTabText,
                    newMaterial.scheme === 'yearly' && styles.schemeTabTextActive,
                  ]}
                >
                  Yearly-based
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.schemeTab,
                  newMaterial.scheme === 'semester' && styles.schemeTabActive,
                ]}
                onPress={() => setNewMaterial({ ...newMaterial, scheme: 'semester', semester: '1st Semester', year: null })}
              >
                <Text
                  style={[
                    styles.schemeTabText,
                    newMaterial.scheme === 'semester' && styles.schemeTabTextActive,
                  ]}
                >
                  Semester-based
                </Text>
              </TouchableOpacity>
            </View>

            {/* Conditionally display Year or Semester */}
            {newMaterial.scheme === 'yearly' ? (
              <>
                <Text style={styles.dropdownLabel}>Year</Text>
                <TouchableOpacity
                  onPress={() => setShowLibYearPicker(true)}
                  style={styles.dropdownTrigger}
                >
                  <Text style={styles.dropdownValue}>{newMaterial.year} Year</Text>
                  <Ionicons name="chevron-down" size={18} color={colors.textSecondary} />
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.dropdownLabel}>Semester</Text>
                <TouchableOpacity
                  onPress={() => setShowLibSemPicker(true)}
                  style={styles.dropdownTrigger}
                >
                  <Text style={styles.dropdownValue}>{newMaterial.semester}</Text>
                  <Ionicons name="chevron-down" size={18} color={colors.textSecondary} />
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity
              onPress={handleCreateMaterial}
              disabled={submittingMaterial}
              style={[styles.primaryButton, { marginTop: spacing.md, marginBottom: spacing.xl }]}
            >
              {submittingMaterial ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryButtonText}>Publish Study Material</Text>
              )}
            </TouchableOpacity>

            <Text style={styles.subFormTitle}>My Active Uploads ({materials.length})</Text>
            {loadingMaterials ? (
              <ActivityIndicator color={colors.primary} />
            ) : materials.length === 0 ? (
              <Text style={styles.emptyText}>No materials uploaded by you.</Text>
            ) : (
              materials.map((item) => (
                <View key={item.id} style={styles.studentItem}>
                  <View style={styles.studentDetails}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.studentName}>{item.title}</Text>
                      <Text style={styles.studentMeta}>
                        Subject: {item.subject} • Department: {item.department}
                      </Text>
                      <Text style={styles.studentMeta}>
                        Target: {item.semester ? item.semester : `${item.year} Year`}
                      </Text>
                    </View>
                    <TouchableOpacity onPress={() => handleDeleteMaterial(item.id)} style={styles.deleteBtn}>
                      <Ionicons name="trash-outline" size={20} color={colors.error} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
            <View style={{ height: 80 }} />
          </ScrollView>

          {/* -------------------- INSTANT ABSOLUTE PICKERS (Inside Library Modal) -------------------- */}
          {showLibDeptPicker && (
            <Pressable style={styles.absolutePickerOverlay} onPress={() => setShowLibDeptPicker(false)}>
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
                          setNewMaterial({ ...newMaterial, department: d.name });
                          setShowLibDeptPicker(false);
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

          {showLibSubjectPicker && (
            <Pressable style={styles.absolutePickerOverlay} onPress={() => setShowLibSubjectPicker(false)}>
              <View style={styles.pickerCard}>
                <Text style={styles.pickerTitle}>Select Subject</Text>
                {subjects.length === 0 ? (
                  <Text style={{ textAlign: 'center', color: colors.textSecondary, margin: 20 }}>
                    No active subjects found.
                  </Text>
                ) : (
                  <ScrollView>
                    {subjects.map((sub) => (
                      <TouchableOpacity
                        key={sub.id}
                        style={styles.pickerItem}
                        onPress={() => {
                          setNewMaterial({ ...newMaterial, subject: sub.name });
                          setShowLibSubjectPicker(false);
                        }}
                      >
                        <Text style={styles.pickerItemText}>{sub.name} {sub.code ? `(${sub.code})` : ''}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                )}
              </View>
            </Pressable>
          )}

          {showLibYearPicker && (
            <Pressable style={styles.absolutePickerOverlay} onPress={() => setShowLibYearPicker(false)}>
              <View style={styles.pickerCard}>
                <Text style={styles.pickerTitle}>Select Year</Text>
                <ScrollView>
                  {yearsList.map((y) => (
                    <TouchableOpacity
                      key={y}
                      style={styles.pickerItem}
                      onPress={() => {
                        setNewMaterial({ ...newMaterial, year: y });
                        setShowLibYearPicker(false);
                      }}
                    >
                      <Text style={styles.pickerItemText}>{y} Year</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </Pressable>
          )}

          {showLibSemPicker && (
            <Pressable style={styles.absolutePickerOverlay} onPress={() => setShowLibSemPicker(false)}>
              <View style={styles.pickerCard}>
                <Text style={styles.pickerTitle}>Select Semester</Text>
                <ScrollView>
                  {semestersList.map((sem) => (
                    <TouchableOpacity
                      key={sem}
                      style={styles.pickerItem}
                      onPress={() => {
                        setNewMaterial({ ...newMaterial, semester: sem });
                        setShowLibSemPicker(false);
                      }}
                    >
                      <Text style={styles.pickerItemText}>{sem}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </Pressable>
          )}
        </View>
      </Modal>

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
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.xl },
  headerText: { marginLeft: spacing.md },
  greeting: { color: colors.textSecondary, fontSize: 14 },
  name: { color: colors.textPrimary, fontSize: 22, fontWeight: '700' },
  headerLibraryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000000',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  headerLibraryText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6,
  },
  sectionTitle: { color: colors.textSecondary, fontSize: 14, fontWeight: '600', marginBottom: spacing.sm },
  rosterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  classMeta: { color: colors.textPrimary, fontSize: 16, fontWeight: '700', marginTop: -2 },
  changeClassBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  changeClassText: { color: colors.textSecondary, fontSize: 12, fontWeight: '600' },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  studentInfo: { flex: 1, marginRight: spacing.xs },
  studentName: { color: colors.textPrimary, fontSize: 15, fontWeight: '600' },
  studentMeta: { color: colors.textSecondary, fontSize: 12, marginTop: 2 },
  actionControls: { flexDirection: 'row', alignItems: 'center' },
  gradeIconBtn: {
    padding: 8,
    marginRight: spacing.xs,
    borderRadius: 8,
    backgroundColor: '#FAF9F7',
    borderWidth: 1,
    borderColor: '#EBEBEB',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 75,
  },
  badgePresent: { backgroundColor: '#DCFCE7' },
  badgeAbsent: { backgroundColor: '#FEE2E2' },
  statusText: { fontSize: 13, fontWeight: '700' },
  textPresent: { color: '#166534' },
  textAbsent: { color: '#991B1B' },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginVertical: spacing.lg,
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

  // Modal styles
  modalContainer: { flex: 1, backgroundColor: '#FAF9F7' },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB',
  },
  modalHeaderTitle: { fontSize: 20, fontWeight: '700', color: colors.textPrimary },
  modalContent: { flex: 1, padding: spacing.lg },
  studentProfileCard: { padding: spacing.md, marginBottom: spacing.md },
  profileName: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  profileMeta: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },

  // Dropdown Selectors
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

  // Instant Absolute Picker sibling container overlay
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

  // Study Materials Custom Styles
  subFormTitle: { fontSize: 16, fontWeight: '600', color: colors.textSecondary, marginBottom: spacing.sm },
  studentItem: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB',
  },
  studentDetails: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  deleteBtn: { padding: 8 },
  schemeTabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#EEEEEE',
    borderRadius: 8,
    padding: 4,
    marginBottom: spacing.sm,
  },
  schemeTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  schemeTabActive: {
    backgroundColor: '#FFFFFF',
    ...colors.shadow,
  },
  schemeTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  schemeTabTextActive: {
    color: colors.textPrimary,
  },
});
