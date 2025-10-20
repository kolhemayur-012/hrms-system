// src/components/payroll/PayslipView.jsx
import { X, Download, FileText } from 'lucide-react';

const PayslipView = ({ payslip, onClose }) => {
  const getMonthName = (month) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
    return months[month - 1];
  };

  const handleDownload = () => {
    // Future: Implement PDF download
    alert('PDF download will be implemented in next update');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-3">
            <FileText size={28} />
            <div>
              <h2 className="text-2xl font-bold">Payslip</h2>
              <p className="text-sm opacity-90">
                {getMonthName(payslip.month)} {payslip.year}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleDownload}
              className="p-2 hover:bg-white/10 rounded-lg transition"
              title="Download PDF"
            >
              <Download size={24} />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Payslip Content */}
        <div className="p-8">
          {/* Company & Employee Info */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">HRMS Portal</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500">Employee Name</p>
                <p className="font-semibold text-gray-800">{payslip.employeeName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Employee Code</p>
                <p className="font-semibold text-gray-800">{payslip.employeeCode}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Pay Period</p>
                <p className="font-semibold text-gray-800">
                  {getMonthName(payslip.month)} {payslip.year}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Date</p>
                <p className="font-semibold text-gray-800">
                  {new Date(payslip.generatedDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Attendance Summary */}
          <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-bold text-gray-800 mb-3">Attendance Summary</h4>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-600">Working Days</p>
                <p className="text-xl font-bold text-gray-800">{payslip.workingDays}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Present Days</p>
                <p className="text-xl font-bold text-green-600">{payslip.presentDays}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Absent Days</p>
                <p className="text-xl font-bold text-red-600">{payslip.absentDays}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Leave Days</p>
                <p className="text-xl font-bold text-yellow-600">{payslip.leaveDays}</p>
              </div>
            </div>
          </div>

          {/* Earnings & Deductions */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            {/* Earnings */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-bold text-gray-800 mb-4 pb-2 border-b">Earnings</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Basic Salary</span>
                  <span className="font-semibold">${payslip.basicSalary?.toLocaleString()}</span>
                </div>
                {payslip.hra > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">HRA</span>
                    <span className="font-semibold">${payslip.hra?.toLocaleString()}</span>
                  </div>
                )}
                {payslip.da > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">DA</span>
                    <span className="font-semibold">${payslip.da?.toLocaleString()}</span>
                  </div>
                )}
                {payslip.medicalAllowance > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Medical Allowance</span>
                    <span className="font-semibold">${payslip.medicalAllowance?.toLocaleString()}</span>
                  </div>
                )}
                {payslip.transportAllowance > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transport Allowance</span>
                    <span className="font-semibold">${payslip.transportAllowance?.toLocaleString()}</span>
                  </div>
                )}
                {payslip.otherAllowances > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Other Allowances</span>
                    <span className="font-semibold">${payslip.otherAllowances?.toLocaleString()}</span>
                  </div>
                )}
                {payslip.bonus > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bonus</span>
                    <span className="font-semibold text-green-600">${payslip.bonus?.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between pt-3 border-t font-bold">
                  <span>Gross Salary</span>
                  <span className="text-green-600">${payslip.grossSalary?.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Deductions */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-bold text-gray-800 mb-4 pb-2 border-b">Deductions</h4>
              <div className="space-y-3">
                {payslip.pfDeduction > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Provident Fund</span>
                    <span className="font-semibold text-red-600">-${payslip.pfDeduction?.toLocaleString()}</span>
                  </div>
                )}
                {payslip.taxDeduction > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Income Tax (TDS)</span>
                    <span className="font-semibold text-red-600">-${payslip.taxDeduction?.toLocaleString()}</span>
                  </div>
                )}
                {payslip.absentDeduction > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Absent Deduction</span>
                    <span className="font-semibold text-red-600">-${payslip.absentDeduction?.toLocaleString()}</span>
                  </div>
                )}
                {payslip.unpaidLeaveDeduction > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Unpaid Leave</span>
                    <span className="font-semibold text-red-600">-${payslip.unpaidLeaveDeduction?.toLocaleString()}</span>
                  </div>
                )}
                {payslip.otherDeductions > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Other Deductions</span>
                    <span className="font-semibold text-red-600">-${payslip.otherDeductions?.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between pt-3 border-t font-bold">
                  <span>Total Deductions</span>
                  <span className="text-red-600">-${payslip.totalDeductions?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Net Salary */}
          <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg p-6 text-center">
            <p className="text-lg mb-2">Net Salary</p>
            <p className="text-5xl font-bold">${payslip.netSalary?.toLocaleString()}</p>
            <p className="text-sm mt-2 opacity-90">Amount payable for {getMonthName(payslip.month)} {payslip.year}</p>
          </div>

          {/* Remarks */}
          {payslip.remarks && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm font-semibold text-gray-700 mb-1">Remarks:</p>
              <p className="text-sm text-gray-600">{payslip.remarks}</p>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 pt-6 border-t text-center text-xs text-gray-500">
            <p>This is a computer-generated payslip and does not require a signature.</p>
            <p className="mt-1">Generated on {new Date(payslip.generatedDate).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayslipView;