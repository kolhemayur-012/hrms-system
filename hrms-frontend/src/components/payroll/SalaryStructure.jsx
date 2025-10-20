// src/components/payroll/SalaryStructure.jsx
import { useState, useEffect } from 'react';
import { DollarSign, Edit, Plus } from 'lucide-react';
import payrollService from '../../services/payrollService';
import employeeService from '../../services/employeeService';
import SalaryStructureForm from './SalaryStructureForm';

const SalaryStructure = () => {
  const [structures, setStructures] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingStructure, setEditingStructure] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [structuresData, employeesData] = await Promise.all([
        payrollService.getAllSalaryStructures(),
        employeeService.getAllEmployeesList()
      ]);
      setStructures(structuresData);
      setEmployees(employeesData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      alert('Failed to load salary structures');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (structure) => {
    setEditingStructure(structure);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingStructure(null);
    fetchData();
  };

  const getEmployeesWithoutStructure = () => {
    const employeesWithStructure = structures.map(s => s.employeeId);
    return employees.filter(emp => !employeesWithStructure.includes(emp.id));
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
        <h1 className="text-3xl font-bold text-gray-800">Salary Structure Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg shadow-lg transition transform hover:scale-105"
        >
          <Plus size={20} />
          <span>Add Salary Structure</span>
        </button>
      </div>

      {/* Employees without structure warning */}
      {getEmployeesWithoutStructure().length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            ⚠️ <strong>{getEmployeesWithoutStructure().length}</strong> employees don't have salary structure yet.
          </p>
        </div>
      )}

      {/* Salary Structures Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <DollarSign size={24} />
            Salary Structures
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Employee</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Basic Salary</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">HRA</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">DA</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Allowances</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Gross Salary</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Deductions</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Net Salary</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {structures.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-12 text-gray-500">
                    No salary structures found. Click "Add Salary Structure" to create one.
                  </td>
                </tr>
              ) : (
                structures.map((structure) => (
                  <tr
                    key={structure.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                  >
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-semibold text-gray-800">{structure.employeeName}</p>
                        <p className="text-sm text-gray-500">{structure.employeeCode}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-semibold text-gray-800">
                      ${structure.basicSalary?.toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      ${structure.hra?.toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      ${structure.da?.toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      ${(
                        (structure.medicalAllowance || 0) +
                        (structure.transportAllowance || 0) +
                        (structure.otherAllowances || 0)
                      ).toLocaleString()}
                    </td>
                    <td className="py-4 px-6 font-bold text-green-600">
                      ${structure.grossSalary?.toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-red-600">
                      ${structure.totalDeductions?.toLocaleString()}
                    </td>
                    <td className="py-4 px-6 font-bold text-blue-600 text-lg">
                      ${structure.netSalary?.toLocaleString()}
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleEdit(structure)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Salary Structure Form Modal */}
      {showForm && (
        <SalaryStructureForm
          structure={editingStructure}
          employees={employees}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
};

export default SalaryStructure;