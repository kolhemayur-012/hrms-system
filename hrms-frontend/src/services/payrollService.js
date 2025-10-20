// src/services/payrollService.js
import api from './api';

const payrollService = {
  // Salary Structure
  createOrUpdateSalaryStructure: async (salaryData) => {
    const response = await api.post('/payroll/salary-structure', salaryData);
    return response.data;
  },

  getSalaryStructure: async (employeeId) => {
    const response = await api.get(`/payroll/salary-structure/${employeeId}`);
    return response.data;
  },

  getAllSalaryStructures: async () => {
    const response = await api.get('/payroll/salary-structures');
    return response.data;
  },

  // Payslip Generation
  generatePayslip: async (employeeId, year, month, bonus = 0) => {
    const response = await api.post('/payroll/generate-payslip', {
      employeeId,
      year,
      month,
      bonus
    });
    return response.data;
  },

  generatePayrollForAll: async (year, month, bonus = 0) => {
    const response = await api.post('/payroll/generate-payroll', {
      year,
      month,
      bonus
    });
    return response.data;
  },

  // Get Payslips
  getMyPayslips: async (employeeId) => {
    const response = await api.get(`/payroll/my-payslips/${employeeId}`);
    return response.data;
  },

  getPayslip: async (payslipId) => {
    const response = await api.get(`/payroll/payslip/${payslipId}`);
    return response.data;
  },

  getPayslipsByMonth: async (year, month) => {
    const response = await api.get(`/payroll/payslips?year=${year}&month=${month}`);
    return response.data;
  },

  // Delete Payslip
  deletePayslip: async (payslipId) => {
    const response = await api.delete(`/payroll/payslip/${payslipId}`);
    return response.data;
  },
};

export default payrollService;