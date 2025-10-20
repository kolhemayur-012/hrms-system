// src/services/employeeService.js
import api from './api';

const employeeService = {
  // Get all employees (paginated)
  getAllEmployees: async (page = 0, size = 10) => {
    const response = await api.get(`/employees?page=${page}&size=${size}`);
    return response.data;
  },

  // Get all employees (non-paginated)
  getAllEmployeesList: async () => {
    const response = await api.get('/employees/all');
    return response.data;
  },

  // Get employee by ID
  getEmployeeById: async (id) => {
    const response = await api.get(`/employees/${id}`);
    return response.data;
  },

  // Create new employee
  createEmployee: async (employeeData) => {
    const response = await api.post('/employees', employeeData);
    return response.data;
  },

  // Update employee
  updateEmployee: async (id, employeeData) => {
    const response = await api.put(`/employees/${id}`, employeeData);
    return response.data;
  },

  // Delete employee (soft delete - sets status to INACTIVE)
  deleteEmployee: async (id) => {
    const response = await api.delete(`/employees/${id}`);
    return response.data;
  },
};

export default employeeService;