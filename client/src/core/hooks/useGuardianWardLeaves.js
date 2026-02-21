import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { apiService } from '../services/apiService';
import { selectUser } from '../data/redux/authSlice';

function formatLeaveDate(dateVal) {
  if (!dateVal) return 'N/A';
  const d = new Date(dateVal);
  if (Number.isNaN(d.getTime())) return 'N/A';
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatLeaveRange(startVal, endVal) {
  const start = formatLeaveDate(startVal);
  const end = formatLeaveDate(endVal);
  if (start === 'N/A' && end === 'N/A') return 'N/A';
  if (start === end) return start;
  return `${start} - ${end}`;
}

function getBadgeClass(leaveTypeName) {
  if (!leaveTypeName) return 'badge-soft-primary';
  const t = String(leaveTypeName).toLowerCase();
  if (t.includes('emergency')) return 'badge-soft-danger';
  if (t.includes('medical')) return 'badge-soft-success';
  if (t.includes('casual')) return 'badge-soft-primary';
  return 'badge-soft-primary';
}

export const useGuardianWardLeaves = (options = {}) => {
  const { limit = 20 } = options;
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useSelector(selectUser);
  const isGuardian = (user?.role || '').toLowerCase() === 'guardian';

  const fetchList = async () => {
    if (!isGuardian) {
      setList([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getGuardianWardLeaves({ limit });

      if (response.status === 'SUCCESS' && Array.isArray(response.data)) {
        const mapped = response.data.map((row, index) => {
          const name =
            [row.applicant_first_name, row.applicant_last_name].filter(Boolean).join(' ') ||
            row.applicant_name ||
            'N/A';
          const leaveType = row.leave_type_name || row.leave_type || row.type_name || 'N/A';
          const startDate = row.start_date || row.from_date;
          const endDate = row.end_date || row.to_date;
          const leaveRange = formatLeaveRange(startDate, endDate);
          const statusVal = row.status || row.leave_status || 'Pending';
          const statusLower = String(statusVal).toLowerCase();

          return {
            key: row.id != null ? String(row.id) : `leave-${index}`,
            id: row.id,
            name,
            leaveType,
            leaveRange,
            studentId: row.student_id,
            badgeClass: getBadgeClass(leaveType),
            status: statusVal,
            statusBadgeClass: statusLower.includes('approv') ? 'bg-success' : statusLower.includes('declin') || statusLower.includes('reject') ? 'bg-danger' : 'bg-skyblue',
          };
        });
        setList(mapped);
      } else {
        setList([]);
      }
    } catch (err) {
      console.error('Error fetching guardian ward leaves:', err);
      setError(err.message || 'Failed to fetch leave applications');
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, [limit, isGuardian]);

  return {
    leaveApplications: list,
    loading,
    error,
    refetch: fetchList,
  };
};
