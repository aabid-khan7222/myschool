import { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

/**
 * Fetches the current logged-in student's data (for Student role users).
 * Uses /students/me API which returns student by user_id from JWT.
 */
export const useCurrentStudent = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCurrentStudent = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getCurrentStudent();
      if (response.status === 'SUCCESS' && response.data) {
        setStudent(response.data);
      } else {
        setStudent(null);
      }
    } catch (err) {
      console.error('Error fetching current student:', err);
      setError(err?.message || 'Failed to fetch student');
      setStudent(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentStudent();
  }, []);

  return {
    student,
    loading,
    error,
    refetch: fetchCurrentStudent,
  };
};
