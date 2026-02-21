/**
 * Role-based routing utilities
 * Maps user_roles.role_name from DB to dashboard routes
 */

import { all_routes } from '../../feature-module/router/all_routes';

export type UserRole = 'Admin' | 'Teacher' | 'Student' | 'Parent' | 'Guardian';

/**
 * Get dashboard route for a given role
 * role_name comes from user_roles table (case-sensitive: Admin, Student, Teacher, Parent, Guardian)
 */
export function getDashboardForRole(role: string | undefined | null): string {
  if (!role) return all_routes.adminDashboard;
  const normalized = (role || '').trim().toLowerCase();
  switch (normalized) {
    case 'admin':
      return all_routes.adminDashboard;
    case 'teacher':
      return all_routes.teacherDashboard;
    case 'student':
      return all_routes.studentDashboard;
    case 'parent':
      return all_routes.parentDashboard;
    case 'guardian':
      return all_routes.guardianDashboard;
    default:
      return all_routes.adminDashboard;
  }
}

/**
 * Check if user with given role can access the given path
 */
export function canAccessPath(path: string, role: string | undefined | null): boolean {
  const userDashboard = getDashboardForRole(role);
  const dashboardPaths = [
    all_routes.adminDashboard,
    all_routes.teacherDashboard,
    all_routes.studentDashboard,
    all_routes.parentDashboard,
    all_routes.guardianDashboard,
  ];
  if (dashboardPaths.includes(path)) {
    return path === userDashboard;
  }
  return true;
}
