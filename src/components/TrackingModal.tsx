import React from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  CheckCircle2,
  Clock,
  Send,
  UserCheck,
  Building2,
  Calendar,
  AlertTriangle,
  FileText,
  Printer,
  ShieldCheck,
} from 'lucide-react';
import { ComplaintStatus } from '../types';

export const TrackingModal: React.FC = () => {
  const {
    isTrackingModalOpen,
    setIsTrackingModalOpen,
    trackedComplaint,
    updateComplaintStatus,
    currentUser,
  } = useApp();

  if (!isTrackingModalOpen || !trackedComplaint) return null;

  const statuses: ComplaintStatus[] = [
    'Submitted',
    'Assigned',
    'In Progress',
    'Resolved',
    'Closed',
  ];

  const currentStatusIndex = statuses.indexOf(trackedComplaint.status);

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case 'Critical':
        return 'bg-red-50 text-red-800 border-red-300';
      case 'Urgent':
        return 'bg-amber-50 text-amber-800 border-amber-300';
      default:
        return 'bg-zinc-100 text-zinc-800 border-zinc-300';
    }
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

  const handleCloseComplaint = () => {
    if (confirm('Are you sure you want to mark this resolved complaint as officially Closed?')) {
      updateComplaintStatus(
        trackedComplaint.complaint_id,
        'Closed',
        'Student verified and confirmed satisfactory resolution.',
        trackedComplaint.resolution
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-[#DDD9CF] overflow-hidden">
        {/* Header */}
        <div className="bg-[#FAF8F2] px-6 py-4 border-b border-[#E8E5DD] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#FAF4E8] text-[#963D26] border border-[#DFCBAA] flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#963D26]">
                  {trackedComplaint.complaint_id}
                </span>
                <span
                  className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded border ${getStatusBadge(
                    trackedComplaint.status
                  )}`}
                >
                  {trackedComplaint.status}
                </span>
                <span
                  className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded border ${getPriorityBadge(
                    trackedComplaint.priority
                  )}`}
                >
                  {trackedComplaint.priority} Priority
                </span>
              </div>
              <h3 className="text-base font-bold text-[#1A1D20] font-serif-heading">
                Live Complaint Lifecycle Tracker
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="p-1.5 rounded-lg border border-[#DDD9CF] bg-white text-[#525B66] hover:bg-[#F8F7F2] transition cursor-pointer"
              title="Print Dossier"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsTrackingModalOpen(false)}
              className="p-1.5 rounded-lg border border-[#DDD9CF] bg-white text-[#525B66] hover:bg-[#F8F7F2] transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stepper Progress Bar (SRS 5 Statuses) */}
        <div className="px-6 py-5 bg-[#FAF9F5] border-b border-[#E8E5DD]">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-[#DDD7C5] -z-0" />
            <div
              className="absolute left-6 top-1/2 -translate-y-1/2 h-0.5 bg-[#234E3E] transition-all duration-500 -z-0"
              style={{
                width: `${(currentStatusIndex / (statuses.length - 1)) * 100}%`,
              }}
            />

            {statuses.map((s, idx) => {
              const isPastOrCurrent = idx <= currentStatusIndex;
              const isCurrent = idx === currentStatusIndex;
              return (
                <div key={s} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all border-2 ${
                      isCurrent
                        ? 'bg-[#963D26] text-white border-[#80331F] scale-110 shadow-sm'
                        : isPastOrCurrent
                        ? 'bg-[#234E3E] text-white border-[#1A3A2F]'
                        : 'bg-white text-[#8F959E] border-[#DDD7C5]'
                    }`}
                  >
                    {isPastOrCurrent && !isCurrent ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      idx + 1
                    )}
                  </div>
                  <span
                    className={`mt-1.5 text-[11px] font-mono tracking-tight font-medium ${
                      isCurrent
                        ? 'text-[#963D26] font-bold'
                        : isPastOrCurrent
                        ? 'text-[#234E3E]'
                        : 'text-[#8F959E]'
                    }`}
                  >
                    {s}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-5 text-left">
          {/* Main Summary */}
          <div>
            <h4 className="text-lg font-bold text-[#1A1D20] font-serif-heading">
              {trackedComplaint.title}
            </h4>
            <p className="mt-2 text-xs text-[#4F5661] leading-relaxed bg-[#FDFCFA] p-3.5 rounded-xl border border-[#E8E5DD]">
              {trackedComplaint.description}
            </p>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-[#FAF9F5] border border-[#E8E5DD]">
              <span className="text-[10px] font-mono uppercase text-[#768390] block">
                Complainant
              </span>
              <strong className="text-[#1A1D20] block truncate">
                {trackedComplaint.student_name}
              </strong>
              <span className="text-[11px] text-[#6F767E] font-mono">
                {trackedComplaint.roll_number}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-[#FAF9F5] border border-[#E8E5DD]">
              <span className="text-[10px] font-mono uppercase text-[#768390] block">
                Department
              </span>
              <strong className="text-[#1A1D20] block truncate">
                {trackedComplaint.department_name}
              </strong>
              <span className="text-[11px] text-[#6F767E]">Academic Wing</span>
            </div>

            <div className="p-3 rounded-lg bg-[#FAF9F5] border border-[#E8E5DD]">
              <span className="text-[10px] font-mono uppercase text-[#768390] block">
                Category
              </span>
              <strong className="text-[#1A1D20] block truncate">
                {trackedComplaint.category_name}
              </strong>
              <span className="text-[11px] text-[#6F767E]">Classified Type</span>
            </div>

            <div className="p-3 rounded-lg bg-[#FAF9F5] border border-[#E8E5DD]">
              <span className="text-[10px] font-mono uppercase text-[#768390] block">
                Assigned Staff
              </span>
              <strong className="text-[#1A1D20] block truncate">
                {trackedComplaint.assigned_staff_name || 'Pending Assignment'}
              </strong>
              <span className="text-[11px] text-[#6F767E]">
                {trackedComplaint.assigned_staff_name ? 'Faculty Custodian' : 'Awaiting Dean'}
              </span>
            </div>
          </div>

          {/* Resolution Details & Remarks */}
          <div className="space-y-3">
            {trackedComplaint.remarks && (
              <div className="p-3.5 rounded-xl bg-[#FAF8F2] border border-[#E9DFCE] text-xs">
                <span className="text-[10px] font-mono uppercase text-[#963D26] font-bold block mb-1">
                  Faculty Remarks / Investigation Notes
                </span>
                <p className="text-[#3A4047] leading-relaxed">
                  {trackedComplaint.remarks}
                </p>
              </div>
            )}

            {trackedComplaint.resolution ? (
              <div className="p-3.5 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono uppercase text-[#166534] font-bold">
                    Official Resolution Summary
                  </span>
                  {trackedComplaint.resolution_date && (
                    <span className="text-[10px] font-mono text-[#166534]">
                      Resolved on: {trackedComplaint.resolution_date}
                    </span>
                  )}
                </div>
                <p className="text-[#14532D] leading-relaxed font-medium">
                  {trackedComplaint.resolution}
                </p>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-[#FAF9F5] border border-[#E8E5DD] text-xs text-[#6F767E] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#C25E00]" />
                <span>
                  Investigation currently underway by designated faculty. Official resolution will appear here upon completion.
                </span>
              </div>
            )}
          </div>

          {/* Historical Audit Trail (SRS Section 9.5 & 15 Complaint History) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h5 className="text-xs font-mono font-bold uppercase text-[#1A1D20] tracking-wider">
                Full Immutable Audit History ({trackedComplaint.history.length} Events)
              </h5>
            </div>
            <div className="border border-[#E8E5DD] rounded-xl overflow-hidden bg-white text-xs divide-y divide-[#E8E5DD]">
              {trackedComplaint.history.map((h, i) => (
                <div key={h.history_id || i} className="p-3 hover:bg-[#FAF9F5] transition flex items-start justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#1A1D20]">
                        {h.status}
                      </span>
                      <span className="text-[10px] font-mono text-[#768390]">
                        &bull; by {h.updated_by}
                      </span>
                    </div>
                    <p className="text-[#525B66] text-[11px] leading-relaxed">
                      {h.remarks}
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-[#768390] whitespace-nowrap">
                    {h.updated_date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-[#FAF8F2] px-6 py-3.5 border-t border-[#E8E5DD] flex items-center justify-between">
          <div className="text-[11px] font-mono text-[#768390]">
            Logged under College Complaint System ERP
          </div>
          <div className="flex items-center gap-2">
            {trackedComplaint.status === 'Resolved' && (
              <button
                onClick={handleCloseComplaint}
                className="px-3.5 py-1.5 bg-[#234E3E] hover:bg-[#1B3E31] text-white text-xs font-semibold rounded-lg shadow-sm transition cursor-pointer"
              >
                Confirm Redressal & Close
              </button>
            )}
            <button
              onClick={() => setIsTrackingModalOpen(false)}
              className="px-4 py-1.5 bg-white hover:bg-[#F8F7F2] text-[#554C3E] text-xs font-medium rounded-lg border border-[#DDD9CF] transition cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
