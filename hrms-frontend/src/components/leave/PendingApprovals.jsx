// src/components/leave/PendingApprovals.jsx
import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, User } from 'lucide-react';
import leaveService from '../../services/leaveService';
import { useAuth } from '../../context/AuthContext';

const PendingApprovals = () => {
  const { user } = useAuth();
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [comments, setComments] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchPendingLeaves();
  }, []);

  const fetchPendingLeaves = async () => {
    try {
      setLoading(true);
      const data = await leaveService.getPendingLeaves();
      setPendingLeaves(data);
    } catch (error) {
      console.error('Failed to fetch pending leaves:', error);
      alert('Failed to load pending leaves');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (leaveId) => {
    if (!window.confirm('Are you sure you want to approve this leave?')) {
      return;
    }

    setProcessing(true);
    try {
      await leaveService.approveLeave(leaveId, comments, user.id);
      alert('Leave approved successfully');
      setSelectedLeave(null);
      setComments('');
      fetchPendingLeaves();
    } catch (error) {
      console.error('Failed to approve leave:', error);
      alert(error.response?.data || 'Failed to approve leave');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async (leaveId) => {
    if (!comments.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    if (!window.confirm('Are you sure you want to reject this leave?')) {
      return;
    }

    setProcessing(true);
    try {
      await leaveService.rejectLeave(leaveId, comments, user.id);
      alert('Leave rejected successfully');
      setSelectedLeave(null);
      setComments('');
      fetchPendingLeaves();
    } catch (error) {
      console.error('Failed to reject leave:', error);
      alert(error.response?.data || 'Failed to reject leave');
    } finally {
      setProcessing(false);
    }
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
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Pending Approvals</h1>
          <p className="text-gray-600 mt-1">
            {pendingLeaves.length} leave request{pendingLeaves.length !== 1 ? 's' : ''} awaiting approval
          </p>
        </div>
      </div>

      {/* Pending Leaves Grid */}
      {pendingLeaves.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <Clock size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Pending Approvals</h3>
          <p className="text-gray-500">All leave requests have been processed.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {pendingLeaves.map((leave) => (
            <div
              key={leave.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition"
            >
              {/* Card Header */}
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-4">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-3">
                    <User size={24} />
                    <div>
                      <h3 className="font-bold text-lg">{leave.employeeName}</h3>
                      <p className="text-sm opacity-90">{leave.employeeCode}</p>
                    </div>
                  </div>
                  <Clock size={24} />
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Leave Type</p>
                    <p className="font-semibold text-gray-800">{leave.leaveType}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Duration</p>
                    <p className="font-semibold text-gray-800">{leave.numberOfDays} days</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Start Date</p>
                    <p className="font-semibold text-gray-800">
                      {new Date(leave.startDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">End Date</p>
                    <p className="font-semibold text-gray-800">
                      {new Date(leave.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">Reason</p>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                    {leave.reason}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">Applied On</p>
                  <p className="text-sm text-gray-700">
                    {new Date(leave.appliedDate).toLocaleString()}
                  </p>
                </div>

                {/* Comments Section */}
                {selectedLeave === leave.id && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Comments (optional for approval, required for rejection)
                    </label>
                    <textarea
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows="3"
                      placeholder="Add your comments here..."
                    />
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  {selectedLeave === leave.id ? (
                    <>
                      <button
                        onClick={() => handleApprove(leave.id)}
                        disabled={processing}
                        className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition disabled:opacity-50"
                      >
                        <CheckCircle size={18} />
                        {processing ? 'Processing...' : 'Confirm Approve'}
                      </button>
                      <button
                        onClick={() => handleReject(leave.id)}
                        disabled={processing}
                        className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg transition disabled:opacity-50"
                      >
                        <XCircle size={18} />
                        {processing ? 'Processing...' : 'Confirm Reject'}
                      </button>
                      <button
                        onClick={() => {
                          setSelectedLeave(null);
                          setComments('');
                        }}
                        className="px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setSelectedLeave(leave.id)}
                        className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition"
                      >
                        <CheckCircle size={18} />
                        Approve
                      </button>
                      <button
                        onClick={() => setSelectedLeave(leave.id)}
                        className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg transition"
                      >
                        <XCircle size={18} />
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingApprovals;