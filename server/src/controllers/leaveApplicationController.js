const { query } = require('../config/database');

// Get leave applications for dashboard (e.g. pending or recent).
// Applicants: students use student_id → students; staff use staff_id → staff + designations.
// leave_types gives the type name.
const getLeaveApplications = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 50);

    const result = await query(
      `
      SELECT
        la.*,
        lt.leave_type AS leave_type_name,
        COALESCE(s.first_name, st.first_name) AS applicant_first_name,
        COALESCE(s.last_name, st.last_name) AS applicant_last_name,
        COALESCE(s.photo_url, st.photo_url) AS applicant_photo_url,
        COALESCE(d.designation_name, 'Student') AS applicant_role
      FROM leave_applications la
      LEFT JOIN leave_types lt ON la.leave_type_id = lt.id
      LEFT JOIN staff s ON la.staff_id = s.id
      LEFT JOIN designations d ON s.designation_id = d.id
      LEFT JOIN students st ON la.student_id = st.id
      ORDER BY la.start_date DESC NULLS LAST
      LIMIT $1
      `,
      [limit]
    );

    res.status(200).json({
      status: 'SUCCESS',
      message: 'Leave applications fetched successfully',
      data: result.rows,
      count: result.rows.length,
    });
  } catch (error) {
    console.error('Error fetching leave applications:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to fetch leave applications',
    });
  }
};

module.exports = {
  getLeaveApplications,
};
