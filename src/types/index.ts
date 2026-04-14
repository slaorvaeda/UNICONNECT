export type Role = 'student' | 'teacher' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  studentId?: string;
  department?: string;
  year?: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  subject: string;
  date: string;
  status: 'present' | 'absent';
  percentage?: number;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'event' | 'sports' | 'cultural';
  venue: string;
  image?: string;
}

export interface Grievance {
  id: string;
  studentId: string;
  subject: string;
  description: string;
  status: 'pending' | 'in_progress' | 'resolved';
  createdAt: string;
  updatedAt?: string;
  response?: string;
}

export interface Notice {
  id: string;
  title: string;
  body: string;
  date: string;
  category: string;
}

export interface FeeRecord {
  id: string;
  studentId: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
  paidAt?: string;
}

export interface StudentDocument {
  id: string;
  studentId: string;
  type: 'certificate' | 'marksheet' | 'id_proof' | 'other';
  title: string;
  uploadedAt: string;
  fileUrl?: string;
}

export interface AcademicRecord {
  id: string;
  studentId: string;
  subject: string;
  semester: string;
  marks: number;
  maxMarks: number;
  grade?: string;
}

export interface ExamSchedule {
  id: string;
  subject: string;
  date: string;
  time: string;
  venue: string;
}
