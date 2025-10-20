// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import EmployeeList from './components/employee/EmployeeList';
import MyLeaves from './components/leave/MyLeaves';
import PendingApprovals from './components/leave/PendingApprovals';
import CheckInOut from './components/attendance/CheckInOut';
import MyAttendance from './components/attendance/MyAttendance';
import AttendanceDashboard from './components/attendance/AttendanceDashboard';
import MyPayslips from './components/payroll/MyPayslips';
import GeneratePayroll from './components/payroll/GeneratePayroll';
import PayrollHistory from './components/payroll/PayslipView';
import Layout from './components/layout/Layout';
import './index.css';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Layout>{children}</Layout>;
};

// Public Route Component (redirect to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          
          {/* Employee Management - Admin & Manager only */}
          <Route
            path="/employees"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
                <EmployeeList />
              </ProtectedRoute>
            }
          />

          {/* Leave Management - All authenticated users */}
          <Route
            path="/my-leaves"
            element={
              <ProtectedRoute>
                <MyLeaves />
              </ProtectedRoute>
            }
          />

          {/* Leave Approvals - Admin & Manager only */}
          <Route
            path="/leave-approvals"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
                <PendingApprovals />
              </ProtectedRoute>
            }
          />

          {/* Attendance Routes */}
          {/* Check In/Out - All authenticated users */}
          <Route
            path="/attendance/check-in-out"
            element={
              <ProtectedRoute>
                <CheckInOut />
              </ProtectedRoute>
            }
          />

          {/* My Attendance - All authenticated users */}
          <Route
            path="/my-attendance"
            element={
              <ProtectedRoute>
                <MyAttendance />
              </ProtectedRoute>
            }
          />

          {/* Attendance Dashboard - Admin & Manager only */}
          <Route
            path="/attendance/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
                <AttendanceDashboard />
              </ProtectedRoute>
            }
          />

          {/* Payroll Routes */}
          {/* My Payslips - All authenticated users */}
          <Route
            path="/my-payslips"
            element={
              <ProtectedRoute>
                <MyPayslips />
              </ProtectedRoute>
            }
          />

          {/* Generate Payroll - Admin & Manager only */}
          <Route
            path="/payroll/generate"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
                <GeneratePayroll />
              </ProtectedRoute>
            }
          />

          {/* Payroll History - Admin & Manager only */}
          <Route
            path="/payroll/history"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
                <PayrollHistory />
              </ProtectedRoute>
            }
          />

          {/* Default Redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;