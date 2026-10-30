import React from 'react';
import { useApp } from '../context/AppContext';
import {
  FileText,
  Clock,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  ShieldAlert,
  Send,
  Search,
} from 'lucide-react';

export const HeroBanner: React.FC<{
  onOpenSubmitModal: () => void;
  onOpenWorkflowModal: () => void;
}> = ({ onOpenSubmitModal, onOpenWorkflowModal }) => {
  const {
    currentUser,
    currentStudentProfile,
    complaints,
    setIsTrackingModalOpen,
    setActiveTab,
  } = useApp();

  const total = complaints.length;
  const pending = complaints.filter(
    (c) => c.status === 'Submitted' || c.status === 'Assigned' || c.status === 'In Progress'
  ).length;
  const resolved = complaints.filter(
    (c) => c.status === 'Resolved' || c.status === 'Closed'
  ).length;
  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 100;

  return (
    <div className="relative border-b border-[#E8E5DD] bg-gradient-to-b from-[#F5F2EA] via-[#FAF9F5] to-[#FAF9F5] px-4 sm:px-6 lg:px-8 pt-8 pb-10 overflow-hidden">
      {/* Decorative architectural grid background overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.35]"
        style={{
          backgroundImage:
            'radial-gradient(#C2BEB2 1px, transparent 1px), radial-gradient(#C2BEB2 1px, #FAF9F5 1px)',
          backgroundSize: '24px 24px',
          backgroundPosition: '0 0, 12px 12px',
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Top Institutional Metadata Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-[#E4DFD3] text-xs font-mono text-[#6A7280]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#963D26]"></span>
            <span className="text-[#1A1D20] font-semibold">CAMPUS JURISDICTION</span>
            <span className="text-[#C2BEB2]">&bull;</span>
            <span>DEANERY OF STUDENT WELFARE</span>
          </div>
          <div className="flex items-center gap-3">
            <span>PORTAL VER: 2.4-PBL</span>
            <span className="text-[#C2BEB2]">&bull;</span>
            <button
              onClick={onOpenWorkflowModal}
              className="text-[#963D26] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>View SRS 5-Stage Lifecycle</span>
            </button>
          </div>
        </div>

        {/* Hero Headline & Intro */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#EBE7DC] border border-[#DDD7C5] text-[#554C3E] text-xs font-mono mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#234E3E]"></span>
              <span>Centralized Grievance Redressal Mechanism</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#1A1D20] font-serif-heading leading-[1.15]">
              Accountable, transparent campus complaint resolution.
            </h2>

            <p className="mt-4 text-sm sm:text-base text-[#4F5661] leading-relaxed max-w-2xl">
              An automated, digital platform designed to eliminate manual delays, route student issues directly to responsible college departments, and maintain an immutable historical audit trail from submission to verified closure.
            </p>

            {/* Quick Actions according to current role */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {currentUser.role === 'student' ? (
                <>
                  <button
                    onClick={onOpenSubmitModal}
                    className="px-5 py-2.5 rounded-lg bg-[#963D26] hover:bg-[#80331F] text-white text-sm font-semibold shadow-sm transition flex items-center gap-2 cursor-pointer border border-[#7D2F1B]"
                  >
                    <Send className="w-4 h-4" />
                    <span>Lodge New Complaint</span>
                    <ArrowRight className="w-4 h-4 ml-1 opacity-80" />
                  </button>
                  <button
                    onClick={() => setIsTrackingModalOpen(true)}
                    className="px-4 py-2.5 rounded-lg bg-white hover:bg-[#F8F7F2] text-[#1A1D20] text-sm font-medium border border-[#DDD9CF] shadow-sm transition flex items-center gap-2 cursor-pointer"
                  >
                    <Search className="w-4 h-4 text-[#6B7280]" />
                    <span>Track Complaint by ID</span>
                  </button>
                </>
              ) : currentUser.role === 'staff' ? (
                <>
                  <button
                    onClick={() => setActiveTab('assigned')}
                    className="px-5 py-2.5 rounded-lg bg-[#234E3E] hover:bg-[#1B3E31] text-white text-sm font-semibold shadow-sm transition flex items-center gap-2 cursor-pointer border border-[#1A3A2F]"
                  >
                    <span>View Assigned Complaints</span>
                    <ArrowRight className="w-4 h-4 ml-1 opacity-80" />
                  </button>
                  <div className="text-xs text-[#6B7280] flex items-center gap-1 font-mono">
                    <span>Logged in as:</span>
                    <strong className="text-[#1A1D20]">{currentUser.name}</strong>
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setActiveTab('complaints')}
                    className="px-5 py-2.5 rounded-lg bg-[#1C2E28] hover:bg-[#15231F] text-white text-sm font-semibold shadow-sm transition flex items-center gap-2 cursor-pointer border border-[#0F1A16]"
                  >
                    <span>Manage All Complaints</span>
                    <ArrowRight className="w-4 h-4 ml-1 opacity-80" />
                  </button>
                  <button
                    onClick={() => setActiveTab('students')}
                    className="px-4 py-2.5 rounded-lg bg-white hover:bg-[#F8F7F2] text-[#1A1D20] text-sm font-medium border border-[#DDD9CF] shadow-sm transition cursor-pointer"
                  >
                    Manage Students & Staff
                  </button>
                </>
              )}
            </div>

            {/* Current Active User Profile Card */}
            <div className="mt-6 p-3.5 rounded-xl bg-white/80 border border-[#E4DFD3] shadow-xs flex items-center gap-3 max-w-lg">
              <div className="w-10 h-10 rounded-full bg-[#EFECE1] border border-[#DDD7C5] flex items-center justify-center font-serif-heading font-bold text-sm text-[#554C3E]">
                {currentUser.role === 'student' ? 'SK' : currentUser.role === 'staff' ? 'DS' : 'AD'}
              </div>
              <div className="flex-1 min-w-0 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#1A1D20] truncate">
                    {currentUser.role === 'student' ? currentStudentProfile.name : currentUser.name}
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-mono font-bold bg-[#FAF4E8] text-[#963D26] border border-[#DFCBAA]">
                    {currentUser.role}
                  </span>
                </div>
                <p className="text-[#6B7280] truncate mt-0.5">
                  {currentUser.role === 'student'
                    ? `${currentStudentProfile.roll_number} &bull; ${currentStudentProfile.class} (${currentStudentProfile.division})`
                    : currentUser.role === 'staff'
                    ? 'Associate Professor & Computer Lab In-Charge'
                    : 'System Administrator & Student Welfare Officer'}
                </p>
              </div>
            </div>
          </div>

          {/* Metric Cards Grid (SRS Section 9.8 Complaint Report Module) */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3.5">
            <div className="p-4 rounded-xl bg-white border border-[#E4DFD3] shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-[#768390]">
                <span className="text-xs font-mono uppercase tracking-wider">Total Filed</span>
                <FileText className="w-4 h-4 text-[#963D26]" />
              </div>
              <div className="mt-3">
                <div className="text-3xl font-bold font-serif-heading text-[#1A1D20]">
                  {total}
                </div>
                <div className="text-[11px] text-[#6F767E] mt-1 flex items-center gap-1 font-mono">
                  <span>Cumulative Records</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#E4DFD3] shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-[#768390]">
                <span className="text-xs font-mono uppercase tracking-wider">Active Pending</span>
                <Clock className="w-4 h-4 text-[#C25E00]" />
              </div>
              <div className="mt-3">
                <div className="text-3xl font-bold font-serif-heading text-[#C25E00]">
                  {pending}
                </div>
                <div className="text-[11px] text-[#6F767E] mt-1 flex items-center gap-1 font-mono">
                  <span>Under Investigation</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#E4DFD3] shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-[#768390]">
                <span className="text-xs font-mono uppercase tracking-wider">Resolved</span>
                <CheckCircle2 className="w-4 h-4 text-[#234E3E]" />
              </div>
              <div className="mt-3">
                <div className="text-3xl font-bold font-serif-heading text-[#234E3E]">
                  {resolved}
                </div>
                <div className="text-[11px] text-[#6F767E] mt-1 flex items-center gap-1 font-mono">
                  <span>Verified Redressed</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#E4DFD3] shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-[#768390]">
                <span className="text-xs font-mono uppercase tracking-wider">Resolution Rate</span>
                <TrendingUp className="w-4 h-4 text-[#2563EB]" />
              </div>
              <div className="mt-3">
                <div className="text-3xl font-bold font-serif-heading text-[#1A1D20]">
                  {resolutionRate}%
                </div>
                <div className="text-[11px] text-[#6F767E] mt-1 flex items-center gap-1 font-mono">
                  <span>Avg Turnaround 1.8 Days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
