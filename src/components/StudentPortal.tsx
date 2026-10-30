import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Complaint, ComplaintStatus } from '../types';
import {
  Send,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ExternalLink,
  UserCheck,
  Building2,
  Calendar,
  FileText,
  Paperclip,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

export const StudentPortal: React.FC<{ onOpenSubmitModal: () => void }> = ({
  onOpenSubmitModal,
}) => {
  const {
    currentStudentProfile,
    complaints,
    setSelectedComplaint,
    setTrackedComplaint,
    setIsTrackingModalOpen,
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter complaints filed by this student
  const studentComplaints = complaints.filter(
    (c) =>
      c.student_id === currentStudentProfile.student_id ||
      c.roll_number === currentStudentProfile.roll_number ||
      c.student_name.toLowerCase().includes(currentStudentProfile.name.toLowerCase().split(' ')[0])
  );

  const filtered = studentComplaints.filter((c) => {
    if (statusFilter !== 'All' && c.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = c.complaint_id.toLowerCase().includes(q);
      const matchTitle = c.title.toLowerCase().includes(q);
      const matchCat = c.category_name.toLowerCase().includes(q);
      const matchDept = c.department_name.toLowerCase().includes(q);
      if (!matchId && !matchTitle && !matchCat && !matchDept) return false;
    }
    return true;
  });

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

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case 'Critical':
        return 'bg-red-50 text-red-800 border-red-300';
      case 'Urgent':
        return 'bg-amber-50 text-amber-800 border-amber-300';
      default:
        return 'bg-zinc-100 text-zinc-700 border-zinc-200';
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Student Dossier Header Card */}
      <div className="paper-card rounded-2xl p-6 bg-white border border-[#E8E5DD] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#FAF4E8] text-[#963D26] border border-[#DFCBAA] flex items-center justify-center font-serif-heading font-bold text-2xl shadow-xs">
              <GraduationCap className="w-7 h-7 stroke-[1.8]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase text-[#768390] tracking-wider">
                  Verified Student Profile
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#EBF6EE] text-[#1E6B39] border border-[#BCE4C9] font-bold">
                  Enrolled &bull; Active
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-serif-heading text-[#1A1D20]">
                {currentStudentProfile.name}
              </h3>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-[#525B66] font-mono">
                <span>Roll: {currentStudentProfile.roll_number}</span>
                <span>&bull;</span>
                <span>{currentStudentProfile.class} ({currentStudentProfile.division})</span>
                <span>&bull;</span>
                <span>{currentStudentProfile.department}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenSubmitModal}
              className="px-5 py-2.5 rounded-xl bg-[#963D26] hover:bg-[#80331F] text-white text-xs font-bold shadow-sm transition flex items-center gap-2 cursor-pointer border border-[#7D2F1B]"
            >
              <Send className="w-4 h-4" />
              <span>Lodge New Complaint</span>
            </button>
          </div>
        </div>

        {/* Micro Student Stats */}
        <div className="mt-6 pt-6 border-t border-[#EFECE1] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div>
            <span className="text-[#768390] block text-[11px]">Complaints Lodged</span>
            <span className="text-xl font-bold text-[#1A1D20]">{studentComplaints.length}</span>
          </div>
          <div>
            <span className="text-[#768390] block text-[11px]">Pending / Action</span>
            <span className="text-xl font-bold text-[#C25E00]">
              {studentComplaints.filter((c) => c.status !== 'Resolved' && c.status !== 'Closed').length}
            </span>
          </div>
          <div>
            <span className="text-[#768390] block text-[11px]">Resolved</span>
            <span className="text-xl font-bold text-[#234E3E]">
              {studentComplaints.filter((c) => c.status === 'Resolved').length}
            </span>
          </div>
          <div>
            <span className="text-[#768390] block text-[11px]">Archived Closed</span>
            <span className="text-xl font-bold text-[#525B66]">
              {studentComplaints.filter((c) => c.status === 'Closed').length}
            </span>
          </div>
        </div>
      </div>

      {/* Complaint Log Section */}
      <div className="space-y-4">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#EFECE1] rounded-xl border border-[#DDD7C5]">
            {['All', 'Submitted', 'Assigned', 'In Progress', 'Resolved', 'Closed'].map((s) => {
              const count =
                s === 'All'
                  ? studentComplaints.length
                  : studentComplaints.filter((c) => c.status === s).length;
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

          {/* Search box */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Filter by keyword or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs bg-white border border-[#DDD9CF] rounded-xl pl-8 pr-3 py-2 text-[#1A1D20] placeholder-[#8F959E] focus:outline-none focus:border-[#963D26]"
            />
            <Search className="w-3.5 h-3.5 text-[#8F959E] absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Complaints Listing Grid */}
        {filtered.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border-2 border-dashed border-[#DDD7C5] bg-white">
            <FileText className="w-10 h-10 text-[#C2BEB2] mx-auto mb-3" />
            <h4 className="text-base font-bold text-[#1A1D20] font-serif-heading">
              No Complaints Found in this Category
            </h4>
            <p className="text-xs text-[#6F767E] mt-1 max-w-sm mx-auto">
              You haven't submitted any complaint matching the selected status filter.
            </p>
            <button
              onClick={onOpenSubmitModal}
              className="mt-4 px-4 py-2 bg-[#963D26] hover:bg-[#80331F] text-white text-xs font-semibold rounded-lg shadow-sm transition inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit a Complaint Now</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filtered.map((item) => (
              <div
                key={item.complaint_id}
                className="paper-card paper-card-hover rounded-2xl p-5 bg-white border border-[#E8E5DD] flex flex-col justify-between"
              >
                <div>
                  {/* Top metadata tags */}
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
                      <span
                        className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded border ${getPriorityBadge(
                          item.priority
                        )}`}
                      >
                        {item.priority}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] font-mono text-[#768390]">
                      <Calendar className="w-3 h-3" />
                      <span>{item.submission_date}</span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="mt-3">
                    <h4 className="text-base font-bold text-[#1A1D20] font-serif-heading">
                      {item.title}
                    </h4>
                    <p className="mt-1.5 text-xs text-[#525B66] line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Department & Faculty Info */}
                  <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-[#6F767E]">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-[#963D26]" />
                      <span>{item.department_name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-[#234E3E]" />
                      <span>
                        {item.assigned_staff_name ? (
                          <span>Assigned: <strong>{item.assigned_staff_name}</strong></span>
                        ) : (
                          <span className="italic text-[#9AA1A9]">Awaiting Faculty Assignment</span>
                        )}
                      </span>
                    </div>
                    {item.attachment_name && (
                      <div className="flex items-center gap-1 text-[#525B66] font-mono text-[11px] bg-[#FAF8F2] px-2 py-0.5 rounded border border-[#E8E5DD]">
                        <Paperclip className="w-3 h-3 text-[#963D26]" />
                        <span className="truncate max-w-[150px]">{item.attachment_name}</span>
                      </div>
                    )}
                  </div>

                  {/* Remarks preview if available */}
                  {item.remarks && (
                    <div className="mt-3 p-3 rounded-xl bg-[#FAF8F2] border border-[#E9DFCE] text-xs">
                      <span className="text-[10px] font-mono uppercase text-[#963D26] font-bold block mb-0.5">
                        Latest Staff Remark:
                      </span>
                      <p className="text-[#3A4047] line-clamp-1 italic">
                        "{item.remarks}"
                      </p>
                    </div>
                  )}

                  {/* Resolution highlight if resolved */}
                  {item.resolution && (
                    <div className="mt-3 p-3 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] text-xs">
                      <span className="text-[10px] font-mono uppercase text-[#166534] font-bold block mb-0.5">
                        Resolution Redressed:
                      </span>
                      <p className="text-[#14532D] font-medium line-clamp-1">
                        {item.resolution}
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer Buttons */}
                <div className="mt-4 pt-3 border-t border-[#F0ECE1] flex items-center justify-between gap-3">
                  <span className="text-[11px] font-mono text-[#768390]">
                    {item.history.length} lifecycle events recorded
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setTrackedComplaint(item);
                        setIsTrackingModalOpen(true);
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-[#FAF4E8] hover:bg-[#F3E7CE] text-[#963D26] border border-[#DFCBAA] text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Track Progress</span>
                    </button>
                    <button
                      onClick={() => setSelectedComplaint(item)}
                      className="px-3.5 py-1.5 rounded-lg bg-[#234E3E] hover:bg-[#1B3E31] text-white text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer border border-[#1A3A2F]"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>View Dossier</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
