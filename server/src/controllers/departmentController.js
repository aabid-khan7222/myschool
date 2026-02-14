const { query } = require('../config/database');

// Get all departments
const getAllDepartments = async (req, res) => {
  try {
    // Use exact table name: departments (plural)
    const result = await query(`
      SELECT *
      FROM departments
      WHERE is_active = true
      ORDER BY id ASC
    `);

    res.status(200).json({
      status: 'SUCCESS',
      message: 'Departments fetched successfully',
      data: result.rows,
      count: result.rows.length,
    });
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to fetch departments',
    });
  }
};

// Get department by ID
const getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;
    // Use exact table name: departments (plural)
    const result = await query(
      `
      SELECT *
      FROM departments
      WHERE id = $1 AND is_active = true
    `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'ERROR',
        message: 'Department not found',
      });
    }

    res.status(200).json({
      status: 'SUCCESS',
      message: 'Department fetched successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error fetching department by ID:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to fetch department',
    });
  }
};

module.exports = {
  getAllDepartments,
  getDepartmentById,
};
