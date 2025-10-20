// src/services/leaveService.js
import api from './api';

const leaveService = {
  // Apply for leave
  applyLeave: async (leaveData) => {
    const response = await api.post('/leaves/apply', leaveData);
    return response.data;
  },

  // Get my leave requests
  getMyLeaves: async (employeeId) => {
    const response = await api.get(`/leaves/my-leaves/${employeeId}`);
    return response.data;
  },

  // Get leave balance
  getLeaveBalance: async (employeeId) => {
    const response = await api.get(`/leaves/balance/${employeeId}`);
    return response.data;
  },

  // Get pending leaves (for managers/admin)
  getPendingLeaves: async () => {
    const response = await api.get('/leaves/pending');
    return response.data;
  },

  // Get all leaves (for admin)
  getAllLeaves: async () => {
    const response = await api.get('/leaves/all');
    return response.data;
  },

  // Approve leave
  approveLeave: async (leaveId, comments, approverId) => {
    const response = await api.put(`/leaves/approve/${leaveId}`, {
      comments,
      approverId: approverId.toString()
    });
    return response.data;
  },

  // Reject leave
  rejectLeave: async (leaveId, comments, approverId) => {
    const response = await api.put(`/leaves/reject/${leaveId}`, {
      comments,
      approverId: approverId.toString()
    });
    return response.data;
  },

  // Cancel leave
  cancelLeave: async (leaveId, employeeId) => {
    const response = await api.put(`/leaves/cancel/${leaveId}/${employeeId}`);
    return response.data;
  },
};

export default leaveService;