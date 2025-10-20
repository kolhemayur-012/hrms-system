// src/components/dashboard/Dashboard.jsx
import { useState, useEffect } from 'react';
import { Users, UserCheck, UserX, TrendingUp } from 'lucide-react';
import employeeService from '../../services/employeeService';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
  });
  const [recentEmployees, setRecentEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const employees = await employeeService.getAllEmployeesList();
      
      const active = employees.filter(emp => emp.status === 'ACTIVE').length;
      const inactive = employees.filter(emp => emp.status === 'INACTIVE').length;
      
      setStats({
        total: employees.length,
        active,
        inactive,
      });

      // Get 5 most recent employees
      setRecentEmployees(employees.slice(0, 5));
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Employees',
      value: stats.total,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Active Employees',
      value: stats.active,
      icon: UserCheck,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      title: 'Inactive Employees',
      value: stats.inactive,
      icon: UserX,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600'
    },
    {
      title: 'Growth Rate',
      value: '+12%',
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.username}! 👋
        </h1>
        <p className="text-blue-100">
          Here's what's happening with your workforce today.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <stat.icon className={`${stat.iconColor}`} size={24} />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              {stat.title}
            </h3>
            <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Employees */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Recent Employees
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-gray-600 font-semibold">
                  Employee Code
                </th>
                <th className="text-left py-3 px-4 text-gray-600 font-semibold">
                  Name
                </th>
                <th className="text-left py-3 px-4 text-gray-600 font-semibold">
                  Email
                </th>
                <th className="text-left py-3 px-4 text-gray-600 font-semibold">
                  Designation
                </th>
                <th className="text-left py-3 px-4 text-gray-600 font-semibold">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {recentEmployees.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-500">
                    No employees found
                  </td>
                </tr>
              ) : (
                recentEmployees.map((employee) => (
                  <tr
                    key={employee.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                  >
                    <td className="py-3 px-4 font-medium text-gray-800">
                      {employee.employeeCode}
                    </td>
                    <td className="py-3 px-4">
                      {employee.firstName} {employee.lastName}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {employee.email}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {employee.designation}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          employee.status === 'ACTIVE'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {employee.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;