import React from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Printer,
  ShieldCheck,
  Calendar,
  Building2,
  UserCheck,
  FileText,
  Paperclip,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { ComplaintStatus } from '../types';

export const ComplaintDetailModal: React.FC = () => {
  const {
    selectedComplaint,
    setSelectedComplaint,
    setTrackedComplaint,
    setIsTrackingModalOpen,
  } = useApp();

  if (!selectedComplaint) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-[#DDD9CF] overflow-hidden text-left">
        {/* Printable Official Header */}
        <div className="bg-[#FAF8F2] px-6 py-4 border-b border-[#E8E5DD] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#FAF4E8] text-[#963D26] border border-[#DFCBAA] flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#963D26] font-bold">
                Official Grievance Dossier &bull; CCMS-2026
              </span>
              <h3 className="text-base font-bold text-[#1A1D20] font-serif-heading">
                Grievance Record #{selectedComplaint.complaint_id}
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
              onClick={() => setSelectedComplaint(null)}
              className="p-1.5 rounded-lg border border-[#DDD9CF] bg-white text-[#525B66] hover:bg-[#F8F7F2] transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dossier Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-5 text-xs">
          {/* Top Status & Date */}
          <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E8E5DD] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-[#768390] uppercase">Status:</span>
              <span
                className={`font-mono uppercase font-bold px-2.5 py-0.5 rounded border text-[11px] ${getStatusBadge(
                  selectedComplaint.status
                )}`}
              >
                {selectedComplaint.status}
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 border border-zinc-200 font-bold">
                {selectedComplaint.priority} Priority
              </span>
            </div>

            <div className="font-mono text-[#6F767E] flex items-center gap-1.5 text-[11px]">
              <Calendar className="w-3.5 h-3.5" />
              <span>Lodged: {selectedComplaint.submission_date}</span>
            </div>
          </div>

          {/* Student & Department Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl border border-[#E8E5DD] bg-white">
              <span className="text-[10px] font-mono uppercase text-[#768390] block mb-1">
                Student Complainant Profile
              </span>
              <div className="font-bold text-sm text-[#1A1D20]">
                {selectedComplaint.student_name}
              </div>
              <div className="font-mono text-[11px] text-[#525B66] mt-0.5">
                Roll No: {selectedComplaint.roll_number}
              </div>
              <div className="text-[11px] text-[#6F767E] mt-0.5">
                Department: {selectedComplaint.department_name}
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-[#E8E5DD] bg-white">
              <span className="text-[10px] font-mono uppercase text-[#768390] block mb-1">
                Assigned Authority
              </span>
              <div className="font-bold text-sm text-[#1A1D20]">
                {selectedComplaint.assigned_staff_name || 'Pending Faculty Assignment'}
              </div>
              <div className="text-[11px] text-[#525B66] mt-0.5">
                Department: {selectedComplaint.department_name}
              </div>
              <div className="text-[11px] text-[#6F767E] mt-0.5">
                Classification: {selectedComplaint.category_name}
              </div>
            </div>
          </div>

          {/* Title & Description */}
          <div>
            <span className="text-[10px] font-mono uppercase text-[#768390] block mb-1">
              Grievance Subject & Description
            </span>
            <div className="p-4 rounded-xl border border-[#E8E5DD] bg-white">
              <h4 className="text-base font-bold font-serif-heading text-[#1A1D20] mb-2">
                {selectedComplaint.title}
              </h4>
              <p className="text-[#4A525A] leading-relaxed text-xs whitespace-pre-wrap">
                {selectedComplaint.description}
              </p>

              {selectedComplaint.attachment_name && (
                <div className="mt-3 pt-3 border-t border-[#F0ECE1] flex items-center gap-2 font-mono text-[11px] text-[#525B66]">
                  <Paperclip className="w-3.5 h-3.5 text-[#963D26]" />
                  <span>Attached Proof:</span>
                  <span className="font-bold text-[#1A1D20] underline">
                    {selectedComplaint.attachment_name}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Remarks & Resolution */}
          {(selectedComplaint.remarks || selectedComplaint.resolution) && (
            <div className="space-y-3">
              {selectedComplaint.remarks && (
                <div className="p-3.5 rounded-xl bg-[#FAF8F2] border border-[#E9DFCE]">
                  <span className="text-[10px] font-mono uppercase text-[#963D26] font-bold block mb-1">
                    Faculty Remarks / Inspection Report
                  </span>
                  <p className="text-[#3A4047] leading-relaxed">
                    {selectedComplaint.remarks}
                  </p>
                </div>
              )}

              {selectedComplaint.resolution && (
                <div className="p-3.5 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono uppercase text-[#166534] font-bold">
                      Official Redressal Resolution
                    </span>
                    {selectedComplaint.resolution_date && (
                      <span className="text-[10px] font-mono text-[#166534]">
                        Date: {selectedComplaint.resolution_date}
                      </span>
                    )}
                  </div>
                  <p className="text-[#14532D] font-medium leading-relaxed">
                    {selectedComplaint.resolution}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Audit History Log */}
          <div>
            <span className="text-[10px] font-mono uppercase text-[#768390] block mb-1.5">
              Lifecycle Event Log ({selectedComplaint.history.length} records)
            </span>
            <div className="border border-[#E8E5DD] rounded-xl overflow-hidden divide-y divide-[#E8E5DD] bg-white">
              {selectedComplaint.history.map((h, i) => (
                <div key={h.history_id || i} className="p-3 flex items-start justify-between gap-3 hover:bg-[#FAF9F5]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#1A1D20]">{h.status}</span>
                      <span className="text-[10px] font-mono text-[#768390]">&bull; {h.updated_by}</span>
                    </div>
                    <p className="text-[#525B66] text-[11px] mt-0.5">{h.remarks}</p>
                  </div>
                  <span className="text-[10px] font-mono text-[#768390] whitespace-nowrap">
                    {h.updated_date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#FAF8F2] px-6 py-3.5 border-t border-[#E8E5DD] flex items-center justify-between">
          <button
            onClick={() => {
              setTrackedComplaint(selectedComplaint);
              setIsTrackingModalOpen(true);
              setSelectedComplaint(null);
            }}
            className="px-3.5 py-1.5 bg-[#FAF4E8] hover:bg-[#F3E7CE] text-[#963D26] border border-[#DFCBAA] text-xs font-semibold rounded-lg transition cursor-pointer flex items-center gap-1.5"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Open Stepper Tracker</span>
          </button>

          <button
            onClick={() => setSelectedComplaint(null)}
            className="px-4 py-1.5 bg-white hover:bg-[#F8F7F2] text-[#554C3E] text-xs font-medium rounded-lg border border-[#DDD9CF] transition cursor-pointer"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
