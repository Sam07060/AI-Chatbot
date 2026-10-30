import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Complaint, ComplaintStatus } from '../types';
import {
  Briefcase,
  CheckCircle2,
  Clock,
  FileEdit,
  Building2,
  Calendar,
  AlertCircle,
  FileText,
  Search,
  Check,
  Send,
  X,
} from 'lucide-react';

export const StaffPortal: React.FC = () => {
  const {
    currentUser,
    complaints,
    staff,
    updateComplaintStatus,
    setSelectedComplaint,
    setTrackedComplaint,
    setIsTrackingModalOpen,
  } = useApp();

  const currentStaff = staff.find((s) => s.email === currentUser.email) || staff[0];

  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Status updating modal state
  const [editingComplaint, setEditingComplaint] = useState<Complaint | null>(null);
  const [newStatus, setNewStatus] = useState<ComplaintStatus>('In Progress');
  const [newRemark, setNewRemark] = useState('');
  const [newResolution, setNewResolution] = useState('');

  // Filter complaints assigned to this staff or general department
  const assignedComplaints = complaints.filter(
    (c) =>
      c.assigned_staff_id === currentStaff.staff_id ||
      c.assigned_staff_name === currentStaff.name ||
      c.department_name === currentStaff.department
  );

  const filtered = assignedComplaints.filter((c) => {
    if (statusFilter !== 'All' && c.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = c.complaint_id.toLowerCase().includes(q);
      const matchTitle = c.title.toLowerCase().includes(q);
      const matchStudent = c.student_name.toLowerCase().includes(q);
      if (!matchId && !matchTitle && !matchStudent) return false;
    }
    return true;
  });

  const openUpdateModal = (c: Complaint) => {
    setEditingComplaint(c);
    setNewStatus(c.status === 'Submitted' ? 'Assigned' : c.status === 'Assigned' ? 'In Progress' : c.status);
    setNewRemark(c.remarks || '');
    setNewResolution(c.resolution || '');
  };

  const handleSaveUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingComplaint) return;

    updateComplaintStatus(
      editingComplaint.complaint_id,
      newStatus,
      newRemark.trim(),
      newResolution.trim()
    );

    setEditingComplaint(null);
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
      {/* Faculty Profile Card */}
      <div className="paper-card rounded-2xl p-6 bg-white border border-[#E8E5DD] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#EAF2ED] text-[#234E3E] border border-[#BFD9C7] flex items-center justify-center font-serif-heading font-bold text-2xl shadow-xs">
              <Briefcase className="w-7 h-7 stroke-[1.8]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase text-[#768390] tracking-wider">
                  Faculty Grievance Officer
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#EBF6EE] text-[#1E6B39] border border-[#BCE4C9] font-bold">
                  Authorized Faculty
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-serif-heading text-[#1A1D20]">
                {currentStaff.name}
              </h3>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-[#525B66] font-mono">
                <span>ID: {currentStaff.staff_id}</span>
                <span>&bull;</span>
                <span>{currentStaff.designation}</span>
                <span>&bull;</span>
                <span>{currentStaff.department}</span>
              </div>
            </div>
          </div>

          <div className="text-xs text-[#6F767E] bg-[#FAF8F2] p-3 rounded-xl border border-[#E8E5DD]">
            <span className="font-mono text-[#963D26] font-bold block mb-0.5">SRS Role Responsibility:</span>
            <span>Review assigned student grievances, conduct field inspection, log remarks, and execute verified resolution.</span>
          </div>
        </div>

        {/* Faculty stats */}
        <div className="mt-6 pt-6 border-t border-[#EFECE1] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div>
            <span className="text-[#768390] block text-[11px]">Assigned Queue</span>
            <span className="text-xl font-bold text-[#1A1D20]">{assignedComplaints.length}</span>
          </div>
          <div>
            <span className="text-[#768390] block text-[11px]">Under Investigation</span>
            <span className="text-xl font-bold text-[#C25E00]">
              {assignedComplaints.filter((c) => c.status === 'In Progress' || c.status === 'Assigned').length}
            </span>
          </div>
          <div>
            <span className="text-[#768390] block text-[11px]">Successfully Resolved</span>
            <span className="text-xl font-bold text-[#234E3E]">
              {assignedComplaints.filter((c) => c.status === 'Resolved' || c.status === 'Closed').length}
            </span>
          </div>
          <div>
            <span className="text-[#768390] block text-[11px]">Department Coverage</span>
            <span className="text-xl font-bold text-[#525B66]">{currentStaff.department.split(' ')[0]}</span>
          </div>
        </div>
      </div>

      {/* Assigned Grievance Queue */}
      <div className="space-y-4">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#EFECE1] rounded-xl border border-[#DDD7C5]">
            {['All', 'Assigned', 'In Progress', 'Resolved', 'Closed'].map((s) => {
              const count =
                s === 'All'
                  ? assignedComplaints.length
                  : assignedComplaints.filter((c) => c.status === s).length;
              const isSel = statusFilter === s;
              return (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                    isSel
                      ? 'bg-white text-[#1A1D20] font-bold shadow-xs'
                      : 'text-[#6F767E] hover:text-[#1A1D20]'
                  }`}
                >
                  <span>{s}</span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                      isSel ? 'bg-[#FAF4E8] text-[#963D26]' : 'bg-[#E3DFCE] text-[#6F767E]'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search complaint or student..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs bg-white border border-[#DDD9CF] rounded-xl pl-8 pr-3 py-2 text-[#1A1D20] placeholder-[#8F959E] focus:outline-none focus:border-[#963D26]"
            />
            <Search className="w-3.5 h-3.5 text-[#8F959E] absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Complaints Listing */}
        {filtered.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border-2 border-dashed border-[#DDD7C5] bg-white">
            <CheckCircle2 className="w-10 h-10 text-[#234E3E] mx-auto mb-3" />
            <h4 className="text-base font-bold text-[#1A1D20] font-serif-heading">
              Grievance Queue Clear
            </h4>
            <p className="text-xs text-[#6F767E] mt-1 max-w-sm mx-auto">
              No pending complaints match the selected filter for your department desk.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filtered.map((item) => (
              <div
                key={item.complaint_id}
                className="paper-card paper-card-hover rounded-2xl p-5 bg-white border border-[#E8E5DD] flex flex-col justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#F0ECE1]">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#963D26] bg-[#FAF4E8] px-2.5 py-0.5 rounded border border-[#DFCBAA]">
                        {item.complaint_id}
                      </span>
                      <span
                        className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded border ${getStatusBadge(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                      <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded border bg-zinc-100 text-zinc-800 border-zinc-200">
                        {item.priority}
                      </span>
                    </div>

                    <div className="text-[11px] font-mono text-[#768390] flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{item.submission_date}</span>
                    </div>
                  </div>

                  <div className="mt-3">
                    <h4 className="text-base font-bold text-[#1A1D20] font-serif-heading">
                      {item.title}
                    </h4>
                    <p className="mt-1.5 text-xs text-[#525B66] leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-4 p-3 rounded-xl bg-[#FAF9F5] border border-[#E8E5DD] flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-[#768390] block">
                        Filing Student
                      </span>
                      <strong className="text-[#1A1D20]">{item.student_name}</strong>
                      <span className="text-[#6F767E] ml-2 font-mono">({item.roll_number})</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase text-[#768390] block">
                        Category
                      </span>
                      <span className="text-[#1A1D20] font-medium">{item.category_name}</span>
                    </div>
                  </div>

                  {item.remarks && (
                    <div className="mt-3 p-3 rounded-xl bg-[#FAF8F2] border border-[#E9DFCE] text-xs">
                      <span className="text-[10px] font-mono uppercase text-[#963D26] font-bold block mb-0.5">
                        Your Current Faculty Remarks:
                      </span>
                      <p className="text-[#3A4047]">{item.remarks}</p>
                    </div>
                  )}

                  {item.resolution && (
                    <div className="mt-3 p-3 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] text-xs">
                      <span className="text-[10px] font-mono uppercase text-[#166534] font-bold block mb-0.5">
                        Recorded Resolution Statement:
                      </span>
                      <p className="text-[#14532D] font-medium">{item.resolution}</p>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-[#F0ECE1] flex items-center justify-between gap-3">
                  <span className="text-[11px] font-mono text-[#768390]">
                    {item.history.length} audit records
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setTrackedComplaint(item);
                        setIsTrackingModalOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#FAF9F5] text-[#554C3E] border border-[#DDD9CF] text-xs font-medium transition cursor-pointer"
                    >
                      History Audit
                    </button>
                    <button
                      onClick={() => openUpdateModal(item)}
                      className="px-4 py-1.5 rounded-lg bg-[#234E3E] hover:bg-[#1B3E31] text-white text-xs font-semibold shadow-sm transition flex items-center gap-1.5 cursor-pointer border border-[#1A3A2F]"
                    >
                      <FileEdit className="w-3.5 h-3.5" />
                      <span>Update Status & Remarks</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Faculty Update Status Modal */}
      {editingComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#DDD9CF] overflow-hidden text-left">
            <div className="bg-[#FAF8F2] px-6 py-4 border-b border-[#E8E5DD] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#963D26] font-bold">
                  SRS Section 9.4: Staff Module
                </span>
                <h4 className="text-base font-bold text-[#1A1D20] font-serif-heading">
                  Update Complaint #{editingComplaint.complaint_id}
                </h4>
              </div>
              <button
                onClick={() => setEditingComplaint(null)}
                className="p-1 rounded-md text-[#768390] hover:text-[#1A1D20] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUpdate} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1A1D20] mb-1 font-mono uppercase">
                  Lifecycle Status *
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as ComplaintStatus)}
                  className="w-full text-xs bg-white border border-[#DDD9CF] rounded-lg p-2.5 text-[#1A1D20] focus:outline-none focus:border-[#963D26]"
                >
                  <option value="Assigned">Assigned (Under Review)</option>
                  <option value="In Progress">In Progress (Field Inspection / Repair)</option>
                  <option value="Resolved">Resolved (Corrective Action Finished)</option>
                  <option value="Closed">Closed (Confirmed & Archived)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A1D20] mb-1 font-mono uppercase">
                  Faculty Remarks / Inspection Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Record your inspection findings, technician notes, or spare parts ordered..."
                  value={newRemark}
                  onChange={(e) => setNewRemark(e.target.value)}
                  className="w-full text-xs bg-white border border-[#DDD9CF] rounded-lg p-2.5 text-[#1A1D20] focus:outline-none focus:border-[#963D26]"
                />
              </div>

              {newStatus === 'Resolved' && (
                <div>
                  <label className="block text-xs font-bold text-[#166534] mb-1 font-mono uppercase">
                    Official Resolution Statement *
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Explicitly describe what was repaired or redressed so the student has complete clarity..."
                    value={newResolution}
                    onChange={(e) => setNewResolution(e.target.value)}
                    className="w-full text-xs bg-[#F0FDF4] border border-[#86EFAC] rounded-lg p-2.5 text-[#14532D] focus:outline-none focus:border-[#166534]"
                    required
                  />
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingComplaint(null)}
                  className="px-4 py-2 bg-white hover:bg-[#F8F7F2] text-[#554C3E] text-xs font-medium rounded-lg border border-[#DDD9CF] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#234E3E] hover:bg-[#1B3E31] text-white text-xs font-semibold rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Status & Stamp History</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
