import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { superAdminApiService } from '../services/superAdminApiService';
import {
  setSuperAdminAuthFromSession,
  setSuperAdminAuthChecked,
} from '../data/redux/superAdminAuthSlice';

/**
 * Hydrates Super Admin auth state from HTTP-only cookie when on /super-admin routes.
 * Calls /super-admin/api/me and sets Redux on success.
 */
export const SuperAdminAuthBootstrap = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  useEffect(() => {
    let cancelled = false;
    const isSuperAdminPath = pathname.startsWith('/super-admin');

    const bootstrap = async () => {
      if (!isSuperAdminPath) {
        if (!cancelled) dispatch(setSuperAdminAuthChecked());
        return;
      }
      try {
        const res = await superAdminApiService.getProfile();
        if (cancelled) return;
        if (res.status === 'SUCCESS' && res.data) {
          const d = res.data;
          dispatch(
            setSuperAdminAuthFromSession({
              user: {
                id: d.id,
                username: d.username,
                email: d.email,
                role: d.role || 'super_admin',
              },
            })
          );
        } else {
          dispatch(setSuperAdminAuthChecked());
        }
      } catch {
        if (!cancelled) dispatch(setSuperAdminAuthChecked());
      }
    };

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, [dispatch, pathname]);

  return null;
};

