import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Printer,
  FileBarChart2,
  Building2,
  Layers,
  GraduationCap,
  CheckCircle2,
  Clock,
  Download,
  Calendar,
} from 'lucide-react';

export const ReportsModal: React.FC = () => {
  const {
    isReportsModalOpen,
    setIsReportsModalOpen,
    complaints,
    departments,
    categories,
    students,
  } = useApp();

  const [activeReportTab, setActiveReportTab] = useState<'overview' | 'department' | 'category' | 'student'>('overview');

  if (!isReportsModalOpen) return null;

  const total = complaints.length;
  const pending = complaints.filter(
    (c) => c.status === 'Submitted' || c.status === 'Assigned' || c.status === 'In Progress'
  ).length;
  const resolved = complaints.filter((c) => c.status === 'Resolved').length;
  const closed = complaints.filter((c) => c.status === 'Closed').length;
  const resolutionRate = total > 0 ? Math.round(((resolved + closed) / total) * 100) : 100;

  // Department-wise stats
  const departmentStats = departments.map((dept) => {
    const deptComplaints = complaints.filter(
      (c) => c.department_id === dept.department_id || c.department_name === dept.department_name
    );
    const deptResolved = deptComplaints.filter((c) => c.status === 'Resolved' || c.status === 'Closed').length;
    const deptPending = deptComplaints.filter((c) => c.status !== 'Resolved' && c.status !== 'Closed').length;
    return {
      department: dept.department_name,
      code: dept.code,
      total: deptComplaints.length,
      pending: deptPending,
      resolved: deptResolved,
      percentage: total > 0 ? Math.round((deptComplaints.length / total) * 100) : 0,
    };
  });

  // Category-wise stats
  const categoryStats = categories.map((cat) => {
    const catComplaints = complaints.filter((c) => c.category_id === cat.category_id);
    return {
      category: cat.category_name,
      total: catComplaints.length,
      percentage: total > 0 ? Math.round((catComplaints.length / total) * 100) : 0,
    };
  });

  // Student-wise stats
  const studentStats = students.map((stu) => {
    const stuComplaints = complaints.filter(
      (c) => c.student_id === stu.student_id || c.roll_number === stu.roll_number
    );
    const stuResolved = stuComplaints.filter((c) => c.status === 'Resolved' || c.status === 'Closed').length;
    return {
      name: stu.name,
      roll: stu.roll_number,
      department: stu.department,
      total: stuComplaints.length,
      resolved: stuResolved,
      pending: stuComplaints.length - stuResolved,
    };
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-[#DDD9CF] overflow-hidden text-left">
        {/* Header */}
        <div className="bg-[#FAF8F2] px-6 py-4 border-b border-[#E8E5DD] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#FAF4E8] text-[#963D26] border border-[#DFCBAA] flex items-center justify-center shadow-xs">
              <FileBarChart2 className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#963D26] font-bold">
                SRS Section 9.8: Complaint Report Module
              </span>
              <h3 className="text-base font-bold text-[#1A1D20] font-serif-heading">
                Comprehensive College Grievance Analytics & Reports
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-lg border border-[#DDD9CF] bg-white text-[#525B66] hover:bg-[#F8F7F2] transition text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-[#963D26]" />
              <span>Print Official Report</span>
            </button>
            <button
              onClick={() => setIsReportsModalOpen(false)}
              className="p-1.5 rounded-lg border border-[#DDD9CF] bg-white text-[#525B66] hover:bg-[#F8F7F2] transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sub-tabs */}
        <div className="px-6 py-2.5 bg-[#FAF9F5] border-b border-[#E8E5DD] flex flex-wrap items-center gap-2">
          {[
            { id: 'overview', label: '1. Overall Statistics', icon: FileBarChart2 },
            { id: 'department', label: '2. Department-Wise', icon: Building2 },
            { id: 'category', label: '3. Category-Wise', icon: Layers },
            { id: 'student', label: '4. Student-Wise', icon: GraduationCap },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSel = activeReportTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveReportTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                  isSel
                    ? 'bg-[#1C2E28] text-white font-bold shadow-xs'
                    : 'text-[#554C3E] hover:bg-[#EFECE1]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[72vh] overflow-y-auto space-y-6 text-xs">
          {/* Tab 1: Overview */}
          {activeReportTab === 'overview' && (
            <div className="space-y-6">
              {/* Summary KPIs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E8E5DD]">
                  <span className="text-[10px] font-mono uppercase text-[#768390] block">
                    Total Registered Complaints
                  </span>
                  <div className="text-3xl font-bold font-serif-heading text-[#1A1D20] mt-1">
                    {total}
                  </div>
                  <span className="text-[10px] text-[#6F767E] font-mono mt-1 block">
                    All-time recorded
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E8E5DD]">
                  <span className="text-[10px] font-mono uppercase text-[#768390] block">
                    Pending In Action
                  </span>
                  <div className="text-3xl font-bold font-serif-heading text-[#C25E00] mt-1">
                    {pending}
                  </div>
                  <span className="text-[10px] text-[#6F767E] font-mono mt-1 block">
                    Submitted / Assigned / In Progress
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E8E5DD]">
                  <span className="text-[10px] font-mono uppercase text-[#768390] block">
                    Resolved & Closed
                  </span>
                  <div className="text-3xl font-bold font-serif-heading text-[#234E3E] mt-1">
                    {resolved + closed}
                  </div>
                  <span className="text-[10px] text-[#6F767E] font-mono mt-1 block">
                    Verified redressal
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E8E5DD]">
                  <span className="text-[10px] font-mono uppercase text-[#768390] block">
                    Resolution Rate
                  </span>
                  <div className="text-3xl font-bold font-serif-heading text-[#2563EB] mt-1">
                    {resolutionRate}%
                  </div>
                  <span className="text-[10px] text-[#6F767E] font-mono mt-1 block">
                    Avg response: 1.8 Days
                  </span>
                </div>
              </div>

              {/* Status Breakdown Bar */}
              <div className="p-4 rounded-xl border border-[#E8E5DD] bg-white">
                <h5 className="font-bold text-sm text-[#1A1D20] mb-3 font-serif-heading">
                  System Status Distribution
                </h5>
                <div className="h-4 w-full bg-[#EFECE1] rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${(complaints.filter((c) => c.status === 'Submitted').length / total) * 100}%` }}
                    className="bg-zinc-400 h-full"
                    title="Submitted"
                  />
                  <div
                    style={{ width: `${(complaints.filter((c) => c.status === 'Assigned').length / total) * 100}%` }}
                    className="bg-blue-500 h-full"
                    title="Assigned"
                  />
                  <div
                    style={{ width: `${(complaints.filter((c) => c.status === 'In Progress').length / total) * 100}%` }}
                    className="bg-amber-500 h-full"
                    title="In Progress"
                  />
                  <div
                    style={{ width: `${(complaints.filter((c) => c.status === 'Resolved').length / total) * 100}%` }}
                    className="bg-emerald-600 h-full"
                    title="Resolved"
                  />
                  <div
                    style={{ width: `${(complaints.filter((c) => c.status === 'Closed').length / total) * 100}%` }}
                    className="bg-slate-700 h-full"
                    title="Closed"
                  />
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-4 text-[11px] font-mono">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-zinc-400"></span>
                    <span>Submitted ({complaints.filter((c) => c.status === 'Submitted').length})</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                    <span>Assigned ({complaints.filter((c) => c.status === 'Assigned').length})</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    <span>In Progress ({complaints.filter((c) => c.status === 'In Progress').length})</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                    <span>Resolved ({complaints.filter((c) => c.status === 'Resolved').length})</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-700"></span>
                    <span>Closed ({complaints.filter((c) => c.status === 'Closed').length})</span>
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Department-wise */}
          {activeReportTab === 'department' && (
            <div className="space-y-4">
              <h5 className="font-bold text-sm text-[#1A1D20] font-serif-heading">
                Departmental Grievance Inflow & Resolution
              </h5>
              <div className="border border-[#E8E5DD] rounded-xl overflow-hidden bg-white">
                <table className="w-full text-left text-xs divide-y divide-[#E8E5DD]">
                  <thead className="bg-[#FAF8F2] text-[#615B4C] font-mono uppercase text-[10px]">
                    <tr>
                      <th className="px-4 py-2.5">Department</th>
                      <th className="px-4 py-2.5">Code</th>
                      <th className="px-4 py-2.5">Total Lodged</th>
                      <th className="px-4 py-2.5">Pending</th>
                      <th className="px-4 py-2.5">Resolved</th>
                      <th className="px-4 py-2.5">Share %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8E5DD]">
                    {departmentStats.map((d) => (
                      <tr key={d.code} className="hover:bg-[#FAF9F5]">
                        <td className="px-4 py-2.5 font-semibold text-[#1A1D20]">{d.department}</td>
                        <td className="px-4 py-2.5 font-mono text-[#768390]">{d.code}</td>
                        <td className="px-4 py-2.5 font-bold">{d.total}</td>
                        <td className="px-4 py-2.5 text-amber-700">{d.pending}</td>
                        <td className="px-4 py-2.5 text-emerald-700">{d.resolved}</td>
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-[#EFECE1] h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-[#963D26] h-full rounded-full"
                                style={{ width: `${d.percentage}%` }}
                              />
                            </div>
                            <span className="font-mono text-[10px]">{d.percentage}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 3: Category-wise */}
          {activeReportTab === 'category' && (
            <div className="space-y-4">
              <h5 className="font-bold text-sm text-[#1A1D20] font-serif-heading">
                Category Distribution Report
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {categoryStats.map((cat, i) => (
                  <div key={i} className="p-3.5 rounded-xl border border-[#E8E5DD] bg-white">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-semibold text-[#1A1D20]">{cat.category}</span>
                      <span className="font-mono font-bold text-[#963D26]">{cat.total} filed</span>
                    </div>
                    <div className="w-full bg-[#EFECE1] h-2 rounded-full overflow-hidden mt-2">
                      <div
                        className="bg-[#234E3E] h-full rounded-full"
                        style={{ width: `${cat.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Student-wise */}
          {activeReportTab === 'student' && (
            <div className="space-y-4">
              <h5 className="font-bold text-sm text-[#1A1D20] font-serif-heading">
                Student-wise Grievance Filing Report
              </h5>
              <div className="border border-[#E8E5DD] rounded-xl overflow-hidden bg-white">
                <table className="w-full text-left text-xs divide-y divide-[#E8E5DD]">
                  <thead className="bg-[#FAF8F2] text-[#615B4C] font-mono uppercase text-[10px]">
                    <tr>
                      <th className="px-4 py-2.5">Student Name</th>
                      <th className="px-4 py-2.5">Roll Number</th>
                      <th className="px-4 py-2.5">Department</th>
                      <th className="px-4 py-2.5">Total Lodged</th>
                      <th className="px-4 py-2.5">Pending</th>
                      <th className="px-4 py-2.5">Resolved</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8E5DD]">
                    {studentStats.map((s) => (
                      <tr key={s.roll} className="hover:bg-[#FAF9F5]">
                        <td className="px-4 py-2.5 font-semibold text-[#1A1D20]">{s.name}</td>
                        <td className="px-4 py-2.5 font-mono text-[#768390]">{s.roll}</td>
                        <td className="px-4 py-2.5 text-[#525B66]">{s.department}</td>
                        <td className="px-4 py-2.5 font-bold">{s.total}</td>
                        <td className="px-4 py-2.5 text-amber-700">{s.pending}</td>
                        <td className="px-4 py-2.5 text-emerald-700">{s.resolved}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#FAF8F2] px-6 py-3.5 border-t border-[#E8E5DD] flex items-center justify-between text-xs font-mono text-[#768390]">
          <span>Generated for Project Based Learning (PBL) Mini Project Evaluation</span>
          <button
            onClick={() => setIsReportsModalOpen(false)}
            className="px-4 py-1.5 bg-[#234E3E] text-white font-semibold rounded-lg hover:bg-[#1B3E31] transition cursor-pointer"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};
