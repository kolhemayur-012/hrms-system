// src/services/attendanceService.js
import api from './api';

const attendanceService = {
  // Check in
  checkIn: async (employeeId, remarks) => {
    const response = await api.post('/attendance/check-in', {
      employeeId,
      remarks
    });
    return response.data;
  },

  // Check out
  checkOut: async (employeeId, remarks) => {
    const response = await api.post('/attendance/check-out', {
      employeeId,
      remarks
    });
    return response.data;
  },

  // Get today's attendance
  getTodayAttendance: async (employeeId) => {
    const response = await api.get(`/attendance/today/${employeeId}`);
    return response.data;
  },

  // Get my attendance (with optional year/month filter)
  getMyAttendance: async (employeeId, year = null, month = null) => {
    let url = `/attendance/my-attendance/${employeeId}`;
    const params = [];
    if (year) params.push(`year=${year}`);
    if (month) params.push(`month=${month}`);
    if (params.length > 0) url += `?${params.join('&')}`;
    
    const response = await api.get(url);
    return response.data;
  },

  // Get attendance by date
  getAttendanceByDate: async (date) => {
    const response = await api.get(`/attendance/date/${date}`);
    return response.data;
  },

  // Get attendance by date range
  getAttendanceByDateRange: async (startDate, endDate) => {
    const response = await api.get(
      `/attendance/date-range?startDate=${startDate}&endDate=${endDate}`
    );
    return response.data;
  },

  // Mark attendance (Admin/Manager)
  markAttendance: async (attendanceData) => {
    const response = await api.post('/attendance/mark', attendanceData);
    return response.data;
  },

  // Get monthly report
  getMonthlyReport: async (employeeId, year, month) => {
    const response = await api.get(
      `/attendance/report/${employeeId}?year=${year}&month=${month}`
    );
    return response.data;
  },

  // Delete attendance
  deleteAttendance: async (attendanceId) => {
    const response = await api.delete(`/attendance/${attendanceId}`);
    return response.data;
  },
};

export default attendanceService;