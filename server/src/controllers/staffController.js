const { query } = require('../config/database');

// Get all staff members
const getAllStaff = async (req, res) => {
  try {
    // JOIN with departments and designations tables to get names
    const result = await query(`
      SELECT 
        s.*,
        d.department_name as department_name,
        d.department_name as department,
        des.designation_name as designation_name,
        des.designation_name as designation
      FROM staff s
      LEFT JOIN departments d ON s.department_id = d.id
      LEFT JOIN designations des ON s.designation_id = des.id
      WHERE s.is_active = true
      ORDER BY s.first_name ASC, s.last_name ASC
    `);

    res.status(200).json({
      status: 'SUCCESS',
      message: 'Staff fetched successfully',
      data: result.rows,
      count: result.rows.length,
    });
  } catch (error) {
    console.error('Error fetching staff:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to fetch staff',
    });
  }
};

// Get single staff member by ID
const getStaffById = async (req, res) => {
  try {
    const { id } = req.params;

    // JOIN with departments and designations tables to get names
    const result = await query(
      `
      SELECT 
        s.*,
        d.department_name as department_name,
        d.department_name as department,
        des.designation_name as designation_name,
        des.designation_name as designation
      FROM staff s
      LEFT JOIN departments d ON s.department_id = d.id
      LEFT JOIN designations des ON s.designation_id = des.id
      WHERE s.id = $1 AND s.is_active = true
    `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'ERROR',
        message: 'Staff not found',
      });
    }

    res.status(200).json({
      status: 'SUCCESS',
      message: 'Staff fetched successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error fetching staff by ID:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to fetch staff',
    });
  }
};

module.exports = {
  getAllStaff,
  getStaffById,
};

