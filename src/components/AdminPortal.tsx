import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Complaint, ComplaintStatus, Student, Staff, Department, ComplaintCategory } from '../types';
import {
  Building2,
  Users,
  GraduationCap,
  Layers,
  FolderTree,
  UserPlus,
  Plus,
  Trash2,
  Edit2,
  UserCheck,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  FileBarChart2,
  X,
  Check,
} from 'lucide-react';

export const AdminPortal: React.FC = () => {
  const {
    complaints,
    students,
    staff,
    departments,
    categories,
    assignComplaint,
    addStudent,
    deleteStudent,
    addStaff,
    deleteStaff,
    addDepartment,
    deleteDepartment,
    addCategory,
    deleteCategory,
    setSelectedComplaint,
    setTrackedComplaint,
    setIsTrackingModalOpen,
    setIsReportsModalOpen,
  } = useApp();

  const [adminTab, setAdminTab] = useState<'complaints' | 'students' | 'staff' | 'departments' | 'categories'>('complaints');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [deptFilter, setDeptFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Assignment Modal
  const [assigningComplaint, setAssigningComplaint] = useState<Complaint | null>(null);
  const [selectedDeptId, setSelectedDeptId] = useState('');
  const [selectedStaffId, setSelectedStaffId] = useState('');

  // Add Student Modal
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentRoll, setNewStudentRoll] = useState('');
  const [newStudentClass, setNewStudentClass] = useState('T.E. Computer Engineering');
  const [newStudentDiv, setNewStudentDiv] = useState('Div A');
  const [newStudentDept, setNewStudentDept] = useState('Computer Engineering');
  const [newStudentEmail, setNewStudentEmail] = useState('');

  // Add Staff Modal
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffDept, setNewStaffDept] = useState('Computer Engineering');
  const [newStaffDesig, setNewStaffDesig] = useState('Assistant Professor');

  // Add Dept Modal
  const [isAddDeptOpen, setIsAddDeptOpen] = useState(false);
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptCode, setNewDeptCode] = useState('');
  const [newDeptHead, setNewDeptHead] = useState('');

  // Add Category Modal
  const [isAddCatOpen, setIsAddCatOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatDeptId, setNewCatDeptId] = useState('DEP-01');

  // Filter complaints
  const filteredComplaints = complaints.filter((c) => {
    if (statusFilter !== 'All' && c.status !== statusFilter) return false;
    if (deptFilter !== 'All' && c.department_id !== deptFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = c.complaint_id.toLowerCase().includes(q);
      const matchTitle = c.title.toLowerCase().includes(q);
      const matchStudent = c.student_name.toLowerCase().includes(q);
      if (!matchId && !matchTitle && !matchStudent) return false;
    }
    return true;
  });

  const openAssignModal = (c: Complaint) => {
    setAssigningComplaint(c);
    setSelectedDeptId(c.department_id || departments[0]?.department_id || '');
    const firstStaff = staff.find((s) => s.department === c.department_name) || staff[0];
    setSelectedStaffId(firstStaff?.staff_id || '');
  };

  const handleConfirmAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigningComplaint) return;
    assignComplaint(assigningComplaint.complaint_id, selectedDeptId, selectedStaffId);
    setAssigningComplaint(null);
  };

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim() || !newStudentRoll.trim()) return;
    addStudent({
      name: newStudentName.trim(),
      roll_number: newStudentRoll.trim(),
      class: newStudentClass,
      division: newStudentDiv,
      department: newStudentDept,
      email: newStudentEmail || `${newStudentName.toLowerCase().replace(/\s+/g, '.')}@college.edu`,
      phone: '+91 98000 12345',
    });
    setNewStudentName('');
    setNewStudentRoll('');
    setNewStudentEmail('');
    setIsAddStudentOpen(false);
  };

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName.trim()) return;
    addStaff({
      name: newStaffName.trim(),
      email: newStaffEmail || `${newStaffName.toLowerCase().replace(/\s+/g, '.')}@college.edu`,
      department: newStaffDept,
      designation: newStaffDesig,
      phone: '+91 94000 54321',
    });
    setNewStaffName('');
    setNewStaffEmail('');
    setIsAddStaffOpen(false);
  };

  const handleCreateDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptName.trim() || !newDeptCode.trim()) return;
    addDepartment({
      department_name: newDeptName.trim(),
      code: newDeptCode.trim().toUpperCase(),
      head_name: newDeptHead.trim() || 'Department Head',
    });
    setNewDeptName('');
    setNewDeptCode('');
    setNewDeptHead('');
    setIsAddDeptOpen(false);
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    addCategory({
      category_name: newCatName.trim(),
      description: newCatDesc.trim() || 'General inquiry and grievance classification.',
      default_department_id: newCatDeptId,
    });
    setNewCatName('');
    setNewCatDesc('');
    setIsAddCatOpen(false);
  };

  const getStatusBadge = (s: ComplaintStatus) => {
    switch (s) {
      case 'Submitted':
        return 'bg-zinc-100 text-zinc-800 border-zinc-300';
      case 'Assigned':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'In Progress':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Resolved':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Closed':
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Admin Top Navigation Tabs */}
      <div className="paper-card rounded-2xl p-4 bg-white border border-[#E8E5DD] shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setAdminTab('complaints')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-2 ${
              adminTab === 'complaints'
                ? 'bg-[#1C2E28] text-white shadow-xs'
                : 'text-[#554C3E] hover:bg-[#FAF8F2]'
            }`}
          >
            <FolderTree className="w-3.5 h-3.5" />
            <span>Complaints Management</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-white/20">
              {complaints.length}
            </span>
          </button>

          <button
            onClick={() => setAdminTab('students')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-2 ${
              adminTab === 'students'
                ? 'bg-[#1C2E28] text-white shadow-xs'
                : 'text-[#554C3E] hover:bg-[#FAF8F2]'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Students ({students.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('staff')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-2 ${
              adminTab === 'staff'
                ? 'bg-[#1C2E28] text-white shadow-xs'
                : 'text-[#554C3E] hover:bg-[#FAF8F2]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Staff / Faculty ({staff.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('departments')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-2 ${
              adminTab === 'departments'
                ? 'bg-[#1C2E28] text-white shadow-xs'
                : 'text-[#554C3E] hover:bg-[#FAF8F2]'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Departments ({departments.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('categories')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-2 ${
              adminTab === 'categories'
                ? 'bg-[#1C2E28] text-white shadow-xs'
                : 'text-[#554C3E] hover:bg-[#FAF8F2]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Categories ({categories.length})</span>
          </button>
        </div>

        <button
          onClick={() => setIsReportsModalOpen(true)}
          className="px-4 py-2 bg-[#963D26] hover:bg-[#80331F] text-white text-xs font-semibold rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer border border-[#7D2F1B]"
        >
          <FileBarChart2 className="w-4 h-4" />
          <span>Generate SRS Reports</span>
        </button>
      </div>

      {/* Tab 1: Complaints Management */}
      {adminTab === 'complaints' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex flex-wrap items-center gap-1 p-1 bg-[#EFECE1] rounded-xl border border-[#DDD7C5]">
                {['All', 'Submitted', 'Assigned', 'In Progress', 'Resolved', 'Closed'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer ${
                      statusFilter === s ? 'bg-white text-[#1A1D20] font-bold shadow-xs' : 'text-[#6F767E]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="text-xs bg-white border border-[#DDD9CF] rounded-xl px-2.5 py-1.5 text-[#1A1D20] focus:outline-none"
              >
                <option value="All">All Departments</option>
                {departments.map((d) => (
                  <option key={d.department_id} value={d.department_id}>
                    {d.department_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search ID, student, keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs bg-white border border-[#DDD9CF] rounded-xl pl-8 pr-3 py-2 text-[#1A1D20] focus:outline-none"
              />
              <Search className="w-3.5 h-3.5 text-[#8F959E] absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Table View of Complaints */}
          <div className="border border-[#E8E5DD] rounded-2xl overflow-hidden bg-white shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs divide-y divide-[#E8E5DD]">
                <thead className="bg-[#FAF8F2] text-[#615B4C] font-mono uppercase text-[10px]">
                  <tr>
                    <th className="px-4 py-3">ID & Date</th>
                    <th className="px-4 py-3">Student & Roll</th>
                    <th className="px-4 py-3">Subject & Category</th>
                    <th className="px-4 py-3">Department</th>
                    <th className="px-4 py-3">Assigned Faculty</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E5DD]">
                  {filteredComplaints.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-[#768390]">
                        No complaints match this filter.
                      </td>
                    </tr>
                  ) : (
                    filteredComplaints.map((item) => (
                      <tr key={item.complaint_id} className="hover:bg-[#FAF9F5] transition">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="font-mono font-bold text-[#963D26] block">
                            {item.complaint_id}
                          </span>
                          <span className="text-[10px] text-[#768390] font-mono">
                            {item.submission_date.split(' ')[0]}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-[#1A1D20]">{item.student_name}</div>
                          <div className="text-[10px] font-mono text-[#768390]">{item.roll_number}</div>
                        </td>
                        <td className="px-4 py-3 max-w-xs">
                          <div className="font-medium text-[#1A1D20] truncate">{item.title}</div>
                          <div className="text-[11px] text-[#6F767E] truncate">{item.category_name}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-[#525B66]">
                          {item.department_name}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {item.assigned_staff_name ? (
                            <span className="font-medium text-[#1A1D20]">{item.assigned_staff_name}</span>
                          ) : (
                            <span className="text-[11px] text-amber-700 italic">Unassigned</span>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded border ${getStatusBadge(
                              item.status
                            )}`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right space-x-1">
                          <button
                            onClick={() => openAssignModal(item)}
                            className="px-2.5 py-1 bg-[#FAF4E8] hover:bg-[#F3E7CE] text-[#963D26] border border-[#DFCBAA] rounded text-[11px] font-medium transition cursor-pointer"
                          >
                            {item.assigned_staff_name ? 'Reassign' : 'Assign'}
                          </button>
                          <button
                            onClick={() => {
                              setTrackedComplaint(item);
                              setIsTrackingModalOpen(true);
                            }}
                            className="px-2.5 py-1 bg-white hover:bg-[#FAF9F5] text-[#554C3E] border border-[#DDD9CF] rounded text-[11px] transition cursor-pointer"
                          >
                            Audit
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Students Management */}
      {adminTab === 'students' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-bold text-[#1A1D20] font-serif-heading">
              Enrolled Students Directory ({students.length} Accounts)
            </h4>
            <button
              onClick={() => setIsAddStudentOpen(true)}
              className="px-3.5 py-2 bg-[#234E3E] hover:bg-[#1B3E31] text-white text-xs font-semibold rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer border border-[#1A3A2F]"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Enroll New Student</span>
            </button>
          </div>

          <div className="border border-[#E8E5DD] rounded-2xl overflow-hidden bg-white shadow-xs">
            <table className="w-full text-left text-xs divide-y divide-[#E8E5DD]">
              <thead className="bg-[#FAF8F2] text-[#615B4C] font-mono uppercase text-[10px]">
                <tr>
                  <th className="px-4 py-3">Student ID</th>
                  <th className="px-4 py-3">Full Name</th>
                  <th className="px-4 py-3">Roll Number</th>
                  <th className="px-4 py-3">Class & Division</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Email Address</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E5DD]">
                {students.map((st) => (
                  <tr key={st.student_id} className="hover:bg-[#FAF9F5] transition">
                    <td className="px-4 py-3 font-mono font-bold text-[#963D26]">{st.student_id}</td>
                    <td className="px-4 py-3 font-semibold text-[#1A1D20]">{st.name}</td>
                    <td className="px-4 py-3 font-mono text-[#525B66]">{st.roll_number}</td>
                    <td className="px-4 py-3 text-[#525B66]">
                      {st.class} ({st.division})
                    </td>
                    <td className="px-4 py-3 text-[#525B66]">{st.department}</td>
                    <td className="px-4 py-3 text-[#6F767E] font-mono">{st.email}</td>
                    <td className="px-4 py-3 text-right">
                      {st.student_id !== 'STU-001' && (
                        <button
                          onClick={() => deleteStudent(st.student_id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition cursor-pointer"
                          title="Delete Student"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Staff Management */}
      {adminTab === 'staff' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-bold text-[#1A1D20] font-serif-heading">
              Faculty Grievance Officers ({staff.length} Members)
            </h4>
            <button
              onClick={() => setIsAddStaffOpen(true)}
              className="px-3.5 py-2 bg-[#234E3E] hover:bg-[#1B3E31] text-white text-xs font-semibold rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer border border-[#1A3A2F]"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add Faculty Officer</span>
            </button>
          </div>

          <div className="border border-[#E8E5DD] rounded-2xl overflow-hidden bg-white shadow-xs">
            <table className="w-full text-left text-xs divide-y divide-[#E8E5DD]">
              <thead className="bg-[#FAF8F2] text-[#615B4C] font-mono uppercase text-[10px]">
                <tr>
                  <th className="px-4 py-3">Staff ID</th>
                  <th className="px-4 py-3">Faculty Name</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Designation</th>
                  <th className="px-4 py-3">Email Address</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E5DD]">
                {staff.map((st) => (
                  <tr key={st.staff_id} className="hover:bg-[#FAF9F5] transition">
                    <td className="px-4 py-3 font-mono font-bold text-[#234E3E]">{st.staff_id}</td>
                    <td className="px-4 py-3 font-semibold text-[#1A1D20]">{st.name}</td>
                    <td className="px-4 py-3 text-[#525B66]">{st.department}</td>
                    <td className="px-4 py-3 text-[#525B66]">{st.designation}</td>
                    <td className="px-4 py-3 text-[#6F767E] font-mono">{st.email}</td>
                    <td className="px-4 py-3 text-right">
                      {st.staff_id !== 'STF-01' && (
                        <button
                          onClick={() => deleteStaff(st.staff_id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Departments */}
      {adminTab === 'departments' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-bold text-[#1A1D20] font-serif-heading">
              Academic & Facilities Departments ({departments.length})
            </h4>
            <button
              onClick={() => setIsAddDeptOpen(true)}
              className="px-3.5 py-2 bg-[#234E3E] hover:bg-[#1B3E31] text-white text-xs font-semibold rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer border border-[#1A3A2F]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Department</span>
            </button>
          </div>

          <div className="border border-[#E8E5DD] rounded-2xl overflow-hidden bg-white shadow-xs">
            <table className="w-full text-left text-xs divide-y divide-[#E8E5DD]">
              <thead className="bg-[#FAF8F2] text-[#615B4C] font-mono uppercase text-[10px]">
                <tr>
                  <th className="px-4 py-3">Dept ID</th>
                  <th className="px-4 py-3">Department Name</th>
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Head of Department / Custodian</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E5DD]">
                {departments.map((d) => (
                  <tr key={d.department_id} className="hover:bg-[#FAF9F5] transition">
                    <td className="px-4 py-3 font-mono font-bold text-[#963D26]">{d.department_id}</td>
                    <td className="px-4 py-3 font-semibold text-[#1A1D20]">{d.department_name}</td>
                    <td className="px-4 py-3 font-mono text-[#525B66]">{d.code}</td>
                    <td className="px-4 py-3 text-[#525B66]">{d.head_name}</td>
                    <td className="px-4 py-3 text-right">
                      {d.department_id !== 'DEP-01' && (
                        <button
                          onClick={() => deleteDepartment(d.department_id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Categories */}
      {adminTab === 'categories' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-bold text-[#1A1D20] font-serif-heading">
              Grievance Classifications & Categories ({categories.length})
            </h4>
            <button
              onClick={() => setIsAddCatOpen(true)}
              className="px-3.5 py-2 bg-[#234E3E] hover:bg-[#1B3E31] text-white text-xs font-semibold rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer border border-[#1A3A2F]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Category</span>
            </button>
          </div>

          <div className="border border-[#E8E5DD] rounded-2xl overflow-hidden bg-white shadow-xs">
            <table className="w-full text-left text-xs divide-y divide-[#E8E5DD]">
              <thead className="bg-[#FAF8F2] text-[#615B4C] font-mono uppercase text-[10px]">
                <tr>
                  <th className="px-4 py-3">Cat ID</th>
                  <th className="px-4 py-3">Category Name</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Default Department</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E5DD]">
                {categories.map((c) => {
                  const targetDept = departments.find((d) => d.department_id === c.default_department_id);
                  return (
                    <tr key={c.category_id} className="hover:bg-[#FAF9F5] transition">
                      <td className="px-4 py-3 font-mono font-bold text-[#963D26]">{c.category_id}</td>
                      <td className="px-4 py-3 font-semibold text-[#1A1D20]">{c.category_name}</td>
                      <td className="px-4 py-3 text-[#525B66] max-w-sm">{c.description}</td>
                      <td className="px-4 py-3 font-mono text-[#525B66]">
                        {targetDept?.department_name || c.default_department_id}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {c.category_id !== 'CAT-01' && (
                          <button
                            onClick={() => deleteCategory(c.category_id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded transition cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Assignment Modal */}
      {assigningComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#DDD9CF] overflow-hidden text-left">
            <div className="bg-[#FAF8F2] px-6 py-4 border-b border-[#E8E5DD] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#963D26] font-bold">
                  SRS Section 9.2: Assign Complaint
                </span>
                <h4 className="text-base font-bold text-[#1A1D20] font-serif-heading">
                  Assign #{assigningComplaint.complaint_id}
                </h4>
              </div>
              <button
                onClick={() => setAssigningComplaint(null)}
                className="p-1 rounded-md text-[#768390] hover:text-[#1A1D20] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmAssignment} className="p-6 space-y-4">
              <div className="p-3 rounded-xl bg-[#FAF9F5] border border-[#E8E5DD] text-xs">
                <span className="font-semibold text-[#1A1D20] block">{assigningComplaint.title}</span>
                <span className="text-[#6F767E] text-[11px]">
                  Filed by {assigningComplaint.student_name} ({assigningComplaint.roll_number})
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A1D20] mb-1 font-mono uppercase">
                  Target Department *
                </label>
                <select
                  value={selectedDeptId}
                  onChange={(e) => {
                    setSelectedDeptId(e.target.value);
                    const matchingStaff = staff.find((s) => s.department === departments.find(d => d.department_id === e.target.value)?.department_name);
                    if (matchingStaff) setSelectedStaffId(matchingStaff.staff_id);
                  }}
                  className="w-full text-xs bg-white border border-[#DDD9CF] rounded-lg p-2.5 text-[#1A1D20]"
                  required
                >
                  {departments.map((d) => (
                    <option key={d.department_id} value={d.department_id}>
                      {d.department_name} ({d.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A1D20] mb-1 font-mono uppercase">
                  Assigned Faculty Officer *
                </label>
                <select
                  value={selectedStaffId}
                  onChange={(e) => setSelectedStaffId(e.target.value)}
                  className="w-full text-xs bg-white border border-[#DDD9CF] rounded-lg p-2.5 text-[#1A1D20]"
                  required
                >
                  {staff.map((s) => (
                    <option key={s.staff_id} value={s.staff_id}>
                      {s.name} - {s.designation} ({s.department})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setAssigningComplaint(null)}
                  className="px-4 py-2 bg-white text-[#554C3E] text-xs font-medium rounded-lg border border-[#DDD9CF] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#963D26] hover:bg-[#80331F] text-white text-xs font-semibold rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Confirm Assignment</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {isAddStudentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#DDD9CF] overflow-hidden text-left">
            <div className="bg-[#FAF8F2] px-6 py-4 border-b border-[#E8E5DD] flex items-center justify-between">
              <h4 className="text-base font-bold text-[#1A1D20] font-serif-heading">
                Enroll New Student
              </h4>
              <button onClick={() => setIsAddStudentOpen(false)}>
                <X className="w-5 h-5 text-[#768390]" />
              </button>
            </div>
            <form onSubmit={handleCreateStudent} className="p-6 space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tanvi Kulkarni"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  className="w-full border border-[#DDD9CF] rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Roll Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2024-COMP-088"
                  value={newStudentRoll}
                  onChange={(e) => setNewStudentRoll(e.target.value)}
                  className="w-full border border-[#DDD9CF] rounded-lg p-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold mb-1">Class</label>
                  <input
                    type="text"
                    value={newStudentClass}
                    onChange={(e) => setNewStudentClass(e.target.value)}
                    className="w-full border border-[#DDD9CF] rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Division</label>
                  <input
                    type="text"
                    value={newStudentDiv}
                    onChange={(e) => setNewStudentDiv(e.target.value)}
                    className="w-full border border-[#DDD9CF] rounded-lg p-2"
                  />
                </div>
              </div>
              <div>
                <label className="block font-bold mb-1">Department</label>
                <select
                  value={newStudentDept}
                  onChange={(e) => setNewStudentDept(e.target.value)}
                  className="w-full border border-[#DDD9CF] rounded-lg p-2"
                >
                  {departments.map((d) => (
                    <option key={d.department_id} value={d.department_name}>
                      {d.department_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddStudentOpen(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#234E3E] text-white font-semibold rounded-lg"
                >
                  Save Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Staff Modal */}
      {isAddStaffOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#DDD9CF] overflow-hidden text-left">
            <div className="bg-[#FAF8F2] px-6 py-4 border-b border-[#E8E5DD] flex items-center justify-between">
              <h4 className="text-base font-bold text-[#1A1D20] font-serif-heading">
                Add Faculty Grievance Officer
              </h4>
              <button onClick={() => setIsAddStaffOpen(false)}>
                <X className="w-5 h-5 text-[#768390]" />
              </button>
            </div>
            <form onSubmit={handleCreateStaff} className="p-6 space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Faculty Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Prof. Nilesh Shinde"
                  value={newStaffName}
                  onChange={(e) => setNewStaffName(e.target.value)}
                  className="w-full border border-[#DDD9CF] rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Designation</label>
                <input
                  type="text"
                  value={newStaffDesig}
                  onChange={(e) => setNewStaffDesig(e.target.value)}
                  className="w-full border border-[#DDD9CF] rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Department</label>
                <select
                  value={newStaffDept}
                  onChange={(e) => setNewStaffDept(e.target.value)}
                  className="w-full border border-[#DDD9CF] rounded-lg p-2"
                >
                  {departments.map((d) => (
                    <option key={d.department_id} value={d.department_name}>
                      {d.department_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddStaffOpen(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#234E3E] text-white font-semibold rounded-lg"
                >
                  Save Officer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Dept Modal */}
      {isAddDeptOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#DDD9CF] overflow-hidden text-left">
            <div className="bg-[#FAF8F2] px-6 py-4 border-b border-[#E8E5DD] flex items-center justify-between">
              <h4 className="text-base font-bold text-[#1A1D20] font-serif-heading">
                Add Academic / Facility Department
              </h4>
              <button onClick={() => setIsAddDeptOpen(false)}>
                <X className="w-5 h-5 text-[#768390]" />
              </button>
            </div>
            <form onSubmit={handleCreateDepartment} className="p-6 space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Department Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sports & Physical Education"
                  value={newDeptName}
                  onChange={(e) => setNewDeptName(e.target.value)}
                  className="w-full border border-[#DDD9CF] rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Code (Short) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SPORTS"
                  value={newDeptCode}
                  onChange={(e) => setNewDeptCode(e.target.value)}
                  className="w-full border border-[#DDD9CF] rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Head / In-Charge Name</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. K. R. Gaikwad"
                  value={newDeptHead}
                  onChange={(e) => setNewDeptHead(e.target.value)}
                  className="w-full border border-[#DDD9CF] rounded-lg p-2"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddDeptOpen(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#234E3E] text-white font-semibold rounded-lg"
                >
                  Save Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {isAddCatOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#DDD9CF] overflow-hidden text-left">
            <div className="bg-[#FAF8F2] px-6 py-4 border-b border-[#E8E5DD] flex items-center justify-between">
              <h4 className="text-base font-bold text-[#1A1D20] font-serif-heading">
                Add Grievance Category
              </h4>
              <button onClick={() => setIsAddCatOpen(false)}>
                <X className="w-5 h-5 text-[#768390]" />
              </button>
            </div>
            <form onSubmit={handleCreateCategory} className="p-6 space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Category Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Canteen Hygiene & Food Quality"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full border border-[#DDD9CF] rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Description of issues covered by this category..."
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  className="w-full border border-[#DDD9CF] rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Default Department</label>
                <select
                  value={newCatDeptId}
                  onChange={(e) => setNewCatDeptId(e.target.value)}
                  className="w-full border border-[#DDD9CF] rounded-lg p-2"
                >
                  {departments.map((d) => (
                    <option key={d.department_id} value={d.department_id}>
                      {d.department_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddCatOpen(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#234E3E] text-white font-semibold rounded-lg"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
