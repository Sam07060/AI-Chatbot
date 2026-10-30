import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { StudentPortal } from './components/StudentPortal';
import { StaffPortal } from './components/StaffPortal';
import { AdminPortal } from './components/AdminPortal';
import { SubmitComplaintModal } from './components/SubmitComplaintModal';
import { TrackingModal } from './components/TrackingModal';
import { ComplaintDetailModal } from './components/ComplaintDetailModal';
import { ReportsModal } from './components/ReportsModal';
import { WorkflowModal } from './components/WorkflowModal';
import { Footer } from './components/Footer';

const MainAppContent: React.FC = () => {
  const { currentUser } = useApp();
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isWorkflowModalOpen, setIsWorkflowModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#1A1D20] flex flex-col font-sans">
      {/* Institutional Masthead */}
      <Header />

      {/* Hero Banner with Stats and Quick Actions */}
      <HeroBanner
        onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
        onOpenWorkflowModal={() => setIsWorkflowModalOpen(true)}
      />

      {/* Main Role-Specific Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentUser.role === 'student' && (
          <StudentPortal onOpenSubmitModal={() => setIsSubmitModalOpen(true)} />
        )}
        {currentUser.role === 'staff' && <StaffPortal />}
        {currentUser.role === 'admin' && <AdminPortal />}
      </main>

      {/* Footer */}
      <Footer onOpenWorkflowModal={() => setIsWorkflowModalOpen(true)} />

      {/* Global Modals */}
      <SubmitComplaintModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
      />
      <TrackingModal />
      <ComplaintDetailModal />
      <ReportsModal />
      <WorkflowModal
        isOpen={isWorkflowModalOpen}
        onClose={() => setIsWorkflowModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
