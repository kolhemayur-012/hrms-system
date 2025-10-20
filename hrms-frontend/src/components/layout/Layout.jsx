// src/components/layout/Layout.jsx
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Calendar,
  CheckSquare,
  Clock,
  ClipboardList,
  DollarSign,
  FileText,
  CreditCard,
  LogOut, 
  Menu, 
  X,
  User as UserIcon,
  LogIn
} from 'lucide-react';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Menu items based on user role
  const getMenuItems = () => {
    const baseItems = [
      { 
        path: '/dashboard', 
        icon: LayoutDashboard, 
        label: 'Dashboard', 
        roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'] 
      },
      { 
        path: '/employees', 
        icon: Users, 
        label: 'Employees', 
        roles: ['ADMIN', 'MANAGER'] 
      },
      { 
        path: '/my-leaves', 
        icon: Calendar, 
        label: 'My Leaves', 
        roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'] 
      },
    ];

    // Add approval menu for managers and admins
    if (user?.role === 'ADMIN' || user?.role === 'MANAGER') {
      baseItems.push({
        path: '/leave-approvals',
        icon: CheckSquare,
        label: 'Leave Approvals',
        roles: ['ADMIN', 'MANAGER']
      });
    }

    // Add attendance menu items
    baseItems.push({
      path: '/attendance/check-in-out',
      icon: LogIn,
      label: 'Check In/Out',
      roles: ['ADMIN', 'MANAGER', 'EMPLOYEE']
    });

    baseItems.push({
      path: '/my-attendance',
      icon: Clock,
      label: 'My Attendance',
      roles: ['ADMIN', 'MANAGER', 'EMPLOYEE']
    });

    // Attendance Dashboard for admins and managers only
    if (user?.role === 'ADMIN' || user?.role === 'MANAGER') {
      baseItems.push({
        path: '/attendance/dashboard',
        icon: ClipboardList,
        label: 'Attendance Dashboard',
        roles: ['ADMIN', 'MANAGER']
      });
    }

    // Payroll Management Section
    baseItems.push({
      path: '/my-payslips',
      icon: FileText,
      label: 'My Payslips',
      roles: ['ADMIN', 'MANAGER', 'EMPLOYEE']
    });

    // Payroll Management for admins and managers only
    if (user?.role === 'ADMIN' || user?.role === 'MANAGER') {
      baseItems.push({
        path: '/payroll/generate',
        icon: DollarSign,
        label: 'Generate Payroll',
        roles: ['ADMIN', 'MANAGER']
      });

      baseItems.push({
        path: '/payroll/history',
        icon: CreditCard,
        label: 'Payroll History',
        roles: ['ADMIN', 'MANAGER']
      });
    }

    // Filter based on user role
    return baseItems.filter(item => item.roles.includes(user?.role));
  };

  const menuItems = getMenuItems();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg fixed w-full z-10">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-white/10 rounded-lg transition"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className="text-2xl font-bold">HRMS Portal</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
              <UserIcon size={20} />
              <div>
                <p className="text-sm font-semibold">{user?.username}</p>
                <p className="text-xs text-blue-100">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'w-64' : 'w-0'
          } bg-white shadow-lg transition-all duration-300 overflow-hidden fixed h-full`}
        >
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive(item.path)
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main
          className={`flex-1 p-6 transition-all duration-300 ${
            sidebarOpen ? 'ml-64' : 'ml-0'
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;