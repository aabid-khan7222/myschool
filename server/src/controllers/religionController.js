const { query } = require('../config/database');

// Get all religions
const getAllReligions = async (req, res) => {
  try {
    const result = await query(`
      SELECT
        r.id,
        r.religion_name,
        r.description,
        r.is_active,
        r.created_at
      FROM religions r
      WHERE r.is_active = true
      ORDER BY r.religion_name ASC
    `);
    
    res.status(200).json({
      status: 'SUCCESS',
      message: 'Religions fetched successfully',
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching religions:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to fetch religions',
    });
  }
};

// Get religion by ID
const getReligionById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await query(`
      SELECT
        r.id,
        r.religion_name,
        r.description,
        r.is_active,
        r.created_at
      FROM religions r
      WHERE r.id = $1 AND r.is_active = true
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'ERROR',
        message: 'Religion not found'
      });
    }
    
    res.status(200).json({
      status: 'SUCCESS',
      message: 'Religion fetched successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching religion:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to fetch religion',
    });
  }
};

module.exports = {
  getAllReligions,
  getReligionById
};
