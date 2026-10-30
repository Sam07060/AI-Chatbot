import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import {
  ShieldCheck,
  Search,
  UserCheck,
  RotateCcw,
  FileBarChart2,
  GraduationCap,
  Briefcase,
  Building2,
  ChevronDown,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentUser,
    switchUserRole,
    openTrackerForId,
    setIsReportsModalOpen,
    resetToDefaults,
  } = useApp();

  const [trackInput, setTrackInput] = useState('');
  const [trackError, setTrackError] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackInput.trim()) return;
    const ok = openTrackerForId(trackInput);
    if (!ok) {
      setTrackError(true);
      setTimeout(() => setTrackError(false), 3000);
    } else {
      setTrackInput('');
    }
  };

  const roles: { role: UserRole; label: string; icon: any; desc: string }[] = [
    { role: 'student', label: 'Student Portal', icon: GraduationCap, desc: 'Samiksha Kakade (TE Comp A-42)' },
    { role: 'staff', label: 'Staff / Faculty Portal', icon: Briefcase, desc: 'Prof. D. Sharma (Lab In-Charge)' },
    { role: 'admin', label: 'Administrator Portal', icon: Building2, desc: 'Dean of Student Affairs (Full Access)' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F5]/95 backdrop-blur-md border-b border-[#E8E5DD] shadow-[0_1px_4px_rgba(20,20,15,0.03)]">
      {/* Top micro institutional banner */}
      <div className="bg-[#1C2E28] text-[#F3F1E7] text-xs py-1.5 px-4 sm:px-8 border-b border-[#2A3E36] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 tracking-wide font-medium">
          <span className="inline-block w-2 h-2 rounded-full bg-[#E5A93C] animate-pulse"></span>
          <span>OFFICIAL CENTRAL GRIEVANCE & COMPLAINT MANAGEMENT SYSTEM</span>
          <span className="text-[#8FAFA1] hidden md:inline">|</span>
          <span className="text-[#8FAFA1] hidden md:inline font-mono">PBL MINI PROJECT SUBMISSION</span>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-[#A6C0B5]">
          <span className="font-mono">ACADEMIC YEAR 2026</span>
          <button
            onClick={resetToDefaults}
            title="Restore sample complaints and original database records"
            className="hover:text-white transition flex items-center gap-1 underline underline-offset-2 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Demo DB</span>
          </button>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Brand & Crest */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-[#FAF4E8] border border-[#DFCBAA] flex items-center justify-center text-[#963D26] shadow-sm">
            <ShieldCheck className="w-6 h-6 stroke-[1.8]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-[#1A1D20] font-serif-heading">
                College Complaint Portal
              </h1>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#EFECE1] text-[#615B4C] border border-[#DDD7C5]">
                SRS Compliant
              </span>
            </div>
            <p className="text-xs text-[#6F767E] hidden sm:block">
              Project Based Learning (PBL) Mini Project &bull; Prepared for Submission
            </p>
          </div>
        </div>

        {/* Quick Tracking & Role Switcher */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Quick tracker form */}
          <form onSubmit={handleTrackSubmit} className="relative flex-1 sm:w-64 md:w-72">
            <input
              type="text"
              placeholder="Track Complaint ID (e.g. 1042)..."
              value={trackInput}
              onChange={(e) => {
                setTrackInput(e.target.value);
                setTrackError(false);
              }}
              className={`w-full text-xs font-mono bg-white border ${
                trackError ? 'border-red-400 ring-2 ring-red-100' : 'border-[#DDD9CF]'
              } rounded-lg pl-8 pr-16 py-2 text-[#1A1D20] placeholder-[#8F959E] focus:outline-none focus:border-[#963D26] focus:ring-2 focus:ring-[#963D26]/10 transition shadow-inner`}
            />
            <Search className="w-3.5 h-3.5 text-[#8F959E] absolute left-2.5 top-1/2 -translate-y-1/2" />
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 px-2.5 bg-[#F4F1E8] hover:bg-[#E9DFCE] text-[#554C3E] text-[11px] font-medium rounded border border-[#DDD7C5] transition flex items-center gap-1 cursor-pointer"
            >
              Track
            </button>
            {trackError && (
              <span className="absolute -bottom-5 left-0 text-[10px] text-red-600 font-medium">
                Complaint ID not found. Try CMP-2026-1042
              </span>
            )}
          </form>

          {/* Reports quick button */}
          <button
            onClick={() => setIsReportsModalOpen(true)}
            className="px-3 py-2 bg-white hover:bg-[#F8F7F2] text-[#343A40] text-xs font-medium rounded-lg border border-[#DDD9CF] shadow-sm hover:border-[#C4BFB2] transition flex items-center gap-1.5 cursor-pointer"
          >
            <FileBarChart2 className="w-3.5 h-3.5 text-[#963D26]" />
            <span className="hidden sm:inline">SRS</span> Reports
          </button>

          {/* Interactive Role Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="px-3 py-2 rounded-lg bg-[#234E3E] hover:bg-[#1B3E31] text-white text-xs font-medium shadow-sm transition flex items-center gap-2 cursor-pointer border border-[#1A3A2F]"
            >
              <UserCheck className="w-3.5 h-3.5 text-[#E6AF2E]" />
              <div className="text-left leading-tight">
                <span className="text-[10px] text-[#A6C0B5] block uppercase font-mono tracking-wider">
                  Active Role
                </span>
                <span className="font-semibold capitalize">
                  {currentUser.role === 'admin' ? 'Administrator' : currentUser.role}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#A6C0B5]" />
            </button>

            {/* Dropdown Menu */}
            {roleMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setRoleMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-[#DDD9CF] py-2 z-40 text-left">
                  <div className="px-3 py-1.5 border-b border-[#EFECE1] text-[10px] font-mono text-[#768390] uppercase tracking-wider">
                    Switch Evaluator Role (SRS Verification)
                  </div>
                  {roles.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentUser.role === item.role;
                    return (
                      <button
                        key={item.role}
                        onClick={() => {
                          switchUserRole(item.role);
                          setRoleMenuOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2.5 flex items-start gap-3 hover:bg-[#FAF8F2] transition cursor-pointer ${
                          isActive ? 'bg-[#F5F2E9] border-l-4 border-[#963D26]' : ''
                        }`}
                      >
                        <div
                          className={`p-1.5 rounded-md mt-0.5 ${
                            isActive
                              ? 'bg-[#963D26] text-white'
                              : 'bg-[#EFECE1] text-[#615B4C]'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold text-[#1A1D20]">
                              {item.label}
                            </p>
                            {isActive && (
                              <span className="text-[9px] uppercase tracking-wider font-mono font-bold text-[#963D26]">
                                ACTIVE
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#6F767E] truncate">
                            {item.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
