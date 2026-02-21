const { query } = require('../config/database');

// Get leave applications for the current user (student or staff/teacher by user_id from JWT).
// Used on Student Dashboard (student leaves) and Teacher Dashboard (staff leaves).
const getMyLeaveApplications = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        status: 'ERROR',
        message: 'Not authenticated'
      });
    }
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 50);

    // First try student leaves
    let result = await query(
      `
      SELECT
        la.*,
        lt.leave_type AS leave_type_name,
        st.first_name AS applicant_first_name,
        st.last_name AS applicant_last_name,
        st.photo_url AS applicant_photo_url,
        'Student' AS applicant_role
      FROM leave_applications la
      INNER JOIN students st ON la.student_id = st.id AND st.user_id = $1
      LEFT JOIN leave_types lt ON la.leave_type_id = lt.id
      WHERE la.student_id IS NOT NULL
      ORDER BY la.start_date DESC NULLS LAST
      LIMIT $2
      `,
      [userId, limit]
    );

    // If no student leaves, try staff/teacher leaves
    if (result.rows.length === 0) {
      result = await query(
        `
        SELECT
          la.*,
          lt.leave_type AS leave_type_name,
          s.first_name AS applicant_first_name,
          s.last_name AS applicant_last_name,
          s.photo_url AS applicant_photo_url,
          COALESCE(d.designation_name, 'Teacher') AS applicant_role
        FROM leave_applications la
        INNER JOIN staff s ON la.staff_id = s.id AND s.user_id = $1
        LEFT JOIN leave_types lt ON la.leave_type_id = lt.id
        LEFT JOIN designations d ON s.designation_id = d.id
        WHERE la.staff_id IS NOT NULL
        ORDER BY la.start_date DESC NULLS LAST
        LIMIT $2
        `,
        [userId, limit]
      );
    }

    res.status(200).json({
      status: 'SUCCESS',
      message: 'Leave applications fetched successfully',
      data: result.rows,
      count: result.rows.length,
    });
  } catch (error) {
    console.error('Error fetching my leave applications:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to fetch leave applications',
    });
  }
};

// Get leave applications for parent's children (students linked via parents table).
// Used on Parent Dashboard - parent matched by user email/phone against father/mother email/phone.
const getParentChildrenLeaves = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        status: 'ERROR',
        message: 'Not authenticated'
      });
    }
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 50);

    const userResult = await query(
      'SELECT email, phone FROM users WHERE id = $1 AND is_active = true',
      [userId]
    );
    if (userResult.rows.length === 0) {
      return res.status(200).json({ status: 'SUCCESS', message: 'Leave applications fetched successfully', data: [], count: 0 });
    }
    const user = userResult.rows[0];
    const userEmail = (user.email || '').toString().trim();
    const userPhone = (user.phone || '').toString().trim();

    const parentResult = await query(
      `SELECT student_id FROM parents
       WHERE (LOWER(TRIM(father_email)) = LOWER($1) AND $1 != '')
          OR (LOWER(TRIM(mother_email)) = LOWER($1) AND $1 != '')
          OR (TRIM(father_phone) = $2 AND $2 != '')
          OR (TRIM(mother_phone) = $2 AND $2 != '')`,
      [userEmail, userPhone]
    );
    const studentIds = [...new Set(parentResult.rows.map(r => r.student_id).filter(Boolean))];
    if (studentIds.length === 0) {
      return res.status(200).json({ status: 'SUCCESS', message: 'Leave applications fetched successfully', data: [], count: 0 });
    }

    const placeholders = studentIds.map((_, i) => `$${i + 2}`).join(', ');
    const result = await query(
      `SELECT
        la.*,
        lt.leave_type AS leave_type_name,
        st.first_name AS applicant_first_name,
        st.last_name AS applicant_last_name,
        st.photo_url AS applicant_photo_url,
        st.id AS student_id,
        'Student' AS applicant_role
       FROM leave_applications la
       INNER JOIN students st ON la.student_id = st.id
       LEFT JOIN leave_types lt ON la.leave_type_id = lt.id
       WHERE la.student_id IN (${placeholders})
       ORDER BY la.start_date DESC NULLS LAST
       LIMIT $${studentIds.length + 1}`,
      [...studentIds, limit]
    );

    res.status(200).json({
      status: 'SUCCESS',
      message: 'Leave applications fetched successfully',
      data: result.rows,
      count: result.rows.length,
    });
  } catch (error) {
    console.error('Error fetching parent children leaves:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to fetch leave applications',
    });
  }
};

// Get leave applications for guardian's wards (students linked to this guardian).
// Used on Guardian Dashboard - guardian matched by user email/phone.
const getGuardianWardLeaves = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        status: 'ERROR',
        message: 'Not authenticated'
      });
    }
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 50);

    const userResult = await query(
      'SELECT email, phone FROM users WHERE id = $1 AND is_active = true',
      [userId]
    );
    if (userResult.rows.length === 0) {
      return res.status(200).json({ status: 'SUCCESS', message: 'Leave applications fetched successfully', data: [], count: 0 });
    }
    const user = userResult.rows[0];
    const userEmail = (user.email || '').toString().trim();
    const userPhone = (user.phone || '').toString().trim();

    const guardianResult = await query(
      `SELECT student_id FROM guardians
       WHERE (LOWER(TRIM(email)) = LOWER($1) AND $1 != '')
          OR (TRIM(phone) = $2 AND $2 != '')`,
      [userEmail, userPhone]
    );
    const studentIds = guardianResult.rows.map(r => r.student_id).filter(Boolean);
    if (studentIds.length === 0) {
      return res.status(200).json({ status: 'SUCCESS', message: 'Leave applications fetched successfully', data: [], count: 0 });
    }

    const placeholders = studentIds.map((_, i) => `$${i + 2}`).join(', ');
    const result = await query(
      `SELECT
        la.*,
        lt.leave_type AS leave_type_name,
        st.first_name AS applicant_first_name,
        st.last_name AS applicant_last_name,
        st.photo_url AS applicant_photo_url,
        st.id AS student_id,
        'Student' AS applicant_role
       FROM leave_applications la
       INNER JOIN students st ON la.student_id = st.id
       LEFT JOIN leave_types lt ON la.leave_type_id = lt.id
       WHERE la.student_id IN (${placeholders})
       ORDER BY la.start_date DESC NULLS LAST
       LIMIT $${studentIds.length + 1}`,
      [...studentIds, limit]
    );

    res.status(200).json({
      status: 'SUCCESS',
      message: 'Leave applications fetched successfully',
      data: result.rows,
      count: result.rows.length,
    });
  } catch (error) {
    console.error('Error fetching guardian ward leaves:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to fetch leave applications',
    });
  }
};

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
  getMyLeaveApplications,
  getParentChildrenLeaves,
  getGuardianWardLeaves,
};
