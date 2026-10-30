import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, GraduationCap, Briefcase, Building2, RotateCcw } from 'lucide-react';

export const Footer: React.FC<{ onOpenWorkflowModal: () => void }> = ({ onOpenWorkflowModal }) => {
  const { switchUserRole, resetToDefaults } = useApp();

  return (
    <footer className="mt-16 border-t border-[#E8E5DD] bg-[#F7F5EE] text-[#525B66] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Project Identity */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#FAF4E8] border border-[#DFCBAA] flex items-center justify-center text-[#963D26]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="font-bold text-base text-[#1A1D20] font-serif-heading">
                College Complaint Management System
              </span>
            </div>
            <p className="text-xs text-[#6F767E] leading-relaxed max-w-md">
              Developed as a Project Based Learning (PBL) Mini Project to streamline, automate, and digitize student grievance submission, departmental allocation, and verified lifecycle tracking.
            </p>
            <div className="pt-1 font-mono text-[11px] text-[#768390]">
              <span>Prepared for College PBL Submission</span> &bull; <span>Author: Samiksha Kakade</span>
            </div>
          </div>

          {/* Col 2: Role Switcher Fast Links */}
          <div className="space-y-2">
            <h5 className="font-mono text-[11px] uppercase tracking-wider text-[#1A1D20] font-bold">
              Role Switcher (Evaluator)
            </h5>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={() => switchUserRole('student')}
                  className="hover:text-[#963D26] transition flex items-center gap-1.5 cursor-pointer"
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Student Portal (Samiksha)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => switchUserRole('staff')}
                  className="hover:text-[#963D26] transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Faculty Portal (Prof. Sharma)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => switchUserRole('admin')}
                  className="hover:text-[#963D26] transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Administrator Portal (Dean)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Specifications & Architecture */}
          <div className="space-y-2">
            <h5 className="font-mono text-[11px] uppercase tracking-wider text-[#1A1D20] font-bold">
              SRS Compliance
            </h5>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={onOpenWorkflowModal}
                  className="hover:text-[#963D26] transition cursor-pointer"
                >
                  5-Stage Workflow Specs
                </button>
              </li>
              <li>
                <span className="text-[#768390]">Frontend: React 19 + Tailwind CSS</span>
              </li>
              <li>
                <span className="text-[#768390]">SRS Tech: PHP, MySQL, Apache XAMPP</span>
              </li>
              <li>
                <button
                  onClick={resetToDefaults}
                  className="text-[#963D26] hover:underline flex items-center gap-1 cursor-pointer font-medium"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Initial Demo Ledger</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[#E8E5DD] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#768390] font-mono">
          <div>&copy; 2026 College Complaint Management System. All rights reserved.</div>
          <div className="flex items-center gap-2">
            <span>Light Institutional Theme</span>
            <span>&bull;</span>
            <span>Vercel Production Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
