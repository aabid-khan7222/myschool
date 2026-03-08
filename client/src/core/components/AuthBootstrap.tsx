import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { apiService } from '../services/apiService';
import { setAuthFromSession, setAuthChecked } from '../data/redux/authSlice';

/**
 * Runs on app load to hydrate auth state from HTTP-only cookie.
 * Calls /auth/me with credentials:include; if valid session exists, sets user in Redux.
 */
export const AuthBootstrap = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      try {
        const res = await apiService.getMe();
        if (cancelled) return;
        if (res.status === 'SUCCESS' && res.data) {
          const d = res.data;
          const displayName =
            d.display_name ||
            [d.student_first_name, d.student_last_name].filter(Boolean).join(' ') ||
            [d.staff_first_name, d.staff_last_name].filter(Boolean).join(' ') ||
            [d.first_name, d.last_name].filter(Boolean).join(' ') ||
            d.username ||
            'User';
          const role = d.display_role || d.role_name || 'User';
          dispatch(
            setAuthFromSession({
              user: {
                id: d.id,
                username: d.username,
                displayName,
                role,
                user_role_id: d.role_id,
                staff_id: d.staff_id,
                accountDisabled: d.account_disabled === true,
              },
            })
          );
        } else {
          dispatch(setAuthChecked());
        }
      } catch {
        if (!cancelled) dispatch(setAuthChecked());
      }
    };

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  return null;
};
