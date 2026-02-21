import { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

/**
 * Fetches the current logged-in teacher's data (for Teacher role users).
 * Uses /teachers/me API which returns teacher by user_id from JWT via staff.
 */
export const useCurrentTeacher = () => {
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCurrentTeacher = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getCurrentTeacher();
      if (response.status === 'SUCCESS' && response.data) {
        setTeacher(response.data);
      } else {
        setTeacher(null);
      }
    } catch (err) {
      console.error('Error fetching current teacher:', err);
      setError(err?.message || 'Failed to fetch teacher');
      setTeacher(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentTeacher();
  }, []);

  return {
    teacher,
    loading,
    error,
    refetch: fetchCurrentTeacher,
  };
};
