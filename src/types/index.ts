export type UserRole = 'student' | 'staff' | 'admin';

export interface User {
  user_id: string;
  username: string;
  password?: string;
  role: UserRole;
  email: string;
  name: string;
}

export interface Student {
  student_id: string;
  name: string;
  roll_number: string;
  class: string;
  division: string;
  department: string;
  email: string;
  phone: string;
}

export interface Staff {
  staff_id: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  phone: string;
}

export interface Department {
  department_id: string;
  department_name: string;
  code: string;
  head_name: string;
}

export interface ComplaintCategory {
  category_id: string;
  category_name: string;
  description: string;
  default_department_id: string;
}

export type ComplaintStatus = 'Submitted' | 'Assigned' | 'In Progress' | 'Resolved' | 'Closed';
export type PriorityLevel = 'Normal' | 'Urgent' | 'Critical';

export interface ComplaintHistoryEntry {
  history_id: string;
  complaint_id: string;
  status: ComplaintStatus;
  remarks: string;
  updated_by: string;
  updated_date: string;
}

export interface Complaint {
  complaint_id: string; // e.g. CMP-2026-1042
  student_id: string;
  student_name: string;
  roll_number: string;
  department_id: string;
  department_name: string;
  category_id: string;
  category_name: string;
  title: string;
  description: string;
  priority: PriorityLevel;
  submission_date: string;
  status: ComplaintStatus;
  assigned_staff_id?: string | null;
  assigned_staff_name?: string | null;
  remarks?: string;
  resolution?: string;
  resolution_date?: string | null;
  attachment_name?: string | null;
  attachment_url?: string | null;
  history: ComplaintHistoryEntry[];
}
