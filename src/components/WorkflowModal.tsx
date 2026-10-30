import React from 'react';
import { X, CheckCircle2, Clock, Send, ShieldCheck, UserCheck } from 'lucide-react';

export const WorkflowModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const steps = [
    {
      stage: '1. Submitted',
      role: 'Student',
      icon: Send,
      badgeColor: 'bg-zinc-100 text-zinc-800 border-zinc-300',
      description:
        'Student submits grievance online with category, description, department, and optional supporting documents/images. A unique Complaint ID (e.g. CMP-2026-XXXX) is generated.',
    },
    {
      stage: '2. Assigned',
      role: 'Administrator',
      icon: UserCheck,
      badgeColor: 'bg-blue-50 text-blue-800 border-blue-200',
      description:
        'Administrator reviews the docket, verifies jurisdiction, and delegates the complaint to the designated department head or faculty member.',
    },
    {
      stage: '3. In Progress',
      role: 'Faculty / Staff',
      icon: Clock,
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
      description:
        'Assigned staff inspects the issue on-site (lab, hostel, classroom, or transit route), adds official faculty remarks, and requisitions repairs or corrective steps.',
    },
    {
      stage: '4. Resolved',
      role: 'Faculty / Staff',
      icon: CheckCircle2,
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      description:
        'Staff completes corrective action, logs official resolution details, and sets resolution timestamp.',
    },
    {
      stage: '5. Closed',
      role: 'Student / Admin',
      icon: ShieldCheck,
      badgeColor: 'bg-slate-100 text-slate-800 border-slate-300',
      description:
        'Student verifies satisfactory redressal of grievance or administrative audit closes case into archived records.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#DDD9CF] overflow-hidden">
        {/* Header */}
        <div className="bg-[#FAF8F2] px-6 py-4 border-b border-[#E8E5DD] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#963D26] font-bold">
              SRS Section 9.5 & 16 Specification
            </span>
            <h3 className="text-lg font-bold text-[#1A1D20] font-serif-heading">
              Grievance Lifecycle Workflow
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#768390] hover:text-[#1A1D20] hover:bg-[#EFECE1] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[80vh] overflow-y-auto space-y-4">
          <p className="text-xs text-[#525B66] leading-relaxed">
            The College Complaint Management System enforces an automated 5-stage sequential lifecycle to guarantee full accountability and eliminate misplaced or forgotten complaints.
          </p>

          <div className="space-y-3">
            {steps.map((st, idx) => {
              const Icon = st.icon;
              return (
                <div
                  key={st.stage}
                  className="p-4 rounded-xl border border-[#E8E5DD] bg-[#FDFCFA] hover:border-[#D5D0C2] transition"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#FAF4E8] text-[#963D26] flex items-center justify-center border border-[#E9DFCE]">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-sm text-[#1A1D20]">
                        {st.stage}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded border ${st.badgeColor}`}
                    >
                      Actor: {st.role}
                    </span>
                  </div>
                  <p className="text-xs text-[#525B66] pl-9 leading-relaxed">
                    {st.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#FAF8F2] px-6 py-3.5 border-t border-[#E8E5DD] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#234E3E] hover:bg-[#1B3E31] text-white text-xs font-semibold rounded-lg transition cursor-pointer"
          >
            Understood & Close
          </button>
        </div>
      </div>
    </div>
  );
};
