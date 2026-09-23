import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Modal,
  ScrollView,
  TouchableOpacity,
  Alert,
  Pressable,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenContainer, GlassCard, Avatar, Input } from '../../components';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing } from '../../theme';
import { API_BASE_URL } from '../../config';

export function AdminHomeScreen() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const [stats, setStats] = useState({
    student_count: 0,
    teacher_count: 0,
    pending_grievances_count: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  // Modal visibilities
  const [studentsModal, setStudentsModal] = useState(false);
  const [teachersModal, setTeachersModal] = useState(false);
  const [noticeModal, setNoticeModal] = useState(false);
  const [eventModal, setEventModal] = useState(false);
  const [grievancesModal, setGrievancesModal] = useState(false);
  const [feesModal, setFeesModal] = useState(false);
  const [deptsModal, setDeptsModal] = useState(false);
  const [timetableModal, setTimetableModal] = useState(false);
  const [subjectsModal, setSubjectsModal] = useState(false);

  // Picker visibilities (toggled instantly as absolute view overlays)
  const [showStudentDeptPicker, setShowStudentDeptPicker] = useState(false);
  const [showStudentYearPicker, setShowStudentYearPicker] = useState(false);
  const [showStudentSecPicker, setShowStudentSecPicker] = useState(false);
  const [showTeacherDeptPicker, setShowTeacherDeptPicker] = useState(false);
  const [showTimetableDeptPicker, setShowTimetableDeptPicker] = useState(false);
  const [showTimetableYearPicker, setShowTimetableYearPicker] = useState(false);
  const [showTimetableSecPicker, setShowTimetableSecPicker] = useState(false);
  const [showTimetableDayPicker, setShowTimetableDayPicker] = useState(false);
  const [showTimetableSubjectPicker, setShowTimetableSubjectPicker] = useState(false);
  const [showTimetableSemPicker, setShowTimetableSemPicker] = useState(false);
  const [showTimetableTeacherPicker, setShowTimetableTeacherPicker] = useState(false);

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

  // Department state
  const [departments, setDepartments] = useState<any[]>([]);
  const [newDept, setNewDept] = useState({ name: '', code: '' });
  const [submittingDept, setSubmittingDept] = useState(false);
  const [loadingDepts, setLoadingDepts] = useState(false);

  // Subject state
  const [subjects, setSubjects] = useState<any[]>([]);
  const [newSubject, setNewSubject] = useState({ name: '', code: '' });
  const [submittingSubject, setSubmittingSubject] = useState(false);
  const [loadingSubjects, setLoadingSubjects] = useState(false);

  // Student management state
  const [studentsList, setStudentsList] = useState<any[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    student_id: '',
    department: '',
    year: '3rd',
    section: 'A',
    dob: '',
    phone: '',
    gender: '',
    blood_group: '',
    address: '',
  });
  const [submittingStudent, setSubmittingStudent] = useState(false);

  // Teacher management state
  const [teachersList, setTeachersList] = useState<any[]>([]);
  const [loadingTeachers, setLoadingTeachers] = useState(false);
  const [newTeacher, setNewTeacher] = useState({
    name: '',
    email: '',
    department: '',
    employee_id: '',
    designation: '',
    dob: '',
    phone: '',
    gender: '',
    blood_group: '',
    address: '',
  });
  const [submittingTeacher, setSubmittingTeacher] = useState(false);

  // Notice state
  const [noticesList, setNoticesList] = useState<any[]>([]);
  const [loadingNotices, setLoadingNotices] = useState(false);
  const [newNotice, setNewNotice] = useState({
    title: '',
    body: '',
    category: 'Academics',
  });
  const [submittingNotice, setSubmittingNotice] = useState(false);

  // Event state
  const [eventsList, setEventsList] = useState<any[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    venue: '',
    type: 'event',
    date: new Date().toISOString().split('T')[0],
  });
  const [submittingEvent, setSubmittingEvent] = useState(false);

  // Grievance resolution state
  const [grievancesList, setGrievancesList] = useState<any[]>([]);
  const [loadingGrievances, setLoadingGrievances] = useState(false);
  const [grievanceResponses, setGrievanceResponses] = useState<{[key: number]: string}>({});
  const [resolvingGrievanceId, setResolvingGrievanceId] = useState<number | null>(null);

  // Fees management state
  const [feesList, setFeesList] = useState<any[]>([]);
  const [loadingFees, setLoadingFees] = useState(false);
  const [newFee, setNewFee] = useState({
    student_email: '',
    amount: '',
    due_date: new Date().toISOString().split('T')[0],
  });
  const [submittingFee, setSubmittingFee] = useState(false);

  // Timetable state
  const [slotsList, setSlotsList] = useState<any[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submittingSlot, setSubmittingSlot] = useState(false);
  const [newSlot, setNewSlot] = useState({
    department: '',
    year: '3rd',
    section: 'A',
    day: 'Monday',
    subject: '',
    time_slot: '09:00 AM - 10:00 AM',
    room: '',
    scheme: 'yearly',
    semester: '1st Semester',
    teacher_name: '',
  });

  // Fetch Admin Stats
  const fetchStats = async () => {
    try {
      setLoadingStats(true);
      const res = await fetch(`${API_BASE_URL}/api/admin/stats`);
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.error('Stats fetch error:', e);
    } finally {
      setLoadingStats(false);
    }
  };

  // Fetch Departments
  const fetchDepartments = async () => {
    try {
      setLoadingDepts(true);
      const res = await fetch(`${API_BASE_URL}/api/admin/departments`);
      if (res.ok) {
        const data = await res.json();
        setDepartments(data);
        if (data.length > 0) {
          if (!newStudent.department) {
            setNewStudent(s => ({ ...s, department: data[0].name }));
          }
          if (!newTeacher.department) {
            setNewTeacher(t => ({ ...t, department: data[0].name }));
          }
          if (!newSlot.department) {
            setNewSlot(sl => ({ ...sl, department: data[0].name }));
          }
        }
      }
    } catch (e) {
      console.error('Depts fetch error:', e);
    } finally {
      setLoadingDepts(false);
    }
  };

  // Fetch Subjects
  const fetchSubjects = async () => {
    try {
      setLoadingSubjects(true);
      const res = await fetch(`${API_BASE_URL}/api/admin/subjects`);
      if (res.ok) {
        const data = await res.json();
        setSubjects(data);
        if (data.length > 0) {
          if (!newSlot.subject) {
            setNewSlot(sl => ({ ...sl, subject: data[0].name }));
          }
        }
      }
    } catch (e) {
      console.error('Subjects fetch error:', e);
    } finally {
      setLoadingSubjects(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchDepartments();
    fetchSubjects();
  }, []);

  // Fetch Student accounts
  const fetchStudents = async () => {
    try {
      setLoadingStudents(true);
      const res = await fetch(`${API_BASE_URL}/api/admin/students`);
      if (res.ok) {
        const data = await res.json();
        setStudentsList(data);
      }
    } catch (e) {
      console.error('Students fetch error:', e);
    } finally {
      setLoadingStudents(false);
    }
  };

  // Fetch Teacher accounts
  const fetchTeachers = async () => {
    try {
      setLoadingTeachers(true);
      const res = await fetch(`${API_BASE_URL}/api/admin/teachers`);
      if (res.ok) {
        const data = await res.json();
        setTeachersList(data);
      }
    } catch (e) {
      console.error('Teachers fetch error:', e);
    } finally {
      setLoadingTeachers(false);
    }
  };

  // Fetch Notice announcements
  const fetchNotices = async () => {
    try {
      setLoadingNotices(true);
      const res = await fetch(`${API_BASE_URL}/api/student/notices`);
      if (res.ok) {
        const data = await res.json();
        setNoticesList(data);
      }
    } catch (e) {
      console.error('Notices fetch error:', e);
    } finally {
      setLoadingNotices(false);
    }
  };

  // Fetch Campus events
  const fetchEvents = async () => {
    try {
      setLoadingEvents(true);
      const res = await fetch(`${API_BASE_URL}/api/student/events`);
      if (res.ok) {
        const data = await res.json();
        setEventsList(data);
      }
    } catch (e) {
      console.error('Events fetch error:', e);
    } finally {
      setLoadingEvents(false);
    }
  };

  // Fetch Grievances
  const fetchGrievances = async () => {
    try {
      setLoadingGrievances(true);
      const res = await fetch(`${API_BASE_URL}/api/admin/grievances`);
      if (res.ok) {
        const data = await res.json();
        setGrievancesList(data);
      }
    } catch (e) {
      console.error('Grievances fetch error:', e);
    } finally {
      setLoadingGrievances(false);
    }
  };

  // Fetch Fees Directory
  const fetchFeesAdmin = async () => {
    try {
      setLoadingFees(true);
      const res = await fetch(`${API_BASE_URL}/api/admin/fees`);
      if (res.ok) {
        const data = await res.json();
        setFeesList(data);
      }
    } catch (e) {
      console.error('Fees fetch error:', e);
    } finally {
      setLoadingFees(false);
    }
  };

  // Fetch Timetable slots
  const fetchTimetableSlots = async () => {
    try {
      setLoadingSlots(true);
      const res = await fetch(`${API_BASE_URL}/api/admin/timetable`);
      if (res.ok) {
        const data = await res.json();
        setSlotsList(data);
      }
    } catch (e) {
      console.error('Timetable fetch error:', e);
    } finally {
      setLoadingSlots(false);
    }
  };

  // Submit Department
  const handleCreateDepartment = async () => {
    if (!newDept.name) {
      Alert.alert('Validation Error', 'Department name is required.');
      return;
    }

    try {
      setSubmittingDept(true);
      const res = await fetch(`${API_BASE_URL}/api/admin/departments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDept),
      });

      if (res.ok) {
        Alert.alert('Success', 'Department registered successfully!');
        setNewDept({ name: '', code: '' });
        fetchDepartments();
      } else {
        const err = await res.json();
        Alert.alert('Error', err.detail || 'Could not add department.');
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Network request failed.');
    } finally {
      setSubmittingDept(false);
    }
  };

  // Submit Subject
  const handleCreateSubject = async () => {
    if (!newSubject.name) {
      Alert.alert('Validation Error', 'Subject name is required.');
      return;
    }

    try {
      setSubmittingSubject(true);
      const res = await fetch(`${API_BASE_URL}/api/admin/subjects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSubject),
      });

      if (res.ok) {
        Alert.alert('Success', 'Subject registered successfully!');
        setNewSubject({ name: '', code: '' });
        fetchSubjects();
      } else {
        const err = await res.json();
        Alert.alert('Error', err.detail || 'Could not add subject.');
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Network request failed.');
    } finally {
      setSubmittingSubject(false);
    }
  };

  // Submit Student
  const handleCreateStudent = async () => {
    if (!newStudent.name || !newStudent.email || !newStudent.student_id || !newStudent.department) {
      Alert.alert('Validation Error', 'Name, email, student ID, and department are required.');
      return;
    }

    try {
      setSubmittingStudent(true);
      const res = await fetch(`${API_BASE_URL}/api/admin/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudent),
      });

      if (res.ok) {
        Alert.alert('Success', 'Student account added successfully!');
        setNewStudent({
          name: '',
          email: '',
          student_id: '',
          department: departments[0]?.name || '',
          year: '3rd',
          section: 'A',
          dob: '',
          phone: '',
          gender: '',
          blood_group: '',
          address: '',
        });
        fetchStudents();
        fetchStats();
      } else {
        const err = await res.json();
        Alert.alert('Error', err.detail || 'Could not add student.');
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Network request failed.');
    } finally {
      setSubmittingStudent(false);
    }
  };

  // Submit Teacher
  const handleCreateTeacher = async () => {
    if (!newTeacher.name || !newTeacher.email || !newTeacher.department || !newTeacher.employee_id) {
      Alert.alert('Validation Error', 'Name, email, department, and Employee ID are required.');
      return;
    }

    try {
      setSubmittingTeacher(true);
      const res = await fetch(`${API_BASE_URL}/api/admin/teachers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTeacher),
      });

      if (res.ok) {
        Alert.alert('Success', 'Teacher account added successfully!');
        setNewTeacher({
          name: '',
          email: '',
          department: departments[0]?.name || '',
          employee_id: '',
          designation: '',
          dob: '',
          phone: '',
          gender: '',
          blood_group: '',
          address: '',
        });
        fetchTeachers();
        fetchStats();
      } else {
        const err = await res.json();
        Alert.alert('Error', err.detail || 'Could not add teacher.');
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Network request failed.');
    } finally {
      setSubmittingTeacher(false);
    }
  };

  // Submit Notice
  const handlePublishNotice = async () => {
    if (!newNotice.title || !newNotice.body) {
      Alert.alert('Validation Error', 'Title and Notice Body are required.');
      return;
    }

    try {
      setSubmittingNotice(true);
      const today = new Date().toISOString().split('T')[0];
      const res = await fetch(`${API_BASE_URL}/api/admin/notices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newNotice,
          date: today,
        }),
      });

      if (res.ok) {
        Alert.alert('Success', 'Notice announcement published!');
        setNewNotice({ title: '', body: '', category: 'Academics' });
        fetchNotices();
      } else {
        Alert.alert('Error', 'Failed to publish notice.');
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Network request failed.');
    } finally {
      setSubmittingNotice(false);
    }
  };

  // Submit Event
  const handleCreateEvent = async () => {
    if (!newEvent.title || !newEvent.description || !newEvent.venue) {
      Alert.alert('Validation Error', 'Title, description, and venue are required.');
      return;
    }

    try {
      setSubmittingEvent(true);
      const res = await fetch(`${API_BASE_URL}/api/admin/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent),
      });

      if (res.ok) {
        Alert.alert('Success', 'Campus event created successfully!');
        setNewEvent({
          title: '',
          description: '',
          venue: '',
          type: 'event',
          date: new Date().toISOString().split('T')[0],
        });
        fetchEvents();
      } else {
        Alert.alert('Error', 'Failed to create event.');
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Network request failed.');
    } finally {
      setSubmittingEvent(false);
    }
  };

  // Submit Fee Assignment
  const handleCreateFee = async () => {
    if (!newFee.student_email || !newFee.amount || !newFee.due_date) {
      Alert.alert('Validation Error', 'Student Email, Amount, and Due Date are required.');
      return;
    }

    const amt = parseFloat(newFee.amount);
    if (isNaN(amt) || amt <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid positive number for amount.');
      return;
    }

    try {
      setSubmittingFee(true);
      const res = await fetch(`${API_BASE_URL}/api/admin/fees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_email: newFee.student_email,
          amount: amt,
          due_date: newFee.due_date,
        }),
      });

      if (res.ok) {
        Alert.alert('Success', 'Fee record assigned successfully!');
        setNewFee({
          student_email: '',
          amount: '',
          due_date: new Date().toISOString().split('T')[0],
        });
        fetchFeesAdmin();
      } else {
        const err = await res.json();
        Alert.alert('Error', err.detail || 'Could not assign fee.');
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Network request failed.');
    } finally {
      setSubmittingFee(false);
    }
  };

  // Submit Timetable slot
  const handleCreateTimetableSlot = async () => {
    if (!newSlot.department || (newSlot.scheme === 'yearly' ? !newSlot.year : !newSlot.semester) || !newSlot.section || !newSlot.day || !newSlot.subject || !newSlot.time_slot) {
      Alert.alert('Validation Error', 'All fields except Room are required.');
      return;
    }

    try {
      setSubmittingSlot(true);
      const res = await fetch(`${API_BASE_URL}/api/admin/timetable`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSlot),
      });

      if (res.ok) {
        Alert.alert('Success', 'Timetable slot published successfully!');
        setNewSlot({
          department: departments[0]?.name || '',
          year: '3rd',
          section: 'A',
          day: 'Monday',
          subject: subjects[0]?.name || '',
          time_slot: '09:00 AM - 10:00 AM',
          room: '',
          scheme: 'yearly',
          semester: '1st Semester',
          teacher_name: teachersList[0]?.name || '',
        });
        fetchTimetableSlots();
      } else {
        Alert.alert('Error', 'Failed to publish timetable slot.');
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Network request failed.');
    } finally {
      setSubmittingSlot(false);
    }
  };

  // Submit Grievance Resolution response
  const handleResolveGrievance = async (id: number) => {
    const text = grievanceResponses[id] || '';
    if (!text.trim()) {
      Alert.alert('Validation Error', 'Please enter a resolution response.');
      return;
    }

    try {
      setResolvingGrievanceId(id);
      const res = await fetch(`${API_BASE_URL}/api/admin/grievances/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'resolved',
          response: text,
        }),
      });

      if (res.ok) {
        Alert.alert('Success', 'Grievance ticket resolved!');
        setGrievanceResponses({ ...grievanceResponses, [id]: '' });
        fetchGrievances();
        fetchStats();
      } else {
        Alert.alert('Error', 'Could not update grievance.');
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Network request failed.');
    } finally {
      setResolvingGrievanceId(null);
    }
  };

  // Delete student
  const handleDeleteStudent = async (id: number) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to remove this student account?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const res = await fetch(`${API_BASE_URL}/api/admin/students/${id}`, {
              method: 'DELETE',
            });
            if (res.ok) {
              Alert.alert('Deleted', 'Student user removed successfully.');
              fetchStudents();
              fetchStats();
            } else {
              Alert.alert('Error', 'Could not delete student.');
            }
          } catch (e) {
            console.error(e);
          }
        },
      },
    ]);
  };

  // Delete teacher
  const handleDeleteTeacher = async (id: number) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to remove this teacher account?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const res = await fetch(`${API_BASE_URL}/api/admin/teachers/${id}`, {
              method: 'DELETE',
            });
            if (res.ok) {
              Alert.alert('Deleted', 'Teacher user removed successfully.');
              fetchTeachers();
              fetchStats();
            } else {
              Alert.alert('Error', 'Could not delete teacher.');
            }
          } catch (e) {
            console.error(e);
          }
        },
      },
    ]);
  };

  // Delete notice
  const handleDeleteNotice = async (id: number) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to remove this notice?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const res = await fetch(`${API_BASE_URL}/api/admin/notices/${id}`, {
              method: 'DELETE',
            });
            if (res.ok) {
              Alert.alert('Deleted', 'Notice announcement removed.');
              fetchNotices();
            } else {
              Alert.alert('Error', 'Could not delete notice.');
            }
          } catch (e) {
            console.error(e);
          }
        },
      },
    ]);
  };

  // Delete event
  const handleDeleteEvent = async (id: number) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to remove this event?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const res = await fetch(`${API_BASE_URL}/api/admin/events/${id}`, {
              method: 'DELETE',
            });
            if (res.ok) {
              Alert.alert('Deleted', 'Campus event removed.');
              fetchEvents();
            } else {
              Alert.alert('Error', 'Could not delete event.');
            }
          } catch (e) {
            console.error(e);
          }
        },
      },
    ]);
  };

  // Delete fee record
  const handleDeleteFee = async (id: number) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this fee assignment?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const res = await fetch(`${API_BASE_URL}/api/admin/fees/${id}`, {
              method: 'DELETE',
            });
            if (res.ok) {
              Alert.alert('Deleted', 'Fee record deleted successfully.');
              fetchFeesAdmin();
            } else {
              Alert.alert('Error', 'Could not delete fee record.');
            }
          } catch (e) {
            console.error(e);
          }
        },
      },
    ]);
  };

  // Delete department
  const handleDeleteDept = async (id: number) => {
    Alert.alert('Confirm Delete', 'Deleting this department will remove it from select lists. Continue?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const res = await fetch(`${API_BASE_URL}/api/admin/departments/${id}`, {
              method: 'DELETE',
            });
            if (res.ok) {
              Alert.alert('Deleted', 'Department removed.');
              fetchDepartments();
            } else {
              Alert.alert('Error', 'Could not delete department.');
            }
          } catch (e) {
            console.error(e);
          }
        },
      },
    ]);
  };

  // Delete subject
  const handleDeleteSubject = async (id: number) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to remove this subject from active listings?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const res = await fetch(`${API_BASE_URL}/api/admin/subjects/${id}`, {
              method: 'DELETE',
            });
            if (res.ok) {
              Alert.alert('Deleted', 'Subject removed successfully.');
              fetchSubjects();
            } else {
              Alert.alert('Error', 'Could not delete subject.');
            }
          } catch (e) {
            console.error(e);
          }
        },
      },
    ]);
  };

  // Delete timetable slot
  const handleDeleteTimetableSlot = async (id: number) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this timetable slot?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const res = await fetch(`${API_BASE_URL}/api/admin/timetable/${id}`, {
              method: 'DELETE',
            });
            if (res.ok) {
              Alert.alert('Deleted', 'Timetable slot removed successfully.');
              fetchTimetableSlots();
            } else {
              Alert.alert('Error', 'Could not delete slot.');
            }
          } catch (e) {
            console.error(e);
          }
        },
      },
    ]);
  };

  return (
    <ScreenContainer scroll>
      <Animated.View entering={FadeInDown.duration(280).springify().damping(20)}>
        <View style={styles.header}>
          <Avatar name={user?.name ?? 'Admin'} size={56} />
          <View style={styles.headerText}>
            <Text style={styles.greeting}>Admin,</Text>
            <Text style={styles.name}>{user?.name}</Text>
          </View>
        </View>
      </Animated.View>

      {loadingStats ? (
        <View style={{ paddingVertical: 20, alignItems: 'center' }}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : (
        <View style={styles.statsRow}>
          <GlassCard rounded="lg" style={styles.statCard}>
            <Text style={styles.statValue}>{stats.student_count}</Text>
            <Text style={styles.statLabel}>Students</Text>
          </GlassCard>
          <GlassCard rounded="lg" style={styles.statCard}>
            <Text style={styles.statValue}>{stats.teacher_count}</Text>
            <Text style={styles.statLabel}>Teachers</Text>
          </GlassCard>
          <GlassCard rounded="lg" style={styles.statCard}>
            <Text style={styles.statValue}>{stats.pending_grievances_count}</Text>
            <Text style={styles.statLabel}>Grievances</Text>
          </GlassCard>
        </View>
      )}

      <Text style={styles.sectionTitle}>Quick actions</Text>
      
      <GlassCard
        rounded="lg"
        style={styles.card}
        onPress={() => {
          setStudentsModal(true);
          fetchStudents();
          fetchDepartments();
        }}
      >
        <View style={styles.cardContent}>
          <Ionicons name="people" size={20} color={colors.primary} />
          <Text style={styles.cardTitle}>Manage students</Text>
        </View>
      </GlassCard>

      <GlassCard
        rounded="lg"
        style={styles.card}
        onPress={() => {
          setTeachersModal(true);
          fetchTeachers();
          fetchDepartments();
        }}
      >
        <View style={styles.cardContent}>
          <Ionicons name="school" size={20} color={colors.primary} />
          <Text style={styles.cardTitle}>Manage teachers</Text>
        </View>
      </GlassCard>

      <GlassCard
        rounded="lg"
        style={styles.card}
        onPress={() => {
          setDeptsModal(true);
          fetchDepartments();
        }}
      >
        <View style={styles.cardContent}>
          <Ionicons name="business" size={20} color={colors.primary} />
          <Text style={styles.cardTitle}>Manage departments</Text>
        </View>
      </GlassCard>

      <GlassCard
        rounded="lg"
        style={styles.card}
        onPress={() => {
          setSubjectsModal(true);
          fetchSubjects();
        }}
      >
        <View style={styles.cardContent}>
          <Ionicons name="book" size={20} color={colors.primary} />
          <Text style={styles.cardTitle}>Manage subjects</Text>
        </View>
      </GlassCard>

      <GlassCard
        rounded="lg"
        style={styles.card}
        onPress={() => {
          setNoticeModal(true);
          fetchNotices();
        }}
      >
        <View style={styles.cardContent}>
          <Ionicons name="megaphone" size={20} color={colors.primary} />
          <Text style={styles.cardTitle}>Publish notice</Text>
        </View>
      </GlassCard>

      <GlassCard
        rounded="lg"
        style={styles.card}
        onPress={() => {
          setEventModal(true);
          fetchEvents();
        }}
      >
        <View style={styles.cardContent}>
          <Ionicons name="calendar" size={20} color={colors.primary} />
          <Text style={styles.cardTitle}>Manage events</Text>
        </View>
      </GlassCard>

      <GlassCard
        rounded="lg"
        style={styles.card}
        onPress={() => {
          setFeesModal(true);
          fetchFeesAdmin();
        }}
      >
        <View style={styles.cardContent}>
          <Ionicons name="card" size={20} color={colors.primary} />
          <Text style={styles.cardTitle}>Manage fees</Text>
        </View>
      </GlassCard>

      <GlassCard
        rounded="lg"
        style={styles.card}
        onPress={() => {
          setTimetableModal(true);
          fetchTimetableSlots();
          fetchDepartments();
          fetchSubjects();
          fetchTeachers();
        }}
      >
        <View style={styles.cardContent}>
          <Ionicons name="time" size={20} color={colors.primary} />
          <Text style={styles.cardTitle}>Manage timetable</Text>
        </View>
      </GlassCard>

      <GlassCard
        rounded="lg"
        style={styles.card}
        onPress={() => {
          setGrievancesModal(true);
          fetchGrievances();
        }}
      >
        <View style={styles.cardContent}>
          <Ionicons name="chatbubbles" size={20} color={colors.primary} />
          <Text style={styles.cardTitle}>Resolve grievances</Text>
        </View>
      </GlassCard>

      {/* -------------------- MODAL: MANAGE DEPARTMENTS -------------------- */}
      <Modal visible={deptsModal} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={[styles.modalHeader, { paddingTop: Math.max(insets.top, 12) + 12 }]}>
            <Text style={styles.modalHeaderTitle}>Departments Manager</Text>
            <TouchableOpacity onPress={() => setDeptsModal(false)}>
              <Ionicons name="close" size={28} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.subFormTitle}>Add New Department</Text>
            <Input
              label="Department Name"
              placeholder="Computer Science"
              value={newDept.name}
              onChangeText={(t) => setNewDept({ ...newDept, name: t })}
            />
            <Input
              label="Department Code"
              placeholder="CSE"
              value={newDept.code}
              onChangeText={(t) => setNewDept({ ...newDept, code: t })}
              autoCapitalize="characters"
            />

            <TouchableOpacity
              onPress={handleCreateDepartment}
              disabled={submittingDept}
              style={[styles.primaryButton, { marginTop: spacing.sm, marginBottom: spacing.xl }]}
            >
              {submittingDept ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryButtonText}>Register Department</Text>
              )}
            </TouchableOpacity>

            <Text style={styles.subFormTitle}>Active Departments ({departments.length})</Text>
            {loadingDepts ? (
              <ActivityIndicator color={colors.primary} />
            ) : departments.length === 0 ? (
              <Text style={styles.emptyText}>No departments configured.</Text>
            ) : (
              departments.map((item) => (
                <View key={item.id} style={styles.studentItem}>
                  <View style={styles.studentDetails}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.studentName}>{item.name}</Text>
                      {item.code && <Text style={styles.studentMeta}>Code: {item.code}</Text>}
                    </View>
                    <TouchableOpacity onPress={() => handleDeleteDept(item.id)} style={styles.deleteBtn}>
                      <Ionicons name="trash-outline" size={20} color={colors.error} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
            <View style={{ height: 80 }} />
          </ScrollView>
        </View>
      </Modal>

      {/* -------------------- MODAL: MANAGE SUBJECTS -------------------- */}
      <Modal visible={subjectsModal} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={[styles.modalHeader, { paddingTop: Math.max(insets.top, 12) + 12 }]}>
            <Text style={styles.modalHeaderTitle}>Subjects Manager</Text>
            <TouchableOpacity onPress={() => setSubjectsModal(false)}>
              <Ionicons name="close" size={28} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.subFormTitle}>Add New Subject</Text>
            <Input
              label="Subject Name"
              placeholder="Software Engineering"
              value={newSubject.name}
              onChangeText={(t) => setNewSubject({ ...newSubject, name: t })}
            />
            <Input
              label="Subject / Course Code"
              placeholder="CS301"
              value={newSubject.code}
              onChangeText={(t) => setNewSubject({ ...newSubject, code: t })}
              autoCapitalize="characters"
            />

            <TouchableOpacity
              onPress={handleCreateSubject}
              disabled={submittingSubject}
              style={[styles.primaryButton, { marginTop: spacing.sm, marginBottom: spacing.xl }]}
            >
              {submittingSubject ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryButtonText}>Register Subject</Text>
              )}
            </TouchableOpacity>

            <Text style={styles.subFormTitle}>Active Subjects ({subjects.length})</Text>
            {loadingSubjects ? (
              <ActivityIndicator color={colors.primary} />
            ) : subjects.length === 0 ? (
              <Text style={styles.emptyText}>No subjects configured.</Text>
            ) : (
              subjects.map((item) => (
                <View key={item.id} style={styles.studentItem}>
                  <View style={styles.studentDetails}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.studentName}>{item.name}</Text>
                      {item.code && <Text style={styles.studentMeta}>Code: {item.code}</Text>}
                    </View>
                    <TouchableOpacity onPress={() => handleDeleteSubject(item.id)} style={styles.deleteBtn}>
                      <Ionicons name="trash-outline" size={20} color={colors.error} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
            <View style={{ height: 80 }} />
          </ScrollView>
        </View>
      </Modal>

      {/* -------------------- MODAL: MANAGE STUDENTS -------------------- */}
      <Modal visible={studentsModal} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={[styles.modalHeader, { paddingTop: Math.max(insets.top, 12) + 12 }]}>
            <Text style={styles.modalHeaderTitle}>Student Directory</Text>
            <TouchableOpacity onPress={() => setStudentsModal(false)}>
              <Ionicons name="close" size={28} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.subFormTitle}>Add New Student</Text>
            <Input
              label="Name"
              placeholder="Amrutha S"
              value={newStudent.name}
              onChangeText={(t) => setNewStudent({ ...newStudent, name: t })}
            />
            <Input
              label="Email"
              placeholder="student@uniconnect.edu"
              value={newStudent.email}
              onChangeText={(t) => setNewStudent({ ...newStudent, email: t })}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <Input
              label="Student ID (USN)"
              placeholder="1AR23IS003"
              value={newStudent.student_id}
              onChangeText={(t) => setNewStudent({ ...newStudent, student_id: t })}
              autoCapitalize="characters"
            />

            {/* Department Dropdown Selector */}
            <Text style={styles.dropdownLabel}>Department</Text>
            <TouchableOpacity
              onPress={() => setShowStudentDeptPicker(true)}
              style={styles.dropdownTrigger}
            >
              <Text style={styles.dropdownValue}>
                {newStudent.department || 'Select Department'}
              </Text>
              <Ionicons name="chevron-down" size={18} color={colors.textSecondary} />
            </TouchableOpacity>

            {/* Year Dropdown Selector */}
            <Text style={styles.dropdownLabel}>Year</Text>
            <TouchableOpacity
              onPress={() => setShowStudentYearPicker(true)}
              style={styles.dropdownTrigger}
            >
              <Text style={styles.dropdownValue}>{newStudent.year}</Text>
              <Ionicons name="chevron-down" size={18} color={colors.textSecondary} />
            </TouchableOpacity>

            {/* Section Dropdown Selector */}
            <Text style={styles.dropdownLabel}>Section</Text>
            <TouchableOpacity
              onPress={() => setShowStudentSecPicker(true)}
              style={styles.dropdownTrigger}
            >
              <Text style={styles.dropdownValue}>{newStudent.section}</Text>
              <Ionicons name="chevron-down" size={18} color={colors.textSecondary} />
            </TouchableOpacity>

            <Input
              label="Date of Birth"
              placeholder="YYYY-MM-DD"
              value={newStudent.dob}
              onChangeText={(t) => setNewStudent({ ...newStudent, dob: t })}
            />
            <Input
              label="Phone Number"
              placeholder="+91 9876543210"
              value={newStudent.phone}
              onChangeText={(t) => setNewStudent({ ...newStudent, phone: t })}
            />
            <Input
              label="Gender"
              placeholder="Female"
              value={newStudent.gender}
              onChangeText={(t) => setNewStudent({ ...newStudent, gender: t })}
            />
            <Input
              label="Blood Group"
              placeholder="A+"
              value={newStudent.blood_group}
              onChangeText={(t) => setNewStudent({ ...newStudent, blood_group: t })}
            />
            <Input
              label="Home Address"
              placeholder="45, 2nd Cross, Bangalore"
              value={newStudent.address}
              onChangeText={(t) => setNewStudent({ ...newStudent, address: t })}
            />

            <TouchableOpacity
              onPress={handleCreateStudent}
              disabled={submittingStudent}
              style={[styles.primaryButton, { marginTop: spacing.sm, marginBottom: spacing.xl }]}
            >
              {submittingStudent ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryButtonText}>Add Student User</Text>
              )}
            </TouchableOpacity>

            <Text style={styles.subFormTitle}>Registered Students ({studentsList.length})</Text>
            {loadingStudents ? (
              <ActivityIndicator color={colors.primary} />
            ) : (
              studentsList.map((item) => (
                <View key={item.id} style={styles.studentItem}>
                  <View style={styles.studentDetails}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.studentName}>{item.name}</Text>
                      <Text style={styles.studentMeta}>
                        {item.student_id} • {item.year} Year • Sec {item.section || 'N/A'} • {item.department}
                      </Text>
                      <Text style={styles.studentMetaSecondary}>
                        DOB: {item.dob || 'N/A'} • Gender: {item.gender || 'N/A'} • Blood: {item.blood_group || 'N/A'}
                      </Text>
                      {item.phone && <Text style={styles.studentMetaSecondary}>Phone: {item.phone}</Text>}
                      {item.address && <Text style={styles.studentMetaSecondary}>Address: {item.address}</Text>}
                    </View>
                    <TouchableOpacity onPress={() => handleDeleteStudent(item.id)} style={styles.deleteBtn}>
                      <Ionicons name="trash-outline" size={20} color={colors.error} />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.studentEmail}>{item.email}</Text>
                </View>
              ))
            )}
            <View style={{ height: 80 }} />
          </ScrollView>

          {/* -------------------- INSTANT ABSOLUTE PICKERS (Inside Student Modal) -------------------- */}
          {showStudentDeptPicker && (
            <Pressable style={styles.absolutePickerOverlay} onPress={() => setShowStudentDeptPicker(false)}>
              <View style={styles.pickerCard}>
                <Text style={styles.pickerTitle}>Select Department</Text>
                {departments.length === 0 ? (
                  <Text style={{ textAlign: 'center', color: colors.textSecondary, margin: 20 }}>
                    No departments registered.
                  </Text>
                ) : (
                  <ScrollView>
                    {departments.map((d) => (
                      <TouchableOpacity
                        key={d.id}
                        style={styles.pickerItem}
                        onPress={() => {
                          setNewStudent({ ...newStudent, department: d.name });
                          setShowStudentDeptPicker(false);
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

          {showStudentYearPicker && (
            <Pressable style={styles.absolutePickerOverlay} onPress={() => setShowStudentYearPicker(false)}>
              <View style={styles.pickerCard}>
                <Text style={styles.pickerTitle}>Select Year</Text>
                <ScrollView>
                  {yearsList.map((y) => (
                    <TouchableOpacity
                      key={y}
                      style={styles.pickerItem}
                      onPress={() => {
                        setNewStudent({ ...newStudent, year: y });
                        setShowStudentYearPicker(false);
                      }}
                    >
                      <Text style={styles.pickerItemText}>{y} Year</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </Pressable>
          )}

          {showStudentSecPicker && (
            <Pressable style={styles.absolutePickerOverlay} onPress={() => setShowStudentSecPicker(false)}>
              <View style={styles.pickerCard}>
                <Text style={styles.pickerTitle}>Select Section</Text>
                <ScrollView>
                  {sectionsList.map((s) => (
                    <TouchableOpacity
                      key={s}
                      style={styles.pickerItem}
                      onPress={() => {
                        setNewStudent({ ...newStudent, section: s });
                        setShowStudentSecPicker(false);
                      }}
                    >
                      <Text style={styles.pickerItemText}>Section {s}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </Pressable>
          )}
        </View>
      </Modal>

      {/* -------------------- MODAL: MANAGE TEACHERS -------------------- */}
      <Modal visible={teachersModal} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={[styles.modalHeader, { paddingTop: Math.max(insets.top, 12) + 12 }]}>
            <Text style={styles.modalHeaderTitle}>Teacher Directory</Text>
            <TouchableOpacity onPress={() => setTeachersModal(false)}>
              <Ionicons name="close" size={28} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.subFormTitle}>Add New Teacher</Text>
            <Input
              label="Name"
              placeholder="Prof. Kavya A D"
              value={newTeacher.name}
              onChangeText={(t) => setNewTeacher({ ...newTeacher, name: t })}
            />
            <Input
              label="Email"
              placeholder="teacher@uniconnect.edu"
              value={newTeacher.email}
              onChangeText={(t) => setNewTeacher({ ...newTeacher, email: t })}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <Input
              label="Employee ID"
              placeholder="EMP001"
              value={newTeacher.employee_id}
              onChangeText={(t) => setNewTeacher({ ...newTeacher, employee_id: t })}
              autoCapitalize="characters"
            />
            <Input
              label="Designation"
              placeholder="Assistant Professor"
              value={newTeacher.designation}
              onChangeText={(t) => setNewTeacher({ ...newTeacher, designation: t })}
            />

            {/* Teacher Department Selector */}
            <Text style={styles.dropdownLabel}>Department</Text>
            <TouchableOpacity
              onPress={() => setShowTeacherDeptPicker(true)}
              style={styles.dropdownTrigger}
            >
              <Text style={styles.dropdownValue}>
                {newTeacher.department || 'Select Department'}
              </Text>
              <Ionicons name="chevron-down" size={18} color={colors.textSecondary} />
            </TouchableOpacity>

            <Input
              label="Date of Birth"
              placeholder="YYYY-MM-DD"
              value={newTeacher.dob}
              onChangeText={(t) => setNewTeacher({ ...newTeacher, dob: t })}
            />
            <Input
              label="Phone Number"
              placeholder="+91 9876543210"
              value={newTeacher.phone}
              onChangeText={(t) => setNewTeacher({ ...newTeacher, phone: t })}
            />
            <Input
              label="Gender"
              placeholder="Female"
              value={newTeacher.gender}
              onChangeText={(t) => setNewTeacher({ ...newTeacher, gender: t })}
            />
            <Input
              label="Blood Group"
              placeholder="A+"
              value={newTeacher.blood_group}
              onChangeText={(t) => setNewTeacher({ ...newTeacher, blood_group: t })}
            />
            <Input
              label="Home Address"
              placeholder="45, 2nd Cross, Bangalore"
              value={newTeacher.address}
              onChangeText={(t) => setNewTeacher({ ...newTeacher, address: t })}
            />

            <TouchableOpacity
              onPress={handleCreateTeacher}
              disabled={submittingTeacher}
              style={[styles.primaryButton, { marginTop: spacing.sm, marginBottom: spacing.xl }]}
            >
              {submittingTeacher ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryButtonText}>Add Teacher User</Text>
              )}
            </TouchableOpacity>

            <Text style={styles.subFormTitle}>Registered Teachers ({teachersList.length})</Text>
            {loadingTeachers ? (
              <ActivityIndicator color={colors.primary} />
            ) : (
              teachersList.map((item) => (
                <View key={item.id} style={styles.studentItem}>
                  <View style={styles.studentDetails}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.studentName}>{item.name}</Text>
                      <Text style={styles.studentMeta}>
                        {item.employee_id ? `${item.employee_id} • ` : ''}
                        {item.designation ? `${item.designation} • ` : ''}
                        {item.department}
                      </Text>
                      <Text style={styles.studentMetaSecondary}>
                        DOB: {item.dob || 'N/A'} • Gender: {item.gender || 'N/A'} • Blood: {item.blood_group || 'N/A'}
                      </Text>
                      {item.phone && <Text style={styles.studentMetaSecondary}>Phone: {item.phone}</Text>}
                      {item.address && <Text style={styles.studentMetaSecondary}>Address: {item.address}</Text>}
                    </View>
                    <TouchableOpacity onPress={() => handleDeleteTeacher(item.id)} style={styles.deleteBtn}>
                      <Ionicons name="trash-outline" size={20} color={colors.error} />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.studentEmail}>{item.email}</Text>
                </View>
              ))
            )}
            <View style={{ height: 80 }} />
          </ScrollView>

          {/* -------------------- INSTANT ABSOLUTE PICKERS (Inside Teacher Modal) -------------------- */}
          {showTeacherDeptPicker && (
            <Pressable style={styles.absolutePickerOverlay} onPress={() => setShowTeacherDeptPicker(false)}>
              <View style={styles.pickerCard}>
                <Text style={styles.pickerTitle}>Select Department</Text>
                {departments.length === 0 ? (
                  <Text style={{ textAlign: 'center', color: colors.textSecondary, margin: 20 }}>
                    No departments registered.
                  </Text>
                ) : (
                  <ScrollView>
                    {departments.map((d) => (
                      <TouchableOpacity
                        key={d.id}
                        style={styles.pickerItem}
                        onPress={() => {
                          setNewTeacher({ ...newTeacher, department: d.name });
                          setShowTeacherDeptPicker(false);
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
        </View>
      </Modal>

      {/* -------------------- MODAL: PUBLISH NOTICE -------------------- */}
      <Modal visible={noticeModal} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={[styles.modalHeader, { paddingTop: Math.max(insets.top, 12) + 12 }]}>
            <Text style={styles.modalHeaderTitle}>Publish Notice</Text>
            <TouchableOpacity onPress={() => setNoticeModal(false)}>
              <Ionicons name="close" size={28} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Input
              label="Notice Title"
              placeholder="Final Semester Timetable out"
              value={newNotice.title}
              onChangeText={(t) => setNewNotice({ ...newNotice, title: t })}
            />
            <Input
              label="Category"
              placeholder="Academics"
              value={newNotice.category}
              onChangeText={(t) => setNewNotice({ ...newNotice, category: t })}
            />
            <Input
              label="Notice Body"
              placeholder="Describe notice content..."
              value={newNotice.body}
              onChangeText={(t) => setNewNotice({ ...newNotice, body: t })}
              multiline
              numberOfLines={6}
              style={{ height: 120, textAlignVertical: 'top' }}
            />

            <TouchableOpacity
              onPress={handlePublishNotice}
              disabled={submittingNotice}
              style={[styles.primaryButton, { marginTop: spacing.lg, marginBottom: spacing.xl }]}
            >
              {submittingNotice ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryButtonText}>Publish Announcement</Text>
              )}
            </TouchableOpacity>

            <Text style={styles.subFormTitle}>Published Announcements ({noticesList.length})</Text>
            {loadingNotices ? (
              <ActivityIndicator color={colors.primary} />
            ) : (
              noticesList.map((item) => (
                <View key={item.id} style={styles.studentItem}>
                  <View style={styles.studentDetails}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.noticeTitle}>{item.title}</Text>
                      <Text style={styles.studentMeta}>{item.category} • {item.date}</Text>
                    </View>
                    <TouchableOpacity onPress={() => handleDeleteNotice(item.id)} style={styles.deleteBtn}>
                      <Ionicons name="trash-outline" size={20} color={colors.error} />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.noticeBody}>{item.body}</Text>
                </View>
              ))
            )}
            <View style={{ height: 80 }} />
          </ScrollView>
        </View>
      </Modal>

      {/* -------------------- MODAL: MANAGE EVENTS -------------------- */}
      <Modal visible={eventModal} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={[styles.modalHeader, { paddingTop: Math.max(insets.top, 12) + 12 }]}>
            <Text style={styles.modalHeaderTitle}>Create Event</Text>
            <TouchableOpacity onPress={() => setEventModal(false)}>
              <Ionicons name="close" size={28} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Input
              label="Event Title"
              placeholder="Annual Cultural Fest 2026"
              value={newEvent.title}
              onChangeText={(t) => setNewEvent({ ...newEvent, title: t })}
            />
            <Input
              label="Event Description"
              placeholder="Brief description of activities..."
              value={newEvent.description}
              onChangeText={(t) => setNewEvent({ ...newEvent, description: t })}
              multiline
              numberOfLines={4}
              style={{ height: 80, textAlignVertical: 'top' }}
            />
            <Input
              label="Venue"
              placeholder="Main Auditorium"
              value={newEvent.venue}
              onChangeText={(t) => setNewEvent({ ...newEvent, venue: t })}
            />
            <Input
              label="Date (YYYY-MM-DD)"
              placeholder="2026-04-12"
              value={newEvent.date}
              onChangeText={(t) => setNewEvent({ ...newEvent, date: t })}
            />
            <Input
              label="Event Type"
              placeholder="cultural"
              value={newEvent.type}
              onChangeText={(t) => setNewEvent({ ...newEvent, type: t })}
            />

            <TouchableOpacity
              onPress={handleCreateEvent}
              disabled={submittingEvent}
              style={[styles.primaryButton, { marginTop: spacing.lg, marginBottom: spacing.xl }]}
            >
              {submittingEvent ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryButtonText}>Create Event</Text>
              )}
            </TouchableOpacity>

            <Text style={styles.subFormTitle}>Campus Events ({eventsList.length})</Text>
            {loadingEvents ? (
              <ActivityIndicator color={colors.primary} />
            ) : (
              eventsList.map((item) => (
                <View key={item.id} style={styles.studentItem}>
                  <View style={styles.studentDetails}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.noticeTitle}>{item.title}</Text>
                      <Text style={styles.studentMeta}>{item.venue} • {item.date}</Text>
                    </View>
                    <TouchableOpacity onPress={() => handleDeleteEvent(item.id)} style={styles.deleteBtn}>
                      <Ionicons name="trash-outline" size={20} color={colors.error} />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.noticeBody}>{item.description}</Text>
                </View>
              ))
            )}
            <View style={{ height: 80 }} />
          </ScrollView>
        </View>
      </Modal>

      {/* -------------------- MODAL: MANAGE FEES -------------------- */}
      <Modal visible={feesModal} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={[styles.modalHeader, { paddingTop: Math.max(insets.top, 12) + 12 }]}>
            <Text style={styles.modalHeaderTitle}>Student Fees Manager</Text>
            <TouchableOpacity onPress={() => setFeesModal(false)}>
              <Ionicons name="close" size={28} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.subFormTitle}>Assign New Student Fee</Text>
            <Input
              label="Student Email"
              placeholder="student@uniconnect.edu"
              value={newFee.student_email}
              onChangeText={(t) => setNewFee({ ...newFee, student_email: t })}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <Input
              label="Fee Amount (₹)"
              placeholder="15000"
              value={newFee.amount}
              onChangeText={(t) => setNewFee({ ...newFee, amount: t })}
              keyboardType="numeric"
            />
            <Input
              label="Due Date (YYYY-MM-DD)"
              placeholder="2026-06-30"
              value={newFee.due_date}
              onChangeText={(t) => setNewFee({ ...newFee, due_date: t })}
            />

            <TouchableOpacity
              onPress={handleCreateFee}
              disabled={submittingFee}
              style={[styles.primaryButton, { marginTop: spacing.sm, marginBottom: spacing.xl }]}
            >
              {submittingFee ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryButtonText}>Assign Student Fee</Text>
              )}
            </TouchableOpacity>

            <Text style={styles.subFormTitle}>Active Fee Assignments ({feesList.length})</Text>
            {loadingFees ? (
              <ActivityIndicator color={colors.primary} />
            ) : feesList.length === 0 ? (
              <Text style={styles.emptyText}>No fee records found in system.</Text>
            ) : (
              feesList.map((item) => (
                <View key={item.id} style={styles.studentItem}>
                  <View style={styles.studentDetails}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.studentName}>₹{item.amount.toLocaleString()}</Text>
                      <Text style={styles.studentMeta}>
                        Assigned to: {item.student_name} ({item.student_email})
                      </Text>
                      <Text style={styles.studentMeta}>
                        Due: {item.due_date} • Status: {item.status.toUpperCase()}
                      </Text>
                      {item.paid_at && (
                        <Text style={styles.studentMetaSecondary}>Paid at: {new Date(item.paid_at).toLocaleString()}</Text>
                      )}
                    </View>
                    <TouchableOpacity onPress={() => handleDeleteFee(item.id)} style={styles.deleteBtn}>
                      <Ionicons name="trash-outline" size={20} color={colors.error} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
            <View style={{ height: 80 }} />
          </ScrollView>
        </View>
      </Modal>

      {/* -------------------- MODAL: MANAGE TIMETABLE -------------------- */}
      <Modal visible={timetableModal} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={[styles.modalHeader, { paddingTop: Math.max(insets.top, 12) + 12 }]}>
            <Text style={styles.modalHeaderTitle}>Timetable Manager</Text>
            <TouchableOpacity onPress={() => setTimetableModal(false)}>
              <Ionicons name="close" size={28} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.subFormTitle}>Publish New Class Slot</Text>
            
            {/* Department Dropdown Selector */}
            <Text style={styles.dropdownLabel}>Department</Text>
            <TouchableOpacity
              onPress={() => setShowTimetableDeptPicker(true)}
              style={styles.dropdownTrigger}
            >
              <Text style={styles.dropdownValue}>
                {newSlot.department || 'Select Department'}
              </Text>
              <Ionicons name="chevron-down" size={18} color={colors.textSecondary} />
            </TouchableOpacity>

            {/* Academic Scheme Selector */}
            <Text style={styles.dropdownLabel}>Academic Scheme</Text>
            <View style={styles.schemeTabsContainer}>
              <TouchableOpacity
                style={[
                  styles.schemeTab,
                  newSlot.scheme === 'yearly' && styles.schemeTabActive,
                ]}
                onPress={() => setNewSlot({ ...newSlot, scheme: 'yearly', semester: '' })}
              >
                <Text
                  style={[
                    styles.schemeTabText,
                    newSlot.scheme === 'yearly' && styles.schemeTabTextActive,
                  ]}
                >
                  Yearly-based
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.schemeTab,
                  newSlot.scheme === 'semester' && styles.schemeTabActive,
                ]}
                onPress={() => setNewSlot({ ...newSlot, scheme: 'semester', semester: '1st Semester' })}
              >
                <Text
                  style={[
                    styles.schemeTabText,
                    newSlot.scheme === 'semester' && styles.schemeTabTextActive,
                  ]}
                >
                  Semester-based
                </Text>
              </TouchableOpacity>
            </View>

            {/* Conditionally display Year or Semester */}
            {newSlot.scheme === 'yearly' ? (
              <>
                {/* Year Dropdown Selector */}
                <Text style={styles.dropdownLabel}>Year</Text>
                <TouchableOpacity
                  onPress={() => setShowTimetableYearPicker(true)}
                  style={styles.dropdownTrigger}
                >
                  <Text style={styles.dropdownValue}>{newSlot.year}</Text>
                  <Ionicons name="chevron-down" size={18} color={colors.textSecondary} />
                </TouchableOpacity>
              </>
            ) : (
              <>
                {/* Semester Dropdown Selector */}
                <Text style={styles.dropdownLabel}>Semester</Text>
                <TouchableOpacity
                  onPress={() => setShowTimetableSemPicker(true)}
                  style={styles.dropdownTrigger}
                >
                  <Text style={styles.dropdownValue}>{newSlot.semester}</Text>
                  <Ionicons name="chevron-down" size={18} color={colors.textSecondary} />
                </TouchableOpacity>
              </>
            )}

            {/* Section Dropdown Selector */}
            <Text style={styles.dropdownLabel}>Section</Text>
            <TouchableOpacity
              onPress={() => setShowTimetableSecPicker(true)}
              style={styles.dropdownTrigger}
            >
              <Text style={styles.dropdownValue}>{newSlot.section}</Text>
              <Ionicons name="chevron-down" size={18} color={colors.textSecondary} />
            </TouchableOpacity>

            {/* Day Dropdown Selector */}
            <Text style={styles.dropdownLabel}>Day of Week</Text>
            <TouchableOpacity
              onPress={() => setShowTimetableDayPicker(true)}
              style={styles.dropdownTrigger}
            >
              <Text style={styles.dropdownValue}>{newSlot.day}</Text>
              <Ionicons name="chevron-down" size={18} color={colors.textSecondary} />
            </TouchableOpacity>

            {/* Subject Dropdown Selector */}
            <Text style={styles.dropdownLabel}>Subject</Text>
            <TouchableOpacity
              onPress={() => setShowTimetableSubjectPicker(true)}
              style={styles.dropdownTrigger}
            >
              <Text style={styles.dropdownValue}>
                {newSlot.subject || 'Select Subject'}
              </Text>
              <Ionicons name="chevron-down" size={18} color={colors.textSecondary} />
            </TouchableOpacity>

            {/* Teacher Dropdown Selector */}
            <Text style={styles.dropdownLabel}>Assign Teacher</Text>
            <TouchableOpacity
              onPress={() => setShowTimetableTeacherPicker(true)}
              style={styles.dropdownTrigger}
            >
              <Text style={styles.dropdownValue}>
                {newSlot.teacher_name || 'Select Teacher'}
              </Text>
              <Ionicons name="chevron-down" size={18} color={colors.textSecondary} />
            </TouchableOpacity>

            <Input
              label="Time Slot"
              placeholder="09:00 AM - 10:00 AM"
              value={newSlot.time_slot}
              onChangeText={(t) => setNewSlot({ ...newSlot, time_slot: t })}
            />

            <Input
              label="Classroom / Lab Room"
              placeholder="LH-201"
              value={newSlot.room}
              onChangeText={(t) => setNewSlot({ ...newSlot, room: t })}
            />

            <TouchableOpacity
              onPress={handleCreateTimetableSlot}
              disabled={submittingSlot}
              style={[styles.primaryButton, { marginTop: spacing.sm, marginBottom: spacing.xl }]}
            >
              {submittingSlot ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryButtonText}>Publish Timetable Slot</Text>
              )}
            </TouchableOpacity>

            <Text style={styles.subFormTitle}>Active Scheduled Slots ({slotsList.length})</Text>
            {loadingSlots ? (
              <ActivityIndicator color={colors.primary} />
            ) : slotsList.length === 0 ? (
              <Text style={styles.emptyText}>No timetable slots created.</Text>
            ) : (
              slotsList.map((item) => (
                <View key={item.id} style={styles.studentItem}>
                  <View style={styles.studentDetails}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.studentName}>{item.subject}</Text>
                      <Text style={styles.studentMeta}>
                        Class: {item.department} • {item.semester ? item.semester : `${item.year} Year`} • Sec {item.section}
                      </Text>
                      <Text style={styles.studentMeta}>
                        Schedule: {item.day} • {item.time_slot} {item.room ? `• Room ${item.room}` : ''}
                      </Text>
                      {item.teacher_name ? (
                        <Text style={styles.studentMetaSecondary}>
                          Teacher: {item.teacher_name}
                        </Text>
                      ) : null}
                    </View>
                    <TouchableOpacity onPress={() => handleDeleteTimetableSlot(item.id)} style={styles.deleteBtn}>
                      <Ionicons name="trash-outline" size={20} color={colors.error} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
            <View style={{ height: 80 }} />
          </ScrollView>

          {/* -------------------- INSTANT ABSOLUTE PICKERS (Inside Timetable Modal) -------------------- */}
          {showTimetableDeptPicker && (
            <Pressable style={styles.absolutePickerOverlay} onPress={() => setShowTimetableDeptPicker(false)}>
              <View style={styles.pickerCard}>
                <Text style={styles.pickerTitle}>Select Department</Text>
                {departments.length === 0 ? (
                  <Text style={{ textAlign: 'center', color: colors.textSecondary, margin: 20 }}>
                    No departments configured.
                  </Text>
                ) : (
                  <ScrollView>
                    {departments.map((d) => (
                      <TouchableOpacity
                        key={d.id}
                        style={styles.pickerItem}
                        onPress={() => {
                          setNewSlot({ ...newSlot, department: d.name });
                          setShowTimetableDeptPicker(false);
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

          {showTimetableYearPicker && (
            <Pressable style={styles.absolutePickerOverlay} onPress={() => setShowTimetableYearPicker(false)}>
              <View style={styles.pickerCard}>
                <Text style={styles.pickerTitle}>Select Year</Text>
                <ScrollView>
                  {yearsList.map((y) => (
                    <TouchableOpacity
                      key={y}
                      style={styles.pickerItem}
                      onPress={() => {
                        setNewSlot({ ...newSlot, year: y });
                        setShowTimetableYearPicker(false);
                      }}
                    >
                      <Text style={styles.pickerItemText}>{y} Year</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </Pressable>
          )}

          {showTimetableSemPicker && (
            <Pressable style={styles.absolutePickerOverlay} onPress={() => setShowTimetableSemPicker(false)}>
              <View style={styles.pickerCard}>
                <Text style={styles.pickerTitle}>Select Semester</Text>
                <ScrollView>
                  {semestersList.map((sem) => (
                    <TouchableOpacity
                      key={sem}
                      style={styles.pickerItem}
                      onPress={() => {
                        setNewSlot({ ...newSlot, semester: sem });
                        setShowTimetableSemPicker(false);
                      }}
                    >
                      <Text style={styles.pickerItemText}>{sem}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </Pressable>
          )}

          {showTimetableSecPicker && (
            <Pressable style={styles.absolutePickerOverlay} onPress={() => setShowTimetableSecPicker(false)}>
              <View style={styles.pickerCard}>
                <Text style={styles.pickerTitle}>Select Section</Text>
                <ScrollView>
                  {sectionsList.map((s) => (
                    <TouchableOpacity
                      key={s}
                      style={styles.pickerItem}
                      onPress={() => {
                        setNewSlot({ ...newSlot, section: s });
                        setShowTimetableSecPicker(false);
                      }}
                    >
                      <Text style={styles.pickerItemText}>Section {s}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </Pressable>
          )}

          {showTimetableDayPicker && (
            <Pressable style={styles.absolutePickerOverlay} onPress={() => setShowTimetableDayPicker(false)}>
              <View style={styles.pickerCard}>
                <Text style={styles.pickerTitle}>Select Day</Text>
                <ScrollView>
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((d) => (
                    <TouchableOpacity
                      key={d}
                      style={styles.pickerItem}
                      onPress={() => {
                        setNewSlot({ ...newSlot, day: d });
                        setShowTimetableDayPicker(false);
                      }}
                    >
                      <Text style={styles.pickerItemText}>{d}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </Pressable>
          )}

          {showTimetableSubjectPicker && (
            <Pressable style={styles.absolutePickerOverlay} onPress={() => setShowTimetableSubjectPicker(false)}>
              <View style={styles.pickerCard}>
                <Text style={styles.pickerTitle}>Select Subject</Text>
                {subjects.length === 0 ? (
                  <Text style={{ textAlign: 'center', color: colors.textSecondary, margin: 20 }}>
                    No subjects. Go to 'Manage subjects' to register.
                  </Text>
                ) : (
                  <ScrollView>
                    {subjects.map((sub) => (
                      <TouchableOpacity
                        key={sub.id}
                        style={styles.pickerItem}
                        onPress={() => {
                          setNewSlot({ ...newSlot, subject: sub.name });
                          setShowTimetableSubjectPicker(false);
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

          {showTimetableTeacherPicker && (
            <Pressable style={styles.absolutePickerOverlay} onPress={() => setShowTimetableTeacherPicker(false)}>
              <View style={styles.pickerCard}>
                <Text style={styles.pickerTitle}>Select Teacher</Text>
                {teachersList.length === 0 ? (
                  <Text style={{ textAlign: 'center', color: colors.textSecondary, margin: 20 }}>
                    No teachers registered. Go to 'Manage teachers' to register.
                  </Text>
                ) : (
                  <ScrollView>
                    {teachersList.map((t) => (
                      <TouchableOpacity
                        key={t.id}
                        style={styles.pickerItem}
                        onPress={() => {
                          setNewSlot({ ...newSlot, teacher_name: t.name });
                          setShowTimetableTeacherPicker(false);
                        }}
                      >
                        <Text style={styles.pickerItemText}>{t.name} ({t.designation || 'Lecturer'})</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                )}
              </View>
            </Pressable>
          )}
        </View>
      </Modal>

      {/* -------------------- MODAL: RESOLVE GRIEVANCES -------------------- */}
      <Modal visible={grievancesModal} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={[styles.modalHeader, { paddingTop: Math.max(insets.top, 12) + 12 }]}>
            <Text style={styles.modalHeaderTitle}>Student Grievances</Text>
            <TouchableOpacity onPress={() => setGrievancesModal(false)}>
              <Ionicons name="close" size={28} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {loadingGrievances ? (
              <ActivityIndicator color={colors.primary} />
            ) : grievancesList.length === 0 ? (
              <Text style={styles.emptyText}>No grievance tickets filed.</Text>
            ) : (
              grievancesList.map((item) => (
                <View key={item.id} style={styles.grievanceItem}>
                  <View style={styles.grievanceRow}>
                    <Text style={styles.grievanceSubject}>{item.subject}</Text>
                    <View style={[
                      styles.badge,
                      item.status === 'resolved' ? styles.badgeSuccess : styles.badgeWarning
                    ]}>
                      <Text style={styles.badgeText}>
                        {item.status === 'resolved' ? 'Resolved' : 'Pending'}
                      </Text>
                    </View>
                  </View>
                  
                  <Text style={styles.grievanceDesc}>{item.description}</Text>
                  <Text style={styles.studentMeta}>Filed on: {new Date(item.created_at).toLocaleDateString()}</Text>

                  {item.status !== 'resolved' ? (
                    <View style={styles.resolveForm}>
                      <Input
                        label="Resolution Response"
                        placeholder="Type response to student..."
                        value={grievanceResponses[item.id] || ''}
                        onChangeText={(t) => setGrievanceResponses({ ...grievanceResponses, [item.id]: t })}
                        multiline
                      />
                      <TouchableOpacity
                        onPress={() => handleResolveGrievance(item.id)}
                        disabled={resolvingGrievanceId === item.id}
                        style={[styles.primaryButton, { marginTop: spacing.xs }]}
                      >
                        {resolvingGrievanceId === item.id ? (
                          <ActivityIndicator color="#FFFFFF" />
                        ) : (
                          <Text style={styles.primaryButtonText}>Resolve Ticket</Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={styles.resolvedBox}>
                      <Text style={styles.responseLabel}>Response:</Text>
                      <Text style={styles.responseText}>{item.response}</Text>
                    </View>
                  )}
                </View>
              ))
            )}
            <View style={{ height: 80 }} />
          </ScrollView>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xl },
  headerText: { marginLeft: spacing.md },
  greeting: { color: colors.textSecondary, fontSize: 14 },
  name: { color: colors.textPrimary, fontSize: 22, fontWeight: '700' },
  statsRow: { flexDirection: 'row', marginBottom: spacing.lg },
  statCard: { flex: 1, marginHorizontal: spacing.xs, alignItems: 'center' },
  statValue: { color: colors.primary, fontSize: 28, fontWeight: '800' },
  statLabel: { color: colors.textSecondary, fontSize: 12, marginTop: 4 },
  sectionTitle: { color: colors.textSecondary, fontSize: 14, fontWeight: '600', marginBottom: spacing.sm },
  card: { marginBottom: spacing.sm },
  cardContent: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.xs },
  cardTitle: { color: colors.textPrimary, fontWeight: '600', fontSize: 16, marginLeft: spacing.md },

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
  subFormTitle: { fontSize: 16, fontWeight: '600', color: colors.textSecondary, marginBottom: spacing.sm },

  // Dropdown Selectors
  dropdownLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: spacing.sm,
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

  // Student directory items
  studentItem: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB',
  },
  studentDetails: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  studentName: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
  noticeTitle: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
  noticeBody: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
  studentMeta: { fontSize: 12, color: colors.textSecondary },
  studentMetaSecondary: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  studentEmail: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  deleteBtn: { padding: 8 },
  primaryButton: {
    backgroundColor: '#000000',
    borderRadius: 12,
    minHeight: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  // Grievances Item styles
  grievanceItem: {
    padding: spacing.md,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#EBEBEB',
  },
  grievanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  grievanceSubject: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    flex: 1,
  },
  grievanceDesc: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  resolveForm: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  resolvedBox: {
    marginTop: spacing.sm,
    padding: spacing.sm,
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  responseLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#166534',
  },
  responseText: {
    fontSize: 13,
    color: '#14532D',
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: spacing.xs,
  },
  badgeSuccess: {
    backgroundColor: '#DCFCE7',
  },
  badgeWarning: {
    backgroundColor: '#FEF3C7',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginTop: spacing.xl,
  },

  // Academic Scheme Select Tabs
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
