# AssignmentHub — Student Assignment Management Dashboard

AssignmentHub is a clean, modern, production-quality, role-based **Student Assignment Management Dashboard** built with **React.js**, **Vite**, **Tailwind CSS**, and **localStorage**.

Designed with a sleek SaaS aesthetic (Notion/Linear inspired), it features dual role-based workflows for **Students** and **Admins/Professors**, complete with two-step submission verification, real-time progress metrics, and strict role-based data isolation.

---

## 🚀 Features

### 🎓 Student Role
- **Secure Authentication**: Log in as a student (`anand@student.com`).
- **Student Dashboard**: Overview greeting and real-time statistics (Total Assignments, Submitted, Pending, Overall Completion %).
- **Strict Data Isolation**: Students only view assignments specifically assigned to them.
- **Assignment Details**: View subject, due date, full description, and open the external Google Drive submission link in a new tab.
- **Double-Verification Submission Flow**: Clicking *"Yes, I have submitted"* triggers an interactive confirmation modal before persisting the submission to `localStorage`.
- **Submission Status Tracking**: Automatic visual badges (`Submitted`, `Pending`, `Due Soon`, `Overdue`).

### 👨‍🏫 Admin / Professor Role
- **Admin Authentication**: Log in as an admin/professor (`admin@assignmenthub.com`).
- **Admin Dashboard**: Overview metrics (Total Assignments, Total Enrolled Students, Total Submissions, Overall Completion %).
- **Assignment Management (CRUD)**: Create, search, filter, edit, and delete assignments.
- **Student Assignment Selection**: Select individual students using multi-select checkboxes when creating or editing assignments.
- **Submission Tracking & Individual Progress Bars**: Monitor every student's submission status and individual progress bar (0% or 100%) for created assignments.
- **Safe Editing**: Editing assignments preserves existing student submission history.
- **Delete Confirmation**: Deleting an assignment prompts for confirmation before removing it from `localStorage`.

---

## 🛠️ Tech Stack

- **Framework**: React 19 (Vite 6)
- **Styling**: Tailwind CSS v3, CSS3
- **Icons**: Lucide React
- **Routing**: React Router DOM v7
- **State Management**: React Context API (`AuthContext`, `AssignmentsContext`, `ToastContext`)
- **Persistence**: `localStorage` (Simulated JSON persistence engine)
- **Deployment Ready**: SPA fallback configured (`vercel.json`)

---

## 🔑 Demo Credentials

You can use the built-in quick autofill buttons on the login screen or enter these credentials manually:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Student (Anand Sahani)** | `anand@student.com` | `123456` |
| **Student (Rahul Kumar)** | `rahul@student.com` | `123456` |
| **Student (Priya Singh)** | `priya@student.com` | `123456` |
| **Admin / Professor (Dr. Sharma)** | `admin@assignmenthub.com` | `123456` |

---

## 💻 Installation & Local Development

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173`.

3. **Build for Production**:
   ```bash
   npm run build
   ```

4. **Preview Production Build**:
   ```bash
   npm run preview
   ```

---

## 📁 Folder Structure

```text
src/
├── assets/                  # Static assets and media
├── components/
│   ├── assignments/         # Assignment domain components
│   │   ├── AssignmentCard.jsx    # Card view for student assignments
│   │   ├── AssignmentForm.jsx    # Form for creating/editing assignments
│   │   ├── AssignmentTable.jsx   # Admin table view for assignments
│   │   └── StudentTable.jsx      # Admin table for tracking student progress
│   ├── common/              # Reusable UI components
│   │   ├── EmptyState.jsx        # Component for zero data states
│   │   ├── LoadingSpinner.jsx    # Animated loading indicator
│   │   ├── Modal.jsx             # Accessible confirmation dialog
│   │   ├── ProgressBar.jsx       # Dynamic progress bar component
│   │   ├── SearchBar.jsx         # Search input with icon
│   │   ├── StatCard.jsx          # Statistics metric card
│   │   ├── StatusBadge.jsx       # Color-coded assignment status badge
│   │   └── Toast.jsx             # Auto-dismissing notification toast
│   ├── layout/              # Application layout frames
│   │   ├── DashboardLayout.jsx   # Main layout container
│   │   ├── MobileMenu.jsx        # Mobile slide-out drawer
│   │   ├── Navbar.jsx            # Top bar for mobile layout
│   │   └── Sidebar.jsx           # Responsive desktop sidebar navigation
│   └── routing/             # Route guards
│       ├── ProtectedRoute.jsx    # Requires authenticated user
│       └── RoleRoute.jsx         # Enforces role permissions (student vs admin)
├── context/
│   ├── AssignmentsContext.jsx# Global assignment & submission state
│   ├── AuthContext.jsx       # Authentication & user state
│   └── ToastContext.jsx      # Global toast notifications
├── data/
│   ├── assignments.js        # Seed assignment dataset
│   └── users.js              # Seed user dataset
├── pages/
│   ├── admin/
│   │   ├── AdminDashboard.jsx    # Overview for professors
│   │   ├── CreateAssignment.jsx  # New assignment creation page
│   │   ├── EditAssignment.jsx    # Assignment editing & submission tracker
│   │   └── ManageAssignments.jsx # List, filter, search assignments page
│   ├── student/
│   │   ├── AssignmentDetails.jsx # Detailed view & double verification flow
│   │   └── StudentDashboard.jsx  # Student metrics & assigned work
│   └── Login.jsx             # Split-screen login interface
├── utils/
│   ├── assignmentStatus.js   # Status rule engine (Submitted, Pending, Due Soon, Overdue)
│   ├── progress.js           # Progress calculation utilities
│   └── storage.js            # LocalStorage persistence wrapper & date formatters
├── App.jsx                   # Central routing definition
├── main.jsx                  # React DOM entry point
└── index.css                 # Global CSS & Tailwind imports
```

---

## 🏛️ Architecture & Key Concepts

1. **Component-Based Architecture**: Modular design separating domain components (`assignments/`), layout shell (`layout/`), common UI elements (`common/`), and route guards (`routing/`).
2. **Context API**: React Context is utilized for application-wide state management:
   - `AuthContext`: Handles session initialization, login validation, and logout.
   - `AssignmentsContext`: Manages CRUD operations and student submission updates with sync to `localStorage`.
   - `ToastContext`: Provides global toast notifications.
3. **Role-Based Routing & Data Isolation**:
   - `ProtectedRoute` ensures unauthenticated users are redirected to `/login`.
   - `RoleRoute` restricts `/admin/*` routes to admin users and `/student/*` routes to student users.
   - JavaScript-level filtering (`currentUser.id`) guarantees that students never access or render another student's assignment data.
4. **LocalStorage Data Engine**: Automatically seeds mock data on first launch (`assignmenthub_initialized`) and persists all updates locally across page refreshes.

---

## 🎨 Design Decisions

- **Modern SaaS Aesthetics**: Styled with soft slate backgrounds (`bg-slate-50`), rounded cards (`rounded-2xl`), subtle shadows, and crisp typography (`Plus Jakarta Sans`).
- **Double Confirmation Flow**: Prevents accidental submissions by requiring students to confirm via an accessible modal.
- **Responsive Layout**: Seamless transition between desktop sidebar layout and mobile top navbar + slide-out drawer menu.

---

## 🔮 Future Improvements

- Backend REST API integration (Node.js/Express or NestJS).
- Database persistence (PostgreSQL / MongoDB).
- Real JWT / OAuth2 authentication.
- Native Google Drive API integration & direct file upload preview.
- Email notifications for approaching due dates.
- Interactive student analytics charts & grade submission.

---

## 📄 License

Distributed under the MIT License.
