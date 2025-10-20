// src/components/attendance/CheckInOut.jsx
import { useState, useEffect } from 'react';
import { Clock, LogIn, LogOut, Calendar } from 'lucide-react';
import attendanceService from '../../services/attendanceService';
import { useAuth } from '../../context/AuthContext';

const CheckInOut = () => {
  const { user } = useAuth();
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTodayAttendance();
    
    // Update clock every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const fetchTodayAttendance = async () => {
    try {
      const data = await attendanceService.getTodayAttendance(user.id);
      setTodayAttendance(data);
    } catch (error) {
      console.error('Failed to fetch attendance:', error);
    }
  };

  const handleCheckIn = async () => {
    setLoading(true);
    try {
      await attendanceService.checkIn(user.id, remarks);
      alert('Checked in successfully!');
      setRemarks('');
      fetchTodayAttendance();
    } catch (error) {
      console.error('Check-in failed:', error);
      alert(error.response?.data || 'Check-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setLoading(true);
    try {
      await attendanceService.checkOut(user.id, remarks);
      alert('Checked out successfully!');
      setRemarks('');
      fetchTodayAttendance();
    } catch (error) {
      console.error('Check-out failed:', error);
      alert(error.response?.data || 'Check-out failed');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (time) => {
    if (!time) return '--:--';
    return time;
  };

  const calculateWorkingHours = () => {
    if (todayAttendance?.workingHours) {
      const hours = Math.floor(todayAttendance.workingHours);
      const minutes = Math.round((todayAttendance.workingHours - hours) * 60);
      return `${hours}h ${minutes}m`;
    }
    return '--';
  };

  const hasCheckedIn = todayAttendance?.checkInTime;
  const hasCheckedOut = todayAttendance?.checkOutTime;

  return (
    <div className="space-y-6">
      {/* Current Time Display */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Clock size={32} />
              <h2 className="text-3xl font-bold">Current Time</h2>
            </div>
            <p className="text-6xl font-bold mt-4">
              {currentTime.toLocaleTimeString()}
            </p>
            <p className="text-xl mt-2 opacity-90">
              {currentTime.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <Calendar size={120} className="opacity-20" />
        </div>
      </div>

      {/* Attendance Status Card */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Today's Attendance</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Check-in Time */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <LogIn className="text-green-600" size={20} />
              <p className="text-sm font-semibold text-gray-600">Check-in Time</p>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {formatTime(todayAttendance?.checkInTime)}
            </p>
            {todayAttendance?.isLate && (
              <span className="text-xs text-red-600 font-semibold mt-1 block">
                ⚠️ Late Arrival
              </span>
            )}
          </div>

          {/* Check-out Time */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <LogOut className="text-red-600" size={20} />
              <p className="text-sm font-semibold text-gray-600">Check-out Time</p>
            </div>
            <p className="text-2xl font-bold text-red-600">
              {formatTime(todayAttendance?.checkOutTime)}
            </p>
          </div>

          {/* Working Hours */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="text-blue-600" size={20} />
              <p className="text-sm font-semibold text-gray-600">Working Hours</p>
            </div>
            <p className="text-2xl font-bold text-blue-600">
              {calculateWorkingHours()}
            </p>
          </div>
        </div>

        {/* Remarks Input */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Remarks (Optional)
          </label>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows="2"
            placeholder="Add any remarks..."
            disabled={hasCheckedOut}
          />
        </div>

        {/* Check-in/Check-out Buttons */}
        <div className="flex gap-4">
          {!hasCheckedIn ? (
            <button
              onClick={handleCheckIn}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-lg transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              <LogIn size={24} />
              {loading ? 'Checking In...' : 'Check In'}
            </button>
          ) : !hasCheckedOut ? (
            <button
              onClick={handleCheckOut}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-6 rounded-lg transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              <LogOut size={24} />
              {loading ? 'Checking Out...' : 'Check Out'}
            </button>
          ) : (
            <div className="flex-1 bg-gray-100 text-gray-600 font-bold py-4 px-6 rounded-lg text-center">
              ✅ Attendance marked for today
            </div>
          )}
        </div>

        {/* Status Message */}
        {todayAttendance?.status && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Status:</span>{' '}
              <span className="text-blue-600 font-semibold">
                {todayAttendance.status.replace('_', ' ')}
              </span>
            </p>
            {todayAttendance.remarks && (
              <p className="text-sm text-gray-600 mt-1">
                <span className="font-semibold">Remarks:</span> {todayAttendance.remarks}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckInOut;