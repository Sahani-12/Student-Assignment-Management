# AssignmentHub — Student Assignment Management Dashboard

**AssignmentHub** is a clean, modern, role-based Student Assignment Management System built with **React.js (Vite)**, **Tailwind CSS**, **React Router DOM**, and **localStorage**.

---

## 📌 Project Overview

AssignmentHub allows two types of users:
1. **Students**: View assigned coursework, open submission links, submit assignments with a two-step confirmation, and track completion progress.
2. **Admins / Professors**: Create, edit, and delete assignments, select target students, track individual student progress, and monitor overall completion statistics.

---

## 🔐 How Login & Signup Work (Step-by-Step)

There is **no backend server**. Everything is simulated locally using `localStorage`.

### 1. Signup (Account Creation Flow)
1. User visits `/register` and fills in:
   - **Full Name**
   - **Email Address**
   - **Password** (minimum 6 characters)
   - **Role**: Selects either `Student` or `Admin / Professor`.
2. The application checks if the email already exists in `localStorage` (`assignmenthub_users`).
3. If valid, a new user object is created with a unique ID (e.g. `student-1727...`) and saved to `localStorage`.
4. The user is logged in automatically and redirected to their role-specific dashboard (`/student/dashboard` or `/admin/dashboard`).

### 2. Login Flow
1. User visits `/login` and enters credentials (or clicks a **Demo Account** button to autofill).
2. `AuthContext` searches `localStorage` for a matching email & password.
3. If valid, user session is saved in `localStorage` (`assignmenthub_currentUser`).
4. User is redirected to their dashboard based on role:
   - **Student** → `/student/dashboard`
   - **Admin** → `/admin/dashboard`

---

## 🏗️ Architecture & How It Works

```text
┌─────────────────────────────────────────────────────────────┐
│                       React Router                         │
│   (/login, /register, /student/dashboard, /admin/dashboard)  │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                    Route Guards Layer                       │
│    • ProtectedRoute (Check if user is logged in)            │
│    • RoleRoute (Check student vs admin permissions)         │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                     React Context API                       │
│    • AuthContext (user state, login, register, logout)      │
│    • AssignmentsContext (assignments list, submit, CRUD)    │
│    • ToastContext (pop-up notification messages)            │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                  LocalStorage Persistence                   │
│    • assignmenthub_currentUser  (Current active user)     │
│    • assignmenthub_users        (Registered user accounts)  │
│    • assignmenthub_assignments  (All assignment records)    │
└─────────────────────────────────────────────────────────────┘
```

### 1. Data Layer (`localStorage`)
- On first application launch, mock data (`users.js` and `assignments.js`) is automatically initialized into `localStorage`.
- All changes (submitting assignments, creating new assignments, registering users) are saved instantly in `localStorage` so data stays updated even after page refresh.

### 2. State Layer (`React Context`)
- **`AuthContext`**: Handles authentication state, login validation, account creation, and logout.
- **`AssignmentsContext`**: Handles global assignment state, adding, editing, deleting, and submitting assignments.
- **`ToastContext`**: Provides instant feedback pop-ups (e.g. *"Assignment submitted successfully"*).

### 3. Route Protection & Security Guards
- **`ProtectedRoute`**: Redirects unauthenticated users back to `/login`.
- **`RoleRoute`**: Prevents students from opening Admin routes, and admins from opening Student routes.

### 4. Privacy & Data Isolation
- **Student Privacy**: Students only see assignments where their `user.id` is included in `assignedStudents`.
- **Admin Isolation**: Admins only see and manage assignments created by their specific `user.id`.

---

## 🔑 Demo Credentials

You can log in directly using these demo accounts (or click the demo buttons on the login page):

| Role | Email | Password |
| :--- | :--- | :--- |
| **Student (Anand Sahani)** | `anand@student.com` | `123456` |
| **Student (Rahul Kumar)** | `rahul@student.com` | `123456` |
| **Student (Priya Singh)** | `priya@student.com` | `123456` |
| **Admin / Professor (Dr. Sharma)** | `admin@assignmenthub.com` | `123456` |

---

## 💻 How to Run the Project Locally

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
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

## 📁 Project Structure

```text
src/
├── components/
│   ├── assignments/   # Assignment Card, Form, and Tables
│   ├── common/        # StatCard, ProgressBar, Modal, SearchBar, Toast
│   ├── layout/        # Sidebar, Navbar, MobileMenu, DashboardLayout
│   └── routing/       # ProtectedRoute, RoleRoute
├── context/
│   ├── AuthContext.jsx         # User & session state
│   ├── AssignmentsContext.jsx  # Assignments & submissions state
│   └── ToastContext.jsx        # Notification toasts
├── data/
│   ├── assignments.js          # Default mock assignments
│   └── users.js                # Default mock users
├── pages/
│   ├── admin/         # Admin Dashboard, Create, Edit, Manage Pages
│   ├── student/       # Student Dashboard & Assignment Details Pages
│   ├── Login.jsx      # Login page with demo autofills
│   └── Register.jsx   # Create Account page
├── utils/
│   ├── assignmentStatus.js # Status calculator (Submitted, Pending, Due Soon, Overdue)
│   ├── progress.js         # Percentage math calculations
│   └── storage.js          # LocalStorage helper functions
├── App.jsx            # Central router definition
├── main.jsx           # React app entry point
└── index.css          # Global Tailwind CSS styles
```

---

## 📄 License

Distributed under the MIT License.
