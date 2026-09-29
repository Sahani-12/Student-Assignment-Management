# AssignmentHub — Student, Group & Assignment Management System

**AssignmentHub** is an academic management platform designed for universities and higher education institutions. Built with **React 19**, **Tailwind CSS**, and modern client architecture, AssignmentHub offers dedicated workflows for **Professors** and **Students**, featuring collaborative **Group Assignment Logic**, verified acknowledgment pipelines, and real-time progress analytics.

---

## 📌 Table of Contents
1. [Project Overview](#-project-overview)
2. [Key Features](#-key-features)
3. [Professor Workflow](#-professor-workflow)
4. [Student Workflow](#-student-workflow)
5. [Group Assignment Logic & Rules](#-group-assignment-logic--rules)
6. [Design System & UI/UX Decisions](#-design-system--uiux-decisions)
7. [Tech Stack](#-tech-stack)
8. [Architecture & Data Flow](#-architecture--data-flow)
9. [Folder Structure](#-folder-structure)
10. [Authentication & Route Guards](#-authentication--route-guards)
11. [Responsive Design](#-responsive-design)
12. [Setup & Local Run Instructions](#-setup--local-run-instructions)
13. [Environment Variables](#-environment-variables)
14. [Demo Credentials](#-demo-credentials)
15. [Deployment](#-deployment)
16. [Future Improvements](#-future-improvements)

---

## 📌 Project Overview

AssignmentHub addresses the challenges of tracking coursework in university courses where assignments range from individual problem sets to multi-student collaborative projects.

Traditional LMS tools often suffer from cluttered interfaces, lack of clear group submission authority, and ambiguous submission states. AssignmentHub provides:
- **For Professors**: A unified command center to organize courses, publish individual or group assignments with deadlines and OneDrive links, monitor submission rates, and inspect student/group breakdowns.
- **For Students**: A distraction-free academic dashboard displaying current-semester courses, overall completion rates, upcoming deadlines, team member rosters, and verified submission acknowledgments.

---

## ✨ Key Features

- **Role-Based Experience**: Tailored navigation, permissions, and views for Professors and Students.
- **Individual vs. Group Submission Modes**:
  - Individual assignments require independent submission from each student.
  - Group assignments designate submission authority strictly to the **Group Leader**, with real-time status propagation across all team members.
- **"Student Not in Group" Safeguard**: Prevents orphaned students from submitting group assignments while offering an integrated **Create / Join Group** modal.
- **Two-Step Submission Verification**: Double-confirmation modal ensures intentional submission acknowledgment.
- **Dynamic Deadline UX**: Automatic urgency badges (`Due today`, `Due tomorrow`, `Due in X days`, `Overdue`, `Submitted`).
- **Visual Analytics**: Interactive progress bars and breakdown tables for professors with student-by-student and team-by-team status.
- **Persistent Local State**: Full browser persistence via `localStorage` with a 1-click **Reset Demo Data** capability.
- **Responsive Layout**: Desktop sidebar navigation collapsing into a mobile slide-over drawer with touch-friendly controls.

---

## 🎓 Professor Workflow

```text
Login
  ↓
Professor Dashboard
  ↓
View Courses (CS-301, CS-302, CS-303, CS-201)
  ↓
Select Course
  ↓
Assignments Page
  ↓
Create / Edit / Delete Assignment
  ↓
View Submission Analytics (Individual & Group Breakdowns)
```

1. **Dashboard Overview**:
   - Greeting and overview statistics: *Total Courses*, *Total Assignments*, *Total Students*, *Overall Submission Rate*.
   - Grid of course cards with student counts, assignment counts, and animated progress bars.
   - Real-time **Recent Assignment Activity** feed tracking student acknowledgments.
2. **Course Assignments View** (`/professor/courses/:courseId/assignments`):
   - Search filter by title or description.
   - Completion status filter (`All`, `Pending Submissions`, `100% Fully Submitted`).
   - Submission type filter (`All`, `Individual`, `Group`).
   - Switchable **Grid View** and **Table View**.
3. **Assignment Creation & Editing**:
   - Title, course selector, description, date & time deadline picker with live preview, and OneDrive URL validation.
   - Interactive **Radio Cards** for selecting *Individual* or *Group* submission type.
   - Edits preserve existing submission and acknowledgment records.
4. **Analytics View** (`/professor/assignments/:id`):
   - Metric cards: *Total Students/Groups*, *Acknowledged*, *Pending*, *Completion Rate*.
   - Group mode displays team cards, designated leader, member rosters, and acknowledgment status.
   - Individual mode displays student names, roll numbers, status badges, and exact timestamps.

---

## 🎒 Student Workflow

```text
Login
  ↓
Student Dashboard
  ↓
View Enrolled Courses (Current Semester)
  ↓
Select Course
  ↓
Assignments List
  ↓
View Assignment Details
  ↓
Open OneDrive Workspace Link
  ↓
Two-Step Acknowledgment Submission
```

1. **Academic Dashboard**:
   - Personalized welcome header with current academic semester (*Fall 2026*).
   - **Overall Assignment Progress** bar showing aggregated completion across all enrolled courses (e.g., *16 of 20 assignments acknowledged · 80%*).
   - Metric cards: *Enrolled Courses*, *Total Assignments*, *Acknowledged*, *Pending*.
   - **My Courses** grid displaying individual course completion rates.
   - **Upcoming Deadlines** list prioritized by urgency with color-coded status badges.
2. **Course Assignments** (`/student/courses/:courseId/assignments`):
   - Shows all course assignments with due dates and acknowledgment status badges (`✓ Acknowledged`, `○ Pending`, `⚠ Overdue`).
   - Search and filter by status and type.
3. **Assignment Detail & Submission**:
   - Displays objectives, deadline, and cloud folder link (`Open OneDrive Folder ↗`).
   - Handles both Individual and Group rules with clear guidance.

---

## 👥 Group Assignment Logic & Rules

AssignmentHub implements strict, realistic group submission dynamics:

| Scenario | User Role | Interface State & Behavior |
| :--- | :--- | :--- |
| **Individual Assignment** | Enrolled Student | Sees status (`Pending` or `Acknowledged`). Clicks `[ Yes, I have submitted ]` to open confirmation modal and submit. |
| **Group: Leader (Pending)** | Group Leader | Sees badge `You are the Group Leader.` Active `[ Yes, I have submitted ]` button available. |
| **Group: Leader (Submitted)** | Group Leader | Sees `✓ Acknowledged. You acknowledged this assignment on [Timestamp].` |
| **Group: Member (Pending)** | Group Member | Submission button is **hidden**. Displays: `👥 Group Submission: Your group leader has not acknowledged this assignment yet. Leader: [Leader Name]`. |
| **Group: Member (Submitted)**| Group Member | Submission button is **hidden**. Displays: `✓ Acknowledged. Your group leader [Leader Name] acknowledged this assignment on [Timestamp].` |
| **Group: Student Not in Group** | Student (No Group) | Displays friendly warning card: `👥 You're not in a group yet. You are not part of any group. Form or join one to submit this assignment.` Includes `[ Create / Join Group ]` button opening a modal. Submissions are blocked. |

### Group Progress Calculation (Professor View)
For group assignments, progress is calculated strictly on a group basis rather than individual member counts:
$$\text{Progress \%} = \frac{\text{Acknowledged Groups}}{\text{Total Assigned Groups}} \times 100$$

---

## 🎨 Design System & UI/UX Decisions

- **Visual Inspiration**: Linear, Notion, Vercel Dashboard.
- **Color Palette**:
  - **Primary**: Indigo-600 (`#4f46e5`) & Indigo-700 (`#4338ca`) for key CTAs, branding, and active indicators.
  - **Success**: Emerald-600 (`#059669`) for verified acknowledgments and 100% completion states.
  - **Warning**: Amber-500 (`#f59e0b`) & Orange-500 for pending deliverables and due-soon deadlines.
  - **Danger**: Red-600 (`#dc2626`) for overdue warnings and destructive delete actions.
  - **Neutral**: Slate-50 background, Slate-200 borders, Slate-900 typography.
- **Typography**: Clean, readable sans-serif typography using modern system fallbacks with *Plus Jakarta Sans*.
- **Micro-Interactions**: Subtle button elevations, card hover transitions, focus rings with offset, and skeleton loaders for loading states.
- **Accessibility**: Semantic HTML5 elements (`<header>`, `<main>`, `<aside>`, `<nav>`, `<article>`, `<button>`), accessible modal overlays with `Escape` key listeners, and accessible color contrast.

---

## 🛠️ Tech Stack

```text
React.js 19
Tailwind CSS 3.4
React Router DOM 7
Lucide React (Icons)
Vite 6 (Build Tool)
JavaScript (ES6+)
HTML5 & CSS3
```

- **No bloated frameworks**: Zero heavy Redux boilerplate or unnecessary heavy animation packages. Maintainable and standard React Hooks + Context API.

---

## 🏗️ Architecture & Data Flow

```text
┌────────────────────────────────────────────────────────┐
│                   React Router DOM                     │
│  /login, /register, /professor/*, /student/*           │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│                  Route Guard Layer                     │
│    • ProtectedRoute (Validates active session)         │
│    • RoleRoute (Enforces professor / student access)   │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│                   React Context API                    │
│    • AuthContext (session, login, register, logout)    │
│    • AssignmentsContext (reactive courses, state)      │
│    • ToastContext (transient feedback toasts)          │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│                    Service Layer                       │
│    • authService.js                                    │
│    • courseService.js                                  │
│    • assignmentService.js                              │
│    • groupService.js                                   │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│              LocalStorage Persistence Layer            │
│    • assignmenthub_currentUser                         │
│    • assignmenthub_users                               │
│    • assignmenthub_courses                             │
│    • assignmenthub_groups                              │
│    • assignmenthub_assignments                         │
└────────────────────────────────────────────────────────┘
```

---

## 📁 Folder Structure

```text
src/
├── components/
│   ├── common/
│   │   ├── Breadcrumb.jsx          # Hierarchical breadcrumb navigation
│   │   ├── Button.jsx              # Reusable button with variants & loading state
│   │   ├── EmptyState.jsx          # Clean placeholder for empty queries
│   │   ├── LoadingSpinner.jsx      # Animated spinner indicator
│   │   ├── Modal.jsx               # Accessible confirmation dialog
│   │   ├── ProgressBar.jsx         # Animated completion progress bar
│   │   ├── SearchBar.jsx           # Debounced search input
│   │   ├── Skeleton.jsx            # Skeleton loaders for cards & tables
│   │   ├── StatCard.jsx            # KPI metric cards
│   │   ├── StatusBadge.jsx         # Status and submission type badges
│   │   └── Toast.jsx               # Pop-up notification toasts
│   │
│   ├── courses/
│   │   └── CourseCard.jsx          # Course card with metrics & progress
│   │
│   ├── assignments/
│   │   ├── AssignmentCard.jsx      # Card for professor/student views
│   │   ├── AssignmentForm.jsx      # Create/edit form with radio cards
│   │   ├── AssignmentTable.jsx     # Desktop table & responsive mobile cards
│   │   └── AssignmentAnalytics.jsx # In-depth professor submission breakdown
│   │
│   ├── groups/
│   │   ├── GroupMembers.jsx        # Member cards with avatars & leader badge
│   │   ├── GroupWarningCard.jsx    # "Not in group" friendly warning banner
│   │   └── JoinGroupModal.jsx      # Interactive modal to join or create a team
│   │
│   ├── layout/
│   │   ├── DashboardLayout.jsx     # App shell with desktop & mobile layout
│   │   ├── Navbar.jsx              # Top bar with role badge & user profile
│   │   ├── Sidebar.jsx             # Collapsible sidebar with course shortcuts
│   │   └── MobileMenu.jsx          # Mobile slide-out drawer
│   │
│   └── routing/
│       ├── ProtectedRoute.jsx      # Redirects unauthenticated traffic
│       └── RoleRoute.jsx           # Restricts access by professor/student role
│
├── pages/
│   ├── Login.jsx                   # Modern split-screen login page
│   ├── Register.jsx                # Full registration form with role selector
│   │
│   ├── professor/
│   │   ├── Dashboard.jsx           # Professor dashboard with course progress
│   │   ├── CourseAssignments.jsx   # Assignments manager with filters & search
│   │   ├── CreateAssignment.jsx    # Assignment creator
│   │   ├── EditAssignment.jsx      # Assignment editor (preserves data)
│   │   └── AssignmentDetails.jsx   # Detailed analytics & roster inspection
│   │
│   └── student/
│       ├── StudentDashboard.jsx    # Student dashboard with term progress
│       ├── CourseAssignments.jsx   # Course deliverables & acknowledgment list
│       └── AssignmentDetails.jsx   # Two-step submission & group leader logic
│
├── context/
│   ├── AuthContext.jsx             # User auth state & role helpers
│   ├── AssignmentsContext.jsx      # Centralized reactive assignment state
│   └── ToastContext.jsx            # Global toast notifications
│
├── services/
│   ├── authService.js              # Authentication service abstraction
│   ├── courseService.js            # Course queries & completion calculation
│   ├── assignmentService.js        # CRUD, individual & group acknowledgment
│   └── groupService.js             # Team membership & creation service
│
├── utils/
│   ├── dateUtils.js                # Formatting & relative deadline calculations
│   ├── progressUtils.js            # Progress percentages for individuals & groups
│   ├── storage.js                  # LocalStorage initialization & data seeds
│   └── validation.js               # Form input validation helpers
│
├── data/
│   ├── users.js                    # Seed professors and students
│   ├── courses.js                  # Seed university courses (Fall 2026)
│   ├── groups.js                   # Seed student groups (Team Phoenix, etc.)
│   └── assignments.js              # Seed assignments covering all demo states
│
├── App.jsx                         # Main route tree definition
├── index.css                       # Tailwind directives & focus styles
└── main.jsx                        # Application root initialization
```

---

## 🔐 Authentication & Architecture Limitation

> [!NOTE]
> **Authentication is simulated for frontend evaluation using localStorage. The service layer is structured so a real JWT API can replace the mock implementation without changing UI components.**

- **Token & Session Abstraction**:
  - `authService.login(email, password)`
  - `authService.register(userData)`
  - `authService.logout()`
  - `authService.getCurrentUser()`
  - `authService.getToken()`
  - `authService.isAuthenticated()`
- Simulated session tokens are stored in `localStorage` under `assignmenthub_auth_token`. When a production backend with real JWT is integrated, only `authService.js` needs to point to the backend API endpoints; no UI components or contexts need rewriting.
- No real secrets or passwords are stored in plaintext in any public repository.
- **Strict Route Protection**:
  - Attempting to access `/professor/*` without a professor account immediately redirects to `/student/dashboard`.
  - Attempting to access `/student/*` with a professor account redirects to `/professor/dashboard`.
  - Unauthenticated visits to any protected route redirect to `/login`.
- **Backward Compatibility**:
  - Legacy `/admin/*` routes are mapped seamlessly to the `/professor/*` handlers.

---

## 📱 Responsive Design

The application is thoroughly responsive across standard viewport breakpoints:
- **Mobile (`< 640px`)**:
  - Sticky top header with hamburger toggle.
  - Slide-out navigation drawer with smooth backdrop.
  - Single-column course and assignment cards.
  - Stacked action buttons and modal dialogs.
  - Zero horizontal overflow.
- **Tablet (`640px - 1024px`)**:
  - Two-column grid for courses and assignments.
  - Compact stat cards.
- **Desktop (`>= 1024px`)**:
  - Fixed left sidebar with brand logo, primary navigation, and course shortcuts.
  - Multi-column grids (up to 3 columns for courses/assignments).
  - Rich data tables with inline quick actions.

---

## 💻 Setup & Local Run Instructions

### Prerequisites
- Node.js (version 18+ recommended)
- npm or yarn

### Steps to Run
```bash
# 1. Clone repository or navigate to project directory
cd InternshipProject

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open in browser
# Visit http://localhost:5173
```

### Production Build Validation
```bash
npm run build
npm run preview
```

---

## ⚙️ Environment Variables

No external API keys or environment variables are required. All services, course catalogs, student teams, and submission records persist locally in the browser's `localStorage`.

---

## 🔑 Demo Credentials

Quick-fill demo buttons are provided directly on the `/login` screen for fast testing:

| Role | Name | Email | Password | Notable Demo State |
| :--- | :--- | :--- | :--- | :--- |
| **Professor** | Dr. Sharma | `admin@assignmenthub.com` | `123456` | Program Director, CS-301, CS-302, CS-201 |
| **Professor** | Dr. Mehta | `mehta@professor.com` | `123456` | Associate Professor, CS-303 Software Eng. |
| **Student** | Anand Sahani | `anand@student.com` | `123456` | Member of Team Phoenix, Leader of Team Orbit |
| **Student** | Rahul Kumar | `rahul@student.com` | `123456` | **Group Leader** of Team Phoenix |
| **Student** | Priya Singh | `priya@student.com` | `123456` | **Group Leader** of Team Alpha |
| **Student** | Amit Kumar | `amit@student.com` | `123456` | **Group Leader** of Team Nova |
| **Student** | Neha Gupta | `neha@student.com` | `123456` | Member of Team Alpha |

### How to Demo Specific Requirements:
1. **Group Leader Authority**: Log in as `rahul@student.com` (Leader of Team Phoenix). Open *Full-Stack Architecture Capstone* or *Group Microservices Integration*. Notice active submission buttons and authorization.
2. **Group Member Restriction**: Log in as `anand@student.com` (Member of Team Phoenix). Open the same group assignment. Notice the submission button is disabled/hidden with a message indicating Rahul Kumar is the leader.
3. **Student Not in Group**: Log in as `anand@student.com`. Navigate to course **CS-303 (Software Engineering)** and open *Distributed Systems & Agile Sprint*. Notice the friendly warning banner indicating no group has been formed yet, with the **Create / Join Group** modal.
4. **Data Reset**: Click **Reset Demo Data** in the sidebar at any time to return all assignments, submissions, and groups to their clean seed state.

---

## 🚀 Deployment

The project is preconfigured for deployment on **Vercel** or **Netlify**:
- `vercel.json` contains single-page application (SPA) rewrites:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

---

## ⚠️ Known Limitations

1. **Frontend-Only Persistence**: As per project scope, data persistence is maintained strictly in client `localStorage`. Clearing browser site data or switching browsers resets changes unless the session is preserved.
2. **Simulated Authentication**: Authentication tokens are generated and verified on the client side. Production deployment requires pairing `authService.js` with an HTTPS REST API and signed JWT bearer tokens.
3. **External File Verification**: Submission links point to OneDrive/Google Drive web URLs. Actual file binary verification inside Microsoft/Google folders requires server-side OAuth2 cloud directory scopes.

---

## 🔮 Future Improvements

- Direct cloud storage API integration (Microsoft Graph API / Google Drive Picker API) to inspect uploaded file assets directly in the UI.
- Dark mode toggle with persisted user theme preference.
- Real-time in-app notifications via WebSockets or Web Push notifications.
- In-app group discussion boards and peer-review rubrics.
