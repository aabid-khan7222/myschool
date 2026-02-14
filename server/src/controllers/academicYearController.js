const { query } = require('../config/database');

// Get all academic years for dropdown
const getAllAcademicYears = async (req, res) => {
  try {
    const result = await query('SELECT * FROM academic_years WHERE is_active = true ORDER BY id');
    
    res.status(200).json({
      status: 'SUCCESS',
      message: 'Academic years fetched successfully',
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching academic years:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to fetch academic years',
    });
  }
};

// Get academic year by ID
const getAcademicYearById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await query('SELECT * FROM academic_years WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'ERROR',
        message: 'Academic year not found'
      });
    }
    
    res.status(200).json({
      status: 'SUCCESS',
      message: 'Academic year fetched successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching academic year:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to fetch academic year',
    });
  }
};

module.exports = {
  getAllAcademicYears,
  getAcademicYearById
};
