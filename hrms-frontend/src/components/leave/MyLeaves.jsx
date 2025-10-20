// src/components/leave/MyLeaves.jsx
import { useState, useEffect } from 'react';
import { Calendar, Plus, X, CheckCircle, XCircle, Clock } from 'lucide-react';
import leaveService from '../../services/leaveService';
import { useAuth } from '../../context/AuthContext';
import ApplyLeave from './ApplyLeave';

const MyLeaves = () => {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showApplyForm, setShowApplyForm] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [leavesData, balancesData] = await Promise.all([
        leaveService.getMyLeaves(user.id),
        leaveService.getLeaveBalance(user.id)
      ]);
      setLeaves(leavesData);
      setBalances(balancesData);
    } catch (error) {
      console.error('Failed to fetch leave data:', error);
      alert('Failed to load leave data');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (leaveId) => {
    if (!window.confirm('Are you sure you want to cancel this leave request?')) {
      return;
    }

    try {
      await leaveService.cancelLeave(leaveId, user.id);
      alert('Leave request cancelled successfully');
      fetchData();
    } catch (error) {
      console.error('Failed to cancel leave:', error);
      alert(error.response?.data || 'Failed to cancel leave');
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      PENDING: 'bg-yellow-100 text-yellow-700',
      APPROVED: 'bg-green-100 text-green-700',
      REJECTED: 'bg-red-100 text-red-700',
      CANCELLED: 'bg-gray-100 text-gray-700'
    };

    const icons = {
      PENDING: Clock,
      APPROVED: CheckCircle,
      REJECTED: XCircle,
      CANCELLED: X
    };

    const Icon = icons[status];

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${styles[status]}`}>
        <Icon size={14} />
        {status}
      </span>
    );
  };

  const getLeaveTypeColor = (type) => {
    const colors = {
      SICK: 'text-red-600',
      CASUAL: 'text-blue-600',
      EARNED: 'text-green-600',
      MATERNITY: 'text-pink-600',
      PATERNITY: 'text-indigo-600',
      UNPAID: 'text-gray-600'
    };
    return colors[type] || 'text-gray-600';
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
        <h1 className="text-3xl font-bold text-gray-800">My Leaves</h1>
        <button
          onClick={() => setShowApplyForm(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg shadow-lg transition transform hover:scale-105"
        >
          <Plus size={20} />
          <span>Apply Leave</span>
        </button>
      </div>

      {/* Leave Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {balances.map((balance) => (
          <div
            key={balance.id}
            className="bg-white rounded-xl shadow-md p-4 border-l-4 border-blue-500"
          >
            <h3 className="text-sm font-semibold text-gray-600 mb-2">
              {balance.leaveType.replace('_', ' ')}
            </h3>
            <div className="space-y-1 text-xs">
              <p className="flex justify-between">
                <span className="text-gray-500">Total:</span>
                <span className="font-semibold">{balance.totalAllowed}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-500">Used:</span>
                <span className="font-semibold text-red-600">{balance.used}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-500">Pending:</span>
                <span className="font-semibold text-yellow-600">{balance.pending}</span>
              </p>
              <p className="flex justify-between pt-1 border-t">
                <span className="text-gray-500">Available:</span>
                <span className="font-bold text-green-600 text-lg">{balance.available}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Leave Requests Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Calendar size={24} />
            Leave History
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Type</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Start Date</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">End Date</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Days</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Reason</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Applied On</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaves.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-12 text-gray-500">
                    No leave requests found. Click "Apply Leave" to create one.
                  </td>
                </tr>
              ) : (
                leaves.map((leave) => (
                  <tr
                    key={leave.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                  >
                    <td className="py-4 px-6">
                      <span className={`font-semibold ${getLeaveTypeColor(leave.leaveType)}`}>
                        {leave.leaveType}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-700">
                      {new Date(leave.startDate).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-gray-700">
                      {new Date(leave.endDate).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 font-semibold text-gray-800">
                      {leave.numberOfDays}
                    </td>
                    <td className="py-4 px-6 text-gray-600 max-w-xs truncate">
                      {leave.reason}
                    </td>
                    <td className="py-4 px-6">
                      {getStatusBadge(leave.status)}
                    </td>
                    <td className="py-4 px-6 text-gray-600 text-sm">
                      {new Date(leave.appliedDate).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      {leave.status === 'PENDING' && (
                        <button
                          onClick={() => handleCancel(leave.id)}
                          className="text-red-600 hover:text-red-800 font-semibold text-sm"
                        >
                          Cancel
                        </button>
                      )}
                      {leave.status === 'REJECTED' && leave.approverComments && (
                        <span className="text-xs text-gray-500" title={leave.approverComments}>
                          View Reason
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Apply Leave Modal */}
      {showApplyForm && (
        <ApplyLeave
          onClose={() => setShowApplyForm(false)}
          onSuccess={fetchData}
        />
      )}
    </div>
  );
};

export default MyLeaves;