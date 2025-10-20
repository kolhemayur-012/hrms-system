// src/components/payroll/GeneratePayroll.jsx
import { useState, useEffect } from 'react';
import { DollarSign, Users, Calendar, CheckCircle } from 'lucide-react';
import payrollService from '../../services/payrollService';

const GeneratePayroll = () => {
  const currentDate = new Date();
  const [year, setYear] = useState(currentDate.getFullYear());
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [bonus, setBonus] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedPayslips, setGeneratedPayslips] = useState([]);
  const [monthlyPayslips, setMonthlyPayslips] = useState([]);

  useEffect(() => {
    fetchMonthlyPayslips();
  }, [year, month]);

  const fetchMonthlyPayslips = async () => {
    try {
      const data = await payrollService.getPayslipsByMonth(year, month);
      setMonthlyPayslips(data);
    } catch (error) {
      console.error('Failed to fetch payslips:', error);
    }
  };

  const handleGeneratePayroll = async () => {
    if (!window.confirm(`Generate payroll for ${getMonthName(month)} ${year}?`)) {
      return;
    }

    setLoading(true);
    try {
      const bonusAmount = bonus ? parseFloat(bonus) : 0;
      const payslips = await payrollService.generatePayrollForAll(year, month, bonusAmount);
      
      setGeneratedPayslips(payslips);
      alert(`Successfully generated ${payslips.length} payslips!`);
      fetchMonthlyPayslips();
      setBonus('');
    } catch (error) {
      console.error('Failed to generate payroll:', error);
      alert(error.response?.data || 'Failed to generate payroll');
    } finally {
      setLoading(false);
    }
  };

  const getMonthName = (m) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'];
    return months[m - 1];
  };

  const years = Array.from({ length: 5 }, (_, i) => currentDate.getFullYear() - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Generate Payroll</h1>
        <p className="text-gray-600 mt-1">Generate monthly payslips for all employees</p>
      </div>

      {/* Generate Payroll Card */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Calendar size={24} />
          Select Pay Period
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Year Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Year
            </label>
            <select
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          {/* Month Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Month
            </label>
            <select
              value={month}
              onChange={(e) => setMonth(parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {months.map(m => (
                <option key={m} value={m}>{getMonthName(m)}</option>
              ))}
            </select>
          </div>

          {/* Bonus */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Bonus (Optional)
            </label>
            <input
              type="number"
              value={bonus}
              onChange={(e) => setBonus(e.target.value)}
              min="0"
              step="0.01"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            ℹ️ This will generate payslips for all employees who have salary structure configured. 
            Payroll will be calculated based on attendance and leave data for {getMonthName(month)} {year}.
          </p>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGeneratePayroll}
          disabled={loading}
          className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-lg transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
        >
          <DollarSign size={24} />
          {loading ? 'Generating Payroll...' : 'Generate Payroll for All Employees'}
        </button>
      </div>

      {/* Generated Payslips Summary */}
      {generatedPayslips.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle size={24} className="text-green-600" />
            <h3 className="text-lg font-bold text-green-800">
              Successfully Generated {generatedPayslips.length} Payslips
            </h3>
          </div>
          <div className="space-y-2">
            {generatedPayslips.map((payslip, index) => (
              <div key={index} className="flex justify-between items-center bg-white p-3 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-800">{payslip.employeeName}</p>
                  <p className="text-sm text-gray-500">{payslip.employeeCode}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">${payslip.netSalary?.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Net Salary</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Existing Payslips for Selected Month */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Users size={24} />
            Payslips for {getMonthName(month)} {year}
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Employee</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Gross Salary</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Deductions</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Net Salary</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Present/Working Days</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Generated</th>
              </tr>
            </thead>
            <tbody>
              {monthlyPayslips.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-gray-500">
                    No payslips generated for {getMonthName(month)} {year}
                  </td>
                </tr>
              ) : (
                monthlyPayslips.map((payslip) => (
                  <tr
                    key={payslip.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                  >
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-semibold text-gray-800">{payslip.employeeName}</p>
                        <p className="text-sm text-gray-500">{payslip.employeeCode}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-semibold text-gray-800">
                      ${payslip.grossSalary?.toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-red-600 font-semibold">
                      ${payslip.totalDeductions?.toLocaleString()}
                    </td>
                    <td className="py-4 px-6 font-bold text-green-600 text-lg">
                      ${payslip.netSalary?.toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-gray-700">
                      {payslip.presentDays} / {payslip.workingDays}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        payslip.status === 'PAID' ? 'bg-green-100 text-green-700' :
                        payslip.status === 'SENT' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {payslip.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {new Date(payslip.generatedDate).toLocaleDateString()}
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

export default GeneratePayroll;