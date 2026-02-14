const { query } = require('../config/database');

// Get dashboard stats (counts for students, teachers, staff, subjects)
const getDashboardStats = async (req, res) => {
  try {
    const stats = {
      students: { total: 0, active: 0, inactive: 0 },
      teachers: { total: 0, active: 0, inactive: 0 },
      staff: { total: 0, active: 0, inactive: 0 },
      subjects: { total: 0, active: 0, inactive: 0 },
    };

    // Students: total, active (is_active = true), inactive (is_active = false)
    try {
      const studentsCount = await query(`
        SELECT
          COUNT(*)::int as total,
          COUNT(*) FILTER (WHERE is_active = true)::int as active,
          COUNT(*) FILTER (WHERE is_active = false)::int as inactive
        FROM students
      `);
      if (studentsCount.rows[0]) {
        stats.students.total = parseInt(studentsCount.rows[0].total, 10) || 0;
        stats.students.active = parseInt(studentsCount.rows[0].active, 10) || 0;
        stats.students.inactive = parseInt(studentsCount.rows[0].inactive, 10) || 0;
      }
    } catch (e) {
      console.warn('Dashboard: students count failed', e.message);
    }

    // Teachers: from teachers table joined with staff; active = status 'Active' and staff is_active
    try {
      const teachersTotal = await query(`
        SELECT COUNT(*)::int as total FROM teachers
      `);
      stats.teachers.total = parseInt(teachersTotal.rows[0]?.total, 10) || 0;

      const teachersActive = await query(`
        SELECT COUNT(*)::int as active
        FROM teachers t
        INNER JOIN staff s ON t.staff_id = s.id
        WHERE t.status = 'Active' AND s.is_active = true
      `);
      stats.teachers.active = parseInt(teachersActive.rows[0]?.active, 10) || 0;
      stats.teachers.inactive = Math.max(0, stats.teachers.total - stats.teachers.active);
    } catch (e) {
      console.warn('Dashboard: teachers count failed', e.message);
    }

    // Staff: total, active, inactive
    try {
      const staffCount = await query(`
        SELECT
          COUNT(*)::int as total,
          COUNT(*) FILTER (WHERE is_active = true)::int as active,
          COUNT(*) FILTER (WHERE is_active = false)::int as inactive
        FROM staff
      `);
      if (staffCount.rows[0]) {
        stats.staff.total = parseInt(staffCount.rows[0].total, 10) || 0;
        stats.staff.active = parseInt(staffCount.rows[0].active, 10) || 0;
        stats.staff.inactive = parseInt(staffCount.rows[0].inactive, 10) || 0;
      }
    } catch (e) {
      console.warn('Dashboard: staff count failed', e.message);
    }

    // Subjects: total, active, inactive
    try {
      const subjectsCount = await query(`
        SELECT
          COUNT(*)::int as total,
          COUNT(*) FILTER (WHERE is_active = true)::int as active,
          COUNT(*) FILTER (WHERE is_active = false)::int as inactive
        FROM subjects
      `);
      if (subjectsCount.rows[0]) {
        stats.subjects.total = parseInt(subjectsCount.rows[0].total, 10) || 0;
        stats.subjects.active = parseInt(subjectsCount.rows[0].active, 10) || 0;
        stats.subjects.inactive = parseInt(subjectsCount.rows[0].inactive, 10) || 0;
      }
    } catch (e) {
      console.warn('Dashboard: subjects count failed', e.message);
    }

    res.status(200).json({
      status: 'SUCCESS',
      message: 'Dashboard stats fetched successfully',
      data: stats,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to fetch dashboard stats',
    });
  }
};

module.exports = {
  getDashboardStats,
};
