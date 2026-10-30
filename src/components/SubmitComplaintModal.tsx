import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PriorityLevel } from '../types';
import confetti from 'canvas-confetti';
import {
  X,
  Send,
  UploadCloud,
  CheckCircle2,
  FileCheck,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export const SubmitComplaintModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const {
    categories,
    departments,
    currentStudentProfile,
    submitComplaint,
    setSelectedComplaint,
  } = useApp();

  const [categoryId, setCategoryId] = useState(categories[0]?.category_id || '');
  const [departmentId, setDepartmentId] = useState(
    categories[0]?.default_department_id || departments[0]?.department_id || ''
  );
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('Normal');
  const [attachmentName, setAttachmentName] = useState<string | null>(null);
  const [submittedComplaintId, setSubmittedComplaintId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCategoryChange = (catId: string) => {
    setCategoryId(catId);
    const cat = categories.find((c) => c.category_id === catId);
    if (cat?.default_department_id) {
      setDepartmentId(cat.default_department_id);
    }
  };

  const handleSimulateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachmentName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert('Please fill out both the complaint subject title and detailed description.');
      return;
    }

    const created = submitComplaint({
      category_id: categoryId,
      department_id: departmentId,
      title: title.trim(),
      description: description.trim(),
      priority,
      attachment_name: attachmentName || undefined,
    });

    // Launch celebratory confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#963D26', '#234E3E', '#E6AF2E', '#DDD7C5'],
    });

    setSubmittedComplaintId(created.complaint_id);
  };

  const handleResetAndClose = () => {
    setTitle('');
    setDescription('');
    setAttachmentName(null);
    setSubmittedComplaintId(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#DDD9CF] overflow-hidden">
        {/* Header */}
        <div className="bg-[#FAF8F2] px-6 py-4 border-b border-[#E8E5DD] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#963D26] font-bold">
              SRS Section 9.6: Complaint Submission Module
            </span>
            <h3 className="text-lg font-bold text-[#1A1D20] font-serif-heading">
              Lodge New Academic / Campus Complaint
            </h3>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1 rounded-md text-[#768390] hover:text-[#1A1D20] hover:bg-[#EFECE1] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[82vh] overflow-y-auto">
          {submittedComplaintId ? (
            /* Success confirmation state */
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#FAF4E8] text-[#963D26] flex items-center justify-center border-2 border-[#DFCBAA] shadow-inner">
                <CheckCircle2 className="w-9 h-9 stroke-[2.2]" />
              </div>
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF6EE] text-[#1E6B39] text-xs font-mono font-bold border border-[#BCE4C9]">
                  <Sparkles className="w-3.5 h-3.5" />
                  STATUS: SUBMITTED & LOGGED
                </span>
                <h4 className="mt-3 text-2xl font-bold font-serif-heading text-[#1A1D20]">
                  Complaint Registered Successfully!
                </h4>
                <p className="mt-2 text-xs text-[#525B66] max-w-md mx-auto">
                  Your formal grievance has been assigned an official reference ID and forwarded to the college administration queue.
                </p>
              </div>

              {/* ID Box */}
              <div className="p-4 rounded-xl bg-[#FAF9F5] border-2 border-dashed border-[#DDD7C5] max-w-sm mx-auto">
                <div className="text-[11px] font-mono uppercase text-[#768390]">
                  Your Unique Complaint ID
                </div>
                <div className="text-2xl font-mono font-bold text-[#963D26] tracking-wider mt-1 select-all">
                  {submittedComplaintId}
                </div>
                <div className="text-[10px] text-[#6F767E] mt-1">
                  Save this identifier to track live resolution progress anytime.
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                <button
                  onClick={() => {
                    handleResetAndClose();
                  }}
                  className="px-5 py-2.5 bg-[#234E3E] hover:bg-[#1B3E31] text-white text-xs font-semibold rounded-lg shadow-sm transition cursor-pointer"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          ) : (
            /* Form submission state */
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              {/* Student Metadata Stamp */}
              <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-[#E8E5DD] flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#768390] block">
                    Filing Student Identity
                  </span>
                  <strong className="text-[#1A1D20] text-sm">
                    {currentStudentProfile.name}
                  </strong>
                  <span className="text-[#6F767E] ml-2 font-mono">
                    ({currentStudentProfile.roll_number})
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono uppercase text-[#768390] block">
                    Department
                  </span>
                  <span className="font-semibold text-[#1A1D20]">
                    {currentStudentProfile.department}
                  </span>
                </div>
              </div>

              {/* Category & Department */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1A1D20] mb-1 font-mono uppercase">
                    1. Complaint Category *
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full text-xs bg-white border border-[#DDD9CF] rounded-lg px-3 py-2.5 text-[#1A1D20] focus:outline-none focus:border-[#963D26] focus:ring-1 focus:ring-[#963D26]"
                    required
                  >
                    {categories.map((c) => (
                      <option key={c.category_id} value={c.category_id}>
                        {c.category_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1A1D20] mb-1 font-mono uppercase">
                    2. Responsible Department *
                  </label>
                  <select
                    value={departmentId}
                    onChange={(e) => setDepartmentId(e.target.value)}
                    className="w-full text-xs bg-white border border-[#DDD9CF] rounded-lg px-3 py-2.5 text-[#1A1D20] focus:outline-none focus:border-[#963D26] focus:ring-1 focus:ring-[#963D26]"
                    required
                  >
                    {departments.map((d) => (
                      <option key={d.department_id} value={d.department_id}>
                        {d.department_name} ({d.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Subject Title */}
              <div>
                <label className="block text-xs font-bold text-[#1A1D20] mb-1 font-mono uppercase">
                  3. Complaint Subject / Summary *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Broken bench and water seepage in Classroom 204..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs bg-white border border-[#DDD9CF] rounded-lg px-3 py-2.5 text-[#1A1D20] focus:outline-none focus:border-[#963D26] focus:ring-1 focus:ring-[#963D26]"
                  required
                />
              </div>

              {/* Detailed Description */}
              <div>
                <label className="block text-xs font-bold text-[#1A1D20] mb-1 font-mono uppercase">
                  4. Detailed Description of the Grievance *
                </label>
                <textarea
                  rows={4}
                  placeholder="Provide precise details: specific room number, date, equipment numbers, recurring frequency, and how it impacts your study..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs bg-white border border-[#DDD9CF] rounded-lg p-3 text-[#1A1D20] focus:outline-none focus:border-[#963D26] focus:ring-1 focus:ring-[#963D26]"
                  required
                />
              </div>

              {/* Priority & Supporting Document */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div>
                  <label className="block text-xs font-bold text-[#1A1D20] mb-1 font-mono uppercase">
                    5. Priority Classification
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Normal', 'Urgent', 'Critical'] as PriorityLevel[]).map((p) => {
                      const isSel = priority === p;
                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPriority(p)}
                          className={`py-2 text-xs font-medium rounded-lg border text-center transition cursor-pointer ${
                            isSel
                              ? p === 'Critical'
                                ? 'bg-red-50 text-red-800 border-red-300 font-bold'
                                : p === 'Urgent'
                                ? 'bg-amber-50 text-amber-800 border-amber-300 font-bold'
                                : 'bg-[#EFECE1] text-[#1A1D20] border-[#C2BEB2] font-bold'
                              : 'bg-white text-[#6F767E] border-[#DDD9CF] hover:bg-[#FAF9F5]'
                          }`}
                        >
                          {p}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1A1D20] mb-1 font-mono uppercase">
                    6. Supporting Document / Image
                  </label>
                  <label className="flex items-center justify-center gap-2 p-2.5 rounded-lg border border-dashed border-[#DDD7C5] bg-[#FAF9F5] hover:bg-[#F5F2EA] cursor-pointer transition text-xs text-[#525B66]">
                    <UploadCloud className="w-4 h-4 text-[#963D26]" />
                    <span className="truncate max-w-[200px]">
                      {attachmentName ? attachmentName : 'Upload proof (PNG, JPG, PDF)'}
                    </span>
                    <input
                      type="file"
                      onChange={handleSimulateUpload}
                      className="hidden"
                      accept=".png,.jpg,.jpeg,.pdf,.txt"
                    />
                  </label>
                </div>
              </div>

              {/* Notice */}
              <div className="flex items-start gap-2 p-3 rounded-lg bg-[#FAF4E8] border border-[#DFCBAA] text-[11px] text-[#614E36]">
                <AlertCircle className="w-4 h-4 text-[#963D26] shrink-0 mt-0.5" />
                <p>
                  False or misleading statements are punishable under college code of conduct. All complaints are recorded permanently into the MySQL database with student identity attribution.
                </p>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-4 py-2 bg-white hover:bg-[#F8F7F2] text-[#554C3E] text-xs font-medium rounded-lg border border-[#DDD9CF] transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#963D26] hover:bg-[#80331F] text-white text-xs font-semibold rounded-lg shadow-sm transition flex items-center gap-2 cursor-pointer border border-[#7D2F1B]"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Official Complaint</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
