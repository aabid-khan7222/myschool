const { query } = require('../config/database');

// Get all designations
const getAllDesignations = async (req, res) => {
  try {
    // Use exact table name: designations (plural)
    const result = await query(`
      SELECT *
      FROM designations
      WHERE is_active = true
      ORDER BY id ASC
    `);

    res.status(200).json({
      status: 'SUCCESS',
      message: 'Designations fetched successfully',
      data: result.rows,
      count: result.rows.length,
    });
  } catch (error) {
    console.error('Error fetching designations:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to fetch designations',
    });
  }
};

// Get designation by ID
const getDesignationById = async (req, res) => {
  try {
    const { id } = req.params;
    // Use exact table name: designations (plural)
    const result = await query(
      `
      SELECT *
      FROM designations
      WHERE id = $1 AND is_active = true
    `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'ERROR',
        message: 'Designation not found',
      });
    }

    res.status(200).json({
      status: 'SUCCESS',
      message: 'Designation fetched successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error fetching designation by ID:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to fetch designation',
    });
  }
};

module.exports = {
  getAllDesignations,
  getDesignationById,
};
