// src/components/attendance/MyAttendance.jsx
import { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import attendanceService from '../../services/attendanceService';
import { useAuth } from '../../context/AuthContext';

const MyAttendance = () => {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    present: 0,
    absent: 0,
    halfDay: 0,
    wfh: 0,
    leave: 0,
    late: 0,
    totalHours: 0
  });

  useEffect(() => {
    fetchAttendance();
  }, [currentMonth]);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth() + 1;

      const data = await attendanceService.getMyAttendance(user.id, year, month);
      setAttendance(data);
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
      present: data.filter(a => a.status === 'PRESENT').length,
      absent: data.filter(a => a.status === 'ABSENT').length,
      halfDay: data.filter(a => a.status === 'HALF_DAY').length,
      wfh: data.filter(a => a.status === 'WORK_FROM_HOME').length,
      leave: data.filter(a => a.status === 'ON_LEAVE').length,
      late: data.filter(a => a.isLate).length,
      totalHours: data.reduce((sum, a) => sum + (a.workingHours || 0), 0)
    };
    setStats(stats);
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Month Navigation */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">My Attendance</h1>
        <div className="flex items-center gap-4 bg-white rounded-lg shadow-md px-4 py-2">
          <button
            onClick={previousMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <Calendar size={20} className="text-blue-600" />
            <span className="font-bold text-lg">
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
          </div>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
            disabled={currentMonth.getMonth() === new Date().getMonth()}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-green-500">
          <p className="text-xs text-gray-500 mb-1">Present</p>
          <p className="text-2xl font-bold text-green-600">{stats.present}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-red-500">
          <p className="text-xs text-gray-500 mb-1">Absent</p>
          <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-yellow-500">
          <p className="text-xs text-gray-500 mb-1">Half Day</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.halfDay}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-blue-500">
          <p className="text-xs text-gray-500 mb-1">WFH</p>
          <p className="text-2xl font-bold text-blue-600">{stats.wfh}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-purple-500">
          <p className="text-xs text-gray-500 mb-1">Leave</p>
          <p className="text-2xl font-bold text-purple-600">{stats.leave}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-orange-500">
          <p className="text-xs text-gray-500 mb-1">Late Days</p>
          <p className="text-2xl font-bold text-orange-600">{stats.late}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-indigo-500">
          <p className="text-xs text-gray-500 mb-1">Total Hours</p>
          <p className="text-xl font-bold text-indigo-600">{stats.totalHours.toFixed(1)}h</p>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Clock size={24} />
            Attendance Records
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Date</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Day</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Check-in</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Check-out</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Working Hours</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {attendance.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-gray-500">
                    No attendance records for this month
                  </td>
                </tr>
              ) : (
                attendance.map((record) => (
                  <tr
                    key={record.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                  >
                    <td className="py-4 px-6 font-medium text-gray-800">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      {new Date(record.date).toLocaleDateString('en-US', { weekday: 'short' })}
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

export default MyAttendance;