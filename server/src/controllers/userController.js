const { query } = require('../config/database');

// Get all users
const getAllUsers = async (req, res) => {
  try {
    // Use exact table name: users (plural)
    // JOIN with classes and sections if user is a student
    const result = await query(`
      SELECT 
        u.*,
        c.class_name,
        sec.section_name
      FROM users u
      LEFT JOIN students s ON u.id = s.user_id
      LEFT JOIN classes c ON s.class_id = c.id
      LEFT JOIN sections sec ON s.section_id = sec.id
      WHERE u.is_active = true
      ORDER BY u.id ASC
    `);

    res.status(200).json({
      status: 'SUCCESS',
      message: 'Users fetched successfully',
      data: result.rows,
      count: result.rows.length,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to fetch users',
    });
  }
};

// Get user by ID
// Returns user data with name and role based on user type (admin/teacher/student)
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    // Use exact table name: users (plural)
    // JOIN with students, staff, and user_roles to get full user info
    // Students: users.id = students.user_id
    // Staff/Teachers: users.id = staff.user_id (or check teachers → staff relationship)
    const result = await query(
      `
      SELECT 
        u.*,
        -- Student info
        s.first_name AS student_first_name,
        s.last_name AS student_last_name,
        c.class_name,
        sec.section_name,
        -- Staff/Teacher info
        st.first_name AS staff_first_name,
        st.last_name AS staff_last_name,
        d.designation_name,
        -- User role
        ur.role_name
      FROM users u
      LEFT JOIN students s ON u.id = s.user_id
      LEFT JOIN classes c ON s.class_id = c.id
      LEFT JOIN sections sec ON s.section_id = sec.id
      LEFT JOIN staff st ON u.id = st.user_id
      LEFT JOIN designations d ON st.designation_id = d.id
      LEFT JOIN user_roles ur ON u.user_role_id = ur.id
      WHERE u.id = $1 AND u.is_active = true
    `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'ERROR',
        message: 'User not found',
      });
    }

    const user = result.rows[0];
    
    // Determine user name and role based on available data
    let displayName = '';
    let displayRole = '';
    
    // If student data exists, use student name
    if (user.student_first_name || user.student_last_name) {
      displayName = `${user.student_first_name || ''} ${user.student_last_name || ''}`.trim();
      displayRole = 'Student';
    }
    // If staff/teacher data exists, use staff name
    else if (user.staff_first_name || user.staff_last_name) {
      displayName = `${user.staff_first_name || ''} ${user.staff_last_name || ''}`.trim();
      displayRole = user.designation_name || 'Teacher';
    }
    // Otherwise use user table name
    else {
      displayName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username || 'User';
      displayRole = user.role_name || 'Admin';
    }

    // Add computed fields
    const userData = {
      ...user,
      display_name: displayName,
      display_role: displayRole,
    };

    res.status(200).json({
      status: 'SUCCESS',
      message: 'User fetched successfully',
      data: userData,
    });
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to fetch user',
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
};
