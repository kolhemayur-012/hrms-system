// src/components/attendance/AttendanceDashboard.jsx
import { useState, useEffect } from 'react';
import { Users, Calendar, TrendingUp, Clock } from 'lucide-react';
import attendanceService from '../../services/attendanceService';
import CheckInOut from './CheckInOut';

const AttendanceDashboard = () => {
  const [todayAttendance, setTodayAttendance] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    present: 0,
    absent: 0,
    late: 0
  });

  useEffect(() => {
    fetchAttendanceByDate();
  }, [selectedDate]);

  const fetchAttendanceByDate = async () => {
    try {
      setLoading(true);
      const data = await attendanceService.getAttendanceByDate(selectedDate);
      setTodayAttendance(data);
      calculateStats(data);
    } catch (error) {
      console.error('Failed to fetch attendance:', error);
      alert('Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    const stats = {
      total: data.length,
      present: data.filter(a => a.status === 'PRESENT' || a.status === 'WORK_FROM_HOME').length,
      absent: data.filter(a => a.status === 'ABSENT').length,
      late: data.filter(a => a.isLate).length
    };
    setStats(stats);
  };

  const getStatusBadge = (status) => {
    const styles = {
      PRESENT: 'bg-green-100 text-green-700',
      ABSENT: 'bg-red-100 text-red-700',
      HALF_DAY: 'bg-yellow-100 text-yellow-700',
      WORK_FROM_HOME: 'bg-blue-100 text-blue-700',
      ON_LEAVE: 'bg-purple-100 text-purple-700',
      HOLIDAY: 'bg-gray-100 text-gray-700',
      WEEKEND: 'bg-gray-100 text-gray-700'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  const formatWorkingHours = (hours) => {
    if (!hours) return '--';
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  const handleCheckInOutSuccess = () => {
    // Refresh attendance data after check-in/out
    fetchAttendanceByDate();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Attendance Dashboard</h1>
        <div className="flex items-center gap-3 bg-white rounded-lg shadow-md px-4 py-2">
          <Calendar size={20} className="text-blue-600" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className="border-0 focus:ring-0 font-semibold text-gray-700"
          />
        </div>
      </div>

      {/* Check In/Out Component - Only show for today's date */}
      {selectedDate === new Date().toISOString().split('T')[0] && (
        <CheckInOut onSuccess={handleCheckInOutSuccess} />
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <Users className="text-blue-600" size={24} />
            </div>
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">Total Employees</h3>
          <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-50 p-3 rounded-lg">
              <TrendingUp className="text-green-600" size={24} />
            </div>
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">Present</h3>
          <p className="text-3xl font-bold text-green-600">{stats.present}</p>
          <p className="text-sm text-gray-500 mt-1">
            {stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0}% attendance
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-red-50 p-3 rounded-lg">
              <Users className="text-red-600" size={24} />
            </div>
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">Absent</h3>
          <p className="text-3xl font-bold text-red-600">{stats.absent}</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-orange-50 p-3 rounded-lg">
              <Clock className="text-orange-600" size={24} />
            </div>
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">Late Arrivals</h3>
          <p className="text-3xl font-bold text-orange-600">{stats.late}</p>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Users size={24} />
            Employee Attendance - {new Date(selectedDate).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Employee Code</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Name</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Check-in</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Check-out</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Working Hours</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {todayAttendance.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-gray-500">
                    No attendance records for this date
                  </td>
                </tr>
              ) : (
                todayAttendance.map((record) => (
                  <tr
                    key={record.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                  >
                    <td className="py-4 px-6 font-medium text-gray-800">
                      {record.employeeCode}
                    </td>
                    <td className="py-4 px-6 text-gray-700">
                      {record.employeeName}
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-700">
                        {record.checkInTime || '--:--'}
                      </span>
                      {record.isLate && (
                        <span className="ml-2 text-xs text-red-600 font-semibold">⚠️ Late</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-gray-700">
                      {record.checkOutTime || '--:--'}
                    </td>
                    <td className="py-4 px-6 font-semibold text-gray-800">
                      {formatWorkingHours(record.workingHours)}
                    </td>
                    <td className="py-4 px-6">
                      {getStatusBadge(record.status)}
                    </td>
                    <td className="py-4 px-6 text-gray-600 text-sm max-w-xs truncate">
                      {record.remarks || '--'}
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

export default AttendanceDashboard;