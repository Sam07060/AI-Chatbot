import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Student,
  Staff,
  Department,
  ComplaintCategory,
  Complaint,
  ComplaintStatus,
  PriorityLevel,
  ComplaintHistoryEntry,
  UserRole,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_STUDENTS,
  INITIAL_STAFF,
  INITIAL_DEPARTMENTS,
  INITIAL_CATEGORIES,
  INITIAL_COMPLAINTS,
} from '../data/initialData';

interface AppContextType {
  currentUser: User;
  switchUserRole: (role: UserRole) => void;
  setCurrentUser: (user: User) => void;
  currentStudentProfile: Student;

  // Data
  complaints: Complaint[];
  departments: Department[];
  categories: ComplaintCategory[];
  students: Student[];
  staff: Staff[];
  users: User[];

  // Complaint operations
  submitComplaint: (data: {
    category_id: string;
    department_id: string;
    title: string;
    description: string;
    priority: PriorityLevel;
    attachment_name?: string;
  }) => Complaint;
  assignComplaint: (complaintId: string, departmentId: string, staffId: string) => void;
  updateComplaintStatus: (
    complaintId: string,
    newStatus: ComplaintStatus,
    remarks?: string,
    resolution?: string
  ) => void;

  // CRUD for Admin
  addStudent: (student: Omit<Student, 'student_id'>) => void;
  updateStudent: (student: Student) => void;
  deleteStudent: (student_id: string) => void;

  addStaff: (staffMember: Omit<Staff, 'staff_id'>) => void;
  updateStaff: (staffMember: Staff) => void;
  deleteStaff: (staff_id: string) => void;

  addDepartment: (dept: Omit<Department, 'department_id'>) => void;
  updateDepartment: (dept: Department) => void;
  deleteDepartment: (department_id: string) => void;

  addCategory: (cat: Omit<ComplaintCategory, 'category_id'>) => void;
  updateCategory: (cat: ComplaintCategory) => void;
  deleteCategory: (category_id: string) => void;

  resetToDefaults: () => void;

  // Modals & UI State
  selectedComplaint: Complaint | null;
  setSelectedComplaint: (c: Complaint | null) => void;
  isTrackingModalOpen: boolean;
  setIsTrackingModalOpen: (open: boolean) => void;
  trackedComplaint: Complaint | null;
  setTrackedComplaint: (c: Complaint | null) => void;
  openTrackerForId: (id: string) => boolean;
  isReportsModalOpen: boolean;
  setIsReportsModalOpen: (open: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  COMPLAINTS: 'ccms_complaints_v1',
  DEPARTMENTS: 'ccms_departments_v1',
  CATEGORIES: 'ccms_categories_v1',
  STUDENTS: 'ccms_students_v1',
  STAFF: 'ccms_staff_v1',
  USERS: 'ccms_users_v1',
  CURRENT_USER_ROLE: 'ccms_current_role_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users] = useState<User[]>(INITIAL_USERS);
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ROLE);
    return (saved as UserRole) || 'student';
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    return INITIAL_USERS.find((u) => u.role === currentUserRole) || INITIAL_USERS[0];
  });

  const [departments, setDepartments] = useState<Department[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DEPARTMENTS);
    return saved ? JSON.parse(saved) : INITIAL_DEPARTMENTS;
  });

  const [categories, setCategories] = useState<ComplaintCategory[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [staff, setStaff] = useState<Staff[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STAFF);
    return saved ? JSON.parse(saved) : INITIAL_STAFF;
  });

  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COMPLAINTS);
    return saved ? JSON.parse(saved) : INITIAL_COMPLAINTS;
  });

  // Modals & Navigation
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [trackedComplaint, setTrackedComplaint] = useState<Complaint | null>(null);
  const [isReportsModalOpen, setIsReportsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DEPARTMENTS, JSON.stringify(departments));
  }, [departments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(staff));
  }, [staff]);

  const switchUserRole = (role: UserRole) => {
    setCurrentUserRole(role);
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ROLE, role);
    const targetUser = INITIAL_USERS.find((u) => u.role === role) || INITIAL_USERS[0];
    setCurrentUser(targetUser);
    setActiveTab('dashboard');
  };

  const currentStudentProfile = students.find((s) => s.email === currentUser.email) || students[0];

  const formatTimestamp = () => {
    const now = new Date();
    return now.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Submit Complaint
  const submitComplaint = (data: {
    category_id: string;
    department_id: string;
    title: string;
    description: string;
    priority: PriorityLevel;
    attachment_name?: string;
  }): Complaint => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const complaintId = `CMP-2026-${randomNum}`;
    const student = currentStudentProfile;
    const cat = categories.find((c) => c.category_id === data.category_id);
    const dept = departments.find((d) => d.department_id === data.department_id);
    const timeNow = formatTimestamp();

    const initialHistory: ComplaintHistoryEntry = {
      history_id: `HIST-${Date.now().toString().slice(-6)}`,
      complaint_id: complaintId,
      status: 'Submitted',
      remarks: 'Official complaint dossier submitted by student.',
      updated_by: `${student.name} (Student - ${student.roll_number})`,
      updated_date: timeNow,
    };

    const newComplaint: Complaint = {
      complaint_id: complaintId,
      student_id: student.student_id,
      student_name: student.name,
      roll_number: student.roll_number,
      department_id: dept?.department_id || data.department_id,
      department_name: dept?.department_name || 'General Department',
      category_id: cat?.category_id || data.category_id,
      category_name: cat?.category_name || 'General Inquiry',
      title: data.title,
      description: data.description,
      priority: data.priority,
      submission_date: timeNow,
      status: 'Submitted',
      assigned_staff_id: null,
      assigned_staff_name: null,
      remarks: '',
      resolution: '',
      resolution_date: null,
      attachment_name: data.attachment_name || null,
      history: [initialHistory],
    };

    setComplaints((prev) => [newComplaint, ...prev]);
    return newComplaint;
  };

  // Assign Complaint
  const assignComplaint = (complaintId: string, departmentId: string, staffId: string) => {
    const targetStaff = staff.find((s) => s.staff_id === staffId);
    const targetDept = departments.find((d) => d.department_id === departmentId);
    const timeNow = formatTimestamp();

    setComplaints((prev) =>
      prev.map((c) => {
        if (c.complaint_id !== complaintId) return c;

        const newHistory: ComplaintHistoryEntry = {
          history_id: `HIST-${Date.now().toString().slice(-6)}`,
          complaint_id: complaintId,
          status: 'Assigned',
          remarks: `Assigned to ${targetStaff?.name || 'Staff Member'} (${targetDept?.department_name || 'Department'}).`,
          updated_by: `${currentUser.name} (Admin)`,
          updated_date: timeNow,
        };

        return {
          ...c,
          status: 'Assigned',
          department_id: targetDept?.department_id || c.department_id,
          department_name: targetDept?.department_name || c.department_name,
          assigned_staff_id: targetStaff?.staff_id || staffId,
          assigned_staff_name: targetStaff?.name || 'Faculty Liaison',
          history: [...c.history, newHistory],
        };
      })
    );
  };

  // Update Complaint Status & Remarks & Resolution
  const updateComplaintStatus = (
    complaintId: string,
    newStatus: ComplaintStatus,
    remarks?: string,
    resolution?: string
  ) => {
    const timeNow = formatTimestamp();

    setComplaints((prev) =>
      prev.map((c) => {
        if (c.complaint_id !== complaintId) return c;

        const historyRemark =
          remarks ||
          (newStatus === 'In Progress'
            ? 'Investigation initiated on site.'
            : newStatus === 'Resolved'
            ? 'Issue addressed and resolved by faculty/staff.'
            : newStatus === 'Closed'
            ? 'Complaint closed by student/admin.'
            : `Status changed to ${newStatus}`);

        const newHistory: ComplaintHistoryEntry = {
          history_id: `HIST-${Date.now().toString().slice(-6)}`,
          complaint_id: complaintId,
          status: newStatus,
          remarks: historyRemark,
          updated_by: `${currentUser.name} (${currentUser.role.toUpperCase()})`,
          updated_date: timeNow,
        };

        return {
          ...c,
          status: newStatus,
          remarks: remarks !== undefined ? remarks : c.remarks,
          resolution: resolution !== undefined ? resolution : c.resolution,
          resolution_date: newStatus === 'Resolved' || newStatus === 'Closed' ? (c.resolution_date || timeNow) : c.resolution_date,
          history: [...c.history, newHistory],
        };
      })
    );
  };

  // CRUD for Students
  const addStudent = (newS: Omit<Student, 'student_id'>) => {
    const id = `STU-00${students.length + 1}`;
    setStudents((prev) => [...prev, { ...newS, student_id: id }]);
  };
  const updateStudent = (s: Student) => {
    setStudents((prev) => prev.map((item) => (item.student_id === s.student_id ? s : item)));
  };
  const deleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((item) => item.student_id !== id));
  };

  // CRUD for Staff
  const addStaff = (newSt: Omit<Staff, 'staff_id'>) => {
    const id = `STF-0${staff.length + 1}`;
    setStaff((prev) => [...prev, { ...newSt, staff_id: id }]);
  };
  const updateStaff = (st: Staff) => {
    setStaff((prev) => prev.map((item) => (item.staff_id === st.staff_id ? st : item)));
  };
  const deleteStaff = (id: string) => {
    setStaff((prev) => prev.filter((item) => item.staff_id !== id));
  };

  // CRUD for Departments
  const addDepartment = (newD: Omit<Department, 'department_id'>) => {
    const id = `DEP-0${departments.length + 1}`;
    setDepartments((prev) => [...prev, { ...newD, department_id: id }]);
  };
  const updateDepartment = (d: Department) => {
    setDepartments((prev) => prev.map((item) => (item.department_id === d.department_id ? d : item)));
  };
  const deleteDepartment = (id: string) => {
    setDepartments((prev) => prev.filter((item) => item.department_id !== id));
  };

  // CRUD for Categories
  const addCategory = (newC: Omit<ComplaintCategory, 'category_id'>) => {
    const id = `CAT-0${categories.length + 1}`;
    setCategories((prev) => [...prev, { ...newC, category_id: id }]);
  };
  const updateCategory = (c: ComplaintCategory) => {
    setCategories((prev) => prev.map((item) => (item.category_id === c.category_id ? c : item)));
  };
  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((item) => item.category_id !== id));
  };

  // Quick Tracking Lookup
  const openTrackerForId = (id: string): boolean => {
    const cleanId = id.trim().toUpperCase();
    const found = complaints.find(
      (c) => c.complaint_id.toUpperCase() === cleanId || c.complaint_id.replace(/-/g, '').toUpperCase() === cleanId.replace(/-/g, '')
    );
    if (found) {
      setTrackedComplaint(found);
      setIsTrackingModalOpen(true);
      return true;
    }
    return false;
  };

  const resetToDefaults = () => {
    localStorage.removeItem(STORAGE_KEYS.COMPLAINTS);
    localStorage.removeItem(STORAGE_KEYS.DEPARTMENTS);
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    localStorage.removeItem(STORAGE_KEYS.STUDENTS);
    localStorage.removeItem(STORAGE_KEYS.STAFF);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ROLE);
    setComplaints(INITIAL_COMPLAINTS);
    setDepartments(INITIAL_DEPARTMENTS);
    setCategories(INITIAL_CATEGORIES);
    setStudents(INITIAL_STUDENTS);
    setStaff(INITIAL_STAFF);
    setCurrentUserRole('student');
    setCurrentUser(INITIAL_USERS[0]);
    alert('System demo data successfully restored to official default records.');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        switchUserRole,
        setCurrentUser,
        currentStudentProfile,
        complaints,
        departments,
        categories,
        students,
        staff,
        users,
        submitComplaint,
        assignComplaint,
        updateComplaintStatus,
        addStudent,
        updateStudent,
        deleteStudent,
        addStaff,
        updateStaff,
        deleteStaff,
        addDepartment,
        updateDepartment,
        deleteDepartment,
        addCategory,
        updateCategory,
        deleteCategory,
        resetToDefaults,
        selectedComplaint,
        setSelectedComplaint,
        isTrackingModalOpen,
        setIsTrackingModalOpen,
        trackedComplaint,
        setTrackedComplaint,
        openTrackerForId,
        isReportsModalOpen,
        setIsReportsModalOpen,
        activeTab,
        setActiveTab,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
