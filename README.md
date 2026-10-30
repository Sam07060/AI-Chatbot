# College Complaint Management System
**Project Based Learning (PBL) Mini Project & Academic Grievance Redressal System**  
*Compliant with the official Software Requirements Specification (SRS)*

---

## 🏛️ System Overview

The **College Complaint Management System (CCMS)** is an automated, centralized digital platform designed to replace legacy paper-based grievance registers and informal email chains with a transparent, role-based redressal workflow.

The application enforces an immutable **5-Stage Sequential Lifecycle**:
$$\text{Submitted} \longrightarrow \text{Assigned} \longrightarrow \text{In Progress} \longrightarrow \text{Resolved} \longrightarrow \text{Closed}$$

---

## 🎨 Design Philosophy & UX Standards

- **Strict Light Aesthetic**: Designed with an architectural, editorial collegiate light theme (warm parchment `#FAF9F5`, academic deep forest `#234E3E`, heritage amber `#963D26`, and crisp slate borders `#E8E5DD`).
- **No AI-generated dark mode or blue/neon tropes**: Clean, dignified typography (Instrument Serif / Georgia headers paired with Plus Jakarta Sans data tables), tactile card surfaces, and printable grievance dossiers.
- **Role Switcher**: Includes an instantaneous evaluator role switcher in the header to effortlessly test all 3 personas:
  - 🎓 **Student Portal**: Samiksha Kakade (`2024-COMP-042`, T.E. Computer Engineering)
  - 👨‍🏫 **Staff / Faculty Portal**: Prof. D. Sharma (Lab In-Charge & Faculty Liaison)
  - 🏛️ **Administrator Portal**: Dean of Student Affairs & Grievance Cell Custodian

---

## 📋 Comprehensive SRS Mapping

| SRS Section | Specification | Implementation in System |
| :--- | :--- | :--- |
| **§ 5 & 8.3** | **Student Scope** | Registration profile, submit complaint with category/dept/proof, live stepper tracking, history review. |
| **§ 5 & 8.2** | **Faculty / Staff Scope** | Assigned complaint queue, status transitions (`In Progress`, `Resolved`), faculty remarks & resolution logging. |
| **§ 5 & 8.1** | **Admin Scope** | Departmental delegation, assign staff, manage students/staff/departments/categories, full KPI monitor. |
| **§ 9.5 & 16** | **Complaint Lifecycle** | Automated 5-stage tracking (`Submitted` → `Assigned` → `In Progress` → `Resolved` → `Closed`) with audit history. |
| **§ 9.7** | **Complaint Tracking** | Real-time tracking modal by ID (e.g. `CMP-2026-1042`), with visual stepper and full event timeline. |
| **§ 9.8** | **Reports Module** | Comprehensive analytics: Student-wise, Department-wise, Category-wise, Status breakdown, and print export. |
| **§ 15** | **Database Schema** | Relational structures for `Users`, `Students`, `Staff`, `Departments`, `Categories`, `Complaints`, and `ComplaintHistory`. |

---

## 🚀 Running Locally

```bash
# Navigate to project folder
cd college-complaint-system

# Install dependencies
npm install

# Start development server
npm run dev

# Or build and test production bundle
npm run build
npm run preview
```

---

## ☁️ Deployment on Vercel

### Method 1: Using Vercel CLI
```bash
cd college-complaint-system
npx vercel login
npx vercel
```

### Method 2: GitHub Repository Import (Recommended)
1. Push this folder to a GitHub repository.
2. Go to [vercel.com/new](https://vercel.com/new).
3. Import the repository and select **Vite** framework preset (pre-configured with `vercel.json`).
4. Click **Deploy**.

---

## 📁 Project Architecture

```
college-complaint-system/
├── dist/                      # Production build bundle
├── src/
│   ├── components/
│   │   ├── Header.tsx         # Masthead, role switcher & quick tracker bar
│   │   ├── HeroBanner.tsx     # Institutional stats & hero greetings
│   │   ├── StudentPortal.tsx  # Student complaint ledger & filing
│   │   ├── StaffPortal.tsx    # Faculty queue & status/remarks editor
│   │   ├── AdminPortal.tsx    # Admin control center (Assign, CRUD, Monitor)
│   │   ├── SubmitComplaintModal.tsx # Complaint registration form with proofs
│   │   ├── TrackingModal.tsx  # Stepper progress timeline & audit logs
│   │   ├── ComplaintDetailModal.tsx # Printable official grievance dossier
│   │   ├── ReportsModal.tsx   # Analytics & department/category reports
│   │   ├── WorkflowModal.tsx  # SRS 5-stage workflow visual guide
│   │   └── Footer.tsx         # Institutional references & metadata
│   ├── context/
│   │   └── AppContext.tsx     # State management & LocalStorage persistence
│   ├── data/
│   │   └── initialData.ts     # Seed data for students, faculty & departments
│   ├── types/
│   │   └── index.ts           # TypeScript models matching SRS Section 15
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css              # Light theme architectural styles
├── package.json
├── vercel.json                # Vercel SPA routing configuration
├── vite.config.ts
└── tsconfig.app.json
```
