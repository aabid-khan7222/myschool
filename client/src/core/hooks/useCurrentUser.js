import { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

export const useCurrentUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCurrentUser = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get user ID from preskool_user (set by authSlice on login)
      let userId = null;
      try {
        const u = localStorage.getItem('preskool_user');
        if (u) {
          const user = JSON.parse(u);
          userId = user?.id?.toString() || user?.user_id?.toString();
        }
      } catch (_) {}
      if (!userId) {
        userId = localStorage.getItem('user_id') ||
          localStorage.getItem('userId') ||
          localStorage.getItem('current_user_id') ||
          localStorage.getItem('loggedInUserId');
      }

      if (!userId) {
        console.warn('No user ID found in localStorage');
        setUser(null);
        setLoading(false);
        return;
      }

      const response = await apiService.getUserById(userId);

      if (response.status === 'SUCCESS' && response.data) {
        const userData = response.data;
        
        // Use display_name and display_role from backend, or compute from available fields
        const name = 
          userData.display_name ||
          [userData.student_first_name, userData.student_last_name].filter(Boolean).join(' ') ||
          [userData.staff_first_name, userData.staff_last_name].filter(Boolean).join(' ') ||
          [userData.first_name, userData.last_name].filter(Boolean).join(' ') ||
          userData.username ||
          'User';

        const role = 
          userData.display_role ||
          userData.role_name ||
          (userData.student_first_name ? 'Student' : null) ||
          (userData.staff_first_name ? (userData.designation_name || 'Teacher') : null) ||
          'Admin';

        setUser({
          id: userData.id,
          name,
          role,
          ...userData,
        });
      } else {
        setError('Failed to fetch user data');
      }
    } catch (err) {
      console.error('Error fetching current user:', err);
      setError(err.message || 'Failed to fetch current user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return {
    user,
    loading,
    error,
    refetch: fetchCurrentUser,
  };
};
