// src/components/payroll/SalaryStructureForm.jsx
import { useState, useEffect } from 'react';
import { X, DollarSign } from 'lucide-react';
import payrollService from '../../services/payrollService';

const SalaryStructureForm = ({ structure, employees, onClose }) => {
  const [formData, setFormData] = useState({
    employeeId: '',
    basicSalary: '',
    hra: '',
    da: '',
    medicalAllowance: '',
    transportAllowance: '',
    otherAllowances: '',
    pfDeduction: '',
    taxDeduction: '',
    otherDeductions: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (structure) {
      setFormData({
        employeeId: structure.employeeId,
        basicSalary: structure.basicSalary || '',
        hra: structure.hra || '',
        da: structure.da || '',
        medicalAllowance: structure.medicalAllowance || '',
        transportAllowance: structure.transportAllowance || '',
        otherAllowances: structure.otherAllowances || '',
        pfDeduction: structure.pfDeduction || '',
        taxDeduction: structure.taxDeduction || '',
        otherDeductions: structure.otherDeductions || ''
      });
    }
  }, [structure]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateGross = () => {
    const basic = parseFloat(formData.basicSalary) || 0;
    const hra = parseFloat(formData.hra) || 0;
    const da = parseFloat(formData.da) || 0;
    const medical = parseFloat(formData.medicalAllowance) || 0;
    const transport = parseFloat(formData.transportAllowance) || 0;
    const other = parseFloat(formData.otherAllowances) || 0;
    return basic + hra + da + medical + transport + other;
  };

  const calculateDeductions = () => {
    const pf = parseFloat(formData.pfDeduction) || 0;
    const tax = parseFloat(formData.taxDeduction) || 0;
    const other = parseFloat(formData.otherDeductions) || 0;
    return pf + tax + other;
  };

  const calculateNet = () => {
    return calculateGross() - calculateDeductions();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await payrollService.createOrUpdateSalaryStructure(formData);
      alert(`Salary structure ${structure ? 'updated' : 'created'} successfully`);
      onClose();
    } catch (error) {
      console.error('Failed to save salary structure:', error);
      alert(error.response?.data || 'Failed to save salary structure');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-3">
            <DollarSign size={28} />
            <h2 className="text-2xl font-bold">
              {structure ? 'Edit' : 'Create'} Salary Structure
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Employee Selection */}
          {!structure && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Employee *
              </label>
              <select
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">-- Select Employee --</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.employeeCode} - {emp.firstName} {emp.lastName}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Earnings Section */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">
              💰 Earnings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Basic Salary *
                </label>
                <input
                  type="number"
                  name="basicSalary"
                  value={formData.basicSalary}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="50000"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  HRA (House Rent Allowance)
                </label>
                <input
                  type="number"
                  name="hra"
                  value={formData.hra}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="15000"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  DA (Dearness Allowance)
                </label>
                <input
                  type="number"
                  name="da"
                  value={formData.da}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="5000"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Medical Allowance
                </label>
                <input
                  type="number"
                  name="medicalAllowance"
                  value={formData.medicalAllowance}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="2000"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Transport Allowance
                </label>
                <input
                  type="number"
                  name="transportAllowance"
                  value={formData.transportAllowance}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="1600"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Other Allowances
                </label>
                <input
                  type="number"
                  name="otherAllowances"
                  value={formData.otherAllowances}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="3000"
                />
              </div>
            </div>
          </div>

          {/* Deductions Section */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">
              📉 Deductions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  PF (Provident Fund)
                </label>
                <input
                  type="number"
                  name="pfDeduction"
                  value={formData.pfDeduction}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="1800"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tax (TDS)
                </label>
                <input
                  type="number"
                  name="taxDeduction"
                  value={formData.taxDeduction}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="5000"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Other Deductions
                </label>
                <input
                  type="number"
                  name="otherDeductions"
                  value={formData.otherDeductions}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="500"
                />
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-600 mb-1">Gross Salary</p>
                <p className="text-2xl font-bold text-green-600">
                  ${calculateGross().toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Deductions</p>
                <p className="text-2xl font-bold text-red-600">
                  -${calculateDeductions().toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Net Salary</p>
                <p className="text-3xl font-bold text-blue-600">
                  ${calculateNet().toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? 'Saving...' : structure ? 'Update Structure' : 'Create Structure'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SalaryStructureForm;