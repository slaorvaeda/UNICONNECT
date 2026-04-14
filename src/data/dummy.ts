import type { User, AttendanceRecord, Event, Grievance, Notice, FeeRecord, StudentDocument, AcademicRecord, ExamSchedule } from '../types';

/**
 * Dummy users for login (no backend check)
 * Use these credentials to switch roles in the app.
 */
export const dummyUsers: User[] = [
  {
    id: '1',
    name: 'Amrutha S',
    email: 'student@uniconnect.edu',
    role: 'student',
    studentId: '1AR23IS003',
    department: 'Information Science',
    year: '3rd',
  },
  {
    id: '2',
    name: 'Chandana S',
    email: 'student2@uniconnect.edu',
    role: 'student',
    studentId: '1AR23IS008',
    department: 'Information Science',
    year: '3rd',
  },
  {
    id: '3',
    name: 'Prof. Kavya A D',
    email: 'teacher@uniconnect.edu',
    role: 'teacher',
    department: 'Information Science',
  },
  {
    id: '4',
    name: 'Admin User',
    email: 'admin@uniconnect.edu',
    role: 'admin',
  },
];

/** Simple password for demo - same for all */
export const dummyPassword = '123456';

export const dummyAttendance: AttendanceRecord[] = [
  { id: 'a1', studentId: '1', subject: 'DBMS', date: '2025-03-05', status: 'present', percentage: 92 },
  { id: 'a2', studentId: '1', subject: 'ML', date: '2025-03-04', status: 'present', percentage: 88 },
  { id: 'a3', studentId: '1', subject: 'Web Tech', date: '2025-03-03', status: 'absent', percentage: 75 },
  { id: 'a4', studentId: '1', subject: 'DBMS', date: '2025-03-01', status: 'present', percentage: 92 },
];

export const dummyEvents: Event[] = [
  {
    id: 'e1',
    title: 'Tech Fest 2025',
    description: 'Annual technical symposium with coding competitions and workshops.',
    date: '2025-03-15',
    type: 'event',
    venue: 'Main Auditorium',
  },
  {
    id: 'e2',
    title: 'Cricket Tournament',
    description: 'Inter-class cricket championship.',
    date: '2025-03-20',
    type: 'sports',
    venue: 'College Ground',
  },
  {
    id: 'e3',
    title: 'Cultural Night',
    description: 'Music, dance and drama performances.',
    date: '2025-03-25',
    type: 'cultural',
    venue: 'Open Air Theatre',
  },
];

export const dummyGrievances: Grievance[] = [
  {
    id: 'g1',
    studentId: '1',
    subject: 'Library timings',
    description: 'Request to extend library hours during exams.',
    status: 'resolved',
    createdAt: '2025-02-20',
    updatedAt: '2025-02-25',
    response: 'Library will remain open till 8 PM during exam period.',
  },
  {
    id: 'g2',
    studentId: '1',
    subject: 'WiFi in hostel',
    description: 'Poor connectivity in Block B hostel.',
    status: 'in_progress',
    createdAt: '2025-03-01',
  },
];

export const dummyNotices: Notice[] = [
  {
    id: 'n1',
    title: 'Mid-semester exam schedule',
    body: 'Exams will be held from March 10 to March 18. Hall tickets available on portal.',
    date: '2025-03-02',
    category: 'Academics',
  },
  {
    id: 'n2',
    title: 'Fee payment deadline',
    body: 'Last date for fee payment is March 15. Late fee applicable after that.',
    date: '2025-03-01',
    category: 'Administration',
  },
];

export const dummyFees: FeeRecord[] = [
  {
    id: 'f1',
    studentId: '1',
    amount: 45000,
    dueDate: '2025-03-15',
    status: 'pending',
  },
  {
    id: 'f2',
    studentId: '1',
    amount: 5000,
    dueDate: '2025-02-28',
    status: 'paid',
    paidAt: '2025-02-25',
  },
];

export const dummyDocuments: StudentDocument[] = [
  { id: 'd1', studentId: '1', type: 'marksheet', title: 'Semester 1 Marksheet', uploadedAt: '2025-01-15' },
  { id: 'd2', studentId: '1', type: 'certificate', title: 'Tech Fest Participation', uploadedAt: '2025-02-20' },
  { id: 'd3', studentId: '1', type: 'id_proof', title: 'College ID', uploadedAt: '2024-08-01' },
];

export const dummyAcademicRecords: AcademicRecord[] = [
  { id: 'ar1', studentId: '1', subject: 'DBMS', semester: '5th', marks: 85, maxMarks: 100, grade: 'A' },
  { id: 'ar2', studentId: '1', subject: 'ML', semester: '5th', marks: 78, maxMarks: 100, grade: 'B+' },
  { id: 'ar3', studentId: '1', subject: 'Web Tech', semester: '5th', marks: 92, maxMarks: 100, grade: 'A' },
];

export const dummyExamSchedules: ExamSchedule[] = [
  { id: 'ex1', subject: 'DBMS', date: '2025-03-12', time: '9:00 AM', venue: 'Hall A' },
  { id: 'ex2', subject: 'ML', date: '2025-03-14', time: '9:00 AM', venue: 'Hall B' },
  { id: 'ex3', subject: 'Web Tech', date: '2025-03-16', time: '2:00 PM', venue: 'Hall A' },
];

/** For teacher: list of students in a class (dummy) */
export const dummyClassStudents = [
  { id: '1', name: 'Amrutha S', studentId: '1AR23IS003', present: true },
  { id: '2', name: 'Chandana S', studentId: '1AR23IS008', present: true },
  { id: '3', name: 'Harshitha S', studentId: '1AR23IS013', present: false },
  { id: '4', name: 'Niveditha C A', studentId: '1AR23IS028', present: true },
];
